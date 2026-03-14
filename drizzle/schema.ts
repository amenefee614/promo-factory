import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Subscription management
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tier: mysqlEnum("tier", ["free", "pro", "agency"]).default("free").notNull(),
  generationsThisMonth: int("generationsThisMonth").default(0).notNull(),
  soraCreditsRemaining: int("soraCreditsRemaining").default(0).notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

// Promo bundles (generated content)
export const promoBundles = mysqlTable("promoBundles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  // Asset URLs
  flyerUrl: text("flyerUrl"),
  storyUrl: text("storyUrl"),
  feedPostUrl: text("feedPostUrl"),
  videoUrl: text("videoUrl"),
  // Copy pack
  headline: text("headline"),
  caption: text("caption"),
  hooks: text("hooks"), // JSON array
  cta: text("cta"),
  // Metadata
  videoEngine: mysqlEnum("videoEngine", ["veo", "sora", "none"]).default("none"),
  watermarked: int("watermarked").default(1).notNull(), // 1 = true, 0 = false
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PromoBundle = typeof promoBundles.$inferSelect;
export type InsertPromoBundle = typeof promoBundles.$inferInsert;

// Theme settings per user
export const themeSettings = mysqlTable("themeSettings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  presetId: varchar("presetId", { length: 64 }).notNull(),
  accentColor: varchar("accentColor", { length: 7 }).notNull(),
  gradientStart: varchar("gradientStart", { length: 7 }).notNull(),
  gradientEnd: varchar("gradientEnd", { length: 7 }).notNull(),
  blurIntensity: int("blurIntensity").notNull(),
  glassOpacity: int("glassOpacity").notNull(), // Store as 0-100 instead of 0.0-1.0
  cornerRadius: int("cornerRadius").notNull(),
  shadowDepth: mysqlEnum("shadowDepth", ["small", "medium", "large"]).notNull(),
  grainAmount: int("grainAmount").notNull(),
  animationIntensity: mysqlEnum("animationIntensity", ["low", "medium", "high"]).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ThemeSetting = typeof themeSettings.$inferSelect;
export type InsertThemeSetting = typeof themeSettings.$inferInsert;

// Brand profiles for consistent branding across generations
export const brandProfiles = mysqlTable("brandProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  businessName: varchar("businessName", { length: 255 }).notNull(),
  industry: varchar("industry", { length: 100 }).notNull(),
  primaryColor: varchar("primaryColor", { length: 7 }).notNull(), // Hex color
  secondaryColor: varchar("secondaryColor", { length: 7 }).notNull(),
  accentColor: varchar("accentColor", { length: 7 }).notNull(),
  logoUrl: text("logoUrl"),
  tagline: text("tagline"),
  targetAudience: text("targetAudience"),
  brandVoice: mysqlEnum("brandVoice", ["professional", "casual", "playful", "luxury", "bold"]).default("professional"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BrandProfile = typeof brandProfiles.$inferSelect;
export type InsertBrandProfile = typeof brandProfiles.$inferInsert;
