import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // Enable console logging
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR:', msg.text());
    }
  });

  try {
    console.log('=== Testing Homepage Load ===');
    console.log('Navigating to homepage...');

    await page.goto('http://localhost:5000', { waitUntil: 'networkidle0', timeout: 60000 });

    // Take screenshot immediately
    await page.screenshot({ path: 'screenshots/homepage-initial.png', fullPage: true });
    console.log('Initial screenshot taken');

    // Wait for content to load (up to 15 seconds)
    console.log('Waiting for content to load...');
    for (let i = 0; i < 15; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const hasContent = await page.evaluate(() => {
        const text = document.body.innerText;
        return text.includes('Opportunity') || text.includes('Staffing') || text.includes('Unique');
      });

      if (hasContent) {
        console.log(`Content loaded after ${i + 1} seconds`);
        break;
      }

      if (i === 14) {
        console.log('Content still not loaded after 15 seconds');
      }
    }

    await page.screenshot({ path: 'screenshots/homepage-after-wait.png', fullPage: true });
    console.log('After-wait screenshot taken');

    // Check page state
    const pageState = await page.evaluate(() => {
      return {
        url: window.location.href,
        bodyText: document.body.innerText.substring(0, 1500),
        hasLoading: document.body.innerText.includes('Loading'),
        hasHero: !!document.querySelector('#hero'),
        hasNav: !!document.querySelector('nav'),
        divCount: document.querySelectorAll('div').length,
        hasForm: document.querySelectorAll('form').length > 0,
        buttons: document.querySelectorAll('button').length
      };
    });

    console.log('\n=== Page State ===');
    console.log('URL:', pageState.url);
    console.log('Has Loading text:', pageState.hasLoading);
    console.log('Has Hero section:', pageState.hasHero);
    console.log('Has Nav:', pageState.hasNav);
    console.log('Div count:', pageState.divCount);
    console.log('Has Form:', pageState.hasForm);
    console.log('Button count:', pageState.buttons);
    console.log('\nBody text preview:');
    console.log(pageState.bodyText);

  } catch (error) {
    console.error('Error:', error.message);
    await page.screenshot({ path: 'screenshots/homepage-error.png', fullPage: true });
  }

  await browser.close();
  console.log('\n=== Test complete ===');
})();
