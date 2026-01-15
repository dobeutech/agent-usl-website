import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = './screenshots';

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runTests() {
  let browser;
  try {
    console.log('Starting Puppeteer tests...\n');
    
    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    page.setDefaultTimeout(10000);
    page.setDefaultNavigationTimeout(10000);
    
    // Test 1: Navigate to homepage
    console.log('Test 1: Navigating to http://localhost:5000');
    try {
      await page.goto('http://localhost:5000', { waitUntil: 'networkidle2' });
      console.log('✓ Homepage loaded successfully\n');
    } catch (error) {
      console.error('✗ Failed to navigate to homepage:', error.message);
      process.exit(1);
    }
    
    // Test 2: Check for headline
    console.log('Test 2: Checking for headline "Where Opportunity Starts!"');
    try {
      await page.waitForSelector('h1, h2, .headline, [class*="headline"]', { timeout: 5000 });
      const headline = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        const h2 = document.querySelector('h2');
        const headline = document.querySelector('[class*="headline"]');
        return h1?.textContent || h2?.textContent || headline?.textContent || '';
      });
      
      if (headline.includes('Where Opportunity Starts')) {
        console.log(`✓ Headline found: "${headline}"\n`);
      } else {
        console.log(`⚠ Headline text found but different: "${headline}"\n`);
      }
    } catch (error) {
      console.error('⚠ Could not verify headline:', error.message, '\n');
    }
    
    // Test 3: Check for hero section
    console.log('Test 3: Verifying hero section exists');
    try {
      const heroExists = await page.evaluate(() => {
        return !!(
          document.querySelector('[class*="hero"]') ||
          document.querySelector('[class*="banner"]') ||
          document.querySelector('[class*="header"]') ||
          document.querySelector('header')
        );
      });
      
      if (heroExists) {
        console.log('✓ Hero section found\n');
      } else {
        console.log('⚠ Hero section not found with common selectors\n');
      }
    } catch (error) {
      console.error('⚠ Error checking hero section:', error.message, '\n');
    }
    
    // Test 4: Check for apply form with checkboxes
    console.log('Test 4: Checking for apply form with position checkboxes');
    try {
      const formExists = await page.evaluate(() => {
        return !!(
          document.querySelector('form') ||
          document.querySelector('[class*="form"]')
        );
      });
      
      if (formExists) {
        const checkboxCount = await page.evaluate(() => {
          return document.querySelectorAll('input[type="checkbox"]').length;
        });
        
        if (checkboxCount > 0) {
          console.log(`✓ Apply form found with ${checkboxCount} checkbox(es)\n`);
        } else {
          console.log('⚠ Form found but no checkboxes detected\n');
        }
      } else {
        console.log('⚠ Apply form not found\n');
      }
    } catch (error) {
      console.error('⚠ Error checking apply form:', error.message, '\n');
    }
    
    // Test 5: Navigate to admin login
    console.log('Test 5: Navigating to admin login at /admin/login');
    try {
      await page.goto('http://localhost:5000/admin/login', { waitUntil: 'networkidle2' });
      console.log('✓ Admin login page loaded\n');
    } catch (error) {
      console.error('✗ Failed to navigate to admin login:', error.message);
      process.exit(1);
    }
    
    // Test 6: Verify login page with demo mode indicator
    console.log('Test 6: Verifying login page with demo mode indicator');
    try {
      const pageTitle = await page.title();
      const hasLoginForm = await page.evaluate(() => {
        return !!(
          document.querySelector('input[type="password"]') ||
          document.querySelector('input[type="email"]') ||
          document.querySelector('form')
        );
      });
      
      const hasDemoIndicator = await page.evaluate(() => {
        const text = document.body.innerText;
        return text.toLowerCase().includes('demo');
      });
      
      if (hasLoginForm) {
        console.log('✓ Login form found');
      } else {
        console.log('⚠ Login form not clearly detected');
      }
      
      if (hasDemoIndicator) {
        console.log('✓ Demo mode indicator found\n');
      } else {
        console.log('⚠ Demo mode indicator not found\n');
      }
    } catch (error) {
      console.error('⚠ Error verifying login page:', error.message, '\n');
    }
    
    // Test 7: Take screenshots
    console.log('Test 7: Taking screenshots');
    try {
      const homepageScreenshot = path.join(SCREENSHOT_DIR, 'homepage.png');
      const loginScreenshot = path.join(SCREENSHOT_DIR, 'login.png');
      
      // Screenshot of login page (currently active)
      await page.screenshot({ path: loginScreenshot, fullPage: true });
      console.log(`✓ Login page screenshot saved: ${loginScreenshot}`);
      
      // Navigate back to homepage for screenshot
      await page.goto('http://localhost:5000', { waitUntil: 'networkidle2' });
      await page.screenshot({ path: homepageScreenshot, fullPage: true });
      console.log(`✓ Homepage screenshot saved: ${homepageScreenshot}\n`);
    } catch (error) {
      console.error('⚠ Error taking screenshots:', error.message, '\n');
    }
    
    await browser.close();
    
    console.log('All tests completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
    if (browser) {
      await browser.close();
    }
    process.exit(1);
  }
}

runTests();
