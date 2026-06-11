import { FC } from "react";
import { Box, Stack } from "@mui/joy";

const dotColors = ["#ff5f57", "#febc2e", "#28c840"] as const;

export const TitleBar: FC<{ label: string }> = ({ label }) => (
  <Stack
    direction="row"
    spacing={1}
    alignItems="center"
    sx={{
      px: 1.5,
      py: 1,
      borderBottom: "1px solid hsla(180,100%,70%,0.25)",
      fontFamily: "inherit",
      fontSize: 12,
      color: "hsla(180, 30%, 85%, 0.7)",
    }}
  >
    <Stack direction="row" spacing={0.75}>
      {dotColors.map((c) => (
        <Box
          key={c}
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: c,
            opacity: 0.85,
          }}
        />
      ))}
    </Stack>
    <Box sx={{ ml: 1, letterSpacing: "0.5px" }}>{label}</Box>
  </Stack>
);
