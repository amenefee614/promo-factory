export interface AudioSettings {
  enabled: boolean;
  volume: number; // 0-1
}

export interface ThemePreset {
  id: string;
  name: string;
  accentColor: string;
  gradientStart: string;
  gradientEnd: string;
  blurIntensity: number; // 0-20px
  glassOpacity: number; // 0.1-0.9
  cornerRadius: number; // 8-24px
  shadowDepth: 'small' | 'medium' | 'large';
  grainAmount: number; // 0-100%
  animationIntensity: 'low' | 'medium' | 'high';
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'ultimate-purple',
    name: 'Ultimate Purple',
    accentColor: '#818CF8', // Light indigo
    gradientStart: '#1A0B2E', // Deep purple
    gradientEnd: '#4C1D95', // Purple
    blurIntensity: 24,
    glassOpacity: 0.65,
    cornerRadius: 20,
    shadowDepth: 'large',
    grainAmount: 20,
    animationIntensity: 'high',
  },
  {
    id: 'neon-night',
    name: 'Neon Night',
    accentColor: '#A855F7', // Purple
    gradientStart: '#7C3AED',
    gradientEnd: '#EC4899',
    blurIntensity: 16,
    glassOpacity: 0.7,
    cornerRadius: 16,
    shadowDepth: 'medium',
    grainAmount: 50,
    animationIntensity: 'high',
  },
  {
    id: 'clean-frost',
    name: 'Clean Frost',
    accentColor: '#3B82F6', // Blue
    gradientStart: '#DBEAFE',
    gradientEnd: '#BFDBFE',
    blurIntensity: 20,
    glassOpacity: 0.8,
    cornerRadius: 12,
    shadowDepth: 'small',
    grainAmount: 20,
    animationIntensity: 'low',
  },
  {
    id: 'gold-luxe',
    name: 'Gold Luxe',
    accentColor: '#F59E0B', // Amber
    gradientStart: '#FEF3C7',
    gradientEnd: '#FDE68A',
    blurIntensity: 12,
    glassOpacity: 0.6,
    cornerRadius: 20,
    shadowDepth: 'large',
    grainAmount: 30,
    animationIntensity: 'medium',
  },
  {
    id: 'candy-pop',
    name: 'Candy Pop',
    accentColor: '#EC4899', // Pink
    gradientStart: '#FBCFE8',
    gradientEnd: '#DDD6FE',
    blurIntensity: 18,
    glassOpacity: 0.75,
    cornerRadius: 16,
    shadowDepth: 'medium',
    grainAmount: 70,
    animationIntensity: 'high',
  },
  {
    id: 'studio-dark',
    name: 'Studio Dark',
    accentColor: '#6366F1', // Indigo
    gradientStart: '#1F2937',
    gradientEnd: '#111827',
    blurIntensity: 8,
    glassOpacity: 0.5,
    cornerRadius: 8,
    shadowDepth: 'small',
    grainAmount: 10,
    animationIntensity: 'low',
  },
  {
    id: 'warm-sunset',
    name: 'Warm Sunset',
    accentColor: '#F97316', // Orange
    gradientStart: '#FED7AA',
    gradientEnd: '#FECACA',
    blurIntensity: 14,
    glassOpacity: 0.65,
    cornerRadius: 18,
    shadowDepth: 'medium',
    grainAmount: 40,
    animationIntensity: 'medium',
  },
];

export const DEFAULT_THEME = THEME_PRESETS[0]; // Ultimate Purple

export interface ThemeSettings extends ThemePreset {
  userId?: string;
  audio?: AudioSettings;
}
