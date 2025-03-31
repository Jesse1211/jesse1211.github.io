import Translate from "@mui/icons-material/Translate";
import { Button, Container } from "@mui/joy";
import { FC, useContext } from "react";
import { PortfolioContext } from "./PortfolioContext";
// import DarkmodeToggle from "./DarkModeToggle"

export const Navigation: FC = () => {
  const portfolioData = useContext(PortfolioContext);
  return (
    <Container
      maxWidth={false}
      sx={{ position: "fixed", marginTop: 1, right: 0, direction: "rtl" }}
    >
      <Button
        size="sm"
        startDecorator={<Translate />}
        onClick={() => {
          portfolioData.onLocaleChange(
            portfolioData.$locale === "en-US" ? "zh-CN" : "en-US"
          );
        }}
      >
        {portfolioData.$locale === "en-US" ? "中文" : "English"}
      </Button>
    </Container>
  );
};
