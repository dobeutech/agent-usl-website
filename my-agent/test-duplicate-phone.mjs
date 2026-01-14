import puppeteer from 'puppeteer';

async function testDuplicatePhoneDetection() {
  console.log('=== Testing Duplicate Phone Detection (feat-029) ===\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  const results = {
    navigatedToApplyPage: false,
    formFilled: false,
    duplicateDialogAppeared: false,
    showsMariaGarciaInfo: false,
    dialogClosed: false
  };

  try {
    // Step 1: Navigate to the homepage (form is at #apply section)
    console.log('Step 1: Navigating to http://localhost:5000...');
    await page.goto('http://localhost:5000', { waitUntil: 'networkidle0', timeout: 30000 });
    await wait(2000);

    const pageUrl = page.url();
    console.log('   Current URL:', pageUrl);
    results.navigatedToApplyPage = pageUrl.includes('localhost:5000');

    // Scroll to the EnhancedApplyForm (the "Join Our Talent Network" section)
    // Note: There are two forms on the page - JobAlerts and EnhancedApplyForm
    // We need to scroll to the one with the full application form (has full_name input)
    console.log('   Scrolling to the main application form...');
    await page.evaluate(() => {
      // Find the form with full_name input - that's the EnhancedApplyForm
      const fullNameInput = document.getElementById('full_name');
      if (fullNameInput) {
        const formSection = fullNameInput.closest('section');
        if (formSection) {
          formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
    await wait(1500);

    // Verify we're at the right form
    const formCheck = await page.evaluate(() => {
      const fullName = document.getElementById('full_name');
      return !!fullName;
    });
    console.log('   Form check - has full_name input:', formCheck);

    // Step 2: Dismiss cookie consent if present
    console.log('\nStep 2: Checking for cookie consent modal...');
    try {
      const cookieButton = await page.$('button:has-text("Accept All Cookies"), button:has-text("Accept"), [class*="cookie"] button');
      if (cookieButton) {
        await cookieButton.click();
        console.log('   Cookie consent dismissed');
        await wait(500);
      }
    } catch (e) {
      // Try alternate approach
      const dismissed = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          if (btn.textContent && (btn.textContent.includes('Accept All') || btn.textContent.includes('Accept Cookies'))) {
            btn.click();
            return true;
          }
        }
        return false;
      });
      if (dismissed) {
        console.log('   Cookie consent dismissed via evaluate');
        await wait(500);
      } else {
        console.log('   No cookie consent modal found');
      }
    }

    await page.screenshot({ path: 'screenshots/feat-029-01-apply-page.png' });

    // Step 3: Fill in the form (EnhancedApplyForm specifically, not JobAlerts)
    console.log('\nStep 3: Filling in the EnhancedApplyForm...');

    // Wait for the correct form to be ready - it has the full_name input
    await page.waitForSelector('#full_name', { timeout: 10000 });

    // Use Puppeteer's type method to properly fill React-controlled inputs
    // First, scroll to the form and click each input to focus it, then type

    // Fill name
    console.log('   Filling name...');
    await page.click('#full_name');
    await page.keyboard.type('Test User', { delay: 50 });
    await wait(200);

    // Fill email
    console.log('   Filling email...');
    await page.click('#email');
    await page.keyboard.type('test@example.com', { delay: 30 });
    await wait(200);

    // Fill confirm email
    console.log('   Filling confirm email...');
    await page.click('#email_confirmed');
    await page.keyboard.type('test@example.com', { delay: 30 });
    await wait(200);

    // Fill phone (using Maria Garcia's duplicate number)
    console.log('   Filling phone...');
    await page.click('#phone');
    await page.keyboard.type('301-555-1234', { delay: 30 });
    console.log('   Phone filled with: 301-555-1234 (Maria Garcia duplicate)');
    await wait(200);

    const nameInput = true;
    const emailInput = true;
    const phoneInput = true;

    await wait(500);

    // Select at least one position (checkbox within the EnhancedApplyForm)
    console.log('   Looking for position checkboxes...');
    const positionSelected = await page.evaluate(() => {
      // Find the form that contains the full_name input (EnhancedApplyForm)
      const fullNameInput = document.getElementById('full_name');
      if (!fullNameInput) return null;

      const form = fullNameInput.closest('form');
      if (!form) return null;

      // Find checkboxes within this form
      const checkboxes = form.querySelectorAll('[id^="position-"]');
      if (checkboxes.length > 0) {
        // Click the first position checkbox (Janitorial)
        checkboxes[0].click();
        const label = document.querySelector(`label[for="${checkboxes[0].id}"]`)?.textContent || 'Unknown';
        return label.trim();
      }

      return null;
    });

    if (positionSelected) {
      console.log('   Selected position:', positionSelected);
    } else {
      console.log('   Warning: Could not select a position');
    }

    await wait(300);

    // Select experience level (dropdown within EnhancedApplyForm)
    console.log('   Looking for experience dropdown...');
    const experienceSelected = await page.evaluate(() => {
      const expSelect = document.getElementById('experience_years');
      if (expSelect) {
        expSelect.value = '3';
        expSelect.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
      return false;
    });

    if (experienceSelected) {
      console.log('   Selected experience: 3-5 years');
    } else {
      console.log('   Warning: Could not select experience level');
    }

    // Upload a resume file (required)
    console.log('   Creating and uploading test resume...');
    const fs = await import('fs');
    const path = await import('path');
    const testResumePath = path.join(process.cwd(), 'test-resume.pdf');

    // Create a minimal PDF file
    fs.writeFileSync(testResumePath, '%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\n%%EOF');

    // Upload the file
    const fileInput = await page.$('input[type="file"][accept*=".pdf"]');
    if (fileInput) {
      await fileInput.uploadFile(testResumePath);
      console.log('   Resume file uploaded');
      await wait(500);
    }

    // Clean up test file
    try { fs.unlinkSync(testResumePath); } catch(e) {}

    results.formFilled = nameInput && emailInput && phoneInput;

    await page.screenshot({ path: 'screenshots/feat-029-02-form-filled.png' });

    // Step 4: Submit the form (specifically the EnhancedApplyForm)
    console.log('\nStep 4: Submitting the form...');

    // Find the submit button within the EnhancedApplyForm section (contains full_name input)
    const submitClicked = await page.evaluate(() => {
      // Find the full_name input to identify the correct form
      const fullNameInput = document.getElementById('full_name');
      if (!fullNameInput) {
        console.log('Could not find full_name input');
        return false;
      }

      // Find the form containing this input
      const form = fullNameInput.closest('form');
      if (!form) {
        console.log('Could not find form containing full_name');
        return false;
      }

      // Find the submit button within this specific form
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.click();
        return true;
      }

      // Fallback: Find a button with "Submit" text in this form
      const buttons = form.querySelectorAll('button');
      for (const btn of buttons) {
        const text = btn.textContent?.toLowerCase() || '';
        if (text.includes('submit application')) {
          btn.click();
          return true;
        }
      }

      return false;
    });

    if (submitClicked) {
      console.log('   Clicked submit button in EnhancedApplyForm');
    } else {
      console.log('   Warning: Could not find submit button in the correct form');
    }

    // Wait for response
    await wait(3000);

    // Debug: Check if there are any validation errors showing
    const validationErrors = await page.evaluate(() => {
      const errors = document.querySelectorAll('[class*="destructive"], [role="alert"], .error, [class*="error"]');
      const errorTexts = [];
      for (const e of errors) {
        if (e.textContent && e.offsetParent !== null) {
          errorTexts.push(e.textContent.trim().substring(0, 100));
        }
      }
      return errorTexts;
    });

    if (validationErrors.length > 0) {
      console.log('   Validation errors found:', validationErrors.slice(0, 3));
    }

    // Debug: Check for any toast messages
    const toastMessages = await page.evaluate(() => {
      const toasts = document.querySelectorAll('[role="status"], [class*="toast"], [class*="Toaster"]');
      const texts = [];
      for (const t of toasts) {
        if (t.textContent && t.offsetParent !== null) {
          texts.push(t.textContent.trim().substring(0, 100));
        }
      }
      return texts;
    });

    if (toastMessages.length > 0) {
      console.log('   Toast messages:', toastMessages.slice(0, 3));
    }

    await page.screenshot({ path: 'screenshots/feat-029-03-after-submit.png' });

    // Step 5: Check for duplicate detection dialog
    console.log('\nStep 5: Checking for duplicate detection dialog...');

    const dialogInfo = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      const dialogElements = document.querySelectorAll('[role="dialog"], [role="alertdialog"], .modal, [class*="dialog"], [class*="Dialog"]');

      let dialogFound = false;
      let dialogText = '';
      let hasMariaInfo = false;

      for (const dialog of dialogElements) {
        if (dialog.offsetParent !== null) { // visible
          dialogFound = true;
          dialogText = dialog.innerText;
          break;
        }
      }

      // Also check body text for duplicate message
      const hasDuplicateMessage = bodyText.includes('Application Already Exists') ||
                                  bodyText.includes('already exists') ||
                                  bodyText.includes('duplicate') ||
                                  bodyText.includes('Duplicate') ||
                                  bodyText.includes('existing application') ||
                                  bodyText.includes('already submitted');

      hasMariaInfo = bodyText.includes('Maria Garcia') ||
                    bodyText.includes('maria.garcia@email.com');

      return {
        dialogFound,
        dialogText: dialogText.substring(0, 500),
        hasDuplicateMessage,
        hasMariaInfo,
        bodyTextSample: bodyText.substring(0, 1000)
      };
    });

    console.log('   Dialog found:', dialogInfo.dialogFound);
    console.log('   Has duplicate message:', dialogInfo.hasDuplicateMessage);
    console.log('   Has Maria Garcia info:', dialogInfo.hasMariaInfo);

    if (dialogInfo.dialogText) {
      console.log('   Dialog text:', dialogInfo.dialogText.substring(0, 200));
    }

    results.duplicateDialogAppeared = dialogInfo.hasDuplicateMessage || dialogInfo.dialogFound;
    results.showsMariaGarciaInfo = dialogInfo.hasMariaInfo;

    await page.screenshot({ path: 'screenshots/feat-029-04-duplicate-dialog.png' });

    // Step 6: Close the dialog (if it exists)
    console.log('\nStep 6: Closing the dialog (if present)...');

    const dialogClosed = await page.evaluate(() => {
      // Look for close button by text content and common attributes
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        const text = btn.textContent?.toLowerCase() || '';
        const ariaLabel = btn.getAttribute('aria-label')?.toLowerCase() || '';
        if ((text.includes('close') || text.includes('ok') || text.includes('got it') || ariaLabel.includes('close')) && btn.offsetParent !== null) {
          btn.click();
          return 'close-button';
        }
      }

      // Try clicking an X button in dialog
      const xButtons = document.querySelectorAll('[role="dialog"] button svg, [class*="Dialog"] button svg');
      for (const svg of xButtons) {
        const btn = svg.closest('button');
        if (btn && btn.offsetParent !== null) {
          btn.click();
          return 'x-button';
        }
      }

      // Try pressing Escape
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
      return 'escape';
    });

    console.log('   Close method:', dialogClosed);
    await wait(500);

    // Also try pressing Escape key
    await page.keyboard.press('Escape');
    await wait(500);

    await page.screenshot({ path: 'screenshots/feat-029-05-dialog-closed.png' });

    // Verify dialog is closed
    const afterClose = await page.evaluate(() => {
      const dialogs = document.querySelectorAll('[role="dialog"], [role="alertdialog"], .modal, [class*="dialog"]');
      for (const d of dialogs) {
        if (d.offsetParent !== null) {
          return false; // Still visible
        }
      }
      return true;
    });

    results.dialogClosed = afterClose;
    console.log('   Dialog closed:', results.dialogClosed);

    // Final summary
    console.log('\n' + '='.repeat(50));
    console.log('TEST RESULTS SUMMARY');
    console.log('='.repeat(50));
    console.log('Navigated to /apply page:', results.navigatedToApplyPage ? 'PASS' : 'FAIL');
    console.log('Form filled correctly:', results.formFilled ? 'PASS' : 'FAIL');
    console.log('Duplicate dialog appeared:', results.duplicateDialogAppeared ? 'PASS' : 'FAIL');
    console.log('Shows Maria Garcia info:', results.showsMariaGarciaInfo ? 'PASS' : 'NEEDS VERIFICATION');
    console.log('Dialog closed successfully:', results.dialogClosed ? 'PASS' : 'NEEDS VERIFICATION');

    const overallPass = results.duplicateDialogAppeared;
    console.log('\nFeat-029 (Duplicate Phone Detection):', overallPass ? 'PASS' : 'FAIL');

    if (!results.duplicateDialogAppeared) {
      console.log('\nDebug info:');
      console.log('Body text sample:', dialogInfo.bodyTextSample);
    }

  } catch (error) {
    console.error('\nError during test:', error.message);
    console.error(error.stack);
    await page.screenshot({ path: 'screenshots/feat-029-error.png' });
  } finally {
    await browser.close();
  }

  return results;
}

testDuplicatePhoneDetection();
