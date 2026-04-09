import { useState, useCallback, useEffect, ReactNode } from 'react';
import { AppProps } from '../../../types/app';
import { useI18n } from '../../../hooks/useI18n';
import styles from './Presentation4App.module.css';

const TOTAL_SLIDES = 12;

interface TerminalLine {
  type: 'prompt' | 'output';
  text: string;
}

function TerminalMock({ title, lines }: { title: string; lines: TerminalLine[] }) {
  return (
    <div className={styles.terminalMock}>
      <div className={styles.terminalBar}>
        <span className={`${styles.terminalDot} ${styles.dotRed}`} />
        <span className={`${styles.terminalDot} ${styles.dotYellow}`} />
        <span className={`${styles.terminalDot} ${styles.dotGreen}`} />
        <span className={styles.terminalTitle}>{title}</span>
      </div>
      <div className={styles.terminalBody}>
        {lines.map((line, i) => (
          <div key={i}>
            {line.type === 'prompt' ? (
              <>
                <span className={styles.terminalPrompt}>$ </span>
                <span className={styles.terminalCommand}>{line.text}</span>
              </>
            ) : (
              <span className={styles.terminalOutput}>{line.text}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Presentation4App(_: AppProps) {
  const { t } = useI18n();
  const [current, setCurrent] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= TOTAL_SLIDES || index === current) return;
    setCurrent(index);
  }, [current]);

  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);
  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goPrev, goNext]);

  const toggleCheck = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={styles.presentation}>
      <div className={styles.slideContainer}>
        {Array.from({ length: TOTAL_SLIDES }, (_, index) => {
          if (Math.abs(index - current) > 1) return null;
          let positionClass = '';
          if (index < current) positionClass = styles.slideEnterLeft;
          else if (index > current) positionClass = styles.slideEnterRight;
          else positionClass = styles.slideActive;

          return (
            <div
              key={index}
              className={`${styles.slide} ${positionClass}`}
              style={{ padding: '40px 60px' }}
            >
              {renderSlideContent(index)}
            </div>
          );
        })}
      </div>
      <div className={styles.navBar}>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${((current + 1) / TOTAL_SLIDES) * 100}%` }} />
        </div>
        <div className={styles.navControls}>
          <button className={styles.navBtn} onClick={goPrev} disabled={current === 0}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div className={styles.dots}>
            {Array.from({ length: TOTAL_SLIDES }, (_, i) => (
              <div
                key={i}
                className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
          <span className={styles.counter}>
            {current + 1} {t('nav.of')} {TOTAL_SLIDES}
          </span>
          <button className={styles.navBtn} onClick={goNext} disabled={current === TOTAL_SLIDES - 1}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
          </button>
        </div>
      </div>
    </div>
  );

  function renderSlideContent(index: number): ReactNode {
    switch (index) {
      // Slide 1 - Title
      case 0: return (
        <>
          <div className={styles.accentLine} />
          <h1 className={styles.slideTitle}>{t('c4s1.title')}</h1>
          <p className={styles.slideSubtitle}>{t('c4s1.subtitle')}</p>
          <TerminalMock title="mental-maps-loops" lines={[
            { type: 'prompt', text: 'open excalidraw.com' },
            { type: 'output', text: 'Drawing boxes, arrows, labels...' },
            { type: 'output', text: '  > step 1: generate 5 jokes' },
            { type: 'output', text: '  > step 2: critic reviews' },
            { type: 'output', text: '  > step 3: rewrite with feedback' },
            { type: 'output', text: '  > step 4: judge picks winner' },
            { type: 'prompt', text: 'claude: build this as a slash command' },
          ]} />
        </>
      );

      // Slide 2 - Session 3 Recap
      case 1: return (
        <>
          <h1 className={styles.slideTitle}>{t('c4s2.title')}</h1>
          <p className={styles.slideDesc}>{t('c4s2.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`c4s2.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`c4s2.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
        </>
      );

      // Slide 3 - Agenda
      case 2: return (
        <>
          <h1 className={styles.slideTitle}>{t('c4s3.title')}</h1>
          <ol className={styles.numberedList}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <li key={n}>{t(`c4s3.i${n}`)}</li>)}
          </ol>
        </>
      );

      // Slide 4 - The Thinking Problem
      case 3: return (
        <>
          <h1 className={styles.slideTitle}>{t('c4s4.title')}</h1>
          <p className={styles.slideDesc}>{t('c4s4.desc')}</p>
          <div className={styles.card} style={{ marginTop: 16, borderLeft: '3px solid #ff6b9d', maxWidth: 720 }}>
            <div className={styles.cardDesc} style={{ fontSize: 15, lineHeight: 1.7, fontStyle: 'italic' }}>{t('c4s4.key')}</div>
          </div>
        </>
      );

      // Slide 5 - Excalidraw: Your Whiteboard for AI
      case 4: return (
        <>
          <h1 className={styles.slideTitle}>{t('c4s5.title')}</h1>
          <p className={styles.slideDesc}>{t('c4s5.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`c4s5.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`c4s5.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
        </>
      );

      // Slide 6 - From Diagram to Prompt
      case 5: return (
        <>
          <h1 className={styles.slideTitle}>{t('c4s6.title')}</h1>
          <p className={styles.slideDesc}>{t('c4s6.desc')}</p>
          <ol className={styles.steps}>
            {[1, 2, 3, 4].map((n) => <li key={n}>{t(`c4s6.s${n}`)}</li>)}
          </ol>
        </>
      );

      // Slide 7 - Demo 1: /mejor-chiste
      case 6: return (
        <>
          <h1 className={styles.slideTitle}>{t('c4s7.title')}</h1>
          <p className={styles.slideDesc}>{t('c4s7.desc')}</p>
          <TerminalMock title="/mejor-chiste — comedy pipeline" lines={[
            { type: 'prompt', text: '/mejor-chiste' },
            { type: 'output', text: 'Step 1 (Haiku): generating 5 absurd jokes...' },
            { type: 'output', text: 'Step 2 (Sonnet): reviewing timing + clarity...' },
            { type: 'output', text: 'Step 3 (Haiku): rewriting with feedback...' },
            { type: 'output', text: 'Step 4 (Opus): picking the best...' },
            { type: 'output', text: 'Logging winner to /Users/kevinmedina/jokes.md' },
            { type: 'output', text: '' },
            { type: 'output', text: '🏆 [el chiste ganador]' },
          ]} />
        </>
      );

      // Slide 8 - The Delegation Pattern
      case 7: return (
        <>
          <h1 className={styles.slideTitle}>{t('c4s8.title')}</h1>
          <p className={styles.slideDesc}>{t('c4s8.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`c4s8.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`c4s8.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
        </>
      );

      // Slide 9 - /loop: Recurring Automation
      case 8: return (
        <>
          <h1 className={styles.slideTitle}>{t('c4s9.title')}</h1>
          <p className={styles.slideDesc}>{t('c4s9.desc')}</p>
          <TerminalMock title="Claude Code — /loop" lines={[
            { type: 'prompt', text: '/loop 24h /mejor-chiste' },
            { type: 'output', text: 'Loop scheduled: every 24 hours' },
            { type: 'output', text: 'Next run: tomorrow at this hour' },
            { type: 'output', text: 'Session stays alive ~7 days' },
            { type: 'output', text: '' },
            { type: 'prompt', text: '/loop 6h /check-arKiller-snapshot' },
            { type: 'output', text: 'Loop scheduled: every 6 hours' },
          ]} />
        </>
      );

      // Slide 10 - Demo 2: arKiller Loop
      case 9: return (
        <>
          <h1 className={styles.slideTitle}>{t('c4s10.title')}</h1>
          <p className={styles.slideDesc}>{t('c4s10.desc')}</p>
          <ol className={styles.steps}>
            {[1, 2, 3, 4].map((n) => <li key={n}>{t(`c4s10.s${n}`)}</li>)}
          </ol>
        </>
      );

      // Slide 11 - Your Homework
      case 10: return (
        <>
          <h1 className={styles.slideTitle}>{t('c4s11.title')}</h1>
          <p className={styles.slideDesc}>{t('c4s11.desc')}</p>
          <ul className={styles.checklist}>
            {[1, 2, 3, 4, 5].map((n) => {
              const key = `c4t${n}`;
              const checked = !!checkedItems[key];
              return (
                <li key={n} className={styles.checkItem} onClick={() => toggleCheck(key)}>
                  <div className={`${styles.checkbox} ${checked ? styles.checkboxChecked : ''}`}>
                    {checked && <svg className={styles.checkmark} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                  </div>
                  <span>{t(`c4s11.t${n}`)}</span>
                </li>
              );
            })}
          </ul>
        </>
      );

      // Slide 12 - Closing
      case 11: return (
        <div className={styles.centerSlide} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <h1 className={styles.slideTitle} style={{ fontSize: 42 }}>{t('c4s12.title')}</h1>
          <p className={styles.slideDesc} style={{ maxWidth: 620, textAlign: 'center' }}>{t('c4s12.desc')}</p>
          <div className={styles.card} style={{ marginTop: 16, borderLeft: '3px solid #ff6b9d', maxWidth: 560 }}>
            <div className={styles.cardDesc} style={{ fontSize: 16, lineHeight: 1.7, fontStyle: 'italic' }}>{t('c4s12.closing')}</div>
          </div>
        </div>
      );

      default: return null;
    }
  }
}
