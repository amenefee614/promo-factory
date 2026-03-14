import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { customColors, customBorderRadius, customFontSizes } from '@/lib/custom-theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ElasticButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
}

export function ElasticButton({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
}: ElasticButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 10,
      stiffness: 300,
    });
    opacity.value = withTiming(0.8, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 8,
      stiffness: 200,
      overshootClamping: false,
    });
    opacity.value = withTiming(1, { duration: 100 });
  };

  const getGradientColors = (): [string, string, ...string[]] => {
    if (variant === 'primary') return customColors.gradientPrimary as [string, string, ...string[]];
    if (variant === 'secondary') return customColors.gradientSecondary as [string, string, ...string[]];
    return ['transparent', 'transparent'];
  };

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: customBorderRadius.full,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
    };

    if (size === 'small') {
      baseStyle.paddingVertical = 8;
      baseStyle.paddingHorizontal = 16;
    } else if (size === 'large') {
      baseStyle.paddingVertical = 18;
      baseStyle.paddingHorizontal = 32;
    } else {
      baseStyle.paddingVertical = 14;
      baseStyle.paddingHorizontal = 24;
    }

    if (variant === 'outline') {
      baseStyle.borderWidth = 2;
      baseStyle.borderColor = customColors.primary;
      baseStyle.backgroundColor = 'transparent';
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      color: variant === 'outline' ? customColors.primary : customColors.textPrimary,
      fontWeight: '600',
    };

    if (size === 'small') {
      baseStyle.fontSize = customFontSizes.sm;
    } else if (size === 'large') {
      baseStyle.fontSize = customFontSizes.lg;
    } else {
      baseStyle.fontSize = customFontSizes.md;
    }

    return baseStyle;
  };

  if (variant === 'outline') {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[animatedStyle, getButtonStyle(), style, disabled && styles.disabled]}
      >
        <Text style={getTextStyle()}>{title}</Text>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[animatedStyle, style, disabled && styles.disabled]}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[getButtonStyle(), styles.gradient]}
      >
        <Text style={getTextStyle()}>{title}</Text>
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  gradient: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});
