// Custom Cursor Manager (RAF GPU-Composite Transform & Zero DOM Queries per Frame)
export class CursorManager {
    constructor(bus) {
        this.bus = bus;
        this.cursor = null;
        this.isTouchDevice = false;
        this.targetX = -100;
        this.targetY = -100;
        this.rafPending = false;
    }

    init() {
        const abortController = new AbortController();
        const { signal } = abortController;

        this.cursor = document.querySelector('.custom-cursor') || document.getElementById('custom-cursor');

        this.isTouchDevice = (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            window.matchMedia('(pointer: coarse)').matches
        );

        if (this.isTouchDevice || !this.cursor) {
            if (this.cursor) this.cursor.style.display = 'none';
            return;
        }

        document.body.classList.add('has-custom-cursor');

        const interactiveSelector = 'a, button, summary, [role="button"], input, textarea, select, label, .project-card, .filter-tab';

        const renderPosition = () => {
            this.rafPending = false;
            this.cursor.style.transform = `translate3d(calc(${this.targetX}px - 50%), calc(${this.targetY}px - 50%), 0)`;
        };

        document.addEventListener('mousemove', (e) => {
            this.targetX = e.clientX;
            this.targetY = e.clientY;
            if (!this.rafPending) {
                this.rafPending = true;
                requestAnimationFrame(renderPosition);
            }
        }, { passive: true, signal });

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactiveSelector)) {
                this.cursor.classList.add('hovered');
            }
        }, { passive: true, signal });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactiveSelector)) {
                this.cursor.classList.remove('hovered');
            }
        }, { passive: true, signal });
    }
}
