import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, useProgress } from "@react-three/drei";
import { Stadium } from "./Stadium";

/* eslint-disable react/no-unknown-property */
// The above eslint-disable is needed for React Three Fiber JSX props

function Loader() {
  const { progress } = useProgress();

  return <Html center>{progress.toFixed(1)} % loaded</Html>;
}
function StadiumExperience() {
  const [scrollPosition, setScrollPosition] = useState(0);

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
      camera={{
        fov: 75, // Optional: Adjust the field of view
        near: 0.1,
        far: 1000,
      }}
    >
      <directionalLight position={[3, 1, 1]} intensity={30} />
      <Suspense fallback={<Loader />}>
        <Stadium position={[0, -4, 2]} scrollPosition={scrollPosition} />
      </Suspense>
    </Canvas>
  );
}

export default StadiumExperience;
