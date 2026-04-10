import { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { colors, fonts } from '../theme';

type SlideVariant = 'dark' | 'light';

type SlideProps = {
  children: ReactNode;
  variant?: SlideVariant;
  style?: CSSProperties;
};

export const Slide = ({ children, variant = 'dark', style }: SlideProps) => {
  const bg = variant === 'dark' ? colors.bgDark : colors.bgLight;
  const fg = variant === 'dark' ? colors.textOnDark : colors.textOnLight;

  return (
    <AbsoluteFill
      style={{
        background: bg,
        color: fg,
        fontFamily: fonts.sans,
        padding: '80px 100px',
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      {/* Structural grid line (example: top border) */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 100,
          right: 100,
          height: 1,
          background: fg,
          opacity: 0.15,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

type EnterProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  style?: CSSProperties;
};

export const Enter = ({
  children,
  delay = 0,
  duration = 18,
  distance = 30,
  style,
}: EnterProps) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(frame, [delay, delay + duration], [distance, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ opacity, transform: `translateY(${y}px)`, ...style }}>
      {children}
    </div>
  );
};

type SectionLabelProps = {
  number: string;
  text: string;
  variant?: SlideVariant;
};

export const SectionLabel = ({ number, text, variant = 'dark' }: SectionLabelProps) => {
  const fg = variant === 'dark' ? colors.textOnDarkMuted : colors.textOnLightMuted;
  const accent = colors.accent;
  
  return (
    <div
      style={{
        fontSize: 14,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: fg,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
      }}
    >
      <span style={{ color: accent }}>{number}</span>
      <span
        style={{
          width: 40,
          height: 2,
          background: accent,
        }}
      />
      <span>{text}</span>
    </div>
  );
};

type SlideTitleProps = {
  children: ReactNode;
  variant?: SlideVariant;
  size?: number;
  style?: CSSProperties;
};

export const SlideTitle = ({
  children,
  variant = 'dark',
  size = 96,
  style,
}: SlideTitleProps) => {
  const color = variant === 'dark' ? colors.textOnDark : colors.textOnLight;
  return (
    <h2
      style={{
        fontFamily: fonts.display,
        fontSize: size,
        fontWeight: 800,
        lineHeight: 0.95,
        letterSpacing: '-0.04em',
        color,
        margin: '0 0 40px 0',
        textTransform: 'uppercase',
        ...style,
      }}
    >
      {children}
    </h2>
  );
};
