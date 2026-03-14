/**
 * Email Notification Service for Weekly Test Reports
 * 
 * Sends formatted test report emails using the Manus notification system
 */

import { notifyOwner } from './_core/notification';

export interface TestReportSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  passRate: number;
  brokenImages: string[];
  brokenLinks: string[];
  failedScenarios: Array<{
    scenario: string;
    role: string;
    error: string;
  }>;
  timestamp: string;
}

/**
 * Formats test report as HTML email
 */
function formatTestReportEmail(report: TestReportSummary): string {
  const statusEmoji = report.passRate >= 95 ? '✅' : '❌';
  const statusText = report.passRate >= 95 ? 'PASSED' : 'FAILED';
  
  let emailContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .header .subtitle { margin: 10px 0 0 0; opacity: 0.9; font-size: 14px; }
    .summary { background: #f8f9fa; padding: 25px; border-left: 4px solid #667eea; margin: 20px 0; }
    .summary h2 { margin-top: 0; color: #667eea; }
    .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
    .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
    .stat-value { font-size: 32px; font-weight: bold; color: #667eea; }
    .stat-label { font-size: 14px; color: #666; margin-top: 5px; }
    .pass { color: #10b981; }
    .fail { color: #ef4444; }
    .section { margin: 25px 0; }
    .section h3 { color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
    .issue-list { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 10px 0; border-radius: 4px; }
    .issue-item { margin: 8px 0; padding: 8px; background: white; border-radius: 4px; }
    .success-message { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 10px 0; border-radius: 4px; color: #065f46; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666; font-size: 12px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
    .badge-success { background: #d1fae5; color: #065f46; }
    .badge-danger { background: #fee2e2; color: #991b1b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${statusEmoji} Promo Factory Ultimate - Weekly Test Report</h1>
      <p class="subtitle">${report.timestamp}</p>
    </div>
    
    <div class="summary">
      <h2>Test Status: <span class="badge ${report.passRate >= 95 ? 'badge-success' : 'badge-danger'}">${statusText}</span></h2>
      <p><strong>Pass Rate:</strong> ${report.passRate.toFixed(2)}% (Target: 95%+)</p>
    </div>
    
    <div class="stats">
      <div class="stat-card">
        <div class="stat-value">${report.totalTests}</div>
        <div class="stat-label">Total Tests</div>
      </div>
      <div class="stat-card">
        <div class="stat-value pass">${report.passedTests}</div>
        <div class="stat-label">Passed ✅</div>
      </div>
      <div class="stat-card">
        <div class="stat-value fail">${report.failedTests}</div>
        <div class="stat-label">Failed ❌</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${report.passRate.toFixed(1)}%</div>
        <div class="stat-label">Pass Rate</div>
      </div>
    </div>
`;

  // Failed tests section
  if (report.failedScenarios.length > 0) {
    emailContent += `
    <div class="section">
      <h3>❌ Failed Tests (${report.failedScenarios.length})</h3>
      <div class="issue-list">
`;
    report.failedScenarios.forEach(failure => {
      emailContent += `
        <div class="issue-item">
          <strong>${failure.scenario}</strong> (${failure.role})<br>
          <small style="color: #dc2626;">${failure.error}</small>
        </div>
`;
    });
    emailContent += `
      </div>
    </div>
`;
  }

  // Broken images section
  if (report.brokenImages.length > 0) {
    emailContent += `
    <div class="section">
      <h3>🖼️ Broken Images (${report.brokenImages.length})</h3>
      <div class="issue-list">
`;
    report.brokenImages.forEach(img => {
      emailContent += `        <div class="issue-item"><code>${img}</code></div>\n`;
    });
    emailContent += `
      </div>
    </div>
`;
  }

  // Broken links section
  if (report.brokenLinks.length > 0) {
    emailContent += `
    <div class="section">
      <h3>🔗 Broken Links (${report.brokenLinks.length})</h3>
      <div class="issue-list">
`;
    report.brokenLinks.forEach(link => {
      emailContent += `        <div class="issue-item"><code>${link}</code></div>\n`;
    });
    emailContent += `
      </div>
    </div>
`;
  }

  // Success message if all tests passed
  if (report.failedTests === 0 && report.brokenImages.length === 0 && report.brokenLinks.length === 0) {
    emailContent += `
    <div class="success-message">
      <strong>🎉 All tests passed!</strong><br>
      Your Promo Factory app is healthy and all features are working correctly. No broken images or links detected.
    </div>
`;
  } else {
    // Recommendations
    emailContent += `
    <div class="section">
      <h3>💡 Recommendations</h3>
      <ul>
`;
    if (report.failedTests > 0) {
      emailContent += `        <li>Review failed test scenarios and fix root causes</li>\n`;
      emailContent += `        <li>Check screenshots in test-results/screenshots/ for visual debugging</li>\n`;
    }
    if (report.brokenImages.length > 0) {
      emailContent += `        <li>Fix broken image URLs or upload missing assets</li>\n`;
    }
    if (report.brokenLinks.length > 0) {
      emailContent += `        <li>Update or remove broken external links</li>\n`;
    }
    emailContent += `        <li>Run tests locally to verify fixes before next Monday</li>
      </ul>
    </div>
`;
  }

  emailContent += `
    <div class="footer">
      <p><strong>Promo Factory Ultimate</strong> - Automated Test Suite</p>
      <p>Next test run: Next Monday at 9:00 AM EST</p>
      <p style="margin-top: 15px; font-size: 11px; color: #999;">
        This is an automated email from your weekly test suite.<br>
        Test reports are also saved to: /home/ubuntu/promo-factory/test-results/reports/
      </p>
    </div>
  </div>
</body>
</html>
`;

  return emailContent;
}

/**
 * Sends test report email via Manus notification system
 */
export async function sendTestReportEmail(
  recipientEmail: string,
  report: TestReportSummary
): Promise<boolean> {
  try {
    const statusEmoji = report.passRate >= 95 ? '✅' : '❌';
    const title = `${statusEmoji} Promo Factory Test Report - ${report.passRate.toFixed(1)}% Pass Rate`;
    
    const content = formatTestReportEmail(report);
    
    // Send via Manus notification system
    const success = await notifyOwner({
      title,
      content,
    });
    
    if (success) {
      console.log(`✅ Test report email sent successfully to ${recipientEmail}`);
    } else {
      console.warn(`⚠️ Failed to send test report email to ${recipientEmail}`);
    }
    
    return success;
  } catch (error) {
    console.error('Error sending test report email:', error);
    return false;
  }
}

/**
 * Sends a simple text-based test report (fallback for plain text email clients)
 */
export function formatPlainTextReport(report: TestReportSummary): string {
  const statusEmoji = report.passRate >= 95 ? '✅' : '❌';
  const statusText = report.passRate >= 95 ? 'PASSED' : 'FAILED';
  
  let text = `
${statusEmoji} PROMO FACTORY ULTIMATE - WEEKLY TEST REPORT
${report.timestamp}

═══════════════════════════════════════════════════════════

TEST STATUS: ${statusText}
Pass Rate: ${report.passRate.toFixed(2)}% (Target: 95%+)

SUMMARY:
  • Total Tests: ${report.totalTests}
  • Passed: ${report.passedTests} ✅
  • Failed: ${report.failedTests} ❌

`;

  if (report.failedScenarios.length > 0) {
    text += `\n❌ FAILED TESTS (${report.failedScenarios.length}):\n`;
    report.failedScenarios.forEach((failure, i) => {
      text += `\n${i + 1}. ${failure.scenario} (${failure.role})\n`;
      text += `   Error: ${failure.error}\n`;
    });
  }

  if (report.brokenImages.length > 0) {
    text += `\n🖼️ BROKEN IMAGES (${report.brokenImages.length}):\n`;
    report.brokenImages.forEach((img, i) => {
      text += `${i + 1}. ${img}\n`;
    });
  }

  if (report.brokenLinks.length > 0) {
    text += `\n🔗 BROKEN LINKS (${report.brokenLinks.length}):\n`;
    report.brokenLinks.forEach((link, i) => {
      text += `${i + 1}. ${link}\n`;
    });
  }

  if (report.failedTests === 0 && report.brokenImages.length === 0 && report.brokenLinks.length === 0) {
    text += `\n🎉 ALL TESTS PASSED!\n`;
    text += `Your Promo Factory app is healthy and all features are working correctly.\n`;
  } else {
    text += `\n💡 RECOMMENDATIONS:\n`;
    if (report.failedTests > 0) {
      text += `  • Review failed test scenarios and fix root causes\n`;
      text += `  • Check screenshots in test-results/screenshots/\n`;
    }
    if (report.brokenImages.length > 0) {
      text += `  • Fix broken image URLs or upload missing assets\n`;
    }
    if (report.brokenLinks.length > 0) {
      text += `  • Update or remove broken external links\n`;
    }
    text += `  • Run tests locally to verify fixes\n`;
  }

  text += `\n═══════════════════════════════════════════════════════════\n`;
  text += `Next test run: Next Monday at 9:00 AM EST\n`;
  text += `Test reports saved to: /home/ubuntu/promo-factory/test-results/reports/\n`;

  return text;
}
