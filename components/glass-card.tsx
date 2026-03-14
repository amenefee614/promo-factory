import React from 'react';
import { View, ViewProps, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlassTheme } from '@/lib/glass-theme-provider';
import { cn } from '@/lib/utils';

export interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  strong?: boolean; // Use stronger glass effect
}

export function GlassCard({ children, className, strong = false, style, ...props }: GlassCardProps) {
  const { theme } = useGlassTheme();

  const shadowStyle = {
    small: 'shadow-sm',
    medium: 'shadow-md',
    large: 'shadow-lg',
  }[theme.shadowDepth];

  // Calculate border radius
  const radiusClass = `rounded-[${theme.cornerRadius}px]`;
  const borderRadius = theme.cornerRadius;

  // Glass effect styles with dark purple theme
  const glassStyles = Platform.select({
    web: {
      backdropFilter: `blur(${theme.blurIntensity}px)`,
      WebkitBackdropFilter: `blur(${theme.blurIntensity}px)`,
      backgroundColor: strong
        ? `rgba(30, 20, 60, ${theme.glassOpacity * 0.95})`
        : `rgba(30, 20, 60, ${theme.glassOpacity * 0.7})`,
    },
    default: {
      // Native doesn't support backdrop-filter, use semi-transparent background
      backgroundColor: strong
        ? `rgba(30, 20, 60, ${theme.glassOpacity * 0.95})`
        : `rgba(30, 20, 60, ${theme.glassOpacity * 0.7})`,
    },
  });

  return (
    <View
      className={cn(
        radiusClass,
        shadowStyle,
        'overflow-hidden',
        className
      )}
      style={[
        glassStyles,
        {
          borderWidth: 1,
          borderColor: 'rgba(129, 140, 248, 0.3)',
        },
        style,
      ]}
      {...props}
    >
      {/* Top edge highlight (light reflection) */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '30%',
          borderTopLeftRadius: borderRadius,
          borderTopRightRadius: borderRadius,
        }}
        pointerEvents="none"
      />

      {/* Subtle gradient overlay for depth */}
      <LinearGradient
        colors={[
          'rgba(129, 140, 248, 0.05)',
          'rgba(139, 92, 246, 0.03)',
          'rgba(99, 102, 241, 0.05)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: borderRadius,
        }}
        pointerEvents="none"
      />

      {/* Edge glow effect */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: borderRadius,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.1)',
        }}
        pointerEvents="none"
      />

      {/* Inner shadow for depth */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: borderRadius,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
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
