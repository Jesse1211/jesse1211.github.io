// Notes content now lives in the Journey submodule under notes/ (unified:
// JesseBlog Backend/Frontend/Courses + DevOps + MLs). Index imported
// directly; markdown loaded lazily as raw strings. Exported names keep the
// historical "blog*" spelling so callers don't churn, but the source is the
// Journey notes/ tree.

import notesIndexJson from "../journey-content/notes/index.json";

export interface BlogPost {
  slug: string; // "Backend/Java" | "MLs/Papers/AttentionIsAllYouNeed"
  section: string; // Backend | Frontend | Courses | DevOps | MLs
  subPath: string | null; // nested folder under the section (Papers, Classes)
  title: string;
}

export interface BlogIndex {
  count: number;
  sections: string[];
  posts: BlogPost[];
}

export const blogIndex = notesIndexJson as unknown as BlogIndex;

const notesFiles = import.meta.glob("../journey-content/notes/**/*.md", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

const NOTES_PREFIX = "../journey-content/notes/";

export async function loadBlogMarkdown(slug: string): Promise<string> {
  const key = NOTES_PREFIX + slug + ".md";
  const loader = notesFiles[key];
  if (!loader) throw new Error(`note not found: ${slug}`);
  return loader();
}

// section -> posts
export const blogBySection: Record<string, BlogPost[]> = (() => {
  const map: Record<string, BlogPost[]> = {};
  for (const p of blogIndex.posts) {
    (map[p.section] ??= []).push(p);
  }
  return map;
})();

export const blogSectionsSorted: string[] = [...blogIndex.sections].sort();
