import {
  Card,
  CardContent,
  Typography,
  CardCover,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/joy";
import { FC } from "react";
import { useEducationGetAll } from "../../hooks/useEducationGetAll";
import { Education } from "../../models/Categories";

export const EducationView: FC = () => {
  const { busy, responseEducation, error } = useEducationGetAll();
  console.log(responseEducation);
  if (error) {
    return <Alert color="danger">{error.message}</Alert>;
  }

  if (busy) {
    return <CircularProgress />;
  }

  if (!responseEducation) {
    return <Alert color="danger">No Educations</Alert>;
  }

  return (
    <>
      <Typography
        level="title-lg"
        fontWeight="lg"
        textColor="#fff"
        style={{
          color: "#889def",
        }}
      >
        Educations
      </Typography>
      {responseEducation.map((education: Education, index) => (
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
            <Typography level="body-sm" fontWeight="lg" textColor="#fff">
              Relevent Courses {education.ReleventCourses.join(", ")}
            </Typography>
            <Typography level="body-sm" fontWeight="lg" textColor="#fff">
              gpa: {education.Grade}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </>
  );
};
