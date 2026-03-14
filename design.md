# Promo Factory - Mobile App Interface Design

## Design Philosophy

Promo Factory is a **web-first, Android-installable PWA** designed for **mobile portrait orientation (9:16)** and **one-handed usage**. The design follows **Apple Human Interface Guidelines (HIG)** to feel like a first-party iOS app while incorporating a distinctive **glassmorphism** aesthetic that conveys premium quality with playful professionalism.

---

## Visual Design Language

### Glassmorphism Core Elements

- **Frosted glass cards** with backdrop blur and transparency
- **Subtle grain/noise overlay** for texture and depth
- **Smooth gradients** as backgrounds (customizable)
- **Elevated shadows** with soft edges
- **Rounded corners** (customizable radius)

### Motion Design ("Icing" Animations)

- **Bouncy button press** (scale 0.97, haptic feedback)
- **Card lift on hover/press** (subtle elevation change)
- **Liquid loading bars** (smooth animated progress)
- **Shimmer effects** during loading states
- **Non-blocking animations** (never block user interaction)
- **Reduced motion toggle** for accessibility

---

## Color System

### Theme Customization

Users can customize the following theme properties:

1. **Accent color** (primary brand color)
2. **Gradient background** (two-color gradient)
3. **Glass blur intensity** (0-20px)
4. **Glass opacity** (0.1-0.9)
5. **Corner radius** (8-24px)
6. **Shadow depth** (small/medium/large)
7. **Grain amount** (0-100%)
8. **Animation intensity** (Low/Medium/High)

### Six Built-in Presets

1. **Neon Night** - Vibrant purple/pink gradients, high blur, medium grain
2. **Clean Frost** - White/light blue, high blur, minimal grain
3. **Gold Luxe** - Gold/amber gradients, medium blur, subtle grain
4. **Candy Pop** - Bright multi-color gradients, high blur, high grain
5. **Studio Dark** - Dark gray/black, low blur, minimal grain
6. **Warm Sunset** - Orange/red gradients, medium blur, medium grain

Theme settings persist per user account in the database.

---

## Screen List & Navigation

### Bottom Navigation (5 Tabs)

1. **Dashboard** - Overview of recent activity and quick stats
2. **Create** - Primary content generation interface
3. **Assets** - Library of generated promo bundles
4. **Analytics** - Performance metrics and insights
5. **Assistant** - AI chat helper with action chips

### Top Right Actions (Header Icons)

- **Settings** - App preferences, account management
- **Theme Studio** - Theme customization interface
- **Subscription/Upgrade** - Plan management and upgrade prompts

---

## Screen-by-Screen Design

### 1. Dashboard Screen

**Primary Content:**
- Welcome message with user's business name
- Quick stats cards (glassmorphic):
  - Total promos created this month
  - Total views (simulated)
  - Most recent promo preview
- "Create New Promo" CTA button (prominent, bouncy)
- Recent activity feed (last 3-5 promos)

**Key Functionality:**
- Tap stat cards to navigate to Analytics
- Tap recent promo to view in Assets
- Tap CTA to navigate to Create tab

**Layout:**
- Scrollable vertical list
- Cards with glass effect, 16px padding
- Gradient background visible between cards

---

### 2. Create Screen (Quick Win Promo)

**Primary Content:**
- Large heading: "What are you promoting today?"
- Single text input field (multiline, 3-5 lines visible)
- Optional image upload button (shows thumbnails if added)
- "Generate Promo Bundle" button (large, primary color)
- Subscription tier indicator (Free/Pro/Agency badge)

**Key Functionality:**
- Text input for promo description
- Image picker for optional visual references
- Generate button triggers full-screen overlay
- Free tier: shows "Watermarked" badge
- Pro tier: shows video engine selector (Veo 3 / Sora)

**Generation Overlay:**
- Full-screen glassmorphic overlay
- Animated progress bar (liquid style)
- Rotating status messages:
  - "Crafting your flyer..."
  - "Designing your social post..."
  - "Generating video ad..."
  - "Writing compelling copy..."
- Cancel button (top right, subtle)

**Layout:**
- Centered content, max-width 400px
- Large touch targets (min 44x44pt)
- Input field with glass background
- Bottom-fixed generate button

---

### 3. Assets Screen (Library)

**Primary Content:**
- List of promo bundles (grouped by creation date)
- Each bundle card shows:
  - Thumbnail preview (flyer or video frame)
  - Title/description snippet
  - Creation date
  - Bundle type badge (Free/Pro)
  - Watermark indicator if applicable

**Key Functionality:**
- Tap bundle to open detail view
- Swipe to delete (with confirmation)
- Filter by date/type (top toolbar)
- Search bar (collapsible)

**Bundle Detail View:**
- Full-screen modal (slides up from bottom)
- Tabs for each asset type:
  - Flyer/Poster
  - Story/Reel (9:16)
  - Feed Post
  - Video Ad
  - Copy Pack
- Export button per asset (downloads or shares)
- Free tier: "Upgrade to remove watermark" prompt

**Layout:**
- Grid or list view toggle
- Glass cards with hover/press effects
- Pull-to-refresh gesture

---

### 4. Analytics Screen

**Primary Content:**
- Dashboard cards (glassmorphic):
  - **Views** - Total impressions (simulated)
  - **Visits** - Website/location visits (simulated)
  - **Bookings** - Conversions (simulated)
  - **CTR** - Click-through rate (simulated)
- Line chart showing trends over time
- "Assistant Insight" card:
  - Plain-language summary of performance
  - Example: "Your promos are getting 23% more views this week!"

**Key Functionality:**
- Tap cards to see detailed breakdowns
- Date range selector (7 days / 30 days / All time)
- Export report button (Pro tier only)
- Free tier: shows limited data, upgrade prompt

**Layout:**
- Scrollable vertical list
- 2-column grid for stat cards
- Chart with glass background
- Insight card at bottom with icon

---

### 5. Assistant Screen

**Primary Content:**
- Chat interface (messages list)
- Quick action chips (horizontal scroll):
  - "Summarize Analytics"
  - "Generate Copy"
  - "Create Task"
  - "Suggest Next Promo"
- Text input field at bottom
- Send button (icon)

**Key Functionality:**
- **Free tier**: Chat only (no actions)
- **Pro tier**: Actions execute and return results
- Message bubbles with glass effect
- Assistant avatar icon
- Typing indicator during responses

**Action Examples:**
- "Summarize Analytics" → Returns plain-language summary
- "Generate Copy" → Creates copy draft and saves to clipboard
- "Create Task" → Adds reminder to calendar (future feature)
- "Suggest Next Promo" → Recommends promo ideas based on history

**Layout:**
- Inverted FlatList (chat style)
- Fixed input at bottom (above keyboard)
- Action chips below header
- Glass bubbles with shadows

---

### 6. Settings Screen

**Primary Content:**
- User profile section (avatar, name, email)
- Account settings:
  - Business name
  - Industry/category
  - Contact info
- App preferences:
  - Notifications toggle
  - Reduced motion toggle
  - Language selector
- Subscription section:
  - Current plan badge
  - Usage stats (generations this month)
  - "Manage Subscription" button
- Logout button (bottom, destructive style)

**Key Functionality:**
- Edit profile fields (inline or modal)
- Toggle switches for preferences
- Navigate to subscription management
- Logout with confirmation

**Layout:**
- Grouped list style (iOS Settings-like)
- Glass section backgrounds
- Dividers between groups

---

### 7. Theme Studio Screen

**Primary Content:**
- Live preview card at top (updates in real-time)
- Theme preset selector (horizontal scroll):
  - 6 preset thumbnails with names
- Customization sliders:
  - Accent color picker
  - Gradient start/end color pickers
  - Blur intensity slider
  - Opacity slider
  - Corner radius slider
  - Shadow depth selector (S/M/L)
  - Grain amount slider
  - Animation intensity selector (Low/Med/High)
- "Reset to Default" button
- "Save Theme" button (primary)

**Key Functionality:**
- Tap preset to apply instantly
- Adjust sliders to customize
- Preview updates in real-time
- Save persists to database
- Reset restores default theme

**Layout:**
- Scrollable vertical list
- Preview card fixed at top (sticky)
- Grouped controls with labels
- Bottom-fixed save button

---

### 8. Subscription/Upgrade Screen

**Primary Content:**
- Current plan card (highlighted)
- Three plan cards (Free/Pro/Agency):
  - Plan name and price
  - Feature list with checkmarks
  - "Current Plan" or "Upgrade" button
- Feature comparison table (collapsible)
- FAQ section (collapsible)
- "Restore Purchases" button (iOS)

**Key Functionality:**
- Tap "Upgrade" to initiate Stripe checkout
- Show loading during payment
- Update plan status after success
- Free tier: prominent upgrade prompts
- Pro tier: show Agency benefits

**Plan Features:**

**Free Tier:**
- Image + copy generation
- 10 generations/month
- No video generation
- Watermarked exports
- Basic analytics
- Assistant chat only

**Pro Tier ($29/month):**
- Unlimited images
- Video generation (Veo 3)
- Sora credits (5/month)
- No watermark
- Advanced analytics
- Assistant actions
- Priority support

**Agency Tier ($99/month):**
- Everything in Pro
- Higher Sora credits (20/month)
- Team members (up to 5)
- Multi-location support
- Client-ready exports
- Priority video quality
- Dedicated support

**Layout:**
- Scrollable vertical list
- Cards with glass effect
- Highlighted current plan
- Bottom-fixed upgrade button

---

## Key User Flows

### Flow 1: Create First Promo (New User)

1. User opens app → Dashboard screen
2. Tap "Create New Promo" CTA
3. Navigate to Create tab
4. Enter promo description: "Grand opening sale this weekend!"
5. Tap "Generate Promo Bundle"
6. Full-screen overlay appears with progress
7. Status messages rotate during generation
8. Generation completes (15-30 seconds)
9. Navigate to Assets tab automatically
10. Bundle detail view opens showing all assets
11. User can preview and export each asset

### Flow 2: Upgrade to Pro (Free User)

1. User tries to generate video → Blocked
2. Upgrade prompt appears: "Unlock video generation with Pro"
3. Tap "Upgrade Now"
4. Navigate to Subscription screen
5. Pro plan card highlighted
6. Tap "Upgrade to Pro"
7. Stripe checkout opens (web view or modal)
8. User completes payment
9. Return to app with success message
10. Plan badge updates to "Pro"
11. Navigate back to Create tab
12. Video engine selector now visible

### Flow 3: Use Assistant Action (Pro User)

1. User opens Assistant tab
2. Tap "Summarize Analytics" chip
3. Assistant shows typing indicator
4. Response appears: "Your promos reached 1,234 people this week, up 23% from last week. Your best-performing promo was 'Summer Sale' with 456 views."
5. User taps "Suggest Next Promo"
6. Assistant responds with 3 promo ideas
7. User taps idea to auto-fill Create screen

### Flow 4: Customize Theme

1. User opens Settings
2. Tap "Theme Studio" in header
3. Theme Studio screen opens
4. Preview card shows current theme
5. User taps "Neon Night" preset
6. Preview updates instantly
7. User adjusts blur intensity slider
8. Preview updates in real-time
9. User taps "Save Theme"
10. Success message appears
11. Navigate back to Dashboard
12. New theme applied throughout app

---

## Interaction Patterns

### Touch Targets
- Minimum 44x44pt for all interactive elements
- Buttons have 16px padding minimum
- List items have 56px minimum height

### Gestures
- **Swipe to delete** on list items (Assets, Analytics)
- **Pull to refresh** on Dashboard, Assets, Analytics
- **Swipe down to dismiss** on modals
- **Long press** for context menus (future)

### Feedback
- **Haptic feedback** on button taps (light impact)
- **Scale animation** on button press (0.97)
- **Opacity change** on list item press (0.7)
- **Loading states** for all async operations
- **Success/error toasts** for actions

### Loading States
- **Skeleton screens** for initial loads
- **Shimmer effect** on placeholder cards
- **Progress bars** for generation
- **Spinners** for quick actions (< 3 seconds)

---

## Accessibility

- **VoiceOver/TalkBack support** for all interactive elements
- **Dynamic type support** for text scaling
- **High contrast mode** support
- **Reduced motion toggle** in Settings
- **Color-blind friendly** palette (no red/green only indicators)
- **Minimum contrast ratio 4.5:1** for text

---

## PWA Requirements

- **Installable** on Android home screen
- **Fullscreen mode** when installed
- **Offline shell** (cached UI, "No connection" message)
- **Fast load** (< 3 seconds on 3G)
- **Manifest.json** with icons and theme color
- **Service worker** for offline support

---

## Technical Considerations

### State Management
- **AsyncStorage** for theme preferences (local)
- **Database** for user account, subscription, promo bundles
- **React Context** for theme state (global)
- **TanStack Query** for API data

### Backend Integration
- **Authentication** via email/magic link (Expo Auth Session)
- **Stripe subscriptions** via backend API
- **AI generation** via backend (never expose API keys)
- **Video engine routing** (Veo 3 / Sora) via backend logic

### Performance
- **Lazy load** images and videos
- **Virtualized lists** (FlatList) for Assets and Analytics
- **Debounced inputs** for search and sliders
- **Memoized components** for theme preview

---

## Design Tokens

### Spacing Scale
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px

### Typography Scale
- `xs`: 12px (captions)
- `sm`: 14px (body small)
- `base`: 16px (body)
- `lg`: 18px (subheadings)
- `xl`: 20px (headings)
- `2xl`: 24px (titles)
- `3xl`: 32px (hero)

### Border Radius
- `sm`: 8px (buttons, inputs)
- `md`: 12px (cards)
- `lg`: 16px (modals)
- `xl`: 24px (hero elements)
- `full`: 9999px (pills, avatars)

### Shadows
- `sm`: 0 1px 2px rgba(0,0,0,0.05)
- `md`: 0 4px 6px rgba(0,0,0,0.1)
- `lg`: 0 10px 15px rgba(0,0,0,0.15)
- `xl`: 0 20px 25px rgba(0,0,0,0.2)

---

## Conclusion

This design prioritizes **usability**, **visual appeal**, and **performance** for small business owners who need fast, professional results without technical complexity. The glassmorphism aesthetic differentiates Promo Factory while maintaining iOS-like familiarity and one-handed mobile usability.
