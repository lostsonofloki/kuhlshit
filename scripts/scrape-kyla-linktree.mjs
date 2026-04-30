/**
 * Scrape https://linktr.ee/kyladianemusic for outbound links (Playwright).
 * Usage: node scripts/scrape-kyla-linktree.mjs
 */
import { chromium } from 'playwright'

const url = 'https://linktr.ee/kyladianemusic'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 })
await new Promise((r) => setTimeout(r, 3000))

const payload = await page.evaluate(() => {
  const seen = new Set()
  const links = []
  for (const a of document.querySelectorAll('a[href]')) {
    const href = a.href
    const text = (a.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 160)
    if (!href || href.startsWith('javascript:')) continue
    if (href.includes('linktr.ee') && href.split('?')[0].endsWith('/')) continue
    const key = `${href}\t${text}`
    if (seen.has(key)) continue
    seen.add(key)
    links.push({ text, href })
  }
  return { sourceUrl: window.location.href, links }
})

console.log(JSON.stringify(payload, null, 2))
await browser.close()
