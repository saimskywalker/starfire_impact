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
    { duration: 60, spawnRate: 1.8, bgSpeed: 0.8, enemies: [11, 20, 20], boss: 'RaiderCaptain', name: "ASTEROID FIELD", enemySpeedScale: 0.8, enemyFireScale: 1.2 },
    { duration: 60, spawnRate: 1.2, bgSpeed: 1.2, enemies: [11, 12], boss: 'IonWyrm', name: "ION NEBULA", enemySpeedScale: 1.05, enemyFireScale: 0.9, enemyAimAggression: 1.1 },
    { duration: 60, spawnRate: 1.5, bgSpeed: 1.2, enemies: [11, 12, 20, 20], boss: 'DockOverseer', name: "ORBITAL DOCK", enemySpeedScale: 0.9, enemyFireScale: 1.1 },
    { duration: 60, spawnRate: 1.8, bgSpeed: 1.5, enemies: [12, 13], boss: 'MutagenCore', name: "BIO LABS", enemySpeedScale: 0.95, enemyFireScale: 1.05 },
    { duration: 60, spawnRate: 0.6, bgSpeed: 2.0, enemies: [12, 13, 14, 20, 20], boss: 'RingFortress', name: "DEFENSE GRID", enemySpeedScale: 1.1, enemyFireScale: 0.9, enemyAimAggression: 1.1 },
    { duration: 60, spawnRate: 0.65, bgSpeed: 2.5, enemies: [13, 14], boss: 'WarMech', name: "FACTORY SECTOR", enemySpeedScale: 1.15, enemyFireScale: 0.85, enemyAimAggression: 1.25 },
    { duration: 60, spawnRate: 0.45, bgSpeed: 3.0, enemies: [11, 12, 13, 14, 20, 20], boss: ['AbyssAlpha', 'AbyssBeta'], twinBoss: true, name: "DEEP SPACE", enemySpeedScale: 1.22, enemyFireScale: 0.82, enemyAimAggression: 1.35 },
    { duration: 60, spawnRate: 0.35, bgSpeed: 4.0, enemies: [11, 12, 13, 14, 20], boss: 'EclipsePillar', name: "THE CITADEL", enemySpeedScale: 1.35, enemyFireScale: 0.75, enemyAimAggression: 1.45 },
    { duration: 70, spawnRate: 0.3, bgSpeed: 5.5, enemies: [11, 12, 13, 14, 20], boss: 'OblivionMonolith', name: "CORE SYSTEM", enemySpeedScale: 1.5, enemyFireScale: 0.7, enemyAimAggression: 1.6 }
];

// Backdrops per level for galaxy vistas (planets omitted for stability)
const LEVEL_BACKGROUNDS = [
    { gradient: ['#050510', '#0d1f3c'] },
    { gradient: ['#080b1c', '#142a54'] },
    { gradient: ['#0b1224', '#1d3c70'] },
    { gradient: ['#0a0a1e', '#2b1c4a'] },
    { gradient: ['#0a0c18', '#1f2f63'] },
    { gradient: ['#050a1a', '#11305a'] },
    { gradient: ['#071018', '#22325a'] },
    { gradient: ['#060a14', '#16254a'] },
    { gradient: ['#090f1b', '#24345c'] },
    { gradient: ['#050711', '#122040'] }
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

    playMusic(type = 'level', variant = null) {
        if (!this.ensureCtx()) return;
        this.stopMusic();

        try {
            const now = this.ctx.currentTime;
            const profiles = {
                level: { base: 65, type1: 'triangle', type2: 'square', filter: 1000, gain: 0.03, lfoFreq: 0.7, lfoDepth: 12 },
                boss: { base: 95, type1: 'sawtooth', type2: 'square', filter: 1600, gain: 0.045, lfoFreq: 2, lfoDepth: 35 },
                MutagenCore: { base: 102, type1: 'sawtooth', type2: 'triangle', filter: 1500, gain: 0.05, lfoFreq: 2.4, lfoDepth: 26 },
                RingFortress: { base: 108, type1: 'square', type2: 'sawtooth', filter: 1700, gain: 0.052, lfoFreq: 2.1, lfoDepth: 30 },
                WarMech: { base: 118, type1: 'sawtooth', type2: 'sawtooth', filter: 1850, gain: 0.055, lfoFreq: 2.6, lfoDepth: 36 },
                TunnelSerpent: { base: 110, type1: 'triangle', type2: 'sawtooth', filter: 1750, gain: 0.05, lfoFreq: 1.8, lfoDepth: 28 },
                AbyssAlpha: { base: 125, type1: 'sawtooth', type2: 'square', filter: 1950, gain: 0.058, lfoFreq: 2.9, lfoDepth: 42 },
                AbyssBeta: { base: 128, type1: 'square', type2: 'triangle', filter: 1900, gain: 0.056, lfoFreq: 3.1, lfoDepth: 38 },
                EclipsePillar: { base: 132, type1: 'sawtooth', type2: 'sawtooth', filter: 2000, gain: 0.06, lfoFreq: 3.2, lfoDepth: 44 },
                OblivionMonolith: { base: 140, type1: 'square', type2: 'sawtooth', filter: 2100, gain: 0.065, lfoFreq: 3.5, lfoDepth: 50 }
            };
            const profile = profiles[variant] || profiles[type === 'boss' ? 'boss' : 'level'];
            const base = profile.base;
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const filter = this.ctx.createBiquadFilter();
            const gain = this.ctx.createGain();
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();

            osc1.type = profile.type1;
            osc2.type = profile.type2;
            osc1.frequency.setValueAtTime(base, now);
            osc2.frequency.setValueAtTime(base * 1.6, now);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(profile.filter, now);
            filter.Q.setValueAtTime(0.8, now);

            gain.gain.setValueAtTime(profile.gain, now);

            lfo.frequency.setValueAtTime(profile.lfoFreq, now);
            lfoGain.gain.setValueAtTime(profile.lfoDepth, now);
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
                if (game?.getPlayerSpriteForWeapon) {
                    const sprite = game.getPlayerSpriteForWeapon(game.player?.weaponLevel || 1);
                    if (sprite) {
                        ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
                        break;
                    }
                } else if (game?.sprites?.player) {
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
                if (game?.sprites?.enemyBullet) {
                    const sprite = game.sprites.enemyBullet;
                    ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
                    break;
                }
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
            case 20: // Asteroid (fallback)
                ctx.fillStyle = '#888';
                ctx.beginPath();
                ctx.moveTo(-15, -10); ctx.lineTo(0, -15); ctx.lineTo(15, -10); ctx.lineTo(20, 0);
                ctx.lineTo(15, 15); ctx.lineTo(-5, 20); ctx.lineTo(-20, 10); ctx.lineTo(-15, 0);
                ctx.closePath(); ctx.fill(); ctx.stroke();
                break;
            case 30: // Weapon Upgrade
                if (game?.sprites?.weaponUpgrade) {
                    const sprite = game.sprites.weaponUpgrade;
                    ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
                    break;
                }
                ctx.fillStyle = '#44ff88';
                ctx.beginPath();
                ctx.moveTo(0, -12); ctx.lineTo(10, 0); ctx.lineTo(0, 12); ctx.lineTo(-10, 0);
                ctx.closePath(); ctx.fill();
                ctx.strokeStyle = '#0f0'; ctx.stroke();
                break;
            case 31: // Heal
                if (game?.sprites?.heal) {
                    const sprite = game.sprites.heal;
                    ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
                    break;
                }
                ctx.fillStyle = '#ff4444';
                ctx.fillRect(-10, -10, 20, 20);
                ctx.fillStyle = '#fff';
                ctx.fillRect(-3, -10, 6, 20);
                ctx.fillRect(-10, -3, 20, 6);
                break;
            case 32: // Core (max HP boost)
                ctx.fillStyle = '#0e2f33';
                ctx.beginPath();
                ctx.moveTo(0, -14); ctx.lineTo(12, -2); ctx.lineTo(7, 14); ctx.lineTo(-7, 14); ctx.lineTo(-12, -2); ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = '#4cf5ff'; ctx.stroke();
                ctx.fillStyle = '#4cf5ff';
                ctx.fillRect(-3, -8, 6, 16);
                ctx.fillRect(-8, -3, 16, 6);
                break;
            case 33: // Shield pickup
                ctx.fillStyle = '#64c0ff';
                ctx.beginPath();
                ctx.arc(0, 0, 12, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#b6e6ff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 0, 8, 0, Math.PI * 2);
                ctx.stroke();
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
        let typeId = 31;
        if (kind === 'weapon') typeId = 30;
        else if (kind === 'heal') typeId = 31;
        else if (kind === 'core') typeId = 32;
        else if (kind === 'shield') typeId = 33;
        super(x, y, 20, 20, typeId);
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
        this.shieldHits = 0;
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
        const aimAgg = game.enemyAimAggression || 1;

        // Shooting Logic
        if (this.type === 11 && this.fireTimer > 2.2 * this.levelFireScale) {
            this.fireTimer = 0;
            const vyRaw = straightShots ? 0 : (game.player.y - this.y) / (320 / aimAgg);
            const vy = Math.max(-0.55, Math.min(0.55, vyRaw));
            game.bullets.push(new Bullet(this.x - 20, this.y, -1.0, vy, 'enemy'));
            game.sound.playEnemyLaser();
        } else if (this.type === 12 && this.fireTimer > this.shootCooldown * this.levelFireScale) { // Fighter
            this.fireTimer = 0;
            const aimYRaw = straightShots ? 0 : (game.player.y - this.y) / (240 / aimAgg);
            const aimY = Math.max(-0.6, Math.min(0.6, aimYRaw));
            game.bullets.push(new Bullet(this.x - 20, this.y, -0.85, aimY + 0.15, 'enemy'));
            game.bullets.push(new Bullet(this.x - 20, this.y, -0.85, aimY - 0.15, 'enemy'));
            game.sound.playEnemyLaser();
        } else if (this.type === 13 && this.fireTimer > 1.9 * this.levelFireScale) { // Interceptor support fire
            this.fireTimer = 0;
            const aimYRaw = straightShots ? 0 : (game.player.y - this.y) / (260 / aimAgg);
            const aimY = Math.max(-0.65, Math.min(0.65, aimYRaw));
            game.bullets.push(new Bullet(this.x - 15, this.y, -1.1, aimY, 'enemy'));
            game.sound.playEnemyLaser();
        } else if (this.type === 14 && this.fireTimer > (this.shootCooldown + 0.8) * this.levelFireScale) { // Tank
            this.fireTimer = 0;
            const aimRaw = straightShots ? 0 : (game.player.y - this.y) / (300 / aimAgg);
            const aim = Math.max(-0.6, Math.min(0.6, aimRaw));
            game.bullets.push(new Bullet(this.x, this.y, -0.65, aim, 'enemy'));
            game.bullets.push(new Bullet(this.x, this.y, -0.65, aim + 0.22, 'enemy'));
            game.bullets.push(new Bullet(this.x, this.y, -0.65, aim - 0.22, 'enemy'));
            game.sound.playEnemyLaser();
        }

        if (this.x < -50) this.active = false;
    }
}

class Asteroid extends Entity {
    constructor(x, y) {
        const roll = Math.random();
        const config = roll > 0.65
            ? { radius: 55 + Math.random() * 30, hp: 90, speed: 1.0 }      // Large chunks (faster)
            : roll > 0.3
                ? { radius: 30 + Math.random() * 18, hp: 60, speed: 1.3 }   // Medium rocks (faster)
                : { radius: 12 + Math.random() * 10, hp: 30, speed: 2.6 };  // Small debris (much faster)

        const sizeJitter = 0.75 + Math.random() * 0.5;
        const diameter = config.radius * 2 * sizeJitter;
        super(x, y, diameter, diameter, 20);
        this.hp = config.hp;
        this.speedScale = config.speed;
        this.rotSpeed = (Math.random() - 0.5) * 2.2;
        this.visualSize = diameter;
        const pool = game?.sprites?.asteroids || [];
        this.spriteIndex = pool.length ? Math.floor(Math.random() * pool.length) : -1;
        this.points = this.generatePoints(config.radius); // fallback outline
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
        if (!this.active) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        const sprites = game?.sprites?.asteroids;
        const sprite = (sprites && this.spriteIndex >= 0) ? sprites[this.spriteIndex] : null;
        if (sprite) {
            const ratio = sprite.width / sprite.height;
            const drawW = ratio >= 1 ? this.visualSize : this.visualSize * ratio;
            const drawH = ratio >= 1 ? this.visualSize / ratio : this.visualSize;
            ctx.drawImage(sprite, -drawW / 2, -drawH / 2, drawW, drawH);
        } else if (this.points?.length) {
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
        }
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
        this.shieldHp = 0;
        this.followupReady = false;
        this.timer = 0;
        this.phase = 0;
        this.dirY = 1;
        this.burstTimer = 0; // secondary timer for advanced patterns
        this.spin = 0;       // used for rotating volleys
        this.hellTimer = 0;
        this.swarmIndex = 0; // used by spawner bosses
        this.entryInvuln = true;
        this.entryShieldTimer = 1.2; // grace after arrival to avoid opener cheese
        this.shieldCycle = 0;
        this.shieldActiveTimer = 0;
        this.spawnTime = performance.now() / 1000;
    }

    draw(ctx) {
        if (!this.active) return;
        ctx.save();
        ctx.translate(this.x, this.y);

        // Custom Boss Visuals - monstrous forms
        ctx.fillStyle = '#c30030';
        ctx.strokeStyle = '#f8b4c4';
        ctx.lineWidth = 3;
        if (this.name === 'OblivionMonolith' && game?.sprites?.boss10) {
            const t = Date.now() / 1000;
            const throb = 0.06 + Math.sin(t * 2.0) * 0.04;
            ctx.save();
            ctx.scale(1 + throb, 1 + throb);
            ctx.rotate(Math.sin(t * 1.1) * 0.05);
            ctx.drawImage(game.sprites.boss10, -90, -90);
            ctx.restore();
        } else if (this.name === 'EclipsePillar' && game?.sprites?.boss9) {
            const t = Date.now() / 1000;
            const sway = Math.sin(t * 1.3) * 0.05;
            ctx.save();
            ctx.rotate(sway);
            ctx.drawImage(game.sprites.boss9, -85, -85);
            ctx.restore();
        } else if ((this.name === 'AbyssAlpha' || this.name === 'AbyssBeta') && game?.sprites?.boss8) {
            const t = Date.now() / 1000;
            const pulse = 0.04 + Math.sin(t * 1.6) * 0.03;
            const tilt = Math.sin(t * 0.8 + (this.twinId || 0)) * 0.08;
            ctx.save();
            ctx.rotate(tilt);
            ctx.scale(1 + pulse, 1 + pulse);
            ctx.drawImage(game.sprites.boss8, -80, -80);
            if (this.name === 'AbyssBeta') {
                ctx.globalCompositeOperation = 'screen';
                ctx.fillStyle = 'rgba(120, 200, 255, 0.35)';
                ctx.beginPath(); ctx.arc(0, 0, 70, 0, Math.PI * 2); ctx.fill();
                ctx.globalCompositeOperation = 'source-over';
            }
            ctx.restore();
        } else if (this.name === 'ScrapGuardian' && game?.sprites?.boss1) {
            const t = Date.now() / 1000;
            const wobble = Math.sin(t * 2.1) * 4;
            const scale = 1 + Math.sin(t * 1.3) * 0.03;
            ctx.save();
            ctx.rotate(Math.sin(t * 1.7) * 0.06);
            ctx.translate(wobble, wobble * 0.6);
            ctx.scale(scale, scale);
            ctx.drawImage(game.sprites.boss1, -70, -70);
            ctx.restore();
        } else if (this.name === 'RaiderCaptain' && game?.sprites?.boss2) {
            const t = Date.now() / 1000;
            const sway = Math.sin(t * 1.8) * 6;
            const bob = Math.sin(t * 1.2) * 4;
            const scale = 1 + Math.sin(t * 1.5) * 0.025;
            ctx.save();
            ctx.translate(sway, bob);
            ctx.scale(scale, scale);
            ctx.drawImage(game.sprites.boss2, -70, -70);
            ctx.restore();
        } else if (this.name === 'IonWyrm' && game?.sprites?.boss3) {
            ctx.drawImage(game.sprites.boss3, -80, -80);
        } else if (this.name === 'DockOverseer' && game?.sprites?.boss4) { // Level 4 -> boss 4 art
            ctx.drawImage(game.sprites.boss4, -80, -80);
        } else if (this.name === 'MutagenCore' && game?.sprites?.boss5) { // Level 5 -> boss 5 art
            ctx.drawImage(game.sprites.boss5, -80, -80);
        } else if (this.name === 'RingFortress' && game?.sprites?.boss6) { // Level 6 -> boss 6 art
            ctx.drawImage(game.sprites.boss6, -80, -80);
        } else if (this.name === 'WarMech' && game?.sprites?.boss7) {
            ctx.drawImage(game.sprites.boss7, -80, -80);
        } else if (this.name === 'TunnelSerpent' && game?.sprites?.boss7) {
            ctx.drawImage(game.sprites.boss7, -80, -80);
        } else if ((this.name === 'CitadelAegis' || this.name === 'CoreOvermind') && game?.sprites?.boss6) {
            const rot = Math.sin(Date.now() * 0.002) * 0.4 + this.spin * 0.25;
            ctx.save();
            ctx.rotate(rot);
            ctx.drawImage(game.sprites.boss6, -80, -80);
            ctx.restore();
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

        // Shield visual indicator
        if (this.shieldHp > 0 || this.entryInvuln) {
            const radius = 90 + Math.sin(Date.now() * 0.01) * 4;
            const grad = ctx.createRadialGradient(0, 0, radius * 0.65, 0, 0, radius);
            const baseAlpha = this.entryInvuln ? 0.55 : 0.35;
            grad.addColorStop(0, `rgba(120, 210, 255, ${baseAlpha})`);
            grad.addColorStop(1, `rgba(120, 210, 255, ${baseAlpha * 0.2})`);
            ctx.strokeStyle = 'rgba(120, 210, 255, 0.6)';
            ctx.fillStyle = grad;
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        }

        ctx.restore();
    }

    update(dt) {
        this.timer += dt;
        this.burstTimer += dt;
        this.spin += dt;

        // Entrance
        if (this.x > game.width - 150) {
            const entrySpeed = this.name === 'ScrapGuardian' ? 200 : 90;
            this.x -= entrySpeed * dt;
            return;
        }
        if (this.entryInvuln) {
            this.entryShieldTimer -= dt;
            if (this.entryShieldTimer <= 0) this.entryInvuln = false;
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
            case 'EclipsePillar': this.behaviorEclipse(dt); break;
            case 'OblivionMonolith': this.behaviorOblivion(dt); break;
            case 'AbyssAlpha': this.behaviorTwinAbyss(dt, 0); break;
            case 'AbyssBeta': this.behaviorTwinAbyss(dt, Math.PI / 2); break;
            default: this.behaviorBasic(dt);
        }
    }

    // Behaviors
    applyBoss6Strafe() {
        if (this.name !== 'CitadelAegis' && this.name !== 'CoreOvermind') return;
        const anchorX = game.width - 150;
        const swing = game.width * 0.45;
        this.x = anchorX - Math.sin(this.spin * 0.9) * swing;
    }

    behaviorBasic(dt) {
        this.y += 120 * this.dirY * dt;
        if (this.y > game.height - 80) this.dirY = -1;
        if (this.y < 80) this.dirY = 1;

        if (this.timer > 1.2) {
            this.timer = 0;
            const spread = 18;
            game.bullets.push(new Bullet(this.x - 50, this.y - spread, -0.6, 0, 'enemy'));
            game.bullets.push(new Bullet(this.x - 50, this.y + spread, -0.6, 0, 'enemy'));
            game.sound.playEnemyLaser();
        }
    }

    behaviorDash(dt) {
        this.y += 70 * this.dirY * dt;
        if (this.y > game.height - 80) this.dirY = -1;
        if (this.y < 80) this.dirY = 1;

        if (this.timer > 2.0) {
            this.timer = 0;
            this.fireDashVolley();
            this.burstTimer = 0; // reuse as follow-up timer
            this.followupReady = true;
        } else if (this.followupReady && this.burstTimer > 0.2) {
            this.burstTimer = 0;
            this.followupReady = false;
            this.fireDashVolley();
        }
    }

    fireDashVolley() {
        for (let i = -2; i <= 2; i++) {
            game.bullets.push(new Bullet(this.x - 40, this.y, -0.6, i * 0.22, 'enemy'));
        }
        game.sound.playEnemyLaser();
    }

    behaviorSine(dt) {
        this.y = game.height / 2 + Math.sin(Date.now() / 500) * 190;
        if (this.timer > 0.35) {
            this.timer = 0;
            const aimAgg = game.enemyAimAggression || 1;
            const aim = Math.max(-0.7, Math.min(0.7, (game.player.y - this.y) / (200 / aimAgg)));
            game.bullets.push(new Bullet(this.x - 50, this.y, -1.0, aim, 'enemy'));
            game.bullets.push(new Bullet(this.x - 50, this.y, -0.95, aim + 0.18, 'enemy'));
            game.bullets.push(new Bullet(this.x - 50, this.y, -0.95, aim - 0.18, 'enemy'));
            game.sound.playEnemyLaser();
        }
    }

    behaviorTurret(dt) {
        // Stationary vertical
        this.y += 115 * this.dirY * dt;
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
        // MutagenCore: vertical bob + constant swarm spawns
        this.y += 140 * this.dirY * dt;
        if (this.y > game.height - 90) this.dirY = -1;
        if (this.y < 90) this.dirY = 1;

        // Legacy periodic spawn (kept for pacing)
        if (this.timer > 3.0) {
            this.timer = 0;
            game.enemies.push(new Enemy(this.x - 50, this.y, 11, game.enemySpeedScale, game.enemyFireScale)); // Spawn minion
        }

        // Rapid swarm: rotate through enemy archetypes every 0.4s
        if (this.burstTimer > 0.4) {
            this.burstTimer = 0;
            const swarmTypes = [11, 12, 13, 14];
            const type = swarmTypes[this.swarmIndex % swarmTypes.length];
            this.swarmIndex += 1;
            const yOffset = Math.sin(Date.now() * 0.004) * 50;
            game.enemies.push(new Enemy(this.x - 60, this.y + yOffset, type, game.enemySpeedScale, game.enemyFireScale));
        }
    }

    behaviorRing(dt) {
        const late = game.levelIndex >= 5;
        // Hover and sway near center
        this.y = game.height / 2 + Math.sin(Date.now() / 700) * 170;

        const interval = late ? 1.2 : 2.5;
        if (this.timer > interval) {
            this.timer = 0;
            const count = late ? 16 : 8;
            const spin = this.spin * 3;
            for (let i = 0; i < count; i++) {
                const angle = spin + (i / count) * Math.PI * 2;
                const speed = 0.5 + (late ? 0.1 : 0);
                game.bullets.push(new Bullet(this.x, this.y, Math.cos(angle) * speed, Math.sin(angle) * speed, 'enemy'));
            }
            game.sound.playEnemyLaser();
            if (late) {
                // Add aimed tri-shot to punish idle positions
                const aim = (game.player.y - this.y) / 280;
                game.bullets.push(new Bullet(this.x, this.y, -0.65, aim, 'enemy'));
                game.bullets.push(new Bullet(this.x, this.y, -0.65, aim + 0.18, 'enemy'));
                game.bullets.push(new Bullet(this.x, this.y, -0.65, aim - 0.18, 'enemy'));
            }
        }
    }

    behaviorSweep(dt) {
        // WarMech patrol: sinusoidal vertical sweep (35% of screen)
        const amp = game.height * 0.42;
        this.y = game.height / 2 + Math.sin(this.spin * 1.05) * amp;

        const cadence = 1.6;
        if (this.timer > cadence) {
            this.timer = 0;
            const spacing = 32;
            const startOffset = -((6 - 1) / 2) * spacing;
            for (let i = 0; i < 6; i++) {
                const offset = startOffset + i * spacing;
                game.enemies.push(new Enemy(this.x - 60, this.y + offset, 13, game.enemySpeedScale * 1.1, game.enemyFireScale));
            }
            // Also fire a aimed spread while launching escorts
            const aim = (game.player.y - this.y) / 260;
            game.bullets.push(new Bullet(this.x, this.y, -0.8, aim, 'enemy'));
            game.bullets.push(new Bullet(this.x, this.y, -0.78, aim + 0.22, 'enemy'));
            game.bullets.push(new Bullet(this.x, this.y, -0.78, aim - 0.22, 'enemy'));
            game.sound.playEnemyLaser();
        }

        // Periodic tank reinforcements down the middle
        if (this.burstTimer > 5) {
            this.burstTimer = 0;
            const mid = game.height / 2;
            const offset = 60;
            game.enemies.push(new Enemy(this.x - 70, Math.max(50, mid - offset), 14, game.enemySpeedScale, game.enemyFireScale));
            game.enemies.push(new Enemy(this.x - 70, Math.min(game.height - 50, mid + offset), 14, game.enemySpeedScale, game.enemyFireScale));
        }
    }

    behaviorSnake(dt) {
        this.x = (game.width - 100) + Math.sin(Date.now() / 1000) * 80;
        this.y = game.height / 2 + Math.cos(Date.now() / 800) * 200;
        const late = game.levelIndex >= 5;
        const interval = late ? 0.15 : 0.2;
        if (this.timer > interval) {
            this.timer = 0;
            const spread = late ? 0.35 : 0.25;
            const base = (game.player.y - this.y) / 280;
            game.bullets.push(new Bullet(this.x, this.y, -0.55, base, 'enemy'));
            game.bullets.push(new Bullet(this.x, this.y, -0.55, base + spread, 'enemy'));
            game.bullets.push(new Bullet(this.x, this.y, -0.55, base - spread, 'enemy'));
        }
        if (late && this.burstTimer > 1.6) {
            this.burstTimer = 0;
            // Radial mini-burst
            const spin = this.spin * 4;
            for (let i = 0; i < 8; i++) {
                const angle = spin + (i / 8) * Math.PI * 2;
                game.bullets.push(new Bullet(this.x, this.y, Math.cos(angle) * 0.45, Math.sin(angle) * 0.45, 'enemy'));
            }
            game.sound.playEnemyLaser();
        }
    }

    behaviorShield(dt) {
        // High HP, slow shots
        const late = game.levelIndex >= 5;
        this.applyBoss6Strafe();
        this.y = game.height / 2 + Math.sin(Date.now() / 1200) * 130;
        const interval = late ? 1.1 : 2.0;
        if (this.timer > interval) {
            this.timer = 0;
            const aim = (game.player.y - this.y) / 320;
            game.bullets.push(new Bullet(this.x, this.y, -0.45, aim, 'enemy'));
            if (late) {
                game.bullets.push(new Bullet(this.x, this.y - 50, -0.5, aim - 0.18, 'enemy'));
                game.bullets.push(new Bullet(this.x, this.y + 50, -0.5, aim + 0.18, 'enemy'));
            }
        }
    }

    behaviorBulletHell(dt) {
        // Final Boss
        this.applyBoss6Strafe();
        this.y = game.height / 2 + Math.sin(Date.now() / 1000) * 140;
        const interval = 0.05;
        if (this.timer > interval) {
            this.timer = 0;
            const angle = (Date.now() / 500);
            const speed = 0.75;
            game.bullets.push(new Bullet(this.x, this.y, Math.cos(angle) * speed, Math.sin(angle) * speed, 'enemy'));
            game.bullets.push(new Bullet(this.x, this.y, Math.cos(angle + Math.PI) * speed, Math.sin(angle + Math.PI) * speed, 'enemy'));
        }
        if (this.burstTimer > 0.9) {
            this.burstTimer = 0;
            const count = 28;
            const spin = this.spin * 2;
            for (let i = 0; i < count; i++) {
                const ang = spin + (i / count) * Math.PI * 2;
                game.bullets.push(new Bullet(this.x, this.y, Math.cos(ang) * 0.65, Math.sin(ang) * 0.65, 'enemy'));
            }
            game.sound.playEnemyLaser();
        }
        this.hellTimer += dt;
        if (this.hellTimer > 0.35) {
            this.hellTimer = 0;
            // Aimed dagger spread
            const aim = (game.player.y - this.y) / 200;
            game.bullets.push(new Bullet(this.x, this.y, -1.1, aim, 'enemy'));
            game.bullets.push(new Bullet(this.x, this.y, -1.05, aim + 0.2, 'enemy'));
            game.bullets.push(new Bullet(this.x, this.y, -1.05, aim - 0.2, 'enemy'));
            game.bullets.push(new Bullet(this.x, this.y, -0.95, aim + 0.35, 'enemy'));
            game.bullets.push(new Bullet(this.x, this.y, -0.95, aim - 0.35, 'enemy'));
        }
    }

    behaviorOblivion(dt) {
        // Final boss: roaming, regenerating, relentless patterns
        const ampX = game.width * 0.35;
        const ampY = game.height * 0.4;
        this.x = game.width / 2 + Math.sin(this.spin * 1.2) * ampX;
        this.y = game.height / 2 + Math.cos(this.spin * 0.9) * ampY;

        // One-time enrage: heal to 75% and gain shield when low
        if (!this.enrageTriggered && this.hp / this.maxHp <= 0.2) {
            this.enrageTriggered = true;
            this.hp = Math.round(this.maxHp * 0.75);
            this.entryInvuln = true;
            this.entryShieldTimer = 1.2;
            this.shieldHp = Math.round(this.maxHp * 0.4);
        }

        // Spiral barrage
        if (this.timer > 0.18) {
            this.timer = 0;
            const baseAng = this.spin * 3.5;
            const count = 16;
            for (let i = 0; i < count; i++) {
                const ang = baseAng + (i / count) * Math.PI * 2;
                const speed = 0.8;
                game.bullets.push(new Bullet(this.x, this.y, Math.cos(ang) * speed, Math.sin(ang) * speed, 'enemy'));
            }
            game.sound.playEnemyLaser();
        }

        // Aimed scythes
        if (this.burstTimer > 0.7) {
            this.burstTimer = 0;
            const aim = (game.player.y - this.y) / 180;
            const offsets = [-0.4, -0.2, 0, 0.2, 0.4];
            offsets.forEach(off => {
                game.bullets.push(new Bullet(this.x, this.y, -1.2 + Math.abs(off) * -0.1, aim + off, 'enemy'));
            });
        }

        // Orb walls: slow drifting walls
        if (this.hellTimer > 2.4) {
            this.hellTimer = 0;
            for (let i = -2; i <= 2; i++) {
                const vy = i * 0.22;
                game.bullets.push(new Bullet(this.x + 40, this.y, -0.5, vy, 'enemy'));
            }
        }
    }

    behaviorEclipse(dt) {
        // Tall pillar boss with rotating laser slabs and tentacle volleys
        const swayAmp = 70;
        this.y = game.height / 2 + Math.sin(this.spin * 0.9) * swayAmp;
        this.x = game.width - 140 + Math.sin(this.spin * 0.5) * 40;

        // Periodic shield: 1s on every 5s
        this.shieldCycle += dt;
        if (this.shieldCycle >= 5) {
            this.shieldCycle = 0;
            this.shieldActiveTimer = 1;
            this.shieldHp = this.maxHp * 0.35; // sizeable shield
        }
        if (this.shieldActiveTimer > 0) {
            this.shieldActiveTimer -= dt;
            if (this.shieldActiveTimer <= 0 && this.shieldHp > 0) {
                this.shieldHp = 0;
            }
        }

        // Rotating ring of bullets
        if (this.timer > 0.35) {
            this.timer = 0;
            const count = 14;
            const spin = this.spin * 1.5;
            for (let i = 0; i < count; i++) {
                const ang = spin + (i / count) * Math.PI * 2;
                game.bullets.push(new Bullet(this.x, this.y, Math.cos(ang) * 0.6, Math.sin(ang) * 0.6, 'enemy'));
            }
            game.sound.playEnemyLaser();
        }

        // Vertical laser sweeps
        if (this.burstTimer > 2.8) {
            this.burstTimer = 0;
            const lanes = [game.height * 0.25, game.height * 0.5, game.height * 0.75];
            lanes.forEach((ly, idx) => {
                const aim = (game.player.y - ly) / 260;
                const baseVx = -1.2 + idx * 0.05;
                game.bullets.push(new Bullet(this.x, ly, baseVx, aim, 'enemy'));
                game.bullets.push(new Bullet(this.x, ly, baseVx, aim + 0.18, 'enemy'));
                game.bullets.push(new Bullet(this.x, ly, baseVx, aim - 0.18, 'enemy'));
            });
        }

        // Tentacle fan bursts (slower, bigger projectiles)
        if (this.hellTimer > 1.4) {
            this.hellTimer = 0;
            const spread = 0.5;
            const base = (game.player.y - this.y) / 240;
            for (let i = -2; i <= 2; i++) {
                const vx = -0.75 + Math.abs(i) * -0.02;
                const vy = base + i * spread * 0.22;
                game.bullets.push(new Bullet(this.x, this.y, vx, vy, 'enemy'));
            }
        }
    }
    behaviorTwinAbyss(dt, phaseOffset = 0) {
        // Twin bosses with mirrored paths
        const cx = game.width - 200;
        const cy = game.height / 2;
        const swayX = Math.sin(this.spin * 0.8 + phaseOffset) * 120;
        const swayY = Math.sin(this.spin * 1.2) * 170 * (this.twinId === 0 ? 1 : -1);
        this.x = cx + swayX;
        this.y = cy + swayY;

        // Alternating shields: 10s interval, 4s duration, Alpha then Beta
        const now = performance.now() / 1000;
        const elapsed = now - this.spawnTime;
        const slot = Math.floor(elapsed / 10); // 0-9s,10-19s, etc
        const phase = elapsed % 10;
        const isAlpha = this.twinId === 0;
        const shouldShield = (isAlpha && slot % 2 === 0 && phase < 4) || (!isAlpha && slot % 2 === 1 && phase < 4);
        if (shouldShield) {
            if (this.shieldHp <= 0) this.shieldHp = Math.round(this.maxHp * 0.3);
        } else if (this.shieldHp > 0) {
            this.shieldHp = 0;
        }

        // Spiral burst
        if (this.timer > 0.5) {
            this.timer = 0;
            const baseAng = this.spin * 3 + phaseOffset * 0.5;
            const count = 10;
            for (let i = 0; i < count; i++) {
                const ang = baseAng + (i / count) * Math.PI * 2;
                const speed = 0.55 + (this.twinId === 1 ? 0.08 : 0);
                game.bullets.push(new Bullet(this.x, this.y, Math.cos(ang) * speed, Math.sin(ang) * speed, 'enemy'));
            }
            game.sound.playEnemyLaser();
        }

        // Aimed daggers
        if (this.burstTimer > 1.6) {
            this.burstTimer = 0;
            const aim = (game.player.y - this.y) / 220;
            const spread = this.twinId === 1 ? 0.28 : 0.2;
            game.bullets.push(new Bullet(this.x, this.y, -0.9, aim, 'enemy'));
            game.bullets.push(new Bullet(this.x, this.y, -0.85, aim + spread, 'enemy'));
            game.bullets.push(new Bullet(this.x, this.y, -0.85, aim - spread, 'enemy'));
        }

        // Summon slow orbs that drift inward
        if (this.hellTimer > 3.2) {
            this.hellTimer = 0;
            for (let i = -1; i <= 1; i++) {
                const vy = (i * 0.2) + (this.twinId === 1 ? 0.05 : -0.05);
                game.bullets.push(new Bullet(this.x - 20, this.y, -0.45, vy, 'enemy'));
            }
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
        this.sprites = { player: null, playerForms: [], playerBullet: null, enemyBullet: null, weaponUpgrade: null, heal: null, scout: null, fighter: null, interceptor: null, tank: null, boss1: null, boss2: null, boss3: null, boss4: null, boss5: null, boss6: null, boss7: null, boss8: null, boss9: null, boss10: null, asteroids: [] };

        this.sound = new SoundManager();
        this.input = new InputHandler();
        this.input.onStart = () => this.start();
        this.player = new Player(100, this.height / 2);
        this.bullets = [];
        this.enemies = [];
        this.items = [];
        this.stars = [];
        this.dropCounts = { weapon: 0, heal: 0, core: 0, shield: 0 };
        this.dropLimits = { weapon: 3, heal: 3, core: 1, shield: 0 };
        this.playerHitCounter = 0;
        this.hitsPerWeaponDowngrade = 3;
        this.playerHitCooldown = 0; // brief invuln window to avoid double-counting hits
        this.asteroidTimer = 0;
        this.demoMode = false;

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
            root: document.getElementById('ui-layer'),
            start: document.getElementById('start-screen'),
            startBtn: document.getElementById('start-button'),
            hud: document.getElementById('hud'),
            version: document.getElementById('version-tag'),
            score: document.getElementById('score'),
            level: document.getElementById('level'),
            hp: document.getElementById('health-fill'),
            healthBar: document.getElementById('health-bar'),
            progress: document.getElementById('level-progress-fill'),
            label: document.getElementById('level-progress-label'),
            bossBar: document.getElementById('boss-bar'),
            bossFill: document.getElementById('boss-bar-fill'),
            bossLabel: document.getElementById('boss-label'),
            bossShield: document.getElementById('boss-shield-track'),
            bossShieldFill: document.getElementById('boss-shield-fill'),
            bossBar2: document.getElementById('boss-bar-2'),
            bossFill2: document.getElementById('boss-bar-fill-2'),
            bossLabel2: document.getElementById('boss-label-2'),
            messageOverlay: document.getElementById('message-overlay'),
            messageTitle: document.getElementById('message-title'),
            messageBody: document.getElementById('message-body'),
            messagePrimary: document.getElementById('message-primary'),
            messageSecondary: document.getElementById('message-secondary')
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
        this.enemyAimAggression = 1;
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

        if (this.ui.root) this.ui.root.classList.add('start-mode');
        this.loadPlayerSprites();
        this.loadPlayerBulletSprite();
        this.loadEnemyBulletSprite();
        this.loadWeaponUpgradeSprite();
        this.loadHealSprite();
        this.loadAsteroidSprites();
        this.loadScoutSprite();
        this.loadFighterSprite();
        this.loadInterceptorSprite();
        this.loadTankSprite();
        this.loadBoss1Sprite();
        this.loadBoss2Sprite();
        this.loadBoss3Sprite();
        this.loadBoss4Sprite();
        this.loadBoss5Sprite();
        this.loadBoss6Sprite();
        this.loadBoss7Sprite();
        this.loadBoss8Sprite();
        this.loadBoss9Sprite();
        this.loadBoss10Sprite();
        requestAnimationFrame(t => this.loop(t));
    }

    showMessage({ title = 'MESSAGE', body = '', primaryText = 'OK', secondaryText = null, tone = 'info', onPrimary = null, onSecondary = null }) {
        const overlay = this.ui.messageOverlay;
        const titleEl = this.ui.messageTitle;
        const bodyEl = this.ui.messageBody;
        const primaryBtn = this.ui.messagePrimary;
        const secondaryBtn = this.ui.messageSecondary;
        if (!overlay || !titleEl || !bodyEl || !primaryBtn) {
            console.error(title + " :: " + body);
            if (typeof onPrimary === 'function') onPrimary();
            return;
        }

        overlay.dataset.tone = tone || 'info';
        titleEl.textContent = title;
        bodyEl.textContent = body;
        overlay.classList.remove('hidden');

        primaryBtn.textContent = primaryText;
        primaryBtn.onclick = () => {
            overlay.classList.add('hidden');
            if (typeof onPrimary === 'function') onPrimary();
        };

        if (secondaryText && secondaryBtn) {
            secondaryBtn.classList.remove('hidden');
            secondaryBtn.textContent = secondaryText;
            secondaryBtn.onclick = () => {
                overlay.classList.add('hidden');
                if (typeof onSecondary === 'function') onSecondary();
            };
        } else if (secondaryBtn) {
            secondaryBtn.classList.add('hidden');
            secondaryBtn.onclick = null;
        }
    }

    loadPlayerSprites() {
        const files = [
            { src: 'assets/sprite1.png', size: 72 }, // levels 1-2
            { src: 'assets/sprite2.png', size: 76 }, // level 3
            { src: 'assets/sprite3.png', size: 80 }, // level 4
            { src: 'assets/sprite4.png', size: 86 }, // level 5
            { src: 'assets/sprite5.png', size: 92 }  // levels 6-7
        ];
        this.sprites.playerForms = new Array(files.length).fill(null);
        files.forEach((file, idx) => {
            const img = new Image();
            img.src = file.src;
            img.onload = () => {
                const size = file.size;
                const scaled = document.createElement('canvas');
                scaled.width = size;
                scaled.height = size;
                const ctx = scaled.getContext('2d');
                const scale = size / Math.max(img.width, img.height);
                const w = img.width * scale;
                const h = img.height * scale;
                ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
                this.sprites.playerForms[idx] = scaled;
                if (idx === 0) this.sprites.player = scaled; // ensure base sprite fallback
            };
            img.onerror = (e) => console.error('Failed to load player sprite', file.src, e);
        });
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

    loadEnemyBulletSprite() {
        const img = new Image();
        img.src = 'assets/enemy shoot.png';
        img.onload = () => {
            const targetWidth = 36;
            const targetHeight = 16;
            const scaled = document.createElement('canvas');
            scaled.width = targetWidth;
            scaled.height = targetHeight;
            const ctx = scaled.getContext('2d');
            const scale = Math.min(targetWidth / img.width, targetHeight / img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            ctx.drawImage(img, (targetWidth - w) / 2, (targetHeight - h) / 2, w, h);
            this.sprites.enemyBullet = scaled;
        };
        img.onerror = (e) => console.error('Failed to load enemy bullet sprite', e);
    }

    loadWeaponUpgradeSprite() {
        const img = new Image();
        img.src = 'assets/upgrade weapon.png';
        img.onload = () => {
            const size = 44; // Slightly larger to stand out
            const scaled = document.createElement('canvas');
            scaled.width = size;
            scaled.height = size;
            const ctx = scaled.getContext('2d');
            const scale = Math.min(size / img.width, size / img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
            this.sprites.weaponUpgrade = scaled;
        };
        img.onerror = (e) => console.error('Failed to load weapon upgrade sprite', e);
    }

    loadHealSprite() {
        const img = new Image();
        img.src = 'assets/heall.png';
        img.onload = () => {
            const size = 40;
            const scaled = document.createElement('canvas');
            scaled.width = size;
            scaled.height = size;
            const ctx = scaled.getContext('2d');
            const scale = Math.min(size / img.width, size / img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
            this.sprites.heal = scaled;
        };
        img.onerror = (e) => console.error('Failed to load heal sprite', e);
    }

    loadAsteroidSprites() {
        const files = [
            'assets/aste1-removebg-preview.png',
            'assets/aste2-removebg-preview.png',
            'assets/aste3-removebg-preview.png',
            'assets/aste4-removebg-preview.png',
            'assets/aste5-removebg-preview.png',
            'assets/aste6-removebg-preview.png'
        ];
        this.sprites.asteroids = new Array(files.length).fill(null);
        files.forEach((src, idx) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                canvas.getContext('2d').drawImage(img, 0, 0);
                this.sprites.asteroids[idx] = canvas;
            };
            img.onerror = (e) => console.error('Failed to load asteroid sprite', src, e);
        });
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

    loadBoss3Sprite() {
        const img = new Image();
        img.src = 'assets/boss 3.png';
        img.onload = () => {
            const size = 150; // Boss hitbox 100, allow larger silhouette
            const scaled = document.createElement('canvas');
            scaled.width = size;
            scaled.height = size;
            const ctx = scaled.getContext('2d');
            const scale = size / Math.max(img.width, img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
            this.sprites.boss3 = scaled;
        };
        img.onerror = (e) => console.error('Failed to load boss sprite', e);
    }

    loadBoss4Sprite() {
        const img = new Image();
        img.src = 'assets/boss 4.png';
        img.onload = () => {
            const size = 150; // Boss hitbox 100, allow larger silhouette
            const scaled = document.createElement('canvas');
            scaled.width = size;
            scaled.height = size;
            const ctx = scaled.getContext('2d');
            const scale = size / Math.max(img.width, img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
            this.sprites.boss4 = scaled;
        };
        img.onerror = (e) => console.error('Failed to load boss sprite', e);
    }

    loadBoss5Sprite() {
        const img = new Image();
        img.src = 'assets/boss 5.png';
        img.onload = () => {
            const size = 150; // Boss hitbox 100, allow larger silhouette
            const scaled = document.createElement('canvas');
            scaled.width = size;
            scaled.height = size;
            const ctx = scaled.getContext('2d');
            const scale = size / Math.max(img.width, img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
            this.sprites.boss5 = scaled;
        };
        img.onerror = (e) => console.error('Failed to load boss sprite', e);
    }

    loadBoss6Sprite() {
        const img = new Image();
        img.src = 'assets/boss 6.png';
        img.onload = () => {
            const size = 150; // Boss hitbox 100, allow larger silhouette
            const scaled = document.createElement('canvas');
            scaled.width = size;
            scaled.height = size;
            const ctx = scaled.getContext('2d');
            const scale = size / Math.max(img.width, img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
            this.sprites.boss6 = scaled;
        };
        img.onerror = (e) => console.error('Failed to load boss sprite', e);
    }

    loadBoss7Sprite() {
        const img = new Image();
        img.src = 'assets/boss level 7.png';
        img.onload = () => {
            const size = 150; // Boss hitbox 100, allow larger silhouette
            const scaled = document.createElement('canvas');
            scaled.width = size;
            scaled.height = size;
            const ctx = scaled.getContext('2d');
            const scale = size / Math.max(img.width, img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
            this.sprites.boss7 = scaled;
        };
        img.onerror = (e) => console.error('Failed to load boss sprite', e);
    }

    loadBoss9Sprite() {
        const img = new Image();
        img.src = 'assets/boss_9_sprite-removebg-preview.png';
        img.onload = () => {
            const size = 170; // Tall pillar; give more canvas height
            const scaled = document.createElement('canvas');
            scaled.width = size;
            scaled.height = size;
            const ctx = scaled.getContext('2d');
            const scale = size / Math.max(img.width, img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
            this.sprites.boss9 = scaled;
        };
        img.onerror = (e) => console.error('Failed to load boss 9 sprite', e);
    }

    loadBoss8Sprite() {
        const img = new Image();
        img.src = 'assets/boss_8_sprite-removebg-preview.png';
        img.onload = () => {
            const size = 160; // Boss hitbox ~110, slightly larger canvas
            const scaled = document.createElement('canvas');
            scaled.width = size;
            scaled.height = size;
            const ctx = scaled.getContext('2d');
            const scale = size / Math.max(img.width, img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
            this.sprites.boss8 = scaled;
        };
        img.onerror = (e) => console.error('Failed to load boss 8 sprite', e);
    }

    loadBoss10Sprite() {
        const img = new Image();
        img.src = 'assets/final boss level 10.png';
        img.onload = () => {
            const size = 180; // Very tall, give room
            const scaled = document.createElement('canvas');
            scaled.width = size;
            scaled.height = size;
            const ctx = scaled.getContext('2d');
            const scale = size / Math.max(img.width, img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
            this.sprites.boss10 = scaled;
        };
        img.onerror = (e) => console.error('Failed to load boss 10 sprite', e);
    }

    getPlayerSpriteForWeapon(level = 1) {
        const wl = Math.max(1, Math.min(level, WEAPON_PATTERNS.length));
        const forms = this.sprites.playerForms || [];
        let sprite = null;
        if (wl <= 2) {
            sprite = forms[0];
        } else if (wl === 3) {
            sprite = forms[1] || forms[0];
        } else if (wl === 4) {
            sprite = forms[2] || forms[1] || forms[0];
        } else if (wl === 5) {
            sprite = forms[3] || forms[2] || forms[1] || forms[0];
        } else { // wl 6-7
            sprite = forms[4] || forms[3] || forms[2] || forms[1] || forms[0];
        }
        return sprite || this.sprites.player || null;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        if (this.ui.messageOverlay) this.ui.messageOverlay.classList.add('hidden');
        this.ui.start.classList.add('hidden');
        if (this.ui.version) this.ui.version.classList.add('hidden');
        this.ui.hud.classList.remove('hidden');
        if (this.ui.root) {
            this.ui.root.classList.remove('start-mode');
            this.ui.root.classList.add('playing');
        }
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
        this.asteroidTimer = 0;
        this.playerHitCounter = 0;
        this.playerHitCooldown = 0;
        const config = LEVEL_CONFIG[this.levelIndex];
        this.enemySpeedScale = config.enemySpeedScale || 1;
        this.enemyFireScale = config.enemyFireScale || 1;
        this.enemyAimAggression = config.enemyAimAggression || 1;
        this.ui.level.innerText = config.name + " (LVL " + (this.levelIndex + 1) + ")";
        this.ui.label.innerText = "BOSS APPROACHING";
        this.ui.label.style.color = "#ff0";
        if (this.ui.bossBar) this.ui.bossBar.classList.add('hidden');
        if (this.ui.bossBar2) this.ui.bossBar2.classList.add('hidden');
        // Reset drop counters and limits per level
        this.dropCounts = { weapon: 0, heal: 0, core: 0, shield: 0 };
        this.dropLimits.weapon = 3;
        this.dropLimits.heal = this.levelIndex >= 4 ? 13 : 3; // +10 heal drops from level 5 onward
        this.dropLimits.core = 1;
        this.dropLimits.shield = this.levelIndex >= 5 ? 1 : 0; // Shield drops from level 6+

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

    applyPlayerHit(damage) {
        if (this.playerHitCooldown > 0) return;
        if (this.player.shieldHits > 0) {
            this.player.shieldHits -= 1;
            this.playerHitCooldown = 0.2;
            return;
        }
        this.player.hp -= damage;
        this.playerHitCounter += 1;
        if (this.playerHitCounter % this.hitsPerWeaponDowngrade === 0) this.player.downgradeWeapon();
        this.playerHitCooldown = 0.25; // short grace period to avoid multiple hits in the same moment
        if (this.player.hp <= 0) this.gameOver();
    }

    isAsteroidHeavyLevel() {
        return [1, 3, 5, 7, 8].includes(this.levelIndex);
    }

    update(dt) {
        this.playerHitCooldown = Math.max(0, this.playerHitCooldown - dt);
        this.player.update(dt, this.input);
        const config = LEVEL_CONFIG[this.levelIndex];

        // Level Progress
        this.levelTime += dt;
        const progress = Math.min(100, (this.levelTime / config.duration) * 100);
        this.ui.progress.style.width = progress + '%';

        // Boss Spawn
        if (this.levelTime >= config.duration && !this.bossSpawned) {
            this.spawnBossForCurrentLevel();
        }

        // Spawner
        if (!this.bossSpawned) {
            if (this.isAsteroidHeavyLevel()) {
                this.asteroidTimer += dt;
                if (this.asteroidTimer > 1.3) {
                    this.asteroidTimer = 0;
                    const ay = Math.random() * (this.height - 80) + 40;
                    this.enemies.push(new Asteroid(this.width + 80, ay));
                }
            } else {
                this.asteroidTimer = 0;
            }

            this.spawnTimer += dt;
            const heavyAst = this.isAsteroidHeavyLevel();
            const progress = Math.min(1, this.levelTime / config.duration);
            let effectiveSpawnRate = config.spawnRate;
            if (heavyAst) {
                // Speed up spawns as the level progresses for asteroid-heavy stages
                const accel = Math.max(0.35, 0.75 - progress * 0.4);
                effectiveSpawnRate = Math.max(config.spawnRate * accel, config.spawnRate * 0.3);
            }

            if (this.spawnTimer > effectiveSpawnRate) {
                this.spawnTimer = 0;
                const spawns = heavyAst ? Math.min(4, 2 + Math.floor(progress * 3)) : 1; // 2-4 enemies per tick on asteroid levels
                for (let s = 0; s < spawns; s++) {
                    const y = Math.random() * (this.height - 60) + 30;
                    // Pick random enemy from allowed types
                    const type = config.enemies[Math.floor(Math.random() * config.enemies.length)];

                    if (type === 20) {
                        this.enemies.push(new Asteroid(this.width + 50, y));
                    } else if (type === 13) {
                        const count = 5;
                        const spacing = 48;
                        const startY = Math.min(Math.max(40, y - ((count - 1) * spacing) / 2), this.height - 40 - (count - 1) * spacing);
                        for (let i = 0; i < count; i++) {
                            const rowY = startY + i * spacing;
                            this.enemies.push(new Enemy(this.width + 50 + i * 12, rowY, type, this.enemySpeedScale, this.enemyFireScale));
                        }
                    } else if (type === 14) {
                        const mid = this.height / 2;
                        const offset = 60;
                        const y1 = Math.min(Math.max(50, mid - offset), this.height - 50);
                        const y2 = Math.min(Math.max(50, mid + offset), this.height - 50);
                        this.enemies.push(new Enemy(this.width + 50, y1, type, this.enemySpeedScale, this.enemyFireScale));
                        this.enemies.push(new Enemy(this.width + 70, y2, type, this.enemySpeedScale, this.enemyFireScale));
                    } else {
                        this.enemies.push(new Enemy(this.width + 50, y, type, this.enemySpeedScale, this.enemyFireScale));
                    }
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
        const baseHealthWidth = 220;
        const healthScale = Math.min(1.6, this.player.maxHp / 100); // allow up to 60% wider bar
        if (this.ui.healthBar) this.ui.healthBar.style.width = (baseHealthWidth * healthScale) + 'px';
        this.ui.hp.style.width = Math.max(0, (this.player.hp / this.player.maxHp) * 100) + '%';
        const bosses = this.enemies.filter(e => e.type === 99 && e.active);
        if (bosses.length > 0 && this.ui.bossBar) {
            const b1 = bosses[0];
            this.ui.bossBar.classList.remove('hidden');
            if (this.ui.bossFill) this.ui.bossFill.style.width = Math.max(0, (b1.hp / b1.maxHp) * 100) + '%';
            if (this.ui.bossLabel) this.ui.bossLabel.innerText = b1.name + ' HP';
            if (this.ui.bossShield) {
                if (b1.shieldHp > 0) {
                    this.ui.bossShield.classList.remove('hidden');
                    if (this.ui.bossShieldFill) this.ui.bossShieldFill.style.width = Math.max(0, (b1.shieldHp / b1.maxHp) * 100) + '%';
                } else {
                    this.ui.bossShield.classList.add('hidden');
                }
            }
            // Second bar only if twin boss exists
            const b2 = bosses[1];
            if (b2 && this.ui.bossBar2) {
                this.ui.bossBar2.classList.remove('hidden');
                if (this.ui.bossFill2) this.ui.bossFill2.style.width = Math.max(0, (b2.hp / b2.maxHp) * 100) + '%';
                if (this.ui.bossLabel2) this.ui.bossLabel2.innerText = b2.name + ' HP';
            } else if (this.ui.bossBar2) {
                this.ui.bossBar2.classList.add('hidden');
            }
        } else {
            if (this.ui.bossBar) this.ui.bossBar.classList.add('hidden');
            if (this.ui.bossShield) this.ui.bossShield.classList.add('hidden');
            if (this.ui.bossBar2) this.ui.bossBar2.classList.add('hidden');
        }
    }

    draw() {
        const bg = LEVEL_BACKGROUNDS[this.levelIndex % LEVEL_BACKGROUNDS.length];
        const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
        grad.addColorStop(0, bg.gradient[0]);
        grad.addColorStop(1, bg.gradient[1]);
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Nebula film overlay
        const nebula = this.ctx.createLinearGradient(0, 0, this.width, this.height);
        nebula.addColorStop(0, 'rgba(120, 40, 140, 0.15)');
        nebula.addColorStop(0.5, 'rgba(20, 180, 220, 0.12)');
        nebula.addColorStop(1, 'rgba(255, 180, 90, 0.1)');
        this.ctx.fillStyle = nebula;
        this.ctx.fillRect(0, 0, this.width, this.height);

        const vignette = this.ctx.createRadialGradient(this.width / 2, this.height / 2, this.width * 0.1, this.width / 2, this.height / 2, this.width * 0.7);
        vignette.addColorStop(0, 'rgba(0,0,0,0)');
        vignette.addColorStop(1, 'rgba(0,0,0,0.4)');
        this.ctx.fillStyle = vignette;
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
                    const dmg = 10;
                    if (e.type === 99 && e.entryInvuln) {
                        // Ignore damage while boss is phasing in
                        return;
                    }
                    if (e.type === 99 && e.shieldHp > 0) {
                        e.shieldHp = Math.max(0, e.shieldHp - dmg);
                        this.sound.playEnemyLaser();
                        return;
                    }
                    e.hp -= dmg;
                    if (e.hp <= 0) {
                        e.active = false;
                        this.score += (e.type === 99 ? 5000 : (e.type === 14 ? 500 : 100));
                        this.sound.playExplosion();
                        if (e.type !== 99) this.spawnDrop(e.x, e.y);

                        if (e.type === 99) {
                            const hasOtherBoss = this.enemies.some(other => other !== e && other.type === 99 && other.active);
                            if (!hasOtherBoss) this.nextLevel();
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
                this.applyPlayerHit(10);
                this.sound.playExplosion();
            }
        });

        // Body Collisions
        this.enemies.forEach(e => {
            if (!e.active) return;
            const dist = Math.hypot(e.x - this.player.x, e.y - this.player.y);
            if (dist < (e.width / 2 + 16)) {
                if (e.type === 20) { // Asteroid
                    e.active = false;
                    this.applyPlayerHit(30);
                } else if (e.type === 99) { // Boss
                    this.applyPlayerHit(1);
                } else {
                    e.active = false;
                    this.applyPlayerHit(20);
                }
                this.sound.playExplosion();
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
                } else if (it.kind === 'core') {
                    this.player.maxHp = Math.round(this.player.maxHp * 1.025);
                    this.player.hp = this.player.maxHp;
                    this.sound.playPowerup();
                } else if (it.kind === 'shield') {
                    this.player.shieldHits = 6;
                    this.sound.playPowerup();
                }
            }
        });
    }

    spawnDrop(x, y) {
        const roll = Math.random();
        const weaponAllowed = this.dropLimits.weapon > 0 && this.dropCounts.weapon < this.dropLimits.weapon;
        const healAllowed = this.dropCounts.heal < this.dropLimits.heal;
        const coreAllowed = this.dropCounts.core < this.dropLimits.core;
        const shieldAllowed = this.dropLimits.shield > 0 && this.dropCounts.shield < this.dropLimits.shield;
        if (weaponAllowed && roll < 0.16) {
            this.items.push(new Item(x, y, 'weapon'));
            this.dropCounts.weapon += 1;
        } else if (healAllowed && roll < 0.30) {
            this.items.push(new Item(x, y, 'heal'));
            this.dropCounts.heal += 1;
        } else if (shieldAllowed && roll < 0.38) {
            this.items.push(new Item(x, y, 'shield'));
            this.dropCounts.shield += 1;
        } else if (coreAllowed && roll < 0.44) {
            this.items.push(new Item(x, y, 'core'));
            this.dropCounts.core += 1;
        }
    }

    spawnBossForCurrentLevel() {
        if (this.bossSpawned) return;
        const config = LEVEL_CONFIG[this.levelIndex];
        this.bossSpawned = true;
        const bossesToSpawn = Array.isArray(config.boss) ? config.boss : [config.boss];
        bossesToSpawn.forEach((bName, idx) => {
            const offsetY = idx === 0 ? -80 : 80;
            const boss = new Boss(this.width + 100 + idx * 30, this.height / 2 + offsetY, bName);
            boss.twinId = config.twinBoss ? idx : null;
            // Scale Boss HP by level
            boss.maxHp += this.levelIndex * 200;
            if (this.levelIndex >= 4) boss.maxHp = Math.round(boss.maxHp * 1.1); // 10% bump from level 5 onward
            // Slightly lower HP per twin to keep total fair
            if (config.twinBoss) boss.maxHp = Math.round(boss.maxHp * 0.7);
            boss.hp = boss.maxHp;
            if (bName === 'CitadelAegis') {
                boss.shieldHp = 250;
            }
            this.enemies.push(boss);
        });

        this.ui.label.innerText = "WARNING: BOSS DETECTED";
        this.ui.label.style.color = "#f00";
        this.sound.playBossWarning();
        const musicKey = bossesToSpawn[0];
        this.sound.playMusic('boss', musicKey);
        if (this.ui.bossBar) this.ui.bossBar.classList.remove('hidden');
        if (config.twinBoss && this.ui.bossBar2) this.ui.bossBar2.classList.remove('hidden');
    }

    nextLevel() {
        const completedLevel = LEVEL_CONFIG[this.levelIndex];
        this.levelIndex++;
        if (this.levelIndex >= LEVEL_CONFIG.length) {
            this.isRunning = false;
            this.sound.stopMusic();
            this.showMessage({
                title: 'GALAXY SECURED',
                body: [
                    "CONGRATULATIONS, PILOT! YOU HAVE SAVED THE GALAXY.",
                    "Final Score: " + this.score,
                    completedLevel ? "Last Sector: " + completedLevel.name : null,
                    "",
                    "Mission Report: Take a screenshot of this message and DM it to @saimsatisfied on Instagram to claim your reward. The fleet awaits your proof of heroics."
                ].filter(Boolean).join("\n"),
                primaryText: 'PLAY AGAIN',
                tone: 'victory',
                onPrimary: () => location.reload()
            });
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
        const reached = LEVEL_CONFIG[this.levelIndex] ? LEVEL_CONFIG[this.levelIndex].name : 'UNKNOWN ZONE';
        this.showMessage({
            title: 'MISSION FAILED',
            body: "Score: " + this.score + "\nReached: " + reached,
            primaryText: 'TRY AGAIN',
            tone: 'alert',
            onPrimary: () => location.reload()
        });
    }
}

const game = new Game();
window.game = game;
