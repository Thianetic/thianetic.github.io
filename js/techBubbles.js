// ===== MÓDULO DE BURBUJAS DE TECNOLOGÍAS =====

export class TechBubbles {
    constructor() {
        this.techLogos = {
            'Kotlin': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
            'Jetpack Compose': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jetpackcompose/jetpackcompose-original.svg',
            'Android SDK': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg',
            'Firebase': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
            'MySQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
            'SQLite': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg', 
            'GoogleCloud': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg',
            'HTML': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
            'CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg',
            'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
            'Tailwind CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
            'Unity': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg',
            'C#': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg', 
            'PHP': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-plain.svg',
            'Supabase': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg',
            'NGINX': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nginx/nginx-original.svg',
            'MariaDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mariadb/mariadb-original.svg',
            'Java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
            'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
            'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
            'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
            'Blender': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg'
        };

        this.bubbleInterval = null;
        this.availableTechs = [];
        this.init();
    }

    init() {
        this.setupProjectCards();
    }

    setupProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.startBubbleAnimation(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.stopBubbleAnimation();
            });
        });
    }

    startBubbleAnimation(card) {
        const techItems = card.querySelectorAll('li');
        const container = card.querySelector('.project-image-container');
        
        if (!container) return;

        // Obtener tecnologías del proyecto
        this.availableTechs = Array.from(techItems)
            .map(item => item.textContent.trim())
            .filter(tech => this.techLogos[tech]) // Solo tecnologías con logo
            .sort(() => Math.random() - 0.5);
        
        if (this.availableTechs.length === 0) return;
        
        let currentIndex = 0;
        
        this.bubbleInterval = setInterval(() => {
            if (currentIndex < this.availableTechs.length) {
                const techName = this.availableTechs[currentIndex];
                const logoUrl = this.techLogos[techName];
                
                if (logoUrl) {
                    this.createTechBubble(container, logoUrl);
                }
                
                currentIndex++;
                
                // Reiniciar ciclo si llegamos al final
                if (currentIndex >= this.availableTechs.length) {
                    currentIndex = 0;
                    // Volver a barajar para el próximo ciclo
                    this.availableTechs.sort(() => Math.random() - 0.5);
                }
            }
        }, 1000);
    }

    stopBubbleAnimation() {
        if (this.bubbleInterval) {
            clearInterval(this.bubbleInterval);
            this.bubbleInterval = null;
        }
        this.availableTechs = [];
    }

    createTechBubble(container, logoUrl) {
        const bubble = document.createElement('div');
        bubble.className = 'tech-bubble';
        
        const logoImg = document.createElement('img');
        logoImg.src = logoUrl;
        logoImg.alt = 'Tech Logo';
        bubble.appendChild(logoImg);
        
        // Posición aleatoria en el contenedor
        const containerRect = container.getBoundingClientRect();
        const posX = Math.random() * (containerRect.width - 40);
        bubble.style.left = `${posX}px`;
        bubble.style.bottom = '0px';
        
        container.appendChild(bubble);
        
        // Eliminar la burbuja después de la animación
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.remove();
            }
        }, 8000);
    }
} 