// Types for the Journey content (submodule at src/journey-content).
// Shapes mirror journey.json / timeline.json produced by the Journey repo's
// .design/gen-*.mjs generators. Keep in sync with that schema.

export interface Solution {
  id: number | null;
  topic: string;
  solutionType: string;
  subtopic?: string;
  nameFragment?: string;
  file: string; // e.g. "Algos/BFS/Tree/104.java"
  originalFile?: string;
  strategyComment?: string;
}

export interface Manifest {
  count: number;
  topics: string[];
  solutions: Solution[];
}

export interface TimelineEntry {
  day: string;
  dayNum: number;
  rawDate: string | null;
  section: string | null;
  note: string | null;
}

export interface Milestone {
  afterDay: string | null;
  text: string;
  section: string | null;
}

export interface Timeline {
  count: number;
  entries: TimelineEntry[];
  milestones: Milestone[];
}

export interface GuideMeta {
  slug: string;
  title: string;
  status: "published" | "pending";
}

export interface GuideIndex {
  count: number;
  guides: GuideMeta[];
}
