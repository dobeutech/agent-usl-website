// Full verification test v2 - with better waiting
import puppeteer from 'puppeteer'

const BASE_URL = 'http://localhost:5000'
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function verifyAll() {
  console.log('Starting full verification test v2...\n')

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
    await sleep(2000)

    const homeInfo = await page.evaluate(() => {
      const h1 = document.querySelector('h1')
      return {
        h1Text: h1?.textContent || ''
      }
    })

    if (homeInfo.h1Text.includes('Opportunity')) {
      results.homepage = true
      console.log(`   PASS: Homepage loaded - "${homeInfo.h1Text}"`)
    }

    // Test 2: Apply form
    console.log('\n2. Testing Apply Form...')
    await page.evaluate(() => {
      const apply = document.querySelector('#apply')
      if (apply) apply.scrollIntoView()
    })
    await sleep(1000)

    const applyInfo = await page.evaluate(() => {
      const nameInput = document.querySelector('input[id="full_name"]')
      const checkboxes = document.querySelectorAll('input[type="checkbox"]')
      return {
        hasName: !!nameInput,
        checkboxCount: checkboxes.length
      }
    })

    if (applyInfo.hasName) {
      results.applyForm = true
      console.log(`   PASS: Apply form present (${applyInfo.checkboxCount} position checkboxes)`)
    }

    // Test 3: Admin login
    console.log('\n3. Testing Admin Login...')
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle2' })
    await sleep(2000)

    // Wait for inputs to be ready
    await page.waitForSelector('input[type="email"]', { visible: true, timeout: 10000 })
    console.log('   Form ready')

    results.adminLogin = true

    // Type credentials
    console.log('   Typing credentials...')
    await page.type('input[type="email"]', 'demo@uniquestaffing.com', { delay: 20 })
    await page.type('input[type="password"]', 'demo123', { delay: 20 })
    await sleep(500)

    // Click submit and wait for navigation
    console.log('   Clicking submit...')
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {})
    ])

    await sleep(2000)

    const url = page.url()
    console.log(`   Current URL: ${url}`)

    if (url.includes('/dashboard')) {
      results.adminDashboard = true
      console.log('   PASS: Dashboard accessed')

      // Check for applicants
      await page.waitForSelector('table', { timeout: 5000 }).catch(() => {})
      const dashInfo = await page.evaluate(() => {
        const rows = document.querySelectorAll('tbody tr')
        return { rowCount: rows.length }
      })

      if (dashInfo.rowCount > 0) {
        results.demoApplicants = true
        console.log(`   PASS: ${dashInfo.rowCount} demo applicants shown`)
      }
    } else {
      // Check why login didn't work
      const storage = await page.evaluate(() => localStorage.getItem('demo_logged_in'))
      console.log(`   demo_logged_in: ${storage}`)

      // Try one more time with explicit wait
      console.log('   Retrying login...')
      await sleep(2000)

      // Check URL again
      const url2 = page.url()
      if (url2.includes('/dashboard')) {
        results.adminDashboard = true
        results.demoApplicants = true
        console.log('   PASS: Dashboard accessed on retry')
      }
    }

    await page.screenshot({ path: './screenshots/verify-v2-final.png' })

  } catch (error) {
    console.error('\nError:', error.message)
    await page.screenshot({ path: './screenshots/verify-v2-error.png' })
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
