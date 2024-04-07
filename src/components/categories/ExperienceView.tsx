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
import { Experience } from "../../models/Categories";

export const ExperienceView: FC<{
  responseExperience?: Experience[];
  error?: Error;
  busy?: boolean;
}> = ({responseExperience, error, busy}) => {
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
    </Stack>
  );
};
