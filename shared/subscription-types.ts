export type SubscriptionTier = 'free' | 'pro' | 'agency';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number; // Monthly price in USD
  features: {
    imageGeneration: boolean;
    videoGeneration: boolean;
    monthlyGenerations: number | 'unlimited';
    watermarked: boolean;
    videoEngine: ('veo' | 'sora')[];
    soraCredits: number;
    analytics: 'basic' | 'advanced';
    assistantActions: boolean;
    teamMembers: number;
    multiLocation: boolean;
    prioritySupport: boolean;
  };
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: {
      imageGeneration: true,
      videoGeneration: false,
      monthlyGenerations: 10,
      watermarked: true,
      videoEngine: [],
      soraCredits: 0,
      analytics: 'basic',
      assistantActions: false,
      teamMembers: 1,
      multiLocation: false,
      prioritySupport: false,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 29,
    features: {
      imageGeneration: true,
      videoGeneration: true,
      monthlyGenerations: 'unlimited',
      watermarked: false,
      videoEngine: ['veo', 'sora'],
      soraCredits: 5,
      analytics: 'advanced',
      assistantActions: true,
      teamMembers: 1,
      multiLocation: false,
      prioritySupport: false,
    },
  },
  agency: {
    id: 'agency',
    name: 'Agency',
    price: 99,
    features: {
      imageGeneration: true,
      videoGeneration: true,
      monthlyGenerations: 'unlimited',
      watermarked: false,
      videoEngine: ['veo', 'sora'],
      soraCredits: 20,
      analytics: 'advanced',
      assistantActions: true,
      teamMembers: 5,
      multiLocation: true,
      prioritySupport: true,
    },
  },
};

export interface UserSubscription {
  userId: number;
  tier: SubscriptionTier;
  generationsThisMonth: number;
  soraCreditsRemaining: number;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: Date;
}
