import { Illustration, Ellipse, Group, TAU, QuartersValue } from "zdog";
import { RingSphere } from "../../models/Ring";
import { Star } from "../../models/Star";

const rand = (min: number, max: number): number =>
  Math.random() * (max - min) + min;
const randInt = (min: number, max: number): number =>
  Math.floor(rand(min, max + 1));
const map = (
  value: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number,
): number => start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));

export const StarAndPlanet = () => {
  const illo = new Illustration({
    element: "canvas",
    dragRotate: true,
    resize: true,
    zoom: 1.5,
    onResize: function (width, height) {
      const minSize = Math.min(width, height);
      this.zoom = minSize / 250;
    },
  });

  const ringGroup = new Group({ addTo: illo });
  const starGroup = new Group({ addTo: illo });

  const rings: RingSphere[] = [];
  const ringCount = 80;
  const ringDiameter = 200;

  const stars: Star[] = [];
  const starCount = 1000;
  const starRange = 100;

  for (let i = 0; i < ringCount; i++) {
    const p = i / (ringCount - 1);
    rings.push({
      shape: new Ellipse({
        addTo: ringGroup,
        diameter: (Math.sin((p * TAU) / 2) * ringDiameter) / 2,
        translate: { z: (Math.cos((p * TAU) / 2) * ringDiameter) / 4 },
        rotate: { z: rand(TAU, 0) },
        color: `hsla(${map(p, 0, 1, 110, 240)}, 30%, 50%, 0.7)`,
        quarters: randInt(1, 3) as QuartersValue,
        stroke: rand(0.5, 0.2),
      }),
      spin: rand(0.001, 0.03),
    });
  }

  for (let i = 0; i < starCount; i++) {
    stars.push({
      shape: new Ellipse({
        addTo: starGroup,
        diameter: 0,
        translate: {
          x: rand(-starRange, starRange),
          y: rand(-starRange, starRange),
          z: rand(-starRange, starRange),
        },
        stroke: rand(0.1, 2),
        color: `hsla(0, 40%, 100%, ${rand(0.1, 1)})`,
      }),
    });
  }

  const animate = () => {
    ringGroup.rotate.y -= 0.003;
    ringGroup.rotate.x += 0.003;

    starGroup.rotate.y += 0.0005;
    starGroup.rotate.x -= 0.0007;
    starGroup.rotate.z -= 0.0009;

    illo.updateRenderGraph();
    requestAnimationFrame(animate);
  };

  animate();

  return null;
};
