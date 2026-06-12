import { FC } from "react";
import { Box, Stack } from "@mui/joy";

type DotHandlers = {
  onRed?: () => void;
  onYellow?: () => void;
  onGreen?: () => void;
};

const DOT_COLORS = ["#ff5f57", "#febc2e", "#28c840"] as const;

export const TitleBar: FC<{ label: string } & DotHandlers> = ({
  label,
  onRed,
  onYellow,
  onGreen,
}) => {
  const handlers: (undefined | (() => void))[] = [onRed, onYellow, onGreen];
  const titles = ["close", "minimize", "fullscreen"];
  return (
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
        {DOT_COLORS.map((c, i) => {
          const handler = handlers[i];
          return (
            <Box
              key={c}
              component={handler ? "button" : "div"}
              type={handler ? "button" : undefined}
              onClick={handler}
              aria-label={handler ? titles[i] : undefined}
              title={handler ? titles[i] : undefined}
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: c,
                opacity: 0.85,
                border: 0,
                p: 0,
                cursor: handler ? "pointer" : "default",
                transition: "opacity .12s, transform .12s",
                "&:hover": handler
                  ? { opacity: 1, transform: "scale(1.1)" }
                  : undefined,
                "&:focus-visible": handler
                  ? {
                      outline: "none",
                      boxShadow: "0 0 0 2px hsla(180,100%,70%,0.6)",
                    }
                  : undefined,
              }}
            />
          );
        })}
      </Stack>
      <Box sx={{ ml: 1, letterSpacing: "0.5px" }}>{label}</Box>
    </Stack>
  );
};
