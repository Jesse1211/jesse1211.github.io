import { FC, useState } from "react";
import { Button, ButtonGroup } from "@mui/joy";
import { Background } from "./Background";
import { Categories } from "../models/Categories";
import { CategoryDetails } from "./CategoryDetails";

export const Home: FC = () => {
  const [category, setCategory] = useState<Categories>("Start");

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <>
        <Background />
        {category === "Start" ? (
          <Button
            style={{
              position: "absolute",
              top: "70%",
              left: "50%",
              transform: "translate(-50%, -50%)", // Centers the button
              color: "#889def",
            }}
            variant="plain"
            onClick={() => {
              setCategory("Home");
            }}
          >
            Start Discovery
          </Button>
        ) : (
          <>
            <ButtonGroup
              style={{
                position: "absolute",
                top: "70%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              variant="plain"
            >
              <Button
                onClick={() => setCategory("Educations")}
                style={{
                  color: "#889def",
                }}
              >
                Educations
              </Button>
              <Button
                onClick={() => setCategory("Experiences")}
                style={{
                  color: "#889def",
                }}
              >
                Experiences
              </Button>{" "}
              <Button
                onClick={() => setCategory("Projects")}
                style={{
                  color: "#889def",
                }}
              >
                Projects
              </Button>
            </ButtonGroup>
            <CategoryDetails category={category} />
          </>
        )}
      </>
    </div>
  );
};
