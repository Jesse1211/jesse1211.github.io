import { FC, useState } from "react";
import { Box, Button, Stack } from "@mui/joy";
import { Background } from "./Background";
import { Categories } from "../models/Categories";
import Fade from "@mui/material/Fade";

export const Home: FC = () => {
  const [checked, setChecked] = useState(false);

  const [category, setCategory] = useState<Categories>();
  Background();
  return (
    <>
      <Stack
        mx="auto"
        width={0.9}
        height={1}
        p={3}
        spacing={4}
        alignItems="center"
        justifyContent="center"
      >
        {/* <Box border={250}></Box> */}

        <Fade in={!checked}>
          <Button
            style={{
              color: "#889def",
            }}
            variant="plain"
            onClick={() => {
              setChecked(!checked);
            }}
          >
            Start Discovery
          </Button>
        </Fade>
        
        <Fade in={checked}>
          <Stack direction="row" spacing={6}>
            <Button
              onClick={() => setCategory("Educations")}
              style={{
                color: "#889def",
              }}
              variant="plain"
            >
              Educations
            </Button>
            <Button
              onClick={() => setCategory("Experiences")}
              style={{
                color: "#889def",
              }}
              variant="plain"
            >
              Experiences
            </Button>{" "}
            <Button
              onClick={() => setCategory("Projects")}
              style={{
                color: "#889def",
              }}
              variant="plain"
            >
              Projects
            </Button>
          </Stack>
          {/* <CategoryDetails category={category} /> */}
        
        </Fade>
      </Stack>
    </>
  );
};
