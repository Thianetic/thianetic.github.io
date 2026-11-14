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

        if (this.bus) {
            this.bus.addEventListener('theme:set', (e) => {
                const targetTheme = e.detail?.theme;
                if (targetTheme === 'light' || targetTheme === 'dark') {
                    this.setTheme(targetTheme);
                }
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
        if (sunDesktop && moonDesktop) {
            sunDesktop.classList.toggle('hidden', isLight);
            moonDesktop.classList.toggle('hidden', !isLight);
        }

        const label = isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro';
        if (this.themeToggleBtn) {
            this.themeToggleBtn.setAttribute('aria-label', label);
            this.themeToggleBtn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
        }
        if (this.themeToggleDesktopBtn) {
            this.themeToggleDesktopBtn.setAttribute('aria-label', label);
            this.themeToggleDesktopBtn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
        }
    }
}
