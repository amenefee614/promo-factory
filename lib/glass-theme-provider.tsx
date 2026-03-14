import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeSettings, DEFAULT_THEME, THEME_PRESETS } from './theme-types';

interface GlassThemeContextType {
  theme: ThemeSettings;
  setTheme: (theme: ThemeSettings) => void;
  applyPreset: (presetId: string) => void;
  updateTheme: (updates: Partial<ThemeSettings>) => void;
  resetTheme: () => void;
  isLoading: boolean;
}

const GlassThemeContext = createContext<GlassThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@promo_factory_theme';

export function GlassThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeSettings>(DEFAULT_THEME);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from storage on mount
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setThemeState(parsed);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = async (newTheme: ThemeSettings) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newTheme));
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const applyPreset = (presetId: string) => {
    const preset = THEME_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setTheme(preset);
    }
  };

  const updateTheme = (updates: Partial<ThemeSettings>) => {
    const newTheme = { ...theme, ...updates };
    setTheme(newTheme);
  };

  const resetTheme = () => {
    setTheme(DEFAULT_THEME);
  };

  return (
    <GlassThemeContext.Provider
      value={{
        theme,
        setTheme,
        applyPreset,
        updateTheme,
        resetTheme,
        isLoading,
      }}
    >
      {children}
    </GlassThemeContext.Provider>
  );
}

export function useGlassTheme() {
  const context = useContext(GlassThemeContext);
  if (!context) {
    throw new Error('useGlassTheme must be used within GlassThemeProvider');
  }
  return context;
}
