// Test demo login with better waiting strategy
import puppeteer from 'puppeteer'

const BASE_URL = 'http://localhost:5000'
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function testDemoLogin() {
  console.log('Starting demo login test...\n')

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 720 })

  try {
    // Navigate to admin login
    console.log('1. Navigating to admin login page...')
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle2', timeout: 30000 })

    // Wait for login form to be ready
    await page.waitForSelector('input[type="email"]', { visible: true })
    await page.waitForSelector('input[type="password"]', { visible: true })

    console.log('   Login form is ready')
    await page.screenshot({ path: './screenshots/demo-login-v2-1.png' })

    // Check if demo mode indicator is shown
    const demoModeText = await page.evaluate(() => {
      return document.body.textContent.includes('Demo Mode')
    })
    console.log(`   Demo Mode indicator: ${demoModeText ? 'Yes' : 'No'}`)

    // Clear any existing values and enter credentials
    console.log('\n2. Entering demo credentials...')

    // Clear and type email
    await page.click('input[type="email"]', { clickCount: 3 })
    await page.type('input[type="email"]', 'demo@uniquestaffing.com')

    // Clear and type password
    await page.click('input[type="password"]', { clickCount: 3 })
    await page.type('input[type="password"]', 'demo123')

    await page.screenshot({ path: './screenshots/demo-login-v2-2.png' })

    // Get current URL before clicking
    const urlBefore = page.url()
    console.log(`   URL before login: ${urlBefore}`)

    // Click submit button
    console.log('\n3. Clicking submit button...')

    // Wait for submit button and click it
    const submitBtn = await page.waitForSelector('button[type="submit"]')
    await submitBtn.click()

    // Wait for either navigation or error
    console.log('   Waiting for navigation...')

    try {
      // Wait for URL to change or for dashboard content
      await Promise.race([
        page.waitForNavigation({ timeout: 5000 }),
        page.waitForSelector('table', { timeout: 5000 }),
        sleep(5000)
      ])
    } catch (e) {
      console.log('   (Navigation timeout - checking current state)')
    }

    await page.screenshot({ path: './screenshots/demo-login-v2-3.png' })

    // Check current URL
    const urlAfter = page.url()
    console.log(`   URL after login: ${urlAfter}`)

    // Check for success
    if (urlAfter.includes('/dashboard')) {
      console.log('\n4. Successfully redirected to dashboard!')

      // Verify dashboard content
      const dashboardInfo = await page.evaluate(() => {
        const table = document.querySelector('table')
        const heading = document.querySelector('h1')
        const rows = document.querySelectorAll('tbody tr')
        return {
          hasTable: !!table,
          heading: heading?.textContent || 'No heading',
          rowCount: rows.length
        }
      })

      console.log(`   Dashboard heading: ${dashboardInfo.heading}`)
      console.log(`   Has table: ${dashboardInfo.hasTable}`)
      console.log(`   Applicant rows: ${dashboardInfo.rowCount}`)

      await page.screenshot({ path: './screenshots/demo-login-v2-4-dashboard.png' })
      console.log('\n===========================================')
      console.log('TEST RESULT: PASS - Demo login working!')
      console.log('===========================================')

    } else if (urlAfter.includes('/login')) {
      // Still on login page - check for errors
      console.log('\n4. Still on login page - checking for errors...')

      const pageContent = await page.evaluate(() => {
        // Check for toast messages
        const toast = document.querySelector('[data-sonner-toast]')
        const errorMsg = document.querySelector('.error, [role="alert"]')
        return {
          toastText: toast?.textContent || '',
          errorText: errorMsg?.textContent || '',
          bodyText: document.body.textContent.substring(0, 500)
        }
      })

      console.log(`   Toast message: ${pageContent.toastText || 'None'}`)
      console.log(`   Error message: ${pageContent.errorText || 'None'}`)

      await page.screenshot({ path: './screenshots/demo-login-v2-4-error.png' })
      console.log('\n===========================================')
      console.log('TEST RESULT: FAIL - Login did not redirect')
      console.log('===========================================')
    }

  } catch (error) {
    console.error('\nError during test:', error.message)
    await page.screenshot({ path: './screenshots/demo-login-v2-error.png' })
  } finally {
    await browser.close()
  }
}

testDemoLogin()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
