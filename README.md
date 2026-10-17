# Makimono

A fully on-chain generative pixel-art collection of animated sushi rolls on [Aleatory](https://aleatory.art) (Tezos), with **Katamaki**: a small 3D game where you roll your own token's maki around its own planet.

## Versions

| Version | Where | Status |
| --- | --- | --- |
| **v2** | repo root · [makimono.psr.fyi](https://makimono.psr.fyi/) | Latest. All v1 known issues fixed, plus rule changes. See [`CHANGES.md`](CHANGES.md). |
| **v1** | [`v1/`](v1/) · [makimono.psr.fyi/v1/](https://makimono.psr.fyi/v1/) | **Minted.** Frozen: never edit these files. Known issues in [`v1/NOTES.md`](v1/NOTES.md). |

The exact v1 files are also tagged in git as `v1-minted`.

v2 changes how some seeds turn into traits, so a seed can look different in v2 than its minted v1 token. To see a token as minted, use `/v1/?seed=<hex>`, or the **V1** button in the demo.

## Files

Each version has the same three files:

| File | What it is |
| --- | --- |
| `makimono.html` | Source. Commented, readable version of the piece and the game. All changes start here. |
| `makimono.mint.html` | Mint build. `makimono.html` with comments and the local seed harness removed. **This is the file uploaded to Aleatory.** |
| `index.html` | Public demo (GitHub Pages). `makimono.html` plus one script tag that loads three.js from a CDN, so the game works on the open web. **Do not mint.** The v2 demo also has a V1 button. |

Each file is self-contained: the font is embedded and there are no image or script files next to them. The only outside resource is the three.js CDN script in `index.html`.

## Viewing the demo

Every load generates a new piece; pin one with a seed:

```
https://makimono.psr.fyi/?seed=<hex>       v2
https://makimono.psr.fyi/v1/?seed=<hex>    v1 (minted)
```

Opening `makimono.html` directly from disk shows the art, but the game reports "three.js not loaded", because that file expects the mint platform to supply three.js. `makimono.mint.html` only runs inside Aleatory; it has no local seed harness.

## Controls

**Art**

| Key | Action |
| --- | --- |
| `I` (or click / tap the art) | Show / hide the traits band and buttons |
| `M` | Toggle the hop animation |
| `G` or the **KATAMAKI** button | Open the game |

**Katamaki** (desktop only)

| Key | Action |
| --- | --- |
| `W` / `↑` · `S` / `↓` | Roll forward / backward |
| `A` / `←` · `D` / `→` | Turn left / right |
| `Space` | Hop |
| `P` | Pause / resume |
| `R` | Restart (asks to confirm during a round) |
| `Enter` | Start rolling · confirm restart |
| `G` / `Esc` | Back to the art (pauses the round) |

Reach the goal size before the clock runs out to earn Bronze, Silver or Gold, then keep rolling for as long as you like. Your token's traits set the planet's colours, the time limit, the goal size, the monsters and the roll's style (maki or uramaki).

## Minting on Aleatory

1. Upload `makimono.mint.html` from the repo root (v2).
2. Tick the **three.js** library box. The mint UI adds `<meta name="alea:library" content="three@0.160.1">`, and the renderer supplies three.js. Don't add a three.js script tag or a second library tag yourself: the network is blocked on chain.
3. In the preview, check that the art renders, then press `G` and play a round.

The v2 mint build is about 107 KB, over the 32 KB that fits in one Tezos operation, so Aleatory publishes it in chunks (several signatures).

## Making changes

Only edit the root (v2) files. Leave `v1/` as it is.

1. Edit `makimono.html`.
2. Rebuild `makimono.mint.html` from it:
   - Remove every comment: `<!-- -->` in HTML, `/* */` in CSS, and `/* */` and `//` in scripts. Keep `//` inside strings and CSS `url(...)` (e.g. `"http://www.w3.org/2000/svg"` and the embedded font data).
   - Right-trim lines that had a comment removed, and drop blank lines (the game's `<script>` keeps its own blank lines).
   - Remove the local seed harness: the `if (!window.$alea) { … }` block. Aleatory supplies `$alea` on chain.
3. Rebuild `index.html`: `makimono.html` with these lines added right after `<meta charset="utf-8">`:
   ```html
   <!-- PUBLIC DEMO ... -->
   <script src="https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.min.js"></script>
   ```
   and the V1 button script right before `</body>`.

Use three.js **0.160.1**: the game reads the global `THREE`, and 0.160.1 is the last release with the classic (non-module) build.
