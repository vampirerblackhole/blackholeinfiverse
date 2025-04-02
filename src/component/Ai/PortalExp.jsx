import { Canvas } from '@react-three/fiber';
import React, { Suspense, useState, useEffect } from 'react';
import { useProgress, Html, OrbitControls } from '@react-three/drei';
import { AI } from './AI';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      {progress.toFixed(1)} % loaded
    </Html>
  );
}

function PortalExp() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleScroll = () => {
      // Get the current scroll position
      const scrollY = window.scrollY * 2;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      // Normalize the scroll position (between 0 and 1)
      const normalizedScroll = Math.min(scrollY / maxScroll, 2);
      setScrollPosition(normalizedScroll);
    };

    const handleResize = () => {
      // Update window size on resize
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add scroll and resize event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
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
      <ambientLight intensity={3}/>
      <directionalLight position={[2, 2, -1]} intensity={5 } />
      <Suspense fallback={<Loader />}>
      
        <AI position={[5,-2.3,-1.8]}/>
      </Suspense>
    </Canvas>
  );
}

export default PortalExp;
