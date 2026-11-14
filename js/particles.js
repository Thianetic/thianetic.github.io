// Particle Network Canvas Manager (Retina DPR Scaled & Unified oklch/Hex Theme Token)
class Particle {
    constructor(width, height, accentColor) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.55;
        this.vy = (Math.random() - 0.5) * 0.55;
        this.radius = Math.random() * 1.8 + 0.8;
        this.accentColor = accentColor;
    }

    update(ctx, mouse, width, height) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distSq = dx * dx + dy * dy;
            const maxDist = mouse.radius;
            if (distSq < maxDist * maxDist && distSq > 1) {
                const dist = Math.sqrt(distSq);
                const force = (maxDist - dist) / maxDist;
                this.x -= (dx / dist) * force * 1.2;
                this.y -= (dy / dist) * force * 1.2;
            }
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.accentColor;
        ctx.fill();
    }
}

export class ParticleSystem {
    constructor(bus) {
        this.bus = bus;
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.isPaused = false;
        this.logicalWidth = 0;
        this.logicalHeight = 0;
        this.cachedAccentColor = '#00e5ff';
        this.mouse = { x: null, y: null, radius: 130 };
    }

    init() {
        const abortController = new AbortController();
        const { signal } = abortController;

        this.canvas = document.getElementById('background-canvas') || document.getElementById('particles-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.refreshAccentCache();
        this.resizeCanvas();
        this.createParticles();

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const ambientPaused = document.documentElement.classList.contains('ambient-paused');
        this.isPaused = prefersReducedMotion || ambientPaused;

        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
            if (this.isPaused) {
                this.renderStaticFrame();
            }
        }, { passive: true, signal });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        }, { passive: true, signal });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        }, { passive: true, signal });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAnimation();
            } else if (!this.isPaused) {
                this.startAnimation();
            }
        }, { signal });

        if (this.bus) {
            this.bus.addEventListener('theme:changed', () => {
                this.refreshAccentCache();
                this.particles.forEach((p) => {
                    p.accentColor = this.cachedAccentColor;
                });
                if (this.isPaused) {
                    this.renderStaticFrame();
                }
            }, { signal });

            this.bus.addEventListener('ambient:changed', (e) => {
                const paused = Boolean(e.detail && e.detail.paused);
                this.setPaused(paused);
            }, { signal });
        }

        if (this.isPaused) {
            this.renderStaticFrame();
        } else {
            this.startAnimation();
        }
    }

    refreshAccentCache() {
        this.cachedAccentColor =
            getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#00e5ff';
    }

    resizeCanvas() {
        if (!this.canvas || !this.ctx) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.logicalWidth = window.innerWidth;
        this.logicalHeight = window.innerHeight;
        this.canvas.width = Math.floor(this.logicalWidth * dpr);
        this.canvas.height = Math.floor(this.logicalHeight * dpr);
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    createParticles() {
        const area = this.logicalWidth * this.logicalHeight;
        const isMobile = this.logicalWidth < 768;
        const divisor = isMobile ? 26000 : 16500;
        const maxParticles = isMobile ? 32 : 72;
        const count = Math.min(Math.max(Math.floor(area / divisor), 18), maxParticles);

        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(this.logicalWidth, this.logicalHeight, this.cachedAccentColor));
        }
    }

    connectParticles() {
        const maxDist = 135;
        const maxDistSq = maxDist * maxDist;
        const len = this.particles.length;

        this.ctx.strokeStyle = this.cachedAccentColor;
        this.ctx.lineWidth = 0.8;

        for (let a = 0; a < len; a++) {
            const pA = this.particles[a];
            for (let b = a + 1; b < len; b++) {
                const pB = this.particles[b];
                const dx = pA.x - pB.x;
                const dy = pA.y - pB.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < maxDistSq) {
                    this.ctx.globalAlpha = (1 - distSq / maxDistSq) * 0.24;
                    this.ctx.beginPath();
                    this.ctx.moveTo(pA.x, pA.y);
                    this.ctx.lineTo(pB.x, pB.y);
                    this.ctx.stroke();
                }
            }
        }
        this.ctx.globalAlpha = 1;
    }

    renderStaticFrame() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update(this.ctx, { x: null, y: null, radius: 0 }, this.logicalWidth, this.logicalHeight);
        }
        this.connectParticles();
    }

    animate() {
        if (this.isPaused || !this.ctx) return;

        this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update(this.ctx, this.mouse, this.logicalWidth, this.logicalHeight);
        }
        this.connectParticles();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    startAnimation() {
        if (this.animationId) return;
        this.animate();
    }

    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    setPaused(paused) {
        this.isPaused = paused;
        if (paused) {
            this.stopAnimation();
            this.renderStaticFrame();
        } else {
            this.startAnimation();
        }
    }
}
