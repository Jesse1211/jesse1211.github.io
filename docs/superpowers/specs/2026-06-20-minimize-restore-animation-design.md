# Minimize / Restore Scale Animation

Date: 2026-06-20

## Problem

Clicking the yellow window dot toggles `windowState` between `"normal"`
and `"minimized"`. In Home.tsx this is an instant branch: when minimized
we `return <TerminalDock />` and unmount the full `<GlassPanel>` stack.
There is no transition — the terminal disappears and the dock pill
appears in the same frame. The same hard swap happens on restore.

The user wants a **shrink animation** when minimizing and a **grow
animation** when restoring, instead of the instant swap.

## Approach

Scale-to-center crossfade, ~400ms, pure CSS transition (no GSAP).

Because the terminal is already flex-centered and the dock pill is
fixed-centered, scaling the terminal toward its own center
(`transform-origin: center`) visually "sucks" it into the same point
the dock occupies. No translate math is needed — `scale()` + `opacity`
is enough.

The instant branch is the blocker: a transition needs both elements to
coexist during the ~400ms window. So we add a transient animation state
and defer the unmount/mount until the transition ends.

## State machine

Add to Home.tsx alongside the existing `windowState`:

```ts
type AnimState = "idle" | "minimizing" | "restoring";
```

- `windowState` stays the source of truth for *which* element renders
  (`"normal" | "minimized" | "fullscreen"`).
- `animState` drives the *transform* applied during the transition.

Flow:

1. **Minimize** — yellow dot click:
   - set `animState = "minimizing"`. Terminal Stack keeps rendering but
     gets `scale(0.05)` + `opacity: 0`.
   - on the Stack's `onTransitionEnd`: set `windowState = "minimized"`,
     `animState = "idle"`. Now terminal unmounts, dock mounts.
   - dock mounts already-shrunk and grows in (its own enter transition).

2. **Restore** — dock click:
   - set `animState = "restoring"`, immediately `windowState = "normal"`
     so the terminal mounts, starting from `scale(0.05)`/`opacity: 0`,
     then transitions to `scale(1)`/`opacity: 1` on next frame.
   - dock shrinks + fades on its way out.
   - clear `animState = "idle"` on the Stack's `onTransitionEnd`.

To start a CSS transition from a freshly-mounted element you must paint
the initial (shrunk) state for one frame, then flip to the target. Use a
`requestAnimationFrame` (double-rAF if needed) inside a `useLayoutEffect`
keyed on `animState`/`windowState` to drop `restoring` → visible.

## sx / transform details

- Terminal Stack transition:
  `transition: transform .4s cubic-bezier(.4,0,.2,1), opacity .4s`.
- `transformOrigin: "center center"`.
- minimized/entering transform: `scale(0.05)`, `opacity: 0`,
  `pointer-events: none`.
- visible transform: `scale(1)`, `opacity: 1`.
- Dock: mirror with its own `transition` on `transform`/`opacity` so it
  grows in on mount and shrinks out on restore.

## Fullscreen

Minimize from fullscreen: the fullscreen Stack uses `position: fixed`
inset 0; scaling it to center still reads correctly. No special case
needed beyond using the same animSx in both `stackSx` branches.

## Reduced motion

Under `prefers-reduced-motion: reduce`, skip the transition entirely:
set `transition: none` and switch `windowState` synchronously (no
`animState` dance). Matches the project's existing convention (Prism is
disabled under reduced motion).

## Out of scope / unchanged

- `GlassPanel`, `TitleBar`, history/reveal logic, ScrollReveal,
  auto-scroll — untouched.
- `TerminalDock` structure unchanged except for adding an enter/exit
  transition on its wrapper.
- Red dot stays decorative; green (fullscreen) toggle unchanged.

## Verification

`pnpm lint && pnpm build` pass + manual browser check: click yellow dot
→ terminal shrinks to center over ~400ms then dock appears; click dock
→ terminal grows back from center.
