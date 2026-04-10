import { Slide, Enter, SectionLabel, SlideTitle } from '../components/primitives';
import { colors, fonts } from '../theme';

const predictions = [
  { who: 'OpenAI', person: 'Sam Altman', date: '«Sabemos cómo construir AGI» — Ene 2025', year: '2025' },
  { who: 'Anthropic', person: 'Dario Amodei', date: 'Estima AGI para 2026 o 2027', year: '2026–27' },
  { who: 'Google DeepMind', person: 'Shane Legg', date: 'Apunta a 2028', year: '2028' },
  { who: 'xAI', person: 'Elon Musk', date: 'AGI en 2026', year: '2026' },
];

export const Slide03WhatIsAGI = () => {
  return (
    <Slide variant="dark">
      <Enter delay={4}>
        <SectionLabel number="03" text="Definición" variant="dark" />
      </Enter>

      <Enter delay={10}>
        <SlideTitle variant="dark">¿Qué es AGI?</SlideTitle>
      </Enter>

      <Enter delay={20}>
        <div
          style={{
            marginTop: 40,
            padding: '40px 0',
            borderTop: `2px solid ${colors.accent}`,
            maxWidth: 1200,
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: colors.accent,
              fontWeight: 800,
              marginBottom: 20,
            }}
          >
            Definición central
          </div>
          <div
            style={{
              fontSize: 48,
              lineHeight: 1.05,
              color: colors.textOnDark,
              fontWeight: 600,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
            }}
          >
            Una máquina capaz de hacer{' '}
            <span style={{ color: colors.accent }}>cualquier trabajo</span>{' '}
            mejor que un humano.
          </div>
        </div>
      </Enter>

      <Enter delay={36} style={{ marginTop: 60 }}>
        <div
          style={{
            fontSize: 12,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: colors.textOnDarkMuted,
            fontWeight: 800,
            marginBottom: 0,
            paddingBottom: 16,
            borderBottom: `1px solid ${colors.textOnDarkMuted}`,
          }}
        >
          Línea de tiempo estimada
        </div>
      </Enter>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {predictions.map((p, i) => (
          <Enter key={p.who} delay={42 + i * 6}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '24px 0',
                borderBottom: `1px solid ${colors.borderDark}`,
              }}
            >
              <div
                style={{
                  fontFamily: fonts.display,
                  fontSize: 42,
                  fontWeight: 900,
                  color: colors.accent,
                  width: 260,
                  letterSpacing: '-0.04em',
                }}
              >
                {p.year}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: colors.textOnDark,
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {p.who} // {p.person}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    color: colors.textOnDarkMuted,
                    marginTop: 4,
                    fontWeight: 400,
                  }}
                >
                  {p.date}
                </div>
              </div>
            </div>
          </Enter>
        ))}
      </div>

      <Enter delay={78} style={{ marginTop: 'auto' }}>
        <div
          style={{
            fontSize: 24,
            color: colors.textOnDark,
            fontWeight: 600,
            lineHeight: 1.2,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            borderLeft: `8px solid ${colors.accent}`,
            paddingLeft: 30,
          }}
        >
          IA de hoy = limitada // AGI ={' '}
          <span style={{ color: colors.accent }}>reemplaza el factor humano</span>.
        </div>
      </Enter>
    </Slide>
  );
};
