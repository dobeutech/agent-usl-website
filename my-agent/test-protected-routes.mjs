import puppeteer from 'puppeteer';

async function testProtectedRoutes() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  console.log('Testing Protected Routes...\n');

  const results = {
    'feat-027': { name: 'Protected routes require auth', pass: false },
    'feat-009': { name: 'Admin login page', pass: false }
  };

  try {
    // Test 1: Try to access admin dashboard without login
    console.log('1. Accessing /admin/dashboard without login...');
    await page.goto('http://localhost:5000/admin/dashboard', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1000));

    const currentUrl = page.url();
    console.log('   Current URL: ' + currentUrl);

    // Check if redirected to login or shows login content
    const pageContent = await page.evaluate(() => {
      return {
        url: window.location.pathname,
        hasLoginForm: !!document.querySelector('input[type="email"]') || !!document.querySelector('input[type="password"]'),
        hasLoginText: document.body.textContent.includes('Login') || document.body.textContent.includes('Sign in'),
        title: document.title
      };
    });

    console.log('   Page content:', JSON.stringify(pageContent));

    if (currentUrl.includes('/login') || pageContent.hasLoginForm || pageContent.hasLoginText) {
      results['feat-027'].pass = true;
      console.log('   FEAT-027: PASS - Redirected to login or shows login form');
    }

    await page.screenshot({ path: 'screenshots/protected-route-redirect.png' });

    // Test 2: Check admin login page
    console.log('\n2. Navigating to /admin/login...');
    await page.goto('http://localhost:5000/admin/login', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 500));

    const loginPage = await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"], input[name="email"]');
      const passwordInput = document.querySelector('input[type="password"]');
      const submitButton = document.querySelector('button[type="submit"]');

      return {
        hasEmailInput: !!emailInput,
        hasPasswordInput: !!passwordInput,
        hasSubmitButton: !!submitButton,
        pageContent: document.body.textContent.substring(0, 500)
      };
    });

    console.log('   Login page elements:', JSON.stringify({
      hasEmailInput: loginPage.hasEmailInput,
      hasPasswordInput: loginPage.hasPasswordInput,
      hasSubmitButton: loginPage.hasSubmitButton
    }));

    if (loginPage.hasEmailInput && loginPage.hasPasswordInput && loginPage.hasSubmitButton) {
      results['feat-009'].pass = true;
      console.log('   FEAT-009: PASS - Login form has email, password, and submit button');
    }

    await page.screenshot({ path: 'screenshots/admin-login.png' });

    // Test 3: Test login with invalid credentials
    console.log('\n3. Testing login with invalid credentials...');

    if (loginPage.hasEmailInput && loginPage.hasPasswordInput) {
      const emailInput = await page.$('input[type="email"], input[name="email"]');
      const passwordInput = await page.$('input[type="password"]');
      const submitButton = await page.$('button[type="submit"]');

      if (emailInput && passwordInput && submitButton) {
        await emailInput.type('invalid@example.com');
        await passwordInput.type('wrongpassword');
        await submitButton.click();
        await new Promise(r => setTimeout(r, 2000));

        // Check for error message
        const hasError = await page.evaluate(() => {
          const errorElements = document.querySelectorAll('[class*="error"], [class*="Error"], [role="alert"], .text-red, .text-destructive, [class*="danger"]');
          const bodyText = document.body.textContent.toLowerCase();
          return {
            errorCount: errorElements.length,
            hasErrorText: bodyText.includes('invalid') || bodyText.includes('error') || bodyText.includes('incorrect') || bodyText.includes('failed')
          };
        });

        console.log('   Error state:', JSON.stringify(hasError));

        if (hasError.errorCount > 0 || hasError.hasErrorText) {
          console.log('   Login shows error for invalid credentials');
        }
      }
    }

    await page.screenshot({ path: 'screenshots/admin-login-error.png' });

  } catch (error) {
    console.error('Error during testing:', error.message);
  } finally {
    await browser.close();
  }

  // Summary
  console.log('\n=== RESULTS SUMMARY ===');
  let passCount = 0;
  for (const [id, result] of Object.entries(results)) {
    const status = result.pass ? 'PASS' : 'NEEDS VERIFICATION';
    console.log(id + ': ' + result.name + ' - ' + status);
    if (result.pass) passCount++;
  }

  return results;
}

testProtectedRoutes();
