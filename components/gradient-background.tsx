import React, { useEffect } from 'react';
import { View, StyleSheet, ViewProps, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlassTheme } from '@/lib/glass-theme-provider';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

// Floating neon orb that drifts slowly across the background
function FloatingOrb({
  color,
  size,
  startX,
  startY,
  duration,
  delay,
}: {
  color: string;
  size: number;
  startX: number;
  startY: number;
  duration: number;
  delay: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 0.5, 1], [0, 30, -10]);
    const translateY = interpolate(progress.value, [0, 0.5, 1], [0, -25, 15]);
    const scale = interpolate(progress.value, [0, 0.5, 1], [1, 1.15, 0.9]);
    const opacity = interpolate(progress.value, [0, 0.5, 1], [0.15, 0.25, 0.12]);

    return {
      position: 'absolute' as const,
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
      left: startX,
      top: startY,
      opacity,
      transform: [{ translateX }, { translateY }, { scale }],
      ...(Platform.OS === 'web' ? { filter: `blur(${size * 0.6}px)` } : {}),
    };
  });

  return <AnimatedView style={animatedStyle} pointerEvents="none" />;
}

interface GradientBackgroundProps extends ViewProps {
  children: React.ReactNode;
}

export function GradientBackground({ children, style, ...props }: GradientBackgroundProps) {
  const { theme } = useGlassTheme();

  const gradientColors: [string, string, ...string[]] = [
    '#08020F', // Near-black with purple hint
    '#0F0520', // Deep dark purple
    '#150930', // Dark purple
    '#1A0B38', // Rich dark purple
  ];

  return (
    <View style={[styles.container, style]} {...props}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Animated floating orbs */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <FloatingOrb color="#818CF8" size={250} startX={-50} startY={-30} duration={12000} delay={0} />
        <FloatingOrb color="#A855F7" size={200} startX={150} startY={300} duration={15000} delay={2000} />
        <FloatingOrb color="#EC4899" size={180} startX={50} startY={600} duration={18000} delay={4000} />
        <FloatingOrb color="#6366F1" size={160} startX={200} startY={150} duration={14000} delay={1000} />
        <FloatingOrb color="#3B82F6" size={120} startX={-20} startY={450} duration={16000} delay={3000} />
      </View>

      {/* Subtle top glow */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />
      </View>

      {/* Scanline texture overlay (very subtle) */}
      {Platform.OS === 'web' && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: 0.03,
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
            } as any,
          ]}
          pointerEvents="none"
        />
      )}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  glowTop: {
    position: 'absolute',
    top: -120,
    left: '15%',
    right: '15%',
    height: 300,
    backgroundColor: '#818CF8',
    borderRadius: 9999,
    opacity: 0.12,
    ...(Platform.OS === 'web' ? { filter: 'blur(80px)' } : {}),
  },
  glowBottom: {
    position: 'absolute',
    bottom: -100,
    left: '25%',
    right: '25%',
    height: 250,
    backgroundColor: '#EC4899',
    borderRadius: 9999,
    opacity: 0.08,
    ...(Platform.OS === 'web' ? { filter: 'blur(80px)' } : {}),
  },
});
