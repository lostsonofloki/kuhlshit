import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'https://www.kuhlshit.com';
const OUTPUT_DIR = 'audit-screenshots';

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

// Viewports to test
const viewports = [
  { width: 390, height: 844, name: 'iphone-14' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1440, height: 900, name: 'desktop' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const viewport of viewports) {
    console.log(`\n📱 Testing viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);

    for (const pageDef of pages) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      });
      const page = await context.newPage();

      // Collect console errors
      const jsErrors = [];
      page.on('pageerror', (error) => {
        jsErrors.push(error.message);
      });

      // Collect 404s and failed requests
      const failedRequests = [];
      page.on('requestfailed', (request) => {
        const url = request.url();
        if (!url.includes('googleads') && !url.includes('facebook') && !url.includes('doubleclick')) {
          failedRequests.push(url);
        }
      });

      try {
        await page.goto(`${BASE_URL}${pageDef.path}`, { waitUntil: 'networkidle', timeout: 15000 });

        // Wait a bit for lazy content
        await page.waitForTimeout(2000);

        const screenshotPath = join(OUTPUT_DIR, `${pageDef.name}-${viewport.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Get page metrics
        const metrics = await page.evaluate(() => {
          const imgs = document.querySelectorAll('img');
          const brokenImages = [];
          imgs.forEach(img => {
            if (!img.complete || img.naturalWidth === 0) {
              brokenImages.push(img.src);
            }
          });

          const links = document.querySelectorAll('a');
          const linkCount = links.length;
          const buttons = document.querySelectorAll('button');
          const buttonCount = buttons.length;

          const bodyWidth = document.body.scrollWidth;
          const viewportWidth = window.innerWidth;
          const horizontalOverflow = bodyWidth > viewportWidth;

          const h1Count = document.querySelectorAll('h1').length;
          const h2Count = document.querySelectorAll('h2').length;

          // Check if hero section is visible
          const hero = document.querySelector('.hero');
          const heroVisible = hero ? hero.offsetHeight > 0 : false;

          // Check for announcement bar
          const announcementBar = document.querySelector('.announcement-bar');
          const announcementVisible = announcementBar ? announcementBar.offsetHeight > 0 : false;

          // Check for countdown timer
          const countdown = document.querySelector('.countdown-timer');
          const countdownVisible = countdown ? countdown.offsetHeight > 0 : false;

          return {
            brokenImages,
            linkCount,
            buttonCount,
            bodyWidth,
            viewportWidth,
            horizontalOverflow,
            h1Count,
            h2Count,
            heroVisible,
            announcementVisible,
            countdownVisible,
          };
        });

        results.push({
          page: pageDef.path,
          viewport: viewport.name,
          screenshot: screenshotPath,
          jsErrors,
          failedRequests,
          metrics,
        });

        console.log(`  ✅ ${pageDef.path} → ${screenshotPath}`);
        if (metrics.brokenImages.length > 0) {
          console.log(`  ⚠️  Broken images: ${metrics.brokenImages.join(', ')}`);
        }
        if (jsErrors.length > 0) {
          console.log(`  ❌ JS Errors: ${jsErrors.join(' | ')}`);
        }
        if (metrics.horizontalOverflow) {
          console.log(`  ⚠️  Horizontal overflow! Body: ${metrics.bodyWidth}px > Viewport: ${metrics.viewportWidth}px`);
        }

      } catch (error) {
        results.push({
          page: pageDef.path,
          viewport: viewport.name,
          error: error.message,
        });
        console.log(`  ❌ ${pageDef.path} FAILED: ${error.message}`);
      }

      await context.close();
    }
  }

  await browser.close();

  // Write results to JSON
  writeFileSync(join(OUTPUT_DIR, 'audit-results.json'), JSON.stringify(results, null, 2));

  // Print summary
  console.log('\n\n========================================');
  console.log('📊 AUDIT SUMMARY');
  console.log('========================================\n');

  const totalPages = results.length;
  const failedPages = results.filter(r => r.error);
  const pagesWithErrors = results.filter(r => r.jsErrors?.length > 0);
  const pagesWithBrokenImages = results.filter(r => r.metrics?.brokenImages?.length > 0);
  const pagesWithOverflow = results.filter(r => r.metrics?.horizontalOverflow);

  console.log(`Total page captures: ${totalPages}`);
  console.log(`Failed captures: ${failedPages.length}`);
  console.log(`Pages with JS errors: ${pagesWithErrors.length}`);
  console.log(`Pages with broken images: ${pagesWithBrokenImages.length}`);
  console.log(`Pages with horizontal overflow: ${pagesWithOverflow.length}`);

  // Check key features on homepage
  const homepageMobile = results.find(r => r.page === '/' && r.viewport === 'iphone-14');
  if (homepageMobile?.metrics) {
    console.log('\n🏠 Homepage (Mobile) Checks:');
    console.log(`   Hero visible: ${homepageMobile.metrics.heroVisible ? '✅' : '❌'}`);
    console.log(`   Announcement bar: ${homepageMobile.metrics.announcementVisible ? '✅' : '❌'}`);
    console.log(`   Countdown timer: ${homepageMobile.metrics.countdownVisible ? '✅' : '❌'}`);
    console.log(`   Links: ${homepageMobile.metrics.linkCount}`);
    console.log(`   Buttons: ${homepageMobile.metrics.buttonCount}`);
    console.log(`   H1 tags: ${homepageMobile.metrics.h1Count}`);
    console.log(`   H2 tags: ${homepageMobile.metrics.h2Count}`);
  }

  // Check porchfest page
  const porchfestMobile = results.find(r => r.page === '/porchfest' && r.viewport === 'iphone-14');
  if (porchfestMobile?.metrics) {
    console.log('\n🎸 PorchFest (Mobile) Checks:');
    console.log(`   Horizontal overflow: ${porchfestMobile.metrics.horizontalOverflow ? '❌ YES' : '✅ No'}`);
    console.log(`   Broken images: ${porchfestMobile.metrics.brokenImages.length}`);
  }

  console.log('\n📸 Screenshots saved to: ./audit-screenshots/');
  console.log('📋 Full results: ./audit-screenshots/audit-results.json');
  console.log('========================================\n');
})();
