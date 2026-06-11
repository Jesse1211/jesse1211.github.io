import { FC } from "react";
import { Box } from "@mui/joy";
import { Education } from "../../models/Categories";

export const EducationRow: FC<{
  data: Education;
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
    <Box>{data.School}</Box>
  </Box>
);
