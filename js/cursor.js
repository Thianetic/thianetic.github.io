// ===== MÓDULO DE CURSOR PERSONALIZADO =====

export class CursorManager {
    constructor() {
        this.cursor = document.querySelector('.custom-cursor');
        this.symbol = this.cursor.querySelector('.cursor-symbol');
        this.init();
    }

    init() {
        if (!this.cursor) return;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Seguir movimiento del mouse
        window.addEventListener('mousemove', (e) => {
            this.updateCursorPosition(e.clientX, e.clientY);
        });

        // Efectos hover en elementos interactivos
        const interactiveElements = document.querySelectorAll('a, button, .filter-tab, .access-btn, input, textarea, select');
        const projectCards = document.querySelectorAll('.project-card');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hovered');
                this.setSymbol('_', true); // Parpadeo
            });
            
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hovered');
                this.setSymbol('>');
            });
        });

        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hovered');
                this.setSymbol('{ }', false);
            });
            card.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hovered');
                this.setSymbol('>');
            });
        });

        // Observador para elementos dinámicos (como modales)
        this.setupDynamicElementsObserver();

        // Ocultar cursor cuando sale de la ventana
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
        });
    }

    setupDynamicElementsObserver() {
        // Observar cambios en el DOM para elementos dinámicos
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        // Buscar elementos interactivos en el nuevo nodo
                        const newInteractiveElements = node.querySelectorAll ? 
                            node.querySelectorAll('a, button, input, textarea, select, .access-btn, .project-card, .filter-tab') : [];
                        
                        newInteractiveElements.forEach(el => {
                            this.addInteractiveElement(el);
                        });

                        // Si el nodo mismo es interactivo
                        if (node.matches && node.matches('a, button, input, textarea, select, .access-btn, .project-card, .filter-tab')) {
                            this.addInteractiveElement(node);
                        }

                        // Configurar elementos específicos de modales
                        if (node.id === 'project-modal' || node.id === 'contact-modal' || node.id === 'gdpr-modal') {
                            this.setupModalElements(node);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Configurar elementos de modales existentes
        this.setupExistingModals();
    }

    setupExistingModals() {
        const modals = ['project-modal', 'contact-modal', 'gdpr-modal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                this.setupModalElements(modal);
            }
        });
    }

    setupModalElements(modal) {
        // Configurar elementos interactivos dentro del modal
        const interactiveElements = modal.querySelectorAll('a, button, input, textarea, select, .close-modal, .project-btn, .demo-btn, .code-btn');
        
        interactiveElements.forEach(el => {
            this.addInteractiveElement(el);
        });

        // Configurar botones de cierre específicamente
        const closeButtons = modal.querySelectorAll('.close-modal, [id*="close"]');
        closeButtons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hovered');
                this.setSymbol('×', false);
            });
            btn.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hovered');
                this.setSymbol('>');
            });
        });
    }

    updateCursorPosition(x, y) {
        this.cursor.style.left = x + 'px';
        this.cursor.style.top = y + 'px';
    }

    setSymbol(symbol, blink = false) {
        if (!this.symbol) return;
        this.symbol.textContent = symbol;
        if (blink) {
            this.symbol.style.animation = 'cursor-blink 1s steps(2, start) infinite';
        } else {
            this.symbol.style.animation = 'none';
        }
    }

    // Método para agregar elementos interactivos dinámicamente
    addInteractiveElement(element) {
        // Remover listeners existentes para evitar duplicados
        element.removeEventListener('mouseenter', this._handleMouseEnter);
        element.removeEventListener('mouseleave', this._handleMouseLeave);
        
        // Determinar el tipo de elemento y configurar el cursor apropiadamente
        if (element.classList.contains('project-card')) {
            element.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hovered');
                this.setSymbol('{ }', false);
            });
            element.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hovered');
                this.setSymbol('>');
            });
        } else if (element.classList.contains('close-modal') || element.id?.includes('close')) {
            element.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hovered');
                this.setSymbol('×', false);
            });
            element.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hovered');
                this.setSymbol('>');
            });
        } else {
            // Elementos interactivos generales (enlaces, botones, inputs, etc.)
            element.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hovered');
                this.setSymbol('_', true); // Parpadeo para elementos interactivos
            });
            element.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hovered');
                this.setSymbol('>');
            });
        }
    }

    // Método para cambiar el estado del cursor
    setCursorState(state) {
        this.cursor.classList.remove('hovered');
        if (state === 'hovered') {
            this.cursor.classList.add('hovered');
        }
    }
} 