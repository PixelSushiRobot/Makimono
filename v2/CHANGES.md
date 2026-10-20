# Changes

## v2

**Not released.** v2 is a possible future edition, kept here in `v2/` and not linked from the site. v1, the minted collection, is kept unchanged in [`v1/`](../v1/). Its known issues are in [`v1/NOTES.md`](../v1/NOTES.md); v2 fixes all eight. The player at the site root already has the viewer fixes (1, 2, 4 and 8), the spawn fix (7) and the mobile game, with v1's art.

**Same seed, different art.** Changes 5 and 6 change how a seed is turned into traits, so many seeds produce different art in v2 than their v1 token. To see a seed as minted, open it in the player at the site root (`makimono.psr.fyi/?seed=<hex>`).

### Fixes

1. **Edge bleed on scrolling patterns.** The scrolling filling layer is wrapped in a fixed clip, so no sliver of filling shows past the art's right edge in the detailed view. ([v1 issue 1](../v1/NOTES.md#1-edge-bleed-on-scrolling-patterns-in-the-detailed-view))
2. **Mobile tap opens the traits band.** Taps are detected from pointer/touch events instead of waiting for a `click` that iOS Safari never sends. Timing uses `e.timeStamp`, since Aleatory freezes `Date.now()`. ([v1 issue 2](../v1/NOTES.md#2-tapping-the-art-doesnt-open-the-traits-band-on-mobile))
3. **Katamaki plays on phones and tablets.** Instead of hiding the KATAMAKI button on mobile, the game now has touch controls (see below). ([v1 issue 3](../v1/NOTES.md#3-katamaki-button-shows-on-mobile-where-the-game-isnt-supported))
4. **GIF export follows the current art.** The cached GIF is only reused while the art (including the Message) is the same as when it was rendered. Every GIF shows the hopped version, whatever the hop toggle. ([v1 issue 4](../v1/NOTES.md#4-gif-export-keeps-an-earlier-version-after-the-message-changes))
7. **Katamaki starts with a clear spot.** Nothing starts stuck to the roll: anything placed near the start is moved just outside a small clear circle, onto land. The rest of the world is unchanged. ([v1 issue 7](../v1/NOTES.md#7-katamaki-can-start-with-pieces-already-stuck-to-the-roll))
8. **No seams on iPhone Safari.** The art is drawn as flat full frames: each distinct frame is one complete picture on whole pixels, with no sliding layers or clip, shown for exactly the 70ms slots the layered art shows it. The animation reads the same, slot for slot, and iPhone Safari no longer shows hairlines around the filling or along the edge. Hop off is a second flat version (rest pose, fills keep running). ([v1 issue 8](../v1/NOTES.md#8-hairline-seams-around-the-filling-and-the-arts-edge-on-iphone-safari))

### Rule changes

5. **Mono follows the Profile.** Mono colours now follow the Profile using the same 4 shades: Random uses at least 3 shades, Trio `a a b b c c`, Mirror `a b c c b a`, Duo and Accent use two shades at least 2 steps apart, and Spectrum keeps v1's look. Mono also gets the same no-Fast speed limits as Classic and Neon. ([v1 issue 5](../v1/NOTES.md#5-mono-ignores-the-profile-trait))
6. **No lookalike combinations.** Combinations that showed the same art as another are no longer picked. ([v1 issue 6](../v1/NOTES.md#6-some-trait-combinations-look-the-same-as-others))
   - All palettes: Duo can't get Diagonal or Chase; Accent can't get Checker.
   - Mono: Accent, Mirror and Random can't get Text; Mirror can't get Sparkle, Ripple or Maki.

The listed odds still add up: pattern odds come from each profile's allowed patterns, and the speed shares are recomputed from them.

### Katamaki on mobile

- **Touch controls.** Drag anywhere for an analog stick that appears under your thumb (up/down roll, left/right steer). An arrow button hops. Small icon buttons under the timer pause or go back to the art. The page doesn't scroll or zoom while playing.
- **Portrait and landscape.** The HUD keeps clear of the notch and home bar, the controls sit above the size bar in portrait, and portrait gets a wider camera view.
- **Pauses when hidden.** Switching apps or locking the phone pauses the round.
- **Adaptive quality.** Under 48 fps, quality steps down: sharpness capped at 1.5×, then 1× with fewer decor cones and clouds and no antialiasing from the next round, then 0.75× with no scattered scenery. Collectibles, ants and chopsticks never change. A step that doesn't help is undone. `?perf=1` shows the frame rate and level; `?tier=0`–`3` forces a level.
- **Mobile viewport.** The page now has a mobile viewport tag, so phones lay it out at their real width instead of a shrunk desktop page.

### Other

- The project name in the top-left corner of the traits view reads **MAKIMONO 2.0**.
- Katamaki's welcome screen shows a small "Welcome to" line above **KATAMAKI**, built from the same 3D cube letters as the message in the sky. The letters take the piece's colours, in the same order a custom message on that piece would, and bob and turn like the sky letters. Under the title, your own maki turns slowly, with the same filling layout you play with. Both stay still if the device asks for reduced motion.
- **Text ANTS** pieces get a real ant planet in Katamaki: 30 ants instead of 15. The usual 9 are joined by 21 small ants you can roll up from the start. They never knock you back, and each adds a little size (0.05, versus 0.16 to 0.23 for a normal ant). The same applies to any message containing "ants". Other pieces keep 9 ants.
- **Chase** pieces get a magnet in Katamaki instead of pulling every pickup in at the start. Pickups and ants you can already roll up are drawn in from within a range around the roll (about 6.5 units at the start, growing as the roll grows), faster the closer they get. Anything still too big stays put until you've grown, so the magnet reaches further as you get bigger. To balance it, Chase pieces have 9 chopsticks instead of 3.
- The two wave patterns are renamed for what they are: **Wiggle** is now **Wave**, and **Turbo Wiggle** (the same wave at half the wavelength) is now **Short Wave**. Only the names change.

- The preview (`v2/index.html`) has the player's **SEED** pill: show, paste or roll a seed, and the art swaps in place with `?seed=` in the address. It's added only when building the preview, so it isn't in `makimono.html` or the mint build. Katamaki now rebuilds its world when the seed changes, like the player; on chain the seed never changes, so nothing differs there.
