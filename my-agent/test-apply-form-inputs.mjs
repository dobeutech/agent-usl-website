import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();

// Capture console messages
page.on('console', msg => {
  if (msg.type() === 'log' || msg.type() === 'error') {
    console.log('BROWSER:', msg.text());
  }
});

await page.setViewport({ width: 1280, height: 720 });

await page.goto('http://localhost:5000/', { waitUntil: 'networkidle0', timeout: 30000 });

// Accept cookies
await page.evaluate(() => {
  const btns = Array.from(document.querySelectorAll('button'));
  const btn = btns.find(b => b.textContent.includes('Accept All'));
  if (btn) btn.click();
});
await new Promise(r => setTimeout(r, 1000));

// Scroll to apply section
await page.evaluate(() => {
  const applySection = document.getElementById('apply');
  if (applySection) applySection.scrollIntoView({ behavior: 'instant' });
});
await new Promise(r => setTimeout(r, 500));

// Check the form inputs
const inputs = await page.evaluate(() => {
  const forms = document.querySelectorAll('form');
  const results = [];

  forms.forEach((form, i) => {
    const formInputs = Array.from(form.querySelectorAll('input, select, textarea')).map(el => ({
      type: el.type,
      name: el.name,
      id: el.id,
      placeholder: el.placeholder || ''
    })).slice(0, 10);

    if (formInputs.length > 0) {
      results.push({ formIndex: i, inputs: formInputs });
    }
  });

  return results;
});

console.log('Forms and inputs:', JSON.stringify(inputs, null, 2));

// Check file inputs specifically
const fileInputs = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('input[type="file"]')).map(el => ({
    accept: el.getAttribute('accept'),
    id: el.id,
    name: el.name
  }));
});
console.log('\nFile inputs:', JSON.stringify(fileInputs, null, 2));

await browser.close();
console.log('\nDone!');
