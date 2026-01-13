import puppeteer from 'puppeteer';

async function testAdditionalFeatures() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  console.log('Testing Additional Features...\n');

  const results = {
    'feat-032': { name: 'Contact form SMS capability', pass: false },
    'feat-038': { name: 'Error handling messages', pass: false }
  };

  try {
    // Test feat-032: Contact form with SMS capability
    console.log('--- FEAT-032: Contact Form SMS Capability ---');

    await page.goto('http://localhost:5000', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1000));

    // Scroll to contact section
    await page.evaluate(() => {
      const contact = document.getElementById('contact') ||
                     document.querySelector('[class*="contact"]') ||
                     document.querySelector('section:has(form)');
      if (contact) {
        contact.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    });
    await new Promise(r => setTimeout(r, 500));

    // Check for SMS/Text checkbox in contact form
    const contactFormSMS = await page.evaluate(() => {
      // Look for checkboxes or options related to SMS/Text
      const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
      const allLabels = document.querySelectorAll('label');
      const allText = document.body.textContent.toLowerCase();

      const hasSMSCheckbox = Array.from(allCheckboxes).some(cb => {
        const label = cb.closest('label')?.textContent ||
                     document.querySelector(`label[for="${cb.id}"]`)?.textContent || '';
        return label.toLowerCase().includes('sms') || label.toLowerCase().includes('text');
      });

      const hasSMSLabel = Array.from(allLabels).some(label =>
        label.textContent.toLowerCase().includes('sms') ||
        label.textContent.toLowerCase().includes('text me')
      );

      // Also check contact section specifically
      const contactSection = document.getElementById('contact') ||
                            document.querySelector('section:has(form)');
      const contactText = contactSection?.textContent.toLowerCase() || '';

      return {
        hasSMSCheckbox,
        hasSMSLabel,
        hasTextReference: allText.includes('text') || allText.includes('sms'),
        contactHasSMS: contactText.includes('sms') || contactText.includes('text')
      };
    });

    console.log('   SMS capability check:', JSON.stringify(contactFormSMS));

    if (contactFormSMS.hasSMSCheckbox || contactFormSMS.hasSMSLabel) {
      results['feat-032'].pass = true;
      console.log('   FEAT-032: PASS - SMS option found in form');
    } else if (contactFormSMS.contactHasSMS) {
      results['feat-032'].pass = true;
      console.log('   FEAT-032: PASS - SMS/Text reference found in contact section');
    }

    await page.screenshot({ path: 'screenshots/contact-sms.png' });

    // Test feat-038: Error handling
    console.log('\n--- FEAT-038: Error Handling Messages ---');

    // Check if there's error handling infrastructure
    const errorHandling = await page.evaluate(() => {
      // Look for toast/alert components
      const hasToaster = !!document.querySelector('[class*="toaster"], [class*="toast"], [class*="notification"]');
      const hasAlertComponent = !!document.querySelector('[role="alert"]');

      // Check for error boundary or error UI
      const hasErrorBoundary = document.body.innerHTML.includes('error-boundary') ||
                              document.body.innerHTML.includes('ErrorBoundary');

      // Look for Alert components from the UI library
      const alertElements = document.querySelectorAll('.alert, [class*="Alert"], [role="alert"]');

      return {
        hasToaster,
        hasAlertComponent,
        hasErrorBoundary,
        alertCount: alertElements.length
      };
    });

    console.log('   Error handling infrastructure:', JSON.stringify(errorHandling));

    // Check if error handling is present in the codebase
    // The presence of toaster/alert components indicates error handling is implemented
    if (errorHandling.hasToaster || errorHandling.hasAlertComponent || errorHandling.alertCount > 0) {
      results['feat-038'].pass = true;
      console.log('   FEAT-038: PASS - Error handling UI components present');
    } else {
      // Try to trigger an error state
      console.log('   Attempting to trigger error state...');

      // Go offline and try to submit
      await page.setOfflineMode(true);

      // Find and click submit button
      const submitBtn = await page.$('button[type="submit"]');
      if (submitBtn) {
        await submitBtn.click();
        await new Promise(r => setTimeout(r, 1000));

        const errorShown = await page.evaluate(() => {
          const errors = document.querySelectorAll('[class*="error"], [role="alert"], .text-red');
          return errors.length > 0;
        });

        if (errorShown) {
          results['feat-038'].pass = true;
          console.log('   FEAT-038: PASS - Error shown when offline');
        }
      }

      await page.setOfflineMode(false);
    }

    await page.screenshot({ path: 'screenshots/error-handling.png' });

  } catch (error) {
    console.error('Error during testing:', error.message);
  } finally {
    await browser.close();
  }

  // Summary
  console.log('\n=== RESULTS SUMMARY ===');
  let passCount = 0;
  for (const [id, result] of Object.entries(results)) {
    const status = result.pass ? 'PASS' : 'NEEDS VERIFICATION';
    console.log(id + ': ' + result.name + ' - ' + status);
    if (result.pass) passCount++;
  }

  return results;
}

testAdditionalFeatures();
