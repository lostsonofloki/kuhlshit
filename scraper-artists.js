import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

chromium.use(stealth());

const OUTPUT_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'src/data/artists.json');
const DATA_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'src/data/data.json');

// PorchFest lineup from existing data
const porchFestArtists = [
  // Friday
  { name: "The Stifftones", location: "Columbus, MS" },
  { name: "Fire Camino", location: "Columbus, MS" },
  { name: "Katie Burkhardt", location: "Columbus, MS" },
  { name: "Elliot Devaughn", location: "Columbus, MS" },
  { name: "Phillip Savell", location: "Columbus, MS" },
  { name: "The Wright Moves", location: "Columbus, MS" },
  // Saturday
  { name: "Honey Boy and Boots", location: "Columbus, MS" },
  { name: "Hayden Hunter & The Yearly Trials", location: "Columbus, MS" },
  { name: "Camm Lewis", location: "Columbus, MS" },
  { name: "Taylor Hollingsworth", location: "Columbus, MS" },
  { name: "Will Stewart", location: "Columbus, MS" },
  { name: "B.B. Palmer", location: "Columbus, MS" },
  { name: "Shake It Like a Caveman", location: "Columbus, MS" },
  { name: "Gordon Licciardi", location: "Columbus, MS" },
  { name: "Ritch Henderson", location: "Columbus, MS" },
  // Sunday
  { name: "Ming Donkey", location: "Columbus, MS" },
  { name: "Jonny Hollis", location: "Columbus, MS" },
  { name: "The Kites", location: "Columbus, MS" },
  { name: "Haysop", location: "Columbus, MS" },
  { name: "J.D. Spencer", location: "Columbus, MS" },
  { name: "Tyler Tisdale", location: "Columbus, MS" },
  { name: "Brad & Wes", location: "Columbus, MS" },
];

// YouTube playlist for Closed on Sundays
const YOUTUBE_PLAYLIST_ID = 'PLzKakvgn9O5SVJcmGFIRc77zk8Asib1Ek';
const YOUTUBE_API_KEY = 'AIzaSyBzicLYfHpJf234Vb5rIf--lRKdQoO4YNs';

async function fetchYouTubeArtists() {
  console.log('📺 Fetching artists from YouTube playlist...');
  
  try {
    let allItems = [];
    let nextPageToken = null;

    do {
      let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${YOUTUBE_PLAYLIST_ID}&maxResults=50&key=${YOUTUBE_API_KEY}`;
      if (nextPageToken) {
        url += `&pageToken=${nextPageToken}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.items) {
        allItems = allItems.concat(data.items);
      }
      nextPageToken = data.nextPageToken;
    } while (nextPageToken);

    // Extract unique artist names from video titles
    const artistNames = new Set();
    allItems.forEach(item => {
      const title = item.snippet.title;
      // Try to extract artist name from title patterns like:
      // "Artist Name - Song Title" or "Artist Name | Live Session"
      const match = title.match(/^([^|-]+?)(?:\s*[-|]\s*.*)?$/i);
      if (match && match[1].trim()) {
        artistNames.add(match[1].trim());
      }
    });

    console.log(`   Found ${artistNames.size} unique artists from YouTube`);
    return Array.from(artistNames).map(name => ({
      name,
      location: "Columbus, MS",
      source: "youtube"
    }));
  } catch (error) {
    console.error('   Error fetching YouTube artists:', error.message);
    return [];
  }
}

async function scrapeArtistDetails(browser, artistName) {
  console.log(`   Scraping: ${artistName}`);
  
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Try Instagram search
    await page.goto(`https://www.instagram.com/web/search/topsearch/?query=${encodeURIComponent(artistName)}`, {
      waitUntil: 'networkidle',
      timeout: 15000
    });
    
    const instagramData = await page.evaluate(() => {
      // This is a simplified search - Instagram's API is limited
      return null;
    });

    await page.close();
    
    return {
      instagram: null,
      website: null
    };
  } catch (error) {
    console.log(`      Could not scrape details: ${error.message}`);
    return {
      instagram: null,
      website: null
    };
  }
}

async function main() {
  console.log('🎵 Starting Artist Scraper for Kuhlshit.com\n');
  
  // Fetch YouTube artists
  const youtubeArtists = await fetchYouTubeArtists();
  
  // Combine with PorchFest artists
  const allArtistNames = new Set();
  const combinedArtists = [];
  
  // Add PorchFest artists
  porchFestArtists.forEach(artist => {
    if (!allArtistNames.has(artist.name.toLowerCase())) {
      allArtistNames.add(artist.name.toLowerCase());
      combinedArtists.push({
        ...artist,
        source: 'porchfest'
      });
    }
  });
  
  // Add YouTube artists (avoiding duplicates)
  youtubeArtists.forEach(artist => {
    if (!allArtistNames.has(artist.name.toLowerCase())) {
      allArtistNames.add(artist.name.toLowerCase());
      combinedArtists.push(artist);
    }
  });
  
  console.log(`\n📊 Total unique artists: ${combinedArtists.length}`);
  console.log(`   - PorchFest: ${porchFestArtists.length}`);
  console.log(`   - YouTube (Closed on Sundays): ${youtubeArtists.length}`);
  
  // Launch browser for detailed scraping
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  // Generate artist data
  const artistsData = combinedArtists.map((artist, index) => {
    const id = `artist-${String(index + 1).padStart(3, '0')}`;
    const safeName = artist.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    return {
      id: id,
      name: artist.name,
      location: artist.location || "Columbus, MS",
      bio: `${artist.name} is a talented musician performing in the Columbus, MS area. Catch them live at local venues and events.`,
      imageUrl: `/resources/artists/${safeName}.jpg`,
      thumbnailUrl: `/resources/artists/thumbs/${safeName}-thumb.jpg`,
      vibeTags: [],
      still: {
        set: { videoId: '', title: '', duration: '' },
        interview: { videoId: '', title: '', duration: '' },
        story: { videoId: '', title: '', duration: '' }
      },
      porchTalk: {
        url: '',
        episodeId: '',
        title: '',
        description: ''
      },
      socialLinks: {
        instagram: '',
        website: '',
        twitter: '',
        facebook: ''
      },
      musicLinks: {
        spotify: '',
        appleMusic: '',
        youtube: ''
      },
      featured: index < 6,
      publishDate: new Date().toISOString().split('T')[0]
    };
  });
  
  await browser.close();
  
  // Save artists data
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(artistsData, null, 2), 'utf8');
  console.log(`\n✅ Saved ${artistsData.length} artists to src/data/artists.json`);
  
  // Update main data.json to reference artists
  const currentData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  currentData.artists = artistsData;
  currentData.metadata.totalArtists = artistsData.length;
  currentData.metadata.lastUpdated = new Date().toISOString().split('T')[0];
  fs.writeFileSync(DATA_FILE, JSON.stringify(currentData, null, 2), 'utf8');
  console.log(`✅ Updated src/data/data.json with artist count`);
  
  console.log('\n🎉 Artist scraping complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Add artist images to /public/resources/artists/');
  console.log('   2. Update social links manually for each artist');
  console.log('   3. Add YouTube video IDs for Closed on Sundays episodes');
}

main().catch(console.error);
