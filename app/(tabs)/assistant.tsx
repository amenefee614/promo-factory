import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withRepeat,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import { ScreenContainer } from "@/components/screen-container";
import { GradientBackground } from "@/components/gradient-background";
import { AnimatedCard } from "@/components/animated-card";
import { GlassCard } from "@/components/glass-card";
import { NeonLiquidButton } from "@/components/neon-liquid-button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useSubscription } from "@/lib/subscription-provider";
import { bouncySpring } from "@/lib/animations";
import { trpc } from "@/lib/trpc";
import { router } from "expo-router";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  action?: { type: string; payload?: { description?: string; style?: string } };
  suggestions?: string[];
}

type HistoryEntry = { role: "user" | "assistant"; content: string };

const INITIAL_SUGGESTIONS = [
  "Create a post for my business",
  "Give me promo ideas",
  "Check my analytics",
];

function TypingDots() {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    dot1.value = withRepeat(
      withSequence(withTiming(-6, { duration: 300 }), withTiming(0, { duration: 300 })),
      -1
    );
    setTimeout(() => {
      dot2.value = withRepeat(
        withSequence(withTiming(-6, { duration: 300 }), withTiming(0, { duration: 300 })),
        -1
      );
    }, 100);
    setTimeout(() => {
      dot3.value = withRepeat(
        withSequence(withTiming(-6, { duration: 300 }), withTiming(0, { duration: 300 })),
        -1
      );
    }, 200);

    return () => {
      cancelAnimation(dot1);
      cancelAnimation(dot2);
      cancelAnimation(dot3);
    };
  }, []);

  const d1Style = useAnimatedStyle(() => ({ transform: [{ translateY: dot1.value }] }));
  const d2Style = useAnimatedStyle(() => ({ transform: [{ translateY: dot2.value }] }));
  const d3Style = useAnimatedStyle(() => ({ transform: [{ translateY: dot3.value }] }));

  const dotStyle = Platform.OS === "web"
    ? {
        textShadow: "0 0 8px rgba(167, 139, 250, 0.8)",
        boxShadow: "0 0 12px rgba(167, 139, 250, 0.6)",
      }
    : {};

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 8, paddingHorizontal: 4 }}>
      {[d1Style, d2Style, d3Style].map((style, i) => (
        <Animated.View
          key={i}
          style={[
            style,
            {
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#A78BFA",
              ...dotStyle,
            },
          ]}
        />
      ))}
    </View>
  );
}

function SuggestionChip({ label, onPress }: { label: string; onPress: () => void }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    scale.value = withSequence(withSpring(0.93, bouncySpring), withSpring(1, bouncySpring));
    onPress();
  };

  const glassStyle = Platform.OS === "web"
    ? {
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 8px 32px rgba(129, 140, 248, 0.15)",
      }
    : {};

  return (
    <AnimatedPressable onPress={handlePress} style={animatedStyle}>
      <View
        style={{
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 20,
          backgroundColor: "rgba(129, 140, 248, 0.12)",
          borderWidth: 1.5,
          borderColor: "rgba(167, 139, 250, 0.5)",
          ...glassStyle,
        }}
      >
        <Text style={{ color: "#E0E7FF", fontSize: 13, fontWeight: "600" }}>{label}</Text>
      </View>
    </AnimatedPressable>
  );
}

function ActionButton({ action, onPress }: { action: Message["action"]; onPress: () => void }) {
  if (!action || action.type === "none") return null;

  const config: Record<string, { label: string; colors: string[]; glowColor: string }> = {
    navigate_create: {
      label: "✨ Create This Promo",
      colors: ["#818CF8", "#A78BFA"],
      glowColor: "#818CF8",
    },
    navigate_analytics: {
      label: "📊 View Analytics",
      colors: ["#34D399", "#10B981"],
      glowColor: "#34D399",
    },
    navigate_upgrade: {
      label: "👑 Upgrade Now",
      colors: ["#F59E0B", "#FBBF24"],
      glowColor: "#F59E0B",
    },
  };

  const c = config[action.type];
  if (!c) return null;

  return (
    <View style={{ marginTop: 10 }}>
      <NeonLiquidButton
        label={c.label}
        onPress={onPress}
        colors={c.colors}
        glowColor={c.glowColor}
        variant="secondary"
        size="sm"
      />
    </View>
  );
}

export default function AssistantScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi! I'm Promo, your AI marketing assistant. Tell me about your business and I'll help you create amazing promotional content in seconds. What would you like to promote today?",
      isUser: false,
      timestamp: new Date(),
      suggestions: INITIAL_SUGGESTIONS,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const { tier } = useSubscription();

  const chatMutation = trpc.assistant.chat.useMutation();

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 150);
    }
  }, [messages, isTyping]);

  const executeAction = (action: Message["action"]) => {
    if (!action || action.type === "none") return;
    switch (action.type) {
      case "navigate_create":
        router.push("/(tabs)/create");
        break;
      case "navigate_analytics":
        router.push("/(tabs)/analytics");
        break;
      case "navigate_upgrade":
        router.push("/upgrade");
        break;
    }
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: trimmed,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    const newHistory: HistoryEntry[] = [
      ...history,
      { role: "user", content: trimmed },
    ];

    try {
      const result = await chatMutation.mutateAsync({
        message: trimmed,
        history: history.slice(-12),
      });

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: result.message,
        isUser: false,
        timestamp: new Date(),
        action: result.action as Message["action"],
        suggestions: result.suggestions,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setHistory([...newHistory, { role: "assistant", content: result.message }]);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having a moment of connectivity issues. Give me a second and try again!",
        isUser: false,
        timestamp: new Date(),
        suggestions: ["Try again", "Create a promo", "View my assets"],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const glassStyle = Platform.OS === "web"
      ? {
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }
      : {};

    return (
      <View style={{ marginBottom: 16, alignItems: item.isUser ? "flex-end" : "flex-start" }}>
        {!item.isUser && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: "rgba(167, 139, 250, 0.25)",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(167, 139, 250, 0.4)",
              }}
            >
              <Text style={{ fontSize: 13 }}>🤖</Text>
            </View>
            <Text style={{ fontSize: 11, color: "#A78BFA", fontWeight: "600" }}>Promo</Text>
          </View>
        )}

        <View
          style={{
            maxWidth: "83%",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 20,
            backgroundColor: item.isUser
              ? "rgba(129, 140, 248, 0.25)"
              : "rgba(99, 102, 241, 0.1)",
            borderWidth: 1.5,
            borderColor: item.isUser
              ? "rgba(167, 139, 250, 0.6)"
              : "rgba(167, 139, 250, 0.35)",
            ...glassStyle,
            ...(Platform.OS === "web" && {
              boxShadow: item.isUser
                ? "0 8px 32px rgba(129, 140, 248, 0.2)"
                : "0 8px 32px rgba(167, 139, 250, 0.1)",
            }),
          }}
        >
          <Text style={{ color: "#F8F9FF", fontSize: 14, lineHeight: 21, fontWeight: "500" }}>
            {item.text}
          </Text>

          {!item.isUser && item.action && item.action.type !== "none" && (
            <ActionButton action={item.action} onPress={() => executeAction(item.action)} />
          )}
        </View>

        {!item.isUser && item.suggestions && item.suggestions.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 8 }}
            contentContainerStyle={{ gap: 8, paddingRight: 8 }}
          >
            {item.suggestions.map((s, i) => (
              <SuggestionChip key={i} label={s} onPress={() => sendMessage(s)} />
            ))}
          </ScrollView>
        )}
      </View>
    );
  };

  return (
    <GradientBackground>
      <ScreenContainer edges={["top", "left", "right"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={100}
        >
          <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 }}>
              <AnimatedCard delay={0} className="bg-transparent border-0">
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: "rgba(245, 158, 11, 0.15)",
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1.5,
                      borderColor: "rgba(245, 158, 11, 0.5)",
                      ...(Platform.OS === "web" && {
                        boxShadow: "0 0 20px rgba(245, 158, 11, 0.3)",
                      }),
                    }}
                  >
                    <Text style={{ fontSize: 22 }}>🤖</Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: "#FCD34D",
                        fontSize: 20,
                        fontWeight: "800",
                        letterSpacing: 1.2,
                        ...(Platform.OS === "web" && {
                          textShadow: "0 0 16px rgba(245, 158, 11, 0.6)",
                        }),
                      }}
                    >
                      AI ASSISTANT
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4 }}>
                      <Animated.View
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: 4,
                          backgroundColor: "#34D399",
                          ...(Platform.OS === "web" && {
                            boxShadow: "0 0 12px rgba(52, 211, 153, 0.8)",
                          }),
                          animation: Platform.OS === "web" ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" : undefined,
                        }}
                      />
                      <Text style={{ color: "#34D399", fontSize: 12, fontWeight: "600" }}>
                        Online · AI-powered
                      </Text>
                    </View>
                  </View>
                </View>
              </AnimatedCard>
            </View>

            {/* Messages list */}
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={
                isTyping ? (
                  <View style={{ alignItems: "flex-start", marginBottom: 16 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          backgroundColor: "rgba(167, 139, 250, 0.25)",
                          alignItems: "center",
                          justifyContent: "center",
                          borderWidth: 1,
                          borderColor: "rgba(167, 139, 250, 0.4)",
                        }}
                      >
                        <Text style={{ fontSize: 13 }}>🤖</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 20,
                        backgroundColor: "rgba(99, 102, 241, 0.1)",
                        borderWidth: 1.5,
                        borderColor: "rgba(167, 139, 250, 0.35)",
                        ...(Platform.OS === "web" && {
                          backdropFilter: "blur(16px)",
                          WebkitBackdropFilter: "blur(16px)",
                          boxShadow: "0 8px 32px rgba(167, 139, 250, 0.1)",
                        }),
                      }}
                    >
                      <TypingDots />
                    </View>
                  </View>
                ) : null
              }
            />

            {/* Input bar */}
            <View
              style={{
                marginHorizontal: 16,
                marginBottom: 16,
                padding: 12,
                flexDirection: "row",
                alignItems: "flex-end",
                gap: 10,
                borderRadius: 24,
                backgroundColor: "rgba(99, 102, 241, 0.08)",
                borderWidth: 1.5,
                borderColor: "rgba(167, 139, 250, 0.4)",
                ...(Platform.OS === "web" && {
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: "0 8px 32px rgba(129, 140, 248, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
                }),
              }}
            >
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask me anything about your marketing..."
                placeholderTextColor="#8B5CF6"
                style={{
                  flex: 1,
                  color: "#F8F9FF",
                  fontSize: 14,
                  maxHeight: 100,
                  fontWeight: "500",
                }}
                multiline
                maxLength={500}
                editable={!isTyping}
                onSubmitEditing={() => sendMessage(inputText)}
              />
              <NeonLiquidButton
                label=""
                onPress={() => sendMessage(inputText)}
                disabled={!inputText.trim() || isTyping}
                colors={["#818CF8", "#A78BFA"]}
                glowColor="#818CF8"
                size="sm"
                icon={isTyping ? undefined : "paperplane.fill"}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScreenContainer>
    </GradientBackground>
  );
}
