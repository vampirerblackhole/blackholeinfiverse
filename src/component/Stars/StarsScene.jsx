import { useState, useEffect } from "react";
import Stars from "./Stars";
import "./Stars.css"; // Import stars-specific styles

export default function StarsScene() {
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHomePage, setIsHomePage] = useState(false);
  const [starOpacity, setStarOpacity] = useState(1);

  // Simple check if we're on the home page - runs only once on mount/unmount
  useEffect(() => {
    const path = window.location.pathname;
    setIsHomePage(path === "/" || path === "");

    // Mount immediately
    setMounted(true);

    return () => {
      setMounted(false);
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

      // If on homepage, adjust opacity based on scroll to avoid interfering with blackhole
      if (isHomePage) {
        // Less opacity on homepage to complement blackhole
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
    // Initial call to set values
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // Determine current page for star parameters
  const path = window.location.pathname;

  // Customize star parameters based on page
  let starParams = {};

  if (path === "/" || path === "") {
    // Homepage - fewer stars that complement the blackhole
    starParams = {
      starsCount: 8000,
      starsSize: 5,
      radius: 450,
    };
  } else if (path.includes("/contact")) {
    // Contact page - dense star field that looked good
    starParams = {
      starsCount: 18000,
      starsSize: 5,
      radius: 500,
    };
  } else if (path.includes("/about")) {
    // About page - make it match the contact page since you liked that
    starParams = {
      starsCount: 15000,
      starsSize: 5.5,
      radius: 500,
    };
  } else {
    // Default for other pages
    starParams = {
      starsCount: 12000,
      starsSize: 5,
      radius: 450,
    };
  }

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
        zIndex: isHomePage ? -1 : 0, // Lower z-index on homepage to be behind the blackhole
        pointerEvents: "none", // Allow clicking through
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
