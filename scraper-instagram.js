/**
 * Instagram Reels Scraper for Kuhlshit.com
 * Extracts: Video URL, Caption, Poster Image
 * Uses stealth to bypass login wall
 */

const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
const fs = require('fs');
const path = require('path');

chromium.use(stealth);

// Input file with URLs (one per line)
const INPUT_FILE = path.join(__dirname, 'input.txt');
const OUTPUT_FILE = path.join(__dirname, 'scraped-artists.json');

async function scrapeInstagramReel(url) {
  console.log(`\n📸 Scraping: ${url}`);
  
  const browser = await chromium.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920,1080',
      '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ]
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  try {
    // Random delay before starting (mimics human behavior)
    await sleep(2000 + Math.random() * 2000);

    console.log('🔄 Loading page...');
    await page.goto(url, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    // Wait for video element to load
    console.log('⏳ Waiting for content...');
    await page.waitForSelector('video, [src*="video"]', { timeout: 10000 }).catch(() => {
      console.log('⚠️  Video element not found, continuing anyway...');
    });

    // Extract video URL
    const videoUrl = await page.evaluate(() => {
      const video = document.querySelector('video');
      if (video) {
        return video.src || video.currentSrc;
      }
      // Try to find video in meta tags
      const ogVideo = document.querySelector('meta[property="og:video"]');
      if (ogVideo) {
        return ogVideo.content;
      }
      return null;
    });

    // Extract caption
    const caption = await page.evaluate(() => {
      // Try multiple selectors for caption
      const selectors = [
        'h1',
        '[class*="caption"]',
        '[class*="description"]',
        'meta[property="og:description"]'
      ];
      
      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el) {
          const text = el.content || el.textContent || el.innerText;
          if (text && text.length > 10) {
            return text.trim();
          }
        }
      }
      return null;
    });

    // Extract poster/thumbnail image
    const posterUrl = await page.evaluate(() => {
      // Try og:image first
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage && ogImage.content) {
        return ogImage.content;
      }
      
      // Try to find video poster
      const video = document.querySelector('video');
      if (video && video.poster) {
        return video.poster;
      }
      
      // Try to find largest image
      const images = Array.from(document.querySelectorAll('img'));
      if (images.length > 0) {
        const largestImage = images.reduce((prev, current) => {
          const prevWidth = parseInt(prev.getAttribute('width') || '0');
          const currentWidth = parseInt(current.getAttribute('width') || '0');
          return prevWidth > currentWidth ? prev : current;
        });
        return largestImage.src || largestImage.currentSrc;
      }
      
      return null;
    });

    await browser.close();

    return {
      source: 'instagram',
      url: url,
      videoUrl: videoUrl || '',
      caption: cleanCaption(caption),
      posterUrl: posterUrl || '',
      scrapedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error(`❌ Error scraping ${url}:`, error.message);
    await browser.close();
    return {
      source: 'instagram',
      url: url,
      error: error.message,
      scrapedAt: new Date().toISOString()
    };
  }
}

// Clean caption - remove emoji and junk
function cleanCaption(caption) {
  if (!caption) return '';
  
  // Remove emoji
  const noEmoji = caption.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
  
  // Remove excessive hashtags (keep first 3)
  const hashtags = noEmoji.match(/#\w+/g) || [];
  let cleaned = noEmoji;
  if (hashtags.length > 3) {
    hashtags.slice(3).forEach(tag => {
      cleaned = cleaned.replace(tag, '');
    });
  }
  
  // Clean up whitespace
  return cleaned.replace(/\s+/g, ' ').trim();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main execution
async function main() {
  console.log('🎬 Kuhlshit Instagram Reels Scraper');
  console.log('====================================');
  
  // Read input URLs
  if (!fs.existsSync(INPUT_FILE)) {
    console.log(`❌ Input file not found: ${INPUT_FILE}`);
    console.log('Create a file with Instagram Reel URLs (one per line)');
    return;
  }

  const urls = fs.readFileSync(INPUT_FILE, 'utf-8')
    .split('\n')
    .map(url => url.trim())
    .filter(url => url && url.includes('instagram.com'));

  if (urls.length === 0) {
    console.log('❌ No valid Instagram URLs found in input.txt');
    return;
  }

  console.log(`📋 Found ${urls.length} URL(s) to scrape\n`);

  const results = [];

  // Scrape each URL with delays
  for (const url of urls) {
    const result = await scrapeInstagramReel(url);
    results.push(result);
    
    // Random delay between requests (avoid rate limiting)
    if (urls.indexOf(url) < urls.length - 1) {
      const delay = 3000 + Math.random() * 3000;
      console.log(`⏱️  Waiting ${Math.round(delay/1000)}s before next request...`);
      await sleep(delay);
    }
  }

  // Load existing data
  let existingData = [];
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      existingData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
    } catch (e) {
      console.log('⚠️  Could not parse existing data, starting fresh');
    }
  }

  // Append new results (avoid duplicates by URL)
  const newResults = results.filter(r => 
    !existingData.some(e => e.url === r.url)
  );
  
  const finalData = [...existingData, ...newResults];

  // Save results
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalData, null, 2));
  
  console.log('\n✅ Scraping complete!');
  console.log(`📊 ${newResults.length} new items saved to ${OUTPUT_FILE}`);
  console.log(`📁 Total items in file: ${finalData.length}`);
}

main().catch(console.error);
