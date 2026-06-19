import { FC, ReactNode } from "react";
import { Box } from "@mui/joy";

export const Chip: FC<{
  onClick?: () => void;
  active?: boolean;
  children: ReactNode;
}> = ({ onClick, active, children }) => (
  <Box
    component={onClick ? "button" : "span"}
    {...(onClick ? { type: "button" as const } : {})}
    className={onClick ? "cursor-target" : undefined}
    onClick={onClick}
    sx={{
      display: "inline-flex",
      alignItems: "center",
      px: 1.25,
      py: 0.5,
      border: "1px solid hsla(180,100%,70%,0.45)",
      borderRadius: 1,
      background: active
        ? "hsla(180,100%,70%,0.18)"
        : "hsla(180,100%,70%,0.06)",
      color: "inherit",
      font: "inherit",
      cursor: onClick ? "pointer" : "default",
      transition: "box-shadow .15s, background-color .15s",
      "&:hover": onClick
        ? {
            background: "hsla(180,100%,70%,0.18)",
            boxShadow: "0 0 12px hsla(180,100%,70%,0.5)",
          }
        : undefined,
      "&:focus-visible": onClick
        ? {
            outline: "none",
            boxShadow: "0 0 0 2px hsla(180,100%,70%,0.6)",
          }
        : undefined,
    }}
  >
    {children}
  </Box>
);
