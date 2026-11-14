// ===== UTILIDADES COMPARTIDAS Y LÓGICA PURA VERIFICABLE =====
import { ACCESSIBILITY_OPTIONS, DEFAULT_ACCESSIBILITY_STATE, CONTACT_EMAIL } from './config.js';

const DEFAULT_SCRAMBLE_CHARS = '01!<>-_\\/[]{}—=+*^?#_';

/**
 * Valida formato de correo electrónico (Función pura)
 */
export function isValidEmail(email) {
    if (typeof email !== 'string') return false;
    const trimmed = email.trim();
    if (!trimmed || trimmed.length > 120) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

/**
 * Valida un campo del formulario de contacto (Función pura sin DOM para tests unitarios)
 */
export function validateContactField(fieldName, rawValue, checked = false) {
    const value = typeof rawValue === 'string' ? rawValue.trim() : '';

    switch (fieldName) {
        case 'name':
            if (!value) return { isValid: false, errorMessage: 'El nombre es obligatorio' };
            if (value.length < 2) return { isValid: false, errorMessage: 'El nombre debe tener al menos 2 caracteres' };
            if (value.length > 100) return { isValid: false, errorMessage: 'El nombre no puede superar los 100 caracteres' };
            return { isValid: true, errorMessage: '' };

        case 'email':
            if (!value) return { isValid: false, errorMessage: 'El email es obligatorio' };
            if (!isValidEmail(value)) return { isValid: false, errorMessage: 'Introduce un email válido' };
            return { isValid: true, errorMessage: '' };

        case 'subject':
            if (!value) return { isValid: false, errorMessage: 'Selecciona un asunto' };
            if (value.length > 150) return { isValid: false, errorMessage: 'El asunto es demasiado largo' };
            return { isValid: true, errorMessage: '' };

        case 'message':
            if (!value) return { isValid: false, errorMessage: 'El mensaje es obligatorio' };
            if (value.length < 10) return { isValid: false, errorMessage: 'El mensaje debe tener al menos 10 caracteres' };
            if (value.length > 1200) return { isValid: false, errorMessage: 'El mensaje no puede superar los 1200 caracteres' };
            return { isValid: true, errorMessage: '' };

        case 'gdpr-consent':
            if (!checked) return { isValid: false, errorMessage: 'Debes aceptar el tratamiento de datos' };
            return { isValid: true, errorMessage: '' };

        default:
            return { isValid: true, errorMessage: '' };
    }
}

/**
 * Formatea el contenido del mensaje para envío directo mailto: y copiado al portapapeles (Función pura)
 */
export function formatDirectMailContent({ name, email, subject, message, recipient = CONTACT_EMAIL }) {
    const cleanName = String(name || '').trim();
    const cleanEmail = String(email || '').trim();
    const cleanSubject = String(subject || '').trim();
    const cleanMessage = String(message || '').trim();

    const subjectLine = `[Portfolio Thianetic] ${cleanSubject} — ${cleanName}`;
    const bodyText = `Nombre: ${cleanName}\nEmail: ${cleanEmail}\nAsunto: ${cleanSubject}\n\nMensaje:\n${cleanMessage}\n\n---\nEnviado desde https://thianetic.github.io`;
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(bodyText)}`;

    return {
        recipient,
        subjectLine,
        bodyText,
        mailtoUrl
    };
}

/**
 * Calcula el siguiente estado de accesibilidad de forma inmutable (Función pura)
 */
export function nextAccessibilityState(currentState, action, options = ACCESSIBILITY_OPTIONS) {
    const next = { ...DEFAULT_ACCESSIBILITY_STATE, ...currentState };
    if (typeof action !== 'string') return next;

    if (action === 'reset') {
        return { ...DEFAULT_ACCESSIBILITY_STATE };
    }

    if (action.startsWith('cycle-')) {
        const feature = action.slice('cycle-'.length);
        const opt = options[feature];
        if (opt && typeof opt.max === 'number') {
            next[feature] = ((next[feature] ?? 0) + 1) % (opt.max + 1);
        }
    } else if (action.startsWith('toggle-')) {
        const feature = action.slice('toggle-'.length);
        if (feature in next) {
            next[feature] = !next[feature];
        }
    }

    return next;
}

/**
 * Aplica de forma unificada el estado de accesibilidad sobre el elemento raíz (Hallazgos #7 y #17)
 */
export function applyAccessibilityDomState(state, rootEl, options = ACCESSIBILITY_OPTIONS) {
    if (!rootEl || !state) return;

    // 1. Contraste (usando classes de ACCESSIBILITY_OPTIONS)
    const contrastClasses = options.contrast?.classes || ['contrast-1', 'contrast-2', 'contrast-3'];
    rootEl.classList.remove(...contrastClasses);
    if (state.contrast > 0 && contrastClasses[state.contrast - 1]) {
        rootEl.classList.add(contrastClasses[state.contrast - 1]);
    }

    // 2. Tamaño de fuente en raíz
    const fontSizeVal = options.textSize?.values?.[state.textSize] || '16px';
    rootEl.style.setProperty('--font-size', fontSizeVal);

    // 3. Alineación de texto
    const alignVal = options.textAlign?.values?.[state.textAlign] || 'left';
    rootEl.style.setProperty('--text-align', alignVal);

    // 4. Enlaces resaltados
    rootEl.classList.toggle('highlight-links', Boolean(state.links));

    // 5. Fuente dislexia (usando classes de ACCESSIBILITY_OPTIONS)
    const fontClasses = options.font?.classes || ['dyslexia-friendly'];
    rootEl.classList.remove(...fontClasses);
    if (state.font > 0 && fontClasses[state.font - 1]) {
        rootEl.classList.add(fontClasses[state.font - 1]);
    }

    // 6. Modo monocromo / daltonismo (usando classes de ACCESSIBILITY_OPTIONS)
    const cbClasses = options.colorblind?.classes || ['colorblind-friendly'];
    rootEl.classList.remove(...cbClasses);
    if (state.colorblind > 0 && cbClasses[state.colorblind - 1]) {
        rootEl.classList.add(cbClasses[state.colorblind - 1]);
    }

    // 7. Pausar animaciones
    const paused = Boolean(state.animations);
    rootEl.classList.toggle('reduce-motion', paused);
    rootEl.classList.toggle('ambient-paused', paused);
}

/**
 * Determina si una tarjeta con atributo data-category coincide con el filtro activo (Función pura)
 */
export function matchesProjectFilter(categoryAttr, activeFilter) {
    if (!activeFilter || activeFilter === 'all') return true;
    if (typeof categoryAttr !== 'string' || !categoryAttr.trim()) return false;
    const categories = categoryAttr.trim().split(/\s+/);
    return categories.includes(activeFilter);
}

/**
 * Resuelve el nodo de texto seguro donde aplicar scramble sin destruir iconos hermanos
 */
export function resolveScrambleTarget(element) {
    if (!element) return null;
    if (element.hasAttribute?.('data-scramble-text')) return element;
    const explicitChild = element.querySelector?.('[data-scramble-text]');
    if (explicitChild) return explicitChild;
    if (element.children && element.children.length === 0) return element;
    return null;
}

/**
 * Ejecuta una animación scramble sobre un elemento o su hijo [data-scramble-text]
 */
export function scrambleText(element, finalText, { durationStep = 30, stepIncrement = 1 / 3, chars = DEFAULT_SCRAMBLE_CHARS, onComplete } = {}) {
    const target = resolveScrambleTarget(element);
    if (!target) {
        if (onComplete) onComplete();
        return () => {};
    }

    const text = finalText ?? target.dataset.originalText ?? target.textContent;
    target.dataset.originalText = text;

    // Respeto estricto a prefers-reduced-motion en tiempo de ejecución (sistema operativo o widget a11y)
    const isReduced = (
        (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) ||
        (typeof document !== 'undefined' && document.documentElement && document.documentElement.classList.contains('reduce-motion'))
    );

    if (isReduced) {
        target.textContent = text;
        if (onComplete) onComplete();
        return () => {};
    }

    let i = 0;
    const interval = setInterval(() => {
        target.textContent = text
            .split('')
            .map((ch, idx) => (idx < i ? text[idx] : chars[Math.floor(Math.random() * chars.length)]))
            .join('');

        if (i >= text.length) {
            clearInterval(interval);
            target.textContent = text;
            if (onComplete) onComplete();
        }
        i += stepIncrement;
    }, durationStep);

    return () => {
        clearInterval(interval);
        target.textContent = text;
    };
}
