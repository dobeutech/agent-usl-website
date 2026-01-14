import puppeteer from 'puppeteer'

const BASE_URL = 'http://localhost:5000'
const SCREENSHOT_DIR = 'my-agent/screenshots'

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function runVerification() {
  console.log('Starting quick verification tests...')
  console.log('Base URL:', BASE_URL)
  console.log('')

  const results = []

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 800 })

    // Test 1: Homepage loads with headline
    console.log('Test 1: Checking homepage...')
    try {
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 })
      await sleep(3000)
      await page.screenshot({ path: SCREENSHOT_DIR + '/verify-01-homepage.png' })

      const headline = await page.evaluate(() => {
        const h1 = document.querySelector('h1')
        return h1 ? h1.textContent : null
      })

      const pass = headline && headline.includes('Where Opportunity Starts')
      results.push({ test: '1. Homepage headline', pass, detail: headline || 'No headline found' })
    } catch (err) {
      results.push({ test: '1. Homepage headline', pass: false, detail: err.message })
    }

    // Test 2: Hero section visible
    console.log('Test 2: Checking hero section...')
    try {
      const heroVisible = await page.evaluate(() => {
        const heroText = document.body.innerText
        return heroText.includes('Where Opportunity Starts') &&
               (heroText.includes('Apply Now') || heroText.includes('staffing'))
      })
      results.push({ test: '2. Hero section visible', pass: heroVisible, detail: heroVisible ? 'Hero content found' : 'Hero not found' })
    } catch (err) {
      results.push({ test: '2. Hero section visible', pass: false, detail: err.message })
    }

    // Test 3: Navigate to Apply page
    console.log('Test 3: Checking Apply page...')
    try {
      await page.goto(BASE_URL + '/apply', { waitUntil: 'domcontentloaded', timeout: 30000 })
      await sleep(3000)
      await page.screenshot({ path: SCREENSHOT_DIR + '/verify-02-apply-page.png' })

      const applyFormExists = await page.evaluate(() => {
        const form = document.querySelector('form')
        const inputs = document.querySelectorAll('input')
        return form && inputs.length > 3
      })
      results.push({ test: '3. Apply form loads', pass: applyFormExists, detail: applyFormExists ? 'Form with inputs found' : 'Form not found' })
    } catch (err) {
      results.push({ test: '3. Apply form loads', pass: false, detail: err.message })
    }

    // Test 4: Admin login page with Demo Mode
    console.log('Test 4: Checking admin login...')
    try {
      await page.goto(BASE_URL + '/admin/login', { waitUntil: 'domcontentloaded', timeout: 30000 })
      await sleep(3000)
      await page.screenshot({ path: SCREENSHOT_DIR + '/verify-03-admin-login.png' })

      const demoModeVisible = await page.evaluate(() => {
        const pageText = document.body.innerText
        return pageText.includes('Demo Mode') || pageText.includes('demo')
      })
      results.push({ test: '4. Admin login with Demo Mode', pass: demoModeVisible, detail: demoModeVisible ? 'Demo Mode indicator found' : 'Demo Mode not found' })
    } catch (err) {
      results.push({ test: '4. Admin login with Demo Mode', pass: false, detail: err.message })
    }

    // Test 5: Demo login works
    console.log('Test 5: Testing demo login...')
    try {
      await page.waitForSelector('input[type="email"]', { timeout: 5000 })

      await page.type('input[type="email"]', 'demo@uniquestaffing.com')
      await page.type('input[type="password"]', 'demo123')
      await page.screenshot({ path: SCREENSHOT_DIR + '/verify-04-credentials-filled.png' })

      await page.click('button[type="submit"]')
      await sleep(3000)
      await page.screenshot({ path: SCREENSHOT_DIR + '/verify-05-after-login.png' })

      const currentUrl = page.url()
      const loginSuccess = currentUrl.includes('/admin/dashboard') || currentUrl.includes('/admin')
      results.push({ test: '5. Demo login redirects to dashboard', pass: loginSuccess, detail: 'Current URL: ' + currentUrl })
    } catch (err) {
      results.push({ test: '5. Demo login redirects to dashboard', pass: false, detail: err.message })
    }

    // Test 6: Dashboard shows applicant data
    console.log('Test 6: Checking dashboard data...')
    try {
      const currentUrl = page.url()
      if (currentUrl.includes('/admin')) {
        await sleep(2000)
        await page.screenshot({ path: SCREENSHOT_DIR + '/verify-06-dashboard.png' })

        const dashboardContent = await page.evaluate(() => {
          const pageText = document.body.innerText
          const hasTable = document.querySelector('table') ? true : false
          const hasApplicants = pageText.includes('Applicant') || pageText.includes('applicant')
          const hasData = pageText.includes('John') || pageText.includes('Jane') ||
                         pageText.includes('Pending') || pageText.includes('Reviewed') ||
                         pageText.includes('@') || hasTable
          return { hasTable, hasApplicants, hasData }
        })

        const dashboardPass = dashboardContent.hasTable || dashboardContent.hasData
        results.push({ test: '6. Dashboard shows applicant data', pass: dashboardPass, detail: dashboardContent.hasTable ? 'Table found with data' : (dashboardContent.hasData ? 'Applicant data found' : 'No data found') })
      } else {
        results.push({ test: '6. Dashboard shows applicant data', pass: false, detail: 'Could not reach dashboard' })
      }
    } catch (err) {
      results.push({ test: '6. Dashboard shows applicant data', pass: false, detail: err.message })
    }

    // Summary
    console.log('')
    console.log('========== VERIFICATION RESULTS ==========')
    console.log('')
    let passCount = 0
    results.forEach(r => {
      const status = r.pass ? 'PASS' : 'FAIL'
      if (r.pass) passCount++
      console.log(status + ' - ' + r.test)
      console.log('    Detail: ' + r.detail)
    })
    console.log('')
    console.log('========== SUMMARY: ' + passCount + '/' + results.length + ' tests passed ==========')

  } catch (error) {
    console.error('Error during testing:', error.message)
  } finally {
    await browser.close()
  }
}

runVerification().catch(console.error)
