# ReactBits effects for the glass terminal — design

Date: 2026-06-19
Status: approved (pending spec review)

## Goal

Add four [ReactBits](https://reactbits.dev) visual effects to the
portfolio:

1. **Prism** background, fused with the existing Zdog geometric
   background (Prism behind, Zdog floaters + stars in front, both
   transparent — one combined scene).
2. **ScrollReveal** — convert the in-terminal output reveal from the
   current timer-driven model to a genuinely **scroll-driven** reveal.
3. **ElectricBorder** — applied to the terminal's outer frame
   (`GlassPanel`).
4. **TargetCursor** — site-wide custom cursor after entering the site.

ReactBits components are MIT-licensed source snippets copied into the
repo (not an npm package). Each is a self-contained `.tsx` (+ CSS).

## Dependencies added (bundled)

- **`gsap`** + its **ScrollTrigger** plugin — used by ScrollReveal
  (with a custom scroller) and by TargetCursor.
- **`ogl`** — WebGL library required by Prism.
- ElectricBorder needs **no** dependency (SVG filter + CSS only).

Note: the repo currently bundles neither GSAP nor OGL; Zdog is loaded
from CDN in `index.html`, not bundled. These are genuine bundle-size
additions (~50KB gzip GSAP, ~10KB OGL), accepted for this feature.
Only the ScrollTrigger GSAP plugin is imported (tree-shaken).

## New files

```
src/components/effects/ElectricBorder.tsx + ElectricBorder.css
src/components/effects/TargetCursor.tsx   + TargetCursor.css
src/components/effects/ScrollReveal.tsx   + ScrollReveal.css
src/components/canvas/PrismBackground.tsx
```

## Touched files

`GlassPanel.tsx`, `App.tsx`, `Home.tsx`, `Reveal.tsx`, `Chip.tsx`,
`App.css`, `package.json`.

---

## Component 1 — ElectricBorder (terminal frame)

Wrap the panel with `<ElectricBorder>` (color, thickness, speed,
chaos props). Lives in `src/components/effects/`.

**Layering gotcha:** `GlassPanel` already owns `border`,
`borderRadius: 4px`, and `overflow: hidden` (`GlassPanel.tsx:31,34`).
ElectricBorder injects absolutely-positioned SVG-filter layers plus
its own animated border/glow.

Resolution:
- ElectricBorder wraps the panel from the outside so its glow layer is
  not clipped by the glass `overflow: hidden`.
- The glass `border` alpha is reduced to near-zero so the two borders
  do not double up; the electric arcs become the visible frame.
- `borderRadius` is shared (same value) so the arcs trace the same
  rounded rectangle as the glass.
- Color matches the existing cyan accent `hsla(180,100%,70%,…)`. The
  current `glowShadow` in `GlassPanel` is augmented/replaced by the
  electric glow.

---

## Component 2 — TargetCursor (site-wide)

Copy `TargetCursor.tsx` + CSS into `src/components/effects/`. Mount
once near the top of the tree in `App.tsx` (after providers).

- Body gets `cursor: none` so the OS cursor hides; the custom
  corner-bracket cursor follows the pointer and snaps to elements
  tagged `.cursor-target`.
- Add the `cursor-target` className to interactive elements. Adding it
  once to `Chip.tsx` covers most clickables; also tag the title-bar
  dots, the replay-cmd buttons, and the minimized dock pill.
- **Touch / coarse-pointer fallback (added by us — stock ReactBits
  lacks it):** guard with `@media (hover: hover) and (pointer: fine)`.
  On touch devices, do not hide the OS cursor and do not mount the
  effect.
- GSAP-driven (already a dependency for ScrollReveal).

---

## Component 3 — Prism + Zdog fusion (background)

Two stacked, full-screen, transparent canvases:

- **Back layer (lowest z):** new Prism WebGL canvas (OGL). New
  component `PrismBackground.tsx`, mounted in `App.tsx` alongside the
  existing `<canvas className="canvas">` (`App.tsx:44`).
- **Front layer:** the existing Zdog canvas (floaters + stars) —
  logic unchanged, made transparent so Prism shows through.
- **Terminal:** already sits above both via `zIndex: 1`
  (`Home.tsx:326`).

Both canvases run their own `requestAnimationFrame` loop (Zdog's
existing loop + Prism's). Per the approved decision this is **full
Prism** with no opacity throttling. We still add a
`prefers-reduced-motion` kill-switch for **Prism only** (cheap,
standard, leaves the default look unchanged). Prism hue/intensity is
tuned toward the cyan/indigo palette so the two layers read as one
scene rather than two competing backgrounds.

---

## Component 4 — ScrollReveal (scroll-driven terminal rewrite)

This is the largest change. It replaces the documented "core idea"
(append-only timer-staggered reveal + snap-to-bottom auto-scroll) with
a scroll-driven reveal.

### Approved behavior

- **Auto-scroll stays** — clicking a chip still scrolls the new output
  into view (a click must still reveal its result).
- **Reveal becomes scroll-driven** — each entry's text is wrapped in
  ScrollReveal whose `scroller` is the GlassPanel body
  (`scrollRef.current`), not the window. As the panel scrolls, each
  line crosses ScrollTrigger's threshold and animates in word-by-word
  (blur→sharp, opacity 0→1, slight rotate).
- **GSAP ScrollTrigger** with a custom scroller is used.

### How the two cooperate (the tricky part)

1. The auto-scroll rAF loop (`Home.tsx:152-166`) changes from "snap
   `scrollTop` to `scrollHeight` every frame" to a **smooth eased
   scroll** toward the bottom over the reveal window. Smooth motion is
   required so ScrollTrigger fires per-line as lines cross the
   threshold, instead of teleporting past them.
2. The timer system — `revealDelay`, `tailDelay`, and the
   `Reveal` component's `delayMs` opacity/blur reveal — is **retired**
   in favor of ScrollTrigger.
3. `seenIdsRef` is **retained**: re-renders and locale switches must
   not re-animate already-seen lines. Seen entries reveal instantly
   (ScrollReveal disabled / no replay of the animation).
4. `Reveal.tsx` `mode="expand"` (height grow → push-down) is retained
   for **layout** (new content pushes old content down). The
   opacity/blur sweep moves to ScrollReveal. Exact nesting
   (ScrollReveal inside Reveal vs. merged) is settled in the
   implementation plan.
5. ScrollTrigger is configured with `scroller: scrollRef.current` and
   `ScrollTrigger.refresh()` is called after each history append
   (appending changes `scrollHeight`).
6. The trailing prompt's reveal (currently `Reveal mode="fade"` gated
   on `tailDelay`) is re-derived without `tailDelay` — it appears
   after the latest output settles. Exact trigger settled in the plan.

### Risk (on the record)

This rewrites the documented core of the terminal. It is the
highest-risk piece. All changes are reversible via git; the other
three components are independent and ship regardless.

---

## Build order (quick wins first)

- **Phase 1 — ElectricBorder + TargetCursor.** Low risk, immediately
  visible. Includes `Chip` `.cursor-target` tagging and the
  touch/coarse-pointer guard.
- **Phase 2 — Prism + Zdog fusion.** OGL dependency, two-canvas
  layering, `prefers-reduced-motion` guard.
- **Phase 3 — ScrollReveal scroll-driven rewrite.** GSAP ScrollTrigger,
  smooth eased auto-scroll, retire the timer-reveal system. Highest
  risk; done last so Phases 1–2 are unaffected if it needs iteration.

## Verification

Per `CLAUDE.md` (no test suite exists):

- `pnpm lint` must pass (`--max-warnings 0` — warnings are errors;
  CI gates on it).
- `pnpm build` must pass (`tsc` + `vite build`).
- Manual browser check at the end of each phase.

## Non-goals

- No change to the portfolio data, locale switch, or window controls.
- No replacement of Zdog (it stays as the front floater/star layer).
- No CDN→bundle migration of Zdog.
- No mobile-specific redesign beyond the TargetCursor touch guard and
  the Prism reduced-motion guard.
