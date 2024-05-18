import { FC, useEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/joy";
import TypeWriter from "typewriter-effect";
import Fade from "@mui/material/Fade";
import {
  Categories,
  responseEducation,
  responseExperience,
  responseProject,
} from "../models/Categories";
import { HomeNavigationFade } from "./HomeNavigation";
import { Grow } from "@mui/material";
import { StarAndPlanet } from "./canvas/StarAndPlanet";

export const Home: FC = () => {
  useEffect(() => {
    StarAndPlanet();
  }, []);

  const [started, setStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    Categories | undefined
  >();

  const onSetSelectedCategory = (category: Categories) => {
    if (category === selectedCategory) return;
    setSelectedCategory(undefined);

    setTimeout(() => {
      setSelectedCategory(category);
    }, 100);
  };

  return (
    <Stack
      p={3}
      spacing={4}
      flex={1}
      maxWidth={0.9}
      sx={{
        "margin-top": "10%",
      }}
    >
      {
        <Fade in={!started}>
          <Typography
            fontWeight="md"
            fontSize="1.5rem"
            sx={{ letterSpacing: "0.1vw", color: "#0076ff" }}
          >
            <TypeWriter
              options={{ loop: true, delay: 160, autoStart: true }}
              onInit={(typewriter) => {
                typewriter
                  .typeString(
                    "<strong><span style='color:#7b00ff;'>Passion</span><strong> is not a fleeting emotion but a <span style='color:#7b00ff;'>relentless force</span>."
                  )
                  .pauseFor(1500)
                  .deleteAll()
                  .typeString(
                    "Studying is like exploring the universe, <strong><span style='color:#7b00ff;'>exciting yet satisfying</span><strong>."
                  )
                  .pauseFor(1500)
                  .start();
              }}
            />{" "}
          </Typography>
        </Fade>
      }

      {started && (
        <Fade in={started}>
          <HomeNavigationFade setSelectedCategory={onSetSelectedCategory} />
        </Fade>
      )}

      {!started && (
        <Fade in={!started}>
          <Button
            style={{
              color: "#889def",
              maxWidth: "20%",
              alignSelf: "center",
            }}
            variant="plain"
            onClick={() => {
              setStarted(!started);
            }}
          >
            Start Discovery
          </Button>
        </Fade>
      )}

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

      <Box height={10} width={100} />
    </Stack>
  );
};
