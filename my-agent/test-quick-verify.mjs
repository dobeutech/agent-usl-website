import puppeteer from 'puppeteer';

console.log('=== Quick Verification Test ===\n');

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720 });

const results = [];

// Test 1: Homepage
console.log('1. Testing Homepage...');
await page.goto('http://localhost:5000/', { waitUntil: 'networkidle0', timeout: 30000 });
const heroText = await page.evaluate(() => {
  const h1 = document.querySelector('#hero h1');
  return h1 ? h1.textContent : null;
});
results.push({ test: 'Homepage', pass: heroText?.includes('Opportunity'), detail: heroText });

// Accept cookies
await page.evaluate(() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Accept All'));
  if (btn) btn.click();
});
await new Promise(r => setTimeout(r, 500));

// Test 2: Services Section
console.log('2. Testing Services Section...');
const servicesSection = await page.$('#services');
results.push({ test: 'Services Section', pass: !!servicesSection, detail: servicesSection ? 'Found' : 'Not found' });

// Test 3: Apply Form
console.log('3. Testing Apply Form...');
const applyForm = await page.evaluate(() => {
  const applySection = document.getElementById('apply');
  if (!applySection) return null;
  const form = applySection.querySelector('form');
  const checkboxes = form ? form.querySelectorAll('input[type="checkbox"]').length : 0;
  const fileInput = form ? form.querySelector('input[type="file"]') : null;
  return { hasForm: !!form, checkboxes, hasFileInput: !!fileInput };
});
results.push({ test: 'Apply Form', pass: applyForm?.hasForm && applyForm?.checkboxes > 0, detail: JSON.stringify(applyForm) });

// Test 4: Admin Login
console.log('4. Testing Admin Login...');
await page.goto('http://localhost:5000/admin/login', { waitUntil: 'networkidle0', timeout: 30000 });
const loginForm = await page.evaluate(() => {
  const form = document.querySelector('form');
  const emailInput = document.querySelector('input[type="email"]');
  const passwordInput = document.querySelector('input[type="password"]');
  const demoMode = document.body.textContent.includes('Demo Mode');
  return { hasForm: !!form, hasEmail: !!emailInput, hasPassword: !!passwordInput, demoMode };
});
results.push({ test: 'Admin Login', pass: loginForm?.hasForm && loginForm?.hasEmail, detail: JSON.stringify(loginForm) });

// Test 5: Demo Login
console.log('5. Testing Demo Login...');
const demoBtn = await page.evaluate(() => {
  const btns = Array.from(document.querySelectorAll('button'));
  const demoBtn = btns.find(b => b.textContent.includes('Fill Demo'));
  if (demoBtn) {
    demoBtn.click();
    return true;
  }
  return false;
});

if (demoBtn) {
  await new Promise(r => setTimeout(r, 500));
  const submitBtn = await page.evaluate(() => {
    const btn = document.querySelector('button[type="submit"]');
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });

  if (submitBtn) {
    await new Promise(r => setTimeout(r, 2000));
    const dashboardLoaded = await page.evaluate(() => {
      return window.location.pathname === '/admin/dashboard' ||
             document.body.textContent.includes('Dashboard') ||
             document.body.textContent.includes('Applicant');
    });
    results.push({ test: 'Demo Login', pass: dashboardLoaded, detail: `Dashboard loaded: ${dashboardLoaded}` });
  } else {
    results.push({ test: 'Demo Login', pass: false, detail: 'Submit button not found' });
  }
} else {
  results.push({ test: 'Demo Login', pass: false, detail: 'Demo button not found' });
}

// Test 6: Language Selector
console.log('6. Testing Language Selector...');
await page.goto('http://localhost:5000/', { waitUntil: 'networkidle0', timeout: 30000 });
const langSelector = await page.evaluate(() => {
  const select = document.querySelector('select') ||
                 document.querySelector('[data-language-selector]') ||
                 document.querySelector('button[aria-label*="language" i]');
  return !!select;
});
results.push({ test: 'Language Selector', pass: langSelector, detail: langSelector ? 'Found' : 'Not found' });

// Test 7: Cookie Consent
console.log('7. Testing Cookie Consent...');
// Clear cookies to make banner appear again
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle0' });
const cookieBanner = await page.evaluate(() => {
  const banner = document.body.textContent.includes('We Value Your Privacy') ||
                 document.body.textContent.includes('cookie');
  return banner;
});
results.push({ test: 'Cookie Consent', pass: cookieBanner, detail: cookieBanner ? 'Banner found' : 'Banner not found' });

await browser.close();

// Print results
console.log('\n=== Results ===');
let passed = 0;
let failed = 0;
results.forEach(r => {
  const status = r.pass ? '✅' : '❌';
  console.log(`${status} ${r.test}: ${r.detail}`);
  if (r.pass) passed++;
  else failed++;
});

console.log(`\n=== Summary: ${passed}/${results.length} tests passed ===`);
