// Project Filter Manager (Scoped strictly to #ecosistema & View Transitions API)
import { matchesProjectFilter } from './utils.js';

export class ProjectFilter {
    constructor(bus) {
        this.bus = bus;
        this.filterBtns = [];
        this.projectCards = [];
        this.currentFilter = 'all';
    }

    init() {
        const abortController = new AbortController();
        const { signal } = abortController;

        this.filterBtns = Array.from(document.querySelectorAll('.filter-tab, .filter-btn'));
        this.projectCards = Array.from(document.querySelectorAll('#ecosistema .project-card'));

        if (!this.filterBtns.length || !this.projectCards.length) return;

        this.filterBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter') || 'all';
                this.applyFilter(filter, btn);
            }, { signal });
        });
    }

    applyFilter(filter, activeBtn) {
        if (this.currentFilter === filter) return;
        this.currentFilter = filter;

        this.filterBtns.forEach((btn) => {
            const isActive = btn === activeBtn;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        const updateDom = () => {
            this.projectCards.forEach((card) => {
                const categoriesAttr = card.getAttribute('data-category') || '';
                const isMatch = matchesProjectFilter(categoriesAttr, filter);
                card.classList.toggle('hide', !isMatch);
            });
        };

        const prefersReducedMotion =
            window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
            document.documentElement.classList.contains('reduce-motion');

        if (document.startViewTransition && !prefersReducedMotion) {
            document.startViewTransition(updateDom);
        } else {
            updateDom();
        }
    }
}
