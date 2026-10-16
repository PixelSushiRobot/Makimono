# Known issues

These issues affect `makimono.html`, `makimono.mint.html` and `index.html`. The minted collection (`makimono.mint.html`) was published before they were found, so the fixes below are **not** in it. Each has a tested fix, recorded here for a future edition and for updating the demo.

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
