import { ScrollView, Text, View, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { GradientBackground } from "@/components/gradient-background";
import { AnimatedCard } from "@/components/animated-card";
import { AnimatedButton } from "@/components/animated-button";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/lib/subscription-provider";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Image } from "expo-image";

export default function DashboardScreen() {
  const { user, isAuthenticated } = useAuth();
  const { tier, generationsThisMonth } = useSubscription();
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <GradientBackground>
        <ScreenContainer className="p-6 justify-center items-center">
          <View className="items-center gap-6 w-full max-w-sm">
            {/* Hero Title */}
            <AnimatedCard delay={0} className="items-center gap-3 bg-transparent border-0">
              <Text
                className="text-5xl font-bold text-center"
                style={{
                  color: '#F8F9FF',
                  textShadowColor: '#818CF8',
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 20,
                  letterSpacing: 2,
                }}
              >
                PROMO{'\n'}FACTORY
              </Text>
              <Text
                className="text-xl font-bold text-center"
                style={{
                  color: '#C7D2FE',
                  letterSpacing: 3,
                }}
              >
                ULTIMATE
              </Text>
            </AnimatedCard>

            <AnimatedCard delay={200} className="p-8 w-full">
              <Text className="text-xl font-bold text-center mb-4" style={{ color: '#F8F9FF' }}>
                Welcome to Promo Factory
              </Text>
              <Text className="text-base text-center mb-6" style={{ color: '#A5B4FC' }}>
                Sign in to start creating amazing promotional content for your business
              </Text>
              <AnimatedButton
                variant="primary"
                size="lg"
                className="w-full"
                onPress={() => {
                  console.log("Login pressed");
                }}
              >
                Sign In
              </AnimatedButton>
            </AnimatedCard>

            {/* Powered by The Agency */}
            <AnimatedCard delay={400} className="items-center gap-3 py-4 bg-transparent border-0">
              <Text className="text-xs" style={{ color: '#6B7280' }}>
                Powered by
              </Text>
              <Image
                source={{ uri: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663225968004/WB7b2UcQAmrXmfdF2KMFuk/the-agency-logo_80e00e33.png' }}
                style={{ width: 120, height: 80 }}
                contentFit="contain"
              />
            </AnimatedCard>
          </View>
        </ScreenContainer>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <ScreenContainer className="p-6">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <View className="gap-6">
            {/* Welcome Section */}
            <AnimatedCard delay={0} className="gap-2 mt-4 bg-transparent border-0">
              <Text className="text-3xl font-bold" style={{ color: '#F8F9FF' }}>
                Welcome back{user?.name ? `, ${user.name}` : ''}!
              </Text>
              <Text className="text-base" style={{ color: '#A5B4FC' }}>
                Ready to create something amazing today?
              </Text>
            </AnimatedCard>

            {/* Quick Stats */}
            <View className="flex-row gap-4">
              <AnimatedCard delay={100} className="flex-1 p-4">
                <Text className="text-sm mb-1" style={{ color: '#A5B4FC' }}>This Month</Text>
                <Text className="text-2xl font-bold" style={{ color: '#F8F9FF' }}>
                  {generationsThisMonth}
                </Text>
                <Text className="text-xs mt-1" style={{ color: '#6B7280' }}>Promos Created</Text>
              </AnimatedCard>
              <AnimatedCard delay={150} className="flex-1 p-4">
                <Text className="text-sm mb-1" style={{ color: '#A5B4FC' }}>Plan</Text>
                <Text className="text-2xl font-bold capitalize" style={{ color: '#818CF8' }}>
                  {tier}
                </Text>
                <Text className="text-xs mt-1" style={{ color: '#6B7280' }}>Current Tier</Text>
              </AnimatedCard>
            </View>

            {/* Quick Actions */}
            <View className="flex-row gap-4">
              <AnimatedCard delay={200} className="flex-1 p-4">
                <Pressable
                  onPress={() => router.push('/calendar')}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <View className="items-center gap-2">
                    <Text className="text-3xl">📅</Text>
                    <Text className="text-sm font-semibold text-center" style={{ color: '#F8F9FF' }}>
                      Calendar
                    </Text>
                  </View>
                </Pressable>
              </AnimatedCard>
              <AnimatedCard delay={220} className="flex-1 p-4">
                <Pressable
                  onPress={() => router.push('/(tabs)/assets')}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <View className="items-center gap-2">
                    <Text className="text-3xl">📚</Text>
                    <Text className="text-sm font-semibold text-center" style={{ color: '#F8F9FF' }}>
                      Assets
                    </Text>
                  </View>
                </Pressable>
              </AnimatedCard>
              <AnimatedCard delay={240} className="flex-1 p-4">
                <Pressable
                  onPress={() => router.push('/(tabs)/analytics')}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <View className="items-center gap-2">
                    <Text className="text-3xl">📊</Text>
                    <Text className="text-sm font-semibold text-center" style={{ color: '#F8F9FF' }}>
                      Analytics
                    </Text>
                  </View>
                </Pressable>
              </AnimatedCard>
            </View>

            {/* Create CTA */}
            <AnimatedCard delay={260} strong className="p-6">
              <Text className="text-xl font-bold mb-2" style={{ color: '#F8F9FF' }}>
                Quick Win Promo
              </Text>
              <Text className="text-sm mb-4" style={{ color: '#A5B4FC' }}>
                Generate a complete promo bundle in seconds: flyer, social posts, video ad, and compelling copy.
              </Text>
              <AnimatedButton
                variant="primary"
                size="lg"
                className="w-full"
                onPress={() => router.push('/(tabs)/create')}
              >
                Create New Promo
              </AnimatedButton>
            </AnimatedCard>

            {/* Recent Activity */}
            <View className="gap-3">
              <Text className="text-lg font-semibold" style={{ color: '#F8F9FF' }}>
                Recent Activity
              </Text>
              <AnimatedCard delay={250} className="p-4">
                <View className="items-center py-8">
                  <IconSymbol name="photo.stack.fill" size={48} color="#6B7280" />
                  <Text className="text-base mt-4 text-center" style={{ color: '#A5B4FC' }}>
                    No promos yet
                  </Text>
                  <Text className="text-sm text-center mt-2" style={{ color: '#6B7280' }}>
                    Create your first promo to see it here
                  </Text>
                </View>
              </AnimatedCard>
            </View>

            {/* Upgrade Prompt for Free Users */}
            {tier === 'free' && (
              <AnimatedCard delay={300} className="p-6 border-2" style={{ borderColor: 'rgba(129, 140, 248, 0.4)' }}>
                <View className="flex-row items-start gap-3">
                  <Text className="text-3xl">👑</Text>
                  <View className="flex-1">
                    <Text className="text-lg font-bold mb-2" style={{ color: '#F8F9FF' }}>
                      Unlock Pro Features
                    </Text>
                    <Text className="text-sm mb-4" style={{ color: '#C7D2FE' }}>
                      Get unlimited generations, video ads, and no watermarks
                    </Text>
                    <Pressable
                      style={({ pressed }) => [
                        {
                          opacity: pressed ? 0.7 : 1,
                        },
                      ]}
                      onPress={() => {
                        router.push("/upgrade");
                      }}
                    >
                      <Text className="font-semibold" style={{ color: '#818CF8' }}>
                        Upgrade Now →
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </AnimatedCard>
            )}
          </View>
        </ScrollView>
      </ScreenContainer>
    </GradientBackground>
  );
}
