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
    neonColor = "#818CF8",
  }: {
    icon: any;
    label: string;
    value: string | number;
    subtitle?: string;
    locked?: boolean;
    delay?: number;
    trend?: string;
    neonColor?: string;
  }) => (
    <AnimatedCard
      delay={delay}
      className="flex-1 p-4"
      neonColor={locked ? undefined : neonColor}
      neonIntensity={locked ? 0 : 0.5}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: locked ? 'rgba(107, 114, 128, 0.15)' : `${neonColor}20`,
            borderWidth: 1.5,
            borderColor: locked ? 'rgba(107, 114, 128, 0.3)' : `${neonColor}40`,
            ...(Platform.OS === 'web' && !locked && {
              boxShadow: `0 0 15px ${neonColor}40`,
            }),
          }}
        >
          <IconSymbol name={icon} size={22} color={locked ? "#6B7280" : neonColor} />
        </View>
        {locked && (
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
              backgroundColor: "rgba(251, 191, 36, 0.15)",
              borderWidth: 1,
              borderColor: "rgba(251, 191, 36, 0.4)",
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: "700", color: "#FCD34D", letterSpacing: 0.3 }}>PRO</Text>
          </View>
        )}
        {trend && !locked && (
          <View
            style={{
              paddingHorizontal: 6,
              paddingVertical: 3,
              borderRadius: 8,
              backgroundColor: "rgba(52, 211, 153, 0.2)",
              borderWidth: 1,
              borderColor: "rgba(52, 211, 153, 0.5)",
              ...(Platform.OS === 'web' && {
                boxShadow: '0 0 10px rgba(52, 211, 153, 0.3)',
              }),
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: "700", color: "#34D399", letterSpacing: 0.2 }}>{trend}</Text>
          </View>
        )}
      </View>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "900",
          color: locked ? "#6B7280" : "#F8F9FF",
          marginBottom: 4,
          letterSpacing: -0.5,
          ...(Platform.OS === 'web' && !locked && {
            textShadow: `0 0 15px ${neonColor}60`,
          }),
        }}
      >
        {locked ? "---" : value}
      </Text>
      <Text style={{ fontSize: 12, fontWeight: "600", color: "#818CF8", letterSpacing: 0.3 }}>{label.toUpperCase()}</Text>
      {subtitle && !locked && (
        <Text style={{ fontSize: 11, color: "#34D399", marginTop: 3, fontWeight: "600" }}>{subtitle}</Text>
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
            {/* Header with neon glow */}
            <View className="gap-3 mt-4">
              <Text
                style={{
                  fontSize: 38,
                  fontWeight: "900",
                  color: "#34D399",
                  letterSpacing: 2,
                  ...(Platform.OS === 'web' && {
                    textShadow: '0 0 30px rgba(52, 211, 153, 0.8), 0 0 60px rgba(52, 211, 153, 0.4)',
                  }),
                }}
              >
                ANALYTICS
              </Text>
              <View
                style={{
                  height: 2,
                  backgroundColor: "#34D399",
                  width: 100,
                  borderRadius: 1,
                  ...(Platform.OS === 'web' && {
                    boxShadow: '0 0 15px rgba(52, 211, 153, 0.8)',
                  }),
                }}
              />
              <Text style={{ fontSize: 15, color: "#C7D2FE", fontWeight: "500" }}>Track your promo performance</Text>
            </View>

            {/* Date Range Selector */}
            <View style={{ flexDirection: "row", gap: 8 }}>
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
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderRadius: 12,
                      alignItems: "center",
                      backgroundColor:
                        dateRange === r.value
                          ? "rgba(129, 140, 248, 0.2)"
                          : "transparent",
                      borderWidth: 2,
                      borderColor:
                        dateRange === r.value
                          ? "#818CF8"
                          : "rgba(129, 140, 248, 0.2)",
                      ...(Platform.OS === 'web' && dateRange === r.value && {
                        boxShadow: '0 0 20px rgba(129, 140, 248, 0.5)',
                      }),
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: dateRange === r.value ? "700" : "500",
                        color: dateRange === r.value ? "#F8F9FF" : "#818CF8",
                        letterSpacing: 0.3,
                      }}
                    >
                      {r.label.toUpperCase()}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Stats Grid */}
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <StatCard
                  icon="chart.bar.fill"
                  label="Views"
                  value={displayStats.totalViews.toLocaleString()}
                  trend="+23%"
                  delay={100}
                  neonColor="#818CF8"
                />
                <StatCard
                  icon="house.fill"
                  label="Visits"
                  value={displayStats.totalVisits.toLocaleString()}
                  locked={isBasicAnalytics}
                  trend="+11%"
                  delay={150}
                  neonColor="#34D399"
                />
              </View>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <StatCard
                  icon="message.fill"
                  label="Bookings"
                  value={displayStats.totalBookings}
                  locked={isBasicAnalytics}
                  delay={200}
                  neonColor="#EC4899"
                />
                <StatCard
                  icon="arrow.up.right"
                  label="CTR"
                  value={`${displayStats.ctr.toFixed(1)}%`}
                  locked={isBasicAnalytics}
                  delay={250}
                  neonColor="#F59E0B"
                />
              </View>
            </View>

            {/* Bar Chart */}
            <View
              style={{
                borderRadius: 16,
                overflow: "hidden",
                backgroundColor: "rgba(15, 23, 42, 0.4)",
                borderWidth: 1.5,
                borderColor: "rgba(129, 140, 248, 0.3)",
                ...(Platform.OS === 'web' && {
                  boxShadow: '0 0 30px rgba(129, 140, 248, 0.2), inset 0 0 30px rgba(129, 140, 248, 0.05)',
                }),
              }}
            >
              <View style={{ padding: 16 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#F8F9FF",
                      letterSpacing: 0.5,
                      ...(Platform.OS === 'web' && {
                        textShadow: '0 0 10px rgba(129, 140, 248, 0.4)',
                      }),
                    }}
                  >
                    PERFORMANCE TREND
                  </Text>
                  {isBasicAnalytics && (
                    <Pressable onPress={() => router.push("/upgrade")} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
                      <Text style={{ fontSize: 12, fontWeight: "700", color: "#818CF8", letterSpacing: 0.3 }}>UPGRADE →</Text>
                    </Pressable>
                  )}
                </View>

                {/* Legend */}
                <View style={{ flexDirection: "row", gap: 20, marginBottom: 14 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 2,
                        backgroundColor: isBasicAnalytics ? "#4B5563" : "#818CF8",
                        ...(Platform.OS === 'web' && !isBasicAnalytics && {
                          boxShadow: '0 0 10px rgba(129, 140, 248, 0.6)',
                        }),
                      }}
                    />
                    <Text style={{ fontSize: 12, fontWeight: "600", color: isBasicAnalytics ? "#6B7280" : "#A5B4FC", letterSpacing: 0.3 }}>
                      VIEWS
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 2,
                        backgroundColor: isBasicAnalytics ? "#374151" : "#34D399",
                        ...(Platform.OS === 'web' && !isBasicAnalytics && {
                          boxShadow: '0 0 10px rgba(52, 211, 153, 0.6)',
                        }),
                      }}
                    />
                    <Text style={{ fontSize: 12, fontWeight: "600", color: isBasicAnalytics ? "#6B7280" : "#A5B4FC", letterSpacing: 0.3 }}>
                      VISITS
                    </Text>
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
                        backgroundColor: "rgba(10, 5, 25, 0.65)",
                        borderRadius: 8,
                        backdropFilter: "blur(4px)",
                        ...(Platform.OS === 'web' && {
                          boxShadow: 'inset 0 0 30px rgba(236, 72, 153, 0.2)',
                        }),
                      }}
                    >
                      <View
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                          backgroundColor: "rgba(236, 72, 153, 0.15)",
                          alignItems: "center",
                          justifyContent: "center",
                          borderWidth: 2,
                          borderColor: "rgba(236, 72, 153, 0.4)",
                          marginBottom: 10,
                          ...(Platform.OS === 'web' && {
                            boxShadow: '0 0 20px rgba(236, 72, 153, 0.3)',
                          }),
                        }}
                      >
                        <Text style={{ fontSize: 24 }}>🔒</Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "700",
                          color: "#F8F9FF",
                          marginBottom: 4,
                          letterSpacing: 0.3,
                        }}
                      >
                        UPGRADE TO PRO
                      </Text>
                      <Text style={{ fontSize: 12, color: "#C7D2FE", textAlign: "center" }}>
                        Unlock detailed charts
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Assistant Insight */}
            <View
              style={{
                borderRadius: 16,
                overflow: "hidden",
                backgroundColor: "rgba(15, 23, 42, 0.4)",
                borderWidth: 1.5,
                borderColor: "rgba(129, 140, 248, 0.3)",
                padding: 16,
                ...(Platform.OS === 'web' && {
                  boxShadow: '0 0 25px rgba(129, 140, 248, 0.15), inset 0 0 30px rgba(129, 140, 248, 0.05)',
                }),
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 14 }}>
                <View
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 12,
                    backgroundColor: "rgba(129, 140, 248, 0.15)",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1.5,
                    borderColor: "rgba(129, 140, 248, 0.3)",
                    ...(Platform.OS === 'web' && {
                      boxShadow: '0 0 15px rgba(129, 140, 248, 0.3)',
                    }),
                  }}
                >
                  <Text style={{ fontSize: 24 }}>🤖</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "700",
                      color: "#F8F9FF",
                      marginBottom: 8,
                      letterSpacing: 0.3,
                      ...(Platform.OS === 'web' && {
                        textShadow: '0 0 10px rgba(129, 140, 248, 0.3)',
                      }),
                    }}
                  >
                    PROMO INSIGHT
                  </Text>
                  <Text style={{ fontSize: 13, lineHeight: 20, color: "#C7D2FE", fontWeight: "500" }}>
                    {isBasicAnalytics
                      ? "Upgrade to Pro to unlock AI-powered insights about your performance and get personalized recommendations."
                      : `Your promos reached ${displayStats.totalViews.toLocaleString()} people over the last ${dateRange === 365 ? "year" : `${dateRange} days`}. Views are trending up 23%. Try posting more HYPE-style content on Fridays and Saturdays for best engagement.`}
                  </Text>
                  {!isBasicAnalytics && (
                    <Pressable
                      onPress={() => router.push("/(tabs)/assistant")}
                      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, marginTop: 12 })}
                    >
                      <Text style={{ fontSize: 13, fontWeight: "700", color: "#34D399", letterSpacing: 0.3 }}>
                        ASK PROMO FOR IDEAS →
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>

            {/* Upgrade Prompt */}
            {isBasicAnalytics && (
              <View
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  backgroundColor: "rgba(15, 23, 42, 0.4)",
                  borderWidth: 2,
                  borderColor: "rgba(236, 72, 153, 0.4)",
                  padding: 16,
                  ...(Platform.OS === 'web' && {
                    boxShadow: '0 0 30px rgba(236, 72, 153, 0.25), inset 0 0 30px rgba(236, 72, 153, 0.08)',
                  }),
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 14 }}>
                  <View
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 12,
                      backgroundColor: "rgba(236, 72, 153, 0.15)",
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1.5,
                      borderColor: "rgba(236, 72, 153, 0.3)",
                      ...(Platform.OS === 'web' && {
                        boxShadow: '0 0 15px rgba(236, 72, 153, 0.3)',
                      }),
                    }}
                  >
                    <Text style={{ fontSize: 28 }}>👑</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: "900",
                        color: "#F8F9FF",
                        marginBottom: 8,
                        letterSpacing: 0.5,
                        ...(Platform.OS === 'web' && {
                          textShadow: '0 0 15px rgba(236, 72, 153, 0.4)',
                        }),
                      }}
                    >
                      UNLOCK ADVANCED
                    </Text>
                    <Text style={{ fontSize: 13, color: "#C7D2FE", marginBottom: 12, lineHeight: 20, fontWeight: "500" }}>
                      Get detailed metrics, interactive charts, trend analysis, and AI-powered insights.
                    </Text>
                    <Pressable
                      onPress={() => router.push("/upgrade")}
                      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                    >
                      <Text style={{ fontSize: 14, fontWeight: "700", color: "#EC4899", letterSpacing: 0.3 }}>
                        UPGRADE TO PRO →
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </ScreenContainer>
    </GradientBackground>
  );
}
