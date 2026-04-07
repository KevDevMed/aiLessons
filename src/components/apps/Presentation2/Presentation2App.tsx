import { useState, useCallback, useEffect, ReactNode } from 'react';
import { AppProps } from '../../../types/app';
import { useI18n } from '../../../hooks/useI18n';
import styles from './Presentation2App.module.css';

const TOTAL_SLIDES = 24;

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

export function Presentation2App({ windowId }: AppProps) {
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
          <h1 className={styles.slideTitle}>{t('c2s1.title')}</h1>
          <p className={styles.slideSubtitle}>{t('c2s1.subtitle')}</p>
          <TerminalMock title="Terminal" lines={[
            { type: 'prompt', text: 'opencode' },
            { type: 'output', text: 'Welcome to OpenCode! Select a model:' },
            { type: 'output', text: '  > qwen-3.6 (free)' },
            { type: 'output', text: '  > gpt-5.4 (openai)' },
            { type: 'output', text: '  > claude-opus (anthropic)' },
          ]} />
        </>
      );

      // Slide 2 - Session 1 Recap
      case 1: return (
        <>
          <h1 className={styles.slideTitle}>{t('c2s2.title')}</h1>
          <p className={styles.slideDesc}>{t('c2s2.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`c2s2.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`c2s2.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
        </>
      );

      // Slide 3 - Agenda
      case 2: return (
        <>
          <h1 className={styles.slideTitle}>{t('c2s3.title')}</h1>
          <ol className={styles.numberedList}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <li key={n}>{t(`c2s3.i${n}`)}</li>)}
          </ol>
        </>
      );

      // Slide 4 - Understanding AI Models
      case 3: return (
        <>
          <h1 className={styles.slideTitle}>{t('c2s4.title')}</h1>
          <p className={styles.slideDesc}>{t('c2s4.desc')}</p>
          <div className={styles.card} style={{ marginTop: 16, borderLeft: '3px solid var(--win-accent)', maxWidth: 700 }}>
            <div className={styles.cardDesc} style={{ fontSize: 15, lineHeight: 1.7 }}>{t('c2s4.key')}</div>
          </div>
        </>
      );

      // Slide 5 - Three Performance Indices
      case 4: return (
        <>
          <h1 className={styles.slideTitle}>{t('c2s5.title')}</h1>
          <p className={styles.slideDesc}>{t('c2s5.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`c2s5.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`c2s5.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
        </>
      );

      // Slide 6 - Intelligence Index
      case 5: return (
        <>
          <h1 className={styles.slideTitle}>{t('c2s6.title')}</h1>
          <p className={styles.slideDesc}>{t('c2s6.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`c2s6.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`c2s6.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
        </>
      );

      // Slide 7 - Code Index
      case 6: return (
        <>
          <h1 className={styles.slideTitle}>{t('c2s7.title')}</h1>
          <p className={styles.slideDesc}>{t('c2s7.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`c2s7.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`c2s7.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
        </>
      );

      // Slide 8 - Agentic Index
      case 7: return (
        <>
          <h1 className={styles.slideTitle}>{t('c2s8.title')}</h1>
          <p className={styles.slideDesc}>{t('c2s8.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`c2s8.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`c2s8.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
        </>
      );

      // Slide 9 - The Chinese Model Revolution
      case 8: return (
        <>
          <h1 className={styles.slideTitle}>{t('c2s9.title')}</h1>
          <p className={styles.slideDesc}>{t('c2s9.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`c2s9.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`c2s9.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
        </>
      );

      // Slide 10 - Pricing & Token Economics
      case 9: return (
        <>
          <h1 className={styles.slideTitle}>{t('c2s10.title')}</h1>
          <p className={styles.slideDesc}>{t('c2s10.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`c2s10.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`c2s10.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
          <TerminalMock title="Pricing Example — Opus 4.6" lines={[
            { type: 'output', text: 'Input:  $150 / 1M tokens' },
            { type: 'output', text: 'Output: $150 / 1M tokens' },
            { type: 'output', text: '' },
            { type: 'output', text: '$200/month plan = ~$5,000 in subsidized tokens' },
            { type: 'output', text: 'That is 25x the value you pay for.' },
          ]} />
        </>
      );

      // Slide 11 - Usage Limits & Plans
      case 10: return (
        <>
          <h1 className={styles.slideTitle}>{t('c2s11.title')}</h1>
          <p className={styles.slideDesc}>{t('c2s11.desc')}</p>
          <ol className={styles.steps}>
            {[1, 2, 3, 4].map((n) => <li key={n}>{t(`c2s11.s${n}`)}</li>)}
          </ol>
          <TerminalMock title="Terminal" lines={[
            { type: 'prompt', text: 'claude /usage' },
            { type: 'output', text: '5-hour window: 42% used (resets in 2h 13m)' },
            { type: 'output', text: 'Weekly limit:  68% used (resets Monday)' },
            { type: 'prompt', text: 'codex stats' },
            { type: 'output', text: '5-hour window: 31% used' },
            { type: 'output', text: 'Weekly limit:  55% used' },
          ]} />
          <p className={styles.altText}>{t('c2s11.note')}</p>
        </>
      );

      // Slide 12 - What is OpenCode?
      case 11: return (
        <>
          <h1 className={styles.slideTitle}>{t('c2s12.title')}</h1>
          <p className={styles.slideDesc}>{t('c2s12.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`c2s12.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`c2s12.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
        </>
      );

      // Slide 13 - Installing OpenCode
      case 12: return (
        <>
          <h1 className={styles.slideTitle}>{t('c2s13.title')}</h1>
          <p className={styles.slideDesc}>{t('c2s13.desc')}</p>
          <ol className={styles.steps}>
            {[1, 2, 3, 4].map((n) => <li key={n}>{t(`c2s13.s${n}`)}</li>)}
          </ol>
          <TerminalMock title="Terminal" lines={[
            { type: 'prompt', text: 'npm install -g opencode' },
            { type: 'output', text: 'added 1 package in 10s' },
            { type: 'prompt', text: 'opencode auth login' },
            { type: 'output', text: 'Select provider:' },
            { type: 'output', text: '  > OpenRouter' },
            { type: 'output', text: '    OpenAI' },
            { type: 'output', text: '    Anthropic' },
            { type: 'output', text: 'Enter API key: sk-or-••••••••' },
            { type: 'output', text: 'Done!' },
          ]} />
          <p className={styles.altText}>{t('c2s13.note')}</p>
        </>
      );

      // Slide 14 - What is OpenRouter?
      case 13: return (
        <>
          <h1 className={styles.slideTitle}>{t('c2s14.title')}</h1>
          <p className={styles.slideDesc}>{t('c2s14.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`c2s14.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`c2s14.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
        </>
      );

      // Slide 15 - Setting Up OpenRouter
      case 14: return (
        <>
          <h1 className={styles.slideTitle}>{t('c2s15.title')}</h1>
          <p className={styles.slideDesc}>{t('c2s15.desc')}</p>
          <ol className={styles.steps}>
            {[1, 2, 3, 4].map((n) => <li key={n}>{t(`c2s15.s${n}`)}</li>)}
          </ol>
          <TerminalMock title="OpenRouter — Key Creation" lines={[
            { type: 'output', text: 'Name: harp-example' },
            { type: 'output', text: 'Credit Limit: $10/month' },
            { type: 'output', text: 'Expires: 1 day' },
            { type: 'output', text: '' },
            { type: 'output', text: 'Key created: sk-or-v1-abc123...' },
            { type: 'output', text: 'NEVER share this key or push it to GitHub!' },
          ]} />
          <p className={styles.altText}>{t('c2s15.note')}</p>
        </>
      );

      // Slide 16 - Free Models & Categories
      case 15: return (
        <>
          <h1 className={styles.slideTitle}>{t('c2s16.title')}</h1>
          <p className={styles.slideDesc}>{t('c2s16.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`c2s16.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`c2s16.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
        </>
      );

      // Slide 17 - MCPs: Chrome DevTools
      case 16: return (
        <>
          <h1 className={styles.slideTitle}>{t('c2s17.title')}</h1>
          <p className={styles.slideDesc}>{t('c2s17.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`c2s17.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`c2s17.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
        </>
      );

      // Slide 18 - Demo: Tracking Killer
      case 17: return (
        <>
          <h1 className={styles.slideTitle}>{t('c2s18.title')}</h1>
          <p className={styles.slideDesc}>{t('c2s18.desc')}</p>
          <div className={styles.cardGrid} style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className={styles.card}>
              <div className={styles.cardTitle}>{t('c2s18.p1.title')}</div>
              <div className={styles.cardDesc}>{t('c2s18.p1.desc')}</div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>{t('c2s18.p2.title')}</div>
              <div className={styles.cardDesc}>{t('c2s18.p2.desc')}</div>
            </div>
          </div>
          <TerminalMock title="Codex + Chrome DevTools MCP" lines={[
            { type: 'prompt', text: 'Track these containers: TEMU1234567, MSCU9876543...' },
            { type: 'output', text: 'Opening Chrome > TrackTrace...' },
            { type: 'output', text: 'Entering container TEMU1234567...' },
            { type: 'output', text: 'Clicking "Track Direct"...' },
            { type: 'output', text: 'Found: Origin Vietnam, ETA Apr 15, Status: In Transit' },
            { type: 'output', text: 'Moving to next container...' },
          ]} />
        </>
      );

      // Slide 19 - Demo Results
      case 18: return (
        <>
          <h1 className={styles.slideTitle}>{t('c2s19.title')}</h1>
          <p className={styles.slideDesc}>{t('c2s19.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`c2s19.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`c2s19.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
          <TerminalMock title="tracking_results.xlsx" lines={[
            { type: 'output', text: 'Container     | Source     | Status      | Notes' },
            { type: 'output', text: 'TEMU1234567   | TrackTrace | In Transit  | ETA: Apr 15' },
            { type: 'output', text: 'MSCU9876543   | TrackTrace | Not Found   | Record expired' },
            { type: 'output', text: 'APLU3065432   | TrackTrace | Delivered   | Arrived Vietnam' },
            { type: 'output', text: 'CMAU5551234   | TrackTrace | Disposed    | Container retired' },
          ]} />
        </>
      );

      // Slide 20 - Prompt in English
      case 19: return (
        <>
          <h1 className={styles.slideTitle}>{t('c2s20.title')}</h1>
          <p className={styles.slideDesc}>{t('c2s20.desc')}</p>
          <div className={styles.card} style={{ marginTop: 16, borderLeft: '3px solid var(--win-accent)', maxWidth: 700 }}>
            <div className={styles.cardDesc} style={{ fontSize: 15, lineHeight: 1.7 }}>{t('c2s20.key')}</div>
          </div>
          <TerminalMock title="Example" lines={[
            { type: 'output', text: 'Instead of:' },
            { type: 'prompt', text: 'Creame una carpeta para cada dia de la semana' },
            { type: 'output', text: '' },
            { type: 'output', text: 'Try:' },
            { type: 'prompt', text: 'Create a folder for each day of the week' },
            { type: 'output', text: '(Same task, better results)' },
          ]} />
        </>
      );

      // Slide 21 - Key Advice & Reflections
      case 20: return (
        <>
          <h1 className={styles.slideTitle}>{t('c2s21.title')}</h1>
          <div className={styles.cardGrid} style={{ gridTemplateColumns: '1fr 1fr' }}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`c2s21.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`c2s21.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
        </>
      );

      // Slide 22 - Team Task
      case 21: return (
        <>
          <h1 className={styles.slideTitle}>{t('c2s22.title')}</h1>
          <p className={styles.slideDesc}>{t('c2s22.desc')}</p>
          <ul className={styles.checklist}>
            {[1, 2, 3, 4, 5, 6].map((n) => {
              const key = `c2t${n}`;
              const checked = !!checkedItems[key];
              return (
                <li key={n} className={styles.checkItem} onClick={() => toggleCheck(key)}>
                  <div className={`${styles.checkbox} ${checked ? styles.checkboxChecked : ''}`}>
                    {checked && <svg className={styles.checkmark} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                  </div>
                  <span>{t(`c2s22.t${n}`)}</span>
                </li>
              );
            })}
          </ul>
        </>
      );

      // Slide 23 - Resources
      case 22: return (
        <>
          <h1 className={styles.slideTitle}>{t('c2s23.title')}</h1>
          <p className={styles.slideDesc}>{t('c2s23.desc')}</p>
          <ul className={styles.resourceList}>
            <li><a className={styles.resourceLink} href="https://artificialanalysis.ai" target="_blank" rel="noopener noreferrer">{t('c2s23.artificial')}</a> - artificialanalysis.ai</li>
            <li><a className={styles.resourceLink} href="https://opencode.ai" target="_blank" rel="noopener noreferrer">{t('c2s23.opencode')}</a> - opencode.ai</li>
            <li><a className={styles.resourceLink} href="https://openrouter.ai" target="_blank" rel="noopener noreferrer">{t('c2s23.openrouter')}</a> - openrouter.ai</li>
            <li><a className={styles.resourceLink} href="https://developer.chrome.com/blog/chrome-devtools-mcp" target="_blank" rel="noopener noreferrer">{t('c2s23.chromemcp')}</a> - developer.chrome.com</li>
          </ul>
        </>
      );

      // Slide 24 - The Creative Advantage
      case 23: return (
        <div className={styles.centerSlide} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <h1 className={styles.slideTitle} style={{ fontSize: 42 }}>{t('c2s24.title')}</h1>
          <p className={styles.slideDesc} style={{ maxWidth: 600, textAlign: 'center' }}>{t('c2s24.p1')}</p>
          <p className={styles.slideDesc} style={{ maxWidth: 600, textAlign: 'center' }}>{t('c2s24.p2')}</p>
          <p className={styles.slideDesc} style={{ maxWidth: 600, textAlign: 'center' }}>{t('c2s24.p3')}</p>
          <div className={styles.card} style={{ marginTop: 16, borderLeft: '3px solid var(--win-accent)', maxWidth: 500 }}>
            <div className={styles.cardDesc} style={{ fontSize: 16, lineHeight: 1.7, fontStyle: 'italic' }}>{t('c2s24.closing')}</div>
          </div>
        </div>
      );

      default: return null;
    }
  }
}
