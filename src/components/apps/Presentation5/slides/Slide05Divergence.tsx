import { interpolate, useCurrentFrame } from 'remotion';
import { Slide, Enter, SectionLabel, SlideTitle } from '../components/primitives';
import { colors, fonts } from '../theme';

const CHART_SRC = '/divergence-chart.png';

export const Slide05Divergence = () => {
  const frame = useCurrentFrame();
  const chartFade = interpolate(frame, [22, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Slide variant="light" style={{ padding: 0 }}>
      {/* Header Area - Compacted */}
      <div style={{ padding: '60px 80px 30px', background: colors.bgLight }}>
        <Enter delay={4}>
          <SectionLabel number="05" text="La grieta visible" variant="light" />
        </Enter>

        <Enter delay={10}>
          <SlideTitle variant="light" size={90} style={{ maxWidth: 1200, margin: 0 }}>
            EL CAPITAL SE SEPARA DEL TRABAJO.
          </SlideTitle>
        </Enter>
      </div>

      <div
        style={{
          display: 'flex',
          flex: 1,
          borderTop: `2px solid ${colors.textOnLight}`,
          minHeight: 0, // Critical for flex containment
        }}
      >
        {/* Left Side: Chart */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            opacity: chartFade,
            borderRight: `2px solid ${colors.textOnLight}`,
            padding: '30px 50px',
            background: colors.bgLightAccent,
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: colors.textOnLight,
              fontWeight: 900,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}
          >
            <div style={{ width: 30, height: 2, background: colors.accent }} />
            EE.UU. // CORRELACIÓN // 2000 — 2024
          </div>
          <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
            <img
              src={CHART_SRC}
              alt="Gráfico de divergencia"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'grayscale(1) contrast(1.1)',
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              padding: '6px 12px',
              background: colors.accent,
              color: colors.bgLight,
              fontSize: 10,
              fontWeight: 900,
              textTransform: 'uppercase'
            }}>
              Quiebre estructural (2022)
            </div>
          </div>
        </div>

        {/* Right Side: Stats - Compacted */}
        <div
          style={{
            width: 500,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Stat 1 */}
            <div style={{ flex: 1, padding: '40px 50px', borderBottom: `2px solid ${colors.textOnLight}` }}>
              <Enter delay={36}>
                <div style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>
                  Ofertas de Empleo
                </div>
                <div style={{
                  fontFamily: fonts.display,
                  fontSize: 110,
                  fontWeight: 900,
                  color: colors.accent,
                  lineHeight: 0.8,
                  letterSpacing: '-0.08em',
                  fontVariantNumeric: 'tabular-nums'
                }}>
                  −40%
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 16, textTransform: 'uppercase', opacity: 0.6 }}>
                  Contracción del mercado laboral.
                </div>
              </Enter>
            </div>

            {/* Stat 2 */}
            <div style={{ flex: 1, padding: '40px 50px', background: colors.textOnLight, color: colors.bgLight }}>
              <Enter delay={44}>
                <div style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8, color: colors.textOnDarkMuted }}>
                  S&amp;P 500 Index
                </div>
                <div style={{
                  fontFamily: fonts.display,
                  fontSize: 110,
                  fontWeight: 900,
                  color: colors.bgLight,
                  lineHeight: 0.8,
                  letterSpacing: '-0.08em',
                  fontVariantNumeric: 'tabular-nums'
                }}>
                  +50%
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 16, textTransform: 'uppercase', color: colors.accent }}>
                  Valoración en máximos.
                </div>
              </Enter>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Compacted */}
      <Enter delay={60}>
        <div style={{
          padding: '30px 80px',
          background: colors.accent,
          color: colors.bgLight,
          fontSize: 26,
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
          textAlign: 'center'
        }}>
          Empresas valen más // Pero necesitan menos personas que nunca.
        </div>
      </Enter>
    </Slide>
  );
};
