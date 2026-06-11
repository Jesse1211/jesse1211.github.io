import { FC, ReactNode } from "react";
import { Box, Stack } from "@mui/joy";
import { Cursor } from "./Cursor";

export const Prompt: FC<{
  children?: ReactNode;
  showCursor?: boolean;
  symbol?: string;
}> = ({ children, showCursor = false, symbol = "$" }) => (
  <Stack
    direction="row"
    spacing={1}
    alignItems="baseline"
    sx={{ fontFamily: "inherit" }}
  >
    <Box className="term-accent" sx={{ fontWeight: 700 }}>
      {symbol}
    </Box>
    <Box sx={{ flex: 1, wordBreak: "break-word" }}>
      {children}
      {showCursor && <Cursor />}
    </Box>
  </Stack>
);
