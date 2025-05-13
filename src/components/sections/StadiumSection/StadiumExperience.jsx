import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, useProgress } from "@react-three/drei";
import { Stadium } from "./Stadium";

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
    // Throttle function to limit how often the scroll handler fires
    const throttle = (func, limit) => {
      let inThrottle;
      return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    };

    const handleScroll = throttle(() => {
      // Get the current scroll position with more reliable calculation
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollMultiplier = 2; // Keep your multiplier
      const adjustedScrollY = scrollY * scrollMultiplier;

      // Get more accurate document height
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      );

      const windowHeight = window.innerHeight;
      const maxScroll = docHeight - windowHeight;

      // Normalize the scroll position (between 0 and 1) with safety checks
      if (maxScroll <= 0) {
        setScrollPosition(0);
        return;
      }

      const normalizedScroll = Math.min(
        Math.max(0, adjustedScrollY / maxScroll),
        2
      );
      setScrollPosition(normalizedScroll);
    }, 16); // ~60fps

    const handleResize = throttle(() => {
      // Update window size on resize
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // Force a scroll event to recalculate positions after resize
      handleScroll();
    }, 100);

    // Initial call to set correct values
    handleScroll();

    // Add scroll and resize event listeners with passive option for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
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
