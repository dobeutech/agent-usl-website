import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  try {
    // Step 1: Navigate to homepage
    console.log('Step 1: Navigating to homepage...');
    await page.goto('http://localhost:5000', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.screenshot({ path: 'screenshots/step1-homepage.png', fullPage: true });
    console.log('Screenshot saved: step1-homepage.png');

    // Step 2: Navigate to admin login
    console.log('\nStep 2: Navigating to admin login...');
    await page.goto('http://localhost:5000/admin/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.screenshot({ path: 'screenshots/step2-admin-login.png', fullPage: true });
    console.log('Screenshot saved: step2-admin-login.png');

    // Step 3: Click Fill Demo Credentials button
    console.log('\nStep 3: Looking for Fill Demo Credentials button...');
    const demoButtonClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      for (const btn of buttons) {
        if (btn.textContent.includes('Fill Demo')) {
          btn.click();
          return { found: true, text: btn.textContent.trim() };
        }
      }
      return { found: false };
    });

    if (demoButtonClicked.found) {
      console.log('Clicked button:', demoButtonClicked.text);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      // Manual fill
      console.log('Demo button not found, filling manually...');
      await page.type('input[type="email"], input[name="email"]', 'demo@uniquestaffing.com');
      await page.type('input[type="password"], input[name="password"]', 'demo123');
    }

    await page.screenshot({ path: 'screenshots/step3-credentials-filled.png', fullPage: true });
    console.log('Screenshot saved: step3-credentials-filled.png');

    // Step 4: Click Sign In button
    console.log('\nStep 4: Clicking Sign In button...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      for (const btn of buttons) {
        if (btn.textContent.includes('Sign In') && !btn.textContent.includes('Demo')) {
          btn.click();
          return true;
        }
      }
      // Fallback to submit button
      const submit = document.querySelector('button[type="submit"]');
      if (submit) submit.click();
      return false;
    });

    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('Current URL after login:', page.url());
    await page.screenshot({ path: 'screenshots/step4-after-login.png', fullPage: true });
    console.log('Screenshot saved: step4-after-login.png');

    // Step 5: Navigate to dashboard if not already there
    if (!page.url().includes('dashboard')) {
      console.log('\nStep 5: Navigating directly to dashboard...');
      await page.goto('http://localhost:5000/admin/dashboard', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    await page.screenshot({ path: 'screenshots/step5-dashboard.png', fullPage: true });
    console.log('Screenshot saved: step5-dashboard.png');
    console.log('Final URL:', page.url());

    // Step 6: Analyze dashboard content
    console.log('\n========== DASHBOARD ANALYSIS ==========');

    const analysis = await page.evaluate(() => {
      const result = {
        url: window.location.href,
        title: document.title,
        headings: [],
        statsCards: [],
        tables: [],
        bodyText: document.body.innerText.substring(0, 3000)
      };

      // Get all headings
      document.querySelectorAll('h1, h2, h3, h4').forEach(h => {
        result.headings.push(`${h.tagName}: ${h.textContent.trim()}`);
      });

      // Find stats cards - look for common patterns
      const cardSelectors = [
        '[class*="card"]',
        '[class*="stat"]',
        '.bg-white.rounded',
        '.shadow.rounded'
      ];

      const seenCards = new Set();
      cardSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(card => {
          const text = card.textContent.trim().replace(/\s+/g, ' ').substring(0, 150);
          if (text.length > 10 && text.length < 150 && !seenCards.has(text)) {
            seenCards.add(text);
            // Check if it looks like a stat card (contains numbers)
            if (/\d+/.test(text)) {
              result.statsCards.push(text);
            }
          }
        });
      });

      // Find tables
      document.querySelectorAll('table').forEach((table, tableIndex) => {
        const tableData = {
          index: tableIndex,
          headers: [],
          rows: [],
          totalRows: 0
        };

        // Get headers
        table.querySelectorAll('th').forEach(th => {
          tableData.headers.push(th.textContent.trim());
        });

        // Get rows (first 5)
        const rows = table.querySelectorAll('tbody tr');
        tableData.totalRows = rows.length;

        rows.forEach((row, rowIndex) => {
          if (rowIndex < 5) {
            const rowData = {
              cells: [],
              actionButtons: []
            };

            row.querySelectorAll('td').forEach(td => {
              rowData.cells.push(td.textContent.trim().substring(0, 60));
            });

            // Find action buttons
            row.querySelectorAll('button, a[href], [role="button"]').forEach(btn => {
              const btnText = btn.textContent.trim() || btn.getAttribute('aria-label') || btn.getAttribute('title') || 'icon';
              const btnTitle = btn.getAttribute('title') || '';
              if (btnText || btnTitle) {
                rowData.actionButtons.push({ text: btnText, title: btnTitle });
              }
            });

            tableData.rows.push(rowData);
          }
        });

        result.tables.push(tableData);
      });

      return result;
    });

    console.log('\n--- Page Info ---');
    console.log('URL:', analysis.url);
    console.log('Title:', analysis.title);

    console.log('\n--- Headings ---');
    analysis.headings.forEach(h => console.log(' ', h));

    console.log('\n--- Statistics Cards ---');
    if (analysis.statsCards.length > 0) {
      analysis.statsCards.slice(0, 8).forEach((card, i) => console.log(`  ${i + 1}. ${card}`));
    } else {
      console.log('  (No stat cards found)');
    }

    console.log('\n--- Tables ---');
    if (analysis.tables.length > 0) {
      analysis.tables.forEach(table => {
        console.log(`\n  Table ${table.index}:`);
        console.log(`    Headers: ${table.headers.join(' | ')}`);
        console.log(`    Total rows: ${table.totalRows}`);
        console.log('    Sample rows:');
        table.rows.forEach((row, i) => {
          console.log(`      Row ${i}: ${row.cells.join(' | ')}`);
          if (row.actionButtons.length > 0) {
            console.log(`        Actions: ${row.actionButtons.map(b => b.text || b.title).join(', ')}`);
          }
        });
      });
    } else {
      console.log('  (No tables found)');
    }

    console.log('\n--- Page Text Preview ---');
    console.log(analysis.bodyText.substring(0, 1500));

  } catch (error) {
    console.error('Error:', error.message);
    await page.screenshot({ path: 'screenshots/error-state.png', fullPage: true });
  }

  await browser.close();
  console.log('\n========== Browser closed ==========');
})();
