import { useState } from "react";
import { ScrollView, Text, View, TextInput, Modal, ActivityIndicator, Pressable, Alert, Platform } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming } from "react-native-reanimated";
import { ScreenContainer } from "@/components/screen-container";
import { GradientBackground } from "@/components/gradient-background";
import { AnimatedCard } from "@/components/animated-card";
import { NeonLiquidButton } from "@/components/neon-liquid-button";
import { useSubscription } from "@/lib/subscription-provider";
import { useColors } from "@/hooks/use-colors";
import { LinearGradient } from "expo-linear-gradient";
import { usePulseAnimation, useGlowAnimation } from "@/lib/animations";
import { trpc } from "@/lib/trpc";
import { router, Link } from "expo-router";
import { TouchableOpacity } from "react-native";
import { INDUSTRY_TEMPLATES, getTemplateByIndustry } from "@/shared/industry-templates";
import { TemplateBrowserModal } from "@/components/template-browser-modal";
import type { PromoTemplate } from "@/lib/template-library";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const GENERATION_MESSAGES = [
  "Crafting your flyer...",
  "Designing your social post...",
  "Generating video ad...",
  "Writing compelling copy...",
  "Adding final touches...",
];

const STYLE_CHIPS = [
  { id: 'hype', label: 'HYPE', icon: '🔥', color: '#F97316' },
  { id: 'insta', label: 'INSTA', icon: '📸', color: '#6366F1' },
  { id: 'video', label: 'VIDEO', icon: '📹', color: '#8B5CF6' },
  { id: 'info', label: 'INFO', icon: '📅', color: '#818CF8' },
];

function StyleChip({ chip, isSelected, onToggle }: { chip: typeof STYLE_CHIPS[0]; isSelected: boolean; onToggle: () => void }) {
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handlePress = () => {
    // Shake animation
    translateX.value = withSequence(
      withTiming(5, { duration: 50 }),
      withTiming(-5, { duration: 50 }),
      withTiming(5, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );

    // Scale animation
    scale.value = withSequence(
      withTiming(1.15, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    // Glow pulse on selection
    if (!isSelected) {
      glowOpacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(0.6, { duration: 300 })
      );
    }

    onToggle();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={animatedStyle}
    >
      {/* Glow Background */}
      {isSelected && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              inset: -8,
              borderRadius: 9999,
              zIndex: -1,
            },
            glowStyle,
            Platform.OS === 'web' && {
              boxShadow: `0 0 20px ${chip.color}80, inset 0 0 20px ${chip.color}40`,
            },
          ]}
          className="bg-transparent"
        />
      )}

      <View
        className="px-6 py-3 rounded-full flex-row items-center gap-2"
        style={{
          backgroundColor: isSelected
            ? `${chip.color}20`
            : 'rgba(40, 30, 80, 0.4)',
          borderWidth: 2,
          borderColor: isSelected ? chip.color : 'rgba(99, 102, 241, 0.2)',
          shadowColor: isSelected ? chip.color : 'transparent',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: isSelected ? 0.8 : 0,
          shadowRadius: isSelected ? 12 : 0,
          elevation: isSelected ? 12 : 0,
        }}
      >
        <Text className="text-lg">{chip.icon}</Text>
        <Text
          className="text-sm font-bold"
          style={{ color: isSelected ? chip.color : '#A5B4FC' }}
        >
          {chip.label}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

export default function CreateScreen() {
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['hype']);
  const [templateModalVisible, setTemplateModalVisible] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const { tier, canGenerate, needsUpgrade } = useSubscription();
  const colors = useColors();
  const { data: brandProfile } = trpc.brandProfile.get.useQuery();

  // Get industry template if brand profile exists
  const industryTemplate = brandProfile?.industry
    ? getTemplateByIndustry(brandProfile.industry)
    : null;

  const pulseStyle = usePulseAnimation(!isGenerating && description.trim().length > 0);

  const generateMutation = trpc.promo.generate.useMutation();

  const handleGenerate = async () => {
    if (!description.trim()) return;
    if (!canGenerateContent) {
      Alert.alert("Upgrade Required", "You've reached your monthly generation limit. Upgrade to Pro or Agency for more generations.");
      return;
    }

    setIsGenerating(true);
    setCurrentMessage(0);

    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % GENERATION_MESSAGES.length);
    }, 3000);

    try {
      const result = await generateMutation.mutateAsync({
        description: description.trim(),
        style: selectedStyles[0] as "hype" | "insta" | "video" | "info",
        videoEngine: tier === "pro" || tier === "agency" ? "veo3" : undefined,
      });

      clearInterval(interval);
      setIsGenerating(false);
      setDescription("");

      // Navigate to Assets screen to show generated content
      router.push("/assets");
    } catch (error: any) {
      clearInterval(interval);
      setIsGenerating(false);
      Alert.alert("Generation Failed", error.message || "Failed to generate promotional content. Please try again.");
    }
  };

  const toggleStyle = (styleId: string) => {
    setSelectedStyles(prev =>
      prev.includes(styleId)
        ? prev.filter(id => id !== styleId)
        : [...prev, styleId]
    );
  };

  const handleSelectTemplate = (template: PromoTemplate) => {
    setDescription(template.defaultPrompt);
  };

  // Check if user can generate at all (image gen for free, video for paid)
  const hasVideoStyle = selectedStyles.includes('video');
  const canGenerateContent = canGenerate(hasVideoStyle);

  return (
    <GradientBackground>
      <ScreenContainer className="p-6">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <View className="gap-6">
            {/* Futuristic Header */}
            <AnimatedCard delay={0} className="items-center mt-4 mb-2 bg-transparent border-0">
              <View className="items-center gap-3">
                <Text
                  className="text-5xl font-black text-center"
                  style={{
                    color: '#818CF8',
                    letterSpacing: 1,
                    ...(Platform.OS === 'web' && {
                      textShadow: '0 0 30px rgba(129, 140, 248, 0.6), 0 0 60px rgba(236, 72, 153, 0.3)',
                    }),
                  }}
                >
                  CREATE
                </Text>
                <Text
                  className="text-lg font-semibold text-center"
                  style={{
                    color: '#EC4899',
                    letterSpacing: 2,
                    ...(Platform.OS === 'web' && {
                      textShadow: '0 0 20px rgba(236, 72, 153, 0.5)',
                    }),
                  }}
                >
                  QUANTUM PROMOS
                </Text>
              </View>
            </AnimatedCard>

            {/* Industry Templates */}
            {industryTemplate && (
              <AnimatedCard delay={100} className="p-4">
                <View className="flex-row items-center gap-3 mb-3">
                  <Text className="text-3xl">{industryTemplate.icon}</Text>
                  <View className="flex-1">
                    <Text className="text-base font-bold" style={{ color: '#F8F9FF' }}>
                      {industryTemplate.name} Templates
                    </Text>
                    <Text className="text-sm" style={{ color: '#A5B4FC' }}>
                      {industryTemplate.description}
                    </Text>
                  </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
                  {industryTemplate.exampleCampaigns.map((example, idx) => (
                    <Pressable
                      key={idx}
                      onPress={() => setDescription(example)}
                      style={({ pressed }) => ({
                        opacity: pressed ? 0.7 : 1,
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 16,
                        marginRight: 8,
                        borderWidth: 1,
                        borderColor: 'rgba(129, 140, 248, 0.3)',
                      })}
                    >
                      <Text className="text-sm" style={{ color: '#F8F9FF' }}>
                        {example}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </AnimatedCard>
            )}

            {/* Setup Brand Profile Alert */}
            {!brandProfile && (
              <AnimatedCard delay={100}>
                <Link href="/brand-profile-setup" asChild>
                  <TouchableOpacity>
                    <View className="flex-row items-center justify-between px-6 py-4">
                      <View className="flex-row items-center gap-3">
                        <Text className="text-2xl">⚠️</Text>
                        <Text className="text-base font-semibold" style={{ color: '#F8F9FF' }}>
                          SETUP BRAND PROFILE
                        </Text>
                      </View>
                      <Text className="text-xl" style={{ color: '#A5B4FC' }}>→</Text>
                    </View>
                  </TouchableOpacity>
                </Link>
              </AnimatedCard>
            )}

            {/* Browse Templates Button */}
            <AnimatedCard delay={150}>
              <NeonLiquidButton
                label="Browse Templates"
                onPress={() => setTemplateModalVisible(true)}
                icon="📚"
                variant="secondary"
                size="lg"
                colors={['#8B5CF6', '#818CF8']}
                glowColor="#818CF8"
              />
            </AnimatedCard>

            {/* Input Section */}
            <AnimatedCard delay={200} strong className="p-6 gap-4">
              {/* Glassmorphic TextInput with Neon Glow */}
              <View
                style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  shadowColor: inputFocused ? '#818CF8' : 'transparent',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: inputFocused ? 0.8 : 0,
                  shadowRadius: inputFocused ? 20 : 0,
                  elevation: inputFocused ? 16 : 0,
                }}
              >
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  placeholder="Describe the campaign, offer, or idea..."
                  placeholderTextColor="#6B7280"
                  multiline
                  numberOfLines={6}
                  className="text-base min-h-[140px] p-4"
                  style={{
                    textAlignVertical: 'top',
                    backgroundColor: 'rgba(20, 10, 40, 0.7)',
                    color: '#F8F9FF',
                    borderWidth: 2,
                    borderColor: inputFocused ? '#818CF8' : 'rgba(99, 102, 241, 0.3)',
                    fontFamily: 'System',
                    ...(Platform.OS === 'web' && {
                      boxShadow: inputFocused
                        ? 'inset 0 0 20px rgba(129, 140, 248, 0.2), 0 0 20px rgba(129, 140, 248, 0.4)'
                        : 'none',
                    }),
                  }}
                />
              </View>

              {/* Style Chips with Neon Glow */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
              >
                {STYLE_CHIPS.map((chip) => (
                  <StyleChip
                    key={chip.id}
                    chip={chip}
                    isSelected={selectedStyles.includes(chip.id)}
                    onToggle={() => toggleStyle(chip.id)}
                  />
                ))}
              </ScrollView>
            </AnimatedCard>

            {/* Generate Button with Neon Liquid Effect */}
            <Animated.View style={pulseStyle}>
              <NeonLiquidButton
                label="GENERATE"
                onPress={handleGenerate}
                disabled={!description.trim() || !canGenerateContent}
                icon="✨"
                variant="primary"
                size="xl"
                colors={['#818CF8', '#8B5CF6', '#EC4899']}
                glowColor="#EC4899"
              />
            </Animated.View>

            {/* Upgrade Prompt */}
            {needsUpgrade('video') && (
              <AnimatedCard delay={300}>
                <View className="p-4 flex-row items-center gap-3">
                  <Text className="text-xl">👑</Text>
                  <Text className="text-sm flex-1" style={{ color: '#FCD34D' }}>
                    Upgrade to Pro to unlock video generation
                  </Text>
                </View>
              </AnimatedCard>
            )}
          </View>
        </ScrollView>
      </ScreenContainer>

      {/* Dramatic Neon Generation Modal */}
      <Modal
        visible={isGenerating}
        transparent
        animationType="fade"
      >
        <View
          className="flex-1 items-center justify-center p-6"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
          }}
        >
          <Animated.View
            style={{
              width: '100%',
              maxWidth: 380,
              borderRadius: 24,
              overflow: 'hidden',
              shadowColor: '#818CF8',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
              shadowRadius: 40,
              elevation: 20,
              ...(Platform.OS === 'web' && {
                boxShadow: '0 0 60px rgba(129, 140, 248, 0.8), 0 0 100px rgba(236, 72, 153, 0.4), inset 0 0 30px rgba(129, 140, 248, 0.2)',
              }),
            }}
          >
            <LinearGradient
              colors={['rgba(30, 20, 60, 0.98)', 'rgba(20, 10, 40, 0.98)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                padding: 32,
                alignItems: 'center',
                gap: 24,
                borderWidth: 2,
                borderColor: 'rgba(129, 140, 248, 0.6)',
              }}
            >
              {/* Animated Glow Spinner */}
              <View className="items-center gap-4">
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 9999,
                    borderWidth: 3,
                    borderColor: 'transparent',
                    borderTopColor: '#818CF8',
                    borderRightColor: '#EC4899',
                    borderBottomColor: '#818CF8',
                    ...(Platform.OS !== 'web' && {
                      shadowColor: '#818CF8',
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.8,
                      shadowRadius: 16,
                      elevation: 12,
                    }),
                  }}
                />
                {Platform.OS === 'web' && (
                  <View
                    style={{
                      position: 'absolute',
                      width: 80,
                      height: 80,
                      borderRadius: 9999,
                      boxShadow: '0 0 30px rgba(129, 140, 248, 0.8), 0 0 60px rgba(236, 72, 153, 0.4)',
                      pointerEvents: 'none',
                    } as any}
                  />
                )}
              </View>

              {/* Text with Neon Glow */}
              <View className="gap-3 items-center">
                <Text
                  className="text-2xl font-black text-center"
                  style={{
                    color: '#818CF8',
                    letterSpacing: 1,
                    ...(Platform.OS === 'web' && {
                      textShadow: '0 0 20px rgba(129, 140, 248, 0.8)',
                    }),
                  }}
                >
                  CREATING YOUR PROMO
                </Text>
                <Text
                  className="text-base text-center"
                  style={{
                    color: '#EC4899',
                    fontWeight: '600',
                    letterSpacing: 0.5,
                  }}
                >
                  {GENERATION_MESSAGES[currentMessage]}
                </Text>
              </View>

              {/* Neon Progress Bar */}
              <View
                className="w-full h-3 rounded-full overflow-hidden"
                style={{
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  shadowColor: '#818CF8',
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Animated.View
                  style={{
                    height: '100%',
                    width: `${((currentMessage + 1) / GENERATION_MESSAGES.length) * 100}%`,
                    borderRadius: 9999,
                    backgroundColor: '#818CF8',
                    shadowColor: '#818CF8',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 12,
                    elevation: 8,
                  }}
                />
              </View>

              {/* Decorative Elements */}
              <View
                className="w-full"
                style={{
                  height: 1,
                  backgroundColor: 'rgba(236, 72, 153, 0.3)',
                  marginTop: 12,
                }}
              />
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>

      {/* Template Browser Modal */}
      <TemplateBrowserModal
        visible={templateModalVisible}
        onClose={() => setTemplateModalVisible(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </GradientBackground>
  );
}
