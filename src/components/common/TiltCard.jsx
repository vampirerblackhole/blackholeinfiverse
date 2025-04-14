import { useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "./TiltCard.module.css";

const TiltCard = ({ title, description, className = "", style = {} }) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Handle mouse movement for vertical-only 3D effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const height = rect.height;

    // Calculate mouse position relative to card center (Y-axis only)
    const mouseY = e.clientY - rect.top - height / 2;

    // Convert to rotation value with reduced movement (-5 to 5 degrees)
    const newRotateX = (mouseY / (height / 2)) * 5;

    setRotateX(newRotateX);
  };

  // Reset transform when mouse leaves
  const handleMouseLeave = () => {
    setRotateX(0);
    setIsHovering(false);
  };

  // Enter transform when mouse enters
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  // Calculate the transform style for the card
  const cardStyle = {
    transform: `perspective(1200px) rotateX(${rotateX}deg)`,
    transition: isHovering ? "transform 0.1s ease" : "transform 0.5s ease",
    boxShadow: isHovering
      ? `0px ${rotateX * -0.3}px 20px rgba(0, 0, 0, 0.15)`
      : "0 10px 20px rgba(0, 0, 0, 0.1)",
    border: isHovering
      ? "1px solid rgba(255, 255, 255, 0.2)"
      : "1px solid rgba(255, 255, 255, 0.1)",
    ...style,
  };

  // Styles for inner elements
  const titleStyle = {
    transform: isHovering
      ? `translateZ(30px) translateY(${rotateX * -1}px)`
      : "none",
    transition: isHovering ? "transform 0.1s ease" : "transform 0.5s ease",
  };

  const textStyle = {
    transform: isHovering
      ? `translateZ(20px) translateY(${rotateX * -0.7}px)`
      : "none",
    transition: isHovering ? "transform 0.1s ease" : "transform 0.5s ease",
  };

  const lineStyle = {
    transform: isHovering
      ? `translateZ(15px) translateY(${rotateX * -0.3}px)`
      : "none",
    transition: isHovering ? "transform 0.1s ease" : "transform 0.5s ease",
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div
        ref={cardRef}
        className={styles.card}
        style={cardStyle}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.content}>
          <h2 className={styles.title} style={titleStyle}>
            {title}
          </h2>
          <div className={styles.line} style={lineStyle}></div>
          <p className={styles.description} style={textStyle}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

TiltCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default TiltCard;
