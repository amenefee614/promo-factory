import { z } from "zod";
import { router, protectedProcedure } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import * as db from "./db";
import { MODEL_CONFIG, generateFreeImage } from "./model-config";

export const promoGenerationRouter = router({
  generate: protectedProcedure
    .input(
      z.object({
        description: z.string().min(10).max(1000),
        style: z.enum(["hype", "insta", "video", "info"]),
        videoEngine: z.enum(["veo3", "sora"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Get brand profile for personalization
      const brandProfile = await db.getBrandProfile(userId);

      // Check subscription tier and usage limits
      const subscription = await db.getUserSubscription(userId);
      if (!subscription) {
        throw new Error("Subscription not found");
      }
      const usageThisMonth = await db.getMonthlyUsage(userId);

      const limits = {
        free: 5,
        pro: 50,
        agency: Infinity,
      };

      const limit = limits[subscription.tier as keyof typeof limits] || 5;
      if (usageThisMonth >= limit) {
        throw new Error(
          `Monthly limit reached (${limit} generations). Upgrade to ${
            subscription.tier === "free" ? "Pro" : "Agency"
          } for more.`
        );
      }

      // Generate promotional content using LLM with brand context
      const brandContext = brandProfile
        ? `Brand: ${brandProfile.businessName}. Industry: ${brandProfile.industry}. Brand colors: ${brandProfile.primaryColor}, ${brandProfile.secondaryColor}. `
        : "";
      const promoContent = await generatePromoContent(
        input.description,
        input.style,
        brandContext
      );

      // Generate images based on subscription tier
      let flyerUrl: string;
      let storyUrl: string;
      let feedUrl: string;

      if (subscription.tier === "free") {
        // Use free image generation API for Free tier
        const brandColors = brandProfile
          ? `Use brand colors: ${brandProfile.primaryColor}, ${brandProfile.secondaryColor}. `
          : "";
        flyerUrl = await generateFreeImage(
          `Professional promotional flyer for ${brandProfile?.businessName || "business"}: ${input.description}. ${brandColors}Style: ${input.style}. Modern, eye-catching design with bold typography`
        );
        storyUrl = await generateFreeImage(
          `Instagram story 9:16 for ${brandProfile?.businessName || "business"}: ${input.description}. ${brandColors}Style: ${input.style}. Vertical format, bold text`
        );
        feedUrl = await generateFreeImage(
          `Social media post 1:1 for ${brandProfile?.businessName || "business"}: ${input.description}. ${brandColors}Style: ${input.style}. Square format, professional`
        );
      } else {
        // Use premium image generation for Pro/Agency tiers
        const brandColors = brandProfile
          ? `Use brand colors ${brandProfile.primaryColor} and ${brandProfile.secondaryColor}. `
          : "";
        const businessName = brandProfile?.businessName || "the business";
        const flyerImage = await generateImage({
          prompt: `Create a professional promotional flyer for ${businessName}: ${input.description}. ${brandColors}Style: ${input.style}. Modern, eye-catching design with bold typography and vibrant colors.`,
        });
        const storyImage = await generateImage({
          prompt: `Create an Instagram story (9:16) for ${businessName}: ${input.description}. ${brandColors}Style: ${input.style}. Vertical format, bold text, engaging visual.`,
        });
        const feedImage = await generateImage({
          prompt: `Create a social media feed post (1:1) for ${businessName}: ${input.description}. ${brandColors}Style: ${input.style}. Square format, professional, shareable.`,
        });
        flyerUrl = flyerImage.url || "";
        storyUrl = storyImage.url || "";
        feedUrl = feedImage.url || "";
      }

      // Save to database
      const bundleId = await db.createPromoBundle({
        userId,
        title: `${input.style.toUpperCase()} Promo`,
        description: input.description,
        flyerUrl,
        storyUrl,
        feedPostUrl: feedUrl,
        videoUrl: null, // Video generation would be implemented separately
        headline: promoContent.headline,
        caption: promoContent.bodyText,
        hooks: JSON.stringify(promoContent.taglines),
        cta: promoContent.cta,
        videoEngine: input.videoEngine === "sora" ? "sora" : input.videoEngine === "veo3" ? "veo" : "none",
        watermarked: subscription.tier === "free" ? 1 : 0,
      });

      // Increment usage counter
      await db.incrementMonthlyUsage(userId);

      return {
        bundleId,
        flyer: flyerUrl,
        story: storyUrl,
        feed: feedUrl,
        copyPack: promoContent,
        tier: subscription.tier,
        model: subscription.tier === "free" ? "pollinations" : "internal",
      };
    }),
});

async function generatePromoContent(description: string, style: string, brandContext: string = "") {
  const stylePrompts = {
    hype: "Create high-energy, exciting promotional copy with lots of enthusiasm and urgency",
    insta: "Create Instagram-friendly promotional copy that's trendy, engaging, and uses relevant hashtags",
    video: "Create promotional copy optimized for video scripts with clear narration and visual cues",
    info: "Create informative, professional promotional copy that clearly explains benefits and features",
  };

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are a professional marketing copywriter. ${stylePrompts[style as keyof typeof stylePrompts]}. Return JSON with the following structure:
{
  "headline": "Main attention-grabbing headline (max 60 chars)",
  "subheadline": "Supporting subheadline (max 100 chars)",
  "bodyText": "Main promotional text (max 300 chars)",
  "cta": "Call to action button text (max 30 chars)",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "taglines": ["Short tagline 1", "Short tagline 2", "Short tagline 3"]
}`,
      },
      {
        role: "user",
        content: `${brandContext}Create promotional copy for: ${description}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = typeof response.choices[0].message.content === 'string' 
    ? response.choices[0].message.content 
    : JSON.stringify(response.choices[0].message.content);
  return JSON.parse(content);
}
