import { FC, ReactNode, Ref, CSSProperties } from "react";
import { Box } from "@mui/joy";
import type { SxProps } from "@mui/joy/styles/types";
import { TitleBar } from "./TitleBar";
import ElectricBorder from "../effects/ElectricBorder";

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
  const sxFlex = { flex: 1, minHeight: 0 };
  return (
    <ElectricBorder
      color="hsl(180, 100%, 70%)"
      speed={1}
      chaos={0.18}
      borderRadius={4}
      style={{ display: "flex", flexDirection: "column", minHeight: 0, ...(sxFlex as CSSProperties) }}
    >
      <Box
        className="term-mono"
        sx={[
          {
            background: "transparent",
            border: "1px solid hsla(180,100%,70%,0.18)",
            borderRadius: "4px",
            color: "hsla(180,30%,92%,0.95)",
            boxShadow: glowShadow,
            overflow: "hidden",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            flex: 1,
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
    </ElectricBorder>
  );
};
