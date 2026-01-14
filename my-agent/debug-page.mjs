import puppeteer from 'puppeteer';

async function debugPage() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  // Capture console logs
  page.on('console', msg => {
    console.log('Browser console:', msg.type(), msg.text());
  });

  // Capture errors
  page.on('pageerror', error => {
    console.log('Page error:', error.message);
  });

  console.log('Navigating to http://localhost:5001...');
  await page.goto('http://localhost:5001', { waitUntil: 'networkidle0', timeout: 60000 });

  // Wait longer for React to render
  console.log('Waiting for React to render...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Get page HTML
  const html = await page.content();
  console.log('\n=== HTML Length:', html.length);
  console.log('=== First 500 chars of body:');
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    console.log(bodyMatch[1].substring(0, 500));
  }

  // Get DOM info
  const domInfo = await page.evaluate(() => {
    return {
      title: document.title,
      bodyChildren: document.body.children.length,
      hasRoot: !!document.getElementById('root'),
      rootChildren: document.getElementById('root')?.children.length || 0,
      rootInnerHTML: document.getElementById('root')?.innerHTML?.substring(0, 200) || 'empty',
      allElementsCount: document.querySelectorAll('*').length
    };
  });

  console.log('\n=== DOM Info:');
  console.log(JSON.stringify(domInfo, null, 2));

  // Take screenshot
  await page.screenshot({ path: 'my-agent/screenshots/debug-page.png', fullPage: true });
  console.log('\nScreenshot saved to my-agent/screenshots/debug-page.png');

  await browser.close();
}

debugPage().catch(console.error);
