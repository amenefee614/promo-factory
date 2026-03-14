import { z } from "zod";
import { router, protectedProcedure } from "./_core/trpc";
import * as db from "./db";

export const brandProfileRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    return await db.getBrandProfile(userId);
  }),

  create: protectedProcedure
    .input(
      z.object({
        businessName: z.string().min(1).max(255),
        industry: z.string().min(1).max(100),
        primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i),
        secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i),
        accentColor: z.string().regex(/^#[0-9A-F]{6}$/i),
        logoUrl: z.string().url().optional(),
        tagline: z.string().max(200).optional(),
        targetAudience: z.string().max(500).optional(),
        brandVoice: z.enum(["professional", "casual", "playful", "luxury", "bold"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      // Check if profile already exists
      const existing = await db.getBrandProfile(userId);
      if (existing) {
        throw new Error("Brand profile already exists. Use update instead.");
      }

      return await db.createBrandProfile(userId, input);
    }),

  update: protectedProcedure
    .input(
      z.object({
        businessName: z.string().min(1).max(255).optional(),
        industry: z.string().min(1).max(100).optional(),
        primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
        secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
        accentColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
        logoUrl: z.string().url().optional(),
        tagline: z.string().max(200).optional(),
        targetAudience: z.string().max(500).optional(),
        brandVoice: z.enum(["professional", "casual", "playful", "luxury", "bold"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      return await db.updateBrandProfile(userId, input);
    }),
});
