# Promo Factory Ultimate - Weekly Test Plan

**Schedule:** Every Monday at 9:00 AM EST  
**Purpose:** Comprehensive end-to-end testing across all user roles, permissions, and features  
**Duration:** ~30-45 minutes per run

---

## Test Roles

The test suite simulates three distinct user roles based on subscription tiers:

### 1. **Free Tier User**
- **Permissions:** 5 generations/month, watermarked exports, no video generation, basic analytics
- **Expected Restrictions:** Cannot access Pro/Agency features, upgrade prompts shown
- **Test Focus:** Verify limits are enforced, watermarks appear, upgrade CTAs work

### 2. **Pro Tier User** ($29/month)
- **Permissions:** 50 generations/month, clean exports, Veo 3 video generation, advanced analytics, AI Assistant
- **Expected Restrictions:** No Sora video (Agency only), no unlimited generations
- **Test Focus:** Verify Pro features work, Agency features blocked, analytics accessible

### 3. **Agency Tier User** ($99/month)
- **Permissions:** Unlimited generations, clean exports, Sora video generation, premium analytics, AI Assistant with automation
- **Expected Restrictions:** None (full access)
- **Test Focus:** Verify all premium features work, no limits enforced

---

## Test Scenarios

### **A. Authentication & User Management**

#### A1. Demo Mode Login
- **Action:** Open app URL
- **Expected:** Auto-login as "Demo User" without authentication barriers
- **Verify:** Dashboard loads with "Welcome back, Demo User!" message
- **Roles:** All

#### A2. User Profile Access
- **Action:** Navigate to Settings → Account → Profile
- **Expected:** Profile screen loads with user information
- **Verify:** Business name, industry, and brand profile data displayed
- **Roles:** All

---

### **B. Subscription & Tier Enforcement**

#### B1. Free Tier Limits
- **Action:** Create 6 promos as Free user
- **Expected:** 6th generation blocked with upgrade prompt
- **Verify:** "You've reached your 5 generations/month limit" message shown
- **Roles:** Free

#### B2. Pro Tier Limits
- **Action:** Create 51 promos as Pro user
- **Expected:** 51st generation blocked with upgrade prompt
- **Verify:** "You've reached your 50 generations/month limit" message shown
- **Roles:** Pro

#### B3. Agency Unlimited Access
- **Action:** Create 100+ promos as Agency user
- **Expected:** No limits enforced
- **Verify:** All generations succeed without restrictions
- **Roles:** Agency

#### B4. Watermark Enforcement
- **Action:** Export promo as Free user
- **Expected:** "PROMO FACTORY FREE" watermark overlaid on image
- **Verify:** Watermark visible in downloaded file
- **Roles:** Free

#### B5. Clean Export Verification
- **Action:** Export promo as Pro/Agency user
- **Expected:** No watermark on exported image
- **Verify:** Downloaded file is clean without branding overlay
- **Roles:** Pro, Agency

#### B6. Upgrade Flow
- **Action:** Click "Upgrade to Pro" button in Settings
- **Expected:** Upgrade screen loads with plan comparison
- **Verify:** Free ($0), Pro ($29), Agency ($99) cards displayed with features
- **Roles:** All

#### B7. Demo Payment Processing
- **Action:** Select Pro plan and click "Subscribe Now"
- **Expected:** Demo checkout completes, tier updated in database
- **Verify:** Settings shows "Current Plan: Pro" after upgrade
- **Roles:** Free → Pro, Pro → Agency

---

### **C. Content Creation & Generation**

#### C1. Text Promo Generation
- **Action:** Enter "Grand Opening Sale - 50% Off" in Create screen, select HYPE style, click Generate
- **Expected:** Loading overlay appears, progress bar animates, promo bundle generated
- **Verify:** Assets screen shows new bundle with flyer, social posts, copy pack
- **Roles:** All

#### C2. Image Upload & Generation
- **Action:** Upload business logo, enter promo text, select INSTA style, generate
- **Expected:** Logo integrated into generated designs
- **Verify:** Logo visible in flyer and social posts
- **Roles:** All

#### C3. Video Generation (Free Tier Block)
- **Action:** Select VIDEO style as Free user, click Generate
- **Expected:** Upgrade prompt shown: "Video generation requires Pro or Agency tier"
- **Verify:** Generation blocked, upgrade CTA displayed
- **Roles:** Free

#### C4. Video Generation (Pro Tier - Veo 3)
- **Action:** Select VIDEO style as Pro user, click Generate
- **Expected:** Video generated using Google Veo 3 API
- **Verify:** Video asset appears in bundle with "Generated with Veo 3" metadata
- **Roles:** Pro

#### C5. Video Generation (Agency Tier - Sora)
- **Action:** Select VIDEO style as Agency user, click Generate
- **Expected:** Video generated using Sora API (premium quality)
- **Verify:** Video asset appears with "Generated with Sora" metadata
- **Roles:** Agency

#### C6. Brand Profile Integration
- **Action:** Set brand colors (purple #8B5CF6, gold #F59E0B), generate promo
- **Expected:** Generated designs use brand colors in palette
- **Verify:** Flyer and social posts reflect brand color scheme
- **Roles:** All

#### C7. Industry Template Application
- **Action:** Select "Restaurant" template, generate promo
- **Expected:** Restaurant-specific keywords and imagery in output
- **Verify:** Generated copy includes food/dining terminology
- **Roles:** All

---

### **D. Assets Library & Export**

#### D1. Asset List Display
- **Action:** Navigate to Assets tab
- **Expected:** All generated promo bundles displayed as cards
- **Verify:** Thumbnails, titles, and creation dates visible
- **Roles:** All

#### D2. Asset Detail View
- **Action:** Tap on promo bundle card
- **Expected:** Full-screen detail modal opens with tabs (Flyer, Story, Feed Post, Copy Pack)
- **Verify:** All asset types displayed correctly
- **Roles:** All

#### D3. Single Asset Download
- **Action:** Click "Download" button on Flyer tab
- **Expected:** PNG file downloads to device
- **Verify:** File saved successfully, opens correctly
- **Roles:** All

#### D4. Multi-Platform Export
- **Action:** Click "Export to Platforms" button, select Instagram Post + Facebook Post + LinkedIn
- **Expected:** Platform selection modal opens, 3 platforms selected
- **Verify:** 3 optimized files generated (1080x1080, 1080x1080, 1200x630)
- **Roles:** All

#### D5. Platform-Specific Dimensions
- **Action:** Export to Instagram Story (1080x1920), TikTok (1080x1920), Twitter (1200x675)
- **Expected:** Each platform receives correctly sized asset
- **Verify:** Aspect ratios match platform requirements
- **Roles:** All

#### D6. Asset Deletion
- **Action:** Swipe left on bundle card, tap Delete, confirm
- **Expected:** Bundle removed from list
- **Verify:** Asset no longer appears in Assets tab
- **Roles:** All

---

### **E. Analytics Dashboard**

#### E1. Analytics Access (Free Tier)
- **Action:** Navigate to Analytics tab as Free user
- **Expected:** Basic analytics shown with upgrade prompt
- **Verify:** "Upgrade to Pro for Advanced Analytics" banner displayed
- **Roles:** Free

#### E2. Analytics Access (Pro/Agency Tier)
- **Action:** Navigate to Analytics tab as Pro/Agency user
- **Expected:** Full analytics dashboard loads
- **Verify:** Views, Clicks, Shares, Conversions metrics displayed
- **Roles:** Pro, Agency

#### E3. Real Data Tracking
- **Action:** Generate promo, share it, view it 3 times
- **Expected:** Analytics counters increment
- **Verify:** Views: +3, Shares: +1 in dashboard
- **Roles:** Pro, Agency

#### E4. Date Range Filtering
- **Action:** Select "Last 7 Days" filter
- **Expected:** Chart updates to show only last week's data
- **Verify:** Data points match selected range
- **Roles:** Pro, Agency

#### E5. Export Report (Pro Feature)
- **Action:** Click "Export Report" button
- **Expected:** PDF report downloads with charts and metrics
- **Verify:** File contains analytics summary
- **Roles:** Pro, Agency

---

### **F. Content Calendar & Scheduling**

#### F1. Calendar View
- **Action:** Navigate to Calendar tab
- **Expected:** Month view calendar loads with scheduled posts
- **Verify:** Current month displayed, dates clickable
- **Roles:** All

#### F2. Schedule Post
- **Action:** Select date (e.g., next Monday), choose promo, set time (9:00 AM), click Schedule
- **Expected:** Post added to calendar on selected date
- **Verify:** Calendar shows scheduled post indicator on date
- **Roles:** All

#### F3. Best Time Suggestions
- **Action:** Click "Best Time to Post" suggestion chip
- **Expected:** Recommended times displayed (e.g., "Tuesday 10 AM", "Thursday 2 PM")
- **Verify:** Suggestions based on industry/audience data
- **Roles:** All

#### F4. Edit Scheduled Post
- **Action:** Tap scheduled post, modify caption, save
- **Expected:** Changes saved to schedule
- **Verify:** Updated caption appears in calendar
- **Roles:** All

#### F5. Delete Scheduled Post
- **Action:** Tap scheduled post, click Delete, confirm
- **Expected:** Post removed from calendar
- **Verify:** Date no longer shows scheduled indicator
- **Roles:** All

---

### **G. Social Media Publishing**

#### G1. Direct Publish to Instagram
- **Action:** Select promo, click "Publish Now", choose Instagram, enter caption, publish
- **Expected:** Publishing flow completes (demo mode simulates success)
- **Verify:** Success message: "Published to Instagram!"
- **Roles:** All

#### G2. Direct Publish to Facebook
- **Action:** Select promo, publish to Facebook with caption
- **Expected:** Publishing flow completes
- **Verify:** Success confirmation shown
- **Roles:** All

#### G3. Direct Publish to LinkedIn
- **Action:** Select promo, publish to LinkedIn with professional caption
- **Expected:** Publishing flow completes
- **Verify:** Success confirmation shown
- **Roles:** All

#### G4. Multi-Platform Publishing
- **Action:** Select Instagram + Facebook + LinkedIn, publish to all
- **Expected:** All 3 platforms receive post
- **Verify:** 3 success confirmations displayed
- **Roles:** All

#### G5. Character Limit Enforcement
- **Action:** Enter 500-character caption for Twitter (280 limit)
- **Expected:** Warning shown: "Caption exceeds Twitter's 280 character limit"
- **Verify:** Publish button disabled until caption shortened
- **Roles:** All

---

### **H. AI Assistant**

#### H1. Assistant Access (Free Tier Block)
- **Action:** Navigate to Assistant tab as Free user
- **Expected:** Upgrade prompt shown
- **Verify:** "AI Assistant requires Pro or Agency tier" message displayed
- **Roles:** Free

#### H2. Assistant Chat (Pro/Agency)
- **Action:** Navigate to Assistant tab as Pro/Agency user, send message "Summarize my analytics"
- **Expected:** AI responds with analytics summary
- **Verify:** Response includes metrics from Analytics dashboard
- **Roles:** Pro, Agency

#### H3. Quick Action - Generate Copy
- **Action:** Tap "Generate Copy" quick action chip
- **Expected:** AI generates 5 headline variations
- **Verify:** Copy pack created and added to Assets
- **Roles:** Pro, Agency

#### H4. Quick Action - Suggest Next Promo
- **Action:** Tap "Suggest Next Promo" chip
- **Expected:** AI analyzes past campaigns and suggests new promo idea
- **Verify:** Suggestion includes theme, style, and target audience
- **Roles:** Pro, Agency

#### H5. Quick Action - Create Task
- **Action:** Tap "Create Task" chip, AI creates "Post to Instagram on Friday 2 PM"
- **Expected:** Task added to calendar
- **Verify:** Calendar shows new scheduled task
- **Roles:** Pro, Agency

---

### **I. Settings & Preferences**

#### I1. Brand Profile Setup
- **Action:** Navigate to Settings → Brand Profile, enter business name "Joe's Pizza", industry "Restaurant", colors
- **Expected:** Brand profile saved
- **Verify:** Settings shows "Brand Profile: Joe's Pizza (Restaurant)"
- **Roles:** All

#### I2. Sound Effects Toggle
- **Action:** Navigate to Settings → Preferences → Sound Effects, toggle OFF
- **Expected:** Sound effects disabled
- **Verify:** Button presses no longer play sounds
- **Roles:** All

#### I3. Theme Customization
- **Action:** Navigate to Settings → Preferences → Theme, select "Gold Luxe" preset
- **Expected:** App theme changes to gold/black color scheme
- **Verify:** Dashboard, Create, and all screens reflect new theme
- **Roles:** All

#### I4. Subscription Management
- **Action:** Navigate to Settings → Subscription, view current plan
- **Expected:** Current tier displayed (Free/Pro/Agency) with features list
- **Verify:** "Upgrade" button shown for lower tiers
- **Roles:** All

#### I5. About Section
- **Action:** Navigate to Settings → Support → About
- **Expected:** About screen loads with app info and "Powered by The Agency" logo
- **Verify:** Agency gold logo visible at bottom
- **Roles:** All

---

### **J. Visual & Link Validation**

#### J1. All Images Load
- **Action:** Navigate through all screens (Dashboard, Create, Assets, Analytics, Assistant, Settings)
- **Expected:** All images, icons, and logos load correctly
- **Verify:** No broken image placeholders, no 404 errors
- **Roles:** All

#### J2. Hero Image Visibility
- **Action:** Open Create screen
- **Expected:** "PROMO FACTORY ULTIMATE" hero image loads with floating icons and speed lines
- **Verify:** Image displays correctly, no distortion
- **Roles:** All

#### J3. The Agency Logo Visibility
- **Action:** Check Login screen footer, Settings footer, Upgrade screen footer
- **Expected:** Gold "The Agency" logo visible in all 3 locations
- **Verify:** Logo loads correctly, no broken links
- **Roles:** All

#### J4. Template Thumbnails
- **Action:** Open Template Library, scroll through all 21 templates
- **Expected:** All template preview images load
- **Verify:** No broken thumbnails, all categories visible
- **Roles:** All

#### J5. Generated Asset Previews
- **Action:** Generate promo, view in Assets library
- **Expected:** Flyer, social post, and video thumbnails load
- **Verify:** All asset previews display correctly
- **Roles:** All

#### J6. External Links
- **Action:** Click "Help" link in Settings → Support
- **Expected:** Help documentation opens (or placeholder message)
- **Verify:** Link works, no 404 error
- **Roles:** All

#### J7. Social Media Icons
- **Action:** Check platform selection modal (Export to Platforms)
- **Expected:** Instagram, Facebook, TikTok, LinkedIn, Twitter icons load
- **Verify:** All 6 platform icons visible
- **Roles:** All

---

### **K. Performance & Error Handling**

#### K1. App Load Time
- **Action:** Open app URL in fresh browser session
- **Expected:** Dashboard loads within 5 seconds
- **Verify:** No timeout errors, smooth loading
- **Roles:** All

#### K2. Generation Timeout Handling
- **Action:** Trigger generation, simulate network delay
- **Expected:** Loading overlay shows progress, timeout after 60 seconds
- **Verify:** Error message: "Generation timed out. Please try again."
- **Roles:** All

#### K3. Offline Behavior
- **Action:** Disconnect internet, navigate app
- **Expected:** Cached screens load, network-dependent features show offline message
- **Verify:** "You're offline. Some features may be unavailable."
- **Roles:** All

#### K4. Invalid Input Handling
- **Action:** Submit empty promo text on Create screen
- **Expected:** Validation error: "Please enter promo text"
- **Verify:** Generate button disabled until valid input provided
- **Roles:** All

#### K5. Database Error Handling
- **Action:** Simulate database connection failure
- **Expected:** Graceful error message: "Unable to save. Please try again."
- **Verify:** App doesn't crash, user can retry
- **Roles:** All

---

## Test Execution Checklist

### Pre-Test Setup
- [ ] Verify app URL is accessible: `https://8081-i574die8ukqw0x17b6e3c-f4bd1687.us2.manus.computer`
- [ ] Clear browser cache and cookies
- [ ] Prepare test accounts for each tier (Free, Pro, Agency)
- [ ] Reset generation counters for monthly limits

### During Test
- [ ] Execute all scenarios for each role (Free, Pro, Agency)
- [ ] Document any failures with screenshots
- [ ] Record response times for performance metrics
- [ ] Verify all images and links load correctly
- [ ] Check browser console for errors

### Post-Test Reporting
- [ ] Generate test report with pass/fail status for each scenario
- [ ] List all broken images/links found
- [ ] Document permission violations (if any)
- [ ] Calculate overall pass rate (target: 95%+)
- [ ] Create GitHub issues for any failures
- [ ] Send summary report via email/Slack

---

## Success Criteria

**Test passes if:**
- ✅ All tier-specific permissions enforced correctly (100% compliance)
- ✅ No broken images or 404 errors across entire app
- ✅ All external links functional
- ✅ Free tier watermarks appear, Pro/Agency exports clean
- ✅ Generation limits enforced (5 for Free, 50 for Pro, unlimited for Agency)
- ✅ All critical user flows complete without errors (95%+ pass rate)
- ✅ App loads within 5 seconds
- ✅ No console errors or warnings

**Test fails if:**
- ❌ Any permission bypass detected (e.g., Free user accessing Pro features)
- ❌ Broken images or links found
- ❌ Watermark missing on Free tier exports
- ❌ Generation limits not enforced
- ❌ Critical flows broken (login, generation, export)
- ❌ App crash or unrecoverable error

---

## Automated Test Script

The automated test script will:
1. **Simulate user interactions** using headless browser (Playwright/Puppeteer)
2. **Switch between user roles** by modifying database subscription tier
3. **Validate permissions** by attempting restricted actions
4. **Check all images/links** by scanning DOM for broken resources
5. **Generate detailed report** with pass/fail status and screenshots
6. **Send notifications** via email/Slack with test results

Script location: `/home/ubuntu/promo-factory/tests/weekly-e2e-test.ts`

---

## Schedule Configuration

**Cron Expression:** `0 0 9 * * 1` (Every Monday at 9:00 AM EST)

**Execution Environment:** Manus scheduled task runner

**Notifications:**
- ✅ Success: Send summary report
- ❌ Failure: Send detailed error report with screenshots
- 📊 Weekly: Send trend analysis (pass rate over time)

---

## Maintenance Notes

- **Update test plan** when new features added
- **Adjust scenarios** if subscription tiers change
- **Review failures** weekly and fix root causes
- **Archive reports** for historical tracking
- **Update success criteria** as app evolves

---

**Last Updated:** January 14, 2026  
**Version:** 1.0  
**Owner:** Promo Factory Development Team
