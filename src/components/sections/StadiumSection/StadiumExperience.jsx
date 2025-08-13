import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, useProgress, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { Stadium } from "./Stadium";

/* eslint-disable react/no-unknown-property */
// The above eslint-disable is needed for React Three Fiber JSX props

function Loader() {
  const { progress } = useProgress();

  return <Html center>{progress.toFixed(1)} % loaded</Html>;
}
function StadiumExperience() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleScroll = () => {
      // Get the current scroll position
      const scrollY = window.scrollY * 2;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

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
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <Canvas
      shadows
      camera={{
        fov: 75, // Optional: Adjust the field of view
        near: 0.1,
        far: 1000,
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMappingExposure = 1.3; // Brighten overall scene (~40%)
      }}
    >
      <ambientLight intensity={0.4} />
      <hemisphereLight skyColor="#ffffff" groundColor="#1a1a1a" intensity={0.55} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={2.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-normalBias={0.05}
      />
      <Suspense fallback={<Loader />}>
        <Stadium position={[0, -4, 2]} scrollPosition={scrollPosition} />
      </Suspense>
      <ContactShadows
        position={[0, -4.3, 2]}
        opacity={0.3}
        scale={100}
        blur={2.8}
        far={40}
      />
    </Canvas>
  );
}

export default StadiumExperience;
