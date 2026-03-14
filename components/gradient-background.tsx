import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlassTheme } from '@/lib/glass-theme-provider';

interface GradientBackgroundProps extends ViewProps {
  children: React.ReactNode;
}

export function GradientBackground({ children, style, ...props }: GradientBackgroundProps) {
  const { theme } = useGlassTheme();

  // Ultimate purple/blue gradient
  const gradientColors: [string, string, ...string[]] = [
    '#0F0520', // Deep dark purple (top)
    '#1A0B2E', // Dark purple (middle)
    '#2D1B69', // Medium purple (bottom)
  ];

  return (
    <View style={[styles.container, style]} {...props}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Subtle radial glow effect */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: 'transparent',
          },
        ]}
      >
        <View
          style={[
            styles.glowTop,
            {
              opacity: 0.3,
            },
          ]}
        />
        <View
          style={[
            styles.glowBottom,
            {
              opacity: 0.2,
            },
          ]}
        />
      </View>
      {/* Grain overlay */}
      {theme.grainAmount > 0 && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: theme.grainAmount / 100,
              backgroundColor: 'transparent',
            },
          ]}
        >
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: '#fff',
                opacity: 0.02,
              },
            ]}
          />
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  glowTop: {
    position: 'absolute',
    top: -100,
    left: '20%',
    right: '20%',
    height: 300,
    backgroundColor: '#818CF8',
    borderRadius: 9999,
    filter: 'blur(100px)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: -100,
    left: '30%',
    right: '30%',
    height: 250,
    backgroundColor: '#A855F7',
    borderRadius: 9999,
    filter: 'blur(100px)',
  },
});
