// Loads migrated JesseBlog content (src/blog-content). Markdown is loaded
// lazily as raw strings; the index is imported directly.

import blogIndexJson from "../blog-content/index.json";

export interface BlogPost {
  slug: string; // "Backend/Java"
  section: string; // Backend | Frontend | Courses
  title: string;
  categories: string[];
}

export interface BlogIndex {
  count: number;
  sections: string[];
  posts: BlogPost[];
}

export const blogIndex = blogIndexJson as unknown as BlogIndex;

const blogFiles = import.meta.glob("../blog-content/**/*.md", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

const BLOG_PREFIX = "../blog-content/";

export async function loadBlogMarkdown(slug: string): Promise<string> {
  const key = BLOG_PREFIX + slug + ".md";
  const loader = blogFiles[key];
  if (!loader) throw new Error(`blog post not found: ${slug}`);
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
