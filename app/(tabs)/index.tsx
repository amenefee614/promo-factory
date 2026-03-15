import { ScrollView, Text, View, Pressable, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { GradientBackground } from "@/components/gradient-background";
import { AnimatedCard } from "@/components/animated-card";
import { NeonLiquidButton } from "@/components/neon-liquid-button";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/lib/subscription-provider";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useEffect, useRef } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from "react-native-reanimated";

// Online Status Pulsing Dot Component
function OnlineIndicator() {
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withTiming(1.5, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: 2 - pulseScale.value,
  }));

  return (
    <View className="flex-row items-center gap-2">
      <View className="relative w-3 h-3">
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: 'rgba(16, 185, 129, 0.4)',
            },
            pulseStyle,
          ]}
        />
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: '#34D399',
          }}
        />
      </View>
      <Text style={{ color: '#34D399', fontSize: 12, fontWeight: '600', letterSpacing: 0.5 }}>
        ONLINE
      </Text>
    </View>
  );
}

export default function DashboardScreen() {
  const { user, isAuthenticated } = useAuth();
  const { tier, generationsThisMonth } = useSubscription();
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <GradientBackground>
        <ScreenContainer className="p-6 justify-center items-center">
          <View className="items-center gap-8 w-full max-w-sm">
            {/* Futuristic Branding - Text Only */}
            <AnimatedCard delay={0} className="items-center gap-4 bg-transparent border-0">
              <Text
                className="text-6xl font-black text-center"
                style={{
                  color: '#F8F9FF',
                  ...(Platform.OS === 'web' && {
                    textShadow: '0 0 40px #818CF8, 0 0 60px #A78BFA',
                  }),
                  textShadowColor: Platform.OS !== 'web' ? '#818CF8' : undefined,
                  textShadowOffset: Platform.OS !== 'web' ? { width: 0, height: 0 } : undefined,
                  textShadowRadius: Platform.OS !== 'web' ? 30 : undefined,
                  letterSpacing: 4,
                }}
              >
                PROMO{'\n'}FACTORY
              </Text>
              <View
                style={{
                  height: 2,
                  width: 100,
                  background: 'linear-gradient(90deg, #818CF8, #A78BFA, #EC4899)',
                  borderRadius: 1,
                }}
              />
              <Text
                className="text-lg font-bold text-center"
                style={{
                  color: '#A78BFA',
                  letterSpacing: 4,
                  marginTop: 8,
                }}
              >
                NEXT GEN PROMO SUITE
              </Text>
            </AnimatedCard>

            {/* Auth Card with Glassmorphism */}
            <AnimatedCard
              delay={200}
              className="p-8 w-full"
              neonColor="#818CF8"
              neonIntensity={0.6}
            >
              <Text
                className="text-2xl font-bold text-center mb-3"
                style={{
                  color: '#F8F9FF',
                  ...(Platform.OS === 'web' && {
                    textShadow: '0 0 20px #818CF8',
                  }),
                  letterSpacing: 1.5,
                }}
              >
                Welcome
              </Text>
              <Text className="text-base text-center mb-8" style={{ color: '#C7D2FE' }}>
                Step into the future of promotional content creation. Sign in to unlock unlimited possibilities.
              </Text>
              <NeonLiquidButton
                label="Sign In"
                colors={['#818CF8', '#A78BFA']}
                glowColor="#818CF8"
                size="lg"
                onPress={() => {
                  console.log("Login pressed");
                }}
              />
            </AnimatedCard>

            {/* Features Preview */}
            <AnimatedCard
              delay={400}
              className="p-6 w-full items-center gap-3"
              neonColor="#A78BFA"
              neonIntensity={0.4}
            >
              <Text
                className="text-xs font-bold text-center"
                style={{ color: '#34D399', letterSpacing: 2 }}
              >
                POWERED BY NEXT GEN TECH
              </Text>
              <Text className="text-xs text-center" style={{ color: '#A5B4FC' }}>
                AI-driven design • Real-time collaboration • Infinite variations
              </Text>
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
            {/* Welcome Section with Online Status */}
            <AnimatedCard delay={0} className="gap-3 mt-4 bg-transparent border-0">
              <View className="justify-between items-start">
                <View className="flex-1">
                  <Text
                    className="text-4xl font-black"
                    style={{
                      color: '#F8F9FF',
                      ...(Platform.OS === 'web' && {
                        textShadow: '0 0 30px #818CF8, 0 0 50px #A78BFA',
                      }),
                      letterSpacing: 1.5,
                      marginBottom: 8,
                    }}
                  >
                    Welcome{user?.name ? `, ${user.name}` : ''}
                  </Text>
                  <Text className="text-base" style={{ color: '#C7D2FE', letterSpacing: 0.5 }}>
                    Your creative command center awaits
                  </Text>
                </View>
                <OnlineIndicator />
              </View>
            </AnimatedCard>

            {/* Stats Section - Enhanced */}
            <View className="gap-4">
              <View className="flex-row gap-4">
                <AnimatedCard
                  delay={100}
                  className="flex-1 p-6"
                  neonColor="#818CF8"
                  neonIntensity={0.8}
                >
                  <Text className="text-xs font-bold mb-2" style={{ color: '#34D399', letterSpacing: 1 }}>
                    GENERATIONS
                  </Text>
                  <Text
                    className="text-5xl font-black"
                    style={{
                      color: '#818CF8',
                      ...(Platform.OS === 'web' && {
                        textShadow: '0 0 20px #818CF8, 0 0 40px #818CF8',
                      }),
                      marginBottom: 4,
                    }}
                  >
                    {generationsThisMonth}
                  </Text>
                  <Text className="text-xs" style={{ color: '#A5B4FC', letterSpacing: 0.5 }}>
                    This Month
                  </Text>
                </AnimatedCard>

                <AnimatedCard
                  delay={150}
                  className="flex-1 p-6"
                  neonColor="#A78BFA"
                  neonIntensity={0.8}
                >
                  <Text className="text-xs font-bold mb-2" style={{ color: '#34D399', letterSpacing: 1 }}>
                    CURRENT TIER
                  </Text>
                  <Text
                    className="text-5xl font-black capitalize"
                    style={{
                      color: '#A78BFA',
                      ...(Platform.OS === 'web' && {
                        textShadow: '0 0 20px #A78BFA, 0 0 40px #A78BFA',
                      }),
                      marginBottom: 4,
                    }}
                  >
                    {tier}
                  </Text>
                  <Text className="text-xs" style={{ color: '#A5B4FC', letterSpacing: 0.5 }}>
                    Plan Status
                  </Text>
                </AnimatedCard>
              </View>
            </View>

            {/* Quick Action Cards - Futuristic Grid */}
            <View>
              <Text
                className="text-sm font-bold mb-4"
                style={{ color: '#34D399', letterSpacing: 2 }}
              >
                QUICK ACTIONS
              </Text>
              <View className="gap-3">
                <View className="flex-row gap-3">
                  <AnimatedCard
                    delay={200}
                    className="flex-1 p-0 overflow-hidden"
                    neonColor="#EC4899"
                    neonIntensity={0.6}
                  >
                    <Pressable
                      onPress={() => router.push('/calendar')}
                      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                      className="p-5 items-center gap-3"
                    >
                      <Text className="text-4xl">📅</Text>
                      <Text
                        className="text-sm font-bold text-center"
                        style={{ color: '#F8F9FF', letterSpacing: 1 }}
                      >
                        Calendar
                      </Text>
                      <Text className="text-xs" style={{ color: '#A5B4FC' }}>
                        Schedule
                      </Text>
                    </Pressable>
                  </AnimatedCard>

                  <AnimatedCard
                    delay={220}
                    className="flex-1 p-0 overflow-hidden"
                    neonColor="#34D399"
                    neonIntensity={0.6}
                  >
                    <Pressable
                      onPress={() => router.push('/(tabs)/assets')}
                      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                      className="p-5 items-center gap-3"
                    >
                      <Text className="text-4xl">🎨</Text>
                      <Text
                        className="text-sm font-bold text-center"
                        style={{ color: '#F8F9FF', letterSpacing: 1 }}
                      >
                        Assets
                      </Text>
                      <Text className="text-xs" style={{ color: '#A5B4FC' }}>
                        Library
                      </Text>
                    </Pressable>
                  </AnimatedCard>
                </View>

                <AnimatedCard
                  delay={240}
                  className="p-0 overflow-hidden w-full"
                  neonColor="#818CF8"
                  neonIntensity={0.6}
                >
                  <Pressable
                    onPress={() => router.push('/(tabs)/analytics')}
                    style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                    className="p-5 flex-row items-center gap-4"
                  >
                    <Text className="text-4xl">📊</Text>
                    <View className="flex-1">
                      <Text
                        className="text-sm font-bold"
                        style={{ color: '#F8F9FF', letterSpacing: 1 }}
                      >
                        Analytics
                      </Text>
                      <Text className="text-xs" style={{ color: '#A5B4FC' }}>
                        Performance Metrics
                      </Text>
                    </View>
                    <Text style={{ color: '#818CF8', fontSize: 18 }}>→</Text>
                  </Pressable>
                </AnimatedCard>
              </View>
            </View>

            {/* Create CTA - Premium Feel */}
            <AnimatedCard
              delay={260}
              className="p-8 overflow-hidden"
              neonColor="#EC4899"
              neonIntensity={1}
            >
              <Text
                className="text-2xl font-black mb-3"
                style={{
                  color: '#F8F9FF',
                  ...(Platform.OS === 'web' && {
                    textShadow: '0 0 20px #EC4899',
                  }),
                  letterSpacing: 2,
                }}
              >
                INSTANT PROMO
              </Text>
              <Text className="text-sm mb-6" style={{ color: '#C7D2FE', lineHeight: 20 }}>
                Generate a complete promotional bundle in seconds. AI-powered designs, social posts, video ads, and copy.
              </Text>
              <NeonLiquidButton
                label="Create New Promo"
                colors={['#EC4899', '#818CF8']}
                glowColor="#EC4899"
                size="lg"
                onPress={() => router.push('/(tabs)/create')}
              />
            </AnimatedCard>

            {/* Recent Activity */}
            <View className="gap-3">
              <Text
                className="text-sm font-bold"
                style={{ color: '#34D399', letterSpacing: 2 }}
              >
                RECENT ACTIVITY
              </Text>
              <AnimatedCard delay={250} className="p-8" neonColor="#A78BFA" neonIntensity={0.5}>
                <View className="items-center py-6">
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      backgroundColor: 'rgba(129, 140, 248, 0.1)',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 16,
                    }}
                  >
                    <IconSymbol name="photo.stack.fill" size={32} color="#818CF8" />
                  </View>
                  <Text
                    className="text-base font-semibold text-center"
                    style={{ color: '#F8F9FF', marginBottom: 4 }}
                  >
                    No Promos Yet
                  </Text>
                  <Text className="text-sm text-center" style={{ color: '#A5B4FC' }}>
                    Your creations will appear here
                  </Text>
                </View>
              </AnimatedCard>
            </View>

            {/* Upgrade Card - Neon Pink */}
            {tier === 'free' && (
              <AnimatedCard
                delay={300}
                className="p-8 overflow-hidden"
                neonColor="#EC4899"
                neonIntensity={1}
              >
                <View className="gap-4">
                  <View className="flex-row items-start gap-3">
                    <Text className="text-5xl">⚡</Text>
                    <View className="flex-1">
                      <Text
                        className="text-xl font-black mb-2"
                        style={{
                          color: '#F8F9FF',
                          ...(Platform.OS === 'web' && {
                            textShadow: '0 0 20px #EC4899',
                          }),
                          letterSpacing: 1.5,
                        }}
                      >
                        UNLOCK PRO
                      </Text>
                      <Text className="text-sm mb-4" style={{ color: '#C7D2FE' }}>
                        Unlimited generations • Video exports • Brand kit • Advanced analytics
                      </Text>
                    </View>
                  </View>
                  <NeonLiquidButton
                    label="Upgrade to Pro"
                    colors={['#EC4899', '#F472B6']}
                    glowColor="#EC4899"
                    size="lg"
                    onPress={() => router.push("/upgrade")}
                  />
                </View>
              </AnimatedCard>
            )}
          </View>
        </ScrollView>
      </ScreenContainer>
    </GradientBackground>
  );
}
