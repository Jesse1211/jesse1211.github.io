# Minimize / Restore Scale Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Animate the terminal shrinking to center on minimize and growing back from center on restore, instead of the current instant swap.

**Architecture:** Add a transient `animState` to `Home.tsx` alongside the existing `windowState`. The terminal Stack stays mounted during the ~400ms transition with a `scale()`/`opacity` transform; the real unmount/mount is deferred to `onTransitionEnd`. The dock mirrors the transform on its own enter/exit. Pure CSS transitions — no GSAP. Reduced-motion skips the dance.

**Tech Stack:** React 18 + TypeScript, MUI Joy `sx`, CSS transforms.

## Global Constraints

- Package manager is `pnpm`. Verification = `pnpm lint && pnpm build` (no tests in repo). `pnpm lint` runs `--max-warnings 0` — warnings fail.
- Terminal styling goes in `sx`, not CSS classes (Joy `<Box>` overrides class `background`).
- Honor `prefers-reduced-motion: reduce` — skip animation, switch state synchronously.
- All changes are in `src/components/Home.tsx`. `GlassPanel`, `TitleBar`, history/reveal logic stay untouched.

---

### Task 1: Animate minimize + restore with a transient anim state

**Files:**
- Modify: `src/components/Home.tsx`

**Interfaces:**
- Consumes: existing `windowState: "normal" | "minimized" | "fullscreen"` state and its setter; existing `handleMinimize`/`handleRestore`/`handleFullscreen`; `stackSx` object; `TerminalDock` component.
- Produces: no new exports. Internal additions: `AnimState` type, `animState` state, a `reducedMotion` boolean, a `useLayoutEffect` that drives the enter transition, and an `onTransitionEnd` handler on the Stack.

- [ ] **Step 1: Add the AnimState type and reduced-motion helper**

Below the existing `type WindowState = ...` line (Home.tsx:39), add:

```ts
type AnimState = "idle" | "minimizing" | "restoring";

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

const MINIMIZE_SCALE = 0.05;
const ANIM_MS = 400;
```

- [ ] **Step 2: Add anim state and rewrite the window handlers**

Replace the existing handler block (Home.tsx:101-104):

```ts
  const handleMinimize = () => setWindowState("minimized");
  const handleFullscreen = () =>
    setWindowState((s) => (s === "fullscreen" ? "normal" : "fullscreen"));
  const handleRestore = () => setWindowState("normal");
```

with:

```ts
  const [animState, setAnimState] = useState<AnimState>("idle");
  const reducedMotion = prefersReducedMotion();

  const handleMinimize = () => {
    if (reducedMotion) {
      setWindowState("minimized");
      return;
    }
    // Keep the terminal mounted and shrink it; the real unmount happens
    // in onTransitionEnd once the scale-down finishes.
    setAnimState("minimizing");
  };

  const handleFullscreen = () =>
    setWindowState((s) => (s === "fullscreen" ? "normal" : "fullscreen"));

  const handleRestore = () => {
    if (reducedMotion) {
      setWindowState("normal");
      return;
    }
    // Mount the terminal already-shrunk, then grow it in (see the
    // useLayoutEffect below that flips restoring -> idle next frame).
    setWindowState("normal");
    setAnimState("restoring");
  };
```

- [ ] **Step 3: Add the enter-transition driver**

Immediately after the auto-scroll `useLayoutEffect` (ends Home.tsx:176), add a layout effect that, once the terminal has mounted in the `restoring` state, paints the shrunk frame and then flips to visible on the next frame so the CSS transition runs:

```ts
  // When restoring, the terminal mounts shrunk (scale 0.05 / opacity 0).
  // Paint that frame, then flip to idle next frame so the grow-in
  // transition actually animates instead of snapping.
  useLayoutEffect(() => {
    if (animState !== "restoring") return;
    const raf = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setAnimState("idle"));
    });
    return () => window.cancelAnimationFrame(raf);
  }, [animState]);
```

- [ ] **Step 4: Compute the anim transform sx and the transition-end handler**

Just before the `if (windowState === "minimized")` branch (Home.tsx:312), add:

```ts
  const shrunk = animState === "minimizing" || animState === "restoring";
  const animSx = reducedMotion
    ? {}
    : {
        transformOrigin: "center center" as const,
        transition: `transform ${ANIM_MS}ms cubic-bezier(.4,0,.2,1), opacity ${ANIM_MS}ms`,
        transform: shrunk ? `scale(${MINIMIZE_SCALE})` : "scale(1)",
        opacity: shrunk ? 0 : 1,
        pointerEvents: (shrunk ? "none" : "auto") as "none" | "auto",
      };

  const handleStackTransitionEnd = (
    e: React.TransitionEvent<HTMLDivElement>,
  ) => {
    // Only react to the Stack's own transform transition, not bubbled
    // child transitions.
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    if (animState === "minimizing") {
      setWindowState("minimized");
      setAnimState("idle");
    }
  };
```

- [ ] **Step 5: Apply animSx and the handler to the terminal Stack**

Change the terminal Stack opening tag (Home.tsx:342) from:

```tsx
    <Stack spacing={3} sx={stackSx}>
```

to:

```tsx
    <Stack
      spacing={3}
      sx={{ ...stackSx, ...animSx }}
      onTransitionEnd={handleStackTransitionEnd}
    >
```

Note: `stackSx` is the object literal returned by the `isFullscreen ? {...} : {...}` expression (Home.tsx:317-339); spreading `animSx` after it lets the transform/opacity/transition override cleanly in both normal and fullscreen branches.

- [ ] **Step 6: Give the dock an enter transition**

The dock should grow in when it mounts (after minimize completes) and is unmounted instantly on restore (the terminal's grow-in covers the visual). Add a mount-grow to `TerminalDock`.

In `TerminalDock` (Home.tsx:403), add a local mounted flag so it starts shrunk and grows in. Replace the component with:

```tsx
const TerminalDock: FC<{ onRestore: () => void }> = ({ onRestore }) => {
  const [shown, setShown] = useState(false);
  useLayoutEffect(() => {
    const raf = window.requestAnimationFrame(() => setShown(true));
    return () => window.cancelAnimationFrame(raf);
  }, []);
  return (
    <ElectricBorder
      color="hsl(180, 100%, 70%)"
      speed={1}
      chaos={0.18}
      borderRadius={10}
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) scale(${shown ? 1 : 0.05})`,
        opacity: shown ? 1 : 0,
        transition: "transform 400ms cubic-bezier(.4,0,.2,1), opacity 400ms",
        zIndex: 20,
      }}
    >
```

Leave the rest of `TerminalDock`'s JSX (the `<Box component="button">…</ElectricBorder>`) unchanged.

- [ ] **Step 7: Verify lint passes**

Run: `pnpm lint`
Expected: PASS (exit 0, no warnings). If `useState`/`useLayoutEffect` are flagged as unused, confirm they're already imported at the top of Home.tsx (they are — lines 5,8).

- [ ] **Step 8: Verify build passes**

Run: `pnpm build`
Expected: PASS — `tsc` typechecks clean and `vite build` writes `dist/`.

- [ ] **Step 9: Commit**

```bash
git add src/components/Home.tsx docs/superpowers/plans/2026-06-20-minimize-restore-animation.md
git commit -m "feat: scale-to-center animation on terminal minimize/restore"
```

---

## Manual verification (after build)

`pnpm dev`, then in the browser:
1. Click the yellow dot → terminal scales down toward center over ~400ms, then the dock pill grows in.
2. Click the dock pill → terminal grows back from center over ~400ms.
3. Enter fullscreen (green), then minimize → still shrinks to center correctly.
4. (If testable) with OS "reduce motion" on → minimize/restore swap instantly, no transform.
