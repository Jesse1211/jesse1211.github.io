# JessiVerse — Glass-Terminal Redesign

**Date**: 2026-06-11
**Branch**: `feat/glass-terminal-redesign`
**Status**: Draft, pending implementation plan

## 1. Goal

Replace the current MUI Joy-default look of `jesse1211.github.io` with a **glassmorphism + terminal** style, inspired by the CRT terminal aesthetic of the `NowYouSeeMe` project but kept floating over the existing Zdog star/planet canvas instead of a pitch-black background. The Zdog canvas and its animations are kept exactly as-is.

The site continues to be a single-page portfolio; this is a styling + interaction overhaul, not a re-architecture.

## 2. Design Language

### 2.1 Palette

| Token            | Value                                  | Use                                         |
|------------------|----------------------------------------|---------------------------------------------|
| `bg`             | `#0e0f43` (unchanged)                  | Body background behind Zdog canvas          |
| `glass-bg`       | `hsla(240, 60%, 15%, 0.30)`            | Panel base                                  |
| `glass-blur`     | `blur(16px) saturate(140%)`            | `backdrop-filter` on panels                 |
| `accent`         | `hsla(180, 100%, 70%, 0.85)` (`#7FFFFF`) | Borders, prompts, active text, glow         |
| `accent-strong`  | `hsla(180, 100%, 80%, 1)`              | Hovered/focused text                        |
| `text`           | `hsla(180, 30%, 92%, 0.95)`            | Primary body text                           |
| `text-dim`       | `hsla(180, 30%, 85%, 0.65)`            | Secondary text, metadata                    |
| `border`         | `1px solid hsla(180,100%,70%,0.4)`     | Panel border                                |
| `glow-hover`     | `0 0 12px hsla(180,100%,70%,0.5)`      | Hover halo                                  |
| `glow-active`    | `0 0 18px hsla(180,100%,70%,0.7)`      | Active/expanded panel halo                  |

### 2.2 Typography

- Primary: `JetBrains Mono` loaded from Google Fonts
- Stack: `'JetBrains Mono', 'Fira Code', 'Courier New', ui-monospace, monospace`
- Sizes: 12px (meta), 13px (body), 14px (default), 16px (titles), 22px (header)
- Line-height: `1.6` body, `1.3` headers
- Letter-spacing: `0.5px` body, `2px` on uppercase headers
- Tabular numerals (`font-variant-numeric: tabular-nums`) on key-value blocks so dates and GPAs line up

### 2.3 Shape & Surface

- Panels: 1px aqua border, `border-radius: 4px`, `padding: 16-20px`
- Window title bar: `● ● ●  ~/path — zsh` strip on top of the main terminal panel only (not every sub-panel)
- Scanline overlay: full-screen `::before`, 4px striped gradient at `~2%` opacity aqua, `pointer-events: none`, `z-index: 9999`
- Blinking cursor: 8px × 14px aqua block, 1Hz blink, follows the active prompt line
- Animations: existing `Fade`/`Grow` kept; new interactions use `framer-motion` height-auto for in-place row expansion

## 3. Information Architecture

The app stays a single-page SPA with no real router (avoids re-mounting the Zdog canvas).

Internal `LocationContext` carries a string `path`:

```
~                       landing
~/education             list of schools
~/education/01-cornell  expanded card (multiple may be open)
~/experience            list of jobs
~/experience/01-cornell-diaper
~/about                 about-me panel
~/blog                  external nav → blog.jesseliu.me (window.location.href)
```

Navigation rules:
- `Breadcrumb` at the top of the main panel reads `jesse@portfolio:~/education/01-cornell$`. Each segment is clickable: clicking `~` goes home, clicking `education` goes back to the list, etc.
- Detail panels expand **in place** below their parent list row (no page swap). Multiple rows can be open at once (terminal stack feel). Path reflects the most recently opened row.
- `..` chip in the breadcrumb collapses one level.
- Language toggle stays top-right, restyled as `[ EN | 中 ]`.

## 4. Page-by-Page

### 4.1 Landing (`~`)

A single central glass terminal window.

Title bar: `● ● ●   ~/jesse — zsh`

Sequential typewriter inside the panel:

```
$ whoami
> Jesse Liu — full-stack developer, CS MEng @ Cornell
$ cat motto.txt
> Never hold yourself back.
> Follow the path, enjoy the journey.
$ ls categories/
 [education/]  [experience/]  [blog/]  [about/]
$ █
```

- The first 3 prompts run automatically on mount; pause briefly between them.
- The 4 category chips appear after the `ls` line completes. Each chip is a glass mini-button with aqua border; hover adds `glow-hover`; click sets `path = '~/<name>'`.
- The trailing `█` cursor keeps blinking at the bottom until the user clicks.
- The "Start Discovery" button is **removed**; the menu chips serve the same role.

### 4.2 List (`~/education`, `~/experience`)

Glass panel. Title bar shows the breadcrumb. Content:

```
$ ls -la education/
 drwx  01-cornell      2024 - 2025   Cornell University
 drwx  02-ucdavis      2021 - 2023   UC Davis
 drwx  03-ccsf         2019 - 2021   City College of SF
 drwx  04-berkeley     2018 - 2019   Berkeley City College
```

- Each row is a `<button>` styled as text, full row width.
- Hover: left 2px aqua bar appears + faint aqua-tinted row background.
- Click: toggle expansion. Expanded rows show a detail sub-panel (4.3) right below; row marker becomes `drwx ▾`. `path` updates to the most recently opened item.
- Multiple expansions are allowed; `..` in breadcrumb collapses all.

### 4.3 Detail card (expanded sub-panel)

Sub-glass panel, indented under its row. Title: `$ cat 01-cornell/info.md`. Body uses two columns when ≥ md:

- Left: logo image (existing `Image` field), max 120px square, 1px aqua border, slight aqua tint via `box-shadow`.
- Right: key/value block, tabular-aligned:

```
School:   Cornell University
Major:    M.Eng., Computer Science
GPA:      3.71 / 4.00
Period:   Jan 2024 – Dec 2024
Location: Ithaca, NY
Moto:     "Breaking the rules of conventional wisdom."
```

- Below the kv block: italicised `Description`.
- For `Experience`: same skeleton, plus a `$ less brief.md` action button which opens the existing `DescriptionModal` (restyled as glass; see 4.5) and, when `Link` exists, an `$ open <url>` button.

### 4.4 About (`~/about`)

Glass panel, header `$ cat profile.txt`. Body:

- Avatar (existing `./Jesse.png`) on top, circular crop with aqua border ring.
- Plain-text block of `introduction.adderess`, `introduction.line1`, `introduction.parapraph`.
- Below: a contact section:

```
$ contact --list
 [@]   mailto:zl942@cornell.edu
 [gh]  github.com/Jesse1211
 [in]  linkedin.com/in/jesse-liu-0613201b4
 [ig]  instagram.com/zhl_lzh
 [wx]  wechat (qr) →
```

- Each line is a link/button; `[wx]` opens the existing `WechatDialog` (restyled as glass).

### 4.5 Modals (`DescriptionModal`, `WechatDialog`)

- Backdrop: `rgba(8, 8, 30, 0.55)` + `backdrop-filter: blur(8px)`.
- Dialog: glass panel with title-bar (`● ● ●  $ less brief.md`), 1px aqua border, scanline overlay inside the dialog only.
- Content typography matches the rest of the system (monospace, aqua hierarchy).
- `DescriptionModal`: keep the `Map<string, string[]>` structure; replace `🎯` / `•` emoji with `▸` / `- ` ascii markers.

### 4.6 Footer

- Currently `position: fixed; bottom: 0`. Change to **flow-layout at end of document**.
- Style: dim italic comment `// © 2018-2026 Jesse Liu  ::  built with Vite + zdog`.

### 4.7 Language toggle (`Navigation.tsx`)

- Replace the MUI `Translate`-icon button with a small glass strip:

```
[ EN | 中 ]
```

- Active language is `accent-strong`, the other is `text-dim`. Click flips locale via existing `PortfolioContext.onLocaleChange`.

## 5. State

A new `LocationContext` (Provider near `App`):

```ts
type Path = string; // "~", "~/education", "~/education/01-cornell", ...
{ path: Path;
  expanded: Set<string>;      // ids of open detail rows
  push(segment: string): void;
  pop(): void;
  goto(path: Path): void;
  toggle(id: string): void; }
```

- IDs use the slug pattern `<category>/<index>-<short-name>` derived from data. Slugs are generated once at provider init; data stays unchanged.
- `PortfolioContext` is unchanged.

## 6. File Map

```
ADD
  src/theme/terminal.ts                       palette tokens + sx helpers
  src/components/terminal/
    GlassPanel.tsx                            generic panel (props: title, hasTitleBar, glow, children)
    TitleBar.tsx                              ● ● ●  <text>
    Prompt.tsx                                $ prefix + line + blinking cursor
    TypeLine.tsx                              wrapper around typewriter-effect for one staged line
    Breadcrumb.tsx                            jesse@portfolio:<path>$  with clickable segments
    Chip.tsx                                  [text] menu chip
    Cursor.tsx                                blinking █
  src/state/LocationContext.tsx               described in §5
  src/state/locationSlug.ts                   slug helpers

EDIT
  index.html                                  preconnect + JetBrains Mono link; remove inline ::-webkit-scrollbar hide; add base scanline; keep #0e0f43 bg
  src/App.tsx                                 wrap with LocationProvider; remove the duplicate <CssVarsProvider> in main.tsx (see §8); restyle MUI Joy theme to use mono font + aqua tokens
  src/main.tsx                                drop the redundant outer <CssVarsProvider>
  src/App.css                                 fix the quoted-value bug; add .term-* utility classes; remove obsolete .home-button / .category-button selectors
  src/styles.ts                               rewrite cardStyles/stackStyles for glass surfaces
  src/components/Home.tsx                     replace Start-Discovery flow with §4.1 landing sequence
  src/components/Navigation.tsx               §4.7 [ EN | 中 ] strip
  src/components/HomeNavigation.tsx           drive content from LocationContext; render list or expanded details
  src/components/Quote.tsx                    fold its lines into the landing typewriter sequence; file can be deleted or kept as a leaf used inside Home
  src/components/Footer.tsx                   §4.6 flow-layout footer
  src/components/DescriptionModal.tsx         glass restyle (§4.5)
  src/components/categories/CardContainer.tsx Replaced by GlassPanel + kv layout for the detail card
  src/components/categories/EducationView.tsx §4.2 + §4.3
  src/components/categories/ExperienceView.tsx §4.2 + §4.3
  src/components/categories/AboutMeView/AboutMeView.tsx           §4.4
  src/components/categories/AboutMeView/SocialMedialButtons.tsx   §4.4 contact list
  src/components/categories/AboutMeView/WechatDialog.tsx          §4.5 glass restyle

DELETE
  src/components/Buttons.tsx                          fully commented dead file
  src/components/categories/CategoryDetails.tsx       fully commented dead file
  src/hooks/                                           unused (useUser, useEducation*, useProject*, useExperience*)
  src/services/                                        unused (user-service, education-service, project-service, experience-service)
  package.json dep: axios                              no callers after hooks/services removal
```

## 7. Interaction Details

- **Scanline overlay**: rendered once at the app root, `pointer-events: none`, opacity ~0.04. Inside modals, a second overlay is scoped to the dialog so the effect persists even when content is over a darker backdrop.
- **Cursor**: a single shared `Cursor` component re-used wherever needed. CSS keyframe `blink` (1Hz, 50/50 duty).
- **Row expand animation**: framer-motion `height: 'auto'` with 250ms ease. No scroll jump — the page lets the document grow.
- **Hover halos** are CSS-only (`transition: box-shadow .15s`) — no JS.
- **Typewriter**: replace per-line use of `typewriter-effect` with a single staged sequence on the landing page; subsequent prompts (breadcrumb, panel titles) are static, not animated, to avoid jitter.

## 8. Bug Fixes Folded In (touched-area only)

- `src/main.tsx` + `src/App.tsx` both wrap with `CssVarsProvider`. Remove the outer one in `main.tsx`.
- `src/App.css` has `color: "#889def";` (string-quoted values) → values become invalid; rewritten with unquoted values, and replaced by new `.term-*` classes during the redesign.
- `Footer` uses `position: fixed` and overlaps long pages → switched to flow.
- Default `defaultMode="system"` on Joy provider but background is hard-coded dark → set `defaultMode="dark"` explicitly.

Unrelated existing typos in data files (`adderess`, `parapraph`, etc.) are **out of scope** for this spec.

## 9. Risks & Mitigations

| Risk                                                                   | Mitigation                                                                 |
|------------------------------------------------------------------------|----------------------------------------------------------------------------|
| `backdrop-filter` not supported on old Safari                          | Add `-webkit-backdrop-filter`; fallback panel `background` is more opaque  |
| Scanline overlay swallows clicks                                       | `pointer-events: none` enforced in `GlassPanel` + global overlay           |
| Multiple expansion + framer-motion + Zdog re-renders                   | Use `React.memo` on rows; don't touch the Zdog component tree              |
| Typewriter staged sequence flickers when language switches             | Reset sequence on locale change with a `key={locale}` on the landing panel |
| JetBrains Mono fails to load (offline)                                 | Fallback stack ends in `monospace`, layout still works                     |
| Removing `hooks/`/`services/`/`axios` breaks an unseen import          | `git grep -nE "from \"(\.\./)*(hooks\|services)\""` before delete          |

## 10. Out of Scope

- Real react-router routing / shareable URLs
- Backend / API integration (axios is removed)
- Mobile-specific reworks beyond the existing responsive `sx` breakpoints
- Adding new content to the portfolio data
- Fixing data-file typos
- Blog (`https://blog.jesseliu.me`) stays an external link

## 11. Acceptance Checklist

- [ ] Site loads with Zdog stars and rings unchanged in motion and zoom
- [ ] Landing shows the staged terminal sequence and four category chips
- [ ] Clicking a chip pushes path `~/<name>` and renders an `ls -la` list with hover effects
- [ ] Clicking a list row expands a glass detail card with logo + kv block
- [ ] Multiple cards can be open simultaneously; collapsing each works
- [ ] Breadcrumb segments are clickable and navigate correctly
- [ ] Language toggle flips both static labels and dynamic content; landing sequence resets
- [ ] Description modal and Wechat modal both use the glass-terminal look with scanlines
- [ ] Footer sits at document bottom (flow), not overlapping content
- [ ] No console errors; no TS errors (`tsc`); no lint errors (`pnpm lint`)
- [ ] Dead files (`Buttons.tsx`, `CategoryDetails.tsx`, `hooks/`, `services/`) removed; `axios` not in `dependencies`
