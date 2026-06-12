import { FC, Fragment } from "react";
import { Box } from "@mui/joy";
import { Education } from "../../models/Categories";
import { useLocation } from "../../state/LocationContext";
import { educationSlug } from "../../state/locationSlug";
import { EducationRow } from "./EducationRow";
import { EducationDetail } from "./EducationDetail";

export const EducationView: FC<{
  entryId: string;
  responseEducation: Education[];
}> = ({ entryId, responseEducation }) => {
  const { toggle, isExpanded } = useLocation();
  return (
    <Box>
      <Box className="term-dim" sx={{ px: 1.25, pb: 0.5 }}>
        total {responseEducation.length}
      </Box>
      {responseEducation.map((e, i) => {
        const slug = educationSlug(e, i);
        const open = isExpanded(entryId, "education", slug);
        return (
          <Fragment key={slug}>
            <EducationRow
              data={e}
              slug={slug}
              index={i}
              expanded={open}
              onToggle={() => toggle(entryId, "education", slug)}
            />
            {open && <EducationDetail data={e} />}
          </Fragment>
        );
      })}
    </Box>
  );
};
