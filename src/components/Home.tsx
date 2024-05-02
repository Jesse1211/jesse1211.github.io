import { FC, useEffect, useState } from "react";
import { Box, Button, Stack } from "@mui/joy";
import Fade from "@mui/material/Fade";
import { Categories, Education, Experience } from "../models/Categories";
import { HomeNavigationFade } from "./HomeNavigation";
import { Grow } from "@mui/material";
import { StarAndPlanet } from "./canvas/StarAndPlanet";

export const Home: FC = () => {
  useEffect(() => {
    StarAndPlanet();
  }, []);

  const [started, setStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Categories>();

  const responseEducation : Education[] = [
    {
      _id: "", // Add the missing property _id
      StartDate: "", // Add the missing property StartDate
      EndDate: "", // Add the missing property EndDate
      School: "", // Add the missing property School
      ReleventCourses: ["string[]"],
      Grade: "string"
    }
  ];
  const responseExperience : Experience[] = [
    {
      _id: "", // Add the missing property _id
      StartDate: "", // Add the missing property StartDate
      EndDate: "", // Add the missing property EndDate
      Title: "",
      Company: "",
      Description: "",
      Accomplishments: [""],
      Expertises: [""],
    }
  ];
  const responseProject = [
    {
      _id: "", // Add the missing property _id
      StartDate: "", // Add the missing property StartDate
      EndDate: "", // Add the missing property EndDate
      Title: "",
      Company: "",
      Description: "",
      Accomplishments: [""],
      Expertises: [""],
    },
  ];

  
  const onSetSelectedCategory = (category: Categories) => {
    if (category === selectedCategory) return;
    setSelectedCategory(undefined);

    setTimeout(() => {
      setSelectedCategory(category);
    }, 100);
  };

  // if (educationError || projectError || experienceError) {
  //   return <Alert color="danger">Something Wrong</Alert>;
  // }

  // if (educationBusy || projectBusy || experienceBusy) {
  //   return <CircularProgress />;
  // }

  return (
    <Stack
      mx="auto"
      flex={1}
      maxWidth={0.8}
      spacing={4}
      alignSelf="center"
      margin={"auto"}
      sx={{
        "margin-top": "10%",
      }}
    >
      <Box height={10} width={100} />

      <Fade in={started}>
        <HomeNavigationFade setSelectedCategory={onSetSelectedCategory} />
      </Fade>

      <Fade in={!started}>
        <Button
          style={{
            color: "#889def",
          }}
          variant="plain"
          onClick={() => {
            setStarted(!started);
          }}
        >
          Start Discovery
        </Button>
      </Fade>

      <Grow
        in={selectedCategory !== undefined}
        {...(selectedCategory !== undefined ? { timeout: 1000 } : {})}
      >
        <HomeNavigationFade
          selectedCategory={selectedCategory}
          responseEducation={responseEducation}
          responseProject={responseProject}
          responseExperience={responseExperience}
        />
      </Grow>

      <Box height={10} width={100} />
    </Stack>
  );
};
