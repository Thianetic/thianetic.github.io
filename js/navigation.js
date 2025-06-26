// ===== MÓDULO DE NAVEGACIÓN =====

export class NavigationManager {
    constructor() {
        this.navLinks = document.querySelectorAll('.lateral-nav a');
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        this.heroH1 = document.getElementById('hero-h1');
        this.fixedHeader = document.getElementById('header-title');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.setupNavHighlighting();
        this.setupFixedHeader();
    }

    setupEventListeners() {
        // Menú móvil
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Enlaces móviles
        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => this.toggleMobileMenu());
        });

        // Efecto scramble en enlaces
        this.setupScrambleEffect();
    }

    toggleMobileMenu() {
        this.mobileMenu.classList.toggle('translate-x-full');
        this.mobileMenuBtn.innerHTML = this.mobileMenu.classList.contains('translate-x-full') ? '&#9776;' : '&times;';
        document.body.classList.toggle('overflow-hidden');
    }

    setupScrambleEffect() {
        const scrambleChars = '01000110100001101001011000010110111001100101011101000110100101100011';
        
        // Aplicar a enlaces de navegación lateral
        this.navLinks.forEach(el => {
            const target = el.querySelector('[data-scramble-text]') || el;
            const originalText = target.textContent;
            let interval;
            
            el.addEventListener('mouseover', () => {
                let i = 0;
                clearInterval(interval);
                interval = setInterval(() => {
                    target.textContent = originalText.split("").map((l, idx) => 
                        (idx < i) ? originalText[idx] : scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
                    ).join("");
                    if (i >= originalText.length) clearInterval(interval);
                    i += 1/3;
                }, 30);
            });
            
            el.addEventListener('mouseleave', () => {
                clearInterval(interval);
                target.textContent = originalText;
            });
        });

        // Aplicar a otros elementos con data-scramble-text
        document.querySelectorAll('.liquid-glass-btn, .project-btn').forEach(el => {
            const target = el.querySelector('[data-scramble-text]') || el;
            const originalText = target.textContent;
            let interval;
            
            el.addEventListener('mouseover', () => {
                let i = 0;
                clearInterval(interval);
                interval = setInterval(() => {
                    target.textContent = originalText.split("").map((l, idx) => 
                        (idx < i) ? originalText[idx] : scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
                    ).join("");
                    if (i >= originalText.length) clearInterval(interval);
                    i += 1/3;
                }, 30);
            });
            
            el.addEventListener('mouseleave', () => {
                clearInterval(interval);
                target.textContent = originalText;
            });
        });
    }

    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-zoom, .animate-on-scroll');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    // Opcional: remover clase para re-animar al hacer scroll hacia arriba
                    // entry.target.classList.remove('is-visible');
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(el => observer.observe(el));
    }

    setupNavHighlighting() {
        const sections = document.querySelectorAll('section');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.navLinks.forEach(link => {
                        link.classList.toggle('active', 
                            link.getAttribute('href').substring(1) === entry.target.id
                        );
                    });
                }
            });
        }, { rootMargin: "-50% 0px -50% 0px" });
        
        sections.forEach(section => observer.observe(section));
    }

    setupFixedHeader() {
        if (!this.heroH1 || !this.fixedHeader) return;

        this.heroH1.classList.add('hero-h1-transition');
        
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) {
                this.fixedHeader.classList.remove('opacity-0', '-translate-y-full', 'pointer-events-none');
            } else {
                this.fixedHeader.classList.add('opacity-0', '-translate-y-full', 'pointer-events-none');
            }
        }, { rootMargin: "0px 0px 0px 0px", threshold: 0 });
        
        observer.observe(this.heroH1);
    }
} 