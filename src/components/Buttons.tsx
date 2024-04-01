import { forwardRef } from "react";
import { Button, Stack } from "@mui/joy";

export const Buttons = forwardRef<HTMLDivElement, {handleCategoryClick : (category: string) => void  }>(
  ({handleCategoryClick}, ref) => {
    return (
      <Stack direction="row" spacing={6} ref={ref}>
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
