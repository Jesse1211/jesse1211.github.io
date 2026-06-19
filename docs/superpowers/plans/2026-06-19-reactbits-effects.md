# ReactBits Effects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four ReactBits visual effects to the portfolio — ElectricBorder (terminal frame), TargetCursor (site-wide), Prism (fused with the Zdog background), and a scroll-driven ScrollReveal rewrite of the terminal output reveal.

**Architecture:** ReactBits components are MIT-licensed source files copied into `src/components/effects/` (TargetCursor, ElectricBorder, ScrollReveal) and `src/components/canvas/` (Prism). GSAP (+ ScrollTrigger) and OGL are added as bundled dependencies. ElectricBorder wraps the GlassPanel; TargetCursor mounts once in App; Prism renders as a transparent WebGL canvas behind the existing transparent Zdog canvas; ScrollReveal replaces the timer-driven `Reveal`/`tailDelay` reveal with GSAP ScrollTrigger using the GlassPanel body as a custom scroller.

**Tech Stack:** Vite 5 + React 18 + TypeScript (SWC), MUI Joy 5 beta, Zdog (CDN), GSAP + ScrollTrigger, OGL, pnpm.

## Global Constraints

- Package manager is **pnpm**. Use `pnpm add` — never `npm install` (lockfile drift fails CI).
- `pnpm lint` runs ESLint with `--max-warnings 0` — **warnings are errors**. No unused vars/imports, no unused eslint-disable directives.
- Verification per task = `pnpm lint && pnpm build` must both pass (there is no test suite). Plus a manual browser check at each phase boundary.
- Terminal accent color is cyan `hsla(180,100%,70%,…)`. New effects use this hue, not ReactBits' default purple `#5227FF`.
- Terminal styling uses MUI `sx`, not CSS classes, for `background` (Joy `<Box>` overrides class-based `background-color`). Effect-internal CSS files (`.css` imports) are fine — they target the effect's own class names, not Joy Boxes.
- Custom domain is enforced by `public/CNAME`; never touch `dist/` directly (`pnpm build` wipes it).
- Commit after each task with a `feat:`/`chore:`/`refactor:` message ending with the Co-Authored-By trailer:
  ```
  Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
  ```

---

## File Structure

- `src/components/effects/ElectricBorder.tsx` + `.css` — animated border (no dep).
- `src/components/effects/TargetCursor.tsx` + `.css` — site-wide cursor (GSAP).
- `src/components/effects/ScrollReveal.tsx` + `.css` — scroll-driven word reveal (GSAP + ScrollTrigger).
- `src/components/canvas/PrismBackground.tsx` + `Prism.css` — WebGL prism background (OGL).
- Modified: `GlassPanel.tsx` (wrap with ElectricBorder), `App.tsx` (mount TargetCursor + Prism, make Zdog canvas transparent), `Home.tsx` (scroll-driven reveal + smooth auto-scroll), `Reveal.tsx` (retain expand-layout, drop opacity reveal), `Chip.tsx` (`cursor-target` class), `App.css` (cursor + canvas layering), `package.json` (deps), `CLAUDE.md` (document new architecture).

---

## Phase 1 — ElectricBorder + TargetCursor (low risk)

### Task 1: Add GSAP dependency

**Files:**
- Modify: `package.json` (dependencies)

**Interfaces:**
- Produces: `gsap` importable as `import { gsap } from "gsap"` and `import { ScrollTrigger } from "gsap/ScrollTrigger"`.

- [ ] **Step 1: Install gsap with pnpm**

Run:
```bash
pnpm add gsap@^3.12.5
```
Expected: `package.json` gains `"gsap": "^3.12.5"` under dependencies; `pnpm-lock.yaml` updated.

- [ ] **Step 2: Verify it builds**

Run:
```bash
pnpm build
```
Expected: build succeeds (no code uses gsap yet; this just confirms the dep resolves).

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "$(printf 'chore: add gsap dependency\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

---

### Task 2: TargetCursor component (site-wide)

**Files:**
- Create: `src/components/effects/TargetCursor.tsx`
- Create: `src/components/effects/TargetCursor.css`
- Modify: `src/App.tsx`
- Modify: `src/components/terminal/Chip.tsx`

**Interfaces:**
- Consumes: `gsap` (Task 1).
- Produces: default export `TargetCursor` (React component, props `targetSelector?`, `spinDuration?`, `hideDefaultCursor?`, `hoverDuration?`, `parallaxOn?`). Returns `null` on mobile/touch (built-in `isMobile` guard). Snaps to elements matching `.cursor-target`.

- [ ] **Step 1: Create `src/components/effects/TargetCursor.css`**

```css
.target-cursor-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
  transform: translate(-50%, -50%);
}

.target-cursor-dot {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 4px;
  height: 4px;
  background: #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  will-change: transform;
}

.target-cursor-corner {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 12px;
  height: 12px;
  border: 3px solid #fff;
  will-change: transform;
}

.corner-tl {
  transform: translate(-150%, -150%);
  border-right: none;
  border-bottom: none;
}

.corner-tr {
  transform: translate(50%, -150%);
  border-left: none;
  border-bottom: none;
}

.corner-br {
  transform: translate(50%, 50%);
  border-left: none;
  border-top: none;
}

.corner-bl {
  transform: translate(-150%, 50%);
  border-right: none;
  border-top: none;
}
```

- [ ] **Step 2: Create `src/components/effects/TargetCursor.tsx`**

Paste this exact file (verbatim ReactBits `ts-default` source — it already includes a built-in `isMobile` guard that returns `null` on touch devices, satisfying the spec's touch fallback):

```tsx
import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import './TargetCursor.css';

// A position: fixed element is positioned relative to the viewport UNLESS an
// ancestor establishes a containing block (transform, perspective, filter,
// will-change of those, or contain). When that happens, the cursor's translate
// no longer maps to viewport coordinates, so we measure and compensate for it.
const getContainingBlock = (element: HTMLElement | null): HTMLElement | null => {
  let node = element?.parentElement ?? null;
  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node);
    if (
      style.transform !== 'none' ||
      style.perspective !== 'none' ||
      style.filter !== 'none' ||
      style.willChange.includes('transform') ||
      style.willChange.includes('perspective') ||
      style.willChange.includes('filter') ||
      /paint|layout|strict|content/.test(style.contain)
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
};

const getContainingBlockOffset = (block: HTMLElement | null): { x: number; y: number } => {
  if (!block) return { x: 0, y: 0 };
  const rect = block.getBoundingClientRect();
  return { x: rect.left + block.clientLeft, y: rect.top + block.clientTop };
};

export interface TargetCursorProps {
  targetSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  hoverDuration?: number;
  parallaxOn?: boolean;
}

const TargetCursor: React.FC<TargetCursorProps> = ({
  targetSelector = '.cursor-target',
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<NodeListOf<HTMLDivElement> | null>(null);
  const spinTl = useRef<gsap.core.Timeline | null>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const containingBlockRef = useRef<HTMLElement | null>(null);

  const isActiveRef = useRef(false);
  const targetCornerPositionsRef = useRef<{ x: number; y: number }[] | null>(null);
  const tickerFnRef = useRef<(() => void) | null>(null);
  const activeStrengthRef = useRef({ current: 0 });

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    const userAgent = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || '';
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
    return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
  }, []);

  const constants = useMemo(() => ({ borderWidth: 3, cornerSize: 12 }), []);

  const moveCursor = useCallback((x: number, y: number) => {
    if (!cursorRef.current) return;
    const { x: offsetX, y: offsetY } = getContainingBlockOffset(containingBlockRef.current);
    gsap.to(cursorRef.current, { x: x - offsetX, y: y - offsetY, duration: 0.1, ease: 'power3.out' });
  }, []);

  useEffect(() => {
    if (isMobile || !cursorRef.current) return;

    const originalCursor = document.body.style.cursor;
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
    }

    const cursor = cursorRef.current;
    cornersRef.current = cursor.querySelectorAll<HTMLDivElement>('.target-cursor-corner');

    containingBlockRef.current = getContainingBlock(cursor);
    const getOffset = () => getContainingBlockOffset(containingBlockRef.current);

    let activeTarget: Element | null = null;
    let currentLeaveHandler: (() => void) | null = null;
    let resumeTimeout: ReturnType<typeof setTimeout> | null = null;

    const cleanupTarget = (target: Element) => {
      if (currentLeaveHandler) {
        target.removeEventListener('mouseleave', currentLeaveHandler);
      }
      currentLeaveHandler = null;
    };

    const initialOffset = getOffset();
    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2 - initialOffset.x,
      y: window.innerHeight / 2 - initialOffset.y
    });

    const createSpinTimeline = () => {
      if (spinTl.current) {
        spinTl.current.kill();
      }
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursor, { rotation: '+=360', duration: spinDuration, ease: 'none' });
    };

    createSpinTimeline();

    const tickerFn = () => {
      if (!targetCornerPositionsRef.current || !cursorRef.current || !cornersRef.current) {
        return;
      }
      const strength = activeStrengthRef.current.current;
      if (strength === 0) return;
      const cursorX = gsap.getProperty(cursorRef.current, 'x') as number;
      const cursorY = gsap.getProperty(cursorRef.current, 'y') as number;
      const corners = Array.from(cornersRef.current);
      corners.forEach((corner, i) => {
        const currentX = gsap.getProperty(corner, 'x') as number;
        const currentY = gsap.getProperty(corner, 'y') as number;
        const targetX = targetCornerPositionsRef.current![i].x - cursorX;
        const targetY = targetCornerPositionsRef.current![i].y - cursorY;
        const finalX = currentX + (targetX - currentX) * strength;
        const finalY = currentY + (targetY - currentY) * strength;
        const duration = strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;
        gsap.to(corner, {
          x: finalX,
          y: finalY,
          duration: duration,
          ease: duration === 0 ? 'none' : 'power1.out',
          overwrite: 'auto'
        });
      });
    };

    tickerFnRef.current = tickerFn;

    const moveHandler = (e: MouseEvent) => moveCursor(e.clientX, e.clientY);
    window.addEventListener('mousemove', moveHandler);

    const scrollHandler = () => {
      if (!activeTarget || !cursorRef.current) return;
      const { x: offsetX, y: offsetY } = getOffset();
      const mouseX = (gsap.getProperty(cursorRef.current, 'x') as number) + offsetX;
      const mouseY = (gsap.getProperty(cursorRef.current, 'y') as number) + offsetY;
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
      const isStillOverTarget =
        elementUnderMouse &&
        (elementUnderMouse === activeTarget || elementUnderMouse.closest(targetSelector) === activeTarget);
      if (!isStillOverTarget) {
        currentLeaveHandler?.();
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });

    const mouseDownHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 0.9, duration: 0.2 });
    };

    const mouseUpHandler = () => {
      if (!dotRef.current) return;
      gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    const enterHandler = (e: MouseEvent) => {
      const directTarget = e.target as Element;
      const allTargets: Element[] = [];
      let current: Element | null = directTarget;
      while (current && current !== document.body) {
        if (current.matches(targetSelector)) {
          allTargets.push(current);
        }
        current = current.parentElement;
      }
      const target = allTargets[0] || null;
      if (!target || !cursorRef.current || !cornersRef.current) return;
      if (activeTarget === target) return;
      if (activeTarget) {
        cleanupTarget(activeTarget);
      }
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      activeTarget = target;
      const corners = Array.from(cornersRef.current);
      corners.forEach(corner => gsap.killTweensOf(corner));
      gsap.killTweensOf(cursorRef.current, 'rotation');
      spinTl.current?.pause();
      gsap.set(cursorRef.current, { rotation: 0 });

      const rect = target.getBoundingClientRect();
      const { borderWidth, cornerSize } = constants;
      const { x: offsetX, y: offsetY } = getOffset();
      const cursorX = gsap.getProperty(cursorRef.current, 'x') as number;
      const cursorY = gsap.getProperty(cursorRef.current, 'y') as number;

      targetCornerPositionsRef.current = [
        { x: rect.left - borderWidth - offsetX, y: rect.top - borderWidth - offsetY },
        { x: rect.right + borderWidth - cornerSize - offsetX, y: rect.top - borderWidth - offsetY },
        { x: rect.right + borderWidth - cornerSize - offsetX, y: rect.bottom + borderWidth - cornerSize - offsetY },
        { x: rect.left - borderWidth - offsetX, y: rect.bottom + borderWidth - cornerSize - offsetY }
      ];

      isActiveRef.current = true;
      gsap.ticker.add(tickerFnRef.current!);

      gsap.to(activeStrengthRef.current, { current: 1, duration: hoverDuration, ease: 'power2.out' });

      corners.forEach((corner, i) => {
        gsap.to(corner, {
          x: targetCornerPositionsRef.current![i].x - cursorX,
          y: targetCornerPositionsRef.current![i].y - cursorY,
          duration: 0.2,
          ease: 'power2.out'
        });
      });

      const leaveHandler = () => {
        gsap.ticker.remove(tickerFnRef.current!);
        isActiveRef.current = false;
        targetCornerPositionsRef.current = null;
        gsap.set(activeStrengthRef.current, { current: 0, overwrite: true });
        activeTarget = null;
        if (cornersRef.current) {
          const corners = Array.from(cornersRef.current);
          gsap.killTweensOf(corners);
          const { cornerSize } = constants;
          const positions = [
            { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: cornerSize * 0.5 },
            { x: -cornerSize * 1.5, y: cornerSize * 0.5 }
          ];
          const tl = gsap.timeline();
          corners.forEach((corner, index) => {
            tl.to(corner, { x: positions[index].x, y: positions[index].y, duration: 0.3, ease: 'power3.out' }, 0);
          });
        }
        resumeTimeout = setTimeout(() => {
          if (!activeTarget && cursorRef.current && spinTl.current) {
            const currentRotation = gsap.getProperty(cursorRef.current, 'rotation') as number;
            const normalizedRotation = currentRotation % 360;
            spinTl.current.kill();
            spinTl.current = gsap
              .timeline({ repeat: -1 })
              .to(cursorRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });
            gsap.to(cursorRef.current, {
              rotation: normalizedRotation + 360,
              duration: spinDuration * (1 - normalizedRotation / 360),
              ease: 'none',
              onComplete: () => {
                spinTl.current?.restart();
              }
            });
          }
          resumeTimeout = null;
        }, 50);
        cleanupTarget(target);
      };
      currentLeaveHandler = leaveHandler;
      target.addEventListener('mouseleave', leaveHandler);
    };

    window.addEventListener('mouseover', enterHandler as EventListener);

    const resizeHandler = () => {
      containingBlockRef.current = getContainingBlock(cursor);
    };
    window.addEventListener('resize', resizeHandler);

    return () => {
      if (tickerFnRef.current) {
        gsap.ticker.remove(tickerFnRef.current);
      }
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseover', enterHandler as EventListener);
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
      if (activeTarget) {
        cleanupTarget(activeTarget);
      }
      spinTl.current?.kill();
      document.body.style.cursor = originalCursor;
      isActiveRef.current = false;
      targetCornerPositionsRef.current = null;
      activeStrengthRef.current.current = 0;
    };
  }, [targetSelector, spinDuration, moveCursor, constants, hideDefaultCursor, isMobile, hoverDuration, parallaxOn]);

  useEffect(() => {
    if (isMobile || !cursorRef.current || !spinTl.current) return;
    if (spinTl.current.isActive()) {
      spinTl.current.kill();
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursorRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });
    }
  }, [spinDuration, isMobile]);

  if (isMobile) {
    return null;
  }

  return (
    <div ref={cursorRef} className="target-cursor-wrapper">
      <div ref={dotRef} className="target-cursor-dot" />
      <div className="target-cursor-corner corner-tl" />
      <div className="target-cursor-corner corner-tr" />
      <div className="target-cursor-corner corner-br" />
      <div className="target-cursor-corner corner-bl" />
    </div>
  );
};

export default TargetCursor;
```

> Note: the only edit from upstream is the `opera` typing — `(window as unknown as { opera?: string }).opera || ''` instead of `(window as any).opera` — because `--max-warnings 0` forbids `any`.

- [ ] **Step 3: Mount TargetCursor in `src/App.tsx`**

Add the import after the existing imports (after line 18, `import { fontStack } from "./theme/terminal";`):

```tsx
import TargetCursor from "./components/effects/TargetCursor";
```

Then add `<TargetCursor />` as the first child inside the `<JoyCssVarsProvider>`, immediately before `<canvas className="canvas"></canvas>` (line 44):

```tsx
      <JoyCssVarsProvider defaultMode="dark" theme={THEME}>
        <TargetCursor />
        <canvas className="canvas"></canvas>
```

- [ ] **Step 4: Tag the Chip as a cursor target in `src/components/terminal/Chip.tsx`**

Change the `<Box>` opening tag (line 9-12) to add a `className`. Replace:

```tsx
  <Box
    component={onClick ? "button" : "span"}
    {...(onClick ? { type: "button" as const } : {})}
    onClick={onClick}
```

with:

```tsx
  <Box
    component={onClick ? "button" : "span"}
    {...(onClick ? { type: "button" as const } : {})}
    className={onClick ? "cursor-target" : undefined}
    onClick={onClick}
```

- [ ] **Step 5: Lint and build**

Run:
```bash
pnpm lint && pnpm build
```
Expected: both pass with no warnings/errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/effects/TargetCursor.tsx src/components/effects/TargetCursor.css src/App.tsx src/components/terminal/Chip.tsx
git commit -m "$(printf 'feat: add site-wide TargetCursor\n\nMounts the ReactBits TargetCursor in App and tags clickable chips\nwith .cursor-target. Built-in isMobile guard disables it on touch.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

---

### Task 3: ElectricBorder around the terminal frame

**Files:**
- Create: `src/components/effects/ElectricBorder.tsx`
- Create: `src/components/effects/ElectricBorder.css`
- Modify: `src/components/terminal/GlassPanel.tsx`

**Interfaces:**
- Consumes: nothing (no GSAP — pure canvas + CSS).
- Produces: default export `ElectricBorder` (props `color?`, `speed?`, `chaos?`, `borderRadius?`, `className?`, `style?`, `children?`). Wraps children with an animated electric border; renders glow in outer layers that are NOT clipped (so it must wrap the panel from outside).

- [ ] **Step 1: Create `src/components/effects/ElectricBorder.css`**

```css
.electric-border {
  --electric-light-color: oklch(from var(--electric-border-color) l c h);
  position: relative;
  border-radius: inherit;
  overflow: visible;
  isolation: isolate;
}

.eb-canvas-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 2;
}

.eb-canvas {
  display: block;
}

.eb-content {
  position: relative;
  border-radius: inherit;
  z-index: 1;
}

.eb-layers {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 0;
}

.eb-glow-1,
.eb-glow-2,
.eb-background-glow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  box-sizing: border-box;
}

.eb-glow-1 {
  border: 2px solid oklch(from var(--electric-border-color) l c h / 0.6);
  filter: blur(1px);
}

.eb-glow-2 {
  border: 2px solid var(--electric-light-color);
  filter: blur(4px);
}

.eb-background-glow {
  z-index: -1;
  transform: scale(1.1);
  filter: blur(32px);
  opacity: 0.3;
  background: linear-gradient(-30deg, var(--electric-light-color), transparent, var(--electric-border-color));
}
```

- [ ] **Step 2: Create `src/components/effects/ElectricBorder.tsx`**

Paste this exact file (verbatim ReactBits `ts-default` source):

```tsx
import React, { useEffect, useRef, useCallback, CSSProperties, ReactNode } from 'react';
import './ElectricBorder.css';

interface ElectricBorderProps {
  children?: ReactNode;
  color?: string;
  speed?: number;
  chaos?: number;
  borderRadius?: number;
  className?: string;
  style?: CSSProperties;
}

const ElectricBorder: React.FC<ElectricBorderProps> = ({
  children,
  color = '#5227FF',
  speed = 1,
  chaos = 0.12,
  borderRadius = 24,
  className,
  style
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);

  const random = useCallback((x: number): number => {
    return (Math.sin(x * 12.9898) * 43758.5453) % 1;
  }, []);

  const noise2D = useCallback(
    (x: number, y: number): number => {
      const i = Math.floor(x);
      const j = Math.floor(y);
      const fx = x - i;
      const fy = y - j;

      const a = random(i + j * 57);
      const b = random(i + 1 + j * 57);
      const c = random(i + (j + 1) * 57);
      const d = random(i + 1 + (j + 1) * 57);

      const ux = fx * fx * (3.0 - 2.0 * fx);
      const uy = fy * fy * (3.0 - 2.0 * fy);

      return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
    },
    [random]
  );

  const octavedNoise = useCallback(
    (
      x: number,
      octaves: number,
      lacunarity: number,
      gain: number,
      baseAmplitude: number,
      baseFrequency: number,
      time: number,
      seed: number,
      baseFlatness: number
    ): number => {
      let y = 0;
      let amplitude = baseAmplitude;
      let frequency = baseFrequency;

      for (let i = 0; i < octaves; i++) {
        let octaveAmplitude = amplitude;
        if (i === 0) {
          octaveAmplitude *= baseFlatness;
        }
        y += octaveAmplitude * noise2D(frequency * x + seed * 100, time * frequency * 0.3);
        frequency *= lacunarity;
        amplitude *= gain;
      }

      return y;
    },
    [noise2D]
  );

  const getCornerPoint = useCallback(
    (
      centerX: number,
      centerY: number,
      radius: number,
      startAngle: number,
      arcLength: number,
      progress: number
    ): { x: number; y: number } => {
      const angle = startAngle + progress * arcLength;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    },
    []
  );

  const getRoundedRectPoint = useCallback(
    (t: number, left: number, top: number, width: number, height: number, radius: number): { x: number; y: number } => {
      const straightWidth = width - 2 * radius;
      const straightHeight = height - 2 * radius;
      const cornerArc = (Math.PI * radius) / 2;
      const totalPerimeter = 2 * straightWidth + 2 * straightHeight + 4 * cornerArc;
      const distance = t * totalPerimeter;

      let accumulated = 0;

      if (distance <= accumulated + straightWidth) {
        const progress = (distance - accumulated) / straightWidth;
        return { x: left + radius + progress * straightWidth, y: top };
      }
      accumulated += straightWidth;

      if (distance <= accumulated + cornerArc) {
        const progress = (distance - accumulated) / cornerArc;
        return getCornerPoint(left + width - radius, top + radius, radius, -Math.PI / 2, Math.PI / 2, progress);
      }
      accumulated += cornerArc;

      if (distance <= accumulated + straightHeight) {
        const progress = (distance - accumulated) / straightHeight;
        return { x: left + width, y: top + radius + progress * straightHeight };
      }
      accumulated += straightHeight;

      if (distance <= accumulated + cornerArc) {
        const progress = (distance - accumulated) / cornerArc;
        return getCornerPoint(left + width - radius, top + height - radius, radius, 0, Math.PI / 2, progress);
      }
      accumulated += cornerArc;

      if (distance <= accumulated + straightWidth) {
        const progress = (distance - accumulated) / straightWidth;
        return { x: left + width - radius - progress * straightWidth, y: top + height };
      }
      accumulated += straightWidth;

      if (distance <= accumulated + cornerArc) {
        const progress = (distance - accumulated) / cornerArc;
        return getCornerPoint(left + radius, top + height - radius, radius, Math.PI / 2, Math.PI / 2, progress);
      }
      accumulated += cornerArc;

      if (distance <= accumulated + straightHeight) {
        const progress = (distance - accumulated) / straightHeight;
        return { x: left, y: top + height - radius - progress * straightHeight };
      }
      accumulated += straightHeight;

      const progress = (distance - accumulated) / cornerArc;
      return getCornerPoint(left + radius, top + radius, radius, Math.PI, Math.PI / 2, progress);
    },
    [getCornerPoint]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const octaves = 10;
    const lacunarity = 1.6;
    const gain = 0.7;
    const amplitude = chaos;
    const frequency = 10;
    const baseFlatness = 0;
    const displacement = 60;
    const borderOffset = 60;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width + borderOffset * 2;
      const height = rect.height + borderOffset * 2;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      return { width, height };
    };

    let { width, height } = updateSize();
    let lastDpr = Math.min(window.devicePixelRatio || 1, 2);

    const drawElectricBorder = (currentTime: number) => {
      if (!canvas || !ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (dpr !== lastDpr) {
        lastDpr = dpr;
        const newSize = updateSize();
        width = newSize.width;
        height = newSize.height;
      }

      const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000;
      timeRef.current += deltaTime * speed;
      lastFrameTimeRef.current = currentTime;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const scale = displacement;
      const left = borderOffset;
      const top = borderOffset;
      const borderWidth = width - 2 * borderOffset;
      const borderHeight = height - 2 * borderOffset;
      const maxRadius = Math.min(borderWidth, borderHeight) / 2;
      const radius = Math.min(borderRadius, maxRadius);

      const approximatePerimeter = 2 * (borderWidth + borderHeight) + 2 * Math.PI * radius;
      const sampleCount = Math.floor(approximatePerimeter / 2);

      ctx.beginPath();

      for (let i = 0; i <= sampleCount; i++) {
        const progress = i / sampleCount;

        const point = getRoundedRectPoint(progress, left, top, borderWidth, borderHeight, radius);

        const xNoise = octavedNoise(
          progress * 8,
          octaves,
          lacunarity,
          gain,
          amplitude,
          frequency,
          timeRef.current,
          0,
          baseFlatness
        );
        const yNoise = octavedNoise(
          progress * 8,
          octaves,
          lacunarity,
          gain,
          amplitude,
          frequency,
          timeRef.current,
          1,
          baseFlatness
        );

        const displacedX = point.x + xNoise * scale;
        const displacedY = point.y + yNoise * scale;

        if (i === 0) {
          ctx.moveTo(displacedX, displacedY);
        } else {
          ctx.lineTo(displacedX, displacedY);
        }
      }

      ctx.closePath();
      ctx.stroke();

      animationRef.current = requestAnimationFrame(drawElectricBorder);
    };

    const resizeObserver = new ResizeObserver(() => {
      const newSize = updateSize();
      width = newSize.width;
      height = newSize.height;
    });
    resizeObserver.observe(container);

    animationRef.current = requestAnimationFrame(drawElectricBorder);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [color, speed, chaos, borderRadius, octavedNoise, getRoundedRectPoint]);

  const vars = {
    '--electric-border-color': color,
    borderRadius
  } as CSSProperties;

  return (
    <div ref={containerRef} className={`electric-border ${className ?? ''}`} style={{ ...vars, ...style }}>
      <div className="eb-canvas-container">
        <canvas ref={canvasRef} className="eb-canvas" />
      </div>
      <div className="eb-layers">
        <div className="eb-glow-1" />
        <div className="eb-glow-2" />
        <div className="eb-background-glow" />
      </div>
      <div className="eb-content">{children}</div>
    </div>
  );
};

export default ElectricBorder;
```

- [ ] **Step 3: Wrap the panel body with ElectricBorder in `src/components/terminal/GlassPanel.tsx`**

The glass border must be softened (so it doesn't double up with the electric arcs), the panel's own `borderRadius` must match what we pass to ElectricBorder, and ElectricBorder must wrap the panel from outside (its glow layer needs `overflow: visible`, but the panel keeps `overflow: hidden` for its scroll body). We make ElectricBorder the outer wrapper.

Replace the entire return block (lines 22-65) with:

```tsx
  return (
    <ElectricBorder
      color="hsl(180, 100%, 70%)"
      speed={1}
      chaos={0.18}
      borderRadius={4}
      style={{ display: "flex", flexDirection: "column", minHeight: 0, ...(sxFlex as CSSProperties) }}
    >
      <Box
        className="term-mono"
        sx={[
          {
            background: "hsla(240, 55%, 8%, 0.35)",
            backdropFilter: "blur(32px) saturate(140%)",
            WebkitBackdropFilter: "blur(32px) saturate(140%)",
            border: "1px solid hsla(180,100%,70%,0.18)",
            borderRadius: "4px",
            color: "hsla(180,30%,92%,0.95)",
            boxShadow: glowShadow,
            overflow: "hidden",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            flex: 1,
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {title && (
          <TitleBar
            label={title}
            onRed={onRed}
            onYellow={onYellow}
            onGreen={onGreen}
          />
        )}
        <Box
          ref={bodyRef}
          className="term-scroll"
          sx={{
            p: { xs: 2, md: 2.5 },
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {children}
        </Box>
      </Box>
    </ElectricBorder>
  );
```

> Note three deliberate changes from the original: (1) the glass `border` alpha drops from `0.45` to `0.18` so the electric arcs are the dominant frame; (2) the panel gains `flex: 1` so it fills the ElectricBorder wrapper; (3) the panel-sizing flex props (the `sx` from `Home.tsx`: `flex: 1, minHeight: 0`) now apply to the ElectricBorder wrapper via a new `style` so the wrapper, not just the inner box, stretches.

- [ ] **Step 4: Update imports and add the `sxFlex`/`CSSProperties` handling in `GlassPanel.tsx`**

Replace the top imports (lines 1-4) with:

```tsx
import { FC, ReactNode, Ref, CSSProperties } from "react";
import { Box } from "@mui/joy";
import type { SxProps } from "@mui/joy/styles/types";
import { TitleBar } from "./TitleBar";
import ElectricBorder from "../effects/ElectricBorder";
```

The `sx` passed from `Home.tsx` is `{ flex: 1, minHeight: 0 }` (a layout sizing object). The ElectricBorder wrapper needs those flex props to stretch inside the Stack. Add this line right after the `glowShadow` computation (after line 21, before `return`):

```tsx
  const sxFlex = { flex: 1, minHeight: 0 };
```

> Rationale: `Home.tsx` passes `sx={{ flex: 1, minHeight: 0 }}` to make the panel fill the Stack. With ElectricBorder now the outermost element, the wrapper needs `flex: 1`. We hard-code the known sizing here rather than trying to parse the arbitrary `sx` prop. The original `sx` is still spread onto the inner Box (it's harmless to apply `flex:1` in both places — the inner Box also has `flex: 1`).

- [ ] **Step 5: Lint and build**

Run:
```bash
pnpm lint && pnpm build
```
Expected: both pass. If TypeScript complains about `sxFlex as CSSProperties` (Joy types), change the cast to `as CSSProperties` already present — `sxFlex` is a plain object literal of CSS values, so the cast is valid.

- [ ] **Step 6: Commit**

```bash
git add src/components/effects/ElectricBorder.tsx src/components/effects/ElectricBorder.css src/components/terminal/GlassPanel.tsx
git commit -m "$(printf 'feat: add ElectricBorder around the terminal frame\n\nWraps GlassPanel with the ReactBits ElectricBorder (cyan, matching\nthe terminal accent). Softens the glass border so the electric arcs\nbecome the dominant frame.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

- [ ] **Step 7: Manual browser check (Phase 1 boundary)**

Run `pnpm dev`, open http://localhost:5100. Confirm: (a) custom corner-bracket cursor follows the pointer and snaps to chips; (b) cursor still works clicking chips/title-bar; (c) the terminal frame has an animated cyan electric border; (d) glass blur + scroll still work. On a narrow window (<768px) or touch, the OS cursor returns (TargetCursor disables itself).

---

## Phase 2 — Prism + Zdog fusion

### Task 4: Add OGL dependency

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produces: `ogl` importable as `import { Renderer, Triangle, Program, Mesh } from "ogl"`.

- [ ] **Step 1: Install ogl**

Run:
```bash
pnpm add ogl@^1.0.6
```
Expected: `package.json` gains `"ogl": "^1.0.6"`.

- [ ] **Step 2: Install ogl types (devDependency) if needed, else rely on bundled types**

Run:
```bash
pnpm build
```
If the build fails with "Could not find a declaration file for module 'ogl'", run:
```bash
pnpm add -D @types/ogl
```
and re-run `pnpm build`. (Recent `ogl` ships its own types; this fallback covers older resolutions.) Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "$(printf 'chore: add ogl dependency for Prism background\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

---

### Task 5: PrismBackground component + Zdog fusion

**Files:**
- Create: `src/components/canvas/PrismBackground.tsx`
- Create: `src/components/canvas/Prism.css`
- Modify: `src/App.tsx`
- Modify: `src/App.css`

**Interfaces:**
- Consumes: `ogl` (Task 4); mounts in App alongside `<canvas className="canvas">` (the Zdog canvas).
- Produces: default export `PrismBackground` rendering a fixed full-screen `.prism-container` behind the Zdog canvas. Respects `prefers-reduced-motion` (renders nothing when reduced-motion is set).

- [ ] **Step 1: Create `src/components/canvas/Prism.css`**

```css
.prism-container {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -2;
}
```

> `z-index: -2` puts Prism behind the Zdog canvas. We give the Zdog canvas `z-index: -1` in Step 4 so the floaters/stars render in front of Prism, both behind the terminal (`zIndex: 1`).

- [ ] **Step 2: Create `src/components/canvas/PrismBackground.tsx`**

This wraps the verbatim ReactBits Prism logic in a component that (a) renders the `.prism-container` div, (b) tunes defaults toward the cyan/indigo palette (`hueShift`, `colorFrequency`), and (c) bails out under `prefers-reduced-motion`. The OGL effect body is the verbatim ReactBits source.

```tsx
import { FC, useEffect, useRef } from "react";
import { Renderer, Triangle, Program, Mesh } from "ogl";
import "./Prism.css";

// Adapted from ReactBits Prism (https://reactbits.dev/backgrounds/prism),
// MIT-licensed. Rendered as a fixed full-screen WebGL layer BEHIND the
// Zdog floaters/stars canvas so the two read as one scene. Tuned toward
// the terminal's cyan/indigo palette and disabled under reduced-motion.
const PrismBackground: FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Honor reduced-motion: skip the WebGL loop entirely.
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // ---- Tunable config (palette + motion). ----
    const height = 3.5;
    const baseWidth = 5.5;
    const glow = 1;
    const noise = 0.35;
    const transparent = true;
    const scale = 3.6;
    const hueShift = 0.45; // toward cyan
    const colorFrequency = 1.1;
    const timeScale = 0.4;

    const H = Math.max(0.001, height);
    const BW = Math.max(0.001, baseWidth);
    const BASE_HALF = BW * 0.5;
    const GLOW = Math.max(0.0, glow);
    const NOISE = Math.max(0.0, noise);
    const SAT = transparent ? 1.5 : 1;
    const SCALE = Math.max(0.001, scale);
    const HUE = hueShift || 0;
    const CFREQ = Math.max(0.0, colorFrequency || 1);
    const BLOOM = 1;
    const TS = Math.max(0, timeScale || 1);

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const renderer = new Renderer({ dpr, alpha: transparent, antialias: false });
    const gl = renderer.gl;
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.BLEND);

    Object.assign(gl.canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
    } as Partial<CSSStyleDeclaration>);
    container.appendChild(gl.canvas);

    const vertex = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragment = `
      precision highp float;

      uniform vec2  iResolution;
      uniform float iTime;

      uniform float uHeight;
      uniform float uBaseHalf;
      uniform mat3  uRot;
      uniform int   uUseBaseWobble;
      uniform float uGlow;
      uniform vec2  uOffsetPx;
      uniform float uNoise;
      uniform float uSaturation;
      uniform float uScale;
      uniform float uHueShift;
      uniform float uColorFreq;
      uniform float uBloom;
      uniform float uCenterShift;
      uniform float uInvBaseHalf;
      uniform float uInvHeight;
      uniform float uMinAxis;
      uniform float uPxScale;
      uniform float uTimeScale;

      vec4 tanh4(vec4 x){
        vec4 e2x = exp(2.0*x);
        return (e2x - 1.0) / (e2x + 1.0);
      }

      float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float sdOctaAnisoInv(vec3 p){
        vec3 q = vec3(abs(p.x) * uInvBaseHalf, abs(p.y) * uInvHeight, abs(p.z) * uInvBaseHalf);
        float m = q.x + q.y + q.z - 1.0;
        return m * uMinAxis * 0.5773502691896258;
      }

      float sdPyramidUpInv(vec3 p){
        float oct = sdOctaAnisoInv(p);
        float halfSpace = -p.y;
        return max(oct, halfSpace);
      }

      mat3 hueRotation(float a){
        float c = cos(a), s = sin(a);
        mat3 W = mat3(
          0.299, 0.587, 0.114,
          0.299, 0.587, 0.114,
          0.299, 0.587, 0.114
        );
        mat3 U = mat3(
           0.701, -0.587, -0.114,
          -0.299,  0.413, -0.114,
          -0.300, -0.588,  0.886
        );
        mat3 V = mat3(
           0.168, -0.331,  0.500,
           0.328,  0.035, -0.500,
          -0.497,  0.296,  0.201
        );
        return W + U * c + V * s;
      }

      void main(){
        vec2 f = (gl_FragCoord.xy - 0.5 * iResolution.xy - uOffsetPx) * uPxScale;

        float z = 5.0;
        float d = 0.0;

        vec3 p;
        vec4 o = vec4(0.0);

        float centerShift = uCenterShift;
        float cf = uColorFreq;

        mat2 wob = mat2(1.0);
        if (uUseBaseWobble == 1) {
          float t = iTime * uTimeScale;
          float c0 = cos(t + 0.0);
          float c1 = cos(t + 33.0);
          float c2 = cos(t + 11.0);
          wob = mat2(c0, c1, c2, c0);
        }

        const int STEPS = 100;
        for (int i = 0; i < STEPS; i++) {
          p = vec3(f, z);
          p.xz = p.xz * wob;
          p = uRot * p;
          vec3 q = p;
          q.y += centerShift;
          d = 0.1 + 0.2 * abs(sdPyramidUpInv(q));
          z -= d;
          o += (sin((p.y + z) * cf + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0) / d;
        }

        o = tanh4(o * o * (uGlow * uBloom) / 1e5);

        vec3 col = o.rgb;
        float n = rand(gl_FragCoord.xy + vec2(iTime));
        col += (n - 0.5) * uNoise;
        col = clamp(col, 0.0, 1.0);

        float L = dot(col, vec3(0.2126, 0.7152, 0.0722));
        col = clamp(mix(vec3(L), col, uSaturation), 0.0, 1.0);

        if(abs(uHueShift) > 0.0001){
          col = clamp(hueRotation(uHueShift) * col, 0.0, 1.0);
        }

        gl_FragColor = vec4(col, o.a);
      }
    `;

    const geometry = new Triangle(gl);
    const iResBuf = new Float32Array(2);
    const offsetPxBuf = new Float32Array(2);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iResolution: { value: iResBuf },
        iTime: { value: 0 },
        uHeight: { value: H },
        uBaseHalf: { value: BASE_HALF },
        uUseBaseWobble: { value: 1 },
        uRot: { value: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]) },
        uGlow: { value: GLOW },
        uOffsetPx: { value: offsetPxBuf },
        uNoise: { value: NOISE },
        uSaturation: { value: SAT },
        uScale: { value: SCALE },
        uHueShift: { value: HUE },
        uColorFreq: { value: CFREQ },
        uBloom: { value: BLOOM },
        uCenterShift: { value: H * 0.25 },
        uInvBaseHalf: { value: 1 / BASE_HALF },
        uInvHeight: { value: 1 / H },
        uMinAxis: { value: Math.min(BASE_HALF, H) },
        uPxScale: { value: 1 / ((gl.drawingBufferHeight || 1) * 0.1 * SCALE) },
        uTimeScale: { value: TS },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h);
      iResBuf[0] = gl.drawingBufferWidth;
      iResBuf[1] = gl.drawingBufferHeight;
      offsetPxBuf[0] = 0;
      offsetPxBuf[1] = 0;
      program.uniforms.uPxScale.value = 1 / ((gl.drawingBufferHeight || 1) * 0.1 * SCALE);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    let raf = 0;
    const t0 = performance.now();
    const render = (t: number) => {
      const time = (t - t0) * 0.001;
      program.uniforms.iTime.value = time;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      if (gl.canvas.parentElement === container) container.removeChild(gl.canvas);
    };
  }, []);

  return <div className="prism-container" ref={containerRef} />;
};

export default PrismBackground;
```

> This uses the verbatim ReactBits shader and OGL setup, restricted to the always-on `rotate` animation path (no hover/3drotate branches — we don't need pointer-driven prism motion behind the terminal). The `offset`/`suspendWhenOffscreen`/`hover` machinery is dropped because we render full-screen, always on. This keeps the file focused on its one responsibility.

- [ ] **Step 3: Mount PrismBackground in `src/App.tsx`**

Add the import after the `TargetCursor` import added in Task 2:

```tsx
import PrismBackground from "./components/canvas/PrismBackground";
```

Then render `<PrismBackground />` immediately before the Zdog `<canvas className="canvas">` (which is right after `<TargetCursor />`):

```tsx
      <JoyCssVarsProvider defaultMode="dark" theme={THEME}>
        <TargetCursor />
        <PrismBackground />
        <canvas className="canvas"></canvas>
```

- [ ] **Step 4: Make the Zdog canvas transparent and layered in front of Prism — `src/App.css`**

Open `src/App.css` and find the `.canvas` rule (the Zdog full-screen canvas). Ensure it has a transparent background and sits above Prism but below the terminal. Add or update the rule so it includes:

```css
.canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: -1;
}
```

> If `.canvas` already exists with `position: fixed` / sizing, only add/confirm `background: transparent;` and `z-index: -1;`. The goal: Prism (`z-index: -2`) renders behind, Zdog floaters/stars (`z-index: -1`, transparent) render in front of Prism, terminal (`zIndex: 1`) on top of both. Verify the actual current `.canvas` rule first with `git grep -n "\.canvas" src/App.css` and merge rather than duplicate.

- [ ] **Step 5: Lint and build**

Run:
```bash
pnpm lint && pnpm build
```
Expected: both pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/canvas/PrismBackground.tsx src/components/canvas/Prism.css src/App.tsx src/App.css
git commit -m "$(printf 'feat: add Prism WebGL background fused with Zdog\n\nRenders a fixed full-screen OGL Prism layer behind the transparent\nZdog floaters/stars canvas so the two read as one scene. Tuned to\nthe cyan palette and disabled under prefers-reduced-motion.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

- [ ] **Step 7: Manual browser check (Phase 2 boundary)**

Run `pnpm dev`. Confirm: (a) the prism light pattern is visible behind the scene; (b) the Zdog geometric floaters + stars still render ON TOP of the prism (not hidden); (c) the terminal sits above both and stays readable; (d) toggling OS "reduce motion" makes Prism disappear (Zdog stays). Check framerate is acceptable; if janky, note it for a follow-up (not a blocker for this task).

---

## Phase 3 — ScrollReveal scroll-driven terminal (highest risk)

> This phase replaces the documented core (timer-staggered reveal + snap-to-bottom auto-scroll) with scroll-driven reveal. Do this last; Phases 1–2 are unaffected if this needs iteration.

### Task 6: ScrollReveal component (per-instance triggers, custom scroller)

**Files:**
- Create: `src/components/effects/ScrollReveal.tsx`
- Create: `src/components/effects/ScrollReveal.css`

**Interfaces:**
- Consumes: `gsap` + `gsap/ScrollTrigger` (Task 1).
- Produces: default export `ScrollReveal` with props:
  - `children: ReactNode` (rendered as the revealed block — supports plain string OR arbitrary nodes)
  - `scrollContainerRef?: RefObject<HTMLElement>` (the custom scroller — pass the GlassPanel body)
  - `enableBlur?: boolean` (default true), `baseOpacity?: number` (default 0.1), `baseRotation?: number` (default 3), `blurStrength?: number` (default 4)
  - `disabled?: boolean` — when true, renders children fully visible with NO ScrollTrigger (used for already-seen entries).
  - The component is `display: block` and does NOT impose `<h2>` heading semantics (terminal output is not a heading).
- CRITICAL difference from upstream: cleanup kills ONLY this instance's own triggers (tracked in a ref array), never `ScrollTrigger.getAll()`.

- [ ] **Step 1: Create `src/components/effects/ScrollReveal.css`**

```css
.scroll-reveal {
  margin: 0;
  display: block;
}

.scroll-reveal-text {
  margin: 0;
  display: block;
  line-height: inherit;
  font: inherit;
}

.scroll-reveal .word {
  display: inline-block;
  will-change: opacity, filter;
}
```

- [ ] **Step 2: Create `src/components/effects/ScrollReveal.tsx`**

This is adapted from the ReactBits `ts-default` source with three required changes for this codebase: (1) per-instance trigger cleanup (not global `getAll().kill()`); (2) a `disabled` prop for already-seen entries; (3) string-splitting only when `children` is a string, otherwise render children as-is inside the animated container (so non-string history entries still work, just without word-stagger — only string lines get the word effect).

```tsx
import {
  FC,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ScrollReveal.css";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  disabled?: boolean;
  containerClassName?: string;
  textClassName?: string;
}

const ScrollReveal: FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  disabled = false,
  containerClassName = "",
  textClassName = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  // Split only strings into words; non-string children render as-is.
  const content = useMemo<ReactNode>(() => {
    if (typeof children !== "string") return children;
    return children.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="word" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || disabled) return;

    const scroller =
      scrollContainerRef && scrollContainerRef.current
        ? scrollContainerRef.current
        : undefined;

    const triggers: ScrollTrigger[] = [];

    const rotateTween = gsap.fromTo(
      el,
      { transformOrigin: "0% 50%", rotate: baseRotation },
      {
        ease: "none",
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      },
    );
    if (rotateTween.scrollTrigger) triggers.push(rotateTween.scrollTrigger);

    const wordElements = el.querySelectorAll<HTMLElement>(".word");
    if (wordElements.length > 0) {
      const opacityTween = gsap.fromTo(
        wordElements,
        { opacity: baseOpacity, willChange: "opacity" },
        {
          ease: "none",
          opacity: 1,
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: "top bottom-=20%",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
      if (opacityTween.scrollTrigger) triggers.push(opacityTween.scrollTrigger);

      if (enableBlur) {
        const blurTween = gsap.fromTo(
          wordElements,
          { filter: `blur(${blurStrength}px)` },
          {
            ease: "none",
            filter: "blur(0px)",
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: "top bottom-=20%",
              end: "bottom bottom",
              scrub: true,
            },
          },
        );
        if (blurTween.scrollTrigger) triggers.push(blurTween.scrollTrigger);
      }
    }

    triggersRef.current = triggers;

    return () => {
      // Kill ONLY this instance's triggers — never ScrollTrigger.getAll(),
      // which would tear down every other entry's reveal.
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, [
    scrollContainerRef,
    enableBlur,
    baseRotation,
    baseOpacity,
    blurStrength,
    disabled,
    content,
  ]);

  return (
    <div
      ref={containerRef}
      className={`scroll-reveal ${containerClassName}`.trim()}
    >
      <div className={`scroll-reveal-text ${textClassName}`.trim()}>
        {content}
      </div>
    </div>
  );
};

export default ScrollReveal;
```

- [ ] **Step 3: Lint and build (component only)**

Run:
```bash
pnpm lint && pnpm build
```
Expected: both pass (component compiles even though nothing imports it yet).

- [ ] **Step 4: Commit**

```bash
git add src/components/effects/ScrollReveal.tsx src/components/effects/ScrollReveal.css
git commit -m "$(printf 'feat: add ScrollReveal component (per-instance triggers)\n\nReactBits ScrollReveal adapted for a custom scroller, a disabled\npass-through mode, non-string children, and per-instance trigger\ncleanup instead of the global getAll().kill().\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

---

### Task 7: Wire scroll-driven reveal into the terminal + smooth auto-scroll

**Files:**
- Modify: `src/components/Home.tsx`
- Modify: `src/components/terminal/Reveal.tsx`

**Interfaces:**
- Consumes: `ScrollReveal` (Task 6), `scrollRef` (the GlassPanel body), `seenIdsRef` (existing).
- Produces: terminal output that reveals via ScrollTrigger as the panel scrolls; auto-scroll changed from snap-to-bottom to a smooth eased scroll so triggers fire per line.

- [ ] **Step 1: Reduce `Reveal.tsx` to layout-only (keep expand push-down, drop opacity/blur reveal)**

ScrollReveal now owns opacity/blur. `Reveal` keeps only the height-expand push-down (so new entries push old content down) and the fade-mode for the trailing prompt. Replace the entire body of `src/components/terminal/Reveal.tsx` with:

```tsx
import { FC, ReactNode, useLayoutEffect, useState } from "react";
import { Box } from "@mui/joy";

// Reveals children after a delay.
//
//   mode="expand" (default): children grow from height 0 to their
//   natural height so newly-appended history "pushes down" the layout
//   rather than popping. Opacity/blur word reveal is handled separately
//   by ScrollReveal (scroll-driven); this component is layout-only.
//
//   mode="fade": children always occupy their layout box; only opacity
//   transitions. Used for the trailing active prompt.
export const Reveal: FC<{
  delayMs: number;
  durationMs?: number;
  mode?: "expand" | "fade";
  children: ReactNode;
}> = ({ delayMs, durationMs = 260, mode = "fade", children }) => {
  const [visible, setVisible] = useState(delayMs <= 0);
  useLayoutEffect(() => {
    if (delayMs <= 0) {
      setVisible(true);
      return;
    }
    setVisible(false);
    const t = window.setTimeout(() => setVisible(true), delayMs);
    return () => window.clearTimeout(t);
  }, [delayMs]);

  if (mode === "fade") {
    return (
      <Box
        sx={{
          opacity: visible ? 1 : 0,
          transition: visible ? `opacity ${durationMs}ms ease` : "none",
        }}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        overflow: "hidden",
        maxHeight: visible ? "4000px" : "0px",
        transition: `max-height ${durationMs}ms cubic-bezier(.2,.7,.2,1)`,
      }}
    >
      {children}
    </Box>
  );
};
```

> Change from original: the `expand` branch no longer animates `opacity` (ScrollReveal does that). Default `mode` stays `"expand"` callers, but note the trailing prompt explicitly passes `mode="fade"`. The expand branch keeps the max-height push-down.

- [ ] **Step 2: Wrap each rendered entry's text in ScrollReveal in `Home.tsx`**

In `src/components/Home.tsx`, add the import after the existing terminal imports (after line 19):

```tsx
import ScrollReveal from "./effects/ScrollReveal";
```

Then, in the history map (lines 341-356), wrap `renderEntry(entry)` with ScrollReveal, passing the scroll container and disabling it for already-seen entries. Replace the IIFE block:

```tsx
          {(() => {
            let seenCmd = false;
            return history.map((entry) => {
              const showDivider = entry.kind === "cmd" && seenCmd;
              if (entry.kind === "cmd") seenCmd = true;
              return (
                <Reveal
                  key={entry.id}
                  delayMs={revealDelay[entry.id] ?? 0}
                >
                  {showDivider && <SectionDivider />}
                  {renderEntry(entry)}
                </Reveal>
              );
            });
          })()}
```

with:

```tsx
          {(() => {
            let seenCmd = false;
            return history.map((entry) => {
              const showDivider = entry.kind === "cmd" && seenCmd;
              if (entry.kind === "cmd") seenCmd = true;
              const alreadySeen = seenIdsRef.current.has(entry.id);
              return (
                <Reveal key={entry.id} delayMs={revealDelay[entry.id] ?? 0}>
                  {showDivider && <SectionDivider />}
                  <ScrollReveal
                    scrollContainerRef={scrollRef}
                    disabled={alreadySeen}
                    enableBlur
                    baseOpacity={0.12}
                    baseRotation={2}
                    blurStrength={4}
                  >
                    {renderEntry(entry)}
                  </ScrollReveal>
                </Reveal>
              );
            });
          })()}
```

> `renderEntry` returns React nodes (Prompt/Views), not plain strings, so ScrollReveal renders them as-is (no per-word split) and applies the container rotate + (no word) reveal. The per-word blur/opacity applies only where children are strings; for the richer terminal nodes the rotate-in + container reveal is the effect. This is the pragmatic fit: the visible payoff is content rotating/sharpening into view as you scroll, without restructuring every view to expose raw strings.

- [ ] **Step 3: Change auto-scroll from snap to smooth eased scroll in `Home.tsx`**

Replace the auto-scroll `useLayoutEffect` (lines 152-166) so it eases `scrollTop` toward the bottom over the reveal window (smooth motion lets ScrollTrigger fire per line as content passes the threshold) instead of snapping every frame:

```tsx
  // Smoothly scroll toward the bottom when history grows. A snap-to-
  // bottom would teleport past ScrollTrigger thresholds; easing the
  // scroll lets each newly-revealed line cross its trigger as it
  // passes the reveal point. We refresh ScrollTrigger first so the new
  // content's scrollHeight is measured.
  useLayoutEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    ScrollTrigger.refresh();
    const start = performance.now();
    const deadline = tailDelay + 700;
    let raf = 0;
    const tick = () => {
      const target = node.scrollHeight - node.clientHeight;
      const delta = target - node.scrollTop;
      // Ease ~18% of the remaining distance per frame.
      node.scrollTop += delta * 0.18;
      if (performance.now() - start < deadline && Math.abs(delta) > 0.5) {
        raf = window.requestAnimationFrame(tick);
      } else {
        node.scrollTop = target;
      }
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [history.length, tailDelay]);
```

- [ ] **Step 4: Import ScrollTrigger in `Home.tsx` for the refresh call**

Add after the `ScrollReveal` import:

```tsx
import { ScrollTrigger } from "gsap/ScrollTrigger";
```

- [ ] **Step 5: Lint and build**

Run:
```bash
pnpm lint && pnpm build
```
Expected: both pass. If lint flags `revealDelay`/`tailDelay` as now-unused, they are still used (revealDelay in the Reveal `delayMs`, tailDelay in auto-scroll + trailing prompt) — no removal needed. If `i18n`/`typingDuration` become unused, they are still used by the typewriter `TypeLine` path — keep them.

- [ ] **Step 6: Commit**

```bash
git add src/components/Home.tsx src/components/terminal/Reveal.tsx
git commit -m "$(printf 'feat: scroll-driven terminal reveal via ScrollReveal\n\nWraps each history entry in ScrollReveal (custom scroller = panel\nbody), reduces Reveal to layout-only push-down, and changes\nauto-scroll from snap-to-bottom to a smooth eased scroll so\nScrollTrigger fires per line.\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

- [ ] **Step 7: Manual browser check (Phase 3 boundary)**

Run `pnpm dev`. Confirm: (a) clicking a chip still smoothly scrolls the new output into view AND each line rotates/sharpens in as it crosses the reveal point; (b) old (already-seen) entries do NOT re-animate on locale switch (the `disabled` path); (c) scrolling up/down through history re-triggers reveals on scrubbed scroll; (d) the trailing prompt still appears after output settles; (e) no console errors from ScrollTrigger; (f) typewriter `TypeLine` still types the command line. If the eased scroll feels too slow/fast, tune the `0.18` factor and the `+700` deadline.

---

### Task 8: Update CLAUDE.md to document the new architecture

**Files:**
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: the implemented behavior from Tasks 2-7.
- Produces: accurate docs so future work doesn't fight the new model.

- [ ] **Step 1: Update the Stack section**

In `CLAUDE.md`, in the `## Stack` list, add bullets after the Zdog bullet:

```markdown
- **GSAP + ScrollTrigger** (bundled) — drives `TargetCursor` (site-wide
  custom cursor) and the scroll-driven `ScrollReveal` terminal reveal.
- **OGL** (bundled) — WebGL lib for the `Prism` background layer.
- **ReactBits** components (MIT, copied into `src/components/effects/`
  and `src/components/canvas/`): ElectricBorder, TargetCursor,
  ScrollReveal, Prism. Not an npm package — source lives in-repo.
```

- [ ] **Step 2: Replace the timer-reveal description in the Animation timing + Reveal sections**

In `## Architecture`, update the `### Animation timing` and `### Reveal component` subsections to reflect that opacity/blur reveal is now scroll-driven (GSAP ScrollTrigger via `ScrollReveal`, scroller = GlassPanel body), that `Reveal` is now layout-only (height push-down + fade trailing prompt), and that auto-scroll now eases toward the bottom (not snap) so ScrollTrigger fires per line. Add a new subsection:

```markdown
### Scroll-driven reveal (replaces timer reveal)

Each history entry is wrapped in `ScrollReveal`
(`src/components/effects/ScrollReveal.tsx`) whose scroller is the
GlassPanel body (`scrollRef`). As the panel scrolls, each entry
rotates + (for string children) blurs/fades in via GSAP ScrollTrigger.
`Reveal.tsx` is now layout-only: `mode="expand"` does the height
push-down, `mode="fade"` is the trailing prompt. Already-seen entries
pass `disabled` to ScrollReveal so locale switches don't re-animate.
Auto-scroll eases `scrollTop` toward the bottom (≈18%/frame) instead
of snapping, so each line crosses its ScrollTrigger threshold as it
passes the reveal point. `ScrollTrigger.refresh()` runs on each
history append.

ScrollReveal kills ONLY its own triggers on unmount (tracked in a
ref) — never `ScrollTrigger.getAll().kill()`, which would tear down
every other entry's reveal.
```

- [ ] **Step 3: Add a Background fusion note**

In the `### Zdog background` subsection, add:

```markdown
The Prism WebGL layer (`src/components/canvas/PrismBackground.tsx`,
`z-index: -2`) renders BEHIND the Zdog canvas (`z-index: -1`, made
transparent in `App.css`). Both sit behind the terminal (`zIndex: 1`).
Prism is disabled under `prefers-reduced-motion`. Two rAF loops run
(Zdog + Prism) — this is intentional fusion, not a bug.
```

- [ ] **Step 4: Add an ElectricBorder + TargetCursor note to Gotchas**

Append to `## Gotchas / non-obvious decisions`:

```markdown
- **ElectricBorder wraps GlassPanel from the OUTSIDE** — its glow needs
  `overflow: visible`, while the panel keeps `overflow: hidden` for the
  scroll body. The glass `border` alpha was dropped to `0.18` so the
  electric arcs are the dominant frame, not a double border.
- **TargetCursor sets `document.body.style.cursor = 'none'`** and snaps
  to `.cursor-target` elements (added to `Chip`). It self-disables on
  touch/small screens via its built-in `isMobile` guard — don't add a
  second guard.
- **`gsap` and `ogl` ARE now in package.json** (correcting the earlier
  "no extra deps" note). They power TargetCursor/ScrollReveal and Prism
  respectively.
```

- [ ] **Step 5: Lint, build, commit**

Run:
```bash
pnpm lint && pnpm build
```
Expected: both pass (docs-only change, but confirm nothing broke).

```bash
git add CLAUDE.md
git commit -m "$(printf 'docs: document ReactBits effects + scroll-driven reveal in CLAUDE.md\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>')"
```

---

## Self-Review (completed by plan author)

**Spec coverage:**
- ElectricBorder (terminal frame) → Task 3 ✓
- TargetCursor (site-wide, touch fallback) → Task 2 (built-in isMobile guard) ✓
- Prism + Zdog fusion (two transparent canvases, reduced-motion guard) → Tasks 4-5 ✓
- ScrollReveal scroll-driven rewrite (custom scroller, auto-scroll kept but smoothed, GSAP ScrollTrigger, retire timer reveal) → Tasks 6-7 ✓
- GSAP + OGL deps → Tasks 1, 4 ✓
- Build order quick-wins-first → Phase 1/2/3 ✓
- Verification = lint + build + manual → every task ✓
- CLAUDE.md update for retired timer-reveal core → Task 8 ✓

**Placeholder scan:** No TBD/TODO; all component source is verbatim/complete; all edits show exact code and exact line targets.

**Type consistency:** `ScrollReveal` prop names (`scrollContainerRef`, `disabled`, `enableBlur`, `baseOpacity`, `baseRotation`, `blurStrength`) match between Task 6 (definition) and Task 7 (usage). `scrollRef` is the existing `RefObject<HTMLDivElement | null>` from `Home.tsx:95` — assignable to `scrollContainerRef?: RefObject<HTMLElement>`. `TargetCursor` default export matches its import. `ElectricBorder` props (`color`, `speed`, `chaos`, `borderRadius`, `style`) match Task 3 usage.

**Known risk flagged in-plan:** Phase 3 changes the documented core; isolated to last phase; reversible via git.
