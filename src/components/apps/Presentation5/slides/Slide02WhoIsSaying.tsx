import { Slide, Enter, SectionLabel, SlideTitle } from '../components/primitives';
import { colors, fonts } from '../theme';

const people = [
  {
    name: 'Sam Altman',
    role: 'CEO de OpenAI',
    quote: '«Queremos inundar el mundo de inteligencia.»',
    extra:
      'Reconoció públicamente que la IA cambia cómo funciona el capitalismo.',
    accent: colors.accent,
  },
  {
    name: 'Dario Amodei',
    role: 'CEO de Anthropic',
    quote: '«Un país de genios dentro de un centro de datos.»',
    extra:
      'IA poderosa podría estar a 1–2 años. Un siglo de progreso comprimido en una década.',
    accent: colors.accent,
  },
  {
    name: 'Elon Musk',
    role: 'CEO de Tesla, xAI, SpaceX',
    quote: '«AGI en 2026. Para 2030, la IA superará a toda la humanidad.»',
    extra: 'La moneda del futuro no es el dólar — son los vatios.',
    accent: colors.accent,
  },
];

export const Slide02WhoIsSaying = () => {
  return (
    <Slide variant="light" style={{ padding: 0 }}>
      <div style={{ padding: '80px 100px 40px' }}>
        <Enter delay={4}>
          <SectionLabel number="02" text="Las voces" variant="light" />
        </Enter>

        <Enter delay={10}>
          <SlideTitle variant="light">¿Quién está diciendo esto?</SlideTitle>
        </Enter>
      </div>

      <div
        style={{
          display: 'flex',
          flex: 1,
          borderTop: `1px solid ${colors.textOnLight}`,
        }}
      >
        {people.map((p, i) => (
          <Enter
            key={p.name}
            delay={22 + i * 8}
            style={{ 
              flex: 1, 
              display: 'flex',
              borderRight: i < people.length - 1 ? `1px solid ${colors.textOnLight}` : 'none',
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
                  fontFamily: fonts.display,
                  fontSize: 16,
                  fontWeight: 900,
                  color: colors.accent,
                  marginBottom: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                0{i + 1} // {p.role}
              </div>
              
              <div
                style={{
                  fontFamily: fonts.display,
                  fontSize: 48,
                  fontWeight: 800,
                  color: colors.textOnLight,
                  marginBottom: 40,
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {p.name}
              </div>

              <div
                style={{
                  fontSize: 28,
                  fontWeight: 500,
                  color: colors.textOnLight,
                  lineHeight: 1.1,
                  marginBottom: 40,
                  letterSpacing: '-0.03em',
                }}
              >
                {p.quote}
              </div>

              <div
                style={{
                  width: 60,
                  height: 4,
                  background: colors.textOnLight,
                  marginBottom: 32,
                }}
              />

              <div
                style={{
                  fontSize: 19,
                  lineHeight: 1.3,
                  color: colors.textOnLight,
                  opacity: 0.7,
                  marginTop: 'auto',
                  fontWeight: 400,
                }}
              >
                {p.extra}
              </div>
            </div>
          </Enter>
        ))}
      </div>

      <Enter delay={56}>
        <div
          style={{
            padding: '40px 100px',
            borderTop: `1px solid ${colors.textOnLight}`,
            background: colors.accent,
            fontSize: 24,
            color: colors.bgLight,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
          }}
        >
          Estas son las personas que están <strong>construyendo</strong> la
          tecnología // No comentaristas externos.
        </div>
      </Enter>
    </Slide>
  );
};
