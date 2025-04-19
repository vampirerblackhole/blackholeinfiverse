import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const BlurCard = ({ children, className = "", colSpan = "" }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const cardStyle = {
    position: "relative",
    zIndex: 5,
    backdropFilter: isHovering ? "blur(25px)" : "blur(15px)",
    WebkitBackdropFilter: isHovering ? "blur(25px)" : "blur(15px)",
    background: isHovering ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.4)",
    transform: isHovering && !isMobile ? "scale(1.05)" : "scale(1)",
    transition: "all 0.3s ease-out",
    border: "1px solid rgba(100, 100, 100, 0.3)",
    borderRadius: "16px",
    padding: "32px",
    overflow: "hidden",
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
  };

  return (
    <div 
      className={`${className} ${colSpan}`}
      style={cardStyle}
      onMouseEnter={() => !isMobile && setIsHovering(true)}
      onMouseLeave={() => !isMobile && setIsHovering(false)}
    >
      <div style={{ position: "relative", zIndex: 2 }}>
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
