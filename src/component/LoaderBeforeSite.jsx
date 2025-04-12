import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const LoaderBeforeSite = ({ onLoadingComplete, progress = 0 }) => {
  const canvasRef = useRef(null);
  const progressRef = useRef(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

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

    // Reduced number of stars for better performance
    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * 1000,
      size: Math.random() * 1 + 0.5,
      speed: Math.random() * 0.5 + 1, // Reduced speed
    }));

    const meteor = {
      x: -50,
      y: canvas.height / 2,
      size: 4,
      speed: 30,
      trail: [],
      particles: Array.from({ length: 20 }, () => ({
        x: 0,
        y: 0,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
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

      // Update loading progress more smoothly
      const targetProgress = progress;
      progressRef.current += (targetProgress - progressRef.current) * 0.1;
      setLoadingProgress(Math.min(progressRef.current, 100));

      // Optimized star animation
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
        if (meteor.trail.length > 15) meteor.trail.pop();

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
            // Optimize by updating only half the particles
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.02;

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

        if (meteor.x > canvas.width * 0.6) {
          phase = "zoom";
        }
      } else if (phase === "zoom") {
        cameraZoom += 0.1;

        if (cameraZoom > 4) {
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
        opacity -= 0.05;
        if (opacity <= 0) {
          cancelAnimationFrame(animationFrameId);
          setIsTransitioning(false);
          setShowLoader(false);
          onLoadingComplete?.();
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
  }, [onLoadingComplete, progress]);

  if (!showLoader) return null;

  return (
    <div
      className={`fixed inset-0 bg-black transition-opacity duration-500 ${
        isTransitioning ? "opacity-0" : "opacity-100"
      }`}
      style={{ zIndex: 50 }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div
        className={`absolute bottom-10 left-0 right-0 flex flex-col items-center transition-opacity duration-500 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 transition-all duration-300"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        <p className="text-white mt-2 text-sm font-mono">
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
