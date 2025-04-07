import { useState, useEffect } from "react";
import ReferenceBlackhole from "./ReferenceBlackhole";
import "./styles.css";

export default function BlackholeScene() {
  const [mounted, setMounted] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHomePage, setIsHomePage] = useState(true);

  // Check if we're on the home page
  useEffect(() => {
    const checkIsHomePage = () => {
      const path = window.location.pathname;
      setIsHomePage(path === "/" || path === "");
    };

    checkIsHomePage();
    window.addEventListener("popstate", checkIsHomePage);
    return () => window.removeEventListener("popstate", checkIsHomePage);
  }, []);

  // Handle scroll for fade effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollPosition / maxScroll;

      setScrollProgress(Math.min(scrollPercent, 1));

      if (scrollPercent > 0.7) {
        setOpacity(Math.max(0, 1.0 - (scrollPercent - 0.7) / 0.3));
      } else {
        setOpacity(1.0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Component lifecycle
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Only render on homepage
  if (!isHomePage) {
    return null;
  }

  return (
    <div
      className="blackhole-container"
      style={{ opacity: opacity, transition: "opacity 0.3s ease-out" }}
    >
      {mounted && (
        <ReferenceBlackhole
          width="100%"
          height="100%"
          autoRotate={true}
          autoRotateSpeed={3.0 + scrollProgress * 3.0} // Higher rotation speed for better visibility
        />
      )}
    </div>
  );
}
