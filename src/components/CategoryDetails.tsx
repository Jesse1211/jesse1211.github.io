import { Typography, Stack } from "@mui/joy";
import { FC } from "react";
import { University } from "./University";
import { Experience } from "./Experience";
import { Projects } from "./Projects";
import { Categories } from "../models/Categories";

export const CategoryDetails: FC<{ category: Categories }> = ({ category }) => {
  return (
    <Stack spacing={{ xs: 1, sm: 2 }} overflow="auto" width={1}>
      {category === "Educations" ? (
        <>
          <Typography level="title-lg" fontWeight="lg" textColor="#fff">
            Education
          </Typography>
          <University />
          <University />
          <University />
          <University />
          <University />
          <University />
        </>
      ) : category === "Experiences" ? (
        <>
          <Typography level="title-lg" fontWeight="lg" textColor="#fff">
            Experiences
          </Typography>
          <Experience />
          <Experience />
          <Experience />
          <Experience />
          <Experience />
          <Experience />
        </>
      ) : category === "Projects" ? (
        <>
          <Typography level="title-lg" fontWeight="lg" textColor="#fff">
            Projects
          </Typography>
          <Projects />
          <Projects />
          <Projects />
          <Projects />
          <Projects />
          <Projects />
        </>
      ) : (
        <></>
      )}
    </Stack>
  );
};
