import { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./TiltCard.module.css";

const TiltCard = ({ title, description, className = "", style = {} }) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile or tablet
  useEffect(() => {
    const checkDeviceSize = () => {
      // Consider tablets as mobile for the tilt effect
      setIsMobile(window.innerWidth <= 1024);

      // Apply specific tablet adjustments if needed
      if (
        cardRef.current &&
        window.innerWidth <= 1024 &&
        window.innerWidth > 768
      ) {
        // Tablet-specific adjustments
        const titleElement = cardRef.current.querySelector(`.${styles.title}`);
        const descElement = cardRef.current.querySelector(
          `.${styles.description}`
        );

        if (titleElement) {
          titleElement.style.fontSize = "1.4rem";
          titleElement.style.lineHeight = "1.2";
          titleElement.style.marginBottom = "0.75rem";
          titleElement.style.wordWrap = "break-word";
          titleElement.style.overflowWrap = "break-word";
          titleElement.style.hyphens = "auto";
        }

        if (descElement) {
          descElement.style.fontSize = "0.85rem";
          descElement.style.lineHeight = "1.4";
          descElement.style.wordWrap = "break-word";
          descElement.style.overflowWrap = "break-word";
        }

        // Adjust card padding for tablet
        if (cardRef.current) {
          cardRef.current.style.padding = "1.5rem 1.25rem";
        }
      }
    };

    // Check on mount
    checkDeviceSize();

    // Check on resize
    window.addEventListener("resize", checkDeviceSize);
    return () => window.removeEventListener("resize", checkDeviceSize);
  }, []);

  // Handle mouse movement for vertical-only 3D effect
  const handleMouseMove = (e) => {
    if (!cardRef.current || isMobile) return;

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
    if (isMobile) return;
    setRotateX(0);
    setIsHovering(false);
  };

  // Enter transform when mouse enters
  const handleMouseEnter = () => {
    if (isMobile) return;
    setIsHovering(true);
  };

  // Calculate the transform style for the card
  const cardStyle = {
    transform: isMobile ? "none" : `perspective(1200px) rotateX(${rotateX}deg)`,
    transition: isMobile
      ? "none"
      : isHovering
      ? "transform 0.1s ease"
      : "transform 0.5s ease",
    boxShadow: isMobile
      ? "0 5px 15px rgba(0, 0, 0, 0.1)"
      : isHovering
      ? `0px ${rotateX * -0.3}px 20px rgba(0, 0, 0, 0.15)`
      : "0 10px 20px rgba(0, 0, 0, 0.1)",
    border:
      isHovering && !isMobile
        ? "1px solid rgba(255, 255, 255, 0.2)"
        : "1px solid rgba(255, 255, 255, 0.1)",
    ...style,
  };

  // Styles for inner elements - disable 3D transforms on mobile
  const titleStyle = {
    transform: isMobile
      ? "none"
      : isHovering
      ? `translateZ(30px) translateY(${rotateX * -1}px)`
      : "none",
    transition: isMobile
      ? "none"
      : isHovering
      ? "transform 0.1s ease"
      : "transform 0.5s ease",
  };

  const textStyle = {
    transform: isMobile
      ? "none"
      : isHovering
      ? `translateZ(20px) translateY(${rotateX * -0.7}px)`
      : "none",
    transition: isMobile
      ? "none"
      : isHovering
      ? "transform 0.1s ease"
      : "transform 0.5s ease",
    width: "100%",
    maxWidth: "100%",
  };

  const lineStyle = {
    transform: isMobile
      ? "none"
      : isHovering
      ? `translateZ(15px) translateY(${rotateX * -0.3}px)`
      : "none",
    transition: isMobile
      ? "none"
      : isHovering
      ? "transform 0.1s ease"
      : "transform 0.5s ease",
  };

  return (
    <div className={`${styles.container} ${className} tilt-card-container`}>
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
