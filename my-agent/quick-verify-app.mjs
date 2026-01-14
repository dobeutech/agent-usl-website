import puppeteer from 'puppeteer';

async function verifyApp() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  console.log('=== Quick App Verification ===\n');

  // Test 1: Homepage
  try {
    await page.goto('http://localhost:5000', { waitUntil: 'networkidle0', timeout: 30000 });
    const headline = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return h1 ? h1.textContent : null;
    });
    console.log('1. Homepage:', headline?.includes('Opportunity') ? '✅ PASS' : '❌ FAIL', '-', headline);
  } catch (e) {
    console.log('1. Homepage: ❌ FAIL -', e.message);
  }

  // Test 2: Services section
  try {
    const services = await page.evaluate(() => {
      const section = document.querySelector('#services');
      return section ? 'found' : 'not found';
    });
    console.log('2. Services section:', services === 'found' ? '✅ PASS' : '❌ FAIL');
  } catch (e) {
    console.log('2. Services section: ❌ FAIL -', e.message);
  }

  // Test 3: Apply form
  try {
    const checkboxes = await page.$$('input[type="checkbox"]');
    console.log('3. Apply form:', checkboxes.length > 10 ? '✅ PASS' : '❌ FAIL', '- Found', checkboxes.length, 'checkboxes');
  } catch (e) {
    console.log('3. Apply form: ❌ FAIL -', e.message);
  }

  // Test 4: Admin login page
  try {
    await page.goto('http://localhost:5000/admin/login', { waitUntil: 'networkidle0', timeout: 30000 });
    const loginForm = await page.$('input[type="email"]');
    console.log('4. Admin login:', loginForm ? '✅ PASS' : '❌ FAIL');
  } catch (e) {
    console.log('4. Admin login: ❌ FAIL -', e.message);
  }

  // Test 5: Language selector
  try {
    await page.goto('http://localhost:5000', { waitUntil: 'networkidle0', timeout: 30000 });
    const langSelector = await page.$('select');
    console.log('5. Language selector:', langSelector ? '✅ PASS' : '❌ FAIL');
  } catch (e) {
    console.log('5. Language selector: ❌ FAIL -', e.message);
  }

  // Test 6: Cookie consent
  try {
    const cookieBanner = await page.evaluate(() => {
      // Look for cookie consent elements
      const banner = document.body.innerText.toLowerCase();
      return banner.includes('cookie') ? 'found' : 'not found';
    });
    console.log('6. Cookie consent:', cookieBanner === 'found' ? '✅ PASS' : '⚠️ CHECK MANUALLY');
  } catch (e) {
    console.log('6. Cookie consent: ❌ FAIL -', e.message);
  }

  await browser.close();
  console.log('\n=== Verification Complete ===');
}

verifyApp().catch(console.error);
