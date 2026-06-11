import { FC, useContext } from "react";
import { PortfolioContext } from "./PortfolioContext";
import { useLocation } from "../state/LocationContext";
import { EducationView } from "./categories/EducationView";
import { ExperienceView } from "./categories/ExperienceView";
import { AboutMeView } from "./categories/AboutMeView/AboutMeView";

export const HomeNavigation: FC = () => {
  const { data, $locale } = useContext(PortfolioContext);
  const { path } = useLocation();
  const root = path.split("/")[1]; // "education" | "experience" | "about" | undefined

  if (root === "education")
    return <EducationView responseEducation={data[$locale].education} />;
  if (root === "experience")
    return <ExperienceView responseExperience={data[$locale].experience} />;
  if (root === "about")
    return <AboutMeView introduction={data[$locale].introduction} />;
  return null;
};
