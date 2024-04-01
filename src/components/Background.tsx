import { FC, useEffect } from "react";
import { StarAndPlanet } from "./StarAndPlanet";

export const Background: FC = () => {
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = document.querySelector("canvas");
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        StarAndPlanet();
      }
    };

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
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
  );
};
