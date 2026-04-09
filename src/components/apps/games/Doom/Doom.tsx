import { useRef, useEffect, useCallback, useState } from 'react';
import { AppProps } from '../../../../types/app';
import { useSubmitScore } from '../../../../hooks/useSubmitScore';
import { LeaderboardPanel } from '../shared/LeaderboardPanel';
import { computeDoomScore } from '../../../../utils/doomScore';
import styles from './Doom.module.css';

// ============================================================
// TYPES
// ============================================================

type GameScreen = 'title' | 'playing' | 'paused' | 'gameover' | 'levelcomplete';
type WeaponType = 'pistol' | 'shotgun';

type Player = {
  x: number;
  y: number;
  angle: number;
  health: number;
  ammo: number;
  bobPhase: number;
  isMoving: boolean;
  shootCooldown: number;
  hurtFlash: number;
  muzzleFlash: number;
  shakeX: number;
  shakeY: number;
  recoilOffset: number;
  pickupFlash: number;
  weapon: WeaponType;
  hasShotgun: boolean;
  weaponSwitchTimer: number;
  pendingWeapon: WeaponType;
};

type EnemyType = 'imp' | 'soldier' | 'demon';
type EnemyState = 'idle' | 'chase' | 'attack' | 'hurt' | 'dead';

type Enemy = {
  x: number;
  y: number;
  type: EnemyType;
  health: number;
  maxHealth: number;
  state: EnemyState;
  angle: number;
  speed: number;
  damage: number;
  attackRange: number;
  attackCooldown: number;
  lastAttackTime: number;
  stateTimer: number;
  distanceToPlayer: number;
  deathTimer: number;
  muzzleFlash: number;
};

type ItemType = 'health' | 'ammo' | 'shotgun';

type Item = {
  x: number;
  y: number;
  type: ItemType;
  value: number;
  collected: boolean;
  bobPhase: number;
};

type InputState = {
  forward: boolean;
  backward: boolean;
  strafeLeft: boolean;
  strafeRight: boolean;
  turnLeft: boolean;
  turnRight: boolean;
  shoot: boolean;
  use: boolean;
};

type RayHit = {
  distance: number;
  wallType: number;
  side: 0 | 1;
  wallX: number;
  mapX: number;
  mapY: number;
};

type GameMap = {
  grid: number[][];
  width: number;
  height: number;
  playerStart: { x: number; y: number; angle: number };
  enemies: { x: number; y: number; type: EnemyType }[];
  items: { x: number; y: number; type: ItemType; value: number }[];
  exitZone: { x: number; y: number };
};

type FloatingText = {
  text: string;
  color: string;
  timer: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  r: number;
  g: number;
  b: number;
};

type WallMark = {
  mapX: number;
  mapY: number;
  wallX: number;
  side: 0 | 1;
  life: number;
};

type Projectile = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  speed: number;
  life: number;
};

// ============================================================
// SOUND ENGINE (Web Audio API - procedural)
// ============================================================

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private ambientNodes: OscillatorNode[] = [];
  private ambientGains: GainNode[] = [];
  private ambientPlaying = false;

  private ensureCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private getMaster(): GainNode {
    this.ensureCtx();
    return this.masterGain!;
  }

  private getNoiseBuffer(): AudioBuffer {
    if (!this.noiseBuffer) {
      const ctx = this.ensureCtx();
      const len = Math.floor(ctx.sampleRate * 0.2);
      this.noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }
    return this.noiseBuffer;
  }

  playShoot(weapon: WeaponType = 'pistol') {
    try {
      const ctx = this.ensureCtx();
      const now = ctx.currentTime;
      const master = this.getMaster();

      // Oscillator: pitch drop
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(weapon === 'shotgun' ? 80 : 150, now);
      osc.frequency.exponentialRampToValueAtTime(weapon === 'shotgun' ? 30 : 50, now + 0.1);
      oscGain.gain.setValueAtTime(weapon === 'shotgun' ? 0.5 : 0.4, now);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(oscGain);
      oscGain.connect(master);
      osc.start(now);
      osc.stop(now + 0.15);

      // Noise burst
      const noise = ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer();
      const noiseGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = weapon === 'shotgun' ? 800 : 2000;
      noiseGain.gain.setValueAtTime(weapon === 'shotgun' ? 0.5 : 0.3, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + (weapon === 'shotgun' ? 0.12 : 0.05));
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(master);
      noise.start(now);
      noise.stop(now + 0.2);
    } catch {}
  }

  playEnemyHit() {
    try {
      const ctx = this.ensureCtx();
      const now = ctx.currentTime;
      const master = this.getMaster();

      const noise = ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      filter.Q.value = 2;
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      noise.start(now);
      noise.stop(now + 0.08);
    } catch {}
  }

  playEnemyDeath() {
    try {
      const ctx = this.ensureCtx();
      const now = ctx.currentTime;
      const master = this.getMaster();

      // Descending sawtooth
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);
      oscGain.gain.setValueAtTime(0.15, now);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(oscGain);
      oscGain.connect(master);
      osc.start(now);
      osc.stop(now + 0.35);

      // Low rumble
      const osc2 = ctx.createOscillator();
      const osc2Gain = ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.value = 60;
      osc2Gain.gain.setValueAtTime(0.2, now);
      osc2Gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc2.connect(osc2Gain);
      osc2Gain.connect(master);
      osc2.start(now);
      osc2.stop(now + 0.35);
    } catch {}
  }

  playPlayerHurt() {
    try {
      const ctx = this.ensureCtx();
      const now = ctx.currentTime;
      const master = this.getMaster();

      const noise = ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 600;
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      noise.start(now);
      noise.stop(now + 0.18);

      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = 100;
      oscGain.gain.setValueAtTime(0.2, now);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.connect(oscGain);
      oscGain.connect(master);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  playPickup(type: ItemType) {
    try {
      const ctx = this.ensureCtx();
      const now = ctx.currentTime;
      const master = this.getMaster();

      if (type === 'health') {
        const osc1 = ctx.createOscillator();
        const g1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.value = 440;
        g1.gain.setValueAtTime(0.2, now);
        g1.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc1.connect(g1); g1.connect(master);
        osc1.start(now); osc1.stop(now + 0.1);

        const osc2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.value = 660;
        g2.gain.setValueAtTime(0.2, now + 0.08);
        g2.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
        osc2.connect(g2); g2.connect(master);
        osc2.start(now + 0.08); osc2.stop(now + 0.18);
      } else if (type === 'shotgun') {
        // Special pickup sound - triumphant
        const freqs = [330, 440, 660];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = f;
          const t = now + i * 0.08;
          g.gain.setValueAtTime(0.25, t);
          g.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
          osc.connect(g); g.connect(master);
          osc.start(t); osc.stop(t + 0.12);
        });
      } else {
        const freqs = [330, 440, 550];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = f;
          const t = now + i * 0.06;
          g.gain.setValueAtTime(0.15, t);
          g.gain.exponentialRampToValueAtTime(0.01, t + 0.06);
          osc.connect(g); g.connect(master);
          osc.start(t); osc.stop(t + 0.08);
        });
      }
    } catch {}
  }

  playFootstep() {
    try {
      const ctx = this.ensureCtx();
      const now = ctx.currentTime;
      const master = this.getMaster();

      const noise = ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 200;
      filter.Q.value = 1;
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.02);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      noise.start(now);
      noise.stop(now + 0.04);
    } catch {}
  }

  startAmbient() {
    if (this.ambientPlaying) return;
    try {
      const ctx = this.ensureCtx();
      const master = this.getMaster();
      this.ambientPlaying = true;

      const freqs = [55, 82.4, 110];
      const gains = [0.04, 0.03, 0.02];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;
        g.gain.value = gains[i];
        osc.connect(g);
        g.connect(master);
        osc.start();
        this.ambientNodes.push(osc);
        this.ambientGains.push(g);
      });

      // Filtered noise texture
      const noise = ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer();
      noise.loop = true;
      const nGain = ctx.createGain();
      const nFilter = ctx.createBiquadFilter();
      nFilter.type = 'lowpass';
      nFilter.frequency.value = 100;
      nGain.gain.value = 0.02;
      noise.connect(nFilter);
      nFilter.connect(nGain);
      nGain.connect(master);
      noise.start();
      this.ambientNodes.push(noise as unknown as OscillatorNode);
    } catch {}
  }

  stopAmbient() {
    this.ambientPlaying = false;
    for (const node of this.ambientNodes) {
      try { node.stop(); } catch {}
    }
    this.ambientNodes = [];
    this.ambientGains = [];
  }

  cleanup() {
    this.stopAmbient();
    if (this.ctx) {
      try { this.ctx.close(); } catch {}
      this.ctx = null;
    }
  }
}

// ============================================================
// CONSTANTS
// ============================================================

const PLANE_LENGTH = 0.66;
const MOVE_SPEED = 3.0;
const TURN_SPEED = 3.0;
const MOUSE_SENSITIVITY = 0.003;
const COLLISION_RADIUS = 0.25;
const MAX_RAY_DEPTH = 24;
const MAX_RENDER_WIDTH = 480;
const HUD_HEIGHT = 56;
const MINIMAP_SCALE = 4;
const PICKUP_RANGE = 0.6;
const MAX_PARTICLES = 100;
const MAX_WALL_MARKS = 20;
const MAX_PROJECTILES = 20;

const WEAPON_DEFS: Record<WeaponType, {
  damage: number;
  spread: number;
  pellets: number;
  cooldown: number;
  ammoPerShot: number;
  recoilAmount: number;
}> = {
  pistol: { damage: 15, spread: 0, pellets: 1, cooldown: 0.3, ammoPerShot: 1, recoilAmount: 8 },
  shotgun: { damage: 10, spread: 0.12, pellets: 5, cooldown: 0.8, ammoPerShot: 2, recoilAmount: 16 },
};

const WALL_COLORS: Record<number, { light: string; dark: string }> = {
  1: { light: '#8B6914', dark: '#5C4510' },
  2: { light: '#787878', dark: '#505050' },
  3: { light: '#9B2020', dark: '#6B1010' },
  4: { light: '#3F5F5F', dark: '#2C4040' },
  5: { light: '#5B1092', dark: '#3A0868' },
  10: { light: '#DAA520', dark: '#8B6914' },
};

const ENEMY_DEFS: Record<EnemyType, { health: number; speed: number; damage: number; attackRange: number; cooldown: number }> = {
  imp: { health: 30, speed: 1.5, damage: 10, attackRange: 1.5, cooldown: 1.0 },
  soldier: { health: 40, speed: 1.0, damage: 15, attackRange: 8, cooldown: 1.5 },
  demon: { health: 60, speed: 2.5, damage: 20, attackRange: 1.8, cooldown: 0.8 },
};

// ============================================================
// MAPS
// ============================================================

const MAPS: GameMap[] = [
  // Map 1 - Outpost
  {
    width: 24, height: 24,
    grid: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,2,2,2,2,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,1],
      [1,0,0,0,2,0,0,2,0,0,0,0,0,0,0,3,0,0,3,0,0,0,0,1],
      [1,0,0,0,2,0,0,2,0,0,0,0,0,0,0,3,0,0,3,0,0,0,0,1],
      [1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,4,4,4,4,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,4,0,0,4,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,4,0,0,4,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,4,0,0,4,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    playerStart: { x: 2.5, y: 2.5, angle: 0 },
    enemies: [
      { x: 6.5, y: 5.5, type: 'imp' },
      { x: 17.5, y: 6.5, type: 'soldier' },
      { x: 11.5, y: 11.5, type: 'imp' },
      { x: 18.5, y: 19.5, type: 'demon' },
    ],
    items: [
      { x: 4.5, y: 8.5, type: 'health', value: 25 },
      { x: 14.5, y: 2.5, type: 'ammo', value: 15 },
      { x: 11.5, y: 14.5, type: 'health', value: 25 },
      { x: 8.5, y: 9.5, type: 'ammo', value: 10 },
      { x: 12.5, y: 8.5, type: 'shotgun', value: 0 },
    ],
    exitZone: { x: 22, y: 22 },
  },
  // Map 2 - Dungeon
  {
    width: 24, height: 24,
    grid: [
      [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
      [3,0,0,0,3,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3],
      [3,0,0,0,3,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,3],
      [3,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,4,4,4,0,3],
      [3,0,0,0,3,0,0,0,2,2,0,0,0,0,0,0,0,0,0,4,0,4,0,3],
      [3,3,0,3,3,0,0,0,2,2,0,0,0,0,0,0,0,0,0,4,0,0,0,3],
      [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,0,0,0,0,4,0,3],
      [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,4,0,3],
      [3,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,0,3],
      [3,0,0,2,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
      [3,0,0,0,0,2,0,0,0,5,5,5,5,0,0,0,0,0,0,0,0,0,0,3],
      [3,0,0,0,0,0,0,0,0,5,0,0,5,0,0,0,0,0,0,0,0,0,0,3],
      [3,0,0,0,0,0,0,0,0,5,0,0,5,0,0,0,0,0,0,0,0,0,0,3],
      [3,3,3,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
      [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,3],
      [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,2,0,0,0,0,3],
      [3,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,3],
      [3,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
      [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
      [3,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,3],
      [3,0,0,0,0,0,0,0,0,3,0,3,0,0,0,0,0,0,0,0,0,0,0,3],
      [3,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
      [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
      [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    ],
    playerStart: { x: 1.5, y: 1.5, angle: 0 },
    enemies: [
      { x: 6.5, y: 3.5, type: 'imp' },
      { x: 10.5, y: 11.5, type: 'soldier' },
      { x: 4.5, y: 9.5, type: 'imp' },
      { x: 20.5, y: 4.5, type: 'demon' },
      { x: 16.5, y: 7.5, type: 'soldier' },
      { x: 17.5, y: 15.5, type: 'imp' },
      { x: 2.5, y: 18.5, type: 'demon' },
      { x: 10.5, y: 20.5, type: 'soldier' },
    ],
    items: [
      { x: 1.5, y: 4.5, type: 'health', value: 25 },
      { x: 7.5, y: 7.5, type: 'ammo', value: 15 },
      { x: 11.5, y: 1.5, type: 'health', value: 25 },
      { x: 20.5, y: 7.5, type: 'ammo', value: 15 },
      { x: 5.5, y: 15.5, type: 'health', value: 50 },
      { x: 15.5, y: 18.5, type: 'ammo', value: 20 },
    ],
    exitZone: { x: 22, y: 22 },
  },
  // Map 3 - Fortress
  {
    width: 24, height: 24,
    grid: [
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,0,0,2],
      [2,0,0,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,5,5,5,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,5,0,5,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,3,3,3,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,2],
      [2,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,2],
      [2,0,0,0,0,3,0,0,0,0,0,1,0,0,0,0,0,3,0,0,0,0,0,2],
      [2,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,2],
      [2,0,0,0,0,3,3,3,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,5,5,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,0,0,2],
      [2,0,0,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    ],
    playerStart: { x: 1.5, y: 1.5, angle: Math.PI / 4 },
    enemies: [
      { x: 11.5, y: 6.5, type: 'soldier' },
      { x: 6.5, y: 11.5, type: 'imp' },
      { x: 16.5, y: 11.5, type: 'imp' },
      { x: 11.5, y: 12.5, type: 'demon' },
      { x: 3.5, y: 19.5, type: 'soldier' },
      { x: 20.5, y: 19.5, type: 'soldier' },
      { x: 11.5, y: 17.5, type: 'demon' },
      { x: 2.5, y: 8.5, type: 'imp' },
      { x: 21.5, y: 8.5, type: 'imp' },
      { x: 15.5, y: 3.5, type: 'soldier' },
      { x: 8.5, y: 20.5, type: 'demon' },
      { x: 14.5, y: 20.5, type: 'imp' },
    ],
    items: [
      { x: 1.5, y: 22.5, type: 'health', value: 50 },
      { x: 22.5, y: 22.5, type: 'ammo', value: 25 },
      { x: 22.5, y: 1.5, type: 'health', value: 25 },
      { x: 11.5, y: 1.5, type: 'ammo', value: 20 },
      { x: 11.5, y: 22.5, type: 'health', value: 50 },
      { x: 6.5, y: 12.5, type: 'ammo', value: 15 },
      { x: 16.5, y: 12.5, type: 'health', value: 25 },
      { x: 1.5, y: 11.5, type: 'ammo', value: 20 },
    ],
    exitZone: { x: 22, y: 22 },
  },
];

// ============================================================
// SPRITE DATA (procedural pixel art, 16x16)
// ============================================================

const SPRITE_PALETTE: Record<string, string> = {
  R: '#cc2222', O: '#dd7711', G: '#338833', B: '#886633',
  D: '#443322', K: '#222222', W: '#eeeeee', Y: '#ddcc22',
  L: '#44cc44', P: '#cc4466', S: '#999999', C: '#881111',
  r: '#ff4444', g: '#55aa55', b: '#664422', M: '#880044',
  _: '',
};

const IMP_SPRITE = [
  '____RRRR________',
  '___RrRrRR_______',
  '___RRRRRR_______',
  '___RWRWRR_______',
  '___RRRRRR_______',
  '____RRRR________',
  '____RRRR________',
  '___RRRRRR_______',
  '__RRRRRRRR______',
  '__RR_RR_RR______',
  '__R__RR__R______',
  '_____RR_________',
  '____R__R________',
  '___RR__RR_______',
  '________________',
  '________________',
];

const SOLDIER_SPRITE = [
  '____GGGG________',
  '___GgGgGG_______',
  '___GGGGGG_______',
  '___GWGWGG_______',
  '___GGGGGG_______',
  '____GGGG________',
  '____BGGG________',
  '___BBBGGG_______',
  '__BBBBBBBB______',
  '__BB_BB_BB______',
  '__B__BB__B______',
  '_____BB_________',
  '____B__B________',
  '___BB__BB_______',
  '________________',
  '________________',
];

const DEMON_SPRITE = [
  '__CCCCCCCC______',
  '_CCCCCCCCCC_____',
  '_CrCCCCCrCC_____',
  '_CCWCCWCCCC_____',
  '_CCCCCCCCCC_____',
  '_CCRRRRRCC______',
  '__CCCCCCCC______',
  '__CCCCCCCC______',
  '_CCCCCCCCCC_____',
  '_CCCCCCCCCC_____',
  'CCCCCCCCCCCC____',
  'CC_CC__CC_CC____',
  'C__CC__CC__C____',
  '___CC__CC_______',
  '__CC____CC______',
  '__CC____CC______',
];

const SPRITES: Record<string, string[]> = {
  imp: IMP_SPRITE,
  soldier: SOLDIER_SPRITE,
  demon: DEMON_SPRITE,
};

// ============================================================
// HELPER: Create sprite canvas from pixel art
// ============================================================

function createSpriteCanvas(spriteData: string[], scale: number = 1): HTMLCanvasElement {
  const h = spriteData.length;
  const w = spriteData[0].length;
  const canvas = document.createElement('canvas');
  canvas.width = w * scale;
  canvas.height = h * scale;
  const ctx = canvas.getContext('2d')!;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = spriteData[y][x];
      if (ch === '_') continue;
      const color = SPRITE_PALETTE[ch];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
  return canvas;
}

// ============================================================
// HELPER: Line of sight check (DDA)
// ============================================================

function hasLineOfSight(
  x0: number, y0: number,
  x1: number, y1: number,
  grid: number[][],
  width: number, height: number,
): boolean {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < 0.01) return true;

  const dirX = dx / dist;
  const dirY = dy / dist;

  let mapX = Math.floor(x0);
  let mapY = Math.floor(y0);
  const mapX1 = Math.floor(x1);
  const mapY1 = Math.floor(y1);

  const deltaDistX = Math.abs(dirX) < 1e-10 ? 1e10 : Math.abs(1 / dirX);
  const deltaDistY = Math.abs(dirY) < 1e-10 ? 1e10 : Math.abs(1 / dirY);

  const stepX = dirX < 0 ? -1 : 1;
  const stepY = dirY < 0 ? -1 : 1;

  let sideDistX = dirX < 0
    ? (x0 - mapX) * deltaDistX
    : (mapX + 1.0 - x0) * deltaDistX;
  let sideDistY = dirY < 0
    ? (y0 - mapY) * deltaDistY
    : (mapY + 1.0 - y0) * deltaDistY;

  for (let i = 0; i < MAX_RAY_DEPTH; i++) {
    if (sideDistX < sideDistY) {
      sideDistX += deltaDistX;
      mapX += stepX;
    } else {
      sideDistY += deltaDistY;
      mapY += stepY;
    }
    if (mapX === mapX1 && mapY === mapY1) return true;
    if (mapX < 0 || mapX >= width || mapY < 0 || mapY >= height) return false;
    if (grid[mapY][mapX] > 0) return false;
  }
  return false;
}

// ============================================================
// HELPER: parse color string to RGB
// ============================================================

function hexToRgb(hex: string): [number, number, number] {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

// ============================================================
// COMPONENT
// ============================================================

export function Doom({ windowId: _windowId }: AppProps) {
  const { submitScore } = useSubmitScore('doom');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cached offscreen canvas (Phase 0 perf fix)
  const offscreenRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  const offscreenSizeRef = useRef({ w: 0, h: 0 });

  // Game state refs
  const playerRef = useRef<Player>({
    x: 2.5, y: 2.5, angle: 0,
    health: 100, ammo: 50,
    bobPhase: 0, isMoving: false,
    shootCooldown: 0, hurtFlash: 0, muzzleFlash: 0,
    shakeX: 0, shakeY: 0,
    recoilOffset: 0, pickupFlash: 0,
    weapon: 'pistol', hasShotgun: false,
    weaponSwitchTimer: 0, pendingWeapon: 'pistol',
  });
  const enemiesRef = useRef<Enemy[]>([]);
  const itemsRef = useRef<Item[]>([]);
  const mapRef = useRef<GameMap>(MAPS[0]);
  const currentLevelRef = useRef(0);
  const screenRef = useRef<GameScreen>('title');
  const keysRef = useRef<InputState>({
    forward: false, backward: false,
    strafeLeft: false, strafeRight: false,
    turnLeft: false, turnRight: false,
    shoot: false, use: false,
  });
  const zBufferRef = useRef<number[]>([]);
  const gameLoopRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const spriteCanvasesRef = useRef<Record<string, HTMLCanvasElement>>({});
  const spriteImageDataRef = useRef<Record<string, ImageData>>({});
  const killCountRef = useRef(0);
  const totalKillsRef = useRef(0);
  const gameTimeRef = useRef(0);
  const lastBobSignRef = useRef(0);

  // New effect refs
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const wallMarksRef = useRef<WallMark[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const soundRef = useRef<SoundEngine>(new SoundEngine());

  // UI state
  const [gameScreen, setGameScreen] = useState<GameScreen>('title');
  const [displayHealth, setDisplayHealth] = useState(100);
  const [displayAmmo, setDisplayAmmo] = useState(50);
  const [displayKills, setDisplayKills] = useState(0);
  const [displayTotalEnemies, setDisplayTotalEnemies] = useState(0);
  const [displayLevel, setDisplayLevel] = useState(1);
  const [canvasSize, setCanvasSize] = useState({ width: 640, height: 480 });
  const [displayWeapon, setDisplayWeapon] = useState<WeaponType>('pistol');

  // ============================================================
  // INIT SPRITES (with ImageData caching - Phase 0 perf fix)
  // ============================================================

  const initSprites = useCallback(() => {
    const canvases: Record<string, HTMLCanvasElement> = {};
    const imageDataCache: Record<string, ImageData> = {};
    for (const [name, data] of Object.entries(SPRITES)) {
      const canvas = createSpriteCanvas(data, 2);
      canvases[name] = canvas;
      const ctx = canvas.getContext('2d')!;
      imageDataCache[name] = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
    spriteCanvasesRef.current = canvases;
    spriteImageDataRef.current = imageDataCache;
  }, []);

  // ============================================================
  // LOAD LEVEL
  // ============================================================

  const loadLevel = useCallback((levelIndex: number) => {
    const map = MAPS[levelIndex % MAPS.length];
    mapRef.current = map;
    currentLevelRef.current = levelIndex;

    const p = playerRef.current;
    p.x = map.playerStart.x;
    p.y = map.playerStart.y;
    p.angle = map.playerStart.angle;
    p.health = Math.min(p.health + 25, 100);
    p.bobPhase = 0;
    p.isMoving = false;
    p.shootCooldown = 0;
    p.hurtFlash = 0;
    p.muzzleFlash = 0;
    p.shakeX = 0;
    p.shakeY = 0;
    p.recoilOffset = 0;
    p.pickupFlash = 0;
    p.weaponSwitchTimer = 0;

    enemiesRef.current = map.enemies.map(e => {
      const def = ENEMY_DEFS[e.type];
      return {
        x: e.x, y: e.y, type: e.type,
        health: def.health, maxHealth: def.health,
        state: 'idle' as EnemyState,
        angle: 0, speed: def.speed,
        damage: def.damage, attackRange: def.attackRange,
        attackCooldown: def.cooldown, lastAttackTime: 0,
        stateTimer: 0,
        distanceToPlayer: 999,
        deathTimer: 0,
        muzzleFlash: 0,
      };
    });

    itemsRef.current = map.items.map(it => ({
      x: it.x, y: it.y, type: it.type, value: it.value,
      collected: false, bobPhase: Math.random() * Math.PI * 2,
    }));

    // Clear effects
    floatingTextsRef.current = [];
    particlesRef.current = [];
    wallMarksRef.current = [];
    projectilesRef.current = [];

    killCountRef.current = 0;
    totalKillsRef.current = map.enemies.length;
    setDisplayKills(0);
    setDisplayTotalEnemies(map.enemies.length);
    setDisplayLevel(levelIndex + 1);
    setDisplayHealth(p.health);
    setDisplayAmmo(p.ammo);
    setDisplayWeapon(p.weapon);
  }, []);

  // ============================================================
  // COLLISION CHECK
  // ============================================================

  const isWalkable = useCallback((x: number, y: number): boolean => {
    const map = mapRef.current;
    const r = COLLISION_RADIUS;
    const checks = [
      [x, y], [x - r, y], [x + r, y],
      [x, y - r], [x, y + r],
      [x - r, y - r], [x + r, y - r],
      [x - r, y + r], [x + r, y + r],
    ];
    for (const [cx, cy] of checks) {
      const mx = Math.floor(cx);
      const my = Math.floor(cy);
      if (mx < 0 || mx >= map.width || my < 0 || my >= map.height) return false;
      if (map.grid[my][mx] > 0) return false;
    }
    return true;
  }, []);

  // ============================================================
  // CAST SINGLE RAY (DDA)
  // ============================================================

  const castRay = useCallback((originX: number, originY: number, rayDirX: number, rayDirY: number): RayHit => {
    const map = mapRef.current;
    let mapX = Math.floor(originX);
    let mapY = Math.floor(originY);

    const deltaDistX = Math.abs(rayDirX) < 1e-10 ? 1e10 : Math.abs(1 / rayDirX);
    const deltaDistY = Math.abs(rayDirY) < 1e-10 ? 1e10 : Math.abs(1 / rayDirY);

    const stepX = rayDirX < 0 ? -1 : 1;
    const stepY = rayDirY < 0 ? -1 : 1;

    let sideDistX = rayDirX < 0
      ? (originX - mapX) * deltaDistX
      : (mapX + 1.0 - originX) * deltaDistX;
    let sideDistY = rayDirY < 0
      ? (originY - mapY) * deltaDistY
      : (mapY + 1.0 - originY) * deltaDistY;

    let side: 0 | 1 = 0;
    let hit = false;

    for (let i = 0; i < MAX_RAY_DEPTH; i++) {
      if (sideDistX < sideDistY) {
        sideDistX += deltaDistX;
        mapX += stepX;
        side = 0;
      } else {
        sideDistY += deltaDistY;
        mapY += stepY;
        side = 1;
      }
      if (mapX < 0 || mapX >= map.width || mapY < 0 || mapY >= map.height) break;
      if (map.grid[mapY][mapX] > 0) {
        hit = true;
        break;
      }
    }

    let perpDist: number;
    let wallX: number;
    if (hit) {
      if (side === 0) {
        perpDist = (mapX - originX + (1 - stepX) / 2) / rayDirX;
      } else {
        perpDist = (mapY - originY + (1 - stepY) / 2) / rayDirY;
      }
      if (side === 0) {
        wallX = originY + perpDist * rayDirY;
      } else {
        wallX = originX + perpDist * rayDirX;
      }
      wallX -= Math.floor(wallX);
    } else {
      perpDist = MAX_RAY_DEPTH;
      wallX = 0;
    }

    return {
      distance: Math.max(perpDist, 0.01),
      wallType: hit ? map.grid[mapY][mapX] : 0,
      side,
      wallX,
      mapX,
      mapY,
    };
  }, []);

  // ============================================================
  // SHOOTING
  // ============================================================

  const playerShoot = useCallback(() => {
    const p = playerRef.current;
    const weapDef = WEAPON_DEFS[p.weapon];
    if (p.ammo < weapDef.ammoPerShot || p.shootCooldown > 0 || p.weaponSwitchTimer > 0) return;

    p.ammo -= weapDef.ammoPerShot;
    p.shootCooldown = weapDef.cooldown;
    p.muzzleFlash = p.weapon === 'shotgun' ? 0.15 : 0.1;
    p.recoilOffset = -weapDef.recoilAmount;
    p.shakeX += (Math.random() - 0.5) * (p.weapon === 'shotgun' ? 4 : 2);
    p.shakeY += (Math.random() - 0.5) * (p.weapon === 'shotgun' ? 3 : 1.5);
    setDisplayAmmo(p.ammo);

    soundRef.current.playShoot(p.weapon);

    let hitAnyEnemy = false;

    for (let pellet = 0; pellet < weapDef.pellets; pellet++) {
      const spreadAngle = weapDef.pellets > 1
        ? (Math.random() - 0.5) * weapDef.spread * 2
        : 0;
      const pelletAngle = p.angle + spreadAngle;
      const dirX = Math.cos(pelletAngle);
      const dirY = Math.sin(pelletAngle);

      // Sort enemies by distance
      const liveEnemies = enemiesRef.current
        .filter(e => e.state !== 'dead')
        .sort((a, b) => {
          const da = (a.x - p.x) ** 2 + (a.y - p.y) ** 2;
          const db = (b.x - p.x) ** 2 + (b.y - p.y) ** 2;
          return da - db;
        });

      let pelletHit = false;
      for (const enemy of liveEnemies) {
        const ex = enemy.x - p.x;
        const ey = enemy.y - p.y;
        const dist = Math.sqrt(ex * ex + ey * ey);
        if (dist > 20) continue;

        const enemyAngle = Math.atan2(ey, ex);
        let angleDiff = enemyAngle - pelletAngle;
        while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

        const hitAngle = Math.atan2(0.4, dist);
        if (Math.abs(angleDiff) < hitAngle) {
          if (hasLineOfSight(p.x, p.y, enemy.x, enemy.y, mapRef.current.grid, mapRef.current.width, mapRef.current.height)) {
            enemy.health -= weapDef.damage;
            hitAnyEnemy = true;
            pelletHit = true;

            // Spawn blood particles
            for (let i = 0; i < 4; i++) {
              if (particlesRef.current.length < MAX_PARTICLES) {
                particlesRef.current.push({
                  x: enemy.x, y: enemy.y,
                  vx: (Math.random() - 0.5) * 3,
                  vy: (Math.random() - 0.5) * 3,
                  life: 0.5 + Math.random() * 0.5,
                  maxLife: 1.0,
                  r: 180 + Math.random() * 75, g: 0, b: 0,
                });
              }
            }

            if (enemy.health <= 0) {
              enemy.state = 'dead';
              enemy.health = 0;
              enemy.deathTimer = 1.0;
              killCountRef.current++;
              setDisplayKills(killCountRef.current);
              soundRef.current.playEnemyDeath();
            } else {
              enemy.state = 'hurt';
              enemy.stateTimer = 0.2;
              soundRef.current.playEnemyHit();
            }
            break;
          }
        }
      }

      // Wall impact if pellet missed all enemies
      if (!pelletHit) {
        const wallHit = castRay(p.x, p.y, dirX, dirY);
        if (wallHit.wallType > 0 && wallMarksRef.current.length < MAX_WALL_MARKS) {
          wallMarksRef.current.push({
            mapX: wallHit.mapX, mapY: wallHit.mapY,
            wallX: wallHit.wallX, side: wallHit.side,
            life: 3.0,
          });
          // Wall spark particles
          const hitX = p.x + dirX * wallHit.distance;
          const hitY = p.y + dirY * wallHit.distance;
          for (let i = 0; i < 2; i++) {
            if (particlesRef.current.length < MAX_PARTICLES) {
              particlesRef.current.push({
                x: hitX, y: hitY,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: 0.3 + Math.random() * 0.3,
                maxLife: 0.6,
                r: 150, g: 140, b: 120,
              });
            }
          }
        }
      }
    }

    if (!hitAnyEnemy) {
      // No visual/audio feedback beyond wall marks already handled
    }
  }, [castRay]);

  // ============================================================
  // UPDATE PLAYER
  // ============================================================

  const updatePlayer = useCallback((dt: number) => {
    const p = playerRef.current;
    const keys = keysRef.current;

    // Turn (keyboard)
    if (keys.turnLeft) p.angle -= TURN_SPEED * dt;
    if (keys.turnRight) p.angle += TURN_SPEED * dt;

    const dirX = Math.cos(p.angle);
    const dirY = Math.sin(p.angle);

    let moveX = 0;
    let moveY = 0;

    if (keys.forward) { moveX += dirX; moveY += dirY; }
    if (keys.backward) { moveX -= dirX; moveY -= dirY; }
    if (keys.strafeLeft) { moveX += dirY; moveY -= dirX; }
    if (keys.strafeRight) { moveX -= dirY; moveY += dirX; }

    // Normalize diagonal movement
    const moveMag = Math.sqrt(moveX * moveX + moveY * moveY);
    p.isMoving = moveMag > 0.01;

    if (p.isMoving) {
      moveX = (moveX / moveMag) * MOVE_SPEED * dt;
      moveY = (moveY / moveMag) * MOVE_SPEED * dt;

      // Slide collision: X and Y independently
      if (isWalkable(p.x + moveX, p.y)) p.x += moveX;
      if (isWalkable(p.x, p.y + moveY)) p.y += moveY;

      p.bobPhase += dt * 10;

      // Footstep sound
      const bobSign = Math.sin(p.bobPhase) >= 0 ? 1 : -1;
      if (bobSign !== lastBobSignRef.current) {
        lastBobSignRef.current = bobSign;
        soundRef.current.playFootstep();
      }
    }

    // Shooting
    if (p.shootCooldown > 0) p.shootCooldown -= dt;
    if (keys.shoot && p.shootCooldown <= 0 && p.weaponSwitchTimer <= 0) {
      playerShoot();
    }

    // Weapon switching
    if (p.weaponSwitchTimer > 0) {
      const prevTimer = p.weaponSwitchTimer;
      p.weaponSwitchTimer -= dt;
      // Swap at halfway point
      if (prevTimer > 0.2 && p.weaponSwitchTimer <= 0.2) {
        p.weapon = p.pendingWeapon;
        setDisplayWeapon(p.weapon);
      }
      if (p.weaponSwitchTimer < 0) p.weaponSwitchTimer = 0;
    }

    // Timers
    if (p.hurtFlash > 0) p.hurtFlash -= dt;
    if (p.muzzleFlash > 0) p.muzzleFlash -= dt;
    if (p.pickupFlash > 0) p.pickupFlash -= dt;

    // Decay screen shake
    p.shakeX *= 0.85;
    p.shakeY *= 0.85;
    if (Math.abs(p.shakeX) < 0.1) p.shakeX = 0;
    if (Math.abs(p.shakeY) < 0.1) p.shakeY = 0;

    // Decay recoil
    if (p.recoilOffset < 0) {
      p.recoilOffset = Math.min(0, p.recoilOffset + dt * 80);
    }
  }, [isWalkable, playerShoot]);

  // ============================================================
  // UPDATE ENEMIES
  // ============================================================

  const updateEnemies = useCallback((dt: number) => {
    const p = playerRef.current;
    const map = mapRef.current;

    for (const enemy of enemiesRef.current) {
      // Decay enemy muzzle flash
      if (enemy.muzzleFlash > 0) enemy.muzzleFlash -= dt;

      if (enemy.state === 'dead') {
        if (enemy.deathTimer > 0) enemy.deathTimer -= dt;
        continue;
      }

      const dx = p.x - enemy.x;
      const dy = p.y - enemy.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      enemy.distanceToPlayer = dist;
      enemy.angle = Math.atan2(dy, dx);

      if (enemy.state === 'hurt') {
        enemy.stateTimer -= dt;
        if (enemy.stateTimer <= 0) enemy.state = 'chase';
        continue;
      }

      if (enemy.state === 'idle') {
        if (dist < 10 && hasLineOfSight(enemy.x, enemy.y, p.x, p.y, map.grid, map.width, map.height)) {
          enemy.state = 'chase';
        }
        continue;
      }

      if (enemy.state === 'chase') {
        if (dist < enemy.attackRange) {
          enemy.state = 'attack';
          enemy.lastAttackTime = 0;
          continue;
        }
        const moveX = Math.cos(enemy.angle) * enemy.speed * dt;
        const moveY = Math.sin(enemy.angle) * enemy.speed * dt;

        const newX = enemy.x + moveX;
        const newY = enemy.y + moveY;

        const mx = Math.floor(newX);
        const my = Math.floor(newY);
        if (mx >= 0 && mx < map.width && my >= 0 && my < map.height && map.grid[my][mx] === 0) {
          enemy.x = newX;
          enemy.y = newY;
        }

        if (dist > 15) enemy.state = 'idle';
        continue;
      }

      if (enemy.state === 'attack') {
        enemy.lastAttackTime += dt;
        if (enemy.lastAttackTime >= enemy.attackCooldown) {
          enemy.lastAttackTime = 0;
          if (dist < enemy.attackRange + 0.5) {
            if (enemy.type === 'soldier') {
              if (hasLineOfSight(enemy.x, enemy.y, p.x, p.y, map.grid, map.width, map.height)) {
                const accuracy = Math.max(0.3, 1 - dist * 0.05);
                enemy.muzzleFlash = 0.15;

                // Spawn visual projectile
                if (projectilesRef.current.length < MAX_PROJECTILES) {
                  projectilesRef.current.push({
                    x: enemy.x, y: enemy.y,
                    dx: Math.cos(enemy.angle), dy: Math.sin(enemy.angle),
                    speed: 12, life: 0.3,
                  });
                }

                if (Math.random() < accuracy) {
                  p.health -= enemy.damage;
                  p.hurtFlash = 0.3;
                  p.shakeX = (Math.random() - 0.5) * 8;
                  p.shakeY = (Math.random() - 0.5) * 6;
                  setDisplayHealth(Math.max(0, p.health));
                  soundRef.current.playPlayerHurt();
                }
              }
            } else {
              p.health -= enemy.damage;
              p.hurtFlash = 0.3;
              p.shakeX = (Math.random() - 0.5) * 8;
              p.shakeY = (Math.random() - 0.5) * 6;
              setDisplayHealth(Math.max(0, p.health));
              soundRef.current.playPlayerHurt();
            }
          }
        }
        if (dist > enemy.attackRange + 1) {
          enemy.state = 'chase';
        }
      }
    }
  }, []);

  // ============================================================
  // UPDATE PARTICLES
  // ============================================================

  const updateParticles = useCallback((dt: number) => {
    const particles = particlesRef.current;
    for (let i = particles.length - 1; i >= 0; i--) {
      const part = particles[i];
      part.x += part.vx * dt;
      part.y += part.vy * dt;
      part.vx *= 0.95;
      part.vy *= 0.95;
      part.life -= dt;
      if (part.life <= 0) {
        particles.splice(i, 1);
      }
    }
  }, []);

  // ============================================================
  // UPDATE PROJECTILES
  // ============================================================

  const updateProjectiles = useCallback((dt: number) => {
    const projs = projectilesRef.current;
    for (let i = projs.length - 1; i >= 0; i--) {
      const proj = projs[i];
      proj.x += proj.dx * proj.speed * dt;
      proj.y += proj.dy * proj.speed * dt;
      proj.life -= dt;
      if (proj.life <= 0) {
        projs.splice(i, 1);
      }
    }
  }, []);

  // ============================================================
  // UPDATE FLOATING TEXTS
  // ============================================================

  const updateFloatingTexts = useCallback((dt: number) => {
    const texts = floatingTextsRef.current;
    for (let i = texts.length - 1; i >= 0; i--) {
      texts[i].timer -= dt;
      if (texts[i].timer <= 0) {
        texts.splice(i, 1);
      }
    }
  }, []);

  // ============================================================
  // UPDATE WALL MARKS
  // ============================================================

  const updateWallMarks = useCallback((dt: number) => {
    const marks = wallMarksRef.current;
    for (let i = marks.length - 1; i >= 0; i--) {
      marks[i].life -= dt;
      if (marks[i].life <= 0) {
        marks.splice(i, 1);
      }
    }
  }, []);

  // ============================================================
  // CHECK ITEM PICKUPS
  // ============================================================

  const checkItems = useCallback(() => {
    const p = playerRef.current;
    for (const item of itemsRef.current) {
      if (item.collected) continue;
      const dx = p.x - item.x;
      const dy = p.y - item.y;
      if (dx * dx + dy * dy < PICKUP_RANGE * PICKUP_RANGE) {
        if (item.type === 'health' && p.health < 100) {
          p.health = Math.min(100, p.health + item.value);
          item.collected = true;
          setDisplayHealth(p.health);
          p.pickupFlash = 0.15;
          soundRef.current.playPickup('health');
          floatingTextsRef.current.push({ text: `+${item.value} HP`, color: '#44ff44', timer: 1.5 });
        } else if (item.type === 'ammo') {
          p.ammo = Math.min(200, p.ammo + item.value);
          item.collected = true;
          setDisplayAmmo(p.ammo);
          p.pickupFlash = 0.15;
          soundRef.current.playPickup('ammo');
          floatingTextsRef.current.push({ text: `+${item.value} AMMO`, color: '#ffdd44', timer: 1.5 });
        } else if (item.type === 'shotgun' && !p.hasShotgun) {
          p.hasShotgun = true;
          p.weapon = 'shotgun';
          item.collected = true;
          p.pickupFlash = 0.2;
          setDisplayWeapon('shotgun');
          soundRef.current.playPickup('shotgun');
          floatingTextsRef.current.push({ text: 'SHOTGUN!', color: '#ff8844', timer: 2.0 });
        }
      }
    }
  }, []);

  // ============================================================
  // CHECK LEVEL EXIT
  // ============================================================

  const checkExit = useCallback(() => {
    const p = playerRef.current;
    const exit = mapRef.current.exitZone;
    const dx = p.x - (exit.x + 0.5);
    const dy = p.y - (exit.y + 0.5);
    if (dx * dx + dy * dy < 1.0) {
      screenRef.current = 'levelcomplete';
      setGameScreen('levelcomplete');
      soundRef.current.stopAmbient();
      try { document.exitPointerLock(); } catch {}
    }
  }, []);

  // ============================================================
  // RENDER
  // ============================================================

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const p = playerRef.current;
    const screen = screenRef.current;

    // Title screen
    if (screen === 'title') {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);
      return;
    }

    // Render width (capped for performance)
    const renderW = Math.min(W, MAX_RENDER_WIDTH);
    const renderH = Math.floor(H * (renderW / W));
    const hudH = Math.floor(HUD_HEIGHT * (renderW / W));
    const viewH = renderH - hudH;

    // Use offscreen buffer at render resolution
    const buffer = ctx.createImageData(renderW, renderH);
    const data = buffer.data;

    const dirX = Math.cos(p.angle);
    const dirY = Math.sin(p.angle);
    const planeX = -dirY * PLANE_LENGTH;
    const planeY = dirX * PLANE_LENGTH;

    // Ensure zBuffer is correct size
    if (zBufferRef.current.length !== renderW) {
      zBufferRef.current = new Array(renderW).fill(0);
    }
    const zBuffer = zBufferRef.current;

    const gameTime = gameTimeRef.current;
    const exit = mapRef.current.exitZone;
    const exitCX = exit.x + 0.5;
    const exitCY = exit.y + 0.5;
    const pDistToExit = Math.sqrt((p.x - exitCX) ** 2 + (p.y - exitCY) ** 2);

    // ---- FLOOR & CEILING ----
    for (let y = 0; y < viewH; y++) {
      const isCeiling = y < viewH / 2;
      const rowDist = isCeiling
        ? (viewH / 2) / (viewH / 2 - y + 0.1)
        : (viewH / 2) / (y - viewH / 2 + 0.1);

      const shade = Math.max(0, Math.min(1, 1.0 / (1.0 + rowDist * rowDist * 0.015)));

      let r: number, g: number, b: number;
      if (isCeiling) {
        r = Math.floor(15 * shade);
        g = Math.floor(15 * shade);
        b = Math.floor(30 * shade);
      } else {
        r = Math.floor(40 * shade);
        g = Math.floor(35 * shade);
        b = Math.floor(25 * shade);
      }

      for (let x = 0; x < renderW; x++) {
        const idx = (y * renderW + x) * 4;

        // Exit zone glow (floor only, when player is close enough)
        if (!isCeiling && pDistToExit < 8) {
          const cameraX = 2 * x / renderW - 1;
          const floorX = p.x + rowDist * (dirX + planeX * cameraX);
          const floorY = p.y + rowDist * (dirY + planeY * cameraX);
          const eDx = floorX - exitCX;
          const eDy = floorY - exitCY;
          const eDist2 = eDx * eDx + eDy * eDy;
          if (eDist2 < 2.0) {
            const glow = (1 - eDist2 / 2.0) * (0.5 + 0.5 * Math.sin(gameTime * 4));
            r = Math.min(255, r + Math.floor(60 * glow));
            g = Math.min(255, g + Math.floor(80 * glow));
            b = Math.min(255, b + Math.floor(20 * glow));
          }
        }

        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }

    // HUD background
    for (let y = viewH; y < renderH; y++) {
      for (let x = 0; x < renderW; x++) {
        const idx = (y * renderW + x) * 4;
        data[idx] = 30;
        data[idx + 1] = 30;
        data[idx + 2] = 30;
        data[idx + 3] = 255;
      }
    }

    // ---- WALLS (RAYCASTING) ----
    for (let col = 0; col < renderW; col++) {
      const cameraX = 2 * col / renderW - 1;
      const rayDirX = dirX + planeX * cameraX;
      const rayDirY = dirY + planeY * cameraX;

      const hit = castRay(p.x, p.y, rayDirX, rayDirY);
      zBuffer[col] = hit.distance;

      if (hit.wallType === 0) continue;

      const lineHeight = viewH / hit.distance;
      let drawStart = Math.floor(-lineHeight / 2 + viewH / 2);
      let drawEnd = Math.floor(lineHeight / 2 + viewH / 2);
      if (drawStart < 0) drawStart = 0;
      if (drawEnd >= viewH) drawEnd = viewH - 1;

      const colors = WALL_COLORS[hit.wallType] || WALL_COLORS[1];
      const baseColor = hit.side === 1 ? colors.dark : colors.light;
      const [cr, cg, cb] = hexToRgb(baseColor);

      // Distance shading
      const shade = Math.max(0.1, Math.min(1.0, 1.0 / (1.0 + hit.distance * hit.distance * 0.03)));

      // Fake texture: darken edges of wall face
      const edgeFade = 1 - Math.pow(Math.abs(hit.wallX - 0.5) * 2, 4) * 0.3;
      let finalShade = shade * edgeFade;

      // Wall marks (bullet holes)
      let markDarken = 0;
      for (const mark of wallMarksRef.current) {
        if (mark.mapX === hit.mapX && mark.mapY === hit.mapY && mark.side === hit.side) {
          const markDist = Math.abs(hit.wallX - mark.wallX);
          if (markDist < 0.04) {
            const markAlpha = (mark.life / 3.0) * (1 - markDist / 0.04);
            markDarken = Math.max(markDarken, markAlpha * 0.7);
          }
        }
      }

      // Muzzle flash wall lighting
      let flashBoost = 0;
      if (p.muzzleFlash > 0 && hit.distance < 4) {
        const flashIntensity = p.muzzleFlash * 10 * (1 - hit.distance / 4);
        const centerFade = Math.max(0, 1 - Math.abs(col - renderW / 2) / (renderW * 0.4));
        flashBoost = Math.max(0, flashIntensity * centerFade);
      }

      let fr = Math.floor(cr * finalShade * (1 - markDarken));
      let fg = Math.floor(cg * finalShade * (1 - markDarken));
      let fb = Math.floor(cb * finalShade * (1 - markDarken));

      if (flashBoost > 0) {
        fr = Math.min(255, fr + Math.floor(flashBoost * 40));
        fg = Math.min(255, fg + Math.floor(flashBoost * 32));
        fb = Math.min(255, fb + Math.floor(flashBoost * 12));
      }

      for (let y = drawStart; y <= drawEnd; y++) {
        const idx = (y * renderW + col) * 4;
        data[idx] = fr;
        data[idx + 1] = fg;
        data[idx + 2] = fb;
        data[idx + 3] = 255;
      }
    }

    // ---- SPRITES ----
    type SpriteEntry = {
      x: number; y: number;
      type: string;
      dist: number;
      isEnemy: boolean;
      isItem: boolean;
      isProjectile: boolean;
      isParticle: boolean;
      enemyState?: EnemyState;
      enemyDeathTimer?: number;
      enemyMuzzleFlash?: number;
      itemType?: ItemType;
      particleData?: Particle;
    };

    const spriteList: SpriteEntry[] = [];

    for (const enemy of enemiesRef.current) {
      const dx = enemy.x - p.x;
      const dy = enemy.y - p.y;
      const dist = dx * dx + dy * dy;
      spriteList.push({
        x: enemy.x, y: enemy.y,
        type: enemy.type,
        dist,
        isEnemy: true, isItem: false, isProjectile: false, isParticle: false,
        enemyState: enemy.state,
        enemyDeathTimer: enemy.deathTimer,
        enemyMuzzleFlash: enemy.muzzleFlash,
      });
    }

    for (const item of itemsRef.current) {
      if (item.collected) continue;
      const dx = item.x - p.x;
      const dy = item.y - p.y;
      const dist = dx * dx + dy * dy;
      spriteList.push({
        x: item.x, y: item.y,
        type: item.type,
        dist,
        isEnemy: false, isItem: true, isProjectile: false, isParticle: false,
        itemType: item.type,
      });
    }

    // Projectiles as sprites
    for (const proj of projectilesRef.current) {
      const dx = proj.x - p.x;
      const dy = proj.y - p.y;
      const dist = dx * dx + dy * dy;
      spriteList.push({
        x: proj.x, y: proj.y,
        type: 'projectile',
        dist,
        isEnemy: false, isItem: false, isProjectile: true, isParticle: false,
      });
    }

    // Particles as sprites
    for (const part of particlesRef.current) {
      const dx = part.x - p.x;
      const dy = part.y - p.y;
      const dist = dx * dx + dy * dy;
      spriteList.push({
        x: part.x, y: part.y,
        type: 'particle',
        dist,
        isEnemy: false, isItem: false, isProjectile: false, isParticle: true,
        particleData: part,
      });
    }

    // Sort back to front
    spriteList.sort((a, b) => b.dist - a.dist);

    for (const sprite of spriteList) {
      const sx = sprite.x - p.x;
      const sy = sprite.y - p.y;

      // Transform to camera space
      const invDet = 1.0 / (planeX * dirY - dirX * planeY);
      const transformX = invDet * (dirY * sx - dirX * sy);
      const transformY = invDet * (-planeY * sx + planeX * sy);

      if (transformY <= 0.1) continue;

      const spriteScreenX = Math.floor((renderW / 2) * (1 + transformX / transformY));
      const spriteH = Math.abs(Math.floor(viewH / transformY));
      const spriteW = spriteH;

      const drawStartY = Math.max(0, Math.floor(-spriteH / 2 + viewH / 2));
      const drawEndY = Math.min(viewH - 1, Math.floor(spriteH / 2 + viewH / 2));
      const drawStartX = Math.max(0, Math.floor(spriteScreenX - spriteW / 2));
      const drawEndX = Math.min(renderW - 1, Math.floor(spriteScreenX + spriteW / 2));

      const spriteDist = Math.sqrt(sprite.dist);
      const shade = Math.max(0.15, Math.min(1.0, 1.0 / (1.0 + spriteDist * spriteDist * 0.02)));

      if (sprite.isEnemy) {
        const spriteImageData = spriteImageDataRef.current[sprite.type];
        if (!spriteImageData) continue;

        const texW = spriteImageData.width;
        const texH = spriteImageData.height;
        const spritePixels = spriteImageData.data;

        // Death animation: collapse + dissolve
        const isDead = sprite.enemyState === 'dead';
        const deathTimer = sprite.enemyDeathTimer || 0;
        const deathProgress = isDead ? Math.max(0, 1 - deathTimer) : 0;

        // Collapse: reduce visible height, keep base grounded
        const collapseRatio = isDead ? Math.max(0.15, 1 - deathProgress * 0.85) : 1;
        const collapsedH = Math.floor(spriteH * collapseRatio);
        const groundY = Math.floor(spriteH / 2 + viewH / 2);
        const collapsedStartY = Math.max(0, groundY - collapsedH);
        const collapsedEndY = Math.min(viewH - 1, groundY);

        // Tint based on state
        let tintR = 1, tintG = 1, tintB = 1;
        if (sprite.enemyState === 'hurt') { tintR = 2; tintG = 0.5; tintB = 0.5; }
        if (isDead) {
          tintR = 1 - deathProgress * 0.7;
          tintG = 1 - deathProgress * 0.7;
          tintB = 1 - deathProgress * 0.7;
        }

        const useStartY = isDead ? collapsedStartY : drawStartY;
        const useEndY = isDead ? collapsedEndY : drawEndY;

        for (let col = drawStartX; col <= drawEndX; col++) {
          if (transformY >= zBuffer[col]) continue;
          const texX = Math.floor(((col - (spriteScreenX - spriteW / 2)) / spriteW) * texW);
          if (texX < 0 || texX >= texW) continue;

          for (let row = useStartY; row <= useEndY; row++) {
            // Dissolve effect for nearly-dead enemies
            if (isDead && deathTimer < 0.3 && ((col + row) % 2 === 0)) continue;

            const texY = isDead
              ? Math.floor(((row - collapsedStartY) / Math.max(1, collapsedEndY - collapsedStartY)) * texH)
              : Math.floor(((row - (Math.floor(-spriteH / 2 + viewH / 2))) / spriteH) * texH);
            if (texY < 0 || texY >= texH) continue;

            const sIdx = (texY * texW + texX) * 4;
            if (spritePixels[sIdx + 3] < 128) continue;

            const idx = (row * renderW + col) * 4;
            data[idx] = Math.min(255, Math.floor(spritePixels[sIdx] * shade * tintR));
            data[idx + 1] = Math.min(255, Math.floor(spritePixels[sIdx + 1] * shade * tintG));
            data[idx + 2] = Math.min(255, Math.floor(spritePixels[sIdx + 2] * shade * tintB));
          }
        }

        // Enemy muzzle flash (soldiers firing)
        if ((sprite.enemyMuzzleFlash || 0) > 0 && sprite.enemyState !== 'dead') {
          const flashR = Math.min(3, Math.floor(spriteH / 8));
          const flashCX = spriteScreenX;
          const flashCY = Math.floor(viewH / 2 - spriteH * 0.1);
          const flashAlpha = (sprite.enemyMuzzleFlash || 0) * 8;
          for (let fy = -flashR; fy <= flashR; fy++) {
            for (let fx = -flashR; fx <= flashR; fx++) {
              if (fx * fx + fy * fy > flashR * flashR) continue;
              const px = flashCX + fx;
              const py = flashCY + fy;
              if (px < 0 || px >= renderW || py < 0 || py >= viewH) continue;
              if (transformY >= zBuffer[px]) continue;
              const idx = (py * renderW + px) * 4;
              data[idx] = Math.min(255, data[idx] + Math.floor(200 * flashAlpha));
              data[idx + 1] = Math.min(255, data[idx + 1] + Math.floor(160 * flashAlpha));
              data[idx + 2] = Math.min(255, data[idx + 2] + Math.floor(50 * flashAlpha));
            }
          }
        }
      } else if (sprite.isItem) {
        const centerX = spriteScreenX;
        const centerY = Math.floor(viewH / 2 + spriteH * 0.15);
        const radius = Math.max(2, Math.floor(spriteH / 6));

        const isHealth = sprite.itemType === 'health';
        const isShotgunPickup = sprite.itemType === 'shotgun';
        const cr2 = isShotgunPickup ? 180 : (isHealth ? 220 : 220);
        const cg2 = isShotgunPickup ? 120 : (isHealth ? 40 : 200);
        const cb2 = isShotgunPickup ? 40 : (isHealth ? 40 : 40);

        for (let iy = -radius; iy <= radius; iy++) {
          for (let ix = -radius; ix <= radius; ix++) {
            if (ix * ix + iy * iy > radius * radius) continue;
            const px = centerX + ix;
            const py = centerY + iy;
            if (px < 0 || px >= renderW || py < 0 || py >= viewH) continue;
            if (transformY >= zBuffer[px]) continue;
            const idx = (py * renderW + px) * 4;
            data[idx] = Math.floor(cr2 * shade);
            data[idx + 1] = Math.floor(cg2 * shade);
            data[idx + 2] = Math.floor(cb2 * shade);
            data[idx + 3] = 255;
          }
        }

        // Draw cross for health / box for ammo / S for shotgun
        if (isHealth && radius > 3) {
          const crossSize = Math.max(1, Math.floor(radius * 0.5));
          for (let i = -crossSize; i <= crossSize; i++) {
            const px1 = centerX + i;
            if (px1 >= 0 && px1 < renderW && centerY >= 0 && centerY < viewH && transformY < zBuffer[px1]) {
              const idx = (centerY * renderW + px1) * 4;
              data[idx] = 255; data[idx + 1] = 255; data[idx + 2] = 255;
            }
            const py2 = centerY + i;
            if (centerX >= 0 && centerX < renderW && py2 >= 0 && py2 < viewH && transformY < zBuffer[centerX]) {
              const idx = (py2 * renderW + centerX) * 4;
              data[idx] = 255; data[idx + 1] = 255; data[idx + 2] = 255;
            }
          }
        } else if (isShotgunPickup && radius > 3) {
          // Draw a small "S" shape as two horizontal lines
          const s = Math.max(1, Math.floor(radius * 0.4));
          for (let i = -s; i <= s; i++) {
            const px = centerX + i;
            if (px >= 0 && px < renderW && transformY < zBuffer[px]) {
              // Top bar
              const py1 = centerY - s;
              if (py1 >= 0 && py1 < viewH) {
                const idx = (py1 * renderW + px) * 4;
                data[idx] = 255; data[idx + 1] = 255; data[idx + 2] = 255;
              }
              // Bottom bar
              const py2 = centerY + s;
              if (py2 >= 0 && py2 < viewH) {
                const idx = (py2 * renderW + px) * 4;
                data[idx] = 255; data[idx + 1] = 255; data[idx + 2] = 255;
              }
              // Middle bar
              if (centerY >= 0 && centerY < viewH) {
                const idx = (centerY * renderW + px) * 4;
                data[idx] = 255; data[idx + 1] = 255; data[idx + 2] = 255;
              }
            }
          }
        }
      } else if (sprite.isProjectile) {
        // Render projectile as bright yellow-orange dot
        const projRadius = Math.max(1, Math.floor(spriteH / 12));
        const projCX = spriteScreenX;
        const projCY = Math.floor(viewH / 2);
        for (let iy = -projRadius; iy <= projRadius; iy++) {
          for (let ix = -projRadius; ix <= projRadius; ix++) {
            if (ix * ix + iy * iy > projRadius * projRadius) continue;
            const px = projCX + ix;
            const py = projCY + iy;
            if (px < 0 || px >= renderW || py < 0 || py >= viewH) continue;
            if (transformY >= zBuffer[px]) continue;
            const idx = (py * renderW + px) * 4;
            data[idx] = 255;
            data[idx + 1] = 200;
            data[idx + 2] = 50;
            data[idx + 3] = 255;
          }
        }
      } else if (sprite.isParticle && sprite.particleData) {
        const part = sprite.particleData;
        const alpha = Math.max(0, part.life / part.maxLife);
        const partSize = Math.max(1, Math.floor(spriteH / 16));
        const partCX = spriteScreenX;
        const partCY = Math.floor(viewH / 2);
        for (let iy = 0; iy < partSize; iy++) {
          for (let ix = 0; ix < partSize; ix++) {
            const px = partCX + ix;
            const py = partCY + iy;
            if (px < 0 || px >= renderW || py < 0 || py >= viewH) continue;
            if (transformY >= zBuffer[px]) continue;
            const idx = (py * renderW + px) * 4;
            data[idx] = Math.floor(part.r * shade * alpha);
            data[idx + 1] = Math.floor(part.g * shade * alpha);
            data[idx + 2] = Math.floor(part.b * shade * alpha);
            data[idx + 3] = 255;
          }
        }
      }
    }

    // ---- Use cached offscreen canvas (Phase 0 perf fix) ----
    const offscreen = offscreenRef.current;
    if (offscreenSizeRef.current.w !== renderW || offscreenSizeRef.current.h !== renderH) {
      offscreen.width = renderW;
      offscreen.height = renderH;
      offscreenSizeRef.current = { w: renderW, h: renderH };
    }
    const offCtx = offscreen.getContext('2d')!;
    offCtx.putImageData(buffer, 0, 0);

    // ---- DRAW WEAPON ----
    const weaponBobX = p.isMoving ? Math.sin(p.bobPhase) * 4 : 0;
    const weaponBobY = p.isMoving ? Math.abs(Math.cos(p.bobPhase)) * 3 : 0;

    // Weapon switch animation offset
    let switchOffset = 0;
    if (p.weaponSwitchTimer > 0) {
      const t = p.weaponSwitchTimer / 0.4;
      switchOffset = Math.sin(t * Math.PI) * 50;
    }

    const weapX = Math.floor(renderW / 2 - 15 + weaponBobX);
    const weapY = Math.floor(viewH - 40 + weaponBobY + switchOffset + p.recoilOffset);

    if (p.weapon === 'pistol') {
      // Detailed pistol
      // Barrel body
      offCtx.fillStyle = '#555';
      offCtx.fillRect(weapX + 8, weapY - 2, 14, 8);
      // Barrel bore
      offCtx.fillStyle = '#222';
      offCtx.fillRect(weapX + 13, weapY, 4, 4);
      // Top slide
      offCtx.fillStyle = '#666';
      offCtx.fillRect(weapX + 6, weapY - 4, 18, 6);
      // Slide highlight
      offCtx.fillStyle = '#777';
      offCtx.fillRect(weapX + 7, weapY - 3, 16, 1);
      // Slide serrations
      offCtx.fillStyle = '#555';
      offCtx.fillRect(weapX + 8, weapY - 4, 1, 4);
      offCtx.fillRect(weapX + 11, weapY - 4, 1, 4);
      offCtx.fillRect(weapX + 14, weapY - 4, 1, 4);
      // Front sight
      offCtx.fillStyle = '#444';
      offCtx.fillRect(weapX + 20, weapY - 6, 2, 3);
      // Rear sight
      offCtx.fillRect(weapX + 8, weapY - 6, 2, 3);
      // Grip
      offCtx.fillStyle = '#444';
      offCtx.fillRect(weapX + 5, weapY + 6, 20, 24);
      // Trigger guard
      offCtx.fillStyle = '#3a3a3a';
      offCtx.fillRect(weapX + 10, weapY + 10, 8, 6);
      // Trigger
      offCtx.fillStyle = '#333';
      offCtx.fillRect(weapX + 13, weapY + 10, 3, 5);
      // Grip texture
      offCtx.fillStyle = '#3a3a3a';
      for (let i = 0; i < 4; i++) {
        offCtx.fillRect(weapX + 7, weapY + 14 + i * 4, 16, 1);
      }
    } else {
      // Shotgun
      // Double barrel
      offCtx.fillStyle = '#555';
      offCtx.fillRect(weapX + 2, weapY - 4, 26, 5);
      offCtx.fillRect(weapX + 2, weapY + 1, 26, 5);
      // Barrel holes
      offCtx.fillStyle = '#222';
      offCtx.fillRect(weapX + 12, weapY - 3, 4, 3);
      offCtx.fillRect(weapX + 12, weapY + 2, 4, 3);
      // Barrel highlight
      offCtx.fillStyle = '#666';
      offCtx.fillRect(weapX + 3, weapY - 4, 24, 1);
      // Receiver
      offCtx.fillStyle = '#666';
      offCtx.fillRect(weapX, weapY + 6, 30, 8);
      offCtx.fillStyle = '#777';
      offCtx.fillRect(weapX + 1, weapY + 7, 28, 1);
      // Pump grip (wood)
      offCtx.fillStyle = '#8B6914';
      offCtx.fillRect(weapX + 4, weapY + 14, 22, 10);
      // Wood grain
      offCtx.fillStyle = '#7a5a10';
      for (let i = 0; i < 3; i++) {
        offCtx.fillRect(weapX + 5, weapY + 16 + i * 3, 20, 1);
      }
      // Stock
      offCtx.fillStyle = '#8B6914';
      offCtx.fillRect(weapX + 6, weapY + 24, 18, 14);
      offCtx.fillStyle = '#7a5a10';
      offCtx.fillRect(weapX + 7, weapY + 26, 16, 1);
      offCtx.fillRect(weapX + 7, weapY + 30, 16, 1);
    }

    // Muzzle flash
    if (p.muzzleFlash > 0) {
      const alpha = Math.min(1, p.muzzleFlash * 10);

      if (p.weapon === 'shotgun') {
        // Double barrel flash
        offCtx.fillStyle = `rgba(255, 180, 30, ${alpha})`;
        offCtx.beginPath();
        offCtx.arc(weapX + 12, weapY - 10, 10, 0, Math.PI * 2);
        offCtx.fill();
        offCtx.beginPath();
        offCtx.arc(weapX + 18, weapY - 10, 10, 0, Math.PI * 2);
        offCtx.fill();
        // Combined glow
        offCtx.fillStyle = `rgba(255, 255, 200, ${alpha * 0.6})`;
        offCtx.beginPath();
        offCtx.arc(weapX + 15, weapY - 10, 20, 0, Math.PI * 2);
        offCtx.fill();
      } else {
        // Pistol: radial flash
        const grad = offCtx.createRadialGradient(weapX + 15, weapY - 8, 0, weapX + 15, weapY - 8, 16);
        grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
        grad.addColorStop(0.3, `rgba(255,220,100,${alpha * 0.8})`);
        grad.addColorStop(1, 'rgba(255,150,0,0)');
        offCtx.fillStyle = grad;
        offCtx.beginPath();
        offCtx.arc(weapX + 15, weapY - 8, 16, 0, Math.PI * 2);
        offCtx.fill();
      }
    }

    // ---- HUD ----
    const hudY = viewH;

    // HUD separator line
    offCtx.fillStyle = '#cc0000';
    offCtx.fillRect(0, hudY, renderW, 2);

    // Health
    offCtx.fillStyle = '#cc0000';
    offCtx.font = `bold ${Math.floor(hudH * 0.55)}px monospace`;
    offCtx.textBaseline = 'middle';
    offCtx.fillText(`HP ${p.health}`, 8, hudY + hudH / 2 + 1);

    // Ammo
    offCtx.fillStyle = '#ddcc22';
    offCtx.textAlign = 'right';
    offCtx.fillText(`AMM ${p.ammo}`, renderW - 8, hudY + hudH / 2 + 1);
    offCtx.textAlign = 'left';

    // Face indicator (center)
    const faceX = Math.floor(renderW / 2);
    const faceY = Math.floor(hudY + hudH / 2);
    const faceSize = Math.floor(hudH * 0.35);

    offCtx.fillStyle = '#dda860';
    offCtx.beginPath();
    offCtx.arc(faceX, faceY, faceSize, 0, Math.PI * 2);
    offCtx.fill();

    // Eyes
    offCtx.fillStyle = '#fff';
    const eyeOff = Math.floor(faceSize * 0.3);
    const eyeR = Math.max(1, Math.floor(faceSize * 0.15));
    offCtx.beginPath();
    offCtx.arc(faceX - eyeOff, faceY - Math.floor(faceSize * 0.15), eyeR, 0, Math.PI * 2);
    offCtx.fill();
    offCtx.beginPath();
    offCtx.arc(faceX + eyeOff, faceY - Math.floor(faceSize * 0.15), eyeR, 0, Math.PI * 2);
    offCtx.fill();

    // Pupils
    offCtx.fillStyle = '#000';
    const pupilR = Math.max(1, Math.floor(eyeR * 0.5));
    offCtx.beginPath();
    offCtx.arc(faceX - eyeOff, faceY - Math.floor(faceSize * 0.15), pupilR, 0, Math.PI * 2);
    offCtx.fill();
    offCtx.beginPath();
    offCtx.arc(faceX + eyeOff, faceY - Math.floor(faceSize * 0.15), pupilR, 0, Math.PI * 2);
    offCtx.fill();

    // Mouth based on health
    offCtx.strokeStyle = p.health > 60 ? '#800' : p.health > 30 ? '#a00' : '#f00';
    offCtx.lineWidth = Math.max(1, Math.floor(faceSize * 0.1));
    offCtx.beginPath();
    if (p.health > 60) {
      offCtx.arc(faceX, faceY + Math.floor(faceSize * 0.1), Math.floor(faceSize * 0.3), 0.2, Math.PI - 0.2);
    } else if (p.health > 30) {
      offCtx.moveTo(faceX - Math.floor(faceSize * 0.3), faceY + Math.floor(faceSize * 0.3));
      offCtx.lineTo(faceX + Math.floor(faceSize * 0.3), faceY + Math.floor(faceSize * 0.3));
    } else {
      offCtx.arc(faceX, faceY + Math.floor(faceSize * 0.6), Math.floor(faceSize * 0.3), Math.PI + 0.2, -0.2);
    }
    offCtx.stroke();

    // Level indicator
    offCtx.fillStyle = '#888';
    offCtx.font = `${Math.floor(hudH * 0.28)}px monospace`;
    offCtx.fillText(`LV${currentLevelRef.current + 1}`, Math.floor(renderW / 2 - faceSize - 30), hudY + hudH / 2 + 1);

    // Kill count
    offCtx.textAlign = 'right';
    offCtx.fillText(`${killCountRef.current}/${totalKillsRef.current}`, Math.floor(renderW / 2 + faceSize + 30), hudY + hudH / 2 + 1);
    offCtx.textAlign = 'left';

    // Weapon indicator
    offCtx.fillStyle = '#aaa';
    offCtx.font = `${Math.floor(hudH * 0.22)}px monospace`;
    offCtx.fillText(p.weapon === 'shotgun' ? '[2]SG' : '[1]PT', 8, hudY + hudH - 4);

    // ---- MINIMAP ----
    const map = mapRef.current;
    const mmSize = Math.min(Math.floor(renderW * 0.25), map.width * MINIMAP_SCALE);
    const mmX = renderW - mmSize - 4;
    const mmY = 4;
    const mmCellW = mmSize / map.width;
    const mmCellH = mmSize / map.height;

    offCtx.fillStyle = 'rgba(0,0,0,0.6)';
    offCtx.fillRect(mmX, mmY, mmSize, mmSize);

    // Walls
    for (let my = 0; my < map.height; my++) {
      for (let mx = 0; mx < map.width; mx++) {
        if (map.grid[my][mx] > 0) {
          const colors2 = WALL_COLORS[map.grid[my][mx]] || WALL_COLORS[1];
          offCtx.fillStyle = colors2.dark;
          offCtx.fillRect(mmX + mx * mmCellW, mmY + my * mmCellH, mmCellW + 0.5, mmCellH + 0.5);
        }
      }
    }

    // Items on minimap
    for (const item of itemsRef.current) {
      if (item.collected) continue;
      offCtx.fillStyle = item.type === 'health' ? '#44cc44' : item.type === 'shotgun' ? '#ff8844' : '#cccc44';
      offCtx.fillRect(mmX + item.x * mmCellW - 1, mmY + item.y * mmCellH - 1, 3, 3);
    }

    // Enemies on minimap
    for (const enemy of enemiesRef.current) {
      if (enemy.state === 'dead') continue;
      offCtx.fillStyle = '#ff3333';
      offCtx.fillRect(mmX + enemy.x * mmCellW - 1, mmY + enemy.y * mmCellH - 1, 3, 3);
    }

    // Exit zone
    offCtx.fillStyle = '#ffff00';
    offCtx.fillRect(mmX + map.exitZone.x * mmCellW, mmY + map.exitZone.y * mmCellH, mmCellW + 0.5, mmCellH + 0.5);

    // Player on minimap
    offCtx.fillStyle = '#00ff00';
    offCtx.beginPath();
    offCtx.arc(mmX + p.x * mmCellW, mmY + p.y * mmCellH, 2, 0, Math.PI * 2);
    offCtx.fill();

    // Player direction line
    offCtx.strokeStyle = '#00ff00';
    offCtx.lineWidth = 1;
    offCtx.beginPath();
    offCtx.moveTo(mmX + p.x * mmCellW, mmY + p.y * mmCellH);
    offCtx.lineTo(
      mmX + (p.x + Math.cos(p.angle) * 2) * mmCellW,
      mmY + (p.y + Math.sin(p.angle) * 2) * mmCellH,
    );
    offCtx.stroke();

    // ---- CROSSHAIR ----
    const chX = Math.floor(renderW / 2);
    const chY = Math.floor(viewH / 2);
    offCtx.strokeStyle = 'rgba(255,255,255,0.6)';
    offCtx.lineWidth = 1;
    offCtx.beginPath();
    offCtx.moveTo(chX - 6, chY); offCtx.lineTo(chX - 2, chY);
    offCtx.moveTo(chX + 2, chY); offCtx.lineTo(chX + 6, chY);
    offCtx.moveTo(chX, chY - 6); offCtx.lineTo(chX, chY - 2);
    offCtx.moveTo(chX, chY + 2); offCtx.lineTo(chX, chY + 6);
    offCtx.stroke();

    // ---- FLOATING TEXTS ----
    for (const msg of floatingTextsRef.current) {
      const alpha = Math.min(1, msg.timer * 2);
      const yOff = Math.floor((1.5 - msg.timer) * 30);
      offCtx.globalAlpha = alpha;
      offCtx.fillStyle = msg.color;
      offCtx.font = `bold ${Math.floor(renderW * 0.04)}px monospace`;
      offCtx.textAlign = 'center';
      offCtx.fillText(msg.text, renderW / 2, Math.floor(viewH * 0.35) - yOff);
    }
    offCtx.globalAlpha = 1;
    offCtx.textAlign = 'left';

    // ---- PICKUP FLASH ----
    if (p.pickupFlash > 0) {
      offCtx.fillStyle = `rgba(0, 255, 80, ${Math.min(0.25, p.pickupFlash * 2)})`;
      offCtx.fillRect(0, 0, renderW, viewH);
    }

    // ---- HURT FLASH ----
    if (p.hurtFlash > 0) {
      offCtx.fillStyle = `rgba(255, 0, 0, ${Math.min(0.4, p.hurtFlash)})`;
      offCtx.fillRect(0, 0, renderW, viewH);
    }

    // ---- BLIT TO MAIN CANVAS (with screen shake) ----
    ctx.imageSmoothingEnabled = false;
    const sx = Math.round(p.shakeX * (W / renderW));
    const sy = Math.round(p.shakeY * (renderH > 0 ? H / renderH : 1));
    ctx.fillStyle = '#000';
    if (sx !== 0 || sy !== 0) ctx.fillRect(0, 0, W, H);
    ctx.drawImage(offscreen, sx, sy, W, H);
  }, [castRay]);

  // ============================================================
  // GAME LOOP
  // ============================================================

  const gameLoop = useCallback((timestamp: number) => {
    const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
    lastTimeRef.current = timestamp;

    if (screenRef.current === 'playing') {
      gameTimeRef.current += dt;
      updatePlayer(dt);
      updateEnemies(dt);
      updateParticles(dt);
      updateProjectiles(dt);
      updateFloatingTexts(dt);
      updateWallMarks(dt);
      checkItems();
      checkExit();

      if (playerRef.current.health <= 0) {
        screenRef.current = 'gameover';
        setGameScreen('gameover');
        soundRef.current.stopAmbient();
        try { document.exitPointerLock(); } catch {}
      }
    }

    render();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [updatePlayer, updateEnemies, updateParticles, updateProjectiles, updateFloatingTexts, updateWallMarks, checkItems, checkExit, render]);

  // ============================================================
  // GAME ACTIONS
  // ============================================================

  const startNewGame = useCallback(() => {
    initSprites();
    const p = playerRef.current;
    p.health = 100;
    p.ammo = 50;
    p.weapon = 'pistol';
    p.hasShotgun = false;
    p.weaponSwitchTimer = 0;
    setDisplayHealth(100);
    setDisplayAmmo(50);
    setDisplayWeapon('pistol');
    loadLevel(0);
    screenRef.current = 'playing';
    setGameScreen('playing');
    lastTimeRef.current = performance.now();
    gameTimeRef.current = 0;
    containerRef.current?.focus();
    soundRef.current.startAmbient();
  }, [initSprites, loadLevel]);

  const resumeGame = useCallback(() => {
    screenRef.current = 'playing';
    setGameScreen('playing');
    containerRef.current?.focus();
    soundRef.current.startAmbient();
  }, []);

  const returnToTitle = useCallback(() => {
    screenRef.current = 'title';
    setGameScreen('title');
    keysRef.current = {
      forward: false, backward: false,
      strafeLeft: false, strafeRight: false,
      turnLeft: false, turnRight: false,
      shoot: false, use: false,
    };
    soundRef.current.stopAmbient();
    try { document.exitPointerLock(); } catch {}
  }, []);

  const nextLevel = useCallback(() => {
    const next = currentLevelRef.current + 1;
    if (next >= MAPS.length) {
      returnToTitle();
      return;
    }
    loadLevel(next);
    screenRef.current = 'playing';
    setGameScreen('playing');
    containerRef.current?.focus();
    soundRef.current.startAmbient();
  }, [loadLevel, returnToTitle]);

  const togglePause = useCallback(() => {
    if (screenRef.current === 'playing') {
      screenRef.current = 'paused';
      setGameScreen('paused');
      soundRef.current.stopAmbient();
      try { document.exitPointerLock(); } catch {}
    } else if (screenRef.current === 'paused') {
      resumeGame();
    }
  }, [resumeGame]);

  // ============================================================
  // INPUT HANDLERS
  // ============================================================

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (screenRef.current === 'title' || screenRef.current === 'gameover' || screenRef.current === 'levelcomplete') return;

    const keys = keysRef.current;
    const p = playerRef.current;
    switch (e.code) {
      case 'KeyW': case 'ArrowUp': e.preventDefault(); keys.forward = true; break;
      case 'KeyS': case 'ArrowDown': e.preventDefault(); keys.backward = true; break;
      case 'KeyA': e.preventDefault(); keys.strafeLeft = true; break;
      case 'KeyD': e.preventDefault(); keys.strafeRight = true; break;
      case 'ArrowLeft': e.preventDefault(); keys.turnLeft = true; break;
      case 'ArrowRight': e.preventDefault(); keys.turnRight = true; break;
      case 'Space': e.preventDefault(); keys.shoot = true; break;
      case 'KeyE': e.preventDefault(); keys.use = true; break;
      case 'Escape': e.preventDefault(); togglePause(); break;
      case 'Digit1':
        e.preventDefault();
        if (p.weapon !== 'pistol' && p.weaponSwitchTimer <= 0 && p.shootCooldown <= 0) {
          p.pendingWeapon = 'pistol';
          p.weaponSwitchTimer = 0.4;
        }
        break;
      case 'Digit2':
        e.preventDefault();
        if (p.hasShotgun && p.weapon !== 'shotgun' && p.weaponSwitchTimer <= 0 && p.shootCooldown <= 0) {
          p.pendingWeapon = 'shotgun';
          p.weaponSwitchTimer = 0.4;
        }
        break;
    }
  }, [togglePause]);

  const handleKeyUp = useCallback((e: React.KeyboardEvent) => {
    const keys = keysRef.current;
    switch (e.code) {
      case 'KeyW': case 'ArrowUp': keys.forward = false; break;
      case 'KeyS': case 'ArrowDown': keys.backward = false; break;
      case 'KeyA': keys.strafeLeft = false; break;
      case 'KeyD': keys.strafeRight = false; break;
      case 'ArrowLeft': keys.turnLeft = false; break;
      case 'ArrowRight': keys.turnRight = false; break;
      case 'Space': keys.shoot = false; break;
      case 'KeyE': keys.use = false; break;
    }
  }, []);

  const handleCanvasClick = useCallback(() => {
    if (screenRef.current === 'playing') {
      const canvas = canvasRef.current;
      if (canvas && document.pointerLockElement !== canvas) {
        canvas.requestPointerLock();
      } else {
        playerShoot();
      }
    }
  }, [playerShoot]);

  // ============================================================
  // EFFECTS
  // ============================================================

  // ResizeObserver
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setCanvasSize({ width: Math.floor(width), height: Math.floor(height) });
        }
      }
    });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  // Update canvas dimensions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
  }, [canvasSize]);

  // Mouse move for pointer lock
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === canvasRef.current && screenRef.current === 'playing') {
        playerRef.current.angle += e.movementX * MOUSE_SENSITIVITY;
      }
    };
    document.addEventListener('mousemove', onMouseMove);
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Mouse click for shooting during pointer lock
  useEffect(() => {
    const onMouseDown = () => {
      if (document.pointerLockElement === canvasRef.current && screenRef.current === 'playing') {
        playerShoot();
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [playerShoot]);

  // Game loop
  useEffect(() => {
    initSprites();
    lastTimeRef.current = performance.now();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [gameLoop, initSprites]);

  // Auto-focus
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Release keys when pointer lock is lost
  useEffect(() => {
    const onLockChange = () => {
      if (!document.pointerLockElement) {
        keysRef.current.shoot = false;
      }
    };
    document.addEventListener('pointerlockchange', onLockChange);
    return () => document.removeEventListener('pointerlockchange', onLockChange);
  }, []);

  // Cleanup sound engine
  useEffect(() => {
    const sound = soundRef.current;
    return () => sound.cleanup();
  }, []);

  // Submit score to leaderboard on death or level complete.
  // computeDoomScore normalizes level + kills + completion into a single
  // comparable metric (see src/utils/doomScore.ts).
  useEffect(() => {
    if (gameScreen !== 'gameover' && gameScreen !== 'levelcomplete') return;
    const level = currentLevelRef.current + 1;
    const kills = killCountRef.current;
    const totalEnemies = totalKillsRef.current;
    const levelCompleted = gameScreen === 'levelcomplete';
    const killPct =
      totalEnemies > 0 ? Math.round((kills / totalEnemies) * 1000) / 10 : 0;
    const score = computeDoomScore({ level, kills, totalEnemies, levelCompleted });
    void submitScore(score, {
      level,
      kills,
      totalEnemies,
      killPct,
      levelCompleted,
    });
  }, [gameScreen, submitScore]);

  // ============================================================
  // RENDER JSX
  // ============================================================

  return (
    <div
      ref={containerRef}
      className={styles.container}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      style={{ outline: 'none' }}
    >
      <div ref={wrapperRef} className={styles.canvasWrapper}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onClick={handleCanvasClick}
          style={{ width: '100%', height: '100%' }}
        />

        {gameScreen === 'title' && (
          <div className={styles.overlay}>
            <div className={styles.doomTitle}>DOOM</div>
            <div className={styles.subtitle}>A Raycasting FPS</div>
            <button className={styles.menuButton} onClick={startNewGame}>NEW GAME</button>
            <div className={styles.controls}>
              WASD / Arrows - Move | Mouse - Look<br />
              Click / Space - Shoot | ESC - Pause<br />
              1 / 2 - Switch Weapons
            </div>
          </div>
        )}

        {gameScreen === 'paused' && (
          <div className={styles.overlay}>
            <div className={styles.pauseTitle}>PAUSED</div>
            <button className={styles.menuButton} onClick={resumeGame}>RESUME</button>
            <button className={styles.menuButton} onClick={returnToTitle}>QUIT</button>
          </div>
        )}

        {gameScreen === 'gameover' && (
          <div className={styles.overlay}>
            <div className={styles.gameOverTitle}>YOU DIED</div>
            <div className={styles.stats}>
              Level {displayLevel} | Kills: {displayKills}/{displayTotalEnemies}
            </div>
            <LeaderboardPanel gameId="doom" />
            <button className={styles.menuButton} onClick={startNewGame}>TRY AGAIN</button>
            <button className={styles.menuButton} onClick={returnToTitle}>QUIT</button>
          </div>
        )}

        {gameScreen === 'levelcomplete' && (
          <div className={styles.overlay}>
            <div className={styles.levelCompleteTitle}>LEVEL {displayLevel} COMPLETE</div>
            <div className={styles.stats}>
              Kills: {displayKills}/{displayTotalEnemies} |
              Health: {displayHealth} |
              Ammo: {displayAmmo}
            </div>
            <LeaderboardPanel gameId="doom" />
            {currentLevelRef.current < MAPS.length - 1 ? (
              <button className={styles.menuButton} onClick={nextLevel}>NEXT LEVEL</button>
            ) : (
              <>
                <div className={styles.stats}>YOU WIN!</div>
                <button className={styles.menuButton} onClick={returnToTitle}>MAIN MENU</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
