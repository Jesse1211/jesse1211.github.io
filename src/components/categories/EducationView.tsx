import {
  Card,
  CardContent,
  Typography,
  CardCover,
  Stack,
  Box,
  CardOverflow,
  AspectRatio,
  Divider,
} from "@mui/joy";
import { FC } from "react";
import { Education } from "../../models/Categories";

export const EducationView: FC<{
  responseEducation: Education[];
}> = ({ responseEducation }) => {
  return (
    <Stack
      height={1}
      direction={"row"}
      overflow="auto"
      sx={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
      gap={4}
    >
      {responseEducation.map((education: Education, index) => (
        <Box
          sx={{ minWidth: { xs: 1, md: 0.47, lg: 0.32 } }}
          minHeight={1}
          key={index}
        >
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
        </Box>
      ))}
    </Stack>
  );
};
