// Project Modal Manager (Catalog-Synced Cards & Nested Card Safe)
import { PROJECT_CATALOG } from './config.js';

export class ProjectModal {
    constructor(bus) {
        this.bus = bus;
        this.modal = null;
        this.modalTitle = null;
        this.modalStatus = null;
        this.modalImage = null;
        this.modalImageFallback = null;
        this.modalDescription = null;
        this.modalTechStack = null;
        this.modalFeatures = null;
        this.modalDemoLink = null;
        this.modalCodeLink = null;
        this.lastTriggerElement = null;
    }

    init() {
        const abortController = new AbortController();
        const { signal } = abortController;

        this.modal = document.getElementById('project-modal');
        if (!this.modal) return;

        this.modalTitle = document.getElementById('modal-title');
        this.modalStatus = document.getElementById('modal-status');
        this.modalImage = document.getElementById('modal-image');
        this.modalImageFallback = document.getElementById('modal-image-fallback');
        this.modalDescription = document.getElementById('modal-description');
        this.modalTechStack = document.getElementById('modal-tech');
        this.modalFeatures = document.getElementById('modal-features');
        this.modalDemoLink = document.getElementById('modal-demo');
        this.modalCodeLink = document.getElementById('modal-code');

        // Event delegation for any project card with [data-project] or explicit trigger [data-project-trigger] / .project-card-trigger
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-project-trigger], .project-card-trigger');
            if (trigger) {
                e.preventDefault();
                e.stopPropagation();
                const card = trigger.closest('[data-project]');
                const projectId = trigger.getAttribute('data-project-trigger') || card?.getAttribute('data-project');
                if (projectId) {
                    this.lastTriggerElement = trigger;
                    this.openProjectModal(projectId, card);
                }
                return;
            }

            if (e.target.closest('a[href], button')) return;

            const card = e.target.closest('[data-project]');
            if (!card) return;

            e.stopPropagation();
            const projectId = card.getAttribute('data-project');
            this.lastTriggerElement = card;
            this.openProjectModal(projectId, card);
        }, { signal });

        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            const trigger = e.target.closest('[data-project-trigger], .project-card-trigger');
            if (trigger) {
                e.preventDefault();
                e.stopPropagation();
                const card = trigger.closest('[data-project]');
                const projectId = trigger.getAttribute('data-project-trigger') || card?.getAttribute('data-project');
                if (projectId) {
                    this.lastTriggerElement = trigger;
                    this.openProjectModal(projectId, card);
                }
                return;
            }
            const card = e.target.closest('[data-project]');
            if (!card || e.target.closest('a[href], button')) return;

            e.preventDefault();
            e.stopPropagation();
            const projectId = card.getAttribute('data-project');
            this.lastTriggerElement = card;
            this.openProjectModal(projectId, card);
        }, { signal });

        const closeBtn = document.getElementById('close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.modal.close();
            }, { signal });
        }

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.modal.close();
            }
        }, { signal });

        this.modal.addEventListener('close', () => {
            if (this.lastTriggerElement && typeof this.lastTriggerElement.focus === 'function') {
                this.lastTriggerElement.focus();
            }
        }, { signal });

        if (this.bus) {
            this.bus.addEventListener('project:open', (e) => {
                const projectId = e.detail?.projectId;
                if (projectId) {
                    const cardEl = document.querySelector(`[data-project="${projectId}"]`);
                    this.openProjectModal(projectId, cardEl);
                }
            }, { signal });
        }
    }

    openProjectModal(projectId, cardEl) {
        const data = PROJECT_CATALOG[projectId] || this.extractFallbackFromDom(cardEl);
        if (!data || !this.modal) return;

        if (this.modalTitle) {
            this.modalTitle.textContent = data.title;
        }

        if (this.modalStatus) {
            this.modalStatus.textContent = data.status || 'PROYECTO TÉCNICO';
            const statusClass = data.statusClass || 'status-release';
            this.modalStatus.className = `inline-block px-3 py-1 rounded-full text-xs font-fira-code font-bold ${statusClass}`;
        }

        if (this.modalDescription) {
            this.modalDescription.textContent = data.description;
        }

        if (this.modalImage) {
            if (data.image) {
                this.modalImage.src = data.image;
                this.modalImage.alt = `Vista técnica de ${data.title}`;
                this.modalImage.classList.remove('hidden');
                if (this.modalImageFallback) {
                    this.modalImageFallback.classList.add('hidden');
                }
            } else {
                this.modalImage.removeAttribute('src');
                this.modalImage.classList.add('hidden');
                this.renderTechBannerFallback(data);
            }
        }

        if (this.modalTechStack) {
            this.modalTechStack.innerHTML = '';
            const techList = data.technologies || data.tech || [];
            techList.forEach((techItem) => {
                const badge = document.createElement('span');
                badge.className = 'bg-[#0a192f] text-cyan-300 border border-cyan-500/30 text-xs px-3 py-1 rounded-full font-mono';
                badge.textContent = techItem;
                this.modalTechStack.appendChild(badge);
            });
        }

        if (this.modalFeatures) {
            this.modalFeatures.innerHTML = '';
            (data.features || []).forEach((feat) => {
                const li = document.createElement('li');
                li.textContent = feat;
                this.modalFeatures.appendChild(li);
            });
        }

        if (this.modalDemoLink) {
            if (data.demoUrl && data.demoUrl !== '#') {
                this.modalDemoLink.href = data.demoUrl;
                this.modalDemoLink.classList.remove('hidden');
            } else {
                this.modalDemoLink.classList.add('hidden');
                this.modalDemoLink.removeAttribute('href');
            }
        }

        if (this.modalCodeLink) {
            if (data.codeUrl && data.codeUrl !== '#') {
                this.modalCodeLink.href = data.codeUrl;
                this.modalCodeLink.classList.remove('hidden');
            } else {
                this.modalCodeLink.classList.add('hidden');
                this.modalCodeLink.removeAttribute('href');
            }
        }

        if (!this.modal.open) {
            this.modal.showModal();
        }
    }

    renderTechBannerFallback(data) {
        if (!this.modalImageFallback) {
            const container = this.modalImage ? this.modalImage.parentElement : null;
            if (!container) return;
            this.modalImageFallback = document.createElement('div');
            this.modalImageFallback.id = 'modal-image-fallback';
            this.modalImageFallback.className = 'w-full h-48 rounded-lg border border-[var(--line-color-dark)] bg-black/50 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden';
            container.appendChild(this.modalImageFallback);
        }

        const badgeLabel = data.status || 'SYSTEM ARCHITECTURE';
        const stackSummary = (data.technologies || []).slice(0, 4).join(' · ');
        this.modalImageFallback.innerHTML = `
            <div class="text-xs font-mono text-accent tracking-widest uppercase mb-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10">${badgeLabel}</div>
            <div class="text-lg font-bold text-[var(--text-primary-dark)] font-mono mb-1">${data.title}</div>
            <div class="text-xs font-mono text-[var(--text-secondary-dark)]">${stackSummary}</div>
        `;
        this.modalImageFallback.classList.remove('hidden');
    }

    extractFallbackFromDom(cardEl) {
        if (!cardEl) return null;
        const heading = cardEl.querySelector('h3, h4');
        const paragraph = cardEl.querySelector('p');
        return {
            title: heading ? heading.textContent.trim() : 'Proyecto Técnico',
            status: 'ARQUITECTURA & DESARROLLO',
            image: null,
            description: paragraph ? paragraph.textContent.trim() : 'Detalle técnico del sistema.',
            technologies: ['Multiplataforma', 'Clean Architecture', 'DevSecOps'],
            features: ['Diseño modular con principios SOLID y seguridad por defecto.'],
            codeUrl: 'https://github.com/thianetic'
        };
    }
}
