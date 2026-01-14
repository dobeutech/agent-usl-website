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

  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });

  try {
    console.log('=== Checking Apply Page Structure ===');
    await page.goto('http://localhost:5000/apply', { waitUntil: 'networkidle0', timeout: 60000 });

    // Wait for React to render
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Try clicking accept cookies
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const acceptBtn = buttons.find(b => b.textContent.includes('Accept All'));
      if (acceptBtn) acceptBtn.click();
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    await page.screenshot({ path: 'screenshots/apply-page-after-cookie.png', fullPage: true });

    const pageAnalysis = await page.evaluate(() => {
      return {
        url: window.location.href,
        html: document.body.innerHTML.substring(0, 3000),
        bodyText: document.body.innerText.substring(0, 2000),
        forms: document.querySelectorAll('form').length,
        inputs: Array.from(document.querySelectorAll('input')).map(i => ({
          type: i.type,
          name: i.name,
          id: i.id
        })),
        divCount: document.querySelectorAll('div').length,
        mainContent: document.querySelector('main')?.innerHTML?.substring(0, 500) || 'no main'
      };
    });

    console.log('URL:', pageAnalysis.url);
    console.log('Div count:', pageAnalysis.divCount);
    console.log('Form count:', pageAnalysis.forms);
    console.log('Input count:', pageAnalysis.inputs.length);
    console.log('\nInputs:', pageAnalysis.inputs);
    console.log('\nBody text:', pageAnalysis.bodyText.substring(0, 1000));
    console.log('\nHTML preview:', pageAnalysis.html.substring(0, 1000));

  } catch (error) {
    console.error('Error:', error.message);
    await page.screenshot({ path: 'screenshots/apply-error2.png', fullPage: true });
  }

  await browser.close();
})();
