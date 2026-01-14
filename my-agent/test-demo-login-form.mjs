// Debug demo login form submission
import puppeteer from 'puppeteer'

const BASE_URL = 'http://localhost:5000'
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function debugForm() {
  console.log('Starting form submission debug test...\n')

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 720 })

  // Capture console logs
  page.on('console', msg => {
    const text = msg.text()
    if (text.includes('signIn') || text.includes('Auth') || text.includes('Login') || text.includes('demo')) {
      console.log(`   CONSOLE: ${text}`)
    }
  })

  try {
    // Navigate to admin login
    console.log('1. Navigating to admin login page...')
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle2', timeout: 30000 })
    await sleep(1000)

    // Check form exists
    console.log('\n2. Checking form structure...')
    const formInfo = await page.evaluate(() => {
      const form = document.querySelector('form')
      const emailInput = document.querySelector('input[type="email"]')
      const passwordInput = document.querySelector('input[type="password"]')
      const submitBtn = document.querySelector('button[type="submit"]')

      return {
        hasForm: !!form,
        formAction: form?.action,
        emailName: emailInput?.name,
        emailId: emailInput?.id,
        passwordName: passwordInput?.name,
        passwordId: passwordInput?.id,
        submitText: submitBtn?.textContent,
        submitDisabled: submitBtn?.disabled
      }
    })
    console.log(`   Form: ${formInfo.hasForm}`)
    console.log(`   Email input id: ${formInfo.emailId}`)
    console.log(`   Password input id: ${formInfo.passwordId}`)
    console.log(`   Submit button text: ${formInfo.submitText}`)
    console.log(`   Submit disabled: ${formInfo.submitDisabled}`)

    // Try using page.evaluate to fill and submit
    console.log('\n3. Filling form via page.evaluate...')
    await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]')
      const passwordInput = document.querySelector('input[type="password"]')
      if (emailInput) {
        emailInput.value = 'demo@uniquestaffing.com'
        emailInput.dispatchEvent(new Event('input', { bubbles: true }))
        emailInput.dispatchEvent(new Event('change', { bubbles: true }))
      }
      if (passwordInput) {
        passwordInput.value = 'demo123'
        passwordInput.dispatchEvent(new Event('input', { bubbles: true }))
        passwordInput.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    await sleep(500)

    // Verify values set
    const inputValues = await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]')
      const passwordInput = document.querySelector('input[type="password"]')
      return {
        email: emailInput?.value,
        password: passwordInput?.value
      }
    })
    console.log(`   Email value: ${inputValues.email}`)
    console.log(`   Password value: ${inputValues.password}`)

    // Take screenshot before submit
    await page.screenshot({ path: './screenshots/form-debug-before-submit.png' })

    // Try to submit form
    console.log('\n4. Attempting form submission...')

    // Method 1: Click submit button directly
    console.log('   Method: Clicking submit button...')
    const submitResult = await page.evaluate(() => {
      const submitBtn = document.querySelector('button[type="submit"]')
      if (submitBtn) {
        submitBtn.click()
        return 'clicked'
      }
      return 'not found'
    })
    console.log(`   Result: ${submitResult}`)

    await sleep(3000)

    // Check result
    console.log('\n5. Checking result...')
    const currentUrl = page.url()
    console.log(`   Current URL: ${currentUrl}`)

    const localStorage = await page.evaluate(() => {
      return JSON.stringify(localStorage)
    })
    console.log(`   localStorage: ${localStorage}`)

    await page.screenshot({ path: './screenshots/form-debug-after-submit.png' })

    if (currentUrl.includes('/dashboard')) {
      console.log('\nSUCCESS: Redirected to dashboard!')
    } else {
      console.log('\nFAILED: Still on login page')

      // Check for toast or error
      const pageState = await page.evaluate(() => {
        return {
          toasts: document.querySelectorAll('[data-sonner-toast]').length,
          alerts: document.querySelectorAll('[role="alert"]').length,
          loadingText: document.body.textContent.includes('Signing in')
        }
      })
      console.log(`   Toasts: ${pageState.toasts}`)
      console.log(`   Alerts: ${pageState.alerts}`)
      console.log(`   Has loading text: ${pageState.loadingText}`)
    }

  } catch (error) {
    console.error('\nError:', error.message)
    await page.screenshot({ path: './screenshots/form-debug-error.png' })
  } finally {
    await browser.close()
  }
}

debugForm()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
