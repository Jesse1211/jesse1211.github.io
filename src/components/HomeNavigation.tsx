import { Button, Stack } from "@mui/joy";
import { FC, HTMLProps, forwardRef } from "react";
import {
  Categories,
  Education,
  Experience,
  Project,
} from "../models/Categories";
import { EducationView } from "./categories/EducationView";
import { ExperienceView } from "./categories/ExperienceView";
import { ProjectView } from "./categories/ProjectView";
import { AboutMeView } from "./categories/AboutMeView";

interface HomeNavigationFadeProps extends HTMLProps<HTMLDivElement> {
  setSelectedCategory?: (category: Categories) => void;
  selectedCategory?: Categories;
  responseEducation?: Education[];
  responseExperience?: Experience[];
  responseProject?: Project[];
}

export const HomeNavigationFade = forwardRef<
  HTMLDivElement,
  HomeNavigationFadeProps
>((props, ref) => {
  const {
    setSelectedCategory,
    selectedCategory,
    responseEducation,
    responseExperience,
    responseProject,
    ...rest
  } = props;

  return (
    <div ref={ref} {...rest}>
      {setSelectedCategory && (
        <HomeNavigation setSelectedCategory={setSelectedCategory} />
      )}
      {selectedCategory === "Educations" && responseEducation && (
        <EducationView responseEducation={responseEducation} />
      )}
      {selectedCategory === "Experiences" && responseExperience && (
        <ExperienceView responseExperience={responseExperience} />
      )}
      {selectedCategory === "Projects" && responseProject && (
        <ProjectView responseProject={responseProject} />
      )}
      {selectedCategory === "AboutMe" && responseProject && (
        <AboutMeView />
      )}
    </div>
  );
});

const HomeNavigation: FC<{
  setSelectedCategory: (category: Categories) => void;
}> = ({ setSelectedCategory }) => {
  return (
    <Stack direction="row" spacing={6} justifyContent="center" top={0}>
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
      <Button
        onClick={() => setSelectedCategory("AboutMe")}
        style={{ color: "#889def" }}
        variant="plain"
      >
        Contact Me
      </Button>
    </Stack>
  );
};
