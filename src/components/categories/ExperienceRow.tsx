import { FC } from "react";
import { Box } from "@mui/joy";
import { Experience } from "../../models/Categories";

// On narrow screens the fixed-em columns exceed the panel width, so we
// let the row scroll horizontally inside this wrapper instead of being
// clipped (the panel body is overflowX:hidden). Desktop is wide enough
// that the row fits and no scrollbar appears.
const scrollerSx = {
  width: "100%",
  overflowX: "auto",
  overflowY: "hidden",
  scrollbarWidth: "thin",
  scrollbarColor: "hsla(180,100%,70%,0.4) transparent",
  WebkitOverflowScrolling: "touch",
} as const;

const rowSx = {
  display: "grid",
  gridTemplateColumns: "7em 2em 1.7em 14em 11em 1fr 1em",
  columnGap: "10px",
  alignItems: "center",
  px: 1.25,
  py: 0.5,
  borderLeft: "2px solid transparent",
  cursor: "pointer",
  transition: "background-color .12s, border-left-color .12s",
  textAlign: "left",
  background: "transparent",
  border: 0,
  color: "inherit",
  font: "inherit",
  // Keep intrinsic width so columns don't collapse; wrapper scrolls when
  // it exceeds the viewport.
  width: "100%",
  minWidth: "37em",
  "&:hover, &:focus-visible": {
    backgroundColor: "hsla(180,100%,70%,0.08)",
    borderLeftColor: "hsla(180,100%,70%,0.85)",
    outline: "none",
  },
  "&[aria-expanded='true']": {
    backgroundColor: "hsla(180,100%,70%,0.12)",
    borderLeftColor: "hsla(180,100%,70%,0.85)",
  },
} as const;

export const ExperienceRow: FC<{
  data: Experience;
  slug: string;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}> = ({ data, slug, index, expanded, onToggle }) => (
  <Box className="term-scroll" sx={scrollerSx}>
  <Box
    component="button"
    type="button"
    className="term-mono"
    aria-expanded={expanded}
    onClick={onToggle}
    sx={rowSx}
  >
    <Box component="span" className="term-accent">
      drwxr-xr-x
    </Box>
    <Box component="span" className="term-dim">
      {index + 1}
    </Box>
    <Box
      component="span"
      sx={{
        width: 22,
        height: 22,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {data.Image && (
        <Box
          component="img"
          src={data.Image}
          alt=""
          loading="lazy"
          sx={{ width: 22, height: 22, objectFit: "contain" }}
        />
      )}
    </Box>
    <Box component="span">{slug}</Box>
    <Box component="span" className="term-dim">
      {data.StartDate} - {data.EndDate}
    </Box>
    <Box
      component="span"
      sx={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {data.Company}
      {data.Title && (
        <Box component="span" className="term-dim" sx={{ ml: 0.5 }}>
          · {data.Title}
        </Box>
      )}
    </Box>
    <Box component="span" className="term-accent" sx={{ textAlign: "right" }}>
      {expanded ? "▾" : "▸"}
    </Box>
  </Box>
  </Box>
);
