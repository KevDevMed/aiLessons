import { useRef, useEffect, useCallback, useState } from 'react';
import { AppProps } from '../../../../types/app';
import styles from './Snake.module.css';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Point = { x: number; y: number };
type GameStatus = 'idle' | 'running' | 'over';

const GRID_SIZE = 20;
const BASE_SPEED = 150;
const MIN_SPEED = 60;

// ============================================================
// SOUND ENGINE (Web Audio API - procedural)
// ============================================================

class SnakeSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  private ensureCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  private getMaster(): GainNode {
    this.ensureCtx();
    return this.masterGain!;
  }

  playEat() {
    try {
      const ctx = this.ensureCtx();
      const now = ctx.currentTime;
      const master = this.getMaster();

      // Quick ascending two-tone "blip"
      const osc1 = ctx.createOscillator();
      const g1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.value = 440;
      g1.gain.setValueAtTime(0.25, now);
      g1.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
      osc1.connect(g1);
      g1.connect(master);
      osc1.start(now);
      osc1.stop(now + 0.08);

      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.value = 660;
      g2.gain.setValueAtTime(0.25, now + 0.06);
      g2.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc2.connect(g2);
      g2.connect(master);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.14);
    } catch {}
  }

  playGameOver() {
    try {
      const ctx = this.ensureCtx();
      const now = ctx.currentTime;
      const master = this.getMaster();

      // Descending sawtooth
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.4);
      g.gain.setValueAtTime(0.2, now);
      g.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.connect(g);
      g.connect(master);
      osc.start(now);
      osc.stop(now + 0.55);

      // Low rumble
      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.value = 55;
      g2.gain.setValueAtTime(0.15, now);
      g2.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc2.connect(g2);
      g2.connect(master);
      osc2.start(now);
      osc2.stop(now + 0.45);
    } catch {}
  }

  cleanup() {
    if (this.ctx) {
      try { this.ctx.close(); } catch {}
      this.ctx = null;
    }
  }
}

export function Snake({ windowId }: AppProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const directionRef = useRef<Direction>('RIGHT');
  const nextDirectionRef = useRef<Direction>('RIGHT');
  const foodRef = useRef<Point>({ x: 15, y: 10 });
  const statusRef = useRef<GameStatus>('idle');
  const intervalRef = useRef<number | null>(null);
  const scoreRef = useRef(0);
  const soundRef = useRef(new SnakeSoundEngine());

  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 });

  const spawnFood = useCallback(() => {
    const snake = snakeRef.current;
    let pos: Point;
    do {
      pos = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(s => s.x === pos.x && s.y === pos.y));
    foodRef.current = pos;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = Math.floor(Math.min(canvas.width / GRID_SIZE, canvas.height / GRID_SIZE));
    const offsetX = Math.floor((canvas.width - cellSize * GRID_SIZE) / 2);
    const offsetY = Math.floor((canvas.height - cellSize * GRID_SIZE) / 2);

    // Clear
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid background
    ctx.fillStyle = '#16213e';
    ctx.fillRect(offsetX, offsetY, cellSize * GRID_SIZE, cellSize * GRID_SIZE);

    // Draw subtle grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(offsetX + i * cellSize, offsetY);
      ctx.lineTo(offsetX + i * cellSize, offsetY + GRID_SIZE * cellSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY + i * cellSize);
      ctx.lineTo(offsetX + GRID_SIZE * cellSize, offsetY + i * cellSize);
      ctx.stroke();
    }

    // Draw food
    const food = foodRef.current;
    ctx.fillStyle = '#e74c3c';
    ctx.shadowColor = '#e74c3c';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(
      offsetX + food.x * cellSize + cellSize / 2,
      offsetY + food.y * cellSize + cellSize / 2,
      cellSize / 2 - 2,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw snake
    const snake = snakeRef.current;
    snake.forEach((segment, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? '#00ff7f' : '#00cc6a';
      ctx.shadowColor = isHead ? '#00ff7f' : 'transparent';
      ctx.shadowBlur = isHead ? 6 : 0;

      const padding = 1;
      ctx.fillRect(
        offsetX + segment.x * cellSize + padding,
        offsetY + segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2,
      );
    });
    ctx.shadowBlur = 0;
  }, []);

  const tick = useCallback(() => {
    if (statusRef.current !== 'running') return;

    directionRef.current = nextDirectionRef.current;
    const snake = snakeRef.current;
    const head = snake[0];
    const dir = directionRef.current;

    const newHead: Point = {
      x: head.x + (dir === 'RIGHT' ? 1 : dir === 'LEFT' ? -1 : 0),
      y: head.y + (dir === 'DOWN' ? 1 : dir === 'UP' ? -1 : 0),
    };

    // Wall collision
    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
      statusRef.current = 'over';
      setGameStatus('over');
      soundRef.current.playGameOver();
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      draw();
      return;
    }

    // Self collision
    if (snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
      statusRef.current = 'over';
      setGameStatus('over');
      soundRef.current.playGameOver();
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      draw();
      return;
    }

    const ate = newHead.x === foodRef.current.x && newHead.y === foodRef.current.y;
    const newSnake = [newHead, ...snake];
    if (!ate) {
      newSnake.pop();
    } else {
      scoreRef.current += 10;
      setScore(scoreRef.current);
      soundRef.current.playEat();
      spawnFood();

      // Restart interval with increased speed
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      const speed = Math.max(MIN_SPEED, BASE_SPEED - scoreRef.current * 0.5);
      intervalRef.current = window.setInterval(tick, speed);
    }

    snakeRef.current = newSnake;
    draw();
  }, [draw, spawnFood]);

  const startGame = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 10 }];
    directionRef.current = 'RIGHT';
    nextDirectionRef.current = 'RIGHT';
    scoreRef.current = 0;
    setScore(0);
    spawnFood();
    statusRef.current = 'running';
    setGameStatus('running');

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(tick, BASE_SPEED);
    draw();
  }, [tick, draw, spawnFood]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        if (statusRef.current === 'idle' || statusRef.current === 'over') {
          startGame();
        }
        return;
      }

      if (statusRef.current !== 'running') return;

      const dir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (dir !== 'DOWN') nextDirectionRef.current = 'UP';
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (dir !== 'UP') nextDirectionRef.current = 'DOWN';
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (dir !== 'RIGHT') nextDirectionRef.current = 'LEFT';
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (dir !== 'LEFT') nextDirectionRef.current = 'RIGHT';
          break;
      }
    },
    [startGame],
  );

  // Observe wrapper size and update canvas dimensions
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

  // Redraw when canvas size changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    draw();
  }, [canvasSize, draw]);

  // Cleanup interval and sound on unmount
  useEffect(() => {
    const sound = soundRef.current;
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      sound.cleanup();
    };
  }, []);

  // Auto-focus on mount
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{ outline: 'none' }}
    >
      <div className={styles.header}>
        <span>Snake</span>
        <span className={styles.score}>Score: {score}</span>
      </div>
      <div ref={wrapperRef} className={styles.canvasWrapper}>
        <canvas ref={canvasRef} className={styles.canvas} />
        {gameStatus === 'idle' && (
          <div className={styles.overlay}>
            <div className={styles.overlayTitle}>Snake</div>
            <div className={styles.overlayHint}>Press Space to start</div>
          </div>
        )}
        {gameStatus === 'over' && (
          <div className={styles.overlay}>
            <div className={styles.overlayTitle}>Game Over</div>
            <div className={styles.overlayScore}>Score: {score}</div>
            <div className={styles.overlayHint}>Press Space to restart</div>
          </div>
        )}
      </div>
    </div>
  );
}
