# Changes

## v2

**Not released.** v2 is a possible future edition, kept here in `v2/` and not linked from the site. v1, the minted collection, is kept unchanged in [`v1/`](../v1/). Its known issues are in [`v1/NOTES.md`](../v1/NOTES.md); v2 fixes all six. The player at the site root already has the viewer fixes (1, 2 and 4) and the mobile game, with v1's art.

**Same seed, different art.** Changes 5 and 6 change how a seed is turned into traits, so many seeds produce different art in v2 than their v1 token. To see a seed as minted, open it in the player at the site root (`makimono.psr.fyi/?seed=<hex>`).

### Fixes

1. **Edge bleed on scrolling patterns.** The scrolling filling layer is wrapped in a fixed clip, so no sliver of filling shows past the art's right edge in the detailed view. ([v1 issue 1](../v1/NOTES.md#1-edge-bleed-on-scrolling-patterns-in-the-detailed-view))
2. **Mobile tap opens the traits band.** Taps are detected from pointer/touch events instead of waiting for a `click` that iOS Safari never sends. Timing uses `e.timeStamp`, since Aleatory freezes `Date.now()`. ([v1 issue 2](../v1/NOTES.md#2-tapping-the-art-doesnt-open-the-traits-band-on-mobile))
3. **Katamaki plays on phones and tablets.** Instead of hiding the KATAMAKI button on mobile, the game now has touch controls (see below). ([v1 issue 3](../v1/NOTES.md#3-katamaki-button-shows-on-mobile-where-the-game-isnt-supported))
4. **GIF export follows the current art.** The cached GIF is only reused while the art (including the Message) is the same as when it was rendered. Every GIF shows the hopped version, whatever the hop toggle. ([v1 issue 4](../v1/NOTES.md#4-gif-export-keeps-an-earlier-version-after-the-message-changes))

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

