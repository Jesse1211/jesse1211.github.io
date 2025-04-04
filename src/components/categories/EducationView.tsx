import { Typography, Stack, CardOverflow } from "@mui/joy";
import { FC } from "react";
import { Education } from "../../models/Categories";
import { CardContainer } from "./CardContainer";
import { cardStyles, stackStyles } from "../../styles";

export const EducationView: FC<{
  responseEducation: Education[];
}> = ({ responseEducation }) => {
  return (
    <Stack sx={stackStyles.categoryView}>
      {responseEducation.map((education: Education, key) => (
        <CardContainer
          key={key}
          logoSrc={education.Image}
          metaDataCardView={
            <CardOverflow sx={cardStyles.cardOverflow}>
              <Typography level="body-md" fontWeight="lg">
                {education.School}
              </Typography>
              <Typography level="body-sm" fontWeight="lg">
                {education.Major}
              </Typography>
              <Typography level="body-sm" fontWeight="md">
                {"GPA: " + education.Grade}
              </Typography>

              <Typography level="body-sm" fontWeight="md">
                {education.StartDate} - {education.EndDate}
              </Typography>
            </CardOverflow>
          }
          additionalCardView={
            <CardOverflow sx={cardStyles.cardOverflow}>
              <Typography level="body-sm" fontWeight="lg">
                "{education.Description}"
              </Typography>
            </CardOverflow>
          }
        />
      ))}
    </Stack>
  );
};
