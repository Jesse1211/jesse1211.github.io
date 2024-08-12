import { useEffect } from "react";
import { StarAndPlanet } from "./StarAndPlanet";

export const Background = () => {
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
};
