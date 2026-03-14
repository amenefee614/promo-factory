/**
 * Custom Design System - User's Google Slides Design
 * Purple/pink/blue gradient aesthetic with elastic animations
 */

export const customColors = {
  // Primary gradients
  gradientPrimary: ['#8B5CF6', '#EC4899', '#3B82F6'], // purple -> pink -> blue
  gradientSecondary: ['#6366F1', '#8B5CF6'], // indigo -> purple
  gradientAccent: ['#EC4899', '#F472B6'], // pink -> light pink
  
  // Base colors
  background: '#0F0F1E', // dark navy
  surface: '#1A1A2E', // slightly lighter navy
  surfaceLight: '#252540', // card background
  
  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0B8',
  textMuted: '#6B7280',
  
  // Accent colors
  primary: '#8B5CF6', // purple
  secondary: '#EC4899', // pink
  accent: '#3B82F6', // blue
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  
  // Glass/overlay
  glassOverlay: 'rgba(255, 255, 255, 0.1)',
  glassStroke: 'rgba(255, 255, 255, 0.2)',
  shadowColor: 'rgba(139, 92, 246, 0.5)', // purple glow
};

export const customSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const customBorderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
};

export const customFontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const customAnimationDurations = {
  fast: 150,
  normal: 300,
  slow: 500,
};

export const customEasing = {
  elastic: [0.68, -0.55, 0.265, 1.55], // bounce effect
  smooth: [0.4, 0.0, 0.2, 1],
  sharp: [0.4, 0.0, 0.6, 1],
};
