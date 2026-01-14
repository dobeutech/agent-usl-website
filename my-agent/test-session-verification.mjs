import puppeteer from 'puppeteer';

const BASE_URL = 'http://localhost:5000';

async function testSessionVerification() {
  console.log('Starting session verification test...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  let passed = 0;
  let failed = 0;

  try {
    // Test 1: Homepage loads
    console.log('Test 1: Homepage loads...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('h1', { timeout: 10000 });
    const headline = await page.$eval('h1', el => el.textContent);
    if (headline.includes('Where Opportunity Starts')) {
      console.log('  ✓ Homepage loads with correct headline');
      passed++;
    } else {
      console.log(`  ✗ Homepage headline not as expected: ${headline}`);
      failed++;
    }

    // Test 2: Hero section present
    console.log('Test 2: Hero section present...');
    const heroSection = await page.$('#hero');
    if (heroSection) {
      console.log('  ✓ Hero section present');
      passed++;
    } else {
      console.log('  ✗ Hero section missing');
      failed++;
    }

    // Test 3: Services section present
    console.log('Test 3: Services section present...');
    const servicesSection = await page.$('#services');
    if (servicesSection) {
      console.log('  ✓ Services section present');
      passed++;
    } else {
      console.log('  ✗ Services section missing');
      failed++;
    }

    // Test 4: Application form with position checkboxes
    console.log('Test 4: Application form with position checkboxes...');
    await page.goto(`${BASE_URL}/apply`, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('form', { timeout: 10000 });
    const checkboxes = await page.$$('input[type="checkbox"]');
    const checkboxCount = checkboxes.length;
    if (checkboxCount >= 20) {
      console.log(`  ✓ Apply form has ${checkboxCount} checkboxes`);
      passed++;
    } else {
      console.log(`  ✗ Apply form only has ${checkboxCount} checkboxes (expected 20+)`);
      failed++;
    }

    // Test 5: Admin login page
    console.log('Test 5: Admin login page...');
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    const pageContent = await page.content();
    const hasDemoMode = pageContent.includes('Demo Mode') || pageContent.includes('demo');
    if (hasDemoMode) {
      console.log('  ✓ Admin login page loaded with demo indicator');
      passed++;
    } else {
      console.log('  ✓ Admin login page loaded');
      passed++;
    }

    // Test 6: Demo login functionality
    console.log('Test 6: Demo login functionality...');
    // Check for "Fill Demo Credentials" button
    const fillDemoBtn = await page.$('button');
    const buttons = await page.$$eval('button', btns => btns.map(b => b.textContent));
    const fillDemoBtnExists = buttons.some(text => text.toLowerCase().includes('demo'));

    if (fillDemoBtnExists) {
      // Click the demo fill button
      const allButtons = await page.$$('button');
      for (const btn of allButtons) {
        const text = await btn.evaluate(el => el.textContent);
        if (text.toLowerCase().includes('demo')) {
          await btn.click();
          await new Promise(r => setTimeout(r, 500));
          break;
        }
      }
    } else {
      // Manually fill credentials
      await page.click('input[type="email"]');
      await page.keyboard.type('demo@uniquestaffing.com');
      await page.click('input[type="password"]');
      await page.keyboard.type('demo123');
    }

    // Submit login form
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await new Promise(r => setTimeout(r, 2000));
    }

    // Check if redirected to dashboard
    const currentUrl = page.url();
    if (currentUrl.includes('/admin/dashboard')) {
      console.log('  ✓ Demo login redirects to dashboard');
      passed++;
    } else {
      console.log(`  ✗ Demo login did not redirect to dashboard (URL: ${currentUrl})`);
      failed++;
    }

    // Test 7: Dashboard displays applicants
    console.log('Test 7: Dashboard displays applicants...');
    await page.waitForSelector('table', { timeout: 10000 }).catch(() => null);
    const tableRows = await page.$$('table tbody tr');
    const rowCount = tableRows.length;
    if (rowCount > 0) {
      console.log(`  ✓ Dashboard displays ${rowCount} demo applicants`);
      passed++;
    } else {
      // Check for cards or other display format
      const applicantCards = await page.$$('[data-testid="applicant-card"]');
      if (applicantCards.length > 0) {
        console.log(`  ✓ Dashboard displays ${applicantCards.length} demo applicant cards`);
        passed++;
      } else {
        console.log('  ✗ Dashboard shows no applicants');
        failed++;
      }
    }

    console.log('\n========================================');
    console.log(`Session Verification Results:`);
    console.log(`  Passed: ${passed}/${passed + failed}`);
    console.log(`  Failed: ${failed}/${passed + failed}`);
    console.log('========================================\n');

  } catch (error) {
    console.error('Test error:', error.message);
    failed++;
  } finally {
    await browser.close();
  }

  return { passed, failed };
}

testSessionVerification().then(results => {
  console.log('Session verification complete.');
  process.exit(results.failed > 0 ? 1 : 0);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
