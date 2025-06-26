// ===== CONFIGURACIÓN =====

// Configuración de animaciones
const ANIMATION_CONFIG = {
    scrollThreshold: 0.1,
    fadeUpDelay: 100,
    zoomDelay: 200,
    particleCount: 9000,
    bubbleRiseDuration: 8000,
    techBubbleInterval: 1000
};

// Configuración de accesibilidad
const ACCESSIBILITY_CONFIG = {
    contrast: { 
        max: 3, 
        labels: ['Normal', 'Alto', 'Muy Alto', 'Invertido'], 
        classes: ['contrast-1', 'contrast-2', 'contrast-3'] 
    },
    textSize: { 
        max: 3, 
        labels: ['Pequeño', 'Normal', 'Grande', 'Muy Grande'],
        values: ['14px', '16px', '18px', '20px'] 
    },
    textAlign: { 
        max: 3, 
        labels: ['Izquierda', 'Centro', 'Derecha', 'Justificado'], 
        values: ['left', 'center', 'right', 'justify'] 
    },
    font: { 
        max: 1, 
        labels: ['Normal', 'Dyslexia'],
        classes: ['dyslexia-friendly'] 
    },
    colorblind: { 
        max: 1, 
        labels: ['Normal', 'Sin Color'],
        classes: ['colorblind-friendly'] 
    }
};

// Logos de tecnologías
const TECH_LOGOS = {
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
    'Supabase': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg',
    'NGINX': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nginx/nginx-original.svg',
    'MariaDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mariadb/mariadb-original.svg',
    'PHP': 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-plain.svg',
    'Java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
    'Blender': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg'
};

// Secuencia de arranque
const BOOT_SEQUENCE = [
    { text: 'THIANETIC OS v3.0...', delay: 400 },
    { text: 'INITIATING DYNAMIC CORE...', delay: 400 },
    { text: 'RENDER_MATRIX: ACTIVE', delay: 300 },
    { text: 'WELCOME_USER', delay: 200, final: true }
];

// Caracteres para efecto scramble
const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#_'; 