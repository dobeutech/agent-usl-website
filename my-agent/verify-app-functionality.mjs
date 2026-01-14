import puppeteer from 'puppeteer';

(async () => {
  console.log('='.repeat(60));
  console.log('WEB APPLICATION FUNCTIONALITY VERIFICATION');
  console.log('='.repeat(60));
  console.log('Target: http://localhost:5000');
  console.log('Started:', new Date().toISOString());
  console.log('='.repeat(60));

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const results = {
    checks: [],
    passed: 0,
    failed: 0
  };

  function logCheck(name, passed, details = '') {
    const status = passed ? 'PASS' : 'FAIL';
    const icon = passed ? '[+]' : '[-]';
    console.log(`${icon} ${name}: ${status}${details ? ' - ' + details : ''}`);
    results.checks.push({ name, passed, details });
    if (passed) results.passed++;
    else results.failed++;
  }

  // Helper function to wait for app to load (not stuck on "Loading...")
  async function waitForAppLoad(maxWait = 15000) {
    const startTime = Date.now();
    while (Date.now() - startTime < maxWait) {
      const isLoading = await page.evaluate(() => {
        const bodyText = document.body.innerText;
        return bodyText.trim() === 'Loading...' ||
               (bodyText.includes('Loading...') && bodyText.length < 100);
      });
      if (!isLoading) return true;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    return false;
  }

  // Helper function to accept cookies if banner appears
  async function acceptCookiesIfPresent() {
    try {
      const accepted = await page.evaluate(() => {
        const acceptBtn = Array.from(document.querySelectorAll('button')).find(
          btn => btn.textContent.includes('Accept All') || btn.textContent.includes('Accept Cookies')
        );
        if (acceptBtn) {
          acceptBtn.click();
          return true;
        }
        // Also try clicking X to close
        const closeBtn = document.querySelector('[aria-label="close"], button:has(svg)');
        if (closeBtn && closeBtn.closest('[class*="cookie"], [class*="privacy"]')) {
          closeBtn.click();
          return true;
        }
        return false;
      });
      if (accepted) {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('  (Cookie banner dismissed)');
      }
    } catch (e) {
      // Ignore errors
    }
  }

  try {
    // ========== CHECK 1: Homepage loads ==========
    console.log('\n--- CHECK 1: Homepage ---');
    await page.goto('http://localhost:5000', { waitUntil: 'networkidle2', timeout: 60000 });

    // Accept cookies first
    await acceptCookiesIfPresent();

    // Wait for content to load
    const homepageLoaded = await waitForAppLoad(15000);

    const homepageUrl = page.url();
    logCheck('Homepage loads', homepageLoaded && homepageUrl.includes('localhost:5000'), `URL: ${homepageUrl}`);

    await page.screenshot({ path: 'screenshots/verify-01-homepage.png', fullPage: true });
    console.log('Screenshot: verify-01-homepage.png');

    // ========== CHECK 2: Hero section with headline ==========
    console.log('\n--- CHECK 2: Hero Section ---');
    const heroCheck = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      const hasHeadline = bodyText.includes('Where Opportunity Starts!') ||
                         bodyText.includes('Where Opportunity Starts') ||
                         bodyText.includes('Opportunity Starts') ||
                         bodyText.includes('Unique Staffing');

      // Find the actual headline text
      const headingElements = document.querySelectorAll('h1, h2, h3');
      let headlineText = '';
      for (const h of headingElements) {
        const text = h.textContent.trim();
        if (text.includes('Opportunity') || text.includes('Staffing') || text.includes('Unique')) {
          headlineText = text;
          break;
        }
      }

      return {
        hasHeadline,
        headlineText,
        bodyLength: bodyText.length
      };
    });

    logCheck('Hero headline visible', heroCheck.hasHeadline, heroCheck.headlineText || 'Searching for headline...');

    // ========== CHECK 3: Services section ==========
    console.log('\n--- CHECK 3: Services Section ---');

    // Scroll down to find Services section
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
    await new Promise(resolve => setTimeout(resolve, 1000));

    const servicesCheck = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      const hasServices = bodyText.includes('Services') ||
                         bodyText.includes('Our Services') ||
                         bodyText.includes('What We Offer');

      // Look for services-related content
      const serviceKeywords = ['Staffing', 'Placement', 'Recruitment', 'Temporary', 'Direct Hire',
                               'Healthcare', 'Nursing', 'CNA', 'LPN', 'RN'];
      const foundKeywords = serviceKeywords.filter(kw => bodyText.includes(kw));

      return {
        hasServices,
        foundKeywords,
        sectionVisible: hasServices || foundKeywords.length > 0
      };
    });

    await page.screenshot({ path: 'screenshots/verify-02-services-section.png', fullPage: true });
    console.log('Screenshot: verify-02-services-section.png');

    logCheck('Services section present', servicesCheck.sectionVisible,
             `Keywords found: ${servicesCheck.foundKeywords.join(', ') || 'None'}`);

    // ========== CHECK 4: Apply page with position checkboxes ==========
    console.log('\n--- CHECK 4: Apply Page ---');
    await page.goto('http://localhost:5000/apply', { waitUntil: 'networkidle2', timeout: 60000 });
    await acceptCookiesIfPresent();
    await waitForAppLoad(15000);

    const applyPageCheck = await page.evaluate(() => {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      const formFields = document.querySelectorAll('input, select, textarea');
      const submitButton = document.querySelector('button[type="submit"]');

      // Get checkbox labels
      const checkboxLabels = [];
      checkboxes.forEach(cb => {
        const label = cb.closest('label')?.textContent?.trim() ||
                     cb.nextElementSibling?.textContent?.trim() ||
                     document.querySelector(`label[for="${cb.id}"]`)?.textContent?.trim() ||
                     cb.id || 'Unknown';
        if (label.length < 100) {
          checkboxLabels.push(label);
        }
      });

      // Get all form field info
      const fieldTypes = {};
      formFields.forEach(f => {
        const type = f.type || f.tagName.toLowerCase();
        fieldTypes[type] = (fieldTypes[type] || 0) + 1;
      });

      return {
        checkboxCount: checkboxes.length,
        formFieldCount: formFields.length,
        hasSubmitButton: !!submitButton,
        submitButtonText: submitButton?.textContent?.trim() || '',
        checkboxLabels: checkboxLabels.slice(0, 10),
        fieldTypes,
        pageTitle: document.title,
        bodyText: document.body.innerText.substring(0, 500)
      };
    });

    await page.screenshot({ path: 'screenshots/verify-03-apply-page.png', fullPage: true });
    console.log('Screenshot: verify-03-apply-page.png');

    logCheck('Apply page loads', applyPageCheck.formFieldCount > 0,
             `Form fields: ${applyPageCheck.formFieldCount}, Types: ${JSON.stringify(applyPageCheck.fieldTypes)}`);
    logCheck('Position checkboxes present', applyPageCheck.checkboxCount > 0,
             `Found ${applyPageCheck.checkboxCount} checkboxes: ${applyPageCheck.checkboxLabels.slice(0, 5).join(', ')}`);

    // ========== CHECK 5: Admin login page ==========
    console.log('\n--- CHECK 5: Admin Login Page ---');
    await page.goto('http://localhost:5000/admin/login', { waitUntil: 'networkidle2', timeout: 60000 });
    await acceptCookiesIfPresent();
    await waitForAppLoad(15000);

    const loginPageCheck = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      const hasDemoMode = bodyText.includes('Demo Mode') ||
                         bodyText.includes('demo mode') ||
                         bodyText.includes('DEMO') ||
                         bodyText.includes('Demo Credentials');

      const emailInput = document.querySelector('input[type="email"], input[name="email"]');
      const passwordInput = document.querySelector('input[type="password"], input[name="password"]');
      const signInButton = Array.from(document.querySelectorAll('button')).find(
        btn => btn.textContent.includes('Sign In') || btn.textContent.includes('Login')
      );
      const demoButton = Array.from(document.querySelectorAll('button')).find(
        btn => btn.textContent.includes('Demo') || btn.textContent.includes('demo')
      );

      // Get all buttons for debug
      const allButtons = Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim());

      return {
        hasDemoMode,
        hasEmailInput: !!emailInput,
        hasPasswordInput: !!passwordInput,
        hasSignInButton: !!signInButton,
        hasDemoButton: !!demoButton,
        demoButtonText: demoButton?.textContent?.trim() || '',
        allButtons,
        pageTitle: document.title,
        bodyText: bodyText.substring(0, 800)
      };
    });

    await page.screenshot({ path: 'screenshots/verify-04-admin-login.png', fullPage: true });
    console.log('Screenshot: verify-04-admin-login.png');

    logCheck('Admin login page loads', loginPageCheck.hasEmailInput && loginPageCheck.hasPasswordInput,
             `Email input: ${loginPageCheck.hasEmailInput}, Password input: ${loginPageCheck.hasPasswordInput}`);
    logCheck('Demo Mode indicator visible', loginPageCheck.hasDemoMode,
             loginPageCheck.hasDemoButton ? `Demo button: "${loginPageCheck.demoButtonText}"` :
             `Buttons found: ${loginPageCheck.allButtons.join(', ')}`);

    // ========== CHECK 6: Demo login ==========
    console.log('\n--- CHECK 6: Demo Login ---');

    if (loginPageCheck.hasEmailInput && loginPageCheck.hasPasswordInput) {
      // Fill in demo credentials
      const emailSelector = 'input[type="email"], input[name="email"]';
      const passwordSelector = 'input[type="password"], input[name="password"]';

      // Clear any existing values and type credentials
      await page.evaluate((emailSel, pwSel) => {
        const email = document.querySelector(emailSel);
        const password = document.querySelector(pwSel);
        if (email) email.value = '';
        if (password) password.value = '';
      }, emailSelector, passwordSelector);

      await page.type(emailSelector, 'demo@uniquestaffing.com');
      await page.type(passwordSelector, 'demo123');

      await page.screenshot({ path: 'screenshots/verify-05-credentials-filled.png', fullPage: true });
      console.log('Screenshot: verify-05-credentials-filled.png');

      // Click sign in button
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        for (const btn of buttons) {
          const text = btn.textContent.toLowerCase();
          if (text.includes('sign in') || text.includes('login')) {
            btn.click();
            return true;
          }
        }
        // Fallback to submit button
        const submit = document.querySelector('button[type="submit"]');
        if (submit) submit.click();
        return false;
      });

      // Wait for navigation/response
      await new Promise(resolve => setTimeout(resolve, 4000));
      await waitForAppLoad(10000);

      const afterLoginUrl = page.url();
      await page.screenshot({ path: 'screenshots/verify-06-after-login.png', fullPage: true });
      console.log('Screenshot: verify-06-after-login.png');

      const loginSucceeded = afterLoginUrl.includes('dashboard') ||
                            (afterLoginUrl.includes('admin') && !afterLoginUrl.includes('login'));

      logCheck('Demo login successful', loginSucceeded, `Redirected to: ${afterLoginUrl}`);
    } else {
      logCheck('Demo login successful', false, 'Could not find login form fields');
    }

    // ========== CHECK 7: Dashboard with applicant list ==========
    console.log('\n--- CHECK 7: Admin Dashboard ---');

    const currentUrl = page.url();
    // If not on dashboard, navigate directly
    if (!currentUrl.includes('dashboard')) {
      console.log('  Navigating directly to dashboard...');
      await page.goto('http://localhost:5000/admin/dashboard', { waitUntil: 'networkidle2', timeout: 60000 });
      await acceptCookiesIfPresent();
      await waitForAppLoad(15000);
    }

    await page.screenshot({ path: 'screenshots/verify-07-dashboard.png', fullPage: true });
    console.log('Screenshot: verify-07-dashboard.png');

    const dashboardCheck = await page.evaluate(() => {
      const bodyText = document.body.innerText;

      // Check for applicant-related content
      const hasApplicantContent = bodyText.includes('Applicant') ||
                                  bodyText.includes('applicant') ||
                                  bodyText.includes('Applications') ||
                                  bodyText.includes('Candidates');

      // Check for table
      const table = document.querySelector('table');
      const tableRows = table ? table.querySelectorAll('tbody tr').length : 0;
      const tableHeaders = table ? Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim()) : [];

      // Check for dashboard indicators
      const hasDashboardTitle = bodyText.includes('Dashboard') ||
                               bodyText.includes('Admin') ||
                               bodyText.includes('Management') ||
                               bodyText.includes('Overview');

      // Check for stats/cards
      const statsCards = document.querySelectorAll('[class*="card"], [class*="stat"]');

      // Check if redirected to login (auth issue)
      const isLoginPage = bodyText.includes('Sign In') && bodyText.includes('Password');

      return {
        hasApplicantContent,
        hasDashboardTitle,
        hasTable: !!table,
        tableRows,
        tableHeaders,
        statsCardCount: statsCards.length,
        isLoginPage,
        url: window.location.href,
        bodyPreview: bodyText.substring(0, 500)
      };
    });

    if (dashboardCheck.isLoginPage) {
      logCheck('Dashboard displays', false, 'Redirected to login page - authentication required');
      logCheck('Applicant list visible', false, 'Cannot access dashboard without auth');
    } else {
      logCheck('Dashboard displays', dashboardCheck.hasDashboardTitle, `URL: ${dashboardCheck.url}`);
      logCheck('Applicant list visible', dashboardCheck.hasApplicantContent || dashboardCheck.hasTable,
               dashboardCheck.hasTable ?
                 `Table with ${dashboardCheck.tableRows} rows, Headers: ${dashboardCheck.tableHeaders.slice(0, 5).join(', ')}` :
                 'Looking for applicant data...');
    }

    // ========== SUMMARY ==========
    console.log('\n' + '='.repeat(60));
    console.log('VERIFICATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Checks: ${results.checks.length}`);
    console.log(`Passed: ${results.passed}`);
    console.log(`Failed: ${results.failed}`);
    console.log(`Success Rate: ${Math.round((results.passed / results.checks.length) * 100)}%`);
    console.log('='.repeat(60));

    console.log('\nDetailed Results:');
    results.checks.forEach((check, i) => {
      const icon = check.passed ? '[PASS]' : '[FAIL]';
      console.log(`  ${i + 1}. ${icon} ${check.name}`);
      if (check.details) console.log(`      Details: ${check.details}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('Screenshots saved in: screenshots/verify-*.png');
    console.log('Completed:', new Date().toISOString());
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\nERROR:', error.message);
    await page.screenshot({ path: 'screenshots/verify-error.png', fullPage: true });
    console.log('Error screenshot saved: verify-error.png');
  }

  await browser.close();
  console.log('\nBrowser closed.');
})();
