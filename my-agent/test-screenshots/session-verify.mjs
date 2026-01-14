import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // Collect console messages
  const consoleMessages = [];
  const consoleErrors = [];

  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleMessages.push({ type, text });
    if (type === 'error') {
      consoleErrors.push(text);
    }
  });

  page.on('pageerror', error => {
    consoleErrors.push(`Page Error: ${error.message}`);
  });

  try {
    console.log('=== Homepage Verification Test ===\n');

    // Navigate to homepage
    console.log('Navigating to http://localhost:5000...');
    await page.goto('http://localhost:5000', { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Take screenshot
    await page.screenshot({
      path: 'E:/cursor/cursor-projects/uniquestaffingprofessionals/unique-staffing-prof/my-agent/test-screenshots/session-verify.png',
      fullPage: true
    });
    console.log('Screenshot saved to: test-screenshots/session-verify.png\n');

    // Analyze page content
    const analysis = await page.evaluate(() => {
      const result = {
        url: window.location.href,
        title: document.title,
        heroSection: null,
        navigation: null,
        pageStructure: {
          headings: [],
          sections: [],
          links: []
        }
      };

      // Check for hero section
      const heroSelectors = [
        '[class*="hero"]',
        'section:first-of-type',
        '.bg-gradient',
        '[class*="banner"]',
        'main > section:first-child',
        'main > div:first-child'
      ];

      for (const selector of heroSelectors) {
        const el = document.querySelector(selector);
        if (el) {
          const text = el.textContent.trim().substring(0, 300);
          const hasHeading = el.querySelector('h1, h2') !== null;
          const hasButton = el.querySelector('button, a[href]') !== null;
          if (text.length > 50 || hasHeading) {
            result.heroSection = {
              found: true,
              selector: selector,
              hasHeading,
              hasButton,
              textPreview: text.replace(/\s+/g, ' ').substring(0, 200)
            };
            break;
          }
        }
      }

      if (!result.heroSection) {
        // Fallback: check first substantial content area
        const mainContent = document.querySelector('main') || document.body;
        const firstSection = mainContent.querySelector('section, div > div');
        if (firstSection) {
          result.heroSection = {
            found: true,
            selector: 'fallback',
            hasHeading: firstSection.querySelector('h1, h2') !== null,
            hasButton: firstSection.querySelector('button, a') !== null,
            textPreview: firstSection.textContent.trim().replace(/\s+/g, ' ').substring(0, 200)
          };
        } else {
          result.heroSection = { found: false };
        }
      }

      // Check for navigation
      const navSelectors = ['nav', 'header', '[role="navigation"]', '[class*="nav"]'];
      for (const selector of navSelectors) {
        const nav = document.querySelector(selector);
        if (nav) {
          const links = Array.from(nav.querySelectorAll('a')).map(a => ({
            text: a.textContent.trim(),
            href: a.getAttribute('href')
          })).filter(l => l.text && l.href);

          if (links.length > 0) {
            result.navigation = {
              found: true,
              selector: selector,
              linkCount: links.length,
              links: links.slice(0, 10)
            };
            break;
          }
        }
      }

      if (!result.navigation) {
        result.navigation = { found: false };
      }

      // Get page structure
      document.querySelectorAll('h1, h2, h3').forEach(h => {
        result.pageStructure.headings.push({
          tag: h.tagName,
          text: h.textContent.trim().substring(0, 100)
        });
      });

      document.querySelectorAll('section, [class*="section"]').forEach((section, i) => {
        if (i < 10) {
          result.pageStructure.sections.push({
            className: section.className,
            textPreview: section.textContent.trim().substring(0, 100).replace(/\s+/g, ' ')
          });
        }
      });

      return result;
    });

    // Report findings
    console.log('=== VERIFICATION RESULTS ===\n');

    console.log('Page Info:');
    console.log(`  URL: ${analysis.url}`);
    console.log(`  Title: ${analysis.title}\n`);

    // Hero Section Check
    console.log('1. HERO SECTION:');
    if (analysis.heroSection && analysis.heroSection.found) {
      console.log('   Status: FOUND');
      console.log(`   Selector: ${analysis.heroSection.selector}`);
      console.log(`   Has Heading: ${analysis.heroSection.hasHeading ? 'Yes' : 'No'}`);
      console.log(`   Has CTA Button: ${analysis.heroSection.hasButton ? 'Yes' : 'No'}`);
      console.log(`   Content Preview: "${analysis.heroSection.textPreview.substring(0, 100)}..."`);
    } else {
      console.log('   Status: NOT FOUND');
    }

    // Navigation Check
    console.log('\n2. NAVIGATION:');
    if (analysis.navigation && analysis.navigation.found) {
      console.log('   Status: FOUND');
      console.log(`   Selector: ${analysis.navigation.selector}`);
      console.log(`   Link Count: ${analysis.navigation.linkCount}`);
      console.log('   Navigation Links:');
      analysis.navigation.links.forEach(link => {
        console.log(`     - "${link.text}" -> ${link.href}`);
      });
    } else {
      console.log('   Status: NOT FOUND');
    }

    // Console Errors Check
    console.log('\n3. CONSOLE ERRORS:');
    if (consoleErrors.length === 0) {
      console.log('   Status: NO ERRORS');
      console.log('   The page loaded without any console errors.');
    } else {
      console.log(`   Status: ${consoleErrors.length} ERROR(S) FOUND`);
      consoleErrors.forEach((error, i) => {
        console.log(`   ${i + 1}. ${error.substring(0, 200)}`);
      });
    }

    // Page Structure
    console.log('\n=== PAGE STRUCTURE ===\n');
    console.log('Headings found:');
    analysis.pageStructure.headings.forEach(h => {
      console.log(`  <${h.tag.toLowerCase()}>: ${h.text}`);
    });

    // Summary
    console.log('\n=== SUMMARY ===\n');
    const heroOk = analysis.heroSection && analysis.heroSection.found;
    const navOk = analysis.navigation && analysis.navigation.found;
    const noErrors = consoleErrors.length === 0;

    console.log(`Hero Section:  ${heroOk ? 'PASS' : 'FAIL'}`);
    console.log(`Navigation:    ${navOk ? 'PASS' : 'FAIL'}`);
    console.log(`No Errors:     ${noErrors ? 'PASS' : 'FAIL'}`);
    console.log(`\nOverall: ${heroOk && navOk && noErrors ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED'}`);

  } catch (error) {
    console.error('Error during test:', error.message);
    await page.screenshot({
      path: 'E:/cursor/cursor-projects/uniquestaffingprofessionals/unique-staffing-prof/my-agent/test-screenshots/session-verify-error.png',
      fullPage: true
    });
  }

  await browser.close();
  console.log('\nBrowser closed.');
})();
