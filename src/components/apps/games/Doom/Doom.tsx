import { useRef, useEffect, useCallback, useState } from 'react';
import { AppProps } from '../../../types/app';
import styles from './Doom.module.css';

// ============================================================
// TYPES
// ============================================================

type GameScreen = 'title' | 'playing' | 'paused' | 'gameover' | 'levelcomplete';

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
};

type ItemType = 'health' | 'ammo';

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
const SHOOT_COOLDOWN = 0.3;
const WEAPON_DAMAGE = 15;
const PICKUP_RANGE = 0.6;

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

// Colors: R=red, O=orange, G=green, B=brown, D=dark, K=black, W=white, Y=yellow
// _=transparent, L=lime, P=pink, S=silver, C=crimson
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Game state refs
  const playerRef = useRef<Player>({
    x: 2.5, y: 2.5, angle: 0,
    health: 100, ammo: 50,
    bobPhase: 0, isMoving: false,
    shootCooldown: 0, hurtFlash: 0, muzzleFlash: 0,
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
  const killCountRef = useRef(0);
  const totalKillsRef = useRef(0);

  // UI state
  const [gameScreen, setGameScreen] = useState<GameScreen>('title');
  const [displayHealth, setDisplayHealth] = useState(100);
  const [displayAmmo, setDisplayAmmo] = useState(50);
  const [displayKills, setDisplayKills] = useState(0);
  const [displayTotalEnemies, setDisplayTotalEnemies] = useState(0);
  const [displayLevel, setDisplayLevel] = useState(1);
  const [canvasSize, setCanvasSize] = useState({ width: 640, height: 480 });

  // ============================================================
  // INIT SPRITES
  // ============================================================

  const initSprites = useCallback(() => {
    const canvases: Record<string, HTMLCanvasElement> = {};
    for (const [name, data] of Object.entries(SPRITES)) {
      canvases[name] = createSpriteCanvas(data, 2);
    }
    spriteCanvasesRef.current = canvases;
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
      };
    });

    itemsRef.current = map.items.map(it => ({
      x: it.x, y: it.y, type: it.type, value: it.value,
      collected: false, bobPhase: Math.random() * Math.PI * 2,
    }));

    killCountRef.current = 0;
    totalKillsRef.current = map.enemies.length;
    setDisplayKills(0);
    setDisplayTotalEnemies(map.enemies.length);
    setDisplayLevel(levelIndex + 1);
    setDisplayHealth(p.health);
    setDisplayAmmo(p.ammo);
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
    if (p.ammo <= 0 || p.shootCooldown > 0) return;

    p.ammo--;
    p.shootCooldown = SHOOT_COOLDOWN;
    p.muzzleFlash = 0.1;
    setDisplayAmmo(p.ammo);

    const dirX = Math.cos(p.angle);
    const dirY = Math.sin(p.angle);

    // Sort enemies by distance
    const liveEnemies = enemiesRef.current
      .filter(e => e.state !== 'dead')
      .sort((a, b) => {
        const da = (a.x - p.x) ** 2 + (a.y - p.y) ** 2;
        const db = (b.x - p.x) ** 2 + (b.y - p.y) ** 2;
        return da - db;
      });

    for (const enemy of liveEnemies) {
      const ex = enemy.x - p.x;
      const ey = enemy.y - p.y;
      const dist = Math.sqrt(ex * ex + ey * ey);
      if (dist > 20) continue;

      // Check if enemy is roughly in crosshair direction
      const enemyAngle = Math.atan2(ey, ex);
      let angleDiff = enemyAngle - p.angle;
      while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

      // Hit detection: wider at close range, narrower at distance
      const hitAngle = Math.atan2(0.4, dist);
      if (Math.abs(angleDiff) < hitAngle) {
        // Check LOS
        if (hasLineOfSight(p.x, p.y, enemy.x, enemy.y, mapRef.current.grid, mapRef.current.width, mapRef.current.height)) {
          enemy.health -= WEAPON_DAMAGE;
          if (enemy.health <= 0) {
            enemy.state = 'dead';
            enemy.health = 0;
            killCountRef.current++;
            setDisplayKills(killCountRef.current);
          } else {
            enemy.state = 'hurt';
            enemy.stateTimer = 0.2;
          }
          break; // Only hit first enemy in line
        }
      }
    }
  }, []);

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
    }

    // Shooting
    if (p.shootCooldown > 0) p.shootCooldown -= dt;
    if (keys.shoot && p.shootCooldown <= 0) {
      playerShoot();
    }

    // Timers
    if (p.hurtFlash > 0) p.hurtFlash -= dt;
    if (p.muzzleFlash > 0) p.muzzleFlash -= dt;
  }, [isWalkable, playerShoot]);

  // ============================================================
  // UPDATE ENEMIES
  // ============================================================

  const updateEnemies = useCallback((dt: number) => {
    const p = playerRef.current;
    const map = mapRef.current;

    for (const enemy of enemiesRef.current) {
      if (enemy.state === 'dead') continue;

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
        // Move toward player
        const moveX = Math.cos(enemy.angle) * enemy.speed * dt;
        const moveY = Math.sin(enemy.angle) * enemy.speed * dt;

        const newX = enemy.x + moveX;
        const newY = enemy.y + moveY;

        // Simple collision for enemies
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
          // Attack the player
          if (dist < enemy.attackRange + 0.5) {
            if (enemy.type === 'soldier') {
              // Ranged: LOS check
              if (hasLineOfSight(enemy.x, enemy.y, p.x, p.y, map.grid, map.width, map.height)) {
                const accuracy = Math.max(0.3, 1 - dist * 0.05);
                if (Math.random() < accuracy) {
                  p.health -= enemy.damage;
                  p.hurtFlash = 0.3;
                  setDisplayHealth(Math.max(0, p.health));
                }
              }
            } else {
              // Melee
              p.health -= enemy.damage;
              p.hurtFlash = 0.3;
              setDisplayHealth(Math.max(0, p.health));
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
        } else if (item.type === 'ammo') {
          p.ammo = Math.min(200, p.ammo + item.value);
          item.collected = true;
          setDisplayAmmo(p.ammo);
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
      const finalShade = shade * edgeFade;

      const fr = Math.floor(cr * finalShade);
      const fg = Math.floor(cg * finalShade);
      const fb = Math.floor(cb * finalShade);

      for (let y = drawStart; y <= drawEnd; y++) {
        const idx = (y * renderW + col) * 4;
        data[idx] = fr;
        data[idx + 1] = fg;
        data[idx + 2] = fb;
        data[idx + 3] = 255;
      }
    }

    // Put the buffer to a temporary canvas and scale to main canvas
    const offscreen = document.createElement('canvas');
    offscreen.width = renderW;
    offscreen.height = renderH;
    const offCtx = offscreen.getContext('2d')!;
    offCtx.putImageData(buffer, 0, 0);

    // ---- SPRITES ----
    // Combine enemies and items into sortable sprites
    type SpriteEntry = {
      x: number; y: number;
      type: string;
      dist: number;
      isEnemy: boolean;
      isItem: boolean;
      enemyState?: EnemyState;
      itemType?: ItemType;
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
        isEnemy: true,
        isItem: false,
        enemyState: enemy.state,
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
        isEnemy: false,
        isItem: true,
        itemType: item.type,
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

      if (transformY <= 0.1) continue; // Behind camera

      const spriteScreenX = Math.floor((renderW / 2) * (1 + transformX / transformY));
      const spriteH = Math.abs(Math.floor(viewH / transformY));
      const spriteW = spriteH;

      const drawStartY = Math.max(0, Math.floor(-spriteH / 2 + viewH / 2));
      const drawEndY = Math.min(viewH - 1, Math.floor(spriteH / 2 + viewH / 2));
      const drawStartX = Math.max(0, Math.floor(spriteScreenX - spriteW / 2));
      const drawEndX = Math.min(renderW - 1, Math.floor(spriteScreenX + spriteW / 2));

      // Distance shading for sprite
      const spriteDist = Math.sqrt(sprite.dist);
      const shade = Math.max(0.15, Math.min(1.0, 1.0 / (1.0 + spriteDist * spriteDist * 0.02)));

      if (sprite.isEnemy) {
        const spriteCanvas = spriteCanvasesRef.current[sprite.type];
        if (!spriteCanvas) continue;

        const texW = spriteCanvas.width;
        const texH = spriteCanvas.height;

        // Get pixel data from sprite canvas
        const spriteCtx = spriteCanvas.getContext('2d')!;
        const spriteImageData = spriteCtx.getImageData(0, 0, texW, texH);
        const spritePixels = spriteImageData.data;

        // Tint based on state
        let tintR = 1, tintG = 1, tintB = 1;
        if (sprite.enemyState === 'hurt') { tintR = 2; tintG = 0.5; tintB = 0.5; }
        if (sprite.enemyState === 'dead') { tintR = 0.3; tintG = 0.3; tintB = 0.3; }

        for (let col = drawStartX; col <= drawEndX; col++) {
          if (transformY >= zBuffer[col]) continue; // Behind wall
          const texX = Math.floor(((col - (spriteScreenX - spriteW / 2)) / spriteW) * texW);
          if (texX < 0 || texX >= texW) continue;

          for (let row = drawStartY; row <= drawEndY; row++) {
            const texY = Math.floor(((row - (Math.floor(-spriteH / 2 + viewH / 2))) / spriteH) * texH);
            if (texY < 0 || texY >= texH) continue;

            const sIdx = (texY * texW + texX) * 4;
            if (spritePixels[sIdx + 3] < 128) continue; // Transparent

            const idx = (row * renderW + col) * 4;
            data[idx] = Math.min(255, Math.floor(spritePixels[sIdx] * shade * tintR));
            data[idx + 1] = Math.min(255, Math.floor(spritePixels[sIdx + 1] * shade * tintG));
            data[idx + 2] = Math.min(255, Math.floor(spritePixels[sIdx + 2] * shade * tintB));
          }
        }
      } else if (sprite.isItem) {
        // Draw items as simple colored circles
        const centerX = spriteScreenX;
        const centerY = Math.floor(viewH / 2 + spriteH * 0.15); // Sit on ground
        const radius = Math.max(2, Math.floor(spriteH / 6));

        const isHealth = sprite.itemType === 'health';
        const cr2 = isHealth ? 220 : 220;
        const cg2 = isHealth ? 40 : 200;
        const cb2 = isHealth ? 40 : 40;

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

        // Draw cross for health / box for ammo
        if (isHealth && radius > 3) {
          const crossSize = Math.max(1, Math.floor(radius * 0.5));
          for (let i = -crossSize; i <= crossSize; i++) {
            const px1 = centerX + i;
            const py1 = centerY;
            if (px1 >= 0 && px1 < renderW && py1 >= 0 && py1 < viewH && transformY < zBuffer[px1]) {
              const idx = (py1 * renderW + px1) * 4;
              data[idx] = 255; data[idx + 1] = 255; data[idx + 2] = 255;
            }
            const px2 = centerX;
            const py2 = centerY + i;
            if (px2 >= 0 && px2 < renderW && py2 >= 0 && py2 < viewH && transformY < zBuffer[px2]) {
              const idx = (py2 * renderW + px2) * 4;
              data[idx] = 255; data[idx + 1] = 255; data[idx + 2] = 255;
            }
          }
        }
      }
    }

    // Re-put the buffer (now with sprites drawn into it)
    offCtx.putImageData(buffer, 0, 0);

    // ---- DRAW WEAPON ----
    const weaponBobX = p.isMoving ? Math.sin(p.bobPhase) * 4 : 0;
    const weaponBobY = p.isMoving ? Math.abs(Math.cos(p.bobPhase)) * 3 : 0;
    const weapX = Math.floor(renderW / 2 - 15 + weaponBobX);
    const weapY = Math.floor(viewH - 40 + weaponBobY);

    // Pistol shape
    offCtx.fillStyle = '#555';
    offCtx.fillRect(weapX + 10, weapY, 10, 30); // Barrel
    offCtx.fillStyle = '#444';
    offCtx.fillRect(weapX + 5, weapY + 20, 20, 20); // Grip
    offCtx.fillStyle = '#666';
    offCtx.fillRect(weapX + 8, weapY - 2, 14, 8); // Top slide
    offCtx.fillStyle = '#333';
    offCtx.fillRect(weapX + 12, weapY + 2, 3, 5); // Sight

    // Muzzle flash
    if (p.muzzleFlash > 0) {
      offCtx.fillStyle = `rgba(255, 200, 50, ${p.muzzleFlash * 10})`;
      offCtx.beginPath();
      offCtx.arc(weapX + 15, weapY - 8, 12, 0, Math.PI * 2);
      offCtx.fill();
      offCtx.fillStyle = `rgba(255, 255, 200, ${p.muzzleFlash * 10})`;
      offCtx.beginPath();
      offCtx.arc(weapX + 15, weapY - 8, 6, 0, Math.PI * 2);
      offCtx.fill();
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
      // Slight grin
      offCtx.arc(faceX, faceY + Math.floor(faceSize * 0.1), Math.floor(faceSize * 0.3), 0.2, Math.PI - 0.2);
    } else if (p.health > 30) {
      // Straight line
      offCtx.moveTo(faceX - Math.floor(faceSize * 0.3), faceY + Math.floor(faceSize * 0.3));
      offCtx.lineTo(faceX + Math.floor(faceSize * 0.3), faceY + Math.floor(faceSize * 0.3));
    } else {
      // Frown
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

    // ---- MINIMAP ----
    const map = mapRef.current;
    const mmSize = Math.min(Math.floor(renderW * 0.25), map.width * MINIMAP_SCALE);
    const mmX = renderW - mmSize - 4;
    const mmY = 4;
    const mmCellW = mmSize / map.width;
    const mmCellH = mmSize / map.height;

    // Minimap background
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
      offCtx.fillStyle = item.type === 'health' ? '#44cc44' : '#cccc44';
      offCtx.fillRect(
        mmX + item.x * mmCellW - 1,
        mmY + item.y * mmCellH - 1,
        3, 3,
      );
    }

    // Enemies on minimap
    for (const enemy of enemiesRef.current) {
      if (enemy.state === 'dead') continue;
      offCtx.fillStyle = '#ff3333';
      offCtx.fillRect(
        mmX + enemy.x * mmCellW - 1,
        mmY + enemy.y * mmCellH - 1,
        3, 3,
      );
    }

    // Exit zone
    offCtx.fillStyle = '#ffff00';
    offCtx.fillRect(
      mmX + map.exitZone.x * mmCellW,
      mmY + map.exitZone.y * mmCellH,
      mmCellW + 0.5, mmCellH + 0.5,
    );

    // Player on minimap
    offCtx.fillStyle = '#00ff00';
    offCtx.beginPath();
    offCtx.arc(
      mmX + p.x * mmCellW,
      mmY + p.y * mmCellH,
      2, 0, Math.PI * 2,
    );
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

    // ---- HURT FLASH ----
    if (p.hurtFlash > 0) {
      offCtx.fillStyle = `rgba(255, 0, 0, ${Math.min(0.4, p.hurtFlash)})`;
      offCtx.fillRect(0, 0, renderW, viewH);
    }

    // ---- BLIT TO MAIN CANVAS ----
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(offscreen, 0, 0, W, H);
  }, [castRay]);

  // ============================================================
  // GAME LOOP
  // ============================================================

  const gameLoop = useCallback((timestamp: number) => {
    const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
    lastTimeRef.current = timestamp;

    if (screenRef.current === 'playing') {
      updatePlayer(dt);
      updateEnemies(dt);
      checkItems();
      checkExit();

      if (playerRef.current.health <= 0) {
        screenRef.current = 'gameover';
        setGameScreen('gameover');
        try { document.exitPointerLock(); } catch {}
      }
    }

    render();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [updatePlayer, updateEnemies, checkItems, checkExit, render]);

  // ============================================================
  // GAME ACTIONS
  // ============================================================

  const startNewGame = useCallback(() => {
    initSprites();
    playerRef.current.health = 100;
    playerRef.current.ammo = 50;
    setDisplayHealth(100);
    setDisplayAmmo(50);
    loadLevel(0);
    screenRef.current = 'playing';
    setGameScreen('playing');
    lastTimeRef.current = performance.now();
    containerRef.current?.focus();
  }, [initSprites, loadLevel]);

  const resumeGame = useCallback(() => {
    screenRef.current = 'playing';
    setGameScreen('playing');
    containerRef.current?.focus();
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
    try { document.exitPointerLock(); } catch {}
  }, []);

  const nextLevel = useCallback(() => {
    const next = currentLevelRef.current + 1;
    if (next >= MAPS.length) {
      // Won the game - back to title
      returnToTitle();
      return;
    }
    loadLevel(next);
    screenRef.current = 'playing';
    setGameScreen('playing');
    containerRef.current?.focus();
  }, [loadLevel, returnToTitle]);

  const togglePause = useCallback(() => {
    if (screenRef.current === 'playing') {
      screenRef.current = 'paused';
      setGameScreen('paused');
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
              Click / Space - Shoot | ESC - Pause
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
