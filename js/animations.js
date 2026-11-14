// Unified Scroll Animations & Parallax Manager
export class AnimationManager {
    constructor(bus) {
        this.bus = bus;
        this.observer = null;
        this.rafPending = false;
        this.isAmbientPaused = false;
    }

    init() {
        const abortController = new AbortController();
        const { signal } = abortController;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.isAmbientPaused = prefersReducedMotion || document.documentElement.classList.contains('ambient-paused');

        this.setupIntersectionObserver(prefersReducedMotion);
        this.setupParallaxScroll(signal);

        if (this.bus) {
            this.bus.addEventListener('ambient:changed', (e) => {
                this.isAmbientPaused = Boolean(e.detail && e.detail.paused);
            }, { signal });
        }
    }

    setupIntersectionObserver(prefersReducedMotion) {
        const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-fade-up, .animate-zoom');
        if (!animatedElements.length) return;

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            animatedElements.forEach((el) => el.classList.add('visible'));
            return;
        }

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        animatedElements.forEach((el) => this.observer.observe(el));
    }

    setupParallaxScroll(signal) {
        const updateScrollVar = () => {
            this.rafPending = false;
            if (this.isAmbientPaused) return;
            document.documentElement.style.setProperty('--scroll-y', `${window.scrollY.toFixed(1)}px`);
        };

        window.addEventListener('scroll', () => {
            if (!this.rafPending && !this.isAmbientPaused) {
                this.rafPending = true;
                requestAnimationFrame(updateScrollVar);
            }
        }, { passive: true, signal });
    }
}
