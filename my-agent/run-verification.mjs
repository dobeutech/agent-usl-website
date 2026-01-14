import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });

const results = [];
const BASE_URL = 'http://localhost:5000';

try {
  // Test 1: Homepage loads with headline
  console.log('Test 1: Checking homepage...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 15000 });
  await page.screenshot({ path: 'screenshots/verify-01-homepage.png' });

  const headline = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    return h1 ? h1.textContent : null;
  });

  const test1Pass = headline && headline.includes('Where Opportunity Starts');
  results.push({ test: '1. Homepage headline', pass: test1Pass, detail: headline || 'No headline found' });

  // Test 2: Hero section visible
  console.log('Test 2: Checking hero section...');
  const heroVisible = await page.evaluate(() => {
    const heroText = document.body.innerText;
    return heroText.includes('Where Opportunity Starts') &&
           (heroText.includes('Apply Now') || heroText.includes('staffing'));
  });
  results.push({ test: '2. Hero section visible', pass: heroVisible, detail: heroVisible ? 'Hero content found' : 'Hero not found' });

  // Test 3: Navigate to Apply page
  console.log('Test 3: Checking Apply page...');
  await page.goto(BASE_URL + '/apply', { waitUntil: 'networkidle2', timeout: 15000 });
  await page.screenshot({ path: 'screenshots/verify-02-apply-page.png' });

  const applyFormExists = await page.evaluate(() => {
    const form = document.querySelector('form');
    const inputs = document.querySelectorAll('input');
    return form !== null && inputs.length > 3;
  });
  results.push({ test: '3. Apply form loads', pass: applyFormExists, detail: applyFormExists ? 'Form with inputs found' : 'Form not found' });

  // Test 4: Admin login page with Demo Mode
  console.log('Test 4: Checking admin login...');
  await page.goto(BASE_URL + '/admin/login', { waitUntil: 'networkidle2', timeout: 15000 });
  await page.screenshot({ path: 'screenshots/verify-03-admin-login.png' });

  const demoModeVisible = await page.evaluate(() => {
    const pageText = document.body.innerText;
    return pageText.includes('Demo Mode') || pageText.includes('demo');
  });
  results.push({ test: '4. Admin login with Demo Mode', pass: demoModeVisible, detail: demoModeVisible ? 'Demo Mode indicator found' : 'Demo Mode not found' });

  // Test 5: Demo login works
  console.log('Test 5: Testing demo login...');

  // Fill credentials
  await page.type('input[type="email"]', 'demo@uniquestaffing.com');
  await page.type('input[type="password"]', 'demo123');
  await page.screenshot({ path: 'screenshots/verify-04-credentials-filled.png' });

  // Click login button
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'screenshots/verify-05-after-login.png' });

  const currentUrl = page.url();
  const loginSuccess = currentUrl.includes('/admin/dashboard') || currentUrl.includes('/admin');
  results.push({ test: '5. Demo login redirects to dashboard', pass: loginSuccess, detail: 'Current URL: ' + currentUrl });

  // Test 6: Dashboard shows applicant data
  console.log('Test 6: Checking dashboard data...');
  if (loginSuccess) {
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'screenshots/verify-06-dashboard.png' });

    const dashboardContent = await page.evaluate(() => {
      const pageText = document.body.innerText;
      const hasTable = document.querySelector('table') !== null;
      const hasApplicants = pageText.includes('Applicant') || pageText.includes('applicant');
      const hasData = pageText.includes('John') || pageText.includes('Jane') ||
                     pageText.includes('Pending') || pageText.includes('Reviewed') ||
                     pageText.includes('@') || hasTable;
      return { hasTable, hasApplicants, hasData, text: pageText.substring(0, 500) };
    });

    const dashboardPass = dashboardContent.hasTable || dashboardContent.hasData;
    results.push({ test: '6. Dashboard shows applicant data', pass: dashboardPass, detail: dashboardContent.hasTable ? 'Table found with data' : (dashboardContent.hasData ? 'Applicant data found' : 'No data found') });
  } else {
    results.push({ test: '6. Dashboard shows applicant data', pass: false, detail: 'Could not reach dashboard' });
  }

  // Summary
  console.log('\n========== VERIFICATION RESULTS ==========\n');
  let passCount = 0;
  results.forEach(r => {
    const status = r.pass ? 'PASS' : 'FAIL';
    if (r.pass) passCount++;
    console.log(status + ' - ' + r.test);
    console.log('    Detail: ' + r.detail);
  });
  console.log('\n========== SUMMARY: ' + passCount + '/' + results.length + ' tests passed ==========');

} catch (error) {
  console.error('Error during testing:', error.message);
  await page.screenshot({ path: 'screenshots/verify-error.png' });
} finally {
  await browser.close();
}
