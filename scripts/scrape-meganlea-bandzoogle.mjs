/**
 * Scrape https://meganleawrites.com/ (home + /music) with Playwright.
 * Collects headings, main text snippet, and external links (music/social).
 *
 * Usage:
 *   node scripts/scrape-meganlea-bandzoogle.mjs
 *   OUT=tmp/meganlea-scrape.json node scripts/scrape-meganlea-bandzoogle.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const SITE = 'https://meganleawrites.com'

const outPath = process.env.OUT ? resolve(ROOT, process.env.OUT) : null

const PATHS = ['/home', '/music']

const MUSIC_SOCIAL_HOSTS =
  /open\.spotify\.com|music\.apple\.com|itunes\.apple\.com|bandcamp\.com|youtube\.com|youtu\.be|instagram\.com|facebook\.com|twitter\.com|x\.com|tiktok\.com|soundcloud\.com|linktr\.ee|bandsintown\.com/i

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function extractPage(page) {
  return page.evaluate(() => {
    const pickText = (el) => (el?.innerText || '').replace(/\s+/g, ' ').trim()

    const title = document.title || ''
    const metaDesc =
      document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
    const ogDesc =
      document.querySelector('meta[property="og:description"]')?.getAttribute('content') || ''

    const headings = [...document.querySelectorAll('h1, h2, h3')].map((h) => ({
      level: h.tagName.toLowerCase(),
      text: pickText(h),
    }))

    const seen = new Set()
    const links = []
    for (const a of document.querySelectorAll('a[href]')) {
      const href = a.href
      const text = pickText(a).slice(0, 200)
      if (!href || href.startsWith('javascript:')) continue
      const key = `${href}\t${text}`
      if (seen.has(key)) continue
      seen.add(key)
      links.push({ text, href })
    }

    const main =
      document.querySelector('main') ||
      document.querySelector('[role="main"]') ||
      document.querySelector('#siteWrapper') ||
      document.querySelector('.Main-content') ||
      document.body

    const mainText = pickText(main).slice(0, 50_000)

    return {
      sourceUrl: window.location.href,
      title,
      metaDescription: metaDesc,
      ogDescription: ogDesc,
      headings: headings.filter((h) => h.text),
      links,
      mainText,
    }
  })
}

function filterCuratedLinks(links) {
  const out = []
  const seen = new Set()
  for (const { href, text } of links) {
    try {
      const u = new URL(href)
      if (!MUSIC_SOCIAL_HOSTS.test(u.hostname)) continue
      if (seen.has(href)) continue
      seen.add(href)
      out.push({ href, text })
    } catch {
      // ignore
    }
  }
  return out.sort((a, b) => a.href.localeCompare(b.href))
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'en-US',
  })
  const page = await context.newPage()

  const pages = {}
  for (const path of PATHS) {
    const url = `${SITE}${path}`
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 })
    await sleep(2500)
    const raw = await extractPage(page)
    pages[path] = {
      ...raw,
      curatedLinks: filterCuratedLinks(raw.links),
    }
  }

  const payload = {
    scrapedAt: new Date().toISOString(),
    site: SITE,
    pages,
  }

  const json = `${JSON.stringify(payload, null, 2)}\n`
  process.stdout.write(json)

  if (outPath) {
    mkdirSync(dirname(outPath), { recursive: true })
    writeFileSync(outPath, json, 'utf8')
    process.stderr.write(`Wrote ${outPath}\n`)
  }

  await browser.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
