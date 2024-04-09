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
    <Stack height={1} direction={"row"} flexWrap={"wrap"} gap={4} justifyContent={"center"}>
      {responseEducation.map((education: Education, index) => (
        <CardContainer
          cardView={
              <Card key={index} sx={{ height: 1 }} size="lg" variant="soft">
                <AspectRatio ratio="2">
                  <CardOverflow>
                    <CardCover>
                      <img src="./Cornell.jpg" loading="lazy" />
                    </CardCover>
                    <CardContent>
                      <Typography level="body-md" fontWeight="lg">
                        {education.School}
                      </Typography>
                      <Typography level="body-sm" fontWeight="lg">
                        Master of Engineer
                      </Typography>
                    </CardContent>
                  </CardOverflow>
                </AspectRatio>

                <CardContent>
                  {education.ReleventCourses.length > 0 && (
                    <>
                      <Typography level="body-sm" fontWeight="lg">
                        Relevent Courses:
                      </Typography>
                      {education.ReleventCourses.map((course, index) => (
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
                    GPA: {education.Grade} / 4.0
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
