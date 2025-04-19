import { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./FuturisticCard.module.css";

const FuturisticCard = ({ title, description, className = "" }) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHover, setIsHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseMove = (e) => {
    if (isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateY((x / (rect.width / 2)) * 10);
    setRotateX(( -y / (rect.height / 2)) * 10);
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHover(false);
  };

  const cardStyle = {
    transform: isMobile
      ? "none"
      : `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHover ? 1.05 : 1})`,
    boxShadow: isMobile
      ? "0 5px 15px rgba(0,0,0,0.2)"
      : isHover
      ? `${-rotateY * 2}px ${rotateX * 2}px 30px rgba(0,255,255,0.3)`
      : "0 10px 20px rgba(0,0,0,0.3)",
  };

  return (
    <div className={`${styles.container} ${className}`}>  
      <div
        ref={cardRef}
        className={styles.card}
        style={cardStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </div>
  );
};

FuturisticCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default FuturisticCard;
