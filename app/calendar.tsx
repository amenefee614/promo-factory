import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  Platform as RNPlatform,
} from "react-native";
import { router, Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { GlassCard } from "@/components/glass-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

interface ScheduledPost {
  id: string;
  title: string;
  scheduledDate: Date;
  platforms: string[];
  status: "scheduled" | "posted" | "failed";
}

// Mock data - in real app, this would come from database
const MOCK_SCHEDULED_POSTS: ScheduledPost[] = [
  {
    id: "1",
    title: "Summer Sale Announcement",
    scheduledDate: new Date(2026, 0, 15, 10, 0),
    platforms: ["Instagram", "Facebook"],
    status: "scheduled",
  },
  {
    id: "2",
    title: "New Product Launch",
    scheduledDate: new Date(2026, 0, 18, 14, 30),
    platforms: ["Instagram", "TikTok", "LinkedIn"],
    status: "scheduled",
  },
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CalendarScreen() {
  const colors = useColors();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [scheduledPosts] = useState<ScheduledPost[]>(MOCK_SCHEDULED_POSTS);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const getPostsForDate = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return scheduledPosts.filter((post) => {
      const postDate = new Date(post.scheduledDate);
      return (
        postDate.getDate() === date.getDate() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const handleDayPress = (day: number) => {
    if (RNPlatform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(date);
  };

  const bestTimesToPost = [
    { time: "9:00 AM", reason: "Morning commute - high engagement" },
    { time: "12:00 PM", reason: "Lunch break - peak scrolling time" },
    { time: "6:00 PM", reason: "Evening wind-down - maximum reach" },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: "Content Calendar",
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
        }}
      />
      <ScreenContainer className="p-6">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="gap-6 pb-6">
            {/* Header */}
            <View>
              <Text className="text-2xl font-bold" style={{ color: colors.foreground }}>
                Content Calendar
              </Text>
              <Text className="text-sm mt-1" style={{ color: colors.muted }}>
                Schedule and manage your promotional posts
              </Text>
            </View>

            {/* Best Times to Post */}
            <GlassCard className="p-4">
              <View className="flex-row items-center gap-2 mb-3">
                <Text className="text-xl">⏰</Text>
                <Text
                  className="text-base font-bold"
                  style={{ color: colors.foreground }}
                >
                  Best Times to Post
                </Text>
              </View>
              <View className="gap-2">
                {bestTimesToPost.map((item, idx) => (
                  <View
                    key={idx}
                    className="flex-row items-center justify-between p-3 rounded-xl"
                    style={{ backgroundColor: "rgba(129, 140, 248, 0.1)" }}
                  >
                    <Text
                      className="text-base font-semibold"
                      style={{ color: "#818CF8" }}
                    >
                      {item.time}
                    </Text>
                    <Text className="text-sm" style={{ color: colors.muted }}>
                      {item.reason}
                    </Text>
                  </View>
                ))}
              </View>
            </GlassCard>

            {/* Calendar */}
            <GlassCard className="p-4">
              {/* Month Navigation */}
              <View className="flex-row items-center justify-between mb-4">
                <Pressable
                  onPress={goToPreviousMonth}
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                  <IconSymbol name="chevron.left" size={24} color={colors.primary} />
                </Pressable>
                <Text
                  className="text-lg font-bold"
                  style={{ color: colors.foreground }}
                >
                  {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </Text>
                <Pressable
                  onPress={goToNextMonth}
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                  <IconSymbol name="chevron.right" size={24} color={colors.primary} />
                </Pressable>
              </View>

              {/* Days of Week */}
              <View className="flex-row mb-2">
                {DAYS_OF_WEEK.map((day) => (
                  <View key={day} className="flex-1 items-center py-2">
                    <Text className="text-xs font-semibold" style={{ color: colors.muted }}>
                      {day}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Calendar Grid */}
              <View className="gap-1">
                {Array.from({ length: Math.ceil((daysInMonth + startingDayOfWeek) / 7) }).map(
                  (_, weekIdx) => (
                    <View key={weekIdx} className="flex-row gap-1">
                      {Array.from({ length: 7 }).map((_, dayIdx) => {
                        const dayNumber =
                          weekIdx * 7 + dayIdx - startingDayOfWeek + 1;
                        const isValidDay =
                          dayNumber > 0 && dayNumber <= daysInMonth;
                        const postsForDay = isValidDay
                          ? getPostsForDate(dayNumber)
                          : [];
                        const isTodayDate = isValidDay && isToday(dayNumber);

                        return (
                          <Pressable
                            key={dayIdx}
                            onPress={() =>
                              isValidDay && handleDayPress(dayNumber)
                            }
                            disabled={!isValidDay}
                            style={({ pressed }) => ({
                              flex: 1,
                              aspectRatio: 1,
                              opacity: pressed ? 0.7 : 1,
                            })}
                          >
                            <View
                              className="flex-1 items-center justify-center rounded-lg"
                              style={{
                                backgroundColor: isTodayDate
                                  ? "rgba(129, 140, 248, 0.3)"
                                  : postsForDay.length > 0
                                  ? "rgba(129, 140, 248, 0.1)"
                                  : "transparent",
                                borderWidth: isTodayDate ? 2 : 0,
                                borderColor: "#818CF8",
                              }}
                            >
                              {isValidDay && (
                                <>
                                  <Text
                                    className="text-sm font-semibold"
                                    style={{
                                      color: isTodayDate
                                        ? "#818CF8"
                                        : colors.foreground,
                                    }}
                                  >
                                    {dayNumber}
                                  </Text>
                                  {postsForDay.length > 0 && (
                                    <View
                                      className="w-1 h-1 rounded-full mt-1"
                                      style={{ backgroundColor: "#818CF8" }}
                                    />
                                  )}
                                </>
                              )}
                            </View>
                          </Pressable>
                        );
                      })}
                    </View>
                  )
                )}
              </View>
            </GlassCard>

            {/* Scheduled Posts */}
            <View>
              <Text
                className="text-lg font-bold mb-3"
                style={{ color: colors.foreground }}
              >
                Scheduled Posts
              </Text>
              {scheduledPosts.length === 0 ? (
                <GlassCard className="p-6">
                  <Text
                    className="text-base text-center"
                    style={{ color: colors.muted }}
                  >
                    No scheduled posts yet
                  </Text>
                </GlassCard>
              ) : (
                <View className="gap-3">
                  {scheduledPosts.map((post) => (
                    <GlassCard key={post.id} className="p-4">
                      <View className="flex-row items-start justify-between">
                        <View className="flex-1">
                          <Text
                            className="text-base font-bold mb-1"
                            style={{ color: colors.foreground }}
                          >
                            {post.title}
                          </Text>
                          <Text className="text-sm mb-2" style={{ color: colors.muted }}>
                            {post.scheduledDate.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </Text>
                          <View className="flex-row gap-2">
                            {post.platforms.map((platform) => (
                              <View
                                key={platform}
                                className="px-2 py-1 rounded"
                                style={{
                                  backgroundColor: "rgba(129, 140, 248, 0.2)",
                                }}
                              >
                                <Text
                                  className="text-xs font-medium"
                                  style={{ color: "#818CF8" }}
                                >
                                  {platform}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </View>
                        <View
                          className="px-3 py-1 rounded-full"
                          style={{
                            backgroundColor:
                              post.status === "scheduled"
                                ? "rgba(129, 140, 248, 0.2)"
                                : post.status === "posted"
                                ? "rgba(34, 197, 94, 0.2)"
                                : "rgba(239, 68, 68, 0.2)",
                          }}
                        >
                          <Text
                            className="text-xs font-semibold"
                            style={{
                              color:
                                post.status === "scheduled"
                                  ? "#818CF8"
                                  : post.status === "posted"
                                  ? "#22C55E"
                                  : "#EF4444",
                            }}
                          >
                            {post.status.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    </GlassCard>
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    </>
  );
}
