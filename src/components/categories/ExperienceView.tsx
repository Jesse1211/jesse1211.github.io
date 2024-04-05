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
import { useExperienceGetAll } from "../../hooks/useExperienceGetAll";

export const ExperienceView: FC = () => {
  const { busy, responseExperience, error } = useExperienceGetAll();
  console.log(responseExperience);
  if (error) {
    return <Alert color="danger">{error.message}</Alert>;
  }

  if (busy) {
    return <CircularProgress />;
  }

  if (!responseExperience) {
    return <Alert color="danger">Loading Experiences</Alert>;
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
        Experiences
      </Typography>
      {responseExperience.map((experience, index) => (
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
                {experience.Company}
              </Typography>
              <Typography level="body-md" fontWeight="lg" textColor="#fff">
                {experience.StartDate} to {experience.EndDate}
              </Typography>
            </Stack>
            <Typography level="body-sm" fontWeight="lg" textColor="#fff">
              Accomplishments: {experience.Accomplishments.join(", ")}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </>
  );
};
