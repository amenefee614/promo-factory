import { describe, it, expect } from 'vitest';
import { SUBSCRIPTION_PLANS } from '../shared/subscription-types';

describe('Subscription Plans', () => {
  it('should have three tiers defined', () => {
    expect(Object.keys(SUBSCRIPTION_PLANS)).toHaveLength(3);
    expect(SUBSCRIPTION_PLANS.free).toBeDefined();
    expect(SUBSCRIPTION_PLANS.pro).toBeDefined();
    expect(SUBSCRIPTION_PLANS.agency).toBeDefined();
  });

  it('free tier should have correct features', () => {
    const free = SUBSCRIPTION_PLANS.free;
    expect(free.price).toBe(0);
    expect(free.features.imageGeneration).toBe(true);
    expect(free.features.videoGeneration).toBe(false);
    expect(free.features.monthlyGenerations).toBe(10);
    expect(free.features.watermarked).toBe(true);
    expect(free.features.assistantActions).toBe(false);
  });

  it('pro tier should have correct features', () => {
    const pro = SUBSCRIPTION_PLANS.pro;
    expect(pro.price).toBe(29);
    expect(pro.features.imageGeneration).toBe(true);
    expect(pro.features.videoGeneration).toBe(true);
    expect(pro.features.monthlyGenerations).toBe('unlimited');
    expect(pro.features.watermarked).toBe(false);
    expect(pro.features.assistantActions).toBe(true);
    expect(pro.features.videoEngine).toContain('veo');
    expect(pro.features.videoEngine).toContain('sora');
    expect(pro.features.soraCredits).toBe(5);
  });

  it('agency tier should have correct features', () => {
    const agency = SUBSCRIPTION_PLANS.agency;
    expect(agency.price).toBe(99);
    expect(agency.features.imageGeneration).toBe(true);
    expect(agency.features.videoGeneration).toBe(true);
    expect(agency.features.monthlyGenerations).toBe('unlimited');
    expect(agency.features.watermarked).toBe(false);
    expect(agency.features.assistantActions).toBe(true);
    expect(agency.features.soraCredits).toBe(20);
    expect(agency.features.teamMembers).toBe(5);
    expect(agency.features.multiLocation).toBe(true);
  });

  it('should have correct tier hierarchy', () => {
    expect(SUBSCRIPTION_PLANS.free.price).toBeLessThan(SUBSCRIPTION_PLANS.pro.price);
    expect(SUBSCRIPTION_PLANS.pro.price).toBeLessThan(SUBSCRIPTION_PLANS.agency.price);
    expect(SUBSCRIPTION_PLANS.pro.features.soraCredits).toBeLessThan(
      SUBSCRIPTION_PLANS.agency.features.soraCredits
    );
  });
});
