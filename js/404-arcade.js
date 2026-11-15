// ===== THIANETIC // SEC-CORE DEFENSE ARCADE ENGINE (Canvas 2D Nativo - Zero CDN) =====

class RetroAudioSynthesizer {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playLaser() {
        if (!this.enabled || !this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.12);
        } catch (_) {}
    }

    playExplosion() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.linearRampToValueAtTime(40, now + 0.2);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.2);
        } catch (_) {}
    }

    playPowerup() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            [440, 554, 659, 880].forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const t = now + idx * 0.05;
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, t);
                gain.gain.setValueAtTime(0.1, t);
                gain.gain.linearRampToValueAtTime(0.01, t + 0.08);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(t);
                osc.stop(t + 0.08);
            });
        } catch (_) {}
    }

    playHit() {
        if (!this.enabled || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(130, now);
            osc.frequency.linearRampToValueAtTime(60, now + 0.25);
            gain.gain.setValueAtTime(0.22, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.25);
        } catch (_) {}
    }
}

class StatsStore {
    constructor() {
        this.cache = this.loadLocal();
    }

    loadLocal() {
        try {
            const raw = localStorage.getItem('arcade_space_stats');
            if (raw) return JSON.parse(raw);
        } catch (_) {}
        return {
            totalScore: 0,
            totalLevels: 1,
            totalShots: 0,
            totalHits: 0,
            enemiesDefeated: 0,
            gamesPlayed: 0,
            playTime: 0
        };
    }

    save(updates) {
        this.cache = { ...this.cache, ...updates };
        try {
            localStorage.setItem('arcade_space_stats', JSON.stringify(this.cache));
        } catch (_) {}
    }

    getStats() {
        return this.cache;
    }
}

const Strings = {
    current: 'es',
    data: {
        es: {
            'arcade.badge': 'THIANETIC // SEC-CORE DEFENSE',
            'arcade.title': 'PROTOCOLO DE DEFENSA PERIMETRAL',
            'arcade.subtitle': 'Contén el desbordamiento de búfer repeliendo las amenazas socket antes de que colapsen el puerto 404.',
            'stats.score': 'Puntuación',
            'stats.lives': 'Vidas',
            'stats.level': 'Nivel',
            'stats.highscore': 'Récord',
            'controls.start': 'Iniciar Juego',
            'controls.restart': 'Reiniciar',
            'controls.stats': 'Estadísticas',
            'controls.soundOn': '🔊 Sonido: ON',
            'controls.soundOff': '🔇 Sonido: OFF',
            'controls.fullscreen': '⛶ Pantalla Completa',
            'controls.close': '✕ Minimizar Arcade'
        },
        en: {
            'arcade.badge': 'THIANETIC // SEC-CORE DEFENSE',
            'arcade.title': 'PERIMETER DEFENSE PROTOCOL',
            'arcade.subtitle': 'Contain buffer overflows by repelling socket threats before they exhaust port 404.',
            'stats.score': 'Score',
            'stats.lives': 'Lives',
            'stats.level': 'Level',
            'stats.highscore': 'High Score',
            'controls.start': 'Start Game',
            'controls.restart': 'Restart',
            'controls.stats': 'Statistics',
            'controls.soundOn': '🔊 Sound: ON',
            'controls.soundOff': '🔇 Sound: OFF',
            'controls.fullscreen': '⛶ Fullscreen',
            'controls.close': '✕ Minimize Arcade'
        }
    },
    setLang(l) {
        if (this.data[l]) {
            this.current = l;
            document.querySelectorAll('[data-i18n]').forEach((el) => {
                const key = el.getAttribute('data-i18n');
                if (this.data[l][key]) el.textContent = this.data[l][key];
            });
        }
    }
};

const GAME_CONSTANTS = {
    CANVAS: {
        WIDTH: 900,
        HEIGHT: 800,
        PLAYER_SIZE: 24,
        ALIEN_SIZE: 22
    },
    ENEMY_TYPES: {
        YELLOW_ORB: { key: 'alien3', baseHealth: 1, basePoints: 10, color: '#ffff00' },
        ORANGE_DIAMOND: { key: 'alien2', baseHealth: 2, basePoints: 20, color: '#ff8800' },
        RED_SQUARE: { key: 'alien1', baseHealth: 3, basePoints: 30, color: '#ff0055' }
    },
    POWERUPS: {
        EXTRA_LIFE: { key: 'extraLife', color: '#ff0066', duration: null, icon: '♥', name: 'Vida Extra', probability: 0.15 },
        RAPID_FIRE: { key: 'rapidFire', color: '#ffff00', duration: 10000, icon: '⚡', name: 'Disparo Rápido', probability: 0.25 },
        DOUBLE_SHOT: { key: 'doubleShot', color: '#00e5ff', duration: 15000, icon: '×2', name: 'Disparo Doble', probability: 0.20 },
        TRIPLE_SHOT: { key: 'tripleShot', color: '#ff00ff', duration: 12000, icon: '×3', name: 'Disparo Triple', probability: 0.15 },
        SHIELD: { key: 'shield', color: '#0088ff', duration: 15000, icon: '🛡', name: 'Escudo', probability: 0.15 },
        LASER: { key: 'laser', color: '#00ff88', duration: 4000, icon: '☄', name: 'Super Láser', probability: 0.10 }
    },
    PLAYER: {
        SPEED: 420,
        BASE_FIRE_RATE: 360,
        RAPID_FIRE_RATE: 150
    },
    POWERUP_DROP_CHANCE: 0.20,
    ALIEN_FLOOR_LIMIT: 710
};

export class ArcadeGameController {
    constructor() {
        this.canvas = document.getElementById('arcade-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.audio = new RetroAudioSynthesizer();
        this.statsStore = new StatsStore();

        this.isRunning = false;
        this.isGameOver = false;
        this.isPaused = false;
        this.gameOverMessage = '';

        this.highScore = parseInt(localStorage.getItem('arcade_high_score') || '0', 10);
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.shots = 0;
        this.hits = 0;
        this.enemiesKilled = 0;
        this.startTime = 0;

        this.activePowerUps = new Map();

        // Estado del jugador
        this.player = {
            x: GAME_CONSTANTS.CANVAS.WIDTH / 2,
            y: 740,
            width: 28,
            height: 24,
            speed: GAME_CONSTANTS.PLAYER.SPEED
        };

        // Entidades
        this.playerBullets = [];
        this.enemyBullets = [];
        this.aliens = [];
        this.shields = [];
        this.powerups = [];
        this.particles = [];
        this.stars = [];

        // Timers & Delta
        this.lastFrameTime = 0;
        this.lastFiredTime = 0;
        this.alienMoveTimer = 0;
        this.alienShootTimer = 0;
        this.alienDirection = 1;

        // Input
        this.keys = {};
        this.touchMoveLeft = false;
        this.touchMoveRight = false;
        this.touchShoot = false;
        this.screenShakeTime = 0;

        this.initStars();
        this.initUI();
        this.initEvents();
    }

    initStars() {
        this.stars = [];
        for (let i = 0; i < 70; i++) {
            this.stars.push({
                x: Math.random() * GAME_CONSTANTS.CANVAS.WIDTH,
                y: Math.random() * GAME_CONSTANTS.CANVAS.HEIGHT,
                radius: Math.random() * 1.5 + 0.5,
                speed: Math.random() * 30 + 15,
                alpha: Math.random() * 0.7 + 0.3
            });
        }
    }

    initUI() {
        const scoreEl = document.getElementById('score');
        const livesEl = document.getElementById('lives');
        const levelEl = document.getElementById('level');
        const highEl = document.getElementById('highscore');

        if (scoreEl) scoreEl.textContent = '0';
        if (livesEl) livesEl.textContent = '♥ ♥ ♥';
        if (levelEl) levelEl.textContent = '1';
        if (highEl) highEl.textContent = String(this.highScore);
    }

    initEvents() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space' && (e.target === document.body || e.target === document.documentElement)) {
                e.preventDefault();
            }
            if (e.key === 'p' || e.key === 'P') this.togglePause();
            if (e.key === 'm' || e.key === 'M') this.toggleSound();
            if (e.key === 'f' || e.key === 'F') this.toggleFullscreen();
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Click / touch canvas drag
        if (this.canvas) {
            const handlePointer = (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = GAME_CONSTANTS.CANVAS.WIDTH / rect.width;
                const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : null);
                if (clientX !== null) {
                    const canvasX = (clientX - rect.left) * scaleX;
                    this.player.x = Math.max(20, Math.min(GAME_CONSTANTS.CANVAS.WIDTH - 20, canvasX));
                }
            };

            this.canvas.addEventListener('pointermove', (e) => {
                if (e.buttons > 0 && this.isRunning && !this.isGameOver && !this.isPaused) {
                    handlePointer(e);
                }
            });

            this.canvas.addEventListener('pointerdown', (e) => {
                this.audio.init();
                if (this.isRunning && !this.isGameOver && !this.isPaused) {
                    handlePointer(e);
                    this.touchShoot = true;
                }
            });

            this.canvas.addEventListener('pointerup', () => {
                this.touchShoot = false;
            });
        }

        // Virtual Touch Buttons
        const bindTouch = (id, onStart, onEnd) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                this.audio.init();
                onStart();
            });
            el.addEventListener('pointerup', (e) => { e.preventDefault(); onEnd(); });
            el.addEventListener('pointerleave', (e) => { e.preventDefault(); onEnd(); });
            el.addEventListener('pointercancel', (e) => { e.preventDefault(); onEnd(); });
        };

        bindTouch('touch-left', () => { this.touchMoveLeft = true; }, () => { this.touchMoveLeft = false; });
        bindTouch('touch-right', () => { this.touchMoveRight = true; }, () => { this.touchMoveRight = false; });
        bindTouch('touch-fire', () => { this.touchShoot = true; }, () => { this.touchShoot = false; });

        // Controls
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.audio.init();
                this.start();
            });
        }

        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.audio.init();
                this.start();
            });
        }

        const soundBtn = document.getElementById('sound-btn');
        if (soundBtn) soundBtn.addEventListener('click', () => this.toggleSound());

        const fullscreenBtn = document.getElementById('fullscreen-btn');
        if (fullscreenBtn) fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());

        const statsBtn = document.getElementById('stats-btn');
        if (statsBtn) statsBtn.addEventListener('click', () => this.showStats());

        const closeStats = document.getElementById('close-stats');
        if (closeStats) {
            closeStats.addEventListener('click', () => {
                const modal = document.getElementById('stats-modal');
                if (modal) {
                    if (typeof modal.close === 'function') modal.close();
                    else modal.classList.remove('active');
                }
            });
        }

        // Easter Egg Trigger en la tarjeta 404 principal
        const launchBtn = document.getElementById('launch-arcade-btn');
        const arcadeSection = document.getElementById('arcade-section');
        if (launchBtn && arcadeSection) {
            launchBtn.addEventListener('click', () => {
                this.audio.init();
                arcadeSection.classList.remove('hidden');
                launchBtn.setAttribute('aria-expanded', 'true');
                arcadeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (!this.isRunning) {
                    this.start();
                }
            });
        }

        const closeArcadeBtn = document.getElementById('close-arcade-btn');
        if (closeArcadeBtn && arcadeSection && launchBtn) {
            closeArcadeBtn.addEventListener('click', () => {
                this.isPaused = true;
                arcadeSection.classList.add('hidden');
                launchBtn.setAttribute('aria-expanded', 'false');
                launchBtn.focus();
            });
        }
    }

    start() {
        this.isRunning = true;
        this.isGameOver = false;
        this.isPaused = false;
        this.gameOverMessage = '';
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.shots = 0;
        this.hits = 0;
        this.enemiesKilled = 0;
        this.startTime = Date.now();
        this.activePowerUps.clear();
        this.particles = [];
        this.playerBullets = [];
        this.enemyBullets = [];
        this.powerups = [];

        this.player.x = GAME_CONSTANTS.CANVAS.WIDTH / 2;

        this.initShields();
        this.initAliens();

        const startBtn = document.getElementById('start-btn');
        const restartBtn = document.getElementById('restart-btn');
        if (startBtn) startBtn.style.display = 'none';
        if (restartBtn) restartBtn.style.display = 'inline-flex';

        this.updateHUD();
        this.renderPowerups();

        const curStats = this.statsStore.getStats();
        this.statsStore.save({ gamesPlayed: curStats.gamesPlayed + 1 });

        this.lastFrameTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
    }

    initShields() {
        this.shields = [];
        const xPositions = [160, 360, 560, 740];
        xPositions.forEach((x) => {
            this.shields.push({
                x: x - 30,
                y: 670,
                width: 60,
                height: 28,
                health: 5,
                maxHealth: 5
            });
        });
    }

    initAliens() {
        this.aliens = [];
        const rows = Math.min(6, 3 + Math.floor(this.level / 2));
        const cols = 10;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = 110 + c * 70;
                const y = 60 + r * 45;
                let type = GAME_CONSTANTS.ENEMY_TYPES.YELLOW_ORB;
                if (r === 0) type = GAME_CONSTANTS.ENEMY_TYPES.RED_SQUARE;
                else if (r <= 2) type = GAME_CONSTANTS.ENEMY_TYPES.ORANGE_DIAMOND;

                this.aliens.push({
                    x,
                    y,
                    width: GAME_CONSTANTS.CANVAS.ALIEN_SIZE,
                    height: GAME_CONSTANTS.CANVAS.ALIEN_SIZE,
                    type,
                    health: type.baseHealth,
                    maxHealth: type.baseHealth,
                    points: type.basePoints,
                    hitTintTime: 0
                });
            }
        }
        this.alienDirection = 1;
        this.alienMoveTimer = 0;
        this.alienShootTimer = 0;
    }

    togglePause() {
        if (!this.isRunning || this.isGameOver) return;
        this.isPaused = !this.isPaused;
        if (!this.isPaused) {
            this.lastFrameTime = performance.now();
            requestAnimationFrame((t) => this.loop(t));
        }
    }

    toggleSound() {
        this.audio.init();
        this.audio.enabled = !this.audio.enabled;
        const btn = document.getElementById('sound-btn');
        if (btn) {
            btn.textContent = this.audio.enabled ? Strings.data[Strings.current]['controls.soundOn'] : Strings.data[Strings.current]['controls.soundOff'];
        }
    }

    toggleFullscreen() {
        const el = document.getElementById('game-container');
        if (!document.fullscreenElement) {
            if (el && el.requestFullscreen) el.requestFullscreen().catch(() => {});
        } else if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
        }
    }

    showStats() {
        const st = this.statsStore.getStats();
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };
        setVal('total-score', st.totalScore);
        setVal('total-level', st.totalLevels);
        setVal('games-played', st.gamesPlayed);
        setVal('enemies-killed', st.enemiesDefeated);
        setVal('total-shots', st.totalShots);
        const acc = st.totalShots > 0 ? Math.round((st.totalHits / st.totalShots) * 100) : 0;
        setVal('accuracy', `${acc}%`);
        setVal('play-time', `${Math.floor((st.playTime || 0) / 60)}m`);

        const modal = document.getElementById('stats-modal');
        if (modal) {
            if (typeof modal.showModal === 'function') modal.showModal();
            else modal.classList.add('active');
        }
    }

    updateHUD() {
        const scoreEl = document.getElementById('score');
        const livesEl = document.getElementById('lives');
        const levelEl = document.getElementById('level');
        const highEl = document.getElementById('highscore');

        if (scoreEl) scoreEl.textContent = String(this.score);
        if (livesEl) livesEl.textContent = '♥ '.repeat(Math.max(0, this.lives)).trim();
        if (levelEl) levelEl.textContent = String(this.level);
        if (highEl) highEl.textContent = String(this.highScore);
    }

    activatePowerUp(key) {
        const p = Object.values(GAME_CONSTANTS.POWERUPS).find((item) => item.key === key);
        if (!p) return;
        this.audio.playPowerup();

        if (p.key === 'extraLife') {
            this.lives++;
            this.updateHUD();
            return;
        }

        if (p.duration) {
            this.activePowerUps.set(p.key, Date.now() + p.duration);
            this.renderPowerups();
        }
    }

    renderPowerups() {
        const box = document.getElementById('powerup-indicators');
        if (!box) return;
        box.innerHTML = '';
        const now = Date.now();
        this.activePowerUps.forEach((expire, eff) => {
            const secs = Math.max(0, Math.ceil((expire - now) / 1000));
            if (secs > 0) {
                const badge = document.createElement('span');
                badge.style.cssText = 'padding: 4px 10px; background: rgba(0, 229, 255, 0.15); border: 1px solid var(--accent); border-radius: 6px; font-size: 0.75rem; font-weight: bold; color: var(--accent); font-family: "Fira Code", monospace;';
                badge.textContent = `${eff.toUpperCase()}: ${secs}s`;
                box.appendChild(badge);
            }
        });
    }

    firePlayerBullet() {
        this.shots++;
        this.audio.playLaser();
        const x = this.player.x;
        const y = this.player.y - 12;

        const spawn = (ox, vy = -580) => {
            this.playerBullets.push({
                x: x + ox,
                y,
                width: 4,
                height: 12,
                vy
            });
        };

        if (this.activePowerUps.has('tripleShot')) {
            spawn(-14);
            spawn(0);
            spawn(14);
        } else if (this.activePowerUps.has('doubleShot')) {
            spawn(-10);
            spawn(10);
        } else {
            spawn(0);
        }
    }

    spawnParticles(x, y, color, count = 10) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = Math.random() * 140 + 30;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                radius: Math.random() * 2 + 1,
                color,
                alpha: 1,
                life: 0.35 + Math.random() * 0.25
            });
        }
    }

    onGameOver(msg = 'GAME OVER') {
        this.isGameOver = true;
        this.gameOverMessage = msg;
        this.audio.playHit();
        const sessionTime = Math.floor((Date.now() - this.startTime) / 1000);
        const cur = this.statsStore.getStats();
        this.statsStore.save({
            totalScore: cur.totalScore + this.score,
            totalLevels: Math.max(cur.totalLevels, this.level),
            totalShots: cur.totalShots + this.shots,
            totalHits: cur.totalHits + this.hits,
            enemiesDefeated: cur.enemiesDefeated + this.enemiesKilled,
            playTime: cur.playTime + sessionTime
        });
    }

    loop(timestamp) {
        if (!this.isRunning) return;

        const dt = Math.min((timestamp - this.lastFrameTime) / 1000, 0.1);
        this.lastFrameTime = timestamp;

        if (!this.isPaused) {
            this.update(dt, timestamp);
        }

        this.render();

        if (this.isRunning && !this.isPaused) {
            requestAnimationFrame((t) => this.loop(t));
        }
    }

    update(dt, now) {
        // Starfield
        this.stars.forEach((s) => {
            s.y += s.speed * dt;
            if (s.y > GAME_CONSTANTS.CANVAS.HEIGHT) {
                s.y = 0;
                s.x = Math.random() * GAME_CONSTANTS.CANVAS.WIDTH;
            }
        });

        // Limpiar powerups expirados
        let powerupsChanged = false;
        this.activePowerUps.forEach((expire, eff) => {
            if (now >= expire) {
                this.activePowerUps.delete(eff);
                powerupsChanged = true;
            }
        });
        if (powerupsChanged) this.renderPowerups();

        if (this.isGameOver) {
            this.updateParticles(dt);
            return;
        }

        // Movimiento jugador
        let moveX = 0;
        if (this.keys.ArrowLeft || this.keys.KeyA || this.touchMoveLeft) moveX -= this.player.speed;
        if (this.keys.ArrowRight || this.keys.KeyD || this.touchMoveRight) moveX += this.player.speed;
        this.player.x += moveX * dt;
        this.player.x = Math.max(20, Math.min(GAME_CONSTANTS.CANVAS.WIDTH - 20, this.player.x));

        // Disparo jugador
        const isFiring = this.keys.Space || this.touchShoot;
        const fireRate = this.activePowerUps.has('rapidFire') ? GAME_CONSTANTS.PLAYER.RAPID_FIRE_RATE : GAME_CONSTANTS.PLAYER.BASE_FIRE_RATE;
        if (isFiring && now - this.lastFiredTime >= fireRate) {
            this.firePlayerBullet();
            this.lastFiredTime = now;
        }

        // Balas del jugador
        this.playerBullets.forEach((b) => { b.y += b.vy * dt; });
        this.playerBullets = this.playerBullets.filter((b) => b.y > -20);

        // Balas enemigas
        this.enemyBullets.forEach((b) => { b.y += b.vy * dt; });
        this.enemyBullets = this.enemyBullets.filter((b) => b.y < GAME_CONSTANTS.CANVAS.HEIGHT + 20);

        // Powerups cayendo
        this.powerups.forEach((p) => { p.y += 120 * dt; });
        this.powerups = this.powerups.filter((p) => p.y < GAME_CONSTANTS.CANVAS.HEIGHT + 30);

        // Movimiento invasores
        const moveInterval = Math.max(0.12, 0.6 - (this.level * 0.03));
        this.alienMoveTimer += dt;
        if (this.alienMoveTimer >= moveInterval) {
            this.alienMoveTimer = 0;
            let hitEdge = false;
            this.aliens.forEach((a) => {
                a.x += this.alienDirection * 15;
                if (a.x < 35 || a.x > GAME_CONSTANTS.CANVAS.WIDTH - 35) hitEdge = true;
            });

            if (hitEdge) {
                this.alienDirection *= -1;
                this.aliens.forEach((a) => {
                    a.y += 24;
                    if (a.y >= GAME_CONSTANTS.ALIEN_FLOOR_LIMIT) {
                        this.onGameOver('¡INVASIÓN COMPLETADA!');
                    }
                });
            }
        }

        // Disparo invasores
        const shootInterval = Math.max(0.6, 2.2 - (this.level * 0.12));
        this.alienShootTimer += dt;
        if (this.alienShootTimer >= shootInterval && this.aliens.length > 0) {
            this.alienShootTimer = 0;
            const shooter = this.aliens[Math.floor(Math.random() * this.aliens.length)];
            if (shooter) {
                this.enemyBullets.push({
                    x: shooter.x,
                    y: shooter.y + 12,
                    width: 4,
                    height: 10,
                    vy: 220 + (this.level * 15)
                });
            }
        }

        // Colisión: Balas jugador vs Invasores
        for (let i = this.playerBullets.length - 1; i >= 0; i--) {
            const b = this.playerBullets[i];
            for (let j = this.aliens.length - 1; j >= 0; j--) {
                const a = this.aliens[j];
                if (Math.abs(b.x - a.x) < 16 && Math.abs(b.y - a.y) < 16) {
                    this.playerBullets.splice(i, 1);
                    this.hits++;
                    a.health--;
                    a.hitTintTime = now + 70;

                    if (a.health <= 0) {
                        this.audio.playExplosion();
                        this.spawnParticles(a.x, a.y, a.type.color, 14);
                        this.score += a.points;
                        if (this.score > this.highScore) {
                            this.highScore = this.score;
                            try { localStorage.setItem('arcade_high_score', String(this.highScore)); } catch (_) {}
                        }
                        this.enemiesKilled++;
                        this.updateHUD();

                        // Drop powerup
                        if (Math.random() < GAME_CONSTANTS.POWERUP_DROP_CHANCE) {
                            const keys = Object.keys(GAME_CONSTANTS.POWERUPS);
                            const pickedKey = keys[Math.floor(Math.random() * keys.length)];
                            const conf = GAME_CONSTANTS.POWERUPS[pickedKey];
                            this.powerups.push({
                                x: a.x,
                                y: a.y,
                                key: conf.key,
                                icon: conf.icon,
                                color: conf.color,
                                radius: 12
                            });
                        }

                        this.aliens.splice(j, 1);
                    }
                    break;
                }
            }
        }

        // Colisión: Balas vs Escudos
        this.shields.forEach((s) => {
            if (s.health <= 0) return;

            // Player bullets
            for (let i = this.playerBullets.length - 1; i >= 0; i--) {
                const b = this.playerBullets[i];
                if (b.x >= s.x && b.x <= s.x + s.width && b.y >= s.y && b.y <= s.y + s.height) {
                    this.playerBullets.splice(i, 1);
                    s.health--;
                    this.spawnParticles(b.x, b.y, '#10b981', 4);
                }
            }

            // Enemy bullets
            for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
                const b = this.enemyBullets[i];
                if (b.x >= s.x && b.x <= s.x + s.width && b.y >= s.y && b.y <= s.y + s.height) {
                    this.enemyBullets.splice(i, 1);
                    s.health--;
                    this.spawnParticles(b.x, b.y, '#10b981', 4);
                }
            }
        });

        // Colisión: Balas enemigas vs Jugador
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            const b = this.enemyBullets[i];
            if (Math.abs(b.x - this.player.x) < 18 && Math.abs(b.y - this.player.y) < 16) {
                this.enemyBullets.splice(i, 1);
                if (this.activePowerUps.has('shield')) {
                    this.audio.playPowerup();
                    this.spawnParticles(b.x, b.y, '#00e5ff', 8);
                } else {
                    this.audio.playHit();
                    this.spawnParticles(this.player.x, this.player.y, '#ff0055', 20);
                    this.lives--;
                    this.updateHUD();
                    this.screenShakeTime = now + 200;

                    if (this.lives <= 0) {
                        this.onGameOver('GAME OVER');
                    }
                }
            }
        }

        // Colisión: Jugador vs Powerups
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            const p = this.powerups[i];
            if (Math.abs(p.x - this.player.x) < 22 && Math.abs(p.y - this.player.y) < 22) {
                this.activatePowerUp(p.key);
                this.spawnParticles(p.x, p.y, p.color, 12);
                this.powerups.splice(i, 1);
            }
        }

        // Ola completada
        if (this.aliens.length === 0) {
            this.level++;
            this.updateHUD();
            this.initAliens();
        }

        this.updateParticles(dt);
    }

    updateParticles(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt;
            p.alpha = Math.max(0, p.life / 0.5);
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    render() {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const W = GAME_CONSTANTS.CANVAS.WIDTH;
        const H = GAME_CONSTANTS.CANVAS.HEIGHT;

        ctx.save();

        // Screen Shake
        if (performance.now() < this.screenShakeTime) {
            const ox = (Math.random() - 0.5) * 8;
            const oy = (Math.random() - 0.5) * 8;
            ctx.translate(ox, oy);
        }

        // Background
        ctx.fillStyle = '#020813';
        ctx.fillRect(0, 0, W, H);

        // Starfield
        this.stars.forEach((s) => {
            ctx.fillStyle = `rgba(0, 229, 255, ${s.alpha})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        // Escudos
        this.shields.forEach((s) => {
            if (s.health <= 0) return;
            const alpha = s.health / s.maxHealth;
            ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
            ctx.fillRect(s.x, s.y, s.width, s.height);
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 1;
            ctx.strokeRect(s.x, s.y, s.width, s.height);
        });

        // Invasores
        const now = performance.now();
        this.aliens.forEach((a) => {
            ctx.save();
            ctx.translate(a.x, a.y);
            const isHit = now < a.hitTintTime;
            const color = isHit ? '#ffffff' : a.type.color;
            ctx.fillStyle = color;

            if (a.type.key === 'alien1') {
                // Red square with cyber slits
                ctx.fillRect(-10, -10, 20, 20);
                ctx.fillStyle = isHit ? '#000000' : '#ffffff';
                ctx.fillRect(-6, -4, 4, 4);
                ctx.fillRect(2, -4, 4, 4);
            } else if (a.type.key === 'alien2') {
                // Orange diamond
                ctx.beginPath();
                ctx.moveTo(0, -11);
                ctx.lineTo(11, 0);
                ctx.lineTo(0, 11);
                ctx.lineTo(-11, 0);
                ctx.closePath();
                ctx.fill();
            } else {
                // Yellow orb
                ctx.beginPath();
                ctx.arc(0, 0, 9, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#020813';
                ctx.beginPath();
                ctx.arc(0, 0, 3, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        });

        // Balas del jugador
        ctx.fillStyle = '#00e5ff';
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 8;
        this.playerBullets.forEach((b) => {
            ctx.fillRect(b.x - b.width / 2, b.y, b.width, b.height);
        });

        // Balas enemigas
        ctx.fillStyle = '#ff0055';
        ctx.shadowColor = '#ff0055';
        ctx.shadowBlur = 8;
        this.enemyBullets.forEach((b) => {
            ctx.fillRect(b.x - b.width / 2, b.y, b.width, b.height);
        });
        ctx.shadowBlur = 0;

        // Powerups
        this.powerups.forEach((p) => {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#020813';
            ctx.font = 'bold 11px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.icon, p.x, p.y);
        });

        // Jugador
        if (!this.isGameOver) {
            ctx.save();
            ctx.translate(this.player.x, this.player.y);

            // Shield bubble
            if (this.activePowerUps.has('shield')) {
                ctx.strokeStyle = '#00e5ff';
                ctx.lineWidth = 2;
                ctx.shadowColor = '#00e5ff';
                ctx.shadowBlur = 12;
                ctx.beginPath();
                ctx.arc(0, 0, 24, 0, Math.PI * 2);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }

            // Ship Triangle
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.moveTo(0, -12);
            ctx.lineTo(14, 12);
            ctx.lineTo(-14, 12);
            ctx.closePath();
            ctx.fill();

            // Cockpit
            ctx.fillStyle = '#00e5ff';
            ctx.fillRect(-3, 0, 6, 8);
            ctx.restore();
        }

        // Partículas
        this.particles.forEach((p) => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        });

        // Floor warning line
        ctx.strokeStyle = 'rgba(255, 0, 85, 0.25)';
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(0, GAME_CONSTANTS.ALIEN_FLOOR_LIMIT);
        ctx.lineTo(W, GAME_CONSTANTS.ALIEN_FLOOR_LIMIT);
        ctx.stroke();
        ctx.setLineDash([]);

        // Game Over Overlay
        if (this.isGameOver) {
            ctx.fillStyle = 'rgba(2, 12, 27, 0.85)';
            ctx.fillRect(0, 0, W, H);

            ctx.fillStyle = '#ff0055';
            ctx.font = 'bold 36px "Fira Code", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.gameOverMessage, W / 2, H / 2 - 20);

            ctx.fillStyle = '#00e5ff';
            ctx.font = '16px "Fira Code", monospace';
            ctx.fillText('PULSA REINICIAR PARA REINTENTAR LA DEFENSA', W / 2, H / 2 + 30);
        } else if (this.isPaused) {
            ctx.fillStyle = 'rgba(2, 12, 27, 0.7)';
            ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = '#00e5ff';
            ctx.font = 'bold 32px "Fira Code", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('PAUSA', W / 2, H / 2);
        }

        ctx.restore();
    }
}

// Inicialización automática
let arcadeController = null;
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        arcadeController = new ArcadeGameController();
    });
}
