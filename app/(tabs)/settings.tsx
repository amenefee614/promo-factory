import { useState } from "react";
import { View, Text, ScrollView, Pressable, Switch, Alert, Platform } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { GradientBackground } from "@/components/gradient-background";
import { AnimatedCard } from "@/components/animated-card";
import { GlassCard } from "@/components/glass-card";
import { NeonLiquidButton } from "@/components/neon-liquid-button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { router } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";

interface MenuItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
  rightElement?: React.ReactNode;
}

function MenuItem({ icon, title, subtitle, onPress, showChevron = true, rightElement }: MenuItemProps) {
  const glassStyle = Platform.OS === "web"
    ? {
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 8px 32px rgba(167, 139, 250, 0.08)",
      }
    : {};

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 16,
          paddingHorizontal: 16,
          marginBottom: 8,
          borderRadius: 16,
          backgroundColor: "rgba(99, 102, 241, 0.08)",
          borderWidth: 1.5,
          borderColor: "rgba(167, 139, 250, 0.3)",
          ...glassStyle,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(167, 139, 250, 0.15)",
              borderWidth: 1,
              borderColor: "rgba(167, 139, 250, 0.3)",
            }}
          >
            <Text style={{ fontSize: 18 }}>{icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#F8F9FF" }}>
              {title}
            </Text>
            {subtitle && (
              <Text style={{ fontSize: 13, marginTop: 2, color: "#A5B4FC", fontWeight: "500" }}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {rightElement || (showChevron && (
          <IconSymbol name="chevron.right" size={20} color="#A78BFA" />
        ))}
      </View>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const colors = useColors();
  const { user, logout } = useAuth();
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleToggleSound = async (value: boolean) => {
    setSoundEnabled(value);
    await AsyncStorage.setItem('soundEnabled', JSON.stringify(value));
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/");
          },
        },
      ]
    );
  };

  return (
    <GradientBackground>
      <ScreenContainer style={{ paddingHorizontal: 16 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, gap: 8 }}>
            {/* Header */}
            <AnimatedCard delay={0} style={{ gap: 4, marginTop: 8, backgroundColor: "transparent", borderWidth: 0 }}>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "800",
                  color: "#E0E7FF",
                  letterSpacing: 1,
                  ...(Platform.OS === "web" && {
                    textShadow: "0 0 20px rgba(167, 139, 250, 0.5)",
                  }),
                }}
              >
                SETTINGS
              </Text>
              <Text style={{ fontSize: 14, color: "#A5B4FC", fontWeight: "500" }}>
                Manage your account and preferences
              </Text>
            </AnimatedCard>

            {/* Account Section */}
            <AnimatedCard delay={100} style={{ overflow: "hidden", marginTop: 12 }}>
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: 1.5,
                  borderBottomColor: "rgba(167, 139, 250, 0.3)",
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "700",
                    letterSpacing: 1.2,
                    color: "#A78BFA",
                    textTransform: "uppercase",
                    ...(Platform.OS === "web" && {
                      textShadow: "0 0 8px rgba(167, 139, 250, 0.3)",
                    }),
                  }}
                >
                  Account
                </Text>
              </View>
              <MenuItem
                icon="👤"
                title="Profile"
                subtitle={user?.email || "Not signed in"}
                onPress={() => router.push("/brand-profile-setup")}
              />
              <MenuItem
                icon="🎨"
                title="Brand Profile"
                subtitle="Business name, industry, colors, logo"
                onPress={() => router.push("/brand-profile-setup")}
              />
              <MenuItem
                icon="💎"
                title="Subscription"
                subtitle="Manage your plan and billing"
                onPress={() => router.push("/upgrade")}
              />
            </AnimatedCard>

            {/* Preferences Section */}
            <AnimatedCard delay={200} style={{ overflow: "hidden" }}>
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: 1.5,
                  borderBottomColor: "rgba(167, 139, 250, 0.3)",
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "700",
                    letterSpacing: 1.2,
                    color: "#A78BFA",
                    textTransform: "uppercase",
                    ...(Platform.OS === "web" && {
                      textShadow: "0 0 8px rgba(167, 139, 250, 0.3)",
                    }),
                  }}
                >
                  Preferences
                </Text>
              </View>
              <MenuItem
                icon="🎵"
                title="Sound Effects"
                subtitle="Button press and interaction sounds"
                onPress={() => {}}
                showChevron={false}
                rightElement={
                  <Switch
                    value={soundEnabled}
                    onValueChange={handleToggleSound}
                    trackColor={{
                      false: "rgba(99, 102, 241, 0.2)",
                      true: "rgba(167, 139, 250, 0.4)",
                    }}
                    thumbColor={soundEnabled ? "#A78BFA" : "#6B7280"}
                  />
                }
              />
              <MenuItem
                icon="🎨"
                title="Theme Customization"
                subtitle="Colors, blur, shadows, animations"
                onPress={() => Alert.alert("Theme Studio", "Theme customization coming soon!")}
              />
              <MenuItem
                icon="🔔"
                title="Notifications"
                subtitle="Manage push notifications"
                onPress={() => Alert.alert("Notifications", "Notification settings coming soon!")}
              />
            </AnimatedCard>

            {/* Support Section */}
            <AnimatedCard delay={300} style={{ overflow: "hidden" }}>
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: 1.5,
                  borderBottomColor: "rgba(167, 139, 250, 0.3)",
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "700",
                    letterSpacing: 1.2,
                    color: "#A78BFA",
                    textTransform: "uppercase",
                    ...(Platform.OS === "web" && {
                      textShadow: "0 0 8px rgba(167, 139, 250, 0.3)",
                    }),
                  }}
                >
                  Support
                </Text>
              </View>
              <MenuItem
                icon="❓"
                title="Help & FAQ"
                subtitle="Get answers to common questions"
                onPress={() => Alert.alert("Help", "Help center coming soon!")}
              />
              <MenuItem
                icon="📧"
                title="Contact Support"
                subtitle="Get help from our team"
                onPress={() => Alert.alert("Contact", "support@promofactory.com")}
              />
              <MenuItem
                icon="ℹ️"
                title="About"
                subtitle="Promo Factory Ultimate v1.0.0"
                onPress={() => Alert.alert("About", "Promo Factory Ultimate\nVersion 1.0.0\n\nPowered by The Agency\n© 2025 All rights reserved")}
              />
            </AnimatedCard>

            {/* Logout Button */}
            <AnimatedCard delay={400} style={{ overflow: "hidden" }}>
              <View style={{ paddingHorizontal: 8, paddingVertical: 8 }}>
                <NeonLiquidButton
                  label="🚪 Logout"
                  onPress={handleLogout}
                  colors={["#EF4444", "#F87171"]}
                  glowColor="#EF4444"
                  variant="secondary"
                />
              </View>
            </AnimatedCard>

            {/* Powered by The Agency */}
            <AnimatedCard
              delay={500}
              style={{
                alignItems: "center",
                gap: 12,
                paddingVertical: 24,
                backgroundColor: "transparent",
                borderWidth: 0,
              }}
            >
              <Text style={{ fontSize: 12, color: "#8B5CF6", fontWeight: "500" }}>
                Powered by
              </Text>
              <Image
                source={{
                  uri: "https://d2xsxph8kpxj0f.cloudfront.net/310519663225968004/WB7b2UcQAmrXmfdF2KMFuk/the-agency-logo_80e00e33.png",
                }}
                style={{ width: 100, height: 66 }}
                contentFit="contain"
              />
              <Text
                style={{
                  fontSize: 12,
                  textAlign: "center",
                  color: "#8B5CF6",
                  fontWeight: "500",
                }}
              >
                Premium solutions for small businesses
              </Text>
            </AnimatedCard>

            <View style={{ height: 20 }} />
          </View>
        </ScrollView>
      </ScreenContainer>
    </GradientBackground>
  );
}
