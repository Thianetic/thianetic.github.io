// ===== MÓDULO DE ANIMACIONES =====

export class AnimationManager {
    constructor() {
        this.observer = null;
        this.animatedElements = [];
        this.init();
    }

    init() {
        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
        // Seleccionar todos los elementos con clases de animación
        this.animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-fade-up, .animate-zoom');

        // Crear el Intersection Observer
        this.observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    } else {
                        entry.target.classList.remove('is-visible'); // Oculta al salir
                    }
                });
            },
            { threshold: 0.1 }
        );

        // Observar todos los elementos animados
        this.animatedElements.forEach(el => this.observer.observe(el));
    }

    // Método para agregar nuevos elementos dinámicamente
    addElement(element) {
        if (element && this.observer) {
            this.observer.observe(element);
            this.animatedElements.push(element);
        }
    }

    // Método para remover elementos
    removeElement(element) {
        if (element && this.observer) {
            this.observer.unobserve(element);
            const index = this.animatedElements.indexOf(element);
            if (index > -1) {
                this.animatedElements.splice(index, 1);
            }
        }
    }

    // Método para reiniciar animaciones (útil para accesibilidad)
    restartAnimations() {
        this.animatedElements.forEach(el => {
            // Forzar reflow para reiniciar animaciones
            el.style.animation = 'none';
            el.offsetHeight; // Trigger reflow
            el.style.animation = null;
        });
    }

    // Método para limpiar recursos
    destroy() {
        if (this.observer) {
            this.animatedElements.forEach(el => this.observer.unobserve(el));
            this.observer.disconnect();
        }
        this.animatedElements = [];
    }
} 