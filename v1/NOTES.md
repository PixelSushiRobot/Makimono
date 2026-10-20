# Known issues

**Fixes:** the player at the site root (`index.html`) has the fixes for issues 1, 2, 4, 7 and 8, and replaces issue 3's fix with a playable mobile game, while keeping v1's art. All eight are fixed in the unreleased [`v2/`](../v2/CHANGES.md). This folder is the minted v1 and stays unchanged.

These issues affect `makimono.html`, `makimono.mint.html` and `index.html`. The minted collection (`makimono.mint.html`) was published before they were found, so the fixes below are **not** in it. Each has a fix recorded here for a future edition and for updating the demo. The fixes for issues 1 and 2 have been tested; the fixes for issues 3 and 4 are written out but not yet built. The fixes for issues 5 and 6 change which art a seed produces, so they are for a future edition only (see the warning under issue 5). The fix for issue 7 is built and only moves things near the start of the game, so it doesn't change the art.

To apply a fix: change `makimono.html` first, then rebuild `makimono.mint.html` (comments stripped) and `index.html` (plus the three.js CDN script), as described in the README.

---

## 1. Edge bleed on scrolling patterns in the detailed view

**Affects:** all three files. Desktop and mobile.

**Symptom.** In the detailed view (`I`), a thin sliver of filling colour sometimes shows just outside the right edge of the art, where it meets the mat. It only happens on scrolling patterns (Text, Wiggle and the other marquees), only while the filling scrolls near the edge, and only at some window sizes or zoom levels. Static patterns aren't affected, and neither is the full view.

**Cause.** The scrolling filling layer is deliberately not clipped. It slides across the art, and the part waiting to scroll in hangs past the art's right edge. Inside the art, opaque background-coloured cells cover everything outside the roll's band, but those cells stop exactly at the art's edge. Beyond it, only the browser's own cut-off at the art's boundary hides the overhang. In the detailed view, the art is sized and centred within the space above the traits band, so that boundary usually falls partway through a screen pixel. The browser blends the last partial pixel, and a sliver of the overhanging filling shows through.

**Fix.** Wrap the scrolling group in a fixed (non-moving) clip, so the overhang can't draw outside the art at all. In the text / marquee branch of the render code, the scrolling group is:

```js
'<g><animateTransform attributeName="transform" type="translate" calcMode="discrete" values="'+v.join(";")+'" dur="'+steps*sp[1]+'ms" repeatCount="indefinite"/>'+paths(M)+'</g>'
```

Wrap it like this:

```js
'<g clip-path="url(#mkq)"><clipPath id="mkq"><rect x="-0.5" y="-10" width="12" height="40"/></clipPath>'
  +'<g><animateTransform attributeName="transform" type="translate" calcMode="discrete" values="'+v.join(";")+'" dur="'+steps*sp[1]+'ms" repeatCount="indefinite"/>'+paths(M)+'</g>'
+'</g>'
```

Why these numbers:
- The scrolling group sits inside the roll's `translate(1,2)` group, so `x=-0.5`, `width=12` covers viewBox x 0.5 to 12.5.
- That puts both clip edges half a cell into the plain background column on each side (viewBox columns 0 and 12), which already covers the scrolling layer. So the clip hides nothing visible, and pixel rounding of its edge can't land outside the art.
- The tall `y`/`height` means only the sides are clipped, so the up-and-down hop is never cut off.
- The clip is on the wrapper, not the moving group, so it stays put while the content scrolls.

**Unchanged by the fix:** what's visible inside the art, determinism, Aleatory's static capture, and the SVG and GIF exports (the exports also lose the invisible overhang).

**If a faint line ever remains:** additionally round the detailed-view art's size down to whole device pixels (accounting for `devicePixelRatio`) when the view opens and on resize, so its edges never fall mid-pixel. This wasn't needed in testing.

---

## 2. Tapping the art doesn't open the traits band on mobile

**Affects:** all three files. Seen on iPhone (iOS Safari). Desktop click and the `I` key work.

**Symptom.** On mobile, tapping the artwork doesn't show the traits band and buttons.

**Cause.** The art toggles the band from a page-wide `click` listener. Some mobile browsers, iOS Safari especially, never send a `click` for a tap on plain, non-interactive content. Marking the stage as tappable with `cursor:pointer` does **not** fix it.

**Fix.** Detect the tap directly from pointer events (touch events as a fallback), and ignore the `click` that may follow, so the band doesn't toggle twice. Mouse clicks still go through the original `click` path. Replace the start of the art's tap handler (the `window.addEventListener("click", …)` that calls `stage.classList.toggle("show")`) with:

```js
var tapIgnoreUntil=0,tapStart=null;
function tapAllowed(t){if(!stage)return false;if(t&&(t.isContentEditable||/^(INPUT|TEXTAREA)$/.test(t.tagName)))return false;if(t&&t.closest&&t.closest(".band, .export-bar, #game"))return false;return true}
function tapDown(x,y,ts){tapStart={x:x,y:y,t:ts}}
function tapUp(x,y,t,ts){var s=tapStart;tapStart=null;if(!s)return;if(Math.abs(x-s.x)>12||Math.abs(y-s.y)>12||ts-s.t>700)return;
  if(!tapAllowed(t))return;tapIgnoreUntil=ts+700;stage.classList.toggle("show")}
if(window.PointerEvent){
  window.addEventListener("pointerdown",function(e){if(e.pointerType!=="mouse")tapDown(e.clientX,e.clientY,e.timeStamp)},true);
  window.addEventListener("pointerup",function(e){if(e.pointerType!=="mouse")tapUp(e.clientX,e.clientY,e.target,e.timeStamp)},true);
} else {
  window.addEventListener("touchstart",function(e){var p=e.changedTouches[0];tapDown(p.clientX,p.clientY,e.timeStamp)},{capture:true,passive:true});
  window.addEventListener("touchend",function(e){var p=e.changedTouches[0];tapUp(p.clientX,p.clientY,e.target,e.timeStamp)},{capture:true,passive:true});
}
window.addEventListener("click",function(e){
  if(e.timeStamp<tapIgnoreUntil)return; // already handled as a touch tap
  // ...existing click handler body continues unchanged...
```

Notes:
- A tap counts only if the finger moves less than 12px and lifts within 0.7s, so scrolling or dragging doesn't toggle the band.
- Taps on the open band (including the Message field), the export bar buttons and the game are left to their own handlers.
- **Timing uses `e.timeStamp`, not `Date.now()`:** on Aleatory the renderer freezes the clock, so `Date.now()`-based timing would break on chain.

Ship together with issue 3.

---

## 3. KATAMAKI button shows on mobile, where the game isn't supported

**Affects:** all three files.

**Symptom.** Katamaki is desktop-only: touch controls and several other parts of the game don't work well on mobile. On mobile browsers that do open the traits band, the **KATAMAKI** button still appears and opens a game that can't really be played. Once issue 2 is fixed, every mobile user will be able to reach it.

**Fix (not yet built).** Hide the button on touch-only devices with one CSS rule. It's the first button in the export bar (`aria-label="Play Katamaki"`):

```css
@media (hover:none) and (pointer:coarse){.export-bar .button[aria-label="Play Katamaki"]{display:none}}
```

This matches phones and tablets without a mouse or trackpad and leaves desktops (including touchscreen laptops with a trackpad) unchanged. The SVG and GIF buttons stay.

Optionally, also stop the `G` key from opening the game on those devices, for tablets with a keyboard. Not essential, since the button is the main way in on mobile.

---

## 4. GIF export keeps an earlier version after the Message changes

**Affects:** all three files. Desktop and mobile.

**Symptom.** The GIF button downloads whatever the art looked like the *first* time it was clicked. Type a custom message, save a GIF, then clear the message: the next GIF still shows the custom text instead of the original. It also happens the other way round (save the original, add a message, still get the original). The SVG export isn't affected.

**Cause.** The SVG is rebuilt from the current art on every click. The GIF takes a few seconds to render, so it's rendered on the first click and cached for reuse. The cache is a single `ready` flag that's set once and never reset, so later changes to the art are never picked up.

**Fix (not yet built).** Remember *which* art the cached GIF was made from, and only reuse it if the art is still the same at click time. The current art is already kept as one string, `curSvg`, which the Message field updates whenever it changes the art. Compare against it, not against the typed text: some different inputs produce the same art (e.g. `yolo` and `YOLO ` with a trailing space), and on a Text piece, clearing the field restores the piece's own word, so the art matches the original again.

That gives:

| Case | On GIF click |
| --- | --- |
| First click | Nothing cached, so render the current art (the original) |
| Message field focused, nothing typed | Art unchanged, so reuse the cached GIF |
| Typed, then deleted back to nothing | Art unchanged, so reuse |
| Typed, then clicked | Art differs, so discard the cache and render the typed version |
| Message deleted after a typed version was rendered | Art differs (back to the original), so discard and render the original |

In the GIF export block, replace the `ready` flag with a record of the art the cached GIF was made from:

```js
var gifFor=null,pass=false; // gifFor: the curSvg the cached GIF was rendered from
function fresh(){return !!_gifUrl&&gifFor===curSvg}
function render(cb){if(fresh())return cb&&cb();if(busy)return;busy=true;spin(true);var want=curSvg;
  makeGif().then(function(r){if(_gifUrl)URL.revokeObjectURL(_gifUrl);_gifUrl=r.url;gl.href=r.url;gl.setAttribute("download",r.name);gifFor=want;busy=false;spin(false);cb&&cb()},
    function(err){console.error(err);busy=false;spin(false)})}
gl.addEventListener("click",function(e){
  if(!sandbox){
    if(pass){pass=false;return}        // the click that follows a fresh render: let the download go through
    if(fresh())return;                 // cached GIF still matches the art: download it as-is
    e.preventDefault();render(function(){pass=true;gl.click()});return}
  // sandbox ("Link to GIF") path: drop a stale link before reusing it
  if(linked&&!fresh()){linked=false;gs.textContent="GIF";gl.setAttribute("aria-label","Save GIF")}
  // ...existing sandbox path continues unchanged...
```

Notes:
- **The hop toggle (`M`) is deliberately not part of the check.** It only pauses the hop on screen; the GIF is built from the art's animation markup, which always includes the hop, so every GIF shows the standard hopped version regardless of `M`.
- **If the art changes while a GIF is rendering,** that render still completes and downloads the version that was clicked. It's recorded against the art at click time, so the next click sees the newer art and renders again.
- **`pass`** lets the follow-up click download the just-rendered GIF even if the art changed during rendering, instead of starting another render.
- **The sandbox branch** ("Link to GIF" / copy link) is a fallback for frames that block downloads. Aleatory now allows downloads, so it normally stays unused, but the stale-link reset keeps it correct if it ever runs.

---

## 5. Mono ignores the Profile trait

**Affects:** all three files. Mono palette only (20% of pieces).

**Symptom.** Every Mono piece shows a Profile (Random, Trio, Mirror, Duo, Accent, Spectrum), but the art is the same whichever one it gets. A Mono Duo looks exactly like a Mono Spectrum.

**Cause.** `monoRoles` always builds the six colour roles as `[L0,L1,L2,L3,L2,L1]` from its 4 lightness levels, and never looks at the profile. Classic and Neon build their roles from the profile, so the trait is real there.

**Fix.** Make the six Mono roles follow the profile, choosing from the same 4 shades (6 shades were tried and looked muddy):

| Profile | Shade order (indexes into the 4 shades) |
| --- | --- |
| Random | any 6, using at least 3 different shades |
| Trio | `a a b b c c`, 3 different shades |
| Mirror | `a b c c b a`, 3 different shades |
| Duo | `a b a b a b`, shades at least 2 steps apart |
| Accent | `a a a a a b`, shades at least 2 steps apart |
| Spectrum | `0 1 2 3 2 1` (today's look) |

Pass the profile in (`monoRoles(R,rm[0])` in `gen`, `function monoRoles(R,mode)`), and replace the `const L=lv(),C=[L[0],L[1],L[2],L[3],L[2],L[1]].map(...)` line with:

```js
/* the 6 roles follow the Profile, picking from the 4 shades (indexes into L). Duo and Accent shades sit 2+ steps apart; Random uses 3+ shades */
const pk=()=>Math.floor(R()*4),far=x=>{let y;do{y=pk()}while(Math.abs(y-x)<2);return y},dist=k=>{const u=[];while(u.length<k){const c=pk();if(!u.includes(c))u.push(c)}return u};
let I;if(mode==="random"){do{I=[0,1,2,3,4,5].map(pk)}while(new Set(I).size<3)}else if(mode==="trio"){const u=dist(3);I=[u[0],u[0],u[1],u[1],u[2],u[2]]}
else if(mode==="mirror"){const u=dist(3);I=[u[0],u[1],u[2],u[2],u[1],u[0]]}else if(mode==="duo"){const x=pk(),y=far(x);I=[x,y,x,y,x,y]}
else if(mode==="accent"){const x=pk(),y=far(x);I=[x,x,x,x,x,y]}else I=[0,1,2,3,2,1];
const L=lv(),C=I.map(i=>hsl(a,1,L[i]));
```

Also give Mono the same no-Fast limits as Classic and Neon: in `SPEED_RULES`, change the palette list `["classic","neon"]` to `null` (any palette) in the Duo/Accent field-pattern rule and the Ripple + Spectrum/Mirror rule.

**Known limit (accepted).** With 4 shades, Mono Trio has only 4 possible shade sets for a given hue and scale (which shade is left out), and any order of `a a b b c c` plays as the same loop once animated. Two Trio pieces with the same hue, scale and left-out shade look the same. Hue, scale and pattern still vary them.

**⚠ Changes existing seeds.** The new shade picks use extra random draws, and issue 6 changes which patterns can be picked. Many seeds would render different art from their minted token. Don't apply issues 5 and 6 to `makimono.html` or `index.html` while they're meant to match the minted collection; use them for a new edition.

---

## 6. Some trait combinations look the same as others

**Affects:** all three files. Desktop and mobile.

**Symptom.** Some pieces have different traits but show the same art, or art that's very hard to tell apart:

| Combination | Looks like | Why | Palettes |
| --- | --- | --- | --- |
| Duo + Diagonal | Checker | Two colours on a diagonal give a checkerboard | All |
| Duo + Chase | Duo + Scroll | The chase path alternates by column, giving vertical stripes | All |
| Accent + Checker | Duo + Checker | Checker only shows two colours, so the profiles match | All |
| Accent + Text | Duo + Text | Text cycles only the *unique* colours, in first-seen order: both are `a, b` | Mono |
| Mirror + Text | Trio + Text | Both reduce to `a, b, c` | Mono |
| Random + Text | Trio or Spectrum + Text | Random lands on 3 or 4 of the 4 shades | Mono |
| Mirror + Maki | Trio + Maki | Maki uses the same unique-colour cycle as Text | Mono |
| Mirror + Sparkle | Trio + Sparkle | The still base differs only by Mirror's split middle shade | Mono |
| Mirror + Ripple | Trio + Ripple | Same split shade, lost in the pulsing rings | Mono |

The first three are blocked on every palette, because the layout matches whatever the colours are. The Mono-only ones aren't a problem on Classic and Neon: there every piece rolls its own colours (Classic picks 3 of 6 at random; Neon picks a random start hue on the 24-hue wheel), so two pieces with the same colour count almost never share colours. On Mono, every piece picks from the same 4 shades of its hue, so the same count gives the same shades.

Checked and left alone:
- **Text on Classic/Neon:** Duo, Accent, Trio, Mirror, Random and Spectrum give different colour sets each roll.
- **Sparkle + Duo vs Checker:** Sparkle's random white pixels set it apart.

**Fix.** Ban these patterns per profile and palette in `patList`, which every pick and every odds calculation already goes through. Replace the `patList` line with:

```js
const TEXTS=["text_ants","text_tezos","text_paul_hbd","text_yolo"];
/* lookalike guards: drop patterns where a profile would look the same as another profile or pattern.
   all palettes (same layout whatever the colors): Duo Diagonal = Checker, Duo Chase = Duo Scroll, Accent Checker = Duo Checker.
   Mono only (Mono has 4 shades of one hue, so profiles with the same shade count land on the same shades): Text shows only the unique colors,
   so Accent = Duo and Mirror = Trio, and Random always matches Trio or Spectrum; Mirror's split shade can't be seen on Sparkle, Ripple or Maki */
const patList=(ramp,cp)=>{const b=ramp==="duo"||ramp==="accent"?["chromie","filling_cycle"]:[];/* two-color ramps: no Squiggle; no Maki either (Maki needs 3+ ramp colors, and in Classic it ignores the ramp) */
if(ramp==="duo")b.push("diagonal","chase");if(ramp==="accent")b.push("checker");
if(cp==="mono"){if(ramp==="accent"||ramp==="random")b.push(...TEXTS);if(ramp==="mirror")b.push("sparkle","ripple","filling_cycle",...TEXTS)}
return b.length?PAT.filter(x=>!b.includes(x[0])):PAT};
```

Then pass the palette at each call:
- In `gen`: `wp(R,patList(rm[0],cp))`.
- In the `SPW` speed-share table: `patList(r[0],m[0])`.
- In the Classic Maki odds (`rkp`): `patList(r[0],"classic")`.

Notes:
- **Odds stay correct.** The pattern odds come from the filtered list, and the speed shares are recomputed from it, so the listed odds still add up.
- Ship together with issue 5: the Mono rows assume Mono follows the Profile.

---

## 7. Katamaki can start with pieces already stuck to the roll

**Affects:** all three files. Desktop and mobile.

**Symptom.** On some seeds, the round starts with a few pieces already stuck to the maki, or with an ant or tree right on top of it.

**Cause.** The roll starts at the top of the planet. Things are placed on an even spread of points with a random turn around the up axis, but the top is slot 0 of that spread and the one point the turn can't move. So on some seeds a cluster of trees and bushes, a single obstacle, an animated feature, a pickup's backup spot (used when its first spot is water) or one of the ants lands exactly on the start, and anything small enough is rolled up on the first frame.

**Fix (built in the player and `v2/`).** After the world is built, `clearSpawn()` keeps a clear circle 5 units around the start: anything inside slides straight out to the edge, onto land. A cluster moves as one group so it keeps its shape, and things at the exact centre fan out in different directions. Counts, sizes, kinds and colours stay the same, and it runs after every random draw, so the rest of the world is unchanged. Each obstacle also records its cluster (`cl`) so the cluster can be moved together.

---

## 8. Hairline seams around the filling and the art's edge on iPhone Safari

**Affects:** all three files. iPhone Safari (WebKit at 3× display scale); desktop browsers are clean.

**Symptom.** On some seeds, thin lines show around the filling window and, in the hop's up pose, along the art's edge against the background. Which seeds show it depends on how much the colours under the shared edges contrast.

**Cause.** The art is built from layers that move over each other: the filling slides under a clipped window, and the hop translates the top half over a static base. `shape-rendering="crispEdges"` keeps hard edges on desktop, but iPhone Safari still softens the edges of moving layers, so where two shapes meet, whatever is underneath shows through as a hairline.

**Fix (built in the player and `v2/`).** Show the art as flat full frames, like pixel art that redraws every frame: no transforms, no clip, every shape on whole pixels. `MKFLAT` reads the art's own animation values (all discrete, all on the 70ms grid) and paints the 13 × 13 grid for every slot, then writes each distinct frame as one complete, opaque picture (backing = the frame's most common edge colour, then every other pixel), shown one at a time for exactly the slots the original shows it. Timing is unchanged, slot for slot. It doesn't use the browser's animation clock, so it works before the page has loaded and inside a minted file.

- **Checked pixel-identical** to the live art on every minted seed and over 100 random ones, with hop on and off, by sampling both slot by slot.
- **Hop off** shows a second flat version built without the hop animations (rest pose, fills keep running).
- **GIF and SVG export** use the flat frames; the GIF always uses the hopped version, as before.
- **Built in `v2/` too:** the same writer runs inside the generator, so a v2 token is flat itself.
