// Navigation, Mobile Menu (with inert/ARIA), Hover Scramble & CV Modal Print Manager
import { scrambleText } from './utils.js';

export class NavigationManager {
    constructor(bus) {
        this.bus = bus;
        this.mobileMenuBtn = null;
        this.mobileMenu = null;
        this.cvModal = null;
        this.printCvBtn = null;
    }

    init() {
        const abortController = new AbortController();
        const { signal } = abortController;

        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.cvModal = document.getElementById('cv-modal');
        this.printCvBtn = document.getElementById('print-cv-btn');

        const yearEl = document.getElementById('current-year');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear().toString();
        }

        this.setupMobileMenu(signal);
        this.setupSmoothScroll(signal);
        this.setupActiveSectionObserver();
        this.setupHoverScramble(signal);
        this.setupCvModal(signal);
    }

    setupMobileMenu(signal) {
        if (!this.mobileMenuBtn || !this.mobileMenu) return;

        this.setMobileMenuOpen(false);

        this.mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = this.mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            this.setMobileMenuOpen(!isOpen);
        }, { signal });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileMenuBtn.getAttribute('aria-expanded') === 'true') {
                this.setMobileMenuOpen(false);
                this.mobileMenuBtn.focus();
            }
        }, { signal });

        document.addEventListener('click', (e) => {
            if (
                this.mobileMenuBtn.getAttribute('aria-expanded') === 'true' &&
                !this.mobileMenu.contains(e.target) &&
                !this.mobileMenuBtn.contains(e.target)
            ) {
                this.setMobileMenuOpen(false);
            }
        }, { signal });
    }

    setMobileMenuOpen(open) {
        if (!this.mobileMenuBtn || !this.mobileMenu) return;

        this.mobileMenuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        this.mobileMenuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
        this.mobileMenuBtn.innerHTML = open ? '&times;' : '&#9776;';
        this.mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');

        const mainContent = document.getElementById('main-content');

        if (open) {
            this.mobileMenu.classList.remove('translate-x-full');
            this.mobileMenu.removeAttribute('inert');
            if (mainContent) mainContent.setAttribute('inert', '');
            const firstLink = this.mobileMenu.querySelector('a');
            if (firstLink) firstLink.focus();
        } else {
            this.mobileMenu.classList.add('translate-x-full');
            this.mobileMenu.setAttribute('inert', '');
            if (mainContent) mainContent.removeAttribute('inert');
            if (this.mobileMenuBtn && getComputedStyle(this.mobileMenuBtn).display !== 'none') {
                this.mobileMenuBtn.focus();
            }
        }
    }

    setupSmoothScroll(signal) {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (!targetId || targetId === '#') return;

                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    this.setMobileMenuOpen(false);
                    const reduceMotion =
                        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
                        document.documentElement.classList.contains('reduce-motion');
                    targetEl.scrollIntoView({
                        behavior: reduceMotion ? 'auto' : 'smooth',
                        block: 'start'
                    });
                }
            }, { signal });
        });
    }

    setupActiveSectionObserver() {
        const sections = document.querySelectorAll('main section[id]');
        const navLinks = document.querySelectorAll('.lateral-nav a[data-nav-link]');
        if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach((link) => {
                        link.classList.toggle('active', link.getAttribute('data-nav-link') === id);
                    });
                }
            });
        }, { threshold: 0.25 });

        sections.forEach((sec) => observer.observe(sec));
    }

    setupHoverScramble(signal) {
        const scrambleElements = document.querySelectorAll(
            '.liquid-glass-btn, .project-btn, #cv-header-btn'
        );
        scrambleElements.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                if (document.documentElement.classList.contains('reduce-motion')) return;
                scrambleText(el);
            }, { signal });
        });
    }

    setupCvModal(signal) {
        if (!this.cvModal) return;

        const supportsCommand = 'commandForElement' in HTMLButtonElement.prototype;
        if (!supportsCommand) {
            const openBtns = document.querySelectorAll('[commandfor="cv-modal"][command="show-modal"], #cv-header-btn');
            openBtns.forEach((btn) => {
                btn.addEventListener('click', () => {
                    if (!this.cvModal.open) this.cvModal.showModal();
                }, { signal });
            });
        }

        const closeBtn = document.getElementById('close-cv-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.cvModal.close();
            }, { signal });
        }

        this.cvModal.addEventListener('click', (e) => {
            if (e.target === this.cvModal) {
                this.cvModal.close();
            }
        }, { signal });

        if (this.printCvBtn) {
            this.printCvBtn.addEventListener('click', () => {
                window.print();
            }, { signal });
        }
    }
}
