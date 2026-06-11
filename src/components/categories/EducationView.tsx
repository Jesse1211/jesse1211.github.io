import { FC, Fragment } from "react";
import { Box, Stack } from "@mui/joy";
import { Education } from "../../models/Categories";
import { GlassPanel, Prompt } from "../terminal";
import { useLocation } from "../../state/LocationContext";
import { educationSlug } from "../../state/locationSlug";
import { EducationRow } from "./EducationRow";
import { EducationDetail } from "./EducationDetail";

export const EducationView: FC<{ responseEducation: Education[] }> = ({
  responseEducation,
}) => {
  const { toggle, isExpanded } = useLocation();
  return (
    <Stack spacing={2}>
      <GlassPanel glow="hover">
        <Prompt>
          <Box component="span">ls -la education/</Box>
        </Prompt>
        <Box sx={{ mt: 1 }}>
          {responseEducation.map((e, i) => {
            const slug = educationSlug(e, i);
            const open = isExpanded("education", slug);
            return (
              <Fragment key={slug}>
                <EducationRow
                  data={e}
                  slug={slug}
                  expanded={open}
                  onToggle={() => toggle("education", slug)}
                />
                {open && (
                  <Box sx={{ pl: { xs: 1, md: 3 }, py: 1 }}>
                    <EducationDetail data={e} slug={slug} />
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
