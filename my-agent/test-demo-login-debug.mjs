// Debug demo login - capture console logs
import puppeteer from 'puppeteer'

const BASE_URL = 'http://localhost:5000'
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function debugDemoLogin() {
  console.log('Starting demo login debug test...\n')

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 720 })

  // Capture console logs
  const consoleLogs = []
  page.on('console', msg => {
    const text = msg.text()
    consoleLogs.push(`[${msg.type()}] ${text}`)
    if (text.includes('Auth') || text.includes('signIn') || text.includes('Demo') || text.includes('demo')) {
      console.log(`   CONSOLE: ${text}`)
    }
  })

  try {
    // Navigate to admin login
    console.log('1. Navigating to admin login page...')
    await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle2', timeout: 30000 })
    await sleep(1000)

    // Wait for login form
    await page.waitForSelector('input[type="email"]', { visible: true })
    console.log('   Login form ready')

    // Enter credentials
    console.log('\n2. Entering credentials...')
    await page.type('input[type="email"]', 'demo@uniquestaffing.com')
    await page.type('input[type="password"]', 'demo123')

    // Before click
    console.log('\n3. Before clicking submit:')
    const beforeClickInfo = await page.evaluate(() => {
      return {
        url: window.location.href,
        localStorage: JSON.stringify(localStorage)
      }
    })
    console.log(`   URL: ${beforeClickInfo.url}`)
    console.log(`   localStorage: ${beforeClickInfo.localStorage}`)

    // Click submit
    console.log('\n4. Clicking submit...')
    await page.click('button[type="submit"]')

    // Wait and check
    await sleep(3000)

    console.log('\n5. After submit:')
    const afterClickInfo = await page.evaluate(() => {
      return {
        url: window.location.href,
        localStorage: JSON.stringify(localStorage),
        toasts: Array.from(document.querySelectorAll('[data-sonner-toast]')).map(t => t.textContent),
        bodyText: document.body.textContent.substring(0, 200)
      }
    })
    console.log(`   URL: ${afterClickInfo.url}`)
    console.log(`   localStorage: ${afterClickInfo.localStorage}`)
    console.log(`   Toasts: ${afterClickInfo.toasts.join(', ') || 'None'}`)

    await page.screenshot({ path: './screenshots/demo-debug-result.png' })

    // Print all captured console logs
    console.log('\n--- All Console Logs ---')
    consoleLogs.forEach(log => console.log(`  ${log}`))

    // Check final result
    console.log('\n===========================================')
    if (afterClickInfo.url.includes('/dashboard')) {
      console.log('RESULT: SUCCESS - Redirected to dashboard')
    } else {
      console.log('RESULT: FAILED - Still on login page')
      console.log(`Final URL: ${afterClickInfo.url}`)
    }
    console.log('===========================================')

  } catch (error) {
    console.error('\nError:', error.message)
    await page.screenshot({ path: './screenshots/demo-debug-error.png' })
  } finally {
    await browser.close()
  }
}

debugDemoLogin()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
