// ===== UTILIDADES =====

// Generar ID de usuario único
function getUserId() {
    let id = localStorage.getItem('thianetic_user_id');
    if (!id) {
        const letters = () => Array.from({length:3},()=>String.fromCharCode(65+Math.floor(Math.random()*26))).join('');
        const digits = () => Math.floor(100+Math.random()*900);
        id = letters() + digits();
        localStorage.setItem('thianetic_user_id', id);
    }
    return id;
}

// Efecto scramble de texto
function applyScrambleEffect(elements) {
    elements.forEach(el => {
        const target = el.querySelector('[data-scramble-text]') || el;
        const originalText = target.textContent;
        let interval;
        
        el.addEventListener('mouseover', () => {
            let i = 0; 
            clearInterval(interval);
            interval = setInterval(() => {
                target.textContent = originalText.split("").map((l,idx) => 
                    (idx < i) ? originalText[idx] : SCRAMBLE_CHARS[Math.floor(Math.random()*SCRAMBLE_CHARS.length)]
                ).join("");
                if(i >= originalText.length) clearInterval(interval);
                i += 1/3;
            }, 30);
        });
        
        el.addEventListener('mouseleave', () => { 
            clearInterval(interval); 
            target.textContent = originalText; 
        });
    });
}

// Animación de texto scramble
function scrambleTextAnimation(element, finalText) {
    let i = 0;
    const interval = setInterval(() => {
        element.textContent = finalText.split("").map((l, idx) => 
            (idx < i) ? finalText[idx] : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        ).join("");
        if (i >= finalText.length) {
            clearInterval(interval);
            return true;
        }
        i += 1 / 2;
    }, 50);
}

// Obtener color de acento desde CSS
function getAccentColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
}

// Convertir hex a RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Verificar si un elemento está en viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Obtener distancia entre dos puntos
function getDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// Clamp value between min and max
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// Random number between min and max
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Random integer between min and max
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
} 