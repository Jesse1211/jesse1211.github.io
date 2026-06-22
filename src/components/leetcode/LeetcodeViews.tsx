import { FC, useState } from "react";
import { Box, Stack } from "@mui/joy";
import { Chip } from "../terminal";
import { useLocation } from "../../state/LocationContext";
import {
  topicsSorted,
  solutionsByTopic,
  manifest,
  timeline,
  aiTimeline,
  guideIndex,
  loadGuideMarkdown,
  solutionLabel,
} from "../../journey/data";
import type { Solution, Timeline } from "../../journey/types";
import {
  blogSectionsSorted,
  blogBySection,
  blogIndex,
  loadBlogMarkdown,
} from "../../journey/blog";
import type { BlogPost } from "../../journey/blog";
import { SolutionModal } from "./SolutionModal";
import { DocModal } from "./DocModal";

const Row: FC<{ children: React.ReactNode }> = ({ children }) => (
  <Stack direction="row" spacing={1.2} flexWrap="wrap" sx={{ pt: 0.5, gap: 1 }}>
    {children}
  </Stack>
);

// ── ls leetcode/ → topics + guides/ + journey.log
// Clicking a chip REPLACES everything after this menu entry (chooseFromMenu)
// rather than appending, so re-picking swaps the selection instead of piling
// up duplicate trailing prompts — same model as the top-level category chips.
export const LeetcodeRootView: FC<{ entryId: string }> = ({ entryId }) => {
  const { chooseFromMenu } = useLocation();
  return (
    <Box>
      <Box className="term-dim" sx={{ mb: 0.5, fontSize: "0.85em" }}>
        {manifest.count} solutions · {topicsSorted.length} topics
      </Box>
      <Row>
        <Chip onClick={() => chooseFromMenu(entryId, { kind: "enterJourneyLog" })}>
          journey.log
        </Chip>
        <Chip onClick={() => chooseFromMenu(entryId, { kind: "enterGuides" })}>
          guides/
        </Chip>
        {topicsSorted.map((t) => (
          <Chip
            key={t}
            onClick={() =>
              chooseFromMenu(entryId, { kind: "enterLeetcodeTopic", topic: t })
            }
          >
            {t}/ ({solutionsByTopic[t]?.length ?? 0})
          </Chip>
        ))}
      </Row>
    </Box>
  );
};

// ── ls leetcode/<topic>/ → solution chips opening the less modal
export const LeetcodeTopicView: FC<{ topic: string }> = ({ topic }) => {
  const [active, setActive] = useState<Solution | null>(null);
  const solutions = solutionsByTopic[topic] ?? [];
  return (
    <Box>
      <Box className="term-dim" sx={{ mb: 0.5, fontSize: "0.85em" }}>
        {solutions.length} solutions in {topic}/
      </Box>
      <Row>
        {solutions.map((s) => (
          <Chip key={s.file} onClick={() => setActive(s)}>
            $ less {solutionLabel(s)}
          </Chip>
        ))}
      </Row>
      {active && (
        <SolutionModal
          solution={active}
          open={!!active}
          onClose={() => setActive(null)}
          onSwitch={(s) => setActive(s)}
        />
      )}
    </Box>
  );
};

// Reusable git-log-style timeline renderer. Any Timeline (algos, ai, …)
// renders the same way; only the data + caption differ.
const TimelineView: FC<{ data: Timeline; caption: string }> = ({
  data,
  caption,
}) => {
  const milestonesByDay: Record<string, string[]> = {};
  for (const m of data.milestones) {
    if (m.afterDay) (milestonesByDay[m.afterDay] ??= []).push(m.text);
  }
  // newest first, like git log
  const entries = [...data.entries].reverse();
  return (
    <Box sx={{ pt: 0.5 }}>
      <Box className="term-dim" sx={{ mb: 0.6, fontSize: "0.85em" }}>
        {data.count} {caption} — newest first
      </Box>
      <Box sx={{ fontSize: "0.92em", lineHeight: 1.7 }}>
        {entries.map((e) => (
          <Box key={e.day}>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Box component="span" sx={{ color: "hsla(40,90%,72%,1)" }}>
                *
              </Box>
              <Box component="span" sx={{ color: "hsla(180,100%,80%,1)", minWidth: "4.2em" }}>
                {e.day}
              </Box>
              {e.rawDate && (
                <Box component="span" className="term-dim" sx={{ minWidth: "5.5em" }}>
                  {e.rawDate}
                </Box>
              )}
              <Box component="span" sx={{ flex: 1, minWidth: "12em", color: "hsla(180,30%,86%,0.9)" }}>
                {e.note ?? ""}
              </Box>
            </Box>
            {milestonesByDay[e.day]?.map((t, j) => (
              <Box
                key={j}
                sx={{ pl: "5.2em", color: "hsla(300,70%,80%,0.9)", fontStyle: "italic", fontSize: "0.9em" }}
              >
                ◆ {t}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// ── git log journey → the LeetCode practice timeline
export const JourneyLogView: FC = () => (
  <TimelineView data={timeline} caption="days of practice" />
);

// ── ls leetcode/guides/ → guide chips opening the doc modal
export const GuidesView: FC = () => {
  const [active, setActive] = useState<string | null>(null);
  const activeGuide = guideIndex.guides.find((g) => g.slug === active) ?? null;
  return (
    <Box>
      <Box className="term-dim" sx={{ mb: 0.5, fontSize: "0.85em" }}>
        {guideIndex.count} strategy guides
      </Box>
      <Row>
        {guideIndex.guides.map((g) => (
          <Chip key={g.slug} onClick={() => setActive(g.slug)}>
            $ less {g.slug}.md{g.status === "pending" ? " (wip)" : ""}
          </Chip>
        ))}
      </Row>
      {activeGuide && (
        <DocModal
          open={!!activeGuide}
          onClose={() => setActive(null)}
          title={`$ less guides/${activeGuide.slug}.md`}
          loadKey={activeGuide.slug}
          load={() => loadGuideMarkdown(activeGuide.slug)}
        />
      )}
    </Box>
  );
};

// ── ls notes/ → sections. Clicking a section REPLACES everything after this
// menu entry (chooseFromMenu) so the trailing prompt doesn't pile up.
export const BlogRootView: FC<{ entryId: string }> = ({ entryId }) => {
  const { chooseFromMenu } = useLocation();
  return (
    <Box>
      <Box className="term-dim" sx={{ mb: 0.5, fontSize: "0.85em" }}>
        {blogIndex.count} posts · {blogSectionsSorted.length} sections
      </Box>
      <Row>
        {blogSectionsSorted.map((s) => (
          <Chip
            key={s}
            onClick={() =>
              chooseFromMenu(entryId, { kind: "enterBlogSection", section: s })
            }
          >
            {s}/ ({blogBySection[s]?.length ?? 0})
          </Chip>
        ))}
      </Row>
    </Box>
  );
};

// ── ls notes/<section>/ → post chips opening the doc modal.
// The MLs section additionally surfaces ai.log — the AI-study timeline —
// since the AI learning journey naturally belongs alongside the ML notes.
export const BlogSectionView: FC<{ section: string }> = ({ section }) => {
  const [active, setActive] = useState<BlogPost | null>(null);
  const [showAiLog, setShowAiLog] = useState(false);
  const posts = blogBySection[section] ?? [];
  const hasAiLog = section === "MLs";
  return (
    <Box>
      <Box className="term-dim" sx={{ mb: 0.5, fontSize: "0.85em" }}>
        {posts.length} posts in {section}/
      </Box>
      <Row>
        {hasAiLog && (
          <Chip onClick={() => setShowAiLog((v) => !v)}>
            ai.log{showAiLog ? " ×" : ""}
          </Chip>
        )}
        {posts.map((p) => (
          <Chip key={p.slug} onClick={() => setActive(p)}>
            $ less {p.title}
          </Chip>
        ))}
      </Row>
      {hasAiLog && showAiLog && (
        <TimelineView data={aiTimeline} caption="days learning AI" />
      )}
      {active && (
        <DocModal
          open={!!active}
          onClose={() => setActive(null)}
          title={`$ less notes/${active.slug}.md`}
          loadKey={active.slug}
          load={() => loadBlogMarkdown(active.slug)}
        />
      )}
    </Box>
  );
};
