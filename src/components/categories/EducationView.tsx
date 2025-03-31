import {
  CardContent,
  Typography,
  CardCover,
  Stack,
  CardOverflow,
  AspectRatio,
  Divider,
} from "@mui/joy";
import { FC } from "react";
import { Education } from "../../models/Categories";
import { CardContainer } from "./CardContainer";
import { stackStyles } from "../../styles";

export const EducationView: FC<{
  responseEducation: Education[];
}> = ({ responseEducation }) => {
  return (
    <Stack sx={stackStyles.categoryView}>
      {responseEducation.map((education: Education, key) => (
        <CardContainer
          key={key}
          cardView={
            <>
              <AspectRatio ratio="2">
                <CardOverflow>
                  <CardCover style={{ display: "contents" }}>
                    <img
                      src={education.Image}
                      loading="lazy"
                      style={{ width: "auto" }}
                    />
                  </CardCover>
                </CardOverflow>
              </AspectRatio>
              <CardContent sx={{ alignItems: "center" }}>
                <Typography level="body-md" fontWeight="lg">
                  {education.School}
                </Typography>
                <Typography level="body-sm" fontWeight="lg">
                  {education.Major}
                </Typography>
              </CardContent>
              <CardOverflow>
                <Divider inset="context" />
                <Stack height="70px" justifyContent="center">
                  <Typography level="body-sm" fontWeight="md">
                    GPA: {education.Grade}
                  </Typography>

                  <Typography level="body-sm" fontWeight="md">
                    {education.StartDate} - {education.EndDate}
                  </Typography>
                </Stack>
              </CardOverflow>
            </>
          }
        />
      ))}
    </Stack>
  );
};
