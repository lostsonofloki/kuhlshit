/**
 * Scrape https://www.jodierossmusic.com/ (home + key pages) with Playwright.
 *
 * Usage:
 *   node scripts/scrape-jodie-ross-music.mjs
 *   OUT=tmp/custom.json node scripts/scrape-jodie-ross-music.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const SITE = 'https://www.jodierossmusic.com'

const outPath = resolve(ROOT, process.env.OUT || 'tmp/jodie-ross-music.json')

const PATHS = ['/', '/live', '/playlist', '/socials', '/booking']

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

    const mainText = pickText(main).slice(0, 30_000)

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
    const url = `${SITE}${path === '/' ? '/' : path}`
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 })
    await sleep(2200)
    pages[path] = await extractPage(page)
  }

  const payload = {
    scrapedAt: new Date().toISOString(),
    site: SITE,
    pages,
  }

  const json = `${JSON.stringify(payload, null, 2)}\n`
  process.stdout.write(json)

  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, json, 'utf8')
  process.stderr.write(`Wrote ${outPath}\n`)

  await browser.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
