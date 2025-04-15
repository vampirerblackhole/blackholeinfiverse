import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { Robot } from "./Robot";
import { useProgress, Html } from "@react-three/drei";
import CameraAnimation from "./CameraAnimation";
import PropTypes from "prop-types";

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress.toFixed(1)} % loaded</Html>;
}

function Experience({ scrollPosition }) {
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
    window.addEventListener("resize", handleResize);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Calculate camera position based on screen size
  const getCameraPosition = () => {
    if (windowSize.width <= 480) return [0, 5, 12]; // Higher and further back for mobile
    if (windowSize.width <= 768) return [0, 2, 8]; // Higher and further back for tablets
    return [0, -1, 5]; // Original position for desktop
  };

  return (
    <Canvas
      camera={{
        position: getCameraPosition(),
        aspect: windowSize.width / windowSize.height, // Aspect ratio based on window size
        fov: 75, // Keep consistent field of view
        near: 0.1,
        far: 1000,
      }}
      style={{
        width: windowSize.width, // Full width of the window
        height: windowSize.height, // Full height of the window
        display: "block", // Avoid scrollbars
        position: "absolute", // Position canvas correctly in the layout
        top: 0,
        left: 0,
        zIndex: 1, // Set a low z-index so content can appear above it
      }}
    >
      <directionalLight position={[0, 5, 5]} intensity={15} />
      <Suspense fallback={<Loader />}>
        {/* <Name position={[-3.5, 3.7, -1]} /> */}
        <Robot position={[0, -16, 0]} scrollPosition={scrollPosition} />
        <CameraAnimation />
      </Suspense>
    </Canvas>
  );
}

export default Experience;

Experience.propTypes = {
  scrollPosition: PropTypes.number,
};
