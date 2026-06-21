import { FC, ReactNode } from "react";
import { Box } from "@mui/joy";

// Lightweight Java syntax highlighting — keyword/type/string/comment/number
// tinting only, no tokenizer dependency. Good enough for readable code in
// the terminal aesthetic.
const KEYWORDS = new Set([
  "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char",
  "class", "const", "continue", "default", "do", "double", "else", "enum",
  "extends", "final", "finally", "float", "for", "goto", "if", "implements",
  "import", "instanceof", "int", "interface", "long", "native", "new",
  "package", "private", "protected", "public", "return", "short", "static",
  "strictfp", "super", "switch", "synchronized", "this", "throw", "throws",
  "transient", "try", "void", "volatile", "while", "var", "true", "false",
  "null",
]);

const C = {
  keyword: "hsla(300,80%,78%,1)",
  type: "hsla(180,90%,78%,1)",
  string: "hsla(40,90%,72%,1)",
  comment: "hsla(180,20%,55%,0.8)",
  number: "hsla(140,70%,72%,1)",
  base: "hsla(180,30%,90%,0.95)",
};

function highlightLine(line: string, keyPrefix: string): ReactNode[] {
  // whole-line comment
  const ci = line.indexOf("//");
  let codePart = line;
  let commentPart = "";
  if (ci >= 0 && !/["']/.test(line.slice(0, ci))) {
    codePart = line.slice(0, ci);
    commentPart = line.slice(ci);
  }
  const out: ReactNode[] = [];
  // tokenize codePart on words / strings / numbers
  const re = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)'|\b\d+\b|[A-Za-z_]\w*|\s+|[^\sA-Za-z_])/g;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(codePart)) !== null) {
    const tok = m[0];
    let color: string | undefined;
    if (/^["']/.test(tok)) color = C.string;
    else if (/^\d+$/.test(tok)) color = C.number;
    else if (KEYWORDS.has(tok)) color = C.keyword;
    else if (/^[A-Z]\w*$/.test(tok)) color = C.type; // Capitalized => type-ish
    if (color) {
      out.push(
        <Box component="span" key={`${keyPrefix}-${k++}`} sx={{ color }}>
          {tok}
        </Box>,
      );
    } else {
      out.push(<span key={`${keyPrefix}-${k++}`}>{tok}</span>);
    }
  }
  if (commentPart) {
    out.push(
      <Box component="span" key={`${keyPrefix}-c`} sx={{ color: C.comment, fontStyle: "italic" }}>
        {commentPart}
      </Box>,
    );
  }
  return out;
}

export const CodeBlock: FC<{ code: string }> = ({ code }) => {
  const lines = code.replace(/\n$/, "").split("\n");
  return (
    <Box
      component="pre"
      sx={{
        background: "hsla(240,55%,4%,0.55)",
        border: "1px solid hsla(180,100%,70%,0.15)",
        borderRadius: "6px",
        p: 1.4,
        m: 0,
        overflowX: "auto",
        fontSize: "0.88em",
        lineHeight: 1.55,
        color: C.base,
      }}
    >
      {lines.map((ln, i) => (
        <Box key={i} sx={{ display: "flex" }}>
          <Box
            component="span"
            aria-hidden
            sx={{ width: "2.4em", flexShrink: 0, textAlign: "right", pr: 1.2, color: C.comment, userSelect: "none" }}
          >
            {i + 1}
          </Box>
          <Box component="span" sx={{ whiteSpace: "pre" }}>
            {highlightLine(ln, `l${i}`)}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
