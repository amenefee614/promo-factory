import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  Platform as RNPlatform,
  Switch,
} from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { ScreenContainer } from "@/components/screen-container";
import { GlassCard } from "@/components/glass-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  characterLimit: number;
}

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { id: "instagram", name: "Instagram", icon: "📸", connected: false, characterLimit: 2200 },
  { id: "facebook", name: "Facebook", icon: "📘", connected: false, characterLimit: 63206 },
  { id: "tiktok", name: "TikTok", icon: "🎵", connected: false, characterLimit: 2200 },
  { id: "linkedin", name: "LinkedIn", icon: "💼", connected: false, characterLimit: 3000 },
  { id: "twitter", name: "Twitter/X", icon: "🐦", connected: false, characterLimit: 280 },
];

export default function PublishScreen() {
  const colors = useColors();
  const params = useLocalSearchParams();
  const [caption, setCaption] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set(["instagram"]));
  const [schedulePost, setSchedulePost] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const togglePlatform = (platformId: string) => {
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

  const handleConnectPlatform = (platformId: string) => {
    Alert.alert(
      "Connect Account",
      `Connect your ${SOCIAL_PLATFORMS.find((p) => p.id === platformId)?.name} account to post directly from Promo Factory.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Connect",
          onPress: () => {
            // In real app, this would trigger OAuth flow
            Alert.alert("Coming Soon", "Social media OAuth integration will be available soon!");
          },
        },
      ]
    );
  };

  const handlePublish = async () => {
    if (selectedPlatforms.size === 0) {
      Alert.alert("No Platforms Selected", "Please select at least one platform to publish to");
      return;
    }

    if (!caption.trim()) {
      Alert.alert("No Caption", "Please add a caption for your post");
      return;
    }

    setPublishing(true);

    try {
      // Simulate publishing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (RNPlatform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      Alert.alert(
        schedulePost ? "Scheduled!" : "Published!",
        schedulePost
          ? `Your post has been scheduled to ${selectedPlatforms.size} platform${selectedPlatforms.size > 1 ? "s" : ""}`
          : `Your post has been published to ${selectedPlatforms.size} platform${selectedPlatforms.size > 1 ? "s" : ""}`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert("Publish Failed", "Failed to publish post. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  const maxCharacterLimit = Math.min(
    ...Array.from(selectedPlatforms).map(
      (id) => SOCIAL_PLATFORMS.find((p) => p.id === id)?.characterLimit || 2200
    )
  );

  const isOverLimit = caption.length > maxCharacterLimit;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Publish to Social",
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
        }}
      />
      <ScreenContainer className="p-6">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="gap-6 pb-6">
            {/* Preview Image */}
            {params.imageUrl && (
              <GlassCard className="overflow-hidden">
                <Image
                  source={{ uri: params.imageUrl as string }}
                  style={{ width: "100%", aspectRatio: 1 }}
                  contentFit="cover"
                />
              </GlassCard>
            )}

            {/* Caption Input */}
            <GlassCard className="p-4">
              <Text
                className="text-base font-bold mb-3"
                style={{ color: colors.foreground }}
              >
                Caption
              </Text>
              <TextInput
                value={caption}
                onChangeText={setCaption}
                placeholder="Write your caption..."
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={6}
                className="text-base min-h-[140px] p-4 rounded-xl"
                style={{
                  textAlignVertical: "top",
                  backgroundColor: "rgba(20, 10, 40, 0.5)",
                  color: colors.foreground,
                  borderWidth: 1,
                  borderColor: isOverLimit
                    ? colors.error
                    : "rgba(99, 102, 241, 0.2)",
                }}
              />
              <View className="flex-row items-center justify-between mt-2">
                <Text
                  className="text-xs"
                  style={{
                    color: isOverLimit ? colors.error : colors.muted,
                  }}
                >
                  {caption.length} / {maxCharacterLimit} characters
                </Text>
                {isOverLimit && (
                  <Text className="text-xs" style={{ color: colors.error }}>
                    Over limit!
                  </Text>
                )}
              </View>
            </GlassCard>

            {/* Select Platforms */}
            <View>
              <Text
                className="text-lg font-bold mb-3"
                style={{ color: colors.foreground }}
              >
                Select Platforms
              </Text>
              <View className="gap-3">
                {SOCIAL_PLATFORMS.map((platform) => {
                  const isSelected = selectedPlatforms.has(platform.id);

                  return (
                    <GlassCard
                      key={platform.id}
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
                          <Text className="text-2xl">{platform.icon}</Text>
                        </View>

                        {/* Info */}
                        <View className="flex-1">
                          <Text
                            className="text-base font-semibold mb-1"
                            style={{ color: colors.foreground }}
                          >
                            {platform.name}
                          </Text>
                          {platform.connected ? (
                            <Text className="text-xs" style={{ color: colors.success }}>
                              ✓ Connected
                            </Text>
                          ) : (
                            <Pressable onPress={() => handleConnectPlatform(platform.id)}>
                              <Text
                                className="text-xs font-semibold"
                                style={{ color: "#818CF8" }}
                              >
                                Connect Account →
                              </Text>
                            </Pressable>
                          )}
                        </View>

                        {/* Checkbox */}
                        <Pressable
                          onPress={() => togglePlatform(platform.id)}
                          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                        >
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
                        </Pressable>
                      </View>
                    </GlassCard>
                  );
                })}
              </View>
            </View>

            {/* Schedule Option */}
            <GlassCard className="p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-4">
                  <Text
                    className="text-base font-semibold mb-1"
                    style={{ color: colors.foreground }}
                  >
                    Schedule for Later
                  </Text>
                  <Text className="text-sm" style={{ color: colors.muted }}>
                    Post at the best time for engagement
                  </Text>
                </View>
                <Switch
                  value={schedulePost}
                  onValueChange={setSchedulePost}
                  trackColor={{ false: "#6B7280", true: "#818CF8" }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </GlassCard>

            {/* Publish Button */}
            <Pressable
              onPress={handlePublish}
              disabled={publishing || isOverLimit || selectedPlatforms.size === 0}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <LinearGradient
                colors={
                  publishing || isOverLimit || selectedPlatforms.size === 0
                    ? ["rgba(107, 114, 128, 0.5)", "rgba(107, 114, 128, 0.5)"]
                    : ["#818CF8", "#A78BFA"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 24,
                  borderRadius: 16,
                }}
              >
                <Text
                  className="text-base font-bold text-white text-center"
                >
                  {publishing
                    ? "Publishing..."
                    : schedulePost
                    ? "Schedule Post"
                    : "Publish Now"}
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenContainer>
    </>
  );
}
