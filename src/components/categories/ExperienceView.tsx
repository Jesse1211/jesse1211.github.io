import {
  Typography,
  Stack,
  CardOverflow,
} from "@mui/joy";
import { FC } from "react";
import { Experience } from "../../models/Categories";
import { CardContainer } from "./CardContainer";
import { cardStyles, stackStyles } from "../../styles";
import { DescriptionModal } from "../DescriptionModal";

export const ExperienceView: FC<{
  responseExperience: Experience[];
}> = ({ responseExperience }) => {
  return (
    <Stack sx={stackStyles.categoryView}>
      {responseExperience.map((experience, index) => (
        <CardContainer
          key={index}
          logoSrc={experience.Image}
          metaDataCardView={
            <CardOverflow sx={cardStyles.cardOverflow}>
              <Typography level="body-md" fontWeight="lg">
                {experience.Company}
              </Typography>

              <Typography level="body-sm" fontWeight="lg">
                {experience.Title}
              </Typography>

              <Typography level="body-sm" fontWeight="md">
                {experience.StartDate} - {experience.EndDate}
              </Typography>

              <Typography level="body-sm" fontWeight="md">
                {experience.Location}
              </Typography>
            </CardOverflow>
          }
          additionalCardView={
            <CardOverflow sx={cardStyles.cardOverflow}>
              <Typography level="body-sm" fontWeight="md">
                {experience.Description}
              </Typography>
              <DescriptionModal
                brief={experience.Brief}
                link={experience.Link}
              />
            </CardOverflow>
          }
        />
      ))}
    </Stack>
  );
};
