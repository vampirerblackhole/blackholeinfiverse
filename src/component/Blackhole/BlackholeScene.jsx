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
      const scrollPosition = window.scrollY * 3.5;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollPosition / maxScroll;

      // Set scroll progress for blackhole zoom effect
      setScrollProgress(Math.min(scrollPercent, 1));

      // Fade out when reaching 70% of the page
      if (scrollPercent > 0.9) {
        setOpacity(Math.max(0, 0.9 - ((scrollPercent - 0.9) / 0.3) * 0.9));
      } else {
        setOpacity(0.9); // Slightly transparent
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
        background: "rgba(0,0,0,0.6)", // More transparent to let stars show through better
        zIndex: 2, // Set to 2 to work better with global StarsScene (z-index 1)
        pointerEvents: "auto", // Allow mouse interactions
        opacity: opacity,
        transition: "opacity 0.3s ease-out",
        mixBlendMode: "normal",
      }}
    >
      {mounted && (
        <BlackHole
          key="blackhole-component" // Adding a key to force re-render when needed
          className="webgl blackhole-canvas-override"
          width="100%"
          height="100%"
          backgroundColor="black" // Make background transparent
          holeSize={2.6}
          discOuterSize={6}
          autoRotate={false}
          autoRotateSpeed={0}
          scrollProgress={scrollProgress}
          interactive={true} // Enable interactive mouse effects
          pulseEffect={true} // Enable pulsing animation
          emitLight={true} // Enable light emission
        />
      )}
    </div>
  );
}
