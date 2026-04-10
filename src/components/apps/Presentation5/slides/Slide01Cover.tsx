import { interpolate, useCurrentFrame } from 'remotion';
import { Slide, Enter } from '../components/primitives';
import { colors, fonts } from '../theme';

export const Slide01Cover = () => {
  const frame = useCurrentFrame();
  const lineScale = interpolate(frame, [0, 40], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <Slide
      variant="dark"
      style={{
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 180,
      }}
    >
      {/* Structural accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 100,
          width: 2,
          height: '100%',
          background: colors.accent,
          transform: `scaleY(${lineScale})`,
          transformOrigin: 'top',
        }}
      />

      <div style={{ position: 'relative', textAlign: 'left', marginLeft: 60 }}>
        <Enter delay={6}>
          <div
            style={{
              fontSize: 16,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: colors.accent,
              fontWeight: 800,
              marginBottom: 40,
            }}
          >
            Silicon Valley // IA // 2026
          </div>
        </Enter>

        <Enter delay={16}>
          <h1
            style={{
              fontFamily: fonts.display,
              fontSize: 160,
              fontWeight: 900,
              lineHeight: 0.85,
              letterSpacing: '-0.06em',
              margin: 0,
              color: colors.textOnDark,
              textTransform: 'uppercase',
            }}
          >
            ¿Por Qué el
            <br />
            Dinero Podría
            <br />
            <span style={{ color: colors.accent }}>Desaparecer</span>?
          </h1>
        </Enter>

        <Enter delay={36}>
          <div
            style={{
              marginTop: 60,
              height: 4,
              width: 120,
              background: colors.textOnDark,
              marginBottom: 40,
            }}
          />
          <p
            style={{
              fontSize: 32,
              fontWeight: 400,
              lineHeight: 1.2,
              color: colors.textOnDark,
              maxWidth: 900,
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Lo que los multimillonarios de Silicon Valley predicen
            sobre la IA y el futuro de la economía.
          </p>
        </Enter>
      </div>

      <Enter
        delay={62}
        style={{
          position: 'absolute',
          bottom: 80,
          left: 160,
          textAlign: 'left',
        }}
      >
        <div
          style={{
            fontSize: 14,
            color: colors.textOnDarkMuted,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 600,
            borderLeft: `2px solid ${colors.accent}`,
            paddingLeft: 20,
          }}
        >
          Basado en declaraciones reales y datos verificados // 2025–2026
        </div>
      </Enter>
    </Slide>
  );
};
