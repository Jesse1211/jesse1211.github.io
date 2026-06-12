# Glass-Terminal Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current MUI Joy default UI of `jesse1211.github.io` with a glassmorphism + terminal style floating over the existing Zdog star/planet canvas, per the spec at `docs/superpowers/specs/2026-06-11-glass-terminal-redesign-design.md`.

**Architecture:** Stay a single-page SPA; no real router (Zdog canvas must not re-mount). A new `LocationContext` tracks an internal pseudo-path (`~`, `~/education/01-cornell`, ...) and an `expanded` set so list rows expand in-place. A `terminal/` component library (`GlassPanel`, `TitleBar`, `Prompt`, `Breadcrumb`, `Chip`, `Cursor`, `TypeLine`) provides reusable surface primitives. Existing PortfolioContext/locale stays unchanged.

**Tech Stack:** React 18 + TypeScript, Vite 5, MUI Joy 5 beta (kept, restyled via `extendTheme`), Emotion, framer-motion (already a dep), typewriter-effect (kept), Zdog (untouched).

**Branch:** `feat/glass-terminal-redesign` (already checked out).

**Testing note:** This project has no test runner configured (`package.json` has no `test` script, no Vitest/Jest). Verification gates are: `pnpm lint` → `pnpm build` (which runs `tsc && vite build`) → manual smoke check via `pnpm dev`. Every implementation task ends with at least `pnpm build`; manual checks are listed where they matter.

---

## Task 0: Verify baseline builds and lints clean

**Files:** none (baseline check only)

- [ ] **Step 1: Confirm branch + clean tree**

Run: `git status -sb && git branch --show-current`
Expected: branch `feat/glass-terminal-redesign`, working tree clean (the spec commit landed in the previous step).

- [ ] **Step 2: Install deps if not present**

Run: `pnpm install`
Expected: completes with no errors.

- [ ] **Step 3: Baseline lint**

Run: `pnpm lint`
Expected: passes (or known existing warnings). Record the result; later tasks must not regress it.

- [ ] **Step 4: Baseline build**

Run: `pnpm build`
Expected: `dist/` produced, no TS errors.

- [ ] **Step 5: No commit**

This task is read-only.

---

## Task 1: Remove dead code (hooks/, services/, Buttons.tsx, CategoryDetails.tsx, axios)

**Files:**
- Delete: `src/hooks/` (entire directory)
- Delete: `src/services/` (entire directory)
- Delete: `src/components/Buttons.tsx`
- Delete: `src/components/categories/CategoryDetails.tsx`
- Modify: `package.json` (remove `axios` from `dependencies`)

Rationale: `git grep` confirmed the only references between `hooks/` and `services/` are internal; no component imports them. `Buttons.tsx` and `CategoryDetails.tsx` are wholly commented-out files. `axios` is only imported inside the deleted `services/`.

- [ ] **Step 1: Verify no external references**

Run:
```bash
grep -rE "from \"(\.\./)*(hooks|services|components/Buttons|components/categories/CategoryDetails)\"" src
```
Expected: only intra-`hooks/`/`services/` references print; **no** results from `components/` (other than the commented files themselves). Abort if anything else shows up.

- [ ] **Step 2: Delete the dead files**

Run:
```bash
git rm -r src/hooks src/services src/components/Buttons.tsx src/components/categories/CategoryDetails.tsx
```

- [ ] **Step 3: Remove axios from package.json**

Edit `package.json`, remove this line from `dependencies`:

```json
    "axios": "^1.8.4",
```

- [ ] **Step 4: Reinstall to update lockfile**

Run: `pnpm install`
Expected: lockfile updated, no warnings about missing `axios`.

- [ ] **Step 5: Lint + build must still pass**

Run: `pnpm lint && pnpm build`
Expected: both succeed. If TS complains about a dangling import you missed, fix it now.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: remove unused hooks, services, axios, and commented-out files"
```

---

## Task 2: Add terminal theme tokens and global CSS

**Files:**
- Create: `src/theme/terminal.ts`
- Modify: `index.html` (preconnect to Google Fonts, load JetBrains Mono, drop the inline scrollbar-hiding rule)
- Modify: `src/App.css` (replace contents with `.term-*` utility classes; remove the broken quoted-value rules)

- [ ] **Step 1: Create `src/theme/terminal.ts`**

```ts
// Palette + sx helpers for the glass-terminal UI.
// All values are listed in docs/superpowers/specs/2026-06-11-glass-terminal-redesign-design.md §2.

export const palette = {
  bg: "#0e0f43",
  glassBg: "hsla(240, 60%, 15%, 0.30)",
  glassBgOpaque: "hsla(240, 60%, 12%, 0.85)", // fallback when backdrop-filter is unsupported
  accent: "hsla(180, 100%, 70%, 0.85)",
  accentStrong: "hsla(180, 100%, 80%, 1)",
  accentDim: "hsla(180, 100%, 70%, 0.4)",
  text: "hsla(180, 30%, 92%, 0.95)",
  textDim: "hsla(180, 30%, 85%, 0.65)",
  danger: "hsla(0, 80%, 70%, 0.9)",
} as const;

export const shadows = {
  hover: "0 0 12px hsla(180,100%,70%,0.5)",
  active: "0 0 18px hsla(180,100%,70%,0.7)",
} as const;

export const fontStack =
  "'JetBrains Mono', 'Fira Code', 'Courier New', ui-monospace, monospace";

export const glassSx = {
  background: palette.glassBg,
  backdropFilter: "blur(16px) saturate(140%)",
  WebkitBackdropFilter: "blur(16px) saturate(140%)",
  border: `1px solid ${palette.accentDim}`,
  borderRadius: "4px",
  color: palette.text,
  fontFamily: fontStack,
} as const;
```

- [ ] **Step 2: Update `index.html`**

Replace its current contents with:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JessiVerse 🌌 </title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
      rel="stylesheet"
    />
    <style>
      html,
      body,
      #root {
        height: 100%;
        background: #0e0f43;
        font-family: "JetBrains Mono", "Fira Code", "Courier New", ui-monospace,
          monospace;
        color: hsla(180, 30%, 92%, 0.95);
      }
      canvas {
        display: block;
        width: 100%;
        height: 100%;
        position: fixed;
      }
    </style>
  </head>
  <body>
    <div id="root" style="display: flex; justify-content: center"></div>
    <script src="https://unpkg.com/zdog@1/dist/zdog.dist.min.js"></script>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

(The inline `::-webkit-scrollbar { display: none }` rule is removed — terminal scrollbars look fine and improve usability.)

- [ ] **Step 3: Replace `src/App.css` contents**

```css
/* Glass-terminal utility classes. Tokens live in src/theme/terminal.ts. */

.term-glass {
  background: hsla(240, 60%, 15%, 0.30);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  border: 1px solid hsla(180, 100%, 70%, 0.4);
  border-radius: 4px;
  color: hsla(180, 30%, 92%, 0.95);
}

.term-mono {
  font-family: "JetBrains Mono", "Fira Code", "Courier New", ui-monospace,
    monospace;
  font-variant-numeric: tabular-nums;
}

.term-accent {
  color: hsla(180, 100%, 70%, 0.85);
}

.term-dim {
  color: hsla(180, 30%, 85%, 0.65);
}

/* Blinking block cursor */
.term-cursor {
  display: inline-block;
  width: 0.6em;
  height: 1em;
  vertical-align: -0.15em;
  margin-left: 2px;
  background: hsla(180, 100%, 70%, 0.85);
  animation: term-blink 1s steps(2, start) infinite;
}

@keyframes term-blink {
  to {
    visibility: hidden;
  }
}

/* Hover row state used by ls-style lists. */
.term-row {
  display: grid;
  grid-template-columns: 4em 12em 10em 1fr;
  gap: 12px;
  padding: 6px 10px;
  border-left: 2px solid transparent;
  cursor: pointer;
  transition: background-color 0.12s ease, border-left-color 0.12s ease;
  text-align: left;
  background: transparent;
  border-top: 0;
  border-right: 0;
  border-bottom: 0;
  color: inherit;
  font: inherit;
  width: 100%;
}

.term-row:hover,
.term-row:focus-visible {
  background-color: hsla(180, 100%, 70%, 0.08);
  border-left-color: hsla(180, 100%, 70%, 0.85);
  outline: none;
}

.term-row[aria-expanded="true"] {
  background-color: hsla(180, 100%, 70%, 0.12);
  border-left-color: hsla(180, 100%, 70%, 0.85);
}

/* Full-screen scanline overlay. Mounted once at the App root. */
.term-scanlines {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  background: repeating-linear-gradient(
    to bottom,
    hsla(180, 100%, 70%, 0.04) 0,
    hsla(180, 100%, 70%, 0.04) 1px,
    transparent 1px,
    transparent 4px
  );
  mix-blend-mode: screen;
}
```

- [ ] **Step 4: Lint + build**

Run: `pnpm lint && pnpm build`
Expected: passes.

- [ ] **Step 5: Manual smoke check**

Run: `pnpm dev`
Open the auto-opened browser tab. Verify:
- Background is still `#0e0f43` with the Zdog rings + stars animating
- Faint horizontal scanlines visible across the screen
- Page text (the existing Quote etc.) now renders in monospace JetBrains Mono

Stop the dev server when done.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(theme): add terminal palette tokens and global glass CSS"
```

---

## Task 3: Build the `terminal/` component library

**Files:**
- Create: `src/components/terminal/GlassPanel.tsx`
- Create: `src/components/terminal/TitleBar.tsx`
- Create: `src/components/terminal/Cursor.tsx`
- Create: `src/components/terminal/Prompt.tsx`
- Create: `src/components/terminal/TypeLine.tsx`
- Create: `src/components/terminal/Chip.tsx`
- Create: `src/components/terminal/index.ts` (barrel)

Each primitive is small and self-contained.

- [ ] **Step 1: Create `Cursor.tsx`**

```tsx
import { FC } from "react";

export const Cursor: FC = () => <span className="term-cursor" aria-hidden />;
```

- [ ] **Step 2: Create `TitleBar.tsx`**

```tsx
import { FC } from "react";
import { Box, Stack } from "@mui/joy";

const dotColors = ["#ff5f57", "#febc2e", "#28c840"] as const;

export const TitleBar: FC<{ label: string }> = ({ label }) => (
  <Stack
    direction="row"
    spacing={1}
    alignItems="center"
    sx={{
      px: 1.5,
      py: 1,
      borderBottom: "1px solid hsla(180,100%,70%,0.25)",
      fontFamily: "inherit",
      fontSize: 12,
      color: "hsla(180, 30%, 85%, 0.7)",
    }}
  >
    <Stack direction="row" spacing={0.75}>
      {dotColors.map((c) => (
        <Box
          key={c}
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: c,
            opacity: 0.85,
          }}
        />
      ))}
    </Stack>
    <Box sx={{ ml: 1, letterSpacing: "0.5px" }}>{label}</Box>
  </Stack>
);
```

- [ ] **Step 3: Create `GlassPanel.tsx`**

```tsx
import { FC, ReactNode } from "react";
import { Box } from "@mui/joy";
import { TitleBar } from "./TitleBar";

export const GlassPanel: FC<{
  title?: string;
  glow?: "none" | "hover" | "active";
  children: ReactNode;
  sx?: object;
}> = ({ title, glow = "hover", children, sx }) => {
  const glowShadow =
    glow === "active"
      ? "0 0 18px hsla(180,100%,70%,0.7)"
      : glow === "hover"
      ? "0 0 12px hsla(180,100%,70%,0.3)"
      : "none";
  return (
    <Box
      className="term-glass term-mono"
      sx={{
        boxShadow: glowShadow,
        overflow: "hidden",
        ...sx,
      }}
    >
      {title && <TitleBar label={title} />}
      <Box sx={{ p: { xs: 2, md: 2.5 } }}>{children}</Box>
    </Box>
  );
};
```

- [ ] **Step 4: Create `Prompt.tsx`**

```tsx
import { FC, ReactNode } from "react";
import { Box, Stack } from "@mui/joy";
import { Cursor } from "./Cursor";

export const Prompt: FC<{
  children: ReactNode;
  showCursor?: boolean;
  symbol?: string;
}> = ({ children, showCursor = false, symbol = "$" }) => (
  <Stack
    direction="row"
    spacing={1}
    alignItems="baseline"
    sx={{ fontFamily: "inherit" }}
  >
    <Box className="term-accent" sx={{ fontWeight: 700 }}>
      {symbol}
    </Box>
    <Box sx={{ flex: 1, wordBreak: "break-word" }}>
      {children}
      {showCursor && <Cursor />}
    </Box>
  </Stack>
);
```

- [ ] **Step 5: Create `TypeLine.tsx`**

A one-shot typewriter for a single line. Resets if its `text` prop changes (so locale switches replay cleanly).

```tsx
import { FC, useEffect, useRef } from "react";
import Typewriter from "typewriter-effect";

export const TypeLine: FC<{
  text: string;
  delay?: number;
  onDone?: () => void;
}> = ({ text, delay = 35, onDone }) => {
  const doneRef = useRef(false);
  useEffect(() => {
    doneRef.current = false;
  }, [text]);
  return (
    <Typewriter
      key={text}
      options={{ delay, cursor: "" }}
      onInit={(tw) => {
        tw.typeString(text)
          .callFunction(() => {
            if (!doneRef.current) {
              doneRef.current = true;
              onDone?.();
            }
          })
          .start();
      }}
    />
  );
};
```

- [ ] **Step 6: Create `Chip.tsx`**

```tsx
import { FC, ReactNode } from "react";
import { Box } from "@mui/joy";

export const Chip: FC<{
  onClick?: () => void;
  active?: boolean;
  children: ReactNode;
}> = ({ onClick, active, children }) => (
  <Box
    component={onClick ? "button" : "span"}
    onClick={onClick}
    sx={{
      display: "inline-flex",
      alignItems: "center",
      px: 1.25,
      py: 0.5,
      border: "1px solid hsla(180,100%,70%,0.45)",
      borderRadius: 1,
      background: active
        ? "hsla(180,100%,70%,0.18)"
        : "hsla(180,100%,70%,0.06)",
      color: "inherit",
      font: "inherit",
      cursor: onClick ? "pointer" : "default",
      transition: "box-shadow .15s, background-color .15s",
      "&:hover": onClick
        ? {
            background: "hsla(180,100%,70%,0.18)",
            boxShadow: "0 0 12px hsla(180,100%,70%,0.5)",
          }
        : undefined,
    }}
  >
    {children}
  </Box>
);
```

- [ ] **Step 7: Create barrel `src/components/terminal/index.ts`**

```ts
export { Chip } from "./Chip";
export { Cursor } from "./Cursor";
export { GlassPanel } from "./GlassPanel";
export { Prompt } from "./Prompt";
export { TitleBar } from "./TitleBar";
export { TypeLine } from "./TypeLine";
```

- [ ] **Step 8: Build**

Run: `pnpm build`
Expected: TS compiles cleanly. (No new usages yet — this just verifies the primitives type-check.)

- [ ] **Step 9: Commit**

```bash
git add src/components/terminal
git commit -m "feat(terminal): add GlassPanel, Prompt, TypeLine, Chip primitives"
```

---

## Task 4: Add `LocationContext` for in-page navigation

**Files:**
- Create: `src/state/locationSlug.ts`
- Create: `src/state/LocationContext.tsx`

A read-the-data-once slug helper produces stable IDs like `01-cornell`, `02-meta-compass`. The provider exposes `path`, `expanded`, and four actions.

- [ ] **Step 1: Create `src/state/locationSlug.ts`**

```ts
import { Education, Experience } from "../models/Categories";

const slugifyName = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);

export const educationSlug = (e: Education, index: number): string =>
  `${String(index + 1).padStart(2, "0")}-${slugifyName(e.School)}`;

export const experienceSlug = (e: Experience, index: number): string =>
  `${String(index + 1).padStart(2, "0")}-${slugifyName(e.Company)}`;
```

- [ ] **Step 2: Create `src/state/LocationContext.tsx`**

```tsx
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type CategoryRoot = "education" | "experience" | "about";

export interface LocationValue {
  path: string; // "~", "~/education", "~/education/01-cornell"
  expanded: Set<string>; // "education/01-cornell"
  goto: (path: string) => void;
  goHome: () => void;
  goUp: () => void;
  toggle: (category: CategoryRoot, slug: string) => void;
  isExpanded: (category: CategoryRoot, slug: string) => boolean;
}

const LocationContext = createContext<LocationValue>({
  path: "~",
  expanded: new Set(),
  goto: () => {},
  goHome: () => {},
  goUp: () => {},
  toggle: () => {},
  isExpanded: () => false,
});

export const LocationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string>("~");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const goto = useCallback((p: string) => setPath(p), []);
  const goHome = useCallback(() => {
    setPath("~");
    setExpanded(new Set());
  }, []);
  const goUp = useCallback(() => {
    setPath((p) => {
      if (p === "~") return p;
      const parts = p.split("/");
      parts.pop();
      const next = parts.join("/") || "~";
      // Collapse rows that are no longer below the current path.
      setExpanded((prev) => {
        const trimmed = new Set<string>();
        prev.forEach((id) => {
          if (next === "~" || `~/${id}`.startsWith(next + "/") || `~/${id}` === next) {
            // keep nothing above the new path
          } else {
            trimmed.add(id);
          }
        });
        return trimmed;
      });
      return next;
    });
  }, []);
  const toggle = useCallback(
    (category: CategoryRoot, slug: string) => {
      const id = `${category}/${slug}`;
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
          setPath(`~/${id}`);
        }
        return next;
      });
    },
    [],
  );
  const isExpanded = useCallback(
    (category: CategoryRoot, slug: string) =>
      expanded.has(`${category}/${slug}`),
    [expanded],
  );

  const value = useMemo<LocationValue>(
    () => ({ path, expanded, goto, goHome, goUp, toggle, isExpanded }),
    [path, expanded, goto, goHome, goUp, toggle, isExpanded],
  );

  return (
    <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
  );
};

export const useLocation = (): LocationValue => useContext(LocationContext);
```

- [ ] **Step 3: Build**

Run: `pnpm build`
Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add src/state
git commit -m "feat(state): add LocationContext for in-page path + expansion"
```

---

## Task 5: Build `Breadcrumb` component

**Files:**
- Create: `src/components/terminal/Breadcrumb.tsx`
- Modify: `src/components/terminal/index.ts` (export it)

- [ ] **Step 1: Create `Breadcrumb.tsx`**

```tsx
import { FC, Fragment } from "react";
import { Box, Stack } from "@mui/joy";
import { useLocation } from "../../state/LocationContext";

export const Breadcrumb: FC = () => {
  const { path, goto, goHome } = useLocation();
  const segments = path === "~" ? [] : path.replace(/^~\//, "").split("/");

  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{
        fontFamily: "inherit",
        fontSize: 13,
        color: "hsla(180,30%,85%,0.7)",
        flexWrap: "wrap",
      }}
    >
      <Box component="span" className="term-accent">
        jesse@portfolio
      </Box>
      <Box component="span">:</Box>
      <Box
        component="button"
        onClick={goHome}
        sx={{
          background: "none",
          border: 0,
          color: "inherit",
          font: "inherit",
          cursor: "pointer",
          p: 0,
          "&:hover": { color: "hsla(180,100%,80%,1)" },
        }}
      >
        ~
      </Box>
      {segments.map((seg, i) => {
        const target = "~/" + segments.slice(0, i + 1).join("/");
        const isLast = i === segments.length - 1;
        return (
          <Fragment key={target}>
            <Box component="span">/</Box>
            <Box
              component={isLast ? "span" : "button"}
              onClick={isLast ? undefined : () => goto(target)}
              sx={{
                background: "none",
                border: 0,
                color: isLast ? "hsla(180,100%,80%,1)" : "inherit",
                font: "inherit",
                cursor: isLast ? "default" : "pointer",
                p: 0,
                "&:hover": isLast
                  ? undefined
                  : { color: "hsla(180,100%,80%,1)" },
              }}
            >
              {seg}
            </Box>
          </Fragment>
        );
      })}
      <Box component="span" className="term-accent" sx={{ ml: 0.5 }}>
        $
      </Box>
    </Stack>
  );
};
```

- [ ] **Step 2: Add to barrel**

Append to `src/components/terminal/index.ts`:

```ts
export { Breadcrumb } from "./Breadcrumb";
```

- [ ] **Step 3: Build**

Run: `pnpm build`
Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add src/components/terminal
git commit -m "feat(terminal): add Breadcrumb with clickable segments"
```

---

## Task 6: Wire `LocationProvider` + scanline overlay into `App`

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

Remove the redundant outer `<CssVarsProvider>` in `main.tsx`. Set Joy `defaultMode="dark"`. Wrap `<Home/>` in `<LocationProvider>`. Add the scanline overlay element.

- [ ] **Step 1: Replace `src/main.tsx`**

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

- [ ] **Step 2: Replace `src/App.tsx`**

```tsx
import {
  CssBaseline,
  CssVarsProvider as JoyCssVarsProvider,
  extendTheme,
} from "@mui/joy";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { Footer } from "./components/Footer";
import { Home } from "./components/Home";
import { Navigation } from "./components/Navigation";
import { PortfolioProvider } from "./components/PortfolioProvider";
import { LocationProvider } from "./state/LocationContext";
import { fontStack } from "./theme/terminal";

const materialTheme = materialExtendTheme();

export const App: FC = () => {
  const THEME = extendTheme({
    components: {
      JoyButton: {
        styleOverrides: {
          root: () => ({ fontFamily: fontStack }),
        },
      },
      JoyTypography: {
        styleOverrides: {
          root: () => ({ fontFamily: fontStack }),
        },
      },
    },
  });

  return (
    <MaterialCssVarsProvider
      defaultMode="dark"
      theme={{ [MATERIAL_THEME_ID]: materialTheme }}
    >
      <JoyCssVarsProvider defaultMode="dark" theme={THEME}>
        <canvas className="canvas"></canvas>
        <CssBaseline />
        <Outlet />
        <PortfolioProvider>
          <LocationProvider>
            <Navigation />
            <Home />
          </LocationProvider>
        </PortfolioProvider>
        <Footer />
        <div className="term-scanlines" aria-hidden />
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
};
```

- [ ] **Step 3: Lint + build**

Run: `pnpm lint && pnpm build`
Expected: passes.

- [ ] **Step 4: Smoke check**

Run: `pnpm dev`. Verify the page still loads (no React errors), Zdog animates, scanlines visible. (Content still old — Home not yet rewired. That's expected.)

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/main.tsx
git commit -m "feat(app): mount LocationProvider and scanline overlay; drop duplicate CssVarsProvider"
```

---

## Task 7: Rewrite `Navigation` as `[ EN | 中 ]` toggle

**Files:**
- Modify: `src/components/Navigation.tsx`

- [ ] **Step 1: Replace contents**

```tsx
import { FC, useContext } from "react";
import { Box, Stack } from "@mui/joy";
import { PortfolioContext } from "./PortfolioContext";

export const Navigation: FC = () => {
  const { $locale, onLocaleChange } = useContext(PortfolioContext);
  const Item: FC<{ value: "en-US" | "zh-CN"; label: string }> = ({
    value,
    label,
  }) => {
    const active = $locale === value;
    return (
      <Box
        component="button"
        onClick={() => onLocaleChange(value)}
        sx={{
          background: "none",
          border: 0,
          padding: 0,
          font: "inherit",
          cursor: "pointer",
          color: active ? "hsla(180,100%,80%,1)" : "hsla(180,30%,85%,0.55)",
          fontWeight: active ? 700 : 400,
          "&:hover": { color: "hsla(180,100%,80%,1)" },
        }}
      >
        {label}
      </Box>
    );
  };
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      className="term-glass term-mono"
      sx={{
        position: "fixed",
        top: 12,
        right: 12,
        zIndex: 10,
        px: 1.5,
        py: 0.5,
        fontSize: 13,
      }}
    >
      <Box component="span" sx={{ color: "hsla(180,30%,85%,0.55)" }}>
        [
      </Box>
      <Item value="en-US" label="EN" />
      <Box component="span" sx={{ color: "hsla(180,30%,85%,0.55)" }}>
        |
      </Box>
      <Item value="zh-CN" label="中" />
      <Box component="span" sx={{ color: "hsla(180,30%,85%,0.55)" }}>
        ]
      </Box>
    </Stack>
  );
};
```

- [ ] **Step 2: Build**

Run: `pnpm build`
Expected: passes.

- [ ] **Step 3: Smoke check**

Run: `pnpm dev`. Click `EN`/`中`; expect colors to flip and content language to change.

- [ ] **Step 4: Commit**

```bash
git add src/components/Navigation.tsx
git commit -m "feat(navigation): terminal-style [ EN | 中 ] language toggle"
```

---

## Task 8: Rewrite `Footer` as a flow-layout terminal comment

**Files:**
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Replace contents**

```tsx
import { Box } from "@mui/joy";
import { FC } from "react";

export const Footer: FC = () => (
  <Box
    component="footer"
    sx={{
      width: "100%",
      textAlign: "center",
      py: 2,
      mt: 4,
      fontSize: 12,
      fontStyle: "italic",
      color: "hsla(180,30%,85%,0.55)",
      fontFamily: "inherit",
    }}
  >
    {`// © 2018-${new Date().getFullYear()} Jesse Liu  ::  built with Vite + zdog`}
  </Box>
);
```

- [ ] **Step 2: Build**

Run: `pnpm build`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat(footer): flow-layout terminal comment footer"
```

---

## Task 9: Rewrite `Home` landing sequence

**Files:**
- Modify: `src/components/Home.tsx`
- Modify: `src/components/HomeNavigation.tsx` (now the path-driven router)

Home becomes a single glass terminal panel that:
- Mounts the Zdog canvas (existing `StarAndPlanet()` call kept)
- Holds a `Breadcrumb` at the top
- Renders staged landing sequence (whoami / cat motto / ls categories) when path is `~`
- Otherwise delegates to `HomeNavigation` which routes by path

We also fold the existing `Quote.tsx` lines into the landing sequence so the old `Quote` component is no longer rendered; the file is left in place but unused for now and will be removed in Task 13.

- [ ] **Step 1: Replace `src/components/Home.tsx`**

```tsx
import { FC, useContext, useEffect, useState } from "react";
import { Box, Stack } from "@mui/joy";
import { StarAndPlanet } from "./canvas/StarAndPlanet";
import { GlassPanel, Prompt, TypeLine, Chip, Breadcrumb } from "./terminal";
import { useLocation } from "../state/LocationContext";
import { HomeNavigation } from "./HomeNavigation";
import { PortfolioContext } from "./PortfolioContext";

type Stage = 0 | 1 | 2 | 3 | 4;

export const Home: FC = () => {
  useEffect(() => {
    StarAndPlanet();
  }, []);

  const { path, goto } = useLocation();
  const { $locale } = useContext(PortfolioContext);
  const [stage, setStage] = useState<Stage>(0);

  // Reset the landing sequence whenever we come back home or switch locale.
  useEffect(() => {
    if (path === "~") setStage(0);
  }, [path, $locale]);

  const cn = $locale === "zh-CN";
  const intro = cn
    ? "Jesse Liu — 全栈开发, 康奈尔大学计算机硕士"
    : "Jesse Liu — full-stack developer, CS MEng @ Cornell";
  const motto1 = cn
    ? "永远不要让自己止步."
    : "Never hold yourself back.";
  const motto2 = cn
    ? "走自己的路, 享受这段旅程."
    : "Follow the path, enjoy the journey.";
  const categories: { key: string; label: string; target: string; external?: string }[] = [
    { key: "education", label: cn ? "education/" : "education/", target: "~/education" },
    { key: "experience", label: "experience/", target: "~/experience" },
    { key: "blog", label: "blog/", target: "", external: "https://blog.jesseliu.me" },
    { key: "about", label: "about/", target: "~/about" },
  ];

  return (
    <Stack
      spacing={3}
      sx={{
        width: { xs: "92%", md: "80%", lg: "70%" },
        my: { xs: 4, md: 6 },
        position: "relative",
        zIndex: 1,
      }}
    >
      <GlassPanel title={`~/jesse — zsh`} glow="active">
        <Stack spacing={1.5}>
          <Breadcrumb />

          {path === "~" ? (
            <Stack spacing={1.2} sx={{ mt: 1 }}>
              {/* Stage 0: whoami */}
              <Prompt>
                <TypeLine
                  text="whoami"
                  onDone={() => setStage((s) => (s < 1 ? 1 : s))}
                />
              </Prompt>
              {stage >= 1 && (
                <Prompt symbol=">">
                  <TypeLine text={intro} onDone={() => setStage((s) => (s < 2 ? 2 : s))} />
                </Prompt>
              )}

              {stage >= 2 && (
                <Prompt>
                  <TypeLine
                    text="cat motto.txt"
                    onDone={() => setStage((s) => (s < 3 ? 3 : s))}
                  />
                </Prompt>
              )}
              {stage >= 3 && (
                <>
                  <Prompt symbol=">"><Box sx={{ color: "aqua" }}>{motto1}</Box></Prompt>
                  <Prompt symbol=">">
                    <Box>{motto2}</Box>
                  </Prompt>
                  <Prompt>
                    <TypeLine
                      text="ls categories/"
                      onDone={() => setStage((s) => (s < 4 ? 4 : s))}
                    />
                  </Prompt>
                </>
              )}
              {stage >= 4 && (
                <Stack direction="row" spacing={1.2} flexWrap="wrap" sx={{ pt: 0.5 }}>
                  {categories.map((c) => (
                    <Chip
                      key={c.key}
                      onClick={() =>
                        c.external
                          ? (window.location.href = c.external)
                          : goto(c.target)
                      }
                    >
                      [{c.label}]
                    </Chip>
                  ))}
                </Stack>
              )}
              <Prompt showCursor>
                <span />
              </Prompt>
            </Stack>
          ) : (
            <Box sx={{ mt: 1 }}>
              <HomeNavigation />
            </Box>
          )}
        </Stack>
      </GlassPanel>
    </Stack>
  );
};
```

- [ ] **Step 2: Rewrite `src/components/HomeNavigation.tsx`**

```tsx
import { FC, useContext } from "react";
import { PortfolioContext } from "./PortfolioContext";
import { useLocation } from "../state/LocationContext";
import { EducationView } from "./categories/EducationView";
import { ExperienceView } from "./categories/ExperienceView";
import { AboutMeView } from "./categories/AboutMeView/AboutMeView";

export const HomeNavigation: FC = () => {
  const { data, $locale } = useContext(PortfolioContext);
  const { path } = useLocation();
  const root = path.split("/")[1]; // "education" | "experience" | "about" | undefined

  if (root === "education")
    return <EducationView responseEducation={data[$locale].education} />;
  if (root === "experience")
    return <ExperienceView responseExperience={data[$locale].experience} />;
  if (root === "about")
    return <AboutMeView introduction={data[$locale].introduction} />;
  return null;
};
```

- [ ] **Step 3: Lint + build**

Run: `pnpm lint && pnpm build`
Expected: passes.

- [ ] **Step 4: Smoke check**

Run `pnpm dev`. Verify:
- Landing panel appears with title bar and breadcrumb `jesse@portfolio:~$`
- Lines type in order: whoami → name → cat motto.txt → motto lines → ls categories/
- Four chips appear; clicking `[education/]` updates the breadcrumb and reveals the existing (still un-restyled) education list
- Clicking `~` in the breadcrumb resets to the landing sequence

- [ ] **Step 5: Commit**

```bash
git add src/components/Home.tsx src/components/HomeNavigation.tsx
git commit -m "feat(home): glass terminal landing with staged whoami/ls sequence"
```

---

## Task 10: Restyle `EducationView` as `ls + cd` interaction

**Files:**
- Modify: `src/components/categories/EducationView.tsx`
- Create: `src/components/categories/EducationRow.tsx`
- Create: `src/components/categories/EducationDetail.tsx`

- [ ] **Step 1: Create `EducationDetail.tsx`**

```tsx
import { FC } from "react";
import { Box, Stack } from "@mui/joy";
import { Education } from "../../models/Categories";
import { GlassPanel } from "../terminal";

const KV: FC<{ k: string; v: string }> = ({ k, v }) => (
  <Box sx={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 1 }}>
    <Box className="term-accent">{k}</Box>
    <Box>{v}</Box>
  </Box>
);

export const EducationDetail: FC<{ data: Education; slug: string }> = ({
  data,
  slug,
}) => (
  <GlassPanel title={`$ cat ${slug}/info.md`} glow="hover">
    <Stack direction={{ xs: "column", md: "row" }} spacing={2.5} alignItems="flex-start">
      {data.Image && (
        <Box
          component="img"
          src={data.Image}
          alt={data.School}
          loading="lazy"
          sx={{
            width: 120,
            height: 120,
            objectFit: "contain",
            border: "1px solid hsla(180,100%,70%,0.4)",
            borderRadius: 1,
            p: 1,
            background: "hsla(180,100%,70%,0.05)",
          }}
        />
      )}
      <Stack spacing={0.6} sx={{ flex: 1 }}>
        <KV k="School:" v={data.School} />
        <KV k="Major:" v={data.Major} />
        <KV k="GPA:" v={data.Grade} />
        <KV k="Period:" v={`${data.StartDate} – ${data.EndDate}`} />
        <KV k="Location:" v={data.Location} />
        <KV k="Moto:" v={`"${data.Moto}"`} />
        <Box sx={{ pt: 1, fontStyle: "italic", color: "hsla(180,30%,85%,0.75)" }}>
          {data.Description}
        </Box>
      </Stack>
    </Stack>
  </GlassPanel>
);
```

- [ ] **Step 2: Create `EducationRow.tsx`**

```tsx
import { FC } from "react";
import { Box } from "@mui/joy";
import { Education } from "../../models/Categories";

export const EducationRow: FC<{
  data: Education;
  slug: string;
  expanded: boolean;
  onToggle: () => void;
}> = ({ data, slug, expanded, onToggle }) => (
  <Box
    component="button"
    className="term-row term-mono"
    aria-expanded={expanded}
    onClick={onToggle}
  >
    <Box className="term-accent">drwx</Box>
    <Box>{slug}</Box>
    <Box className="term-dim">
      {data.StartDate} - {data.EndDate}
    </Box>
    <Box>{data.School}</Box>
  </Box>
);
```

- [ ] **Step 3: Replace `EducationView.tsx`**

```tsx
import { FC, Fragment } from "react";
import { Box, Stack } from "@mui/joy";
import { Education } from "../../models/Categories";
import { GlassPanel, Prompt } from "../terminal";
import { useLocation } from "../../state/LocationContext";
import { educationSlug } from "../../state/locationSlug";
import { EducationRow } from "./EducationRow";
import { EducationDetail } from "./EducationDetail";

export const EducationView: FC<{ responseEducation: Education[] }> = ({
  responseEducation,
}) => {
  const { toggle, isExpanded } = useLocation();
  return (
    <Stack spacing={2}>
      <GlassPanel glow="hover">
        <Prompt>
          <Box component="span">ls -la education/</Box>
        </Prompt>
        <Box sx={{ mt: 1 }}>
          {responseEducation.map((e, i) => {
            const slug = educationSlug(e, i);
            const open = isExpanded("education", slug);
            return (
              <Fragment key={slug}>
                <EducationRow
                  data={e}
                  slug={slug}
                  expanded={open}
                  onToggle={() => toggle("education", slug)}
                />
                {open && (
                  <Box sx={{ pl: { xs: 1, md: 3 }, py: 1 }}>
                    <EducationDetail data={e} slug={slug} />
                  </Box>
                )}
              </Fragment>
            );
          })}
        </Box>
      </GlassPanel>
    </Stack>
  );
};
```

- [ ] **Step 4: Lint + build**

Run: `pnpm lint && pnpm build`
Expected: passes.

- [ ] **Step 5: Smoke check**

Run `pnpm dev`. From landing, click `[education/]`. Verify:
- `$ ls -la education/` line, four rows
- Hovering a row highlights its background and left bar in aqua
- Clicking a row expands the detail panel beneath it
- Clicking again collapses it
- Multiple rows can be open at once

- [ ] **Step 6: Commit**

```bash
git add src/components/categories/EducationView.tsx src/components/categories/EducationRow.tsx src/components/categories/EducationDetail.tsx
git commit -m "feat(education): ls-style list with in-place glass detail expansion"
```

---

## Task 11: Restyle `ExperienceView` (parallel to Education)

**Files:**
- Modify: `src/components/categories/ExperienceView.tsx`
- Create: `src/components/categories/ExperienceRow.tsx`
- Create: `src/components/categories/ExperienceDetail.tsx`

- [ ] **Step 1: Create `ExperienceRow.tsx`**

```tsx
import { FC } from "react";
import { Box } from "@mui/joy";
import { Experience } from "../../models/Categories";

export const ExperienceRow: FC<{
  data: Experience;
  slug: string;
  expanded: boolean;
  onToggle: () => void;
}> = ({ data, slug, expanded, onToggle }) => (
  <Box
    component="button"
    className="term-row term-mono"
    aria-expanded={expanded}
    onClick={onToggle}
  >
    <Box className="term-accent">drwx</Box>
    <Box>{slug}</Box>
    <Box className="term-dim">
      {data.StartDate} - {data.EndDate}
    </Box>
    <Box>
      {data.Company} {data.Title ? <span>· {data.Title}</span> : null}
    </Box>
  </Box>
);
```

- [ ] **Step 2: Create `ExperienceDetail.tsx`**

```tsx
import { FC } from "react";
import { Box, Stack } from "@mui/joy";
import { Experience } from "../../models/Categories";
import { GlassPanel, Chip } from "../terminal";
import { DescriptionModal } from "../DescriptionModal";

const KV: FC<{ k: string; v: string }> = ({ k, v }) => (
  <Box sx={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 1 }}>
    <Box className="term-accent">{k}</Box>
    <Box>{v}</Box>
  </Box>
);

export const ExperienceDetail: FC<{ data: Experience; slug: string }> = ({
  data,
  slug,
}) => (
  <GlassPanel title={`$ cat ${slug}/info.md`} glow="hover">
    <Stack direction={{ xs: "column", md: "row" }} spacing={2.5} alignItems="flex-start">
      {data.Image && (
        <Box
          component="img"
          src={data.Image}
          alt={data.Company}
          loading="lazy"
          sx={{
            width: 120,
            height: 120,
            objectFit: "contain",
            border: "1px solid hsla(180,100%,70%,0.4)",
            borderRadius: 1,
            p: 1,
            background: "hsla(180,100%,70%,0.05)",
          }}
        />
      )}
      <Stack spacing={0.6} sx={{ flex: 1 }}>
        <KV k="Company:" v={data.Company} />
        <KV k="Title:" v={data.Title} />
        <KV k="Period:" v={`${data.StartDate} – ${data.EndDate}`} />
        <KV k="Location:" v={data.Location} />
        {data.Description && (
          <Box sx={{ pt: 1 }}>{data.Description}</Box>
        )}
        <Stack direction="row" spacing={1} sx={{ pt: 1, flexWrap: "wrap" }}>
          <DescriptionModal brief={data.Brief} link={data.Link} />
          {data.Link && (
            <Chip onClick={() => window.open(data.Link, "_blank")}>
              $ open {data.Link}
            </Chip>
          )}
        </Stack>
      </Stack>
    </Stack>
  </GlassPanel>
);
```

- [ ] **Step 3: Replace `ExperienceView.tsx`**

```tsx
import { FC, Fragment } from "react";
import { Box, Stack } from "@mui/joy";
import { Experience } from "../../models/Categories";
import { GlassPanel, Prompt } from "../terminal";
import { useLocation } from "../../state/LocationContext";
import { experienceSlug } from "../../state/locationSlug";
import { ExperienceRow } from "./ExperienceRow";
import { ExperienceDetail } from "./ExperienceDetail";

export const ExperienceView: FC<{ responseExperience: Experience[] }> = ({
  responseExperience,
}) => {
  const { toggle, isExpanded } = useLocation();
  return (
    <Stack spacing={2}>
      <GlassPanel glow="hover">
        <Prompt>
          <Box component="span">ls -la experience/</Box>
        </Prompt>
        <Box sx={{ mt: 1 }}>
          {responseExperience.map((e, i) => {
            const slug = experienceSlug(e, i);
            const open = isExpanded("experience", slug);
            return (
              <Fragment key={slug}>
                <ExperienceRow
                  data={e}
                  slug={slug}
                  expanded={open}
                  onToggle={() => toggle("experience", slug)}
                />
                {open && (
                  <Box sx={{ pl: { xs: 1, md: 3 }, py: 1 }}>
                    <ExperienceDetail data={e} slug={slug} />
                  </Box>
                )}
              </Fragment>
            );
          })}
        </Box>
      </GlassPanel>
    </Stack>
  );
};
```

- [ ] **Step 4: Lint + build**

Run: `pnpm lint && pnpm build`
Expected: passes.

- [ ] **Step 5: Smoke check**

Same as Task 10 but on `[experience/]`. Confirm the `$ open <url>` chip launches the link in a new tab and the `View Details` modal still opens.

- [ ] **Step 6: Commit**

```bash
git add src/components/categories/ExperienceView.tsx src/components/categories/ExperienceRow.tsx src/components/categories/ExperienceDetail.tsx
git commit -m "feat(experience): ls-style list with in-place glass detail expansion"
```

---

## Task 12: Restyle `DescriptionModal` and the `AboutMe` view

**Files:**
- Modify: `src/components/DescriptionModal.tsx`
- Modify: `src/components/categories/AboutMeView/AboutMeView.tsx`
- Modify: `src/components/categories/AboutMeView/SocialMedialButtons.tsx`
- Modify: `src/components/categories/AboutMeView/WechatDialog.tsx`

- [ ] **Step 1: Replace `DescriptionModal.tsx`**

```tsx
import { FC, useState } from "react";
import { Modal, ModalClose, ModalDialog } from "@mui/joy";
import { Box, Stack } from "@mui/joy";
import { Chip, GlassPanel } from "./terminal";

export const DescriptionModal: FC<{
  brief: Map<string, string[]>;
  link?: string;
}> = ({ brief, link }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {brief && brief.size > 0 && (
        <Chip onClick={() => setOpen(true)}>$ less brief.md</Chip>
      )}
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          variant="plain"
          sx={{
            p: 0,
            background: "transparent",
            border: "none",
            boxShadow: "none",
            maxWidth: "min(720px, 92vw)",
            width: "100%",
          }}
        >
          <GlassPanel title="$ less brief.md" glow="active">
            <ModalClose sx={{ color: "inherit" }} />
            <Stack spacing={2}>
              {Array.from(brief).map(([heading, bullets], i) => (
                <Stack key={i} spacing={0.5}>
                  <Box className="term-accent" sx={{ fontWeight: 700 }}>
                    ▸ {heading}
                  </Box>
                  {bullets.map((b, j) => (
                    <Box key={j} sx={{ pl: 2 }}>
                      - {b}
                    </Box>
                  ))}
                </Stack>
              ))}
              {link && (
                <Box sx={{ pt: 1 }}>
                  <Chip onClick={() => window.open(link, "_blank")}>
                    $ open {link}
                  </Chip>
                </Box>
              )}
            </Stack>
          </GlassPanel>
        </ModalDialog>
      </Modal>
    </>
  );
};
```

- [ ] **Step 2: Replace `AboutMeView.tsx`**

```tsx
import { FC } from "react";
import { Box, Stack } from "@mui/joy";
import { Introduction } from "../../../models/Categories";
import { GlassPanel, Prompt } from "../../terminal";
import SocialMediaButtons from "./SocialMedialButtons";

export const AboutMeView: FC<{ introduction: Introduction }> = ({
  introduction,
}) => (
  <Stack spacing={2}>
    <GlassPanel glow="hover">
      <Prompt>
        <Box component="span">cat profile.txt</Box>
      </Prompt>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2.5}
        sx={{ mt: 1.5 }}
        alignItems="flex-start"
      >
        <Box
          component="img"
          src="./Jesse.png"
          alt="Jesse"
          loading="lazy"
          sx={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            objectFit: "cover",
            border: "1px solid hsla(180,100%,70%,0.5)",
            boxShadow: "0 0 14px hsla(180,100%,70%,0.35)",
          }}
        />
        <Stack spacing={0.6} sx={{ flex: 1 }}>
          <Box className="term-accent">{introduction.adderess}</Box>
          <Box>{introduction.line1}</Box>
          <Box sx={{ color: "hsla(180,30%,85%,0.85)" }}>
            {introduction.parapraph}
          </Box>
        </Stack>
      </Stack>
      <Box sx={{ mt: 2.5 }}>
        <Prompt>
          <Box component="span">contact --list</Box>
        </Prompt>
        <Box sx={{ mt: 1 }}>
          <SocialMediaButtons />
        </Box>
      </Box>
    </GlassPanel>
  </Stack>
);
```

- [ ] **Step 3: Replace `SocialMedialButtons.tsx`**

```tsx
import { FC, useState } from "react";
import { Box, Stack } from "@mui/joy";
import WechatDialog from "./WechatDialog";

interface Row {
  tag: string;
  display: string;
  href?: string;
  onClick?: () => void;
}

const SocialMediaButtons: FC = () => {
  const [wechatOpen, setWechatOpen] = useState(false);
  const rows: Row[] = [
    { tag: "@", display: "mailto:zl942@cornell.edu", href: "mailto:zl942@cornell.edu" },
    { tag: "gh", display: "github.com/Jesse1211", href: "https://www.github.com/Jesse1211" },
    {
      tag: "in",
      display: "linkedin.com/in/jesse-liu-0613201b4",
      href: "https://www.linkedin.com/in/jesse-liu-0613201b4/",
    },
    { tag: "ig", display: "instagram.com/zhl_lzh", href: "https://www.instagram.com/zhl_lzh/" },
    { tag: "wx", display: "wechat (qr) →", onClick: () => setWechatOpen(true) },
  ];
  return (
    <>
      <Stack spacing={0.4}>
        {rows.map((r) => (
          <Box
            key={r.tag}
            component={r.href ? "a" : "button"}
            href={r.href}
            target={r.href ? "_blank" : undefined}
            rel={r.href ? "noopener noreferrer" : undefined}
            onClick={r.onClick}
            sx={{
              display: "inline-grid",
              gridTemplateColumns: "3em 1fr",
              gap: 1,
              alignItems: "baseline",
              background: "none",
              border: 0,
              p: "4px 6px",
              color: "inherit",
              font: "inherit",
              textDecoration: "none",
              cursor: "pointer",
              borderRadius: 0.5,
              transition: "background-color .12s, color .12s",
              "&:hover": {
                background: "hsla(180,100%,70%,0.08)",
                color: "hsla(180,100%,80%,1)",
              },
            }}
          >
            <Box className="term-accent">[{r.tag}]</Box>
            <Box>{r.display}</Box>
          </Box>
        ))}
      </Stack>
      <WechatDialog open={wechatOpen} onClose={() => setWechatOpen(false)} />
    </>
  );
};

export default SocialMediaButtons;
```

- [ ] **Step 4: Replace `WechatDialog.tsx`**

```tsx
import { FC } from "react";
import { Box, Modal, ModalClose, ModalDialog } from "@mui/joy";
import { GlassPanel } from "../../terminal";

interface Props {
  open: boolean;
  onClose: () => void;
}

const WechatDialog: FC<Props> = ({ open, onClose }) => (
  <Modal open={open} onClose={onClose}>
    <ModalDialog
      variant="plain"
      sx={{
        p: 0,
        background: "transparent",
        border: "none",
        boxShadow: "none",
        maxWidth: "min(360px, 92vw)",
      }}
    >
      <GlassPanel title="$ qrcode wechat.png" glow="active">
        <ModalClose sx={{ color: "inherit" }} />
        <Box sx={{ textAlign: "center", py: 1 }}>
          <Box className="term-accent" sx={{ mb: 1, letterSpacing: "2px" }}>
            SCAN TO ADD ME
          </Box>
          <Box
            component="img"
            src="Wechat.jpg"
            alt="Wechat QR Code"
            sx={{
              width: "100%",
              maxWidth: 240,
              borderRadius: 1,
              border: "1px solid hsla(180,100%,70%,0.4)",
            }}
          />
        </Box>
      </GlassPanel>
    </ModalDialog>
  </Modal>
);

export default WechatDialog;
```

- [ ] **Step 5: Lint + build**

Run: `pnpm lint && pnpm build`
Expected: passes.

- [ ] **Step 6: Smoke check**

Run `pnpm dev`. Visit `[about/]`, verify:
- Avatar + intro text render in glass panel
- 5 contact rows, hover highlight
- `[wx]` opens the glass Wechat modal with QR
- From experience, `$ less brief.md` opens the new glass modal with `▸ headings` and `- bullets`

- [ ] **Step 7: Commit**

```bash
git add src/components/DescriptionModal.tsx src/components/categories/AboutMeView
git commit -m "feat(modals,about): glass-terminal DescriptionModal, AboutMe, Wechat"
```

---

## Task 13: Remove unused `Quote.tsx`, retire `CardContainer.tsx`, and fix `styles.ts`

**Files:**
- Delete: `src/components/Quote.tsx` (its content moved into the landing sequence)
- Delete: `src/components/categories/CardContainer.tsx` (no longer rendered)
- Modify: `src/styles.ts` (the old `cardStyles` / `stackStyles` are dead — remove the file or replace with an empty export)

- [ ] **Step 1: Verify no references**

Run:
```bash
grep -rE "from \"(\.\./)*(Quote|categories/CardContainer)\"|from \"\.\./\.\./styles\"|from \"\.\./styles\"" src
```
Expected: no results (everything in Tasks 9-12 should have removed them). If anything still references them, fix the caller first.

- [ ] **Step 2: Delete**

```bash
git rm src/components/Quote.tsx src/components/categories/CardContainer.tsx src/styles.ts
```

- [ ] **Step 3: Lint + build**

Run: `pnpm lint && pnpm build`
Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: drop superseded Quote, CardContainer, styles.ts"
```

---

## Task 14: Final verification

**Files:** none

- [ ] **Step 1: Full lint**

Run: `pnpm lint`
Expected: passes (warnings ≤ baseline from Task 0).

- [ ] **Step 2: Full build**

Run: `pnpm build`
Expected: produces `dist/` with no TS errors.

- [ ] **Step 3: Smoke check the full acceptance list**

Run `pnpm dev`. Walk through the spec's §11 checklist:

- Zdog stars and rings still animate
- Landing sequence runs in order, ending with the four chips
- Clicking each chip routes to the correct panel; URL stays the same (no router)
- Education list expands rows in place, multiple at once
- Experience list does the same; `$ less brief.md` opens the modal; `$ open <url>` chip launches the link
- About panel shows avatar, intro, contact list, `[wx]` opens QR modal
- Breadcrumb segments are clickable; `~` resets the landing
- `[ EN | 中 ]` toggle flips locale; landing sequence replays
- Scanlines visible across the screen
- Footer at document bottom (flow), not overlapping content
- Browser console has no errors

If any item fails, fix it and re-run lint+build before the final commit.

- [ ] **Step 4: Optional final tidy commit**

Only commit if there were follow-up fixes in Step 3:

```bash
git add -A
git commit -m "fix: post-redesign smoke check tidy-ups"
```

- [ ] **Step 5: Summarize the branch**

Run: `git log --oneline main..HEAD`
Expected: a series of focused commits matching the tasks above. Report the count and a one-line summary back to the user.

---

## Open follow-ups (out of scope, surfaced for future work)

- Real router with shareable URLs (`/education/01-cornell`) — would require remounting decisions for the Zdog canvas.
- Mobile-specific tighter spacing audit.
- Data-file typo cleanup (`adderess`, `parapraph`, `Infroamtion`).
- Localising the English-only landing motto / kv labels for `zh-CN`.
