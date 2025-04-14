import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BlackHole from "./BlackHole";
import "./Blackhole.css"; // Import blackhole-specific styles

export default function BlackholeScene() {
  const location = useLocation(); // Get current location
  const [mounted, setMounted] = useState(false);
  const [opacity, setOpacity] = useState(1); // Slight transparency
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHomePage, setIsHomePage] = useState(false); // Start with false until we confirm

  // Check if we're on the home page using react-router's location
  useEffect(() => {
    const path = location.pathname;
    setIsHomePage(path === "/" || path === "");
    console.log("Route changed, current path:", path);

    // If we're on the homepage, ensure we're mounted
    if (path === "/" || path === "") {
      setMounted(true);
    }
  }, [location]);

  // Handle scroll position for zoom effect and fade-out at robot section
  useEffect(() => {
    // Only add scroll listener if we're on the homepage
    if (!isHomePage) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY * 5; // Reduced from 10 to 5 for slower zoom effect
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollPosition / maxScroll;

      // Set scroll progress for blackhole zoom effect
      setScrollProgress(Math.min(scrollPercent, 1));

      // Fade out more gradually - start at 75% and use a longer transition (0.5 instead of 0.3)
      if (scrollPercent > 0.75) {
        setOpacity(Math.max(0, 1 - ((scrollPercent - 0.75) / 0.5) * 1));
      } else {
        setOpacity(1); // Fully visible until fade point
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Call it once immediately to set initial values
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // Ensure the component mounts with a slight delay to allow rendering
  useEffect(() => {
    if (isHomePage) {
      // Use a short timeout to ensure the component is fully rendered
      const timer = setTimeout(() => {
        setMounted(true);
        console.log("BlackholeScene mounted");
      }, 50);

      return () => {
        clearTimeout(timer);
        setMounted(false);
        console.log("BlackholeScene unmounted");
      };
    }
  }, [isHomePage]);

  // Don't render anything if not on homepage
  if (!isHomePage) {
    return null;
  }

  return (
    <div
      className="blackhole-container-override"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "transparent",
        zIndex: 0,
        pointerEvents: "auto",
        opacity: opacity,
        transition: "opacity 0.5s ease-out", // Increased from 0.3s to 0.5s for smoother transition
        mixBlendMode: "normal",
      }}
    >
      {mounted && (
        <BlackHole
          key="blackhole-component" // Adding a key to force re-render when needed
          className="webgl blackhole-canvas-override"
          width="100%"
          height="100%"
          backgroundColor="transparent"
          holeSize={2.6}
          discOuterSize={6}
          autoRotate={false}
          autoRotateSpeed={0}
          scrollProgress={scrollProgress}
        />
      )}
    </div>
  );
}
