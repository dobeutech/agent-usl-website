import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  try {
    console.log('=== Checking Apply Page Structure ===');
    await page.goto('http://localhost:5000/apply', { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 3000));

    await page.screenshot({ path: 'screenshots/apply-page-full.png', fullPage: true });

    const pageAnalysis = await page.evaluate(() => {
      return {
        url: window.location.href,
        title: document.title,
        bodyTextPreview: document.body.innerText.substring(0, 2000),
        forms: document.querySelectorAll('form').length,
        inputs: Array.from(document.querySelectorAll('input')).map(i => ({
          type: i.type,
          name: i.name,
          id: i.id,
          placeholder: i.placeholder
        })),
        textareas: document.querySelectorAll('textarea').length,
        buttons: Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim().substring(0, 50)),
        checkboxes: document.querySelectorAll('input[type="checkbox"]').length,
        fileInputs: document.querySelectorAll('input[type="file"]').length,
        hasVerificationText: document.body.innerText.toLowerCase().includes('verification') ||
                            document.body.innerText.toLowerCase().includes('verify'),
        hasDuplicateText: document.body.innerText.toLowerCase().includes('duplicate'),
        allText: document.body.innerText
      };
    });

    console.log('\nPage URL:', pageAnalysis.url);
    console.log('Page Title:', pageAnalysis.title);
    console.log('\nForm count:', pageAnalysis.forms);
    console.log('Input count:', pageAnalysis.inputs.length);
    console.log('Checkbox count:', pageAnalysis.checkboxes);
    console.log('File input count:', pageAnalysis.fileInputs);
    console.log('Has verification text:', pageAnalysis.hasVerificationText);
    console.log('Has duplicate text:', pageAnalysis.hasDuplicateText);

    console.log('\nInputs:');
    pageAnalysis.inputs.forEach((input, i) => {
      console.log(`  ${i}: type=${input.type}, name=${input.name}, id=${input.id}`);
    });

    console.log('\nButtons:');
    pageAnalysis.buttons.forEach((btn, i) => {
      console.log(`  ${i}: ${btn}`);
    });

    console.log('\nBody text preview:');
    console.log(pageAnalysis.bodyTextPreview);

  } catch (error) {
    console.error('Error:', error.message);
    await page.screenshot({ path: 'screenshots/apply-error.png', fullPage: true });
  }

  await browser.close();
})();
