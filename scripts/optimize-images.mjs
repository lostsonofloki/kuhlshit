#!/usr/bin/env node
/**
 * Optimize all raster images under public/resources.
 *
 *   - Resize any image wider than MAX_WIDTH down to MAX_WIDTH (keeps aspect).
 *   - Rewrite originals with mozjpeg/pngquant-quality output (~80 / 85).
 *   - Emit a .webp sibling (quality 78) next to every raster file.
 *   - Strip metadata.
 *
 * Idempotent: re-runs skip anything already marked optimized via .kuhl-opt.json.
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const PUBLIC_DIR = path.join(ROOT, 'public', 'resources')
const STATE_FILE = path.join(ROOT, 'scripts', '.kuhl-opt.json')

const MAX_WIDTH = 1400
const JPEG_QUALITY = 78
const PNG_QUALITY = [0.7, 0.85]
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
    return JSON.parse(await fs.readFile(STATE_FILE, 'utf8'))
  } catch {
    return {}
  }
}

async function saveState(state) {
  await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2))
}

function fmtKb(bytes) {
  return `${(bytes / 1024).toFixed(1)}kb`
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
  const resized = meta.width && meta.width > MAX_WIDTH
    ? img.resize({ width: MAX_WIDTH, withoutEnlargement: true })
    : img

  let outBuf
  if (ext === '.png') {
    outBuf = await resized
      .clone()
      .png({ compressionLevel: 9, palette: true, quality: Math.round(PNG_QUALITY[1] * 100) })
      .toBuffer()
  } else {
    outBuf = await resized
      .clone()
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
      .toBuffer()
  }

  const webpBuf = await resized
    .clone()
    .webp({ quality: WEBP_QUALITY, effort: 5 })
    .toBuffer()

  const originalSize = src.length
  const newPrimarySize = outBuf.length
  const webpSize = webpBuf.length

  const shouldOverwritePrimary = newPrimarySize < originalSize * 0.95
  if (shouldOverwritePrimary) {
    await fs.writeFile(file, outBuf)
  }

  const webpPath = file.replace(/\.(jpe?g|png)$/i, '.webp')
  await fs.writeFile(webpPath, webpBuf)

  const updatedStat = await fs.stat(file)
  state[rel] = {
    sig: `${updatedStat.size}:${Math.round(updatedStat.mtimeMs)}`,
    originalSize,
    newPrimarySize: shouldOverwritePrimary ? newPrimarySize : originalSize,
    webpSize,
    done: true,
  }

  return {
    file: rel,
    originalSize,
    newPrimarySize: shouldOverwritePrimary ? newPrimarySize : originalSize,
    webpSize,
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
        totalAfter += result.newPrimarySize + result.webpSize
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
        `  ${c.file}  ${fmtKb(c.originalSize)} -> primary ${fmtKb(c.newPrimarySize)} + webp ${fmtKb(c.webpSize)}`,
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
