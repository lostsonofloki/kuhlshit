import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.kuhlshit.com';
const OUTPUT_DIR = path.resolve('portfolio-assets');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function save(name, buffer) {
  const filePath = path.join(OUTPUT_DIR, name);
  fs.writeFileSync(filePath, buffer);
  console.log(`✓ Saved: ${filePath}`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    bypassCSP: true,
    javaScriptEnabled: true,
  });

  // Screenshot 1: Mobile Hero
  console.log('\n📱 Screenshot 1: Mobile Hero...');
  const page1 = await context.newPage();
  await page1.setViewportSize({ width: 393, height: 852 });
  await page1.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60000 });
  // Wait for countdown and fonts
  await page1.waitForTimeout(3000);
  await page1.waitForLoadState('networkidle');
  const hero1 = await page1.screenshot({ fullPage: false });
  save('kuhlshit-mobile-hero.png', hero1);
  await page1.close();

  // Screenshot 2: Mobile Merch
  console.log('\n📱 Screenshot 2: Mobile Merch...');
  const page2 = await context.newPage();
  await page2.setViewportSize({ width: 393, height: 852 });
  await page2.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page2.waitForTimeout(3000);
  await page2.waitForLoadState('networkidle');
  // Scroll to merch section
  const merchSection = await page2.$('text=Support the Porch');
  if (merchSection) {
    await merchSection.scrollIntoViewIfNeeded();
  } else {
    // Fallback: scroll down manually
    await page2.evaluate(() => window.scrollBy(0, 800));
  }
  await page2.waitForTimeout(1000);
  const hero2 = await page2.screenshot({ fullPage: false });
  save('kuhlshit-mobile-merch.png', hero2);
  await page2.close();

  // Screenshot 3: Desktop Full Layout
  console.log('\n🖥️ Screenshot 3: Desktop Full Layout...');
  const page3 = await context.newPage();
  await page3.setViewportSize({ width: 1920, height: 1080 });
  await page3.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page3.waitForTimeout(3000);
  await page3.waitForLoadState('networkidle');
  const hero3 = await page3.screenshot({ fullPage: true });
  save('kuhlshit-desktop-full.png', hero3);
  await page3.close();

  // Screenshot 4: Tablet Schedule
  console.log('\n📱 Screenshot 4: Tablet Schedule...');
  const page4 = await context.newPage();
  await page4.setViewportSize({ width: 1024, height: 1366 });
  await page4.goto(`${BASE_URL}/porchfest`, { waitUntil: 'networkidle', timeout: 60000 });
  await page4.waitForTimeout(3000);
  await page4.waitForLoadState('networkidle');
  // Scroll slightly to show poster and schedule
  await page4.evaluate(() => window.scrollBy(0, 200));
  await page4.waitForTimeout(1000);
  const hero4 = await page4.screenshot({ fullPage: false });
  save('kuhlshit-tablet-schedule.png', hero4);
  await page4.close();

  await browser.close();
  console.log('\n✅ All screenshots captured successfully!');
})();
