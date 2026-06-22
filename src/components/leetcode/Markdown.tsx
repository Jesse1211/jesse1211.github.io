import { FC } from "react";
import { Box } from "@mui/joy";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import type { Components } from "react-markdown";

// Full GitHub-Flavored-Markdown rendering (react-markdown + remark-gfm):
// tables, ordered/nested lists, task lists, strikethrough, fenced code, etc.
// rehype-raw lets inline HTML like <br> (used inside table cells) render.
// The `components` map skins every element in the terminal/glass aesthetic
// so output matches the rest of the site. Front-matter is stripped before
// parsing (the loaders keep it, but it's not display content).

const ACCENT = "hsla(180,100%,82%,1)";
const DIM = "hsla(180,20%,55%,0.85)";
const BASE = "hsla(180,30%,88%,0.95)";
const LINE = "hsla(180,100%,70%,0.18)";

const components: Components = {
  h1: ({ children }) => (
    <Box sx={{ fontWeight: 700, fontSize: "1.5em", color: ACCENT, mt: 1.5, mb: 0.5 }}>
      {children}
    </Box>
  ),
  h2: ({ children }) => (
    <Box sx={{ fontWeight: 700, fontSize: "1.3em", color: ACCENT, mt: 1.4, mb: 0.5 }}>
      {children}
    </Box>
  ),
  h3: ({ children }) => (
    <Box sx={{ fontWeight: 700, fontSize: "1.12em", color: ACCENT, mt: 1.2, mb: 0.4 }}>
      {children}
    </Box>
  ),
  h4: ({ children }) => (
    <Box sx={{ fontWeight: 700, fontSize: "1em", color: ACCENT, mt: 1, mb: 0.3 }}>
      {children}
    </Box>
  ),
  h5: ({ children }) => (
    <Box sx={{ fontWeight: 700, color: ACCENT, mt: 1, mb: 0.3 }}>{children}</Box>
  ),
  h6: ({ children }) => (
    <Box sx={{ fontWeight: 700, color: DIM, mt: 1, mb: 0.3 }}>{children}</Box>
  ),
  p: ({ children }) => <Box sx={{ my: 0.6, lineHeight: 1.65 }}>{children}</Box>,
  strong: ({ children }) => (
    <Box component="strong" sx={{ color: ACCENT, fontWeight: 700 }}>
      {children}
    </Box>
  ),
  em: ({ children }) => <Box component="em">{children}</Box>,
  del: ({ children }) => (
    <Box component="del" sx={{ color: DIM }}>
      {children}
    </Box>
  ),
  a: ({ children, href }) => (
    <Box
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{ color: ACCENT, textDecoration: "underline dotted" }}
    >
      {children}
    </Box>
  ),
  ul: ({ children }) => (
    <Box component="ul" sx={{ pl: 2.5, my: 0.5 }}>
      {children}
    </Box>
  ),
  ol: ({ children }) => (
    <Box component="ol" sx={{ pl: 2.5, my: 0.5 }}>
      {children}
    </Box>
  ),
  li: ({ children }) => (
    <Box component="li" sx={{ mb: 0.3, lineHeight: 1.6 }}>
      {children}
    </Box>
  ),
  blockquote: ({ children }) => (
    <Box
      sx={{
        borderLeft: `2px solid ${ACCENT.replace("82%,1", "70%,0.45")}`,
        pl: 1.5,
        my: 1,
        color: "hsla(180,30%,85%,0.85)",
      }}
    >
      {children}
    </Box>
  ),
  hr: () => <Box sx={{ borderTop: `1px dashed ${LINE}`, my: 1.2 }} />,
  // inline code vs fenced code: react-markdown passes `inline`-ish info via
  // the absence of a language class / single-line content. We tint inline
  // code, and box multi-line fences.
  code: ({ children, className }) => {
    const text = String(children ?? "");
    const isBlock = className?.includes("language-") || text.includes("\n");
    if (!isBlock) {
      return (
        <Box
          component="code"
          sx={{
            fontFamily: "inherit",
            background: "hsla(180,100%,70%,0.10)",
            borderRadius: "3px",
            px: 0.5,
            color: "hsla(180,100%,85%,0.95)",
          }}
        >
          {text}
        </Box>
      );
    }
    return (
      <Box
        component="code"
        sx={{ fontFamily: "inherit", whiteSpace: "pre", color: BASE }}
      >
        {text.replace(/\n$/, "")}
      </Box>
    );
  },
  pre: ({ children }) => (
    <Box
      component="pre"
      sx={{
        background: "hsla(240,55%,4%,0.6)",
        border: `1px solid ${LINE}`,
        borderRadius: "6px",
        p: 1.2,
        my: 1,
        overflowX: "auto",
        fontSize: "0.9em",
        color: BASE,
      }}
    >
      {children}
    </Box>
  ),
  table: ({ children }) => (
    <Box sx={{ overflowX: "auto", my: 1 }}>
      <Box
        component="table"
        sx={{
          borderCollapse: "collapse",
          width: "100%",
          fontSize: "0.9em",
          "& th, & td": {
            border: `1px solid ${LINE}`,
            px: 1,
            py: 0.6,
            textAlign: "left",
            verticalAlign: "top",
          },
          "& th": {
            background: "hsla(180,100%,70%,0.08)",
            color: ACCENT,
            fontWeight: 700,
          },
        }}
      >
        {children}
      </Box>
    </Box>
  ),
  br: () => <Box component="br" />,
  img: ({ src, alt }) => (
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={{ maxWidth: "100%", borderRadius: "4px", my: 1 }}
    />
  ),
};

export const Markdown: FC<{ source: string }> = ({ source }) => {
  const body = source.replace(/^---\n[\s\S]*?\n---\n?/, "");
  return (
    <Box sx={{ lineHeight: 1.6, wordBreak: "break-word" }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {body}
      </ReactMarkdown>
    </Box>
  );
};
