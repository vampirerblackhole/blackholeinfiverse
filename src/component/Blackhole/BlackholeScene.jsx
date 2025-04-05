import { useState, useEffect } from "react";
import BlackHole from "./BlackHole";
import "./Blackhole.css"; // Import blackhole-specific styles

export default function BlackholeScene() {
  const [mounted, setMounted] = useState(false);
  const [opacity, setOpacity] = useState(0.9); // Slight transparency
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHomePage, setIsHomePage] = useState(true);

  // Check if we're on the home page
  useEffect(() => {
    // Simple check for homepage using window.location
    const checkIsHomePage = () => {
      const path = window.location.pathname;
      setIsHomePage(path === "/" || path === "");
    };

    checkIsHomePage();

    // Listen for navigation changes
    window.addEventListener("popstate", checkIsHomePage);

    return () => {
      window.removeEventListener("popstate", checkIsHomePage);
    };
  }, []);

  // Handle scroll position for zoom effect and fade-out at robot section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollPosition / maxScroll;

      // Set scroll progress for blackhole zoom effect
      setScrollProgress(Math.min(scrollPercent, 1));

      // Fade out when reaching 70% of the page
      if (scrollPercent > 0.7) {
        setOpacity(Math.max(0, 0.9 - ((scrollPercent - 0.7) / 0.3) * 0.9));
      } else {
        setOpacity(0.9); // Slightly transparent
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ensure the component mounts after load
  useEffect(() => {
    setMounted(true);
    // Log for debugging
    console.log("BlackholeScene mounted");
    return () => {
      setMounted(false);
      console.log("BlackholeScene unmounted");
    };
  }, []);

  // Only render on homepage
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
        background: "rgba(0,0,0,0.8)", // Slightly transparent black background
        zIndex: 3, // Above basic content but below BHI content
        pointerEvents: "none",
        opacity: opacity,
        transition: "opacity 0.3s ease-out",
        mixBlendMode: "normal",
      }}
    >
      {mounted && (
        <BlackHole
          className="webgl blackhole-canvas-override"
          width="100%"
          height="100%"
          backgroundColor="transparent" // Make background transparent
          holeSize={2.5}
          discOuterSize={6}
          autoRotate={false}
          autoRotateSpeed={0}
          scrollProgress={scrollProgress}
        />
      )}
    </div>
  );
}
