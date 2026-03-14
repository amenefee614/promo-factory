import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { AnimatedCard } from "@/components/animated-card";
import { AnimatedButton } from "@/components/animated-button";
import { trpc } from "@/lib/trpc";
import * as ImagePicker from "expo-image-picker";
import { useColors } from "@/hooks/use-colors";

const INDUSTRIES = [
  "Restaurant",
  "Salon & Beauty",
  "Fitness & Wellness",
  "Retail & E-commerce",
  "Real Estate",
  "Healthcare",
  "Education",
  "Events & Entertainment",
  "Tech & SaaS",
  "Professional Services",
  "Other",
];

const BRAND_VOICES = [
  { value: "professional", label: "Professional", description: "Formal and trustworthy" },
  { value: "casual", label: "Casual", description: "Friendly and approachable" },
  { value: "playful", label: "Playful", description: "Fun and energetic" },
  { value: "luxury", label: "Luxury", description: "Elegant and premium" },
  { value: "bold", label: "Bold", description: "Confident and daring" },
] as const;

export default function BrandProfileSetup() {
  const colors = useColors();
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#6366F1");
  const [secondaryColor, setSecondaryColor] = useState("#8B5CF6");
  const [accentColor, setAccentColor] = useState("#EC4899");
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [tagline, setTagline] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [brandVoice, setBrandVoice] = useState<"professional" | "casual" | "playful" | "luxury" | "bold">("professional");

  const createMutation = trpc.brandProfile.create.useMutation();

  const pickImage = async () => {
    if (Platform.OS === "web") {
      Alert.alert("Not Available", "Image upload is only available on mobile devices");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setLogoUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!businessName || !industry) {
      Alert.alert("Missing Information", "Please fill in business name and industry");
      return;
    }

    try {
      await createMutation.mutateAsync({
        businessName,
        industry,
        primaryColor,
        secondaryColor,
        accentColor,
        logoUrl: logoUri || undefined,
        tagline: tagline || undefined,
        targetAudience: targetAudience || undefined,
        brandVoice,
      });

      Alert.alert("Success", "Brand profile saved!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to save brand profile");
    }
  };

  return (
    <ScreenContainer>
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Header */}
          <AnimatedCard delay={0} className="p-6">
            <Text className="text-3xl font-bold text-foreground mb-2">
              Setup Brand Profile
            </Text>
            <Text className="text-base text-muted">
              Tell us about your business so we can create promotional content that matches your brand
            </Text>
          </AnimatedCard>

          {/* Business Name */}
          <AnimatedCard delay={100} className="p-4">
            <Text className="text-sm font-semibold text-foreground mb-2">
              Business Name *
            </Text>
            <TextInput
              value={businessName}
              onChangeText={setBusinessName}
              placeholder="e.g., Joe's Coffee Shop"
              placeholderTextColor={colors.muted}
              className="bg-surface/50 text-foreground px-4 py-3 rounded-xl"
            />
          </AnimatedCard>

          {/* Industry */}
          <AnimatedCard delay={200} className="p-4">
            <Text className="text-sm font-semibold text-foreground mb-2">
              Industry *
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
              {INDUSTRIES.map((ind) => (
                <TouchableOpacity
                  key={ind}
                  onPress={() => setIndustry(ind)}
                  style={{
                    backgroundColor: industry === ind ? colors.primary : colors.surface,
                    opacity: industry === ind ? 1 : 0.7,
                  }}
                  className="px-4 py-2 rounded-full mr-2"
                >
                  <Text
                    style={{
                      color: industry === ind ? "#FFFFFF" : colors.foreground,
                    }}
                    className="font-medium"
                  >
                    {ind}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </AnimatedCard>

          {/* Brand Colors */}
          <AnimatedCard delay={300} className="p-4">
            <Text className="text-sm font-semibold text-foreground mb-3">
              Brand Colors
            </Text>
            <View className="gap-3">
              <View className="flex-row items-center gap-3">
                <View
                  style={{ backgroundColor: primaryColor }}
                  className="w-12 h-12 rounded-xl"
                />
                <View className="flex-1">
                  <Text className="text-xs text-muted mb-1">Primary</Text>
                  <TextInput
                    value={primaryColor}
                    onChangeText={setPrimaryColor}
                    placeholder="#6366F1"
                    placeholderTextColor={colors.muted}
                    className="bg-surface/50 text-foreground px-3 py-2 rounded-lg"
                  />
                </View>
              </View>

              <View className="flex-row items-center gap-3">
                <View
                  style={{ backgroundColor: secondaryColor }}
                  className="w-12 h-12 rounded-xl"
                />
                <View className="flex-1">
                  <Text className="text-xs text-muted mb-1">Secondary</Text>
                  <TextInput
                    value={secondaryColor}
                    onChangeText={setSecondaryColor}
                    placeholder="#8B5CF6"
                    placeholderTextColor={colors.muted}
                    className="bg-surface/50 text-foreground px-3 py-2 rounded-lg"
                  />
                </View>
              </View>

              <View className="flex-row items-center gap-3">
                <View
                  style={{ backgroundColor: accentColor }}
                  className="w-12 h-12 rounded-xl"
                />
                <View className="flex-1">
                  <Text className="text-xs text-muted mb-1">Accent</Text>
                  <TextInput
                    value={accentColor}
                    onChangeText={setAccentColor}
                    placeholder="#EC4899"
                    placeholderTextColor={colors.muted}
                    className="bg-surface/50 text-foreground px-3 py-2 rounded-lg"
                  />
                </View>
              </View>
            </View>
          </AnimatedCard>

          {/* Brand Voice */}
          <AnimatedCard delay={400} className="p-4">
            <Text className="text-sm font-semibold text-foreground mb-3">
              Brand Voice
            </Text>
            <View className="gap-2">
              {BRAND_VOICES.map((voice) => (
                <TouchableOpacity
                  key={voice.value}
                  onPress={() => setBrandVoice(voice.value)}
                  style={{
                    backgroundColor: brandVoice === voice.value ? colors.primary + "20" : colors.surface,
                    borderColor: brandVoice === voice.value ? colors.primary : "transparent",
                    borderWidth: 2,
                  }}
                  className="p-3 rounded-xl"
                >
                  <Text className="text-base font-semibold text-foreground">
                    {voice.label}
                  </Text>
                  <Text className="text-sm text-muted mt-1">
                    {voice.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </AnimatedCard>

          {/* Optional Fields */}
          <AnimatedCard delay={500} className="p-4">
            <Text className="text-sm font-semibold text-foreground mb-2">
              Tagline (Optional)
            </Text>
            <TextInput
              value={tagline}
              onChangeText={setTagline}
              placeholder="e.g., Fresh coffee, fresh vibes"
              placeholderTextColor={colors.muted}
              className="bg-surface/50 text-foreground px-4 py-3 rounded-xl mb-4"
            />

            <Text className="text-sm font-semibold text-foreground mb-2">
              Target Audience (Optional)
            </Text>
            <TextInput
              value={targetAudience}
              onChangeText={setTargetAudience}
              placeholder="e.g., Young professionals, coffee lovers"
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={3}
              className="bg-surface/50 text-foreground px-4 py-3 rounded-xl"
            />
          </AnimatedCard>

          {/* Save Button */}
          <AnimatedButton
            onPress={handleSave}
            disabled={createMutation.isPending}
            className="mt-4"
          >
            <Text className="text-lg font-bold text-white text-center">
              {createMutation.isPending ? "Saving..." : "Save Brand Profile"}
            </Text>
          </AnimatedButton>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
