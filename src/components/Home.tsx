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
  GlassPanel,
  Prompt,
  TypeLine,
  Chip,
  Reveal,
} from "./terminal";
import { useLocation } from "../state/LocationContext";
import type {
  CmdAction,
  HintContext,
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

export const Home: FC = () => {
  useEffect(() => {
    StarAndPlanet();
  }, []);

  const { history, bootstrap, replayFrom, chooseFromMenu, path } =
    useLocation();
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
  useLayoutEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [history.length]);

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
      case "hint":
        return (
          <HintChips
            hintEntryId={e.id}
            current={e.current}
            onAction={(action) => chooseFromMenu(e.id, action)}
          />
        );
    }
  };

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
        <Stack spacing={1.8}>
          {history.map((entry) => (
            <Reveal key={entry.id} delayMs={revealDelay[entry.id] ?? 0}>
              {renderEntry(entry)}
            </Reveal>
          ))}
          <Reveal delayMs={tailDelay}>
            <Prompt showCursor path={path} />
          </Reveal>
        </Stack>
      </GlassPanel>
    </Stack>
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

type HintItem = { label: string; action: CmdAction };

const hintItemsFor = (current: HintContext): HintItem[] => {
  // Show jumps to the other top-level dirs first, then up to home.
  const items: HintItem[] = [];
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
  if (current !== "about") {
    items.push({ label: "about/", action: { kind: "enterAbout" } });
  }
  items.push({ label: "~", action: { kind: "enterHome" } });
  return items;
};

const HintChips: FC<{
  hintEntryId: string;
  current: HintContext;
  onAction: (action: CmdAction) => void;
}> = ({ hintEntryId, current, onAction }) => {
  const items = hintItemsFor(current);
  return (
    <Stack
      direction="row"
      spacing={1.2}
      flexWrap="wrap"
      sx={{ pt: 0.5, alignItems: "center" }}
    >
      <Box
        component="span"
        sx={{
          color: "hsla(180,30%,85%,0.55)",
          fontStyle: "italic",
          fontSize: "0.9em",
          mr: 0.5,
        }}
      >
        # next:
      </Box>
      {items.map((it, i) => (
        <Chip key={`${hintEntryId}-${i}`} onClick={() => onAction(it.action)}>
          [{it.label}]
        </Chip>
      ))}
    </Stack>
  );
};
