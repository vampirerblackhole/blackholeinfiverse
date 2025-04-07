import { useEffect, useRef } from "react";
import * as THREE from "three";
import PropTypes from "prop-types";

// Import star shaders
import starsVertexShader from "../../shaders/stars/vertex.glsl";
import starsFragmentShader from "../../shaders/stars/fragment.glsl";

const Stars = ({
  className = "stars-canvas",
  width = "100%",
  height = "100%",
  backgroundColor = "transparent",
  starsCount = 10000,
  starsSize = 30,
  scrollProgress = 0,
}) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef({});

  useEffect(() => {
    if (!canvasRef.current) return;

    const sizes = {
      width: canvasRef.current.clientWidth,
      height: canvasRef.current.clientHeight,
    };

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current.scene = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 0);
    scene.add(camera);
    sceneRef.current.camera = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true, // Enable alpha for transparent background
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (backgroundColor !== "transparent") {
      renderer.setClearColor(0x000000, 0); // Black color with 0 alpha (transparent)
    }
    sceneRef.current.renderer = renderer;

    /**
     * Stars
     */
    const stars = {};
    stars.count = starsCount;

    // Geometry
    const positionsArray = new THREE.Float32BufferAttribute(stars.count * 3, 3);
    const sizesArray = new THREE.Float32BufferAttribute(stars.count, 1);
    const colorsArray = new THREE.Float32BufferAttribute(stars.count * 3, 3);

    for (let i = 0; i < stars.count; i++) {
      // Positions - create a sphere of stars
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1.0);

      positionsArray.setXYZ(
        i,
        Math.cos(theta) * Math.sin(phi) * 400,
        Math.sin(theta) * Math.sin(phi) * 400,
        Math.cos(phi) * 400
      );

      // Sizes - make stars larger for more visibility in background
      sizesArray.setX(i, 2.5 + Math.random() * starsSize);

      // Colors - create bright stars that will show through black
      const hue =
        Math.random() > 0.7
          ? Math.round(200 + Math.random() * 60) // Blue-white stars
          : Math.round(Math.random() * 60); // Yellow-white stars

      const lightness = Math.round(90 + Math.random() * 10); // Very bright stars
      const color = new THREE.Color(`hsl(${hue}, 100%, ${lightness}%)`);

      colorsArray.setXYZ(i, color.r, color.g, color.b);
    }

    stars.geometry = new THREE.BufferGeometry();
    stars.geometry.setAttribute("position", positionsArray);
    stars.geometry.setAttribute("size", sizesArray);
    stars.geometry.setAttribute("color", colorsArray);

    // Material with custom shaders
    stars.material = new THREE.ShaderMaterial({
      transparent: true,
      vertexShader: starsVertexShader,
      fragmentShader: starsFragmentShader,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    });

    // Points
    stars.points = new THREE.Points(stars.geometry, stars.material);
    scene.add(stars.points);
    sceneRef.current.stars = stars.points;

    // Handle window resize
    const handleResize = () => {
      if (!canvasRef.current) return;

      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;

      // Update camera
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Rotate stars very slowly - using original rotation speed
      if (sceneRef.current.stars) {
        sceneRef.current.stars.rotation.y = elapsedTime * 0.03;
        sceneRef.current.stars.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;
      }

      // Render
      renderer.render(scene, camera);

      // Continue animation
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);

      // Dispose resources
      stars.geometry.dispose();
      stars.material.dispose();
      renderer.dispose();
    };
  }, [backgroundColor, starsCount, starsSize]); // Only recreate when these props change

  // Effect for scroll-based changes
  useEffect(() => {
    if (!sceneRef.current.camera || !sceneRef.current.stars) return;

    // Subtle camera movement based on scroll
    const camera = sceneRef.current.camera;
    const stars = sceneRef.current.stars;

    // Move camera slightly forward as user scrolls - like original
    camera.position.z = 20 - scrollProgress * 5;

    // Increase rotation speed slightly based on scroll - like original
    stars.rotation.y = stars.rotation.y * (1 + scrollProgress * 0.2);

    camera.updateProjectionMatrix();
  }, [scrollProgress]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: width,
        height: height,
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1, // Lower z-index to put stars in background
        pointerEvents: "none", // Allow clicking through
      }}
    />
  );
};

Stars.propTypes = {
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  backgroundColor: PropTypes.string,
  starsCount: PropTypes.number,
  starsSize: PropTypes.number,
  scrollProgress: PropTypes.number,
};

export default Stars;
