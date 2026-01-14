// Final session verification test - correct form handling
import puppeteer from 'puppeteer'

const BASE_URL = 'http://localhost:5000'
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function verifySession() {
  console.log('Session Verification Test\n' + '='.repeat(50) + '\n')

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 720 })

  const results = {
    homepage: false,
    hero: false,
    services: false,
    applyForm: false,
    adminLogin: false,
    adminDashboard: false,
    demoApplicants: false
  }

  try {
    // Test 1: Homepage
    console.log('1. HOMEPAGE TEST')
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 })
    await sleep(2000)

    // Dismiss any cookie consent
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button')
      for (const btn of buttons) {
        if (btn.textContent.includes('Accept')) {
          btn.click()
          break
        }
      }
    })
    await sleep(500)

    const homeInfo = await page.evaluate(() => {
      const h1 = document.querySelector('h1')
      const hero = document.querySelector('#hero, section')
      const services = document.querySelector('#services')
      return {
        h1: h1?.textContent || '',
        hasHero: !!hero,
        hasServices: !!services
      }
    })

    results.homepage = homeInfo.h1.includes('Opportunity') || homeInfo.h1.includes('Staffing')
    results.hero = homeInfo.hasHero
    results.services = homeInfo.hasServices

    console.log(`   H1 text: "${homeInfo.h1}"`)
    console.log(`   Homepage loads: ${results.homepage ? 'PASS' : 'FAIL'}`)
    console.log(`   Hero section: ${results.hero ? 'PASS' : 'FAIL'}`)
    console.log(`   Services section: ${results.services ? 'PASS' : 'FAIL'}`)

    // Test 2: Apply Form
    console.log('\n2. APPLY FORM TEST')
    await page.evaluate(() => {
      const apply = document.querySelector('#apply')
      if (apply) apply.scrollIntoView()
    })
    await sleep(1000)

    const applyInfo = await page.evaluate(() => {
      const nameInput = document.querySelector('input[id="full_name"]')
      const emailInput = document.querySelector('input[type="email"]')
      const positions = document.querySelectorAll('input[type="checkbox"]')
      return {
        hasName: !!nameInput,
        hasEmail: !!emailInput,
        positionCount: positions.length
      }
    })

    results.applyForm = applyInfo.hasName && applyInfo.positionCount > 0
    console.log(`   Apply form: ${results.applyForm ? 'PASS' : 'FAIL'} (${applyInfo.positionCount} positions)`)

    // Test 3: Admin Login Page
    console.log('\n3. ADMIN LOGIN PAGE TEST')
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle2' })
    await sleep(2000)

    const loginPageInfo = await page.evaluate(() => {
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

    results.adminLogin = loginPageInfo.hasEmail && loginPageInfo.hasPassword && loginPageInfo.hasSubmit
    console.log(`   Admin login page: ${results.adminLogin ? 'PASS' : 'FAIL'}`)
    console.log(`   Demo mode indicator: ${loginPageInfo.isDemoMode ? 'Yes' : 'No'}`)

    // Test 4: Demo Login & Dashboard
    console.log('\n4. DEMO LOGIN & DASHBOARD TEST')

    // Click and type credentials (this is the correct way for React forms)
    await page.click('input[type="email"]')
    await sleep(100)
    await page.keyboard.type('demo@uniquestaffing.com')

    await page.click('input[type="password"]')
    await sleep(100)
    await page.keyboard.type('demo123')

    // Submit
    await page.click('button[type="submit"]')
    await sleep(4000)

    const dashboardUrl = page.url()
    results.adminDashboard = dashboardUrl.includes('/dashboard')
    console.log(`   Login redirect: ${results.adminDashboard ? 'PASS' : 'FAIL'}`)

    if (results.adminDashboard) {
      // Test 5: Demo Applicants
      console.log('\n5. DEMO APPLICANTS TEST')

      const dashInfo = await page.evaluate(() => {
        const table = document.querySelector('table')
        const rows = document.querySelectorAll('tbody tr')
        const statCards = document.querySelectorAll('[class*="card"]')

        // Get first applicant name
        const firstCell = rows[0]?.querySelector('td')

        return {
          hasTable: !!table,
          rowCount: rows.length,
          cardCount: statCards.length,
          firstApplicant: firstCell?.textContent || ''
        }
      })

      results.demoApplicants = dashInfo.hasTable && dashInfo.rowCount >= 8
      console.log(`   Demo applicants: ${results.demoApplicants ? 'PASS' : 'FAIL'}`)
      console.log(`   Applicant count: ${dashInfo.rowCount}`)
    }

    // Take final screenshot
    await page.screenshot({ path: './screenshots/session-final.png' })

  } catch (error) {
    console.error('\nError:', error.message)
    await page.screenshot({ path: './screenshots/session-error.png' })
  } finally {
    await browser.close()
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('VERIFICATION SUMMARY')
  console.log('='.repeat(50))

  const checks = Object.entries(results)
  let passed = 0

  for (const [name, result] of checks) {
    const status = result ? 'PASS' : 'FAIL'
    console.log(`  ${name.padEnd(18)} ${status}`)
    if (result) passed++
  }

  console.log('')
  console.log(`  Total: ${passed}/${checks.length} checks passed`)
  console.log('='.repeat(50))

  return passed === checks.length
}

verifySession()
  .then(allPassed => {
    process.exit(allPassed ? 0 : 1)
  })
  .catch(err => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
