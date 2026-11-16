// Theme Manager (Dark / Light Mode with View Transitions & System Preference)
export class ThemeManager {
    constructor(bus) {
        this.bus = bus;
        this.themeToggleBtn = null;
        this.themeToggleDesktopBtn = null;
    }

    init() {
        const abortController = new AbortController();
        const { signal } = abortController;

        this.themeToggleBtn = document.getElementById('theme-toggle');
        this.themeToggleDesktopBtn = document.getElementById('theme-toggle-desktop');

        this.syncInitialTheme();

        const handleToggle = () => this.toggleTheme();

        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', handleToggle, { signal });
        }
        if (this.themeToggleDesktopBtn) {
            this.themeToggleDesktopBtn.addEventListener('click', handleToggle, { signal });
        }

        // Listener reactivo al cambio de tema del sistema operativo / navegador
        if (typeof window !== 'undefined' && window.matchMedia) {
            const systemThemeMedia = window.matchMedia('(prefers-color-scheme: light)');
            const handleSystemThemeChange = (e) => {
                let savedTheme = null;
                try {
                    savedTheme = localStorage.getItem('theme');
                } catch {
                    savedTheme = null;
                }
                // Si el usuario no ha fijado una preferencia manual en localStorage, seguir dinámicamente al sistema
                if (!savedTheme) {
                    const html = document.documentElement;
                    html.classList.toggle('light-mode', e.matches);
                    this.updateThemeIcons(e.matches);
                    if (this.bus) {
                        this.bus.dispatchEvent(new CustomEvent('theme:changed', {
                            detail: { theme: e.matches ? 'light' : 'dark' }
                        }));
                    }
                }
            };

            if (systemThemeMedia.addEventListener) {
                systemThemeMedia.addEventListener('change', handleSystemThemeChange, { signal });
            } else if (systemThemeMedia.addListener) {
                systemThemeMedia.addListener(handleSystemThemeChange);
            }
        }

        if (this.bus) {
            this.bus.addEventListener('theme:set', (e) => {
                const targetTheme = e.detail?.theme;
                if (targetTheme === 'light' || targetTheme === 'dark') {
                    this.setTheme(targetTheme);
                }
            }, { signal });

            this.bus.addEventListener('theme:reset', () => {
                try {
                    localStorage.removeItem('theme');
                } catch {
                    // Ignore storage errors
                }
                const html = document.documentElement;
                const isSystemLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
                html.classList.toggle('light-mode', isSystemLight);
                this.updateThemeIcons(isSystemLight);
            }, { signal });
        }
    }

    setTheme(targetTheme) {
        const html = document.documentElement;
        const isCurrentlyLight = html.classList.contains('light-mode');
        const shouldBeLight = targetTheme === 'light';
        if (isCurrentlyLight === shouldBeLight) return;
        this.toggleTheme();
    }

    syncInitialTheme() {
        let savedTheme = null;
        try {
            savedTheme = localStorage.getItem('theme');
        } catch {
            savedTheme = null;
        }

        const html = document.documentElement;
        if (savedTheme === 'light') {
            html.classList.add('light-mode');
        } else if (savedTheme === 'dark') {
            html.classList.remove('light-mode');
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            html.classList.add('light-mode');
        }

        this.updateThemeIcons(html.classList.contains('light-mode'));
    }

    toggleTheme() {
        const html = document.documentElement;
        const prefersReducedMotion =
            window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
            html.classList.contains('reduce-motion');

        const applyChange = () => {
            const isLight = html.classList.toggle('light-mode');
            try {
                localStorage.setItem('theme', isLight ? 'light' : 'dark');
            } catch {
                // Ignore storage errors
            }
            this.updateThemeIcons(isLight);
            if (this.bus) {
                this.bus.dispatchEvent(new CustomEvent('theme:changed', {
                    detail: { theme: isLight ? 'light' : 'dark' }
                }));
            }
        };

        if (document.startViewTransition && !prefersReducedMotion) {
            document.startViewTransition(applyChange);
        } else {
            applyChange();
        }
    }

    updateThemeIcons(isLight) {
        const sunMobile = document.getElementById('theme-icon-sun');
        const moonMobile = document.getElementById('theme-icon-moon');
        const sunDesktop = document.getElementById('theme-icon-sun-desktop');
        const moonDesktop = document.getElementById('theme-icon-moon-desktop');

        if (sunMobile && moonMobile) {
            sunMobile.classList.toggle('hidden', isLight);
            moonMobile.classList.toggle('hidden', !isLight);
        }

        // Interruptor deslizable en desktop (sol y luna coexisten en la pista)
        if (sunDesktop && moonDesktop) {
            sunDesktop.classList.remove('hidden');
            moonDesktop.classList.remove('hidden');
            sunDesktop.style.opacity = isLight ? '1' : '0.35';
            moonDesktop.style.opacity = isLight ? '0.35' : '1';
        }

        const label = isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro';
        if (this.themeToggleBtn) {
            this.themeToggleBtn.setAttribute('aria-label', label);
            this.themeToggleBtn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
        }

        if (this.themeToggleDesktopBtn) {
            this.themeToggleDesktopBtn.setAttribute('aria-label', label);
            this.themeToggleDesktopBtn.setAttribute('aria-checked', isLight ? 'true' : 'false');
            this.themeToggleDesktopBtn.classList.toggle('theme-switch-checked', isLight);

            const thumb = this.themeToggleDesktopBtn.querySelector('.theme-switch-thumb');
            if (thumb) {
                if (isLight) {
                    thumb.classList.remove('translate-x-1');
                    thumb.classList.add('translate-x-7');
                } else {
                    thumb.classList.remove('translate-x-7');
                    thumb.classList.add('translate-x-1');
                }
            }
        }

        const themeIndicator = document.getElementById('theme-mode-indicator');
        if (themeIndicator) {
            themeIndicator.textContent = isLight ? 'Claro' : 'Oscuro';
            if (isLight) {
                themeIndicator.className = 'text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30 font-semibold uppercase';
            } else {
                themeIndicator.className = 'text-[10px] font-mono px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/30 font-semibold uppercase';
            }
        }
    }
}
