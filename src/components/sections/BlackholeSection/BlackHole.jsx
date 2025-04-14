import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import PropTypes from "prop-types";

// Import shaders
import discVertexShader from "@/shaders/disc/vertex.glsl";
import discFragmentShader from "@/shaders/disc/fragment.glsl";
import noisesVertexShader from "@/shaders/noises/vertex.glsl";
import noisesFragmentShader from "@/shaders/noises/fragment.glsl";
import starsVertexShader from "@/shaders/stars/vertex.glsl";
import starsFragmentShader from "@/shaders/stars/fragment.glsl";
import distortionHoleVertexShader from "@/shaders/distortionHole/vertex.glsl";
import distortionHoleFragmentShader from "@/shaders/distortionHole/fragment.glsl";
import distortionDiscVertexShader from "@/shaders/distortionDisc/vertex.glsl";
import distortionDiscFragmentShader from "@/shaders/distortionDisc/fragment.glsl";
import compositionVertexShader from "@/shaders/composition/vertex.glsl";
import compositionFragmentShader from "@/shaders/composition/fragment.glsl";

const BlackHole = ({
  className = "webgl",
  width = "100%",
  height = "100%",
  backgroundColor = "#130e16",
  holeSize = 2.5,
  discOuterSize = 6,
  starsCount = 10000,
  starsSize = 30,
  autoRotate = false,
  autoRotateSpeed = 1.0,
  scrollProgress = 0,
  isMobile = false,
}) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef({});
  const frameId = useRef(null);
  const targetCameraPos = useRef(new THREE.Vector3());
  const currentCameraPos = useRef(new THREE.Vector3());
  const targetRotation = useRef(0);
  const currentRotation = useRef(0);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const sizes = {
      width: canvasRef.current.clientWidth,
      height: canvasRef.current.clientHeight,
    };

    const scene = new THREE.Scene();
    sceneRef.current.scene = scene;

    const fov = isMobile ? 90 : 75;
    const camera = new THREE.PerspectiveCamera(
      fov,
      sizes.width / sizes.height,
      0.1,
      500
    );

    const initialPosition = isMobile
      ? { x: -8, y: 2, z: 6 }
      : { x: -15, y: 5, z: 10 };

    camera.position.set(
      initialPosition.x,
      initialPosition.y,
      initialPosition.z
    );
    currentCameraPos.current.copy(camera.position);
    targetCameraPos.current.copy(camera.position);
    scene.add(camera);
    sceneRef.current.camera = camera;

    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = autoRotateSpeed;
    controls.enableZoom = false;
    controls.enabled = false;
    sceneRef.current.controls = controls;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: !isMobile,
      powerPreference: "high-performance",
      alpha: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Use black color with 0 alpha for transparency
    sceneRef.current.renderer = renderer;

    const pixelRatio = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);
    const renderTargetOptions = {
      generateMipmaps: false,
      format: THREE.RedFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    };

    sceneRef.current.composition = {
      defaultRenderTarget: new THREE.WebGLRenderTarget(
        sizes.width * pixelRatio,
        sizes.height * pixelRatio,
        { generateMipmaps: false }
      ),
      distortionRenderTarget: new THREE.WebGLRenderTarget(
        sizes.width * pixelRatio,
        sizes.height * pixelRatio,
        renderTargetOptions
      ),
    };

    /**
     * Noises
     */
    const noises = {};

    noises.scene = new THREE.Scene();
    noises.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    noises.camera.position.set(0, 0, 5);
    noises.scene.add(noises.camera);

    noises.plane = {};
    noises.plane.geometry = new THREE.PlaneGeometry(2, 2);
    noises.plane.material = new THREE.ShaderMaterial({
      vertexShader: noisesVertexShader,
      fragmentShader: noisesFragmentShader,
    });
    noises.plane.mesh = new THREE.Mesh(
      noises.plane.geometry,
      noises.plane.material
    );
    noises.scene.add(noises.plane.mesh);

    noises.renderTarget = new THREE.WebGLRenderTarget(
      isMobile ? 128 : 256,
      isMobile ? 128 : 256,
      {
        generateMipmaps: false,
        type: THREE.FloatType,
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
      }
    );

    renderer.setRenderTarget(noises.renderTarget);
    renderer.render(noises.scene, noises.camera);
    renderer.setRenderTarget(null);

    /**
     * Disc
     */
    const disc = {};

    disc.gradient = {};
    disc.gradient.canvas = document.createElement("canvas");
    disc.gradient.canvas.width = 1;
    disc.gradient.canvas.height = 128;
    disc.gradient.context = disc.gradient.canvas.getContext("2d");
    disc.gradient.style = disc.gradient.context.createLinearGradient(
      0,
      0,
      0,
      disc.gradient.canvas.height
    );
    disc.gradient.style.addColorStop(0, "#ffffff");
    disc.gradient.style.addColorStop(0.05, "#fffbf0");
    disc.gradient.style.addColorStop(0.15, "#ffe0a3");
    disc.gradient.style.addColorStop(0.3, "#ffb265");
    disc.gradient.style.addColorStop(0.45, "#ff7d45");
    disc.gradient.style.addColorStop(0.6, "#ff4136");
    disc.gradient.style.addColorStop(0.75, "#c93180");
    disc.gradient.style.addColorStop(0.9, "#8d2a8f");
    disc.gradient.context.fillStyle = disc.gradient.style;
    disc.gradient.context.fillRect(
      0,
      0,
      disc.gradient.canvas.width,
      disc.gradient.canvas.height
    );
    disc.gradient.texture = new THREE.CanvasTexture(disc.gradient.canvas);

    disc.geometry = new THREE.CylinderGeometry(
      holeSize,
      discOuterSize,
      0,
      isMobile ? 32 : 64,
      isMobile ? 4 : 8,
      true
    );
    disc.material = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      vertexShader: discVertexShader,
      fragmentShader: discFragmentShader,
      uniforms: {
        uGradientTexture: { value: disc.gradient.texture },
        uNoisesTexture: { value: noises.renderTarget.texture },
        uTime: { value: 0 },
        uOpacity: { value: 1.0 },
      },
    });
    disc.mesh = new THREE.Mesh(disc.geometry, disc.material);
    scene.add(disc.mesh);
    sceneRef.current.disc = disc.mesh;

    /**
     * Stars
     */
    const stars = {};
    stars.count = isMobile ? starsCount / 2 : starsCount;

    const positionsArray = new THREE.Float32BufferAttribute(stars.count * 3, 3);
    const sizesArray = new THREE.Float32BufferAttribute(stars.count, 1);
    const colorsArray = new THREE.Float32BufferAttribute(stars.count * 3, 3);

    // Create stars that are purely white - no color artifacts
    for (let i = 0; i < stars.count; i++) {
      // Use a modified uniform spherical distribution
      // with more stars closer to center
      let radius, theta, phi;

      const distributionChoice = Math.random();

      if (distributionChoice < 0.7) {
        // Distant background stars - avoid edges of screen
        radius = 400 + Math.random() * 500;
        theta = Math.random() * Math.PI * 2;
        phi = Math.acos(2 * Math.random() - 1);
      } else {
        // Mid-distance stars with spherical distribution
        radius = 200 + Math.random() * 200;
        theta = Math.random() * Math.PI * 2;
        phi = Math.acos(2 * Math.random() - 1);
      }

      const x = Math.cos(theta) * Math.sin(phi) * radius;
      const y = Math.sin(theta) * Math.sin(phi) * radius;
      const z = Math.cos(phi) * radius;

      positionsArray.setXYZ(i, x, y, z);

      // Star size - smaller stars with occasional larger ones
      const starSize =
        Math.random() < 0.98
          ? 0.1 + Math.random() * (starsSize * 0.2) // 98% small stars
          : 0.3 + Math.random() * (starsSize * 0.6); // 2% larger stars

      sizesArray.setX(i, starSize);

      // Use only pure white stars to eliminate RGB artifacts
      // Slight brightness variation for depth
      const brightness = 0.7 + Math.random() * 0.3;
      colorsArray.setXYZ(i, brightness, brightness, brightness);
    }

    stars.geometry = new THREE.BufferGeometry();
    stars.geometry.setAttribute("position", positionsArray);
    stars.geometry.setAttribute("size", sizesArray);
    stars.geometry.setAttribute("color", colorsArray);

    stars.material = new THREE.ShaderMaterial({
      transparent: true,
      vertexShader: starsVertexShader,
      fragmentShader: starsFragmentShader,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uSize: { value: isMobile ? 1.0 : 1.5 },
      },
    });

    stars.points = new THREE.Points(stars.geometry, stars.material);
    scene.add(stars.points);
    sceneRef.current.stars = stars.points;

    /**
     * Distortion
     */
    const distortion = {};
    distortion.scene = new THREE.Scene();

    distortion.hole = {};
    distortion.hole.geometry = new THREE.PlaneGeometry(5, 5);
    distortion.hole.material = new THREE.ShaderMaterial({
      vertexShader: distortionHoleVertexShader,
      fragmentShader: distortionHoleFragmentShader,
    });
    distortion.hole.mesh = new THREE.Mesh(
      distortion.hole.geometry,
      distortion.hole.material
    );
    distortion.scene.add(distortion.hole.mesh);

    distortion.disc = {};
    distortion.disc.geometry = new THREE.PlaneGeometry(15, 15);
    distortion.disc.material = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      vertexShader: distortionDiscVertexShader,
      fragmentShader: distortionDiscFragmentShader,
    });
    distortion.disc.mesh = new THREE.Mesh(
      distortion.disc.geometry,
      distortion.disc.material
    );
    distortion.disc.mesh.rotation.x = -Math.PI * 0.5;
    distortion.scene.add(distortion.disc.mesh);

    /**
     * Composition
     */
    const composition = {};

    composition.scene = new THREE.Scene();
    composition.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    composition.camera.position.set(0, 0, 5);
    composition.scene.add(composition.camera);

    composition.plane = {};
    composition.plane.geometry = new THREE.PlaneGeometry(2, 2);
    composition.plane.material = new THREE.ShaderMaterial({
      vertexShader: compositionVertexShader,
      fragmentShader: compositionFragmentShader,
      uniforms: {
        uDefaultTexture: {
          value: sceneRef.current.composition?.defaultRenderTarget?.texture,
        },
        uDistortionTexture: {
          value: sceneRef.current.composition?.distortionRenderTarget?.texture,
        },
        uConvergencePosition: { value: new THREE.Vector2() },
        uDistortionStrength: { value: 1.0 },
      },
    });
    composition.plane.mesh = new THREE.Mesh(
      composition.plane.geometry,
      composition.plane.material
    );
    composition.scene.add(composition.plane.mesh);

    // Store composition plane in sceneRef for opacity control
    sceneRef.current.composition = {
      ...sceneRef.current.composition,
      plane: composition.plane,
    };

    const handleResize = () => {
      if (
        !canvasRef.current ||
        !sceneRef.current.camera ||
        !sceneRef.current.renderer
      )
        return;

      const newWidth = canvasRef.current.clientWidth;
      const newHeight = canvasRef.current.clientHeight;

      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      camera.aspect = newWidth / newHeight;
      camera.fov = isMobile ? 90 : 75;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(
        isMobile ? 1 : Math.min(window.devicePixelRatio, 2)
      );

      if (sceneRef.current.composition) {
        const pixelRatio = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);
        sceneRef.current.composition.defaultRenderTarget?.setSize(
          newWidth * pixelRatio,
          newHeight * pixelRatio
        );
        sceneRef.current.composition.distortionRenderTarget?.setSize(
          newWidth * pixelRatio,
          newHeight * pixelRatio
        );
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    const clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();

      // Smooth camera movement
      const smoothness = isMobile ? 0.1 : 0.05;
      camera.position.lerp(targetCameraPos.current, smoothness);

      // Smooth disc rotation
      currentRotation.current +=
        (targetRotation.current - currentRotation.current) * smoothness;
      if (sceneRef.current.disc) {
        sceneRef.current.disc.rotation.y = currentRotation.current;
      }

      controls.update();

      if (sceneRef.current.disc) {
        const disc = sceneRef.current.disc;
        disc.material.uniforms.uTime.value = time;
      }

      distortion.hole.mesh.lookAt(camera.position);

      const screenPosition = new THREE.Vector3(0, 0, 0);
      screenPosition.project(camera);
      screenPosition.x = screenPosition.x * 0.5 + 0.5;
      screenPosition.y = screenPosition.y * 0.5 + 0.5;
      composition.plane.material.uniforms.uConvergencePosition.value.set(
        screenPosition.x,
        screenPosition.y
      );

      renderer.setRenderTarget(
        sceneRef.current.composition?.defaultRenderTarget || null
      );
      renderer.setClearColor(0x000000, 0); // Set alpha to 0 for transparency
      renderer.render(scene, camera);

      renderer.setRenderTarget(
        sceneRef.current.composition?.distortionRenderTarget || null
      );
      renderer.setClearColor(0x000000, 0); // Set alpha to 0 for transparency
      renderer.render(distortion.scene, camera);

      renderer.setRenderTarget(null);
      renderer.setClearColor(0x000000, 0); // Set alpha to 0 for transparency
      renderer.render(composition.scene, composition.camera);

      frameId.current = requestAnimationFrame(animate);
    };

    animate();

    // Store ref values that need to be accessed in cleanup
    const currentRenderer = renderer;
    const currentControls = controls;
    const currentComposition = sceneRef.current.composition;
    const currentGeometries = {
      disc: disc.geometry,
      noisesPlane: noises.plane.geometry,
      stars: stars.geometry,
      distortionHole: distortion.hole.geometry,
      distortionDisc: distortion.disc.geometry,
      compositionPlane: composition.plane.geometry,
    };
    const currentMaterials = {
      disc: disc.material,
      noisesPlane: noises.plane.material,
      stars: stars.material,
      distortionHole: distortion.hole.material,
      distortionDisc: distortion.disc.material,
      compositionPlane: composition.plane.material,
    };

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      cancelAnimationFrame(frameId.current);

      currentRenderer.dispose();
      currentControls.dispose();

      // Dispose geometries
      Object.values(currentGeometries).forEach((geometry) =>
        geometry.dispose()
      );

      // Dispose materials
      Object.values(currentMaterials).forEach((material) => material.dispose());

      noises.renderTarget.dispose();
      currentComposition?.defaultRenderTarget?.dispose();
      currentComposition?.distortionRenderTarget?.dispose();

      disc.gradient.texture.dispose();
    };
  }, [
    backgroundColor,
    holeSize,
    discOuterSize,
    starsCount,
    starsSize,
    autoRotate,
    autoRotateSpeed,
    isMobile,
  ]);

  useEffect(() => {
    if (sceneRef.current.camera && sceneRef.current.scene) {
      const progress = Math.min(1, Math.max(0, scrollProgress));

      const easeInOutExpo = (x) => {
        return x === 0
          ? 0
          : x === 1
          ? 1
          : x < 0.5
          ? Math.pow(2, 20 * x - 10) / 2
          : (2 - Math.pow(2, -20 * x + 10)) / 2;
      };

      const smoothProgress = easeInOutExpo(progress);

      const isMobileView = windowSize.width <= 768;

      const startX = isMobileView ? -8 : -15;
      const startY = isMobileView ? 2 : 5;
      const startZ = isMobileView ? 6 : 10;

      const endX = 0;
      const endY = 0;
      const endZ = isMobileView ? 2 : 3;

      targetCameraPos.current.set(
        startX + (endX - startX) * smoothProgress,
        startY + (endY - startY) * smoothProgress,
        startZ + (endZ - startZ) * smoothProgress
      );

      // Change rotation direction to maintain counter-clockwise rotation
      targetRotation.current = smoothProgress * Math.PI * 2;

      // Control opacity of black hole and accretion disc based on scroll
      // Start fading out at 70% of scroll progress, fully transparent at 100%
      const opacityThreshold = 0.7;
      const opacity =
        progress >= opacityThreshold
          ? 1 - (progress - opacityThreshold) / (1 - opacityThreshold)
          : 1;

      // Apply opacity to all relevant components
      if (sceneRef.current.disc && sceneRef.current.disc.material.uniforms) {
        // Update the uniform instead of material opacity
        sceneRef.current.disc.material.uniforms.uOpacity.value = opacity;
      }

      // Update stars opacity
      if (sceneRef.current.stars && sceneRef.current.stars.material) {
        const starsOpacity = Math.max(0.3, opacity);
        sceneRef.current.stars.material.opacity = starsOpacity;
      }

      // Update distortion effect strength based on opacity
      if (
        sceneRef.current.composition &&
        sceneRef.current.composition.plane &&
        sceneRef.current.composition.plane.material &&
        sceneRef.current.composition.plane.material.uniforms
      ) {
        sceneRef.current.composition.plane.material.uniforms.uDistortionStrength.value =
          opacity;
      }
    }
  }, [scrollProgress, windowSize]);

  const canvasStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    touchAction: "none",
  };

  return <canvas ref={canvasRef} className={className} style={canvasStyle} />;
};

BlackHole.propTypes = {
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  backgroundColor: PropTypes.string,
  holeSize: PropTypes.number,
  discOuterSize: PropTypes.number,
  starsCount: PropTypes.number,
  starsSize: PropTypes.number,
  autoRotate: PropTypes.bool,
  autoRotateSpeed: PropTypes.number,
  scrollProgress: PropTypes.number,
  isMobile: PropTypes.bool,
};

export default BlackHole;
