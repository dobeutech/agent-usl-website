// Debug login - check what's blocking
import puppeteer from 'puppeteer'

const BASE_URL = 'http://localhost:5000'
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function debugLogin() {
  console.log('Debug login test...\n')

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 720 })

  page.on('console', msg => {
    const text = msg.text()
    if (text.includes('signIn')) {
      console.log(`   CONSOLE: ${text}`)
    }
  })

  try {
    console.log('1. Going to login page...')
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle2' })
    await sleep(2000)

    // Check for cookie consent or modal blocking
    console.log('\n2. Checking for overlays/modals...')
    const overlays = await page.evaluate(() => {
      const modals = document.querySelectorAll('[role="dialog"], [class*="modal"], [class*="overlay"], [class*="cookie"]')
      return Array.from(modals).map(m => ({
        tag: m.tagName,
        class: m.className,
        visible: window.getComputedStyle(m).display !== 'none'
      }))
    })
    console.log(`   Found ${overlays.length} potential overlays`)
    overlays.forEach(o => console.log(`   - ${o.tag}: ${String(o.class).substring(0, 50)}... visible: ${o.visible}`))

    // Dismiss cookie consent if present
    console.log('\n3. Dismissing cookie consent if present...')
    const dismissed = await page.evaluate(() => {
      // Try clicking any button with "Accept" text
      const buttons = document.querySelectorAll('button')
      for (const btn of buttons) {
        if (btn.textContent.includes('Accept')) {
          btn.click()
          return true
        }
      }
      return false
    })
    console.log(`   Cookie dismissed: ${dismissed}`)
    await sleep(500)

    // Check if email input is focusable
    console.log('\n4. Checking input accessibility...')
    const inputInfo = await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]')
      if (!emailInput) return { found: false }

      const rect = emailInput.getBoundingClientRect()
      const style = window.getComputedStyle(emailInput)

      return {
        found: true,
        visible: style.display !== 'none' && style.visibility !== 'hidden',
        position: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
        disabled: emailInput.disabled,
        readonly: emailInput.readOnly
      }
    })
    console.log(`   Email input found: ${inputInfo.found}`)
    console.log(`   Visible: ${inputInfo.visible}`)
    console.log(`   Position: ${JSON.stringify(inputInfo.position)}`)
    console.log(`   Disabled: ${inputInfo.disabled}`)

    // Take screenshot
    await page.screenshot({ path: './screenshots/login-debug2.png' })

    // Try clicking the email input first, then typing
    console.log('\n5. Trying click + type...')
    await page.click('input[type="email"]')
    await sleep(200)
    await page.keyboard.type('demo@uniquestaffing.com')

    await page.click('input[type="password"]')
    await sleep(200)
    await page.keyboard.type('demo123')

    // Verify values
    const values = await page.evaluate(() => {
      return {
        email: document.querySelector('input[type="email"]')?.value,
        password: document.querySelector('input[type="password"]')?.value
      }
    })
    console.log(`   Email value: "${values.email}"`)
    console.log(`   Password value: "${values.password}"`)

    // Click submit
    console.log('\n6. Clicking submit...')
    await page.click('button[type="submit"]')
    await sleep(4000)

    const url = page.url()
    console.log(`\n7. Final URL: ${url}`)

    await page.screenshot({ path: './screenshots/login-debug2-final.png' })

    if (url.includes('/dashboard')) {
      console.log('\nSUCCESS!')
    } else {
      console.log('\nFAILED - checking localStorage...')
      const storage = await page.evaluate(() => localStorage.getItem('demo_logged_in'))
      console.log(`   demo_logged_in: ${storage}`)
    }

  } catch (error) {
    console.error('\nError:', error.message)
    await page.screenshot({ path: './screenshots/login-debug2-error.png' })
  } finally {
    await browser.close()
  }
}

debugLogin()
  .catch(console.error)
