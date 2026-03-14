import { COOKIE_NAME } from "../shared/const.js";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db.js";
import { promoGenerationRouter } from "./promo-generation.js";
import { brandProfileRouter } from "./brand-profile.js";
import { assistantRouter } from "./assistant.js";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  subscription: router({
    get: protectedProcedure.query(({ ctx }) => db.getUserSubscription(ctx.user.id)),
    incrementGenerations: protectedProcedure.mutation(({ ctx }) =>
      db.incrementGenerations(ctx.user.id)
    ),
    decrementSoraCredits: protectedProcedure.mutation(({ ctx }) =>
      db.decrementSoraCredits(ctx.user.id)
    ),
    update: protectedProcedure
      .input(z.object({ tier: z.enum(["free", "pro", "agency"]) }))
      .mutation(({ ctx, input }) => db.updateSubscriptionTier(ctx.user.id, input.tier)),
  }),

  promo: promoGenerationRouter,

  assets: router({
    list: protectedProcedure.query(({ ctx }) => db.getUserPromoBundles(ctx.user.id)),
  }),

  brandProfile: brandProfileRouter,
  assistant: assistantRouter,
});

export type AppRouter = typeof appRouter;
