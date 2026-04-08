import { useState, useCallback, useEffect, ReactNode } from 'react';
import { AppProps } from '../../../types/app';
import { useI18n } from '../../../hooks/useI18n';
import styles from './Presentation3App.module.css';

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

export function Presentation3App(_: AppProps) {
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
          <h1 className={styles.slideTitle}>{t('c3s1.title')}</h1>
          <p className={styles.slideSubtitle}>{t('c3s1.subtitle')}</p>
          <TerminalMock title="billing-packets-killer" lines={[
            { type: 'prompt', text: 'open billing-packets-app' },
            { type: 'output', text: 'Loading shipment documents...' },
            { type: 'output', text: '  > commercial_invoice.pdf' },
            { type: 'output', text: '  > isf_form.pdf' },
            { type: 'output', text: '  > packing_list.xlsx' },
            { type: 'output', text: 'Minimax is analyzing 5 files...' },
          ]} />
        </>
      );

      // Slide 2 - Session 2 Recap
      case 1: return (
        <>
          <h1 className={styles.slideTitle}>{t('c3s2.title')}</h1>
          <p className={styles.slideDesc}>{t('c3s2.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`c3s2.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`c3s2.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
        </>
      );

      // Slide 3 - Agenda
      case 2: return (
        <>
          <h1 className={styles.slideTitle}>{t('c3s3.title')}</h1>
          <ol className={styles.numberedList}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <li key={n}>{t(`c3s3.i${n}`)}</li>)}
          </ol>
        </>
      );

      // Slide 4 - What is Fine-Tuning?
      case 3: return (
        <>
          <h1 className={styles.slideTitle}>{t('c3s4.title')}</h1>
          <p className={styles.slideDesc}>{t('c3s4.desc')}</p>
          <div className={styles.card} style={{ marginTop: 16, borderLeft: '3px solid #b569ff', maxWidth: 720 }}>
            <div className={styles.cardDesc} style={{ fontSize: 15, lineHeight: 1.7 }}>{t('c3s4.key')}</div>
          </div>
        </>
      );

      // Slide 5 - Open-Source ≠ Free
      case 4: return (
        <>
          <h1 className={styles.slideTitle}>{t('c3s5.title')}</h1>
          <p className={styles.slideDesc}>{t('c3s5.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`c3s5.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`c3s5.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
        </>
      );

      // Slide 6 - Chinese Open-Source Revolution
      case 5: return (
        <>
          <h1 className={styles.slideTitle}>{t('c3s6.title')}</h1>
          <p className={styles.slideDesc}>{t('c3s6.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`c3s6.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`c3s6.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
        </>
      );

      // Slide 7 - Running Models Locally
      case 6: return (
        <>
          <h1 className={styles.slideTitle}>{t('c3s7.title')}</h1>
          <p className={styles.slideDesc}>{t('c3s7.desc')}</p>
          <ol className={styles.steps}>
            {[1, 2, 3, 4].map((n) => <li key={n}>{t(`c3s7.s${n}`)}</li>)}
          </ol>
          <TerminalMock title="Local Model — Ollama / LM Studio" lines={[
            { type: 'output', text: 'Recommended models (4-5 GB RAM):' },
            { type: 'output', text: '  > qwen2.5-coder:7b' },
            { type: 'output', text: '  > gemma3:4b' },
            { type: 'output', text: '  > llama3.2:3b' },
            { type: 'output', text: '' },
            { type: 'output', text: 'No internet required. Runs fully on-device.' },
          ]} />
        </>
      );

      // Slide 8 - Power of Fine-Tuning
      case 7: return (
        <>
          <h1 className={styles.slideTitle}>{t('c3s8.title')}</h1>
          <p className={styles.slideDesc}>{t('c3s8.desc')}</p>
          <div className={styles.card} style={{ marginTop: 16, borderLeft: '3px solid #e894ff', maxWidth: 720 }}>
            <div className={styles.cardDesc} style={{ fontSize: 15, lineHeight: 1.7, fontStyle: 'italic' }}>{t('c3s8.quote')}</div>
          </div>
        </>
      );

      // Slide 9 - The Dark Side
      case 8: return (
        <>
          <h1 className={styles.slideTitle}>{t('c3s9.title')}</h1>
          <p className={styles.slideDesc}>{t('c3s9.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`c3s9.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`c3s9.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
          <p className={styles.altText}>{t('c3s9.note')}</p>
        </>
      );

      // Slide 10 - The Billing Packets Problem
      case 9: return (
        <>
          <h1 className={styles.slideTitle}>{t('c3s10.title')}</h1>
          <p className={styles.slideDesc}>{t('c3s10.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`c3s10.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`c3s10.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
        </>
      );

      // Slide 11 - The Vision: A Mobile App
      case 10: return (
        <>
          <h1 className={styles.slideTitle}>{t('c3s11.title')}</h1>
          <p className={styles.slideDesc}>{t('c3s11.desc')}</p>
          <ol className={styles.steps}>
            {[1, 2, 3, 4].map((n) => <li key={n}>{t(`c3s11.s${n}`)}</li>)}
          </ol>
          <p className={styles.altText}>{t('c3s11.note')}</p>
        </>
      );

      // Slide 12 - Tech Stack
      case 11: return (
        <>
          <h1 className={styles.slideTitle}>{t('c3s12.title')}</h1>
          <p className={styles.slideDesc}>{t('c3s12.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`c3s12.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`c3s12.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
          <TerminalMock title="Claude Code" lines={[
            { type: 'prompt', text: 'Build me a mobile app with Expo + React Native' },
            { type: 'output', text: 'Creating Expo project...' },
            { type: 'prompt', text: 'Wire it to the Minimax API for document reading' },
            { type: 'output', text: 'Installing dependencies...' },
            { type: 'output', text: 'App ready in simulator. Total time: 3 hours.' },
          ]} />
        </>
      );

      // Slide 13 - Workflow Part 1: Upload
      case 12: return (
        <>
          <h1 className={styles.slideTitle}>{t('c3s13.title')}</h1>
          <p className={styles.slideDesc}>{t('c3s13.desc')}</p>
          <ol className={styles.steps}>
            {[1, 2, 3, 4].map((n) => <li key={n}>{t(`c3s13.s${n}`)}</li>)}
          </ol>
        </>
      );

      // Slide 14 - Minimax Reads Documents
      case 13: return (
        <>
          <h1 className={styles.slideTitle}>{t('c3s14.title')}</h1>
          <p className={styles.slideDesc}>{t('c3s14.desc')}</p>
          <TerminalMock title="Minimax — Document Analysis" lines={[
            { type: 'output', text: 'Reading: commercial_invoice.pdf' },
            { type: 'output', text: '  > 4 pages, text-based PDF' },
            { type: 'output', text: '  > Detected: Commercial Invoice' },
            { type: 'output', text: 'Reading: packing_list.xlsx' },
            { type: 'output', text: '  > Extracted 42 line items' },
            { type: 'output', text: 'Reading: isf_form.pdf' },
            { type: 'output', text: '  > Detected: ISF (Import Security Filing)' },
            { type: 'output', text: 'Classification complete.' },
          ]} />
        </>
      );

      // Slide 15 - Classification
      case 14: return (
        <>
          <h1 className={styles.slideTitle}>{t('c3s15.title')}</h1>
          <p className={styles.slideDesc}>{t('c3s15.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`c3s15.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`c3s15.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
        </>
      );

      // Slide 16 - Data Extraction
      case 15: return (
        <>
          <h1 className={styles.slideTitle}>{t('c3s16.title')}</h1>
          <p className={styles.slideDesc}>{t('c3s16.desc')}</p>
          <TerminalMock title="extracted_data.json" lines={[
            { type: 'output', text: '{' },
            { type: 'output', text: '  "customer":      "VOC International",' },
            { type: 'output', text: '  "invoice_number":"INV-20260408-991",' },
            { type: 'output', text: '  "booking_number":"BK-778254",' },
            { type: 'output', text: '  "mml_number":    "MML-4421",' },
            { type: 'output', text: '  "hbl":           "HLCU12345678",' },
            { type: 'output', text: '  "mbl":           "MAEU99887766",' },
            { type: 'output', text: '  "confidence":    0.94' },
            { type: 'output', text: '}' },
          ]} />
        </>
      );

      // Slide 17 - Output: Excel + Folder
      case 16: return (
        <>
          <h1 className={styles.slideTitle}>{t('c3s17.title')}</h1>
          <p className={styles.slideDesc}>{t('c3s17.desc')}</p>
          <div className={styles.cardGrid} style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className={styles.card}>
              <div className={styles.cardTitle}>{t('c3s17.p1.title')}</div>
              <div className={styles.cardDesc}>{t('c3s17.p1.desc')}</div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>{t('c3s17.p2.title')}</div>
              <div className={styles.cardDesc}>{t('c3s17.p2.desc')}</div>
            </div>
          </div>
          <TerminalMock title="billing_packet_BK-778254/" lines={[
            { type: 'output', text: '├── 01_main_invoice.pdf' },
            { type: 'output', text: '├── 02_commercial_invoice.pdf' },
            { type: 'output', text: '├── 03_isf.pdf' },
            { type: 'output', text: '├── 04_customs_clearance.pdf' },
            { type: 'output', text: '├── 05_packing_list.xlsx' },
            { type: 'output', text: '└── summary.xlsx  ← auto-generated' },
          ]} />
        </>
      );

      // Slide 18 - Backend Options
      case 17: return (
        <>
          <h1 className={styles.slideTitle}>{t('c3s18.title')}</h1>
          <p className={styles.slideDesc}>{t('c3s18.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`c3s18.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`c3s18.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
          <p className={styles.altText}>{t('c3s18.note')}</p>
        </>
      );

      // Slide 19 - CargoWise + EDI Integration
      case 18: return (
        <>
          <h1 className={styles.slideTitle}>{t('c3s19.title')}</h1>
          <p className={styles.slideDesc}>{t('c3s19.desc')}</p>
          <ol className={styles.steps}>
            {[1, 2, 3, 4].map((n) => <li key={n}>{t(`c3s19.s${n}`)}</li>)}
          </ol>
        </>
      );

      // Slide 20 - Email & Power Automate
      case 19: return (
        <>
          <h1 className={styles.slideTitle}>{t('c3s20.title')}</h1>
          <p className={styles.slideDesc}>{t('c3s20.desc')}</p>
          <div className={styles.cardGrid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`c3s20.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`c3s20.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
        </>
      );

      // Slide 21 - Built in 3 Hours
      case 20: return (
        <>
          <h1 className={styles.slideTitle}>{t('c3s21.title')}</h1>
          <p className={styles.slideDesc}>{t('c3s21.desc')}</p>
          <div className={styles.card} style={{ marginTop: 16, borderLeft: '3px solid #b569ff', maxWidth: 720 }}>
            <div className={styles.cardDesc} style={{ fontSize: 15, lineHeight: 1.7 }}>{t('c3s21.key')}</div>
          </div>
        </>
      );

      // Slide 22 - Automation as Liberation
      case 21: return (
        <>
          <h1 className={styles.slideTitle}>{t('c3s22.title')}</h1>
          <div className={styles.cardGrid} style={{ gridTemplateColumns: '1fr 1fr' }}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className={styles.card}>
                <div className={styles.cardTitle}>{t(`c3s22.p${n}.title`)}</div>
                <div className={styles.cardDesc}>{t(`c3s22.p${n}.desc`)}</div>
              </div>
            ))}
          </div>
        </>
      );

      // Slide 23 - Your Team Task
      case 22: return (
        <>
          <h1 className={styles.slideTitle}>{t('c3s23.title')}</h1>
          <p className={styles.slideDesc}>{t('c3s23.desc')}</p>
          <ul className={styles.checklist}>
            {[1, 2, 3, 4, 5, 6].map((n) => {
              const key = `c3t${n}`;
              const checked = !!checkedItems[key];
              return (
                <li key={n} className={styles.checkItem} onClick={() => toggleCheck(key)}>
                  <div className={`${styles.checkbox} ${checked ? styles.checkboxChecked : ''}`}>
                    {checked && <svg className={styles.checkmark} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                  </div>
                  <span>{t(`c3s23.t${n}`)}</span>
                </li>
              );
            })}
          </ul>
        </>
      );

      // Slide 24 - Infinite Possibilities (closing)
      case 23: return (
        <div className={styles.centerSlide} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <h1 className={styles.slideTitle} style={{ fontSize: 42 }}>{t('c3s24.title')}</h1>
          <p className={styles.slideDesc} style={{ maxWidth: 620, textAlign: 'center' }}>{t('c3s24.p1')}</p>
          <p className={styles.slideDesc} style={{ maxWidth: 620, textAlign: 'center' }}>{t('c3s24.p2')}</p>
          <p className={styles.slideDesc} style={{ maxWidth: 620, textAlign: 'center' }}>{t('c3s24.p3')}</p>
          <div className={styles.card} style={{ marginTop: 16, borderLeft: '3px solid #e894ff', maxWidth: 520 }}>
            <div className={styles.cardDesc} style={{ fontSize: 16, lineHeight: 1.7, fontStyle: 'italic' }}>{t('c3s24.closing')}</div>
          </div>
        </div>
      );

      default: return null;
    }
  }
}
