export function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + Math.round(255 * percent / 100)));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + Math.round(255 * percent / 100)));
  const b = Math.min(255, Math.max(0, (num & 0xff) + Math.round(255 * percent / 100)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export function applyAccentColor(color: string) {
  const root = document.documentElement;
  root.style.setProperty('--win-accent', color);
  root.style.setProperty('--win-accent-light', adjustBrightness(color, 15));
  root.style.setProperty('--win-accent-dark', adjustBrightness(color, -15));
  root.style.setProperty('--win-accent-hover', adjustBrightness(color, 5));
}
