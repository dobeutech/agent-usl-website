import puppeteer from 'puppeteer';
import fs from 'fs';

const BASE_URL = 'http://localhost:5000';

// Helper function to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testFeatures() {
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

  // Test feat-001: Hero section displays with compelling headline, subheading, and primary CTA buttons
  try {
    console.log('Testing feat-001: Hero section...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait a moment for React to hydrate
    await wait(2000);

    // Check if hero section is visible - look for section with id="hero" or the first section
    let heroSection = await page.$('section#hero');
    if (!heroSection) {
      // Try to find the first section after navigation
      heroSection = await page.$('main section');
    }

    // Debug: Get page content summary
    const pageContent = await page.evaluate(() => {
      const sections = document.querySelectorAll('section');
      const sectionInfo = [];
      sections.forEach((s, i) => {
        sectionInfo.push({
          index: i,
          id: s.id || 'no-id',
          classes: s.className.substring(0, 100),
          hasH1: !!s.querySelector('h1'),
          hasH2: !!s.querySelector('h2')
        });
      });
      return {
        sectionCount: sections.length,
        sections: sectionInfo,
        h1Text: document.querySelector('h1')?.textContent?.substring(0, 100) || 'no h1',
        buttonCount: document.querySelectorAll('button').length
      };
    });

    console.log('  Page structure:', JSON.stringify(pageContent, null, 2));

    // Check headline
    const headline = await page.$('h1');
    const headlineText = headline ? await page.evaluate(el => el.textContent, headline) : null;

    // Check subtitle (first large paragraph after h1)
    const subtitle = await page.$('main p');
    const subtitleText = subtitle ? await page.evaluate(el => el.textContent, subtitle) : null;

    // Check CTA buttons
    const buttons = await page.$$('main button');

    if (headlineText && buttons.length >= 2) {
      results.passed.push('feat-001: Hero section displays correctly');
      console.log('  ✓ Hero section visible');
      console.log('  ✓ Headline:', headlineText.substring(0, 60) + '...');
      console.log('  ✓ Found ' + buttons.length + ' buttons');
    } else {
      results.failed.push(`feat-001: Hero elements - headline: ${!!headlineText}, buttons: ${buttons.length}`);
    }

    // Take screenshot
    await page.screenshot({ path: 'screenshots/feat-001-hero.png', fullPage: false });
  } catch (error) {
    results.errors.push(`feat-001: ${error.message}`);
    console.error('Error testing feat-001:', error.message);
  }

  // Test feat-002: Services showcase section
  try {
    console.log('\nTesting feat-002: Services section...');

    // Scroll to services section
    const scrolledToServices = await page.evaluate(() => {
      const el = document.getElementById('services');
      if (el) {
        el.scrollIntoView({ behavior: 'instant' });
        return true;
      }
      return false;
    });
    await wait(1000);

    if (!scrolledToServices) {
      results.failed.push('feat-002: Services section not found by id');
    } else {
      // Check for service cards
      const serviceCards = await page.$$('#services [class*="Card"], #services [class*="card"]');
      const sectionTitle = await page.$eval('#services h2', el => el.textContent).catch(() => null);

      // Alternative: count divs with group class
      const groupElements = await page.evaluate(() => {
        const services = document.getElementById('services');
        if (!services) return 0;
        return services.querySelectorAll('.group').length;
      });

      console.log('  Service cards found:', serviceCards.length, 'Group elements:', groupElements);

      if ((serviceCards.length >= 3 || groupElements >= 3) && sectionTitle) {
        results.passed.push('feat-002: Services section displays correctly');
        console.log('  ✓ Services section visible');
        console.log('  ✓ Title:', sectionTitle);
        console.log('  ✓ Found ' + Math.max(serviceCards.length, groupElements) + ' service cards');
      } else {
        results.failed.push(`feat-002: services - cards: ${Math.max(serviceCards.length, groupElements)}, title: ${!!sectionTitle}`);
      }
    }

    await page.screenshot({ path: 'screenshots/feat-002-services.png' });
  } catch (error) {
    results.errors.push(`feat-002: ${error.message}`);
    console.error('Error testing feat-002:', error.message);
  }

  // Test feat-003: Industries served section
  try {
    console.log('\nTesting feat-003: Industries section...');

    const scrolledToIndustries = await page.evaluate(() => {
      const el = document.getElementById('industries');
      if (el) {
        el.scrollIntoView({ behavior: 'instant' });
        return true;
      }
      return false;
    });
    await wait(1000);

    if (!scrolledToIndustries) {
      results.failed.push('feat-003: Industries section not found by id');
    } else {
      const groupElements = await page.evaluate(() => {
        const industries = document.getElementById('industries');
        if (!industries) return 0;
        return industries.querySelectorAll('.group').length;
      });
      const sectionTitle = await page.$eval('#industries h2', el => el.textContent).catch(() => null);

      if (groupElements >= 5 && sectionTitle) {
        results.passed.push('feat-003: Industries section displays correctly');
        console.log('  ✓ Industries section visible');
        console.log('  ✓ Title:', sectionTitle);
        console.log('  ✓ Found ' + groupElements + ' industry cards');
      } else {
        results.failed.push(`feat-003: industries - cards: ${groupElements}, title: ${!!sectionTitle}`);
      }
    }

    await page.screenshot({ path: 'screenshots/feat-003-industries.png' });
  } catch (error) {
    results.errors.push(`feat-003: ${error.message}`);
    console.error('Error testing feat-003:', error.message);
  }

  // Test feat-004: Testimonials section
  try {
    console.log('\nTesting feat-004: Testimonials section...');

    // Scroll down to find testimonials
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight * 0.8);
    });
    await wait(1000);

    // Look for testimonials by checking for quote elements or card structure
    const testimonialData = await page.evaluate(() => {
      // Find all italicized quotes (testimonial quotes)
      const italicElements = document.querySelectorAll('.italic');
      // Find testimonial section by looking for specific text patterns
      const allSections = document.querySelectorAll('section');
      let testimonialSection = null;
      for (const section of allSections) {
        const h2 = section.querySelector('h2');
        if (h2 && h2.textContent) {
          const text = h2.textContent.toLowerCase();
          if (text.includes('testimonial') || text.includes('what our') || text.includes('client') || text.includes('say')) {
            testimonialSection = section;
            break;
          }
        }
      }
      return {
        italicCount: italicElements.length,
        hasTestimonialSection: !!testimonialSection,
        sectionH2: testimonialSection?.querySelector('h2')?.textContent || null,
        cardCount: testimonialSection?.querySelectorAll('[class*="Card"]').length || 0
      };
    });

    console.log('  Testimonial data:', JSON.stringify(testimonialData, null, 2));

    if (testimonialData.hasTestimonialSection && testimonialData.italicCount >= 3) {
      results.passed.push('feat-004: Testimonials section displays correctly');
      console.log('  ✓ Testimonials section visible');
      console.log('  ✓ Title:', testimonialData.sectionH2);
      console.log('  ✓ Found ' + testimonialData.italicCount + ' testimonial quotes');
    } else {
      results.failed.push(`feat-004: testimonials - section: ${testimonialData.hasTestimonialSection}, quotes: ${testimonialData.italicCount}`);
    }

    await page.screenshot({ path: 'screenshots/feat-004-testimonials.png' });
  } catch (error) {
    results.errors.push(`feat-004: ${error.message}`);
    console.error('Error testing feat-004:', error.message);
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
  fs.writeFileSync('test-results.json', JSON.stringify(results, null, 2));

  return results;
}

testFeatures().catch(console.error);
