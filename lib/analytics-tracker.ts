/**
 * Analytics Tracking Service
 * 
 * Tracks user actions and stores analytics data in AsyncStorage.
 * In production, this would send data to a backend analytics service.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

const ANALYTICS_KEY = "@promo_factory_analytics";

export type AnalyticsEvent = {
  id: string;
  userId: number;
  eventType: "promo_created" | "promo_viewed" | "promo_shared" | "promo_downloaded" | "page_view";
  promoId?: string;
  metadata?: Record<string, any>;
  timestamp: string;
};

export type AnalyticsData = {
  events: AnalyticsEvent[];
  summary: {
    totalViews: number;
    totalVisits: number;
    totalBookings: number;
    totalShares: number;
    totalDownloads: number;
    ctr: number; // Click-through rate
  };
};

/**
 * Track an analytics event
 */
export async function trackEvent(
  userId: number,
  eventType: AnalyticsEvent["eventType"],
  promoId?: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    const data = await getAnalyticsData(userId);
    
    const event: AnalyticsEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      eventType,
      promoId,
      metadata,
      timestamp: new Date().toISOString(),
    };

    data.events.push(event);
    
    // Update summary
    if (eventType === "promo_viewed") {
      data.summary.totalViews++;
    } else if (eventType === "page_view") {
      data.summary.totalVisits++;
    } else if (eventType === "promo_shared") {
      data.summary.totalShares++;
    } else if (eventType === "promo_downloaded") {
      data.summary.totalDownloads++;
    }

    // Calculate CTR (shares + downloads / views)
    if (data.summary.totalViews > 0) {
      data.summary.ctr = 
        ((data.summary.totalShares + data.summary.totalDownloads) / data.summary.totalViews) * 100;
    }

    await saveAnalyticsData(userId, data);
    console.log("[Analytics] Event tracked:", eventType, promoId);
  } catch (error) {
    console.error("[Analytics] Failed to track event:", error);
  }
}

/**
 * Get analytics data for a user
 */
export async function getAnalyticsData(userId: number): Promise<AnalyticsData> {
  try {
    const key = `${ANALYTICS_KEY}_${userId}`;
    const json = await AsyncStorage.getItem(key);
    
    if (json) {
      return JSON.parse(json);
    }
    
    // Return empty data if none exists
    return {
      events: [],
      summary: {
        totalViews: 0,
        totalVisits: 0,
        totalBookings: 0,
        totalShares: 0,
        totalDownloads: 0,
        ctr: 0,
      },
    };
  } catch (error) {
    console.error("[Analytics] Failed to get analytics data:", error);
    return {
      events: [],
      summary: {
        totalViews: 0,
        totalVisits: 0,
        totalBookings: 0,
        totalShares: 0,
        totalDownloads: 0,
        ctr: 0,
      },
    };
  }
}

/**
 * Save analytics data
 */
async function saveAnalyticsData(userId: number, data: AnalyticsData): Promise<void> {
  try {
    const key = `${ANALYTICS_KEY}_${userId}`;
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("[Analytics] Failed to save analytics data:", error);
  }
}

/**
 * Get analytics for a specific time range
 */
export async function getAnalyticsByDateRange(
  userId: number,
  days: number
): Promise<AnalyticsData> {
  try {
    const allData = await getAnalyticsData(userId);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const filteredEvents = allData.events.filter((event) => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= cutoffDate;
    });

    // Recalculate summary for filtered events
    const summary = {
      totalViews: 0,
      totalVisits: 0,
      totalBookings: 0,
      totalShares: 0,
      totalDownloads: 0,
      ctr: 0,
    };

    filteredEvents.forEach((event) => {
      if (event.eventType === "promo_viewed") summary.totalViews++;
      if (event.eventType === "page_view") summary.totalVisits++;
      if (event.eventType === "promo_shared") summary.totalShares++;
      if (event.eventType === "promo_downloaded") summary.totalDownloads++;
    });

    if (summary.totalViews > 0) {
      summary.ctr = ((summary.totalShares + summary.totalDownloads) / summary.totalViews) * 100;
    }

    return {
      events: filteredEvents,
      summary,
    };
  } catch (error) {
    console.error("[Analytics] Failed to get analytics by date range:", error);
    return {
      events: [],
      summary: {
        totalViews: 0,
        totalVisits: 0,
        totalBookings: 0,
        totalShares: 0,
        totalDownloads: 0,
        ctr: 0,
      },
    };
  }
}

/**
 * Clear all analytics data (for testing)
 */
export async function clearAnalyticsData(userId: number): Promise<void> {
  try {
    const key = `${ANALYTICS_KEY}_${userId}`;
    await AsyncStorage.removeItem(key);
    console.log("[Analytics] Data cleared for user:", userId);
  } catch (error) {
    console.error("[Analytics] Failed to clear analytics data:", error);
  }
}
