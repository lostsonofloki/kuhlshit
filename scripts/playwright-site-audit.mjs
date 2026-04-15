/**
 * Smoke audit (mobile-first viewport): all app routes, console/page errors,
 * same-origin HTTP errors. Third-party noise filtered from exit code.
 *
 * Usage: BASE_URL=http://localhost:4173 node scripts/playwright-site-audit.mjs
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://localhost:4173'

/** All React Router paths (mobile-first check uses narrow viewport). */
const ROUTES = [
  '/',
  '/artists',
  '/closed-on-sundays',
  '/porchfest',
  '/porchfest/artists',
  '/porchfest/artists/the-stifftones',
  '/porch-talk',
  '/search',
  '/spotcheck',
]

/** iPhone 14–class width — layout should work here first. */
const MOBILE_VIEWPORT = { width: 390, height: 844 }

const issues = []
const warnings = []

function isThirdPartyNoise(msg) {
  return (
    /google-analytics\.com|googletagmanager\.com|g\/collect/i.test(msg) ||
    /googleapis\.com/i.test(msg) ||
    /fbcdn\.net|facebook\.com|fbsbx\.com/i.test(msg) ||
    /bandsintown|px1\.bandsintown/i.test(msg) ||
    /vercel\.com\/insights/i.test(msg)
  )
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: MOBILE_VIEWPORT,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  })
  const page = await context.newPage()

  page.on('console', (msg) => {
    const t = msg.type()
    const text = msg.text()
    if (t === 'error') issues.push(`[console.error] ${text}`)
    if (t === 'warning' && /fail|error|invalid/i.test(text)) issues.push(`[console.warn] ${text}`)
  })

  page.on('pageerror', (err) => {
    issues.push(`[pageerror] ${err.message}`)
  })

  page.on('requestfailed', (req) => {
    const f = req.failure()
    const u = req.url()
    if (!u.startsWith(BASE) && isThirdPartyNoise(u)) return
    issues.push(`[requestfailed] ${u} — ${f?.errorText || 'unknown'}`)
  })

  page.on('response', (res) => {
    const u = res.url()
    const s = res.status()
    if (!u.startsWith(BASE)) return
    if (s >= 400 && !u.includes('favicon')) {
      issues.push(`[HTTP ${s}] ${u}`)
    }
  })

  for (const path of ROUTES) {
    const url = `${BASE}${path}`
    let response
    try {
      response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })
    } catch (e) {
      issues.push(`[navigate] ${path}: ${e.message}`)
      continue
    }

    if (!response) {
      issues.push(`[navigate] ${path}: no response`)
      continue
    }
    if (response.status() >= 400) {
      issues.push(`[navigate] ${path}: HTTP ${response.status()}`)
    }

    await page.waitForTimeout(800)

    const rootText = (await page.locator('#root').innerText().catch(() => '')) || ''
    if (rootText.trim().length < 30) {
      issues.push(`[empty?] ${path}: #root text very short (${rootText.length} chars)`)
    }

    const title = await page.title()
    if (!title || title.length < 2) warnings.push(`[title] ${path}: missing or short title`)

    const broken = await page.evaluate(() => {
      const imgs = [...document.querySelectorAll('img')]
      return imgs
        .filter((img) => img.complete && img.naturalWidth === 0 && img.src && !img.src.includes('data:'))
        .map((img) => img.src || img.alt)
    })
    for (const b of broken.slice(0, 8)) {
      warnings.push(`[img broken?] ${path}: ${b}`)
    }
  }

  await browser.close()

  const blockingIssues = issues.filter((i) => !isThirdPartyNoise(i))

  const report = {
    base: BASE,
    viewport: MOBILE_VIEWPORT,
    routesChecked: ROUTES.length,
    routes: ROUTES,
    issueCount: issues.length,
    blockingIssueCount: blockingIssues.length,
    warningCount: warnings.length,
    issues,
    blockingIssues,
    warnings,
  }

  console.log(JSON.stringify(report, null, 2))
  process.exit(blockingIssues.length > 0 ? 1 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
