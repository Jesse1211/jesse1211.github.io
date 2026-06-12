import { Box } from "@mui/joy";
import { FC } from "react";

export const Footer: FC = () => (
  <Box
    component="footer"
    sx={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      width: "100%",
      textAlign: "center",
      py: 1.25,
      fontSize: 12,
      fontStyle: "italic",
      color: "hsla(180,30%,85%,0.55)",
      fontFamily: "inherit",
      pointerEvents: "none",
      zIndex: 5,
    }}
  >
    {`// © 2018-${new Date().getFullYear()} Jesse Liu  ::  built with Vite + zdog`}
  </Box>
);
