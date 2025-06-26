// ===== MÓDULO DE FILTRO DE PROYECTOS =====

export class ProjectFilter {
    constructor() {
        this.filterTabs = document.querySelectorAll('.filter-tab');
        this.projects = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.handleFilterClick(tab);
            });
        });
    }

    handleFilterClick(clickedTab) {
        // Actualizar estado activo de las pestañas
        this.filterTabs.forEach(tab => tab.classList.remove('active'));
        clickedTab.classList.add('active');

        // Obtener filtro seleccionado
        const filter = clickedTab.dataset.filter;

        // Aplicar filtro con transiciones suaves
        this.filterProjects(filter);
    }

    filterProjects(filter) {
        this.projects.forEach(project => {
            const matches = filter === 'all' || project.dataset.category === filter;
            
            if (matches) {
                // Mostrar proyecto
                project.classList.remove('hide');
                project.style.display = 'block';
                
                // Animar entrada
                setTimeout(() => {
                    project.style.opacity = '1';
                    project.style.transform = 'scale(1)';
                }, 50);
            } else {
                // Ocultar proyecto con animación
                project.style.opacity = '0';
                project.style.transform = 'scale(0.95)';
                
                // Ocultar después de la animación
                setTimeout(() => {
                    project.classList.add('hide');
                    project.style.display = 'none';
                }, 400);
            }
        });
    }

    // Método para filtrar por categoría específica
    filterByCategory(category) {
        const tab = Array.from(this.filterTabs).find(tab => tab.dataset.filter === category);
        if (tab) {
            this.handleFilterClick(tab);
        }
    }

    // Método para mostrar todos los proyectos
    showAll() {
        this.handleFilterClick(this.filterTabs[0]); // Asumiendo que el primer tab es "all"
    }
} 