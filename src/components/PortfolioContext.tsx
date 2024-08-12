import { FC, ReactNode, createContext, useState } from "react";
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

export const PortfolioProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [$locale, setLocale] = useState<LocalType>("en-US");

  const onLocaleChange = (locale: LocalType) => {
    setLocale(locale);
  };

  return (
    <PortfolioContext.Provider
      value={{ data: allData, $locale, onLocaleChange }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};
