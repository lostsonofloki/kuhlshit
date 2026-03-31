import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use stealth plugin to bypass bot detection
chromium.use(stealth());

// Output file path
const OUTPUT_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'mike_rainey_profile.json');

// Target URLs
const URLS = {
  onpercs: 'https://www.onpercs.com/',
  linktree: 'https://linktr.ee/MikeRainey82',
  instagram: 'https://www.instagram.com/mikerainey82/'
};

// User agents
const UA_DESKTOP = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const UA_MOBILE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';

// Main scraping function
async function scrapeMikeRaineyData() {
  const browser = await chromium.launch({
    headless: false, // Set to true for production
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ]
  });

  const results = {
    comedian: 'Mike Rainey',
    scrapedAt: new Date().toISOString(),
    onpercs: null,
    linktree: null,
    instagram: null,
    errors: []
  };

  try {
    // ========== Target 1: OnPercs.com - Biography ==========
    console.log('\n📄 Scraping OnPercs.com...');
    try {
      const onpercsContext = await browser.newContext({
        userAgent: UA_DESKTOP,
        viewport: { width: 1920, height: 1080 }
      });
      const onpercsPage = await onpercsContext.newPage();

      await onpercsPage.goto(URLS.onpercs, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // Wait for page to load
      await onpercsPage.waitForTimeout(3000);

      // Try to find bio/about section using multiple strategies
      const bioText = await onpercsPage.evaluate(() => {
        // Strategy 1: Look for common about/bio section selectors
        const selectors = [
          '[class*="about"]',
          '[class*="bio"]',
          '[class*="story"]',
          '[id*="about"]',
          '[id*="bio"]',
          '[id*="story"]',
          'section[class*="about"]',
          'section[class*="bio"]',
          '.about-text',
          '.bio-text',
          '.about-content',
          '.bio-content'
        ];

        let bioContent = '';

        for (const selector of selectors) {
          const element = document.querySelector(selector);
          if (element && element.textContent.trim().length > 50) {
            bioContent = element.textContent.trim();
            break;
          }
        }

        // Strategy 2: Look for paragraphs in main content areas
        if (!bioContent) {
          const mainContent = document.querySelector('main') ||
                             document.querySelector('article') ||
                             document.querySelector('.content');
          if (mainContent) {
            const paragraphs = mainContent.querySelectorAll('p');
            bioContent = Array.from(paragraphs)
              .map(p => p.textContent.trim())
              .filter(text => text.length > 20)
              .join('\n\n')
              .slice(0, 2000);
          }
        }

        // Strategy 3: Fallback - get all substantial text content
        if (!bioContent) {
          bioContent = document.body.innerText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 30 && line.length < 500)
            .slice(0, 10)
            .join('\n\n');
        }

        return bioContent || 'Biography not available';
      });

      results.onpercs = {
        url: URLS.onpercs,
        scrapedAt: new Date().toISOString(),
        biography: bioText
      };

      console.log('✅ OnPercs.com - Biography extracted');
      await onpercsContext.close();
    } catch (error) {
      results.errors.push({
        source: 'onpercs',
        error: error.message
      });
      console.log('❌ OnPercs.com failed:', error.message);
    }

    // ========== Target 2: Linktree - Dynamic React Content ==========
    console.log('\n🔗 Scraping Linktree...');
    try {
      const linktreeContext = await browser.newContext({
        userAgent: UA_DESKTOP,
        viewport: { width: 1920, height: 1080 }
      });
      const linktreePage = await linktreeContext.newPage();

      await linktreePage.goto(URLS.linktree, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // Wait for React content to fully load
      await linktreePage.waitForTimeout(5000);

      // Wait for links to be present
      try {
        await linktreePage.waitForSelector('[data-testid="link-tree-link"]', {
          timeout: 10000
        }).catch(() => {});
      } catch (e) {
        await linktreePage.waitForSelector('a[href]', { timeout: 5000 });
      }

      // Extract all links using page.evaluate for React SPA
      const links = await linktreePage.evaluate(() => {
        const linkElements = document.querySelectorAll('a[href]');
        const linksArray = [];

        linkElements.forEach(el => {
          const title = el.textContent.trim() ||
                       el.getAttribute('aria-label') ||
                       el.querySelector('[class*="title"]')?.textContent.trim() ||
                       '';

          const href = el.href;

          // Filter out empty or navigation links
          if (title && href && !href.includes('#') && !href.startsWith('javascript:')) {
            linksArray.push({
              title: title,
              url: href
            });
          }
        });

        // Remove duplicates
        const uniqueLinks = linksArray.filter(
          (link, index, self) =>
            index === self.findIndex(l => l.url === link.url)
        );

        return uniqueLinks;
      });

      results.linktree = {
        url: URLS.linktree,
        scrapedAt: new Date().toISOString(),
        links: links
      };

      console.log(`✅ Linktree - ${links.length} links extracted`);
      await linktreeContext.close();
    } catch (error) {
      results.errors.push({
        source: 'linktree',
        error: error.message
      });
      console.log('❌ Linktree failed:', error.message);
    }

    // ========== Target 3: Instagram - Bypass Login Wall ==========
    console.log('\n📸 Scraping Instagram...');
    try {
      const instagramContext = await browser.newContext({
        userAgent: UA_MOBILE,
        viewport: { width: 390, height: 844 }
      });
      const instagramPage = await instagramContext.newPage();

      await instagramPage.goto(URLS.instagram, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // Wait for content to load
      await instagramPage.waitForTimeout(5000);

      // Try to extract profile data before any login popup blocks content
      const instagramData = await instagramPage.evaluate(() => {
        // Helper function to extract numbers from text like "1.2K followers"
        const extractCount = (text) => {
          if (!text) return null;
          const match = text.match(/([\d.]+[KMB]?)|\d+/i);
          return match ? match[0] : null;
        };

        // Try multiple selector strategies for follower count
        const followerSelectors = [
          'meta[property="og:description"]',
          '[class*="follower"]',
          '.g47SY',
          'li[class*="rhpnm"]',
          '[class*="primary"] [class*="text"]'
        ];

        let followerCount = null;
        for (const selector of followerSelectors) {
          const element = document.querySelector(selector);
          if (element) {
            const text = element.textContent || element.getAttribute('content') || '';
            if (text.toLowerCase().includes('follower')) {
              followerCount = extractCount(text);
              break;
            }
          }
        }

        // Try to get from meta tags
        if (!followerCount) {
          const metaDesc = document.querySelector('meta[property="og:description"]');
          if (metaDesc) {
            const content = metaDesc.getAttribute('content') || '';
            followerCount = extractCount(content);
          }
        }

        // Try multiple selector strategies for bio
        const bioSelectors = [
          'meta[property="og:description"]',
          '[class*="bio"]',
          '.C4P39',
          '[class*="description"]',
          'h1[class*="text"]',
          '.x1lliihq'
        ];

        let bio = null;
        for (const selector of bioSelectors) {
          const element = document.querySelector(selector);
          if (element) {
            const text = element.textContent || element.getAttribute('content') || '';
            if (text.length > 10 && text.length < 500 && !text.toLowerCase().includes('follower')) {
              bio = text.trim();
              break;
            }
          }
        }

        // Get profile name
        const nameSelectors = [
          'meta[property="og:title"]',
          '[class*="name"]',
          '.zVjjj',
          'h1'
        ];

        let profileName = null;
        for (const selector of nameSelectors) {
          const element = document.querySelector(selector);
          if (element) {
            profileName = (element.textContent || element.getAttribute('content') || '').trim();
            if (profileName && profileName.length < 100) break;
          }
        }

        return {
          followerCount: followerCount,
          bio: bio,
          profileName: profileName,
          isBlocked: document.body.innerText.toLowerCase().includes('log in') ||
                     document.body.innerText.toLowerCase().includes('sign up')
        };
      });

      // Check if we hit the login wall
      if (instagramData.isBlocked && !instagramData.bio && !instagramData.followerCount) {
        throw new Error('Instagram login wall blocked content access. Stealth plugin could not bypass.');
      }

      results.instagram = {
        url: URLS.instagram,
        scrapedAt: new Date().toISOString(),
        profileName: instagramData.profileName || 'Mike Rainey',
        followerCount: instagramData.followerCount || 'Not available',
        bio: instagramData.bio || 'Not available - Login wall may have blocked access'
      };

      console.log('✅ Instagram - Profile data extracted');
      await instagramContext.close();
    } catch (error) {
      results.errors.push({
        source: 'instagram',
        error: error.message
      });
      console.log('❌ Instagram failed:', error.message);
      results.instagram = {
        url: URLS.instagram,
        scrapedAt: new Date().toISOString(),
        profileName: 'Mike Rainey',
        followerCount: 'Not available',
        bio: 'Not available - Scraping failed',
        note: error.message
      };
    }

    // ========== Save Results ==========
    console.log('\n💾 Saving results to', OUTPUT_FILE);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), 'utf8');

    console.log('\n✅ Scraping complete!');
    console.log('\n📊 Summary:');
    console.log(`   - OnPercs: ${results.onpercs ? '✅ Success' : '❌ Failed'}`);
    console.log(`   - Linktree: ${results.linktree ? `✅ Success (${results.linktree.links.length} links)` : '❌ Failed'}`);
    console.log(`   - Instagram: ${results.instagram && results.instagram.bio !== 'Not available - Scraping failed' ? '✅ Success' : '⚠️  Partial/Failed'}`);

    if (results.errors.length > 0) {
      console.log('\n⚠️  Errors encountered:');
      results.errors.forEach(err => {
        console.log(`   - ${err.source}: ${err.error}`);
      });
    }

  } catch (error) {
    console.error('\n💥 Critical error:', error.message);
    results.errors.push({
      source: 'critical',
      error: error.message
    });
  } finally {
    await browser.close();
  }

  return results;
}

// Run the scraper
(async () => {
  console.log('🚀 Starting Mike Rainey Profile Scraper...');
  console.log('📌 Target: Comedian Mike Rainey');
  console.log('🔗 Sources: OnPercs.com, Linktree, Instagram');
  console.log('─'.repeat(50));

  try {
    await scrapeMikeRaineyData();
  } catch (error) {
    console.error('💥 Scraper failed:', error.message);
    process.exit(1);
  }
})();
