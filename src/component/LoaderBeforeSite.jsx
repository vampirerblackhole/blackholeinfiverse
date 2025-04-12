import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "../styles/Loader.css";

const LoadingAnimation = ({ onLoadingComplete }) => {
  const canvasRef = useRef(null);
  const progressRef = useRef(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

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

    const stars = Array.from({ length: 500 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * 1000,
      size: Math.random() * 1 + 1,
      speed: Math.random() * 1 + 2,
    }));

    const meteor = {
      x: -130,
      y: canvas.height / 2,
      size: 5,
      speed: 50,
      trail: [],
      particles: Array.from({ length: 30 }, () => ({
        x: 0,
        y: 0,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1,
        size: Math.random() * 3 + 1,
      })),
    };

    let cameraZoom = 1;
    let phase = "approach";
    let animationFrameId;

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update loading progress
      progressRef.current += 0.005;
      setLoadingProgress(Math.min(progressRef.current * 100, 100));

      // Draw stars with dynamic scaling based on progress
      stars.forEach((star) => {
        star.z -= star.speed * (progressRef.current * 0.5 + 0.5);
        if (star.z <= 0) {
          star.z = 1000;
          star.x = Math.random() * canvas.width;
          star.y = Math.random() * canvas.height;
        }

        const scale = 100 / star.z;
        const x = (star.x - canvas.width / 2) * scale + canvas.width / 2;
        const y = (star.y - canvas.height / 2) * scale + canvas.height / 2;

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, scale)})`;
        ctx.arc(x, y, star.size * scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // Enhanced meteor animation
      if (phase === "approach") {
        meteor.x += meteor.speed * (1 + progressRef.current * 0.5);
        meteor.trail.unshift({ x: meteor.x, y: meteor.y, size: meteor.size });
        if (meteor.trail.length > 20) meteor.trail.pop();

        // Draw meteor trail with improved gradient
        meteor.trail.forEach((pos, i) => {
          const alpha = (1 - i / meteor.trail.length) * 0.7;
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

        // Enhanced meteor glow effect
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

        // Particle system animation
        meteor.particles.forEach((particle) => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.life -= 0.01;

          if (particle.life <= 0) {
            particle.life = 1;
            particle.x = meteor.x;
            particle.y = meteor.y;
          }

          ctx.beginPath();
          ctx.fillStyle = `rgba(147, 197, 253, ${particle.life * 0.5})`;
          ctx.arc(
            particle.x,
            particle.y,
            particle.size * particle.life,
            0,
            Math.PI * 2
          );
          ctx.fill();
        });

        if (meteor.x > canvas.width * 0.6) {
          phase = "zoom";
        }
      } else if (phase === "zoom") {
        cameraZoom += 0.08;

        if (cameraZoom > 5) {
          phase = "transition";
          onLoadingComplete?.();
          return;
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
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onLoadingComplete]);

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ zIndex: 50 }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div style={{ position: "absolute", top: 30 }} id="loop">
          <h1 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 hover:to-purple-400 transition-all duration-500 hover:text-glow transform hover:scale-150 loop-h1">
            <span>BE A </span> PART{" "}
            <b>
              <i>OF</i>
            </b>{" "}
            THE <span>UNAWARE</span>{" "}
            <b>
              <i>FUTURE! </i>
            </b>
          </h1>
          <h1 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 hover:to-purple-400 transition-all duration-500 hover:text-glow transform hover:scale-150 loop-h1">
            <span>BE A </span> PART{" "}
            <b>
              <i>OF</i>
            </b>{" "}
            THE <span>UNAWARE</span>{" "}
            <b>
              <i>FUTURE! </i>
            </b>
          </h1>
        </div>

        {/* Loading Progress Indicator */}
        <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center">
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
    </div>
  );
};

LoadingAnimation.propTypes = {
  onLoadingComplete: PropTypes.func,
};

export default LoadingAnimation;
