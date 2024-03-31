import { Box, Illustration, Shape, TAU } from 'zdog';

const Words = () => {
  // Made with Zdog

    let isSpinning = true;

    const illo = new Illustration({
    element: '.zdog-canvas',
    rotate: { x: -TAU/16 },
    dragRotate: true,
    onDragStart: function() {
        isSpinning = false;
    }
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

    const d = 110;
    const dotPositions = [
    { face: 'top', translate: { x: 0, y: -d, z: 0 } },
    { face: 'bottom', translate: { x: 0, y: d, z: 0 } },
    { face: 'left', translate: { x: -d, y: 0, z: 0 } },
    { face: 'right', translate: { x: d, y: 0, z: 0 } },
    { face: 'front', translate: { x: 0, y: 0, z: d } },
    { face: 'back', translate: { x: 0, y: 0, z: -d } },
    ];

    dotPositions.forEach(({ translate }) => {
        new Shape({
            addTo: illo,
            translate,
            stroke: 25,
            color: '#636',
        });
    });

    function animate() {
        illo.rotate.y += isSpinning ? 0.03 : 0;
        illo.updateRenderGraph();
        requestAnimationFrame(animate);
    }

    animate();




    
  return null;
};

export default Words;
