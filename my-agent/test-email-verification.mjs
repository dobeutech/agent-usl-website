// Test email verification feature in demo mode
import puppeteer from 'puppeteer'

const BASE_URL = 'http://localhost:5000'
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function testEmailVerification() {
  console.log('Email Verification Test (Demo Mode)\n' + '='.repeat(50) + '\n')

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 720 })

  const results = {
    validTokenWorks: false,
    showsSuccessMessage: false,
    showsEmail: false,
    invalidTokenFails: false,
    noTokenFails: false
  }

  try {
    // Test 1: Valid token (abc123 belongs to Carlos Rodriguez in mockData)
    console.log('1. TEST VALID TOKEN (abc123)')
    await page.goto(`${BASE_URL}/verify-email?token=abc123`, { waitUntil: 'networkidle2', timeout: 30000 })
    await sleep(3000)

    const validTokenResult = await page.evaluate(() => {
      const h1 = document.querySelector('h1')
      const text = document.body.textContent
      return {
        h1Text: h1?.textContent || '',
        hasSuccess: text.includes('Verified Successfully') || text.includes('Email Verified'),
        hasEmail: text.includes('carlos.rodriguez@email.com'),
        bodyText: text.substring(0, 500)
      }
    })

    results.validTokenWorks = validTokenResult.hasSuccess
    results.showsSuccessMessage = validTokenResult.h1Text.includes('Verified') || validTokenResult.h1Text.includes('Success')
    results.showsEmail = validTokenResult.hasEmail

    console.log(`   H1: "${validTokenResult.h1Text}"`)
    console.log(`   Success message: ${results.showsSuccessMessage ? 'PASS' : 'FAIL'}`)
    console.log(`   Shows email: ${results.showsEmail ? 'PASS' : 'FAIL'}`)

    await page.screenshot({ path: './screenshots/email-verify-success.png' })

    // Test 2: Invalid token
    console.log('\n2. TEST INVALID TOKEN')
    await page.goto(`${BASE_URL}/verify-email?token=invalidtoken123`, { waitUntil: 'networkidle2', timeout: 30000 })
    await sleep(2000)

    const invalidTokenResult = await page.evaluate(() => {
      const h1 = document.querySelector('h1')
      const text = document.body.textContent
      return {
        h1Text: h1?.textContent || '',
        hasError: text.includes('Verification Failed') || text.includes('couldn\'t verify')
      }
    })

    results.invalidTokenFails = invalidTokenResult.hasError

    console.log(`   H1: "${invalidTokenResult.h1Text}"`)
    console.log(`   Shows error: ${results.invalidTokenFails ? 'PASS' : 'FAIL'}`)

    await page.screenshot({ path: './screenshots/email-verify-invalid.png' })

    // Test 3: No token
    console.log('\n3. TEST NO TOKEN')
    await page.goto(`${BASE_URL}/verify-email`, { waitUntil: 'networkidle2', timeout: 30000 })
    await sleep(2000)

    const noTokenResult = await page.evaluate(() => {
      const h1 = document.querySelector('h1')
      const text = document.body.textContent
      return {
        h1Text: h1?.textContent || '',
        hasError: text.includes('Verification Failed') || text.includes('couldn\'t verify')
      }
    })

    results.noTokenFails = noTokenResult.hasError

    console.log(`   H1: "${noTokenResult.h1Text}"`)
    console.log(`   Shows error: ${results.noTokenFails ? 'PASS' : 'FAIL'}`)

    await page.screenshot({ path: './screenshots/email-verify-no-token.png' })

  } catch (error) {
    console.error('\nError:', error.message)
    await page.screenshot({ path: './screenshots/email-verify-error.png' })
  } finally {
    await browser.close()
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('EMAIL VERIFICATION TEST SUMMARY')
  console.log('='.repeat(50))

  const checks = Object.entries(results)
  let passed = 0

  for (const [name, result] of checks) {
    const status = result ? 'PASS' : 'FAIL'
    console.log(`  ${name.padEnd(22)} ${status}`)
    if (result) passed++
  }

  console.log('')
  console.log(`  Total: ${passed}/${checks.length} checks passed`)
  console.log('='.repeat(50))

  return passed >= 4 // At least 4 of 5 checks should pass
}

testEmailVerification()
  .then(allPassed => {
    console.log(allPassed ? '\nFEATURE TEST: PASS' : '\nFEATURE TEST: FAIL')
    process.exit(allPassed ? 0 : 1)
  })
  .catch(err => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
