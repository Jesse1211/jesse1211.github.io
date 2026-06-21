#!/usr/bin/env node
// Build blog-content/index.json from the migrated JesseBlog posts.
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));

function walk(d) {
  const out = [];
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (n.endsWith(".md")) out.push(p);
  }
  return out;
}

const posts = [];
for (const abs of walk(DIR).sort()) {
  const rel = abs.slice(DIR.length + 1).replace(/\\/g, "/"); // Backend/Java.md
  const section = rel.split("/")[0]; // Backend | Frontend | Courses
  const slug = rel.replace(/\.md$/, "");
  const src = readFileSync(abs, "utf8");
  const fm = src.match(/^---\n([\s\S]*?)\n---/);
  let title = rel.split("/").pop().replace(/\.md$/, "");
  const cats = [];
  if (fm) {
    const tm = fm[1].match(/^title:\s*(.+)$/m);
    if (tm) title = tm[1].trim();
    // collect "  - X" lines under categories:
    const catBlock = fm[1].match(/categories:\n((?:\s*-\s*.+\n?)+)/);
    if (catBlock) {
      for (const line of catBlock[1].split("\n")) {
        const m = line.match(/-\s*(.+)\s*$/);
        if (m) cats.push(m[1].trim());
      }
    }
  }
  posts.push({ slug, section, title, categories: cats });
}

const sections = [...new Set(posts.map((p) => p.section))].sort();
writeFileSync(
  join(DIR, "index.json"),
  JSON.stringify({ count: posts.length, sections, posts }, null, 2) + "\n",
);
console.log(`wrote blog index: ${posts.length} posts across ${sections.length} sections`);
