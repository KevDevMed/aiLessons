import { useRef, useEffect, useCallback, useState } from 'react';
import { AppProps } from '../../../../types/app';
import { useSubmitScore } from '../../../../hooks/useSubmitScore';
import { LeaderboardPanel } from '../shared/LeaderboardPanel';
import styles from './FlappyBird.module.css';

type GameStatus = 'idle' | 'running' | 'over';

interface Pipe {
  x: number;
  gapY: number;
  scored: boolean;
}

// Physics tuned for 60fps baseline, scaled by delta time
const TARGET_DT = 1000 / 60; // 16.67ms
const GRAVITY = 0.45;
const FLAP_STRENGTH = -7;
const PIPE_WIDTH = 50;
const PIPE_GAP = 140;
const PIPE_SPEED = 2.5;
const PIPE_SPAWN_DISTANCE = 250; // pixels between pipe spawns
const BIRD_RADIUS = 14;
const MAX_DT = 3; // cap delta to avoid spiral of death on tab-switch

// ============================================================
// SOUND ENGINE (Web Audio API - procedural)
// ============================================================

class FlappySoundEngine {
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

  playFlap() {
    try {
      const ctx = this.ensureCtx();
      const now = ctx.currentTime;
      const master = this.getMaster();

      // Quick upward chirp
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.06);
      g.gain.setValueAtTime(0.15, now);
      g.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(g);
      g.connect(master);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  playScore() {
    try {
      const ctx = this.ensureCtx();
      const now = ctx.currentTime;
      const master = this.getMaster();

      // Bright "ding" — two quick ascending notes
      const osc1 = ctx.createOscillator();
      const g1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.value = 520;
      g1.gain.setValueAtTime(0.2, now);
      g1.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
      osc1.connect(g1);
      g1.connect(master);
      osc1.start(now);
      osc1.stop(now + 0.08);

      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.value = 780;
      g2.gain.setValueAtTime(0.2, now + 0.06);
      g2.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc2.connect(g2);
      g2.connect(master);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.14);
    } catch {}
  }

  playHit() {
    try {
      const ctx = this.ensureCtx();
      const now = ctx.currentTime;
      const master = this.getMaster();

      // Impact thud
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
      g.gain.setValueAtTime(0.25, now);
      g.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(g);
      g.connect(master);
      osc.start(now);
      osc.stop(now + 0.35);

      // Crunch noise
      const osc2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.value = 60;
      g2.gain.setValueAtTime(0.15, now);
      g2.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc2.connect(g2);
      g2.connect(master);
      osc2.start(now);
      osc2.stop(now + 0.3);
    } catch {}
  }

  cleanup() {
    if (this.ctx) {
      try { this.ctx.close(); } catch {}
      this.ctx = null;
    }
  }
}

export function FlappyBird({ windowId: _windowId }: AppProps) {
  const { submitScore } = useSubmitScore('flappy-bird');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const birdYRef = useRef(0);
  const birdVelocityRef = useRef(0);
  const pipesRef = useRef<Pipe[]>([]);
  const distanceSinceLastPipeRef = useRef(0);
  const statusRef = useRef<GameStatus>('idle');
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const scoreRef = useRef(0);
  const canvasSizeRef = useRef({ width: 400, height: 500 });
  const soundRef = useRef(new FlappySoundEngine());

  // Cached gradients
  const skyGradRef = useRef<CanvasGradient | null>(null);
  const pipeGradRef = useRef<CanvasGradient | null>(null);
  const lastGradSizeRef = useRef({ width: 0, height: 0 });

  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 500 });

  const birdX = 80;

  const ensureGradients = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    if (lastGradSizeRef.current.width !== w || lastGradSizeRef.current.height !== h) {
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#0f3460');
      skyGrad.addColorStop(1, '#16213e');
      skyGradRef.current = skyGrad;

      const pipeGrad = ctx.createLinearGradient(0, 0, PIPE_WIDTH, 0);
      pipeGrad.addColorStop(0, '#1b9e3e');
      pipeGrad.addColorStop(0.5, '#27ae60');
      pipeGrad.addColorStop(1, '#1b9e3e');
      pipeGradRef.current = pipeGrad;

      lastGradSizeRef.current = { width: w, height: h };
    }
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ensureGradients(ctx, w, h);

    // Sky
    ctx.fillStyle = skyGradRef.current!;
    ctx.fillRect(0, 0, w, h);

    // Ground
    const groundH = 40;
    ctx.fillStyle = '#2d6a4f';
    ctx.fillRect(0, h - groundH, w, groundH);
    ctx.fillStyle = '#40916c';
    ctx.fillRect(0, h - groundH, w, 4);

    // Pipes
    const pipes = pipesRef.current;
    for (const pipe of pipes) {
      const topPipeBottom = pipe.gapY;
      const bottomPipeTop = pipe.gapY + PIPE_GAP;

      // Translate gradient to pipe position
      ctx.save();
      ctx.translate(pipe.x, 0);

      // Top pipe
      ctx.fillStyle = pipeGradRef.current!;
      ctx.fillRect(0, 0, PIPE_WIDTH, topPipeBottom);
      ctx.fillStyle = '#15803d';
      ctx.fillRect(-3, topPipeBottom - 20, PIPE_WIDTH + 6, 20);

      // Bottom pipe
      ctx.fillStyle = pipeGradRef.current!;
      ctx.fillRect(0, bottomPipeTop, PIPE_WIDTH, h - groundH - bottomPipeTop);
      ctx.fillStyle = '#15803d';
      ctx.fillRect(-3, bottomPipeTop, PIPE_WIDTH + 6, 20);

      ctx.restore();
    }

    // Bird
    const by = birdYRef.current;
    const vel = birdVelocityRef.current;
    const tilt = Math.min(Math.max(vel * 3, -30), 70);

    ctx.save();
    ctx.translate(birdX, by);
    ctx.rotate((tilt * Math.PI) / 180);

    // Body
    ctx.fillStyle = '#f1c40f';
    ctx.shadowColor = '#f39c12';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.ellipse(0, 0, BIRD_RADIUS + 2, BIRD_RADIUS, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Wing
    ctx.fillStyle = '#e67e22';
    ctx.beginPath();
    ctx.ellipse(-4, 4, 8, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(8, -4, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(9, -4, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.moveTo(14, -1);
    ctx.lineTo(22, 2);
    ctx.lineTo(14, 5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }, [ensureGradients]);

  const tick = useCallback((timestamp: number) => {
    if (statusRef.current !== 'running') return;

    // Compute delta time scaled to 60fps baseline
    if (lastTimeRef.current === 0) lastTimeRef.current = timestamp;
    const rawDt = (timestamp - lastTimeRef.current) / TARGET_DT;
    const dt = Math.min(rawDt, MAX_DT); // cap to prevent huge jumps
    lastTimeRef.current = timestamp;

    const h = canvasSizeRef.current.height;
    const groundH = 40;

    // Update bird with delta time
    birdVelocityRef.current += GRAVITY * dt;
    birdYRef.current += birdVelocityRef.current * dt;

    // Ground collision
    if (birdYRef.current + BIRD_RADIUS >= h - groundH) {
      birdYRef.current = h - groundH - BIRD_RADIUS;
      statusRef.current = 'over';
      setGameStatus('over');
      soundRef.current.playHit();
      setBestScore(prev => Math.max(prev, scoreRef.current));
      draw();
      return;
    }
    // Ceiling
    if (birdYRef.current - BIRD_RADIUS <= 0) {
      birdYRef.current = BIRD_RADIUS;
      birdVelocityRef.current = 0;
    }

    // Update pipes with delta time
    const pipeMovement = PIPE_SPEED * dt;
    const pipes = pipesRef.current;
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].x -= pipeMovement;

      if (pipes[i].x + PIPE_WIDTH < 0) {
        pipes.splice(i, 1);
        continue;
      }

      // Score
      if (!pipes[i].scored && pipes[i].x + PIPE_WIDTH < birdX) {
        pipes[i].scored = true;
        scoreRef.current += 1;
        setScore(scoreRef.current);
        soundRef.current.playScore();
      }

      // Collision
      const pipe = pipes[i];
      if (
        birdX + BIRD_RADIUS > pipe.x &&
        birdX - BIRD_RADIUS < pipe.x + PIPE_WIDTH
      ) {
        const by = birdYRef.current;
        if (by - BIRD_RADIUS < pipe.gapY || by + BIRD_RADIUS > pipe.gapY + PIPE_GAP) {
          statusRef.current = 'over';
          setGameStatus('over');
          soundRef.current.playHit();
          setBestScore(prev => Math.max(prev, scoreRef.current));
          draw();
          return;
        }
      }
    }

    // Spawn pipes based on distance traveled, not frame count
    distanceSinceLastPipeRef.current += pipeMovement;
    if (distanceSinceLastPipeRef.current >= PIPE_SPAWN_DISTANCE) {
      distanceSinceLastPipeRef.current -= PIPE_SPAWN_DISTANCE;
      const minGapY = 60;
      const maxGapY = h - groundH - PIPE_GAP - 60;
      const gapY = Math.floor(Math.random() * (maxGapY - minGapY)) + minGapY;
      pipes.push({ x: canvasSizeRef.current.width, gapY, scored: false });
    }

    draw();
    animFrameRef.current = requestAnimationFrame(tick);
  }, [draw]);

  const flap = useCallback(() => {
    if (statusRef.current !== 'running') return;
    birdVelocityRef.current = FLAP_STRENGTH;
    soundRef.current.playFlap();
  }, []);

  const startGame = useCallback(() => {
    const h = canvasSizeRef.current.height;
    birdYRef.current = h / 2;
    birdVelocityRef.current = 0;
    pipesRef.current = [];
    distanceSinceLastPipeRef.current = 0;
    lastTimeRef.current = 0;
    scoreRef.current = 0;
    setScore(0);
    statusRef.current = 'running';
    setGameStatus('running');

    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
    }
    animFrameRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (statusRef.current === 'idle' || statusRef.current === 'over') {
          startGame();
        } else {
          flap();
        }
      }
    },
    [startGame, flap],
  );

  const handleClick = useCallback(() => {
    if (statusRef.current === 'idle' || statusRef.current === 'over') {
      startGame();
    } else {
      flap();
    }
  }, [startGame, flap]);

  // Observe wrapper size
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          const newSize = { width: Math.floor(width), height: Math.floor(height) };
          canvasSizeRef.current = newSize;
          // Invalidate cached gradients on resize
          lastGradSizeRef.current = { width: 0, height: 0 };
          setCanvasSize(newSize);
        }
      }
    });

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  // Update canvas dimensions + redraw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    if (statusRef.current === 'idle') {
      birdYRef.current = canvasSize.height / 2;
    }
    draw();
  }, [canvasSize, draw]);

  // Cleanup on unmount
  useEffect(() => {
    const sound = soundRef.current;
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
      sound.cleanup();
    };
  }, []);

  // Auto-focus
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Submit score whenever the game transitions to game over.
  useEffect(() => {
    if (gameStatus === 'over') {
      void submitScore(scoreRef.current);
    }
  }, [gameStatus, submitScore]);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{ outline: 'none' }}
    >
      <div className={styles.header}>
        <span>Flappy Bird</span>
        <span className={styles.score}>
          Score: {score}{bestScore > 0 ? ` | Best: ${bestScore}` : ''}
        </span>
      </div>
      <div ref={wrapperRef} className={styles.canvasWrapper} onClick={handleClick}>
        <canvas ref={canvasRef} className={styles.canvas} />
        {gameStatus === 'idle' && (
          <div className={styles.overlay}>
            <div className={styles.overlayTitle}>Flappy Bird</div>
            <div className={styles.overlayHint}>Press Space or Click to start</div>
          </div>
        )}
        {gameStatus === 'over' && (
          <div className={styles.overlay}>
            <div className={styles.overlayTitle}>Game Over</div>
            <div className={styles.overlayScore}>Score: {score}</div>
            <LeaderboardPanel gameId="flappy-bird" />
            <div className={styles.overlayHint}>Press Space or Click to restart</div>
          </div>
        )}
      </div>
    </div>
  );
}
