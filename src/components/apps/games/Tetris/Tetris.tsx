import { useRef, useEffect, useCallback, useState } from 'react';
import { AppProps } from '../../../types/app';
import styles from './Tetris.module.css';

type GameStatus = 'idle' | 'running' | 'paused' | 'over';

const COLS = 10;
const ROWS = 20;
const CELL = 28;

const PIECES: number[][][] = [
  // I
  [[1, 1, 1, 1]],
  // O
  [[1, 1], [1, 1]],
  // T
  [[0, 1, 0], [1, 1, 1]],
  // S
  [[0, 1, 1], [1, 1, 0]],
  // Z
  [[1, 1, 0], [0, 1, 1]],
  // L
  [[1, 0], [1, 0], [1, 1]],
  // J
  [[0, 1], [0, 1], [1, 1]],
];

const COLORS = [
  '#00e5ff', // I - cyan
  '#ffeb3b', // O - yellow
  '#ab47bc', // T - purple
  '#66bb6a', // S - green
  '#ef5350', // Z - red
  '#ff9800', // L - orange
  '#42a5f5', // J - blue
];

const GHOST_ALPHA = 0.2;

type Piece = {
  shape: number[][];
  color: string;
  x: number;
  y: number;
};

function rotate(shape: number[][]): number[][] {
  const rows = shape.length;
  const cols = shape[0].length;
  const result: number[][] = [];
  for (let c = 0; c < cols; c++) {
    result.push([]);
    for (let r = rows - 1; r >= 0; r--) {
      result[c].push(shape[r][c]);
    }
  }
  return result;
}

function randomPiece(): Piece {
  const idx = Math.floor(Math.random() * PIECES.length);
  const shape = PIECES[idx];
  return {
    shape,
    color: COLORS[idx],
    x: Math.floor((COLS - shape[0].length) / 2),
    y: 0,
  };
}

function collides(board: (string | null)[][], piece: Piece): boolean {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const nx = piece.x + c;
      const ny = piece.y + r;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
      if (ny >= 0 && board[ny][nx] !== null) return true;
    }
  }
  return false;
}

function lockPiece(board: (string | null)[][], piece: Piece) {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const ny = piece.y + r;
      const nx = piece.x + c;
      if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS) {
        board[ny][nx] = piece.color;
      }
    }
  }
}

function clearLines(board: (string | null)[][]): number {
  let cleared = 0;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(cell => cell !== null)) {
      board.splice(r, 1);
      board.unshift(Array(COLS).fill(null));
      cleared++;
      r++; // re-check same row
    }
  }
  return cleared;
}

function getGhostY(board: (string | null)[][], piece: Piece): number {
  let gy = piece.y;
  while (!collides(board, { ...piece, y: gy + 1 })) {
    gy++;
  }
  return gy;
}

function createBoard(): (string | null)[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

const LINE_SCORES = [0, 100, 300, 500, 800];

export function Tetris({ windowId: _windowId }: AppProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nextCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const boardRef = useRef<(string | null)[][]>(createBoard());
  const currentRef = useRef<Piece>(randomPiece());
  const nextRef = useRef<Piece>(randomPiece());
  const statusRef = useRef<GameStatus>('idle');
  const intervalRef = useRef<number | null>(null);
  const scoreRef = useRef(0);
  const linesRef = useRef(0);
  const levelRef = useRef(1);

  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [scale, setScale] = useState(1);

  const getSpeed = useCallback(() => {
    return Math.max(80, 800 - (levelRef.current - 1) * 70);
  }, []);

  const drawBoard = useCallback((ctx: CanvasRenderingContext2D) => {
    const board = boardRef.current;
    ctx.fillStyle = '#0f0f23';
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * CELL, 0);
      ctx.lineTo(c * CELL, ROWS * CELL);
      ctx.stroke();
    }
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * CELL);
      ctx.lineTo(COLS * CELL, r * CELL);
      ctx.stroke();
    }

    // Locked cells
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (board[r][c]) {
          drawCell(ctx, c, r, board[r][c]!, 1);
        }
      }
    }
  }, []);

  const drawCell = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    alpha: number,
  ) => {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);

    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, 3);
    ctx.fillRect(x * CELL + 1, y * CELL + 1, 3, CELL - 2);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(x * CELL + 1, y * CELL + CELL - 3, CELL - 2, 2);
    ctx.fillRect(x * CELL + CELL - 3, y * CELL + 1, 2, CELL - 2);

    ctx.globalAlpha = 1;
  };

  const drawPiece = useCallback(
    (ctx: CanvasRenderingContext2D, piece: Piece, alpha = 1) => {
      for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
          if (!piece.shape[r][c]) continue;
          const px = piece.x + c;
          const py = piece.y + r;
          if (py >= 0) {
            drawCell(ctx, px, py, piece.color, alpha);
          }
        }
      }
    },
    [],
  );

  const drawGhost = useCallback(
    (ctx: CanvasRenderingContext2D, piece: Piece) => {
      const gy = getGhostY(boardRef.current, piece);
      if (gy !== piece.y) {
        drawPiece(ctx, { ...piece, y: gy }, GHOST_ALPHA);
      }
    },
    [drawPiece],
  );

  const drawNext = useCallback(() => {
    const canvas = nextCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const piece = nextRef.current;
    const pieceW = piece.shape[0].length;
    const pieceH = piece.shape.length;
    const previewCell = 20;
    const ox = Math.floor((canvas.width - pieceW * previewCell) / 2);
    const oy = Math.floor((canvas.height - pieceH * previewCell) / 2);

    for (let r = 0; r < pieceH; r++) {
      for (let c = 0; c < pieceW; c++) {
        if (!piece.shape[r][c]) continue;
        ctx.fillStyle = piece.color;
        ctx.fillRect(ox + c * previewCell + 1, oy + r * previewCell + 1, previewCell - 2, previewCell - 2);
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(ox + c * previewCell + 1, oy + r * previewCell + 1, previewCell - 2, 3);
      }
    }
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawBoard(ctx);

    if (statusRef.current === 'running' || statusRef.current === 'paused') {
      drawGhost(ctx, currentRef.current);
      drawPiece(ctx, currentRef.current);
    }

    drawNext();
  }, [drawBoard, drawGhost, drawPiece, drawNext]);

  const spawnPiece = useCallback(() => {
    currentRef.current = nextRef.current;
    nextRef.current = randomPiece();
    if (collides(boardRef.current, currentRef.current)) {
      statusRef.current = 'over';
      setGameStatus('over');
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, []);

  const drop = useCallback(() => {
    if (statusRef.current !== 'running') return;

    const piece = currentRef.current;
    const moved = { ...piece, y: piece.y + 1 };

    if (!collides(boardRef.current, moved)) {
      currentRef.current = moved;
    } else {
      lockPiece(boardRef.current, piece);
      const cleared = clearLines(boardRef.current);
      if (cleared > 0) {
        linesRef.current += cleared;
        scoreRef.current += LINE_SCORES[cleared] * levelRef.current;
        const newLevel = Math.floor(linesRef.current / 10) + 1;
        if (newLevel !== levelRef.current) {
          levelRef.current = newLevel;
          setLevel(newLevel);
          // Restart interval at new speed
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
          }
          intervalRef.current = window.setInterval(drop, Math.max(80, 800 - (newLevel - 1) * 70));
        }
        setScore(scoreRef.current);
        setLines(linesRef.current);
      }
      spawnPiece();
    }

    draw();
  }, [draw, spawnPiece]);

  const hardDrop = useCallback(() => {
    if (statusRef.current !== 'running') return;
    const piece = currentRef.current;
    const gy = getGhostY(boardRef.current, piece);
    scoreRef.current += (gy - piece.y) * 2;
    setScore(scoreRef.current);
    currentRef.current = { ...piece, y: gy };
    lockPiece(boardRef.current, currentRef.current);
    const cleared = clearLines(boardRef.current);
    if (cleared > 0) {
      linesRef.current += cleared;
      scoreRef.current += LINE_SCORES[cleared] * levelRef.current;
      const newLevel = Math.floor(linesRef.current / 10) + 1;
      if (newLevel !== levelRef.current) {
        levelRef.current = newLevel;
        setLevel(newLevel);
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
        }
        intervalRef.current = window.setInterval(drop, Math.max(80, 800 - (newLevel - 1) * 70));
      }
      setScore(scoreRef.current);
      setLines(linesRef.current);
    }
    spawnPiece();
    draw();
  }, [draw, drop, spawnPiece]);

  const movePiece = useCallback(
    (dx: number, dy: number) => {
      if (statusRef.current !== 'running') return;
      const piece = currentRef.current;
      const moved = { ...piece, x: piece.x + dx, y: piece.y + dy };
      if (!collides(boardRef.current, moved)) {
        currentRef.current = moved;
        draw();
      }
    },
    [draw],
  );

  const rotatePiece = useCallback(() => {
    if (statusRef.current !== 'running') return;
    const piece = currentRef.current;
    const rotated = rotate(piece.shape);
    const candidate = { ...piece, shape: rotated };

    // Wall kick attempts
    const kicks = [0, -1, 1, -2, 2];
    for (const kick of kicks) {
      const kicked = { ...candidate, x: candidate.x + kick };
      if (!collides(boardRef.current, kicked)) {
        currentRef.current = kicked;
        draw();
        return;
      }
    }
  }, [draw]);

  const startGame = useCallback(() => {
    boardRef.current = createBoard();
    scoreRef.current = 0;
    linesRef.current = 0;
    levelRef.current = 1;
    setScore(0);
    setLines(0);
    setLevel(1);

    currentRef.current = randomPiece();
    nextRef.current = randomPiece();
    statusRef.current = 'running';
    setGameStatus('running');

    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(drop, 800);
    draw();
  }, [drop, draw]);

  const togglePause = useCallback(() => {
    if (statusRef.current === 'running') {
      statusRef.current = 'paused';
      setGameStatus('paused');
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else if (statusRef.current === 'paused') {
      statusRef.current = 'running';
      setGameStatus('running');
      intervalRef.current = window.setInterval(drop, getSpeed());
    }
  }, [drop, getSpeed]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (statusRef.current === 'idle' || statusRef.current === 'over') {
          startGame();
          return;
        }
      }

      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        e.preventDefault();
        if (statusRef.current === 'running' || statusRef.current === 'paused') {
          togglePause();
        }
        return;
      }

      if (statusRef.current !== 'running') return;

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          e.preventDefault();
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
          e.preventDefault();
          movePiece(1, 0);
          break;
        case 'ArrowDown':
        case 's':
          e.preventDefault();
          movePiece(0, 1);
          break;
        case 'ArrowUp':
        case 'w':
          e.preventDefault();
          rotatePiece();
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
      }
    },
    [startGame, togglePause, movePiece, rotatePiece, hardDrop],
  );

  // Fit game area to window
  useEffect(() => {
    const area = gameAreaRef.current;
    if (!area) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const boardW = COLS * CELL + 4; // +border
        const boardH = ROWS * CELL + 4;
        const sidebarW = 120;
        const totalW = boardW + sidebarW + 16;
        const scaleX = (width - 24) / totalW;
        const scaleY = (height - 24) / boardH;
        setScale(Math.min(1, scaleX, scaleY));
      }
    });
    observer.observe(area);
    return () => observer.disconnect();
  }, []);

  // Redraw on status change
  useEffect(() => {
    draw();
  }, [draw, gameStatus]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Auto-focus
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
        <span>Tetris</span>
        <span className={styles.level}>Level {level}</span>
        <span className={styles.score}>Score: {score}</span>
      </div>
      <div ref={gameAreaRef} className={styles.gameArea}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <canvas
              ref={canvasRef}
              className={styles.canvas}
              width={COLS * CELL}
              height={ROWS * CELL}
            />
            <div className={styles.sidebar}>
              <div>
                <div className={styles.sidebarLabel}>Next</div>
                <canvas
                  ref={nextCanvasRef}
                  className={styles.nextCanvas}
                  width={100}
                  height={80}
                />
              </div>
              <div className={styles.sidebarStats}>
                <div className={styles.statRow}>
                  <span>Lines</span>
                  <span className={styles.statValue}>{lines}</span>
                </div>
                <div className={styles.statRow}>
                  <span>Level</span>
                  <span className={styles.statValue}>{level}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {gameStatus === 'idle' && (
          <div className={styles.overlay}>
            <div className={styles.overlayTitle}>Tetris</div>
            <div className={styles.overlayHint}>Press Space to start</div>
            <div className={styles.overlayHint} style={{ fontSize: 11, marginTop: 8 }}>
              Arrow keys to move / rotate
              <br />
              Space = hard drop &middot; P = pause
            </div>
          </div>
        )}
        {gameStatus === 'paused' && (
          <div className={styles.overlay}>
            <div className={styles.overlayTitle}>Paused</div>
            <div className={styles.overlayHint}>Press P to resume</div>
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
