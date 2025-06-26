// ===== MÓDULO DE ACCESIBILIDAD =====

export class AccessibilityManager {
    constructor() {
        this.accessOptions = {
            contrast: { 
                max: 3, 
                labels: ['Normal', 'Alto', 'Muy Alto', 'Invertido'], 
                classes: ['contrast-1', 'contrast-2', 'contrast-3'] 
            },
            textSize: { 
                max: 3, 
                labels: ['Pequeño', 'Normal', 'Grande', 'Muy Grande'],
                values: ['14px', '16px', '18px', '20px'] 
            },
            textAlign: { 
                max: 3, 
                labels: ['Izquierda', 'Centro', 'Derecha', 'Justificado'], 
                values: ['left', 'center', 'right', 'justify'] 
            },
            font: { 
                max: 1, 
                labels: ['Normal', 'Dyslexia'],
                classes: ['dyslexia-friendly'] 
            },
            colorblind: { 
                max: 1, 
                labels: ['Normal', 'Sin Color'],
                classes: ['colorblind-friendly'] 
            },
        };

        this.accessStates = { 
            contrast: 0, 
            textSize: 1, 
            textAlign: 0, 
            links: false, 
            font: 0, 
            animations: false, 
            colorblind: 0 
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUI();
        this.applyStyles();
    }

    setupEventListeners() {
        // Botón de accesibilidad
        const accessibilityBtn = document.getElementById('accessibility-btn');
        const accessibilityMenu = document.getElementById('accessibility-menu');
        
        if (accessibilityBtn) {
            accessibilityBtn.addEventListener('click', (e) => { 
                e.stopPropagation(); 
                accessibilityMenu.classList.toggle('visible'); 
            });
        }

        // Botones de accesibilidad
        document.querySelectorAll('[data-access-action]').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.accessAction;
                this.handleAccessAction(action);
            });
        });

        // Botón de reset
        const resetBtn = document.getElementById('reset-access');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (accessibilityMenu && !accessibilityMenu.contains(e.target) && !accessibilityBtn.contains(e.target)) {
                accessibilityMenu.classList.remove('visible');
            }
        });
    }

    handleAccessAction(action) {
        if (action.startsWith('cycle-')) {
            const feature = action.replace('cycle-', '');
            this.accessStates[feature] = (this.accessStates[feature] + 1) % (this.accessOptions[feature].max + 1);
        } else if (action.startsWith('toggle-')) {
            const feature = action.replace('toggle-', '');
            this.accessStates[feature] = !this.accessStates[feature];
        }
        
        this.applyStyles();
        this.updateUI();
    }

    applyStyles() {
        const docHtml = document.documentElement;
        
        // Limpiar clases anteriores
        Object.values(this.accessOptions).forEach(opt => {
            opt.classes?.forEach(c => docHtml.classList.remove(c));
        });

        // Aplicar contrastes
        if (this.accessStates.contrast > 0) {
            docHtml.classList.add(this.accessOptions.contrast.classes[this.accessStates.contrast - 1]);
        }

        // Aplicar fuentes
        if (this.accessStates.font > 0) {
            docHtml.classList.add(this.accessOptions.font.classes[this.accessStates.font - 1]);
        }

        // Aplicar modo daltónico
        if (this.accessStates.colorblind > 0) {
            docHtml.classList.add(this.accessOptions.colorblind.classes[this.accessStates.colorblind - 1]);
        }

        // Aplicar tamaños de texto a todo el documento
        const fontSize = this.accessOptions.textSize.values[this.accessStates.textSize];
        docHtml.style.setProperty('--font-size', fontSize);
        
        // Aplicar alineación de texto a todo el documento
        const textAlign = this.accessOptions.textAlign.values[this.accessStates.textAlign];
        docHtml.style.setProperty('--text-align', textAlign);
        
        // Aplicar resaltado de enlaces
        docHtml.classList.toggle('highlight-links', this.accessStates.links);
        
        // Aplicar pausa de animaciones
        const wasAnimationsDisabled = docHtml.classList.contains('no-animations');
        docHtml.classList.toggle('no-animations', this.accessStates.animations);
        
        // Si se desactivaron las animaciones, reiniciar las animaciones de partículas
        if (wasAnimationsDisabled && !this.accessStates.animations) {
            this.restartAnimations();
        }
    }

    restartAnimations() {
        // Reiniciar animaciones de partículas si existen
        if (window.portfolioApp && window.portfolioApp.modules.particles) {
            try {
                window.portfolioApp.modules.particles.restart();
            } catch (e) {
                console.log('No se pudo reiniciar las partículas:', e);
            }
        }
        
        // Reiniciar animaciones CSS usando el módulo de animaciones
        if (window.portfolioApp && window.portfolioApp.modules.animations) {
            try {
                window.portfolioApp.modules.animations.restartAnimations();
            } catch (e) {
                console.log('No se pudo reiniciar las animaciones:', e);
            }
        }
    }

    updateUI() {
        document.querySelectorAll('[data-access-action]').forEach(button => {
            const action = button.dataset.accessAction;
            const indicator = button.querySelector('.level-indicator');
            button.classList.remove('active');
            
            if (indicator) indicator.textContent = '';
            
            if (action.startsWith('cycle-')) {
                const feature = action.replace('cycle-', '');
                const state = this.accessStates[feature];
                const option = this.accessOptions[feature];
                
                if (state > 0) button.classList.add('active');
                if (indicator && option.labels) {
                    indicator.textContent = option.labels[state];
                } else if (indicator) {
                    indicator.textContent = state > 0 ? state : '';
                }
            } else if (action.startsWith('toggle-')) {
                const feature = action.replace('toggle-', '');
                if (indicator) {
                    indicator.textContent = this.accessStates[feature] ? 'on' : 'off';
                }
                if (this.accessStates[feature]) button.classList.add('active');
            }
        });
    }

    reset() {
        const docHtml = document.documentElement;
        const isLightMode = docHtml.classList.contains('light-mode');
        
        // Resetear clases
        docHtml.className = 'scroll-smooth';
        if (isLightMode) docHtml.classList.add('light-mode');
        
        // Resetear estados
        this.accessStates = { 
            contrast: 0, 
            textSize: 1, 
            textAlign: 0, 
            links: false, 
            font: 0, 
            animations: false, 
            colorblind: 0 
        };
        
        this.applyStyles();
        this.updateUI();
        
        // Reiniciar animaciones después del reset
        this.restartAnimations();
    }
} 