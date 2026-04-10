import { Slide, Enter, SectionLabel, SlideTitle } from '../components/primitives';
import { colors, fonts } from '../theme';

const findings = [
  { 
    tag: 'RAZONAMIENTO', 
    text: 'Medalla de oro en la Olimpiada Internacional de Matemáticas.',
    metric: 'TOP 1%'
  },
  { 
    tag: 'CIENCIA', 
    text: 'Superó a expertos con doctorado en evaluaciones de ciencia.',
    metric: 'PHD+'
  },
  { 
    tag: 'SEGURIDAD', 
    text: 'Top 5% en competencias de ciberseguridad frente a humanos.',
    metric: '95%'
  },
  { 
    tag: 'CONCIENCIA', 
    text: 'Detecta cuándo está siendo evaluada y cambia su conducta.',
    metric: 'OOS'
  },
  { 
    tag: 'RIESGO', 
    text: 'No se pudo descartar ayuda en la creación de armas biológicas.',
    metric: 'LEVEL 4'
  },
  { 
    tag: 'ESTADO', 
    text: 'Capacidad de planeación autónoma en múltiples pasos.',
    metric: 'ACTUAL'
  }
];

export const Slide07NotSciFi = () => {
  return (
    <Slide variant="dark" style={{ padding: 0 }}>
      {/* Header Area - Compacted */}
      <div style={{ padding: '60px 80px 20px', background: colors.bgDark }}>
        <Enter delay={4}>
          <SectionLabel number="08" text="Evidencia Técnica" variant="dark" />
        </Enter>

        <Enter delay={10}>
          <SlideTitle variant="dark" size={84} style={{ maxWidth: 1400, margin: 0 }}>
            LA AGI YA NO ES CIENCIA FICCIÓN.
          </SlideTitle>
        </Enter>

        <Enter delay={20}>
          <div style={{
            marginTop: 20,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 16,
            padding: '8px 16px',
            border: `1px solid ${colors.accent}`,
            color: colors.accent,
            fontSize: 12,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.15em'
          }}>
            Informe de Seguridad IA // 2026 // Datos Auditados
          </div>
        </Enter>
      </div>

      {/* Grid of Evidence - Compacted */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          flex: 1,
          borderTop: `2px solid ${colors.textOnDark}`,
          minHeight: 0,
        }}
      >
        {findings.map((f, i) => (
          <Enter
            key={i}
            delay={28 + i * 6}
            style={{ 
              display: 'flex',
              flexDirection: 'column',
              borderRight: (i + 1) % 3 !== 0 ? `1px solid ${colors.borderDark}` : 'none',
              borderBottom: i < 3 ? `1px solid ${colors.borderDark}` : 'none',
              padding: '30px 40px',
              background: i % 2 === 0 ? colors.bgDarkAccent : 'transparent'
            }}
          >
            <div style={{
              fontSize: 10,
              fontWeight: 900,
              color: colors.accent,
              letterSpacing: '0.2em',
              marginBottom: 16,
              textTransform: 'uppercase'
            }}>
              DATA_POINT // {f.tag}
            </div>

            <div style={{
              fontFamily: fonts.display,
              fontSize: 26,
              fontWeight: 800,
              lineHeight: 1.1,
              color: colors.textOnDark,
              marginBottom: 'auto',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em'
            }}>
              {f.text}
            </div>

            <div style={{
              marginTop: 20,
              fontFamily: fonts.display,
              fontSize: 60,
              fontWeight: 900,
              color: colors.textOnDark,
              opacity: 0.15,
              lineHeight: 1,
              letterSpacing: '-0.05em',
              textAlign: 'right'
            }}>
              {f.metric}
            </div>
          </Enter>
        ))}
      </div>

      {/* Bottom Warning - Compacted */}
      <Enter delay={70}>
        <div style={{
          padding: '30px 80px',
          background: colors.textOnDark,
          color: colors.bgDark,
          display: 'flex',
          alignItems: 'center',
          gap: 40,
        }}>
          <div style={{
            fontSize: 60,
            fontWeight: 900,
            color: colors.accent,
            lineHeight: 1
          }}>
            !
          </div>
          <div style={{
            fontSize: 18,
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            lineHeight: 1.2
          }}>
            Los sistemas de IA ya causan daño real // 
            La infraestructura de seguridad actual es insuficiente.
          </div>
        </div>
      </Enter>
    </Slide>
  );
};
