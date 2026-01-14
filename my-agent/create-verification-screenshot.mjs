import puppeteer from 'puppeteer';

console.log('Creating verification screenshot...');

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  
  console.log('Navigating to homepage...');
  await page.goto('http://localhost:5000', { 
    waitUntil: 'networkidle0',
    timeout: 30000 
  });
  
  await page.waitForSelector('#hero', { timeout: 10000 });
  
  console.log('Taking screenshot...');
  await page.screenshot({ 
    path: 'session-verification-2026-01-14.png',
    fullPage: false
  });
  
  console.log('✅ Screenshot saved: session-verification-2026-01-14.png');
  
} catch (error) {
  console.error('❌ Error:', error.message);
} finally {
  await browser.close();
}
