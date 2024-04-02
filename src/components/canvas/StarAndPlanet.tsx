import { Illustration, Ellipse, Group, TAU, QuartersValue } from 'zdog';
import { RingSphere } from '../../models/Ring';
import { Star } from '../../models/Star';

const rand = (min: number, max: number): number => Math.random() * (max - min) + min;
const randInt = (min: number, max: number): number => Math.floor(rand(min, max + 1));
const map = (value: number, start1: number, stop1: number, start2: number, stop2: number): number => start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));

export const StarAndPlanet = () => {
  const canvas = document.querySelector('canvas');

  if (!canvas) {
    console.error('Canvas not found!');
    return;
  }

  const illo = new Illustration({
    element: canvas,
    dragRotate: true,
  });

  const ringGroup = new Group({ addTo: illo });
  const starGroup = new Group({ addTo: illo });

  const rings: RingSphere[] = [];
  const ringCount = 100;
  const ringDiameter = 350;

  const stars: Star[] = [];
  const starCount = 840;
  const starRange = 600;

  for (let i = 0; i < ringCount; i++) {
    const p = i / (ringCount - 1);
    rings.push({
      shape: new Ellipse({
        addTo: ringGroup,
        diameter: Math.sin(p * TAU / 2) * ringDiameter / 2,
        translate: { z: Math.cos(p * TAU / 2) * ringDiameter / 4 },
        rotate: { z: rand(TAU, 0) }, // Adjusted for TypeScript
        color: `hsla(${map(p, 0, 1, 180, 360)}, 90%, 50%, 1)`,
        quarters: randInt(1, 3) as QuartersValue, // Adjusted for TypeScript
      }),
      spin: rand(0.001, 0.03), // Adjusted for TypeScript
    });
  }

  for (let i = 0; i < starCount; i++) {
    stars.push({
      shape: new Ellipse({
        addTo: starGroup,
        diameter: 0,
        translate: {
          x: rand(-starRange, starRange), // Adjusted for TypeScript
          y: rand(-starRange, starRange), // Adjusted for TypeScript
          z: rand(-starRange, starRange), // Adjusted for TypeScript
        },
        stroke: rand(0.5, 2), // Adjusted for TypeScript
        color: `hsla(0, 0%, 100%, ${rand(0.1, 1)})`, // Adjusted for TypeScript
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
