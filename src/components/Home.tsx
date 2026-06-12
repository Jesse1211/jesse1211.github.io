import {
  FC,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
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

const TYPING_MS_PER_CHAR = 20; // fast
const STAGGER_MS = 80;
const TYPING_BUFFER_MS = 120;

type Location = "home" | "education" | "experience" | "about";

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

  // Auto-scroll to the bottom of the terminal whenever history grows.
  // Reveals stagger over `tailDelay` ms and each one grows its
  // max-height over ~260ms, so keep pinning scrollTop until the
  // tail of the latest sequence has had time to settle.
  useLayoutEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    const start = performance.now();
    const deadline = tailDelay + 500;
    let raf = 0;
    const tick = () => {
      node.scrollTop = node.scrollHeight;
      if (performance.now() - start < deadline) {
        raf = window.requestAnimationFrame(tick);
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
  const trailingItems = trailingSuggestions(location);

  return (
    <Stack
      spacing={3}
      sx={{
        width: { xs: "94%", md: "88%", lg: "82%", xl: "75%" },
        maxWidth: 1200,
        height: { xs: "82vh", md: "78vh" },
        maxHeight: 820,
        my: { xs: 2, md: 3 },
        position: "relative",
        zIndex: 1,
        fontSize: { xs: 14, md: 16, lg: 17 },
      }}
    >
      <GlassPanel
        title={`~/jesse — zsh`}
        glow="active"
        sx={{ flex: 1, minHeight: 0 }}
        bodyRef={scrollRef}
      >
        <Stack spacing={1.2}>
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
