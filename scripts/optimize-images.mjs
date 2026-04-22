#!/usr/bin/env node
/**
 * Optimize all raster images under public/resources.
 *
 *   - Resize primary down to MAX_WIDTH (keeps aspect) and rewrite with
 *     mozjpeg / palette-quantized PNG.
 *   - Emit webp siblings at the full width AND at RESPONSIVE_WIDTHS so the
 *     client can pick the right one via <source srcSet=... sizes=...>.
 *   - Strip metadata.
 *
 * Idempotent: re-runs skip anything already marked optimized via
 * scripts/.kuhl-opt.json. Bump SCHEMA_VERSION when variant layout changes.
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const PUBLIC_DIR = path.join(ROOT, 'public', 'resources')
const STATE_FILE = path.join(ROOT, 'scripts', '.kuhl-opt.json')

const SCHEMA_VERSION = 3
const MAX_WIDTH = 1400
const RESPONSIVE_WIDTHS = [480, 960] // extra webp variants
const JPEG_QUALITY = 78
const PNG_QUALITY = 85
const WEBP_QUALITY = 74

const RASTER_EXT = new Set(['.jpg', '.jpeg', '.png'])

async function walk(dir) {
  const out = []
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...(await walk(full)))
    } else {
      out.push(full)
    }
  }
  return out
}

async function loadState() {
  try {
    const data = JSON.parse(await fs.readFile(STATE_FILE, 'utf8'))
    // On schema bump, wipe so everything regenerates.
    if (data.__schema !== SCHEMA_VERSION) return { __schema: SCHEMA_VERSION }
    return data
  } catch {
    return { __schema: SCHEMA_VERSION }
  }
}

async function saveState(state) {
  state.__schema = SCHEMA_VERSION
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2))
}

function fmtKb(bytes) {
  return `${(bytes / 1024).toFixed(1)}kb`
}

/** Derive sibling variant path. ex: foo/photo-1.jpg + 480 -> foo/photo-1@480.webp */
function variantPath(originalFile, width) {
  const dir = path.dirname(originalFile)
  const base = path.basename(originalFile).replace(/\.(jpe?g|png)$/i, '')
  return path.join(dir, `${base}@${width}.webp`)
}

function webpPath(originalFile) {
  return originalFile.replace(/\.(jpe?g|png)$/i, '.webp')
}

async function optimizeOne(file, state) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/')
  const ext = path.extname(file).toLowerCase()
  if (!RASTER_EXT.has(ext)) return null

  const stat = await fs.stat(file)
  const priorSig = state[rel]
  const sig = `${stat.size}:${Math.round(stat.mtimeMs)}`
  if (priorSig?.sig === sig && priorSig.done) return null

  const src = await fs.readFile(file)
  const img = sharp(src, { failOn: 'none' }).rotate()
  const meta = await img.metadata()
  const srcWidth = meta.width || MAX_WIDTH
  const targetWidth = Math.min(srcWidth, MAX_WIDTH)

  const primaryPipeline = img
    .clone()
    .resize({ width: targetWidth, withoutEnlargement: true })

  let primaryBuf
  if (ext === '.png') {
    primaryBuf = await primaryPipeline
      .clone()
      .png({ compressionLevel: 9, palette: true, quality: PNG_QUALITY })
      .toBuffer()
  } else {
    primaryBuf = await primaryPipeline
      .clone()
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
      .toBuffer()
  }

  const fullWebpBuf = await primaryPipeline
    .clone()
    .webp({ quality: WEBP_QUALITY, effort: 5 })
    .toBuffer()

  // Generate responsive variants for every configured width.
  // Keep withoutEnlargement=true so tiny sources are never upscaled.
  // We still emit the file even if source is smaller so srcset never
  // points to a missing URL (which would trigger 404 + fallback penalties).
  const variants = []
  for (const w of RESPONSIVE_WIDTHS) {
    const vBuf = await img
      .clone()
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 5 })
      .toBuffer()
    variants.push({ width: w, buf: vBuf })
  }

  const originalSize = src.length
  const shouldOverwritePrimary = primaryBuf.length < originalSize * 0.95
  if (shouldOverwritePrimary) {
    await fs.writeFile(file, primaryBuf)
  }
  await fs.writeFile(webpPath(file), fullWebpBuf)
  for (const v of variants) {
    await fs.writeFile(variantPath(file, v.width), v.buf)
  }

  const updatedStat = await fs.stat(file)
  const widthsEmitted = [...variants.map((v) => v.width), targetWidth].sort((a, b) => a - b)
  state[rel] = {
    sig: `${updatedStat.size}:${Math.round(updatedStat.mtimeMs)}`,
    originalSize,
    newPrimarySize: shouldOverwritePrimary ? primaryBuf.length : originalSize,
    fullWebpSize: fullWebpBuf.length,
    variantSizes: Object.fromEntries(variants.map((v) => [v.width, v.buf.length])),
    widthsEmitted,
    done: true,
  }

  return {
    file: rel,
    originalSize,
    newPrimarySize: shouldOverwritePrimary ? primaryBuf.length : originalSize,
    fullWebpSize: fullWebpBuf.length,
    variantTotal: variants.reduce((t, v) => t + v.buf.length, 0),
  }
}

async function main() {
  const state = await loadState()
  const files = await walk(PUBLIC_DIR)
  let totalBefore = 0
  let totalAfter = 0
  const changes = []

  for (const f of files) {
    try {
      const result = await optimizeOne(f, state)
      if (result) {
        totalBefore += result.originalSize
        totalAfter += result.newPrimarySize + result.fullWebpSize + result.variantTotal
        changes.push(result)
      }
    } catch (err) {
      console.warn(`[warn] ${f}: ${err.message}`)
    }
  }

  await saveState(state)

  changes
    .sort((a, b) => b.originalSize - a.originalSize)
    .slice(0, 20)
    .forEach((c) => {
      console.log(
        `  ${c.file}  ${fmtKb(c.originalSize)} -> primary ${fmtKb(c.newPrimarySize)} + webp ${fmtKb(c.fullWebpSize)} + variants ${fmtKb(c.variantTotal)}`,
      )
    })

  console.log('---')
  console.log(`files processed : ${changes.length}`)
  console.log(`before total    : ${fmtKb(totalBefore)}`)
  console.log(`after  total    : ${fmtKb(totalAfter)}`)
  const savedPct = totalBefore > 0 ? (100 * (totalBefore - totalAfter)) / totalBefore : 0
  console.log(`savings         : ${fmtKb(totalBefore - totalAfter)} (${savedPct.toFixed(1)}%)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
