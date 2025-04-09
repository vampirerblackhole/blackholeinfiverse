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
        mixBlendMode: "screen", // Changed to screen blend mode for better visibility
        filter: "none", // No filter to ensure consistent appearance across pages
        opacity: isHomePage ? 0.8 : 1, // Slightly reduced opacity on homepage to match other pages
      }}
    >
      {mounted && (
        <Stars
          className="stars-canvas-override"
          width="100%"
          height="100%"
          backgroundColor="transparent"
          starsCount={isHomePage ? 20000 : 10000} // More stars on homepage
          starsSize={isHomePage ? 40 : 35} // Bigger stars on homepage
          scrollProgress={scrollProgress}
        />
      )}
    </div>
  );
}
