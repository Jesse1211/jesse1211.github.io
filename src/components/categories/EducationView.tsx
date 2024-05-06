import {
  Card,
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

export const EducationView: FC<{
  responseEducation: Education[];
}> = ({ responseEducation }) => {
  return (
    <Stack
      direction={"row"}
      flexWrap={"wrap"}
      gap={4}
      justifyContent={"center"}
      overflow={"auto"}
    >
      {responseEducation.map((education: Education, index) => (
        <CardContainer
          cardView={
            <Card key={index} sx={{ height: 1 }} size="lg" variant="soft">
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

              <CardContent sx={{"align-items": "center"}}>
                <Typography level="body-md" fontWeight="lg">
                  {education.School}
                </Typography>
                <Typography level="body-sm" fontWeight="lg">
                  {education.Major}
                </Typography>
              </CardContent>

              <CardContent>
                {education.Expertise.length > 0 && (
                  <>
                    <Typography level="body-sm" fontWeight="lg">
                    👩🏻‍🔬 Expertise:
                    </Typography>
                    {education.Expertise.map((course, index) => (
                      <Typography level="body-sm" fontWeight="md" key={index}>
                        {course}
                      </Typography>
                    ))}
                  </>
                )}
              </CardContent>

              <CardOverflow>
                <Divider inset="context" />
                <Typography level="body-sm" fontWeight="md">
                  GPA: {education.Grade}
                </Typography>
                <Divider orientation="vertical" />

                <Typography level="body-sm" fontWeight="lg">
                  {education.StartDate} - {education.EndDate}
                </Typography>
              </CardOverflow>
            </Card>
          }
        />
      ))}
    </Stack>
  );
};
