import { Slide, Enter, SectionLabel, SlideTitle } from '../components/primitives';
import { colors, fonts } from '../theme';

const stats = [
  {
    label: 'Electricidad',
    value: '1,000',
    unit: 'TWh',
    caption:
      'Consumo de centros de datos para 2026 // equivalente a todo Japón.',
    source: 'Agencia Internacional de la Energía',
    accent: colors.accent,
  },
  {
    label: 'Chips',
    value: '$25',
    unit: 'B',
    caption:
      'Costo de Terafab // la nueva planta de Musk para fabricar sus propios chips.',
    source: 'xAI // 2025',
    accent: colors.accent,
  },
  {
    label: 'Tierra',
    value: '134',
    unit: 'GW',
    caption:
      'Demanda proyectada de centros de datos en EE.UU. para 2030.',
    source: 'S&P Global',
    accent: colors.accent,
  },
];

export const Slide05StillValuable = () => {
  return (
    <Slide variant="dark" style={{ padding: 0 }}>
      <div style={{ padding: '80px 100px 20px' }}>
        <Enter delay={4}>
          <SectionLabel number="06" text="Lo que sí es escaso" variant="dark" />
        </Enter>

        <Enter delay={10}>
          <SlideTitle variant="dark">¿Qué sigue siendo valioso?</SlideTitle>
        </Enter>
      </div>

      <div
        style={{
          display: 'flex',
          flex: 1,
          borderTop: `1px solid ${colors.textOnDark}`,
        }}
      >
        {stats.map((s, i) => (
          <Enter
            key={s.label}
            delay={30 + i * 8}
            style={{ 
              flex: 1, 
              display: 'flex',
              borderRight: i < stats.length - 1 ? `1px solid ${colors.textOnDark}` : 'none',
            }}
          >
            <div
              style={{
                padding: '60px 50px',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: colors.accent,
                  fontWeight: 900,
                  marginBottom: 32,
                }}
              >
                Recurso: {s.label}
              </div>
              
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 10,
                  marginBottom: 40,
                }}
              >
                <div
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 100,
                    fontWeight: 900,
                    lineHeight: 0.85,
                    color: colors.textOnDark,
                    letterSpacing: '-0.06em',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 32,
                    fontWeight: 700,
                    color: colors.accent,
                  }}
                >
                  {s.unit}
                </div>
              </div>

              <div
                style={{
                  fontSize: 22,
                  lineHeight: 1.2,
                  color: colors.textOnDark,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  marginBottom: 32,
                }}
              >
                {s.caption}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: colors.textOnDarkMuted,
                  marginTop: 'auto',
                  paddingTop: 24,
                  borderTop: `1px solid ${colors.borderDark}`,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                Fuente // {s.source}
              </div>
            </div>
          </Enter>
        ))}
      </div>

      <Enter delay={62}>
        <div
          style={{
            padding: '40px 100px',
            borderTop: `1px solid ${colors.textOnDark}`,
            background: colors.textOnDark,
            color: colors.bgDark,
            display: 'flex',
            gap: 60,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 24,
                fontWeight: 900,
                lineHeight: 1.1,
                textTransform: 'uppercase',
                letterSpacing: '-0.04em',
              }}
            >
              «Muy pronto produciremos más chips de los que podemos encender.»
            </div>
            <div
              style={{
                fontSize: 12,
                color: colors.accent,
                marginTop: 12,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: 800,
              }}
            >
              Elon Musk // Davos // 2026
            </div>
          </div>
          <div
            style={{
              flex: 1,
              fontSize: 16,
              lineHeight: 1.3,
              color: colors.textOnDarkMuted,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            En EE.UU. los centros de datos ya suben las facturas de luz $16–18 al
            mes. Carnegie Mellon estima un aumento del{' '}
            <span style={{ color: colors.bgDark, background: colors.accent, padding: '0 4px' }}>8%</span> para 2030.
          </div>
        </div>
      </Enter>
    </Slide>
  );
};
