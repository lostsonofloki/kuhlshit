import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const artistDropFolder = path.join(root, "Artist");
const publicArtistsFolder = path.join(root, "public", "resources", "artists");
const dataPath = path.join(root, "src", "data", "data.json");

const validExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function normalizeName(value) {
  return String(value || "")
    .toLowerCase()
    .replaceAll("&", " and ")
    .replace(/[^a-z0-9]+/g, "");
}

const aliases = new Map([
  // Common source filename mismatch from Artist intake folder
  ["abepartridge", "abepartrige"],
  // "J.D. Spencer" is often dropped as "JD.*"
  ["jdspencer", "jd"],
]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf-8");
}

function main() {
  if (!fs.existsSync(artistDropFolder)) {
    console.error(`Artist drop folder not found: ${artistDropFolder}`);
    process.exit(1);
  }

  const data = readJson(dataPath);
  const artists = Array.isArray(data.artists) ? data.artists : [];

  const droppedFiles = fs
    .readdirSync(artistDropFolder)
    .map((name) => path.join(artistDropFolder, name))
    .filter((fullPath) => fs.statSync(fullPath).isFile())
    .filter((fullPath) => validExtensions.has(path.extname(fullPath).toLowerCase()))
    .sort((a, b) => path.basename(a).localeCompare(path.basename(b)));

  const fileByNormalizedName = new Map();
  for (const fullPath of droppedFiles) {
    const stem = path.parse(fullPath).name;
    fileByNormalizedName.set(normalizeName(stem), fullPath);
  }

  let copiedCount = 0;
  const unmatched = [];

  for (const artist of artists) {
    const nameKey = normalizeName(artist.name);
    let matchedFile = fileByNormalizedName.get(nameKey);
    if (!matchedFile && aliases.has(nameKey)) {
      matchedFile = fileByNormalizedName.get(aliases.get(nameKey));
    }

    if (!matchedFile) {
      unmatched.push(artist.name);
      continue;
    }

    let ext = path.extname(matchedFile).toLowerCase();
    if (ext === ".jpeg") ext = ".jpg";

    const destDir = path.join(publicArtistsFolder, artist.id);
    fs.mkdirSync(destDir, { recursive: true });

    const destFileName = `photo-1${ext}`;
    const destFilePath = path.join(destDir, destFileName);
    fs.copyFileSync(matchedFile, destFilePath);

    const webPath = `/resources/artists/${artist.id}/${destFileName}`;
    artist.imageUrl = webPath;
    artist.thumbnailUrl = webPath;
    copiedCount += 1;
  }

  writeJson(dataPath, data);

  console.log(`Synced artist photos from: ${artistDropFolder}`);
  console.log(`Artists updated: ${copiedCount}`);
  console.log(`Unmatched artists: ${unmatched.length}`);
  if (unmatched.length > 0) {
    console.log(`Unmatched list: ${unmatched.join(", ")}`);
  }
}

main();
