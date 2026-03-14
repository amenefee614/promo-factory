import { describe, it, expect } from 'vitest';
import { THEME_PRESETS, DEFAULT_THEME } from '../lib/theme-types';

describe('Theme Presets', () => {
  it('should have seven presets defined', () => {
    expect(THEME_PRESETS).toHaveLength(7);
  });

  it('should have all required preset IDs', () => {
    const presetIds = THEME_PRESETS.map(p => p.id);
    expect(presetIds).toContain('ultimate-purple');
    expect(presetIds).toContain('neon-night');
    expect(presetIds).toContain('clean-frost');
    expect(presetIds).toContain('gold-luxe');
    expect(presetIds).toContain('candy-pop');
    expect(presetIds).toContain('studio-dark');
    expect(presetIds).toContain('warm-sunset');
  });

  it('should have valid blur intensity values', () => {
    THEME_PRESETS.forEach(preset => {
      expect(preset.blurIntensity).toBeGreaterThanOrEqual(0);
      expect(preset.blurIntensity).toBeLessThanOrEqual(30);
    });
  });

  it('should have valid glass opacity values', () => {
    THEME_PRESETS.forEach(preset => {
      expect(preset.glassOpacity).toBeGreaterThanOrEqual(0.1);
      expect(preset.glassOpacity).toBeLessThanOrEqual(0.9);
    });
  });

  it('should have valid corner radius values', () => {
    THEME_PRESETS.forEach(preset => {
      expect(preset.cornerRadius).toBeGreaterThanOrEqual(8);
      expect(preset.cornerRadius).toBeLessThanOrEqual(24);
    });
  });

  it('should have valid grain amount values', () => {
    THEME_PRESETS.forEach(preset => {
      expect(preset.grainAmount).toBeGreaterThanOrEqual(0);
      expect(preset.grainAmount).toBeLessThanOrEqual(100);
    });
  });

  it('should have valid shadow depth values', () => {
    const validShadows = ['small', 'medium', 'large'];
    THEME_PRESETS.forEach(preset => {
      expect(validShadows).toContain(preset.shadowDepth);
    });
  });

  it('should have valid animation intensity values', () => {
    const validIntensities = ['low', 'medium', 'high'];
    THEME_PRESETS.forEach(preset => {
      expect(validIntensities).toContain(preset.animationIntensity);
    });
  });

  it('should have valid color hex codes', () => {
    const hexPattern = /^#[0-9A-F]{6}$/i;
    THEME_PRESETS.forEach(preset => {
      expect(preset.accentColor).toMatch(hexPattern);
      expect(preset.gradientStart).toMatch(hexPattern);
      expect(preset.gradientEnd).toMatch(hexPattern);
    });
  });

  it('default theme should be ultimate-purple', () => {
    expect(DEFAULT_THEME.id).toBe('ultimate-purple');
  });
});
