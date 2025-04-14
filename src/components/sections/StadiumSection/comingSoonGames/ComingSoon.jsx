import PropTypes from "prop-types";
import { useRef, useEffect } from "react";
import styles from "./ComingSoon.module.css";

const ComingSoon = ({
  game = {
    title: "Game Title",
    description:
      "This game is currently in development and will be available soon!",
  },
}) => {
  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const tagRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const title = titleRef.current;
    const desc = descRef.current;
    const tag = tagRef.current;

    if (!card) return;

    const handleMouseMove = (e) => {
      try {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate rotation (maximum 10 degrees)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateY = ((x - centerX) / centerX) * 10;
        const rotateX = ((centerY - y) / centerY) * 10;

        // Apply transform to card
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        // Title with stronger effect (deeper in Z)
        if (title) {
          title.style.transform = `translateZ(50px) translateX(${
            rotateY * -1.5
          }px) translateY(${rotateX * -1.5}px)`;
        }

        // Description with medium effect
        if (desc) {
          desc.style.transform = `translateZ(30px) translateX(${
            rotateY * -1
          }px) translateY(${rotateX * -1}px)`;
        }

        // Corner tag with opposite effect
        if (tag) {
          tag.style.transform = `translateZ(80px) translateX(${
            rotateY * 0.5
          }px) translateY(${rotateX * 0.5}px)`;
        }

        // Dynamic shadow based on tilt
        const shadowX = rotateY * 0.5;
        const shadowY = rotateX * -0.5;
        card.style.boxShadow = `${shadowX}px ${shadowY}px 30px rgba(111, 66, 193, 0.4)`;
      } catch (err) {
        console.error("Error in mouse move handler:", err);
      }
    };

    const handleMouseEnter = () => {
      try {
        card.style.transition =
          "transform 0.1s ease-out, box-shadow 0.1s ease-out";
        setTimeout(() => {
          card.style.transition =
            "transform 0.1s ease-out, box-shadow 0.1s ease-out";
        }, 100);
      } catch (err) {
        console.error("Error in mouse enter handler:", err);
      }
    };

    const handleMouseLeave = () => {
      try {
        card.style.transition = "transform 0.5s ease, box-shadow 0.5s ease";
        card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
        card.style.boxShadow = "0 10px 30px rgba(111, 66, 193, 0.3)";

        // Reset all elements
        if (title) title.style.transform = "translateZ(0)";
        if (desc) desc.style.transform = "translateZ(0)";
        if (tag) tag.style.transform = "translateZ(0)";
      } catch (err) {
        console.error("Error in mouse leave handler:", err);
      }
    };

    // Add event listeners
    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    // Cleanup
    return () => {
      if (card) {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseenter", handleMouseEnter);
        card.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.gameImageContainer} ref={cardRef}>
        {game?.image && (
          <img
            src={game.image}
            alt={game.title || "Coming Soon Game"}
            className={styles.gameImage}
          />
        )}
        <div className={styles.cornerTag} ref={tagRef}>
          <span>Coming Soon!</span>
        </div>
        <div className={styles.overlay}>
          <h1 className={styles.title} ref={titleRef}>
            {game?.title || "Game Title"}
          </h1>
          <p className={styles.description} ref={descRef}>
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
