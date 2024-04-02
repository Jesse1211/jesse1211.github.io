import { Stack } from "@mui/joy";
import { FC } from "react";
import Fade from "@mui/material/Fade";
import { Buttons } from "./Buttons";

export const Navigation: FC = () => {
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
          background: "green"
        }}
      >
        <Buttons isHome={true} />
      </Stack>
        
    </Fade>
  );
};
