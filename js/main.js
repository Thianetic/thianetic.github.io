// ===== ARCHIVO PRINCIPAL =====

// Importar módulos
import { ParticleSystem } from './particles.js';
import { AccessibilityManager } from './accessibility.js';
import { ProjectFilter } from './projectFilter.js';
import { TechBubbles } from './techBubbles.js';
import { ThemeManager } from './theme.js';
import { NavigationManager } from './navigation.js';
import { LoadingScreen } from './loading.js';
import { CursorManager } from './cursor.js';
import { AnimationManager } from './animations.js';
import { ProjectModal } from './projectModal.js';
import { ContactForm } from './contactForm.js';

class PortfolioApp {
    constructor() {
        this.modules = {};
        this.init();
    }
    
    async init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        // Inicializar módulos básicos primero
        this.initializeBasicModules();
        
        // Esperar a que termine la pantalla de carga
        window.addEventListener('loadingComplete', () => {
            this.initializeAdvancedModules();
        });
        
        // Configuraciones adicionales
        this.setupAdditionalFeatures();
    }
    
    initializeBasicModules() {
        // Módulos que se inicializan inmediatamente
        this.modules.loading = new LoadingScreen();
        this.modules.cursor = new CursorManager();
        this.modules.theme = new ThemeManager();
        this.modules.accessibility = new AccessibilityManager();
        this.modules.animations = new AnimationManager();
        
        // Inicializar partículas inmediatamente para que el fondo esté visible
        const canvas = document.getElementById('background-canvas');
        if (canvas) {
            try {
                this.modules.particles = new ParticleSystem(canvas);
            } catch (e) {
                console.error('Error initializing particles:', e);
            }
        }
    }
    
    initializeAdvancedModules() {
        // Módulos que se inicializan después de la carga
        this.modules.navigation = new NavigationManager();
        this.modules.projectFilter = new ProjectFilter();
        this.modules.techBubbles = new TechBubbles();
        this.modules.projectModal = new ProjectModal();
        this.modules.contactForm = new ContactForm();
        
        // Hacer el cursor manager disponible globalmente para los modales
        window.cursorManager = this.modules.cursor;
    }
    
    setupAdditionalFeatures() {
        // Año actual para el copyright
        const currentYearElement = document.getElementById('current-year');
        if (currentYearElement) {
            currentYearElement.textContent = new Date().getFullYear();
        }
        
        // Tooltips de redes sociales
        this.setupSocialTooltips();

        // --- LOADING SCREEN ---
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            const skipPrompt = document.getElementById('skip-intro-prompt');
            skipPrompt.classList.remove("hidden");
            skipPrompt.classList.add("visible", "bounce");
            skipPrompt.setAttribute("aria-hidden", "false");
            function updateSkipPromptText() {
                if (window.innerWidth <= 768) {
                    skipPrompt.textContent = '[Toca] la pantalla para continuar';
                } else {
                    skipPrompt.textContent = 'Pulsa [ESPACIO] para continuar';
                }
            }
            updateSkipPromptText();
            window.addEventListener('resize', updateSkipPromptText);
        }
    }
    
    setupSocialTooltips() {
        const socialLinks = document.querySelectorAll('#social-links a');
        const scrambleChars = '01000110100001101001011000010110111001100101011101000110100101100011';
        
        socialLinks.forEach(link => {
            const tooltip = link.querySelector('.social-tooltip');
            if (!tooltip) return;
            
            const originalText = tooltip.textContent;
            let interval;
            
            link.addEventListener('mouseover', () => {
                let i = 0;
                clearInterval(interval);
                interval = setInterval(() => {
                    tooltip.textContent = originalText.split("").map((l, idx) => 
                        (idx < i) ? originalText[idx] : scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
                    ).join("");
                    if (i >= originalText.length) clearInterval(interval);
                    i += 1/3;
                }, 30);
            });
            
            link.addEventListener('mouseleave', () => {
                clearInterval(interval);
                tooltip.textContent = originalText;
            });
        });
    }
    
    destroy() {
        // Limpiar todos los módulos
        Object.values(this.modules).forEach(module => {
            if (module && typeof module.destroy === 'function') {
                module.destroy();
            }
        });
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});

// Limpiar al salir de la página
window.addEventListener('beforeunload', () => {
    if (window.portfolioApp) {
        window.portfolioApp.destroy();
    }
}); 