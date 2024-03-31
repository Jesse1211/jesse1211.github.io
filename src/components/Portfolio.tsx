import { Typography, Sheet, Stack, Button, ButtonGroup } from "@mui/joy";
import { FC, useState } from "react";
import { University } from "./University";
import { Experience } from "./Experience";
import { Projects } from "./Projects";

type Category = "Educations" | "Experiences" | "Projects";

export const Portfolio: FC = () => {
  const [category, setCategory] = useState<Category>("Educations");

  return (
    <Stack>
      <ButtonGroup>
        <Button onClick={() => setCategory("Educations")}>Educations</Button>
        <Button onClick={() => setCategory("Experiences")}>
          Experiences
        </Button>{" "}
        <Button onClick={() => setCategory("Projects")}>Projects</Button>
      </ButtonGroup>
      <Stack
        mx="auto"
        width="fit-content"
        height={1}
        p={3}
        minWidth={0.7}
        alignItems="center"
        justifyContent="center"
      >
        <Sheet
          color="neutral"
          variant="soft"
          sx={{
            width: "100%",
            overflow: "auto",
            p: 2,
            mx: "auto",
            flexDirection: "column",
            justifyContent: "center",
            overf: "auto",
          }}
          style={{ background: "fixed" }}
        >
          <Stack spacing={{ xs: 1, sm: 2 }} height={1} overflow="auto">
            {category === "Educations" ? (
              <>
                <Typography level="title-lg" fontWeight="lg" textColor="#fff">
                  Education
                </Typography>
                <University />
                <University />
                <University />
                <University />
                <University />
                <University />
              </>
            ) : category === "Experiences" ? (
              <>
                <Typography level="title-lg" fontWeight="lg" textColor="#fff">
                  Experiences
                </Typography>
                <Experience />
                <Experience />
                <Experience />
                <Experience />
                <Experience />
                <Experience />
              </>
            ) : (
              <>
                <Typography level="title-lg" fontWeight="lg" textColor="#fff">
                  Projects
                </Typography>
                <Projects />
                <Projects />
                <Projects />
                <Projects />
                <Projects />
                <Projects />
              </>
            )}
          </Stack>
        </Sheet>
      </Stack>
    </Stack>
  );
};
