import { useState } from "react";
import { View, Text, ScrollView, Pressable, Switch, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { GradientBackground } from "@/components/gradient-background";
import { AnimatedCard } from "@/components/animated-card";
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
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View className="flex-row items-center justify-between py-4 px-6 border-b border-opacity-10" style={{ borderColor: '#6366F1' }}>
        <View className="flex-row items-center gap-4 flex-1">
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: 'rgba(99, 102, 241, 0.2)' }}
          >
            <Text className="text-xl">{icon}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold" style={{ color: '#F8F9FF' }}>
              {title}
            </Text>
            {subtitle && (
              <Text className="text-sm mt-1" style={{ color: '#A5B4FC' }}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {rightElement || (showChevron && (
          <IconSymbol name="chevron.right" size={20} color="#A5B4FC" />
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
      <ScreenContainer className="p-6">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-1 gap-6">
            {/* Header */}
            <AnimatedCard delay={0} className="gap-2 mt-4 bg-transparent border-0">
              <Text className="text-3xl font-bold" style={{ color: '#F8F9FF' }}>
                Settings
              </Text>
              <Text className="text-base" style={{ color: '#A5B4FC' }}>
                Manage your account and preferences
              </Text>
            </AnimatedCard>

            {/* Account Section */}
            <AnimatedCard delay={100} className="overflow-hidden">
              <View className="px-6 py-4 border-b border-opacity-10" style={{ borderColor: '#6366F1' }}>
                <Text className="text-sm font-bold uppercase tracking-wider" style={{ color: '#818CF8' }}>
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
            <AnimatedCard delay={200} className="overflow-hidden">
              <View className="px-6 py-4 border-b border-opacity-10" style={{ borderColor: '#6366F1' }}>
                <Text className="text-sm font-bold uppercase tracking-wider" style={{ color: '#818CF8' }}>
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
                    trackColor={{ false: '#374151', true: '#6366F1' }}
                    thumbColor={soundEnabled ? '#F8F9FF' : '#9CA3AF'}
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
            <AnimatedCard delay={300} className="overflow-hidden">
              <View className="px-6 py-4 border-b border-opacity-10" style={{ borderColor: '#6366F1' }}>
                <Text className="text-sm font-bold uppercase tracking-wider" style={{ color: '#818CF8' }}>
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
            <AnimatedCard delay={400} className="overflow-hidden">
              <Pressable
                onPress={handleLogout}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View className="flex-row items-center justify-center gap-3 py-4 px-6">
                  <Text className="text-xl">🚪</Text>
                  <Text className="text-base font-bold" style={{ color: '#EF4444' }}>
                    Logout
                  </Text>
                </View>
              </Pressable>
            </AnimatedCard>

            {/* Powered by The Agency */}
            <AnimatedCard delay={500} className="items-center gap-3 py-6 bg-transparent border-0">
              <Text className="text-xs" style={{ color: '#6B7280' }}>
                Powered by
              </Text>
              <Image
                source={{ uri: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663225968004/WB7b2UcQAmrXmfdF2KMFuk/the-agency-logo_80e00e33.png' }}
                style={{ width: 100, height: 66 }}
                contentFit="contain"
              />
              <Text className="text-xs text-center" style={{ color: '#4B5563' }}>
                Premium solutions for small businesses
              </Text>
            </AnimatedCard>

            <View className="h-8" />
          </View>
        </ScrollView>
      </ScreenContainer>
    </GradientBackground>
  );
}
