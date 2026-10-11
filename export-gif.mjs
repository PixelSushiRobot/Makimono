#!/usr/bin/env node
// Frame-accurate animated-SVG -> GIF exporter for the Makimono pieces.
//
// Why this works where online tools fail:
//   - Headless Chromium is the only engine that renders our SMIL faithfully.
//   - svg.pauseAnimations() + svg.setCurrentTime(t) renders an EXACT moment,
//     so sampling has zero wall-clock drift (every frame is placed precisely).
//   - The loop length is read from the SVG's own dur="...ms" values, so you
//     never hand-compute FPS/Duration per trait combination.
//
// Setup (run once, in your own environment — not available in the sandbox):
//   npm i playwright
//   npx playwright install chromium
//   brew install gifski          # or: cargo install gifski
//
// Usage:
//   node export-gif.mjs piece.svg                 # one file
//   node export-gif.mjs *.svg                     # batch a whole folder
//   node export-gif.mjs piece.svg --fps 25        # default 25 (<=30 for GIF)
//   node export-gif.mjs piece.svg --seamless      # loop ALL clocks (long: ~34s)
//   node export-gif.mjs piece.svg --scale 2       # 2 => 1040px (keep a x13 multiple)
//
// Default loop = the dominant motion clock (largest dur). The hop may land
// mid-bob at the loop point (a barely-perceptible seam); --seamless uses the
// true LCM of every clock for a perfect loop at the cost of a much longer clip.

import { chromium } from 'playwright';
import { readFileSync, mkdtempSync, rmSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const argv = process.argv.slice(2);
const flag = (name, def) => { const i = argv.indexOf('--' + name); return i >= 0 ? argv[i + 1] : def; };
const has = name => argv.includes('--' + name);

const fps = +flag('fps', 25);
const scale = +flag('scale', 2);          // 520 * scale px; 2 -> 1040 (= 80 * 13, crisp)
const seamless = has('seamless');
const format = String(flag('format', 'gif')).toLowerCase();  // gif | webp | apng
const inputs = argv.filter(a => a.endsWith('.svg'));

if (!['gif', 'webp', 'apng'].includes(format)) {
  console.error(`unknown --format "${format}" (use gif | webp | apng)`);
  process.exit(1);
}
// For a truly seamless loop use --seamless --format webp: the 34.32s LCM loop is
// ~858 frames, which GIF bloats badly but WebP/APNG encode compactly with full color.

if (!inputs.length) {
  console.error('Give one or more .svg files. Example: node export-gif.mjs *.svg --fps 25');
  process.exit(1);
}

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const lcm = (a, b) => (a / gcd(a, b)) * b;

// Derive the loop length from the SVG itself.
function loopMs(svg, seamless) {
  const durs = [...new Set([...svg.matchAll(/dur="(\d+)ms"/g)].map(m => +m[1]))];
  if (!durs.length) return null;
  return seamless ? durs.reduce(lcm) : Math.max(...durs); // pattern clock = largest dur
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 520, height: 520 },
    deviceScaleFactor: scale,
  });

  for (const input of inputs) {
    const svg = readFileSync(input, 'utf8');
    const loop = loopMs(svg, seamless);
    if (loop == null) { console.warn(`skip ${input}: no animated dur found (static SVG?)`); continue; }

    const frames = Math.max(1, Math.round((loop / 1000) * fps));
    const out = input.replace(/\.svg$/i, '') + '.' + format;
    const dir = mkdtempSync(join(tmpdir(), 'mkmn-'));

    await page.setContent(`<!doctype html><style>html,body{margin:0}</style>${svg}`, { waitUntil: 'load' });
    const el = await page.$('svg');

    for (let i = 0; i < frames; i++) {
      const t = (i / frames) * (loop / 1000); // seconds — evenly spaced, loop-exact
      await page.evaluate(sec => {
        const s = document.querySelector('svg');
        s.pauseAnimations();
        s.setCurrentTime(sec);
      }, t);
      // let the engine paint the new time before capturing
      await page.evaluate(() => new Promise(r => requestAnimationFrame(() => r())));
      await el.screenshot({ path: join(dir, String(i).padStart(4, '0') + '.png') });
    }

    const pngs = readdirSync(dir).filter(f => f.endsWith('.png')).sort().map(f => join(dir, f));
    // Frames are already loop-exact; the encoder just needs the per-frame delay (1/fps).
    if (format === 'gif') {
      execFileSync('gifski', ['--fps', String(fps), '--quality', '100', '-o', out, ...pngs], { stdio: 'inherit' });
    } else if (format === 'webp') {
      execFileSync('ffmpeg', ['-y', '-framerate', String(fps), '-i', join(dir, '%04d.png'),
        '-c:v', 'libwebp', '-lossless', '1', '-q:v', '100', '-loop', '0', out], { stdio: 'inherit' });
    } else { // apng
      execFileSync('ffmpeg', ['-y', '-framerate', String(fps), '-i', join(dir, '%04d.png'),
        '-plays', '0', '-f', 'apng', out], { stdio: 'inherit' });
    }
    rmSync(dir, { recursive: true, force: true });

    console.log(`${out}  (${frames} frames @ ${fps}fps, loop ${loop}ms${seamless ? ' seamless' : ''})`);
  }
} finally {
  await browser.close();
}
