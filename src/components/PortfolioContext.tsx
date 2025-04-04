import { createContext } from "react";
import { AllDataType, allData } from "../models/AllData";
import { LocalType } from "../models/Categories";

export const PortfolioContext = createContext<{
  data: AllDataType;
  $locale: LocalType;
  onLocaleChange: (locale: LocalType) => void;
}>({
  $locale: "en-US",
  data: allData,
  onLocaleChange: () => {},
});
