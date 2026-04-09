import { useRef, useEffect, useCallback, useState } from 'react';
import { AppProps } from '../../../../types/app';
import { useSubmitScore } from '../../../../hooks/useSubmitScore';
import { LeaderboardPanel } from '../shared/LeaderboardPanel';
import styles from './BrickBreaker.module.css';

type GameStatus = 'idle' | 'running' | 'paused' | 'over' | 'won';

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  alive: boolean;
  color: string;
}

interface GameState {
  paddleX: number;
  ballX: number;
  ballY: number;
  ballDX: number;
  ballDY: number;
  ballAttached: boolean;
  bricks: Brick[];
  score: number;
  lives: number;
  level: number;
  status: GameStatus;
}

const COLS = 8;
const ROWS = 5;
const BRICK_PAD = 4;
const BRICK_TOP_OFFSET = 40;
const PADDLE_HEIGHT = 12;
const PADDLE_WIDTH_RATIO = 0.18;
const BALL_RADIUS = 6;
const BASE_BALL_SPEED = 4;
const PADDLE_BOTTOM_MARGIN = 30;

const ROW_COLORS = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db'];

// ============================================================
// SOUND ENGINE (Web Audio API - procedural)
// ============================================================

class BrickSoundEngine {
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

  playPaddleHit() {
    try {
      const ctx = this.ensureCtx();
      const now = ctx.currentTime;
      const master = this.getMaster();

      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(250, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);
      g.gain.setValueAtTime(0.2, now);
      g.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
      osc.connect(g);
      g.connect(master);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  playBrickHit() {
    try {
      const ctx = this.ensureCtx();
      const now = ctx.currentTime;
      const master = this.getMaster();

      // Bright pop
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(500 + Math.random() * 200, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
      g.gain.setValueAtTime(0.15, now);
      g.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.connect(g);
      g.connect(master);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }

  playWallHit() {
    try {
      const ctx = this.ensureCtx();
      const now = ctx.currentTime;
      const master = this.getMaster();

      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = 150;
      g.gain.setValueAtTime(0.08, now);
      g.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
      osc.connect(g);
      g.connect(master);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }

  playLoseLife() {
    try {
      const ctx = this.ensureCtx();
      const now = ctx.currentTime;
      const master = this.getMaster();

      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
      g.gain.setValueAtTime(0.2, now);
      g.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(g);
      g.connect(master);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {}
  }

  playGameOver() {
    try {
      const ctx = this.ensureCtx();
      const now = ctx.currentTime;
      const master = this.getMaster();

      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.5);
      g.gain.setValueAtTime(0.2, now);
      g.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.connect(g);
      g.connect(master);
      osc.start(now);
      osc.stop(now + 0.65);

      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.value = 45;
      g2.gain.setValueAtTime(0.15, now + 0.1);
      g2.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc2.connect(g2);
      g2.connect(master);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.55);
    } catch {}
  }

  playLevelComplete() {
    try {
      const ctx = this.ensureCtx();
      const now = ctx.currentTime;
      const master = this.getMaster();

      const freqs = [330, 440, 550, 660, 880];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;
        const t = now + i * 0.07;
        g.gain.setValueAtTime(0.2, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc.connect(g);
        g.connect(master);
        osc.start(t);
        osc.stop(t + 0.12);
      });
    } catch {}
  }

  cleanup() {
    if (this.ctx) {
      try { this.ctx.close(); } catch {}
      this.ctx = null;
    }
  }
}

function createBricks(canvasW: number): Brick[] {
  const bricks: Brick[] = [];
  const brickW = (canvasW - BRICK_PAD * (COLS + 1)) / COLS;
  const brickH = 18;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      bricks.push({
        x: BRICK_PAD + c * (brickW + BRICK_PAD),
        y: BRICK_TOP_OFFSET + r * (brickH + BRICK_PAD),
        width: brickW,
        height: brickH,
        alive: true,
        color: ROW_COLORS[r % ROW_COLORS.length],
      });
    }
  }
  return bricks;
}

function initState(canvasW: number, canvasH: number, level = 1): GameState {
  const paddleX = canvasW / 2;
  return {
    paddleX,
    ballX: paddleX,
    ballY: canvasH - PADDLE_BOTTOM_MARGIN - PADDLE_HEIGHT - BALL_RADIUS,
    ballDX: 0,
    ballDY: 0,
    ballAttached: true,
    bricks: createBricks(canvasW),
    score: 0,
    lives: 3,
    level,
    status: 'idle',
  };
}

export function BrickBreaker({ windowId: _windowId }: AppProps) {
  const { submitScore } = useSubmitScore('brick-breaker');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<GameState>(initState(480, 560));
  const rafRef = useRef<number>(0);
  const keysRef = useRef<Set<string>>(new Set());
  const soundRef = useRef(new BrickSoundEngine());

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [canvasSize, setCanvasSize] = useState({ width: 480, height: 560 });

  const syncUI = useCallback(() => {
    const g = gameRef.current;
    setScore(g.score);
    setLives(g.lives);
    setLevel(g.level);
    setGameStatus(g.status);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const g = gameRef.current;
    const W = canvas.width;
    const H = canvas.height;
    const paddleW = W * PADDLE_WIDTH_RATIO;

    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, W, H);

    // Play area
    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, 0, W, H);

    // Bricks
    for (const b of g.bricks) {
      if (!b.alive) continue;
      ctx.fillStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.roundRect(b.x, b.y, b.width, b.height, 3);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // Paddle
    const paddleY = H - PADDLE_BOTTOM_MARGIN;
    const px = Math.max(paddleW / 2, Math.min(W - paddleW / 2, g.paddleX));
    ctx.fillStyle = '#ecf0f1';
    ctx.shadowColor = '#ecf0f1';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.roundRect(px - paddleW / 2, paddleY - PADDLE_HEIGHT / 2, paddleW, PADDLE_HEIGHT, 4);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Ball
    ctx.fillStyle = '#f39c12';
    ctx.shadowColor = '#f39c12';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(g.ballX, g.ballY, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }, []);

  const launchBall = useCallback(() => {
    const g = gameRef.current;
    if (!g.ballAttached) return;
    const speed = BASE_BALL_SPEED + (g.level - 1) * 0.5;
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
    g.ballDX = Math.cos(angle) * speed;
    g.ballDY = Math.sin(angle) * speed;
    g.ballAttached = false;
  }, []);

  const resetBall = useCallback(() => {
    const g = gameRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    g.ballAttached = true;
    g.ballX = g.paddleX;
    g.ballY = canvas.height - PADDLE_BOTTOM_MARGIN - PADDLE_HEIGHT - BALL_RADIUS;
    g.ballDX = 0;
    g.ballDY = 0;
  }, []);

  const nextLevel = useCallback(() => {
    const g = gameRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    g.level++;
    g.bricks = createBricks(canvas.width);
    resetBall();
    setLevel(g.level);
  }, [resetBall]);

  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    gameRef.current = initState(canvas.width, canvas.height);
    gameRef.current.status = 'running';
    syncUI();
  }, [syncUI]);

  const tick = useCallback(() => {
    const g = gameRef.current;
    const canvas = canvasRef.current;
    if (!canvas || g.status !== 'running') return;

    const W = canvas.width;
    const H = canvas.height;
    const paddleW = W * PADDLE_WIDTH_RATIO;

    // Keyboard paddle movement
    const keys = keysRef.current;
    const paddleSpeed = 7;
    if (keys.has('ArrowLeft')) g.paddleX -= paddleSpeed;
    if (keys.has('ArrowRight')) g.paddleX += paddleSpeed;
    g.paddleX = Math.max(paddleW / 2, Math.min(W - paddleW / 2, g.paddleX));

    // Ball attached to paddle
    if (g.ballAttached) {
      g.ballX = g.paddleX;
      g.ballY = H - PADDLE_BOTTOM_MARGIN - PADDLE_HEIGHT - BALL_RADIUS;
      draw();
      return;
    }

    // Move ball
    g.ballX += g.ballDX;
    g.ballY += g.ballDY;

    // Wall collisions (left/right)
    if (g.ballX - BALL_RADIUS <= 0) {
      g.ballX = BALL_RADIUS;
      g.ballDX = Math.abs(g.ballDX);
      soundRef.current.playWallHit();
    } else if (g.ballX + BALL_RADIUS >= W) {
      g.ballX = W - BALL_RADIUS;
      g.ballDX = -Math.abs(g.ballDX);
      soundRef.current.playWallHit();
    }

    // Top wall
    if (g.ballY - BALL_RADIUS <= 0) {
      g.ballY = BALL_RADIUS;
      g.ballDY = Math.abs(g.ballDY);
      soundRef.current.playWallHit();
    }

    // Paddle collision
    const paddleY = H - PADDLE_BOTTOM_MARGIN;
    const pLeft = g.paddleX - paddleW / 2;
    const pRight = g.paddleX + paddleW / 2;
    const pTop = paddleY - PADDLE_HEIGHT / 2;

    if (
      g.ballDY > 0 &&
      g.ballY + BALL_RADIUS >= pTop &&
      g.ballY + BALL_RADIUS <= pTop + PADDLE_HEIGHT + g.ballDY &&
      g.ballX >= pLeft &&
      g.ballX <= pRight
    ) {
      g.ballY = pTop - BALL_RADIUS;
      // Angle based on hit position (-0.75pi to -0.25pi)
      const hitPos = (g.ballX - g.paddleX) / (paddleW / 2); // -1 to 1
      const speed = Math.sqrt(g.ballDX * g.ballDX + g.ballDY * g.ballDY);
      const angle = -Math.PI / 2 + hitPos * (Math.PI / 4);
      g.ballDX = Math.cos(angle) * speed;
      g.ballDY = Math.sin(angle) * speed;
      soundRef.current.playPaddleHit();
    }

    // Ball fell below paddle
    if (g.ballY - BALL_RADIUS > H) {
      g.lives--;
      setLives(g.lives);
      if (g.lives <= 0) {
        g.status = 'over';
        setGameStatus('over');
        soundRef.current.playGameOver();
        draw();
        return;
      }
      soundRef.current.playLoseLife();
      resetBall();
      draw();
      return;
    }

    // Brick collisions
    for (const brick of g.bricks) {
      if (!brick.alive) continue;

      // Check if ball overlaps brick
      const closestX = Math.max(brick.x, Math.min(g.ballX, brick.x + brick.width));
      const closestY = Math.max(brick.y, Math.min(g.ballY, brick.y + brick.height));
      const distX = g.ballX - closestX;
      const distY = g.ballY - closestY;

      if (distX * distX + distY * distY <= BALL_RADIUS * BALL_RADIUS) {
        brick.alive = false;
        g.score += 10;
        setScore(g.score);
        soundRef.current.playBrickHit();

        // Determine bounce direction
        const overlapLeft = g.ballX + BALL_RADIUS - brick.x;
        const overlapRight = brick.x + brick.width - (g.ballX - BALL_RADIUS);
        const overlapTop = g.ballY + BALL_RADIUS - brick.y;
        const overlapBottom = brick.y + brick.height - (g.ballY - BALL_RADIUS);
        const minOverlapX = Math.min(overlapLeft, overlapRight);
        const minOverlapY = Math.min(overlapTop, overlapBottom);

        if (minOverlapX < minOverlapY) {
          g.ballDX = -g.ballDX;
        } else {
          g.ballDY = -g.ballDY;
        }
        break; // one brick per frame
      }
    }

    // Check win
    if (g.bricks.every(b => !b.alive)) {
      g.score += 50; // level bonus
      setScore(g.score);
      soundRef.current.playLevelComplete();
      nextLevel();
    }

    draw();
  }, [draw, resetBall, nextLevel]);

  // Game loop
  useEffect(() => {
    let running = true;
    const loop = () => {
      if (!running) return;
      tick();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [tick]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const g = gameRef.current;

      if (e.key === ' ') {
        e.preventDefault();
        if (g.status === 'idle' || g.status === 'over') {
          startGame();
          return;
        }
        if (g.status === 'running' && g.ballAttached) {
          launchBall();
          return;
        }
        if (g.status === 'paused') {
          g.status = 'running';
          setGameStatus('running');
          return;
        }
      }

      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        e.preventDefault();
        if (g.status === 'running') {
          g.status = 'paused';
          setGameStatus('paused');
        } else if (g.status === 'paused') {
          g.status = 'running';
          setGameStatus('running');
        }
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        keysRef.current.add(e.key);
      }
    },
    [startGame, launchBall],
  );

  const handleKeyUp = useCallback((e: React.KeyboardEvent) => {
    keysRef.current.delete(e.key);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    gameRef.current.paddleX = mouseX;
  }, []);

  const handleClick = useCallback(() => {
    const g = gameRef.current;
    if (g.status === 'running' && g.ballAttached) {
      launchBall();
    }
  }, [launchBall]);

  // Observe wrapper size
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

  // Resize canvas and rebuild bricks if needed
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    const g = gameRef.current;
    if (g.status === 'idle') {
      gameRef.current = initState(canvas.width, canvas.height);
    } else {
      // Rebuild brick positions for new width
      const oldBricks = g.bricks;
      const newBricks = createBricks(canvas.width);
      for (let i = 0; i < newBricks.length && i < oldBricks.length; i++) {
        newBricks[i].alive = oldBricks[i].alive;
      }
      g.bricks = newBricks;
      // Clamp paddle
      const paddleW = canvas.width * PADDLE_WIDTH_RATIO;
      g.paddleX = Math.max(paddleW / 2, Math.min(canvas.width - paddleW / 2, g.paddleX));
    }
    draw();
  }, [canvasSize, draw]);

  // Cleanup sound on unmount
  useEffect(() => {
    const sound = soundRef.current;
    return () => sound.cleanup();
  }, []);

  // Auto-focus
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Submit score whenever the game transitions to game over.
  useEffect(() => {
    if (gameStatus === 'over') {
      const g = gameRef.current;
      void submitScore(g.score, { level: g.level });
    }
  }, [gameStatus, submitScore]);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      style={{ outline: 'none' }}
    >
      <div className={styles.header}>
        <span className={styles.score}>Score: {score}</span>
        <span className={styles.level}>Level {level}</span>
        <span className={styles.lives}>
          {'❤️'.repeat(lives)}
        </span>
      </div>
      <div
        ref={wrapperRef}
        className={styles.canvasWrapper}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        <canvas ref={canvasRef} className={styles.canvas} />
        {gameStatus === 'idle' && (
          <div className={styles.overlay}>
            <div className={styles.overlayTitle}>Brick Breaker</div>
            <div className={styles.overlayHint}>Press Space to start</div>
            <div className={styles.overlayHint}>Mouse or Arrow Keys to move</div>
          </div>
        )}
        {gameStatus === 'paused' && (
          <div className={styles.overlay}>
            <div className={styles.overlayTitle}>Paused</div>
            <div className={styles.overlayHint}>Press Space or P to resume</div>
          </div>
        )}
        {gameStatus === 'over' && (
          <div className={styles.overlay}>
            <div className={styles.overlayTitle}>Game Over</div>
            <div className={styles.overlayScore}>Score: {score}</div>
            <LeaderboardPanel gameId="brick-breaker" />
            <div className={styles.overlayHint}>Press Space to restart</div>
          </div>
        )}
      </div>
    </div>
  );
}
