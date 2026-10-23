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

- **Touch controls.** Drag anywhere for an analog stick that appears under your thumb: drag the way you want to roll (see Driving, below). An arrow button hops. A round button under the timer pauses (44px, styled like the hop button); the pause screen has Resume, Restart and **Back to art**, so leaving the game is never one stray tap away. The touch hint fades after 8 seconds of play, like the keyboard one. The page doesn't scroll or zoom while playing.
- **Driving.** The roll handles like a car's front wheel, and the camera follows it from a fixed angle, high and 40° down, without swinging round behind it, so up the screen always means the same way. Drag the way you want to go: the roll steers toward it and curves round, turning faster the faster it rolls (it can still pivot slowly when stopped). Drag well behind it to back up that way. It takes about a second to reach full speed and coasts to a stop over about a second when you let go, turning is a quarter heavier at full speed, and hitting something too big stops it. Pushing up after a turn no longer straightens the roll. On the keyboard, W/S are the throttle and A/D steer, with the same momentum.
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

- Katamaki rebuilds its world when the seed changes, like the player. On chain the seed never changes, so nothing differs there.
- The page around the art takes the piece's background colour, edge to edge, with or without the traits shown, and so does the browser bar on iPhone Safari and Android Chrome (`theme-color`). Before, the art sat on a dark grey page. The player has this too. With the traits hidden, the art sits at the bottom of the screen in portrait; with them shown it's centred.

### Keys and the end screen

- **One meaning per key.** `P` only pauses and resumes. `Enter` is the go key: start, keep rolling, confirm restart. `R` restarts. `Esc` cancels the restart question, otherwise goes back to the art. The buttons show these keys as keycaps (hidden on touch). In v1, `P` also meant Continue rolling and Cancel, and on the end screen it did nothing: Keep rolling is now on every end screen.
- **New art keys:** `E` saves the SVG, `Shift`+`E` the GIF. `?` shows a card with every shortcut, in the piece's colours; a click on it or anywhere else closes it.
- **Game hints** show the keys as keycaps in groups, at the bottom (roll, steer, hop, pause, restart) and at the top (`G` / `Esc` art). Both fade out after 8 seconds of play and come back on any pause or end screen. Touch keeps its text hint.
- **Size and goal** show as a scoreboard row over the bar, in the same style as OBJECTS and the timer. The timer no longer adds a ★ once the goal is reached.
- **New end-screen lines.** Gold, silver and bronze each have 4 or 5 titles, time's up has 6, and ants show up in at most one line per screen. Sizes read `1.2×` everywhere, like the scoreboard.
- **A useful hop.** While you're in the air, low things (small rocks, bushes, ingredients too big to roll up) don't block you. Chopsticks and ants can still hit you. The hop grows with the roll, so at gold size it's about 4× higher and lasts about 0.75 s (0.42 s at the start). The shadow shrinks while you're up, so you can judge the height. There's no cooldown. Before, the hop was only a fixed bounce, and a wall still stopped you mid-air.
- **Clouds can be rolled up.** Once the top of the roll reaches a cloud, it sticks like anything else and adds a little size. Over the sea that's around the goal size with a hop; from high ground, sooner.
- Opening the game drops keyboard focus from the Message cell, so the game's keys always work.

## The preview page: B-SIDE

`v2/index.html` is no longer a preview of the edition above. It's the player (minted art, exactly as on the token) plus **B-SIDE**: an optional alternate take on each minted token, drawn with gentler rules than the v2 edition. The minted token itself never changes, and nothing on Aleatory changes. It also has v2's Katamaki and the changes below. Since the B-SIDE release it's also the root player (`index.html`, makimono.psr.fyi); this copy is for trying changes first.

### B-SIDE rules

A branch of the v2 edition's rules that keeps each token recognisable:

- **Kept exactly as minted:** pattern, message and speed (v1's speed rules and shares), and every other random choice: profile, direction, tone, nori, rice, shape, roll and the details. The main random stream advances exactly as in v1. The lookalike rules (6) are off; they only matter when picking new seeds.
- **Changed:** Mono colours follow the Profile, as in rule 5 (Trio `a a b b c c`, Mirror `a b c c b a`, Duo and Accent two shades 2+ steps apart, Random 3+ shades, Spectrum unchanged). The shade picks come from their own stream (`seed + "|alt"`), so nothing else moves. Rice can turn white if a new shade is too close to it (v1's contrast rule).
- **Offered only when it's visible:** the biggest colour change of any pixel, over the whole loop, is at least 30 ΔE, **and** either it brings new shades (some colour is 10+ ΔE from every colour in the other version) or it moves the same shades around a lot (2%+ of all pixels, over the loop, change by 30+ ΔE). A few swapped pixels alone don't count. Otherwise the B-SIDE button doesn't show and the piece shows its minted art. Tuned on the minted tokens in the trait finder.

The traits use the new wave names (Wave, Short Wave) on both sides.

### The page

- **Buttons:** KATAMAKI · B-SIDE · ⋯. B-SIDE is a toggle (it stays pressed while on) and adds `&art=b` to the address, so a shared link opens on the B-side. A new seed starts on its minted art. ⋯ opens a menu: Download SVG, Download GIF, View Seed (opens the seed field) and Random Seed, each with its key.
- **Keyboard shortcuts:** the v2 edition's keys (above), plus `B` B-side, `V` view seed and `N` new seed. The shortcuts card lists them all.
- **Katamaki** is the v2 edition's game, with the keys, hints, scoreboard and end-screen lines above.
- **Lighter page:** three.js loads after the art is drawn, so the piece never waits for the game's library. Pressing `G` or KATAMAKI before it has arrived marks the button as loading, and the game opens as soon as it's ready. Space Mono comes from Google Fonts instead of being embedded (the mint build still embeds it), and only its regular weight is used.
- **Find your token without the seed:** the seed field also takes a token number (`51` or `#51`), an Aleatory or objkt link, or a wallet address or `.tez` name, which lists the wallet's pieces with thumbnails. Lookups use TzKT. `?token=51` in the address opens that token.
- The SEED pill, the home-screen icon, the background fill and the art at the bottom are as in the player.
