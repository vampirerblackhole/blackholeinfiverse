import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Stars from "./Stars";
import "./Stars.css"; // Import stars-specific styles

export default function StarsScene() {
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHomePage, setIsHomePage] = useState(false);
  const [starOpacity, setStarOpacity] = useState(1);
  const [starParams, setStarParams] = useState({
    starsCount: 12000,
    starsSize: 5,
    radius: 450,
  });

  const { pathname: path } = useLocation();

  // Check page on mount only (no route tracking)
  useEffect(() => {
    setIsHomePage(path === "/" || path === "");

    // Mount immediately
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, [path]);

  // Handle scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollPosition / maxScroll;

      // Set scroll progress for stars parallax effect
      setScrollProgress(Math.min(scrollPercent, 1));

      // If on homepage, adjust opacity based on scroll
      if (isHomePage) {
        if (scrollPercent > 0.7) {
          setStarOpacity(Math.min(1, (scrollPercent - 0.7) / 0.3));
        } else {
          setStarOpacity(0.4);
        }
      } else {
        setStarOpacity(1); // Full opacity on other pages
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  useEffect(() => {
    if (path === "/") {
      setStarParams({
        starsCount: 18000,
        starsSize: 5,
        radius: 500,
      });
    } else if (path.includes("/about")) {
      setStarParams({
        starsCount: 15000,
        starsSize: 5.5,
        radius: 500,
      });
    } else {
      setStarParams({
        starsCount: 12000,
        starsSize: 5,
        radius: 450,
      });
    }
  }, [path]);

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
        zIndex: isHomePage ? -1 : 0,
        pointerEvents: "none",
        mixBlendMode: "normal",
        filter: "none",
        opacity: starOpacity,
        transition: "opacity 0.3s ease-out",
      }}
    >
      {mounted && (
        <Stars
          className="stars-canvas-override"
          width="100%"
          height="100%"
          backgroundColor="transparent"
          {...starParams}
          scrollProgress={scrollProgress}
        />
      )}
    </div>
  );
}
