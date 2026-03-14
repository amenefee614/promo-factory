import React, { createContext, useContext, ReactNode } from 'react';
import { trpc } from './trpc';
import { SubscriptionTier, SUBSCRIPTION_PLANS } from '@/shared/subscription-types';

interface SubscriptionContextType {
  tier: SubscriptionTier;
  generationsThisMonth: number;
  soraCreditsRemaining: number;
  isLoading: boolean;
  canGenerate: (includeVideo?: boolean) => boolean;
  canUseSora: () => boolean;
  needsUpgrade: (feature: 'video' | 'sora' | 'analytics' | 'assistant') => boolean;
  refetch: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { data: subscription, isLoading, refetch } = trpc.subscription.get.useQuery(undefined, {
    retry: 1,
  });

  const tier: SubscriptionTier = subscription?.tier || 'free';
  const plan = SUBSCRIPTION_PLANS[tier];
  const generationsThisMonth = subscription?.generationsThisMonth || 0;
  const soraCreditsRemaining = subscription?.soraCreditsRemaining || 0;

  const canGenerate = (includeVideo = false) => {
    if (!includeVideo) {
      // Image generation
      if (plan.features.monthlyGenerations === 'unlimited') return true;
      return generationsThisMonth < plan.features.monthlyGenerations;
    } else {
      // Video generation
      if (!plan.features.videoGeneration) return false;
      if (plan.features.monthlyGenerations === 'unlimited') return true;
      return generationsThisMonth < plan.features.monthlyGenerations;
    }
  };

  const canUseSora = () => {
    return plan.features.videoEngine.includes('sora') && soraCreditsRemaining > 0;
  };

  const needsUpgrade = (feature: 'video' | 'sora' | 'analytics' | 'assistant') => {
    switch (feature) {
      case 'video':
        return !plan.features.videoGeneration;
      case 'sora':
        return !plan.features.videoEngine.includes('sora');
      case 'analytics':
        return plan.features.analytics === 'basic';
      case 'assistant':
        return !plan.features.assistantActions;
      default:
        return false;
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        generationsThisMonth,
        soraCreditsRemaining,
        isLoading,
        canGenerate,
        canUseSora,
        needsUpgrade,
        refetch,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
}
