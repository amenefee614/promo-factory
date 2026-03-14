/** @type {const} */
const themeColors = {
  primary: { light: '#6366F1', dark: '#818CF8' }, // Indigo/Blue
  background: { light: '#1A0B2E', dark: '#0F0520' }, // Deep purple
  surface: { light: 'rgba(99, 102, 241, 0.15)', dark: 'rgba(129, 140, 248, 0.15)' }, // Glass surface with blue tint
  foreground: { light: '#F8F9FF', dark: '#F8F9FF' }, // Almost white
  muted: { light: '#A5B4FC', dark: '#C7D2FE' }, // Light indigo
  border: { light: 'rgba(99, 102, 241, 0.3)', dark: 'rgba(129, 140, 248, 0.3)' }, // Blue border
  success: { light: '#34D399', dark: '#6EE7B7' },
  warning: { light: '#FBBF24', dark: '#FCD34D' },
  error: { light: '#F87171', dark: '#FCA5A5' },
  glass: { light: 'rgba(30, 20, 60, 0.6)', dark: 'rgba(15, 5, 32, 0.7)' }, // Dark glass
  glassStrong: { light: 'rgba(40, 30, 80, 0.8)', dark: 'rgba(25, 15, 50, 0.85)' }, // Stronger dark glass
  overlay: { light: 'rgba(0, 0, 0, 0.7)', dark: 'rgba(0, 0, 0, 0.8)' },
  glow: { light: '#818CF8', dark: '#A5B4FC' }, // Glow effect color
};

module.exports = { themeColors };
