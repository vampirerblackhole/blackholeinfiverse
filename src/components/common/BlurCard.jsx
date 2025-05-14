import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const BlurCard = ({ children, className = "", colSpan = "" }) => {
  const cardRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [rotateY, setRotateY] = useState(0);

  // Check if device is mobile or tablet
  useEffect(() => {
    const checkDeviceSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);

      // Add tablet-specific adjustments
      if (width > 768 && width <= 1024) {
        // Tablet/small laptop size
        if (cardRef.current) {
          cardRef.current.style.padding = "30px 25px 35px 25px";
          cardRef.current.style.minHeight = "220px";
        }
      } else {
        // Reset to default padding for other sizes
        if (cardRef.current) {
          cardRef.current.style.padding = "40px 32px 50px 32px";
        }
      }
    };

    checkDeviceSize();
    window.addEventListener("resize", checkDeviceSize);
    return () => window.removeEventListener("resize", checkDeviceSize);
  }, []);

  // Determine if we're on a tablet/small laptop (between mobile and desktop)
  const isTablet = !isMobile && window.innerWidth <= 1024;

  // Handle mouse movement for horizontal-only 3D effect
  const handleMouseMove = (e) => {
    if (!cardRef.current || isMobile || isTablet) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;

    // Calculate mouse position relative to card center (X-axis only)
    const mouseX = e.clientX - rect.left - width / 2;

    // Convert to rotation value with reduced movement (-10 to 10 degrees)
    const newRotateY = (mouseX / (width / 2)) * 10;

    setRotateY(newRotateY);
  };

  // Reset transform when mouse leaves
  const handleMouseLeave = () => {
    if (isMobile || isTablet) return;
    setRotateY(0);
    setIsHovering(false);
  };

  // Enter transform when mouse enters
  const handleMouseEnter = () => {
    if (isMobile || isTablet) return;
    setIsHovering(true);
  };

  const cardStyle = {
    position: "relative",
    zIndex: 5,
    minHeight: isTablet ? "220px" : "250px", // Reduced height for tablet
    backdropFilter: isHovering ? "blur(25px)" : "blur(15px)",
    WebkitBackdropFilter: isHovering ? "blur(25px)" : "blur(15px)",
    background: isHovering ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.4)",
    transform:
      isMobile || isTablet
        ? "none"
        : `perspective(1200px) rotateY(${rotateY}deg) scale(${
            isHovering ? 1.05 : 1
          })`,
    transition:
      isMobile || isTablet
        ? "none"
        : isHovering
        ? "transform 0.1s ease-out"
        : "transform 0.5s ease-out",
    boxShadow:
      isMobile || isTablet
        ? "0 5px 15px rgba(0, 0, 0, 0.2)"
        : isHovering
        ? `${-rotateY * 0.5}px 5px 30px rgba(0, 0, 0, 0.3)`
        : "0 10px 20px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(100, 100, 100, 0.3)",
    borderRadius: "16px",
    padding: isTablet ? "30px 25px 35px 25px" : "40px 32px 50px 32px", // Reduced padding for tablet
    overflow: "hidden",
    transformStyle: "preserve-3d",
  };

  // Add glass reflection effect
  const glassReflection = {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "30%",
    background:
      "linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)",
    opacity: isHovering ? 0.15 : 0.05,
    transition: "opacity 0.3s ease-out",
    pointerEvents: "none",
    zIndex: 0,
    transform: `translateZ(10px)`,
  };

  // Content style to push it forward in 3D space
  const contentStyle = {
    position: "relative",
    zIndex: 2,
    transform: isHovering ? `translateZ(20px)` : `translateZ(0px)`,
    transition: "transform 0.3s ease-out",
    transformStyle: "preserve-3d",
  };

  return (
    <div
      ref={cardRef}
      className={`${className} ${colSpan}`}
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={contentStyle}>{children}</div>
      <div style={glassReflection} />
    </div>
  );
};

BlurCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  colSpan: PropTypes.string,
};

export default BlurCard;
