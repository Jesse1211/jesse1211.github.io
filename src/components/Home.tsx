import { FC, useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, Stack } from "@mui/joy";
import Fade from "@mui/material/Fade";
import { Categories } from "../models/Categories";
import { useEducationGetAll } from "../hooks/useEducationGetAll";
import { useProjectGetAll } from "../hooks/useProjectGetAll";
import { useExperienceGetAll } from "../hooks/useExperienceGetAll";
import { HomeNavigationFade } from "./HomeNavigation";
import { Grow } from "@mui/material";
import { StarAndPlanet } from "./canvas/StarAndPlanet";

export const Home: FC = () => {
  useEffect(() => {
    StarAndPlanet();
  }, []);

  const [started, setStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Categories>();
  const {
    busy: educationBusy,
    responseEducation,
    error: educationError,
  } = useEducationGetAll();
  const {
    busy: projectBusy,
    responseProject,
    error: projectError,
  } = useProjectGetAll();
  const {
    busy: experienceBusy,
    responseExperience,
    error: experienceError,
  } = useExperienceGetAll();

  const onSetSelectedCategory = (category: Categories) => {
    if (category === selectedCategory) return;
    setSelectedCategory(undefined);

    setTimeout(() => {
      setSelectedCategory(category);
    }, 100);
  };

  if (educationError || projectError || experienceError) {
    return <Alert color="danger">Something Wrong</Alert>;
  }

  if (educationBusy || projectBusy || experienceBusy) {
    return <CircularProgress />;
  }

  return (
    <Stack
      mx="auto"
      flex={1}
      maxWidth={0.8}
      spacing={4}
      alignSelf="center"
      margin={"auto"}
      sx={{
        "margin-top": "10%"
      }}
    >
      <Box height={10} width={100} />

      <Fade in={started}>
        <HomeNavigationFade setSelectedCategory={onSetSelectedCategory} />
      </Fade>

      <Fade in={!started}>
        <Button
          style={{
            color: "#889def",
          }}
          variant="plain"
          onClick={() => {
            setStarted(!started);
          }}
        >
          Start Discovery
        </Button>
      </Fade>

      <Box height={1} >
        <Grow
          in={selectedCategory !== undefined}
          {...(selectedCategory !== undefined ? { timeout: 1000 } : {})}
        >
          <HomeNavigationFade
            selectedCategory={selectedCategory}
            responseEducation={responseEducation}
            responseProject={responseProject}
            responseExperience={responseExperience}
          />
        </Grow>
      </Box>
    </Stack>
  );
};
