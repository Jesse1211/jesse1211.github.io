import {
  Card,
  CardContent,
  Typography,
  CardCover,
  Stack,
  Alert,
  CircularProgress,
  AspectRatio,
  CardOverflow,
  Divider,
} from "@mui/joy";
import { FC, useState } from "react";
import { Project } from "../../models/Categories";
import { CardContainer } from "./CardContainer";

export const ProjectView: FC<{
  responseProject?: Project[];
  error?: Error;
  busy?: boolean;
}> = ({ responseProject, error, busy }) => {
  const [layout, setLayout] = useState<boolean>(false);

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
      direction={"row"}
      flexWrap={"wrap"}
      gap={4}
      justifyContent={"center"}
    >
      {responseProject.map((project, index) => (
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
                      {project.Company}
                    </Typography>
                    <Typography level="body-sm" fontWeight="lg">
                      {project.Title}
                    </Typography>
                  </CardContent>
                </CardOverflow>
              </AspectRatio>

              <CardContent>
                {project.Accomplishments.length > 0 && (
                  <>
                    <Typography level="body-sm" fontWeight="lg">
                      Accomplishments:
                    </Typography>
                    {project.Accomplishments.map((accomplishment, index) => (
                      <Typography level="body-sm" fontWeight="md" key={index}>
                        {accomplishment}
                      </Typography>
                    ))}
                  </>
                )}
              </CardContent>

              <CardOverflow>
                <Divider inset="context" />
                <Typography level="body-sm" fontWeight="md">
                  Skills: {project.Expertises.join(", ")}
                </Typography>
                <Divider orientation="vertical" />

                <Typography level="body-sm" fontWeight="lg">
                  {project.StartDate} - {project.EndDate}
                </Typography>
              </CardOverflow>
            </Card>
          }
          description={project.Description}
          onSetLayout={setLayout}
          isLayout={layout}
        />
      ))}
    </Stack>
  );
};
