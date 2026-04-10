export const colors = {
  // Dark slides
  bgDark: '#000000',
  bgDarkAccent: '#111111',
  bgDarkSoft: '#1a1a1a',
  // Light slides
  bgLight: '#ffffff',
  bgLightAccent: '#f0f0f0',
  bgLightSoft: '#ffffff',
  // Text
  textOnDark: '#ffffff',
  textOnDarkMuted: '#999999',
  textOnLight: '#000000',
  textOnLightMuted: '#666666',
  // Accents
  accent: '#ff0000', // Pure red for Swiss Style
  gold: '#ff0000',   // Mapping existing names to accent for compatibility
  blue: '#000000',   // Use black/white instead of blue
  red: '#ff0000',
  green: '#000000',
  // Borders
  borderDark: '#333333',
  borderLight: '#000000',
} as const;

export const fonts = {
  display: '"Inter", "Space Grotesk", system-ui, sans-serif',
  sans: '"Inter", system-ui, -apple-system, sans-serif',
} as const;
