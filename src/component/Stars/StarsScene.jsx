import { useState, useEffect } from "react";
import Stars from "./Stars";
import "./Stars.css"; // Import stars-specific styles

export default function StarsScene() {
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHomePage, setIsHomePage] = useState(false);
  const [starOpacity, setStarOpacity] = useState(1);

  // Check if we're on the home page
  useEffect(() => {
    const checkIsHomePage = () => {
      const path = window.location.pathname;
      setIsHomePage(path === "/" || path === "");
    };

    checkIsHomePage();
    window.addEventListener("popstate", checkIsHomePage);
    window.addEventListener("pushstate", checkIsHomePage);

    return () => {
      window.removeEventListener("popstate", checkIsHomePage);
      window.removeEventListener("pushstate", checkIsHomePage);
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
        // Make stars more subtle on homepage to not compete with blackhole
        // Full opacity at the bottom of the page where blackhole fades out
        if (scrollPercent > 0.7) {
          setStarOpacity(Math.min(1, (scrollPercent - 0.7) / 0.3));
        } else {
          setStarOpacity(0.3); // More subtle on homepage
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

  // Ensure the component mounts after load
  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  // Get current pathname to differentiate star appearance between pages
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";

  // Customize star parameters based on page
  let starParams = {};
  if (isHomePage) {
    // Homepage - fewer, more subtle stars
    starParams = {
      starsCount: 5000,
      starsSize: 8,
      radius: 400,
    };
  } else if (pathname.includes("/about")) {
    // About page - more stars with different distribution
    starParams = {
      starsCount: 12000,
      starsSize: 12,
      radius: 450,
    };
  } else if (pathname.includes("/contact")) {
    // Contact page - dense field of smaller stars
    starParams = {
      starsCount: 18000,
      starsSize: 9,
      radius: 500,
    };
  } else {
    // Default for other pages
    starParams = {
      starsCount: 15000,
      starsSize: 10,
      radius: 400,
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
