// Test form submission method
import puppeteer from 'puppeteer'

const BASE_URL = 'http://localhost:5000'
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function testFormSubmit() {
  console.log('Testing form submission methods...\n')

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 720 })

  // Capture signIn related console logs
  page.on('console', msg => {
    const text = msg.text()
    if (text.includes('signIn') || text.includes('handleSubmit') || text.includes('Login')) {
      console.log(`   CONSOLE: ${text}`)
    }
  })

  try {
    // Navigate to admin login
    console.log('1. Navigating to admin login page...')
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle2', timeout: 30000 })
    await sleep(1000)

    // Check form structure
    console.log('\n2. Checking form structure...')
    const formInfo = await page.evaluate(() => {
      const form = document.querySelector('form')
      const submitBtn = document.querySelector('button[type="submit"]')
      return {
        formExists: !!form,
        hasOnSubmit: form ? form.hasAttribute('onsubmit') || !!form.onsubmit : false,
        submitBtnExists: !!submitBtn,
        submitBtnDisabled: submitBtn?.disabled,
        submitBtnType: submitBtn?.type
      }
    })
    console.log(`   Form exists: ${formInfo.formExists}`)
    console.log(`   Submit button exists: ${formInfo.submitBtnExists}`)
    console.log(`   Submit button disabled: ${formInfo.submitBtnDisabled}`)
    console.log(`   Submit button type: ${formInfo.submitBtnType}`)

    // Fill form using evaluate to trigger React state updates
    console.log('\n3. Filling form via simulated React events...')

    // Use evaluate to set values and trigger proper React events
    await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]')
      const passwordInput = document.querySelector('input[type="password"]')

      // Helper to trigger React onChange
      function setNativeValue(element, value) {
        const lastValue = element.value
        element.value = value
        const event = new Event('input', { bubbles: true })
        // React 15+ uses inputEvent, with current value
        const tracker = element._valueTracker
        if (tracker) {
          tracker.setValue(lastValue)
        }
        element.dispatchEvent(event)
      }

      if (emailInput) setNativeValue(emailInput, 'demo@uniquestaffing.com')
      if (passwordInput) setNativeValue(passwordInput, 'demo123')
    })

    await sleep(500)

    // Verify values
    const values = await page.evaluate(() => {
      const email = document.querySelector('input[type="email"]')
      const password = document.querySelector('input[type="password"]')
      return {
        email: email?.value,
        password: password?.value
      }
    })
    console.log(`   Email: ${values.email}`)
    console.log(`   Password: ${values.password}`)

    // Submit form programmatically
    console.log('\n4. Submitting form programmatically...')

    await page.evaluate(() => {
      const form = document.querySelector('form')
      if (form) {
        // Create and dispatch a submit event
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
        form.dispatchEvent(submitEvent)
      }
    })

    await sleep(4000)

    const url = page.url()
    console.log(`   URL after submit: ${url}`)

    const localStorage = await page.evaluate(() => {
      return localStorage.getItem('demo_logged_in')
    })
    console.log(`   demo_logged_in: ${localStorage}`)

    await page.screenshot({ path: './screenshots/form-submit-result.png' })

    if (url.includes('/dashboard')) {
      console.log('\n=== SUCCESS: Form submission worked ===')
      return true
    } else {
      console.log('\n=== FAILED: Form submission did not work ===')

      // Try alternative: click button directly
      console.log('\n5. Trying button click...')
      await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle2' })
      await sleep(1000)

      // Type credentials properly using page methods
      await page.type('input[type="email"]', 'demo@uniquestaffing.com')
      await page.type('input[type="password"]', 'demo123')

      // Use waitForFunction to ensure React state is updated
      await sleep(500)

      // Click button
      await page.evaluate(() => {
        document.querySelector('button[type="submit"]').click()
      })

      await sleep(4000)

      const url2 = page.url()
      console.log(`   URL after button click: ${url2}`)

      if (url2.includes('/dashboard')) {
        console.log('\n=== SUCCESS via button click ===')
        return true
      }

      return false
    }

  } catch (error) {
    console.error('\nError:', error.message)
    await page.screenshot({ path: './screenshots/form-submit-error.png' })
    return false
  } finally {
    await browser.close()
  }
}

testFormSubmit()
  .then(passed => process.exit(passed ? 0 : 1))
  .catch(err => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
