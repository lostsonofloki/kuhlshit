/**
 * Harvest artwork images from https://www.joemacgown.com/ (Wix Pro Gallery).
 * Downloads to public/resources/artists/joe-macgown/work-XX.jpg
 *
 * Usage:
 *   node scripts/scrape-joemacgown-gallery.mjs
 *   PAGES="https://www.joemacgown.com/surreal-color-1,..." node scripts/scrape-joemacgown-gallery.mjs
 *   MAX_IMAGES=15 node scripts/scrape-joemacgown-gallery.mjs
 */
import { createWriteStream, mkdirSync, renameSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SITE = "https://www.joemacgown.com";
const OUT_DIR = resolve(ROOT, "public", "resources", "artists", "joe-macgown");
const MANIFEST = resolve(ROOT, "tmp", "joe-macgown-scrape.json");

const DEFAULT_PAGES = [
  `${SITE}/surreal-color-1`,
  `${SITE}/surreal-drawings-1`,
  `${SITE}/surreal-color-4`,
  `${SITE}/copy-of-fish-aquatic`,
];

const PAGES = process.env.PAGES
  ? process.env.PAGES.split(",").map((s) => s.trim()).filter(Boolean)
  : DEFAULT_PAGES;

const MAX_IMAGES = Number(process.env.MAX_IMAGES || 15);
const MIN_BYTES = 8_000;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Full Wix media filename (e.g. abc6be_9089…~mv2.jpg) — NOT just the site prefix. */
function wixMediaId(url) {
  const m = String(url).match(/\/media\/([^/?#]+)/i);
  return m ? m[1].toLowerCase() : url.split("?")[0].toLowerCase();
}

function widthFromWixUrl(url) {
  const m = String(url).match(/\/v1\/fill\/w_(\d+),/i);
  if (m) return Number(m[1]);
  const m2 = String(url).match(/w_(\d+)/i);
  return m2 ? Number(m2[1]) : 0;
}

function isLikelyArtUrl(url) {
  const u = String(url).toLowerCase();
  if (!u.includes("wixstatic.com")) return false;
  if (!u.includes("/media/")) return false;
  if (/\.wix_mp|favicon|logo|icon|avatar|joe2019|mug\.jpg/i.test(u)) return false;
  if (/media\/89b1d2497b29ccbb7d37be1ec6ef0052|media\/9f9c321c774844b793180620472aa4f1|media\/221eb5f37f0741bbafb2f8e5852b5103|e1714b916bdc41a0bef46338e389cc46/i.test(u)) {
    return false;
  }
  const w = widthFromWixUrl(url);
  if (w > 0 && w < 180) return false;
  return true;
}

function normalizeWixImageUrl(url) {
  const base = String(url).split("/v1/")[0];
  return base.includes("/media/") ? base : url;
}

const WIX_MEDIA_RE =
  /https:\/\/static\.wixstatic\.com\/media\/[^"'\\s<>]+?\.(?:jpe?g|png|webp)/gi;

function extractWixUrlsFromHtml(html) {
  const found = new Set();
  for (const m of html.matchAll(WIX_MEDIA_RE)) {
    const u = m[0];
    if (isLikelyArtUrl(u)) found.add(normalizeWixImageUrl(u));
  }
  return [...found];
}

async function scrollPage(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0;
      const step = () => {
        const { scrollHeight } = document.documentElement;
        window.scrollBy(0, Math.max(window.innerHeight, 600));
        total += Math.max(window.innerHeight, 600);
        if (total >= scrollHeight + 600) resolve();
        else setTimeout(step, 250);
      };
      step();
    });
  });
  await sleep(600);
}

async function collectImagesOnPage(page) {
  const fromNetwork = new Set();
  const handler = (res) => {
    const u = res.url();
    if (!u.includes("wixstatic.com/media/")) return;
    if (isLikelyArtUrl(u)) fromNetwork.add(normalizeWixImageUrl(u));
  };
  page.on("response", handler);

  try {
    await scrollPage(page);
    await sleep(2000);
    await scrollPage(page);
    await sleep(1500);

    const html = await page.content();
    const fromHtml = extractWixUrlsFromHtml(html);

    const fromDom = await page.evaluate(() => {
      const found = new Set();
      const add = (raw) => {
        if (!raw) return;
        for (const part of String(raw).split(",")) {
          const bit = part.trim().split(/\s+/)[0];
          if (bit) found.add(bit);
        }
      };
      for (const img of document.querySelectorAll(
        "img[src], img[srcset], img[data-src], source[srcset]",
      )) {
        add(img.getAttribute("src"));
        add(img.getAttribute("data-src"));
        add(img.getAttribute("srcset"));
      }
      for (const el of document.querySelectorAll("[data-image-info]")) {
        const info = el.getAttribute("data-image-info");
        if (!info) continue;
        try {
          const parsed = JSON.parse(info);
          if (parsed?.imageData?.uri) add(parsed.imageData.uri);
          if (parsed?.uri) add(parsed.uri);
        } catch {
          // ignore
        }
      }
      return [...found];
    });

    const domNorm = fromDom.filter(isLikelyArtUrl).map(normalizeWixImageUrl);
    return [...new Set([...fromHtml, ...domNorm, ...fromNetwork])];
  } finally {
    page.off("response", handler);
  }
}

async function downloadImage(url, destPath) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Referer: SITE,
    },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("image")) throw new Error(`Not an image: ${ct}`);
  await pipeline(res.body, createWriteStream(destPath));
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(dirname(MANIFEST), { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    locale: "en-US",
  });
  const page = await context.newPage();

  /** @type {Map<string, { url: string, sourcePage: string, alt?: string }>[]} */
  const perPage = [];

  for (const href of PAGES) {
    let path = href;
    try {
      path = new URL(href).pathname;
    } catch {
      // keep href
    }
    process.stderr.write(`Scanning ${path} …\n`);
    const pageMap = new Map();
    try {
      try {
        await page.goto(href, { waitUntil: "domcontentloaded", timeout: 60_000 });
      } catch {
        await page.goto(href, { waitUntil: "load", timeout: 60_000 });
      }
      await sleep(3500);

      const alts = await page.evaluate(() =>
        [...document.querySelectorAll("img[alt]")].map((img) => ({
          src: img.src || "",
          alt: (img.alt || "").trim(),
        })),
      );

      const imgs = await collectImagesOnPage(page);
      for (const url of imgs) {
        const id = wixMediaId(url);
        if (pageMap.has(id)) continue;
        const hash = id.match(/_([a-f0-9]{8,})/i)?.[1] || id;
        const altMatch = alts.find(
          (a) => a.src.includes(hash) && a.alt.length > 1,
        );
        const alt = altMatch?.alt;
        pageMap.set(id, { url, sourcePage: href, alt });
      }
      process.stderr.write(`  found ${pageMap.size} unique on page\n`);
      if (pageMap.size > 0) perPage.push(pageMap);
    } catch (err) {
      process.stderr.write(`  skip ${path}: ${err.message}\n`);
    }
  }

  /** Round-robin: one image per page per pass until MAX_IMAGES. */
  const byId = new Map();
  let added = true;
  while (byId.size < MAX_IMAGES && added) {
    added = false;
    for (const pageMap of perPage) {
      if (byId.size >= MAX_IMAGES) break;
      const next = pageMap.entries().next();
      if (next.done) continue;
      const [id, meta] = next.value;
      if (byId.has(id)) {
        pageMap.delete(id);
        continue;
      }
      byId.set(id, meta);
      pageMap.delete(id);
      added = true;
    }
  }

  const manifest = {
    scrapedAt: new Date().toISOString(),
    site: SITE,
    pagesVisited: PAGES,
    downloaded: [],
    skipped: [],
  };

  let index = 0;
  for (const [, { url, sourcePage, alt }] of byId) {
    if (manifest.downloaded.length >= MAX_IMAGES) break;
    const tmp = resolve(OUT_DIR, `_tmp-${wixMediaId(url).replace(/[^a-z0-9.-]/gi, "_")}.jpg`);
    try {
      await downloadImage(url, tmp);
      const size = statSync(tmp).size;
      if (size < MIN_BYTES) {
        unlinkSync(tmp);
        manifest.skipped.push({
          url,
          reason: `too small (${size} bytes)`,
          sourcePage,
        });
        process.stderr.write(`  skip (too small, ${size}b)\n`);
        continue;
      }
      index += 1;
      const name = `work-${String(index).padStart(2, "0")}.jpg`;
      const dest = resolve(OUT_DIR, name);
      renameSync(tmp, dest);
      manifest.downloaded.push({ file: name, url, sourcePage, alt: alt || null });
      process.stderr.write(`  saved ${name}${alt ? ` (${alt})` : ""}\n`);
    } catch (err) {
      try {
        unlinkSync(tmp);
      } catch {
        // ignore
      }
      manifest.skipped.push({ url, reason: err.message, sourcePage });
      process.stderr.write(`  failed: ${err.message}\n`);
    }
  }

  writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  process.stderr.write(
    `Done: ${manifest.downloaded.length} images → ${OUT_DIR}\nManifest: ${MANIFEST}\n`,
  );

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
