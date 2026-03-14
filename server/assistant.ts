import { z } from "zod";
import { router, protectedProcedure } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import * as db from "./db";

export const assistantRouter = router({
  chat: protectedProcedure
    .input(
      z.object({
        message: z.string().min(1).max(1000),
        history: z
          .array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string(),
            })
          )
          .max(20),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Get user context in parallel
      const [brandProfile, subscription, monthlyUsage] = await Promise.all([
        db.getBrandProfile(userId),
        db.getUserSubscription(userId),
        db.getMonthlyUsage(userId),
      ]);

      const tier = subscription?.tier || "free";
      const limits: Record<string, number> = { free: 5, pro: 50, agency: Infinity };
      const limit = limits[tier] ?? 5;
      const remaining = limit === Infinity ? 999 : Math.max(0, limit - monthlyUsage);

      // Build context strings
      const businessCtx = brandProfile
        ? `The user's business is "${brandProfile.businessName}" in the ${brandProfile.industry} industry. Their brand colors are ${brandProfile.primaryColor} and ${brandProfile.secondaryColor}.`
        : "The user hasn't set up their brand profile yet — you can suggest they do so to get better personalized content.";

      const usageCtx =
        limit === Infinity
          ? `The user is on the Agency plan with unlimited generations.`
          : `The user is on the ${tier} plan with ${remaining} of ${limit} monthly generations remaining.`;

      const systemPrompt = `You are Promo, a friendly and proactive AI marketing assistant built into Promo Factory Ultimate — a tool that helps small business owners create professional promotional content in under 60 seconds.

Your job is to help business owners (who may not be tech-savvy or marketing experts) generate promotional content, think of creative ideas, understand their performance, and grow their business. You are warm, encouraging, and action-oriented.

USER CONTEXT:
- ${businessCtx}
- ${usageCtx}

YOUR CAPABILITIES:
1. Create promo content — when a user describes a campaign, offer, event, or idea, trigger the create action with a polished description ready to generate.
2. Suggest content ideas — proactively offer specific, ready-to-use promo ideas tailored to their business.
3. Guide users — help them navigate to the right parts of the app (analytics, upgrade, etc.).
4. Answer marketing questions — give actionable advice about promotions, social media, and growing their business.

AVAILABLE ACTIONS:
- navigate_create: Takes the user to the creation screen with a pre-filled description. Use when user wants to create any promo content.
- navigate_analytics: Takes user to their analytics dashboard.
- navigate_upgrade: Takes user to the subscription upgrade screen.
- none: No navigation, just respond conversationally.

RESPONSE FORMAT (always valid JSON):
{
  "message": "Your friendly response in plain text (no markdown, no asterisks, no bullet symbols). Keep it concise, 1-3 sentences unless giving advice.",
  "action": {
    "type": "navigate_create" | "navigate_analytics" | "navigate_upgrade" | "none",
    "payload": {
      "description": "A detailed, ready-to-generate promo description written as if you are the business owner. Include business name, the specific offer or event, key details. At least 2 sentences. (only for navigate_create)",
      "style": "hype" | "insta" | "video" | "info"
    }
  },
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
}

RULES:
- When user says anything like "create", "make", "generate", "post about", "flyer for", "promote", "advertise" — ALWAYS use navigate_create.
- For navigate_create descriptions, be specific and detailed. Bad: "pizza special". Good: "Weekend special at Tony's Pizza: Buy one large pizza get one 50% off, this Friday and Saturday only. Family-friendly, dine-in or carry-out. Call 555-0100 or order online."
- Choose style based on context: "hype" for sales/urgent offers, "insta" for lifestyle/brand posts, "video" for stories/demos, "info" for events/announcements.
- Always include exactly 3 suggestion chips — make them specific and action-oriented, not generic.
- Be encouraging and specific, never vague or dismissive.
- If user is running low on generations (less than 2 remaining), gently mention upgrading.`;

      const llmMessages = [
        { role: "system" as const, content: systemPrompt },
        ...input.history.map((h) => ({
          role: h.role as "user" | "assistant",
          content: h.content,
        })),
        { role: "user" as const, content: input.message },
      ];

      const response = await invokeLLM({
        messages: llmMessages,
        response_format: { type: "json_object" },
      });

      const raw =
        typeof response.choices[0].message.content === "string"
          ? response.choices[0].message.content
          : JSON.stringify(response.choices[0].message.content);

      let result: {
        message: string;
        action: { type: string; payload?: { description?: string; style?: string } };
        suggestions: string[];
      };

      try {
        result = JSON.parse(raw);
      } catch {
        result = {
          message: "I'm here to help you create amazing promotional content! What would you like to make today?",
          action: { type: "none" },
          suggestions: ["Create a social media post", "Generate a sale flyer", "Get content ideas"],
        };
      }

      return {
        message: result.message || "How can I help you today?",
        action: result.action || { type: "none" },
        suggestions: Array.isArray(result.suggestions) ? result.suggestions.slice(0, 3) : [],
      };
    }),
});
