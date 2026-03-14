import { View, Text, StyleSheet } from "react-native";

interface WatermarkOverlayProps {
  show: boolean;
}

/**
 * Watermark overlay component for Free tier generated images
 * Displays "PROMO FACTORY FREE" diagonally across the image
 */
export function WatermarkOverlay({ show }: WatermarkOverlayProps) {
  if (!show) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.watermarkContainer}>
        <Text style={styles.watermarkText}>PROMO FACTORY FREE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  watermarkContainer: {
    transform: [{ rotate: "-45deg" }],
  },
  watermarkText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.3)",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 4,
  },
});
