import { Slide, Enter, SectionLabel, SlideTitle } from '../components/primitives';
import { colors, fonts } from '../theme';

const skeptics = [
  'Los CEOs exageran para atraer inversión.',
  'Los datos de entrenamiento se están agotando.',
  'Musk ya predijo AGI para 2025… y no pasó.',
  'Las arquitecturas tienen límites fundamentales.',
];

const consensus = [
  'La trayectoria es clara e innegable.',
  'Los multimillonarios actúan con dinero real.',
  'La carrera por infraestructura física ya empezó.',
  'Sea 2027 o 2035, el cambio viene.',
];

export const Slide08Perspective = () => {
  return (
    <Slide variant="light" style={{ padding: 0 }}>
      <div style={{ padding: '80px 100px 20px' }}>
        <Enter delay={4}>
          <SectionLabel number="09" text="Equilibrio" variant="light" />
        </Enter>

        <Enter delay={10}>
          <SlideTitle variant="light">Algo de perspectiva.</SlideTitle>
        </Enter>
      </div>

      <div
        style={{
          display: 'flex',
          flex: 1,
          borderTop: `1px solid ${colors.textOnLight}`,
        }}
      >
        {/* Skeptics */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRight: `1px solid ${colors.textOnLight}`,
            padding: '40px 60px',
          }}
        >
          <Enter delay={22}>
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
              Los escépticos // Crítica
            </div>
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 42,
                fontWeight: 900,
                color: colors.textOnLight,
                marginBottom: 40,
                letterSpacing: '-0.05em',
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              «Calma, no es
              <br />
              para tanto.»
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {skeptics.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 20,
                    alignItems: 'baseline',
                    padding: '16px 0',
                    borderBottom: `1px solid ${colors.textOnLight}`,
                  }}
                >
                  <div style={{ fontSize: 18, color: colors.accent, fontWeight: 900 }}>✕</div>
                  <div
                    style={{
                      fontSize: 18,
                      color: colors.textOnLight,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {s}
                  </div>
                </div>
              ))}
            </div>
          </Enter>
        </div>

        {/* Consensus */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '40px 60px',
            background: colors.accent,
            color: colors.bgLight,
          }}
        >
          <Enter delay={34}>
            <div
              style={{
                fontSize: 12,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: colors.bgLight,
                fontWeight: 900,
                marginBottom: 32,
                opacity: 0.8,
              }}
            >
              Consenso // Realidad
            </div>
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 42,
                fontWeight: 900,
                color: colors.bgLight,
                marginBottom: 40,
                letterSpacing: '-0.05em',
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              «Algo grande
              <br />
              viene.»
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {consensus.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 20,
                    alignItems: 'baseline',
                    padding: '16px 0',
                    borderBottom: `1px solid ${colors.bgLight}`,
                  }}
                >
                  <div style={{ fontSize: 18, color: colors.bgLight, fontWeight: 900 }}>●</div>
                  <div
                    style={{
                      fontSize: 18,
                      color: colors.bgLight,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {s}
                  </div>
                </div>
              ))}
            </div>
          </Enter>
        </div>
      </div>
    </Slide>
  );
};
