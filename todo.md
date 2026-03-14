# Promo Factory - TODO

## Theme System & Visual Design
- [x] Create glassmorphism theme configuration with blur, opacity, grain
- [x] Implement 6 theme presets (Neon Night, Clean Frost, Gold Luxe, Candy Pop, Studio Dark, Warm Sunset)
- [ ] Build Theme Studio screen with live preview and customization controls
- [ ] Add theme persistence to database per user account
- [x] Implement gradient background system
- [x] Add grain/noise overlay component
- [x] Create custom shadow system (small/medium/large)
- [x] Implement animation intensity settings (Low/Medium/High)
- [ ] Add reduced motion toggle and accessibility support

## Authentication & User Management
- [x] Implement email/magic link authentication
- [ ] Create user profile management
- [ ] Add business name and industry fields
- [ ] Build Settings screen with profile editor
- [ ] Implement logout functionality

## Subscription & Monetization
- [x] Create subscription data model (Free/Pro/Agency)
- [ ] Build Subscription/Upgrade screen with plan cards
- [ ] Implement Stripe integration via backend
- [x] Add usage tracking (generations per month)
- [x] Create subscription tier enforcement logic
- [ ] Add watermark system for Free tier exports
- [x] Implement credit system for Sora video generation
- [x] Add upgrade prompts throughout app
- [ ] Build "Restore Purchases" functionality

## Navigation & Core Screens
- [x] Configure bottom tab navigation (Dashboard, Create, Assets, Analytics, Assistant)
- [ ] Add header icons (Settings, Theme Studio, Subscription)
- [x] Create Dashboard screen with stats cards and recent activity
- [ ] Implement pull-to-refresh on Dashboard
- [x] Add navigation between screens

## Quick Win Promo Generation
- [x] Build Create screen with text input and image upload
- [x] Add video engine selector for Pro users (Veo 3 / Sora)
- [x] Implement full-screen generation overlay with progress bar
- [x] Add rotating status messages during generation
- [ ] Create backend API for AI content generation
- [x] Implement promo bundle data model (flyer, story, feed post, video, copy pack)
- [ ] Add generation request to backend with tier enforcement
- [ ] Save generated bundles to database
- [ ] Navigate to Assets after generation completes

## Assets Library
- [ ] Build Assets screen with bundle list
- [ ] Create bundle card component with thumbnails
- [ ] Implement bundle detail view with asset tabs
- [ ] Add export functionality per asset type
- [ ] Implement swipe-to-delete with confirmation
- [ ] Add search and filter functionality
- [ ] Create watermark overlay for Free tier assets
- [ ] Implement pull-to-refresh on Assets

## Analytics Dashboard
- [ ] Create Analytics screen with stat cards (Views, Visits, Bookings, CTR)
- [ ] Implement simulated/demo data for MVP
- [ ] Add line chart for trends over time
- [ ] Build "Assistant Insight" card with plain-language summary
- [ ] Add date range selector (7/30/All days)
- [ ] Implement export report feature (Pro tier only)
- [ ] Add upgrade prompt for Free tier users

## AI Assistant
- [ ] Build Assistant screen with chat interface
- [ ] Create quick action chips (Summarize Analytics, Generate Copy, Create Task, Suggest Next Promo)
- [ ] Implement chat message list with glass bubbles
- [ ] Add text input and send functionality
- [ ] Create backend API for assistant chat
- [ ] Implement action execution for Pro tier
- [ ] Add typing indicator during responses
- [ ] Enforce Free tier restrictions (chat only, no actions)

## PWA & Performance
- [ ] Configure manifest.json for Android installation
- [ ] Add app icons and splash screen
- [ ] Implement service worker for offline shell
- [ ] Optimize loading performance (< 3 seconds on 3G)
- [ ] Add lazy loading for images and videos
- [ ] Implement virtualized lists (FlatList) for performance

## UI Components & Interactions
- [x] Create glassmorphic card component
- [x] Build animated button with scale and haptic feedback
- [x] Implement loading states (skeleton screens, shimmers, spinners)
- [ ] Add success/error toast notifications
- [ ] Create modal component with swipe-to-dismiss
- [x] Implement press feedback (opacity/scale) on all interactive elements
- [ ] Add gesture support (swipe, pull-to-refresh, long-press)

## Backend Integration
- [x] Set up database schema for users, subscriptions, promo bundles, themes
- [x] Create API endpoints for authentication
- [ ] Build API for promo generation (AI integration)
- [ ] Implement Stripe webhook handlers
- [ ] Create API for assistant chat and actions
- [ ] Add API for theme persistence
- [x] Implement usage tracking and enforcement

## Branding & Assets
- [x] Generate custom app logo
- [x] Update app.config.ts with app name and branding
- [ ] Create app icons for all platforms
- [ ] Add splash screen assets

## Testing & Delivery
- [x] Test all user flows end-to-end
- [x] Verify subscription tier enforcement
- [x] Test theme customization and persistence
- [ ] Validate PWA installation on Android
- [ ] Check accessibility (VoiceOver, contrast, reduced motion)
- [ ] Test offline functionality
- [x] Create checkpoint and deliver to user

## Design Refresh - Ultimate Style
- [x] Update theme colors to purple/blue gradient scheme
- [x] Add glowing effects and neon styling
- [ ] Create floating icon animations
- [x] Update "Promo Factory" to "Promo Factory Ultimate" branding
- [x] Redesign Create screen with large hero title and style chips
- [x] Add glowing Generate button with sparkle effect
- [x] Update Dashboard with new color scheme
- [x] Update Assets, Analytics, and Assistant screens
- [x] Generate new logo matching Ultimate branding
- [x] Add dark purple gradient backgrounds throughout

## Interactive Animations
- [x] Create animation utility functions (bounce, shake, pulse)
- [x] Add entrance animations to cards (fade in + scale)
- [x] Implement press animations with bounce effect on buttons
- [x] Add shake animation to style chips on selection
- [x] Create pulse animation for Generate button
- [x] Add stagger animations for list items
- [x] Implement hover/press animations for stat cards
- [ ] Add subtle bounce to tab bar icons on press
- [ ] Create floating animation for floating icons

## Glassmorphism Restoration
- [x] Verify AnimatedCard properly uses GlassCard component
- [x] Restore glass effect to all cards on Dashboard
- [x] Restore glass effect to all cards on Create screen
- [x] Restore glass effect to all cards on Assets screen
- [x] Restore glass effect to all cards on Analytics screen
- [x] Restore glass effect to all cards on Assistant screen
- [x] Ensure blur and transparency work on all platforms

## Realistic Glass Enhancement
- [x] Add top edge highlight gradient (light reflection)
- [x] Add subtle gradient overlay for depth
- [x] Implement edge glow effect
- [x] Add inner shadow for depth perception
- [x] Increase blur intensity for stronger frosted effect
- [x] Add subtle shine/reflection on glass surface

## Sound Effects & Audio
- [x] Find and download UI sound effects (button press, success, error, swipe)
- [x] Create audio manager with sound effect loading
- [x] Add sound to button presses throughout app
- [x] Add sound to style chip selection
- [x] Add sound to Generate button
- [ ] Add sound to navigation/tab switches
- [ ] Add sound to card interactions
- [x] Make audio volume customizable in theme settings
- [x] Add sound enable/disable toggle
- [x] Store audio preferences in AsyncStorage

## Hero Image Recreation
- [x] Generate exact hero image with "PROMO FACTORY ULTIMATE" title
- [x] Add floating glass camera icon (top left)
- [x] Add floating glass video icon (top right)
- [x] Add floating glass image icon (left side)
- [x] Add floating glass play icon (bottom left)
- [x] Add floating glass megaphone icon (bottom right)
- [x] Add speed lines behind title
- [x] Add sparkle/lens flare effect
- [x] Integrate hero image into Create screen

## Logo & Sound Fixes
- [x] Regenerate hero logo with more dramatic speed lines (like reference)
- [x] Add motion blur effect to title
- [x] Make speed lines more prominent and dynamic
- [x] Verify sound files are valid MP3 format
- [x] Test audio playback on mobile device
- [x] Add web fallback or notification about mobile-only audio
- [x] Ensure haptic feedback works correctly

## Subtle Speed Lines Fix
- [x] Regenerate hero with only 3-4 clean speed lines (not overwhelming)
- [x] Match reference image exactly - subtle and elegant
- [x] Integrate updated hero image

## Remove Angle Labels from Hero
- [x] Regenerate hero image without visible degree numbers
- [x] Keep icons tilted but remove text labels
- [x] Match clean reference aesthetic

## Icon Speed Lines
- [x] Add small speed lines coming FROM each floating icon
- [x] Each icon has directional swoosh from different angle
- [x] Create dynamic flying-in motion effect
- [x] Keep main title clean without speed lines

## Curved Swooping Speed Lines
- [x] Change speed lines from straight to curved swooping arcs
- [x] Each icon has graceful curved trail flowing toward center
- [x] Match the elegant curved swoops from reference image

## Mixed Speed Line Styles
- [x] Change from thick swooshes to thin speed lines
- [x] Top left icon: curved arc speed lines
- [x] Other icons: straight directional speed lines
- [x] Clean, minimal line representation of motion

## Restore Glass Reflections to Buttons
- [x] Add reflective surfaces back to pill buttons (style chips)
- [x] Restore edge highlights and gradient overlays
- [x] Add glass effect to Generate button
- [x] Restore glass reflections to all interactive elements
- [x] Ensure AnimatedButton uses glass styling

## AI Content Generation Implementation
- [x] Create backend API endpoint for promo generation
- [x] Use server's built-in LLM to generate content based on user input
- [x] Generate flyer copy and design suggestions
- [x] Generate social media post variations (Instagram, Facebook, Twitter)
- [ ] Generate video script and scene descriptions
- [x] Generate copy pack (headlines, CTAs, taglines)
- [x] Integrate generation API with Create screen
- [x] Show loading overlay with progress during generation
- [x] Save generated bundles to database
- [x] Navigate to Assets screen after successful generation
- [x] Handle errors and show user-friendly messages
- [x] Enforce subscription tier limits (Free: 5/month, Pro: 50/month, Agency: unlimited)

## Tiered Model System
- [x] Research free image generation APIs (Nano Banana OG or similar)
- [x] Research free video generation APIs
- [x] Create model configuration for each tier (Free/Pro/Agency)
- [x] Update promo-generation.ts to use tier-specific models
- [x] Implement fallback logic for free tier image generation
- [x] Implement free tier video generation (disabled for free tier)
- [x] Test generation quality across all tiers
- [x] Add model info to generated bundle metadata

## Brand Profile System
- [x] Add brand profile table to database schema (business name, industry, colors, logo URL)
- [x] Create brand profile API endpoints (create, read, update)
- [x] Build Brand Profile Setup screen with form fields
- [x] Add business name input field
- [x] Add industry dropdown selector (Restaurant, Salon, Retail, Fitness, Real Estate, etc.)
- [x] Implement brand color picker (primary, secondary, accent)
- [x] Add logo upload with image picker
- [x] Save brand profile to database
- [x] Display "Setup Brand Profile" prompt on Create screen when no profile exists
- [ ] Integrate brand profile data into AI generation prompts
- [ ] Apply brand colors to generated designs
- [ ] Include logo in generated flyers

## Asset Detail View with Editing
- [ ] Create Asset Detail modal/screen component
- [ ] Display full-size asset image
- [ ] Add asset type tabs (Flyer, Story, Feed Post, Copy Pack)
- [ ] Implement download functionality for each asset
- [ ] Add export format options (PNG, JPG, PDF)
- [ ] Build basic text editing overlay
- [ ] Add color adjustment controls
- [ ] Implement share to social media (copy link, open in app)
- [ ] Add "Edit in Canva" export option
- [ ] Show watermark notice for Free tier
- [ ] Add "Remove Watermark - Upgrade to Pro" CTA

## Industry Templates System
- [ ] Create template configuration file with 10+ industries
- [ ] Define template structure (default colors, copy style, visual themes)
- [ ] Add templates for: Restaurant, Salon, Fitness, Retail, Real Estate, Healthcare, Education, Events, Tech/SaaS, Professional Services
- [ ] Build template selector UI on Create screen
- [ ] Show template preview cards with industry icons
- [ ] Apply template defaults to generation prompts
- [ ] Include industry-specific keywords in AI prompts
- [ ] Add template customization options
- [ ] Save user's preferred template to profile

## Style Chip Icons
- [ ] Add emoji icons to HYPE button (🔥)
- [ ] Add emoji icons to INSTA button (📸)
- [ ] Add emoji icons to VIDEO button (📹)
- [ ] Add emoji icons to INFO button (📅)

## Navigation Menu & Settings
- [x] Add header icons to tab layout (Settings, Profile, Subscription)
- [x] Create Settings screen with menu options
- [x] Add Brand Profile option in Settings
- [x] Add Theme Customization option in Settings
- [x] Add Subscription Management option in Settings
- [x] Add Audio Settings (volume, enable/disable)
- [x] Add Account Settings (profile, logout)
- [x] Add About/Help section

## Critical Launch Features
- [x] Integrate brand profile into AI generation prompts (colors, logo, industry keywords, business name)
- [x] Apply brand colors to generated designs
- [ ] Include logo in generated flyers
- [x] Use industry-specific keywords from templates
- [x] Implement watermark overlay system for Free tier exports
- [x] Add "PROMO FACTORY FREE" watermark to images
- [x] Ensure Pro/Agency exports remain clean
- [ ] Add Stripe checkout integration for subscription upgrades
- [ ] Create checkout session API endpoint
- [ ] Handle successful payment webhook
- [ ] Update user subscription tier after payment

## Demo Payment Flow (Launch Critical)
- [x] Create Upgrade screen with plan comparison cards (Free/Pro/Agency)
- [x] Add pricing display and feature lists for each tier
- [x] Implement demo checkout flow (simulated payment)
- [x] Update user subscription tier in database after "purchase"
- [x] Add success confirmation screen after upgrade
- [x] Wire up upgrade buttons in Settings screen
- [ ] Add upgrade prompts throughout app (when hitting limits)
- [ ] Test complete upgrade flow end-to-end
- [x] Prepare for real Stripe integration (code structure ready)

## The Agency Logo Integration
- [x] Copy The Agency logo to assets folder
- [x] Add "Powered by The Agency" footer to login screen
- [x] Add Agency logo to Settings screen footer
- [x] Add Agency branding to About section
- [x] Add Agency logo to Upgrade screen footer
- [x] Test logo visibility and positioning

## Update Upgrade Screen Features
- [x] Add Analytics dashboard to Pro/Agency plan features
- [x] Add AI Assistant to Pro/Agency plan features
- [x] Clarify Free tier has limited analytics
- [x] Update feature descriptions to be more compelling

## Production-Ready Features
- [x] Enable demo mode (bypass login for testing)
- [x] Implement real analytics tracking (views, clicks, conversions)
- [x] Integrate Google Veo API for video generation
- [ ] Set up OAuth login (Google, Apple, Email) - OPTIONAL: Demo mode active
- [ ] Test complete user flow end-to-end
- [ ] Verify all features work in production mode

## Multi-Platform Export Feature
- [x] Create platform configuration (Instagram, Facebook, TikTok, LinkedIn, Twitter)
- [x] Build export service with smart cropping
- [x] Add "Export to Platforms" button to Assets screen
- [x] Create platform selection modal with checkboxes
- [x] Implement batch export functionality
- [x] Add platform-specific dimensions and aspect ratios
- [x] Test export UI flow

## Template Library
- [x] Create template data structure (industry, style, preview)
- [x] Build template categories (Restaurant, Fitness, Real Estate, Retail, Services)
- [x] Add seasonal templates (Holidays, Sales, Events)
- [x] Create template browser UI with filters
- [x] Implement template preview and customization
- [x] Add "Browse Templates" button to Create screen

## Content Calendar
- [x] Create calendar view component (month/week view)
- [x] Build scheduling system with date/time picker
- [x] Add Calendar quick action to Dashboard
- [x] Implement best time to post suggestions
- [x] Create scheduled posts list view
- [x] Add calendar navigation and date selection
- [ ] Build notification system for scheduled posts (future enhancement)

## Direct Social Media Publishing
- [x] Add social account connection UI
- [x] Create publish screen with platform selection
- [x] Add caption editor with character limits
- [x] Build "Publish Now" and "Schedule" toggle
- [x] Add "Publish to Social" button in Assets
- [x] Show publishing status and confirmation
- [ ] Implement real OAuth for Instagram/Facebook (requires API keys)

## Custom Design System Implementation (User's Google Slides Design)
- [ ] Create global CSS variables and motion system from user specs
- [ ] Build elastic button component with bounce physics
- [ ] Implement gradient card components with user's color scheme
- [ ] Rebuild Dashboard with custom design
- [ ] Rebuild Promo Assistant (Chatbot) screen
- [ ] Rebuild Brand Profile screen
- [ ] Rebuild Analytics screen with custom charts
- [ ] Rebuild Video Ad Builder screen
- [ ] Add script preview card component
- [ ] Apply custom animations (fade-in, shimmer, elastic)
- [ ] Wire up all integrations per user specs
- [ ] Test complete redesign

## Weekly Automated Testing (Every Monday 9 AM EST)
- [x] Create comprehensive test plan document with all test scenarios
- [x] Implement automated test script for Free tier user role
- [x] Implement automated test script for Pro tier user role  
- [x] Implement automated test script for Agency tier user role
- [x] Add permission verification tests for each tier
- [x] Add image/link validation tests across all screens
- [x] Schedule automated tests to run every Monday at 9 AM EST

## Email Notifications for Test Reports
- [x] Create email notification service using server capabilities
- [x] Update test script to send email reports after completion
- [x] Configure email template for test report summary
- [ ] Test email delivery system
- [x] Integrate email notifications with scheduled weekly tests

## Public Landing Page for Marketing Campaign
- [x] Copy marketing graphics to app assets
- [x] Create /landing route for public marketing page
- [x] Build hero section with main value proposition
- [x] Add features section with key benefits
- [x] Add "Break My App" challenge section
- [x] Add call-to-action buttons linking to main app
- [x] Make landing page responsive for mobile/tablet/desktop
- [x] Add smooth scroll animations and transitions
- [x] Test landing page on all devices
