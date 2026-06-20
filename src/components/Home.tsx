import {
  FC,
  TransitionEvent,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { Box, Stack } from "@mui/joy";
import { StarAndPlanet } from "./canvas/StarAndPlanet";
import {
  Cursor,
  GlassPanel,
  Prompt,
  TypeLine,
  Chip,
  Reveal,
} from "./terminal";
import { useLocation } from "../state/LocationContext";
import type {
  CmdAction,
  HistoryEntry,
  LocaleKey,
} from "../state/LocationContext";
import { PortfolioContext } from "./PortfolioContext";
import { EducationView } from "./categories/EducationView";
import { ExperienceView } from "./categories/ExperienceView";
import { AboutMeView } from "./categories/AboutMeView/AboutMeView";
import ScrollReveal from "./effects/ScrollReveal";
import ElectricBorder from "./effects/ElectricBorder";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TYPING_MS_PER_CHAR = 20; // fast
const STAGGER_MS = 80;
const TYPING_BUFFER_MS = 120;

type Location = "home" | "education" | "experience" | "about";
type WindowState = "normal" | "minimized" | "fullscreen";

type AnimState = "idle" | "minimizing" | "restoring";

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

const MINIMIZE_SCALE = 0.05;
const ANIM_MS = 400;

const i18n = (key: LocaleKey, cn: boolean): string => {
  switch (key) {
    case "intro":
      return cn
        ? "Jesse Liu — 全栈开发, 康奈尔大学计算机硕士"
        : "Jesse Liu — full-stack developer, CS MEng @ Cornell";
    case "motto1":
      return cn ? "永远不要让自己止步." : "Never hold yourself back.";
    case "motto2":
      return cn
        ? "走自己的路, 享受这段旅程."
        : "Follow the path, enjoy the journey.";
  }
};

const typingDuration = (text: string): number =>
  text.length * TYPING_MS_PER_CHAR + TYPING_BUFFER_MS;

const ANIM_EASING = "cubic-bezier(.4,0,.2,1)";

type WindowAnimation = {
  windowState: WindowState;
  // The Stack's animation sx (minimize/restore scale + fade). Empty while
  // the FLIP drives transform via inline styles, so React's sx never
  // clobbers them.
  animSx: Record<string, unknown>;
  // Ref the Stack DOM node so the FLIP can measure + write inline styles.
  stackElRef: MutableRefObject<HTMLDivElement | null>;
  handleMinimize: () => void;
  handleRestore: () => void;
  handleFullscreen: () => void;
  handleStackTransitionEnd: (e: TransitionEvent<HTMLDivElement>) => void;
};

// Owns the terminal window state machine and all three transitions:
//   minimize/restore — scale-to-center + fade, driven by React sx.
//   fullscreen       — FLIP (measure-first, invert, play to identity),
//                      driven by inline styles written on the Stack node.
// `animState` tracks the minimize/restore animation in flight; `flipping`
// tracks the FLIP. Both feed `animSx`. Under prefers-reduced-motion every
// transition is skipped and state switches synchronously.
function useWindowAnimation(): WindowAnimation {
  const reducedMotion = prefersReducedMotion();
  const [windowState, setWindowState] = useState<WindowState>("normal");
  const [animState, setAnimState] = useState<AnimState>("idle");

  const stackElRef = useRef<HTMLDivElement | null>(null);
  const flipFirstRectRef = useRef<DOMRect | null>(null);
  const flipTimeoutRef = useRef<number | null>(null);
  const [flipping, setFlipping] = useState(false);

  // Remove the inline transform/transition the FLIP writes directly on the
  // Stack so React's sx (and any later minimize animation) controls it
  // again. Idempotent; safe to call from both transitionend and the
  // timeout fallback.
  const clearFlipStyles = useCallback(() => {
    if (flipTimeoutRef.current !== null) {
      window.clearTimeout(flipTimeoutRef.current);
      flipTimeoutRef.current = null;
    }
    const el = stackElRef.current;
    if (el) {
      el.style.transform = "";
      el.style.transition = "";
      el.style.transformOrigin = "";
    }
    setFlipping(false);
  }, []);

  const handleMinimize = useCallback(() => {
    if (reducedMotion) {
      setWindowState("minimized");
      return;
    }
    // Keep the terminal mounted and shrink it; the real unmount happens
    // in onTransitionEnd once the scale-down finishes.
    setAnimState("minimizing");
  }, [reducedMotion]);

  const handleRestore = useCallback(() => {
    setWindowState("normal");
    if (reducedMotion) return;
    // Mount the terminal already-shrunk, then grow it in (see the
    // useLayoutEffect below that flips restoring -> idle next frame).
    setAnimState("restoring");
  }, [reducedMotion]);

  const handleFullscreen = useCallback(() => {
    // Cancel any in-progress minimize/restore animation so the terminal
    // never gets stuck shrunk + pointer-events:none.
    setAnimState("idle");
    if (!reducedMotion) {
      // FLIP: record the current box BEFORE the geometry change.
      flipFirstRectRef.current =
        stackElRef.current?.getBoundingClientRect() ?? null;
    }
    setWindowState((s) => (s === "fullscreen" ? "normal" : "fullscreen"));
  }, [reducedMotion]);

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

  // FLIP play: after windowState changes geometry, invert from the
  // recorded "first" box to the new "last" box, then animate to
  // identity. Only runs when a first rect was captured (i.e. a real
  // fullscreen toggle, not the initial render or a locale switch).
  useLayoutEffect(() => {
    const el = stackElRef.current;
    const first = flipFirstRectRef.current;
    flipFirstRectRef.current = null;
    if (!el || !first || reducedMotion) return;

    const last = el.getBoundingClientRect();
    const dx = first.left - last.left;
    const dy = first.top - last.top;
    const fsx = first.width / last.width;
    const fsy = first.height / last.height;
    // Guard against degenerate rects.
    if (!isFinite(fsx) || !isFinite(fsy) || fsx === 0 || fsy === 0) return;

    // Invert: place the element visually back at its "first" box.
    el.style.transformOrigin = "top left";
    el.style.transition = "none";
    el.style.transform = `translate(${dx}px, ${dy}px) scale(${fsx}, ${fsy})`;

    setFlipping(true);
    // Next frame: play to identity with a transition.
    const raf = window.requestAnimationFrame(() => {
      el.style.transition = `transform ${ANIM_MS}ms ${ANIM_EASING}`;
      el.style.transform = "translate(0px, 0px) scale(1, 1)";
    });
    // Fallback: if transitionend never fires (interrupted toggle, dropped
    // event), force-clear the inline styles so the Stack can never get
    // stuck with a residual transform.
    if (flipTimeoutRef.current !== null) {
      window.clearTimeout(flipTimeoutRef.current);
    }
    flipTimeoutRef.current = window.setTimeout(clearFlipStyles, ANIM_MS + 80);
    return () => window.cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowState]);

  // Clear any pending FLIP timeout on unmount.
  useEffect(
    () => () => {
      if (flipTimeoutRef.current !== null) {
        window.clearTimeout(flipTimeoutRef.current);
      }
    },
    [],
  );

  const handleStackTransitionEnd = useCallback(
    (e: TransitionEvent<HTMLDivElement>) => {
      // Only react to the Stack's own transform transition, not bubbled
      // child transitions.
      if (e.target !== e.currentTarget || e.propertyName !== "transform") {
        return;
      }
      if (animState === "minimizing") {
        setWindowState("minimized");
        setAnimState("idle");
      } else if (flipping) {
        // FLIP finished — remove the inline overrides so React's sx (and
        // any future minimize animation) controls the element again.
        clearFlipStyles();
      }
    },
    [animState, flipping, clearFlipStyles],
  );

  // Minimize/restore scale + fade. Disabled while the FLIP owns the
  // inline transform (animSx would otherwise clobber it) or under
  // reduced motion.
  const shrunk = animState === "minimizing" || animState === "restoring";
  const animSx: Record<string, unknown> =
    reducedMotion || flipping
      ? {}
      : {
          transformOrigin: "center center",
          transition: `transform ${ANIM_MS}ms ${ANIM_EASING}, opacity ${ANIM_MS}ms`,
          transform: shrunk ? `scale(${MINIMIZE_SCALE})` : "scale(1)",
          opacity: shrunk ? 0 : 1,
          pointerEvents: shrunk ? "none" : "auto",
        };

  return {
    windowState,
    animSx,
    stackElRef,
    handleMinimize,
    handleRestore,
    handleFullscreen,
    handleStackTransitionEnd,
  };
}

// Walk the history backwards to find the most recent enterX action,
// which tells us what kind of suggestions to surface beside the
// trailing prompt.
const currentLocationOf = (history: HistoryEntry[]): Location => {
  for (let i = history.length - 1; i >= 0; i--) {
    const e = history[i];
    if (e.kind !== "cmd" || !e.action) continue;
    switch (e.action.kind) {
      case "enterCategory":
        return e.action.category;
      case "enterAbout":
        return "about";
      case "enterHome":
        return "home";
      case "lsCategories":
        // ls categories/ is a menu, not a "place" — keep looking back.
        continue;
    }
  }
  return "home";
};

export const Home: FC = () => {
  useEffect(() => {
    StarAndPlanet();
  }, []);

  const {
    history,
    bootstrap,
    replayFrom,
    chooseFromMenu,
    enterCategory,
    enterAbout,
    enterHome,
    path,
  } = useLocation();
  const { $locale, data } = useContext(PortfolioContext);
  const cn = $locale === "zh-CN";
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const {
    windowState,
    animSx,
    stackElRef,
    handleMinimize,
    handleRestore,
    handleFullscreen,
    handleStackTransitionEnd,
  } = useWindowAnimation();

  // Entries we've previously rendered. Used to skip typing animations
  // and reveal delays on subsequent renders (e.g. locale switch).
  const seenIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  // Compute per-entry reveal delays for this render. Newly-appended
  // entries are staggered after the most recent typing cmd; previously
  // seen entries get 0 delay.
  const { revealDelay, tailDelay } = useMemo<{
    revealDelay: Record<string, number>;
    tailDelay: number;
  }>(() => {
    const map: Record<string, number> = {};
    let cumulative = 0;
    for (const e of history) {
      if (seenIdsRef.current.has(e.id)) {
        map[e.id] = 0;
        continue;
      }
      map[e.id] = cumulative;
      if (e.kind === "cmd" && e.animate) {
        cumulative += typingDuration(e.text);
      } else if (e.kind === "answerKey" && e.animate) {
        cumulative += typingDuration(i18n(e.key, cn));
      } else if (e.kind === "answer" && e.animate) {
        cumulative += typingDuration(e.text);
      } else {
        cumulative += STAGGER_MS;
      }
    }
    return { revealDelay: map, tailDelay: cumulative };
    // We intentionally do NOT include `cn` because revealDelay should
    // depend only on the history mutation, not locale.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  // After each render, record which entry ids were seen so future
  // renders skip animations for them.
  useEffect(() => {
    for (const e of history) seenIdsRef.current.add(e.id);
  }, [history]);

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

  const handleCategoryClick = (
    menuEntryId: string,
    key: string,
    external?: string,
  ) => {
    if (external) {
      window.open(external, "_blank", "noopener,noreferrer");
      return;
    }
    if (key === "education" || key === "experience") {
      chooseFromMenu(menuEntryId, { kind: "enterCategory", category: key });
    } else if (key === "about") {
      chooseFromMenu(menuEntryId, { kind: "enterAbout" });
    }
  };

  const handleTrailingAction = (action: CmdAction) => {
    switch (action.kind) {
      case "enterCategory":
        return enterCategory(action.category);
      case "enterAbout":
        return enterAbout();
      case "enterHome":
        return enterHome();
      case "lsCategories":
        // Not used in trailing chips.
        return;
    }
  };

  const renderEntry = (e: HistoryEntry) => {
    const seen = seenIdsRef.current.has(e.id);
    const animate = !seen && "animate" in e && e.animate;

    switch (e.kind) {
      case "cmd":
        return (
          <Prompt path={e.atPath}>
            {animate ? (
              <TypeLine text={e.text} delay={TYPING_MS_PER_CHAR} />
            ) : e.action ? (
              <Box
                component="button"
                type="button"
                onClick={() => replayFrom(e.id)}
                sx={{
                  background: "none",
                  border: 0,
                  p: 0,
                  color: "inherit",
                  font: "inherit",
                  cursor: "pointer",
                  textDecoration: "underline dotted transparent",
                  textUnderlineOffset: "3px",
                  transition: "color .12s, text-decoration-color .12s",
                  "&:hover": {
                    color: "hsla(180,100%,80%,1)",
                    textDecorationColor: "hsla(180,100%,80%,1)",
                  },
                  "&:focus-visible": {
                    outline: "none",
                    boxShadow: "0 0 0 2px hsla(180,100%,70%,0.6)",
                  },
                }}
                title="Click to re-run from this point"
              >
                {e.text}
              </Box>
            ) : (
              <Box component="span">{e.text}</Box>
            )}
          </Prompt>
        );
      case "answer":
        return (
          <Prompt symbol=">">
            {animate ? (
              <TypeLine text={e.text} delay={TYPING_MS_PER_CHAR} />
            ) : (
              <Box component="span" className="term-accent">
                {e.text}
              </Box>
            )}
          </Prompt>
        );
      case "answerKey": {
        const text = i18n(e.key, cn);
        return (
          <Prompt symbol=">">
            {animate ? (
              <TypeLine text={text} delay={TYPING_MS_PER_CHAR} />
            ) : (
              <Box component="span" className="term-accent">
                {text}
              </Box>
            )}
          </Prompt>
        );
      }
      case "categories":
        return (
          <CategoryChips
            menuEntryId={e.id}
            onClick={handleCategoryClick}
          />
        );
      case "lsCategory":
        if (e.category === "education") {
          return (
            <EducationView
              entryId={e.id}
              responseEducation={data[$locale].education}
            />
          );
        }
        return (
          <ExperienceView
            entryId={e.id}
            responseExperience={data[$locale].experience}
          />
        );
      case "about":
        return <AboutMeView introduction={data[$locale].introduction} />;
    }
  };

  const location = currentLocationOf(history);
  // If the last history entry is already a categories chips menu,
  // hide the trailing prompt's own chips so they don't appear
  // twice back-to-back.
  const lastEntry = history[history.length - 1];
  const trailingItems =
    lastEntry?.kind === "categories" ? [] : trailingSuggestions(location);

  if (windowState === "minimized") {
    return <TerminalDock onRestore={handleRestore} />;
  }

  const isFullscreen = windowState === "fullscreen";
  const stackSx = isFullscreen
    ? {
        width: "100vw",
        maxWidth: "100vw",
        height: "100vh",
        maxHeight: "100vh",
        my: 0,
        position: "fixed" as const,
        inset: 0,
        zIndex: 20,
        fontSize: { xs: 14, md: 16, lg: 17 },
      }
    : {
        width: { xs: "94%", md: "88%", lg: "82%", xl: "75%" },
        maxWidth: 1200,
        height: { xs: "82vh", md: "78vh" },
        maxHeight: 820,
        my: { xs: 2, md: 3 },
        position: "relative" as const,
        // Above the background canvases (Prism z1, Zdog z2).
        zIndex: 3,
        fontSize: { xs: 14, md: 16, lg: 17 },
      };

  return (
    <Stack
      ref={stackElRef}
      spacing={3}
      sx={{ ...stackSx, ...animSx }}
      onTransitionEnd={handleStackTransitionEnd}
    >
      <GlassPanel
        title={`~/jesse — zsh`}
        glow="active"
        sx={{ flex: 1, minHeight: 0 }}
        bodyRef={scrollRef}
        onYellow={handleMinimize}
        onGreen={handleFullscreen}
      >
        <Stack spacing={1.2}>
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
          <Reveal delayMs={tailDelay} mode="fade">
            <TrailingPrompt
              path={path}
              items={trailingItems}
              onAction={handleTrailingAction}
            />
          </Reveal>
        </Stack>
      </GlassPanel>
    </Stack>
  );
};

const SectionDivider: FC = () => (
  <Box
    aria-hidden
    sx={{
      borderTop: "1px dashed hsla(180,100%,70%,0.18)",
      mt: 0.5,
      mb: 1.5,
    }}
  />
);

// macOS-style minimized dock entry. Click anywhere on it to restore.
// Wrapped in ElectricBorder so it matches the main terminal frame.
// ElectricBorder is the fixed, centered outer element (its glow needs
// overflow:visible, so positioning lives here, not on the button).
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
      <Box
        component="button"
        type="button"
        onClick={onRestore}
        aria-label="restore terminal"
        title="restore terminal"
        className="term-mono"
        sx={{
          px: 1.5,
          py: 0.75,
          background: "hsla(240, 55%, 8%, 0.55)",
          backdropFilter: "blur(24px) saturate(140%)",
          WebkitBackdropFilter: "blur(24px) saturate(140%)",
          border: "1px solid hsla(180,100%,70%,0.18)",
          borderRadius: "10px",
          cursor: "pointer",
          color: "hsla(180,30%,85%,0.85)",
          fontSize: 12,
          letterSpacing: "0.5px",
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          transition: "background-color .15s",
          "&:hover": {
            backgroundColor: "hsla(180,100%,70%,0.12)",
          },
          "&:focus-visible": {
            outline: "none",
            boxShadow: "0 0 0 2px hsla(180,100%,70%,0.6)",
          },
        }}
      >
        <Box component="span" sx={{ display: "inline-flex", gap: 0.6 }}>
          <Box sx={{ width: 9, height: 9, borderRadius: "50%", background: "#ff5f57" }} />
          <Box sx={{ width: 9, height: 9, borderRadius: "50%", background: "#febc2e" }} />
          <Box sx={{ width: 9, height: 9, borderRadius: "50%", background: "#28c840" }} />
        </Box>
        <Box component="span" sx={{ ml: 0.5 }}>
          ~/jesse — zsh
        </Box>
      </Box>
    </ElectricBorder>
  );
};

const CategoryChips: FC<{
  menuEntryId: string;
  onClick: (menuEntryId: string, key: string, external?: string) => void;
}> = ({ menuEntryId, onClick }) => {
  const categories = [
    { key: "education", label: "education/" },
    { key: "experience", label: "experience/" },
    { key: "blog", label: "blog/", external: "https://blog.jesseliu.me" },
    { key: "about", label: "about/" },
  ] as const;

  return (
    <Stack direction="row" spacing={1.2} flexWrap="wrap" sx={{ pt: 0.5 }}>
      {categories.map((c) => (
        <Chip
          key={c.key}
          onClick={() =>
            onClick(menuEntryId, c.key, "external" in c ? c.external : undefined)
          }
        >
          [{c.label}]
        </Chip>
      ))}
    </Stack>
  );
};

type TrailingItem =
  | { label: string; action: CmdAction; external?: undefined }
  | { label: string; external: string; action?: undefined };

const trailingSuggestions = (current: Location): TrailingItem[] => {
  const items: TrailingItem[] = [];
  if (current !== "education") {
    items.push({
      label: "education/",
      action: { kind: "enterCategory", category: "education" },
    });
  }
  if (current !== "experience") {
    items.push({
      label: "experience/",
      action: { kind: "enterCategory", category: "experience" },
    });
  }
  items.push({ label: "blog/", external: "https://blog.jesseliu.me" });
  if (current !== "about") {
    items.push({ label: "about/", action: { kind: "enterAbout" } });
  }
  if (current !== "home") {
    items.push({ label: "~", action: { kind: "enterHome" } });
  }
  return items;
};

const TrailingPrompt: FC<{
  path: string;
  items: TrailingItem[];
  onAction: (action: CmdAction) => void;
}> = ({ path, items, onAction }) => (
  <Prompt path={path}>
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Cursor />
      {items.map((it, i) => (
        <Chip
          key={i}
          onClick={() => {
            if (it.external) {
              window.open(it.external, "_blank", "noopener,noreferrer");
            } else if (it.action) {
              onAction(it.action);
            }
          }}
        >
          [{it.label}]
        </Chip>
      ))}
    </Box>
  </Prompt>
);
