import { FC, useEffect, useState } from "react";
import { Start } from "./Start"; // Assuming Start is correctly imported without the extension
import { Button } from "@mui/joy";

export const Home: FC = () => {
  const [home, setHome] = useState<boolean>(true);

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = document.querySelector("canvas");
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        Start();
      }
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {home ? (
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
        </>
      ) : (
        <>OK watch my face babe</>
      )}
    </div>
  );
};
