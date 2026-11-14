// Loading Screen Cyber-OS Boot & Hero Terminal Manager
import { APP_VERSION, BOOT_SEQUENCE, HERO_TERMINAL_LINES } from './config.js';
import { scrambleText } from './utils.js';

export class LoadingManager {
    constructor(bus) {
        this.bus = bus;
        this.loadingScreen = null;
        this.bootOutput = null;
        this.bootProgressBar = null;
        this.finalThianetic = null;
        this.heroTerminalOutput = null;
        this.replayBtns = [];
        this.bootTimers = [];
        this.heroTimers = [];
        this.isBootRunning = false;
    }

    init() {
        const abortController = new AbortController();
        const { signal } = abortController;

        this.loadingScreen = document.getElementById('loading-screen');
        this.bootOutput = document.getElementById('boot-terminal-output');
        this.bootProgressBar = document.getElementById('boot-progress-bar');
        this.finalThianetic = document.getElementById('final-thianetic');
        this.heroTerminalOutput = document.getElementById('terminal-output');
        this.replayBtns = Array.from(document.querySelectorAll('#replay-boot-btn, .replay-boot-trigger'));

        const versionBadge = document.getElementById('boot-version-badge');
        if (versionBadge) {
            versionBadge.textContent = `SEC-CORE v${APP_VERSION}`;
        }

        if (this.loadingScreen) {
            window.addEventListener('keydown', (e) => {
                if (!this.isBootRunning) return;
                if (e.code === 'Space' || e.key === 'Escape' || e.key === 'Enter') {
                    e.preventDefault();
                    this.finishBoot();
                }
            }, { signal });

            this.loadingScreen.addEventListener('click', () => {
                if (this.isBootRunning) {
                    this.finishBoot();
                }
            }, { signal });
        }

        this.replayBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.startCyberBoot();
            }, { signal });
        });

        this.startCyberBoot();
        this.startHeroTerminal();
    }

    clearBootTimers() {
        this.bootTimers.forEach((id) => clearTimeout(id));
        this.bootTimers = [];
    }

    clearHeroTimers() {
        this.heroTimers.forEach((id) => clearTimeout(id));
        this.heroTimers = [];
    }

    finishBoot() {
        if (!this.isBootRunning) return;
        this.isBootRunning = false;
        this.clearBootTimers();
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('boot-hidden');
            this.loadingScreen.setAttribute('aria-hidden', 'true');
            this.loadingScreen.setAttribute('inert', '');
        }
    }

    startCyberBoot() {
        if (!this.loadingScreen || !this.bootOutput) return;

        const isReduced = (
            (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) ||
            document.documentElement.classList.contains('reduce-motion')
        );

        if (isReduced) {
            this.finishBoot();
            return;
        }

        this.clearBootTimers();
        this.isBootRunning = true;

        this.loadingScreen.classList.remove('boot-hidden');
        this.loadingScreen.setAttribute('aria-hidden', 'false');
        this.loadingScreen.removeAttribute('inert');

        this.bootOutput.innerHTML = '';
        if (this.bootProgressBar) {
            this.bootProgressBar.style.width = '0%';
        }
        if (this.finalThianetic) {
            this.finalThianetic.classList.remove('visible');
            this.finalThianetic.textContent = 'THIANETIC';
        }

        let cumulativeDelay = 250;
        BOOT_SEQUENCE.forEach((step) => {
            cumulativeDelay += step.delay || 550;
            const timerId = setTimeout(() => {
                if (!this.isBootRunning) return;
                const line = document.createElement('div');
                line.className = 'mb-1.5 font-mono text-xs sm:text-sm';
                line.textContent = `> ${step.text}`;
                this.bootOutput.appendChild(line);

                if (this.bootProgressBar && typeof step.progress === 'number') {
                    this.bootProgressBar.style.width = `${step.progress}%`;
                }
            }, cumulativeDelay);
            this.bootTimers.push(timerId);
        });

        const revealDelay = cumulativeDelay + 350;
        const revealTimer = setTimeout(() => {
            if (!this.isBootRunning || !this.finalThianetic) return;
            this.finalThianetic.classList.add('visible');
            scrambleText(this.finalThianetic, 'THIANETIC', { durationStep: 35, stepIncrement: 0.35 });
        }, revealDelay);
        this.bootTimers.push(revealTimer);

        const finishTimer = setTimeout(() => {
            if (!this.isBootRunning) return;
            this.finishBoot();
        }, revealDelay + 1400);
        this.bootTimers.push(finishTimer);
    }

    startHeroTerminal() {
        if (!this.heroTerminalOutput) return;
        this.clearHeroTimers();
        this.heroTerminalOutput.innerHTML = '';

        let delay = 200;
        HERO_TERMINAL_LINES.forEach((item) => {
            delay += item.delay || 140;
            const timerId = setTimeout(() => {
                this.appendHeroLine(item);
            }, delay);
            this.heroTimers.push(timerId);
        });
    }

    appendHeroLine(item) {
        if (!this.heroTerminalOutput) return;
        const row = document.createElement('div');
        row.className = item.final ? 'text-emerald-400 font-bold mt-1' : 'text-accent/90';
        row.textContent = `> ${item.text}`;
        this.heroTerminalOutput.appendChild(row);
    }
}
