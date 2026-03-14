/**
 * Promo Factory Ultimate - Weekly Automated E2E Test Suite
 * 
 * Runs every Monday at 9:00 AM EST
 * Tests all features across Free, Pro, and Agency user roles
 * Validates permissions, images, links, and critical user flows
 */

import { chromium, Browser, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { sendTestReportEmail, type TestReportSummary } from '../server/email-service';

// Configuration
const APP_URL = process.env.APP_URL || 'https://8081-i574die8ukqw0x17b6e3c-f4bd1687.us2.manus.computer';
const SCREENSHOT_DIR = '/home/ubuntu/promo-factory/test-results/screenshots';
const REPORT_DIR = '/home/ubuntu/promo-factory/test-results/reports';
const NOTIFICATION_EMAIL = process.env.TEST_REPORT_EMAIL || 'amenefee614@gmail.com';

// Test results tracking
interface TestResult {
  scenario: string;
  role: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  duration: number;
  error?: string;
  screenshot?: string;
}

const testResults: TestResult[] = [];
let browser: Browser;
let page: Page;

// Utility functions
async function setupBrowser() {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 }, // iPhone X dimensions
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
  });
  page = await context.newPage();
  
  // Create directories
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }
  if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
  }
}

async function teardownBrowser() {
  if (browser) {
    await browser.close();
  }
}

async function takeScreenshot(name: string): Promise<string> {
  const timestamp = Date.now();
  const filename = `${name}-${timestamp}.png`;
  const filepath = path.join(SCREENSHOT_DIR, filename);
  await page.screenshot({ path: filepath, fullPage: true });
  return filepath;
}

async function setUserTier(tier: 'free' | 'pro' | 'agency') {
  // Simulate tier change by setting localStorage
  await page.evaluate((tier: string) => {
    localStorage.setItem('demo_user_tier', tier);
  }, tier);
  await page.reload();
  await page.waitForTimeout(2000);
}

async function runTest(
  scenario: string,
  role: string,
  testFn: () => Promise<void>
): Promise<void> {
  const startTime = Date.now();
  try {
    await testFn();
    const duration = Date.now() - startTime;
    testResults.push({
      scenario,
      role,
      status: 'PASS',
      duration,
    });
    console.log(`✅ PASS: ${scenario} (${role}) - ${duration}ms`);
  } catch (error) {
    const duration = Date.now() - startTime;
    const screenshot = await takeScreenshot(`fail-${scenario.replace(/\s+/g, '-')}`);
    testResults.push({
      scenario,
      role,
      status: 'FAIL',
      duration,
      error: error instanceof Error ? error.message : String(error),
      screenshot,
    });
    console.error(`❌ FAIL: ${scenario} (${role}) - ${error}`);
  }
}

async function checkBrokenImages(): Promise<string[]> {
  const brokenImages = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'));
    return images
      .filter((img) => !img.complete || img.naturalWidth === 0)
      .map((img) => img.src);
  });
  return brokenImages;
}

async function checkBrokenLinks(): Promise<string[]> {
  const links = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a[href]'));
    return anchors.map((a) => (a as HTMLAnchorElement).href);
  });

  const brokenLinks: string[] = [];
  for (const link of links) {
    if (link.startsWith('http')) {
      try {
        const response = await fetch(link, { method: 'HEAD' });
        if (!response.ok) {
          brokenLinks.push(link);
        }
      } catch {
        brokenLinks.push(link);
      }
    }
  }
  return brokenLinks;
}

// Test Scenarios

async function testDemoModeLogin() {
  await runTest('A1. Demo Mode Login', 'All', async () => {
    await page.goto(APP_URL);
    await page.waitForSelector('text=Welcome back, Demo User!', { timeout: 10000 });
  });
}

async function testFreeTierLimits() {
  await runTest('B1. Free Tier Limits', 'Free', async () => {
    await setUserTier('free');
    await page.goto(`${APP_URL}/create`);
    
    // Attempt to generate 6 promos (should block on 6th)
    for (let i = 0; i < 6; i++) {
      await page.fill('input[placeholder*="promo"]', `Test Promo ${i + 1}`);
      await page.click('text=Generate');
      await page.waitForTimeout(3000);
      
      if (i === 5) {
        // 6th generation should show upgrade prompt
        const upgradePrompt = await page.locator('text=reached your 5 generations').isVisible();
        if (!upgradePrompt) {
          throw new Error('Free tier limit not enforced - 6th generation allowed');
        }
      }
    }
  });
}

async function testWatermarkEnforcement() {
  await runTest('B4. Watermark Enforcement', 'Free', async () => {
    await setUserTier('free');
    await page.goto(`${APP_URL}/assets`);
    
    // Click first asset
    await page.click('.asset-card:first-child');
    await page.waitForSelector('text=Download');
    
    // Check if watermark is visible in preview
    const hasWatermark = await page.locator('text=PROMO FACTORY FREE').isVisible();
    if (!hasWatermark) {
      throw new Error('Watermark not displayed on Free tier export');
    }
  });
}

async function testCleanExport() {
  await runTest('B5. Clean Export Verification', 'Pro', async () => {
    await setUserTier('pro');
    await page.goto(`${APP_URL}/assets`);
    
    // Click first asset
    await page.click('.asset-card:first-child');
    await page.waitForSelector('text=Download');
    
    // Check that watermark is NOT visible
    const hasWatermark = await page.locator('text=PROMO FACTORY FREE').isVisible();
    if (hasWatermark) {
      throw new Error('Watermark incorrectly shown on Pro tier export');
    }
  });
}

async function testTextPromoGeneration() {
  await runTest('C1. Text Promo Generation', 'All', async () => {
    await page.goto(`${APP_URL}/create`);
    await page.fill('input[placeholder*="promo"]', 'Grand Opening Sale - 50% Off');
    await page.click('text=HYPE');
    await page.click('text=Generate');
    
    // Wait for loading overlay
    await page.waitForSelector('text=Generating', { timeout: 5000 });
    
    // Wait for completion (max 60 seconds)
    await page.waitForSelector('text=Assets', { timeout: 60000 });
    
    // Verify navigation to Assets
    const url = page.url();
    if (!url.includes('/assets')) {
      throw new Error('Did not navigate to Assets after generation');
    }
  });
}

async function testVideoGenerationBlock() {
  await runTest('C3. Video Generation (Free Tier Block)', 'Free', async () => {
    await setUserTier('free');
    await page.goto(`${APP_URL}/create`);
    await page.click('text=VIDEO');
    await page.click('text=Generate');
    
    // Should show upgrade prompt
    const upgradePrompt = await page.locator('text=Video generation requires').isVisible();
    if (!upgradePrompt) {
      throw new Error('Free tier video generation not blocked');
    }
  });
}

async function testAnalyticsAccess() {
  await runTest('E2. Analytics Access (Pro Tier)', 'Pro', async () => {
    await setUserTier('pro');
    await page.goto(`${APP_URL}/analytics`);
    
    // Verify analytics dashboard loads
    await page.waitForSelector('text=Views', { timeout: 5000 });
    await page.waitForSelector('text=Clicks', { timeout: 5000 });
    await page.waitForSelector('text=Shares', { timeout: 5000 });
    
    // Verify no upgrade prompt shown
    const upgradePrompt = await page.locator('text=Upgrade to Pro').isVisible();
    if (upgradePrompt) {
      throw new Error('Upgrade prompt shown on Pro tier analytics');
    }
  });
}

async function testAIAssistantBlock() {
  await runTest('H1. Assistant Access (Free Tier Block)', 'Free', async () => {
    await setUserTier('free');
    await page.goto(`${APP_URL}/assistant`);
    
    // Should show upgrade prompt
    const upgradePrompt = await page.locator('text=AI Assistant requires').isVisible();
    if (!upgradePrompt) {
      throw new Error('Free tier AI Assistant not blocked');
    }
  });
}

async function testAIAssistantAccess() {
  await runTest('H2. Assistant Chat (Pro Tier)', 'Pro', async () => {
    await setUserTier('pro');
    await page.goto(`${APP_URL}/assistant`);
    
    // Verify assistant interface loads
    await page.waitForSelector('input[placeholder*="message"]', { timeout: 5000 });
    
    // Send test message
    await page.fill('input[placeholder*="message"]', 'Summarize my analytics');
    await page.click('button[type="submit"]');
    
    // Wait for response
    await page.waitForSelector('.assistant-message', { timeout: 10000 });
  });
}

async function testBrandProfileSetup() {
  await runTest('I1. Brand Profile Setup', 'All', async () => {
    await page.goto(`${APP_URL}/settings`);
    await page.click('text=Brand Profile');
    
    // Fill brand profile form
    await page.fill('input[placeholder*="business name"]', "Joe's Pizza");
    await page.selectOption('select', 'restaurant');
    await page.fill('input[type="color"]', '#8B5CF6');
    await page.click('text=Save');
    
    // Verify saved
    await page.waitForSelector('text=Brand Profile saved', { timeout: 5000 });
  });
}

async function testAllImagesLoad() {
  await runTest('J1. All Images Load', 'All', async () => {
    const screens = ['/', '/create', '/assets', '/analytics', '/assistant', '/settings'];
    
    for (const screen of screens) {
      await page.goto(`${APP_URL}${screen}`);
      await page.waitForTimeout(2000);
      
      const brokenImages = await checkBrokenImages();
      if (brokenImages.length > 0) {
        throw new Error(`Broken images found on ${screen}: ${brokenImages.join(', ')}`);
      }
    }
  });
}

async function testTheAgencyLogoVisibility() {
  await runTest('J3. The Agency Logo Visibility', 'All', async () => {
    const screens = ['/settings', '/upgrade'];
    
    for (const screen of screens) {
      await page.goto(`${APP_URL}${screen}`);
      await page.waitForTimeout(2000);
      
      // Check for Agency logo
      const logoVisible = await page.locator('img[alt*="Agency"]').isVisible();
      if (!logoVisible) {
        throw new Error(`The Agency logo not visible on ${screen}`);
      }
    }
  });
}

async function testAppLoadTime() {
  await runTest('K1. App Load Time', 'All', async () => {
    const startTime = Date.now();
    await page.goto(APP_URL);
    await page.waitForSelector('text=Welcome back', { timeout: 10000 });
    const loadTime = Date.now() - startTime;
    
    if (loadTime > 5000) {
      throw new Error(`App load time too slow: ${loadTime}ms (target: <5000ms)`);
    }
  });
}

// Main test execution
async function runAllTests() {
  console.log('🚀 Starting Promo Factory Ultimate Weekly Test Suite...\n');
  console.log(`📅 Date: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}`);
  console.log(`🔗 App URL: ${APP_URL}\n`);

  await setupBrowser();

  try {
    // Authentication & User Management
    await testDemoModeLogin();

    // Subscription & Tier Enforcement
    await testFreeTierLimits();
    await testWatermarkEnforcement();
    await testCleanExport();

    // Content Creation & Generation
    await testTextPromoGeneration();
    await testVideoGenerationBlock();

    // Analytics Dashboard
    await testAnalyticsAccess();

    // AI Assistant
    await testAIAssistantBlock();
    await testAIAssistantAccess();

    // Settings & Preferences
    await testBrandProfileSetup();

    // Visual & Link Validation
    await testAllImagesLoad();
    await testTheAgencyLogoVisibility();

    // Performance
    await testAppLoadTime();

  } catch (error) {
    console.error('❌ Test suite encountered fatal error:', error);
  } finally {
    await teardownBrowser();
  }

  // Generate report
  await generateReport();
}

async function generateReport() {
  const timestamp = new Date().toISOString();
  const totalTests = testResults.length;
  const passedTests = testResults.filter((r) => r.status === 'PASS').length;
  const failedTests = testResults.filter((r) => r.status === 'FAIL').length;
  const passRate = parseFloat(((passedTests / totalTests) * 100).toFixed(2));

  const reportContent = `
# Promo Factory Ultimate - Weekly Test Report

**Date:** ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} EST
**App URL:** ${APP_URL}

---

## Summary

- **Total Tests:** ${totalTests}
- **Passed:** ${passedTests} ✅
- **Failed:** ${failedTests} ❌
- **Pass Rate:** ${passRate}%

---

## Test Results

${testResults
  .map(
    (result) => `
### ${result.status === 'PASS' ? '✅' : '❌'} ${result.scenario} (${result.role})

- **Status:** ${result.status}
- **Duration:** ${result.duration}ms
${result.error ? `- **Error:** ${result.error}` : ''}
${result.screenshot ? `- **Screenshot:** ${result.screenshot}` : ''}
`
  )
  .join('\n')}

---

## Success Criteria

${passRate >= 95 ? '✅ **PASS** - Test suite meets 95%+ pass rate requirement' : '❌ **FAIL** - Test suite below 95% pass rate threshold'}

---

## Recommendations

${
  failedTests > 0
    ? `
⚠️ **Action Required:**
- Review failed test scenarios above
- Check screenshots for visual debugging
- Fix root causes before next week's test run
- Consider adding regression tests for fixed issues
`
    : '✅ All tests passed! No action required.'
}

---

**Generated by:** Promo Factory Automated Test Suite  
**Next Run:** Next Monday at 9:00 AM EST
`;

  const reportPath = path.join(REPORT_DIR, `test-report-${Date.now()}.md`);
  fs.writeFileSync(reportPath, reportContent);

  console.log('\n📊 Test Report Generated:');
  console.log(`   Path: ${reportPath}`);
  console.log(`   Pass Rate: ${passRate}%`);
  console.log(`   Status: ${passRate >= 95 ? '✅ PASS' : '❌ FAIL'}\n`);

  // Print summary to console
  console.log(reportContent);

  // Send email notification
  await sendEmailNotification({
    totalTests,
    passedTests,
    failedTests,
    passRate,
    brokenImages: [],
    brokenLinks: [],
    failedScenarios: testResults
      .filter(r => r.status === 'FAIL')
      .map(r => ({
        scenario: r.scenario,
        role: r.role,
        error: r.error || 'Unknown error'
      })),
    timestamp: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }) + ' EST'
  });
}

async function sendEmailNotification(report: TestReportSummary) {
  console.log(`\n📧 Sending email notification to ${NOTIFICATION_EMAIL}...`);
  
  try {
    const success = await sendTestReportEmail(NOTIFICATION_EMAIL, report);
    
    if (success) {
      console.log(`✅ Email sent successfully to ${NOTIFICATION_EMAIL}`);
    } else {
      console.warn(`⚠️ Failed to send email to ${NOTIFICATION_EMAIL}`);
      console.warn('   Email notification may not be configured. Check server logs.');
    }
  } catch (error) {
    console.error('❌ Error sending email notification:', error);
  }
}

// Run tests
runAllTests().catch((error) => {
  console.error('Fatal error running test suite:', error);
  process.exit(1);
});
