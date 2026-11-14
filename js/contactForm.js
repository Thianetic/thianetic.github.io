// Direct Email Composer & GDPR Modal Manager (Zero Third-Party Interception & Clipboard Backup)
import { CONTACT_EMAIL } from './config.js';
import { validateContactField, formatDirectMailContent } from './utils.js';

export class ContactFormManager {
    constructor(bus) {
        this.bus = bus;
        this.contactModal = null;
        this.gdprModal = null;
        this.form = null;
        this.statusMessage = null;
        this.copyBtn = null;
        this.lastFormattedMessage = '';
    }

    init() {
        const abortController = new AbortController();
        const { signal } = abortController;

        this.contactModal = document.getElementById('contact-modal');
        this.gdprModal = document.getElementById('gdpr-modal');
        this.form = document.getElementById('contact-form');
        this.statusMessage = document.getElementById('form-status');
        this.copyBtn = document.getElementById('copy-message-btn');

        this.setupModals(signal);
        this.setupFormValidation(signal);
    }

    setupModals(signal) {
        const supportsCommand = 'commandForElement' in HTMLButtonElement.prototype;

        const contactTriggerBtns = document.querySelectorAll(
            '#contact-btn-hero, #contact-btn-section, [commandfor="contact-modal"][command="show-modal"]'
        );
        contactTriggerBtns.forEach((btn) => {
            if (!supportsCommand || !btn.hasAttribute('commandfor')) {
                btn.addEventListener('click', () => {
                    this.openContactModal();
                }, { signal });
            }
        });

        if (this.contactModal) {
            const closeBtns = this.contactModal.querySelectorAll('#close-contact-modal, #cancel-contact');
            closeBtns.forEach((btn) => {
                btn.addEventListener('click', () => {
                    this.contactModal.close();
                }, { signal });
            });

            this.contactModal.addEventListener('click', (e) => {
                if (e.target === this.contactModal) {
                    this.contactModal.close();
                }
            }, { signal });
        }

        const gdprTriggerBtn = document.getElementById('gdpr-terms-link');
        if (gdprTriggerBtn) {
            gdprTriggerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.gdprModal && !this.gdprModal.open) {
                    this.gdprModal.showModal();
                }
            }, { signal });
        }

        if (this.gdprModal) {
            const closeGdprBtn = document.getElementById('close-gdpr-modal');
            if (closeGdprBtn) {
                closeGdprBtn.addEventListener('click', () => {
                    this.gdprModal.close();
                }, { signal });
            }

            const acceptBtn = document.getElementById('accept-gdpr');
            if (acceptBtn) {
                acceptBtn.addEventListener('click', () => {
                    const consentCheckbox = document.getElementById('gdpr-consent');
                    if (consentCheckbox) {
                        consentCheckbox.checked = true;
                        this.clearFieldError('gdpr-consent');
                    }
                    this.gdprModal.close();
                }, { signal });
            }

            this.gdprModal.addEventListener('click', (e) => {
                if (e.target === this.gdprModal) {
                    this.gdprModal.close();
                }
            }, { signal });
        }

        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', () => {
                this.copyMessageToClipboard();
            }, { signal });
        }

        if (this.bus) {
            this.bus.addEventListener('contact:open', () => {
                this.openContactModal();
            }, { signal });
        }
    }

    openContactModal() {
        if (this.contactModal && !this.contactModal.open) {
            this.contactModal.showModal();
        }
    }

    setupFormValidation(signal) {
        if (!this.form) return;

        const fields = ['name', 'email', 'subject', 'message', 'gdpr-consent'];
        fields.forEach((fieldName) => {
            const el = this.form.elements[fieldName] || document.getElementById(fieldName);
            if (!el) return;

            const eventType = el.type === 'checkbox' || el.tagName === 'SELECT' ? 'change' : 'blur';
            el.addEventListener(eventType, () => {
                const result = validateContactField(fieldName, el.value, Boolean(el.checked));
                if (!result.isValid) {
                    this.showFieldError(fieldName, result.errorMessage);
                } else {
                    this.clearFieldError(fieldName);
                }
            }, { signal });
        });

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        }, { signal });
    }

    showFieldError(fieldName, message) {
        const input = this.form.elements[fieldName] || document.getElementById(fieldName);
        const errorId = `${fieldName}-error`;
        let errorEl = document.getElementById(errorId);

        if (input) {
            input.setAttribute('aria-invalid', 'true');
            input.setAttribute('aria-describedby', errorId);
        }

        if (!errorEl && input && input.parentElement) {
            errorEl = document.createElement('p');
            errorEl.id = errorId;
            errorEl.className = 'text-red-400 text-xs mt-1.5 font-mono';
            errorEl.setAttribute('role', 'alert');
            input.parentElement.appendChild(errorEl);
        }

        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        }
    }

    clearFieldError(fieldName) {
        const input = this.form.elements[fieldName] || document.getElementById(fieldName);
        const errorId = `${fieldName}-error`;
        const errorEl = document.getElementById(errorId);

        if (input) {
            input.setAttribute('aria-invalid', 'false');
        }
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.add('hidden');
        }
    }

    validateAllFields() {
        const fields = ['name', 'email', 'subject', 'message', 'gdpr-consent'];
        let firstInvalidEl = null;

        fields.forEach((fieldName) => {
            const el = this.form.elements[fieldName] || document.getElementById(fieldName);
            if (!el) return;
            const result = validateContactField(fieldName, el.value, Boolean(el.checked));

            if (!result.isValid) {
                this.showFieldError(fieldName, result.errorMessage);
                if (!firstInvalidEl) {
                    firstInvalidEl = el;
                }
            } else {
                this.clearFieldError(fieldName);
            }
        });

        if (firstInvalidEl) {
            firstInvalidEl.focus();
            return false;
        }
        return true;
    }

    handleSubmit() {
        if (!this.validateAllFields()) return;

        const name = this.form.elements.name.value.trim();
        const email = this.form.elements.email.value.trim();
        const subject = this.form.elements.subject.value.trim();
        const message = this.form.elements.message.value.trim();

        const { subjectLine, bodyText, mailtoUrl } = formatDirectMailContent({
            name,
            email,
            subject,
            message,
            recipient: CONTACT_EMAIL
        });

        this.lastFormattedMessage = `Para: ${CONTACT_EMAIL}\nAsunto: ${subjectLine}\n\n${bodyText}`;

        // 1. Mostrar aviso sin borrar los campos del formulario
        this.renderStatus('Abriendo tu cliente de correo...', 'info');

        // 2. Mostrar el botón secundario para copiar el texto manualmente si el usuario usa webmail
        if (this.copyBtn) {
            this.copyBtn.classList.remove('hidden');
        }

        // 3. Abrir el enlace mailto: con los datos pre-rellenados
        window.location.href = mailtoUrl;
    }

    async copyMessageToClipboard() {
        const name = this.form?.elements?.name?.value?.trim() || '';
        const email = this.form?.elements?.email?.value?.trim() || '';
        const subject = this.form?.elements?.subject?.value?.trim() || 'Contacto';
        const message = this.form?.elements?.message?.value?.trim() || '';

        const textToCopy = this.lastFormattedMessage || (
            message
                ? `Para: ${CONTACT_EMAIL}\nDe: ${name} <${email}>\nAsunto: ${subject}\n\n${message}`
                : `Para: ${CONTACT_EMAIL}`
        );

        try {
            if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                await navigator.clipboard.writeText(textToCopy);
                this.renderStatus(
                    `¡Texto copiado al portapapeles! Puedes pegarlo directamente en tu cliente de correo para ${CONTACT_EMAIL}.`,
                    'success'
                );
            }
        } catch {
            this.renderStatus(
                `No se pudo acceder al portapapeles automáticamente. Escribe directamente a ${CONTACT_EMAIL}.`,
                'info'
            );
        }
    }

    renderStatus(text, type = 'info') {
        if (!this.statusMessage && this.form) {
            this.statusMessage = document.createElement('div');
            this.statusMessage.id = 'form-status';
            this.statusMessage.setAttribute('role', 'status');
            this.statusMessage.setAttribute('aria-live', 'polite');
            this.form.appendChild(this.statusMessage);
        }
        if (!this.statusMessage) return;

        this.statusMessage.textContent = text;
        this.statusMessage.className = 'mt-4 p-3 rounded-lg text-xs font-mono text-center ';

        if (type === 'success') {
            this.statusMessage.className += 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
        } else if (type === 'error') {
            this.statusMessage.className += 'bg-red-500/15 text-red-400 border border-red-500/30';
        } else {
            this.statusMessage.className += 'bg-accent/15 text-accent border border-accent/30';
        }

        this.statusMessage.classList.remove('hidden');
    }
}
