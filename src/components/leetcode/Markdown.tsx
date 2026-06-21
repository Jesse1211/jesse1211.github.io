import { FC, ReactNode } from "react";
import { Box } from "@mui/joy";

// Minimal, dependency-free markdown renderer good enough for the migrated
// guides + blog posts: headings, code fences, blockquotes, lists, inline
// `code`, **bold**, and paragraphs. Not a full CommonMark implementation —
// just the subset these documents use.

const inline = (text: string): ReactNode[] => {
  const nodes: ReactNode[] = [];
  // split on `code` and **bold**
  const re = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("`")) {
      nodes.push(
        <Box
          key={k++}
          component="code"
          sx={{
            fontFamily: "inherit",
            background: "hsla(180,100%,70%,0.10)",
            borderRadius: "3px",
            px: 0.5,
            color: "hsla(180,100%,85%,0.95)",
          }}
        >
          {tok.slice(1, -1)}
        </Box>,
      );
    } else {
      nodes.push(
        <Box key={k++} component="strong" sx={{ color: "hsla(180,100%,85%,1)" }}>
          {tok.slice(2, -2)}
        </Box>,
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
};

export const Markdown: FC<{ source: string }> = ({ source }) => {
  // strip YAML front-matter
  const body = source.replace(/^---\n[\s\S]*?\n---\n?/, "");
  const lines = body.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // code fence
    if (line.trim().startsWith("```")) {
      const lang = line.trim().slice(3).trim();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      blocks.push(
        <Box
          key={key++}
          component="pre"
          sx={{
            background: "hsla(240,55%,4%,0.6)",
            border: "1px solid hsla(180,100%,70%,0.15)",
            borderRadius: "6px",
            p: 1.2,
            my: 1,
            overflowX: "auto",
            fontSize: "0.9em",
            color: "hsla(180,30%,88%,0.95)",
            whiteSpace: "pre",
          }}
        >
          {lang && (
            <Box
              component="span"
              className="term-dim"
              sx={{ display: "block", fontSize: "0.8em", mb: 0.5 }}
            >
              {lang}
            </Box>
          )}
          {buf.join("\n")}
        </Box>,
      );
      continue;
    }

    // heading
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      blocks.push(
        <Box
          key={key++}
          sx={{
            fontWeight: 700,
            fontSize: `${Math.max(1, 1.5 - (level - 1) * 0.12)}em`,
            color: "hsla(180,100%,82%,1)",
            mt: 1.5,
            mb: 0.5,
          }}
        >
          {inline(h[2])}
        </Box>,
      );
      i++;
      continue;
    }

    // blockquote (one or more consecutive > lines)
    if (line.startsWith(">")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      blocks.push(
        <Box
          key={key++}
          sx={{
            borderLeft: "2px solid hsla(180,100%,70%,0.4)",
            pl: 1.5,
            my: 1,
            color: "hsla(180,30%,85%,0.85)",
            whiteSpace: "pre-wrap",
          }}
        >
          {buf.map((b, j) => (
            <Box key={j}>{inline(b) }</Box>
          ))}
        </Box>,
      );
      continue;
    }

    // list (consecutive - or * lines)
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <Box key={key++} component="ul" sx={{ pl: 2.5, my: 0.5 }}>
          {items.map((it, j) => (
            <Box key={j} component="li" sx={{ mb: 0.3 }}>
              {inline(it)}
            </Box>
          ))}
        </Box>,
      );
      continue;
    }

    // horizontal rule
    if (/^---+$/.test(line.trim())) {
      blocks.push(
        <Box
          key={key++}
          sx={{ borderTop: "1px dashed hsla(180,100%,70%,0.18)", my: 1.2 }}
        />,
      );
      i++;
      continue;
    }

    // blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // paragraph (gather until blank)
    const buf: string[] = [];
    while (i < lines.length && lines[i].trim() !== "" && !/^(#{1,6}\s|>|```|\s*[-*]\s)/.test(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    blocks.push(
      <Box key={key++} sx={{ my: 0.6, whiteSpace: "pre-wrap" }}>
        {inline(buf.join("\n"))}
      </Box>,
    );
  }

  return <Box sx={{ lineHeight: 1.6 }}>{blocks}</Box>;
};
