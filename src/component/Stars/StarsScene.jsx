import { useState, useEffect } from "react";
import Stars from "./Stars";
import "./Stars.css"; // Import stars-specific styles

export default function StarsScene() {
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHomePage, setIsHomePage] = useState(false);

  // Check if we're on the home page
  useEffect(() => {
    const checkIsHomePage = () => {
      const path = window.location.pathname;
      setIsHomePage(path === "/" || path === "");
    };

    checkIsHomePage();
    window.addEventListener("popstate", checkIsHomePage);

    return () => {
      window.removeEventListener("popstate", checkIsHomePage);
    };
  }, []);

  // Handle scroll position for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollPosition / maxScroll;

      // Set scroll progress for stars parallax effect
      setScrollProgress(Math.min(scrollPercent, 1));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ensure the component mounts after load
  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  return (
    <div
      className="stars-container-override"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "transparent",
        zIndex: 1, // Lower z-index so stars appear behind content
        pointerEvents: "none", // Allow clicking through
        mixBlendMode: "normal", // Changed back to normal to prevent affecting the blackhole
        filter: "none", // No filter to ensure consistent appearance across pages
        opacity: 1, // Full opacity for maximum visibility
      }}
    >
      {mounted && (
        <Stars
          className="stars-canvas-override"
          width="100%"
          height="100%"
          backgroundColor="transparent"
          starsCount={isHomePage ? 100000 : 10000} // Match other pages star count
          starsSize={isHomePage ? 45 : 35} // Reduced size to make stars sharper
          scrollProgress={scrollProgress}
        />
      )}
    </div>
  );
}
