import { FC, useContext } from "react";
import { PortfolioContext } from "./PortfolioContext";
import { useLocation } from "../state/LocationContext";
import type { CategoryRoot } from "../state/LocationContext";
import { EducationView } from "./categories/EducationView";
import { ExperienceView } from "./categories/ExperienceView";
import { AboutMeView } from "./categories/AboutMeView/AboutMeView";

const ROOTS: readonly CategoryRoot[] = ["education", "experience", "about"];

const isCategoryRoot = (s: string | undefined): s is CategoryRoot =>
  ROOTS.includes(s as CategoryRoot);

export const HomeNavigation: FC = () => {
  const { data, $locale } = useContext(PortfolioContext);
  const { path } = useLocation();
  const root = path.split("/")[1];

  if (!isCategoryRoot(root)) return null;
  if (root === "education")
    return <EducationView responseEducation={data[$locale].education} />;
  if (root === "experience")
    return <ExperienceView responseExperience={data[$locale].experience} />;
  return <AboutMeView introduction={data[$locale].introduction} />;
};
