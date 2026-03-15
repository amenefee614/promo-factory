import { useState } from "react";
import { View, Text, FlatList, ActivityIndicator, RefreshControl, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { GradientBackground } from "@/components/gradient-background";
import { AnimatedCard } from "@/components/animated-card";
import { GlassCard } from "@/components/glass-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { AssetDetailModal } from "@/components/asset-detail-modal";
import { trpc } from "@/lib/trpc";
import type { PromoBundle } from "@/drizzle/schema";

export default function AssetsScreen() {
  const { data: bundles, isLoading, refetch } = trpc.assets.list.useQuery();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<PromoBundle | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenBundle = (bundle: PromoBundle) => {
    setSelectedBundle(bundle);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedBundle(null), 300);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderBundleCard = ({ item, index }: { item: any; index: number }) => (
    <GlassCard
      delay={index * 100}
      onPress={() => handleOpenBundle(item)}
      neonColor="#A78BFA"
      neonIntensity={0.6}
      className="p-4 mb-4"
    >
      <View className="flex-row items-start gap-4">
        {/* Thumbnail with neon glow */}
        <View
          className="w-20 h-20 rounded-2xl items-center justify-center relative"
          style={{
            backgroundColor: 'rgba(167, 139, 250, 0.15)',
            borderWidth: 2,
            borderColor: 'rgba(167, 139, 250, 0.4)',
            ...(Platform.OS === 'web' && {
              boxShadow: '0 0 20px rgba(167, 139, 250, 0.4)',
            }),
          }}
        >
          <IconSymbol name="photo.stack.fill" size={32} color="#A78BFA" />
        </View>

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row items-start justify-between mb-1">
            <Text
              className="text-base font-bold flex-1"
              style={{
                color: '#F8F9FF',
                letterSpacing: 0.5,
                ...(Platform.OS === 'web' && {
                  textShadow: '0 0 10px rgba(167, 139, 250, 0.5)',
                }),
              }}
            >
              {item.title}
            </Text>
            {item.watermarked && (
              <View
                className="px-3 py-1 rounded-lg ml-2"
                style={{
                  backgroundColor: 'rgba(236, 72, 153, 0.2)',
                  borderWidth: 1,
                  borderColor: 'rgba(236, 72, 153, 0.5)',
                  ...(Platform.OS === 'web' && {
                    boxShadow: '0 0 12px rgba(236, 72, 153, 0.3)',
                  }),
                }}
              >
                <Text className="text-xs font-bold" style={{ color: '#EC4899', letterSpacing: 0.3 }}>
                  ✦ WATERMARKED
                </Text>
              </View>
            )}
          </View>
          <Text className="text-sm mb-2" numberOfLines={2} style={{ color: '#C7D2FE' }}>
            {item.description}
          </Text>
          <Text className="text-xs" style={{ color: '#818CF8', fontWeight: '600' }}>
            {item.createdAt.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </View>

        {/* Arrow with glow */}
        <View
          style={{
            ...(Platform.OS === 'web' && {
              textShadow: '0 0 8px rgba(167, 139, 250, 0.6)',
            }),
          }}
        >
          <IconSymbol name="chevron.right" size={24} color="#A78BFA" />
        </View>
      </View>
    </GlassCard>
  );

  return (
    <GradientBackground>
      <ScreenContainer className="p-6">
        <View className="flex-1 gap-6">
          {/* Header with neon glow */}
          <View className="gap-3 mt-4">
            <Text
              className="text-4xl font-black"
              style={{
                color: '#818CF8',
                letterSpacing: 2,
                ...(Platform.OS === 'web' && {
                  textShadow: '0 0 30px rgba(129, 140, 248, 0.8), 0 0 60px rgba(129, 140, 248, 0.4)',
                }),
              }}
            >
              ASSET VAULT
            </Text>
            <View
              style={{
                height: 2,
                backgroundColor: '#818CF8',
                width: 80,
                borderRadius: 1,
                ...(Platform.OS === 'web' && {
                  boxShadow: '0 0 15px rgba(129, 140, 248, 0.8)',
                }),
              }}
            />
            <Text className="text-base font-semibold" style={{ color: '#C7D2FE' }}>
              Your generated promo bundles
            </Text>
          </View>

          {/* Bundle List */}
          {isLoading ? (
            <GlassCard delay={100} className="p-8 items-center flex-1 justify-center" neonColor="#818CF8">
              <ActivityIndicator size="large" color="#818CF8" />
              <Text className="text-base mt-6 font-semibold" style={{ color: '#C7D2FE', letterSpacing: 0.5 }}>
                Syncing Assets...
              </Text>
            </GlassCard>
          ) : !bundles || bundles.length === 0 ? (
            <GlassCard delay={100} className="p-8 items-center flex-1 justify-center" neonColor="#A78BFA" neonIntensity={0.5}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(167, 139, 250, 0.1)',
                  borderWidth: 2,
                  borderColor: 'rgba(167, 139, 250, 0.3)',
                  marginBottom: 16,
                  ...(Platform.OS === 'web' && {
                    boxShadow: '0 0 25px rgba(167, 139, 250, 0.4)',
                  }),
                }}
              >
                <IconSymbol name="photo.stack.fill" size={44} color="#A78BFA" />
              </View>
              <Text
                className="text-2xl font-black mt-2 text-center"
                style={{
                  color: '#F8F9FF',
                  letterSpacing: 1,
                  ...(Platform.OS === 'web' && {
                    textShadow: '0 0 15px rgba(167, 139, 250, 0.5)',
                  }),
                }}
              >
                NO ASSETS YET
              </Text>
              <Text className="text-sm text-center mt-4 px-4" style={{ color: '#C7D2FE', lineHeight: 20 }}>
                Create your first promo to unlock assets and build your vault
              </Text>
            </GlassCard>
          ) : (
            <FlatList
              data={bundles}
              renderItem={renderBundleCard}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor="#818CF8"
                />
              }
            />
          )}
        </View>
      </ScreenContainer>

      {/* Asset Detail Modal */}
      <AssetDetailModal
        visible={modalVisible}
        onClose={handleCloseModal}
        bundle={selectedBundle}
      />
    </GradientBackground>
  );
}
