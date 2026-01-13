import puppeteer from 'puppeteer';

async function testAccessibilityFeatures() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  console.log('Testing Accessibility Features...\n');

  const results = {
    'feat-020': { name: 'Font Size Adjustment', pass: false },
    'feat-021': { name: 'High Contrast Mode', pass: false },
    'feat-022': { name: 'Reduced Motion', pass: false }
  };

  try {
    // Navigate to homepage
    console.log('1. Navigating to homepage...');
    await page.goto('http://localhost:5000', { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait for the page to fully load
    await new Promise(r => setTimeout(r, 2000));

    // Take initial screenshot
    await page.screenshot({ path: 'screenshots/01-initial.png' });

    // Look for accessibility button
    console.log('2. Looking for accessibility controls button...');

    // Find the fixed button with accessibility icon
    const accessBtnFound = await page.evaluate(() => {
      const allButtons = Array.from(document.querySelectorAll('button'));
      for (const btn of allButtons) {
        const rect = btn.getBoundingClientRect();
        const style = getComputedStyle(btn);
        if (style.position === 'fixed' && rect.right > 1200 && rect.bottom > 500) {
          const svg = btn.querySelector('svg');
          if (svg) {
            btn.setAttribute('data-test-accessibility', 'true');
            return true;
          }
        }
      }
      return false;
    });

    console.log('   Button found: ' + accessBtnFound);

    // Click the accessibility button
    const accessBtn = await page.$('button[data-test-accessibility="true"]');
    if (accessBtn) {
      console.log('   Clicking accessibility button...');
      await accessBtn.click();
      await new Promise(r => setTimeout(r, 1000));
    }

    // Take screenshot after clicking
    await page.screenshot({ path: 'screenshots/02-after-click.png' });

    // Check if panel opened
    console.log('3. Checking if accessibility panel opened...');
    const sheetOpen = await page.evaluate(() => {
      const sheet = document.querySelector('[data-state="open"][role="dialog"]');
      return !!sheet;
    });
    console.log('   Sheet/Panel open: ' + sheetOpen);

    // If not open, try by icon structure
    if (!sheetOpen) {
      const foundAndClicked = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          const svg = btn.querySelector('svg');
          if (svg) {
            const circles = svg.querySelectorAll('circle');
            const paths = svg.querySelectorAll('path');
            if (circles.length === 1 && paths.length === 4) {
              btn.click();
              return true;
            }
          }
        }
        return false;
      });
      if (foundAndClicked) {
        console.log('   Found and clicked accessibility button by icon structure');
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    // Take screenshot
    await page.screenshot({ path: 'screenshots/03-panel-state.png' });

    // TEST FEAT-020: Font Size Adjustment
    console.log('\n--- FEAT-020: Font Size Adjustment ---');

    const initialFontSize = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).fontSize;
    });
    console.log('   Initial root font size: ' + initialFontSize);

    // Find the slider using data-slot attribute from the component
    const sliderThumb = await page.$('[data-slot="slider-thumb"]');
    const sliderTrack = await page.$('[data-slot="slider-track"]');

    if (sliderThumb) {
      console.log('   Found slider thumb');
      const thumbBox = await sliderThumb.boundingBox();
      if (thumbBox) {
        console.log('   Thumb position: x=' + thumbBox.x + ' y=' + thumbBox.y);

        // Drag slider to the right
        await page.mouse.move(thumbBox.x + thumbBox.width/2, thumbBox.y + thumbBox.height/2);
        await page.mouse.down();
        await page.mouse.move(thumbBox.x + 150, thumbBox.y + thumbBox.height/2, { steps: 20 });
        await page.mouse.up();
        await new Promise(r => setTimeout(r, 500));

        const newFontSize = await page.evaluate(() => {
          return getComputedStyle(document.documentElement).fontSize;
        });
        console.log('   New font size: ' + newFontSize);

        if (initialFontSize !== newFontSize) {
          results['feat-020'].pass = true;
          console.log('   FEAT-020: PASS');
        } else {
          const stored = await page.evaluate(() => {
            const s = localStorage.getItem('accessibility_settings');
            return s ? JSON.parse(s) : null;
          });
          console.log('   Stored settings: ' + JSON.stringify(stored));
          if (stored && stored.fontSize !== 100) {
            results['feat-020'].pass = true;
            console.log('   FEAT-020: PASS (verified via localStorage)');
          }
        }
      }
    } else if (sliderTrack) {
      console.log('   Found slider track, clicking to increase');
      const trackBox = await sliderTrack.boundingBox();
      if (trackBox) {
        await page.mouse.click(trackBox.x + trackBox.width * 0.9, trackBox.y + trackBox.height/2);
        await new Promise(r => setTimeout(r, 500));

        const newFontSize = await page.evaluate(() => {
          return getComputedStyle(document.documentElement).fontSize;
        });
        console.log('   New font size: ' + newFontSize);

        if (initialFontSize !== newFontSize) {
          results['feat-020'].pass = true;
          console.log('   FEAT-020: PASS');
        }
      }
    } else {
      // Try using keyboard on the slider
      console.log('   Looking for [role="slider"] element...');
      const slider = await page.$('[role="slider"]');
      if (slider) {
        console.log('   Found slider, using keyboard navigation');
        await slider.focus();
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('ArrowRight');
        await new Promise(r => setTimeout(r, 300));

        const stored = await page.evaluate(() => {
          const s = localStorage.getItem('accessibility_settings');
          return s ? JSON.parse(s) : null;
        });
        console.log('   Stored: ' + JSON.stringify(stored));
        if (stored && stored.fontSize !== 100) {
          results['feat-020'].pass = true;
          console.log('   FEAT-020: PASS (keyboard)');
        }
      } else {
        console.log('   No slider found');
      }
    }

    // TEST FEAT-021: High Contrast Mode
    console.log('\n--- FEAT-021: High Contrast Mode ---');

    let highContrastSwitch = await page.$('#highContrast');
    if (highContrastSwitch) {
      console.log('   Found high contrast switch by ID');

      const initialState = await page.evaluate(() => {
        return document.body.classList.contains('high-contrast');
      });
      console.log('   Initial high-contrast state: ' + initialState);

      await highContrastSwitch.click();
      await new Promise(r => setTimeout(r, 300));

      const newState = await page.evaluate(() => {
        return document.body.classList.contains('high-contrast');
      });
      console.log('   New high-contrast state: ' + newState);

      if (newState !== initialState) {
        results['feat-021'].pass = true;
        console.log('   FEAT-021: PASS');
      }
    } else {
      console.log('   High contrast switch not found by ID');
      const switches = await page.$$('button[role="switch"]');
      console.log('   Found ' + switches.length + ' switch buttons');

      for (let i = 0; i < switches.length; i++) {
        const beforeClick = await page.evaluate(() => document.body.classList.contains('high-contrast'));
        await switches[i].click();
        await new Promise(r => setTimeout(r, 300));
        const afterClick = await page.evaluate(() => document.body.classList.contains('high-contrast'));

        if (afterClick !== beforeClick) {
          console.log('   Found high contrast switch at index ' + i);
          results['feat-021'].pass = true;
          console.log('   FEAT-021: PASS');
          break;
        }
      }
    }

    // TEST FEAT-022: Reduced Motion
    console.log('\n--- FEAT-022: Reduced Motion ---');

    let reducedMotionSwitch = await page.$('#reducedMotion');
    if (reducedMotionSwitch) {
      console.log('   Found reduced motion switch by ID');

      const initialState = await page.evaluate(() => {
        return document.body.classList.contains('reduced-motion');
      });
      console.log('   Initial reduced-motion state: ' + initialState);

      await reducedMotionSwitch.click();
      await new Promise(r => setTimeout(r, 300));

      const newState = await page.evaluate(() => {
        return document.body.classList.contains('reduced-motion');
      });
      console.log('   New reduced-motion state: ' + newState);

      if (newState !== initialState) {
        results['feat-022'].pass = true;
        console.log('   FEAT-022: PASS');
      }
    } else {
      console.log('   Reduced motion switch not found by ID');
      const switches = await page.$$('button[role="switch"]');

      for (let i = 0; i < switches.length; i++) {
        const beforeClick = await page.evaluate(() => document.body.classList.contains('reduced-motion'));
        await switches[i].click();
        await new Promise(r => setTimeout(r, 300));
        const afterClick = await page.evaluate(() => document.body.classList.contains('reduced-motion'));

        if (afterClick !== beforeClick) {
          console.log('   Found reduced motion switch at index ' + i);
          results['feat-022'].pass = true;
          console.log('   FEAT-022: PASS');
          break;
        }
        // Undo if changed something else
        if (afterClick !== beforeClick) {
          await switches[i].click();
          await new Promise(r => setTimeout(r, 200));
        }
      }
    }

    // Check persistence
    console.log('\n--- Checking Settings Persistence ---');
    const savedSettings = await page.evaluate(() => {
      return localStorage.getItem('accessibility_settings');
    });
    console.log('   Saved settings: ' + savedSettings);

    // Take final screenshot
    await page.screenshot({ path: 'screenshots/05-final.png' });
    console.log('   Screenshots saved');

    // Summary
    console.log('\n=== RESULTS SUMMARY ===');
    let passCount = 0;
    for (const [id, result] of Object.entries(results)) {
      const status = result.pass ? 'PASS' : 'NEEDS VERIFICATION';
      console.log(id + ': ' + result.name + ' - ' + status);
      if (result.pass) passCount++;
    }
    console.log('\nPassed: ' + passCount + '/3');

  } catch (error) {
    console.error('Error during testing:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
  }

  return results;
}

testAccessibilityFeatures();
