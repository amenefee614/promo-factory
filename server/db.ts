import { eq, sql, and, gte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, subscriptions, InsertSubscription, promoBundles, InsertPromoBundle, brandProfiles, InsertBrandProfile } from "../drizzle/schema";
import { ENV } from "./_core/env";
import { SUBSCRIPTION_PLANS } from "../shared/subscription-types";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Subscription management
export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get subscription: database not available");
    return null;
  }

  const result = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);

  if (result.length === 0) {
    // Create default free subscription for new users
    const freePlan = SUBSCRIPTION_PLANS.free;
    const newSub: InsertSubscription = {
      userId,
      tier: "free",
      generationsThisMonth: 0,
      soraCreditsRemaining: freePlan.features.soraCredits,
    };
    await db.insert(subscriptions).values(newSub);
    return { ...newSub, id: 0, createdAt: new Date(), updatedAt: new Date(), currentPeriodEnd: null, stripeCustomerId: null, stripeSubscriptionId: null };
  }

  return result[0];
}

export async function incrementGenerations(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot increment generations: database not available");
    return;
  }

  await db
    .update(subscriptions)
    .set({ generationsThisMonth: sql`${subscriptions.generationsThisMonth} + 1` })
    .where(eq(subscriptions.userId, userId));
}

export async function decrementSoraCredits(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot decrement Sora credits: database not available");
    return;
  }

  await db
    .update(subscriptions)
    .set({ soraCreditsRemaining: sql`${subscriptions.soraCreditsRemaining} - 1` })
    .where(eq(subscriptions.userId, userId));
}

// Promo bundle management
export async function createPromoBundle(data: InsertPromoBundle) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(promoBundles).values(data);
  // @ts-ignore - insertId exists on MySQL result
  return Number(result.insertId);
}

export async function getUserPromoBundles(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get promo bundles: database not available");
    return [];
  }

  return db.select().from(promoBundles).where(eq(promoBundles.userId, userId)).orderBy(sql`${promoBundles.createdAt} DESC`);
}

export async function getMonthlyUsage(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get monthly usage: database not available");
    return 0;
  }

  const sub = await getUserSubscription(userId);
  return sub?.generationsThisMonth || 0;
}

export async function incrementMonthlyUsage(userId: number) {
  return incrementGenerations(userId);
}

export async function updateSubscriptionTier(userId: number, tier: "free" | "pro" | "agency") {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const plan = SUBSCRIPTION_PLANS[tier];
  
  await db
    .update(subscriptions)
    .set({ 
      tier,
      soraCreditsRemaining: plan.features.soraCredits,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.userId, userId));
}

// Brand Profile functions
export async function getBrandProfile(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get brand profile: database not available");
    return null;
  }

  const profiles = await db.select().from(brandProfiles).where(eq(brandProfiles.userId, userId)).limit(1);
  return profiles[0] || null;
}

export async function createBrandProfile(userId: number, data: Omit<InsertBrandProfile, "userId">) {
  const db = await getDb();
  if (!db) {
    throw new Error("[Database] Cannot create brand profile: database not available");
  }

  const result = await db.insert(brandProfiles).values({
    ...data,
    userId,
  });
  
  // @ts-ignore - insertId exists on MySQL result
  return Number(result.insertId);
}

export async function updateBrandProfile(userId: number, data: Partial<Omit<InsertBrandProfile, "userId">>) {
  const db = await getDb();
  if (!db) {
    throw new Error("[Database] Cannot update brand profile: database not available");
  }

  await db.update(brandProfiles).set(data).where(eq(brandProfiles.userId, userId));
  return await getBrandProfile(userId);
}
