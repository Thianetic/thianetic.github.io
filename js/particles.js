// ===== SISTEMA DE PARTÍCULAS =====

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 0 };
        this.animationFrameId = null;
        
        this.init();
        this.setupEventListeners();
    }
    
    init() {
        this.resizeCanvas();
        this.initParticles();
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.mouse.radius = (this.canvas.height / 120) * (this.canvas.width / 120);
    }
    
    initParticles() {
        this.particles = [];
        const numberOfParticles = (this.canvas.height * this.canvas.width) / 9000;
        
        for (let i = 0; i < numberOfParticles; i++) {
            const size = (Math.random() * 2) + 1;
            const x = (Math.random() * ((window.innerWidth - size * 2) - (size * 2)) + size * 2);
            const y = (Math.random() * ((window.innerHeight - size * 2) - (size * 2)) + size * 2);
            const dirX = (Math.random() * 0.4) - 0.2;
            const dirY = (Math.random() * 0.4) - 0.2;
            
            this.particles.push(new Particle(x, y, dirX, dirY, size));
        }
    }
    
    setupEventListeners() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.initParticles();
        });
        
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && !this.animationFrameId) {
                this.animate();
            }
        });
    }
    
    animate() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        this.animationFrameId = requestAnimationFrame(() => this.animate());
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Verificar si las animaciones están desactivadas
        if (document.documentElement.classList.contains('no-animations')) {
            return;
        }
        
        this.particles.forEach(particle => particle.update(this.mouse, this.canvas));
        this.connectParticles();
    }
    
    restart() {
        // Reiniciar la animación
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.animate();
    }
    
    connectParticles() {
        const connectDistance = (this.canvas.width / 8) * (this.canvas.height / 8);
        
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a; b < this.particles.length; b++) {
                const distance = ((this.particles[a].x - this.particles[b].x) ** 2) + ((this.particles[a].y - this.particles[b].y) ** 2);
                
                if (distance < connectDistance) {
                    const opacity = 1 - (distance / 20000);
                    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
                    const rgbHex = accentColor.substring(1);
                    
                    try {
                        const rgb = [
                            parseInt(rgbHex.slice(0,2),16), 
                            parseInt(rgbHex.slice(2,4),16), 
                            parseInt(rgbHex.slice(4,6),16)
                        ];
                        this.ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
                    } catch (e) {
                        this.ctx.strokeStyle = `rgba(0, 229, 255, ${opacity})`;
                    }
                    
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
                    this.ctx.lineTo(this.particles[b].x, this.particles[b].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('mousemove', this.handleMouseMove);
    }
}

class Particle {
    constructor(x, y, dirX, dirY, size) {
        this.x = x;
        this.y = y;
        this.directionX = dirX;
        this.directionY = dirY;
        this.size = size;
    }
    
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent') + '33';
        ctx.fill();
    }
    
    update(mouse, canvas) {
        // Rebotar en los bordes
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }
        
        // Interacción con el mouse
        if (mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius + this.size) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                    this.x += 3;
                }
                if (mouse.x > this.x && this.x > this.size * 10) {
                    this.x -= 3;
                }
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                    this.y += 3;
                }
                if (mouse.y > this.y && this.y > this.size * 10) {
                    this.y -= 3;
                }
            }
        }
        
        // Mover partícula
        this.x += this.directionX;
        this.y += this.directionY;
        
        this.draw(canvas.getContext('2d'));
    }
}

// Exportar la clase ParticleSystem
export { ParticleSystem }; 