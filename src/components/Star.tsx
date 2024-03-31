import { Illustration, Ellipse, Group } from 'zdog';
import { Star } from '../models/Star';

const rand = (min: number, max: number): number => Math.random() * (max - min) + min;

export const StarBackground = () => {
  const canvas = document.querySelector('canvas');

  if (!canvas) {
    console.error('Canvas not found!');
    return;
  }

  const illo = new Illustration({
    element: canvas,
    dragRotate: true,
  });

  const starGroup = new Group({ addTo: illo });

  const stars: Star[] = [];
  const starCount = 840;
  const starRange = 600;

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
    starGroup.rotate.y += 0.0005;
    starGroup.rotate.x -= 0.0007;
    starGroup.rotate.z -= 0.0009;

    illo.updateRenderGraph();
    requestAnimationFrame(animate);
  };

  animate();

  return null;
};
