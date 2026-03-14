import React, { useState, useEffect } from 'react';
import { audioManager } from '@/lib/audio-manager';
import { Text, Pressable, Platform, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useGlassTheme } from '@/lib/glass-theme-provider';
import { cn } from '@/lib/utils';
import { bouncySpring } from '@/lib/animations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AnimatedButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  textClassName?: string;
}

export function AnimatedButton({
  children,
  variant = 'primary',
  size = 'md',
  className,
  textClassName,
  onPress,
  disabled,
}: AnimatedButtonProps) {
  useEffect(() => {
    audioManager.initialize();
  }, []);

  return (
    <AnimatedButtonInner
      variant={variant}
      size={size}
      className={className}
      textClassName={textClassName}
      onPress={onPress}
      disabled={disabled}
    >
      {children}
    </AnimatedButtonInner>
  );
}

function AnimatedButtonInner({
  children,
  variant = 'primary',
  size = 'md',
  className,
  textClassName,
  onPress,
  disabled,
}: AnimatedButtonProps) {
  const { theme } = useGlassTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, bouncySpring);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, bouncySpring);
  };

  const handlePress = () => {
    if (!disabled) {
      // Play sound
      audioManager.play('button');

      // Bounce animation
      scale.value = withSequence(
        withSpring(1.05, bouncySpring),
        withSpring(1, bouncySpring)
      );

      if (Platform.OS !== 'web') {
        const intensity = {
          low: Haptics.ImpactFeedbackStyle.Light,
          medium: Haptics.ImpactFeedbackStyle.Medium,
          high: Haptics.ImpactFeedbackStyle.Heavy,
        }[theme.animationIntensity];
        Haptics.impactAsync(intensity);
      }

      onPress?.();
    }
  };

  const sizeStyles = {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4',
  }[size];

  const textSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }[size];

  const variantStyles = {
    primary: 'bg-primary',
    secondary: 'bg-surface border border-border',
    ghost: 'bg-transparent',
  }[variant];

  const textVariantStyles = {
    primary: 'text-white font-semibold',
    secondary: 'text-foreground font-medium',
    ghost: 'text-primary font-medium',
  }[variant];

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      style={[
        animatedStyle,
        {
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <View
        className={cn(
          sizeStyles,
          variantStyles,
          `rounded-[${theme.cornerRadius}px]`,
          'items-center justify-center relative overflow-hidden',
          className
        )}
      >
        {/* Glass reflection overlay */}
        {variant !== 'ghost' && (
          <View style={StyleSheet.absoluteFill} className={`rounded-[${theme.cornerRadius}px]`}>
            {/* Top edge highlight - light reflection */}
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[StyleSheet.absoluteFill, { height: '40%' }]}
            />
            {/* Subtle gradient overlay for depth */}
            <LinearGradient
              colors={[
                'rgba(255, 255, 255, 0.15)',
                'rgba(255, 255, 255, 0)',
                'rgba(0, 0, 0, 0.1)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            {/* Edge glow with inner border */}
            <View
              style={StyleSheet.absoluteFill}
              className={`border border-white/20 rounded-[${theme.cornerRadius}px]`}
            />
          </View>
        )}
        <Text className={cn(textSizeStyles, textVariantStyles, textClassName, 'relative z-10')}>
          {children}
        </Text>
      </View>
    </AnimatedPressable>
  );
}
