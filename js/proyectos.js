document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('projectModal');
    const openModalBtn = document.getElementById('openProjectModal');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const projectForm = document.getElementById('projectForm');
    
    // Elementos para sugerencias de IA
    const suggestNameBtn = document.getElementById('suggestName');
    const suggestDateBtn = document.getElementById('suggestDate');
    const suggestTechBtn = document.getElementById('suggestTech');
    const projectNameInput = document.getElementById('projectName');
    const projectDescInput = document.getElementById('projectDescription');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const techInput = document.getElementById('technologies');
    const tagsContainer = document.getElementById('tagsContainer');
    const techSuggestion = document.getElementById('techSuggestion');
    const techSuggestionText = document.getElementById('techSuggestionText');
    
    // Variables para el manejo de etiquetas
    let tags = [];
    
    // Configurar fecha actual como valor por defecto
    const today = new Date().toISOString().split('T')[0];
    startDateInput.value = today;
    
    // Base de conocimiento para sugerencias de IA
    const techKeywords = {
        'web': ['sitio web', 'página web', 'landing', 'ecommerce', 'tienda online', 'blog'],
        'mobile': ['app móvil', 'aplicación móvil', 'ios', 'android', 'react native', 'flutter'],
        'backend': ['api', 'servidor', 'backend', 'base de datos', 'autenticación', 'node', 'python', 'java', 'php'],
        'frontend': ['interfaz', 'ui/ux', 'diseño', 'react', 'vue', 'angular', 'javascript', 'css'],
        'data': ['análisis', 'datos', 'big data', 'machine learning', 'ia', 'inteligencia artificial', 'estadísticas'],
        'cloud': ['nube', 'aws', 'azure', 'google cloud', 'hosting', 'servidor']
    };
    
    const techSuggestions = {
        'web': ['HTML5', 'CSS3', 'JavaScript', 'React', 'Vue.js', 'Angular', 'Bootstrap', 'Tailwind CSS'],
        'mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic', 'Xamarin'],
        'backend': ['Node.js', 'Express', 'Django', 'Flask', 'Laravel', 'Spring Boot', 'NestJS'],
        'database': ['MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'SQLite', 'DynamoDB'],
        'cloud': ['AWS', 'Google Cloud', 'Azure', 'Firebase', 'Heroku', 'Vercel', 'Netlify'],
        'devops': ['Docker', 'Kubernetes', 'GitHub Actions', 'Jenkins', 'GitLab CI/CD'],
        'ai': ['Python', 'TensorFlow', 'PyTorch', 'scikit-learn', 'OpenCV', 'NLTK']
    };
    
    // Funciones auxiliares
    function openModal() {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    function resetForm() {
        projectForm.reset();
        startDateInput.value = today;
        tags = [];
        tagsContainer.innerHTML = '';
        techSuggestion.style.display = 'none';
    }
    
    // Generar nombre de proyecto con IA
    function generateProjectName(description) {
        const verbs = ['Desarrollo', 'Implementación', 'Sistema', 'Plataforma', 'Aplicación', 'Solución'];
        const adjectives = ['Innovadora', 'Escalable', 'Moderno', 'Eficiente', 'Integral', 'Avanzado'];
        const nouns = ['Gestión', 'Administración', 'Control', 'Seguimiento', 'Monitoreo', 'Análisis'];
        
        // Extraer palabras clave de la descripción
        const words = description.toLowerCase().split(/\s+/);
        let mainTopic = '';
        
        // Buscar palabras clave comunes
        const topics = ['web', 'móvil', 'app', 'sistema', 'plataforma', 'dashboard', 'api'];
        for (const word of words) {
            if (topics.includes(word)) {
                mainTopic = word.charAt(0).toUpperCase() + word.slice(1);
                break;
            }
        }
        
        // Si no se encontró un tema principal, usar un sustantivo aleatorio
        if (!mainTopic) {
            mainTopic = nouns[Math.floor(Math.random() * nouns.length)];
        }
        
        // Construir el nombre del proyecto
        const verb = verbs[Math.floor(Math.random() * verbs.length)];
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        
        return `${verb} de ${mainTopic} ${adj}`;
    }
    
    // Sugerir fecha de entrega basada en la complejidad
    function suggestEndDate(startDate, complexity) {
        const date = new Date(startDate);
        const daysToAdd = {
            'baja': 14,    // 2 semanas
            'media': 30,   // 1 mes
            'alta': 90,    // 3 meses
            'urgente': 7   // 1 semana
        };
        
        const days = daysToAdd[complexity] || 30;
        date.setDate(date.getDate() + days);
        
        // Formatear fecha como YYYY-MM-DD
        return date.toISOString().split('T')[0];
    }
    
    // Analizar descripción para sugerir tecnologías
    function analyzeTechStack(description) {
        const desc = description.toLowerCase();
        const matchedCategories = [];
        
        // Determinar categorías relevantes
        for (const [category, keywords] of Object.entries(techKeywords)) {
            if (keywords.some(keyword => desc.includes(keyword))) {
                matchedCategories.push(category);
            }
        }
        
        // Si no se encontraron coincidencias, usar categorías por defecto
        if (matchedCategories.length === 0) {
            matchedCategories.push('web', 'backend');
        }
        
        // Obtener tecnologías sugeridas
        const suggestedTechs = new Set();
        matchedCategories.forEach(category => {
            const techs = techSuggestions[category] || [];
            techs.forEach(tech => suggestedTechs.add(tech));
        });
        
        return Array.from(suggestedTechs).slice(0, 5); // Limitar a 5 sugerencias
    }
    
    // Manejar etiquetas de tecnologías
    function addTag(tag) {
        if (tag && !tags.includes(tag)) {
            tags.push(tag);
            
            const tagElement = document.createElement('div');
            tagElement.className = 'tag';
            tagElement.innerHTML = `
                ${tag}
                <button type="button" class="remove-tag">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Agregar evento para eliminar etiqueta
            const removeBtn = tagElement.querySelector('.remove-tag');
            removeBtn.addEventListener('click', () => {
                const index = tags.indexOf(tag);
                if (index > -1) {
                    tags.splice(index, 1);
                }
                tagElement.remove();
            });
            
            tagsContainer.appendChild(tagElement);
            techInput.value = '';
        }
    }
    
    // Función para analizar la descripción y generar sugerencias
    function generateAISuggestions() {
        const description = projectDescInput.value.trim();
        
        if (!description) {
            showTooltip(document.getElementById('suggestAll'), 'Por favor, ingresa una descripción del proyecto para generar sugerencias');
            return;
        }
        
        // Mostrar animación de carga
        const suggestBtn = document.getElementById('suggestAll');
        const originalHTML = suggestBtn.innerHTML;
        suggestBtn.classList.add('loading');
        suggestBtn.disabled = true;
        
        // Simular procesamiento con IA (en un caso real, aquí iría una llamada a una API de IA)
        setTimeout(() => {
            try {
                // 1. Generar nombre del proyecto
                const projectName = generateProjectName(description);
                
                // 2. Analizar descripción para determinar complejidad y prioridad
                const { complexity, priority } = analyzeComplexity(description);
                
                // 3. Sugerir fecha de entrega basada en la complejidad
                const endDate = suggestEndDate(startDateInput.value, complexity);
                
                // 4. Sugerir tecnologías
                const suggestedTechs = analyzeTechStack(description);
                
                // Aplicar sugerencias al formulario
                projectNameInput.value = projectName;
                document.getElementById('priority').value = priority;
                endDateInput.value = endDate;
                
                // Limpiar etiquetas existentes
                tags = [];
                tagsContainer.innerHTML = '';
                
                // Agregar tecnologías sugeridas
                suggestedTechs.forEach(tech => addTag(tech));
                
                // Mostrar notificación de éxito
                showTooltip(suggestBtn, '¡Sugerencias generadas con éxito!', 'success');
                
            } catch (error) {
                console.error('Error al generar sugerencias:', error);
                showTooltip(suggestBtn, 'Error al generar sugerencias. Intenta de nuevo.', 'error');
            } finally {
                // Restaurar botón
                suggestBtn.classList.remove('loading');
                suggestBtn.disabled = false;
            }
        }, 1500); // Simular tiempo de procesamiento
    }
    
    // Función para analizar la complejidad y prioridad basada en la descripción
    function analyzeComplexity(description) {
        const desc = description.toLowerCase();
        let complexity = 'media';
        let priority = 'media';
        
        // Palabras clave para determinar complejidad
        const complexKeywords = [
            { words: ['sencillo', 'básico', 'página', 'landing'], value: 'baja' },
            { words: ['complejo', 'avanzado', 'plataforma', 'sistema', 'app móvil'], value: 'alta' },
            { words: ['integral', 'completo', 'ecommerce', 'tienda online'], value: 'alta' },
            { words: ['módulo', 'componente', 'api', 'servicio'], value: 'media' }
        ];
        
        // Palabras clave para determinar prioridad
        const priorityKeywords = [
            { words: ['urgente', 'inmediato', 'lo antes posible', 'prioridad'], value: 'urgente' },
            { words: ['importante', 'alta prioridad', 'crítico', 'esencial'], value: 'alta' },
            { words: ['estándar', 'normal', 'regular'], value: 'media' },
            { words: ['baja prioridad', 'cuando sea posible', 'sin prisa'], value: 'baja' }
        ];
        
        // Determinar complejidad
        for (const { words, value } of complexKeywords) {
            if (words.some(word => desc.includes(word))) {
                complexity = value;
                break;
            }
        }
        
        // Determinar prioridad
        for (const { words, value } of priorityKeywords) {
            if (words.some(word => desc.includes(word))) {
                priority = value;
                break;
            }
        }
        
        return { complexity, priority };
    }
    
    // Event Listeners
    
    // Botón de Sugerencia IA
    document.getElementById('suggestAll').addEventListener('click', generateAISuggestions);
    
    // Abrir/cerrar modal
    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Sugerir nombre del proyecto
    suggestNameBtn.addEventListener('click', () => {
        if (projectDescInput.value.trim()) {
            const suggestedName = generateProjectName(projectDescInput.value);
            projectNameInput.value = suggestedName;
        } else {
            showTooltip(suggestNameBtn, 'Por favor, ingresa una descripción primero');
        }
    });
    
    // Sugerir fecha de entrega
    suggestDateBtn.addEventListener('click', () => {
        if (!startDateInput.value) {
            showTooltip(suggestDateBtn, 'Por favor, selecciona una fecha de inicio primero');
            return;
        }
        
        const priority = document.getElementById('priority').value;
        const suggestedDate = suggestEndDate(startDateInput.value, priority);
        endDateInput.value = suggestedDate;
        
        // Mostrar mensaje de sugerencia
        const start = new Date(startDateInput.value);
        const end = new Date(suggestedDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        showTooltip(suggestDateBtn, `Sugerencia: ${diffDays} días a partir de la fecha de inicio`);
    });
    
    // Sugerir tecnologías
    suggestTechBtn.addEventListener('click', () => {
        if (projectDescInput.value.trim()) {
            const suggestedTechs = analyzeTechStack(projectDescInput.value);
            
            if (suggestedTechs.length > 0) {
                // Mostrar sugerencias
                techSuggestionText.textContent = `Basado en la descripción, te recomendamos: ${suggestedTechs.join(', ')}`;
                techSuggestion.style.display = 'flex';
                
                // Agregar botones para cada tecnología sugerida
                const buttonsContainer = document.createElement('div');
                buttonsContainer.style.marginTop = '0.5rem';
                buttonsContainer.style.display = 'flex';
                buttonsContainer.style.gap = '0.5rem';
                buttonsContainer.style.flexWrap = 'wrap';
                
                suggestedTechs.forEach(tech => {
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = 'btn btn-sm';
                    btn.style.padding = '0.25rem 0.5rem';
                    btn.style.fontSize = '0.8rem';
                    btn.textContent = tech;
                    btn.onclick = () => addTag(tech);
                    buttonsContainer.appendChild(btn);
                });
                
                // Limpiar botones anteriores si los hay
                const existingButtons = techSuggestion.querySelector('.suggestion-buttons');
                if (existingButtons) {
                    techSuggestion.removeChild(existingButtons);
                }
                
                buttonsContainer.className = 'suggestion-buttons';
                techSuggestion.appendChild(buttonsContainer);
            }
        } else {
            showTooltip(suggestTechBtn, 'Por favor, ingresa una descripción primero');
        }
    });
    
    // Agregar etiqueta al presionar Enter
    techInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = techInput.value.trim();
            if (value) {
                addTag(value);
            }
        }
    });
    
    // Manejar envío del formulario
    projectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Aquí iría la lógica para guardar el proyecto
        const projectData = {
            name: projectNameInput.value,
            description: projectDescInput.value,
            startDate: startDateInput.value,
            endDate: endDateInput.value,
            technologies: [...tags],
            priority: document.getElementById('priority').value,
            budget: document.getElementById('budget').value || null
        };
        
        console.log('Nuevo proyecto:', projectData);
        
        // Mostrar mensaje de éxito
        alert('¡Proyecto creado exitosamente!');
        
        // Cerrar modal y reiniciar formulario
        closeModal();
        resetForm();
    });
    
    // Función para mostrar tooltips
    function showTooltip(element, message, type = 'info') {
        // Eliminar tooltip existente si hay uno
        const existingTooltip = document.querySelector('.custom-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }

        // Crear tooltip
        const tooltip = document.createElement('div');
        tooltip.className = `custom-tooltip ${type}`;
        
        // Agregar icono según el tipo
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        else if (type === 'error') icon = 'exclamation-circle';
        
        tooltip.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
        
        // Posicionar tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.top = `${rect.top - 40}px`;
        tooltip.style.left = `${rect.left + (rect.width / 2)}px`;
        tooltip.style.transform = 'translateX(-50%)';
        
        document.body.appendChild(tooltip);
        
        // Eliminar tooltip después de 3 segundos
        setTimeout(() => {
            tooltip.classList.add('fade-out');
            setTimeout(() => tooltip.remove(), 300);
        }, 3000);
    }
    
    // Lógica de filtros
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                if (filter === 'todos' || card.dataset.status === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});
