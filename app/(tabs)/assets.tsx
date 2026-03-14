import { useState } from "react";
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { GradientBackground } from "@/components/gradient-background";
import { AnimatedCard } from "@/components/animated-card";
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
    <AnimatedCard
      delay={index * 100}
      onPress={() => handleOpenBundle(item)}
      className="p-4 mb-4"
    >
      <View className="flex-row items-start gap-3">
        {/* Thumbnail placeholder */}
        <View
          className="w-20 h-20 rounded-xl items-center justify-center"
          style={{
            backgroundColor: 'rgba(129, 140, 248, 0.2)',
          }}
        >
          <IconSymbol name="photo.stack.fill" size={32} color="#818CF8" />
        </View>

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row items-start justify-between mb-1">
            <Text className="text-base font-semibold flex-1" style={{ color: '#F8F9FF' }}>
              {item.title}
            </Text>
            {item.watermarked && (
              <View className="px-2 py-1 rounded" style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)' }}>
                <Text className="text-xs font-medium" style={{ color: '#FCD34D' }}>
                  Watermarked
                </Text>
              </View>
            )}
          </View>
          <Text className="text-sm mb-2" numberOfLines={2} style={{ color: '#A5B4FC' }}>
            {item.description}
          </Text>
          <Text className="text-xs" style={{ color: '#6B7280' }}>
            {item.createdAt.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </View>

        {/* Arrow */}
        <IconSymbol name="chevron.right" size={20} color="#6B7280" />
      </View>
    </AnimatedCard>
  );

  return (
    <GradientBackground>
      <ScreenContainer className="p-6">
        <View className="flex-1 gap-6">
          {/* Header */}
          <AnimatedCard delay={0} className="gap-2 mt-4 bg-transparent border-0">
            <Text className="text-3xl font-bold" style={{ color: '#F8F9FF' }}>
              Assets Library
            </Text>
            <Text className="text-base" style={{ color: '#A5B4FC' }}>
              Your generated promo bundles
            </Text>
          </AnimatedCard>

          {/* Bundle List */}
          {isLoading ? (
            <AnimatedCard delay={100} className="p-8 items-center flex-1 justify-center">
              <ActivityIndicator size="large" color="#818CF8" />
              <Text className="text-base mt-4" style={{ color: '#A5B4FC' }}>
                Loading assets...
              </Text>
            </AnimatedCard>
          ) : !bundles || bundles.length === 0 ? (
            <AnimatedCard delay={100} className="p-8 items-center flex-1 justify-center">
              <IconSymbol name="photo.stack.fill" size={64} color="#6B7280" />
              <Text className="text-lg font-semibold mt-4" style={{ color: '#F8F9FF' }}>
                No Assets Yet
              </Text>
              <Text className="text-sm text-center mt-2" style={{ color: '#A5B4FC' }}>
                Create your first promo to see it here
              </Text>
            </AnimatedCard>
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
