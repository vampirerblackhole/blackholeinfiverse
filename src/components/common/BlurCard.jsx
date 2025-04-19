import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const BlurCard = ({ children, className = "", colSpan = "" }) => {
  const cardRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [rotateY, setRotateY] = useState(0);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle mouse movement for horizontal-only 3D effect
  const handleMouseMove = (e) => {
    if (!cardRef.current || isMobile) return;

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
    if (isMobile) return;
    setRotateY(0);
    setIsHovering(false);
  };

  // Enter transform when mouse enters
  const handleMouseEnter = () => {
    if (isMobile) return;
    setIsHovering(true);
  };

  const cardStyle = {
    position: "relative",
    zIndex: 5,
    minHeight: "250px",
    backdropFilter: isHovering ? "blur(25px)" : "blur(15px)",
    WebkitBackdropFilter: isHovering ? "blur(25px)" : "blur(15px)",
    background: isHovering ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.4)",
    transform: isMobile
      ? "none"
      : `perspective(1200px) rotateY(${rotateY}deg) scale(${isHovering ? 1.05 : 1})`,
    transition: isMobile
      ? "none"
      : isHovering
      ? "transform 0.1s ease-out"
      : "transform 0.5s ease-out",
    boxShadow: isMobile
      ? "0 5px 15px rgba(0, 0, 0, 0.2)"
      : isHovering
      ? `${-rotateY * 0.5}px 5px 30px rgba(0, 0, 0, 0.3)`
      : "0 10px 20px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(100, 100, 100, 0.3)",
    borderRadius: "16px",
    padding: "40px 32px 50px 32px",
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
    background: "linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)",
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
      <div style={contentStyle}>
        {children}
      </div>
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
