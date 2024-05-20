import { Button, Stack } from "@mui/joy";
import { FC, HTMLProps, forwardRef, useContext } from "react";
import { Categories } from "../models/Categories";
import { EducationView } from "./categories/EducationView";
import { ExperienceView } from "./categories/ExperienceView";
import { ProjectView } from "./categories/ProjectView";
import { AboutMeView } from "./categories/AboutMeView/AboutMeView";
import { PortfolioContext } from "./PortfolioContext";

interface HomeNavigationFadeProps extends HTMLProps<HTMLDivElement> {
  setSelectedCategory?: (category: Categories) => void;
  selectedCategory?: Categories;
}

export const HomeNavigationFade = forwardRef<
  HTMLDivElement,
  HomeNavigationFadeProps
>((props, ref) => {
  const { setSelectedCategory, selectedCategory, ...rest } = props;
  const portfolioData = useContext(PortfolioContext);
  const lang = portfolioData.$locale;
  return (
    <div ref={ref} {...rest}>
      {setSelectedCategory && (
        <HomeNavigation setSelectedCategory={setSelectedCategory} />
      )}
      {selectedCategory === "Educations" && (
        <EducationView responseEducation={portfolioData.data[lang].education} />
      )}
      {selectedCategory === "Experiences" && (
        <ExperienceView
          responseExperience={portfolioData.data[lang].experience}
        />
      )}
      {selectedCategory === "Projects" && (
        <ProjectView responseProject={portfolioData.data[lang].projects} />
      )}
      {selectedCategory === "AboutMe" && (
        <AboutMeView introduction={portfolioData.data[lang].introduction} />
      )}
    </div>
  );
});

const HomeNavigation: FC<{
  setSelectedCategory: (category: Categories) => void;
}> = ({ setSelectedCategory }) => {
  return (
    <Stack
      direction="row"
      gap={4}
      justifyContent={"center"}
      overflow={"auto"}
      flexWrap={"wrap"}
    >
      <Button
        size="md"
        onClick={() => setSelectedCategory("Educations")}
        style={{ color: "#889def", maxWidth: "25%" }}
        variant="plain"
      >
        Education
      </Button>
      <Button
        size="md"
        onClick={() => setSelectedCategory("Experiences")}
        style={{ color: "#889def", maxWidth: "25%" }}
        variant="plain"
      >
        Experience
      </Button>
      <Button
        size="md"
        onClick={() => setSelectedCategory("Projects")}
        style={{ color: "#889def", maxWidth: "25%" }}
        variant="plain"
      >
        Project
      </Button>
      <Button
        size="md"
        onClick={() => setSelectedCategory("AboutMe")}
        style={{ color: "#889def", maxWidth: "25%" }}
        variant="plain"
      >
        Myself
      </Button>
    </Stack>
  );
};
