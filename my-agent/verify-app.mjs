import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5000';
const SCREENSHOT_DIR = 'E:/cursor/cursor-projects/uniquestaffingprofessionals/unique-staffing-prof/my-agent/screenshots';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const results = [];

function log(msg) {
  console.log('[' + new Date().toISOString().slice(11,19) + '] ' + msg);
}

function recordResult(step, passed, details = '') {
  const status = passed ? 'PASS' : 'FAIL';
  results.push({ step, status, details });
  log(status + ': ' + step + (details ? ' - ' + details : ''));
}

async function takeScreenshot(page, name) {
  const filepath = path.join(SCREENSHOT_DIR, 'verify-' + name + '.png');
  await page.screenshot({ path: filepath, fullPage: false });
  log('Screenshot saved: verify-' + name + '.png');
  return filepath;
}

async function runTests() {
  log('Starting Unique Staffing Professionals App Verification');
  log('============================================================');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  try {
    log('Step 1: Checking homepage headline...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await takeScreenshot(page, '01-homepage');
    
    const headline = await page.$eval('h1', el => el.textContent).catch(() => null);
    const hasHeadline = headline && headline.includes('Where Opportunity Starts!');
    recordResult('Homepage headline "Where Opportunity Starts!"', hasHeadline, headline || 'No h1 found');
    
    log('Step 2: Checking hero section...');
    const heroSection = await page.$('section, [class*="hero"], main > div:first-child').catch(() => null);
    const heroVisible = heroSection !== null;
    recordResult('Hero section present', heroVisible);
    
    log('Step 3: Checking services section...');
    const pageContent = await page.content();
    const hasServicesSection = pageContent.includes('Services') || pageContent.includes('services');
    recordResult('Services section present', hasServicesSection);
    await takeScreenshot(page, '02-homepage-sections');
    
    log('Step 4: Checking apply form with position checkboxes...');
    await page.goto(BASE_URL + '/apply', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('form', { timeout: 10000 }).catch(() => {});
    await takeScreenshot(page, '03-apply-page');
    
    const checkboxes = await page.$$('input[type="checkbox"]');
    const hasPositionCheckboxes = checkboxes.length > 0;
    recordResult('Apply form has position checkboxes', hasPositionCheckboxes, 'Found ' + checkboxes.length + ' checkboxes');
    
    log('Step 5: Checking admin login page with Demo Mode...');
    await page.goto(BASE_URL + '/admin/login', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('form', { timeout: 10000 }).catch(() => {});
    await takeScreenshot(page, '04-admin-login');
    
    const loginPageContent = await page.content();
    const hasDemoIndicator = loginPageContent.toLowerCase().includes('demo');
    recordResult('Demo Mode indicator present on login page', hasDemoIndicator);
    
    log('Step 6: Filling demo credentials and logging in...');
    
    const emailInput = await page.$('input[type="email"], input[name="email"]');
    if (emailInput) {
      await emailInput.click({ clickCount: 3 });
      await emailInput.type('demo@uniquestaffing.com');
    }
    
    const passwordInput = await page.$('input[type="password"], input[name="password"]');
    if (passwordInput) {
      await passwordInput.click({ clickCount: 3 });
      await passwordInput.type('demo123');
    }
    
    await takeScreenshot(page, '05-credentials-filled');
    
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await btn.evaluate(el => el.textContent);
      if (text && (text.includes('Login') || text.includes('Sign') || text.includes('Submit'))) {
        await btn.click();
        break;
      }
    }
    
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));
    
    await takeScreenshot(page, '06-after-login');
    
    const currentUrl = page.url();
    const loginSuccess = currentUrl.includes('dashboard') || currentUrl.includes('admin');
    recordResult('Login and redirect to dashboard', loginSuccess, 'URL: ' + currentUrl);
    
    log('Step 7: Verifying dashboard has applicant data...');
    await takeScreenshot(page, '07-dashboard');
    
    const dashboardContent = await page.content();
    const hasApplicantData = dashboardContent.includes('applicant') || 
                              dashboardContent.includes('Applicant') ||
                              dashboardContent.includes('Status') ||
                              dashboardContent.includes('Application');
    recordResult('Dashboard displays applicant data', hasApplicantData);
    
    const table = await page.$('table');
    const hasTable = table !== null;
    recordResult('Dashboard has data table', hasTable);
    
    await takeScreenshot(page, '08-dashboard-final');
    
  } catch (error) {
    log('ERROR: ' + error.message);
    await takeScreenshot(page, 'error');
  } finally {
    await browser.close();
  }
  
  log('');
  log('============================================================');
  log('VERIFICATION SUMMARY');
  log('============================================================');
  
  let passed = 0;
  let failed = 0;
  
  for (const result of results) {
    console.log(result.status + ': ' + result.step);
    if (result.details) console.log('       ' + result.details);
    if (result.status === 'PASS') passed++;
    else failed++;
  }
  
  log('');
  log('Total: ' + passed + ' passed, ' + failed + ' failed out of ' + results.length + ' checks');
  log('============================================================');
  
  return { passed, failed, total: results.length };
}

runTests().catch(console.error);

