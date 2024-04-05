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
import { useProjectGetAll } from "../../hooks/useProjectGetAll";

export const ProjectView: FC = () => {
  const { busy, responseProject, error } = useProjectGetAll();
  console.log(responseProject);
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
    <>
      <Typography
        level="title-lg"
        fontWeight="lg"
        textColor="#fff"
        style={{
          color: "#889def",
        }}
      >
        Projects
      </Typography>
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
    </>
  );
};
