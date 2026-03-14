# Promo Factory Ultimate — Developer Handoff Document

**Prepared for:** Claude Code (or any incoming developer)
**Project Status:** Active Development — Soft Launch Phase
**Last Updated:** March 2026
**Live Preview URL:** https://promofactory-wb7b2ucq.manus.space

---

## 1. Project Overview

Promo Factory Ultimate is an AI-powered marketing content generator built specifically for small businesses. The app enables users to create professional social media posts, flyers, and video ads in under 60 seconds — no design skills required. It targets six core industries: restaurants, fitness, retail, real estate, services, and events.

The product operates on a freemium model with three subscription tiers (Free, Pro at $29/month, Agency at $99/month) and is currently in a **free soft launch** phase to gather user feedback and stress-test the platform before monetization goes live.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Mobile Framework | React Native 0.81 via Expo SDK 54 |
| Language | TypeScript 5.9 |
| Routing | Expo Router 6 |
| Styling | NativeWind 4 (Tailwind CSS) |
| Animations | React Native Reanimated 4.x |
| State Management | React Context + AsyncStorage |
| Backend | Node.js / Express (tRPC) |
| Database | PostgreSQL via Drizzle ORM |
| AI / LLM | Server built-in LLM (no external API key needed) |
| Package Manager | pnpm 9.12 |

---

## 3. Getting Started

After cloning or extracting the project, run the following commands to get the development environment running:

```bash
pnpm install
pnpm dev
```

This starts both the Metro bundler (port 8081) and the Express API server (port 3000) concurrently. The web preview is accessible at `http://localhost:8081`. For native testing, scan the QR code shown in the terminal with Expo Go.

Environment variables are stored in `.env` at the project root. The database connection string, OAuth secrets, and any API keys live there. Do **not** commit this file.

---

## 4. Project Structure

```
app/
  _layout.tsx          ← Root layout with providers
  landing.tsx          ← Public marketing landing page (/landing route)
  (tabs)/
    _layout.tsx        ← Tab bar configuration (5 tabs)
    index.tsx          ← Dashboard screen
    create.tsx         ← Promo creation screen
    assets.tsx         ← Generated assets library
    analytics.tsx      ← Analytics dashboard
    assistant.tsx      ← AI chat assistant
  settings/            ← Settings screens
  upgrade.tsx          ← Subscription upgrade screen

server/
  _core/               ← Core server infrastructure (DO NOT MODIFY)
  email-service.ts     ← Email notification service for test reports
  promo-generation.ts  ← AI content generation endpoint
  README.md            ← MUST READ before using any backend features

tests/
  weekly-e2e-test.ts   ← Automated weekly test suite (runs Mon 9 AM EST)

TEST_PLAN.md           ← Full test plan with 70+ scenarios across all user roles
assets/images/         ← App icons, splash, and marketing graphics
```

---

## 5. Subscription Tier System

The app enforces three tiers throughout the codebase. Understanding this model is critical before making any changes to generation, export, or analytics features.

| Feature | Free | Pro ($29/mo) | Agency ($99/mo) |
|---|---|---|---|
| Generations per month | 5 | 50 | Unlimited |
| Image quality | Standard | HD | Ultra HD |
| Video generation | Disabled | Veo 3 | Veo 3 + Sora |
| Analytics | Basic | Full | Full + Export |
| AI Assistant | Chat only | Full actions | Full actions |
| Watermark on exports | Yes | No | No |
| Templates | 21 | 21 | 21 + Custom |

The enforcement logic lives in `server/promo-generation.ts` and the subscription context in `lib/subscription-context.tsx`. The current payment flow is a **demo simulation** — Stripe integration is stubbed out and ready to wire up but not yet live.

---

## 6. What Has Been Built

The following major features are complete and working:

**Core App Screens** — All five tab screens (Dashboard, Create, Assets, Analytics, Assistant) are built with glassmorphism UI, animated interactions, and haptic feedback. The Settings screen includes Brand Profile, Theme Customization, Subscription Management, Audio Settings, and Account management.

**AI Content Generation** — The Create screen accepts a text prompt and optional image upload, then calls the backend LLM to generate a full promo bundle: flyer copy, social media post variations (Instagram, Facebook, Twitter), and a copy pack (headlines, CTAs, taglines). Generation is gated by subscription tier.

**Brand Profile System** — Users can set their business name, industry, brand colors, and logo. This data is injected into AI generation prompts to produce on-brand content automatically.

**Template Library** — 21 professional templates across 6 industry categories, plus seasonal templates. A template browser UI with filters is accessible from the Create screen.

**Multi-Platform Export** — A batch export service handles smart cropping and resizing for Instagram, Facebook, TikTok, LinkedIn, and Twitter from a single generated asset.

**Content Calendar** — Month/week calendar view with scheduling, best-time-to-post suggestions, and a scheduled posts list.

**Watermark System** — Free tier exports automatically receive a "PROMO FACTORY FREE" watermark overlay. Pro and Agency exports are clean.

**Public Landing Page** — A marketing-focused landing page lives at `/landing` and is designed to be shared on LinkedIn and social media. It features the "Can You Break My App?" challenge campaign, feature showcase, industry use cases, and multiple CTAs.

**Weekly Automated Testing** — A Playwright-based test suite (`tests/weekly-e2e-test.ts`) runs every Monday at 9 AM EST. It tests all three user roles (Free, Pro, Agency), verifies permission enforcement, checks for broken images and links, and emails a full HTML report to `amenefee614@gmail.com`.

**The Agency Branding** — "Powered by The Agency" branding appears on the login screen, Settings footer, About section, and Upgrade screen.

---

## 7. What Still Needs to Be Built

The following items are the highest-priority pending features. They are tracked in `todo.md` with `[ ]` status.

**Stripe Payment Integration** is the most critical missing piece. The demo checkout flow is in place and the code structure is ready (`server/` has stub endpoints). The next developer needs to add the Stripe SDK, create a real checkout session endpoint, handle the payment webhook, and update the user's subscription tier in the database after a successful payment.

**Asset Detail View** — Users can see their generated assets in a list but cannot yet tap into a full-screen detail view with editing, download, or export controls. The component needs to be created as a modal or separate screen with asset type tabs (Flyer, Story, Feed Post, Copy Pack).

**Industry Templates Backend** — The template UI exists but the templates are not yet wired to the AI generation prompts. The generation API needs to accept a `templateId` parameter and inject industry-specific keywords, color schemes, and copy styles into the LLM prompt.

**Brand Profile → Generation Integration** — Brand colors and logo are saved to the database but not yet fully applied to generated designs. The logo is not yet embedded in generated flyers.

**Real OAuth Login** — Demo mode is active (users bypass login automatically), but Google, Apple, and Email OAuth flows need to be connected for production launch.

**Custom Design System** — The user has a Google Slides design spec that has not yet been implemented. This includes elastic button physics, gradient card components, a rebuilt Dashboard, a rebuilt AI Assistant (chatbot) screen, and custom animations (fade-in, shimmer, elastic).

**PWA Configuration** — `manifest.json`, service worker for offline shell, and Android installation support are not yet configured.

A complete list of all pending items is in `todo.md`.

---

## 8. Automated Testing & QA

The weekly test suite is scheduled and running. Key details for the incoming developer:

The test script at `tests/weekly-e2e-test.ts` uses Playwright to simulate real user flows across three role profiles: a Free tier user, a Pro tier user, and an Agency tier user. It verifies that permission gates work correctly (e.g., Free users cannot access video generation), checks all visible images and links for broken or inaccessible resources, and generates a Markdown report saved to `test-results/reports/`.

After each run, an HTML-formatted email is sent to `amenefee614@gmail.com` with pass/fail statistics, failed test details, and recommended fixes. The schedule is managed via a cron job set to `0 9 * * 1` (Monday 9 AM EST).

The test selectors were written based on the app's current UI structure. If screens are significantly redesigned, the selectors in `weekly-e2e-test.ts` will need to be updated to match the new element IDs or text labels.

The full test plan with 70+ scenarios is documented in `TEST_PLAN.md`, organized by feature area and user role.

---

## 9. Marketing Campaign Assets

The following marketing files are in the project and can be reused for future campaigns:

| File | Description |
|---|---|
| `assets/images/promo-factory-linkedin-hero.png` | Main launch announcement graphic (purple/blue gradient) |
| `assets/images/promo-factory-linkedin-challenge.png` | "Can You Break My App?" challenge graphic |
| `assets/images/promo-factory-linkedin-stats.png` | Stats infographic (21 templates, 6 industries, unlimited generations) |
| `assets/images/promo-factory-linkedin-before-after.png` | Before/after comparison (5 hours vs 60 seconds) |
| `/home/ubuntu/promo-factory-linkedin-campaign.md` | 5 LinkedIn post variations with engagement strategy and hashtag guide |

---

## 10. Key Conventions & Pitfalls

**Never use `className` on `Pressable`** — NativeWind's Pressable integration is disabled globally. Always use the `style` prop with `({ pressed }) =>` for press states.

**Always use `ScreenContainer`** for screen-level components to handle SafeArea, status bar, and tab bar overlap correctly.

**Audio is mobile-only** — Sound effects use `expo-audio` and do not play on web. The app shows a notification on web informing users that audio is available on mobile.

**Use `FlatList` for all lists** — Never use `ScrollView` with `.map()` for lists of items. Performance degrades significantly on mobile.

**Backend features require reading `server/README.md` first** — The server has built-in LLM, auth, database, file storage, and push notification capabilities. Do not add external API dependencies for features the server already provides.

**Tier enforcement is server-side** — Do not rely solely on client-side checks for subscription gating. The backend validates the user's tier on every generation request.

---

## 11. Deployment

The app is deployed via the Manus platform. To publish a new version:

1. Ensure all changes are working correctly in the preview
2. Create a checkpoint using the Manus UI or `webdev_save_checkpoint`
3. Click the **Publish** button in the Manus Management UI header

The permanent public URL is: **https://promofactory-wb7b2ucq.manus.space**

Do **not** attempt to manually build an APK in the sandbox — this will cause resource exhaustion. The Publish button handles the build process and generates the APK automatically.

---

## 12. Recommended Next Steps (Priority Order)

The following represents the recommended development sequence based on business impact and technical dependency:

1. **Stripe Integration** — This is the single most important feature for monetization. Wire up the existing stub endpoints with real Stripe checkout sessions and webhooks.
2. **Asset Detail View** — Users need to be able to view, download, and share their generated content. This is a core user flow that is currently incomplete.
3. **Custom Design System** — Implement the user's Google Slides design spec to differentiate the product visually.
4. **Real OAuth Login** — Disable demo mode and enable real user accounts for production.
5. **Industry Templates → Generation** — Connect template selection to the AI prompt to improve output quality and relevance.
6. **PWA Configuration** — Enable Android home screen installation for better mobile retention.

---

*This document was generated by Manus AI to facilitate a clean developer handoff. For questions about the project history or design decisions, refer to the conversation context or contact the project owner.*
