import { Canvas } from '@react-three/fiber';
import React, { Suspense, useState, useEffect } from 'react';
import { Robot } from './Robot';
import { useProgress, Html, ScrollControls, OrbitControls } from '@react-three/drei';
import CameraAnimation from './CameraAnimation';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      {progress.toFixed(1)} % loaded
    </Html>
  );
}

function Experience({scrollPosition}) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      // Update window size on resize
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <Canvas
      camera={{
        position: [0, -1, 5],
        aspect: windowSize.width / windowSize.height, // Aspect ratio based on window size
        fov: 75, // Optional: Adjust the field of view
        near: 0.1,
        far: 1000,
      }}
      style={{
        width: windowSize.width, // Full width of the window
        height: windowSize.height, // Full height of the window
        display: 'block', // Avoid scrollbars
        position: 'absolute', // Position canvas correctly in the layout
        top: 0,
        left: 0,
      }}
    >
      <directionalLight position={[0, 5, 5]} intensity={15} />
      <Suspense fallback={<Loader />}>
        {/* <Name position={[-3.5, 3.7, -1]} /> */}
        <Robot position={[0, -16, 0]} scrollPosition={scrollPosition} />
        <CameraAnimation/>
      </Suspense>
    </Canvas>
  );
}

export default Experience;
