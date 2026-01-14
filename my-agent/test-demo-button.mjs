import puppeteer from 'puppeteer';

const BASE_URL = 'http://localhost:5000';
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testDemoMode() {
  console.log('Starting demo test with Fill Demo Credentials button...\n');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = { passed: [], failed: [] };

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    // Enable console logging
    page.on('console', msg => {
      const text = msg.text();
      if (!text.includes('vite') && !text.includes('React DevTools') && !text.includes('Translation key')) {
        console.log('  [Browser]:', text);
      }
    });

    // Test: Navigate to admin login
    console.log('Step 1: Navigate to admin login...');
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle0', timeout: 30000 });
    await wait(500);

    // Click the "Fill Demo Credentials" button (which uses React state)
    console.log('Step 2: Click Fill Demo Credentials button...');
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        if (btn.textContent.includes('Fill Demo')) {
          btn.click();
          return true;
        }
      }
      return false;
    });
    await wait(500);

    // Verify the values are filled
    const emailVal = await page.$eval('#email', el => el.value);
    const passVal = await page.$eval('#password', el => el.value);
    console.log('  Email value:', emailVal);
    console.log('  Password value:', passVal);

    await page.screenshot({ path: 'screenshots/demo-button-filled.png' });

    if (emailVal === 'demo@uniquestaffing.com' && passVal === 'demo123') {
      console.log('  PASS: Credentials filled via React state\n');
      results.passed.push('Fill Credentials Button');
    } else {
      console.log('  FAIL: Credentials not filled correctly\n');
      results.failed.push('Fill Credentials Button');
    }

    // Click Sign In button
    console.log('Step 3: Submit login form...');
    const [response] = await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(e => {
        console.log('  Navigation wait timed out, checking current page...');
        return null;
      }),
      page.click('button[type="submit"]')
    ]);

    await wait(2000);
    await page.screenshot({ path: 'screenshots/demo-after-login.png' });

    const url = page.url();
    console.log('  Current URL:', url);

    if (url.includes('/admin/dashboard')) {
      console.log('  PASS: Redirected to dashboard!\n');
      results.passed.push('Login Success');
    } else {
      console.log('  FAIL: Still on login page\n');
      results.failed.push('Login Success');

      // Check for error messages
      const pageContent = await page.evaluate(() => document.body.innerText);
      if (pageContent.includes('Login failed') || pageContent.includes('error')) {
        console.log('  Error message found on page\n');
      }
    }

    // Step 4: Check dashboard
    if (url.includes('/admin/dashboard')) {
      console.log('Step 4: Verify dashboard content...');
      await wait(1000);
      await page.screenshot({ path: 'screenshots/demo-dashboard.png' });

      const dashboardContent = await page.evaluate(() => document.body.innerText);

      // Check for applicant data
      const hasApplicants = dashboardContent.includes('Maria Garcia') ||
                           dashboardContent.includes('James Wilson') ||
                           dashboardContent.includes('Aisha Johnson');

      const hasStats = dashboardContent.includes('Total') &&
                      (dashboardContent.includes('New') || dashboardContent.includes('Reviewing'));

      const hasExport = dashboardContent.includes('Export');

      console.log('  Has applicants:', hasApplicants);
      console.log('  Has stats:', hasStats);
      console.log('  Has export:', hasExport);

      if (hasApplicants) {
        results.passed.push('Demo Applicants Displayed');
      } else {
        results.failed.push('Demo Applicants Displayed');
      }

      if (hasStats) {
        results.passed.push('Statistics Cards');
      } else {
        results.failed.push('Statistics Cards');
      }

      if (hasExport) {
        results.passed.push('Export Button');
      } else {
        results.failed.push('Export Button');
      }
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
