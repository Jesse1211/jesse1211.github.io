import { useEffect } from 'react';
import { Illustration, Ellipse } from 'zdog';

const ZDogDemo = () => {
  useEffect(() => {
    const illo = new Illustration({
      element: '.zdog-canvas',
    });

    new Ellipse({
      addTo: illo,
      diameter: 80,
      stroke: 20,
      color: '#636',
    });

    illo.updateRenderGraph();

    function animate() {
      // rotate illo each frame
      illo.rotate.y += 0.03;
      illo.updateRenderGraph();
      // animate next frame
      requestAnimationFrame( animate );
    }
    // start animation
    animate();
  }, []);

  return null;
};

export default ZDogDemo;
