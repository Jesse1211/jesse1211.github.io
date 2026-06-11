import { FC, ReactNode } from "react";
import { Box } from "@mui/joy";
import type { SxProps } from "@mui/joy/styles/types";
import { TitleBar } from "./TitleBar";

export const GlassPanel: FC<{
  title?: string;
  glow?: "none" | "hover" | "active";
  children: ReactNode;
  sx?: SxProps;
}> = ({ title, glow = "hover", children, sx }) => {
  const glowShadow =
    glow === "active"
      ? "0 0 18px hsla(180,100%,70%,0.7)"
      : glow === "hover"
      ? "0 0 12px hsla(180,100%,70%,0.3)"
      : "none";
  return (
    <Box
      className="term-glass term-mono"
      sx={[
        {
          boxShadow: glowShadow,
          overflow: "hidden",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {title && <TitleBar label={title} />}
      <Box sx={{ p: { xs: 2, md: 2.5 } }}>{children}</Box>
    </Box>
  );
};
