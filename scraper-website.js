/**
 * Artist Website Scraper for Kuhlshit.com
 * Extracts: Bio/About, Events/Tour dates, Social links
 * Uses agnostic selectors to work with any site (Wix, Squarespace, custom)
 */

const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
const fs = require('fs');
const path = require('path');

chromium.use(stealth);

const INPUT_FILE = path.join(__dirname, 'input.txt');
const OUTPUT_FILE = path.join(__dirname, 'scraped-artists.json');

async function scrapeArtistWebsite(url) {
  console.log(`\n🎸 Scraping: ${url}`);
  
  const browser = await chromium.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1920,1080'
    ]
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  try {
    await sleep(2000 + Math.random() * 2000);

    console.log('🔄 Loading page...');
    await page.goto(url, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    // Wait for content to load
    await sleep(3000);

    // Extract Bio/About section (agnostic selectors)
    const bio = await page.evaluate(() => {
      // Look for sections containing "about", "bio", "artist"
      const keywords = ['about', 'bio', 'biography', 'artist', 'band'];
      
      // Try headings first
      const headings = Array.from(document.querySelectorAll('h1, h2, h3'));
      for (const heading of headings) {
        const text = heading.textContent.toLowerCase();
        if (keywords.some(k => text.includes(k))) {
          // Get the content after this heading
          let next = heading.nextElementSibling;
          let content = [];
          while (next && next.tagName !== 'H1' && next.tagName !== 'H2') {
            if (next.textContent.trim().length > 20) {
              content.push(next.textContent.trim());
            }
            next = next.nextElementSibling;
            if (content.length >= 3) break;
          }
          if (content.length > 0) {
            return content.join(' ').substring(0, 500);
          }
        }
      }
      
      // Try meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && metaDesc.content) {
        return metaDesc.content;
      }
      
      // Try any paragraph with substantial text
      const paragraphs = Array.from(document.querySelectorAll('p'));
      for (const p of paragraphs) {
        const text = p.textContent.trim();
        if (text.length > 100 && text.length < 1000) {
          return text.substring(0, 500);
        }
      }
      
      return null;
    });

    // Extract Events/Tour dates (agnostic selectors)
    const events = await page.evaluate(() => {
      const events = [];
      const keywords = ['tour', 'live', 'show', 'event', 'date', 'concert', 'festival'];
      
      // Look for tables, lists, or divs with date-like content
      const elements = Array.from(document.querySelectorAll('table, ul, ol, [class*="event"], [class*="tour"], [class*="show"], [class*="date"]'));
      
      for (const el of elements) {
        const text = el.textContent;
        // Check if contains date patterns (Month Day, Year or MM/DD/YYYY)
        const hasDate = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}/i.test(text) ||
                       /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/.test(text);
        
        if (hasDate && keywords.some(k => text.toLowerCase().includes(k))) {
          // Extract individual event items
          const items = el.querySelectorAll('li, tr');
          if (items.length > 0) {
            items.forEach(item => {
              const itemText = item.textContent.trim();
              if (itemText.length > 10 && itemText.length < 200) {
                events.push(itemText);
              }
            });
          }
        }
      }
      
      // Remove duplicates and limit to 10
      return [...new Set(events)].slice(0, 10);
    });

    // Extract social media links from footer
    const socialLinks = await page.evaluate(() => {
      const links = {
        instagram: null,
        facebook: null,
        twitter: null,
        youtube: null,
        spotify: null,
        website: null
      };
      
      const footer = document.querySelector('footer') || document.body;
      const allLinks = Array.from(footer.querySelectorAll('a[href]'));
      
      for (const link of allLinks) {
        const href = link.href;
        const text = link.textContent.toLowerCase();
        
        if (href.includes('instagram.com')) links.instagram = href;
        else if (href.includes('facebook.com') || href.includes('fb.com')) links.facebook = href;
        else if (href.includes('twitter.com') || href.includes('x.com')) links.twitter = href;
        else if (href.includes('youtube.com')) links.youtube = href;
        else if (href.includes('spotify.com')) links.spotify = href;
        else if (text.includes('home') || text.includes('website')) links.website = href;
      }
      
      // Clean up - remove nulls
      return Object.fromEntries(Object.entries(links).filter(([_, v]) => v !== null));
    });

    // Extract artist name from title or first heading
    const artistName = await page.evaluate(() => {
      const title = document.title.split('|')[0].split('-')[0].trim();
      if (title && title.length < 50) {
        return title;
      }
      
      const h1 = document.querySelector('h1');
      if (h1 && h1.textContent.trim().length < 50) {
        return h1.textContent.trim();
      }
      
      return null;
    });

    // Extract main image
    const mainImage = await page.evaluate(() => {
      // Try og:image
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage && ogImage.content) {
        return ogImage.content;
      }
      
      // Try to find hero image
      const hero = document.querySelector('[class*="hero"], [class*="banner"], [class*="header"]');
      if (hero) {
        const img = hero.querySelector('img');
        if (img && img.src) {
          return img.src;
        }
        const bg = hero.style.backgroundImage;
        if (bg && bg.includes('url')) {
          return bg.match(/url\(['"]?(.*?)['"]?\)/)[1];
        }
      }
      
      // Largest image
      const images = Array.from(document.querySelectorAll('img'));
      if (images.length > 0) {
        const largest = images.reduce((prev, current) => {
          const prevWidth = parseInt(prev.getAttribute('width') || '0');
          const currentWidth = parseInt(current.getAttribute('width') || '0');
          return prevWidth > currentWidth ? prev : current;
        });
        return largest.src || largest.currentSrc;
      }
      
      return null;
    });

    await browser.close();

    return {
      source: 'website',
      url: url,
      artistName: artistName || '',
      bio: bio || '',
      events: events,
      socialLinks: socialLinks,
      mainImage: mainImage || '',
      scrapedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error(`❌ Error scraping ${url}:`, error.message);
    await browser.close();
    return {
      source: 'website',
      url: url,
      error: error.message,
      scrapedAt: new Date().toISOString()
    };
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main execution
async function main() {
  console.log('🎸 Kuhlshit Artist Website Scraper');
  console.log('====================================');
  
  if (!fs.existsSync(INPUT_FILE)) {
    console.log(`❌ Input file not found: ${INPUT_FILE}`);
    console.log('Create a file with artist website URLs (one per line)');
    return;
  }

  const urls = fs.readFileSync(INPUT_FILE, 'utf-8')
    .split('\n')
    .map(url => url.trim())
    .filter(url => url && !url.includes('instagram.com'));

  if (urls.length === 0) {
    console.log('❌ No valid website URLs found in input.txt (excluding Instagram)');
    return;
  }

  console.log(`📋 Found ${urls.length} website(s) to scrape\n`);

  const results = [];

  for (const url of urls) {
    const result = await scrapeArtistWebsite(url);
    results.push(result);
    
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

  // Append new results
  const newResults = results.filter(r => 
    !existingData.some(e => e.url === r.url)
  );
  
  const finalData = [...existingData, ...newResults];

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalData, null, 2));
  
  console.log('\n✅ Scraping complete!');
  console.log(`📊 ${newResults.length} new items saved to ${OUTPUT_FILE}`);
  console.log(`📁 Total items in file: ${finalData.length}`);
}

main().catch(console.error);
