// ===== MÓDULO DE PANTALLA DE CARGA =====

export class LoadingScreen {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.terminalOutput = document.getElementById('terminal-output');
        this.terminalWrapper = document.getElementById('terminal-wrapper');
        this.finalAnimationContainer = document.getElementById('final-animation-container');
        this.finalThianetic = document.getElementById('final-thianetic');
        this.skipPrompt = document.getElementById('skip-intro-prompt');
        this.mainContent = document.getElementById('main-content');
        
        this.introFinished = false;
        this.introTimeout = null;
        this.scrambleChars = '!<>-_\\/[]{}—=+*^?#_';
        
        this.init();
    }

    init() {
        if (!this.loadingScreen) return;
        
        this.setupEventListeners();
        this.startBootSequence();
        this.hideBodyScroll();
    }

    setupEventListeners() {
        this.loadingScreen.addEventListener('click', () => this.finishIntro());
        window.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    handleKeyPress(e) {
        if (e.code === 'Space') {
            e.preventDefault();
            this.finishIntro();
        }
    }

    hideBodyScroll() {
        document.body.style.overflow = 'hidden';
    }

    startBootSequence() {
        // Mostrar el prompt al iniciar el boot
        const isMobile = window.innerWidth <= 768;
        if (this.skipPrompt) {
            this.skipPrompt.classList.remove('hidden');
            this.skipPrompt.classList.remove('visible');
            this.skipPrompt.classList.add('bounce');
            this.skipPrompt.textContent = isMobile ? '[Toca] la pantalla para continuar' : 'Pulsa [ESPACIO] para continuar';
        }
        const bootSequence = [
            { text: 'THIANETIC OS v3.0...', delay: 400 },
            { text: 'INITIATING DYNAMIC CORE...', delay: 400 },
            { text: 'RENDER_MATRIX: ACTIVE', delay: 300 },
            { text: 'WELCOME_USER  ' + this.getUserId(), delay: 200, final: true }
        ];
        this.typeBootSequence(bootSequence, 0);
    }

    getUserId() {
        let id = localStorage.getItem('thianetic_user_id');
        if (!id) {
            const letters = () => Array.from({length:3},()=>String.fromCharCode(65+Math.floor(Math.random()*26))).join('');
            const digits = () => Math.floor(100+Math.random()*900);
            id = letters() + digits();
            localStorage.setItem('thianetic_user_id', id);
        }
        return id;
    }

    typeBootSequence(sequence, lineIndex) {
        if (this.introFinished || lineIndex >= sequence.length) return;
        const line = sequence[lineIndex];
        const p = document.createElement('p');
        this.terminalOutput.appendChild(p);
        let charIndex = 0;
        const typeInterval = setInterval(() => {
            if (charIndex < line.text.length) {
                p.textContent = line.text.slice(0, charIndex + 1);
                charIndex++;
            } else {
                clearInterval(typeInterval);
                if (line.final) {
                    setTimeout(() => {
                        this.startFinalAnimation();
                    }, 400);
                } else {
                    lineIndex++;
                    setTimeout(() => this.typeBootSequence(sequence, lineIndex), line.delay);
                }
            }
        }, 30);
    }

    startFinalAnimation() {
        if (this.terminalWrapper) this.terminalWrapper.style.opacity = '0';
        if (this.skipPrompt) {
            // Parpadeo antes de ocultar
            setTimeout(() => {
                this.skipPrompt.classList.add('hidden');
                this.skipPrompt.classList.remove('visible');
            }, 150);
        }
        if (this.finalThianetic) {
            this.finalThianetic.classList.add('visible');
            this.scrambleTextAnimation(this.finalThianetic, 'THIANETIC');
        }
    }

    scrambleTextAnimation(element, finalText) {
        let i = 0;
        const interval = setInterval(() => {
            element.textContent = finalText.split("").map((l, idx) => 
                (idx < i) ? finalText[idx] : this.scrambleChars[Math.floor(Math.random() * this.scrambleChars.length)]
            ).join("");
            
            if (i >= finalText.length) {
                clearInterval(interval);
                setTimeout(() => this.finishIntro(), 1200);
            }
            i += 1/2;
        }, 50);
    }

    finishIntro() {
        if (this.introFinished) return;
        
        this.introFinished = true;
        if (this.introTimeout) clearTimeout(this.introTimeout);
        
        window.removeEventListener('keydown', this.handleKeyPress);
        this.loadingScreen.removeEventListener('click', this.finishIntro);

        // Ocultar pantalla de carga
        this.loadingScreen.style.transition = 'opacity 1s ease-out';
        this.loadingScreen.style.opacity = '0';
        
        // Mostrar contenido principal inmediatamente
        if (this.mainContent) {
            this.mainContent.classList.remove('invisible');
            this.mainContent.style.opacity = '1';
        }
        
        setTimeout(() => {
            if (this.loadingScreen) {
                this.loadingScreen.style.display = 'none'; // Mejor que remove()
            }
            document.body.style.overflowY = 'auto';
            window.dispatchEvent(new CustomEvent('loadingComplete'));
        }, 1000);
    }
} 