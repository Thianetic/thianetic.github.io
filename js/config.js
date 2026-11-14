// ===== FUENTE ÚNICA DE CONFIGURACIÓN Y CATÁLOGO DE PROYECTOS =====

export const APP_VERSION = '1.0.0';

export const CONTACT_EMAIL = 'thianetic@gmail.com';

export const PROFILE_INFO = {
    name: 'Thianetic',
    role: 'Full-Stack & DevSecOps',
    subtitle: 'Desarrollador Multiplataforma & DevSecOps (Backend, Cloud & IoT)',
    status: 'Open to Work · Incorporación Inmediata',
    experience: 'Full-Stack & DevSecOps en SITH (Marzo 2025 — Marzo 2026)',
    education: 'Técnico Superior DAM · Proyecto DAM TicketApp (10/10 Matrícula de Honor)',
    summary: 'Especialista en desarrollo integral de software de producción, provisión y hardening de servidores Linux/Debian (UFW, Fail2ban, SSH-ed25519, Docker, Nginx SSL), arquitecturas backend (FastAPI con uv, Node.js/Fastify con pnpm, PHP REST), apps nativas Android (Kotlin) y ecosistemas IoT/MQTT de ultra bajo consumo.',
    github: 'https://github.com/thianetic',
    linkedin: 'https://linkedin.com/in/thianetic-dev',
    email: CONTACT_EMAIL
};

export const ACCESSIBILITY_OPTIONS = {
    contrast: {
        max: 3,
        labels: ['Normal', 'Alto', 'Muy Alto', 'Terminal'],
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
        labels: ['Normal', 'Dislexia'],
        classes: ['dyslexia-friendly']
    },
    colorblind: {
        max: 1,
        labels: ['Normal', 'Monocromo'],
        classes: ['colorblind-friendly']
    }
};

export const DEFAULT_ACCESSIBILITY_STATE = {
    contrast: 0,
    textSize: 1,
    textAlign: 0,
    links: false,
    font: 0,
    animations: false,
    colorblind: 0
};

export const BOOT_SEQUENCE = [
    { text: `[OK] THIANETIC SEC-CORE v${APP_VERSION} INITIALIZED`, progress: 20, delay: 550 },
    { text: '[OK] KERNEL HARDENING: LINUX / DEBIAN 13 · UFW · FAIL2BAN · SSH-ED25519', progress: 48, delay: 600 },
    { text: '[OK] ECOSYSTEM: FASTAPI (UV) · NODE/FASTIFY (PNPM) · DOCKER · NGINX · SQLCIPHER', progress: 75, delay: 600 },
    { text: '[OK] IOT PROTOCOLS: MQTT · ZIGBEE2MQTT · HARDWARE TERMINALS (DEEP SLEEP)', progress: 92, delay: 600 },
    { text: '[>>] SESSION VERIFIED · LAUNCHING INTERFACE...', progress: 100, delay: 650, final: true }
];

export const HERO_TERMINAL_LINES = [
    { text: `THIANETIC CORE v${APP_VERSION} ... [ONLINE]`, delay: 120 },
    { text: 'HARDENING: LINUX (DEBIAN 13) · UFW · FAIL2BAN · SSH-ED25519 [ACTIVE]', delay: 140 },
    { text: 'DEVSECOPS & CLOUD: DOCKER · NGINX SSL · LOGROTATE · CRON [OPTIMIZED]', delay: 140 },
    { text: 'BACKEND & TOOLS: FASTAPI (UV) · NODE.JS (PNPM) · POSTGRESQL · SQLCIPHER [READY]', delay: 140 },
    { text: 'IOT SYSTEMS: MQTT BROKER · NFC/RFID ULTRA-LOW POWER TERMINALS [LINKED]', delay: 140 },
    { text: 'DEV_PROFILE: FULL-STACK & DEVSECOPS · OPEN TO WORK', delay: 120, final: true }
];

const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@2.16.0/icons';

export const TECH_LOGOS = {
    'Kotlin': `${DEVICON_BASE}/kotlin/kotlin-original.svg`,
    'Android Kotlin': `${DEVICON_BASE}/kotlin/kotlin-original.svg`,
    'Android SDK': `${DEVICON_BASE}/android/android-original.svg`,
    'Python': `${DEVICON_BASE}/python/python-original.svg`,
    'Python 3.12 (uv)': `${DEVICON_BASE}/python/python-original.svg`,
    'Python (uv)': `${DEVICON_BASE}/python/python-original.svg`,
    'Python CLI': `${DEVICON_BASE}/python/python-original.svg`,
    'Python MQTT': `${DEVICON_BASE}/python/python-original.svg`,
    'FastAPI': `${DEVICON_BASE}/fastapi/fastapi-original.svg`,
    'FastAPI (uv)': `${DEVICON_BASE}/fastapi/fastapi-original.svg`,
    'Node.js': `${DEVICON_BASE}/nodejs/nodejs-original.svg`,
    'Node.js 22': `${DEVICON_BASE}/nodejs/nodejs-original.svg`,
    'Vite': `${DEVICON_BASE}/vitejs/vitejs-original.svg`,
    'Vite (pnpm)': `${DEVICON_BASE}/vitejs/vitejs-original.svg`,
    'Debian 13': `${DEVICON_BASE}/debian/debian-original.svg`,
    'Linux Base': `${DEVICON_BASE}/linux/linux-original.svg`,
    'Linux / ARM64': `${DEVICON_BASE}/linux/linux-original.svg`,
    'Docker': `${DEVICON_BASE}/docker/docker-original.svg`,
    'PostgreSQL': `${DEVICON_BASE}/postgresql/postgresql-original.svg`,
    'MariaDB': `${DEVICON_BASE}/mariadb/mariadb-original.svg`,
    'SQLite': `${DEVICON_BASE}/sqlite/sqlite-original.svg`,
    'SQLCipher': `${DEVICON_BASE}/sqlite/sqlite-original.svg`,
    'Redis': `${DEVICON_BASE}/redis/redis-original.svg`,
    'Firebase': `${DEVICON_BASE}/firebase/firebase-plain.svg`,
    'HTML5 Canvas': `${DEVICON_BASE}/html5/html5-original.svg`,
    'Three.js': `${DEVICON_BASE}/threejs/threejs-original.svg`,
    'Three.js r160': `${DEVICON_BASE}/threejs/threejs-original.svg`,
    'Vanilla JS': `${DEVICON_BASE}/javascript/javascript-original.svg`,
    'JavaScript': `${DEVICON_BASE}/javascript/javascript-original.svg`,
    'Bash': `${DEVICON_BASE}/bash/bash-original.svg`,
    'PowerShell': `${DEVICON_BASE}/powershell/powershell-original.svg`,
    'Unity': `${DEVICON_BASE}/unity/unity-original.svg`,
    'C#': `${DEVICON_BASE}/csharp/csharp-original.svg`,
    'PHP REST': `${DEVICON_BASE}/php/php-plain.svg`,
    'NGINX': `${DEVICON_BASE}/nginx/nginx-original.svg`,
    'Raspberry Pi': `${DEVICON_BASE}/raspberrypi/raspberrypi-original.svg`,
    'Java': `${DEVICON_BASE}/java/java-original.svg`
};

export const PROJECT_CATALOG = {
    'kronopulse': {
        title: 'KronoPulse — Sistema de Control de Presencia SaaS & Subsistema IoT',
        cardTitle: 'KronoPulse',
        status: 'SAAS B2B & HARDWARE IOT',
        image: null,
        summary: 'Control de presencia SaaS multi-inquilino (Fastify, Prisma, MariaDB, Redis) con terminal hardware IoT autónomo (Microcontrolador + Lector NFC/RFID con Deep Sleep y Trigger Infrarrojo).',
        description: 'Sistema completo de control de presencia y gestión horaria multi-inquilino. Compuesto por backend asíncrono de alto rendimiento (Node.js 22 LTS, Fastify, Prisma ORM, Lucia Auth, MariaDB y Redis), portal web responsivo en Vanilla JS con Tailwind CSS y un subsistema hardware IoT autónomo para fichaje físico con tarjeta.',
        technologies: ['Node.js 22', 'Fastify', 'Prisma ORM', 'MariaDB', 'Redis', 'IoT Hardware', 'Docker Compose'],
        codeUrl: 'https://github.com/thianetic',
        features: [
            'Arquitectura SaaS Multi-Inquilino modular: Auth (Lucia en BD), records, horarios, solicitudes de vacaciones y reportes analíticos con exportación PDF',
            'Subsistema Hardware IoT de Fichaje Físico: Terminal autónomo basado en Microcontrolador + Lector NFC/RFID con gestión Ultra-Low Power Deep Sleep y Trigger Infrarrojo exterior (despertar instantáneo por presencia y consumo en reposo en microamperios para meses de autonomía en batería)',
            'Base de datos transaccional con MariaDB 10.11 y capa de caché ultrarrápida con Redis 7.x',
            'Infraestructura containerizada completa bajo Docker Compose y Nginx Reverse Proxy'
        ]
    },
    'ticketapp': {
        title: 'TicketApp — Sistema Integral de Ticketing & Incidencias',
        cardTitle: 'TicketApp — Sistema Integral de Ticketing & Incidencias',
        status: 'DAM 10/10 · MATRÍCULA DE HONOR',
        image: 'img/ticketapp-android.png',
        summary: 'Ecosistema completo de gestión de incidencias corporativas (DAM 10/10): aplicación nativa Android en Kotlin, panel web corporativo, API RESTful y persistencia multi-opción (SQLite local, MariaDB autoalojada o Cloud Firebase).',
        description: 'Ecosistema completo de gestión de incidencias corporativas desarrollado como Proyecto de desarrollo de aplicaciones multiplataforma (calificado con 10/10 y Matrícula de Honor): aplicación nativa Android en Kotlin, panel web de administración, API RESTful y arquitectura desacoplada con persistencia multi-opción (SQLite local, servidor MariaDB/MySQL autoalojado o Cloud Firebase).',
        technologies: ['Android Kotlin', 'Panel Web', 'PHP REST', 'SQLite / MariaDB', 'Firebase'],
        codeUrl: 'https://github.com/thianetic',
        features: [
            'Proyecto de desarrollo de aplicaciones multiplataforma (DAM) con Calificación 10/10 (Sobresaliente y Matrícula de Honor)',
            'MVP Full-Stack completo: Aplicación móvil nativa en Android, panel web de administración y API backend',
            'Arquitectura de persistencia flexible: soporte intercambiable para SQLite local, servidor relacional autoalojado (MariaDB/MySQL) y Cloud (Firebase Firestore/Auth)',
            'Gestión de tickets, priorización de incidencias, estados en tiempo real y asignación de operadores',
            'Diseño de interfaces intuitivas y limpias tanto en cliente móvil como en el dashboard corporativo'
        ]
    },
    'sith-horario': {
        title: 'SaaS Registro Horario SITH',
        cardTitle: 'SaaS Registro Horario SITH',
        status: 'PRODUCCIÓN B2B · SITH',
        image: null,
        summary: 'Control de jornada legal, geolocalización de fichajes e incidencias. Frontend modular en Vanilla JS, panel de administración corporativo, backend RESTful en PHP con MariaDB dockerizada y app nativa Android en Kotlin. Demos a clientes corporativos y provisión de instancias.',
        description: 'Plataforma SaaS multi-empresa para control legal de jornada laboral, geolocalización de fichajes y gestión de incidencias. Desarrollada íntegramente en solitario sobre VPS Debian 13 bastionado, con frontend en Vanilla JS, panel de administración, API REST en PHP con MariaDB dockerizada y app nativa Android en Kotlin.',
        technologies: ['Debian 13', 'Docker', 'Nginx SSL', 'PHP REST', 'MariaDB', 'Android Kotlin'],
        codeUrl: '#',
        features: [
            'Arquitectura Full-Stack completa: Frontend Vanilla JS, Panel Web corporativo y App Android nativa (Kotlin)',
            'Backend con API REST segura en PHP y base de datos MariaDB aislada en contenedores Docker',
            'Servidor Nginx como Reverse Proxy con certificados TLS/SSL automatizados',
            'Infraestructura bare-metal en Debian 13 VPS securizada desde cero con UFW, Fail2ban y claves SSH-ed25519',
            'Gestión de jornadas laborales, geolocalización de fichajes e informes de cumplimiento normativo',
            'Demostraciones directas a empresas cliente y aprovisionamiento de instancias en producción'
        ]
    },
    'sith-iot': {
        title: 'Plataforma IoT de Telemetría y Dosificación Agroindustrial (MQTT & Kotlin)',
        cardTitle: 'Plataforma IoT de Telemetría y Dosificación Agroindustrial (MQTT & Kotlin)',
        status: 'PRODUCCIÓN IOT · SITH',
        image: null,
        summary: 'Control y supervisión remota de dispensación y alimentación agropecuaria. Broker MQTT dockerizado en Python, emulador software en Python para tests de carga y fallos de red, dashboard web y app nativa Android en Kotlin para dosificación y alertas.',
        description: 'Sistema integral de telemetría y control remoto de maquinaria de alimentación agropecuaria (consulta de estado en tiempo real, dispensación remota, programación de horarios e historial). Compuesto por broker MQTT dockerizado en Python, simulador de hardware para pruebas de carga, panel web y app nativa Android en Kotlin.',
        technologies: ['Python MQTT', 'Android Kotlin', 'Docker', 'Hardware Sim', 'Web Dashboard'],
        codeUrl: '#',
        features: [
            'Control y supervisión en tiempo real de maquinaria de dosificación y alimentación en explotaciones agropecuarias',
            'Broker y backend MQTT containerizado en Docker con procesamiento asíncrono en Python',
            'Simulador software completo en Python para testear cargas de red, reconexiones y actuadores en entorno virtual',
            'App nativa Android en Kotlin para dispensación manual, cambio de horarios y consulta de última dosificación',
            'Protocolo ligero optimizado para conectividad móvil en entornos rurales de alta latencia'
        ]
    },
    'own-cipher-book': {
        title: 'own-cipher-book (OCB) — Registro Criptográfico Zero-Knowledge',
        cardTitle: 'own-cipher-book (OCB)',
        status: 'CRIPTOGRAFÍA & SEGURIDAD',
        image: null,
        summary: 'Registro seguro y autoalojado de contactos y notas confidenciales con Zero-Knowledge, cifrado dual (SQLCipher AES-256 en reposo + JWE en tránsito), autenticación biométrica local (ML Kit en Android) y arquitectura cliente-servidor FastAPI + Vite/Web Components.',
        description: 'Registro seguro y autoalojado de contactos y notas confidenciales con Zero-Knowledge, cifrado dual (SQLCipher AES-256 en reposo + JWE en tránsito), autenticación biométrica local (ML Kit en Android) y arquitectura cliente-servidor FastAPI + Vite/Web Components.',
        technologies: ['FastAPI (uv)', 'SQLCipher AES-256', 'JWE / JWS', 'Vite (pnpm)', 'Web Components', 'ML Kit Biometrics'],
        codeUrl: 'https://github.com/thianetic',
        features: [
            'Arquitectura Zero-Knowledge: Ningún secreto ni credencial sensible se procesa en texto plano',
            'Cifrado en reposo mediante SQLCipher (AES-256) y cifrado de payload en tránsito extremo a extremo con JWE (RSA-OAEP-256 + A256GCM)',
            'Autenticación biométrica 100% local en Android mediante ML Kit y verificación por similitud coseno en servidor (sin dependencias en la nube)',
            'Backend moderno con Python 3.12, FastAPI, SQLAlchemy 2.0 y gestión de dependencias con Astral uv',
            'Frontend desacoplado con Vite, Web Components nativos, Proxy ES6 reactivo y Tailwind CSS bajo pnpm'
        ]
    },
    'troposfera': {
        title: 'TropoScan — Telemetría Ambiental & Calidad del Aire',
        cardTitle: 'TropoScan',
        status: 'TELEMETRÍA & DATOS',
        image: null,
        summary: 'Servicio de captura, normalización y análisis de calidad del aire y variables meteorológicas con arquitectura dual-source resiliente, caché precalculada y alertas predictivas (Regla 30-30-30).',
        description: 'Servicio Python de alta resiliencia para monitorización y análisis de calidad del aire, ruido y variables meteorológicas en tiempo real. Implementa arquitectura dual-source con fallback automático, pre-cálculo en caché JSON y detección predictiva de eventos climáticos e incendios.',
        technologies: ['Python 3.12 (uv)', 'FastAPI', 'SQLAlchemy', 'APScheduler', 'Tailwind CSS', 'Apache ECharts', 'Ruff'],
        codeUrl: 'https://github.com/thianetic',
        features: [
            'Arquitectura Dual-Source Resiliente con conmutación por error automática entre fuentes de datos',
            'Motor de agregación estadística precalculada en caché JSON para consultas instantáneas de alto rendimiento',
            'Sistema de alertas inteligentes: Detección preventiva de caídas barométricas (tormentas), umbrales normativos de ICA y riesgo forestal (Regla 30-30-30 y escala de 5 niveles)',
            'Dashboard web interactivo con visualización en tiempo real mediante Apache ECharts y panel de diagnóstico /status.html',
            'Despliegue y optimización específica para servidores Linux (Debian) y plataformas ARM64 (Raspberry Pi)'
        ]
    },
    'port-scan': {
        title: 'Monitor de Puertos (`port-scan`) — TUI, Daemon & Auditoría Forense',
        cardTitle: 'Monitor de Puertos',
        status: 'DEVSECOPS & FORENSE',
        image: null,
        summary: 'Monitor de sockets TCP/UDP en tiempo real con TUI Textual, modo daemon, persistencia SQLite WAL, servidor Prometheus y hash-chaining SHA-256 para auditoría forense.',
        description: 'Servicio de monitorización en tiempo real de sockets TCP/UDP con interfaz TUI interactiva (Textual), modo daemon/headless, persistencia SQLite transaccional (WAL), métricas Prometheus y hash-chaining SHA-256 para auditoría forense.',
        technologies: ['Python (uv)', 'Textual TUI', 'SQLite WAL', 'Prometheus Metrics', 'SHA-256 Forensics', 'TOCTOU Mitigation'],
        codeUrl: 'https://github.com/thianetic',
        features: [
            'Interfaz TUI interactiva en tiempo real con Textual: filtrado de sockets, inspección de PIDs y auto-kill seguro',
            'Modo servicio continuo en segundo plano (daemon Linux o servicio Windows pywin32) con motor de políticas Enforcer',
            'Persistencia histórica transaccional en SQLite WAL con agregados por IP remota',
            'Observabilidad integral: Servidor de métricas HTTP Prometheus (/metrics en puerto 9100) y API REST local de diagnóstico (/ips, /kills en puerto 9200)',
            'Garantía de integridad forense mediante hash-chaining SHA-256 en registro de eventos y mitigación rigurosa de TOCTOU'
        ]
    },
    'py-devkiller': {
        title: 'DevKiller TUI — Limpieza & Desbloqueo Seguro de Procesos',
        cardTitle: 'DevKiller TUI',
        status: 'DEVOPS TOOL',
        image: null,
        summary: 'Herramienta interactiva para purga de procesos huérfanos de desarrollo (Python/uv, Node.js/pnpm, Java) con mitigación de TOCTOU y validación temporal de PIDs.',
        description: 'Herramienta CLI/TUI interactiva desarrollada con Rich para identificar y purgar procesos huérfanos de entornos de desarrollo (Python/uv, Node.js/pnpm, Java/Spring Boot) que retienen sockets o puertos bloqueados, con validación anti-reciclaje de PIDs (TOCTOU).',
        technologies: ['Python (uv)', 'Rich TUI', 'Multiplataforma', 'Inno Setup 6', 'Quality Gate (Ruff/Mypy)'],
        codeUrl: 'https://github.com/thianetic',
        features: [
            'Detección y agrupamiento visual por lenguaje: Python (uv), Node.js (pnpm, npm) y Java (Maven, Gradle)',
            'Limpieza visual de comandos largos (decluttering) para simplificar la lectura de subprocesos complejos',
            'Seguridad TOCTOU: Verificación de timestamp e identificador antes del cierre forzado para evitar colisiones por reciclaje de PIDs',
            'Paridad multiplataforma con scripts de calidad DevOps automatizados (Ruff, Mypy, PSScriptAnalyzer) e instalador standalone'
        ]
    },
    'web-game-trains': {
        title: 'Mesa de Trenes: Red Global — Simulador & Control Ferroviario',
        cardTitle: 'Mesa de Trenes: Red Global',
        status: 'SIMULADOR 3D / 2D CTC',
        image: null,
        summary: 'Simulador ferroviario con doble interfaz (Diorama 3D WebGL Three.js + Puesto 2D CTC), SharedWorker autoritativo a 20 Hz, cantones BAB, LZB/ERTMS y señalización ASFA.',
        description: 'Simulador ferroviario y logístico en tiempo real con doble interfaz operativa (Diorama 3D WebGL con Three.js e InstancedMesh + Puesto Central de Mando 2D CTC con enclavamientos industriales, cantones BAB, LZB/ERTMS y señalización ASFA Meta 40).',
        technologies: ['Vite (pnpm)', 'Three.js (r160)', 'JavaScript ES2022+', 'SharedWorker 20Hz', 'IndexedDB v7', 'Vitest'],
        codeUrl: 'https://github.com/thianetic',
        features: [
            'Simulación autoritativa desacoplada en segundo plano mediante SharedWorker a 20 Hz (física, lógica de cantones y balance económico continuos sin interrupción)',
            'Doble interfaz sincronizada vía BroadcastChannel: Diorama 3D fotorrealista WebGL + Puesto de Mando 2D CTC industrial libre de DOM thrashing',
            'Señalización reglamentaria estricta: Bloqueo Automático en Vía Banalizada (BAB), supervisión continua LZB/ERTMS, balizas físicas ASFA y enclavamientos atómicos en cruzamientos',
            'Persistencia atómica en IndexedDB (MesaDeTrenesDB) con esquema JSON v7 y suite de tests automáticos en Vitest'
        ]
    },
    'dermapp': {
        title: 'DermApp — Seguimiento Clínico Dermatológico',
        cardTitle: 'DermApp',
        status: 'ANDROID NATIVO',
        image: 'img/dermapp-android.png',
        summary: 'Aplicación móvil para seguimiento dermatológico y adherencia a tratamientos clínicos. Desarrollada en Kotlin nativo con almacenamiento local seguro en SQLite, recordatorios de medicación y comparativa fotográfica temporal.',
        description: 'Aplicación móvil para seguimiento dermatológico y adherencia a tratamientos clínicos. Desarrollada en Kotlin nativo sobre Android SDK con almacenamiento local seguro en SQLite, recordatorios de medicación y comparativa fotográfica temporal.',
        technologies: ['Android SDK', 'Kotlin', 'SQLite', 'Clean Architecture'],
        codeUrl: 'https://github.com/thianetic/dermapp',
        features: [
            'Aplicación móvil para seguimiento dermatológico y registro estructurado de evolución clínica',
            'Desarrollo nativo en Kotlin sobre Android SDK priorizando rendimiento y bajo consumo',
            'Almacenamiento local seguro en SQLite garantizando la privacidad absoluta de los datos del paciente',
            'Sistema de recordatorios programados de tratamiento y seguimiento fotográfico comparativo'
        ]
    },
    'laberinto': {
        title: 'Laberinto de las Monedas — Físicas & Simulación 3D',
        cardTitle: 'Laberinto de las Monedas',
        status: 'UNITY 3D / C#',
        image: 'img/laberinto-unity.png',
        summary: 'Videojuego 3D completo en Unity con programación en C#: simulación física dinámica de colisiones, mecánicas de aceleración y balanceo, cronometraje de precisión y optimización para hardware heterogéneo.',
        description: 'Videojuego 3D completo desarrollado en Unity con programación en C#: simulación física dinámica de colisiones, mecánicas de aceleración y balanceo, cronometraje de precisión y optimización de rendimiento para hardware heterogéneo.',
        technologies: ['Unity', 'C#', 'Físicas 3D', 'Cinemática'],
        codeUrl: 'https://github.com/thianetic/laberinto-monedas',
        features: [
            'Videojuego 3D completo desarrollado en Unity con arquitectura de scripts desacoplada en C#',
            'Física dinámica de esferas, detección precisa de colisiones e interacción con escenarios dinámicos',
            'Sistema de cronometraje de precisión, recolección progresiva y niveles de dificultad',
            'Optimización de draw-calls y cálculo vectorial de aceleración'
        ]
    },
    'cluster-iot': {
        title: 'Cluster Local de Servicios & Domótica IoT (Linux ARM64)',
        cardTitle: 'Cluster Local de Servicios & Domótica IoT (Linux ARM64)',
        status: 'INFRAESTRUCTURA 24/7',
        image: null,
        summary: 'Diseño, despliegue y mantenimiento de un cluster local privado basado en arquitectura ARM64 Linux en operación continua 24/7, dedicado a pasarelas domóticas de sensores y actuadores, broker de mensajería asíncrona MQTT y bots interactivos de Telegram para monitorización y alertas de seguridad.',
        description: 'Infraestructura privada multi-nodo en arquitectura Linux ARM64 en operación continua 24/7 con pasarela domótica Zigbee2MQTT, broker Mosquitto autenticado con ACLs, DNS local privado, copias de seguridad cifradas y suite de bots interactivos de Telegram.',
        technologies: ['Linux ARM64', 'Docker Compose', 'Zigbee2MQTT', 'Mosquitto MQTT', 'Telegram Bots', 'DNS Seguro', 'Bash'],
        codeUrl: '#',
        features: [
            'Cluster privado de nodos ARM64 Linux ejecutando servicios containerizados con alta disponibilidad 24/7',
            'Gateway domótico Zigbee2MQTT con pasarela local para red mallada de sensores y actuadores',
            'Broker central Mosquitto MQTT con autenticación estricta y listas de control de acceso (ACLs)',
            'Suite de bots de Telegram interactivos para alertas perimetrales críticas en tiempo real y ejecución de comandos securizados',
            'Segmentación de red local, DNS privado con filtrado y políticas automáticas de backup cifrado y rotación de registros'
        ]
    }
};
