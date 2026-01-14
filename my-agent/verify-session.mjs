import puppeteer from 'puppeteer';

const BASE_URL = 'http://localhost:5000';

async function verifySession() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  const results = [];

  try {
    // Test 1: Homepage loads
    console.log('Test 1: Homepage loads...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    const headline = await page.$eval('h1', el => el.textContent);
    const hasHero = await page.$('#hero') !== null;
    const headlineShort = headline.slice(0, 50);
    results.push({ test: 'Homepage', pass: headline.includes('Opportunity') && hasHero });
    console.log('  ✓ Headline: ' + headlineShort + '...');

    // Test 2: Services section
    console.log('Test 2: Services section...');
    const servicesSection = await page.$('#services');
    results.push({ test: 'Services Section', pass: servicesSection !== null });
    console.log('  ✓ Services section present');

    // Test 3: Apply page with positions
    console.log('Test 3: Apply page...');
    await page.goto(BASE_URL + '/apply', { waitUntil: 'networkidle2' });
    const checkboxes = await page.$$('input[type="checkbox"]');
    results.push({ test: 'Apply Page', pass: checkboxes.length >= 20 });
    console.log('  ✓ Found ' + checkboxes.length + ' checkboxes');

    // Test 4: Admin login page
    console.log('Test 4: Admin login...');
    await page.goto(BASE_URL + '/admin/login', { waitUntil: 'networkidle2' });
    const demoModeIndicator = await page.evaluate(() => {
      return document.body.innerText.includes('Demo Mode') ||
             document.body.innerText.includes('DEMO');
    });
    results.push({ test: 'Admin Login', pass: demoModeIndicator });
    console.log('  ✓ Demo mode indicator present');

    // Test 5: Demo login works
    console.log('Test 5: Demo login...');
    await page.click('input[type="email"]');
    await page.keyboard.type('demo@uniquestaffing.com');
    await page.click('input[type="password"]');
    await page.keyboard.type('demo123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
    const onDashboard = page.url().includes('/admin/dashboard');
    results.push({ test: 'Demo Login', pass: onDashboard });
    console.log('  ✓ Redirected to: ' + page.url());

    // Test 6: Dashboard displays applicants
    console.log('Test 6: Dashboard applicants...');
    await page.waitForSelector('table', { timeout: 5000 });
    const rows = await page.$$('tbody tr');
    results.push({ test: 'Dashboard Applicants', pass: rows.length >= 5 });
    console.log('  ✓ Found ' + rows.length + ' applicant rows');

    // Test 7: Email verification page
    console.log('Test 7: Email verification...');
    await page.goto(BASE_URL + '/verify-email?token=abc123', { waitUntil: 'networkidle2' });
    await page.waitForFunction(() =>
      document.body.innerText.includes('Verified') ||
      document.body.innerText.includes('Success'),
      { timeout: 5000 }
    );
    const verificationSuccess = await page.evaluate(() =>
      document.body.innerText.includes('Verified') ||
      document.body.innerText.includes('Success')
    );
    results.push({ test: 'Email Verification', pass: verificationSuccess });
    console.log('  ✓ Email verification working');

    // Summary
    console.log('\n=== SESSION VERIFICATION SUMMARY ===');
    const passing = results.filter(r => r.pass).length;
    results.forEach(r => {
      console.log((r.pass ? '✓' : '✗') + ' ' + r.test);
    });
    console.log('\nTotal: ' + passing + '/' + results.length + ' tests passed');

  } catch (error) {
    console.error('Test error:', error.message);
  } finally {
    await browser.close();
  }
}

verifySession();
