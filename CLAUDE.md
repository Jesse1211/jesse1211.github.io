# CLAUDE.md

Context for Claude Code working in this repo. Skim this before editing
the terminal UI, animation timings, history model, or deploy config —
several decisions look weird without the reasoning.

## What this is

`jesse1211.github.io` is a personal portfolio rendered as a fake
**glass terminal** floating over a Zdog star background. The terminal
is append-only: each user action types a new shell-like command and
fades in its output, with prior commands staying readable and
re-runnable.

Deployed to https://jesseliu.me via GitHub Pages (Actions mode).

## Stack

- **Vite 5 + React 18 + TypeScript** (SWC). `pnpm` is the package
  manager — `npm install` will work but lockfile drift will fail CI.
- **MUI Joy 5 beta** (`@mui/joy`) for primitives. MUI Material is also
  installed but only the theme bridge (`Experimental_CssVarsProvider`)
  is used. Joy injects its own background-color into `<Box>` — see
  *Gotchas* below.
- **Zdog** loaded from CDN in `index.html` (not bundled). Provides the
  3D star + drifting shapes background canvas.
- **GSAP + ScrollTrigger** (bundled) — drives `TargetCursor` (site-wide
  custom cursor) and the scroll-driven `ScrollReveal` terminal reveal.
- **OGL** (bundled) — WebGL lib for the `Prism` background layer.
- **ReactBits** components (MIT, copied into `src/components/effects/`
  and `src/components/canvas/`): ElectricBorder, TargetCursor,
  ScrollReveal, Prism. Not an npm package — source lives in-repo.
- **typewriter-effect** for per-line typing animation.
- **No tests.** Verification = `pnpm lint && pnpm build` pass + manual
  browser check.

## Running

```bash
pnpm install
pnpm dev      # vite dev server, opens http://localhost:5100
pnpm lint     # ESLint, --max-warnings 0 (warnings are errors)
pnpm build    # tsc + vite build → dist/
```

Lint **must** pass — CI gates on it before deploying.

## Deployment

Push to `main` → `.github/workflows/deploy.yml` runs lint + build +
publishes `dist/` via the modern `actions/deploy-pages` pipeline.
That's it; no `deployment` branch to maintain.

The Pages source is set to `build_type=workflow` (not `legacy`). If
it ever flips back to `legacy/deployment branch` (e.g. someone edits
it in repo Settings → Pages), restore it with:

```bash
gh api -X PUT repos/Jesse1211/jesse1211.github.io/pages \
  -f build_type=workflow
```

The custom domain `jesseliu.me` is enforced by `public/CNAME` (copied
into `dist/` automatically by Vite). Do NOT delete that file — it's
how Pages knows which CNAME to serve under workflow mode.

## Architecture

### Append-only terminal history (the core idea)

State lives in `src/state/LocationContext.ts` + `LocationProvider.tsx`.
The provider owns a single `history: HistoryEntry[]` array. Every
user action *appends* to it; nothing rewrites past entries. Detail
expansion lives in a parallel `expanded: Set<string>` keyed by
`<entryId>/<category>/<slug>`.

`HistoryEntry` is a discriminated union of: `cmd`, `answer`,
`answerKey`, `categories`, `lsCategory`, `about`. Each entry has an
`id` (monotonic counter, used as React key + reveal-tracking handle).
`cmd` entries optionally carry an `action: CmdAction` — clicking that
cmd in history re-runs the action via `replayFrom(entryId)`, which
truncates history *before* that cmd and re-emits its block.

`chooseFromMenu(menuEntryId, action)` is similar but keeps the menu
entry itself and replaces only what comes after it — used by the
`ls categories/` chips so clicking a different chip "swaps" the
selection without piling up duplicates.

`path` was once dynamic but is now always `"~"`. We never `cd` —
clicking a chip emits `ls -la <dir>/` or `cat about/profile.txt`
directly. The `path` field on `cmd` entries (`atPath`) is still
recorded per row so the prompt prefix on the regenerated row matches
after a replay.

### Trailing prompt suggestions

The live prompt at the bottom (`TrailingPrompt` in `Home.tsx`)
derives its chip suggestions from `currentLocationOf(history)` —
walks backwards through history to find the most recent enter-action
and skips chips for that location.

If the last history entry is already a `categories` menu (the boot
sequence), the trailing prompt's chips are suppressed so two
identical chip rows don't render back-to-back.

### Animation timing (`Home.tsx`)

Three knobs control the typing + reveal cadence:

- `TYPING_MS_PER_CHAR = 20`
- `STAGGER_MS = 80`
- `TYPING_BUFFER_MS = 120`

A `useMemo` walks `history` once per render and assigns each entry
a cumulative `revealDelay` based on whether the *previous* entry is
animating typing (long delay) or is a static reveal (short stagger).
`tailDelay` is the cumulative total — used to delay the trailing
prompt's `<Reveal>` so the cursor doesn't appear before the output
finishes.

`seenIdsRef` is mutated in a `useEffect` (NOT during render) to
record which entries have been rendered before. On subsequent
renders (e.g. locale switch), seen entries get `delayMs = 0` and
skip the typewriter — typing only plays on first appearance.

### `Reveal` component

`src/components/terminal/Reveal.tsx` is now layout-only and has two
modes:

- `mode="expand"` (default): `overflow: hidden` + `max-height: 0 →
  4000px` so new history pushes existing content down. Used for
  every history entry.
- `mode="fade"`: opacity only, layout box always reserved. The
  trailing prompt passes `mode="fade"` explicitly, because
  expanding/collapsing it on every new chip click made the panel
  jump.

`Reveal` uses `useLayoutEffect` (not `useEffect`) to flip `visible`
to `false` *before* paint when `delayMs` jumps to a positive value.
Combined with `transition: none` on the fade-out direction, this
eliminates a 1-frame flash of the trailing prompt right after the
user clicks a chip. Opacity/blur reveal is now handled by
`ScrollReveal`, not `Reveal` — see below.

### Scroll-driven reveal (replaces timer reveal)

Each history entry is wrapped in `ScrollReveal`
(`src/components/effects/ScrollReveal.tsx`) whose scroller is the
GlassPanel body (`scrollRef`). As the panel scrolls, each entry
rotates + (for string children) blurs/fades in via GSAP
ScrollTrigger. `Reveal.tsx` is now layout-only: `mode="expand"`
does the height push-down, `mode="fade"` is the trailing prompt.
Already-seen entries pass `disabled` to ScrollReveal so locale
switches don't re-animate. Auto-scroll eases `scrollTop` toward the
bottom (≈18%/frame) instead of snapping, so each line crosses its
ScrollTrigger threshold as it passes the reveal point.
`ScrollTrigger.refresh()` runs on each history append.

ScrollReveal kills ONLY its own triggers on unmount (tracked in a
ref) — never `ScrollTrigger.getAll().kill()`, which would tear down
every other entry's reveal.

### Auto-scroll (`Home.tsx`)

`useLayoutEffect` runs a `requestAnimationFrame` loop on every
`history.length` change, easing `scrollTop` toward `scrollHeight`
(≈18% of the remaining distance per frame) rather than snapping.
This keeps each new line crossing its ScrollTrigger reveal threshold
smoothly. The loop runs for the full `tailDelay + 500ms` window so
late-expanding entries are also covered.

### Window controls

`Home.tsx` owns a `windowState: "normal" | "minimized" | "fullscreen"`.
`GlassPanel` forwards `onRed / onYellow / onGreen` to `TitleBar`; the
yellow dot minimizes (terminal disappears, centered dock pill shows),
green toggles fullscreen, red is intentionally decorative.

### Zdog background

`src/components/canvas/StarAndPlanet.tsx` builds the floating shapes
and starfield. It runs once on `Home` mount (it's an imperative
side-effect, not React state). Three shape factories share a common
`Floater` interface (anchor + group + drift + spin params): sphere
(ring stack), polygon, box. Positions are randomized across ±420
units per reload, so the layout differs every refresh.

The Prism WebGL layer (`src/components/canvas/PrismBackground.tsx`,
`z-index: -2`) renders BEHIND the Zdog canvas. The Zdog canvas is
styled by the `#zdog-canvas {}` rule in `index.html` (scoped to that
id so it does not leak onto Prism's or ElectricBorder's canvases),
which gives it `background: transparent` and `z-index: -1` so both
layers are visible. Prism's `.prism-container` uses `z-index: -2`.
Both sit behind the terminal (`zIndex: 1`). Prism is disabled under
`prefers-reduced-motion`. Two rAF loops run (Zdog + Prism) — this
is intentional fusion, not a bug.

### Glass panel + MUI override gotcha

`GlassPanel.tsx` sets `background`, `backdrop-filter`, `border` via
`sx` — **not** a CSS class. Joy's `<Box>` injects its own
`background-color: var(--joy-palette-background-surface)` that
quietly overrides classnames. `sx` wins because emotion's runtime
has higher specificity. If you find yourself debugging "why isn't
my opacity changing", check whether the rule is on a class vs. sx.
This bit us repeatedly during the redesign.

## Project layout

```
src/
  App.tsx              providers + flex-centered terminal + fixed footer
  main.tsx             entry, mounts <App/>
  App.css              .term-* utility classes (scrollbar, scanlines, …)
  index.html           CDN script for Zdog; loads JetBrains Mono

  state/
    LocationContext.ts   types + createContext + useLocation hook
    LocationProvider.tsx the actual state machine (history, replay…)
    locationSlug.ts      slug helpers (educationSlug, experienceSlug)

  components/
    Home.tsx               renders history + trailing prompt
    Navigation.tsx         top-right [ EN | 中 ] toggle
    Footer.tsx             fixed-bottom © line
    PortfolioContext.tsx   static data + locale
    PortfolioProvider.tsx
    DescriptionModal.tsx   "$ less brief.md" experience modal

    terminal/
      GlassPanel.tsx    the framed panel (background, blur, scroll body)
      TitleBar.tsx      ●●● + label; optional onClick handlers
      Prompt.tsx        jesse@portfolio:<path>$ prefix + content
      TypeLine.tsx      one-shot typewriter for a single line
      Cursor.tsx        blinking block cursor
      Chip.tsx          [label] terminal chip button
      Reveal.tsx        height-expand or fade-in wrapper

    canvas/
      StarAndPlanet.tsx Zdog illustration + drifting shapes + stars

    categories/
      EducationView.tsx   "$ ls -la education/" output
      EducationRow.tsx    single drwxr-xr-x row
      EducationDetail.tsx text-flow detail (no nested glass)
      ExperienceView.tsx  + Row + Detail (same shape)
      AboutMeView/        avatar + intro + social links

  theme/terminal.ts    palette, fontStack, glassSx tokens (some unused)
  models/              static data (AllData_US/CN, Categories types)
```

## Common edits

- **Change typing speed** → `TYPING_MS_PER_CHAR` in `Home.tsx`.
- **Adjust reveal stagger** → `STAGGER_MS` / `TYPING_BUFFER_MS`.
- **Reveal animation duration** → `durationMs` prop default in
  `Reveal.tsx`.
- **Glass appearance** → inline `sx` in `GlassPanel.tsx` (background
  alpha, blur amount, border color). Theme tokens in
  `theme/terminal.ts` exist but most components inline their values.
- **Background shape positions / count** → `_CONFIGS` constants in
  `StarAndPlanet.tsx`. `POS_RANGE = 420` controls how far from
  center floaters can spawn.
- **Add a new category chip** → update `currentLocationOf`,
  `trailingSuggestions`, `CategoryChips`, and add the corresponding
  `enterX` to the provider + a `CmdAction` variant.

## Editing portfolio data

All visible content lives in `src/models/AllData_US.tsx` and
`src/models/AllData_CN.tsx`. **Both files must stay in sync** —
the locale switch in the navigation bar reads from whichever
matches `$locale`. If you only edit one, switching language reveals
stale or missing data.

The `Experience` shape is defined in `src/models/Categories.tsx`:

```ts
{
  _id: string;          // "1".."N", contiguous; see below
  StartDate: string;    // "Sep 2025" / "2025年9月"
  EndDate: string;      // "Jun 2026" / "2026年6月" / "Present" / "至今"
  Title: string;
  Company: string;
  Location: string;
  Description: string;  // one-line summary, shown in detail
  Image?: string;       // "./protonbase.png" — file lives in public/
  Link?: string;        // becomes a "$ open <url>" chip
  Brief: Map<string, string[]>;
}
```

`Brief` is a 2-level hierarchy: each key is a heading (rendered with
`▸`), each value is a list of sub-bullets (rendered with `-`). Pass
`[]` for a heading with no sub-bullets. Example:

```ts
Brief: new Map([
  [
    "Built X with Y impact",
    [
      "Sub-bullet 1.",
      "Sub-bullet 2.",
    ],
  ],
  ["A standalone line with no sub-bullets", []],
])
```

`Education` is similar but flatter — see the existing entries for
field shape.

### `_id` is contiguous

`_id` values must be `"1"`, `"2"`, … without gaps. The slug helpers
(`educationSlug` / `experienceSlug` in `src/state/locationSlug.ts`)
derive the row's URL-style identifier from this, and the
LocationContext's `expanded` Set keys depend on it. When inserting
in the middle, **renumber all later entries** — `git grep '_id: "'
src/models/` is the quick check.

### Images

Logos and other assets go in `public/<name>.png`. Vite copies the
entire `public/` tree into `dist/` at build time. Reference them
from data as `"./name.png"` (with the leading `./`) so the path
works under the custom domain root.

**Never put assets in `dist/` directly** — `pnpm build` wipes that
directory.

### List order

`experienceUS[0]` renders first in the `$ ls -la experience/`
output (top of the list). The convention is reverse-chronological:
the most recent role goes at index 0. New role goes to the top,
everything else shifts down.

## Gotchas / non-obvious decisions

- **Joy `<Box>` overrides CSS classes for `background`** — use `sx`
  for terminal styling, not classNames. See `GlassPanel` and
  `Navigation` for the pattern.
- **`Stack spacing={1.2}` after we added `SectionDivider`** — the
  divider provides its own visual gap, so the stack spacing was
  dialled down. Don't re-bump it without considering the dividers.
- **The `path` state is always `"~"`** but the `path` field is kept
  in the context for the trailing prompt's prefix. Don't try to
  derive a "real" cwd from history — the design choice was
  explicitly: every command is run from `~`.
- **`seenIdsRef.current.add` MUST be inside `useEffect`**, not
  during render. Side-effects during render break locale switches.
- **`useLayoutEffect` in `Reveal`**, not `useEffect`. Switching to
  the latter brings back a 1-frame flash of the trailing prompt.
- **The CSS `.term-glass` class was removed** in the glass-debug
  pass — its background was always being shadowed by Joy. Don't
  resurrect it; put glass styles in `sx`.
- **`HomeNavigation.tsx`, `KV.tsx`, `Breadcrumb.tsx`, `Quote.tsx`,
  `Buttons.tsx`, `CategoryDetails.tsx`, `models/Ring.tsx`,
  `models/User.tsx`, `services/`, `hooks/`, `styles.ts`,
  `FloatingBalls.tsx`** are all removed. Don't re-add them by
  habit if a file feels "missing" — they were superseded by the
  current design.
- **`axios` and `gh-pages` are intentionally NOT in
  `package.json`**. The site reads from static `models/AllData_*`,
  no HTTP calls. Deploys go through Pages Actions, no manual CLI.
  (Note: `gsap` and `ogl` ARE intentional deps now — see the
  ReactBits gotcha below.)
- **ElectricBorder wraps GlassPanel from the OUTSIDE** — its glow
  needs `overflow: visible`, while the panel keeps `overflow: hidden`
  for the scroll body. The glass `border` alpha was dropped to `0.18`
  so the electric arcs are the dominant frame, not a double border.
- **TargetCursor sets `document.body.style.cursor = 'none'`** and
  snaps to `.cursor-target` elements (added to `Chip`). It
  self-disables on touch/small screens via its built-in `isMobile`
  guard — don't add a second guard.
- **`gsap` and `ogl` ARE now in package.json** (correcting the
  earlier "no extra deps" note). They power
  TargetCursor/ScrollReveal and Prism respectively.

## Design history

If you need broader context on why something is the way it is, the
spec and plan documents are in `docs/superpowers/specs/` and
`docs/superpowers/plans/` (dated `2026-06-11-glass-terminal-redesign-…`).
Those captured the original design discussion; recent commits on
`main` since the merge supersede some of those decisions (`hint`
entries removed, ring sphere replaced with multi-shape floaters,
window controls added).

The four ReactBits effects (ElectricBorder, TargetCursor, Prism,
scroll-driven ScrollReveal) are specced in
`docs/superpowers/specs/2026-06-19-reactbits-effects-design.md` and
planned in `docs/superpowers/plans/2026-06-19-reactbits-effects.md`.
