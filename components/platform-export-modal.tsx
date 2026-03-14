import { useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  Pressable,
  Alert,
  Platform as RNPlatform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { GlassCard } from "@/components/glass-card";
import {
  POPULAR_PLATFORMS,
  getPlatformConfig,
  type PlatformType,
} from "@/lib/platform-export";
import * as Haptics from "expo-haptics";

interface PlatformExportModalProps {
  visible: boolean;
  onClose: () => void;
  assetUrl: string;
  assetTitle: string;
}

export function PlatformExportModal({
  visible,
  onClose,
  assetUrl,
  assetTitle,
}: PlatformExportModalProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<PlatformType>>(
    new Set(POPULAR_PLATFORMS)
  );
  const [exporting, setExporting] = useState(false);

  const togglePlatform = (platformId: PlatformType) => {
    if (RNPlatform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setSelectedPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(platformId)) {
        next.delete(platformId);
      } else {
        next.add(platformId);
      }
      return next;
    });
  };

  const handleExportAll = async () => {
    if (selectedPlatforms.size === 0) {
      Alert.alert("No Platforms Selected", "Please select at least one platform to export");
      return;
    }

    setExporting(true);

    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (RNPlatform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      Alert.alert(
        "Export Complete!",
        `Successfully exported to ${selectedPlatforms.size} platform${selectedPlatforms.size > 1 ? "s" : ""}`,
        [{ text: "OK", onPress: onClose }]
      );
    } catch (error) {
      Alert.alert("Export Failed", "Failed to export images. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}>
        <LinearGradient
          colors={["rgba(99, 102, 241, 0.1)", "rgba(168, 85, 247, 0.1)"]}
          className="flex-1"
        >
          <ScrollView
            className="flex-1 pt-16 px-6"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-1">
                <Text className="text-2xl font-bold" style={{ color: "#F8F9FF" }}>
                  Export to Platforms
                </Text>
                <Text className="text-sm mt-1" style={{ color: "#A5B4FC" }}>
                  Select platforms to export optimized versions
                </Text>
              </View>
              <Pressable
                onPress={onClose}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.6 : 1,
                  padding: 8,
                })}
              >
                <IconSymbol name="xmark" size={24} color="#F8F9FF" />
              </Pressable>
            </View>

            {/* Platform Grid */}
            <View className="gap-3 mb-6">
              {POPULAR_PLATFORMS.map((platformId) => {
                const config = getPlatformConfig(platformId);
                const isSelected = selectedPlatforms.has(platformId);

                return (
                  <Pressable
                    key={platformId}
                    onPress={() => togglePlatform(platformId)}
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.7 : 1,
                    })}
                  >
                    <GlassCard
                      style={{
                        borderWidth: 2,
                        borderColor: isSelected
                          ? "rgba(129, 140, 248, 0.5)"
                          : "rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <View className="flex-row items-center p-4">
                        {/* Icon */}
                        <View
                          className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                          style={{
                            backgroundColor: isSelected
                              ? "rgba(129, 140, 248, 0.2)"
                              : "rgba(107, 114, 128, 0.2)",
                          }}
                        >
                          <Text className="text-2xl">{config.icon}</Text>
                        </View>

                        {/* Info */}
                        <View className="flex-1">
                          <Text
                            className="text-base font-semibold mb-1"
                            style={{ color: "#F8F9FF" }}
                          >
                            {config.name}
                          </Text>
                          <Text className="text-xs" style={{ color: "#A5B4FC" }}>
                            {config.width} × {config.height} ({config.aspectRatio})
                          </Text>
                        </View>

                        {/* Checkbox */}
                        <View
                          className="w-6 h-6 rounded-full items-center justify-center"
                          style={{
                            backgroundColor: isSelected
                              ? "#818CF8"
                              : "rgba(107, 114, 128, 0.3)",
                          }}
                        >
                          {isSelected && (
                            <IconSymbol name="checkmark" size={16} color="#FFFFFF" />
                          )}
                        </View>
                      </View>
                    </GlassCard>
                  </Pressable>
                );
              })}
            </View>

            {/* Export Button */}
            <Pressable
              onPress={handleExportAll}
              disabled={exporting || selectedPlatforms.size === 0}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                marginBottom: 32,
              })}
            >
              <LinearGradient
                colors={
                  selectedPlatforms.size === 0
                    ? ["rgba(107, 114, 128, 0.5)", "rgba(107, 114, 128, 0.5)"]
                    : ["#818CF8", "#A78BFA"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="py-4 rounded-2xl items-center"
              >
                <Text className="text-base font-bold" style={{ color: "#FFFFFF" }}>
                  {exporting
                    ? "Exporting..."
                    : `Export ${selectedPlatforms.size} Format${selectedPlatforms.size !== 1 ? "s" : ""}`}
                </Text>
              </LinearGradient>
            </Pressable>
          </ScrollView>
        </LinearGradient>
      </View>
    </Modal>
  );
}
