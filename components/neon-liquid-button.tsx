import { useCallback, useEffect, useState } from "react";
import { Pressable, View, Text, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  interpolate,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Particle that bursts outward on press
function BurstParticle({
  index,
  trigger,
  color,
}: {
  index: number;
  trigger: number;
  color: string;
}) {
  const progress = useSharedValue(0);
  const angle = (index * 360) / 8;
  const radians = (angle * Math.PI) / 180;

  useEffect(() => {
    if (trigger > 0) {
      progress.value = 0;
      progress.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
    }
  }, [trigger]);

  const animatedStyle = useAnimatedStyle(() => {
    const distance = interpolate(progress.value, [0, 1], [0, 40]);
    const opacity = interpolate(progress.value, [0, 0.3, 1], [0, 1, 0]);
    const scale = interpolate(progress.value, [0, 0.5, 1], [0.5, 1.2, 0]);
    return {
      position: "absolute" as const,
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: color,
      opacity,
      transform: [
        { translateX: Math.cos(radians) * distance },
        { translateY: Math.sin(radians) * distance },
        { scale },
      ],
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 4,
    };
  });

  return <AnimatedView style={animatedStyle} />;
}

// Ripple wave that expands from center
function RippleWave({
  trigger,
  color,
  delay,
}: {
  trigger: number;
  color: string;
  delay: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (trigger > 0) {
      progress.value = 0;
      progress.value = withDelay(
        delay,
        withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) })
      );
    }
  }, [trigger]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [0.3, 2.5]);
    const opacity = interpolate(progress.value, [0, 0.3, 1], [0, 0.4, 0]);
    return {
      position: "absolute" as const,
      width: "100%" as any,
      height: "100%" as any,
      borderRadius: 9999,
      borderWidth: 2,
      borderColor: color,
      opacity,
      transform: [{ scale }],
    };
  });

  return <AnimatedView style={animatedStyle} pointerEvents="none" />;
}

// Liquid blob that morphs inside the button
function LiquidBlob({
  trigger,
  baseColor,
}: {
  trigger: number;
  baseColor: string;
}) {
  const morph1 = useSharedValue(1);
  const morph2 = useSharedValue(1);
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (trigger > 0) {
      morph1.value = withSequence(
        withTiming(1.4, { duration: 150, easing: Easing.inOut(Easing.ease) }),
        withSpring(1, { damping: 8, stiffness: 200 })
      );
      morph2.value = withSequence(
        withDelay(50, withTiming(0.7, { duration: 150, easing: Easing.inOut(Easing.ease) })),
        withSpring(1, { damping: 8, stiffness: 200 })
      );
      translateX.value = withSequence(
        withTiming(20, { duration: 200, easing: Easing.out(Easing.cubic) }),
        withSpring(0, { damping: 12, stiffness: 150 })
      );
    }
  }, [trigger]);

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    left: "10%" as any,
    top: "10%" as any,
    width: "30%" as any,
    height: "80%" as any,
    borderRadius: 9999,
    backgroundColor: baseColor,
    opacity: 0.25,
    transform: [
      { scaleX: morph1.value },
      { scaleY: morph2.value },
      { translateX: translateX.value },
    ],
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    position: "absolute" as const,
    right: "10%" as any,
    top: "5%" as any,
    width: "25%" as any,
    height: "90%" as any,
    borderRadius: 9999,
    backgroundColor: baseColor,
    opacity: 0.2,
    transform: [
      { scaleX: morph2.value },
      { scaleY: morph1.value },
      { translateX: -translateX.value * 0.7 },
    ],
  }));

  return (
    <>
      <AnimatedView style={animatedStyle} pointerEvents="none" />
      <AnimatedView style={animatedStyle2} pointerEvents="none" />
    </>
  );
}

type NeonLiquidButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  colors?: string[];
  glowColor?: string;
  icon?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "ghost";
};

export function NeonLiquidButton({
  label,
  onPress,
  disabled = false,
  colors = ["#6366F1", "#8B5CF6", "#EC4899"],
  glowColor = "#818CF8",
  icon,
  size = "md",
  variant = "primary",
}: NeonLiquidButtonProps) {
  const [burstTrigger, setBurstTrigger] = useState(0);
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);
  const borderGlow = useSharedValue(0.3);

  const paddingVertical = size === "sm" ? 12 : size === "md" ? 16 : 22;
  const paddingHorizontal = size === "sm" ? 20 : size === "md" ? 28 : 36;
  const fontSize = size === "sm" ? 14 : size === "md" ? 16 : 20;

  const handlePress = useCallback(() => {
    if (disabled) return;

    // Fire all animations
    scale.value = withSequence(
      withTiming(0.92, { duration: 80, easing: Easing.out(Easing.cubic) }),
      withSpring(1.03, { damping: 8, stiffness: 300 }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );

    glowOpacity.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(0.3, { duration: 500, easing: Easing.out(Easing.cubic) })
    );

    borderGlow.value = withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(0.3, { duration: 600, easing: Easing.out(Easing.cubic) })
    );

    setBurstTrigger((prev) => prev + 1);
    onPress();
  }, [disabled, onPress]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 9999,
    backgroundColor: glowColor,
    opacity: glowOpacity.value,
    ...(Platform.OS === "web"
      ? { filter: `blur(20px)` }
      : {}),
  }));

  const borderGlowStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: glowColor,
    opacity: borderGlow.value,
    ...(Platform.OS === "web"
      ? { boxShadow: `0 0 15px ${glowColor}, inset 0 0 15px ${glowColor}40` }
      : {}),
  }));

  if (variant === "ghost") {
    return (
      <AnimatedPressable onPress={handlePress} style={containerStyle}>
        <View
          style={{
            paddingVertical,
            paddingHorizontal,
            borderRadius: 9999,
            borderWidth: 1,
            borderColor: `${glowColor}50`,
            backgroundColor: `${glowColor}10`,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 8,
          }}
        >
          {icon && <Text style={{ fontSize: fontSize + 2 }}>{icon}</Text>}
          <Text
            style={{
              fontSize,
              fontWeight: "700",
              color: glowColor,
              letterSpacing: 1,
            }}
          >
            {label}
          </Text>
        </View>
      </AnimatedPressable>
    );
  }

  if (variant === "secondary") {
    return (
      <AnimatedPressable onPress={handlePress} style={containerStyle}>
        <View
          style={{
            paddingVertical,
            paddingHorizontal,
            borderRadius: 9999,
            borderWidth: 1.5,
            borderColor: `${glowColor}60`,
            backgroundColor: `${glowColor}15`,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 8,
            overflow: "hidden",
          }}
        >
          <LiquidBlob trigger={burstTrigger} baseColor={glowColor} />
          {icon && <Text style={{ fontSize: fontSize + 2 }}>{icon}</Text>}
          <Text
            style={{
              fontSize,
              fontWeight: "700",
              color: "#F8F9FF",
              letterSpacing: 1,
            }}
          >
            {label}
          </Text>
        </View>
      </AnimatedPressable>
    );
  }

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      {/* Burst particles */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <BurstParticle
          key={i}
          index={i}
          trigger={burstTrigger}
          color={i % 2 === 0 ? colors[0] : colors[2] || colors[0]}
        />
      ))}

      {/* Ripple waves */}
      <RippleWave trigger={burstTrigger} color={glowColor} delay={0} />
      <RippleWave trigger={burstTrigger} color={glowColor} delay={100} />

      <AnimatedPressable
        onPress={handlePress}
        disabled={disabled}
        style={[containerStyle, { opacity: disabled ? 0.4 : 1 }]}
      >
        {/* Outer glow */}
        <AnimatedView style={glowStyle} pointerEvents="none" />

        {/* Neon border glow */}
        <AnimatedView style={borderGlowStyle} pointerEvents="none" />

        <LinearGradient
          colors={disabled ? ["#4B5563", "#374151"] : (colors as [string, string, ...string[]])}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            paddingVertical,
            paddingHorizontal,
            borderRadius: 9999,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            gap: 10,
          }}
        >
          {/* Liquid blobs inside */}
          <LiquidBlob trigger={burstTrigger} baseColor="rgba(255,255,255,0.3)" />

          {/* Glass sheen overlay */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "50%",
              backgroundColor: "rgba(255,255,255,0.1)",
              borderTopLeftRadius: 9999,
              borderTopRightRadius: 9999,
            }}
            pointerEvents="none"
          />

          {icon && (
            <Text style={{ fontSize: fontSize + 4, zIndex: 1 }}>{icon}</Text>
          )}
          <Text
            style={{
              fontSize,
              fontWeight: "800",
              color: "#FFFFFF",
              letterSpacing: 2,
              zIndex: 1,
              ...(Platform.OS === "web"
                ? { textShadow: `0 0 10px rgba(255,255,255,0.5)` }
                : {}),
            }}
          >
            {label}
          </Text>
        </LinearGradient>
      </AnimatedPressable>
    </View>
  );
}
