import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

chromium.use(stealth());

const DATA_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'src/data/data.json');

async function scrapeJDSpencer() {
  console.log('🎸 Scraping J.D. Spencer links...\n');
  
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
    
    console.log('📄 Navigating to distrokid link...');
    await page.goto('https://distrokid.com/hyperfollow/jdspencer/its-so-hard-2?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGn2Dle-WKfcltX_StZf_C9eC7tKENgjPUpFYiTrcS1DD3qKg8tpcIMEGXyTKI_aem_GFKaZslDvIVib-JrRAd5qA', {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    await page.waitForTimeout(5000);

    // Extract all links
    const scrapedData = await page.evaluate(() => {
      const data = {
        links: []
      };

      const links = document.querySelectorAll('a[href]');
      links.forEach(link => {
        const href = link.href;
        const text = link.textContent.trim();
        
        if (href && !href.includes('distrokid.com') && text && !href.startsWith('javascript:')) {
          data.links.push({
            text: text,
            url: href
          });
        }
      });

      return data;
    });

    console.log('\n✅ Scraped Links:');
    console.log('─'.repeat(50));
    scrapedData.links.forEach((link, i) => {
      console.log(`  ${i + 1}. ${link.text}: ${link.url}`);
    });

    // Process links into categories
    const socialLinks = {
      instagram: '',
      facebook: '',
      twitter: '',
      youtube: '',
      spotify: '',
      appleMusic: '',
      website: '',
      bandcamp: '',
      soundcloud: '',
      tiktok: ''
    };

    const musicLinks = {
      spotify: '',
      appleMusic: '',
      youtube: '',
      bandcamp: '',
      soundcloud: ''
    };

    scrapedData.links.forEach(link => {
      const url = link.url.toLowerCase();
      
      if (url.includes('instagram.com')) {
        socialLinks.instagram = link.url;
      } else if (url.includes('facebook.com')) {
        socialLinks.facebook = link.url;
      } else if (url.includes('twitter.com') || url.includes('x.com')) {
        socialLinks.twitter = link.url;
      } else if (url.includes('youtube.com')) {
        socialLinks.youtube = link.url;
        musicLinks.youtube = link.url;
      } else if (url.includes('spotify.com')) {
        socialLinks.spotify = link.url;
        musicLinks.spotify = link.url;
      } else if (url.includes('music.apple.com') || url.includes('itunes.apple.com')) {
        socialLinks.appleMusic = link.url;
        musicLinks.appleMusic = link.url;
      } else if (url.includes('bandcamp.com')) {
        socialLinks.bandcamp = link.url;
        musicLinks.bandcamp = link.url;
      } else if (url.includes('soundcloud.com')) {
        socialLinks.soundcloud = link.url;
        musicLinks.soundcloud = link.url;
      } else if (url.includes('tiktok.com')) {
        socialLinks.tiktok = link.url;
      } else {
        socialLinks.website = link.url;
      }
    });

    console.log('\n📝 Processed Links:');
    console.log('  Instagram:', socialLinks.instagram || 'Not found');
    console.log('  Facebook:', socialLinks.facebook || 'Not found');
    console.log('  YouTube:', socialLinks.youtube || 'Not found');
    console.log('  Spotify:', socialLinks.spotify || 'Not found');
    console.log('  Apple Music:', socialLinks.appleMusic || 'Not found');
    console.log('  Bandcamp:', socialLinks.bandcamp || 'Not found');
    console.log('  SoundCloud:', socialLinks.soundcloud || 'Not found');
    console.log('  TikTok:', socialLinks.tiktok || 'Not found');

    // Update data.json
    console.log('\n📝 Updating data.json...');
    const currentData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    
    let artistIndex = currentData.artists.findIndex(a => 
      a.name.toLowerCase().includes('j.d.') || a.name.toLowerCase().includes('jd spencer')
    );
    
    if (artistIndex !== -1) {
      const artist = currentData.artists[artistIndex];
      
      // Update social links
      if (socialLinks.instagram) {
        artist.socialLinks.instagram = socialLinks.instagram;
        console.log('✅ Updated Instagram');
      }
      if (socialLinks.facebook) {
        artist.socialLinks.facebook = socialLinks.facebook;
        console.log('✅ Updated Facebook');
      }
      if (socialLinks.youtube) {
        artist.socialLinks.youtube = socialLinks.youtube;
        console.log('✅ Updated YouTube');
      }
      if (socialLinks.spotify) {
        artist.socialLinks.spotify = socialLinks.spotify;
        console.log('✅ Updated Spotify');
      }
      if (socialLinks.appleMusic) {
        artist.socialLinks.appleMusic = socialLinks.appleMusic;
        console.log('✅ Updated Apple Music');
      }
      if (socialLinks.bandcamp) {
        artist.socialLinks.bandcamp = socialLinks.bandcamp;
        console.log('✅ Updated Bandcamp');
      }
      if (socialLinks.soundcloud) {
        artist.socialLinks.soundcloud = socialLinks.soundcloud;
        console.log('✅ Updated SoundCloud');
      }
      if (socialLinks.tiktok) {
        artist.socialLinks.tiktok = socialLinks.tiktok;
        console.log('✅ Updated TikTok');
      }
      if (socialLinks.website) {
        artist.socialLinks.website = socialLinks.website;
        console.log('✅ Updated Website');
      }
      
      // Update music links
      if (musicLinks.spotify) {
        artist.musicLinks.spotify = musicLinks.spotify;
      }
      if (musicLinks.appleMusic) {
        artist.musicLinks.appleMusic = musicLinks.appleMusic;
      }
      if (musicLinks.youtube) {
        artist.musicLinks.youtube = musicLinks.youtube;
      }
      if (musicLinks.bandcamp) {
        artist.musicLinks.bandcamp = musicLinks.bandcamp;
      }
      if (musicLinks.soundcloud) {
        artist.musicLinks.soundcloud = musicLinks.soundcloud;
      }
      
      currentData.artists[artistIndex] = artist;
      fs.writeFileSync(DATA_FILE, JSON.stringify(currentData, null, 2), 'utf8');
      console.log('✅ Saved updates to src/data/data.json');
    } else {
      console.log('❌ J.D. Spencer not found in data.json');
    }

    await context.close();
    console.log('\n🎉 Scraping complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

scrapeJDSpencer().catch(console.error);
