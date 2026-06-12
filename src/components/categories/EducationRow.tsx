import { FC } from "react";
import { Box } from "@mui/joy";
import { Education } from "../../models/Categories";

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
  width: "100%",
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

export const EducationRow: FC<{
  data: Education;
  slug: string;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}> = ({ data, slug, index, expanded, onToggle }) => (
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
    <Box component="span">{data.School}</Box>
    <Box component="span" className="term-accent" sx={{ textAlign: "right" }}>
      {expanded ? "▾" : "▸"}
    </Box>
  </Box>
);
