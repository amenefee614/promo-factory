/**
 * Watermark utility for Free tier generated images
 * 
 * Note: This is a placeholder implementation. In production, you would use:
 * - Image processing library (sharp, jimp, canvas) to overlay watermark
 * - Or add watermark parameter to image generation API
 * - Or use client-side watermarking before download
 * 
 * For now, we mark images as watermarked in the database and handle display in the UI.
 */

export interface WatermarkConfig {
  text: string;
  opacity: number;
  position: "center" | "bottom-right" | "diagonal";
  fontSize: number;
}

export const DEFAULT_WATERMARK: WatermarkConfig = {
  text: "PROMO FACTORY FREE",
  opacity: 0.3,
  position: "diagonal",
  fontSize: 48,
};

/**
 * Add watermark to image URL
 * In production, this would process the image and return a new URL with watermark applied
 * For now, we return the original URL and handle watermark overlay in the UI
 */
export async function addWatermark(
  imageUrl: string,
  config: WatermarkConfig = DEFAULT_WATERMARK
): Promise<string> {
  // TODO: Implement actual image processing with watermark overlay
  // For now, return original URL - watermark will be shown in UI
  return imageUrl;
}

/**
 * Check if an image should have a watermark based on subscription tier
 */
export function shouldWatermark(tier: string): boolean {
  return tier === "free";
}
