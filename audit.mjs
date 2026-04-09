import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'https://www.kuhlshit.com';
const OUTPUT_DIR = 'audit';

mkdirSync(OUTPUT_DIR, { recursive: true });

const pages = [
  { path: '/', name: 'homepage' },
  { path: '/porchfest', name: 'porchfest' },
  { path: '/porchfest/artists', name: 'porchfest-artists' },
  { path: '/closed-on-sundays', name: 'closed-on-sundays' },
  { path: '/porch-talk', name: 'porch-talk' },
  { path: '/artists', name: 'artists' },
  { path: '/search', name: 'search' },
];

const viewports = [
  { width: 390, height: 844, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1440, height: 900, name: 'desktop' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const viewport of viewports) {
    console.log(`\n📱 Viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);

    for (const pageDef of pages) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      });
      const page = await context.newPage();

      const jsErrors = [];
      page.on('pageerror', (error) => { jsErrors.push(error.message); });

      const failedReqs = [];
      page.on('requestfailed', (request) => {
        const url = request.url();
        if (!url.includes('googleads') && !url.includes('facebook') && !url.includes('doubleclick')) {
          failedReqs.push(url);
        }
      });

      try {
        await page.goto(`${BASE_URL}${pageDef.path}`, { waitUntil: 'networkidle', timeout: 15000 });
        await page.waitForTimeout(2000);

        const ssPath = join(OUTPUT_DIR, `${pageDef.name}-${viewport.name}.png`);
        await page.screenshot({ path: ssPath, fullPage: true });

        const metrics = await page.evaluate(() => {
          const imgs = document.querySelectorAll('img');
          const broken = [];
          imgs.forEach(img => {
            if (!img.complete || img.naturalWidth === 0) broken.push(img.src);
          });
          return {
            brokenImages: broken,
            linkCount: document.querySelectorAll('a').length,
            buttonCount: document.querySelectorAll('button').length,
            h1Count: document.querySelectorAll('h1').length,
            overflow: document.body.scrollWidth > window.innerWidth,
            heroVisible: document.querySelector('.hero')?.offsetHeight > 0 || false,
            announcementVisible: document.querySelector('.announcement-bar')?.offsetHeight > 0 || false,
            countdownVisible: document.querySelector('.countdown-timer')?.offsetHeight > 0 || false,
          };
        });

        results.push({ page: pageDef.path, viewport: viewport.name, screenshot: ssPath, jsErrors, failedRequests: failedReqs, metrics });

        console.log(`  ✅ ${pageDef.path}`);
        if (metrics.brokenImages.length > 0) console.log(`  ⚠️  Broken: ${metrics.brokenImages.join(', ')}`);
        if (jsErrors.length > 0) console.log(`  ❌ JS: ${jsErrors.join(' | ')}`);
        if (metrics.overflow) console.log(`  ⚠️  Horizontal overflow!`);
      } catch (err) {
        results.push({ page: pageDef.path, viewport: viewport.name, error: err.message });
        console.log(`  ❌ ${pageDef.path}: ${err.message}`);
      }

      await context.close();
    }
  }

  await browser.close();
  writeFileSync(join(OUTPUT_DIR, 'results.json'), JSON.stringify(results, null, 2));

  console.log('\n\n========================================');
  console.log('📊 AUDIT SUMMARY');
  console.log('========================================\n');

  const total = results.length;
  const withErrors = results.filter(r => r.jsErrors?.length > 0);
  const withBroken = results.filter(r => r.metrics?.brokenImages?.length > 0);
  const withOverflow = results.filter(r => r.metrics?.overflow);

  console.log(`Pages captured: ${total}`);
  console.log(`JS errors: ${withErrors.length} page(s)`);
  console.log(`Broken images: ${withBroken.length} page(s)`);
  console.log(`Horizontal overflow: ${withOverflow.length} page(s)`);

  const home = results.find(r => r.page === '/' && r.viewport === 'mobile');
  if (home?.metrics) {
    console.log('\n🏠 Homepage Mobile:');
    console.log(`   Hero: ${home.metrics.heroVisible ? '✅' : '❌'}`);
    console.log(`   Announcement: ${home.metrics.announcementVisible ? '✅' : '❌'}`);
    console.log(`   Countdown: ${home.metrics.countdownVisible ? '✅' : '❌'}`);
  }

  const pf = results.find(r => r.page === '/porchfest' && r.viewport === 'mobile');
  if (pf?.metrics) {
    console.log('\n🎸 PorchFest Mobile:');
    console.log(`   Overflow: ${pf.metrics.overflow ? '❌ YES' : '✅ No'}`);
    console.log(`   Broken imgs: ${pf.metrics.brokenImages.length}`);
  }

  console.log('\n📸 Screenshots: ./audit/');
  console.log('========================================\n');
})();
