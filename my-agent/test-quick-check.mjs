// Quick check
import puppeteer from 'puppeteer'

const BASE_URL = 'http://localhost:5000'
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function quickCheck() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 720 })

  try {
    console.log('Loading homepage...')
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 })
    await sleep(3000)

    const info = await page.evaluate(() => {
      const h1 = document.querySelector('h1')
      const html = document.documentElement.outerHTML.substring(0, 2000)
      return {
        h1: h1?.textContent || 'NO H1',
        bodyText: document.body.textContent.substring(0, 500),
        html: html
      }
    })

    console.log('H1:', info.h1)
    console.log('\nBody text:', info.bodyText.substring(0, 200))

    await page.screenshot({ path: './screenshots/quick-check.png' })

  } finally {
    await browser.close()
  }
}

quickCheck().catch(console.error)
