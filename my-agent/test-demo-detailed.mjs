import puppeteer from 'puppeteer';

const BASE_URL = 'http://localhost:5000';
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testDemoMode() {
  console.log('Starting detailed demo test...\n');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    // Log ALL console messages
    page.on('console', msg => console.log('  [Browser]:', msg.text()));
    page.on('pageerror', err => console.log('  [Page Error]:', err.message));
    page.on('requestfailed', req => {
      if (!req.url().includes('supabase') && !req.url().includes('placeholder')) {
        console.log('  [Request Failed]:', req.url());
      }
    });

    // Navigate to login
    console.log('Step 1: Navigate to admin login...');
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle0', timeout: 30000 });
    await wait(1000);

    // Fill credentials via button
    console.log('\nStep 2: Click Fill Demo Credentials...');
    const clicked = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        if (btn.textContent.includes('Fill Demo')) {
          btn.click();
          return true;
        }
      }
      return false;
    });
    console.log('  Button clicked:', clicked);
    await wait(500);

    // Get form state
    const formState = await page.evaluate(() => {
      const email = document.querySelector('#email');
      const password = document.querySelector('#password');
      const form = document.querySelector('form');
      const submitBtn = document.querySelector('button[type="submit"]');

      return {
        emailValue: email?.value,
        passwordValue: password?.value,
        formExists: !!form,
        submitBtnExists: !!submitBtn,
        submitBtnDisabled: submitBtn?.disabled,
        submitBtnText: submitBtn?.textContent
      };
    });
    console.log('  Form state:', JSON.stringify(formState, null, 2));

    // Try submitting the form directly via JavaScript
    console.log('\nStep 3: Submit form via form.submit()...');
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) {
        // Create and dispatch a submit event
        const event = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(event);
      }
    });

    await wait(3000);
    console.log('  URL after form dispatch:', page.url());
    await page.screenshot({ path: 'screenshots/after-form-dispatch.png' });

    // Try clicking the submit button with keyboard enter
    console.log('\nStep 4: Try pressing Enter on form...');
    await page.focus('#password');
    await page.keyboard.press('Enter');
    await wait(3000);
    console.log('  URL after Enter:', page.url());
    await page.screenshot({ path: 'screenshots/after-enter.png' });

    // Last resort: click the button
    console.log('\nStep 5: Click submit button directly...');
    await page.click('button[type="submit"]');
    await wait(3000);
    console.log('  URL after button click:', page.url());
    await page.screenshot({ path: 'screenshots/after-click.png' });

  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await browser.close();
  }
}

testDemoMode().catch(console.error);
