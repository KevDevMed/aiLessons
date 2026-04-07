import { useEffect, useState, useCallback } from 'react';
import { useDesktopStore } from '../../stores/useDesktopStore';
import styles from './PowerOverlay.module.css';

export default function PowerOverlay() {
  const powerState = useDesktopStore((s) => s.powerState);
  const setPowerState = useDesktopStore((s) => s.setPowerState);

  const [phase, setPhase] = useState<'transition' | 'done'>('transition');

  // Reset phase when power state changes
  useEffect(() => {
    setPhase('transition');
  }, [powerState]);

  // Sleep: auto-wake after 3 seconds
  useEffect(() => {
    if (powerState !== 'sleeping') return;
    const timer = setTimeout(() => {
      // After 3s, allow click/keypress to wake
      setPhase('done');
    }, 3000);
    return () => clearTimeout(timer);
  }, [powerState]);

  // Sleep: wake on click or keypress once in 'done' phase
  const handleWake = useCallback(() => {
    if (powerState === 'sleeping' && phase === 'done') {
      setPowerState('on');
    }
  }, [powerState, phase, setPowerState]);

  useEffect(() => {
    if (powerState !== 'sleeping' || phase !== 'done') return;
    const wake = () => handleWake();
    document.addEventListener('click', wake);
    document.addEventListener('keydown', wake);
    return () => {
      document.removeEventListener('click', wake);
      document.removeEventListener('keydown', wake);
    };
  }, [powerState, phase, handleWake]);

  // Restart: reload after 2.5 seconds
  useEffect(() => {
    if (powerState !== 'restarting') return;
    const timer = setTimeout(() => {
      window.location.reload();
    }, 2500);
    return () => clearTimeout(timer);
  }, [powerState]);

  // Shut down: transition to 'done' after 2 seconds
  useEffect(() => {
    if (powerState !== 'shuttingDown') return;
    const timer = setTimeout(() => {
      setPhase('done');
    }, 2000);
    return () => clearTimeout(timer);
  }, [powerState]);

  const handleShutdownClick = useCallback(() => {
    if (powerState === 'shuttingDown' && phase === 'done') {
      setPowerState('on');
    }
  }, [powerState, phase, setPowerState]);

  if (powerState === 'on') return null;

  // Sleep overlay
  if (powerState === 'sleeping') {
    return (
      <div className={`${styles.overlay} ${styles.fadeIn}`} onClick={handleWake}>
        {/* Black screen */}
      </div>
    );
  }

  // Restart overlay
  if (powerState === 'restarting') {
    return (
      <div className={`${styles.overlay} ${styles.fadeIn}`}>
        <div className={styles.content}>
          <div className={styles.spinner} />
          <div className={styles.text}>Restarting...</div>
        </div>
      </div>
    );
  }

  // Shut down overlay
  if (powerState === 'shuttingDown') {
    return (
      <div
        className={`${styles.overlay} ${styles.fadeIn}`}
        onClick={handleShutdownClick}
      >
        <div className={styles.content}>
          {phase === 'transition' ? (
            <>
              <div className={styles.spinner} />
              <div className={styles.text}>Shutting down...</div>
            </>
          ) : (
            <div className={styles.subtext}>Click anywhere to start</div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
