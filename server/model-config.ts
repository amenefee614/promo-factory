/**
 * Model configuration for different subscription tiers
 */

export const MODEL_CONFIG = {
  free: {
    image: {
      provider: "pollinations",
      endpoint: "https://image.pollinations.ai/prompt",
      // Pollinations.ai is a free image generation API
      // Usage: https://image.pollinations.ai/prompt/{prompt}?width=1024&height=1024&nologo=true
    },
    video: {
      provider: "none",
      // Free tier gets no video generation
      // Users see upgrade prompt instead
    },
  },
  pro: {
    image: {
      provider: "internal",
      // Use server's built-in image generation (premium quality)
    },
    video: {
      provider: "veo3",
      // Google Veo 3 for Pro tier
    },
  },
  agency: {
    image: {
      provider: "internal",
      // Use server's built-in image generation (premium quality)
    },
    video: {
      provider: "sora",
      // OpenAI Sora for Agency tier (highest quality)
    },
  },
} as const;

export type SubscriptionTier = keyof typeof MODEL_CONFIG;

/**
 * Generate image using Pollinations.ai free API
 */
export async function generateFreeImage(prompt: string): Promise<string> {
  // Pollinations.ai returns the image directly from the URL
  // No API key required, completely free
  const encodedPrompt = encodeURIComponent(prompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&model=flux`;
  
  // The URL itself is the image - no need to fetch
  return imageUrl;
}

/**
 * Generate video using free API (placeholder for now)
 * Free tier doesn't get video generation
 */
export async function generateFreeVideo(prompt: string): Promise<string | null> {
  // Free tier doesn't support video generation
  return null;
}
