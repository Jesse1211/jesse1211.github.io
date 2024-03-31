import { Box, Illustration, TAU } from 'zdog';

export const HomeSquare = () => {
  let isSpinning = true;
  const illo = new Illustration({
    element: '.zdog-canvas',
    rotate: { x: -TAU/16 },
    dragRotate: true,
    onDragStart: function() {
      isSpinning = false;
    },
  });

  new Box({
    addTo: illo,
    width: 200,
    height: 200,
    depth: 200,
    stroke: false,
    color: '#C25',
    leftFace: '#EA0',
    rightFace: '#E62',
    topFace: '#ED0',
    bottomFace: '#636',
  });
  
  function animate() {
    illo.rotate.y += isSpinning ? 0.01 : 0;
    illo.updateRenderGraph();
    requestAnimationFrame( animate );
  }
  
  animate();
    
  return null;
};
