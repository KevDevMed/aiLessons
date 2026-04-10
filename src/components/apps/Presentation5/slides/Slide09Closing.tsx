import { interpolate, useCurrentFrame } from 'remotion';
import { Slide, Enter } from '../components/primitives';
import { colors, fonts } from '../theme';

const pillars = [
  { label: 'Chips', sub: 'Quién los fabrica.', accent: colors.accent },
  { label: 'Energía', sub: 'Quién la controla.', accent: colors.accent },
  { label: 'Tierra', sub: 'Quién la posee.', accent: colors.accent },
];

export const Slide09Closing = () => {
  const frame = useCurrentFrame();
  const lineScale = interpolate(frame, [0, 40], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <Slide
      variant="dark"
      style={{
        position: 'relative',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          width: 2,
          height: '100%',
          background: colors.accent,
          transform: `scaleY(${lineScale})`,
          transformOrigin: 'top',
          opacity: 0.3,
        }}
      />

      <div style={{ position: 'relative', textAlign: 'center', maxWidth: 1600, width: '100%' }}>
        <Enter delay={4}>
          <div
            style={{
              fontSize: 16,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: colors.accent,
              fontWeight: 900,
              marginBottom: 40,
            }}
          >
            // El cierre //
          </div>
        </Enter>

        <Enter delay={12}>
          <h2
            style={{
              fontFamily: fonts.display,
              fontSize: 240,
              fontWeight: 900,
              lineHeight: 0.8,
              letterSpacing: '-0.08em',
              color: colors.textOnDark,
              margin: 0,
              textTransform: 'uppercase',
            }}
          >
            PRESTA
            <br />
            <span style={{ color: colors.accent }}>ATENCIÓN.</span>
          </h2>
        </Enter>

        <Enter delay={32}>
          <div
            style={{
              marginTop: 60,
              height: 4,
              width: 200,
              background: colors.textOnDark,
              margin: '60px auto 40px',
            }}
          />
          <p
            style={{
              fontSize: 36,
              fontWeight: 500,
              lineHeight: 1.1,
              color: colors.textOnDark,
              maxWidth: 1200,
              margin: '0 auto',
              textTransform: 'uppercase',
              letterSpacing: '-0.04em',
            }}
          >
            En un mundo donde la inteligencia es gratis // quien controle los{' '}
            <span style={{ color: colors.accent }}>cimientos físicos</span> controlará todo lo demás.
          </p>
        </Enter>

        <div
          style={{
            display: 'flex',
            marginTop: 80,
            justifyContent: 'center',
            borderTop: `1px solid ${colors.borderDark}`,
            borderBottom: `1px solid ${colors.borderDark}`,
          }}
        >
          {pillars.map((p, i) => (
            <Enter key={p.label} delay={48 + i * 8} style={{ flex: 1, borderRight: i < pillars.length - 1 ? `1px solid ${colors.borderDark}` : 'none' }}>
              <div
                style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 42,
                    fontWeight: 900,
                    color: colors.textOnDark,
                    letterSpacing: '-0.04em',
                    textTransform: 'uppercase',
                    marginBottom: 8,
                  }}
                >
                  {p.label}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: colors.accent,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {p.sub}
                </div>
              </div>
            </Enter>
          ))}
        </div>

        <Enter delay={76}>
          <div
            style={{
              marginTop: 60,
              fontSize: 24,
              color: colors.textOnDark,
              fontWeight: 800,
              lineHeight: 1,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
            }}
          >
            El futuro no solo se está prediciendo <span style={{ color: colors.accent }}>//</span> se está comprando ahora mismo.
          </div>
        </Enter>
      </div>
    </Slide>
  );
};
