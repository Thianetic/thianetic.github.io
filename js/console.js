// Cyber-OS Interactive CLI Console Manager (Easter Egg & Power-User Navigation)
import { APP_VERSION, PROFILE_INFO, PROJECT_CATALOG } from './config.js';

/**
 * Pure parser for CLI commands (splits by whitespace and normalizes command token)
 * @param {string} rawInput
 * @returns {{ cmd: string, args: string[], raw: string }}
 */
export function parseCliCommand(rawInput) {
    const trimmed = String(rawInput || '').trim();
    if (!trimmed) {
        return { cmd: '', args: [], raw: '' };
    }
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    return { cmd, args, raw: trimmed };
}

export class ConsoleManager {
    constructor(bus) {
        this.bus = bus;
        this.modal = null;
        this.output = null;
        this.input = null;
        this.inputMirror = null;
        this.history = [];
        this.historyIndex = -1;
        this.previousFocus = null;
        this.skipFocusRestore = false;
    }

    init() {
        const abortController = new AbortController();
        const { signal } = abortController;

        this.modal = document.getElementById('cli-modal');
        this.output = document.getElementById('cli-output');
        this.input = document.getElementById('cli-input');
        this.inputMirror = document.getElementById('cli-input-mirror');

        if (!this.modal || !this.output || !this.input) return;

        // Global shortcut: '/' opens CLI when focus is not inside an editable field
        document.addEventListener('keydown', (e) => {
            if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
            if (this.modal.open) return;

            const active = document.activeElement;
            const isEditable = active && (
                active.tagName === 'INPUT' ||
                active.tagName === 'TEXTAREA' ||
                active.tagName === 'SELECT' ||
                active.isContentEditable
            );
            if (isEditable) return;

            e.preventDefault();
            this.openConsole();
        }, { signal });

        // Navigation button triggers
        const triggerBtns = document.querySelectorAll('.cli-open-trigger, #cli-nav-btn');
        triggerBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openConsole();
            }, { signal });
        });

        // Bus event trigger
        if (this.bus) {
            this.bus.addEventListener('cli:open', () => {
                this.openConsole();
            }, { signal });
        }

        // Close button & backdrop click
        const closeBtn = document.getElementById('close-cli-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeConsole();
            }, { signal });
        }

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeConsole();
                return;
            }
            // Clicking inside terminal body focuses the hidden input unless selecting text
            const selection = window.getSelection ? window.getSelection().toString() : '';
            if (!selection && e.target.closest('#cli-modal-content')) {
                this.input.focus();
            }
        }, { signal });

        // Scroll lock is handled declaratively in CSS via body:has(dialog[open]) (Hallazgo #1)
        this.modal.addEventListener('close', () => {
            if (!this.skipFocusRestore) {
                if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
                    this.previousFocus.focus();
                } else {
                    document.body.focus();
                }
            }
            this.skipFocusRestore = false;
        }, { signal });

        // Input synchronization & command execution
        this.input.addEventListener('input', () => {
            this.syncMirror();
        }, { signal });

        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const raw = this.input.value;
                this.input.value = '';
                this.syncMirror();
                this.handleCommand(raw);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory(-1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory(1);
            } else if (e.key === 'l' && e.ctrlKey) {
                e.preventDefault();
                this.clearOutput();
            }
        }, { signal });

        this.printWelcomeBanner();
    }

    syncMirror() {
        if (this.inputMirror && this.input) {
            this.inputMirror.textContent = this.input.value;
        }
    }

    openConsole() {
        if (!this.modal) return;
        if (!this.modal.open) {
            this.previousFocus = document.activeElement;
            this.skipFocusRestore = false;
            this.modal.showModal();
        }
        requestAnimationFrame(() => {
            if (this.input) {
                this.input.focus();
                this.syncMirror();
            }
        });
    }

    closeConsole() {
        if (this.modal && this.modal.open) {
            this.modal.close();
        }
    }

    navigateHistory(direction) {
        if (this.history.length === 0) return;

        if (direction < 0) {
            this.historyIndex = Math.max(0, this.historyIndex - 1);
            this.input.value = this.history[this.historyIndex] || '';
        } else {
            this.historyIndex = Math.min(this.history.length, this.historyIndex + 1);
            this.input.value = this.historyIndex < this.history.length
                ? this.history[this.historyIndex]
                : '';
        }
        this.syncMirror();
    }

    printWelcomeBanner() {
        if (!this.output) return;
        this.output.innerHTML = '';
        this.appendLine(`THIANETIC SEC-CORE CLI v${APP_VERSION} [TTY1 // CYBER-OS]`, 'cli-accent');
        this.appendLine('Escribe "help" para listar los comandos disponibles o pulsa ESC para salir.', 'cli-muted');
        this.appendLine('──────────────────────────────────────────────────────────────────────────', 'cli-muted');
    }

    appendLine(text, className = 'cli-default') {
        if (!this.output) return;
        const line = document.createElement('div');
        line.className = `cli-line ${className}`;
        line.textContent = text;
        this.output.appendChild(line);
        this.scrollToBottom();
    }

    appendBlock(lines, className = 'cli-default') {
        lines.forEach((lineText) => this.appendLine(lineText, className));
    }

    clearOutput() {
        if (this.output) {
            this.output.innerHTML = '';
        }
    }

    scrollToBottom() {
        if (this.output) {
            this.output.scrollTop = this.output.scrollHeight;
        }
    }

    handleCommand(rawInput) {
        const { cmd, args, raw } = parseCliCommand(rawInput);

        this.appendLine(`guest@thianetic-core:~$ ${raw}`, 'cli-prompt-echo');

        if (!cmd) return;

        this.history.push(raw);
        this.historyIndex = this.history.length;

        switch (cmd) {
            case 'help':
                this.appendBlock([
                    'Comandos disponibles en THIANETIC SEC-CORE:',
                    '  help               Muestra esta guía de comandos',
                    '  about              Resumen ejecutivo del perfil profesional',
                    '  projects           Lista los IDs de proyectos del ecosistema',
                    '  open [id]          Abre la ficha técnica del proyecto indicado',
                    '  contact            Abre el modal de contacto directo',
                    '  theme [dark|light] Cambia el tema visual de la interfaz',
                    '  qr [telegram|web]  Renderiza el código QR de contacto o web',
                    '  clear              Limpia la pantalla de la terminal',
                    '  exit               Cierra la consola interactiva (también ESC)',
                    '  sudo               Ejecuta operación con privilegios root'
                ], 'cli-info');
                break;

            case 'about':
                this.appendBlock([
                    `[PERFIL]   ${PROFILE_INFO.name} — ${PROFILE_INFO.role}`,
                    `[ENFOQUE]  ${PROFILE_INFO.subtitle}`,
                    `[ESTADO]   ${PROFILE_INFO.status}`,
                    `[EXP]      ${PROFILE_INFO.experience}`,
                    `[FORMACIÓN] ${PROFILE_INFO.education}`,
                    `[BIO]      ${PROFILE_INFO.summary}`,
                    `[LINKS]    GitHub: ${PROFILE_INFO.github} | LinkedIn: ${PROFILE_INFO.linkedin}`
                ], 'cli-default');
                break;

            case 'projects': {
                this.appendLine('Catálogo de proyectos registrados ([id] -> título):', 'cli-accent');
                Object.entries(PROJECT_CATALOG).forEach(([id, data]) => {
                    const paddedId = id.padEnd(17, ' ');
                    this.appendLine(`  • ${paddedId} │ ${data.title}`, 'cli-default');
                });
                this.appendLine('Tip: ejecuta "open [id]" (ej: open kronopulse) para inspeccionar el proyecto.', 'cli-muted');
                break;
            }

            case 'open': {
                const targetId = (args[0] || '').toLowerCase();
                if (!targetId) {
                    this.appendLine('Error: Falta el ID del proyecto. Uso: open [id]. Ejecuta "projects" para ver los IDs.', 'cli-error');
                    break;
                }
                if (!PROJECT_CATALOG[targetId]) {
                    this.appendLine(`Error: Proyecto "${targetId}" no encontrado. Ejecuta "projects" para ver los IDs disponibles.`, 'cli-error');
                    break;
                }
                this.appendLine(`[OK] Abriendo ficha técnica de "${targetId}"...`, 'cli-accent');
                this.skipFocusRestore = true;
                this.closeConsole();
                if (this.bus) {
                    this.bus.dispatchEvent(new CustomEvent('project:open', {
                        detail: { projectId: targetId }
                    }));
                }
                break;
            }

            case 'contact':
                this.appendLine('[OK] Abriendo canal de contacto seguro...', 'cli-accent');
                this.skipFocusRestore = true;
                this.closeConsole();
                if (this.bus) {
                    this.bus.dispatchEvent(new CustomEvent('contact:open'));
                }
                break;

            case 'theme': {
                const mode = (args[0] || '').toLowerCase();
                if (mode !== 'dark' && mode !== 'light') {
                    this.appendLine('Error: Argumento inválido. Uso: theme [dark|light]', 'cli-error');
                    break;
                }
                if (this.bus) {
                    this.bus.dispatchEvent(new CustomEvent('theme:set', {
                        detail: { theme: mode }
                    }));
                }
                this.appendLine(`[OK] Tema del sistema actualizado a "${mode}".`, 'cli-accent');
                break;
            }

            case 'clear':
                this.clearOutput();
                break;

            case 'print-qr':
            case 'qr': {
                const target = (args[0] || 'telegram').toLowerCase();
                const isWeb = target === 'web' || target === 'portfolio';
                const imgSrc = isWeb ? 'img/qr_thianetic.github.io.png' : 'img/qr_thianetic_telegram.png';
                const label = isWeb ? 'Portafolio Web (thianetic.github.io)' : 'Telegram Directo (@Thianetic)';
                const linkUrl = isWeb ? 'https://thianetic.github.io/' : 'https://t.me/Thianetic';

                this.appendLine(`[SEC-CORE QR MATRIX] Generando código QR para: ${label}`, 'cli-accent');

                if (this.output) {
                    const qrContainer = document.createElement('div');
                    qrContainer.className = 'my-3 p-3 bg-white/10 rounded-lg inline-flex flex-col items-center border border-white/20';

                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.alt = `Código QR ${label}`;
                    img.width = 160;
                    img.height = 160;
                    img.className = 'w-36 h-36 bg-white p-2 rounded shadow-lg';

                    const caption = document.createElement('a');
                    caption.href = linkUrl;
                    caption.target = '_blank';
                    caption.rel = 'noopener noreferrer';
                    caption.className = 'mt-2 text-xs font-mono text-cyan-300 underline hover:text-white';
                    caption.textContent = `> Abrir ${label}`;

                    qrContainer.appendChild(img);
                    qrContainer.appendChild(caption);
                    this.output.appendChild(qrContainer);
                    this.scrollToBottom();
                }
                break;
            }

            case 'exit':
                this.closeConsole();
                break;

            case 'sudo':
                this.appendLine(
                    'sudo: Permission denied. user "guest" is not in the sudoers file. This incident will be reported to THIANETIC SEC-CORE [UFW/Fail2ban active].',
                    'cli-error'
                );
                break;

            default:
                this.appendLine(
                    `sec-core: comando no encontrado: "${cmd}". Escribe "help" para ver los comandos válidos.`,
                    'cli-error'
                );
                break;
        }
    }
}
