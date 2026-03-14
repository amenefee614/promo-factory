import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { GlassCard } from "@/components/glass-card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";
import { audioManager } from "@/lib/audio-manager";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";

type PlanTier = "free" | "pro" | "agency";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: PlanTier;
  name: string;
  price: string;
  priceDetail: string;
  tagline: string;
  features: PlanFeature[];
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    priceDetail: "Forever free",
    tagline: "Get started with basic promo creation",
    features: [
      { text: "5 generations per month", included: true },
      { text: "Basic AI models", included: true },
      { text: "Watermarked exports", included: true },
      { text: "Standard templates", included: true },
      { text: "Basic analytics", included: true },
      { text: "Community support", included: true },
      { text: "Advanced analytics dashboard", included: false },
      { text: "AI Assistant with actions", included: false },
      { text: "HD video generation", included: false },
      { text: "Brand profile system", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    priceDetail: "per month",
    tagline: "Perfect for growing businesses",
    popular: true,
    features: [
      { text: "50 generations per month", included: true },
      { text: "Premium AI models (Veo 3)", included: true },
      { text: "No watermarks", included: true },
      { text: "All templates + industry packs", included: true },
      { text: "Brand profile system", included: true },
      { text: "Advanced analytics dashboard", included: true },
      { text: "AI Assistant with smart actions", included: true },
      { text: "HD video generation", included: true },
      { text: "Priority email support", included: true },
    ],
  },
  {
    id: "agency",
    name: "Agency",
    price: "$99",
    priceDetail: "per month",
    tagline: "For agencies and power users",
    features: [
      { text: "Unlimited generations", included: true },
      { text: "Ultra-premium AI (Sora)", included: true },
      { text: "No watermarks", included: true },
      { text: "White-label exports", included: true },
      { text: "Multi-brand profiles", included: true },
      { text: "Premium analytics + insights", included: true },
      { text: "AI Assistant with automation", included: true },
      { text: "4K video generation", included: true },
      { text: "Dedicated support + API access", included: true },
    ],
  },
];

export default function UpgradeScreen() {
  const { user, refresh } = useAuth();
  const subscription = trpc.subscription.get.useQuery();
  const [loading, setLoading] = useState<PlanTier | null>(null);
  const updateSubscription = trpc.subscription.update.useMutation();

  const currentTier = subscription.data?.tier || "free";

  const handleUpgrade = async (planId: PlanTier) => {
    if (planId === currentTier) {
      Alert.alert("Already Subscribed", `You're already on the ${planId} plan.`);
      return;
    }

    if (planId === "free") {
      Alert.alert("Downgrade", "Contact support to downgrade your plan.");
      return;
    }

    audioManager.play("button");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert(
      "Demo Mode",
      `This is a demo payment flow. In production, you would be redirected to Stripe checkout.\n\nUpgrade to ${planId.toUpperCase()} for ${plans.find((p) => p.id === planId)?.price}/month?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            setLoading(planId);
            try {
              // Simulate payment processing
              await new Promise((resolve) => setTimeout(resolve, 2000));

              // Update subscription in database
              await updateSubscription.mutateAsync({
                tier: planId,
              });

              // Refetch subscription data
              await subscription.refetch();

              audioManager.play("success");
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );

              Alert.alert(
                "Success! 🎉",
                `You've been upgraded to ${planId.toUpperCase()}. Enjoy your new features!`,
                [
                  {
                    text: "OK",
                    onPress: () => router.back(),
                  },
                ]
              );
            } catch (error) {
              console.error("Upgrade error:", error);
              audioManager.play("error");
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert("Error", "Failed to upgrade. Please try again.");
            } finally {
              setLoading(null);
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24 }}
      >
        {/* Header */}
        <View style={{ marginBottom: 32, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "#FFFFFF",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Choose Your Plan
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.7)",
              textAlign: "center",
            }}
          >
            Unlock premium features and grow your business
          </Text>
        </View>

        {/* Plan Cards */}
        <View style={{ gap: 16 }}>
          {plans.map((plan) => {
            const isCurrentPlan = plan.id === currentTier;
            const isLoading = loading === plan.id;

            return (
              <GlassCard
                key={plan.id}
                style={{
                  padding: 20,
                  borderWidth: plan.popular ? 2 : 1,
                  borderColor: plan.popular
                    ? "rgba(168, 85, 247, 0.6)"
                    : "rgba(129, 140, 248, 0.3)",
                }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <View
                    style={{
                      position: "absolute",
                      top: -12,
                      right: 20,
                      backgroundColor: "#A855F7",
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                      borderRadius: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        color: "#FFFFFF",
                      }}
                    >
                      MOST POPULAR
                    </Text>
                  </View>
                )}

                {/* Plan Header */}
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#FFFFFF",
                      marginBottom: 4,
                    }}
                  >
                    {plan.name}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "baseline",
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 36,
                        fontWeight: "bold",
                        color: "#A855F7",
                      }}
                    >
                      {plan.price}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: "rgba(255, 255, 255, 0.6)",
                        marginLeft: 8,
                      }}
                    >
                      {plan.priceDetail}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {plan.tagline}
                  </Text>
                </View>

                {/* Features */}
                <View style={{ marginBottom: 20, gap: 12 }}>
                  {plan.features.map((feature, index) => (
                    <View
                      key={index}
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          marginRight: 8,
                          color: feature.included ? "#4ADE80" : "#6B7280",
                        }}
                      >
                        {feature.included ? "✓" : "✗"}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: feature.included
                            ? "#FFFFFF"
                            : "rgba(255, 255, 255, 0.4)",
                        }}
                      >
                        {feature.text}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* CTA Button */}
                <TouchableOpacity
                  onPress={() => handleUpgrade(plan.id)}
                  disabled={isCurrentPlan || isLoading}
                  style={{
                    backgroundColor: isCurrentPlan
                      ? "rgba(75, 85, 99, 0.5)"
                      : plan.popular
                      ? "#A855F7"
                      : "rgba(168, 85, 247, 0.3)",
                    paddingVertical: 16,
                    borderRadius: 12,
                    alignItems: "center",
                    opacity: isLoading ? 0.6 : 1,
                  }}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "#FFFFFF",
                      }}
                    >
                      {isCurrentPlan
                        ? "Current Plan"
                        : plan.id === "free"
                        ? "Free Forever"
                        : `Upgrade to ${plan.name}`}
                    </Text>
                  )}
                </TouchableOpacity>
              </GlassCard>
            );
          })}
        </View>

        {/* Footer Note */}
        <View style={{ marginTop: 32, alignItems: "center", gap: 16 }}>
          <Text
            style={{
              fontSize: 12,
              color: "rgba(255, 255, 255, 0.5)",
              textAlign: "center",
            }}
          >
            Demo Mode: No actual payment required.{"\n"}
            Real Stripe integration coming soon.
          </Text>
          
          {/* Powered by The Agency */}
          <View style={{ alignItems: "center", gap: 8, marginTop: 16 }}>
            <Text style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.4)" }}>
              Powered by
            </Text>
            <Image
              source={{ uri: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663225968004/WB7b2UcQAmrXmfdF2KMFuk/the-agency-logo_80e00e33.png' }}
              style={{ width: 100, height: 66 }}
              contentFit="contain"
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
