import {
  FC,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
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
  const [windowState, setWindowState] = useState<WindowState>("normal");

  const handleMinimize = () => setWindowState("minimized");
  const handleFullscreen = () =>
    setWindowState((s) => (s === "fullscreen" ? "normal" : "fullscreen"));
  const handleRestore = () => setWindowState("normal");

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
    <Stack spacing={3} sx={stackSx}>
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
const TerminalDock: FC<{ onRestore: () => void }> = ({ onRestore }) => (
  <ElectricBorder
    color="hsl(180, 100%, 70%)"
    speed={1}
    chaos={0.18}
    borderRadius={10}
    style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
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
