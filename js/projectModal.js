// ===== MÓDULO DE MODAL DE PROYECTOS =====

export class ProjectModal {
    constructor() {
        this.modal = document.getElementById('project-modal');
        this.modalContent = document.getElementById('modal-content');
        this.closeBtn = document.getElementById('close-modal');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupProjectCards();
    }

    setupEventListeners() {
        // Cerrar modal con botón X
        this.closeBtn.addEventListener('click', () => this.closeModal());

        // Cerrar modal haciendo clic fuera
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Cerrar modal con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    setupProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // No abrir modal si se hace clic en los botones
                if (e.target.closest('.project-btn')) return;
                
                const projectData = this.extractProjectData(card);
                this.openModal(projectData);
            });
        });
    }

    extractProjectData(card) {
        const title = card.querySelector('h3').textContent;
        const description = card.querySelector('p').textContent;
        const image = card.querySelector('.project-image').src;
        const status = card.querySelector('.project-status')?.textContent || '';
        const techList = Array.from(card.querySelectorAll('li')).map(li => li.textContent);
        
        // Extraer enlaces
        const demoBtn = card.querySelector('.demo-btn');
        const codeBtn = card.querySelector('.code-btn');
        
        return {
            title,
            description,
            image,
            status,
            technologies: techList,
            demoUrl: demoBtn?.href || '#',
            codeUrl: codeBtn?.href || '#',
            features: this.getProjectFeatures(title)
        };
    }

    getProjectFeatures(projectTitle) {
        // Base de datos de características por proyecto
        const features = {
            'TicketApp': [
                'Gestión completa de tickets y soporte técnico',
                'Notificaciones en tiempo real',
                'Interfaz intuitiva con Jetpack Compose',
                'Integración con Firebase para backend',
                'Sistema de autenticación de usuarios',
                'Panel de administración web'
            ],
            'TicketApp (Web)': [
                'Backend robusto con gestión de usuarios',
                'Panel de administración completo',
                'Dashboard con estadísticas en tiempo real',
                'API REST para comunicación con la app móvil',
                'Sistema de notificaciones push',
                'Base de datos MySQL optimizada'
            ],
            'DermApp': [
                'Seguimiento de condiciones dermatológicas',
                'Recordatorios de tratamiento personalizados',
                'Almacenamiento local seguro con SQLite',
                'Interfaz adaptada para usuarios con necesidades especiales',
                'Sistema de alertas y notificaciones',
                'Historial completo de tratamientos'
            ],
            'DiarioApp Moderno': [
                'Diseño tipo "Bento Grid" moderno',
                'Calendario integrado con eventos',
                'Estadísticas visuales de actividades',
                'Notas adhesivas interactivas',
                'Temas personalizables',
                'Almacenamiento local persistente'
            ],
            'Laberinto de las Monedas': [
                'Juego 3D completo desarrollado en Unity',
                'Sistema de recolección de monedas',
                'Obstáculos y enemigos dinámicos',
                'Física realista y controles fluidos',
                'Sistema de puntuación y niveles',
                'Optimización para diferentes dispositivos'
            ]
        };

        return features[projectTitle] || [
            'Desarrollo profesional con mejores prácticas',
            'Código limpio y bien documentado',
            'Interfaz de usuario intuitiva',
            'Optimización de rendimiento',
            'Compatibilidad multiplataforma',
            'Arquitectura escalable'
        ];
    }

    updateModalContent(projectData) {
        // Llenar contenido del modal
        document.getElementById('modal-title').textContent = projectData.title;
        document.getElementById('modal-description').textContent = projectData.description;
        document.getElementById('modal-image').src = projectData.image;
        document.getElementById('modal-image').alt = projectData.title;
        
        // Estado del proyecto
        const statusEl = document.getElementById('modal-status');
        statusEl.textContent = projectData.status;
        statusEl.className = `inline-block px-3 py-1 rounded-full text-xs font-fira-code font-bold ${this.getStatusClass(projectData.status)}`;
        
        // Tecnologías
        const techContainer = document.getElementById('modal-tech');
        techContainer.innerHTML = '';
        projectData.technologies.forEach(tech => {
            const techTag = document.createElement('span');
            techTag.className = 'text-xs font-fira-code bg-[#0a192f] px-2 py-1 rounded';
            techTag.textContent = tech;
            techContainer.appendChild(techTag);
        });
        
        // Características
        const featuresContainer = document.getElementById('modal-features');
        featuresContainer.innerHTML = '';
        projectData.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresContainer.appendChild(li);
        });
        
        // Enlaces
        const demoLink = document.getElementById('modal-demo');
        const codeLink = document.getElementById('modal-code');
        
        demoLink.href = projectData.demoUrl;
        codeLink.href = projectData.codeUrl;
        
        // Mostrar/ocultar botones según disponibilidad
        demoLink.style.display = projectData.demoUrl !== '#' ? 'flex' : 'none';
        codeLink.style.display = projectData.codeUrl !== '#' ? 'flex' : 'none';
        
        // Mostrar modal
        this.modal.classList.add('active');
        
        setTimeout(() => {
            this.modalContent.style.transform = 'scale(1)';
        }, 10);
    }

    openModal(projectData) {
        this.modal.style.opacity = '1';
        this.modal.style.pointerEvents = 'auto';
        
        // Actualizar contenido del modal
        this.updateModalContent(projectData);
        
        // Bloquear scroll del body
        document.body.style.overflow = 'hidden';
        
        // Notificar al cursor que el modal está abierto
        this.notifyCursorManager();
    }

    notifyCursorManager() {
        // Buscar la instancia del cursor manager y configurar elementos del modal
        const cursorManager = window.cursorManager;
        if (cursorManager && cursorManager.setupModalElements) {
            cursorManager.setupModalElements(this.modal);
        }
    }

    closeModal() {
        this.modalContent.style.transform = 'scale(0.95)';
        this.modal.style.opacity = '0';
        this.modal.style.pointerEvents = 'none';
        this.modal.classList.remove('active');
        
        // Restaurar scroll del body
        document.body.style.overflow = 'auto';
    }

    getStatusClass(status) {
        const statusClasses = {
            'EN DESARROLLO': 'status-development',
            'BETA': 'status-beta',
            'BETA TESTER': 'status-beta',
            'RELEASE': 'status-release',
            'ALPHA': 'status-alpha'
        };
        return statusClasses[status] || 'status-development';
    }
} 