/**
 * File Upload Test Script
 * Tests file upload functionality in demo mode
 * NOTE: The apply form is on the home page, not a separate /apply route
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import os from 'os';

async function testFileUpload() {
  console.log('Starting file upload test...');
  console.log('NOTE: Apply form is on HOME page (not /apply)\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1200 });

  // Enable console logging for demo mode messages
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('[uploadFile]') || text.includes('Demo mode') || text.includes('isDemo')) {
      console.log('   BROWSER:', text);
    }
  });

  try {
    // Navigate to HOME page (where the apply form is)
    console.log('1. Navigating to homepage (/)...');
    await page.goto('http://localhost:5000/', { waitUntil: 'networkidle2', timeout: 60000 });
    console.log('   Page loaded');

    // Wait for React hydration
    await new Promise(r => setTimeout(r, 3000));

    // Take initial screenshot
    await page.screenshot({ path: 'debug-home-page.png', fullPage: true });

    // Dismiss cookie consent
    console.log('2. Dismissing cookie consent...');
    const dismissed = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const acceptBtn = buttons.find(b => b.textContent.toLowerCase().includes('accept'));
      if (acceptBtn) {
        acceptBtn.click();
        return true;
      }
      return false;
    });
    if (dismissed) console.log('   Dismissed');
    await new Promise(r => setTimeout(r, 1000));

    // Scroll to the apply form section
    console.log('3. Scrolling to apply form section...');
    await page.evaluate(() => {
      // Look for the form section
      const form = document.querySelector('form');
      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Try scrolling to sections that might contain the form
        const sections = document.querySelectorAll('section');
        for (const section of sections) {
          if (section.textContent.toLowerCase().includes('apply') ||
              section.textContent.toLowerCase().includes('application')) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            break;
          }
        }
      }
    });
    await new Promise(r => setTimeout(r, 2000));

    // Check for form inputs
    const formInputs = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      return inputs.map(i => ({
        type: i.type,
        id: i.id,
        visible: i.offsetParent !== null
      }));
    });
    console.log('   Found', formInputs.length, 'input elements');
    console.log('   Visible inputs:', formInputs.filter(i => i.visible).length);

    // Fill out the form
    console.log('4. Filling out application form...');

    // Name field
    const textInputs = await page.$$('input[type="text"]');
    if (textInputs.length > 0) {
      await textInputs[0].click();
      await page.keyboard.type('Test File Upload User');
      console.log('   Name filled');
    }

    // Email fields
    const emailInputs = await page.$$('input[type="email"]');
    console.log('   Email inputs:', emailInputs.length);
    for (let i = 0; i < emailInputs.length; i++) {
      await emailInputs[i].click();
      await emailInputs[i].evaluate(el => el.value = '');
      await page.keyboard.type('testfile@example.com');
    }

    // Phone
    const phoneInputs = await page.$$('input[type="tel"]');
    console.log('   Phone inputs:', phoneInputs.length);
    for (const phone of phoneInputs) {
      await phone.click();
      await page.keyboard.type('555-777-8888');
    }

    // Checkboxes (positions)
    const checkboxes = await page.$$('input[type="checkbox"]');
    console.log('   Checkboxes:', checkboxes.length);
    if (checkboxes.length > 0) {
      await checkboxes[0].click();
    }

    // Select dropdowns
    const selects = await page.$$('select');
    console.log('   Selects:', selects.length);
    for (const sel of selects) {
      try {
        const options = await page.evaluate(s =>
          Array.from(s.options).map(o => o.value).filter(v => v),
          sel
        );
        if (options.length > 0) {
          await sel.select(options[0]);
        }
      } catch (e) {}
    }

    // File upload
    console.log('5. Uploading test file...');
    const testFilePath = path.join(os.tmpdir(), 'test-resume.pdf');
    fs.writeFileSync(testFilePath, 'PDF Test Content - This is a test resume file for file upload testing');

    const fileInputs = await page.$$('input[type="file"]');
    console.log('   File inputs found:', fileInputs.length);

    if (fileInputs.length > 0) {
      await fileInputs[0].uploadFile(testFilePath);
      await new Promise(r => setTimeout(r, 2000));
      console.log('   File uploaded');

      // Check if filename is shown
      const hasFilename = await page.evaluate(() => {
        return document.body.innerText.includes('test-resume') ||
               document.body.innerText.includes('Change');
      });
      console.log('   Filename displayed:', hasFilename);
    }

    // Take screenshot of filled form
    await page.screenshot({ path: 'test-file-upload-form.png', fullPage: true });
    console.log('   Form screenshot saved');

    // Submit
    console.log('6. Submitting form...');
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      // Scroll submit button into view
      await submitBtn.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
      await new Promise(r => setTimeout(r, 500));

      await submitBtn.click();
      console.log('   Submit clicked');
      await new Promise(r => setTimeout(r, 5000));
    }

    // Take result screenshot
    await page.screenshot({ path: 'test-file-upload-result.png', fullPage: true });

    // Check result
    const result = await page.evaluate(() => {
      const text = document.body.innerText.toLowerCase();
      return {
        hasSuccess: text.includes('success'),
        hasDemo: text.includes('demo'),
        hasSubmitted: text.includes('submitted'),
        hasError: text.includes('error') && !text.includes('error loading'),
        hasRequired: text.includes('required'),
        url: window.location.href
      };
    });

    console.log('\n=== TEST RESULTS ===');
    console.log('Result:', JSON.stringify(result, null, 2));

    if (result.hasSuccess || result.hasSubmitted) {
      console.log('\n✅ PASS: File upload and form submission succeeded!');
      if (result.hasDemo) {
        console.log('   Demo mode confirmed - file upload was simulated');
      }
    } else if (result.hasRequired) {
      console.log('\n⚠️ FORM VALIDATION: Some required fields missing');
    } else if (result.hasError) {
      console.log('\n❌ ERROR: Form submission failed');
    } else {
      console.log('\n⚠️ UNCLEAR: Check screenshots for details');
    }

    // Cleanup
    try { fs.unlinkSync(testFilePath); } catch (e) {}

  } catch (error) {
    console.error('\n❌ Test error:', error.message);
    await page.screenshot({ path: 'test-file-upload-error.png' }).catch(() => {});
  } finally {
    await browser.close();
  }

  console.log('\nTest complete.');
}

testFileUpload().catch(console.error);
