/**
 * Multi-Platform Export Configuration
 * 
 * Defines export formats for all major social media platforms
 */

export type PlatformType = 
  | "instagram_post"
  | "instagram_story"
  | "instagram_reel"
  | "facebook_post"
  | "facebook_story"
  | "tiktok"
  | "linkedin_post"
  | "twitter_post";

export interface PlatformConfig {
  id: PlatformType;
  name: string;
  displayName: string;
  width: number;
  height: number;
  aspectRatio: string;
  icon: string;
  color: string;
  description: string;
}

export const PLATFORM_CONFIGS: Record<PlatformType, PlatformConfig> = {
  instagram_post: {
    id: "instagram_post",
    name: "Instagram Post",
    displayName: "IG Post",
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
    icon: "📸",
    color: "#E1306C",
    description: "Square format for Instagram feed",
  },
  instagram_story: {
    id: "instagram_story",
    name: "Instagram Story",
    displayName: "IG Story",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
    icon: "📱",
    color: "#C13584",
    description: "Vertical format for Instagram Stories",
  },
  instagram_reel: {
    id: "instagram_reel",
    name: "Instagram Reel",
    displayName: "IG Reel",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
    icon: "🎬",
    color: "#405DE6",
    description: "Vertical video for Instagram Reels",
  },
  facebook_post: {
    id: "facebook_post",
    name: "Facebook Post",
    displayName: "FB Post",
    width: 1200,
    height: 630,
    aspectRatio: "1.91:1",
    icon: "📘",
    color: "#1877F2",
    description: "Landscape format for Facebook feed",
  },
  facebook_story: {
    id: "facebook_story",
    name: "Facebook Story",
    displayName: "FB Story",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
    icon: "📖",
    color: "#4267B2",
    description: "Vertical format for Facebook Stories",
  },
  tiktok: {
    id: "tiktok",
    name: "TikTok",
    displayName: "TikTok",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
    icon: "🎵",
    color: "#000000",
    description: "Vertical video for TikTok",
  },
  linkedin_post: {
    id: "linkedin_post",
    name: "LinkedIn Post",
    displayName: "LinkedIn",
    width: 1200,
    height: 627,
    aspectRatio: "1.91:1",
    icon: "💼",
    color: "#0A66C2",
    description: "Landscape format for LinkedIn feed",
  },
  twitter_post: {
    id: "twitter_post",
    name: "Twitter/X Post",
    displayName: "Twitter/X",
    width: 1200,
    height: 675,
    aspectRatio: "16:9",
    icon: "🐦",
    color: "#1DA1F2",
    description: "Landscape format for Twitter/X",
  },
};

export const POPULAR_PLATFORMS: PlatformType[] = [
  "instagram_post",
  "instagram_story",
  "facebook_post",
  "tiktok",
  "linkedin_post",
  "twitter_post",
];

export const ALL_PLATFORMS: PlatformType[] = Object.keys(PLATFORM_CONFIGS) as PlatformType[];

/**
 * Get platform configuration by ID
 */
export function getPlatformConfig(platformId: PlatformType): PlatformConfig {
  return PLATFORM_CONFIGS[platformId];
}

/**
 * Get all platform configurations
 */
export function getAllPlatformConfigs(): PlatformConfig[] {
  return Object.values(PLATFORM_CONFIGS);
}

/**
 * Get popular platform configurations
 */
export function getPopularPlatformConfigs(): PlatformConfig[] {
  return POPULAR_PLATFORMS.map((id) => PLATFORM_CONFIGS[id]);
}

/**
 * Calculate dimensions for a platform while maintaining aspect ratio
 */
export function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  targetPlatform: PlatformType
): { width: number; height: number; scale: number } {
  const config = getPlatformConfig(targetPlatform);
  const targetRatio = config.width / config.height;
  const originalRatio = originalWidth / originalHeight;

  let width: number;
  let height: number;
  let scale: number;

  if (originalRatio > targetRatio) {
    // Original is wider - fit to height
    height = config.height;
    width = Math.round(height * originalRatio);
    scale = config.height / originalHeight;
  } else {
    // Original is taller - fit to width
    width = config.width;
    height = Math.round(width / originalRatio);
    scale = config.width / originalWidth;
  }

  return { width, height, scale };
}
