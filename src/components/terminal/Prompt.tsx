import { FC, ReactNode } from "react";
import { Box, Stack } from "@mui/joy";
import { Cursor } from "./Cursor";

const DIM = "hsla(180,30%,85%,0.65)";

// Render `jesse@portfolio:<path>$` as a non-interactive prefix.
const PathPrefix: FC<{ path: string }> = ({ path }) => (
  <Box component="span" sx={{ whiteSpace: "nowrap" }}>
    <Box component="span" className="term-accent">
      jesse@portfolio
    </Box>
    <Box component="span" sx={{ color: DIM }}>
      :
    </Box>
    <Box component="span" sx={{ color: "hsla(180,100%,80%,1)" }}>
      {path}
    </Box>
    <Box component="span" className="term-accent" sx={{ fontWeight: 700 }}>
      $
    </Box>
  </Box>
);

export const Prompt: FC<{
  children?: ReactNode;
  showCursor?: boolean;
  symbol?: string;
  path?: string; // when provided, renders jesse@portfolio:<path>$ instead of `symbol`
}> = ({ children, showCursor = false, symbol = "$", path }) => (
  <Stack
    direction="row"
    spacing={1}
    alignItems="baseline"
    sx={{ fontFamily: "inherit", flexWrap: "wrap" }}
  >
    {path !== undefined ? (
      <PathPrefix path={path} />
    ) : (
      <Box className="term-accent" sx={{ fontWeight: 700 }}>
        {symbol}
      </Box>
    )}
    <Box sx={{ flex: 1, wordBreak: "break-word", minWidth: 0 }}>
      {children}
      {showCursor && <Cursor />}
    </Box>
  </Stack>
);
