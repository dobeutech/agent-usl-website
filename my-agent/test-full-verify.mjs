// Full verification test - all basic functionality
import puppeteer from 'puppeteer'

const BASE_URL = 'http://localhost:5000'
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function verifyAll() {
  console.log('Starting full verification test...\n')

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 720 })

  const results = {
    homepage: false,
    applyForm: false,
    adminLogin: false,
    adminDashboard: false,
    demoApplicants: false
  }

  try {
    // Test 1: Homepage loads
    console.log('1. Testing Homepage...')
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 })
    await sleep(1000)

    const homeInfo = await page.evaluate(() => {
      const hero = document.querySelector('#hero, [class*="hero"]')
      const h1 = document.querySelector('h1')
      const services = document.querySelector('#services')
      return {
        hasHero: !!hero,
        h1Text: h1?.textContent || '',
        hasServices: !!services
      }
    })

    if (homeInfo.hasHero || homeInfo.h1Text) {
      results.homepage = true
      console.log(`   PASS: Homepage loaded`)
      console.log(`   H1: ${homeInfo.h1Text.substring(0, 50)}...`)
    }

    await page.screenshot({ path: './screenshots/verify-homepage.png' })

    // Test 2: Apply form
    console.log('\n2. Testing Apply Form...')
    await page.goto(`${BASE_URL}/#apply`, { waitUntil: 'networkidle2' })
    await sleep(1000)

    // Scroll to apply section
    await page.evaluate(() => {
      const apply = document.querySelector('#apply')
      if (apply) apply.scrollIntoView()
    })
    await sleep(500)

    const applyInfo = await page.evaluate(() => {
      const form = document.querySelector('form')
      const nameInput = document.querySelector('input[id="full_name"]')
      const emailInput = document.querySelector('input[type="email"]')
      const checkboxes = document.querySelectorAll('input[type="checkbox"]')
      return {
        hasForm: !!form,
        hasName: !!nameInput,
        hasEmail: !!emailInput,
        checkboxCount: checkboxes.length
      }
    })

    if (applyInfo.hasForm && applyInfo.hasName) {
      results.applyForm = true
      console.log(`   PASS: Apply form present`)
      console.log(`   Checkboxes: ${applyInfo.checkboxCount}`)
    }

    await page.screenshot({ path: './screenshots/verify-applyform.png' })

    // Test 3: Admin login page
    console.log('\n3. Testing Admin Login Page...')
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle2' })
    await sleep(1000)

    const loginInfo = await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]')
      const passwordInput = document.querySelector('input[type="password"]')
      const submitBtn = document.querySelector('button[type="submit"]')
      const demoMode = document.body.textContent.includes('Demo Mode')
      return {
        hasEmail: !!emailInput,
        hasPassword: !!passwordInput,
        hasSubmit: !!submitBtn,
        isDemoMode: demoMode
      }
    })

    if (loginInfo.hasEmail && loginInfo.hasPassword) {
      results.adminLogin = true
      console.log(`   PASS: Admin login page ready`)
      console.log(`   Demo mode indicator: ${loginInfo.isDemoMode}`)
    }

    await page.screenshot({ path: './screenshots/verify-adminlogin.png' })

    // Test 4: Demo login and dashboard
    console.log('\n4. Testing Demo Login...')
    await page.type('input[type="email"]', 'demo@uniquestaffing.com')
    await page.type('input[type="password"]', 'demo123')

    await page.click('button[type="submit"]')
    await sleep(3000)

    const url = page.url()
    if (url.includes('/dashboard')) {
      results.adminDashboard = true
      console.log(`   PASS: Redirected to dashboard`)

      // Test 5: Dashboard has demo applicants
      console.log('\n5. Testing Demo Applicants...')
      const dashInfo = await page.evaluate(() => {
        const table = document.querySelector('table')
        const rows = document.querySelectorAll('tbody tr')
        const firstRow = rows[0]
        const statCards = document.querySelectorAll('[class*="card"], [class*="stat"]')
        return {
          hasTable: !!table,
          rowCount: rows.length,
          firstRowText: firstRow?.textContent?.substring(0, 100) || '',
          cardCount: statCards.length
        }
      })

      if (dashInfo.hasTable && dashInfo.rowCount > 0) {
        results.demoApplicants = true
        console.log(`   PASS: Demo applicants loaded`)
        console.log(`   Applicant rows: ${dashInfo.rowCount}`)
      }

      await page.screenshot({ path: './screenshots/verify-dashboard.png' })
    }

  } catch (error) {
    console.error('\nError:', error.message)
    await page.screenshot({ path: './screenshots/verify-error.png' })
  } finally {
    await browser.close()
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('VERIFICATION SUMMARY')
  console.log('='.repeat(50))

  const checks = [
    ['Homepage', results.homepage],
    ['Apply Form', results.applyForm],
    ['Admin Login Page', results.adminLogin],
    ['Admin Dashboard', results.adminDashboard],
    ['Demo Applicants', results.demoApplicants]
  ]

  let passed = 0
  for (const [name, result] of checks) {
    console.log(`${name.padEnd(20)} ${result ? 'PASS' : 'FAIL'}`)
    if (result) passed++
  }

  console.log('')
  console.log(`Total: ${passed}/${checks.length} checks passed`)
  console.log('='.repeat(50))

  return passed === checks.length
}

verifyAll()
  .then(allPassed => process.exit(allPassed ? 0 : 1))
  .catch(err => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
