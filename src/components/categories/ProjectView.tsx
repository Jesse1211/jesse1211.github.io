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
import { Project } from "../../models/Categories";

export const ProjectView: FC<{
  responseProject?: Project[];
  error?: Error;
  busy?: boolean;
}> = ({responseProject, error, busy}) => {
  if (error) {
    return <Alert color="danger">{error.message}</Alert>;
  }

  if (busy) {
    return <CircularProgress />;
  }

  if (!responseProject) {
    return <Alert color="danger">Loading Projects</Alert>;
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
        },
      }}
    >
      {responseProject.map((project, index) => (
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
                {project.Company}
              </Typography>
              <Typography level="body-md" fontWeight="lg" textColor="#fff">
                {project.StartDate} to {project.EndDate}
              </Typography>
            </Stack>
            <Typography level="body-sm" fontWeight="lg" textColor="#fff">
              {/* Accomplishments: {project.Accomplishments.join(", ")} */}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};
