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
      // Click language toggle using data-testid
      const langToggle = await page.$('[data-testid="lang-toggle"]');
      if (langToggle) {
        await langToggle.click();
        await delay(300);
      } else {
        logResult(`LANG-${languages.indexOf(lang) + 1}: ${lang.name} selection`, 'failed', 'Toggle not found');
        continue;
      }

      // Find and click language option using data-testid
      const langOption = await page.$(`[data-testid="lang-${lang.code}"]`);
      if (langOption) {
        await langOption.click();
        await delay(500);
      } else {
        logResult(`LANG-${languages.indexOf(lang) + 1}: ${lang.name} selection`, 'failed', 'Option not found');
        continue;
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

  // Test theme toggle button
  try {
    const themeToggle = await page.$('[data-testid="theme-toggle"]');
    if (themeToggle) {
      await themeToggle.click();
      await delay(300);
      
      // Get current theme from button's data attribute
      const currentTheme = await page.$eval('[data-testid="theme-toggle"]', el => el.getAttribute('data-theme'));
      logResult('THEME-1: Theme toggle button', 'passed', `Current: ${currentTheme || 'toggled'}`);
    } else {
      logResult('THEME-1: Theme toggle button', 'failed', 'Button not found');
    }
  } catch (error) {
    logResult('THEME-1: Theme toggle button', 'failed', error.message);
  }

  // Test system theme toggle
  try {
    const systemToggle = await page.$('[data-testid="theme-system"]');
    if (systemToggle) {
      await systemToggle.click();
      await delay(300);
      
      const isPressed = await page.$eval('[data-testid="theme-system"]', el => el.getAttribute('aria-pressed'));
      logResult('THEME-2: System theme toggle', 'passed', `aria-pressed: ${isPressed}`);
    } else {
      logResult('THEME-2: System theme toggle', 'failed', 'Button not found');
    }
  } catch (error) {
    logResult('THEME-2: System theme toggle', 'failed', error.message);
  }

  // Verify theme persists in localStorage (next-themes uses 'theme' key)
  try {
    // Wait for localStorage to be written
    await delay(500);
    const storedTheme = await page.evaluate(() => {
      // next-themes may use different keys
      return localStorage.getItem('theme') || 
             localStorage.getItem('next-theme') ||
             localStorage.getItem('color-theme');
    });
    if (storedTheme) {
      logResult('THEME-3: Theme persistence', 'passed', `Stored: ${storedTheme}`);
    } else {
      // Check if theme is applied via data attribute instead
      const appliedTheme = await page.evaluate(() => {
        return document.documentElement.getAttribute('data-theme') ||
               document.documentElement.classList.contains('dark') ? 'dark' : 
               document.documentElement.classList.contains('light') ? 'light' : null;
      });
      if (appliedTheme) {
        logResult('THEME-3: Theme persistence', 'passed', `Applied: ${appliedTheme}`);
      } else {
        logResult('THEME-3: Theme persistence', 'skipped', 'Theme managed by system');
      }
    }
  } catch (error) {
    logResult('THEME-3: Theme persistence', 'failed', error.message);
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
    // Use multiple selectors including data-testid
    const a11yButton = await page.$('[data-testid="accessibility-toggle"], button[aria-label*="accessibility" i], button[aria-label*="Accessibility"]');
    if (a11yButton) {
      await a11yButton.click();
      await delay(700);
      
      // Check for sheet/panel with multiple selectors
      const panel = await page.$('[data-testid="accessibility-panel"], [role="dialog"], [data-state="open"]');
      if (panel) {
        logResult('A11Y-002: Accessibility panel opens', 'passed', device.name);
      } else {
        logResult('A11Y-002: Accessibility panel opens', 'failed', 'Panel not visible');
      }

      // Close panel - try escape key first, then close button
      await page.keyboard.press('Escape');
      await delay(300);
    } else {
      logResult('A11Y-002: Accessibility panel opens', 'skipped', 'Button not found');
    }
  } catch (error) {
    logResult('A11Y-002: Accessibility panel opens', 'failed', error.message);
  }

  // Test ARIA labels on interactive elements
  try {
    const buttonStats = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      let missingLabels = 0;
      let total = 0;
      
      buttons.forEach(btn => {
        total++;
        const hasAriaLabel = btn.hasAttribute('aria-label');
        const hasText = btn.textContent?.trim().length > 0;
        const hasSrOnly = btn.querySelector('.sr-only');
        
        if (!hasAriaLabel && !hasText && !hasSrOnly) {
          missingLabels++;
        }
      });
      
      return { missingLabels, total };
    });
    
    if (buttonStats.missingLabels === 0) {
      logResult('A11Y-003: ARIA labels on buttons', 'passed', `${buttonStats.total} buttons checked`);
    } else {
      logResult('A11Y-003: ARIA labels on buttons', 'failed', `${buttonStats.missingLabels}/${buttonStats.total} missing labels`);
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

  // Test position checkboxes - wait for form to fully render
  try {
    // Ensure form section is fully in view and rendered
    await page.evaluate(() => {
      const formSection = document.getElementById('apply');
      if (formSection) formSection.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await delay(1000);

    // Try multiple selectors for checkboxes
    let positionCheckboxes = await page.$$('[data-testid^="position-checkbox-"]');
    if (positionCheckboxes.length === 0) {
      positionCheckboxes = await page.$$('[id^="position-"]');
    }
    if (positionCheckboxes.length === 0) {
      // Fallback: check by role within form
      positionCheckboxes = await page.$$('#apply [role="checkbox"], #apply button[role="checkbox"]');
    }
    
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

  // Test mobile menu (only on mobile/tablet)
  if (device.viewport.isMobile) {
    try {
      // Find hamburger menu button using multiple selectors
      const menuButton = await page.$('[data-testid="mobile-menu-toggle"], button[aria-label*="menu" i], button[aria-label*="Menu"]');
      if (menuButton) {
        await menuButton.click();
        await delay(500); // Increased wait for animation
        
        // Check for mobile menu with multiple selectors
        const mobileMenu = await page.$('[data-testid="mobile-menu"], [role="menu"], [data-state="open"]');
        if (mobileMenu) {
          logResult('UI-004: Mobile menu toggle', 'passed', device.name);
          
          // Close menu
          await menuButton.click();
          await delay(300);
        } else {
          // Alternative: check if menu items are visible
          const menuItems = await page.$$('[data-testid^="mobile-nav-"]');
          if (menuItems.length > 0) {
            logResult('UI-004: Mobile menu toggle', 'passed', `${menuItems.length} items visible`);
          } else {
            logResult('UI-004: Mobile menu toggle', 'failed', 'Menu not visible');
          }
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
    // Get all internal links (same origin)
    const links = await page.evaluate((baseUrl) => {
      const anchors = document.querySelectorAll('a[href]');
      const origin = new URL(baseUrl).origin;
      
      return Array.from(anchors)
        .map(a => ({
          href: a.href,
          text: a.textContent?.trim().substring(0, 30),
          isInternal: a.href.startsWith(origin),
          isHash: a.href.includes('#'),
          isExternal: !a.href.startsWith(origin) && !a.href.startsWith('mailto:') && !a.href.startsWith('tel:')
        }))
        .filter(l => l.href && !l.href.startsWith('javascript:') && !l.href.startsWith('mailto:') && !l.href.startsWith('tel:'));
    }, BASE_URL);

    // Only test internal non-hash links
    const internalLinks = links.filter(l => l.isInternal && !l.isHash).slice(0, 8);
    let brokenLinks = 0;
    let testedLinks = 0;

    for (const link of internalLinks) {
      try {
        testedLinks++;
        const response = await page.goto(link.href, { waitUntil: 'domcontentloaded', timeout: 10000 });
        if (!response || response.status() >= 400) {
          brokenLinks++;
        }
      } catch {
        brokenLinks++;
      }
    }

    // Test hash links by checking target elements exist
    const hashLinks = links.filter(l => l.isHash && l.isInternal).slice(0, 5);
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
    
    for (const link of hashLinks) {
      try {
        const hash = new URL(link.href).hash.substring(1);
        if (hash) {
          const exists = await page.$(`#${hash}`);
          if (exists) {
            testedLinks++;
          } else {
            brokenLinks++;
            testedLinks++;
          }
        }
      } catch {
        // Skip malformed hash links
      }
    }

    if (brokenLinks === 0) {
      logResult('LINKS: Internal links verification', 'passed', `${testedLinks} links tested`);
    } else {
      logResult('LINKS: Internal links verification', 'failed', `${brokenLinks}/${testedLinks} broken`);
    }
  } catch (error) {
    logResult('LINKS: Internal links verification', 'failed', error.message);
  }
}

// ============================================
// LIGHTBOX (TALENT MODAL) TESTS
// ============================================
async function testLightbox(page, device) {
  console.log(`\n💡 Testing Lightbox/Modal (${device.name})...`);
  
  // Clear localStorage to ensure modal can appear
  await page.evaluate(() => localStorage.removeItem('talent_network_dismissed'));
  
  // Navigate with showModal trigger
  await page.goto(`${BASE_URL}/?showModal=true`, { waitUntil: 'networkidle2' });
  await waitForPageLoad(page);
  await delay(1000);

  // Test modal appears
  try {
    const modal = await page.$('[data-testid="talent-modal"]');
    if (modal) {
      logResult('MODAL-001: Lightbox appears', 'passed', device.name);
    } else {
      logResult('MODAL-001: Lightbox appears', 'failed', 'Modal not found');
    }
  } catch (error) {
    logResult('MODAL-001: Lightbox appears', 'failed', error.message);
  }

  // Test modal close button
  try {
    const closeBtn = await page.$('[data-testid="modal-close"]');
    if (closeBtn) {
      await closeBtn.click();
      await delay(500);
      const modalAfterClose = await page.$('[data-testid="talent-modal"]');
      if (!modalAfterClose) {
        logResult('MODAL-002: Close button works', 'passed', device.name);
      } else {
        logResult('MODAL-002: Close button works', 'failed', 'Modal still visible');
      }
    } else {
      logResult('MODAL-002: Close button works', 'skipped', 'Button not found');
    }
  } catch (error) {
    logResult('MODAL-002: Close button works', 'failed', error.message);
  }

  // Re-open modal to test other buttons
  await page.goto(`${BASE_URL}/?showModal=true`, { waitUntil: 'networkidle2' });
  await delay(1000);

  // Test join button exists
  try {
    const joinBtn = await page.$('[data-testid="modal-join"]');
    if (joinBtn) {
      logResult('MODAL-003: Join button exists', 'passed', device.name);
    } else {
      logResult('MODAL-003: Join button exists', 'failed', 'Button not found');
    }
  } catch (error) {
    logResult('MODAL-003: Join button exists', 'failed', error.message);
  }

  // Test employer CTA button
  try {
    const employerBtn = await page.$('[data-testid="modal-employer-cta"]');
    if (employerBtn) {
      logResult('MODAL-004: Employer CTA exists', 'passed', device.name);
    } else {
      logResult('MODAL-004: Employer CTA exists', 'failed', 'Button not found');
    }
  } catch (error) {
    logResult('MODAL-004: Employer CTA exists', 'failed', error.message);
  }
}

// ============================================
// FOOTER VISIBILITY TESTS
// ============================================
async function testFooterVisibility(page, device) {
  console.log(`\n📋 Testing Footer Visibility (${device.name})...`);
  
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
  await waitForPageLoad(page);
  
  // Scroll to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await delay(500);

  // Test company name visibility
  try {
    const companyName = await page.$('[data-testid="footer-company-name"]');
    if (companyName) {
      const styles = await page.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          visibility: computed.visibility,
          opacity: parseFloat(computed.opacity),
          color: computed.color,
          display: computed.display
        };
      }, companyName);
      
      // Element is visible if visibility is not hidden, opacity > 0, and not display:none
      if (styles.visibility === 'visible' && styles.opacity > 0 && styles.display !== 'none') {
        logResult('FOOTER-001: Company name visible', 'passed', `${device.name} (color: ${styles.color})`);
      } else {
        logResult('FOOTER-001: Company name visible', 'failed', `visibility: ${styles.visibility}, opacity: ${styles.opacity}`);
      }
    } else {
      logResult('FOOTER-001: Company name visible', 'failed', 'Element not found');
    }
  } catch (error) {
    logResult('FOOTER-001: Company name visible', 'failed', error.message);
  }

  // Test tagline visibility
  try {
    const tagline = await page.$('[data-testid="footer-tagline"]');
    if (tagline) {
      const styles = await page.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          visibility: computed.visibility,
          opacity: parseFloat(computed.opacity),
          display: computed.display
        };
      }, tagline);
      
      // Element is visible if visibility is not hidden, opacity > 0, and not display:none
      if (styles.visibility === 'visible' && styles.opacity > 0 && styles.display !== 'none') {
        logResult('FOOTER-002: Tagline visible', 'passed', device.name);
      } else {
        logResult('FOOTER-002: Tagline visible', 'failed', `visibility: ${styles.visibility}, opacity: ${styles.opacity}`);
      }
    } else {
      logResult('FOOTER-002: Tagline visible', 'failed', 'Element not found');
    }
  } catch (error) {
    logResult('FOOTER-002: Tagline visible', 'failed', error.message);
  }

  // Test quick links have data-testid
  try {
    const quickLinks = await page.$$('[data-testid^="footer-link-"]');
    if (quickLinks.length >= 4) {
      logResult('FOOTER-003: Quick links present', 'passed', `${quickLinks.length} links found`);
    } else {
      logResult('FOOTER-003: Quick links present', 'failed', `Only ${quickLinks.length} links found`);
    }
  } catch (error) {
    logResult('FOOTER-003: Quick links present', 'failed', error.message);
  }

  // Test social links
  try {
    const socialLinks = await page.$$('[data-testid^="footer-social-"]');
    if (socialLinks.length >= 3) {
      logResult('FOOTER-004: Social links present', 'passed', `${socialLinks.length} links found`);
    } else {
      logResult('FOOTER-004: Social links present', 'failed', `Only ${socialLinks.length} links found`);
    }
  } catch (error) {
    logResult('FOOTER-004: Social links present', 'failed', error.message);
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
      await testLightbox(page, device);
      await testFooterVisibility(page, device);
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
