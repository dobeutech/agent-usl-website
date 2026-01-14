// Demo login test - using proper Puppeteer typing for React
import puppeteer from 'puppeteer'

const BASE_URL = 'http://localhost:5000'
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function testDemoLogin() {
  console.log('Starting demo login test (React-compatible)...\n')

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 720 })

  // Capture console logs
  page.on('console', msg => {
    const text = msg.text()
    if (text.includes('signIn') || text.includes('Demo login')) {
      console.log(`   CONSOLE: ${text}`)
    }
  })

  try {
    // Navigate to admin login
    console.log('1. Navigating to admin login page...')
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle2', timeout: 30000 })
    await sleep(500)

    // Wait for form
    await page.waitForSelector('input[type="email"]', { visible: true })
    console.log('   Login form ready')

    // Clear and type email character by character (this updates React state)
    console.log('\n2. Typing email...')
    await page.click('input[type="email"]', { clickCount: 3 }) // Triple-click to select all
    await page.keyboard.type('demo@uniquestaffing.com', { delay: 10 })

    // Clear and type password
    console.log('3. Typing password...')
    await page.click('input[type="password"]', { clickCount: 3 }) // Triple-click to select all
    await page.keyboard.type('demo123', { delay: 10 })

    await page.screenshot({ path: './screenshots/demo-final-filled.png' })

    // Submit by pressing Enter or clicking
    console.log('\n4. Submitting form (pressing Enter)...')
    await page.keyboard.press('Enter')

    // Wait for result
    await sleep(3000)

    const currentUrl = page.url()
    console.log(`\n5. Current URL: ${currentUrl}`)

    if (currentUrl.includes('/dashboard')) {
      // Verify dashboard content
      const dashboardInfo = await page.evaluate(() => {
        const heading = document.querySelector('h1')
        const table = document.querySelector('table')
        const rows = document.querySelectorAll('tbody tr')
        return {
          heading: heading?.textContent || '',
          hasTable: !!table,
          rowCount: rows.length
        }
      })

      await page.screenshot({ path: './screenshots/demo-final-dashboard.png' })

      console.log('\n===========================================')
      console.log('TEST RESULT: PASS')
      console.log('===========================================')
      console.log(`Dashboard heading: ${dashboardInfo.heading}`)
      console.log(`Has applicant table: ${dashboardInfo.hasTable}`)
      console.log(`Applicant rows: ${dashboardInfo.rowCount}`)
      return true
    } else {
      await page.screenshot({ path: './screenshots/demo-final-failed.png' })
      console.log('\n===========================================')
      console.log('TEST RESULT: FAIL')
      console.log('===========================================')
      return false
    }

  } catch (error) {
    console.error('\nError:', error.message)
    await page.screenshot({ path: './screenshots/demo-final-error.png' })
    return false
  } finally {
    await browser.close()
  }
}

testDemoLogin()
  .then(passed => process.exit(passed ? 0 : 1))
  .catch(err => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
