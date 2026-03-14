import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated from 'react-native-reanimated';
import { GlassCard, GlassCardProps } from './glass-card';
import { useFadeInScale, usePressAnimation } from '@/lib/animations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AnimatedCardProps extends GlassCardProps {
  delay?: number;
  onPress?: () => void;
  disabled?: boolean;
}

export function AnimatedCard({
  children,
  delay = 0,
  onPress,
  disabled = false,
  ...props
}: AnimatedCardProps) {
  const [isPressed, setIsPressed] = React.useState(false);
  
  const entranceStyle = useFadeInScale(delay);
  const pressStyle = usePressAnimation(isPressed && !disabled);

  if (onPress && !disabled) {
    return (
      <AnimatedPressable
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={onPress}
        style={[entranceStyle, pressStyle]}
      >
        <GlassCard {...props}>{children}</GlassCard>
      </AnimatedPressable>
    );
  }

  return (
    <Animated.View style={entranceStyle}>
      <GlassCard {...props}>{children}</GlassCard>
    </Animated.View>
  );
}
