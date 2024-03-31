import { Stack, Typography } from "@mui/joy";
import { FC } from "react";

export const Footer: FC = () => {
  return (
    <Stack 
      component="footer" 
      direction="row" 
      justifyContent="center" 
      p={1}
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        textAlign: "center",
      }}>
        <Typography level="body-xs">© Created by Jesse Liu</Typography>
      </Stack>
  );
}
