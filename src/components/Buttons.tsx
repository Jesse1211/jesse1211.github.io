import { forwardRef } from "react";
import { Button, Stack } from "@mui/joy";
import { useNavigate } from "react-router-dom";

export const Buttons = forwardRef<HTMLDivElement, {isHome: boolean }>(
  ({isHome}, ref) => {
    const navigate = useNavigate();

    const handleCategoryClick = (category: string) => {
      navigate(`/${category}`);
    };
    
    return (
      <Stack direction="row" spacing={6} ref={ref}>
        {isHome && <Button onClick={() => handleCategoryClick("")} style={{ color: "#889def" }} variant="plain">
          Home
        </Button>}
        <Button onClick={() => handleCategoryClick("Educations")} style={{ color: "#889def" }} variant="plain">
          Educations
        </Button>
        <Button onClick={() => handleCategoryClick("Experiences")} style={{ color: "#889def" }} variant="plain">
          Experiences
        </Button>
        <Button onClick={() => handleCategoryClick("Projects")} style={{ color: "#889def" }} variant="plain">
          Projects
        </Button>
    </Stack>
    );
  }
);
