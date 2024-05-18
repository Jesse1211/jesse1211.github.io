import {
  CardContent,
  Typography,
  Stack,
  CardOverflow,
  Divider,
} from "@mui/joy";
import { FC } from "react";
import { Project } from "../../models/Categories";
import { CardContainer } from "./CardContainer";

export const ProjectView: FC<{
  responseProject: Project[];
}> = ({ responseProject }) => {
  return (
    <Stack
      direction={"row"}
      flexWrap={"wrap"}
      gap={4}
      justifyContent={"center"}
      overflow={"auto"}
      paddingBottom={4}
    >
      {responseProject.map((project, index) => (
        <CardContainer
          key={index}
          cardView={
            <>
              <CardOverflow>
                <CardContent>
                  <Typography level="body-md" fontWeight="lg">
                    {project.Company}
                  </Typography>
                  <Typography level="body-sm" fontWeight="lg">
                    {project.Title}
                  </Typography>
                </CardContent>
              </CardOverflow>
              <CardOverflow>
                <Divider inset="context" />
              </CardOverflow>
            </>
          }
          description={project.Accomplishments}
        />
      ))}
    </Stack>
  );
};
