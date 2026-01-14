// Session verification test - check basic app functionality
import puppeteer from 'puppeteer'

const BASE_URL = 'http://localhost:5000'

// Helper to wait
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function verifyBasicFunctionality() {
  console.log('Starting basic functionality verification...')

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 720 })

  const results = {
    homepage: false,
    adminLogin: false,
    adminDashboard: false,
    applyForm: false
  }

  try {
    // Test 1: Homepage loads
    console.log('\n1. Testing Homepage...')
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 })

    // Check for any hero section or main heading
    const heroExists = await page.evaluate(() => {
      const hero = document.querySelector('#hero, [id*="hero"], section')
      const h1 = document.querySelector('h1')
      return !!(hero || h1)
    })

    if (heroExists) {
      results.homepage = true
      console.log('   ✅ Homepage loaded successfully')
    } else {
      console.log('   ❌ Homepage failed to load properly')
    }

    await page.screenshot({ path: './screenshots/verify-1-homepage.png' })

    // Test 2: Admin login page
    console.log('\n2. Testing Admin Login...')
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle2', timeout: 30000 })

    await page.screenshot({ path: './screenshots/verify-2-admin-login.png' })

    const loginElements = await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]')
      const passwordInput = document.querySelector('input[type="password"]')
      const submitBtn = document.querySelector('button[type="submit"]')
      return {
        hasEmail: !!emailInput,
        hasPassword: !!passwordInput,
        hasSubmit: !!submitBtn
      }
    })

    if (loginElements.hasEmail && loginElements.hasPassword) {
      results.adminLogin = true
      console.log('   ✅ Admin login page working')
    } else {
      console.log('   ❌ Admin login page not working')
      console.log(`      Email input: ${loginElements.hasEmail}, Password input: ${loginElements.hasPassword}`)
    }

    // Test 3: Demo login and dashboard
    console.log('\n3. Testing Demo Login & Dashboard...')

    // Type demo credentials
    await page.type('input[type="email"]', 'demo@uniquestaffing.com')
    await page.type('input[type="password"]', 'demo123')

    await page.screenshot({ path: './screenshots/verify-3-login-filled.png' })

    // Click submit
    await page.click('button[type="submit"]')
    await sleep(3000)

    await page.screenshot({ path: './screenshots/verify-4-after-login.png' })

    // Check if we're on dashboard
    const currentUrl = page.url()
    console.log(`   Current URL: ${currentUrl}`)

    if (currentUrl.includes('/dashboard')) {
      // Check for applicant table or demo data
      const dashboardContent = await page.evaluate(() => {
        const table = document.querySelector('table')
        const cells = document.querySelectorAll('td, tr')
        const demoIndicator = document.body.textContent.includes('Demo') ||
                              document.body.textContent.includes('demo')
        return {
          hasTable: !!table,
          cellCount: cells.length,
          hasDemoIndicator: demoIndicator
        }
      })

      if (dashboardContent.hasTable || dashboardContent.cellCount > 0) {
        results.adminDashboard = true
        console.log('   ✅ Admin dashboard working')
        console.log(`      Table found: ${dashboardContent.hasTable}, Cells: ${dashboardContent.cellCount}`)
      } else {
        console.log('   ⚠️ Dashboard loaded but table content unclear')
      }
    } else {
      console.log('   ⚠️ Login did not redirect to dashboard')
    }

    // Test 4: Apply form section on homepage
    console.log('\n4. Testing Apply Form (on homepage)...')
    await page.goto(`${BASE_URL}/#apply`, { waitUntil: 'networkidle2', timeout: 30000 })
    await sleep(1000)

    // Scroll to the apply section
    await page.evaluate(() => {
      const applySection = document.querySelector('#apply')
      if (applySection) applySection.scrollIntoView()
    })
    await sleep(500)

    await page.screenshot({ path: './screenshots/verify-5-apply-form.png' })

    const formElements = await page.evaluate(() => {
      const nameInput = document.querySelector('input[id="full_name"]')
      const emailInput = document.querySelector('input[type="email"]')
      const checkboxes = document.querySelectorAll('input[type="checkbox"]')
      const form = document.querySelector('form')
      return {
        hasName: !!nameInput,
        hasEmail: !!emailInput,
        checkboxCount: checkboxes.length,
        hasForm: !!form
      }
    })

    if (formElements.hasForm && formElements.hasName) {
      results.applyForm = true
      console.log('   ✅ Apply form page working')
      console.log(`      Checkboxes: ${formElements.checkboxCount}`)
    } else {
      console.log('   ❌ Apply form page not working')
      console.log(`      Form: ${formElements.hasForm}, Name: ${formElements.hasName}`)
    }

  } catch (error) {
    console.error('Error during verification:', error.message)
    await page.screenshot({ path: './screenshots/verify-error.png' })
  } finally {
    await browser.close()
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('VERIFICATION SUMMARY')
  console.log('='.repeat(50))

  const passCount = Object.values(results).filter(v => v).length
  const totalCount = Object.keys(results).length

  console.log(`Homepage:        ${results.homepage ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Admin Login:     ${results.adminLogin ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Admin Dashboard: ${results.adminDashboard ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Apply Form:      ${results.applyForm ? '✅ PASS' : '❌ FAIL'}`)
  console.log('')
  console.log(`Total: ${passCount}/${totalCount} checks passed`)
  console.log('='.repeat(50))

  return results
}

verifyBasicFunctionality()
  .then(results => {
    const allPassed = Object.values(results).every(v => v)
    process.exit(allPassed ? 0 : 1)
  })
  .catch(err => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
