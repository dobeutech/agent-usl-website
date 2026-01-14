import puppeteer from 'puppeteer';

const BASE_URL = 'http://localhost:5000';
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testDemoMode() {
  console.log('Starting simple demo mode tests...\n');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = { passed: [], failed: [] };

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    // Enable console logging from the page
    page.on('console', msg => console.log('  [Browser]:', msg.text()));
    page.on('pageerror', err => console.log('  [Page Error]:', err.message));

    // Test 1: Go to admin login
    console.log('Test 1: Navigate to admin login...');
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.screenshot({ path: 'screenshots/01-login-page.png' });

    // Check for demo mode
    const hasDemoMode = await page.evaluate(() => document.body.innerText.includes('Demo Mode'));
    if (hasDemoMode) {
      console.log('  PASS: Demo mode indicator visible\n');
      results.passed.push('Demo Mode Indicator');
    } else {
      console.log('  FAIL: Demo mode indicator not visible\n');
      results.failed.push('Demo Mode Indicator');
    }

    // Test 2: Login with demo credentials
    console.log('Test 2: Login with demo credentials...');

    // Clear and fill email
    await page.click('#email', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('#email', 'demo@uniquestaffing.com', { delay: 50 });

    // Clear and fill password
    await page.click('#password', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('#password', 'demo123', { delay: 50 });

    await page.screenshot({ path: 'screenshots/02-credentials-filled.png' });

    // Submit and wait for navigation
    console.log('  Clicking submit button...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(() => null),
      page.click('button[type="submit"]')
    ]);

    await wait(2000);
    await page.screenshot({ path: 'screenshots/03-after-submit.png' });

    const url = page.url();
    console.log('  Current URL:', url);

    if (url.includes('/admin/dashboard')) {
      console.log('  PASS: Redirected to dashboard\n');
      results.passed.push('Login Redirect');
    } else {
      console.log('  FAIL: Not redirected to dashboard\n');
      results.failed.push('Login Redirect');

      // Try manually navigating to dashboard
      console.log('  Attempting manual navigation to dashboard...');
      await page.goto(`${BASE_URL}/admin/dashboard`, { waitUntil: 'networkidle0', timeout: 30000 });
      await wait(1000);
    }

    // Test 3: Check dashboard content
    console.log('Test 3: Check dashboard content...');
    await page.screenshot({ path: 'screenshots/04-dashboard.png' });

    const pageContent = await page.evaluate(() => document.body.innerText);
    console.log('  Page title area:', pageContent.substring(0, 300));

    // Check if we're on the dashboard (not redirected back to login)
    if (pageContent.includes('Admin Dashboard') || pageContent.includes('Manage applicants')) {
      console.log('  PASS: Dashboard loaded\n');
      results.passed.push('Dashboard Loaded');

      // Check for demo applicants
      const hasApplicants = pageContent.includes('Maria Garcia') ||
                           pageContent.includes('James Wilson') ||
                           pageContent.includes('Total');

      if (hasApplicants) {
        console.log('  PASS: Demo applicants/stats visible\n');
        results.passed.push('Demo Data Visible');
      } else {
        console.log('  Content does not include expected names\n');
        results.failed.push('Demo Data Visible');
      }
    } else if (pageContent.includes('Sign in') || pageContent.includes('Admin Portal')) {
      console.log('  FAIL: Still on login page (authentication may have failed)\n');
      results.failed.push('Dashboard Loaded');
    } else {
      console.log('  FAIL: Unknown page state\n');
      results.failed.push('Dashboard Loaded');
    }

    // Test 4: Check for export button
    console.log('Test 4: Check for Export CSV button...');
    const hasExport = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Export') || text.includes('CSV');
    });

    if (hasExport) {
      console.log('  PASS: Export functionality exists\n');
      results.passed.push('Export Button');
    } else {
      console.log('  FAIL: Export button not found\n');
      results.failed.push('Export Button');
    }

  } catch (error) {
    console.error('Test error:', error.message);
    results.failed.push('Test execution: ' + error.message);
  } finally {
    await browser.close();
  }

  // Print summary
  console.log('\n========================================');
  console.log('TEST RESULTS SUMMARY');
  console.log('========================================');
  console.log(`Passed: ${results.passed.length}`);
  console.log(`Failed: ${results.failed.length}`);
  console.log('\nPassed tests:');
  results.passed.forEach(t => console.log(`  ✓ ${t}`));
  if (results.failed.length > 0) {
    console.log('\nFailed tests:');
    results.failed.forEach(t => console.log(`  ✗ ${t}`));
  }

  return results;
}

testDemoMode().catch(console.error);
