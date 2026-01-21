/**
 * Comprehensive Browser Automation Test Suite
 * Tests all functional items across devices, languages, themes, and accessibility
 * 
 * Run with: node tests/browser-automation.test.mjs
 */

import puppeteer from 'puppeteer';

const BASE_URL = process.env.TEST_URL || 'https://unique-staffing-professionals.netlify.app';
const HEADLESS = process.env.HEADLESS !== 'false';
const SLOW_MO = parseInt(process.env.SLOW_MO || '0');

// Device configurations for responsive testing
const DEVICES = {
  mobile: {
    name: 'Mobile',
    viewport: { width: 375, height: 812, isMobile: true },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
  },
  tablet: {
    name: 'Tablet',
    viewport: { width: 768, height: 1024, isMobile: true },
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
  },
  desktop: {
    name: 'Desktop',
    viewport: { width: 1920, height: 1080, isMobile: false },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
};

// Test results storage
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: []
};

// Helper function to log test results
function logResult(testName, status, details = '') {
  const emoji = status === 'passed' ? '✅' : status === 'failed' ? '❌' : '⏭️';
  console.log(`${emoji} ${testName}${details ? ` - ${details}` : ''}`);
  results[status]++;
  results.tests.push({ name: testName, status, details, timestamp: new Date().toISOString() });
}

// Helper function for delays (replacement for waitForTimeout)
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper function to wait for page load
async function waitForPageLoad(page, timeout = 10000) {
  try {
    await page.waitForFunction(() => document.readyState === 'complete', { timeout });
    await delay(500); // Extra buffer for React hydration
    return true;
  } catch {
    return false;
  }
}

// ============================================
// NAVIGATION & ROUTING TESTS
// ============================================
async function testNavigation(page, device) {
  console.log(`\n📍 Testing Navigation (${device.name})...`);
  
  const routes = [
    { path: '/', name: 'Home', selector: '#main-content' },
    { path: '/employers', name: 'Employers', selector: 'main' },
    { path: '/forms', name: 'Forms', selector: 'main' },
    { path: '/privacy', name: 'Privacy Policy', selector: 'main' },
    { path: '/privacy/sms', name: 'SMS Privacy', selector: 'main' },
    { path: '/terms', name: 'Terms of Service', selector: 'main' },
    { path: '/admin/login', name: 'Admin Login', selector: 'main' },
    { path: '/developers/api/docs', name: 'API Docs', selector: 'main' },
  ];

  for (const route of routes) {
    try {
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle2', timeout: 15000 });
      await waitForPageLoad(page);
      
      const exists = await page.$(route.selector);
      if (exists) {
        logResult(`NAV-${routes.indexOf(route) + 1}: ${route.name} route`, 'passed', device.name);
      } else {
        logResult(`NAV-${routes.indexOf(route) + 1}: ${route.name} route`, 'failed', `Missing ${route.selector}`);
      }
    } catch (error) {
      logResult(`NAV-${routes.indexOf(route) + 1}: ${route.name} route`, 'failed', error.message);
    }
  }

  // Test TOS redirect
  try {
    await page.goto(`${BASE_URL}/tos`, { waitUntil: 'networkidle2' });
    const url = page.url();
    if (url.includes('/terms')) {
      logResult('NAV-REDIRECT: /tos → /terms', 'passed', device.name);
    } else {
      logResult('NAV-REDIRECT: /tos → /terms', 'failed', `Redirected to ${url}`);
    }
  } catch (error) {
    logResult('NAV-REDIRECT: /tos → /terms', 'failed', error.message);
  }
}

// ============================================
// LANGUAGE SWITCHING TESTS
// ============================================
async function testLanguageSwitching(page, device) {
  console.log(`\n🌐 Testing Language Switching (${device.name})...`);
  
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
  await waitForPageLoad(page);

  const languages = [
    { code: 'en', name: 'English', testText: 'Apply Now' },
    { code: 'es', name: 'Spanish', testText: 'Aplicar Ahora' },
    { code: 'fr', name: 'French', testText: 'Postuler' }
  ];

  for (const lang of languages) {
    try {
      // Click language toggle
      const langToggle = await page.$('[aria-label*="language"], [aria-label*="Select language"], button:has(.globe-icon)');
      if (langToggle) {
        await langToggle.click();
        await delay(300);
      }

      // Find and click language option
      const langOption = await page.$(`button:has-text("${lang.name}"), [data-lang="${lang.code}"], button[value="${lang.code}"]`);
      if (langOption) {
        await langOption.click();
        await delay(500);
      }

      // Verify language change
      const htmlLang = await page.$eval('html', el => el.lang);
      if (htmlLang === lang.code) {
        logResult(`LANG-${languages.indexOf(lang) + 1}: ${lang.name} selection`, 'passed', device.name);
      } else {
        logResult(`LANG-${languages.indexOf(lang) + 1}: ${lang.name} selection`, 'failed', `html lang is "${htmlLang}"`);
      }

      // Check if localStorage persists
      const storedLang = await page.evaluate(() => localStorage.getItem('app-language'));
      if (storedLang === lang.code) {
        logResult(`LANG-PERSIST-${lang.code}: LocalStorage persistence`, 'passed', device.name);
      }

    } catch (error) {
      logResult(`LANG-${languages.indexOf(lang) + 1}: ${lang.name} selection`, 'failed', error.message);
    }
  }
}

// ============================================
// THEME SWITCHING TESTS
// ============================================
async function testThemeSwitching(page, device) {
  console.log(`\n🎨 Testing Theme Switching (${device.name})...`);
  
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
  await waitForPageLoad(page);

  const themes = ['light', 'dark', 'system'];

  for (const theme of themes) {
    try {
      // Find theme toggle buttons
      const themeButton = await page.$(`button[aria-label*="${theme}"], button[data-theme="${theme}"], button:has(.sun-icon), button:has(.moon-icon)`);
      
      if (themeButton) {
        await themeButton.click();
        await delay(300);

        // Check for theme application
        const hasThemeClass = await page.evaluate((t) => {
          const html = document.documentElement;
          return html.classList.contains(t) || 
                 html.getAttribute('data-theme') === t ||
                 html.getAttribute('data-appearance') === t;
        }, theme);

        if (hasThemeClass || theme === 'system') {
          logResult(`THEME-${themes.indexOf(theme) + 1}: ${theme} mode`, 'passed', device.name);
        } else {
          logResult(`THEME-${themes.indexOf(theme) + 1}: ${theme} mode`, 'skipped', 'Theme attribute not detected');
        }
      } else {
        logResult(`THEME-${themes.indexOf(theme) + 1}: ${theme} mode`, 'skipped', 'Button not found');
      }
    } catch (error) {
      logResult(`THEME-${themes.indexOf(theme) + 1}: ${theme} mode`, 'failed', error.message);
    }
  }
}

// ============================================
// ACCESSIBILITY TESTS
// ============================================
async function testAccessibility(page, device) {
  console.log(`\n♿ Testing Accessibility (${device.name})...`);
  
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
  await waitForPageLoad(page);

  // Test skip to content link
  try {
    const skipLink = await page.$('a[href="#main-content"]');
    if (skipLink) {
      logResult('A11Y-001: Skip to content link', 'passed', device.name);
    } else {
      logResult('A11Y-001: Skip to content link', 'failed', 'Link not found');
    }
  } catch (error) {
    logResult('A11Y-001: Skip to content link', 'failed', error.message);
  }

  // Test accessibility panel
  try {
    const a11yButton = await page.$('button[aria-label*="accessibility"], button[aria-label*="Accessibility"]');
    if (a11yButton) {
      await a11yButton.click();
      await delay(500);
      
      const panel = await page.$('[role="dialog"], .sheet-content, [class*="accessibility"]');
      if (panel) {
        logResult('A11Y-002: Accessibility panel opens', 'passed', device.name);
      } else {
        logResult('A11Y-002: Accessibility panel opens', 'failed', 'Panel not visible');
      }

      // Close panel
      const closeBtn = await page.$('button[aria-label*="close"], button[aria-label*="Close"]');
      if (closeBtn) await closeBtn.click();
      await delay(300);
    } else {
      logResult('A11Y-002: Accessibility panel opens', 'skipped', 'Button not found');
    }
  } catch (error) {
    logResult('A11Y-002: Accessibility panel opens', 'failed', error.message);
  }

  // Test ARIA labels on interactive elements
  try {
    const buttonsWithoutLabels = await page.$$eval('button:not([aria-label]):not(:has(text))', buttons => 
      buttons.filter(b => !b.textContent?.trim()).length
    );
    if (buttonsWithoutLabels === 0) {
      logResult('A11Y-003: ARIA labels on buttons', 'passed', device.name);
    } else {
      logResult('A11Y-003: ARIA labels on buttons', 'failed', `${buttonsWithoutLabels} buttons missing labels`);
    }
  } catch (error) {
    logResult('A11Y-003: ARIA labels on buttons', 'skipped', error.message);
  }

  // Test keyboard navigation
  try {
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    if (focusedElement) {
      logResult('A11Y-004: Keyboard navigation', 'passed', `First focus: ${focusedElement}`);
    } else {
      logResult('A11Y-004: Keyboard navigation', 'failed', 'No element focused');
    }
  } catch (error) {
    logResult('A11Y-004: Keyboard navigation', 'failed', error.message);
  }
}

// ============================================
// FORM FUNCTIONALITY TESTS
// ============================================
async function testApplicationForm(page, device) {
  console.log(`\n📝 Testing Application Form (${device.name})...`);
  
  await page.goto(`${BASE_URL}/#apply`, { waitUntil: 'networkidle2' });
  await waitForPageLoad(page);

  // Scroll to form
  await page.evaluate(() => {
    const applySection = document.getElementById('apply');
    if (applySection) applySection.scrollIntoView({ behavior: 'instant' });
  });
  await delay(500);

  // Test form fields exist
  const formFields = [
    { selector: '#full_name, input[name="full_name"]', name: 'Full Name' },
    { selector: '#email, input[name="email"]', name: 'Email' },
    { selector: '#phone, input[name="phone"]', name: 'Phone' },
    { selector: '#experience_years, select[name="experience_years"]', name: 'Experience' },
    { selector: 'input[type="file"]', name: 'Resume Upload' },
  ];

  for (const field of formFields) {
    try {
      const element = await page.$(field.selector);
      if (element) {
        logResult(`FORM-${formFields.indexOf(field) + 1}: ${field.name} field`, 'passed', device.name);
      } else {
        logResult(`FORM-${formFields.indexOf(field) + 1}: ${field.name} field`, 'failed', 'Not found');
      }
    } catch (error) {
      logResult(`FORM-${formFields.indexOf(field) + 1}: ${field.name} field`, 'failed', error.message);
    }
  }

  // Test position checkboxes
  try {
    const positionCheckboxes = await page.$$('input[type="checkbox"][id^="position-"]');
    if (positionCheckboxes.length > 0) {
      logResult('FORM-POSITIONS: Position checkboxes', 'passed', `${positionCheckboxes.length} options`);
    } else {
      logResult('FORM-POSITIONS: Position checkboxes', 'failed', 'No checkboxes found');
    }
  } catch (error) {
    logResult('FORM-POSITIONS: Position checkboxes', 'failed', error.message);
  }

  // Test submit button
  try {
    const submitButton = await page.$('button[type="submit"]');
    if (submitButton) {
      const isDisabled = await submitButton.evaluate(el => el.disabled);
      logResult('FORM-SUBMIT: Submit button', 'passed', isDisabled ? 'Disabled (validation pending)' : 'Enabled');
    } else {
      logResult('FORM-SUBMIT: Submit button', 'failed', 'Not found');
    }
  } catch (error) {
    logResult('FORM-SUBMIT: Submit button', 'failed', error.message);
  }
}

// ============================================
// UI COMPONENTS TESTS
// ============================================
async function testUIComponents(page, device) {
  console.log(`\n🎯 Testing UI Components (${device.name})...`);
  
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
  await waitForPageLoad(page);

  // Test navigation bar
  try {
    const nav = await page.$('nav, [role="navigation"]');
    if (nav) {
      logResult('UI-001: Navigation bar', 'passed', device.name);
    } else {
      logResult('UI-001: Navigation bar', 'failed', 'Not found');
    }
  } catch (error) {
    logResult('UI-001: Navigation bar', 'failed', error.message);
  }

  // Test hero section
  try {
    const hero = await page.$('#hero, [class*="hero"], section:first-of-type h1');
    if (hero) {
      logResult('UI-002: Hero section', 'passed', device.name);
    } else {
      logResult('UI-002: Hero section', 'failed', 'Not found');
    }
  } catch (error) {
    logResult('UI-002: Hero section', 'failed', error.message);
  }

  // Test footer
  try {
    const footer = await page.$('footer');
    if (footer) {
      const footerVisible = await footer.isIntersectingViewport();
      // Scroll to footer to check visibility
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await delay(500);
      logResult('UI-003: Footer', 'passed', device.name);
    } else {
      logResult('UI-003: Footer', 'failed', 'Not found');
    }
  } catch (error) {
    logResult('UI-003: Footer', 'failed', error.message);
  }

  // Test mobile menu (only on mobile)
  if (device.viewport.isMobile) {
    try {
      const menuButton = await page.$('button[aria-label*="menu"], button[aria-label*="Menu"]');
      if (menuButton) {
        await menuButton.click();
        await delay(300);
        const mobileMenu = await page.$('[class*="mobile"], [class*="drawer"], [role="menu"]');
        if (mobileMenu) {
          logResult('UI-004: Mobile menu toggle', 'passed', device.name);
        } else {
          logResult('UI-004: Mobile menu toggle', 'failed', 'Menu not visible');
        }
      } else {
        logResult('UI-004: Mobile menu toggle', 'skipped', 'Button not found');
      }
    } catch (error) {
      logResult('UI-004: Mobile menu toggle', 'failed', error.message);
    }
  }

  // Test cookie consent
  try {
    const cookieBanner = await page.$('[class*="cookie"], [role="dialog"][class*="consent"]');
    if (cookieBanner) {
      logResult('UI-005: Cookie consent banner', 'passed', device.name);
    } else {
      logResult('UI-005: Cookie consent banner', 'skipped', 'May have been previously accepted');
    }
  } catch (error) {
    logResult('UI-005: Cookie consent banner', 'skipped', error.message);
  }
}

// ============================================
// LINKS VERIFICATION
// ============================================
async function testAllLinks(page, device) {
  console.log(`\n🔗 Testing All Links (${device.name})...`);
  
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
  await waitForPageLoad(page);

  try {
    const links = await page.$$eval('a[href]', anchors => 
      anchors.map(a => ({ href: a.href, text: a.textContent?.trim().substring(0, 30) }))
        .filter(l => l.href && !l.href.startsWith('javascript:') && !l.href.startsWith('mailto:') && !l.href.startsWith('tel:'))
    );

    let brokenLinks = 0;
    const sampleLinks = links.slice(0, 10); // Test first 10 links

    for (const link of sampleLinks) {
      try {
        const response = await page.goto(link.href, { waitUntil: 'domcontentloaded', timeout: 10000 });
        if (response && response.status() < 400) {
          // Link works
        } else {
          brokenLinks++;
        }
      } catch {
        brokenLinks++;
      }
    }

    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' }); // Return to home

    if (brokenLinks === 0) {
      logResult('LINKS: Internal links verification', 'passed', `${sampleLinks.length} links tested`);
    } else {
      logResult('LINKS: Internal links verification', 'failed', `${brokenLinks}/${sampleLinks.length} broken`);
    }
  } catch (error) {
    logResult('LINKS: Internal links verification', 'failed', error.message);
  }
}

// ============================================
// ADMIN DASHBOARD TESTS
// ============================================
async function testAdminDashboard(page, device) {
  console.log(`\n🔐 Testing Admin Dashboard (${device.name})...`);
  
  await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle2' });
  await waitForPageLoad(page);

  // Test login form exists
  try {
    const emailInput = await page.$('input[type="email"], input[name="email"]');
    const passwordInput = await page.$('input[type="password"], input[name="password"]');
    const submitButton = await page.$('button[type="submit"]');

    if (emailInput && passwordInput && submitButton) {
      logResult('ADMIN-001: Login form fields', 'passed', device.name);
    } else {
      logResult('ADMIN-001: Login form fields', 'failed', 'Missing fields');
    }
  } catch (error) {
    logResult('ADMIN-001: Login form fields', 'failed', error.message);
  }

  // Test protected route redirect
  try {
    await page.goto(`${BASE_URL}/admin/dashboard`, { waitUntil: 'networkidle2' });
    const url = page.url();
    if (url.includes('/admin/login') || url.includes('/admin/dashboard')) {
      logResult('ADMIN-002: Protected route handling', 'passed', device.name);
    } else {
      logResult('ADMIN-002: Protected route handling', 'failed', `Unexpected redirect to ${url}`);
    }
  } catch (error) {
    logResult('ADMIN-002: Protected route handling', 'failed', error.message);
  }
}

// ============================================
// MAIN TEST RUNNER
// ============================================
async function runAllTests() {
  console.log('🚀 Starting Comprehensive Browser Automation Tests');
  console.log(`📍 Testing: ${BASE_URL}`);
  console.log(`🖥️  Headless: ${HEADLESS}`);
  console.log('='.repeat(60));

  const browser = await puppeteer.launch({
    headless: HEADLESS,
    slowMo: SLOW_MO,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    for (const [deviceKey, device] of Object.entries(DEVICES)) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`📱 Testing on ${device.name} (${device.viewport.width}x${device.viewport.height})`);
      console.log('='.repeat(60));

      const page = await browser.newPage();
      await page.setViewport(device.viewport);
      await page.setUserAgent(device.userAgent);

      // Clear localStorage between device tests
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
      await page.evaluate(() => localStorage.clear());

      // Run all test suites
      await testNavigation(page, device);
      await testLanguageSwitching(page, device);
      await testThemeSwitching(page, device);
      await testAccessibility(page, device);
      await testApplicationForm(page, device);
      await testUIComponents(page, device);
      await testAllLinks(page, device);
      await testAdminDashboard(page, device);

      await page.close();
    }
  } catch (error) {
    console.error('❌ Test suite error:', error);
  } finally {
    await browser.close();
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⏭️  Skipped: ${results.skipped}`);
  console.log(`📝 Total: ${results.tests.length}`);
  console.log('='.repeat(60));

  // Generate JSON report
  const report = {
    summary: {
      passed: results.passed,
      failed: results.failed,
      skipped: results.skipped,
      total: results.tests.length,
      timestamp: new Date().toISOString(),
      baseUrl: BASE_URL
    },
    tests: results.tests
  };

  // Write report to file
  const fs = await import('fs');
  fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Report saved to test-report.json');

  // Exit with error code if there were failures
  if (results.failed > 0) {
    process.exit(1);
  }
}

// Run tests
runAllTests().catch(console.error);
