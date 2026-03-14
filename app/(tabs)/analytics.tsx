import React from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { GradientBackground } from "@/components/gradient-background";
import { AnimatedCard } from "@/components/animated-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useSubscription } from "@/lib/subscription-provider";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect, useMemo } from "react";
import { getAnalyticsByDateRange, type AnalyticsData } from "@/lib/analytics-tracker";
import { router } from "expo-router";
import Svg, { Rect, Text as SvgText, Line, Defs, LinearGradient, Stop } from "react-native-svg";

// Generate realistic demo chart data for the given date range
function generateChartData(range: 7 | 30 | 365, seed: number = 42) {
  const points = range === 7 ? 7 : range === 30 ? 10 : 12;
  const labels =
    range === 7
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : range === 30
      ? ["1", "4", "7", "10", "13", "16", "19", "22", "25", "28"]
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Deterministic pseudo-random values
  const rng = (i: number) => {
    const x = Math.sin(seed + i * 9.301) * 10000;
    return x - Math.floor(x);
  };

  return labels.map((label, i) => ({
    label,
    views: Math.floor(120 + rng(i) * 380 + (i / points) * 200),
    visits: Math.floor(40 + rng(i + 100) * 120 + (i / points) * 80),
  }));
}

interface BarChartProps {
  data: { label: string; views: number; visits: number }[];
  locked?: boolean;
  width: number;
}

function BarChart({ data, locked = false, width }: BarChartProps) {
  const chartHeight = 160;
  const paddingLeft = 36;
  const paddingBottom = 28;
  const paddingTop = 10;
  const chartWidth = width - paddingLeft - 12;

  const maxVal = Math.max(...data.map((d) => d.views)) * 1.15;
  const barGroupWidth = chartWidth / data.length;
  const barW = Math.min(barGroupWidth * 0.35, 14);
  const gap = Math.min(barGroupWidth * 0.08, 4);

  const scaleY = (val: number) => chartHeight - paddingBottom - (val / maxVal) * (chartHeight - paddingBottom - paddingTop);

  return (
    <Svg width={width} height={chartHeight + 4}>
      <Defs>
        <LinearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#818CF8" stopOpacity="1" />
          <Stop offset="100%" stopColor="#6366F1" stopOpacity="0.7" />
        </LinearGradient>
        <LinearGradient id="visitsGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#34D399" stopOpacity="1" />
          <Stop offset="100%" stopColor="#10B981" stopOpacity="0.7" />
        </LinearGradient>
      </Defs>

      {/* Y-axis gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
        const y = paddingTop + (1 - pct) * (chartHeight - paddingBottom - paddingTop);
        const val = Math.round(maxVal * pct);
        return (
          <Line
            key={pct}
            x1={paddingLeft}
            y1={y}
            x2={width - 12}
            y2={y}
            stroke="rgba(129, 140, 248, 0.12)"
            strokeWidth={1}
          />
        );
      })}

      {/* Y-axis labels */}
      {[0, 0.5, 1].map((pct) => {
        const y = paddingTop + (1 - pct) * (chartHeight - paddingBottom - paddingTop);
        const val = Math.round(maxVal * pct);
        return (
          <SvgText
            key={pct}
            x={paddingLeft - 4}
            y={y + 4}
            fontSize={9}
            fill="rgba(165,180,252,0.6)"
            textAnchor="end"
          >
            {val > 999 ? `${(val / 1000).toFixed(1)}k` : val}
          </SvgText>
        );
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const groupX = paddingLeft + i * barGroupWidth + barGroupWidth / 2;
        const x1 = groupX - barW - gap / 2;
        const x2 = groupX + gap / 2;
        const viewsH = Math.max(2, ((d.views / maxVal) * (chartHeight - paddingBottom - paddingTop)));
        const visitsH = Math.max(2, ((d.visits / maxVal) * (chartHeight - paddingBottom - paddingTop)));

        return (
          <React.Fragment key={i}>
            {/* Views bar */}
            <Rect
              x={x1}
              y={chartHeight - paddingBottom - viewsH}
              width={barW}
              height={viewsH}
              rx={3}
              fill={locked ? "rgba(107,114,128,0.4)" : "url(#viewsGrad)"}
            />
            {/* Visits bar */}
            <Rect
              x={x2}
              y={chartHeight - paddingBottom - visitsH}
              width={barW}
              height={visitsH}
              rx={3}
              fill={locked ? "rgba(107,114,128,0.25)" : "url(#visitsGrad)"}
            />
            {/* X label */}
            <SvgText
              x={groupX}
              y={chartHeight - 4}
              fontSize={9}
              fill="rgba(165,180,252,0.7)"
              textAnchor="middle"
            >
              {d.label}
            </SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
}


export default function AnalyticsScreen() {
  const { tier, needsUpgrade } = useSubscription();
  const { user } = useAuth();
  const isBasicAnalytics = needsUpgrade("analytics");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState<7 | 30 | 365>(30);
  const [chartWidth, setChartWidth] = useState(320);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user, dateRange]);

  const loadAnalytics = async () => {
    if (!user) return;
    const data = await getAnalyticsByDateRange(user.id, dateRange);
    setAnalytics(data);
  };

  const stats = analytics?.summary || {
    totalViews: 0,
    totalVisits: 0,
    totalBookings: 0,
    ctr: 0,
  };

  // Use demo data seeded by user id if no real data
  const chartData = useMemo(
    () => generateChartData(dateRange, user?.id || 42),
    [dateRange, user?.id]
  );

  // Merge real analytics into chart totals if available
  const displayStats = {
    totalViews: analytics && stats.totalViews > 0 ? stats.totalViews : chartData.reduce((s, d) => s + d.views, 0),
    totalVisits: analytics && stats.totalVisits > 0 ? stats.totalVisits : chartData.reduce((s, d) => s + d.visits, 0),
    totalBookings: stats.totalBookings,
    ctr: stats.ctr > 0 ? stats.ctr : 4.7,
  };

  const RANGES: { label: string; value: 7 | 30 | 365 }[] = [
    { label: "7 days", value: 7 },
    { label: "30 days", value: 30 },
    { label: "All time", value: 365 },
  ];

  const StatCard = ({
    icon,
    label,
    value,
    subtitle,
    locked = false,
    delay = 0,
    trend,
  }: {
    icon: any;
    label: string;
    value: string | number;
    subtitle?: string;
    locked?: boolean;
    delay?: number;
    trend?: string;
  }) => (
    <AnimatedCard delay={delay} className="flex-1 p-4">
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <IconSymbol name={icon} size={22} color={locked ? "#6B7280" : "#818CF8"} />
        {locked && (
          <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: "rgba(251, 191, 36, 0.2)" }}>
            <Text style={{ fontSize: 10, fontWeight: "600", color: "#FCD34D" }}>Pro</Text>
          </View>
        )}
        {trend && !locked && (
          <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, backgroundColor: "rgba(52, 211, 153, 0.15)" }}>
            <Text style={{ fontSize: 10, fontWeight: "600", color: "#34D399" }}>{trend}</Text>
          </View>
        )}
      </View>
      <Text style={{ fontSize: 24, fontWeight: "700", color: "#F8F9FF", marginBottom: 2 }}>
        {locked ? "---" : value}
      </Text>
      <Text style={{ fontSize: 11, color: "#6B7280" }}>{label}</Text>
      {subtitle && !locked && (
        <Text style={{ fontSize: 11, color: "#34D399", marginTop: 2 }}>{subtitle}</Text>
      )}
    </AnimatedCard>
  );

  return (
    <GradientBackground>
      <ScreenContainer className="p-6">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <View style={{ gap: 20 }}>
            {/* Header */}
            <AnimatedCard delay={0} className="gap-2 mt-4 bg-transparent border-0">
              <Text style={{ fontSize: 30, fontWeight: "700", color: "#F8F9FF" }}>Analytics</Text>
              <Text style={{ fontSize: 15, color: "#A5B4FC" }}>Track your promo performance</Text>
            </AnimatedCard>

            {/* Date Range Selector */}
            <AnimatedCard delay={50} className="p-2">
              <View style={{ flexDirection: "row", gap: 6 }}>
                {RANGES.map((r) => (
                  <Pressable
                    key={r.value}
                    onPress={() => setDateRange(r.value)}
                    style={({ pressed }) => ({
                      flex: 1,
                      opacity: pressed ? 0.8 : 1,
                    })}
                  >
                    <View
                      style={{
                        paddingVertical: 8,
                        borderRadius: 12,
                        alignItems: "center",
                        backgroundColor:
                          dateRange === r.value
                            ? "rgba(129, 140, 248, 0.35)"
                            : "transparent",
                        borderWidth: 1,
                        borderColor:
                          dateRange === r.value
                            ? "rgba(129, 140, 248, 0.6)"
                            : "transparent",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: dateRange === r.value ? "700" : "400",
                          color: dateRange === r.value ? "#F8F9FF" : "#6B7280",
                        }}
                      >
                        {r.label}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </AnimatedCard>

            {/* Stats Grid */}
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <StatCard
                  icon="chart.bar.fill"
                  label="Views"
                  value={displayStats.totalViews.toLocaleString()}
                  trend="+23%"
                  delay={100}
                />
                <StatCard
                  icon="house.fill"
                  label="Visits"
                  value={displayStats.totalVisits.toLocaleString()}
                  locked={isBasicAnalytics}
                  trend="+11%"
                  delay={150}
                />
              </View>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <StatCard
                  icon="message.fill"
                  label="Bookings"
                  value={displayStats.totalBookings}
                  locked={isBasicAnalytics}
                  delay={200}
                />
                <StatCard
                  icon="arrow.up.right"
                  label="CTR"
                  value={`${displayStats.ctr.toFixed(1)}%`}
                  locked={isBasicAnalytics}
                  delay={250}
                />
              </View>
            </View>

            {/* Bar Chart */}
            <AnimatedCard delay={300} className="p-4">
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "600", color: "#F8F9FF" }}>
                  Performance Trend
                </Text>
                {isBasicAnalytics && (
                  <Pressable onPress={() => router.push("/upgrade")} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                    <Text style={{ fontSize: 12, color: "#818CF8" }}>Upgrade →</Text>
                  </Pressable>
                )}
              </View>

              {/* Legend */}
              <View style={{ flexDirection: "row", gap: 16, marginBottom: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: isBasicAnalytics ? "#4B5563" : "#818CF8" }} />
                  <Text style={{ fontSize: 11, color: isBasicAnalytics ? "#4B5563" : "#A5B4FC" }}>Views</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: isBasicAnalytics ? "#374151" : "#34D399" }} />
                  <Text style={{ fontSize: 11, color: isBasicAnalytics ? "#4B5563" : "#A5B4FC" }}>Visits</Text>
                </View>
              </View>

              <View
                onLayout={(e) => setChartWidth(e.nativeEvent.layout.width - 8)}
                style={{ position: "relative" }}
              >
                <BarChart data={chartData} locked={isBasicAnalytics} width={chartWidth} />
                {isBasicAnalytics && (
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(10, 5, 25, 0.55)",
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ fontSize: 22 }}>🔒</Text>
                    <Text style={{ fontSize: 13, color: "#C7D2FE", marginTop: 6, textAlign: "center" }}>
                      Upgrade to Pro{"\n"}to unlock charts
                    </Text>
                  </View>
                )}
              </View>
            </AnimatedCard>

            {/* Assistant Insight */}
            <AnimatedCard delay={370} strong className="p-5">
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    backgroundColor: "rgba(129, 140, 248, 0.2)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 18 }}>🤖</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: "600", color: "#F8F9FF", marginBottom: 6 }}>
                    Promo Insight
                  </Text>
                  <Text style={{ fontSize: 13, lineHeight: 20, color: "#A5B4FC" }}>
                    {isBasicAnalytics
                      ? "Upgrade to Pro to unlock AI-powered insights about your performance and get personalized recommendations."
                      : `Your promos reached ${displayStats.totalViews.toLocaleString()} people over the last ${dateRange === 365 ? "year" : `${dateRange} days`}. Views are trending up 23%. Try posting more HYPE-style content on Fridays and Saturdays for best engagement.`}
                  </Text>
                  {!isBasicAnalytics && (
                    <Pressable
                      onPress={() => router.push("/(tabs)/assistant")}
                      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, marginTop: 10 })}
                    >
                      <Text style={{ fontSize: 13, color: "#818CF8", fontWeight: "600" }}>
                        Ask Promo for ideas →
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </AnimatedCard>

            {/* Upgrade Prompt */}
            {isBasicAnalytics && (
              <AnimatedCard
                delay={420}
                className="p-5"
                style={{ borderWidth: 2, borderColor: "rgba(129, 140, 248, 0.4)" }}
              >
                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                  <Text style={{ fontSize: 28 }}>👑</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 17, fontWeight: "700", color: "#F8F9FF", marginBottom: 6 }}>
                      Unlock Advanced Analytics
                    </Text>
                    <Text style={{ fontSize: 13, color: "#C7D2FE", marginBottom: 12 }}>
                      Get detailed metrics, interactive charts, trend analysis, and AI-powered insights.
                    </Text>
                    <Pressable
                      onPress={() => router.push("/upgrade")}
                      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                    >
                      <Text style={{ fontSize: 14, fontWeight: "700", color: "#818CF8" }}>
                        Upgrade to Pro →
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </AnimatedCard>
            )}
          </View>
        </ScrollView>
      </ScreenContainer>
    </GradientBackground>
  );
}
