import { Slide, Enter, SectionLabel, SlideTitle } from '../components/primitives';
import { colors, fonts } from '../theme';

const chain = [
  { label: 'Agricultor', icon: '◐' },
  { label: 'Mecánico', icon: '◑' },
  { label: 'Transportista', icon: '◒' },
  { label: 'Ingeniero', icon: '◓' },
  { label: 'Cajero', icon: '●' },
];

export const Slide04WhatIsMoney = () => {
  return (
    <Slide variant="light">
      <Enter delay={4}>
        <SectionLabel number="04" text="Qué es realmente" variant="light" />
      </Enter>

      <Enter delay={10}>
        <SlideTitle variant="light">¿Qué es realmente el dinero?</SlideTitle>
      </Enter>

      <Enter delay={20}>
        <div style={{ marginTop: 40, borderLeft: `12px solid ${colors.textOnLight}`, paddingLeft: 40 }}>
          <p
            style={{
              fontSize: 48,
              color: colors.textOnLight,
              maxWidth: 1200,
              lineHeight: 1.1,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '-0.04em',
            }}
          >
            Un billete ={' '}
            <span style={{ color: colors.accent }}>un cupón</span>
            <br />
            para comprar el tiempo de otros.
          </p>
        </div>
      </Enter>

      <Enter delay={32} style={{ marginTop: 80 }}>
        <div
          style={{
            fontSize: 12,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: colors.textOnLightMuted,
            fontWeight: 800,
            marginBottom: 20,
            paddingBottom: 12,
            borderBottom: `1px solid ${colors.textOnLight}`,
          }}
        >
          Costo humano // Sándwich de $5
        </div>
      </Enter>

      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: 0,
          border: `1px solid ${colors.textOnLight}`,
        }}
      >
        {chain.map((node, i) => (
          <Enter
            key={node.label}
            delay={38 + i * 6}
            style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              borderRight: i < chain.length - 1 ? `1px solid ${colors.textOnLight}` : 'none',
              padding: '40px 20px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 48,
                color: colors.accent,
                marginBottom: 20,
                fontFamily: fonts.display,
                fontWeight: 900,
              }}
            >
              {node.icon}
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: colors.textOnLight,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
              }}
            >
              {node.label}
            </div>
          </Enter>
        ))}
      </div>

      <Enter delay={80} style={{ marginTop: 'auto' }}>
        <div
          style={{
            padding: '40px 50px',
            background: colors.textOnLight,
            color: colors.bgLight,
            fontSize: 32,
            lineHeight: 1.1,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: 40,
            textTransform: 'uppercase',
            letterSpacing: '-0.04em',
          }}
        >
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 80,
              color: colors.accent,
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            →
          </div>
          <div style={{ flex: 1 }}>
            Si AGI reemplaza cada eslabón <span style={{ color: colors.accent }}>//</span> el dinero pierde su propósito.
          </div>
        </div>
      </Enter>
    </Slide>
  );
};
