import { FC, ReactNode, useLayoutEffect, useState } from "react";
import { Box } from "@mui/joy";

// Reveals children after a delay.
//
//   mode="expand" (default): children grow from height 0 to their
//   natural height while fading in. Used for newly-appended history
//   entries so they "push down" the layout rather than pop.
//
//   mode="fade": children always occupy their full layout box;
//   only opacity transitions. Use this for the trailing active
//   prompt, where collapsing/expanding the height would cause the
//   visible terminal content to jump every time history grows.
export const Reveal: FC<{
  delayMs: number;
  durationMs?: number;
  mode?: "expand" | "fade";
  children: ReactNode;
}> = ({ delayMs, durationMs = 260, mode = "expand", children }) => {
  const [visible, setVisible] = useState(delayMs <= 0);
  // useLayoutEffect runs synchronously before the browser paints, so
  // when delayMs jumps from 0 to a positive value (history grew), we
  // flip visible→false BEFORE the user can see the previous "true"
  // state painted. Avoids a brief flash of the trailing prompt.
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
          // Fade IN with a transition; fade OUT (when delayMs increases
          // again on new history) is instant so the user never sees a
          // brief visible-then-gone flash of the trailing prompt.
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
        opacity: visible ? 1 : 0,
        maxHeight: visible ? "4000px" : "0px",
        transition: visible
          ? `max-height ${durationMs}ms cubic-bezier(.2,.7,.2,1), opacity ${Math.round(durationMs * 0.7)}ms ease ${Math.round(durationMs * 0.15)}ms`
          : `max-height ${durationMs}ms cubic-bezier(.2,.7,.2,1), opacity ${Math.round(durationMs * 0.5)}ms ease`,
      }}
    >
      {children}
    </Box>
  );
};
