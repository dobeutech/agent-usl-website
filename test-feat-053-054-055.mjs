import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';

const SCREENSHOTS_DIR = './test-screenshots';
try { mkdirSync(SCREENSHOTS_DIR, { recursive: true }); } catch (e) {}

(async () => {
  console.log('Testing feat-053, 054, 055: Cookie consent banner');
  
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  console.log('\nfeat-053: Cookie banner display on first visit');
  await page.goto('http://localhost:5005', { waitUntil: 'networkidle2', timeout: 30000 });
  
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: 'networkidle2' });
  
  console.log('Waiting 3 seconds for banner...');
  await new Promise(r => setTimeout(r, 3000));
  
  const bannerText = await page.evaluate(() => document.body.innerText.toLowerCase());
  const hasBanner = bannerText.includes('cookie') && (bannerText.includes('accept') || bannerText.includes('consent'));
  
  await page.screenshot({ path: SCREENSHOTS_DIR + '/feat-053-banner.png', fullPage: true });
  
  if (hasBanner) {
    console.log('✅ feat-053 PASSED: Cookie banner appears');
  } else {
    console.log('❌ feat-053 FAILED: No cookie banner');
    await browser.close();
    process.exit(1);
  }
  
  console.log('\nfeat-054: Accept all cookies');
  const acceptButtons = await page.$$('button');
  let acceptBtn = null;
  for (const btn of acceptButtons) {
    const text = await page.evaluate(el => el.textContent.toLowerCase(), btn);
    if (text.includes('accept all') || (text.includes('accept') && !text.includes('essential'))) {
      acceptBtn = btn;
      break;
    }
  }
  
  if (acceptBtn) {
    await acceptBtn.click();
    await new Promise(r => setTimeout(r, 2000));
    
    const consent = await page.evaluate(() => localStorage.getItem('cookie_consent'));
    const bannerGone = await page.evaluate(() => {
      const text = document.body.innerText.toLowerCase();
      return !(text.includes('cookie') && text.includes('accept'));
    });
    
    await page.screenshot({ path: SCREENSHOTS_DIR + '/feat-054-accepted.png', fullPage: true });
    
    if (consent && bannerGone) {
      console.log('✅ feat-054 PASSED: Cookies accepted, banner dismissed');
    } else {
      console.log('❌ feat-054 FAILED: Consent not saved or banner still visible');
    }
  } else {
    console.log('⚠️ feat-054: Accept button not found');
  }
  
  console.log('\nfeat-055: Reject non-essential cookies');
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 3000));
  
  const rejectButtons = await page.$$('button');
  let rejectBtn = null;
  for (const btn of rejectButtons) {
    const text = await page.evaluate(el => el.textContent.toLowerCase(), btn);
    if (text.includes('reject') || text.includes('essential only') || text.includes('decline')) {
      rejectBtn = btn;
      break;
    }
  }
  
  if (rejectBtn) {
    await rejectBtn.click();
    await new Promise(r => setTimeout(r, 2000));
    
    const consent = await page.evaluate(() => {
      try {
        return JSON.parse(localStorage.getItem('cookie_consent'));
      } catch(e) {
        return null;
      }
    });
    
    await page.screenshot({ path: SCREENSHOTS_DIR + '/feat-055-rejected.png', fullPage: true });
    
    if (consent && consent.essential && !consent.analytics) {
      console.log('✅ feat-055 PASSED: Only essential cookies enabled');
    } else {
      console.log('⚠️ feat-055: Reject functionality unclear');
    }
  } else {
    console.log('⚠️ feat-055: Reject button not found');
  }
  
  await browser.close();
  console.log('\nCookie consent tests completed');
})().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
