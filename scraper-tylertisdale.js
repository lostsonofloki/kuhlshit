import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

chromium.use(stealth());

const DATA_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'src/data/data.json');

async function scrapeTylerTisdale() {
  console.log('🎸 Scraping Tyler Tisdale website...\n');
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();
    
    console.log('📄 Navigating to tylertisdalemusic.com...');
    await page.goto('https://www.tylertisdalemusic.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    await page.waitForTimeout(5000);

    // Extract all links and bio
    const scrapedData = await page.evaluate(() => {
      const data = {
        bio: '',
        links: []
      };

      // Get bio text
      const paragraphs = document.querySelectorAll('p');
      paragraphs.forEach(p => {
        const text = p.textContent.trim();
        if (text.length > 30 && text.length < 500 && !text.includes('Copyright') && !text.includes('©')) {
          data.bio += text + '\n\n';
        }
      });

      // Get all links
      const links = document.querySelectorAll('a[href]');
      links.forEach(link => {
        const href = link.href;
        if (href && !href.includes('tylertisdalemusic.com') && !href.startsWith('javascript:')) {
          data.links.push(href);
        }
      });

      return data;
    });

    console.log('\n✅ Scraped Bio:');
    console.log('─'.repeat(50));
    console.log(scrapedData.bio.substring(0, 300) + '...');

    console.log('\n✅ Scraped Links:');
    console.log('─'.repeat(50));
    scrapedData.links.forEach((link, i) => {
      console.log(`  ${i + 1}. ${link}`);
    });

    // Process links into categories
    const socialLinks = {
      instagram: '',
      facebook: '',
      twitter: '',
      youtube: 'https://youtu.be/Pw1cX_dxaCM?si=isOsUsY8mGtj6hlw',
      spotify: '',
      appleMusic: '',
      website: 'https://www.tylertisdalemusic.com/',
      bandcamp: '',
      soundcloud: '',
      tiktok: ''
    };

    const musicLinks = {
      spotify: '',
      appleMusic: '',
      youtube: 'https://youtu.be/Pw1cX_dxaCM?si=isOsUsY8mGtj6hlw',
      bandcamp: '',
      soundcloud: ''
    };

    scrapedData.links.forEach(href => {
      const url = href.toLowerCase();
      
      if (url.includes('instagram.com')) {
        socialLinks.instagram = href;
      } else if (url.includes('facebook.com')) {
        socialLinks.facebook = href;
      } else if (url.includes('twitter.com') || url.includes('x.com')) {
        socialLinks.twitter = href;
      } else if (url.includes('youtube.com') && !socialLinks.youtube) {
        socialLinks.youtube = href;
        musicLinks.youtube = href;
      } else if (url.includes('spotify.com')) {
        socialLinks.spotify = href;
        musicLinks.spotify = href;
      } else if (url.includes('music.apple.com') || url.includes('itunes.apple.com')) {
        socialLinks.appleMusic = href;
        musicLinks.appleMusic = href;
      } else if (url.includes('bandcamp.com')) {
        socialLinks.bandcamp = href;
        musicLinks.bandcamp = href;
      } else if (url.includes('soundcloud.com')) {
        socialLinks.soundcloud = href;
        musicLinks.soundcloud = href;
      } else if (url.includes('tiktok.com')) {
        socialLinks.tiktok = href;
      }
    });

    console.log('\n📝 Processed Links:');
    console.log('  Instagram:', socialLinks.instagram || 'Not found');
    console.log('  Facebook:', socialLinks.facebook || 'Not found');
    console.log('  YouTube:', socialLinks.youtube);
    console.log('  Spotify:', socialLinks.spotify || 'Not found');
    console.log('  Apple Music:', socialLinks.appleMusic || 'Not found');

    // Update data.json
    console.log('\n📝 Updating data.json...');
    const currentData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    
    let artistIndex = currentData.artists.findIndex(a => 
      a.name.toLowerCase().includes('tyler') && a.name.toLowerCase().includes('tisdale')
    );
    
    if (artistIndex !== -1) {
      const artist = currentData.artists[artistIndex];
      
      if (scrapedData.bio && scrapedData.bio.length > 50) {
        artist.bio = scrapedData.bio.substring(0, 300);
        console.log('✅ Updated bio');
      }
      
      if (socialLinks.instagram) {
        artist.socialLinks.instagram = socialLinks.instagram;
        console.log('✅ Updated Instagram');
      }
      if (socialLinks.facebook) {
        artist.socialLinks.facebook = socialLinks.facebook;
        console.log('✅ Updated Facebook');
      }
      if (socialLinks.spotify) {
        artist.socialLinks.spotify = socialLinks.spotify;
        console.log('✅ Updated Spotify');
      }
      if (socialLinks.appleMusic) {
        artist.socialLinks.appleMusic = socialLinks.appleMusic;
        console.log('✅ Updated Apple Music');
      }
      
      if (musicLinks.spotify) {
        artist.musicLinks.spotify = musicLinks.spotify;
      }
      if (musicLinks.appleMusic) {
        artist.musicLinks.appleMusic = musicLinks.appleMusic;
      }
      
      currentData.artists[artistIndex] = artist;
      fs.writeFileSync(DATA_FILE, JSON.stringify(currentData, null, 2), 'utf8');
      console.log('✅ Saved updates to src/data/data.json');
    } else {
      console.log('❌ Tyler Tisdale not found in data.json');
    }

    await context.close();
    console.log('\n🎉 Scraping complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

scrapeTylerTisdale().catch(console.error);
