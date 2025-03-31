import { Button, Stack } from "@mui/joy";
import { FC, HTMLProps, forwardRef, useContext } from "react";
import { Categories } from "../models/Categories";
import { EducationView } from "./categories/EducationView";
import { ExperienceView } from "./categories/ExperienceView";
import { ProjectView } from "./categories/ProjectView";
import { AboutMeView } from "./categories/AboutMeView/AboutMeView";
import { PortfolioContext } from "./PortfolioContext";
import "../App.css";
import { CategoryButton } from "../models/CategoryButton";

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
  const portfolioData = useContext(PortfolioContext);

  const categories = [
    {
      Label: portfolioData.$locale === "zh-CN" ? "教育" : "Education",
      onClick: () => setSelectedCategory("Educations"),
    },
    {
      Label: portfolioData.$locale === "zh-CN" ? "经历" : "Experience",
      onClick: () => setSelectedCategory("Experiences"),
    },
    {
      Label: portfolioData.$locale === "zh-CN" ? "项目" : "Project",
      onClick: () => setSelectedCategory("Projects"),
    },
    {
      Label: portfolioData.$locale === "zh-CN" ? "我的博客" : "My Blog",
      onClick: () => (window.location.href = "https://blog.jesseliu.me"),
    },
    {
      Label: portfolioData.$locale === "zh-CN" ? "第一人称" : "Myself",
      onClick: () => setSelectedCategory("AboutMe"),
    },
  ] as CategoryButton[];

  return (
    <Stack
      direction="row"
      gap={4}
      justifyContent={"center"}
      overflow={"auto"}
      flexWrap={"wrap"}
    >
      {categories.map((category) => (
        <Button
          key={category.Label}
          size="md"
          onClick={category.onClick}
          className="category-button"
          variant="plain"
        >
          {category.Label}
        </Button>
      ))}
    </Stack>
  );
};
