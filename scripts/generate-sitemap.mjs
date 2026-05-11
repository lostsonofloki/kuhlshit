/**
 * Runs after `vite build`; writes `dist/sitemap.xml` from routes + artist IDs in data.json.
 *
 * Google Search Console → Sitemaps: submit the **full HTTPS URL** for the same host as your
 * property (usually `https://www.kuhlshit.com/sitemap.xml`). Use `sitemap.xml` only if the UI
 * asks for a path relative to the verified URL-prefix. Domain properties accept the full URL.
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const data = JSON.parse(
  readFileSync(join(root, "src", "data", "data.json"), "utf8"),
);

const site = (
  process.env.VITE_SITE_ORIGIN || "https://www.kuhlshit.com"
).replace(/\/$/, "");

const staticPaths = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/artists", changefreq: "weekly", priority: "0.85" },
  { loc: "/closed-on-sundays", changefreq: "weekly", priority: "0.75" },
  { loc: "/porchfest", changefreq: "weekly", priority: "0.9" },
  { loc: "/porchfest/artists", changefreq: "weekly", priority: "0.9" },
  { loc: "/porch-talk", changefreq: "weekly", priority: "0.75" },
  { loc: "/vault", changefreq: "weekly", priority: "0.8" },
  { loc: "/waitlist", changefreq: "monthly", priority: "0.7" },
  { loc: "/spotcheck", changefreq: "yearly", priority: "0.3" },
];

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const artistUrls = (data.artists || []).map((a) => ({
  loc: `/porchfest/artists/${a.id}`,
  changefreq: "monthly",
  priority: "0.65",
}));

const urls = [...staticPaths, ...artistUrls];

const body = urls
  .map(
    (u) => `  <url>
    <loc>${esc(site + u.loc)}</loc>
    <changefreq>${esc(u.changefreq)}</changefreq>
    <priority>${esc(u.priority)}</priority>
  </url>`,
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

writeFileSync(join(root, "dist", "sitemap.xml"), xml, "utf8");
console.log("Wrote dist/sitemap.xml with", urls.length, "URLs");
console.log(`GSC sitemap URL (copy if needed): ${site}/sitemap.xml`);
