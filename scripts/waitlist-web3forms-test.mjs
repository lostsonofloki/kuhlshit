/**
 * One-off: open /waitlist on BASE_URL and submit test data (Web3Forms).
 * Usage: BASE_URL=http://127.0.0.1:3099 node scripts/waitlist-web3forms-test.mjs
 */
import { chromium } from 'playwright'

const base = process.env.BASE_URL || 'http://127.0.0.1:3099'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
await page.goto(`${base.replace(/\/$/, '')}/waitlist`, { waitUntil: 'networkidle', timeout: 60_000 })

await page.getByLabel(/name or project/i).fill('Web3Forms smoke test (automated)')
await page.getByLabel(/^Email$/i).fill('smoke-test@kuhlshit.invalid')
await page.getByLabel(/what do you create/i).fill('Automated browser test')
await page.getByLabel(/link we can/i).fill('https://kuhlshit.com/waitlist')
await page.getByLabel(/anything else/i).fill('Submitted by scripts/waitlist-web3forms-test.mjs — safe to ignore.')

await page.getByRole('button', { name: /put me on the list/i }).click()

await page.getByRole('heading', { name: /you're in/i }).waitFor({ timeout: 45_000 })

console.log('Waitlist success UI reached; check Web3Forms inbox for the email.')
await browser.close()
