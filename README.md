# Makimono

A fully on-chain generative pixel-art collection of animated sushi rolls on [Aleatory](https://aleatory.art/generator/KT1EaQfAUBHpwXCniFJdrix8YicvfRVcCaAU) (Tezos), with **Katamaki**: a small 3D game where you roll your own token's maki around its own planet.

## Play your token

Open **[makimono.psr.fyi](https://makimono.psr.fyi/)**, tap or click the art, then **SEED**, and paste your token's seed (copy it from the token's page in the [collection on Aleatory](https://aleatory.art/generator/KT1EaQfAUBHpwXCniFJdrix8YicvfRVcCaAU)) with **PASTE** or into the field and Enter. Your piece appears right away, and the address updates so you can share or bookmark it:

```
https://makimono.psr.fyi/?seed=<your token's seed>
```

The player draws exactly your minted art, and adds what the minted version can't: a few viewer fixes and Katamaki on phones and tablets. Paste the seed exactly as shown: it's case-sensitive, and a different seed gives a different piece. Without a seed in the address, each visit shows a random piece that no minted token has.

On iPhone or iPad, load your seed first, then use Share → **Add to Home Screen**: the icon is your own piece, and the shortcut opens straight to it. On Android, use the browser menu → **Add to Home screen**. Until a piece is drawn, the icon is the default maki (`apple-touch-icon.png`, and `favicon.png` at 48 × 48 for the tab and search results). If you loaded the seed with SEED, reload the page before saving: Android takes the icon from when the page first loaded.

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | **The player** (the site). The minted v1 piece with the viewer fixes, a clear start spot in Katamaki, touch controls, adaptive quality and a seed control (show, paste or roll a seed). The art rules are untouched. Not for minting: it loads three.js from a CDN. |
| [`v1/`](v1/) | **Minted.** The exact files of the collection on Aleatory. Frozen: never edit. Known issues in [`v1/NOTES.md`](v1/NOTES.md). Also tagged in git as `v1-minted`. |
| [`v2/`](v2/) | **Not released.** A possible future edition: all fixes plus new Mono and lookalike rules, which change some seeds' art. See [`v2/CHANGES.md`](v2/CHANGES.md). |

Each file is self-contained: the font is embedded and there are no image or script files next to them. The only outside resource is the three.js CDN script in the player and the demos.

### v1 files

| File | What it is |
| --- | --- |
| `makimono.html` | Source. Commented, readable version of the piece and the game. |
| `makimono.mint.html` | Mint build: the source with comments and the local seed harness removed. **This is the file on Aleatory.** |
| `index.html` | The original public demo: the source plus the three.js CDN script. |

`v2/` has the same three files.

## Controls

**Art**

| Key | Action |
| --- | --- |
| `I` (or click / tap the art) | Show / hide the traits band and buttons |
| `M` | Toggle the hop animation |
| `G` or the **KATAMAKI** button | Open the game |
| **SEED** (player only) | Opens a field with this piece's seed: copy it, or paste another and press Enter (or tap PASTE) |
| ↻ next to SEED (player only) | New random seed. Back / Forward in the browser step through the seeds you've viewed |

**Katamaki**

| Key | Touch | Action |
| --- | --- | --- |
| `W` / `↑` · `S` / `↓` | Drag anywhere: up / down | Roll forward / backward |
| `A` / `←` · `D` / `→` | Drag anywhere: left / right | Turn left / right |
| `Space` | Arrow button (bottom right) | Hop |
| `P` | Pause button (top right) | Pause / resume |
| `R` | Restart on the pause screen | Restart (asks to confirm during a round) |
| `Enter` | Start Rolling button | Start rolling · confirm restart |
| `G` / `Esc` | ✕ button (top right) | Back to the art (pauses the round) |

Touch controls are in the player and v2. The minted v1 game is keyboard only. On touch, the stick appears wherever your thumb lands and is analog: a small push gives a gentle turn. Portrait and landscape both work.

**Adaptive quality.** If a device can't keep up (under 48 fps), the game lowers quality one step at a time: sharpness first, then fewer decor cones and clouds, then no scattered scenery. Collectibles, ants and chopsticks never change, so the goal and difficulty stay the same. A step that doesn't help is undone. Add `?perf=1` to show the frame rate and level (tap it to force one), or `?tier=0`–`3` to force a level.

Reach the goal size before the clock runs out to earn Bronze, Silver or Gold, then keep rolling for as long as you like. Your token's traits set the planet's colours, the time limit, the goal size, the monsters and the roll's style (maki or uramaki).

## Making changes

- **Player:** edit `index.html` directly. Keep the art code (everything that turns a seed into the picture) identical to `v1/makimono.html`, so every token still shows its minted art.
- **v1:** don't edit.
- **v2:** edit `v2/makimono.html`, then rebuild:
  1. `v2/makimono.mint.html`:
     - Remove every comment: `<!-- -->` in HTML, `/* */` in CSS, and `/* */` and `//` in scripts. Keep `//` inside strings and CSS `url(...)` (e.g. `"http://www.w3.org/2000/svg"` and the embedded font data).
     - Right-trim lines that had a comment removed, and drop blank lines (the game's `<script>` keeps its own blank lines).
     - Remove the local seed harness: the `if (!window.$alea) { … }` block. Aleatory supplies `$alea` on chain.
  2. `v2/index.html`: the source with the `<!-- PUBLIC DEMO ... -->` comment and the three.js script added right after `<meta charset="utf-8">`.

Use three.js **0.160.1**: the game reads the global `THREE`, and 0.160.1 is the last release with the classic (non-module) build.

## Minting (v2, if released)

1. Upload `v2/makimono.mint.html`.
2. Tick the **three.js** library box. The mint UI adds `<meta name="alea:library" content="three@0.160.1">`, and the renderer supplies three.js. Don't add a three.js script tag or a second library tag yourself: the network is blocked on chain.
3. In the preview, check that the art renders, then press `G` and play a round. On a phone, check the touch controls too.

The v2 mint build is about 115 KB, over the 32 KB that fits in one Tezos operation, so Aleatory publishes it in chunks (several signatures).
