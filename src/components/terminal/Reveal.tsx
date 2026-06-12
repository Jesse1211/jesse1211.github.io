import { FC, ReactNode, useEffect, useState } from "react";
import { Box } from "@mui/joy";

// Renders children with opacity 0 → 1, mounted on a delay. Used to
// stagger newly-appended history entries one after another, and to
// hide the trailing active prompt until the typing/reveal sequence
// finishes.
export const Reveal: FC<{
  delayMs: number;
  children: ReactNode;
}> = ({ delayMs, children }) => {
  const [visible, setVisible] = useState(delayMs <= 0);
  useEffect(() => {
    // Reset to invisible whenever the delay changes (e.g. after the
    // user appends new history that pushes the tail further out).
    if (delayMs <= 0) {
      setVisible(true);
      return;
    }
    setVisible(false);
    const t = window.setTimeout(() => setVisible(true), delayMs);
    return () => window.clearTimeout(t);
  }, [delayMs]);
  return (
    <Box
      sx={{
        opacity: visible ? 1 : 0,
        transition: "opacity .15s ease",
      }}
    >
      {children}
    </Box>
  );
};
