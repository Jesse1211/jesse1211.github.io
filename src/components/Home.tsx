import { FC, useState } from "react";
import { Button, Stack } from "@mui/joy";
import { Background } from "./Background";
import Fade from "@mui/material/Fade";
import { useNavigate } from "react-router-dom"; // Step 1
import { motion } from "framer-motion";
import { Buttons } from "./Buttons";

export const Home: FC = () => {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    navigate(`/${category}`);
  };

  Background();

  return (
    <motion.div
      className="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
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
          <Buttons handleCategoryClick={handleCategoryClick} />                
        </Fade>
      </Stack>
    </motion.div>
  );
};
