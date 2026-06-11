import { FC } from "react";
import { Box } from "@mui/joy";
import { Experience } from "../../models/Categories";

export const ExperienceRow: FC<{
  data: Experience;
  slug: string;
  expanded: boolean;
  onToggle: () => void;
}> = ({ data, slug, expanded, onToggle }) => (
  <Box
    component="button"
    type="button"
    className="term-row term-mono"
    aria-expanded={expanded}
    onClick={onToggle}
  >
    <Box className="term-accent">drwx</Box>
    <Box>{slug}</Box>
    <Box className="term-dim">
      {data.StartDate} - {data.EndDate}
    </Box>
    <Box>
      {data.Company} {data.Title ? <span>· {data.Title}</span> : null}
    </Box>
  </Box>
);
