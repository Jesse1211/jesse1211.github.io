import { FC, useContext } from "react";
import { Box, Stack } from "@mui/joy";
import { PortfolioContext } from "./PortfolioContext";

export const Navigation: FC = () => {
  const { $locale, onLocaleChange } = useContext(PortfolioContext);
  const Item: FC<{ value: "en-US" | "zh-CN"; label: string }> = ({
    value,
    label,
  }) => {
    const active = $locale === value;
    return (
      <Box
        component="button"
        type="button"
        onClick={() => onLocaleChange(value)}
        sx={{
          background: "none",
          border: 0,
          padding: 0,
          font: "inherit",
          cursor: "pointer",
          color: active ? "hsla(180,100%,80%,1)" : "hsla(180,30%,85%,0.55)",
          fontWeight: active ? 700 : 400,
          "&:hover": { color: "hsla(180,100%,80%,1)" },
          "&:focus-visible": {
            outline: "none",
            boxShadow: "0 0 0 2px hsla(180,100%,70%,0.6)",
          },
        }}
      >
        {label}
      </Box>
    );
  };
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      className="term-glass term-mono"
      sx={{
        position: "fixed",
        top: 12,
        right: 12,
        zIndex: 10,
        px: 1.5,
        py: 0.5,
        fontSize: 13,
      }}
    >
      <Box component="span" sx={{ color: "hsla(180,30%,85%,0.55)" }}>
        [
      </Box>
      <Item value="en-US" label="EN" />
      <Box component="span" sx={{ color: "hsla(180,30%,85%,0.55)" }}>
        |
      </Box>
      <Item value="zh-CN" label="中" />
      <Box component="span" sx={{ color: "hsla(180,30%,85%,0.55)" }}>
        ]
      </Box>
    </Stack>
  );
};
