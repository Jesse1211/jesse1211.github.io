import { FC } from "react";
import { Box } from "@mui/joy";

export const KV: FC<{ k: string; v: string }> = ({ k, v }) => (
  <Box sx={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 1 }}>
    <Box className="term-accent">{k}</Box>
    <Box>{v}</Box>
  </Box>
);
