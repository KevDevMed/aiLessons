import { Slide, Enter, SectionLabel, SlideTitle } from '../components/primitives';
import { colors, fonts } from '../theme';

const numbers = [
  { label: 'Ingresos 2024', value: '$3.7B', tone: 'neutral' as const },
  { label: 'Pérdidas 2024', value: '−$5B', tone: 'bad' as const },
  { label: 'Pérdidas proyectadas 2026', value: '−$14B', tone: 'bad' as const },
  { label: 'Pérdidas acumuladas a 2029', value: '−$115B', tone: 'bad' as const },
  { label: 'Valoración (Abr 2026)', value: '$852B', tone: 'big' as const },
  { label: 'Nueva inversión (Abr 2026)', value: '$122B', tone: 'big' as const },
];

export const Slide06FinancialMystery = () => {
  return (
    <Slide variant="light" style={{ padding: 0 }}>
      <div style={{ padding: '80px 100px 20px' }}>
        <Enter delay={4}>
          <SectionLabel number="07" text="El dinero detrás" variant="light" />
        </Enter>

        <Enter delay={10}>
          <SlideTitle variant="light">El misterio financiero</SlideTitle>
        </Enter>
      </div>

      <div
        style={{
          display: 'flex',
          flex: 1,
          borderTop: `1px solid ${colors.textOnLight}`,
        }}
      >
        {/* OpenAI numbers column */}
        <div
          style={{
            flex: 1.2,
            display: 'flex',
            flexDirection: 'column',
            borderRight: `1px solid ${colors.textOnLight}`,
            padding: '40px 60px',
          }}
        >
          <Enter delay={26}>
            <div
              style={{
                fontSize: 12,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: colors.textOnLightMuted,
                fontWeight: 900,
                marginBottom: 32,
              }}
            >
              OpenAI // Análisis de balance
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {numbers.map((n, i) => {
                const valueColor =
                  n.tone === 'bad'
                    ? colors.accent
                    : n.tone === 'big'
                      ? colors.textOnLight
                      : colors.textOnLight;
                const isBad = n.tone === 'bad';
                return (
                  <div
                    key={n.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      padding: '20px 0',
                      borderBottom: `1px solid ${colors.textOnLight}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 16,
                        color: colors.textOnLight,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {n.label}
                    </div>
                    <div
                      style={{
                        fontFamily: fonts.display,
                        fontSize: 42,
                        fontWeight: 900,
                        fontVariantNumeric: 'tabular-nums',
                        letterSpacing: '-0.04em',
                        background: isBad ? colors.accent : 'transparent',
                        color: isBad ? colors.bgLight : valueColor,
                        padding: isBad ? '0 10px' : '0',
                      }}
                    >
                      {n.value}
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                marginTop: 32,
                fontSize: 14,
                color: colors.textOnLightMuted,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Valoración &gt; PIB de Argentina // Fuente: Reuters &amp; Bloomberg
            </div>
          </Enter>
        </div>

        {/* The answer column */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: colors.textOnLight,
            color: colors.bgLight,
            padding: '40px 60px',
          }}
        >
          <Enter delay={40} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div
              style={{
                fontSize: 12,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: colors.accent,
                fontWeight: 900,
                marginBottom: 24,
              }}
            >
              La tesis de inversión
            </div>
            
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 64,
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: '-0.05em',
                marginBottom: 40,
                textTransform: 'uppercase',
              }}
            >
              No es una
              <br />
              apuesta de
              <br />
              negocios.
            </div>

            <div
              style={{
                fontSize: 32,
                lineHeight: 1.1,
                fontWeight: 800,
                color: colors.bgLight,
                marginBottom: 40,
                textTransform: 'uppercase',
                letterSpacing: '-0.04em',
                borderLeft: `12px solid ${colors.accent}`,
                paddingLeft: 30,
              }}
            >
              Es un boleto de
              <br />
              <span style={{ color: colors.accent }}>supervivencia.</span>
            </div>

            <div
              style={{
                fontSize: 18,
                lineHeight: 1.3,
                color: colors.bgLight,
                fontWeight: 500,
                opacity: 0.8,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Microsoft // Amazon // Google // Nvidia invierten $30B en 2026.
              No compran software // Apuestan por la última revolución industrial de la historia.
            </div>
          </Enter>
        </div>
      </div>
    </Slide>
  );
};
