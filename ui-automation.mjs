import http from 'http'
import { spawn } from 'child_process'
import puppeteer from 'puppeteer'

const BASE_URL = 'http://127.0.0.1:5000'
const PREVIEW_PORT = 5000

const LANG_STORAGE_KEY = 'app-language'
const THEME_STORAGE_KEY = 'app-theme'

const LANGUAGES = {
  en: {
    name: 'English',
    navEmployers: 'Employers',
    talentJobSeekers: 'Join our talent pool',
    talentEmployers: 'Partner with Unique Staffing Professionals',
    benefitsMarker: 'Vacation paid-time',
    formsLink: 'Looking for employee forms? Visit our Forms page.',
    employerTitle: 'Learn the Unique Staffing Professionals difference',
    employerProcessTitle: 'Our onboarding process',
    employerEfaxNote: 'Employers: send us an eFax',
    formsTitle: 'Forms and resources',
    formsItem: 'Current employee',
    formsAssistance: 'Questions or need assistance?',
    formsEmployerPrompt: 'Employer looking for more info on our onboarding process?'
  },
  es: {
    name: 'Spanish',
    navEmployers: 'Empleadores',
    talentJobSeekers: 'Únase a nuestra bolsa de talento',
    talentEmployers: 'Asóciese con Unique Staffing Professionals',
    benefitsMarker: 'Tiempo libre pagado',
    formsLink: '¿Busca formularios de empleados? Visite nuestra página de Formularios.',
    employerTitle: 'Conozca la diferencia de Unique Staffing Professionals',
    employerProcessTitle: 'Nuestro proceso de incorporación',
    employerEfaxNote: 'Empleadores: envíenos un eFax',
    formsTitle: 'Formularios y recursos',
    formsItem: 'Empleado actual',
    formsAssistance: '¿Preguntas o necesita ayuda?',
    formsEmployerPrompt: '¿Empleador buscando más información sobre nuestro proceso de incorporación?'
  },
  fr: {
    name: 'French',
    navEmployers: 'Employeurs',
    talentJobSeekers: 'Rejoignez notre vivier de talents',
    talentEmployers: 'Associez-vous à Unique Staffing Professionals',
    benefitsMarker: 'Congés payés',
    formsLink: "Vous cherchez des formulaires d'employés ? Visitez notre page Formulaires.",
    employerTitle: 'Découvrez la différence Unique Staffing Professionals',
    employerProcessTitle: "Notre processus d'intégration",
    employerEfaxNote: 'Employeurs : envoyez-nous un eFax',
    formsTitle: 'Formulaires et ressources',
    formsItem: 'Employé actuel',
    formsAssistance: "Des questions ou besoin d'aide ?",
    formsEmployerPrompt: "Employeur : besoin de plus d'infos sur notre processus d'intégration ?"
  }
}

const THEMES = [
  { id: 'light', theme: 'light', media: 'light', expectsDark: false },
  { id: 'dark', theme: 'dark', media: 'dark', expectsDark: true },
  { id: 'system', theme: 'system', media: 'dark', expectsDark: true }
]

const VIEWPORTS = [
  {
    name: 'desktop',
    width: 1280,
    height: 800,
    isMobile: false,
    hasTouch: false,
    deviceScaleFactor: 1,
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  },
  {
    name: 'tablet',
    width: 834,
    height: 1112,
    isMobile: false,
    hasTouch: true,
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  },
  {
    name: 'mobile',
    width: 390,
    height: 844,
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 3,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  }
]

const results = []

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Normalize text so assertions tolerate French-typography NBSP (e.g. around ":" and "?"),
// narrow NBSP, zero-width spaces, and collapsed/stretched whitespace.
const normalizeText = (s) => (s ?? '')
  .replace(/[   ⁠﻿]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

const textIncludes = (haystack, needle) => normalizeText(haystack).includes(normalizeText(needle))

const waitForServer = async (url, timeoutMs = 60000) => {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const ok = await new Promise((resolve) => {
      const req = http.get(url, (res) => {
        res.resume()
        resolve(res.statusCode && res.statusCode < 500)
      })
      req.on('error', () => resolve(false))
    })
    if (ok) return true
    await sleep(500)
  }
  return false
}

const record = (combo, page, check, pass, detail = '') => {
  results.push({ combo, page, check, pass, detail })
  const status = pass ? 'PASS' : 'FAIL'
  console.log(`${status} [${combo}] ${page}: ${check}${detail ? ` - ${detail}` : ''}`)
}

const setPreferences = async (page, language, theme) => {
  await page.evaluateOnNewDocument((lang, themeValue, keyLang, keyTheme) => {
    const payload = {
      version: '1',
      language: lang,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem(keyTheme, themeValue)
    localStorage.setItem(keyLang, JSON.stringify(payload))
  }, language, theme, LANG_STORAGE_KEY, THEME_STORAGE_KEY)
}

const checkHome = async (page, expected, combo, expectsDark) => {
  await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 })
  await sleep(1000)
  const snapshot = await page.evaluate(() => ({
    text: document.body.innerText,
    noOverflow: document.documentElement.scrollWidth <= window.innerWidth + 1,
    hasWhatsApp: !!document.querySelector('a[href*="wa.me/16673041520"]'),
    darkClass: document.documentElement.classList.contains('dark')
  }))

  const normalizedText = normalizeText(snapshot.text)
  record(combo, 'home', 'nav employers label', textIncludes(snapshot.text, expected.navEmployers))
  record(combo, 'home', 'talent split section', textIncludes(snapshot.text, expected.talentJobSeekers) && textIncludes(snapshot.text, expected.talentEmployers))
  record(combo, 'home', 'benefits section', textIncludes(snapshot.text, expected.benefitsMarker))
  record(combo, 'home', 'forms link', textIncludes(snapshot.text, expected.formsLink))
  record(combo, 'home', 'whatsapp link', snapshot.hasWhatsApp)
  record(combo, 'home', 'suite R22 address', /\br22\b/i.test(normalizedText))
  record(combo, 'home', 'eFax number', snapshot.text.includes('+12403923898'))
  record(combo, 'home', 'no horizontal overflow', snapshot.noOverflow)
  record(
    combo,
    'home',
    `theme class (${expectsDark ? 'dark' : 'light'})`,
    snapshot.darkClass === expectsDark,
    `dark=${snapshot.darkClass}`
  )
}

const checkEmployers = async (page, expected, combo) => {
  await page.goto(`${BASE_URL}/employers`, { waitUntil: 'networkidle2', timeout: 30000 })
  await sleep(800)
  const snapshot = await page.evaluate(() => ({
    text: document.body.innerText,
    noOverflow: document.documentElement.scrollWidth <= window.innerWidth + 1
  }))

  record(combo, 'employers', 'hero title', textIncludes(snapshot.text, expected.employerTitle))
  record(combo, 'employers', 'process title', textIncludes(snapshot.text, expected.employerProcessTitle))
  record(combo, 'employers', 'eFax note', textIncludes(snapshot.text, expected.employerEfaxNote))
  record(combo, 'employers', 'no horizontal overflow', snapshot.noOverflow)
}

const checkForms = async (page, expected, combo) => {
  await page.goto(`${BASE_URL}/forms`, { waitUntil: 'networkidle2', timeout: 30000 })
  await sleep(800)
  const snapshot = await page.evaluate(() => ({
    text: document.body.innerText,
    whatsapp: !!document.querySelector('a[href*="wa.me/16673041520"]'),
    noOverflow: document.documentElement.scrollWidth <= window.innerWidth + 1
  }))

  record(combo, 'forms', 'page title', textIncludes(snapshot.text, expected.formsTitle))
  record(combo, 'forms', 'forms item', textIncludes(snapshot.text, expected.formsItem))
  record(combo, 'forms', 'assistance prompt', textIncludes(snapshot.text, expected.formsAssistance))
  record(combo, 'forms', 'employer prompt', textIncludes(snapshot.text, expected.formsEmployerPrompt))
  record(combo, 'forms', 'whatsapp link', snapshot.whatsapp)
  record(combo, 'forms', 'no horizontal overflow', snapshot.noOverflow)
}

const checkAdminLogin = async (page, expected, combo) => {
  await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle2', timeout: 30000 })
  await sleep(800)
  const adminChecks = await page.evaluate(() => {
    const text = document.body.innerText
    const hasLogin = text.toLowerCase().includes('login') || text.toLowerCase().includes('sign in')
    const hasEmailInput = !!document.querySelector('input[type="email"]')
    const hasPasswordInput = !!document.querySelector('input[type="password"]')
    return { hasLogin, hasEmailInput, hasPasswordInput }
  })

  record(combo, 'admin/login', 'login text', adminChecks.hasLogin)
  record(combo, 'admin/login', 'email input', adminChecks.hasEmailInput)
  record(combo, 'admin/login', 'password input', adminChecks.hasPasswordInput)
}

const run = async () => {
  console.log('Starting preview server...')
  const preview = spawn(
    'npm',
    ['run', 'preview', '--', '--host', '127.0.0.1', '--port', `${PREVIEW_PORT}`],
    { stdio: 'inherit', shell: true }
  )

  try {
    const ready = await waitForServer(BASE_URL)
    if (!ready) {
      console.error('Preview server did not start in time.')
      preview.kill('SIGTERM')
      process.exit(1)
    }

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    })

    try {
      for (const [lang, expected] of Object.entries(LANGUAGES)) {
        for (const theme of THEMES) {
          for (const viewport of VIEWPORTS) {
            const combo = `${lang}/${theme.id}/${viewport.name}`
            const page = await browser.newPage()
            await page.setViewport({
              width: viewport.width,
              height: viewport.height,
              isMobile: viewport.isMobile,
              hasTouch: viewport.hasTouch,
              deviceScaleFactor: viewport.deviceScaleFactor
            })
            await page.setUserAgent(viewport.userAgent)
            await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: theme.media }])
            await setPreferences(page, lang, theme.theme)

            await checkHome(page, expected, combo, theme.expectsDark)
            await checkEmployers(page, expected, combo)
            await checkForms(page, expected, combo)
            await checkAdminLogin(page, expected, combo)

            await page.close()
          }
        }
      }
    } finally {
      await browser.close()
    }
  } finally {
    preview.kill('SIGTERM')
  }

  const total = results.length
  const failed = results.filter(r => !r.pass)
  const passed = total - failed.length
  console.log('\n====================')
  console.log(`Results: ${passed}/${total} checks passed`)
  if (failed.length) {
    console.log('Failed checks:')
    failed.forEach((entry) => {
      console.log(`- [${entry.combo}] ${entry.page}: ${entry.check}`)
    })
    process.exit(1)
  }
}

run().catch((error) => {
  console.error('Automation failed:', error)
  process.exit(1)
})
