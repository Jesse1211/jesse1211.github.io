// Palette + sx helpers for the glass-terminal UI.
// All values are listed in docs/superpowers/specs/2026-06-11-glass-terminal-redesign-design.md §2.

export const palette = {
  bg: "#0e0f43",
  glassBg: "hsla(240, 60%, 15%, 0.30)",
  glassBgOpaque: "hsla(240, 60%, 12%, 0.85)", // fallback when backdrop-filter is unsupported
  accent: "hsla(180, 100%, 70%, 0.85)",
  accentStrong: "hsla(180, 100%, 80%, 1)",
  accentDim: "hsla(180, 100%, 70%, 0.4)",
  text: "hsla(180, 30%, 92%, 0.95)",
  textDim: "hsla(180, 30%, 85%, 0.65)",
  danger: "hsla(0, 80%, 70%, 0.9)",
} as const;

export const shadows = {
  hover: "0 0 12px hsla(180,100%,70%,0.5)",
  active: "0 0 18px hsla(180,100%,70%,0.7)",
} as const;

export const fontStack =
  "'JetBrains Mono', 'Fira Code', 'Courier New', ui-monospace, monospace";

export const glassSx = {
  background: palette.glassBg,
  backdropFilter: "blur(16px) saturate(140%)",
  WebkitBackdropFilter: "blur(16px) saturate(140%)",
  border: `1px solid ${palette.accentDim}`,
  borderRadius: "4px",
  color: palette.text,
  fontFamily: fontStack,
} as const;
