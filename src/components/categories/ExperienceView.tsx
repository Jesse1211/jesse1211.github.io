import {
  CardContent,
  Typography,
  CardCover,
  Stack,
  AspectRatio,
  CardOverflow,
  Divider,
} from "@mui/joy";
import { FC } from "react";
import { Experience } from "../../models/Categories";
import { CardContainer } from "./CardContainer";

export const ExperienceView: FC<{
  responseExperience: Experience[];
}> = ({ responseExperience }) => {
  return (
    <Stack
      direction={"row"}
      flexWrap={"wrap"}
      gap={4}
      justifyContent={"center"}
      overflow={"auto"}
      paddingBottom={4}
    >
      {responseExperience.map((experience, index) => (
        <CardContainer
          key={index}
          cardView={
            <>
              <AspectRatio ratio="2">
                <CardOverflow>
                  <CardCover style={{ display: "contents" }}>
                    <img
                      src={experience.Image}
                      loading="lazy"
                      style={{ width: "auto" }}
                    />
                  </CardCover>
                </CardOverflow>
              </AspectRatio>
              <CardContent sx={{ alignItems: "center" }}>
                <Typography level="body-md" fontWeight="lg">
                  {experience.Company}
                </Typography>
              </CardContent>
              <CardOverflow >
                <Divider inset="context" />

                <Typography level="body-sm" fontWeight="md" marginTop={"5%"}>
                  {experience.Title}
                </Typography>

                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography level="body-sm" fontWeight="md">
                    {experience.StartDate} - {experience.EndDate}
                  </Typography>

                  <Typography level="body-sm" fontWeight="md">
                    {experience.Location}
                  </Typography>
                </Stack>
              </CardOverflow>
            </>
          }
          description={experience.Accomplishments}
          link={experience.link}
        />
      ))}
    </Stack>
  );
};
