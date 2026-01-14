import puppeteer from 'puppeteer';

async function test() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  
  const page = await browser.newPage();
  console.log('Navigating to localhost:5000...');
  
  try {
    await page.goto('http://localhost:5000', { waitUntil: 'domcontentloaded', timeout: 60000 });
    console.log('Page loaded!');
    const title = await page.title();
    console.log('Title:', title);
    const content = await page.content();
    console.log('Content length:', content.length);
  } catch (e) {
    console.log('Error:', e.message);
  }
  
  await browser.close();
  console.log('Done');
}

test();

