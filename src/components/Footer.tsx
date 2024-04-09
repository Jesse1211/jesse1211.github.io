import { Stack, Typography } from "@mui/joy";
import { FC } from "react";

export const Footer: FC = () => {
  return (
    <Stack 
      component="footer" 
      position={"fixed"}
      bottom={0}
      >
        <Typography level="body-xs">© Created by Jesse Liu</Typography>
      </Stack>
  );
}
