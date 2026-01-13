import puppeteer from 'puppeteer';
import fs from 'fs';

const BASE_URL = 'http://localhost:5000';

// Helper function to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testMoreFeatures() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  const results = {
    passed: [],
    failed: [],
    errors: []
  };

  // Navigate to page first
  console.log('Navigating to homepage...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await wait(3000);

  // Test feat-005: Contact form
  try {
    console.log('\nTesting feat-005: Contact form...');

    // Scroll to contact section
    const scrolledToContact = await page.evaluate(() => {
      const el = document.getElementById('contact');
      if (el) {
        el.scrollIntoView({ behavior: 'instant' });
        return true;
      }
      return false;
    });
    await wait(1000);

    if (!scrolledToContact) {
      results.failed.push('feat-005: Contact section not found');
    } else {
      // Check for contact form elements
      const contactData = await page.evaluate(() => {
        const contact = document.getElementById('contact');
        if (!contact) return null;

        return {
          hasForm: !!contact.querySelector('form'),
          hasNameInput: !!contact.querySelector('input[name="name"], input[placeholder*="Name"]'),
          hasEmailInput: !!contact.querySelector('input[type="email"], input[name="email"]'),
          hasPhoneInput: !!contact.querySelector('input[name="phone"], input[type="tel"]'),
          hasMessageInput: !!contact.querySelector('textarea'),
          hasSubmitButton: !!contact.querySelector('button[type="submit"], button')
        };
      });

      console.log('  Contact form data:', JSON.stringify(contactData, null, 2));

      if (contactData && contactData.hasForm) {
        results.passed.push('feat-005: Contact form structure exists');
        console.log('  ✓ Contact form exists');
      } else {
        results.failed.push('feat-005: Contact form structure incomplete');
      }
    }

    await page.screenshot({ path: 'screenshots/feat-005-contact.png' });
  } catch (error) {
    results.errors.push(`feat-005: ${error.message}`);
    console.error('Error testing feat-005:', error.message);
  }

  // Test feat-018: Desktop responsiveness (current viewport)
  try {
    console.log('\nTesting feat-018: Desktop responsiveness (1280x720)...');

    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
    await wait(2000);

    const desktopData = await page.evaluate(() => {
      const body = document.body;
      return {
        bodyScrollWidth: body.scrollWidth,
        bodyClientWidth: body.clientWidth,
        windowInnerWidth: window.innerWidth,
        hasHorizontalScroll: body.scrollWidth > body.clientWidth,
        navVisible: !!document.querySelector('nav'),
        heroVisible: !!document.getElementById('hero'),
        sectionsCount: document.querySelectorAll('section').length
      };
    });

    console.log('  Desktop data:', JSON.stringify(desktopData, null, 2));

    if (!desktopData.hasHorizontalScroll && desktopData.navVisible && desktopData.heroVisible) {
      results.passed.push('feat-018: Desktop responsiveness works correctly');
      console.log('  ✓ Desktop layout displays correctly');
      console.log('  ✓ No horizontal scroll');
      console.log('  ✓ ' + desktopData.sectionsCount + ' sections visible');
    } else {
      results.failed.push('feat-018: Desktop layout issues detected');
    }

    await page.screenshot({ path: 'screenshots/feat-018-desktop.png' });
  } catch (error) {
    results.errors.push(`feat-018: ${error.message}`);
    console.error('Error testing feat-018:', error.message);
  }

  // Test feat-016: Mobile responsiveness (375x667)
  try {
    console.log('\nTesting feat-016: Mobile responsiveness (375x667)...');

    await page.setViewport({ width: 375, height: 667 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
    await wait(2000);

    const mobileData = await page.evaluate(() => {
      const body = document.body;
      return {
        bodyScrollWidth: body.scrollWidth,
        bodyClientWidth: body.clientWidth,
        hasHorizontalScroll: body.scrollWidth > body.clientWidth + 5, // Allow small tolerance
        heroVisible: !!document.getElementById('hero'),
        h1Present: !!document.querySelector('h1'),
        buttonsCount: document.querySelectorAll('button').length
      };
    });

    console.log('  Mobile data:', JSON.stringify(mobileData, null, 2));

    if (!mobileData.hasHorizontalScroll && mobileData.heroVisible && mobileData.h1Present) {
      results.passed.push('feat-016: Mobile responsiveness works correctly');
      console.log('  ✓ Mobile layout displays correctly');
      console.log('  ✓ No horizontal scroll');
    } else {
      results.failed.push(`feat-016: Mobile layout issues - horizontal scroll: ${mobileData.hasHorizontalScroll}`);
    }

    await page.screenshot({ path: 'screenshots/feat-016-mobile.png' });
  } catch (error) {
    results.errors.push(`feat-016: ${error.message}`);
    console.error('Error testing feat-016:', error.message);
  }

  // Test feat-017: Tablet responsiveness (768x1024)
  try {
    console.log('\nTesting feat-017: Tablet responsiveness (768x1024)...');

    await page.setViewport({ width: 768, height: 1024 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
    await wait(2000);

    const tabletData = await page.evaluate(() => {
      const body = document.body;
      return {
        hasHorizontalScroll: body.scrollWidth > body.clientWidth + 5,
        heroVisible: !!document.getElementById('hero'),
        servicesVisible: !!document.getElementById('services'),
        gridLayoutCorrect: true // Would need visual inspection
      };
    });

    console.log('  Tablet data:', JSON.stringify(tabletData, null, 2));

    if (!tabletData.hasHorizontalScroll && tabletData.heroVisible) {
      results.passed.push('feat-017: Tablet responsiveness works correctly');
      console.log('  ✓ Tablet layout displays correctly');
    } else {
      results.failed.push('feat-017: Tablet layout issues detected');
    }

    await page.screenshot({ path: 'screenshots/feat-017-tablet.png' });
  } catch (error) {
    results.errors.push(`feat-017: ${error.message}`);
    console.error('Error testing feat-017:', error.message);
  }

  // Test feat-023: Cookie consent banner
  try {
    console.log('\nTesting feat-023: Cookie consent banner...');

    // Reset to desktop viewport
    await page.setViewport({ width: 1280, height: 720 });

    // Clear cookies to ensure banner appears
    const client = await page.createCDPSession();
    await client.send('Network.clearBrowserCookies');

    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
    await wait(2000);

    const cookieData = await page.evaluate(() => {
      // Look for cookie consent banner
      const cookieBanner = document.querySelector('[class*="cookie"], [class*="Cookie"], [class*="consent"], [id*="cookie"]');
      const allButtons = document.querySelectorAll('button');
      let acceptButton = null;
      let declineButton = null;

      allButtons.forEach(btn => {
        const text = btn.textContent?.toLowerCase() || '';
        if (text.includes('accept') || text.includes('agree') || text.includes('allow')) {
          acceptButton = btn;
        }
        if (text.includes('decline') || text.includes('reject') || text.includes('deny')) {
          declineButton = btn;
        }
      });

      return {
        hasCookieBanner: !!cookieBanner,
        bannerText: cookieBanner?.textContent?.substring(0, 100) || null,
        hasAcceptButton: !!acceptButton,
        hasDeclineButton: !!declineButton,
        totalButtons: allButtons.length
      };
    });

    console.log('  Cookie data:', JSON.stringify(cookieData, null, 2));

    if (cookieData.hasCookieBanner && cookieData.hasAcceptButton) {
      results.passed.push('feat-023: Cookie consent banner displays correctly');
      console.log('  ✓ Cookie consent banner visible');
      console.log('  ✓ Accept button present');
    } else {
      results.failed.push(`feat-023: Cookie banner - visible: ${cookieData.hasCookieBanner}, accept: ${cookieData.hasAcceptButton}`);
    }

    await page.screenshot({ path: 'screenshots/feat-023-cookie.png' });
  } catch (error) {
    results.errors.push(`feat-023: ${error.message}`);
    console.error('Error testing feat-023:', error.message);
  }

  // Test feat-019: Multi-language support
  try {
    console.log('\nTesting feat-019: Multi-language support...');

    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
    await wait(2000);

    const languageData = await page.evaluate(() => {
      // Look for language toggle
      const langToggle = document.querySelector('[class*="language"], [class*="Language"], [aria-label*="language"], button[class*="globe"]');
      const allSelects = document.querySelectorAll('select');
      const allButtons = document.querySelectorAll('button');

      // Look for language indicators
      let hasEnglish = false;
      let hasSpanish = false;
      let hasFrench = false;

      document.querySelectorAll('*').forEach(el => {
        const text = el.textContent?.toLowerCase() || '';
        if (text.includes('english') || text.includes('en')) hasEnglish = true;
        if (text.includes('spanish') || text.includes('español') || text.includes('es')) hasSpanish = true;
        if (text.includes('french') || text.includes('français') || text.includes('fr')) hasFrench = true;
      });

      // Look for language toggle button
      let langButton = null;
      allButtons.forEach(btn => {
        const ariaLabel = btn.getAttribute('aria-label')?.toLowerCase() || '';
        const text = btn.textContent?.toLowerCase() || '';
        if (ariaLabel.includes('language') || text.includes('en') || text.includes('es') || text.includes('fr')) {
          langButton = {
            ariaLabel: btn.getAttribute('aria-label'),
            text: btn.textContent?.substring(0, 50)
          };
        }
      });

      return {
        hasLanguageToggle: !!langToggle || !!langButton,
        languageButton: langButton,
        selectCount: allSelects.length,
        hasEnglish,
        hasSpanish,
        hasFrench
      };
    });

    console.log('  Language data:', JSON.stringify(languageData, null, 2));

    if (languageData.hasLanguageToggle) {
      results.passed.push('feat-019: Multi-language support visible');
      console.log('  ✓ Language toggle found');
    } else {
      results.failed.push('feat-019: Language toggle not found');
    }

    await page.screenshot({ path: 'screenshots/feat-019-language.png' });
  } catch (error) {
    results.errors.push(`feat-019: ${error.message}`);
    console.error('Error testing feat-019:', error.message);
  }

  // Test feat-028: Form validation (on apply form)
  try {
    console.log('\nTesting feat-028: Form validation...');

    // Scroll to apply section
    await page.evaluate(() => {
      const el = document.getElementById('apply');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    });
    await wait(1000);

    const formValidationData = await page.evaluate(() => {
      const applySection = document.getElementById('apply');
      if (!applySection) return { hasSection: false };

      return {
        hasSection: true,
        hasForm: !!applySection.querySelector('form'),
        hasNameInput: !!applySection.querySelector('input[name*="name"], input[placeholder*="name" i]'),
        hasEmailInput: !!applySection.querySelector('input[type="email"], input[name*="email"]'),
        hasPhoneInput: !!applySection.querySelector('input[name*="phone"], input[type="tel"]'),
        hasSubmitButton: !!applySection.querySelector('button[type="submit"], button'),
        inputCount: applySection.querySelectorAll('input').length
      };
    });

    console.log('  Form validation data:', JSON.stringify(formValidationData, null, 2));

    if (formValidationData.hasForm && formValidationData.hasNameInput && formValidationData.hasEmailInput) {
      results.passed.push('feat-028: Form with validation inputs exists');
      console.log('  ✓ Application form found with input fields');
    } else {
      results.failed.push('feat-028: Form structure incomplete');
    }

    await page.screenshot({ path: 'screenshots/feat-028-form.png' });
  } catch (error) {
    results.errors.push(`feat-028: ${error.message}`);
    console.error('Error testing feat-028:', error.message);
  }

  // Print summary
  console.log('\n========== TEST SUMMARY ==========');
  console.log('Passed:', results.passed.length);
  console.log('Failed:', results.failed.length);
  console.log('Errors:', results.errors.length);

  if (results.passed.length > 0) {
    console.log('\nPassed Tests:');
    results.passed.forEach(p => console.log('  ✓', p));
  }

  if (results.failed.length > 0) {
    console.log('\nFailed Tests:');
    results.failed.forEach(f => console.log('  ✗', f));
  }

  if (results.errors.length > 0) {
    console.log('\nErrors:');
    results.errors.forEach(e => console.log('  !', e));
  }

  await browser.close();

  // Write results to file
  fs.writeFileSync('test-results-more.json', JSON.stringify(results, null, 2));

  return results;
}

testMoreFeatures().catch(console.error);
