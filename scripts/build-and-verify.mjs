#!/usr/bin/env node

/**
 * build-and-verify.mjs
 * Script de validación estricta y empaquetado de producción para Thianetic Portfolio (GitHub Pages).
 * Sin dependencias externas (Node.js estándar: fs, path, crypto).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SITE_DIR = path.resolve(ROOT_DIR, '_site');

const MAX_INITIAL_PAYLOAD_KB = 500;

console.log('====================================================');
console.log('🚀 THIANETIC PORTFOLIO — BUILD & QUALITY VERIFICATION');
console.log('====================================================\n');

// 0. Comprobación Estricta de Sintaxis en Módulos JavaScript (node --check)
console.log('🔍 Paso 0: Verificando sintaxis e integridad de todos los módulos JavaScript...');
const jsDir = path.join(ROOT_DIR, 'js');
const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
for (const file of jsFiles) {
    const fullPath = path.join(jsDir, file);
    try {
        execFileSync(process.execPath, ['--check', fullPath], { stdio: 'pipe' });
    } catch (err) {
        console.error(`❌ Error de sintaxis en js/${file}:`);
        console.error(err.stderr ? err.stderr.toString() : err.message);
        process.exit(1);
    }
}
console.log(`✅ ${jsFiles.length} módulos JS analizados con 0 errores de sintaxis.`);

// 1. Verificación de Enlaces y Recursos Locales (0 errores 404)
console.log('🔍 Paso 1: Verificando integridad de enlaces y assets locales...');
const filesToCheck = ['index.html', '404.html'];
const brokenAssets = [];
const externalCdnReferences = [];

for (const htmlFile of filesToCheck) {
    const htmlPath = path.join(ROOT_DIR, htmlFile);
    if (!fs.existsSync(htmlPath)) {
        throw new Error(`[ERROR] Archivo crítico no encontrado: ${htmlFile}`);
    }

    const content = fs.readFileSync(htmlPath, 'utf8');

    // Buscar src, href (link tags, img, scripts)
    const attrRegex = /(?:src|href)=["']([^"'#?]+)(?:\?[^"']*)?["']/gi;
    let match;

    while ((match = attrRegex.exec(content)) !== null) {
        const url = match[1].trim();

        // Ignorar esquemas seguros o protocolos externos permitidos en enlaces
        if (
            url.startsWith('mailto:') ||
            url.startsWith('data:') ||
            url.startsWith('javascript:') ||
            url === '#' ||
            url === ''
        ) {
            continue;
        }

        // Detección de CDNs o recursos externos en tags de carga (no enlaces normales a)
        const matchedTag = content.substring(Math.max(0, match.index - 30), match.index + match[0].length + 15);
        const isResourceTag = /<(?:script|link|img|source)\b/i.test(matchedTag);

        if (url.startsWith('http://') || url.startsWith('https://')) {
            if (isResourceTag) {
                // Canonical link está permitido si apunta al propio dominio
                if (url === 'https://thianetic.github.io/' || url === 'https://thianetic.github.io') {
                    continue;
                }
                externalCdnReferences.push({ file: htmlFile, url, tag: matchedTag.trim() });
            }
            continue;
        }

        // Verificación de existencia de recurso local
        const cleanPath = url.replace(/^\//, '');
        const targetPath = path.join(ROOT_DIR, cleanPath);

        if (!fs.existsSync(targetPath)) {
            brokenAssets.push({ file: htmlFile, ref: url, resolved: targetPath });
        }
    }
}

// Verificación de recursos en CSS (url(...))
const cssDir = path.join(ROOT_DIR, 'css');
if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
    for (const cssFile of cssFiles) {
        const cssContent = fs.readFileSync(path.join(cssDir, cssFile), 'utf8');
        const urlRegex = /url\(["']?([^"')#?]+)["']?\)/gi;
        let urlMatch;
        while ((urlMatch = urlRegex.exec(cssContent)) !== null) {
            const rawUrl = urlMatch[1].trim();
            if (rawUrl.startsWith('data:') || rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
                continue;
            }
            const cleanUrl = rawUrl.replace(/^\//, '');
            const targetPath = path.resolve(cssDir, cleanUrl);
            if (!fs.existsSync(targetPath)) {
                brokenAssets.push({ file: `css/${cssFile}`, ref: rawUrl, resolved: targetPath });
            }
        }
    }
}

// Verificación de fuentes en assets/fonts/fonts.css
const fontsCss = path.join(ROOT_DIR, 'assets', 'fonts', 'fonts.css');
if (fs.existsSync(fontsCss)) {
    const fontsContent = fs.readFileSync(fontsCss, 'utf8');
    const urlRegex = /url\(["']?([^"')#?]+)["']?\)/gi;
    let urlMatch;
    while ((urlMatch = urlRegex.exec(fontsContent)) !== null) {
        const rawUrl = urlMatch[1].trim();
        const targetPath = path.resolve(path.dirname(fontsCss), rawUrl);
        if (!fs.existsSync(targetPath)) {
            brokenAssets.push({ file: 'assets/fonts/fonts.css', ref: rawUrl, resolved: targetPath });
        }
    }
}

if (brokenAssets.length > 0) {
    console.error('❌ Recursos locales no encontrados (404s detectados):');
    console.table(brokenAssets);
    process.exit(1);
}
console.log('✅ 0 enlaces o assets rotos detectados.');

if (externalCdnReferences.length > 0) {
    console.error('❌ Dependencias de CDNs externos no permitidas:');
    console.table(externalCdnReferences);
    process.exit(1);
}
console.log('✅ 0 llamadas a CDNs externos (arquitectura Zero-CDN verificada).');

// 2. Presupuesto de Peso Inicial (< 500 KB)
console.log('\n📊 Paso 2: Calculando presupuesto de peso inicial (Critical Payload)...');
const indexContent = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
const initialAssets = new Set(['index.html']);

// Preload fonts y stylesheets
const headMatches = indexContent.match(/<head[\s\S]*?<\/head>/i)?.[0] || '';
const linkRegex = /<link[^>]+href=["']([^"']+)["'][^>]*>/gi;
let linkMatch;
while ((linkMatch = linkRegex.exec(headMatches)) !== null) {
    const href = linkMatch[1];
    if (!href.startsWith('http') && !href.startsWith('data:')) {
        initialAssets.add(href.replace(/^\//, ''));
    }
}

// Scripts en head / body
const scriptRegex = /<script[^>]+src=["']([^"']+)["'][^>]*>/gi;
let sMatch;
while ((sMatch = scriptRegex.exec(indexContent)) !== null) {
    const src = sMatch[1];
    if (!src.startsWith('http')) {
        initialAssets.add(src.replace(/^\//, ''));
    }
}

let totalBytes = 0;
const payloadDetails = [];

for (const asset of initialAssets) {
    const fullPath = path.join(ROOT_DIR, asset);
    if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        if (stats.isFile()) {
            totalBytes += stats.size;
            payloadDetails.push({
                Asset: asset,
                SizeKB: (stats.size / 1024).toFixed(2)
            });
        }
    }
}

console.table(payloadDetails);
const totalKB = totalBytes / 1024;
console.log(`Peso inicial crítico total: ${totalKB.toFixed(2)} KB (Límite: ${MAX_INITIAL_PAYLOAD_KB} KB)`);

if (totalKB > MAX_INITIAL_PAYLOAD_KB) {
    console.error(`❌ El presupuesto de peso crítico excede el límite permitido: ${totalKB.toFixed(2)} KB > ${MAX_INITIAL_PAYLOAD_KB} KB`);
    process.exit(1);
}
console.log('✅ Presupuesto de rendimiento superado con éxito.');

// 3. Empaquetado Limpio para Despliegue (_site/)
console.log('\n📦 Paso 3: Empaquetando artefacto limpio de producción (_site/)...');

if (fs.existsSync(SITE_DIR)) {
    fs.rmSync(SITE_DIR, { recursive: true, force: true });
}
fs.mkdirSync(SITE_DIR, { recursive: true });

// Archivos raíz individuales permitidos para producción
const publicFiles = [
    'index.html',
    '404.html',
    'sitemap.xml',
    'robots.txt',
    'llms.txt',
    'ai.txt',
    '.nojekyll',
    'VERSION'
];

for (const file of publicFiles) {
    const src = path.join(ROOT_DIR, file);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(SITE_DIR, file));
    }
}

// Copia recursiva de directorios públicos
const publicDirs = ['css', 'js', 'img', 'assets', '.well-known'];

for (const dir of publicDirs) {
    const src = path.join(ROOT_DIR, dir);
    if (fs.existsSync(src)) {
        copyRecursiveSync(src, path.join(SITE_DIR, dir));
    }
}

// Asegurar tdmrep.json accesible
const tdmSource = path.join(ROOT_DIR, '.well-known', 'tdmrep.json');
if (fs.existsSync(tdmSource)) {
    fs.copyFileSync(tdmSource, path.join(SITE_DIR, 'tdmrep.json'));
}

// Verificación de exclusión estricta de archivos privados
const forbiddenPatterns = [
    'AGENTS.md',
    'CHANGELOG.md',
    'README.md',
    'tests',
    'scripts',
    '.git',
    '.github'
];

for (const forbidden of forbiddenPatterns) {
    const checkPath = path.join(SITE_DIR, forbidden);
    if (fs.existsSync(checkPath)) {
        console.error(`❌ Archivo o directorio prohibido detectado en _site/: ${forbidden}`);
        process.exit(1);
    }
}

console.log('✅ Directorio _site/ generado correctamente con 0 fugas de gobernanza/tests.');

console.log('\n====================================================');
console.log('🎉 VERIFICACIÓN Y EMPAQUETADO COMPLETADOS CON ÉXITO');
console.log('====================================================\n');

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}
