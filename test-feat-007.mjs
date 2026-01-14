import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';

const SCREENSHOTS_DIR = './test-screenshots';
try { mkdirSync(SCREENSHOTS_DIR, { recursive: true }); } catch (e) {}

(async () => {
  console.log('Testing feat-007: Required fields validation');
  
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  console.log('Step 1: Navigate to application page');
  await page.goto('http://localhost:5004', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: SCREENSHOTS_DIR + '/feat-007-step1-navigate.png' });
  console.log('OK Step 1: Navigation complete');
  
  console.log('\nStep 2: Leave required fields empty');
  const form = await page.$('form');
  if (!form) throw new Error('Form not found');
  console.log('OK Step 2: Form found, fields left empty');
  
  await page.screenshot({ path: SCREENSHOTS_DIR + '/feat-007-step2-empty-form.png' });
  
  console.log('\nStep 3: Attempt to submit form');
  let submitBtn = await page.$('button[type="submit"]');
  if (!submitBtn) {
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent.trim().toLowerCase(), btn);
      if (text.includes('submit') || text.includes('apply')) {
        submitBtn = btn;
        break;
      }
    }
  }
  
  if (!submitBtn) throw new Error('Submit button not found');
  
  await submitBtn.click();
  await new Promise(r => setTimeout(r, 2000));
  console.log('OK Step 3: Submit button clicked');
  
  await page.screenshot({ path: SCREENSHOTS_DIR + '/feat-007-step3-after-submit.png' });
  
  console.log('\nStep 4: Verify required field errors are displayed');
  const errorElements = await page.$$('[class*="error"], [class*="invalid"], .text-red-500, .text-destructive, [aria-invalid="true"]');
  const errorTexts = [];
  for (const el of errorElements) {
    const text = await page.evaluate(e => e.textContent.trim(), el);
    if (text && text.length > 0 && text.length < 200) {
      errorTexts.push(text);
    }
  }
  
  const invalidInputs = await page.$$eval('input[required], textarea[required]', 
    inputs => inputs.filter(inp => !inp.checkValidity()).length
  );
  
  console.log('Found ' + errorElements.length + ' error elements');
  console.log('Found ' + invalidInputs + ' invalid required inputs');
  
  if (errorTexts.length > 0) {
    console.log('Error messages found:');
    errorTexts.slice(0, 5).forEach((err, i) => console.log('  ' + (i + 1) + '. ' + err.substring(0, 80)));
  }
  
  if (errorElements.length === 0 && invalidInputs === 0) {
    throw new Error('No validation errors found');
  }
  console.log('OK Step 4: Validation errors displayed');
  
  console.log('\nStep 5: Verify form did not submit');
  const currentUrl = page.url();
  const stillOnForm = currentUrl.includes('localhost:5004') && !currentUrl.includes('success') && !currentUrl.includes('thank');
  
  if (!stillOnForm) {
    throw new Error('Form submitted despite empty required fields (URL: ' + currentUrl + ')');
  }
  console.log('OK Step 5: Form did not submit');
  
  await page.screenshot({ path: SCREENSHOTS_DIR + '/feat-007-step5-final.png' });
  
  await browser.close();
  
  console.log('\n========================================');
  console.log('SUCCESS FEAT-007 TEST: ALL STEPS PASSED');
  console.log('========================================');
  console.log('\nTest passed at:', new Date().toISOString());
})().catch(err => {
  console.error('\nFAILED FEAT-007 TEST');
  console.error('Error:', err.message);
  process.exit(1);
});
