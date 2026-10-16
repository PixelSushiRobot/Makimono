# Makimono

A fully on-chain generative pixel-art collection of animated sushi rolls on [Aleatory](https://aleatory.art) (Tezos), with **Katamaki**: a small 3D game where you roll your own token's maki around its own planet.

## Files

| File | What it is |
| --- | --- |
| `makimono.html` | Source. Commented, readable version of the piece and the game. All changes start here. |
| `makimono.mint.html` | Mint build. `makimono.html` with comments stripped to save on-chain storage. **This is the file uploaded to Aleatory.** |
| `index.html` | Public demo (GitHub Pages). `makimono.html` plus one script tag that loads three.js from a CDN, so the game works on the open web. **Do not mint.** |

Each file is self-contained: the font is embedded and there are no image or script files next to them. The only outside resource is the three.js CDN script in `index.html`.

## Viewing the demo

Live at **[makimono.psr.fyi](https://makimono.psr.fyi/)**. Every load generates a new piece; pin one with a seed:

```
https://makimono.psr.fyi/?seed=<hex>
```

Opening `makimono.html` directly from disk shows the art, but the game reports "three.js not loaded", because that file expects the mint platform to supply three.js. `makimono.mint.html` only runs inside Aleatory; it has no local seed harness.

## Controls

**Art**

| Key | Action |
| --- | --- |
| `I` (or click the art) | Show / hide the traits band and buttons |
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

1. Upload `makimono.mint.html`.
2. Tick the **three.js** library box. The mint UI adds `<meta name="alea:library" content="three@0.160.1">`, and the renderer supplies three.js. Don't add a three.js script tag or a second library tag yourself: the network is blocked on chain.
3. In the preview, check that the art renders, then press `G` and play a round.

The mint build is about 104 KB, over the 32 KB that fits in one Tezos operation, so Aleatory publishes it in chunks (several signatures).

## Making changes

1. Edit `makimono.html`.
2. Rebuild `makimono.mint.html`: same code with comments removed. Strip only `//` and `/* */` comments, and keep `//` inside strings (e.g. `"http://www.w3.org/2000/svg"`).
3. Rebuild `index.html`: `makimono.html` with these lines added right after `<meta charset="utf-8">`:
   ```html
   <!-- PUBLIC DEMO ... -->
   <script src="https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.min.js"></script>
   ```

Use three.js **0.160.1**: the game reads the global `THREE`, and 0.160.1 is the last release with the classic (non-module) build.
