import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';

// Spring configurations
export const springConfig = {
  damping: 15,
  stiffness: 150,
  mass: 0.5,
};

export const bouncySpring = {
  damping: 10,
  stiffness: 100,
  mass: 0.8,
};

// Bounce animation hook
export function useBounceAnimation(trigger: boolean = true) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (trigger) {
      scale.value = withSequence(
        withSpring(1.1, bouncySpring),
        withSpring(1, bouncySpring)
      );
    }
  }, [trigger]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return animatedStyle;
}

// Shake animation hook
export function useShakeAnimation(trigger: boolean = false) {
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (trigger) {
      translateX.value = withSequence(
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [trigger]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return animatedStyle;
}

// Pulse animation hook (continuous)
export function usePulseAnimation(enabled: boolean = true) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (enabled) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      scale.value = withTiming(1, { duration: 300 });
    }
  }, [enabled]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return animatedStyle;
}

// Fade in + scale entrance animation
export function useFadeInScale(delay: number = 0) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) })
    );
    scale.value = withDelay(
      delay,
      withSpring(1, springConfig)
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return animatedStyle;
}

// Float animation (up and down)
export function useFloatAnimation(enabled: boolean = true, duration: number = 2000) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (enabled) {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-10, { duration, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      translateY.value = withTiming(0, { duration: 300 });
    }
  }, [enabled, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return animatedStyle;
}

// Press animation (scale down)
export function usePressAnimation(isPressed: boolean) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(isPressed ? 0.95 : 1, springConfig);
  }, [isPressed]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return animatedStyle;
}

// Glow animation (opacity pulse)
export function useGlowAnimation(enabled: boolean = true) {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    if (enabled) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.5, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      opacity.value = withTiming(0.5, { duration: 300 });
    }
  }, [enabled]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return animatedStyle;
}
