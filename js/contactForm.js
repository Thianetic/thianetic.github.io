/**
 * Módulo para manejar el formulario de contacto
 * Incluye validación, confirmación y envío de mensajes usando Google Apps Script
 */
import { GOOGLE_SCRIPT_CONFIG } from './googleScriptConfig.js';

export class ContactForm {
    constructor() {
        this.contactModal = document.getElementById('contact-modal');
        this.gdprModal = document.getElementById('gdpr-modal');
        this.contactForm = document.getElementById('contact-form');
        this.isSubmitting = false;
        
        // Configurar Google Apps Script
        this.initGoogleAppsScript();
        
        this.init();
    }

    initGoogleAppsScript() {
        // URL de tu Google Apps Script (se genera después de crear el script)
        this.googleScriptUrl = GOOGLE_SCRIPT_CONFIG.SCRIPT_URL;
        
        // Email de destino
        this.toEmail = GOOGLE_SCRIPT_CONFIG.TO_EMAIL;
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidation();
    }

    setupEventListeners() {
        // Botones para abrir el formulario
        const contactButtons = document.querySelectorAll('#contact-btn-hero, #contact-btn-section');
        contactButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openContactModal();
            });
        });

        // Cerrar modal de contacto
        const closeContactBtn = document.getElementById('close-contact-modal');
        const cancelContactBtn = document.getElementById('cancel-contact');
        
        if (closeContactBtn) {
            closeContactBtn.addEventListener('click', () => this.closeContactModal());
        }
        if (cancelContactBtn) {
            cancelContactBtn.addEventListener('click', () => this.closeContactModal());
        }

        // Cerrar modal GDPR
        const closeGdprBtn = document.getElementById('close-gdpr-modal');
        const acceptGdprBtn = document.getElementById('accept-gdpr');
        
        if (closeGdprBtn) {
            closeGdprBtn.addEventListener('click', () => this.closeGdprModal());
        }
        if (acceptGdprBtn) {
            acceptGdprBtn.addEventListener('click', () => this.closeGdprModal());
        }

        // Enlace a términos GDPR
        const gdprTermsLink = document.getElementById('gdpr-terms-link');
        if (gdprTermsLink) {
            gdprTermsLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.openGdprModal();
            });
        }

        // Envío del formulario
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }

        // Cerrar modales al hacer clic fuera
        this.contactModal?.addEventListener('click', (e) => {
            if (e.target === this.contactModal) {
                this.closeContactModal();
            }
        });

        this.gdprModal?.addEventListener('click', (e) => {
            if (e.target === this.gdprModal) {
                this.closeGdprModal();
            }
        });

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.gdprModal && this.gdprModal.style.opacity === '1') {
                    this.closeGdprModal();
                } else if (this.contactModal && this.contactModal.style.opacity === '1') {
                    this.closeContactModal();
                }
            }
        });
    }

    setupFormValidation() {
        const inputs = this.contactForm?.querySelectorAll('input, textarea, select');
        if (!inputs) return;

        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remover errores previos
        this.clearFieldError(field);

        // Validaciones específicas
        switch (field.name) {
            case 'name':
                if (!value) {
                    isValid = false;
                    errorMessage = 'El nombre es obligatorio';
                } else if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'El nombre debe tener al menos 2 caracteres';
                }
                break;

            case 'email':
                if (!value) {
                    isValid = false;
                    errorMessage = 'El email es obligatorio';
                } else if (!this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Introduce un email válido';
                }
                break;

            case 'subject':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Selecciona un asunto';
                }
                break;

            case 'message':
                if (!value) {
                    isValid = false;
                    errorMessage = 'El mensaje es obligatorio';
                } else if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'El mensaje debe tener al menos 10 caracteres';
                }
                break;

            case 'gdpr-consent':
                if (!field.checked) {
                    isValid = false;
                    errorMessage = 'Debes aceptar el tratamiento de datos';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(field, message) {
        field.classList.add('border-red-500');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'text-red-500 text-sm mt-1';
        errorDiv.textContent = message;
        errorDiv.id = `${field.id}-error`;
        
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('border-red-500');
        const errorDiv = field.parentNode.querySelector(`#${field.id}-error`);
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    validateForm() {
        const fields = this.contactForm?.querySelectorAll('input, textarea, select');
        if (!fields) return false;

        let isValid = true;
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async sendEmail(formData) {
        return new Promise((resolve, reject) => {
            // Preparar los datos para Google Apps Script
            const emailData = {
                to_email: this.toEmail,
                from_name: formData.name,
                from_email: formData.email,
                subject: formData.subject,
                message: formData.message,
                gdpr_consent: formData.gdprConsent ? 'Sí' : 'No',
                timestamp: new Date().toISOString()
            };

            // Enviar email usando Google Apps Script
            fetch(this.googleScriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailData)
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Email enviado exitosamente:', data);
                resolve(data);
            })
            .catch((error) => {
                console.error('Error al enviar email:', error);
                reject(error);
            });
        });
    }

    async handleFormSubmit() {
        if (this.isSubmitting) return;

        if (!this.validateForm()) {
            this.showNotification('Por favor, corrige los errores en el formulario', 'error');
            return;
        }

        // Confirmación antes de enviar
        const confirmed = await this.showConfirmation();
        if (!confirmed) return;

        this.isSubmitting = true;
        this.setSubmitButtonState(true);

        try {
            // Recopilar datos del formulario
            const formData = this.getFormData();
            
            // Enviar email real
            await this.sendEmail(formData);
            
            this.showNotification('¡Mensaje enviado con éxito! Te responderé pronto.', 'success');
            this.closeContactModal();
            this.resetForm();
            
        } catch (error) {
            console.error('Error en el envío:', error);
            this.showNotification('Error al enviar el mensaje. Inténtalo de nuevo.', 'error');
        } finally {
            this.isSubmitting = false;
            this.setSubmitButtonState(false);
        }
    }

    getFormData() {
        const formData = new FormData(this.contactForm);
        return {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            gdprConsent: formData.get('gdpr-consent') === 'on'
        };
    }

    async showConfirmation() {
        return new Promise((resolve) => {
            const confirmed = confirm(
                '¿Estás seguro de que quieres enviar este mensaje?\n\n' +
                'Revisa que todos los datos sean correctos antes de continuar.'
            );
            resolve(confirmed);
        });
    }

    setSubmitButtonState(isSubmitting) {
        const submitBtn = this.contactForm?.querySelector('button[type="submit"]');
        if (!submitBtn) return;

        if (isSubmitting) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="iconify w-4 h-4 animate-spin" data-icon="mdi:loading"></span>
                ENVIANDO...
            `;
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <span class="iconify w-4 h-4" data-icon="mdi:send"></span>
                ENVIAR MENSAJE
            `;
        }
    }

    resetForm() {
        if (!this.contactForm) return;
        
        this.contactForm.reset();
        const inputs = this.contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => this.clearFieldError(input));
    }

    showNotification(message, type = 'info') {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-[10005] p-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300`;
        
        const bgColor = type === 'success' ? 'bg-green-600' : 
                       type === 'error' ? 'bg-red-600' : 'bg-blue-600';
        
        notification.className += ` ${bgColor} text-white`;
        
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <p class="text-sm">${message}</p>
                <button class="ml-4 text-white hover:text-gray-200">
                    <span class="iconify w-4 h-4" data-icon="mdi:close"></span>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Auto-cerrar después de 5 segundos
        setTimeout(() => {
            this.closeNotification(notification);
        }, 5000);

        // Cerrar al hacer clic
        const closeBtn = notification.querySelector('button');
        closeBtn.addEventListener('click', () => this.closeNotification(notification));
    }

    closeNotification(notification) {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    openContactModal() {
        if (!this.contactModal) return;
        
        this.contactModal.style.opacity = '1';
        this.contactModal.style.pointerEvents = 'auto';
        
        // Bloquear scroll del body
        document.body.style.overflow = 'hidden';
        
        // Focus en el primer campo
        setTimeout(() => {
            const firstInput = this.contactForm?.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 300);
        
        // Notificar al cursor que el modal está abierto
        this.notifyCursorManager();
    }

    notifyCursorManager() {
        // Buscar la instancia del cursor manager y configurar elementos del modal
        const cursorManager = window.cursorManager;
        if (cursorManager && cursorManager.setupModalElements) {
            cursorManager.setupModalElements(this.contactModal);
        }
    }

    closeContactModal() {
        if (!this.contactModal) return;
        
        this.contactModal.style.opacity = '0';
        this.contactModal.style.pointerEvents = 'none';
        
        // Restaurar scroll
        document.body.style.overflow = 'auto';
    }

    openGdprModal() {
        if (!this.gdprModal) return;
        
        this.gdprModal.style.opacity = '1';
        this.gdprModal.style.pointerEvents = 'auto';
        
        // Bloquear scroll
        document.body.style.overflow = 'hidden';
    }

    closeGdprModal() {
        if (!this.gdprModal) return;
        
        this.gdprModal.style.opacity = '0';
        this.gdprModal.style.pointerEvents = 'none';
        
        // Restaurar scroll
        document.body.style.overflow = 'auto';
    }
} 