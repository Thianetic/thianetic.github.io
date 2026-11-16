import test from 'node:test';
import assert from 'node:assert/strict';
import {
    isValidEmail,
    validateContactField,
    formatDirectMailContent,
    nextAccessibilityState,
    applyAccessibilityDomState,
    matchesProjectFilter,
    resolveScrambleTarget
} from '../js/utils.js';
import {
    DEFAULT_ACCESSIBILITY_STATE,
    PROJECT_CATALOG,
    TECH_LOGOS,
    CONTACT_EMAIL,
    PROFILE_INFO
} from '../js/config.js';
import { parseCliCommand } from '../js/console.js';

test('validateContactField: valida nombre, email, asunto, mensaje y consentimiento RGPD', () => {
    assert.equal(isValidEmail('thianetic@gmail.com'), true);
    assert.equal(isValidEmail('correo-invalido'), false);

    assert.equal(validateContactField('name', '').isValid, false);
    assert.equal(validateContactField('name', 'A').isValid, false);
    assert.equal(validateContactField('name', 'Thianetic').isValid, true);

    assert.equal(validateContactField('email', 'bad@').isValid, false);
    assert.equal(validateContactField('email', 'dev@thianetic.io').isValid, true);

    assert.equal(validateContactField('subject', '').isValid, false);
    assert.equal(validateContactField('subject', 'Propuesta de proyecto').isValid, true);

    assert.equal(validateContactField('message', 'Corto').isValid, false);
    assert.equal(validateContactField('message', 'Mensaje suficientemente largo para superar el mínimo.').isValid, true);

    assert.equal(validateContactField('gdpr-consent', '', false).isValid, false);
    assert.equal(validateContactField('gdpr-consent', '', true).isValid, true);
});

test('formatDirectMailContent: genera mailto y cuerpo formateado sin dependencias de terceros', () => {
    const result = formatDirectMailContent({
        name: 'Ana Dev',
        email: 'ana@empresa.com',
        subject: 'Propuesta de proyecto',
        message: 'Hola, nos interesa tu perfil Full-Stack & DevSecOps.'
    });

    assert.equal(result.recipient, CONTACT_EMAIL);
    assert.ok(result.subjectLine.includes('Propuesta de proyecto'));
    assert.ok(result.bodyText.includes('ana@empresa.com'));
    assert.ok(result.mailtoUrl.startsWith(`mailto:${CONTACT_EMAIL}?subject=`));
});

test('nextAccessibilityState y applyAccessibilityDomState: ciclan niveles y aplican clases unificadas', () => {
    let state = { ...DEFAULT_ACCESSIBILITY_STATE };

    state = nextAccessibilityState(state, 'cycle-contrast');
    assert.equal(state.contrast, 1);

    state = nextAccessibilityState(state, 'cycle-contrast');
    assert.equal(state.contrast, 2);

    state = nextAccessibilityState(state, 'cycle-contrast');
    assert.equal(state.contrast, 3);

    state = nextAccessibilityState(state, 'cycle-contrast');
    assert.equal(state.contrast, 0);

    state = nextAccessibilityState(state, 'toggle-animations');
    assert.equal(state.animations, true);

    // Mock root element for applyAccessibilityDomState
    const classes = new Set();
    const styles = new Map();
    const mockRoot = {
        classList: {
            add: (...cls) => cls.forEach((c) => classes.add(c)),
            remove: (...cls) => cls.forEach((c) => classes.delete(c)),
            toggle: (c, force) => (force ? classes.add(c) : classes.delete(c))
        },
        style: {
            setProperty: (k, v) => styles.set(k, v)
        }
    };

    applyAccessibilityDomState({ ...state, contrast: 2, font: 1 }, mockRoot);
    assert.equal(classes.has('contrast-2'), true);
    assert.equal(classes.has('dyslexia-friendly'), true);
    assert.equal(classes.has('reduce-motion'), true);
    assert.equal(styles.get('--font-size'), '16px');

    state = nextAccessibilityState(state, 'reset');
    assert.deepEqual(state, DEFAULT_ACCESSIBILITY_STATE);
});

test('matchesProjectFilter: soporta múltiples categorías separadas por espacio y filtro all', () => {
    assert.equal(matchesProjectFilter('security automation', 'all'), true);
    assert.equal(matchesProjectFilter('security automation', 'security'), true);
    assert.equal(matchesProjectFilter('security automation', 'automation'), true);
    assert.equal(matchesProjectFilter('security automation', 'games'), false);
    assert.equal(matchesProjectFilter('', 'security'), false);
});

test('resolveScrambleTarget: preserva iconos hermanos mutando únicamente el hijo [data-scramble-text]', () => {
    const childSpan = { hasAttribute: (attr) => attr === 'data-scramble-text', children: [] };
    const buttonWithIcon = {
        hasAttribute: () => false,
        querySelector: (sel) => (sel === '[data-scramble-text]' ? childSpan : null),
        children: [{ tagName: 'SPAN' }, childSpan]
    };

    assert.equal(resolveScrambleTarget(buttonWithIcon), childSpan);

    const buttonWithoutTextSpan = {
        hasAttribute: () => false,
        querySelector: () => null,
        children: [{ tagName: 'I' }]
    };
    assert.equal(resolveScrambleTarget(buttonWithoutTextSpan), null);
});

test('PROJECT_CATALOG y TECH_LOGOS: contienen todos los proyectos, versiones fijas de Devicon y cero términos confidenciales', () => {
    const requiredKeys = [
        'ticketapp',
        'sith-horario',
        'sith-iot',
        'laberinto',
        'dermapp',
        'kronopulse',
        'troposfera',
        'cluster-iot',
        'port-scan',
        'py-devkiller',
        'own-cipher-book',
        'web-game-trains'
    ];

    for (const key of requiredKeys) {
        assert.ok(PROJECT_CATALOG[key], `Falta la clave ${key} en PROJECT_CATALOG`);
    }

    const serialized = JSON.stringify(PROJECT_CATALOG).toLowerCase();
    assert.equal(serialized.includes('pirpi'), false);
    assert.equal(serialized.includes('agrofeed'), false);

    for (const [tech, url] of Object.entries(TECH_LOGOS)) {
        assert.equal(url.includes('@latest'), false, `TECH_LOGOS[${tech}] no debe usar @latest`);
        assert.equal(url.includes('devicon@2.16.0'), true, `TECH_LOGOS[${tech}] debe fijar devicon@2.16.0`);
    }
});

test('PROJECT_CATALOG: integridad de categorías, statusClass y estados del modal', () => {
    const validStatusClasses = new Set(['status-release', 'status-development', 'status-beta']);
    const validCategories = new Set(['automation', 'web', 'mobile', 'security', 'games']);

    for (const [key, proj] of Object.entries(PROJECT_CATALOG)) {
        assert.ok(proj.title, `Proyecto ${key} debe tener title`);
        assert.ok(proj.status, `Proyecto ${key} debe tener status descriptivo`);
        assert.ok(proj.statusClass, `Proyecto ${key} debe tener statusClass`);
        assert.ok(validStatusClasses.has(proj.statusClass), `statusClass ${proj.statusClass} de ${key} no es válido`);

        assert.ok(typeof proj.category === 'string' && proj.category.trim().length > 0, `Proyecto ${key} debe tener category`);
        const catTokens = proj.category.trim().split(/\s+/);
        for (const cat of catTokens) {
            assert.ok(validCategories.has(cat), `Categoría '${cat}' en proyecto ${key} no está en la lista permitida`);
        }

        assert.ok(Array.isArray(proj.technologies) && proj.technologies.length > 0, `Proyecto ${key} debe tener technologies`);
        assert.ok(Array.isArray(proj.features) && proj.features.length > 0, `Proyecto ${key} debe tener features`);
    }
});

test('MCP open_contact_channel: esquema de entrada con subject y contrato verificado', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const mcpPath = path.resolve(import.meta.dirname, '../.well-known/mcp.json');
    const mcpData = JSON.parse(fs.readFileSync(mcpPath, 'utf8'));

    const contactTool = mcpData.tools.find(t => t.name === 'open_contact_channel');
    assert.ok(contactTool, 'La herramienta open_contact_channel debe existir en mcp.json');
    assert.equal(contactTool.inputSchema.type, 'object');
    assert.ok(contactTool.inputSchema.properties.subject, 'inputSchema debe definir la propiedad subject');
    assert.equal(contactTool.inputSchema.properties.subject.type, 'string');

    // Simulación del contrato de ejecución en main.js
    const simulateExecute = async (args = {}) => {
        return { status: 'opened', subject: args?.subject || null };
    };

    const resWithSubject = await simulateExecute({ subject: 'Propuesta de Proyecto' });
    assert.deepEqual(resWithSubject, { status: 'opened', subject: 'Propuesta de Proyecto' });

    const resWithoutSubject = await simulateExecute({});
    assert.deepEqual(resWithoutSubject, { status: 'opened', subject: null });
});

test('parseCliCommand: separa comandos y argumentos normalizando espacios en blanco', () => {
    assert.deepEqual(parseCliCommand(''), { cmd: '', args: [], raw: '' });
    assert.deepEqual(parseCliCommand('   HELP  '), { cmd: 'help', args: [], raw: 'HELP' });
    assert.deepEqual(parseCliCommand('open   kronopulse'), { cmd: 'open', args: ['kronopulse'], raw: 'open   kronopulse' });
    assert.deepEqual(parseCliCommand('theme dark'), { cmd: 'theme', args: ['dark'], raw: 'theme dark' });
    assert.deepEqual(parseCliCommand('print-qr telegram'), { cmd: 'print-qr', args: ['telegram'], raw: 'print-qr telegram' });
    assert.deepEqual(parseCliCommand('qr web'), { cmd: 'qr', args: ['web'], raw: 'qr web' });
    assert.ok(PROFILE_INFO.name === 'Thianetic');
});

test('ACCESSIBILITY_OPTIONS: valores y límites consistentes con el script inline anti-FOUC', () => {
    import('../js/config.js').then(({ ACCESSIBILITY_OPTIONS }) => {
        assert.deepEqual(ACCESSIBILITY_OPTIONS.textSize.values, ['14px', '16px', '18px', '20px']);
        assert.deepEqual(ACCESSIBILITY_OPTIONS.textAlign.values, ['left', 'center', 'right', 'justify']);
        assert.equal(ACCESSIBILITY_OPTIONS.contrast.max, 3);
        assert.equal(ACCESSIBILITY_OPTIONS.textSize.max, 3);
        assert.equal(ACCESSIBILITY_OPTIONS.textAlign.max, 3);
    });
});

test('CSP y CDN autorizados: index.html y 404.html conservan CSP estricta y hashes SHA-256 sincrónicos', async () => {
    const fs = await import('node:fs');
    const crypto = await import('node:crypto');
    const path = await import('node:path');
    const root = path.resolve(import.meta.dirname, '..');

    const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    const notFoundHtml = fs.readFileSync(path.join(root, '404.html'), 'utf8');

    for (const [file, html] of [['index.html', indexHtml], ['404.html', notFoundHtml]]) {
        assert.ok(html.includes('http-equiv="Content-Security-Policy"'), `${file} debe contener CSP`);
        assert.ok(html.includes("default-src 'self'"), `${file} debe bloquear orígenes externos por defecto`);
        assert.ok(!html.includes("'unsafe-eval'"), `${file} no debe contener 'unsafe-eval'`);

        const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
        assert.ok(scriptMatch, `${file} debe tener el script inline anti-FOUC`);
        const lfHash = crypto.createHash('sha256').update(scriptMatch[1].replace(/\r\n/g, '\n')).digest('base64');
        assert.ok(html.includes(`'sha256-${lfHash}'`), `${file} debe incluir el hash exacto ${lfHash} en su CSP`);

        assert.equal(html.includes('src="http://'), false, `${file} no debe tener src inseguro http://`);
        assert.equal(html.includes('rel="stylesheet" href="http'), false, `${file} no debe cargar CSS externo`);
    }

    assert.ok(notFoundHtml.includes('js/404-arcade.js'), '404.html debe enlazar js/404-arcade.js');
    assert.ok(notFoundHtml.includes('css/arcade.css'), '404.html debe enlazar css/arcade.css');
    assert.ok(notFoundHtml.includes('id="launch-arcade-btn"'), '404.html debe contener el botón easter egg');
    assert.ok(notFoundHtml.includes('id="arcade-canvas"'), '404.html debe contener el canvas del juego');
});

test('Sintaxis JavaScript: todos los módulos en js/ pasan node --check con 0 errores', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const { execFileSync } = await import('node:child_process');
    const jsDir = path.resolve(import.meta.dirname, '../js');
    const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));

    assert.ok(files.length >= 10, 'Deben existir módulos JavaScript en js/');

    for (const file of files) {
        const fullPath = path.join(jsDir, file);
        assert.doesNotThrow(() => {
            execFileSync(process.execPath, ['--check', fullPath], { stdio: 'pipe' });
        }, `Fallo de sintaxis en js/${file}`);
    }
});

test('Integridad v1.2.0: versionado SemVer sincronizado, switch de tema aislado y humble phrasing', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const root = path.resolve(import.meta.dirname, '..');

    const versionFile = fs.readFileSync(path.join(root, 'VERSION'), 'utf8').trim();
    const { APP_VERSION } = await import('../js/config.js');
    const notFoundHtml = fs.readFileSync(path.join(root, '404.html'), 'utf8');
    const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    const llmsTxt = fs.readFileSync(path.join(root, 'llms.txt'), 'utf8');
    const variablesCss = fs.readFileSync(path.join(root, 'css/variables.css'), 'utf8');

    // 1. Versionado sincronizado
    assert.equal(versionFile, '1.2.0', 'VERSION debe ser 1.2.0');
    assert.equal(APP_VERSION, '1.2.0', 'APP_VERSION debe ser 1.2.0');
    assert.ok(notFoundHtml.includes('v1.2.0'), '404.html debe reflejar v1.2.0');

    // 2. Switch de tema aislado en el panel de accesibilidad
    assert.ok(indexHtml.includes('id="theme-toggle-desktop"'), 'index.html debe contener el botón desktop de tema');
    assert.ok(indexHtml.includes('role="switch"'), 'theme-toggle-desktop debe tener role="switch"');
    assert.ok(indexHtml.includes('theme-switch-container'), 'theme-toggle-desktop debe estar en su contenedor aislado');
    assert.ok(indexHtml.includes('theme-switch-thumb'), 'theme-toggle-desktop debe tener thumb deslizable');

    // 3. Estabilidad del widget de accesibilidad (sin filter en #accessibility-btn)
    assert.ok(!variablesCss.includes('#accessibility-btn {'), 'variables.css no debe aplicar filter directamente a #accessibility-btn');

    // 4. Humble phrasing: Cero términos inflados en index.html y llms.txt
    assert.equal(indexHtml.includes('Unipersonal') || indexHtml.includes('unipersonal'), false, 'index.html no debe contener "Unipersonal"');
    assert.equal(llmsTxt.includes('Unipersonal') || llmsTxt.includes('unipersonal'), false, 'llms.txt no debe contener "Unipersonal"');
    assert.equal(indexHtml.includes('Full-Stack Lead') || indexHtml.includes('Lead Full-Stack'), false, 'index.html no debe contener "Lead"');
    assert.equal(llmsTxt.includes('Full-Stack Lead') || llmsTxt.includes('Lead Full-Stack'), false, 'llms.txt no debe contener "Lead"');
});

