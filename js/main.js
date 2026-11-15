// Main Application Orchestrator, Timeline Scroll & Progressive WebMCP Registration
import { APP_VERSION, PROFILE_INFO, PROJECT_CATALOG } from './config.js';
import { scrambleText } from './utils.js';
import { LoadingManager } from './loading.js';
import { ThemeManager } from './theme.js';
import { AccessibilityManager } from './accessibility.js';
import { ParticleSystem } from './particles.js';
import { AnimationManager } from './animations.js';
import { CursorManager } from './cursor.js';
import { NavigationManager } from './navigation.js';
import { ProjectFilter } from './projectFilter.js';
import { ProjectModal } from './projectModal.js';
import { TechBubblesManager } from './techBubbles.js';
import { ContactFormManager } from './contactForm.js';
import { ConsoleManager } from './console.js';

export class PortfolioApp {
    constructor() {
        this.bus = new EventTarget();
        this.modules = {
            loading: new LoadingManager(this.bus),
            theme: new ThemeManager(this.bus),
            accessibility: new AccessibilityManager(this.bus),
            particles: new ParticleSystem(this.bus),
            animations: new AnimationManager(this.bus),
            cursor: new CursorManager(this.bus),
            navigation: new NavigationManager(this.bus),
            projectFilter: new ProjectFilter(this.bus),
            projectModal: new ProjectModal(this.bus),
            techBubbles: new TechBubblesManager(this.bus),
            contactForm: new ContactFormManager(this.bus),
            console: new ConsoleManager(this.bus)
        };
    }

    init() {
        const abortController = new AbortController();
        const { signal } = abortController;

        Object.values(this.modules).forEach((mod) => {
            if (typeof mod.init === 'function') {
                mod.init();
            }
        });

        this.setupTimelineAnimation(signal);
        this.setupSocialTooltips(signal);
        this.registerWebMCP();
    }

    setupTimelineAnimation(signal) {
        const container = document.querySelector('.cv-timeline-container');
        const line = document.querySelector('.cv-timeline-line');
        const dot = document.querySelector('.cv-timeline-dot');

        if (!container || !line || !dot) return;

        let totalHeight = container.offsetHeight;
        let containerTop = container.getBoundingClientRect().top + window.scrollY;

        window.addEventListener('resize', () => {
            totalHeight = container.offsetHeight;
            containerTop = container.getBoundingClientRect().top + window.scrollY;
        }, { passive: true, signal });

        let rafPending = false;
        const updateTimeline = () => {
            rafPending = false;
            const windowHeight = window.innerHeight;
            const startTrigger = windowHeight * 0.65;
            const scrollY = window.scrollY;
            const rawScrolled = (scrollY + startTrigger) - containerTop;
            const progress = Math.min(Math.max(rawScrolled / (totalHeight || 1), 0), 1);
            const currentPx = Math.round(progress * totalHeight);

            line.style.height = `${currentPx}px`;
            dot.style.top = `${currentPx}px`;

            if (progress >= 0.98) {
                line.classList.add('completed');
            } else {
                line.classList.remove('completed');
            }
        };

        window.addEventListener('scroll', () => {
            if (!rafPending) {
                rafPending = true;
                requestAnimationFrame(updateTimeline);
            }
        }, { passive: true, signal });

        updateTimeline();
    }

    setupSocialTooltips(signal) {
        const socialLinks = document.querySelectorAll('#social-links a');
        socialLinks.forEach((link) => {
            const tooltip = link.querySelector('.social-tooltip');
            if (!tooltip) return;

            link.addEventListener('mouseenter', () => {
                if (document.documentElement.classList.contains('reduce-motion')) return;
                scrambleText(tooltip, tooltip.getAttribute('data-text') || '@thianetic');
            }, { signal });
        });
    }

    registerWebMCP() {
        if (typeof navigator === 'undefined' || !navigator.modelContext) return;
        try {
            if (typeof navigator.modelContext.registerTool === 'function') {
                navigator.modelContext.registerTool({
                    name: 'get_professional_summary',
                    description: 'Returns verified structured summary of Thianetic portfolio, experience, education, and project catalog.',
                    inputSchema: { type: 'object', properties: {} },
                    execute: async () => ({
                        version: APP_VERSION,
                        name: PROFILE_INFO.name,
                        role: PROFILE_INFO.role,
                        subtitle: PROFILE_INFO.subtitle,
                        experience: PROFILE_INFO.experience,
                        education: PROFILE_INFO.education,
                        projects: Object.keys(PROJECT_CATALOG),
                        llmsTxtUrl: 'https://thianetic.github.io/llms.txt'
                    })
                });

                navigator.modelContext.registerTool({
                    name: 'open_contact_channel',
                    description: 'Abre el modal de contacto directo en el navegador o devuelve los canales de contacto verificados de Thianetic.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            subject: {
                                type: 'string',
                                description: 'Asunto opcional para pre-seleccionar en el formulario de contacto.'
                            }
                        }
                    },
                    execute: async (args = {}) => {
                        this.bus.dispatchEvent(new CustomEvent('contact:open', {
                            detail: { subject: args?.subject }
                        }));
                        return { status: 'opened', subject: args?.subject || null };
                    }
                });
            }
        } catch {
            // Silently ignore experimental WebMCP differences across user agents
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp();
    app.init();
});
