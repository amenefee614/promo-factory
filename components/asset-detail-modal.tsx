import { useState } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  Modal,
  ScrollView,
  Pressable,
  Alert,
  Platform,
  Share,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { useColors } from "@/hooks/use-colors";
import { GlassCard } from "@/components/glass-card";
import { WatermarkOverlay } from "@/components/watermark-overlay";
import { PlatformExportModal } from "@/components/platform-export-modal";
import type { PromoBundle } from "@/drizzle/schema";

interface AssetDetailModalProps {
  visible: boolean;
  onClose: () => void;
  bundle: PromoBundle | null;
}

type AssetType = "flyer" | "story" | "feed" | "copy";

export function AssetDetailModal({ visible, onClose, bundle }: AssetDetailModalProps) {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<AssetType>("flyer");
  const [downloading, setDownloading] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);

  if (!bundle) return null;

  const assets = {
    flyer: { url: bundle.flyerUrl, title: "Flyer" },
    story: { url: bundle.storyUrl, title: "Instagram Story" },
    feed: { url: bundle.feedPostUrl, title: "Feed Post" },
    copy: { url: null, title: "Copy Pack" },
  };

  const currentAsset = assets[activeTab];

  const handleDownload = async () => {
    if (!currentAsset.url) {
      Alert.alert("No Asset", "This asset is not available");
      return;
    }

    if (Platform.OS === "web") {
      // Web: Open in new tab
      window.open(currentAsset.url, "_blank");
      return;
    }

    try {
      setDownloading(true);
      
      // Download file
      const fileUri = `${FileSystem.documentDirectory!}${activeTab}-${Date.now()}.png`;
      const downloadResult = await FileSystem.downloadAsync(currentAsset.url, fileUri);

      if (downloadResult.status === 200) {
        // Share file
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(downloadResult.uri);
        } else {
          Alert.alert("Success", "Image downloaded successfully");
        }
      } else {
        throw new Error("Download failed");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to download image");
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!currentAsset.url) return;

    try {
      await Share.share({
        message: `Check out my ${currentAsset.title}!`,
        url: currentAsset.url,
      });
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  const renderCopyPack = () => (
    <ScrollView className="flex-1 p-4">
      <View className="gap-4">
        {bundle.headline && (
          <View className="p-4 rounded-2xl" style={{ backgroundColor: colors.surface }}>
            <Text className="text-sm font-semibold text-muted mb-2">Headline</Text>
            <Text className="text-lg font-bold text-foreground">{bundle.headline}</Text>
          </View>
        )}

        {bundle.caption && (
          <View className="p-4 rounded-2xl" style={{ backgroundColor: colors.surface }}>
            <Text className="text-sm font-semibold text-muted mb-2">Caption</Text>
            <Text className="text-base text-foreground">{bundle.caption}</Text>
          </View>
        )}

        {bundle.cta && (
          <View className="p-4 rounded-2xl" style={{ backgroundColor: colors.surface }}>
            <Text className="text-sm font-semibold text-muted mb-2">Call to Action</Text>
            <Text className="text-base font-bold text-foreground">{bundle.cta}</Text>
          </View>
        )}

        {bundle.hooks && (
          <View className="p-4 rounded-2xl" style={{ backgroundColor: colors.surface }}>
            <Text className="text-sm font-semibold text-muted mb-2">Taglines & Hooks</Text>
            {JSON.parse(bundle.hooks).map((hook: string, index: number) => (
              <Text key={index} className="text-base text-foreground mb-2">
                • {hook}
              </Text>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        {/* Header */}
        <View
          className="flex-row items-center justify-between px-6 py-4"
          style={{
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Text className="text-xl font-bold text-foreground">{bundle.title}</Text>
          <Pressable onPress={onClose}>
            <Text className="text-2xl text-foreground">×</Text>
          </Pressable>
        </View>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-6 py-4"
          style={{ backgroundColor: colors.surface }}
        >
          {(Object.keys(assets) as AssetType[]).map((type) => (
            <Pressable
              key={type}
              onPress={() => setActiveTab(type)}
              className="mr-3"
            >
              <View
                className="px-4 py-2 rounded-full"
                style={{
                  backgroundColor:
                    activeTab === type ? colors.primary : "transparent",
                  borderWidth: 1,
                  borderColor: activeTab === type ? colors.primary : colors.border,
                }}
              >
                <Text
                  className="font-semibold"
                  style={{
                    color: activeTab === type ? "#FFFFFF" : colors.foreground,
                  }}
                >
                  {assets[type].title}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* Content */}
        <View className="flex-1">
          {activeTab === "copy" ? (
            renderCopyPack()
          ) : currentAsset.url ? (
            <ScrollView className="flex-1">
              <View style={{ position: "relative" }}>
                <Image
                  source={{ uri: currentAsset.url }}
                  style={{ width: "100%", aspectRatio: activeTab === "story" ? 9 / 16 : 1 }}
                  contentFit="contain"
                />
                <WatermarkOverlay show={bundle.watermarked === 1} />
              </View>
              
              {bundle.watermarked === 1 && (
                <View className="p-4">
                  <GlassCard className="p-4">
                    <Text className="text-sm text-muted text-center">
                      🔒 Watermarked - Upgrade to Pro to remove watermark
                    </Text>
                  </GlassCard>
                </View>
              )}
            </ScrollView>
          ) : (
            <View className="flex-1 items-center justify-center p-6">
              <Text className="text-base text-muted text-center">
                This asset is not available
              </Text>
            </View>
          )}
        </View>

        {/* Actions */}
        {currentAsset.url && (
          <View className="p-6 gap-3" style={{ backgroundColor: colors.surface }}>
            {/* Publish to Social Button */}
            <Pressable
              onPress={() => {
                onClose();
                router.push({ pathname: "/publish", params: { imageUrl: currentAsset.url } });
              }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <LinearGradient
                colors={["#10B981", "#059669"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 24,
                  borderRadius: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Text className="text-base font-bold text-white text-center">
                  🚀 Publish to Social
                </Text>
              </LinearGradient>
            </Pressable>

            {/* Export to Platforms Button */}
            <Pressable
              onPress={() => setExportModalVisible(true)}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <LinearGradient
                colors={["#818CF8", "#A78BFA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 24,
                  borderRadius: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Text className="text-base font-bold text-white text-center">
                  📱 Export to Platforms
                </Text>
              </LinearGradient>
            </Pressable>

            {/* Download Button */}
            <Pressable
              onPress={handleDownload}
              disabled={downloading}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <LinearGradient
                colors={[colors.primary, colors.primary + "CC"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 24,
                  borderRadius: 16,
                }}
              >
                <Text className="text-base font-bold text-white text-center">
                  {downloading ? "Downloading..." : "Download"}
                </Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={handleShare}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                backgroundColor: colors.surface,
                borderWidth: 2,
                borderColor: colors.border,
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderRadius: 16,
              })}
            >
              <Text className="text-base font-bold text-foreground text-center">
                Share
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Platform Export Modal */}
      <PlatformExportModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
        assetUrl={currentAsset.url || ""}
        assetTitle={bundle.title}
      />
    </Modal>
  );
}
