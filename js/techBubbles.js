// Tech Bubbles Floating Effect Manager
import { TECH_LOGOS } from './config.js';

export class TechBubblesManager {
    constructor(bus) {
        this.bus = bus;
        this.activeIntervals = new Map();
    }

    init() {
        const abortController = new AbortController();
        const { signal } = abortController;

        const cards = document.querySelectorAll('#ecosistema .project-card');
        cards.forEach((card) => {
            card.addEventListener('mouseenter', () => {
                if (
                    document.documentElement.classList.contains('reduce-motion') ||
                    document.documentElement.classList.contains('ambient-paused')
                ) {
                    return;
                }
                this.startBubbles(card);
            }, { signal });

            card.addEventListener('mouseleave', () => {
                this.stopBubbles(card);
            }, { signal });
        });
    }

    startBubbles(card) {
        if (this.activeIntervals.has(card)) return;

        const tags = Array.from(card.querySelectorAll('li, span'))
            .map((el) => el.textContent.trim())
            .filter((txt) => TECH_LOGOS[txt] || ['Python', 'Kotlin', 'Docker', 'Linux', 'FastAPI', 'Android'].includes(txt));

        const techList = tags.length
            ? tags
            : ['Python', 'Kotlin', 'Docker', 'Linux'];

        const intervalId = setInterval(() => {
            this.spawnBubble(card, techList);
        }, 700);

        this.activeIntervals.set(card, intervalId);
    }

    stopBubbles(card) {
        const intervalId = this.activeIntervals.get(card);
        if (intervalId) {
            clearInterval(intervalId);
            this.activeIntervals.delete(card);
        }
    }

    spawnBubble(card, techList) {
        if (!techList.length) return;
        const bubble = document.createElement('div');
        bubble.className = 'tech-bubble';
        bubble.style.left = `${Math.floor(Math.random() * 75) + 10}%`;
        bubble.style.bottom = '12px';

        const tag = document.createElement('span');
        tag.className = 'bubble-tag';
        tag.textContent = techList[Math.floor(Math.random() * techList.length)];
        bubble.appendChild(tag);

        card.appendChild(bubble);

        setTimeout(() => {
            bubble.remove();
        }, 3000);
    }
}
