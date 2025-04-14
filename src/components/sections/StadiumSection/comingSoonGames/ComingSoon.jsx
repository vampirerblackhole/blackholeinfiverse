import PropTypes from "prop-types";
import styles from "./ComingSoon.module.css";
import { useState, useEffect } from "react";
import LazyImage from "./LazyImage";

// Create a simplified version of the 3D card effect
const ComingSoon = ({
  game = {
    title: "Game Title",
    description:
      "This game is currently in development and will be available soon!",
  },
}) => {
  // State to track mouse position
  const [transform, setTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    active: false,
  });

  // Add custom stars as a backup
  useEffect(() => {
    // Check if the global stars are visible
    const starsContainer = document.querySelector(".stars-container-override");
    if (!starsContainer || getComputedStyle(starsContainer).opacity === "0") {
      console.log("Adding custom stars as backup");
      // If global stars aren't visible, add our own
      const customStars = document.createElement("div");
      customStars.className = styles.customStars;
      document.body.appendChild(customStars);

      return () => {
        document.body.removeChild(customStars);
      };
    }
  }, []);

  // Handle mouse movement
  const handleMouseMove = (e) => {
    if (!e.currentTarget) return;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate mouse position relative to card center
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Convert to rotation values (-10 to 10 degrees)
    const rotateY = -(mouseX / (width / 2)) * 10;
    const rotateX = (mouseY / (height / 2)) * 10;

    setTransform({
      rotateX,
      rotateY,
      active: true,
    });
  };

  // Reset transform when mouse leaves
  const handleMouseLeave = () => {
    setTransform({
      rotateX: 0,
      rotateY: 0,
      active: false,
    });
  };

  // Enter transform when mouse enters
  const handleMouseEnter = () => {
    setTransform((prev) => ({
      ...prev,
      active: true,
    }));
  };

  // Calculate the transform style for the card
  const cardStyle = {
    transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${
      transform.rotateY
    }deg) scale(${transform.active ? 1.03 : 1})`,
    transition: transform.active
      ? "transform 0.1s ease"
      : "transform 0.5s ease",
    boxShadow: transform.active
      ? `${transform.rotateY * 0.5}px ${
          transform.rotateX * -0.5
        }px 50px rgba(111, 66, 193, 0.8)`
      : "0 10px 30px rgba(111, 66, 193, 0.3)",
    border: transform.active
      ? "3px solid rgba(155, 89, 182, 0.8)"
      : "2px solid rgba(155, 89, 182, 0.3)",
    pointerEvents: "auto",
  };

  // Styles for inner elements
  const titleStyle = {
    transform: transform.active
      ? `translateZ(50px) translateX(${
          transform.rotateY * -1.5
        }px) translateY(${transform.rotateX * -1.5}px)`
      : "none",
    transition: transform.active
      ? "transform 0.1s ease"
      : "transform 0.5s ease",
  };

  const descStyle = {
    transform: transform.active
      ? `translateZ(30px) translateX(${transform.rotateY * -1}px) translateY(${
          transform.rotateX * -1
        }px)`
      : "none",
    transition: transform.active
      ? "transform 0.1s ease"
      : "transform 0.5s ease",
  };

  const tagStyle = {
    transform: transform.active
      ? `translateZ(80px) translateX(${transform.rotateY * 0.5}px) translateY(${
          transform.rotateX * 0.5
        }px)`
      : "none",
    transition: transform.active
      ? "transform 0.1s ease"
      : "transform 0.5s ease",
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.gameImageContainer}
        style={cardStyle}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Use our LazyImage component instead of regular img */}
        {game?.image && (
          <LazyImage
            src={game.image}
            alt={game.title || "Coming Soon Game"}
            className={styles.gameImage}
          />
        )}

        <div className={styles.cornerTag} style={tagStyle}>
          <span>Coming Soon!</span>
        </div>
        <div className={styles.overlay}>
          <h1 className={styles.title} style={titleStyle}>
            {game?.title || "Game Title"}
          </h1>
          <p className={styles.description} style={descStyle}>
            {game?.description ||
              "This game is currently in development and will be available soon!"}
          </p>
        </div>
      </div>
    </div>
  );
};

ComingSoon.propTypes = {
  game: PropTypes.shape({
    image: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
  }),
};

export default ComingSoon;
