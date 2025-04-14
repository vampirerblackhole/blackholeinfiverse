import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./LazyImage.module.css";

const LazyImage = ({ src, alt, className, style }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);
  const placeholderSrc = `${src}?w=20&blur=5`;

  useEffect(() => {
    // Check if IntersectionObserver is available
    if (!("IntersectionObserver" in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // When image comes in view
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px", // Start loading when image is 200px from viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (observer && imgRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  // Check if image is already cached when component mounts
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, []);

  const handleImageLoaded = () => {
    setIsLoaded(true);
  };

  return (
    <div
      ref={imgRef}
      className={`${styles.imageContainer} ${className || ""}`}
      style={style}
    >
      {/* Low quality placeholder */}
      <div
        className={`${styles.placeholder} ${
          isLoaded ? styles.placeholderLoaded : ""
        }`}
        style={{ backgroundImage: `url(${placeholderSrc})` }}
      />

      {/* Main image - only load when in viewport */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`${styles.image} ${isLoaded ? styles.imageLoaded : ""}`}
          onLoad={handleImageLoaded}
        />
      )}
    </div>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default LazyImage;
