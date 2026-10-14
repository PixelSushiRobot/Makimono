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
//   node export-gif.mjs piece.svg                 # seamless loop, GIF
//   node export-gif.mjs piece.svg --format webp    # seamless loop, WebP (best for the long LCM clip)
//   node export-gif.mjs *.svg --format webp        # batch a whole folder
//   node export-gif.mjs piece.svg --short          # brief dominant-clock GIF (one small bob snap/loop)
//   node export-gif.mjs piece.svg --fps 25         # override; default is the 70ms grid rate (~14.29fps)
//   node export-gif.mjs piece.svg --scale 2        # 2 => 1040px (keep a x13 multiple)
//
// Loop length is read from the SVG's own dur="...ms" values. Default is seamless:
// the true LCM of every clock, so the bob and the fill reset together with no seam.
// --short loops only the dominant clock (tiny file, one bob snap per cycle).

import { chromium } from 'playwright';
import { readFileSync, mkdtempSync, rmSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const argv = process.argv.slice(2);
const flag = (name, def) => { const i = argv.indexOf('--' + name); return i >= 0 ? argv[i + 1] : def; };
const has = name => argv.includes('--' + name);

const SLOT = 70;                          // ms per pixel-state step (HOPMS/12); every clock lives on this grid
const fps = +flag('fps', 1000 / SLOT);    // default: the 70ms grid rate (~14.29fps) -> grid-exact frames
const scale = +flag('scale', 2);          // 520 * scale px; 2 -> 1040 (= 80 * 13, crisp)
const seamless = !has('short');           // default: loop ALL clocks (true LCM, no seam)
const format = String(flag('format', 'gif')).toLowerCase();  // gif | webp | apng
const inputs = argv.filter(a => a.endsWith('.svg'));

if (!['gif', 'webp', 'apng'].includes(format)) {
  console.error(`unknown --format "${format}" (use gif | webp | apng)`);
  process.exit(1);
}
// Seamless is the default because it's the only mathematically correct loop (every
// clock resets together at the LCM). The LCM clip can be ~34s / ~858 frames, which
// GIF bloats; prefer --format webp for it. Use --short to force the brief
// dominant-clock loop (one small bob snap per cycle) when you need a tiny GIF.

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

    const frames = Math.max(1, Math.round((loop / 1000) * fps)); // at the default fps this is exactly loop/70 -- one frame per state step
    const out = input.replace(/\.svg$/i, '') + '.' + format;
    const dir = mkdtempSync(join(tmpdir(), 'mkmn-'));

    await page.setContent(`<!doctype html><style>html,body{margin:0}</style>${svg}`, { waitUntil: 'load' });
    const el = await page.$('svg');

    for (let i = 0; i < frames; i++) {
      const t = ((i + 0.5) / frames) * (loop / 1000); // seconds -- mid-step, so we never land on a SMIL transition edge (avoids a doubled/skipped frame)
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
    // Frames are grid-exact; the encoder plays them at a uniform fps. gifski/ffmpeg do uniform fps only;
    // for byte-exact 70ms (7cs) per-frame delays, re-encode with: gifsicle -d7 (centisecond-exact).
    const encFps = Math.round(fps); // encoders take a uniform fps; grid rate ~14.29 -> 14 (loop runs ~2% slow, still seamless)
    if (format === 'gif') {
      execFileSync('gifski', ['--fps', String(encFps), '--quality', '100', '-o', out, ...pngs], { stdio: 'inherit' });
    } else if (format === 'webp') {
      execFileSync('ffmpeg', ['-y', '-framerate', String(encFps), '-i', join(dir, '%04d.png'),
        '-c:v', 'libwebp', '-lossless', '1', '-q:v', '100', '-loop', '0', out], { stdio: 'inherit' });
    } else { // apng
      execFileSync('ffmpeg', ['-y', '-framerate', String(encFps), '-i', join(dir, '%04d.png'),
        '-plays', '0', '-f', 'apng', out], { stdio: 'inherit' });
    }
    rmSync(dir, { recursive: true, force: true });

    console.log(`${out}  (${frames} frames @ ${encFps}fps, loop ${loop}ms${seamless ? ' seamless' : ''})`);
  }
} finally {
  await browser.close();
}
