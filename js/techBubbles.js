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
            .filter((txt) => TECH_LOGOS[txt]);

        const urls = tags.length
            ? tags.map((t) => TECH_LOGOS[t])
            : [TECH_LOGOS.Python, TECH_LOGOS.Kotlin, TECH_LOGOS.Docker].filter(Boolean);

        const intervalId = setInterval(() => {
            this.spawnBubble(card, urls);
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

    spawnBubble(card, urls) {
        if (!urls.length) return;
        const bubble = document.createElement('div');
        bubble.className = 'tech-bubble';
        bubble.style.left = `${Math.floor(Math.random() * 75) + 10}%`;
        bubble.style.bottom = '12px';

        const img = document.createElement('img');
        img.src = urls[Math.floor(Math.random() * urls.length)];
        img.alt = '';
        img.loading = 'lazy';
        bubble.appendChild(img);

        card.appendChild(bubble);

        setTimeout(() => {
            bubble.remove();
        }, 3000);
    }
}
