import { FC, useEffect, useState } from "react";
import { Box, Button, Stack } from "@mui/joy";
import Fade from "@mui/material/Fade";
import { Categories } from "../models/Categories";
import { HomeNavigationFade } from "./HomeNavigation";
import { Grow } from "@mui/material";
import { StarAndPlanet } from "./canvas/StarAndPlanet";
import { Quote } from "./Quote";

export const Home: FC = () => {
  useEffect(() => {
    // TODO: 定时更改Canvas的颜色
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
      maxWidth={0.9}
      sx={{
        marginTop: "10%",
      }}
      flex={1}
    >
      <Quote />
      <div className="blank"></div>

      {/* TODO: 鼠标hover反馈 */}
      {/* Education, Experience, Projects, Myself */}
      {started && (
        <Fade in={started}>
          <HomeNavigationFade setSelectedCategory={onSetSelectedCategory} />
        </Fade>
      )}

      {/* TODO: 从左下角延迟放大 */}
      {/* Start Discovery */}
      {!started && (
        <Fade in={!started}>
          <Button
            style={{
              color: "#889def",
              maxWidth: "20%",
              alignSelf: "center",
              fontSize: "1.5rem",
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

      {/* Category Content */}
      <Grow
        in={selectedCategory !== undefined}
        {...(selectedCategory !== undefined ? { timeout: 1000 } : {})}
      >
        <HomeNavigationFade selectedCategory={selectedCategory} />
      </Grow>

      <Box height={10} width={100} />
    </Stack>
  );
};
