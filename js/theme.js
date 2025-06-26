// ===== MÓDULO DE GESTIÓN DE TEMAS =====

export class ThemeManager {
    constructor() {
        this.themeToggles = document.querySelectorAll('#theme-toggle, #theme-toggle-desktop');
        this.sunIcons = document.querySelectorAll('#theme-icon-sun, #theme-icon-sun-desktop');
        this.moonIcons = document.querySelectorAll('#theme-icon-moon, #theme-icon-moon-desktop');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedTheme();
    }

    setupEventListeners() {
        this.themeToggles.forEach(btn => {
            btn.addEventListener('click', () => this.toggleTheme());
        });
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.applyTheme(savedTheme);
    }

    toggleTheme() {
        const docHtml = document.documentElement;
        const isCurrentlyLight = docHtml.classList.contains('light-mode');
        const newTheme = isCurrentlyLight ? 'dark' : 'light';
        
        localStorage.setItem('theme', newTheme);
        
        // Usar View Transitions API si está disponible
        if (document.startViewTransition) {
            document.startViewTransition(() => this.applyTheme(newTheme));
        } else {
            this.applyTheme(newTheme);
        }
    }

    applyTheme(theme) {
        const docHtml = document.documentElement;
        
        docHtml.classList.toggle('light-mode', theme === 'light');
        
        // Actualizar iconos
        this.sunIcons.forEach(icon => icon.classList.toggle('hidden', theme === 'light'));
        this.moonIcons.forEach(icon => icon.classList.toggle('hidden', theme === 'dark'));
    }

    // Método para obtener el tema actual
    getCurrentTheme() {
        return document.documentElement.classList.contains('light-mode') ? 'light' : 'dark';
    }

    // Método para establecer tema específico
    setTheme(theme) {
        localStorage.setItem('theme', theme);
        this.applyTheme(theme);
    }
} 