import { FC, useEffect, useState } from "react";
import { StarAndPlanet } from "./StarAndPlanet";
import { Button } from "@mui/joy";
import { StarBackground } from "./Star";
import { Portfolio } from "./Portfolio";

export const Home: FC = () => {
  const [home, setHome] = useState<boolean>(true);

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = document.querySelector("canvas");
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        home ? StarAndPlanet() : StarBackground();
      }
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [home]);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <>
        <canvas
          style={{
            display: "block",
            background: "#0e0f43",
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
        {home ? (
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
              setHome(false);
            }}
          >
            Start Discovery
          </Button>
        ) : (
          <Portfolio/>
        )}
      </>
    </div>
  );
};
