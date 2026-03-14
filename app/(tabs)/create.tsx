import { useState } from "react";
import { Image } from 'expo-image';
import { ScrollView, Text, View, TextInput, Modal, ActivityIndicator, Pressable, Alert } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming } from "react-native-reanimated";
import { ScreenContainer } from "@/components/screen-container";
import { GradientBackground } from "@/components/gradient-background";
import { AnimatedCard } from "@/components/animated-card";
import { useSubscription } from "@/lib/subscription-provider";
import { useColors } from "@/hooks/use-colors";
import { LinearGradient } from "expo-linear-gradient";
import { usePulseAnimation } from "@/lib/animations";
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value },
    ],
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
      withTiming(1.1, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    onToggle();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={animatedStyle}
    >
      <View
        className="px-6 py-3 rounded-full flex-row items-center gap-2"
        style={{
          backgroundColor: isSelected
            ? `${chip.color}40`
            : 'rgba(40, 30, 80, 0.6)',
          borderWidth: 2,
          borderColor: isSelected ? chip.color : 'rgba(99, 102, 241, 0.3)',
        }}
      >
        <Text className="text-lg">{chip.icon}</Text>
        <Text
          className="text-sm font-bold"
          style={{ color: isSelected ? '#F8F9FF' : '#A5B4FC' }}
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
    if (!canGenerateVideo) {
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

  const canGenerateVideo = canGenerate(true);

  return (
    <GradientBackground>
      <ScreenContainer className="p-6">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <View className="gap-6">
            {/* Hero Image */}
            <AnimatedCard delay={0} className="items-center mt-4 mb-2 bg-transparent border-0">
              <Image
                source={{ uri: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663225968004/WB7b2UcQAmrXmfdF2KMFuk/hero-title_bc276b22.png' }}
                style={{ width: 360, height: 360 }}
                contentFit="contain"
              />
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
              <Pressable
                onPress={() => setTemplateModalVisible(true)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <LinearGradient
                  colors={["#A78BFA", "#818CF8"]}
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
                  <Text className="text-2xl">📚</Text>
                  <Text className="text-base font-bold text-white">
                    Browse Templates
                  </Text>
                </LinearGradient>
              </Pressable>
            </AnimatedCard>

            {/* Input Section */}
            <AnimatedCard delay={200} strong className="p-6 gap-4">
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Describe the campaign, offer, or idea..."
                placeholderTextColor="#6B7280"
                multiline
                numberOfLines={6}
                className="text-base min-h-[140px] p-4 rounded-2xl"
                style={{
                  textAlignVertical: 'top',
                  backgroundColor: 'rgba(20, 10, 40, 0.8)',
                  color: '#F8F9FF',
                  borderWidth: 1,
                  borderColor: 'rgba(99, 102, 241, 0.2)',
                }}
              />

              {/* Style Chips */}
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

            {/* Generate Button */}
            <Animated.View style={pulseStyle}>
              <Pressable
                onPress={handleGenerate}
                disabled={!description.trim() || !canGenerateVideo}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.9 : !description.trim() ? 0.5 : 1,
                    transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
                  },
                ]}
              >
                <LinearGradient
                  colors={['#6366F1', '#8B5CF6', '#EC4899']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    paddingVertical: 20,
                    paddingHorizontal: 32,
                    borderRadius: 9999,
                    shadowColor: '#818CF8',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.6,
                    shadowRadius: 20,
                    elevation: 10,
                  }}
                >
                  <View className="flex-row items-center justify-center gap-3">
                    <Text
                      className="text-xl font-bold text-center"
                      style={{
                        color: '#FFFFFF',
                        letterSpacing: 2,
                      }}
                    >
                      GENERATE
                    </Text>
                    <Text className="text-2xl">✨</Text>
                  </View>
                </LinearGradient>
              </Pressable>
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

      {/* Generation Overlay */}
      <Modal
        visible={isGenerating}
        transparent
        animationType="fade"
      >
        <View className="flex-1 items-center justify-center p-6" style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
          <View
            className="w-full max-w-sm p-8 items-center gap-6 rounded-3xl"
            style={{
              backgroundColor: 'rgba(30, 20, 60, 0.95)',
              borderWidth: 1,
              borderColor: 'rgba(129, 140, 248, 0.4)',
            }}
          >
            <ActivityIndicator size="large" color="#818CF8" />
            <View className="gap-2 items-center">
              <Text className="text-xl font-bold text-center" style={{ color: '#F8F9FF' }}>
                Creating Your Promo
              </Text>
              <Text className="text-base text-center" style={{ color: '#A5B4FC' }}>
                {GENERATION_MESSAGES[currentMessage]}
              </Text>
            </View>
            <View className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(99, 102, 241, 0.3)' }}>
              <View
                className="h-full rounded-full"
                style={{
                  width: `${((currentMessage + 1) / GENERATION_MESSAGES.length) * 100}%`,
                  backgroundColor: '#818CF8',
                }}
              />
            </View>
          </View>
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
