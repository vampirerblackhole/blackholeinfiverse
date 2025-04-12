import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const LoaderBeforeSite = ({ onLoadingComplete, progress = 0 }) => {
  const canvasRef = useRef(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef(null);

  // Update progress handling with guaranteed completion
  useEffect(() => {
    // Smoothly update the progress
    const targetProgress = Math.min(Math.max(0, progress), 100);

    // Use a faster transition for progress updates
    const progressTimer = setInterval(() => {
      setLoadingProgress((current) => {
        // Move towards target by larger increments
        const nextProgress =
          current < targetProgress
            ? Math.min(current + 2, targetProgress)
            : current;

        // Return same value if no change needed
        if (nextProgress === current && nextProgress === targetProgress) {
          clearInterval(progressTimer);
        }

        return nextProgress;
      });
    }, 10); // Faster refresh rate

    // Handle completion at 100%
    if (progress >= 100) {
      // Clear any existing timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Shorter delay before transition
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(true);

        // Shorter fade out animation
        timeoutRef.current = setTimeout(() => {
          setShowLoader(false);
          onLoadingComplete?.();
        }, 300); // Faster fade animation
      }, 200); // Much shorter delay at 100%
    }

    return () => {
      clearInterval(progressTimer);
    };
  }, [progress, onLoadingComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Canvas animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Optimized star count for better performance
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * 1000,
      size: Math.random() * 1 + 0.5,
      speed: Math.random() * 0.8 + 1.5, // Faster stars
    }));

    const meteor = {
      x: -50,
      y: canvas.height / 2,
      size: 4,
      speed: 40, // Faster meteor
      trail: [],
      particles: Array.from({ length: 15 }, () => ({
        x: 0,
        y: 0,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1,
        size: Math.random() * 2 + 0.5,
      })),
    };

    let cameraZoom = 1;
    let phase = "approach";
    let animationFrameId;
    let opacity = 1;

    const animate = () => {
      ctx.globalAlpha = opacity;
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars animation
      stars.forEach((star) => {
        star.z -= star.speed;
        if (star.z <= 0) {
          star.z = 1000;
          star.x = Math.random() * canvas.width;
          star.y = Math.random() * canvas.height;
        }

        const scale = 100 / star.z;
        const x = (star.x - canvas.width / 2) * scale + canvas.width / 2;
        const y = (star.y - canvas.height / 2) * scale + canvas.height / 2;

        if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, scale * 0.8)})`;
          ctx.arc(x, y, star.size * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      if (phase === "approach") {
        meteor.x += meteor.speed;
        meteor.trail.unshift({ x: meteor.x, y: meteor.y, size: meteor.size });
        if (meteor.trail.length > 12) meteor.trail.pop();

        meteor.trail.forEach((pos, i) => {
          const alpha = (1 - i / meteor.trail.length) * 0.5;
          ctx.beginPath();
          ctx.fillStyle = `rgba(147, 197, 253, ${alpha})`;
          ctx.arc(
            pos.x,
            pos.y,
            pos.size * (1 - i / meteor.trail.length),
            0,
            Math.PI * 2
          );
          ctx.fill();
        });

        const gradient = ctx.createRadialGradient(
          meteor.x,
          meteor.y,
          0,
          meteor.x,
          meteor.y,
          meteor.size * 2
        );
        gradient.addColorStop(0, "rgba(25, 25, 25, 1)");
        gradient.addColorStop(0.4, "rgba(17, 172, 253, 0.8)");
        gradient.addColorStop(1, "rgba(47, 19, 23, 0)");

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(meteor.x, meteor.y, meteor.size * 2, 0, Math.PI * 2);
        ctx.fill();

        meteor.particles.forEach((particle, index) => {
          if (index % 2 === 0) {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.03; // Faster particle decay

            if (particle.life <= 0) {
              particle.life = 1;
              particle.x = meteor.x;
              particle.y = meteor.y;
            }

            ctx.beginPath();
            ctx.fillStyle = `rgba(147, 197, 253, ${particle.life * 0.4})`;
            ctx.arc(
              particle.x,
              particle.y,
              particle.size * particle.life,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
        });

        if (meteor.x > canvas.width * 0.5) {
          // Earlier phase transition
          phase = "zoom";
        }
      } else if (phase === "zoom") {
        cameraZoom += 0.15; // Faster zoom

        if (cameraZoom > 3.5) {
          // Earlier fadeout
          phase = "fadeOut";
        }

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(cameraZoom, cameraZoom);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        const gradient = ctx.createRadialGradient(
          meteor.x,
          meteor.y,
          0,
          meteor.x,
          meteor.y,
          meteor.size * 2
        );
        gradient.addColorStop(0, "rgba(255, 25, 255, 1)");
        gradient.addColorStop(0.4, "rgba(147, 197, 253, 0.8)");
        gradient.addColorStop(1, "rgba(147, 197, 253, 0)");

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(meteor.x, meteor.y, meteor.size * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      } else if (phase === "fadeOut") {
        opacity -= 0.08; // Faster fade out
        if (opacity <= 0) {
          cancelAnimationFrame(animationFrameId);
          return;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!showLoader) return null;

  return (
    <div
      className={`fixed inset-0 bg-black transition-opacity duration-300 ${
        isTransitioning ? "opacity-0" : "opacity-100"
      }`}
      style={{ zIndex: 9999 }} // Ensure loader is above everything
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-opacity duration-300 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="w-80 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300"
            style={{
              width: `${loadingProgress}%`,
              transition: "width 0.2s ease-out",
            }}
          />
        </div>
        <p className="text-white mt-4 text-lg font-mono">
          Loading... {Math.round(loadingProgress)}%
        </p>
      </div>
    </div>
  );
};

LoaderBeforeSite.propTypes = {
  onLoadingComplete: PropTypes.func,
  progress: PropTypes.number,
};

export default LoaderBeforeSite;
