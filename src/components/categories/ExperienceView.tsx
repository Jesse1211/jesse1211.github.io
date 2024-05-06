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
import { Experience } from "../../models/Categories";
import { CardContainer } from "./CardContainer";

export const ExperienceView: FC<{
  responseExperience?: Experience[];
  error?: Error;
  busy?: boolean;
}> = ({ responseExperience, error, busy }) => {
  const [layout, setLayout] = useState<boolean>(false);
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
      direction={"row"}
      flexWrap={"wrap"}
      gap={4}
      justifyContent={"center"}
    >
      {responseExperience.map((experience, index) => (
        <CardContainer
          cardView={
            <Card key={index} sx={{ height: 1 }} size="lg" variant="soft">
              <AspectRatio ratio="2">
                <CardOverflow>
                  <CardCover>
                    {/* <img src="./Cornell.jpg" loading="lazy" /> */}
                  </CardCover>
                  <CardContent>
                    <Typography level="body-md" fontWeight="lg">
                      {experience.Company}
                    </Typography>
                    <Typography level="body-sm" fontWeight="lg">
                      {experience.Title}
                    </Typography>
                    <Typography level="body-sm" fontWeight="lg">
                      {experience.Location}
                    </Typography>
                  </CardContent>
                </CardOverflow>
              </AspectRatio>

              <CardContent>
                {experience.Accomplishments.length > 0 && (
                  <>
                    <Typography level="body-sm" fontWeight="lg">
                      Accomplishments:
                    </Typography>
                    {experience.Accomplishments.map((accomplishment, index) => (
                      <Typography level="body-sm" fontWeight="md" key={index}>
                        🧬 {accomplishment}
                      </Typography>
                    ))}
                  </>
                )}
              </CardContent>

              <CardOverflow>
                <Divider inset="context" />
                {<Typography level="body-sm" fontWeight="md">
                  Product development & E-commence
                </Typography>}
                <Divider orientation="vertical" />

                <Typography level="body-sm" fontWeight="lg">
                  {experience.StartDate} - {experience.EndDate}
                </Typography>
              </CardOverflow>
            </Card>
          }
          description={experience.Description}
          onSetLayout={setLayout}
          isLayout={layout}
        />
      ))}
    </Stack>
  );
};
