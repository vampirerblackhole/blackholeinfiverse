import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Oculus from "./Experience3";
import StadiumExperience from "./StadiumExperience";

// Register ScrollTrigger plugin globally
gsap.registerPlugin(ScrollTrigger);

function Main2() {
  const containerRef = useRef(null);

  // Initialize ScrollTrigger and ensure proper cleanup
  useEffect(() => {
    // Force a ScrollTrigger refresh after component mounts
    // This helps ensure all scroll-based animations work correctly
    const refreshTimer = setTimeout(() => {
      try {
        ScrollTrigger.refresh(true); // true = deep refresh
      } catch (error) {
        console.warn("Error refreshing ScrollTrigger:", error);
      }
    }, 500);

    return () => {
      clearTimeout(refreshTimer);
      // Clean up all ScrollTrigger instances when component unmounts
      try {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      } catch (error) {
        console.warn("Error cleaning up ScrollTrigger:", error);
      }
    };
  }, []);

  return (
    <div className="container" ref={containerRef}>
      <div
        className="Game"
        style={{
          position: "relative",
          zIndex: 10,
          height: "500vh",
          opacity: 1, // Start visible
        }}
      >
        <div
          className="model-container"
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100vw",
            zIndex: 10,
            willChange: "transform", // Performance optimization
          }}
        >
          <Oculus />
        </div>
      </div>

      <div
        className="stadium-container"
        style={{
          position: "relative",
          zIndex: 10,
          height: "600vh",
          opacity: 1, // Start visible
        }}
      >
        <div
          className="stadium"
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100vw",
            zIndex: 10,
            willChange: "transform", // Performance optimization
          }}
        >
          <StadiumExperience />
        </div>
      </div>
    </div>
  );
}

export default Main2;
