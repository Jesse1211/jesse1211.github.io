import { FC, ReactNode, useState } from "react";
import { allData } from "../models/AllData";
import { LocalType } from "../models/Categories";
import { PortfolioContext } from "./PortfolioContext";

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
