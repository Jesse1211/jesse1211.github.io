import {
  Anchor,
  Box as ZdogBox,
  Ellipse,
  Group,
  Illustration,
  Polygon,
  QuartersValue,
  TAU,
} from "zdog";
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

// A generic background "floater": something that drifts around on
// a slow open path and slowly self-rotates. We have three flavors —
// ring-sphere "planet", regular polygon (triangle / diamond / etc.),
// and wireframe box — each driven by the same drift loop.
type Floater = {
  anchor: Anchor;
  group: Group;
  // Drift parameters.
  dx: number;
  dy: number;
  px: number; // period seconds
  py: number;
  phaseX: number;
  phaseY: number;
  // Self-rotation rates.
  spinX: number;
  spinY: number;
  spinZ: number;
  // Base position so drift offsets are applied around it.
  baseX: number;
  baseY: number;
};

const driftDefaults = (cfg: { baseX: number; baseY: number }): Omit<
  Floater,
  "anchor" | "group"
> => ({
  dx: rand(30, 80),
  dy: rand(20, 60),
  px: rand(14, 28),
  py: rand(12, 24),
  phaseX: rand(0, TAU),
  phaseY: rand(0, TAU),
  spinX: rand(0.002, 0.01),
  spinY: rand(0.002, 0.01),
  spinZ: rand(-0.005, 0.005),
  baseX: cfg.baseX,
  baseY: cfg.baseY,
});

const mountFloater = (
  parent: Anchor,
  cfg: { baseX: number; baseY: number },
): { anchor: Anchor; group: Group } => {
  const anchor = new Anchor({ addTo: parent });
  anchor.translate.x = cfg.baseX;
  anchor.translate.y = cfg.baseY;
  const group = new Group({ addTo: anchor });
  return { anchor, group };
};

// ---- ring-sphere "planet" ----
type SphereConfig = {
  hue: number;
  diameter: number;
  baseX: number;
  baseY: number;
};

const buildSphere = (parent: Anchor, cfg: SphereConfig): Floater => {
  const { anchor, group } = mountFloater(parent, cfg);
  const ringCount = 36;
  for (let i = 0; i < ringCount; i++) {
    const p = i / (ringCount - 1);
    const hue = cfg.hue + map(p, 0, 1, -20, 20);
    new Ellipse({
      addTo: group,
      diameter: (Math.sin((p * TAU) / 2) * cfg.diameter) / 2,
      translate: { z: (Math.cos((p * TAU) / 2) * cfg.diameter) / 4 },
      rotate: { z: rand(0, TAU) },
      color: `hsla(${hue}, 70%, 65%, 0.75)`,
      quarters: randInt(1, 3) as QuartersValue,
      stroke: rand(0.3, 0.8),
    });
  }
  return { anchor, group, ...driftDefaults(cfg) };
};

// ---- regular polygon (triangle / diamond / hexagon) ----
type PolygonConfig = {
  hue: number;
  sides: number;
  radius: number;
  baseX: number;
  baseY: number;
};

const buildPolygon = (parent: Anchor, cfg: PolygonConfig): Floater => {
  const { anchor, group } = mountFloater(parent, cfg);
  // Draw a couple of nested copies at slight rotations so the shape
  // doesn't read as a single flat sprite — it gets some depth as it
  // turns.
  const copies = 3;
  for (let i = 0; i < copies; i++) {
    new Polygon({
      addTo: group,
      sides: cfg.sides,
      radius: cfg.radius * (1 - i * 0.08),
      stroke: rand(0.6, 1.1),
      color: `hsla(${cfg.hue + i * 8}, 80%, 70%, ${0.7 - i * 0.18})`,
      rotate: { z: (i * TAU) / (cfg.sides * 6) },
    });
  }
  return { anchor, group, ...driftDefaults(cfg) };
};

// ---- wireframe box ----
type BoxConfig = {
  hue: number;
  size: number;
  baseX: number;
  baseY: number;
};

const buildBox = (parent: Anchor, cfg: BoxConfig): Floater => {
  const { anchor, group } = mountFloater(parent, cfg);
  const stroke = 0.9;
  // Render the box with translucent strokes by giving every face the
  // same hue but only stroking it (no fill). Zdog draws each face;
  // setting color: 'transparent' keeps it wireframe-feeling.
  new ZdogBox({
    addTo: group,
    width: cfg.size,
    height: cfg.size,
    depth: cfg.size,
    stroke,
    color: `hsla(${cfg.hue}, 75%, 70%, 0.75)`,
    leftFace: `hsla(${cfg.hue + 10}, 70%, 65%, 0.35)`,
    rightFace: `hsla(${cfg.hue - 10}, 70%, 65%, 0.35)`,
    topFace: `hsla(${cfg.hue + 20}, 75%, 75%, 0.4)`,
    bottomFace: `hsla(${cfg.hue - 20}, 65%, 55%, 0.35)`,
    frontFace: `hsla(${cfg.hue}, 75%, 60%, 0.4)`,
    rearFace: `hsla(${cfg.hue}, 75%, 60%, 0.35)`,
  });
  return { anchor, group, ...driftDefaults(cfg) };
};

// Pick a random base position across the full Zdog viewport. Range
// is chosen so spheres can sit anywhere from edge to edge — including
// behind the terminal panel, which is fine because the panel is
// semi-transparent and blurs whatever sits behind it.
const POS_RANGE = 420;
const randPos = () => rand(-POS_RANGE, POS_RANGE);

// Hand-picked hues and sizes per floater. Positions are randomized
// at mount so the layout is different every reload and never lines
// up neatly with the terminal's edges.
const SPHERE_HUES = [180, 280, 330, 40, 140, 210]; // aqua, violet, pink, amber, mint, sky
const SPHERE_CONFIGS: SphereConfig[] = SPHERE_HUES.map((hue) => ({
  hue,
  diameter: rand(80, 130),
  baseX: randPos(),
  baseY: randPos(),
}));

const POLYGON_SHAPES: { hue: number; sides: number; radius: number }[] = [
  { hue: 30, sides: 3, radius: 36 }, // orange triangle
  { hue: 250, sides: 3, radius: 28 }, // violet triangle
  { hue: 160, sides: 4, radius: 28 }, // teal diamond
  { hue: 320, sides: 6, radius: 34 }, // magenta hexagon
];
const POLYGON_CONFIGS: PolygonConfig[] = POLYGON_SHAPES.map((s) => ({
  ...s,
  baseX: randPos(),
  baseY: randPos(),
}));

const BOX_SHAPES: { hue: number; size: number }[] = [
  { hue: 200, size: 46 }, // blue cube
  { hue: 60, size: 38 }, // yellow cube
];
const BOX_CONFIGS: BoxConfig[] = BOX_SHAPES.map((s) => ({
  ...s,
  baseX: randPos(),
  baseY: randPos(),
}));

// Drives the background canvas: drifting ring-sphere "planets",
// polygons and wireframe cubes of different hues plus a wide field
// of slowly rotating stars.
export const StarAndPlanet = () => {
  const illo = new Illustration({
    element: "canvas",
    dragRotate: true,
    resize: true,
    zoom: 1.5,
    onResize: function (width, height) {
      const minSize = Math.min(width, height);
      this.zoom = minSize / 500;
    },
  });

  const floaters: Floater[] = [
    ...SPHERE_CONFIGS.map((cfg) => buildSphere(illo, cfg)),
    ...POLYGON_CONFIGS.map((cfg) => buildPolygon(illo, cfg)),
    ...BOX_CONFIGS.map((cfg) => buildBox(illo, cfg)),
  ];

  const starGroup = new Group({ addTo: illo });
  const stars: Star[] = [];
  const starCount = 1000;
  const starRange = 200;

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

  const start = performance.now();
  const animate = () => {
    const t = (performance.now() - start) / 1000; // seconds

    for (const f of floaters) {
      f.anchor.translate.x =
        f.baseX + Math.sin((t / f.px) * TAU + f.phaseX) * f.dx;
      f.anchor.translate.y =
        f.baseY + Math.cos((t / f.py) * TAU + f.phaseY) * f.dy;
      f.group.rotate.x += f.spinX;
      f.group.rotate.y += f.spinY;
      f.group.rotate.z += f.spinZ;
    }

    starGroup.rotate.y += 0.0005;
    starGroup.rotate.x -= 0.0007;
    starGroup.rotate.z -= 0.0009;

    illo.updateRenderGraph();
    requestAnimationFrame(animate);
  };

  animate();

  return null;
};
