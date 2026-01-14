/**
 * Browser-based test for Supabase integration features
 * Tests feat-024, feat-025, feat-026 via actual UI interactions
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'http://localhost:5000';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function takeScreenshot(page, name) {
  const filepath = path.join(SCREENSHOT_DIR, `${name}.png`);
  await page.screenshot({ path: filepath, fullPage: false });
  console.log(`   Screenshot saved: ${filepath}`);
}

async function testFeat026_SupabaseAuth(page) {
  console.log('\n=== Testing feat-026: Supabase Auth ===');

  try {
    // Navigate to admin login
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    // Check if demo mode indicator is shown
    const demoMode = await page.evaluate(() => {
      return document.body.innerText.includes('Demo Mode') ||
             document.body.innerText.includes('demo');
    });
    console.log(`   Demo mode active: ${demoMode}`);

    // Try logging in with invalid credentials to test auth system
    await page.click('input[type="email"]');
    await page.keyboard.type('invalid@test.com');

    await page.click('input[type="password"]');
    await page.keyboard.type('wrongpassword');

    // Find and click login button
    const loginButton = await page.$('button[type="submit"]');
    if (loginButton) {
      await loginButton.click();
      await page.waitForTimeout(2000);
    }

    // Check for error message (indicates auth system is responding)
    const hasError = await page.evaluate(() => {
      const text = document.body.innerText.toLowerCase();
      return text.includes('invalid') || text.includes('error') ||
             text.includes('incorrect') || text.includes('failed');
    });

    await takeScreenshot(page, 'feat-026-auth-error');

    if (hasError) {
      console.log('   ✅ Auth system responds to invalid credentials');

      // Now test with demo credentials
      if (demoMode) {
        // Clear fields
        await page.evaluate(() => {
          document.querySelector('input[type="email"]').value = '';
          document.querySelector('input[type="password"]').value = '';
        });

        await page.click('input[type="email"]');
        await page.keyboard.type('demo@uniquestaffing.com');

        await page.click('input[type="password"]');
        await page.keyboard.type('demo123');

        const loginBtn = await page.$('button[type="submit"]');
        if (loginBtn) {
          await loginBtn.click();
          await page.waitForTimeout(3000);
        }

        // Check if redirected to dashboard
        const currentUrl = page.url();
        if (currentUrl.includes('/admin/dashboard')) {
          console.log('   ✅ Demo login successful, redirected to dashboard');
          await takeScreenshot(page, 'feat-026-demo-login-success');
          return { passed: true, mode: 'demo' };
        }
      }

      return { passed: true, mode: demoMode ? 'demo' : 'live', note: 'Auth responds correctly' };
    }

    return { passed: false, note: 'Auth system did not respond as expected' };
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { passed: false, note: error.message };
  }
}

async function testFeat024_DatabaseStorage(page) {
  console.log('\n=== Testing feat-024: Database Storage ===');

  try {
    // Navigate to application form
    await page.goto(`${BASE_URL}/apply`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('form', { timeout: 10000 });

    // Generate unique test data
    const timestamp = Date.now();
    const testData = {
      name: `Test Applicant ${timestamp}`,
      email: `test${timestamp}@example.com`,
      phone: `555-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    };

    // Fill in the application form
    console.log('   Filling application form...');

    // Find and fill name field
    const nameInput = await page.$('input[name="full_name"], input[name="fullName"], input[placeholder*="name" i]');
    if (nameInput) {
      await nameInput.click();
      await page.keyboard.type(testData.name);
    }

    // Find and fill email field
    const emailInput = await page.$('input[name="email"], input[type="email"]');
    if (emailInput) {
      await emailInput.click();
      await page.keyboard.type(testData.email);
    }

    // Find and fill phone field
    const phoneInput = await page.$('input[name="phone"], input[type="tel"]');
    if (phoneInput) {
      await phoneInput.click();
      await page.keyboard.type(testData.phone);
    }

    // Select at least one position
    const positionCheckboxes = await page.$$('input[type="checkbox"]');
    if (positionCheckboxes.length > 0) {
      await positionCheckboxes[0].click();
    }

    // Fill experience years if required
    const experienceInput = await page.$('input[name="experience_years"], input[name="experienceYears"]');
    if (experienceInput) {
      await experienceInput.click();
      await page.keyboard.type('3');
    }

    await takeScreenshot(page, 'feat-024-form-filled');

    // Submit the form
    const submitButton = await page.$('button[type="submit"]');
    if (submitButton) {
      console.log('   Submitting form...');
      await submitButton.click();
      await page.waitForTimeout(5000);
    }

    await takeScreenshot(page, 'feat-024-after-submit');

    // Check for success or error messages
    const pageText = await page.evaluate(() => document.body.innerText);
    const hasSuccess = pageText.toLowerCase().includes('success') ||
                       pageText.toLowerCase().includes('thank you') ||
                       pageText.toLowerCase().includes('submitted');
    const hasError = pageText.toLowerCase().includes('error') ||
                     pageText.toLowerCase().includes('failed');

    if (hasSuccess) {
      console.log('   ✅ Form submission successful');
      return { passed: true, note: 'Application submitted successfully' };
    } else if (hasError) {
      console.log('   ⚠️ Form submission error (possible RLS policy issue)');
      return { passed: false, note: 'Database storage requires RLS policy configuration' };
    }

    return { passed: false, note: 'Could not verify submission result' };
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { passed: false, note: error.message };
  }
}

async function testFeat025_FileStorage(page) {
  console.log('\n=== Testing feat-025: File Storage ===');

  // This test requires actually uploading a file through the form
  // Since we can't easily create test files in the browser, we'll check
  // if the file upload UI exists and is functional

  try {
    await page.goto(`${BASE_URL}/apply`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('form', { timeout: 10000 });

    // Find file input
    const fileInputs = await page.$$('input[type="file"]');
    console.log(`   Found ${fileInputs.length} file input(s)`);

    if (fileInputs.length > 0) {
      // Check accept attribute
      const acceptAttr = await fileInputs[0].evaluate(el => el.getAttribute('accept'));
      console.log(`   File input accepts: ${acceptAttr}`);

      if (acceptAttr && (acceptAttr.includes('pdf') || acceptAttr.includes('doc'))) {
        console.log('   ✅ File upload UI configured correctly');

        // Note: Actual file storage test requires the storage bucket to exist
        // and proper RLS policies to be in place
        return {
          passed: false,
          note: 'UI ready, but storage bucket not configured in Supabase'
        };
      }
    }

    return { passed: false, note: 'File upload input not found or misconfigured' };
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { passed: false, note: error.message };
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('SUPABASE INTEGRATION FEATURES TEST');
  console.log('Testing via browser automation');
  console.log('='.repeat(60));

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  const results = {};

  try {
    // Test Auth first (feat-026)
    results['feat-026'] = await testFeat026_SupabaseAuth(page);

    // Test Database storage (feat-024)
    results['feat-024'] = await testFeat024_DatabaseStorage(page);

    // Test File storage (feat-025)
    results['feat-025'] = await testFeat025_FileStorage(page);

  } catch (error) {
    console.error('Test error:', error.message);
  } finally {
    await browser.close();
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('RESULTS SUMMARY');
  console.log('='.repeat(60));

  for (const [feature, result] of Object.entries(results)) {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${feature}: ${status}`);
    if (result.note) console.log(`   Note: ${result.note}`);
    if (result.mode) console.log(`   Mode: ${result.mode}`);
  }

  console.log('='.repeat(60));

  return results;
}

main().catch(console.error);
