/**
 * STARFIRE IMPACT
 * Pure JavaScript Implementation
 * (c) 2025 SAIMSKYWALKER
 */

// --- Constants ---
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 450;
const PLAYER_SPEED = 300;
const BULLET_SPEED = 500;
const ENEMY_BASE_SPEED = 100;

// --- Weapon Patterns ---
const WEAPON_PATTERNS = [
    // Level 1: Single straight shot
    [{ dx: 20, dy: 0, vx: 1.2, vy: 0 }],
    // Level 2: Twin slight spread
    [{ dx: 20, dy: -6, vx: 1.1, vy: -0.04 }, { dx: 20, dy: 6, vx: 1.1, vy: 0.04 }],
    // Level 3: Triple fan
    [
        { dx: 20, dy: -10, vx: 1.05, vy: -0.08 },
        { dx: 20, dy: 0, vx: 1.1, vy: 0 },
        { dx: 20, dy: 10, vx: 1.05, vy: 0.08 }
    ],
    // Level 4: Quad spread
    [
        { dx: 20, dy: -14, vx: 1.05, vy: -0.12 },
        { dx: 20, dy: -6, vx: 1.1, vy: -0.05 },
        { dx: 20, dy: 6, vx: 1.1, vy: 0.05 },
        { dx: 20, dy: 14, vx: 1.05, vy: 0.12 }
    ],
    // Level 5: Five-way with tight middle
    [
        { dx: 20, dy: -16, vx: 1.02, vy: -0.14 },
        { dx: 20, dy: -8, vx: 1.07, vy: -0.07 },
        { dx: 20, dy: 0, vx: 1.12, vy: 0 },
        { dx: 20, dy: 8, vx: 1.07, vy: 0.07 },
        { dx: 20, dy: 16, vx: 1.02, vy: 0.14 }
    ],
    // Level 6: Six with heavier outer angles
    [
        { dx: 20, dy: -18, vx: 1.0, vy: -0.16 },
        { dx: 20, dy: -12, vx: 1.06, vy: -0.11 },
        { dx: 20, dy: -5, vx: 1.1, vy: -0.05 },
        { dx: 20, dy: 5, vx: 1.1, vy: 0.05 },
        { dx: 20, dy: 12, vx: 1.06, vy: 0.11 },
        { dx: 20, dy: 18, vx: 1.0, vy: 0.16 }
    ],
    // Level 7: Seven-shot max fan
    [
        { dx: 20, dy: -20, vx: 0.98, vy: -0.18 },
        { dx: 20, dy: -14, vx: 1.03, vy: -0.12 },
        { dx: 20, dy: -8, vx: 1.07, vy: -0.07 },
        { dx: 20, dy: 0, vx: 1.12, vy: 0 },
        { dx: 20, dy: 8, vx: 1.07, vy: 0.07 },
        { dx: 20, dy: 14, vx: 1.03, vy: 0.12 },
        { dx: 20, dy: 20, vx: 0.98, vy: 0.18 }
    ]
];

// --- Level Configuration ---
const LEVEL_CONFIG = [
    { duration: 60, spawnRate: 2.6, bgSpeed: 0.5, enemies: [11], boss: 'ScrapGuardian', name: "DEBRIS BELT", enemySpeedScale: 0.75, enemyFireScale: 1.25 },
    { duration: 60, spawnRate: 2.4, bgSpeed: 0.8, enemies: [11, 20], boss: 'RaiderCaptain', name: "ASTEROID FIELD", enemySpeedScale: 0.8, enemyFireScale: 1.2 },
    { duration: 60, spawnRate: 2.2, bgSpeed: 1.0, enemies: [11, 12], boss: 'IonWyrm', name: "ION NEBULA", enemySpeedScale: 0.85, enemyFireScale: 1.15 },
    { duration: 60, spawnRate: 2.0, bgSpeed: 1.2, enemies: [11, 12, 20], boss: 'DockOverseer', name: "ORBITAL DOCK", enemySpeedScale: 0.9, enemyFireScale: 1.1 },
    { duration: 60, spawnRate: 1.8, bgSpeed: 1.5, enemies: [12, 13], boss: 'MutagenCore', name: "BIO LABS", enemySpeedScale: 0.95, enemyFireScale: 1.05 },
    { duration: 60, spawnRate: 0.9, bgSpeed: 2.0, enemies: [12, 13, 14], boss: 'RingFortress', name: "DEFENSE GRID" },
    { duration: 60, spawnRate: 0.8, bgSpeed: 2.5, enemies: [13, 14], boss: 'WarMech', name: "FACTORY SECTOR" },
    { duration: 60, spawnRate: 0.7, bgSpeed: 3.0, enemies: [11, 12, 13, 14], boss: 'TunnelSerpent', name: "DEEP SPACE" },
    { duration: 60, spawnRate: 0.6, bgSpeed: 4.0, enemies: [13, 14], boss: 'CitadelAegis', name: "THE CITADEL" },
    { duration: 60, spawnRate: 0.5, bgSpeed: 5.0, enemies: [11, 12, 13, 14, 20], boss: 'CoreOvermind', name: "CORE SYSTEM" }
];

// Backdrops per level for galaxy vistas (planets omitted for stability)
const LEVEL_BACKGROUNDS = [
    { gradient: ['#03030b', '#0a1841'] },
    { gradient: ['#040912', '#13224b'] },
    { gradient: ['#0a0f1c', '#1c2d5c'] },
    { gradient: ['#0a0a1a', '#24163c'] },
    { gradient: ['#0a0a12', '#1c1c3f'] },
    { gradient: ['#050512', '#0f1f3f'] },
    { gradient: ['#060616', '#1c1e40'] },
    { gradient: ['#040610', '#111a34'] },
    { gradient: ['#070b14', '#1a1b3a'] },
    { gradient: ['#05050e', '#0c0f2c'] }
];

// --- Sound Manager ---
class SoundManager {
    constructor() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn("AudioContext not supported", e);
            this.ctx = null;
        }
        this.musicNodes = null;
    }

    ensureCtx() {
        if (!this.ctx) return false;
        try {
            if (this.ctx.state === 'suspended') this.ctx.resume();
        } catch (e) {
            console.error("Audio Error", e);
            return false;
        }
        return true;
    }

    createVoice({ startFreq, endFreq, type = 'sawtooth', duration = 0.2, volume = 0.12, filterFreq = null, delay = 0 }) {
        if (!this.ensureCtx()) return;
        const now = this.ctx.currentTime + delay;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        let target = osc;

        osc.type = type;
        osc.frequency.setValueAtTime(startFreq, now);
        if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

        if (filterFreq) {
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(filterFreq, now);
            target.connect(filter);
            target = filter;
        }

        target.connect(gain);
        gain.connect(this.ctx.destination);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.start(now);
        osc.stop(now + duration + 0.05);
    }

    playNoiseBurst(duration = 0.25, volume = 0.1, filterFreq = 1200, delay = 0) {
        if (!this.ensureCtx()) return;
        const now = this.ctx.currentTime + delay;
        const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * duration, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.9;

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(filterFreq, now);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        source.start(now);
        source.stop(now + duration + 0.05);
    }

    playLaser() {
        // Modern synth laser with falling pitch, layered with airy click
        this.createVoice({ startFreq: 1800, endFreq: 320, type: 'sawtooth', duration: 0.2, volume: 0.2, filterFreq: 2400 });
        this.createVoice({ startFreq: 900, endFreq: 1400, type: 'triangle', duration: 0.12, volume: 0.1, filterFreq: 1800, delay: 0.02 });
        this.playNoiseBurst(0.12, 0.05, 2600, 0.01);
    }

    playEnemyLaser() {
        this.createVoice({ startFreq: 780, endFreq: 420, type: 'square', duration: 0.16, volume: 0.09, filterFreq: 1400 });
    }

    playExplosion() {
        this.playNoiseBurst(0.35, 0.18, 900);
        this.createVoice({ startFreq: 160, endFreq: 60, type: 'sawtooth', duration: 0.25, volume: 0.12, filterFreq: 700 });
    }

    playPowerup() {
        this.createVoice({ startFreq: 500, endFreq: 1300, type: 'sine', duration: 0.25, volume: 0.12, filterFreq: 1600 });
        this.createVoice({ startFreq: 750, endFreq: 1600, type: 'triangle', duration: 0.18, volume: 0.08, filterFreq: 2000, delay: 0.05 });
    }

    playBossWarning() {
        // Rising synth siren to telegraph danger
        this.playNoiseBurst(0.2, 0.05, 2000);
        this.createVoice({ startFreq: 220, endFreq: 880, type: 'sawtooth', duration: 0.45, volume: 0.18, filterFreq: 1400 });
        this.createVoice({ startFreq: 440, endFreq: 240, type: 'square', duration: 0.45, volume: 0.1, filterFreq: 1200, delay: 0.3 });
    }

    playMusic(type = 'level') {
        if (!this.ensureCtx()) return;
        this.stopMusic();

        try {
            const now = this.ctx.currentTime;
            const base = type === 'boss' ? 95 : 65;
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const filter = this.ctx.createBiquadFilter();
            const gain = this.ctx.createGain();
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();

            osc1.type = type === 'boss' ? 'sawtooth' : 'triangle';
            osc2.type = 'square';
            osc1.frequency.setValueAtTime(base, now);
            osc2.frequency.setValueAtTime(base * (type === 'boss' ? 1.6 : 1.3), now);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(type === 'boss' ? 1600 : 1000, now);
            filter.Q.setValueAtTime(0.8, now);

            gain.gain.setValueAtTime(type === 'boss' ? 0.045 : 0.03, now);

            lfo.frequency.setValueAtTime(type === 'boss' ? 2 : 0.7, now);
            lfoGain.gain.setValueAtTime(type === 'boss' ? 35 : 12, now);
            lfo.connect(lfoGain);
            lfoGain.connect(filter.frequency);

            osc1.connect(filter);
            osc2.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc1.start();
            osc2.start();
            lfo.start();

            this.musicNodes = [osc1, osc2, lfo];
            this.musicGain = gain;
        } catch (e) {
            console.error('Music error', e);
        }
    }

    stopMusic() {
        if (this.musicNodes) {
            this.musicNodes.forEach(node => {
                try { node.stop(); } catch (e) { }
            });
            this.musicNodes = null;
            this.musicGain = null;
        }
    }
}

// --- Input Handler ---
class InputHandler {
    constructor() {
        this.keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, Space: false };
        this.touch = { active: false, x: 0, y: 0, startX: 0, startY: 0 };
        this.pointer = { active: false, x: 0, y: 0, startX: 0, startY: 0 };
        this.onStart = null;

        window.addEventListener('keydown', e => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.keys.Space = true;
                if (this.onStart) this.onStart();
            }
            if (this.keys.hasOwnProperty(e.code)) this.keys[e.code] = true;
        });
        window.addEventListener('keyup', e => {
            if (e.code === 'Space') this.keys.Space = false;
            if (this.keys.hasOwnProperty(e.code)) this.keys[e.code] = false;
        });

        window.addEventListener('touchstart', e => {
            e.preventDefault();
            const t = e.touches[0];
            this.touch.startX = t.clientX;
            this.touch.startY = t.clientY;
            this.touch.active = true;
            if (this.onStart) this.onStart(); // Touch can start the game
            this.keys.Space = true;
        }, { passive: false });

        window.addEventListener('touchmove', e => {
            if (!this.touch.active) return;
            e.preventDefault();
            const t = e.touches[0];
            const dx = t.clientX - this.touch.startX;
            const dy = t.clientY - this.touch.startY;
            const sensitivity = 0.02;
            this.touch.x = Math.max(-1, Math.min(1, dx * sensitivity));
            this.touch.y = Math.max(-1, Math.min(1, dy * sensitivity));
        }, { passive: false });

        window.addEventListener('touchend', e => {
            e.preventDefault();
            this.touch.active = false;
            this.touch.x = 0;
            this.touch.y = 0;
            this.keys.Space = false;
        }, { passive: false });

        // Mouse / touchpad controls mapped similarly to touch
        window.addEventListener('pointerdown', e => {
            if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
            this.pointer.startX = e.clientX;
            this.pointer.startY = e.clientY;
            this.pointer.active = true;
            this.keys.Space = true;
        });
        window.addEventListener('pointermove', e => {
            if (!this.pointer.active || (e.pointerType !== 'mouse' && e.pointerType !== 'pen')) return;
            const dx = e.clientX - this.pointer.startX;
            const dy = e.clientY - this.pointer.startY;
            const sensitivity = 0.02;
            this.pointer.x = Math.max(-1, Math.min(1, dx * sensitivity));
            this.pointer.y = Math.max(-1, Math.min(1, dy * sensitivity));
        });
        window.addEventListener('pointerup', e => {
            if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
            this.pointer.active = false;
            this.pointer.x = 0;
            this.pointer.y = 0;
            this.keys.Space = false;
        });
    }

    getVector() {
        let dx = 0, dy = 0;
        if (this.keys.ArrowUp) dy = -1;
        if (this.keys.ArrowDown) dy = 1;
        if (this.keys.ArrowLeft) dx = -1;
        if (this.keys.ArrowRight) dx = 1;

        if (this.touch.active) {
            dx = this.touch.x;
            dy = this.touch.y;
        } else if (this.pointer.active) {
            dx = this.pointer.x;
            dy = this.pointer.y;
        } else if (dx !== 0 || dy !== 0) {
            const len = Math.sqrt(dx * dx + dy * dy);
            dx /= len;
            dy /= len;
        }
        return { x: dx, y: dy };
    }

    reset() {
        Object.keys(this.keys).forEach(k => this.keys[k] = false);
        this.touch = { active: false, x: 0, y: 0, startX: 0, startY: 0 };
        this.pointer = { active: false, x: 0, y: 0, startX: 0, startY: 0 };
    }
}

// --- Entities ---
class Entity {
    constructor(x, y, width, height, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.active = true;
        this.rotation = 0;
        this.color = '#fff';
    }

    draw(ctx) {
        if (!this.active) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Visuals based on Type
        switch (this.type) {
            case 0: // Player
                if (game?.sprites?.player) {
                    ctx.drawImage(game.sprites.player, -32, -32);
                    break;
                }
                ctx.fillStyle = '#00e8ff';
                ctx.beginPath();
                ctx.moveTo(20, 0);    // nose
                ctx.lineTo(6, 10);
                ctx.lineTo(-4, 14);
                ctx.lineTo(-18, 10);  // left wing tip
                ctx.lineTo(-10, 2);
                ctx.lineTo(-22, -6);  // lower fin
                ctx.lineTo(-10, -2);
                ctx.lineTo(-18, -10); // right wing tip (symmetry)
                ctx.lineTo(-4, -14);
                ctx.lineTo(6, -10);
                ctx.closePath();
                ctx.fill();
                // Cockpit glow
                ctx.fillStyle = '#99ffff';
                ctx.beginPath(); ctx.ellipse(2, 0, 6, 4, 0, 0, Math.PI * 2); ctx.fill();
                // Engine flame
                ctx.fillStyle = '#ffaa00';
                ctx.beginPath(); ctx.moveTo(-22, 0); ctx.lineTo(-32, 6); ctx.lineTo(-32, -6); ctx.closePath(); ctx.fill();
                break;
            case 5: // Player Bullet
                if (game?.sprites?.playerBullet) {
                    ctx.drawImage(game.sprites.playerBullet, -14, -14);
                    break;
                }
                ctx.fillStyle = '#ffff00';
                ctx.fillRect(-6, -3, 12, 6);
                break;
            case 6: // Enemy Bullet
                ctx.fillStyle = '#ff00ff';
                ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI * 2); ctx.fill();
                break;
            case 11: // Scout (Triangle)
                if (game?.sprites?.scout) {
                    ctx.drawImage(game.sprites.scout, -24, -24);
                    break;
                }
                ctx.fillStyle = '#ff4400';
                ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(16, 10); ctx.lineTo(10, 0); ctx.lineTo(16, -10); ctx.closePath(); ctx.fill();
                break;
            case 12: // Fighter (Winged)
                if (game?.sprites?.fighter) {
                    ctx.drawImage(game.sprites.fighter, -24, -24);
                    break;
                }
                ctx.fillStyle = '#ff8800';
                ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(-10, 15); ctx.lineTo(-5, 0); ctx.lineTo(-10, -15); ctx.closePath(); ctx.fill();
                break;
            case 13: // Interceptor (Needle)
                if (game?.sprites?.interceptor) {
                    ctx.drawImage(game.sprites.interceptor, -24, -24);
                    break;
                }
                ctx.fillStyle = '#ff0044';
                ctx.beginPath(); ctx.moveTo(20, 0); ctx.lineTo(-20, 5); ctx.lineTo(-20, -5); ctx.closePath(); ctx.fill();
                break;
            case 14: // Tank (Blocky)
                if (game?.sprites?.tank) {
                    ctx.drawImage(game.sprites.tank, -28, -28);
                    break;
                }
                ctx.fillStyle = '#aa4400';
                ctx.fillRect(-20, -20, 40, 40);
                break;
            case 20: // Asteroid
                ctx.fillStyle = '#888';
                ctx.beginPath();
                ctx.moveTo(-15, -10); ctx.lineTo(0, -15); ctx.lineTo(15, -10); ctx.lineTo(20, 0);
                ctx.lineTo(15, 15); ctx.lineTo(-5, 20); ctx.lineTo(-20, 10); ctx.lineTo(-15, 0);
                ctx.closePath(); ctx.fill(); ctx.stroke();
                break;
            case 30: // Weapon Upgrade
                ctx.fillStyle = '#44ff88';
                ctx.beginPath();
                ctx.moveTo(0, -12); ctx.lineTo(10, 0); ctx.lineTo(0, 12); ctx.lineTo(-10, 0);
                ctx.closePath(); ctx.fill();
                ctx.strokeStyle = '#0f0'; ctx.stroke();
                break;
            case 31: // Heal
                ctx.fillStyle = '#ff4444';
                ctx.fillRect(-10, -10, 20, 20);
                ctx.fillStyle = '#fff';
                ctx.fillRect(-3, -10, 6, 20);
                ctx.fillRect(-10, -3, 20, 6);
                break;
            case 99: // Boss (Generic fallback or specific drawing in Boss class)
                ctx.fillStyle = '#ff0000';
                ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
                break;
        }
        ctx.restore();
    }
}

class Item extends Entity {
    constructor(x, y, kind) {
        super(x, y, 20, 20, kind === 'weapon' ? 30 : 31);
        this.kind = kind;
        this.vx = -ENEMY_BASE_SPEED * 0.6;
        this.rotation = 0;
        this.rotSpeed = (Math.random() - 0.5) * 1.5;
    }
    update(dt) {
        this.x += this.vx * dt;
        this.rotation += this.rotSpeed * dt;
        if (this.x < -40) this.active = false;
    }
}

class Player extends Entity {
    constructor(x, y) {
        super(x, y, 32, 32, 0);
        this.hp = 100;
        this.maxHp = 100;
        this.lastShoot = 0;
        this.weaponLevel = 1; // 1-7
        this.fireInterval = 0.35;
    }

    update(dt, input) {
        const vec = input.getVector();
        this.x += vec.x * PLAYER_SPEED * dt;
        this.y += vec.y * PLAYER_SPEED * dt;
        this.x = Math.max(20, Math.min(game.width - 20, this.x));
        this.y = Math.max(20, Math.min(game.height - 20, this.y));

        this.lastShoot += dt;
        if (input.keys.Space && this.lastShoot > this.fireInterval) {
            this.lastShoot = 0;
            this.firePattern();
            game.sound.playLaser();
        }
    }

    firePattern() {
        const index = Math.min(Math.max(this.weaponLevel, 1), WEAPON_PATTERNS.length) - 1;
        const pattern = WEAPON_PATTERNS[index];
        pattern.forEach(p => {
            game.bullets.push(new Bullet(this.x + p.dx, this.y + p.dy, p.vx, p.vy, 'player'));
        });
    }

    upgradeWeapon() {
        if (this.weaponLevel < WEAPON_PATTERNS.length) {
            this.weaponLevel += 1;
        }
    }

    downgradeWeapon() {
        this.weaponLevel = Math.max(1, this.weaponLevel - 1);
    }
}

class Bullet extends Entity {
    constructor(x, y, vx, vy, owner) {
        super(x, y, 10, 10, owner === 'player' ? 5 : 6);
        this.vx = vx;
        this.vy = vy;
        this.owner = owner;
    }

    update(dt) {
        this.x += this.vx * BULLET_SPEED * dt;
        this.y += this.vy * BULLET_SPEED * dt;
        if (this.x < -50 || this.x > game.width + 50 || this.y < -50 || this.y > game.height + 50) {
            this.active = false;
        }
    }
}

class Enemy extends Entity {
    constructor(x, y, type, speedScale = 1, fireScale = 1) {
        super(x, y, 32, 32, type);
        this.hp = type === 14 ? 60 : (type === 13 ? 15 : 30);
        this.timer = 0;
        this.fireTimer = 0;
        this.burstTimer = 0;
        this.waveOffset = Math.random() * Math.PI * 2;
        this.speedJitter = 0.85 + Math.random() * 0.4;
        this.shootCooldown = 1.4 + Math.random() * 0.8;
        this.levelSpeedScale = speedScale;
        this.levelFireScale = fireScale;
    }

    update(dt) {
        this.timer += dt;
        this.fireTimer += dt;
        this.burstTimer += dt;

        let speedFactor = this.type === 13 ? 2.8 : (this.type === 14 ? 0.65 : 1.1);
        let yOffset = 0;

        // Movement Patterns
        if (this.type === 11) { // Scout: wavy with short dashes
            yOffset += Math.sin((this.x + this.waveOffset) * 0.04) * 6;
            yOffset += Math.cos((this.timer + this.waveOffset) * 5) * 2;
            if (this.burstTimer > 3.6) {
                speedFactor += 1.8;
                if (this.burstTimer > 3.9) this.burstTimer = 0;
            }
        } else if (this.type === 12) { // Fighter: weaving line
            yOffset += Math.sin((this.timer + this.waveOffset) * 3) * 2;
        } else if (this.type === 13) { // Interceptor: fast zigzag
            yOffset += Math.cos((this.timer + this.waveOffset) * 8) * 5;
            if (this.burstTimer > 1.4) {
                speedFactor += 1.2;
                if (this.burstTimer > 1.7) this.burstTimer = 0;
            }
        } else if (this.type === 14) { // Tank: slow drift to keep moving targets
            yOffset += Math.sin((this.timer + this.waveOffset) * 2) * 1.5;
        }

        this.x -= ENEMY_BASE_SPEED * speedFactor * this.speedJitter * this.levelSpeedScale * dt;
        this.y += yOffset;

        const straightShots = game.levelIndex < 5;

        // Shooting Logic
        if (this.type === 11 && this.fireTimer > 2.2 * this.levelFireScale) {
            this.fireTimer = 0;
            const vy = straightShots ? 0 : Math.max(-0.45, Math.min(0.45, (game.player.y - this.y) / 320));
            game.bullets.push(new Bullet(this.x - 20, this.y, -1.0, vy, 'enemy'));
            game.sound.playEnemyLaser();
        } else if (this.type === 12 && this.fireTimer > this.shootCooldown * this.levelFireScale) { // Fighter
            this.fireTimer = 0;
            const aimY = straightShots ? 0 : (game.player.y - this.y) / 240;
            game.bullets.push(new Bullet(this.x - 20, this.y, -0.85, aimY + 0.15, 'enemy'));
            game.bullets.push(new Bullet(this.x - 20, this.y, -0.85, aimY - 0.15, 'enemy'));
            game.sound.playEnemyLaser();
        } else if (this.type === 13 && this.fireTimer > 1.9 * this.levelFireScale) { // Interceptor support fire
            this.fireTimer = 0;
            const aimY = straightShots ? 0 : (game.player.y - this.y) / 260;
            game.bullets.push(new Bullet(this.x - 15, this.y, -1.1, aimY, 'enemy'));
            game.sound.playEnemyLaser();
        } else if (this.type === 14 && this.fireTimer > (this.shootCooldown + 0.8) * this.levelFireScale) { // Tank
            this.fireTimer = 0;
            const aim = straightShots ? 0 : (game.player.y - this.y) / 300;
            game.bullets.push(new Bullet(this.x, this.y, -0.65, aim, 'enemy'));
            game.bullets.push(new Bullet(this.x, this.y, -0.65, aim + 0.18, 'enemy'));
            game.bullets.push(new Bullet(this.x, this.y, -0.65, aim - 0.18, 'enemy'));
            game.bullets.push(new Bullet(this.x, this.y, -0.65, aim + 0.36, 'enemy'));
            game.bullets.push(new Bullet(this.x, this.y, -0.65, aim - 0.36, 'enemy'));
            game.sound.playEnemyLaser();
        }

        if (this.x < -50) this.active = false;
    }
}

class Asteroid extends Entity {
    constructor(x, y) {
        const roll = Math.random();
        const config = roll > 0.65
            ? { radius: 55 + Math.random() * 30, hp: 90, speed: 0.65 }     // Large chunks
            : roll > 0.3
                ? { radius: 30 + Math.random() * 18, hp: 60, speed: 0.85 }  // Medium rocks
                : { radius: 12 + Math.random() * 10, hp: 30, speed: 1.2 }; // Small debris

        super(x, y, config.radius * 2, config.radius * 2, 20);
        this.hp = config.hp;
        this.speedScale = config.speed;
        this.rotSpeed = (Math.random() - 0.5) * 2.2;
        this.points = this.generatePoints(config.radius);
    }

    generatePoints(radius) {
        const count = 7 + Math.floor(Math.random() * 5);
        const verts = [];
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const noise = 0.55 + Math.random() * 0.6;
            const r = radius * noise;
            verts.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
        }
        return verts;
    }

    draw(ctx) {
        if (!this.active || !this.points?.length) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = '#888';
        ctx.strokeStyle = '#bbb';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    update(dt) {
        this.x -= (ENEMY_BASE_SPEED * this.speedScale) * dt;
        this.rotation += this.rotSpeed * dt;
        if (this.x < -50) this.active = false;
    }
}

// --- BOSS CLASSES ---
class Boss extends Entity {
    constructor(x, y, name) {
        super(x, y, 100, 100, 99);
        this.name = name;
        this.hp = 500;
        this.maxHp = 500;
        this.timer = 0;
        this.phase = 0;
        this.dirY = 1;
    }

    draw(ctx) {
        if (!this.active) return;
        ctx.save();
        ctx.translate(this.x, this.y);

        // Custom Boss Visuals - monstrous forms
        ctx.fillStyle = '#c30030';
        ctx.strokeStyle = '#f8b4c4';
        ctx.lineWidth = 3;
        if (this.name === 'ScrapGuardian' && game?.sprites?.boss1) {
            ctx.drawImage(game.sprites.boss1, -70, -70);
        } else if (this.name === 'RaiderCaptain' && game?.sprites?.boss2) {
            ctx.drawImage(game.sprites.boss2, -70, -70);
        } else if (this.name === 'ScrapGuardian') {
            // Central eye with four writhing limbs
            ctx.beginPath();
            ctx.ellipse(0, 0, 55, 45, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#110011';
            ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#66ffcc';
            ctx.beginPath(); ctx.arc(6, -4, 8, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#ff6688';
            for (let i = 0; i < 4; i++) {
                const angle = i * Math.PI / 2;
                ctx.beginPath();
                ctx.moveTo(Math.cos(angle) * 40, Math.sin(angle) * 40);
                ctx.quadraticCurveTo(Math.cos(angle) * 70, Math.sin(angle) * 70 + 20, Math.cos(angle + 0.4) * 90, Math.sin(angle + 0.4) * 90);
                ctx.stroke();
            }
            ctx.strokeStyle = '#ff99cc';
            ctx.beginPath();
            ctx.moveTo(-20, -25); ctx.lineTo(-10, -45); ctx.lineTo(0, -28); ctx.lineTo(10, -45); ctx.lineTo(20, -25);
            ctx.stroke();
        } else if (this.name === 'RaiderCaptain') {
            // Manta-like eldritch head with tendrils
            ctx.beginPath();
            ctx.moveTo(60, 0); ctx.quadraticCurveTo(10, -50, -50, -20); ctx.quadraticCurveTo(-70, 0, -50, 20); ctx.quadraticCurveTo(10, 50, 60, 0);
            ctx.fill();
            ctx.stroke();
            ctx.strokeStyle = '#99ffcc';
            for (let t = -1; t <= 1; t += 0.5) {
                ctx.beginPath();
                ctx.moveTo(-30 + t * 10, 10 + t * 6);
                ctx.quadraticCurveTo(-10 + t * 20, 40 + t * 40, -50 + t * 30, 80 + t * 50);
                ctx.stroke();
            }
            ctx.fillStyle = '#220011';
            ctx.beginPath(); ctx.arc(20, 0, 10, 0, Math.PI * 2); ctx.fill();
        } else if (this.name === 'IonWyrm') {
            // Serpentine body with spines
            ctx.beginPath();
            ctx.moveTo(-70, -10); ctx.quadraticCurveTo(-20, -40, 30, -10); ctx.quadraticCurveTo(70, 20, 30, 40); ctx.quadraticCurveTo(-20, 20, -70, 10); ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.strokeStyle = '#55ff99';
            for (let i = -60; i <= 40; i += 20) {
                ctx.beginPath();
                ctx.moveTo(i, -8);
                ctx.lineTo(i + 10, -30);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(i + 6, 8);
                ctx.lineTo(i - 4, 28);
                ctx.stroke();
            }
            ctx.fillStyle = '#8cf4ff';
            ctx.beginPath(); ctx.arc(10, 0, 10, 0, Math.PI * 2); ctx.fill();
        } else if (this.name === 'DockOverseer' || this.name === 'MutagenCore') {
            // Pulsing core with tentacle ring
            ctx.beginPath(); ctx.arc(0, 0, 45, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#5bffef';
            ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#ff99cc';
            for (let i = 0; i < 6; i++) {
                const ang = (i / 6) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(Math.cos(ang) * 35, Math.sin(ang) * 35);
                ctx.quadraticCurveTo(Math.cos(ang) * 70, Math.sin(ang) * 70 + 10, Math.cos(ang + 0.3) * 90, Math.sin(ang + 0.3) * 90);
                ctx.stroke();
            }
        } else if (this.name === 'RingFortress' || this.name === 'WarMech') {
            // Maw ring with spikes
            ctx.beginPath(); ctx.ellipse(0, 0, 60, 40, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#220011';
            ctx.beginPath(); ctx.ellipse(0, 0, 30, 20, 0, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#ff6699';
            for (let i = 0; i < 8; i++) {
                const ang = (i / 8) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(Math.cos(ang) * 60, Math.sin(ang) * 40);
                ctx.lineTo(Math.cos(ang) * 80, Math.sin(ang) * 60);
                ctx.stroke();
            }
            ctx.fillStyle = '#ffdee6';
            for (let i = 0; i < 6; i++) {
                ctx.beginPath();
                ctx.arc(Math.cos(i) * 25, Math.sin(i) * 15, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (this.name === 'TunnelSerpent' || this.name === 'CitadelAegis' || this.name === 'CoreOvermind') {
            // Tentacled horror with multiple arms
            ctx.beginPath(); ctx.ellipse(0, 0, 50, 35, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = '#550022';
            ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#ff88aa';
            for (let i = 0; i < 6; i++) {
                const ang = (i / 6) * Math.PI * 2;
                ctx.beginPath();
                ctx.moveTo(Math.cos(ang) * 35, Math.sin(ang) * 35);
                ctx.bezierCurveTo(Math.cos(ang) * 60, Math.sin(ang) * 60, Math.cos(ang + 0.3) * 90, Math.sin(ang + 0.3) * 90, Math.cos(ang + 0.6) * 110, Math.sin(ang + 0.6) * 110);
                ctx.stroke();
            }
            ctx.fillStyle = '#ffe1f1';
            ctx.beginPath(); ctx.arc(-10, -8, 5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(12, -4, 5, 0, Math.PI * 2); ctx.fill();
        } else {
            // Fallback monstrous shell
            ctx.beginPath();
            ctx.moveTo(0, -50); ctx.quadraticCurveTo(50, -20, 40, 30); ctx.quadraticCurveTo(0, 60, -40, 30); ctx.quadraticCurveTo(-50, -20, 0, -50);
            ctx.fill();
            ctx.strokeStyle = '#ff99bb'; ctx.stroke();
        }

        ctx.restore();
    }

    update(dt) {
        this.timer += dt;

        // Entrance
        if (this.x > game.width - 150) {
            this.x -= 50 * dt;
            return;
        }

        // Behavior Switch
        switch (this.name) {
            case 'ScrapGuardian': this.behaviorBasic(dt); break;
            case 'RaiderCaptain': this.behaviorDash(dt); break;
            case 'IonWyrm': this.behaviorSine(dt); break;
            case 'DockOverseer': this.behaviorTurret(dt); break;
            case 'MutagenCore': this.behaviorSpawn(dt); break;
            case 'RingFortress': this.behaviorRing(dt); break;
            case 'WarMech': this.behaviorSweep(dt); break;
            case 'TunnelSerpent': this.behaviorSnake(dt); break;
            case 'CitadelAegis': this.behaviorShield(dt); break;
            case 'CoreOvermind': this.behaviorBulletHell(dt); break;
            default: this.behaviorBasic(dt);
        }
    }

    // Behaviors
    behaviorBasic(dt) {
        this.y += 50 * this.dirY * dt;
        if (this.y > game.height - 80) this.dirY = -1;
        if (this.y < 80) this.dirY = 1;

        if (this.timer > 1.5) {
            this.timer = 0;
            game.bullets.push(new Bullet(this.x - 50, this.y, -0.5, 0, 'enemy'));
            game.sound.playEnemyLaser();
        }
    }

    behaviorDash(dt) {
        this.y += 30 * this.dirY * dt;
        if (this.y > game.height - 80) this.dirY = -1;
        if (this.y < 80) this.dirY = 1;

        if (this.timer > 2.0) {
            this.timer = 0;
            // Spread
            for (let i = -2; i <= 2; i++) {
                game.bullets.push(new Bullet(this.x - 40, this.y, -0.6, i * 0.2, 'enemy'));
            }
            game.sound.playEnemyLaser();
        }
    }

    behaviorSine(dt) {
        this.y = game.height / 2 + Math.sin(Date.now() / 500) * 150;
        if (this.timer > 0.5) {
            this.timer = 0;
            game.bullets.push(new Bullet(this.x - 50, this.y, -0.8, 0, 'enemy'));
            game.sound.playEnemyLaser();
        }
    }

    behaviorTurret(dt) {
        // Stationary vertical
        this.y += 20 * this.dirY * dt;
        if (this.y > game.height - 100) this.dirY = -1;
        if (this.y < 100) this.dirY = 1;

        if (this.timer > 1.0) {
            this.timer = 0;
            game.bullets.push(new Bullet(this.x, this.y - 40, -0.6, 0, 'enemy'));
            game.bullets.push(new Bullet(this.x, this.y + 40, -0.6, 0, 'enemy'));
            game.sound.playEnemyLaser();
        }
    }

    behaviorSpawn(dt) {
        if (this.timer > 3.0) {
            this.timer = 0;
            game.enemies.push(new Enemy(this.x - 50, this.y, 11, game.enemySpeedScale, game.enemyFireScale)); // Spawn minion
        }
    }

    behaviorRing(dt) {
        if (this.timer > 2.5) {
            this.timer = 0;
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                game.bullets.push(new Bullet(this.x, this.y, Math.cos(angle) * 0.5, Math.sin(angle) * 0.5, 'enemy'));
            }
            game.sound.playEnemyLaser();
        }
    }

    behaviorSweep(dt) {
        this.y += 150 * this.dirY * dt; // Fast
        if (this.y > game.height - 50) this.dirY = -1;
        if (this.y < 50) this.dirY = 1;

        if (Math.random() < 0.05) {
            game.bullets.push(new Bullet(this.x, this.y, -0.7, 0, 'enemy'));
        }
    }

    behaviorSnake(dt) {
        this.x = (game.width - 100) + Math.sin(Date.now() / 1000) * 50;
        this.y = game.height / 2 + Math.cos(Date.now() / 800) * 150;
        if (this.timer > 0.2) {
            this.timer = 0;
            game.bullets.push(new Bullet(this.x, this.y, -0.5, (Math.random() - 0.5), 'enemy'));
        }
    }

    behaviorShield(dt) {
        // High HP, slow shots
        if (this.timer > 2.0) {
            this.timer = 0;
            game.bullets.push(new Bullet(this.x, this.y, -0.4, 0, 'enemy'));
        }
    }

    behaviorBulletHell(dt) {
        // Final Boss
        this.y = game.height / 2 + Math.sin(Date.now() / 1000) * 100;
        if (this.timer > 0.1) {
            this.timer = 0;
            const angle = (Date.now() / 500);
            game.bullets.push(new Bullet(this.x, this.y, Math.cos(angle) * 0.6, Math.sin(angle) * 0.6, 'enemy'));
            game.bullets.push(new Bullet(this.x, this.y, Math.cos(angle + Math.PI) * 0.6, Math.sin(angle + Math.PI) * 0.6, 'enemy'));
        }
    }
}

// --- Game Engine ---
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.sprites = { player: null, playerBullet: null, scout: null, fighter: null, interceptor: null, tank: null, boss1: null, boss2: null };

        this.sound = new SoundManager();
        this.input = new InputHandler();
        this.input.onStart = () => this.start();
        this.player = new Player(100, this.height / 2);
        this.bullets = [];
        this.enemies = [];
        this.items = [];
        this.stars = [];
        this.dropCounts = { weapon: 0, heal: 0 };
        this.dropLimits = { weapon: 0, heal: 5 };

        // Init Stars
        for (let i = 0; i < 150; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                speed: Math.random() * 2 + 0.5,
                size: Math.random() * 2
            });
        }

        this.ui = {
            start: document.getElementById('start-screen'),
            startBtn: document.getElementById('start-button'),
            hud: document.getElementById('hud'),
            score: document.getElementById('score'),
            level: document.getElementById('level'),
            hp: document.getElementById('health-fill'),
            progress: document.getElementById('level-progress-fill'),
            label: document.getElementById('level-progress-label'),
            bossBar: document.getElementById('boss-bar'),
            bossFill: document.getElementById('boss-bar-fill'),
            bossLabel: document.getElementById('boss-label')
        };

        this.score = 0;
        this.levelIndex = 0; // 0 to 9
        this.levelTime = 0;
        this.bossSpawned = false;
        this.isRunning = false;
        this.lastTime = 0;
        this.spawnTimer = 0;
        this.enemySpeedScale = 1;
        this.enemyFireScale = 1;
        if (this.ui.bossBar) this.ui.bossBar.classList.add('hidden');

        // Start button handlers (touch/click)
        this.ui.startBtn.addEventListener('click', e => {
            e.preventDefault();
            this.input.keys.Space = true;
            this.start();
        });
        this.ui.startBtn.addEventListener('touchstart', e => {
            e.preventDefault();
            this.input.keys.Space = true;
            this.start();
        }, { passive: false });

        window.addEventListener('resize', () => {
            this.width = this.canvas.width = window.innerWidth;
            this.height = this.canvas.height = window.innerHeight;
        });

        this.loadPlayerSprite();
        this.loadPlayerBulletSprite();
        this.loadScoutSprite();
        this.loadFighterSprite();
        this.loadInterceptorSprite();
        this.loadTankSprite();
        this.loadBoss1Sprite();
        this.loadBoss2Sprite();
        requestAnimationFrame(t => this.loop(t));
    }

    loadPlayerSprite() {
        const img = new Image();
        img.src = 'assets/player sprite first.png';
        img.onload = () => {
            const size = 64;
            const scaled = document.createElement('canvas');
            scaled.width = size;
            scaled.height = size;
            const ctx = scaled.getContext('2d');
            const scale = size / Math.max(img.width, img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
            this.sprites.player = scaled;
        };
        img.onerror = (e) => console.error('Failed to load player sprite', e);
    }

    loadPlayerBulletSprite() {
        const img = new Image();
        img.src = 'assets/player bullet.png';
        img.onload = () => {
            const size = 28; // bullet hitbox 10, make visual noticeably larger
            const scaled = document.createElement('canvas');
            scaled.width = size;
            scaled.height = size;
            const ctx = scaled.getContext('2d');
            const scale = size / Math.max(img.width, img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
            this.sprites.playerBullet = scaled;
        };
        img.onerror = (e) => console.error('Failed to load player bullet sprite', e);
    }

    loadScoutSprite() {
        const img = new Image();
        img.src = 'assets/scout.png';
        img.onload = () => {
            const size = 48; // Scout hitbox 32, allow slight bleed
            const scaled = document.createElement('canvas');
            scaled.width = size;
            scaled.height = size;
            const ctx = scaled.getContext('2d');
            const scale = size / Math.max(img.width, img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
            this.sprites.scout = scaled;
        };
        img.onerror = (e) => console.error('Failed to load scout sprite', e);
    }

    loadFighterSprite() {
        const img = new Image();
        img.src = 'assets/fighter.png';
        img.onload = () => {
            const size = 48; // Fighter hitbox 32, allow slight bleed
            const scaled = document.createElement('canvas');
            scaled.width = size;
            scaled.height = size;
            const ctx = scaled.getContext('2d');
            const scale = size / Math.max(img.width, img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
            this.sprites.fighter = scaled;
        };
        img.onerror = (e) => console.error('Failed to load fighter sprite', e);
    }

    loadInterceptorSprite() {
        const img = new Image();
        img.src = 'assets/interceptor sprites.png';
        img.onload = () => {
            const size = 48; // Interceptor hitbox 32, allow slight bleed
            const scaled = document.createElement('canvas');
            scaled.width = size;
            scaled.height = size;
            const ctx = scaled.getContext('2d');
            const scale = size / Math.max(img.width, img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
            this.sprites.interceptor = scaled;
        };
        img.onerror = (e) => console.error('Failed to load interceptor sprite', e);
    }

    loadTankSprite() {
        const img = new Image();
        img.src = 'assets/tank.png';
        img.onload = () => {
            const size = 56; // Tank hitbox 32, allow bulkier look
            const scaled = document.createElement('canvas');
            scaled.width = size;
            scaled.height = size;
            const ctx = scaled.getContext('2d');
            const scale = size / Math.max(img.width, img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
            this.sprites.tank = scaled;
        };
        img.onerror = (e) => console.error('Failed to load tank sprite', e);
    }

    loadBoss1Sprite() {
        const img = new Image();
        img.src = 'assets/boss 1.png';
        img.onload = () => {
            const size = 140; // Boss hitbox 100, allow larger silhouette
            const scaled = document.createElement('canvas');
            scaled.width = size;
            scaled.height = size;
            const ctx = scaled.getContext('2d');
            const scale = size / Math.max(img.width, img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
            this.sprites.boss1 = scaled;
        };
        img.onerror = (e) => console.error('Failed to load boss sprite', e);
    }

    loadBoss2Sprite() {
        const img = new Image();
        img.src = 'assets/boss 2.png';
        img.onload = () => {
            const size = 140; // Boss hitbox 100, allow larger silhouette
            const scaled = document.createElement('canvas');
            scaled.width = size;
            scaled.height = size;
            const ctx = scaled.getContext('2d');
            const scale = size / Math.max(img.width, img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
            this.sprites.boss2 = scaled;
        };
        img.onerror = (e) => console.error('Failed to load boss sprite', e);
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.ui.start.classList.add('hidden');
        this.ui.hud.classList.remove('hidden');
        this.score = 0;
        this.levelIndex = 0;
        this.startLevel();
        this.player.hp = 100;
        this.player.weaponLevel = 1;
        this.bullets = [];
        this.enemies = [];
        this.items = [];
        this.input.reset();
        this.sound.playPowerup();
        this.sound.playMusic('level');
    }

    startLevel() {
        this.levelTime = 0;
        this.bossSpawned = false;
        this.enemies = [];
        this.bullets = [];
        this.items = [];
        this.input.reset();
        this.player.x = 100;
        this.player.y = this.height / 2;
        this.player.lastShoot = 0;
        this.spawnTimer = 0;
        const config = LEVEL_CONFIG[this.levelIndex];
        this.enemySpeedScale = config.enemySpeedScale || 1;
        this.enemyFireScale = config.enemyFireScale || 1;
        this.ui.level.innerText = config.name + " (LVL " + (this.levelIndex + 1) + ")";
        this.ui.label.innerText = "BOSS APPROACHING";
        this.ui.label.style.color = "#ff0";
        if (this.ui.bossBar) this.ui.bossBar.classList.add('hidden');
        // Reset drop counters and limits per level
        this.dropCounts = { weapon: 0, heal: 0 };
        const levelNum = this.levelIndex + 1;
        const weaponMaxMap = { 2: 1, 4: 2, 6: 3, 8: 3, 10: 4 };
        this.dropLimits.weapon = weaponMaxMap[levelNum] || 0;
        this.dropLimits.heal = levelNum === 10 ? 8 : 3;

        // Show overlay
        this.sound.playMusic('level');
    }

    loop(timestamp) {
        if (!this.lastTime) this.lastTime = timestamp;
        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
        this.lastTime = timestamp;

        if (this.isRunning) {
            this.update(dt);
            this.draw();
        }

        requestAnimationFrame(t => this.loop(t));
    }

    update(dt) {
        this.player.update(dt, this.input);
        const config = LEVEL_CONFIG[this.levelIndex];

        // Level Progress
        this.levelTime += dt;
        const progress = Math.min(100, (this.levelTime / config.duration) * 100);
        this.ui.progress.style.width = progress + '%';

        // Boss Spawn
        if (this.levelTime >= config.duration && !this.bossSpawned) {
            this.bossSpawned = true;
            // this.enemies = []; // REMOVED: Keep existing enemies
            const boss = new Boss(this.width + 100, this.height / 2, config.boss);
            // Scale Boss HP by level
            boss.maxHp += this.levelIndex * 200;
            boss.hp = boss.maxHp;
            this.enemies.push(boss);

            this.ui.label.innerText = "WARNING: BOSS DETECTED";
            this.ui.label.style.color = "#f00";
            this.sound.playBossWarning();
            this.sound.playMusic('boss');
            if (this.ui.bossBar) this.ui.bossBar.classList.remove('hidden');
        }

        // Spawner
        if (!this.bossSpawned) {
            this.spawnTimer += dt;
            if (this.spawnTimer > config.spawnRate) {
                this.spawnTimer = 0;
                const y = Math.random() * (this.height - 60) + 30;

                // Pick random enemy from allowed types
                const type = config.enemies[Math.floor(Math.random() * config.enemies.length)];

                if (type === 20) {
                    this.enemies.push(new Asteroid(this.width + 50, y));
                } else {
                    this.enemies.push(new Enemy(this.width + 50, y, type, this.enemySpeedScale, this.enemyFireScale));
                }
            }
        }

        // Updates
        this.bullets.forEach(b => b.update(dt));
        this.enemies.forEach(e => e.update(dt));
        this.items.forEach(i => i.update(dt));

        // Stars Parallax
        this.stars.forEach(s => {
            s.x -= s.speed * config.bgSpeed;
            if (s.x < 0) s.x = this.width;
        });

        this.checkCollisions();

        // Cleanup
        this.bullets = this.bullets.filter(b => b.active);
        this.enemies = this.enemies.filter(e => e.active);
        this.items = this.items.filter(i => i.active);

        // HUD
        this.ui.score.innerText = 'SCORE: ' + this.score.toString().padStart(6, '0');
        this.ui.hp.style.width = Math.max(0, (this.player.hp / this.player.maxHp) * 100) + '%';
        const boss = this.enemies.find(e => e.type === 99);
        if (boss && this.ui.bossBar) {
            this.ui.bossBar.classList.remove('hidden');
            if (this.ui.bossFill) {
                this.ui.bossFill.style.width = Math.max(0, (boss.hp / boss.maxHp) * 100) + '%';
            }
            if (this.ui.bossLabel) {
                this.ui.bossLabel.innerText = boss.name + ' HP';
            }
        } else if (this.ui.bossBar) {
            this.ui.bossBar.classList.add('hidden');
        }
    }

    draw() {
        const bg = LEVEL_BACKGROUNDS[this.levelIndex % LEVEL_BACKGROUNDS.length];
        const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
        grad.addColorStop(0, bg.gradient[0]);
        grad.addColorStop(1, bg.gradient[1]);
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw Stars
        this.ctx.fillStyle = '#cfe7ff';
        this.stars.forEach(s => {
            this.ctx.beginPath();
            this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.player.draw(this.ctx);
        this.bullets.forEach(b => b.draw(this.ctx));
        this.enemies.forEach(e => e.draw(this.ctx));
        this.items.forEach(i => i.draw(this.ctx));
    }

    checkCollisions() {
        // Player Bullets
        this.bullets.forEach(b => {
            if (!b.active || b.owner !== 'player') return;
            this.enemies.forEach(e => {
                if (!e.active) return;
                const dist = Math.hypot(b.x - e.x, b.y - e.y);
                if (dist < (e.width / 2 + 5)) {
                    b.active = false;
                    e.hp -= 10;
                    if (e.hp <= 0) {
                        e.active = false;
                        this.score += (e.type === 99 ? 5000 : (e.type === 14 ? 500 : 100));
                        this.sound.playExplosion();
                        if (e.type !== 99) this.spawnDrop(e.x, e.y);

                        if (e.type === 99) {
                            this.nextLevel();
                        }
                    }
                }
            });
        });

        // Enemy Bullets
        this.bullets.forEach(b => {
            if (!b.active || b.owner !== 'enemy') return;
            const dist = Math.hypot(b.x - this.player.x, b.y - this.player.y);
            if (dist < (this.player.width / 2 + 4)) {
                b.active = false;
                this.player.hp -= 10;
                this.player.downgradeWeapon();
                this.sound.playExplosion();
                if (this.player.hp <= 0) this.gameOver();
            }
        });

        // Body Collisions
        this.enemies.forEach(e => {
            if (!e.active) return;
            const dist = Math.hypot(e.x - this.player.x, e.y - this.player.y);
            if (dist < (e.width / 2 + 16)) {
                if (e.type === 20) { // Asteroid
                    e.active = false;
                    this.player.hp -= 30;
                } else if (e.type === 99) { // Boss
                    this.player.hp -= 1;
                } else {
                    e.active = false;
                    this.player.hp -= 20;
                }
                this.player.downgradeWeapon();
                this.sound.playExplosion();
                if (this.player.hp <= 0) this.gameOver();
            }
        });

        // Item pickups
        this.items.forEach(it => {
            if (!it.active) return;
            const dist = Math.hypot(it.x - this.player.x, it.y - this.player.y);
            if (dist < 24) {
                it.active = false;
                if (it.kind === 'weapon') {
                    this.player.upgradeWeapon();
                    this.sound.playPowerup();
                } else if (it.kind === 'heal') {
                    this.player.hp = Math.min(this.player.maxHp, this.player.hp + 40);
                    this.sound.playPowerup();
                }
            }
        });
    }

    spawnDrop(x, y) {
        const roll = Math.random();
        const weaponAllowed = this.dropLimits.weapon > 0 && this.dropCounts.weapon < this.dropLimits.weapon;
        const healAllowed = this.dropCounts.heal < this.dropLimits.heal;
        if (weaponAllowed && roll < 0.18) {
            this.items.push(new Item(x, y, 'weapon'));
            this.dropCounts.weapon += 1;
        } else if (healAllowed && roll < 0.32) {
            this.items.push(new Item(x, y, 'heal'));
            this.dropCounts.heal += 1;
        }
    }

    nextLevel() {
        this.levelIndex++;
        if (this.levelIndex >= LEVEL_CONFIG.length) {
            alert("CONGRATULATIONS! YOU HAVE SAVED THE GALAXY!\nFinal Score: " + this.score);
            location.reload();
            return;
        }

        // Heal
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + 50);
        this.sound.playMusic('level');
        this.startLevel();
    }

    gameOver() {
        this.isRunning = false;
        this.sound.stopMusic();
        alert("GAME OVER\nScore: " + this.score + "\nReached: " + LEVEL_CONFIG[this.levelIndex].name);
        location.reload();
    }
}

const game = new Game();
