// Demo login test - using button click
import puppeteer from 'puppeteer'

const BASE_URL = 'http://localhost:5000'
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function testDemoLogin() {
  console.log('Starting demo login test (button click)...\n')

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 720 })

  // Capture ALL console logs
  page.on('console', msg => {
    console.log(`   CONSOLE: ${msg.text()}`)
  })

  try {
    // Navigate to admin login
    console.log('1. Navigating to admin login page...')
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle2', timeout: 30000 })
    await sleep(1000)

    // Wait for form
    await page.waitForSelector('input[type="email"]', { visible: true })
    console.log('   Login form ready')

    // Type email using page.type (which triggers React onChange)
    console.log('\n2. Typing email...')
    const emailInput = await page.$('input[type="email"]')
    await emailInput.click({ clickCount: 3 })
    await emailInput.type('demo@uniquestaffing.com')

    // Type password
    console.log('3. Typing password...')
    const passwordInput = await page.$('input[type="password"]')
    await passwordInput.click({ clickCount: 3 })
    await passwordInput.type('demo123')

    // Verify values
    const values = await page.evaluate(() => {
      const email = document.querySelector('input[type="email"]')
      const password = document.querySelector('input[type="password"]')
      return {
        email: email?.value,
        password: password?.value
      }
    })
    console.log(`   Email input value: ${values.email}`)
    console.log(`   Password input value: ${values.password}`)

    await page.screenshot({ path: './screenshots/demo-click-filled.png' })

    // Submit by clicking button
    console.log('\n4. Clicking submit button...')
    const submitBtn = await page.$('button[type="submit"]')
    await submitBtn.click()

    // Wait for navigation or response
    console.log('   Waiting for response...')
    await sleep(4000)

    const currentUrl = page.url()
    console.log(`\n5. Current URL: ${currentUrl}`)

    // Check localStorage
    const storage = await page.evaluate(() => {
      return localStorage.getItem('demo_logged_in')
    })
    console.log(`   demo_logged_in in localStorage: ${storage}`)

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

      await page.screenshot({ path: './screenshots/demo-click-dashboard.png' })

      console.log('\n===========================================')
      console.log('TEST RESULT: PASS')
      console.log('===========================================')
      console.log(`Dashboard heading: ${dashboardInfo.heading}`)
      console.log(`Has applicant table: ${dashboardInfo.hasTable}`)
      console.log(`Applicant rows: ${dashboardInfo.rowCount}`)
      return true
    } else {
      await page.screenshot({ path: './screenshots/demo-click-failed.png' })

      // Check for toast
      const toasts = await page.evaluate(() => {
        const toastElements = document.querySelectorAll('[data-sonner-toast]')
        return Array.from(toastElements).map(t => t.textContent)
      })
      console.log(`   Toasts found: ${toasts.join(', ') || 'None'}`)

      console.log('\n===========================================')
      console.log('TEST RESULT: FAIL')
      console.log('===========================================')
      return false
    }

  } catch (error) {
    console.error('\nError:', error.message)
    await page.screenshot({ path: './screenshots/demo-click-error.png' })
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
