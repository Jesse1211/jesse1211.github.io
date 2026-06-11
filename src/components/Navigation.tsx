import { FC, useContext } from "react";
import { Box, Stack } from "@mui/joy";
import { PortfolioContext } from "./PortfolioContext";
import { LocalType } from "../models/Categories";

const ItemSx = (active: boolean) => ({
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
});

const SEPARATOR_SX = { color: "hsla(180,30%,85%,0.55)" };

const LangButton: FC<{
  value: LocalType;
  label: string;
  active: boolean;
  onSelect: (v: LocalType) => void;
}> = ({ value, label, active, onSelect }) => (
  <Box component="button" type="button" onClick={() => onSelect(value)} sx={ItemSx(active)}>
    {label}
  </Box>
);

export const Navigation: FC = () => {
  const { $locale, onLocaleChange } = useContext(PortfolioContext);
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
      <Box component="span" sx={SEPARATOR_SX}>[</Box>
      <LangButton
        value="en-US"
        label="EN"
        active={$locale === "en-US"}
        onSelect={onLocaleChange}
      />
      <Box component="span" sx={SEPARATOR_SX}>|</Box>
      <LangButton
        value="zh-CN"
        label="中"
        active={$locale === "zh-CN"}
        onSelect={onLocaleChange}
      />
      <Box component="span" sx={SEPARATOR_SX}>]</Box>
    </Stack>
  );
};
