// Loads Journey content from the git submodule (src/journey-content).
// JSON manifests are imported directly (resolveJsonModule). Solution .java
// files and guide .md files are loaded as raw strings via import.meta.glob —
// lazily, so only files the user actually opens are fetched.

import manifestJson from "../journey-content/journey.json";
import timelineJson from "../journey-content/timeline.json";
import aiTimelineJson from "../journey-content/ai-timeline.json";
import guideIndexJson from "../journey-content/guides/index.json";
import type {
  Manifest,
  Timeline,
  GuideIndex,
  Solution,
  GuideMeta,
} from "./types";

export const manifest = manifestJson as unknown as Manifest;
export const timeline = timelineJson as unknown as Timeline;
export const aiTimeline = aiTimelineJson as unknown as Timeline;
export const guideIndex = guideIndexJson as unknown as GuideIndex;

// Lazy raw loaders for solution source and guide markdown. Keys are paths
// relative to this file's dir, so we normalize lookups against the manifest's
// "Algos/..." and the guide slug.
const solutionFiles = import.meta.glob("../journey-content/Algos/**/*.java", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

const guideFiles = import.meta.glob("../journey-content/guides/*.md", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

const SOLUTION_PREFIX = "../journey-content/";
const GUIDE_PREFIX = "../journey-content/guides/";

export async function loadSolutionSource(file: string): Promise<string> {
  const key = SOLUTION_PREFIX + file;
  const loader = solutionFiles[key];
  if (!loader) throw new Error(`solution not found: ${file}`);
  return loader();
}

export async function loadGuideMarkdown(slug: string): Promise<string> {
  const key = GUIDE_PREFIX + slug + ".md";
  const loader = guideFiles[key];
  if (!loader) throw new Error(`guide not found: ${slug}`);
  return loader();
}

// ---- derived views (computed once) ----

// topic -> solutions, sorted by id
export const solutionsByTopic: Record<string, Solution[]> = (() => {
  const map: Record<string, Solution[]> = {};
  for (const s of manifest.solutions) {
    (map[s.topic] ??= []).push(s);
  }
  for (const t of Object.keys(map)) {
    map[t].sort((a, b) => (a.id ?? 0) - (b.id ?? 0) || a.file.localeCompare(b.file));
  }
  return map;
})();

// problem id -> all solutions sharing it (for "also solved as")
export const solutionsById: Record<number, Solution[]> = (() => {
  const map: Record<number, Solution[]> = {};
  for (const s of manifest.solutions) {
    if (s.id == null) continue;
    (map[s.id] ??= []).push(s);
  }
  return map;
})();

export const topicsSorted: string[] = [...manifest.topics].sort();

export const publishedGuides: GuideMeta[] = guideIndex.guides.filter(
  (g) => g.status === "published",
);
export const pendingGuides: GuideMeta[] = guideIndex.guides.filter(
  (g) => g.status === "pending",
);

// A short display name for a solution chip: "104" or "213 Rob2".
export function solutionLabel(s: Solution): string {
  const frag = s.nameFragment ? " " + s.nameFragment : "";
  return `${s.id ?? "?"}${frag}`;
}

// The bare filename for the `$ less <file>` command label.
export function solutionFileName(s: Solution): string {
  return s.file.split("/").pop() ?? s.file;
}
