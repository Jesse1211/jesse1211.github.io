import { Box } from "@mui/joy";
import { FC } from "react";

export const Footer: FC = () => (
  <Box
    component="footer"
    sx={{
      width: "100%",
      textAlign: "center",
      py: 2,
      mt: 4,
      fontSize: 12,
      fontStyle: "italic",
      color: "hsla(180,30%,85%,0.55)",
      fontFamily: "inherit",
    }}
  >
    {`// © 2018-${new Date().getFullYear()} Jesse Liu  ::  built with Vite + zdog`}
  </Box>
);
