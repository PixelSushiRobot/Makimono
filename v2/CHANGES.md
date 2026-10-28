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
- **Katamaki** starts from the v2 edition's game (keys, hints, scoreboard and end-screen lines above) and adds the changes in **Katamaki on this page**, below. The v2 edition (`makimono.html`, the mint build) keeps the game as described above.
- **Lighter page:** three.js loads after the art is drawn, so the piece never waits for the game's library. Pressing `G` or KATAMAKI before it has arrived marks the button as loading, and the game opens as soon as it's ready. Space Mono comes from Google Fonts instead of being embedded (the mint build still embeds it), and only its regular weight is used.
- **Find your token without the seed:** the seed field also takes a token number (`51` or `#51`), an Aleatory or objkt link, or a wallet address or `.tez` name, which lists the wallet's pieces with thumbnails. A button with the wallet's name (.tez names in full, addresses shortened in the middle) then sits before KATAMAKI to reopen the list, for this tab; Random Seed or entering anything else removes it. Lookups use TzKT. `?token=51` in the address opens that token.
- **Share a wallet:** `?wallet=name.tez` (or an address) in a link looks the wallet up and shows its button; on its own it opens the wallet's first piece and its list, and with `&token=` or `&seed=` it keeps that piece. While a wallet is active the address carries `?wallet=` too, so copying it shares the wallet.
- The SEED pill, the home-screen icon, the background fill and the art at the bottom are as in the player.

### Katamaki on this page

Only in `v2/index.html` for now: the v2 edition (`makimono.html`, `makimono.mint.html`) and the root player are unchanged.

**Things to roll up**
- **A belt of plates:** a ring of conveyor-belt sushi plates. The plates and the sushi on them can be rolled up, and so can the belt's slats once you're big enough.
- **An anthill:** a layered anthill some way off to the right of the start. Once you're big enough, the hill itself rolls up. On the roll it shrinks to at most 1.2× the roll's size, so a big hill (an ANTS planet's is 15 to 20) no longer hides the maki.
- **The piece's own art as a plaza:** a 13×13 plaza of raised tiles just ahead of the start, laid out like the art. Only the maki's tiles count. The background tiles are left out, and the eyes stay right in every pose. The roll can hop up onto the tiles.
- **Sky letters:** the message's letters in the sky can be rolled up too once the roll reaches them.
- **Real contact:** things are only picked up when the roll actually touches them. When the roll was big, it used to grab things from a distance.
- **Where pickups stick:** pickups stay where they touched along the roll, with a little random scatter, and stay off the filling ends. They used to be squeezed toward the middle.

**Growth and medals**
- **Growth is by area,** so each pickup adds size like real stuff stuck to a ball, and the last stretch is the slowest.
- **Goals:** Fast 2.7×, Normal 3.2×, Slow 3.7×, so every speed asks for the same growth per second. Speed sets the pace, not the difficulty.
- **Medals:** silver at 1.2× the goal and gold at 1.4×. They used to be 1.3× and 1.7×.
- **Big pieces count:** a plaza tile adds 0.035, a belt slat 0.05 and a sky letter 0.12.

**HUD and reports**
- **PLANET CLEARED:** how much of the planet you've rolled up, weighted by size. It rounds down, so it only says 100% when nothing is left. Near the end it reads "99% · N LEFT".
- **Last pickup:** a line under the scoreboard names the last thing you rolled up. A belt sushi rolled up with its plate reads SALMON + PLATE.
- **Stats:** the end screen, and the pause screen in free roll, list what made you grow, the ants you rolled up and when you passed each medal.
- **Gold titles:** a gold run with 95% or more of the planet cleared reads "NOTHING LEFT TO ROLL.", and one with 60% or more reads "THE PLANET IS GETTING NERVOUS." Below that, gold picks from its other lines. The losing line "The ants are nervous." is now "The ants are taking notes.", so "nervous" only appears once.

**Free roll**
- **Chopsticks:** two on every piece, in spots that change with the seed. They can be rolled up in free roll once the roll is at least the goal size and 1.05× theirs, and they wobble when you're close but not quite big enough.
- **Beacons:** once 10 or fewer things are left, each has a rising light column that follows it, so the last pieces are easy to find. Once on, they stay on for the rest of the round, and the timer slot (FREE ROLL) shows how many are left, e.g. 7 LEFT, then ALL CLEAR.

**100% and OMAKASE**
- **Confetti:** clearing the whole planet sets off confetti in the piece's colours. It lands on the ground or on the maki, rests a few seconds and fades away.
- **OMAKASE:** after the confetti comes a new top grade, OMAKASE: "THE CHEF HAS LEFT THE BUILDING."
- **After OMAKASE:** Keep rolling still works, and the sky's marquee then scrolls NO MORE ANTS.
- **Back to art:** every end screen has a Back to art button.

**The chopsticks monster (after OMAKASE)**
- **When it comes:** after OMAKASE, if both chopsticks have been rolled up (before or after the OMAKASE screen), Keep rolling, let the confetti settle and the NO MORE ANTS marquee cross once (it always finishes its pass, even when the last chopsticks are rolled up mid-scroll). Then a giant chopsticks monster lands on the far side of the planet with a thump. The timer slot reads !!! and UH OH... scrolls in once the sky is clear (the pause screen's free-roll line reads !!! too)
- **The chase:** it hop-walks toward the roll, always turning to keep its eyes on it, and sends little chopsticks after it. They start few and slow (2 at a time, slower than the roll) and build up over about 45 s, to 10 at a time, faster than the roll and from every side. They hold their ground when they hit, and each bump knocks the roll away from the chopstick and partly toward the giant, so sooner or later it runs into the giant. They can't be rolled up and nothing falls off.
- **The grab:** touching the giant sets it off. It closes on the maki and everything on it is knocked off and scattered around. Then it lifts the bare maki away out of the sky.
- **The restore:** the scattered pickups, and everything else that was moved or rolled up, fly back to where they stood at the start of the round. Belt slats and plates go back into their own spots on the stopped belt, and the rebuilt belt starts from where it stopped, so nothing jumps at the hand-over. The glitch waits until everything has landed. A glitch transition (blocky pixels with torn bands in the planet's own ground colours) hands over to the planet running again as it was at the start (ants walking, belt turning), without the maki. The planet turns slowly and the arrow keys, WASD or the stick spin it. NO MORE MAKI scrolls across the sky.
- **Shadows:** the giant, the little chopsticks and the scattered pickups cast a soft shadow on the ground that shrinks as they rise.
- **The pause screen:** from the monster's arrival on, it keeps the round's final numbers, taken when the monster arrives (so chopsticks rolled up after the OMAKASE screen count). On the final planet it becomes a closing card: a pink neon CLOSED sign, YOU ARE OFF THE MENU., the final numbers and Keep rolling.

**End, pause and restart screens**
- **Buttons:** stacked in one column on every screen, all as wide as the widest. Labels are centred; with key hints shown (keyboard), the label sits left and the key on the right. On short screens (landscape phones, 520px tall or less) they sit side by side in one row so everything fits.
- **Stats:** one row when there's room. On narrow touch screens (under 600px wide), a 2×2 grid; a fifth stat (chopsticks) gets its own centred row.
- **Short screens (landscape phones):** only the spacing tightens and the message gets wider, so everything fits without shrinking. If a very small screen still can't fit it all, it scrolls.
- **Turning the phone:** in a home-screen web app on iOS, turning the phone mid-game could leave taps landing away from the buttons (jump read as the stick, pause-screen taps missed). The page under the game no longer scrolls while it's open, and on every turn, resize or return to the app it's put back in place and the screen size re-read. A stick or hop held through a turn is let go. While the game is open, the page behind it takes the planet's sky colour, so turning the phone no longer flashes white.

**Fixes**
- **W A S D:** a letter key let go while Shift or Caps Lock had changed could stay held, so the roll kept reversing or turning. Letter keys now go by their place on the keyboard (any layout, Shift or Caps Lock), and every key is let go when the window loses focus.
- **Beacons:** the planet's faint atmosphere no longer cuts off the tops of the beams, and a beam no longer swings off in a wrong direction for a moment when its thing is rolled up.
- **Home-screen icon:** drawn on the piece's background colour, so it's never black or see-through where the art leaves pixels empty.
- **Free roll pause line:** in caps, small and dim, it shows only where the round stands, as the timer slot does: FREE ROLL, 3 LEFT, ALL CLEAR, then !!! in the chase and FINAL on the final planet.
- **Knocked-off pickups:** things knocked off the roll now cast a shadow on the ground while they fly, and keep one once they land.
- **Lighter on slow phones:** typing a message redraws the art 150 ms after the last key instead of on every key, only the last 6 drawn versions of the art are kept in memory (typing used to keep one per key), and the game's hint timer no longer runs while the game is closed.
- **A secret magnet** for playing through quickly: while the game is on, `M` pulls in everything the roll can already pick up, from a range that grows with the roll (as Chase's magnet did), and `Shift`+`M` is SUPER, which pulls from anywhere on the planet. Belt sushi flies in on its plate; once the first belt slat or plaza tile has been rolled up, the rest fly in too; the anthill and the sky letters come once the roll is big enough. While it's on, a small yellow line at the top says MAGNET MODE or SUPER MAGNET MODE. It isn't listed on the shortcuts card.

**Rule changes**
- **Chase:** the magnet and its 9 chopsticks are off. Chase plays like the other patterns, with 2 chopsticks.
- **Chopstick counts:** every pattern gets 2 chopsticks. Before, Sparkle, Checker and Ripple had 2 and the rest had 1.

**Models**
- **Carrot:** the cone with its point cut off flat, topped with a green disc and three square stalks.
- **Onigiri:** a triangle with its corners cut flat, and the nori no longer flickers through the rice at some angles.
- **Cucumber** spins on its centre.
- **Mushroom:** the cap has an underside.
- **Bush:** now a big rock.
- **Eyes:** the fish, shrimp, ant and chopsticks eyes are each one low-poly ball with the iris painted on, instead of a ball with a flat disc floating in front.
