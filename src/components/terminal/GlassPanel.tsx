import { FC, ReactNode, Ref } from "react";
import { Box } from "@mui/joy";
import type { SxProps } from "@mui/joy/styles/types";
import { TitleBar } from "./TitleBar";

export const GlassPanel: FC<{
  title?: string;
  glow?: "none" | "hover" | "active";
  children: ReactNode;
  sx?: SxProps;
  bodyRef?: Ref<HTMLDivElement>;
  onRed?: () => void;
  onYellow?: () => void;
  onGreen?: () => void;
}> = ({ title, glow = "hover", children, sx, bodyRef, onRed, onYellow, onGreen }) => {
  const glowShadow =
    glow === "active"
      ? "0 0 18px hsla(180,100%,70%,0.7)"
      : glow === "hover"
      ? "0 0 12px hsla(180,100%,70%,0.3)"
      : "none";
  return (
    <Box
      className="term-mono"
      sx={[
        {
          background: "hsla(240, 55%, 8%, 0.35)",
          backdropFilter: "blur(32px) saturate(140%)",
          WebkitBackdropFilter: "blur(32px) saturate(140%)",
          border: "1px solid hsla(180,100%,70%,0.45)",
          borderRadius: "4px",
          color: "hsla(180,30%,92%,0.95)",
          boxShadow: glowShadow,
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {title && (
        <TitleBar
          label={title}
          onRed={onRed}
          onYellow={onYellow}
          onGreen={onGreen}
        />
      )}
      <Box
        ref={bodyRef}
        className="term-scroll"
        sx={{
          p: { xs: 2, md: 2.5 },
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
