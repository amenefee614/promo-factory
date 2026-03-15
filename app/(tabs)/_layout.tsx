import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Platform, View } from "react-native";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 18 : Math.max(insets.bottom, 14);
  const tabBarHeight = 68 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#A78BFA",
        tabBarInactiveTintColor: "#4B5563",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          web: {
            paddingTop: 10,
            paddingBottom: bottomPadding,
            height: tabBarHeight,
            backgroundColor: "rgba(8, 2, 15, 0.85)",
            borderTopColor: "rgba(129, 140, 248, 0.15)",
            borderTopWidth: 1,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          },
          default: {
            paddingTop: 10,
            paddingBottom: bottomPadding,
            height: tabBarHeight,
            backgroundColor: "rgba(8, 2, 15, 0.95)",
            borderTopColor: "rgba(129, 140, 248, 0.15)",
            borderTopWidth: 1,
          },
        }) as any,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          letterSpacing: 0.5,
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: "center" }}>
              {focused && (
                <View
                  style={{
                    position: "absolute",
                    top: -10,
                    width: 20,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: "#A78BFA",
                    ...(Platform.OS === "web"
                      ? { boxShadow: "0 0 10px #A78BFA, 0 0 20px #A78BFA60" }
                      : { shadowColor: "#A78BFA", shadowOpacity: 0.8, shadowRadius: 6 }),
                  }}
                />
              )}
              <IconSymbol size={24} name="house.fill" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: "center" }}>
              {focused && (
                <View
                  style={{
                    position: "absolute",
                    top: -10,
                    width: 20,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: "#EC4899",
                    ...(Platform.OS === "web"
                      ? { boxShadow: "0 0 10px #EC4899, 0 0 20px #EC489960" }
                      : { shadowColor: "#EC4899", shadowOpacity: 0.8, shadowRadius: 6 }),
                  }}
                />
              )}
              <IconSymbol size={24} name="plus.circle.fill" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="assets"
        options={{
          title: "Assets",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: "center" }}>
              {focused && (
                <View
                  style={{
                    position: "absolute",
                    top: -10,
                    width: 20,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: "#818CF8",
                    ...(Platform.OS === "web"
                      ? { boxShadow: "0 0 10px #818CF8, 0 0 20px #818CF860" }
                      : { shadowColor: "#818CF8", shadowOpacity: 0.8, shadowRadius: 6 }),
                  }}
                />
              )}
              <IconSymbol size={24} name="photo.stack.fill" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: "center" }}>
              {focused && (
                <View
                  style={{
                    position: "absolute",
                    top: -10,
                    width: 20,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: "#34D399",
                    ...(Platform.OS === "web"
                      ? { boxShadow: "0 0 10px #34D399, 0 0 20px #34D39960" }
                      : { shadowColor: "#34D399", shadowOpacity: 0.8, shadowRadius: 6 }),
                  }}
                />
              )}
              <IconSymbol size={24} name="chart.bar.fill" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: "Assistant",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: "center" }}>
              {focused && (
                <View
                  style={{
                    position: "absolute",
                    top: -10,
                    width: 20,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: "#F59E0B",
                    ...(Platform.OS === "web"
                      ? { boxShadow: "0 0 10px #F59E0B, 0 0 20px #F59E0B60" }
                      : { shadowColor: "#F59E0B", shadowOpacity: 0.8, shadowRadius: 6 }),
                  }}
                />
              )}
              <IconSymbol size={24} name="message.fill" color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: "center" }}>
              {focused && (
                <View
                  style={{
                    position: "absolute",
                    top: -10,
                    width: 20,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: "#A78BFA",
                    ...(Platform.OS === "web"
                      ? { boxShadow: "0 0 10px #A78BFA, 0 0 20px #A78BFA60" }
                      : { shadowColor: "#A78BFA", shadowOpacity: 0.8, shadowRadius: 6 }),
                  }}
                />
              )}
              <IconSymbol size={24} name="gearshape.fill" color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
