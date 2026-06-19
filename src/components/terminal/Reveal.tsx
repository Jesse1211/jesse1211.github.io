import { FC, ReactNode, useLayoutEffect, useState } from "react";
import { Box } from "@mui/joy";

// Reveals children after a delay.
//
//   mode="expand" (default): children grow from height 0 to their
//   natural height so newly-appended history "pushes down" the layout
//   rather than popping. Opacity/blur word reveal is handled separately
//   by ScrollReveal (scroll-driven); this component is layout-only.
//
//   mode="fade": children always occupy their layout box; only opacity
//   transitions. Used for the trailing active prompt.
export const Reveal: FC<{
  delayMs: number;
  durationMs?: number;
  mode?: "expand" | "fade";
  children: ReactNode;
}> = ({ delayMs, durationMs = 260, mode = "expand", children }) => {
  const [visible, setVisible] = useState(delayMs <= 0);
  useLayoutEffect(() => {
    if (delayMs <= 0) {
      setVisible(true);
      return;
    }
    setVisible(false);
    const t = window.setTimeout(() => setVisible(true), delayMs);
    return () => window.clearTimeout(t);
  }, [delayMs]);

  if (mode === "fade") {
    return (
      <Box
        sx={{
          opacity: visible ? 1 : 0,
          transition: visible ? `opacity ${durationMs}ms ease` : "none",
        }}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        overflow: "hidden",
        maxHeight: visible ? "4000px" : "0px",
        transition: `max-height ${durationMs}ms cubic-bezier(.2,.7,.2,1)`,
      }}
    >
      {children}
    </Box>
  );
};
