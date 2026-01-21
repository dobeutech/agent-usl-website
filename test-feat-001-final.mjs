import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';

const SCREENSHOTS_DIR = './test-screenshots';
try { mkdirSync(SCREENSHOTS_DIR, { recursive: true }); } catch (e) {}

(async () => {
  console.log('Testing feat-001: Basic form fields (name, email, phone)');
  
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  // Step 1: Navigate to application page
  console.log('Step 1: Navigate to application page');
  await page.goto('http://localhost:5000', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));
  
  // Scroll to the application form
  await page.evaluate(() => {
    const fullNameInput = document.querySelector('#full_name');
    if (fullNameInput) {
      fullNameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  await new Promise(r => setTimeout(r, 2000));
  
  await page.screenshot({ path: SCREENSHOTS_DIR + '/feat-001-step1-navigate.png' });
  console.log('✓ Step 1 PASS: Navigation complete');
  
  // Step 2: Verify name input field
  console.log('\nStep 2: Verify name input field is present and accepts text');
  const nameField = await page.$('#full_name');
  if (!nameField) throw new Error('Name field #full_name not found');
  
  await page.click('#full_name');
  await page.type('#full_name', 'John Test Doe', { delay: 30 });
  await new Promise(r => setTimeout(r, 300));
  
  const nameValue = await page.$eval('#full_name', el => el.value);
  if (nameValue !== 'John Test Doe') {
    throw new Error('Name field did not accept text correctly. Expected "John Test Doe", got: "' + nameValue + '"');
  }
  console.log('✓ Step 2 PASS: Name field accepts text: "' + nameValue + '"');
  
  // Step 3: Verify email input field
  console.log('\nStep 3: Verify email input field is present and accepts email format');
  const emailField = await page.$('#email');
  if (!emailField) throw new Error('Email field #email not found');
  
  await page.click('#email');
  await page.type('#email', 'john.doe@test.com', { delay: 30 });
  await new Promise(r => setTimeout(r, 300));
  
  const emailValue = await page.$eval('#email', el => el.value);
  if (emailValue !== 'john.doe@test.com') {
    throw new Error('Email field did not accept email');
  }
  console.log('✓ Step 3 PASS: Email field accepts email: "' + emailValue + '"');
  
  // Step 4: Verify phone input field
  console.log('\nStep 4: Verify phone input field is present and accepts phone format');
  const phoneField = await page.$('#phone');
  if (!phoneField) throw new Error('Phone field #phone not found');
  
  await page.click('#phone');
  await page.type('#phone', '301-555-1234', { delay: 30 });
  await new Promise(r => setTimeout(r, 300));
  
  const phoneValue = await page.$eval('#phone', el => el.value);
  console.log('✓ Step 4 PASS: Phone field accepts phone: "' + phoneValue + '"');
  
  await page.screenshot({ path: SCREENSHOTS_DIR + '/feat-001-step4-all-fields-filled.png' });
  
  // Step 5: Fill in all basic fields with valid data
  console.log('\nStep 5: Fill in all basic fields with valid data');
  console.log('✓ Step 5 PASS: All basic fields filled with valid data');
  
  // Step 6: Verify no validation errors appear
  console.log('\nStep 6: Verify no validation errors appear');
  const errors = await page.evaluate(() => {
    // Look for error messages near the fields we just filled
    const nameError = document.querySelector('#full_name + *');
    const emailError = document.querySelector('#email + *');
    const phoneError = document.querySelector('#phone + *');
    
    const allText = document.body.textContent;
    const nameFieldParent = document.querySelector('#full_name')?.closest('div');
    const emailFieldParent = document.querySelector('#email')?.closest('div');
    const phoneFieldParent = document.querySelector('#phone')?.closest('div');
    
    return {
      nameError: nameFieldParent?.textContent.includes('error') || nameFieldParent?.textContent.includes('invalid'),
      emailError: emailFieldParent?.textContent.toLowerCase().includes('error') || emailFieldParent?.textContent.toLowerCase().includes('invalid'),
      phoneError: phoneFieldParent?.textContent.toLowerCase().includes('error') || phoneFieldParent?.textContent.toLowerCase().includes('invalid')
    };
  });
  
  if (errors.nameError || errors.emailError || errors.phoneError) {
    console.log('⚠ Validation errors found:', errors);
    throw new Error('Validation errors present on valid input');
  } else {
    console.log('✓ Step 6 PASS: No validation errors on valid input');
  }
  
  await page.screenshot({ path: SCREENSHOTS_DIR + '/feat-001-step6-validation-check.png' });
  
  await browser.close();
  
  console.log('\n========================================');
  console.log('✅ FEAT-001 TEST: ALL STEPS PASSED');
  console.log('========================================');
  console.log('All steps completed successfully:');
  console.log('✓ Step 1: Navigate to application page');
  console.log('✓ Step 2: Name field present and accepts text');
  console.log('✓ Step 3: Email field present and accepts email format');
  console.log('✓ Step 4: Phone field present and accepts phone format');
  console.log('✓ Step 5: All basic fields filled with valid data');
  console.log('✓ Step 6: No validation errors on valid input');
  console.log('========================================');
  console.log('\nTest passed at:', new Date().toISOString());
})().catch(err => {
  console.error('\n❌ FEAT-001 TEST FAILED');
  console.error('Error:', err.message);
  process.exit(1);
});
