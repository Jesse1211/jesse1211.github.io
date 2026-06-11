import { FC, Fragment } from "react";
import { Box, Stack } from "@mui/joy";
import { Experience } from "../../models/Categories";
import { GlassPanel, Prompt } from "../terminal";
import { useLocation } from "../../state/LocationContext";
import { experienceSlug } from "../../state/locationSlug";
import { ExperienceRow } from "./ExperienceRow";
import { ExperienceDetail } from "./ExperienceDetail";

export const ExperienceView: FC<{ responseExperience: Experience[] }> = ({
  responseExperience,
}) => {
  const { toggle, isExpanded } = useLocation();
  return (
    <Stack spacing={2}>
      <GlassPanel glow="hover">
        <Prompt>
          <Box component="span">ls -la experience/</Box>
        </Prompt>
        <Box sx={{ mt: 1 }}>
          {responseExperience.map((e, i) => {
            const slug = experienceSlug(e, i);
            const open = isExpanded("experience", slug);
            return (
              <Fragment key={slug}>
                <ExperienceRow
                  data={e}
                  slug={slug}
                  expanded={open}
                  onToggle={() => toggle("experience", slug)}
                />
                {open && (
                  <Box sx={{ pl: { xs: 1, md: 3 }, py: 1 }}>
                    <ExperienceDetail data={e} slug={slug} />
                  </Box>
                )}
              </Fragment>
            );
          })}
        </Box>
      </GlassPanel>
    </Stack>
  );
};
