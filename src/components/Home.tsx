import { FC, useState } from "react";
import { Button, Stack } from "@mui/joy";
import Fade from "@mui/material/Fade";
import { Categories } from "../models/Categories";
import { EducationView } from "./categories/EducationView";
import { Grow } from "@mui/material";
import { ExperienceView } from "./categories/ExperienceView";
import { ProjectView } from "./categories/ProjectView";

export const Home: FC = () => {
  const [started, setStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Categories>();
  // TODO: Add canvas feature
  // Background();

  return (
    <Stack
      mx="auto"
      width={0.9}
      height={1}
      // p={3}
      spacing={4}
      alignItems="center"
      justifyContent="center"
    >
      {/* <Box border={250}></Box> */}

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

      <Fade in={started}>
        <Stack direction="row" spacing={6}>
          <Button
            onClick={() => setSelectedCategory("Educations")}
            style={{ color: "#889def" }}
            variant="plain"
          >
            Educations
          </Button>
          <Button
            onClick={() => setSelectedCategory("Experiences")}
            style={{ color: "#889def" }}
            variant="plain"
          >
            Experiences
          </Button>
          <Button
            onClick={() => setSelectedCategory("Projects")}
            style={{ color: "#889def" }}
            variant="plain"
          >
            Projects
          </Button>
        </Stack>
      </Fade>

      <Grow in={selectedCategory !== undefined}>
        <Stack sx={{ display: "flex" }}>
          {selectedCategory === "Educations" ? (
            <EducationView />
          ) : selectedCategory === "Experiences" ? (
            <ExperienceView />
          ) : (
            <ProjectView />
          )}
        </Stack>
      </Grow>
    </Stack>
  );
};
