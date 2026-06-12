import { FC, Fragment } from "react";
import { Box } from "@mui/joy";
import { Experience } from "../../models/Categories";
import { useLocation } from "../../state/LocationContext";
import { experienceSlug } from "../../state/locationSlug";
import { ExperienceRow } from "./ExperienceRow";
import { ExperienceDetail } from "./ExperienceDetail";

export const ExperienceView: FC<{
  entryId: string;
  responseExperience: Experience[];
}> = ({ entryId, responseExperience }) => {
  const { toggle, isExpanded } = useLocation();
  return (
    <Box>
      <Box className="term-dim" sx={{ px: 1.25, pb: 0.5 }}>
        total {responseExperience.length}
      </Box>
      {responseExperience.map((e, i) => {
        const slug = experienceSlug(e, i);
        const open = isExpanded(entryId, "experience", slug);
        return (
          <Fragment key={slug}>
            <ExperienceRow
              data={e}
              slug={slug}
              index={i}
              expanded={open}
              onToggle={() => toggle(entryId, "experience", slug)}
            />
            {open && <ExperienceDetail data={e} />}
          </Fragment>
        );
      })}
    </Box>
  );
};
