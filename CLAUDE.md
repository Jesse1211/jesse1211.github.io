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

`src/components/terminal/Reveal.tsx` has two modes:

- `mode="expand"` (default): `overflow: hidden` + `max-height: 0 →
  4000px` so new history pushes existing content down. Used for
  every history entry.
- `mode="fade"`: opacity only, layout box always reserved. **Used for
  the trailing prompt only**, because expanding/collapsing it on
  every new chip click made the panel jump.

`Reveal` uses `useLayoutEffect` (not `useEffect`) to flip `visible`
to `false` *before* paint when `delayMs` jumps to a positive value.
Combined with `transition: none` on the fade-out direction, this
eliminates a 1-frame flash of the trailing prompt right after the
user clicks a chip.

### Auto-scroll (`Home.tsx`)

`useLayoutEffect` runs an `requestAnimationFrame` loop on every
`history.length` change, pinning `scrollTop` to `scrollHeight` for
the full `tailDelay + 500ms` window. This is because reveals expand
their max-height over ~260ms each — a one-shot scroll would miss the
later expansions.

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

## Design history

If you need broader context on why something is the way it is, the
spec and plan documents are in `docs/superpowers/specs/` and
`docs/superpowers/plans/` (dated `2026-06-11-glass-terminal-redesign-…`).
Those captured the original design discussion; recent commits on
`main` since the merge supersede some of those decisions (`hint`
entries removed, ring sphere replaced with multi-shape floaters,
window controls added).
