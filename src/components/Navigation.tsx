import { Stack } from "@mui/joy";
import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Fade from "@mui/material/Fade";
import { Buttons } from "./Buttons";

export const Navigation: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCategoryClick = (category: string) => {
    navigate(`/${category}`);
  };

  return (
    <Fade in={location.pathname !== "/"}>
      <Stack
        direction="row"
        justifyContent="center"
        p={1}
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Buttons handleCategoryClick={handleCategoryClick} />
      </Stack>
    </Fade>
  );
};
