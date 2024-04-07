import {
  Card,
  CardContent,
  Typography,
  CardCover,
  Stack,
  Box,
} from "@mui/joy";
import { FC } from "react";
import { Education } from "../../models/Categories";

export const EducationView: FC<{
  responseEducation: Education[];
}> = ({responseEducation}) => {

  return (
    <Stack
      flexDirection={"row"}
      maxWidth={1}
      minHeight={1}
      overflow="auto"
      gap={5}
      sx={{
        "&::-webkit-scrollbar": {
          display: "none",
        }
      }}
    >
      {responseEducation.map((education: Education, index) => (
        <Box minWidth={350} key={index}>
          <Card key={index}>
            <CardCover>
              <img
                src="./Cornell.jpg"
                loading="lazy"
                style={{ filter: "brightness(0.5)" }}
              />
            </CardCover>

            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Typography level="body-md" fontWeight="lg" textColor="#fff">
                  {education.School}
                </Typography>
                <Typography level="body-md" fontWeight="lg" textColor="#fff">
                  {education.StartDate} to {education.EndDate}
                </Typography>
              </Stack>
              {education.ReleventCourses.length > 0 && (
                <Typography level="body-sm" fontWeight="lg" textColor="#fff">
                  Relevent Courses {education.ReleventCourses.join(", ")}
                </Typography>
              )}
              <Typography level="body-sm" fontWeight="lg" textColor="#fff">
                gpa: {education.Grade}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Stack>
  );
};
