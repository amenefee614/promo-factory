import React from 'react';
import { View, ViewProps, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlassTheme } from '@/lib/glass-theme-provider';
import { cn } from '@/lib/utils';

export interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  strong?: boolean;
  neonColor?: string; // Custom neon border color
  neonIntensity?: 'low' | 'medium' | 'high'; // Glow strength
}

export function GlassCard({
  children,
  className,
  strong = false,
  neonColor,
  neonIntensity = 'low',
  style,
  ...props
}: GlassCardProps) {
  const { theme } = useGlassTheme();

  const borderRadius = theme.cornerRadius;
  const accent = neonColor || '#818CF8';

  const glowIntensityMap = {
    low: { borderOpacity: 0.25, glowSpread: 8, glowOpacity: 0.06 },
    medium: { borderOpacity: 0.4, glowSpread: 15, glowOpacity: 0.12 },
    high: { borderOpacity: 0.6, glowSpread: 25, glowOpacity: 0.2 },
  };

  const glow = glowIntensityMap[neonIntensity];

  const glassStyles = Platform.select({
    web: {
      backdropFilter: `blur(${theme.blurIntensity}px)`,
      WebkitBackdropFilter: `blur(${theme.blurIntensity}px)`,
      backgroundColor: strong
        ? `rgba(15, 10, 35, ${theme.glassOpacity * 0.92})`
        : `rgba(18, 12, 42, ${theme.glassOpacity * 0.65})`,
      boxShadow: [
        `0 0 ${glow.glowSpread}px ${accent}${Math.round(glow.glowOpacity * 255).toString(16).padStart(2, '0')}`,
        `inset 0 1px 0 rgba(255, 255, 255, 0.08)`,
        `0 4px 24px rgba(0, 0, 0, 0.3)`,
      ].join(', '),
    },
    default: {
      backgroundColor: strong
        ? `rgba(15, 10, 35, ${theme.glassOpacity * 0.92})`
        : `rgba(18, 12, 42, ${theme.glassOpacity * 0.65})`,
      shadowColor: accent,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: glow.glowOpacity,
      shadowRadius: glow.glowSpread,
      elevation: 8,
    },
  });

  // Parse accent color to rgba for border
  const borderColor = `${accent}${Math.round(glow.borderOpacity * 255).toString(16).padStart(2, '0')}`;

  return (
    <View
      className={cn('overflow-hidden', className)}
      style={[
        glassStyles,
        {
          borderRadius,
          borderWidth: 1,
          borderColor,
        },
        style,
      ]}
      {...props}
    >
      {/* Top edge neon reflection */}
      <LinearGradient
        colors={[`${accent}20`, 'rgba(255, 255, 255, 0.06)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          borderTopLeftRadius: borderRadius,
          borderTopRightRadius: borderRadius,
        }}
        pointerEvents="none"
      />

      {/* Diagonal light sweep */}
      <LinearGradient
        colors={[
          'transparent',
          'rgba(255, 255, 255, 0.03)',
          'transparent',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius,
        }}
        pointerEvents="none"
      />

      {/* Bottom accent glow line */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: '10%',
          right: '10%',
          height: 1,
          backgroundColor: accent,
          opacity: glow.borderOpacity * 0.5,
          borderRadius: 1,
          ...(Platform.OS === 'web' ? { filter: `blur(2px)` } : {}),
        }}
        pointerEvents="none"
      />

      {/* Content */}
      <View style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </View>
    </View>
  );
}
