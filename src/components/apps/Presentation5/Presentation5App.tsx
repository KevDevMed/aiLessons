import { Player, PlayerRef } from '@remotion/player';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppProps } from '../../../types/app';
import {
  DECK_FPS,
  DECK_HEIGHT,
  DECK_WIDTH,
  Deck,
  SLIDES_COUNT,
  SLIDE_DURATION_FRAMES,
  TRANSITION_DURATION_FRAMES,
} from './Deck';

/** Frames of live entrance animation to play per slide before auto-pausing. */
const ENTRANCE_ANIM_FRAMES = 90; // ~3s at 30fps

export function Presentation5App(_: AppProps) {
  void _;
  const playerRef = useRef<PlayerRef>(null);
  const pauseTimeoutRef = useRef<number | null>(null);
  const currentSlideRef = useRef(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Each TransitionSeries.Sequence overlaps the previous one by the
  // transition duration, so the absolute start frame of slide N is
  //   N * (SLIDE_DURATION_FRAMES - TRANSITION_DURATION_FRAMES)
  const slideStarts = useMemo(() => {
    const arr: number[] = [];
    let cursor = 0;
    for (let i = 0; i < SLIDES_COUNT; i++) {
      arr.push(cursor);
      cursor += SLIDE_DURATION_FRAMES - TRANSITION_DURATION_FRAMES;
    }
    return arr;
  }, []);

  const totalDuration =
    slideStarts[slideStarts.length - 1] + SLIDE_DURATION_FRAMES;

  const goToSlide = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(SLIDES_COUNT - 1, index));
      currentSlideRef.current = clamped;
      setCurrentSlide(clamped);

      const player = playerRef.current;
      if (!player) return;

      player.seekTo(slideStarts[clamped]);
      player.play();

      if (pauseTimeoutRef.current !== null) {
        window.clearTimeout(pauseTimeoutRef.current);
      }
      pauseTimeoutRef.current = window.setTimeout(() => {
        playerRef.current?.pause();
      }, (ENTRANCE_ANIM_FRAMES / DECK_FPS) * 1000 + 80);
    },
    [slideStarts],
  );

  // Kick off the first slide's entrance animation on mount.
  useEffect(() => {
    const id = window.setTimeout(() => goToSlide(0), 120);
    return () => {
      window.clearTimeout(id);
      if (pauseTimeoutRef.current !== null) {
        window.clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, [goToSlide]);

  // Keyboard navigation — same global listener pattern as Presentation4App.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const k = e.key;
      if (
        k === 'ArrowRight' ||
        k === 'ArrowDown' ||
        k === 'PageDown' ||
        k === ' '
      ) {
        e.preventDefault();
        goToSlide(currentSlideRef.current + 1);
      } else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') {
        e.preventDefault();
        goToSlide(currentSlideRef.current - 1);
      } else if (k === 'Home') {
        e.preventDefault();
        goToSlide(0);
      } else if (k === 'End') {
        e.preventDefault();
        goToSlide(SLIDES_COUNT - 1);
      } else if (k === 'f' || k === 'F') {
        e.preventDefault();
        playerRef.current?.requestFullscreen();
      } else if (k === 'r' || k === 'R') {
        e.preventDefault();
        goToSlide(currentSlideRef.current);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goToSlide]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#050811',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: '16px 16px 12px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          flex: 1,
          aspectRatio: '16 / 9',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.55)',
          borderRadius: 6,
          overflow: 'hidden',
          minHeight: 0,
        }}
      >
        <Player
          ref={playerRef}
          component={Deck}
          durationInFrames={totalDuration}
          compositionWidth={DECK_WIDTH}
          compositionHeight={DECK_HEIGHT}
          fps={DECK_FPS}
          style={{ width: '100%', height: '100%' }}
          controls={false}
          clickToPlay={false}
          doubleClickToFullscreen
          spaceKeyToPlayOrPause={false}
        />
      </div>

      <div
        style={{
          color: '#8a93a8',
          fontSize: 12,
          fontFamily: '"Inter", system-ui, sans-serif',
          letterSpacing: 0.4,
          display: 'flex',
          gap: 20,
          alignItems: 'center',
        }}
      >
        <span
          style={{
            color: '#f5f3ee',
            fontWeight: 600,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {String(currentSlide + 1).padStart(2, '0')} /{' '}
          {String(SLIDES_COUNT).padStart(2, '0')}
        </span>
        <span>← → navegar · F pantalla completa · R repetir</span>
      </div>
    </div>
  );
}
