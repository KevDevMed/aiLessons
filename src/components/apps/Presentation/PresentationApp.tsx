import { useState, useCallback, useEffect, ReactNode } from 'react';
import { AppProps } from '../../../types/app';
import { useI18n } from '../../../hooks/useI18n';
import styles from './PresentationApp.module.css';

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

export function PresentationApp({ windowId }: AppProps) {
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
          <h1 className={styles.slideTitle}>{t('s1.title')}</h1>
          <p className={styles.slideSubtitle}>{t('s1.subtitle')}</p>
          <TerminalMock title="Terminal" lines={[
            { type: 'prompt', text: 'claude --version' },
            { type: 'output', text: 'claude-code v1.0.0' },
            { type: 'prompt', text: 'codex --help' },
            { type: 'output', text: 'Usage: codex [options] [prompt]' },
          ]} />
        </>
      );

      // Slide 2 - Why Are We Here?
      case 1: return (
        <>
          <h1 className={styles.slideTitle}>{t('s2.title')}</h1>
          <p className={styles.slideDesc}>{t('s2.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`s2.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`s2.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
        </>
      );

      // Slide 3 - Agenda
      case 2: return (
        <>
          <h1 className={styles.slideTitle}>{t('s3.title')}</h1>
          <ol className={styles.numberedList}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => <li key={n}>{t(`s3.i${n}`)}</li>)}
          </ol>
        </>
      );

      // Slide 4 - Brave Browser
      case 3: return (
        <>
          <h1 className={styles.slideTitle}>{t('s4.title')}</h1>
          <p className={styles.slideDesc}>{t('s4.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`s4.f${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`s4.f${n}.desc`)}</div>
              </div>
            ))}
          </div>
          <p className={styles.altText}>{t('s4.note')}</p>
        </>
      );

      // Slide 5 - AI Is Not Just a Chat
      case 4: return (
        <>
          <h1 className={styles.slideTitle}>{t('s5.title')}</h1>
          <p className={styles.slideDesc}>{t('s5.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`s5.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`s5.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
        </>
      );

      // Slide 6 - AI Amplifies YOUR Knowledge
      case 5: return (
        <>
          <h1 className={styles.slideTitle}>{t('s6.title')}</h1>
          <p className={styles.slideDesc}>{t('s6.desc')}</p>
          <div className={styles.card} style={{ marginTop: 16, borderLeft: '3px solid var(--win-accent)', maxWidth: 700 }}>
            <div className={styles.cardDesc} style={{ fontSize: 15, lineHeight: 1.7 }}>{t('s6.key')}</div>
          </div>
        </>
      );

      // Slide 7 - The Agentic Power
      case 6: return (
        <>
          <h1 className={styles.slideTitle}>{t('s7.title')}</h1>
          <p className={styles.slideDesc}>{t('s7.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`s7.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`s7.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
        </>
      );

      // Slide 8 - Understanding the Terminal
      case 7: return (
        <>
          <h1 className={styles.slideTitle}>{t('s8.title')}</h1>
          <p className={styles.slideDesc}>{t('s8.desc')}</p>
          <TerminalMock title="Terminal" lines={[
            { type: 'prompt', text: 'ls' },
            { type: 'output', text: 'Downloads  Documents  Desktop  Music  Pictures' },
            { type: 'prompt', text: 'cd Desktop' },
            { type: 'prompt', text: 'ls' },
            { type: 'output', text: 'ejemplo-hard  facturas  screenshots' },
            { type: 'prompt', text: 'cd ejemplo-hard' },
          ]} />
          <ol className={styles.steps} style={{ marginTop: 16 }}>
            {[1, 2, 3, 4].map((n) => <li key={n}>{t(`s8.s${n}`)}</li>)}
          </ol>
          <p className={styles.altText}>{t('s8.note')}</p>
        </>
      );

      // Slide 9 - What is Warp?
      case 8: return (
        <>
          <h1 className={styles.slideTitle}>{t('s9.title')}</h1>
          <p className={styles.slideDesc}>{t('s9.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`s9.f${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`s9.f${n}.desc`)}</div>
              </div>
            ))}
          </div>
        </>
      );

      // Slide 10 - Installing Warp
      case 9: return (
        <>
          <h1 className={styles.slideTitle}>{t('s10.title')}</h1>
          <ol className={styles.steps}>
            {[1, 2, 3, 4].map((n) => <li key={n}>{t(`s10.s${n}`)}</li>)}
          </ol>
          <TerminalMock title="Warp" lines={[
            { type: 'prompt', text: 'brew install --cask warp' },
            { type: 'output', text: '==> Downloading warp...' },
            { type: 'output', text: '==> Installing Warp.app' },
            { type: 'output', text: '==> Warp was successfully installed!' },
          ]} />
        </>
      );

      // Slide 11 - Installing Claude Code
      case 10: return (
        <>
          <h1 className={styles.slideTitle}>{t('s11.title')}</h1>
          <p className={styles.slideDesc}>{t('s11.desc')}</p>
          <div className={styles.cardGrid} style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className={styles.card}>
              <div className={styles.cardTitle}>{t('s11.m1.title')}</div>
              <div className={styles.cardDesc}>{t('s11.m1.desc')}</div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>{t('s11.m2.title')}</div>
              <div className={styles.cardDesc}>{t('s11.m2.desc')}</div>
            </div>
          </div>
          <TerminalMock title="Terminal" lines={[
            { type: 'prompt', text: 'npm install -g @anthropic-ai/claude-code' },
            { type: 'output', text: 'added 1 package in 12s' },
            { type: 'prompt', text: 'claude --version' },
            { type: 'output', text: 'claude-code v1.0.0' },
          ]} />
        </>
      );

      // Slide 12 - Installing Codex
      case 11: return (
        <>
          <h1 className={styles.slideTitle}>{t('s12.title')}</h1>
          <p className={styles.slideDesc}>{t('s12.desc')}</p>
          <TerminalMock title="Terminal" lines={[
            { type: 'prompt', text: 'npm install -g codex' },
            { type: 'output', text: 'added 1 package in 8s' },
            { type: 'prompt', text: 'codex --help' },
            { type: 'output', text: 'Usage: codex [options] [prompt]' },
          ]} />
        </>
      );

      // Slide 13 - The Folder Context
      case 12: return (
        <>
          <h1 className={styles.slideTitle}>{t('s13.title')}</h1>
          <p className={styles.slideDesc}>{t('s13.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`s13.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`s13.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
          <TerminalMock title="Terminal" lines={[
            { type: 'prompt', text: 'cd ~/Desktop/ejemplo-hard' },
            { type: 'prompt', text: 'claude' },
            { type: 'output', text: 'Welcome to Claude Code!' },
            { type: 'output', text: 'Working in: ~/Desktop/ejemplo-hard' },
          ]} />
        </>
      );

      // Slide 14 - Configuring Claude Code
      case 13: return (
        <>
          <h1 className={styles.slideTitle}>{t('s14.title')}</h1>
          <p className={styles.slideDesc}>{t('s14.desc')}</p>
          <ol className={styles.steps}>
            {[1, 2, 3, 4].map((n) => <li key={n}>{t(`s14.s${n}`)}</li>)}
          </ol>
          <TerminalMock title="Terminal" lines={[
            { type: 'prompt', text: 'claude' },
            { type: 'output', text: 'Welcome to Claude Code! Starting setup...' },
            { type: 'output', text: 'Opening browser for authentication...' },
            { type: 'output', text: 'Authentication successful.' },
            { type: 'output', text: 'Do you trust this folder? (Yes/No)' },
            { type: 'prompt', text: 'claude --dangerously-skip-permissions' },
            { type: 'output', text: 'All permissions auto-approved.' },
          ]} />
        </>
      );

      // Slide 15 - Demo: Creating Folders
      case 14: return (
        <>
          <h1 className={styles.slideTitle}>{t('s15.title')}</h1>
          <p className={styles.slideDesc}>{t('s15.desc')}</p>
          <TerminalMock title="Claude Code" lines={[
            { type: 'prompt', text: 'Create a folder for each day of the week' },
            { type: 'output', text: 'I\'ll create 7 folders for each day of the week.' },
            { type: 'output', text: '$ mkdir lunes martes miercoles jueves viernes sabado domingo' },
            { type: 'output', text: '' },
            { type: 'output', text: 'Done! Created 7 directories:' },
            { type: 'output', text: '  lunes/ martes/ miercoles/ jueves/' },
            { type: 'output', text: '  viernes/ sabado/ domingo/' },
          ]} />
        </>
      );

      // Slide 16 - Demo: Excel Files with Data
      case 15: return (
        <>
          <h1 className={styles.slideTitle}>{t('s16.title')}</h1>
          <p className={styles.slideDesc}>{t('s16.desc')}</p>
          <TerminalMock title="Claude Code" lines={[
            { type: 'prompt', text: 'Create 10 Excel files (1-10) in each day folder.' },
            { type: 'prompt', text: 'In even-numbered files, add a table at B2' },
            { type: 'prompt', text: 'with headers: Empleado, Cedula, Ciudad' },
            { type: 'prompt', text: 'and 5 rows of sample data.' },
            { type: 'output', text: 'Creating files in lunes/...' },
            { type: 'output', text: 'Creating files in martes/...' },
            { type: 'output', text: '...' },
            { type: 'output', text: 'Done! Created 70 Excel files across 7 folders.' },
            { type: 'output', text: 'Even files (2,4,6,8,10) include data tables.' },
          ]} />
        </>
      );

      // Slide 17 - Creating Skills
      case 16: return (
        <>
          <h1 className={styles.slideTitle}>{t('s17.title')}</h1>
          <p className={styles.slideDesc}>{t('s17.desc')}</p>
          <p className={styles.altText}>{t('s17.example')}</p>
          <TerminalMock title="Claude Code" lines={[
            { type: 'prompt', text: 'Create a skill that generates weekly folders with Excel files' },
            { type: 'output', text: 'Creating skill: /generar-excel' },
            { type: 'output', text: 'Skill saved successfully!' },
            { type: 'output', text: '' },
            { type: 'prompt', text: '/generar-excel' },
            { type: 'output', text: 'Running skill... Creating folders and Excel files...' },
            { type: 'output', text: 'Done! All files created.' },
          ]} />
          <p className={styles.altText}>{t('s17.note')}</p>
        </>
      );

      // Slide 18 - Multiple Agents Simultaneously
      case 17: return (
        <>
          <h1 className={styles.slideTitle}>{t('s18.title')}</h1>
          <p className={styles.slideDesc}>{t('s18.desc')}</p>
          <div className={styles.cardGrid} style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className={styles.card}>
              <div className={styles.cardTitle}>{t('s18.p1.title')}</div>
              <div className={styles.cardDesc}>{t('s18.p1.desc')}</div>
              <TerminalMock title="Claude Code" lines={[
                { type: 'prompt', text: '/generar-excel' },
                { type: 'output', text: 'Creating structure...' },
              ]} />
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>{t('s18.p2.title')}</div>
              <div className={styles.cardDesc}>{t('s18.p2.desc')}</div>
              <TerminalMock title="Codex" lines={[
                { type: 'prompt', text: 'Open tracking page' },
                { type: 'output', text: 'Opening browser...' },
              ]} />
            </div>
          </div>
        </>
      );

      // Slide 19 - Loops & Automation
      case 18: return (
        <>
          <h1 className={styles.slideTitle}>{t('s19.title')}</h1>
          <p className={styles.slideDesc}>{t('s19.desc')}</p>
          <TerminalMock title="Claude Code" lines={[
            { type: 'prompt', text: '/loop 24h /generar-excel' },
            { type: 'output', text: 'Cron job created successfully.' },
            { type: 'output', text: 'Schedule: every 24 hours' },
            { type: 'output', text: 'Command: /generar-excel' },
            { type: 'output', text: 'Next run: tomorrow at 16:42' },
            { type: 'output', text: 'Session expires: 7 days from now' },
          ]} />
          <p className={styles.altText}>{t('s19.example')}</p>
          <p className={styles.altText}>{t('s19.note')}</p>
        </>
      );

      // Slide 20 - What's Next: MCPs
      case 19: return (
        <>
          <h1 className={styles.slideTitle}>{t('s20.title')}</h1>
          <p className={styles.slideDesc}>{t('s20.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`s20.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`s20.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
          <p className={styles.altText}>{t('s20.note')}</p>
        </>
      );

      // Slide 21 - Key Advice
      case 20: return (
        <>
          <h1 className={styles.slideTitle}>{t('s21.title')}</h1>
          <div className={styles.cardGrid} style={{ gridTemplateColumns: '1fr 1fr' }}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`s21.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`s21.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
        </>
      );

      // Slide 22 - Team Task
      case 21: return (
        <>
          <h1 className={styles.slideTitle}>{t('s22.title')}</h1>
          <p className={styles.slideDesc}>{t('s22.desc')}</p>
          <ul className={styles.checklist}>
            {[1, 2, 3, 4, 5, 6].map((n) => {
              const key = `t${n}`;
              const checked = !!checkedItems[key];
              return (
                <li key={n} className={styles.checkItem} onClick={() => toggleCheck(key)}>
                  <div className={`${styles.checkbox} ${checked ? styles.checkboxChecked : ''}`}>
                    {checked && <svg className={styles.checkmark} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                  </div>
                  <span>{t(`s22.t${n}`)}</span>
                </li>
              );
            })}
          </ul>
        </>
      );

      // Slide 23 - Resources
      case 22: return (
        <>
          <h1 className={styles.slideTitle}>{t('s23.title')}</h1>
          <p className={styles.slideDesc}>{t('s23.desc')}</p>
          <ul className={styles.resourceList}>
            <li><a className={styles.resourceLink} href="https://brave.com" target="_blank" rel="noopener noreferrer">{t('s23.brave')}</a> - brave.com</li>
            <li><a className={styles.resourceLink} href="https://warp.dev" target="_blank" rel="noopener noreferrer">{t('s23.warp')}</a> - warp.dev</li>
            <li><a className={styles.resourceLink} href="https://docs.anthropic.com/claude-code" target="_blank" rel="noopener noreferrer">{t('s23.claude')}</a> - docs.anthropic.com</li>
            <li><a className={styles.resourceLink} href="https://github.com/openai/codex" target="_blank" rel="noopener noreferrer">{t('s23.codex')}</a> - github.com/openai/codex</li>
          </ul>
        </>
      );

      // Slide 24 - Thank You + Reflection
      case 23: return (
        <div className={styles.centerSlide} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <h1 className={styles.slideTitle} style={{ fontSize: 42 }}>{t('s24.title')}</h1>
          <p className={styles.slideDesc} style={{ maxWidth: 600, textAlign: 'center' }}>{t('s24.p1')}</p>
          <p className={styles.slideDesc} style={{ maxWidth: 600, textAlign: 'center' }}>{t('s24.p2')}</p>
          <p className={styles.slideDesc} style={{ maxWidth: 600, textAlign: 'center' }}>{t('s24.p3')}</p>
          <div className={styles.card} style={{ marginTop: 16, borderLeft: '3px solid var(--win-accent)', maxWidth: 500 }}>
            <div className={styles.cardDesc} style={{ fontSize: 16, lineHeight: 1.7, fontStyle: 'italic' }}>{t('s24.closing')}</div>
          </div>
        </div>
      );

      default: return null;
    }
  }
}
