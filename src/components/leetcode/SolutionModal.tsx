import { FC, useEffect, useState } from "react";
import { Box, Stack } from "@mui/joy";
import { Chip } from "../terminal";
import { LessModal } from "./LessModal";
import { CodeBlock } from "./CodeBlock";
import {
  loadSolutionSource,
  solutionsById,
  solutionFileName,
} from "../../journey/data";
import type { Solution } from "../../journey/types";

// strip the leading strategy comment / package / imports so the code panel
// shows just the solution; the strategy comment is surfaced separately.
function stripPreamble(src: string): string {
  let s = src.replace(/^\uFEFF/, "");
  // drop leading blank lines, package, imports, and the first comment block
  const lines = s.split("\n");
  let i = 0;
  while (i < lines.length) {
    const t = lines[i].trim();
    if (t === "" || t.startsWith("package ") || t.startsWith("import ")) { i++; continue; }
    if (t.startsWith("/*")) {
      while (i < lines.length && !lines[i].includes("*/")) i++;
      i++;
      continue;
    }
    if (t.startsWith("//")) { i++; continue; }
    break;
  }
  s = lines.slice(i).join("\n").replace(/^\n+/, "");
  return s;
}

export const SolutionModal: FC<{
  solution: Solution;
  open: boolean;
  onClose: () => void;
  onSwitch?: (s: Solution) => void; // open a sibling solution
}> = ({ solution, open, onClose, onSwitch }) => {
  const [src, setSrc] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    setSrc(null);
    setErr(null);
    loadSolutionSource(solution.file)
      .then((s) => alive && setSrc(s))
      .catch((e) => alive && setErr(String(e)));
    return () => {
      alive = false;
    };
  }, [open, solution.file]);

  const siblings =
    solution.id != null
      ? (solutionsById[solution.id] ?? []).filter((s) => s.file !== solution.file)
      : [];

  const title = `$ less ${solution.topic}/${solutionFileName(solution)}`;
  const name = solution.nameFragment ? solution.nameFragment.trim() : "";

  return (
    <LessModal
      open={open}
      onClose={onClose}
      title={title}
      header={
        <Box>
          <Box className="term-accent" sx={{ fontWeight: 700 }}>
            #{solution.id ?? "?"} {name && `· ${name} `}· type: {solution.solutionType}
          </Box>
          {solution.originalFile && (
            <Box className="term-dim" sx={{ fontSize: "0.85em" }}>
              reclassified from {solution.originalFile}
            </Box>
          )}
        </Box>
      }
    >
      {solution.strategyComment && (
        <Box>
          <Box className="term-dim" sx={{ fontSize: "0.82em", mb: 0.3 }}>
            ── strategy ──
          </Box>
          <Box
            sx={{
              whiteSpace: "pre-wrap",
              color: "hsla(180,30%,86%,0.9)",
              borderLeft: "2px solid hsla(180,100%,70%,0.35)",
              pl: 1.5,
            }}
          >
            {solution.strategyComment}
          </Box>
        </Box>
      )}
      <Box>
        <Box className="term-dim" sx={{ fontSize: "0.82em", mb: 0.3 }}>
          ── code ──
        </Box>
        {err ? (
          <Box sx={{ color: "hsla(0,80%,70%,1)" }}>failed to load: {err}</Box>
        ) : src == null ? (
          <Box className="term-dim">loading…</Box>
        ) : (
          <CodeBlock code={stripPreamble(src)} />
        )}
      </Box>
      {siblings.length > 0 && (
        <Box>
          <Box className="term-dim" sx={{ fontSize: "0.82em", mb: 0.4 }}>
            also solved as:
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {siblings.map((s) => (
              <Chip key={s.file} onClick={() => onSwitch?.(s)}>
                $ less {s.solutionType}/{solutionFileName(s)}
              </Chip>
            ))}
          </Stack>
        </Box>
      )}
    </LessModal>
  );
};
