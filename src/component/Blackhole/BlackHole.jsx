import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import PropTypes from "prop-types";

// Import shaders
import discVertexShader from "../../shaders/disc/vertex.glsl";
import discFragmentShader from "../../shaders/disc/fragment.glsl";
import noisesVertexShader from "../../shaders/noises/vertex.glsl";
import noisesFragmentShader from "../../shaders/noises/fragment.glsl";
import distortionHoleVertexShader from "../../shaders/distortionHole/vertex.glsl";
import distortionHoleFragmentShader from "../../shaders/distortionHole/fragment.glsl";
import distortionDiscVertexShader from "../../shaders/distortionDisc/vertex.glsl";
import distortionDiscFragmentShader from "../../shaders/distortionDisc/fragment.glsl";
import compositionVertexShader from "../../shaders/composition/vertex.glsl";
import compositionFragmentShader from "../../shaders/composition/fragment.glsl";

const BlackHole = ({
  className = "webgl",
  width = "100%",
  height = "100%",
  backgroundColor = "transparent",
  holeSize = 2.5,
  discOuterSize = 6,
  autoRotate = false,
  autoRotateSpeed = 1.0,
  scrollProgress = 0,
}) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef({});

  // Track window dimensions
  const [, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const sizes = {
      width: canvasRef.current.clientWidth,
      height: canvasRef.current.clientHeight,
    };

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current.scene = scene;

    // Camera - Adjust FOV based on screen size
    const fov = window.innerWidth <= 768 ? 90 : 75; // Wider FOV for mobile
    const camera = new THREE.PerspectiveCamera(
      fov,
      sizes.width / sizes.height,
      0.1,
      500
    );

    // Adjust initial camera position based on screen size
    const isMobile = window.innerWidth <= 768;
    const initialPosition = isMobile
      ? { x: 5, y: 8, z: 12 } // Closer view for mobile
      : { x: 8, y: 10, z: 15 }; // Default position for desktop

    camera.position.set(
      initialPosition.x,
      initialPosition.y,
      initialPosition.z
    );
    camera.lookAt(0, 0, 0);
    scene.add(camera);
    sceneRef.current.camera = camera;

    // Controls
    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = autoRotateSpeed;
    controls.enableZoom = false;
    controls.enabled = false;
    sceneRef.current.controls = controls;

    // Renderer with pixel ratio handling
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: "high-performance",
      alpha: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (backgroundColor !== "transparent") {
      renderer.setClearColor(backgroundColor);
    } else {
      renderer.setClearColor(0x000000, 0);
    }
    sceneRef.current.renderer = renderer;

    // Composition render targets with adaptive resolution
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    const renderTargetOptions = {
      generateMipmaps: false,
      format: THREE.RedFormat,
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

    // Custom scene
    noises.scene = new THREE.Scene();
    noises.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    noises.camera.position.set(0, 0, 5);
    noises.scene.add(noises.camera);

    // Plane
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

    // Render target
    noises.renderTarget = new THREE.WebGLRenderTarget(256, 256, {
      generateMipmaps: false,
      type: THREE.FloatType,
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping,
    });

    // Render the noises into the render target
    renderer.setRenderTarget(noises.renderTarget);
    renderer.render(noises.scene, noises.camera);
    renderer.setRenderTarget(null);

    /**
     * Disc
     */
    const disc = {};

    // Gradient
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

    // Mesh
    disc.geometry = new THREE.CylinderGeometry(
      holeSize,
      discOuterSize * 1.2, // Make outer edge larger for more dramatic disc
      1.0, // Greater thickness for more visible 3D effect
      256, // Even more segments for smoother edge
      24, // More radial segments for better detail
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
      },
    });
    disc.mesh = new THREE.Mesh(disc.geometry, disc.material);

    // Set disc at a more dynamic angle to look more 3D
    disc.mesh.rotation.x = Math.PI / 3; // More dramatic tilt
    disc.mesh.rotation.z = Math.PI / 8; // Slight rotation for better appearance

    scene.add(disc.mesh);
    sceneRef.current.disc = disc.mesh;

    /**
     * Black hole (event horizon)
     */
    const blackHole = new THREE.Mesh(
      new THREE.CircleGeometry(holeSize, 128), // Higher resolution for smoother circle
      new THREE.MeshBasicMaterial({
        color: "black",
        side: THREE.DoubleSide, // Ensure visible from both sides
      })
    );
    // Align with the tilted disc
    blackHole.rotation.x = -Math.PI / 3;
    blackHole.rotation.z = Math.PI / 8;
    scene.add(blackHole);
    sceneRef.current.blackHole = blackHole;

    /**
     * Distortion
     */
    const distortion = {};
    distortion.scene = new THREE.Scene();

    // Hole
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

    // Disc
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

    // Plane
    composition.plane = {};
    composition.plane.geometry = new THREE.PlaneGeometry(2, 2);
    composition.plane.material = new THREE.ShaderMaterial({
      vertexShader: compositionVertexShader,
      fragmentShader: compositionFragmentShader,
      uniforms: {
        uDefaultTexture: {
          value: sceneRef.current.composition.defaultRenderTarget.texture,
        },
        uDistortionTexture: {
          value: sceneRef.current.composition.distortionRenderTarget.texture,
        },
        uConvergencePosition: { value: new THREE.Vector2() },
      },
    });
    composition.plane.mesh = new THREE.Mesh(
      composition.plane.geometry,
      composition.plane.material
    );
    composition.scene.add(composition.plane.mesh);

    const handleResize = () => {
      if (
        !canvasRef.current ||
        !sceneRef.current.camera ||
        !sceneRef.current.renderer
      )
        return;

      const newWidth = canvasRef.current.clientWidth;
      const newHeight = canvasRef.current.clientHeight;

      // Update window size state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // Update camera
      const camera = sceneRef.current.camera;
      camera.aspect = newWidth / newHeight;
      camera.fov = window.innerWidth <= 768 ? 90 : 75;
      camera.updateProjectionMatrix();

      // Update renderer
      const renderer = sceneRef.current.renderer;
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Update render targets
      if (sceneRef.current.composition) {
        const pixelRatio = Math.min(window.devicePixelRatio, 2);
        sceneRef.current.composition.defaultRenderTarget.setSize(
          newWidth * pixelRatio,
          newHeight * pixelRatio
        );
        sceneRef.current.composition.distortionRenderTarget.setSize(
          newWidth * pixelRatio,
          newHeight * pixelRatio
        );
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    const clock = new THREE.Clock();
    const tick = () => {
      const time = clock.getElapsedTime();

      // Update controls
      controls.update();

      // Add more dynamic 3D movement to the disc
      if (sceneRef.current.disc) {
        const disc = sceneRef.current.disc;
        disc.material.uniforms.uTime.value = time;

        // More pronounced breathing effect
        const breathingAmount = Math.sin(time * 0.3) * 0.15;
        disc.position.y = breathingAmount;

        // Subtle wobble effect for more organic appearance
        disc.rotation.x = Math.PI / 3 + Math.sin(time * 0.2) * 0.03;
        disc.rotation.z += 0.0005; // Very slow constant rotation
      }

      // Synchronize black hole movement with disc
      if (sceneRef.current.blackHole) {
        const blackHole = sceneRef.current.blackHole;
        const disc = sceneRef.current.disc;

        if (disc) {
          // Match position and rotation but invert x rotation
          blackHole.position.y = disc.position.y;
          blackHole.rotation.x = -disc.rotation.x; // Inverted to face the right direction
          blackHole.rotation.z = disc.rotation.z;
        } else {
          // Fallback if disc reference is lost
          blackHole.position.y = Math.sin(time * 0.3) * 0.15;
        }
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
        sceneRef.current.composition.defaultRenderTarget
      );
      renderer.setClearColor(backgroundColor);
      renderer.render(scene, camera);

      renderer.setRenderTarget(
        sceneRef.current.composition.distortionRenderTarget
      );
      renderer.setClearColor("#000000");
      renderer.render(distortion.scene, camera);

      renderer.setRenderTarget(null);
      renderer.render(composition.scene, composition.camera);

      window.requestAnimationFrame(tick);
    };

    const animationId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      cancelAnimationFrame(animationId);

      renderer.dispose();
      controls.dispose();

      disc.geometry.dispose();
      noises.plane.geometry.dispose();
      distortion.hole.geometry.dispose();
      distortion.disc.geometry.dispose();
      composition.plane.geometry.dispose();

      disc.material.dispose();
      noises.plane.material.dispose();
      distortion.hole.material.dispose();
      distortion.disc.material.dispose();
      composition.plane.material.dispose();

      noises.renderTarget.dispose();
      sceneRef.current.composition.defaultRenderTarget.dispose();
      sceneRef.current.composition.distortionRenderTarget.dispose();

      disc.gradient.texture.dispose();
    };
  }, [backgroundColor, holeSize, discOuterSize, autoRotate, autoRotateSpeed]);

  // Handle scroll effect
  useEffect(() => {
    if (!sceneRef.current) return;

    const { camera, scene, disc } = sceneRef.current;
    if (!camera || !scene) return;

    const progress = Math.min(1, Math.max(0, scrollProgress));

    // Smooth easing
    const easeInOutQuart = (t) =>
      t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

    const smoothProgress = easeInOutQuart(progress);

    // More dramatic camera movement
    const isMobile = window.innerWidth <= 768;

    // Start position (already set in initial camera setup)
    const startX = isMobile ? 5 : 8;
    const startY = isMobile ? 8 : 10;
    const startZ = isMobile ? 12 : 15;

    // End position - closer and more direct view
    const endX = 1;
    const endY = 3;
    const endZ = isMobile ? 5 : 7;

    // Update camera position with more dramatic movement
    camera.position.set(
      startX + (endX - startX) * smoothProgress,
      startY + (endY - startY) * smoothProgress,
      startZ + (endZ - startZ) * smoothProgress
    );

    // More dramatic disc rotation during scroll
    if (disc) {
      // Rotate on multiple axes for more interesting effect
      disc.rotation.z = Math.PI / 8 + progress * Math.PI * 0.5;
      disc.rotation.y = progress * Math.PI * 0.2; // Add slight y-axis rotation
    }

    // Always look at the origin
    camera.lookAt(0, 0, 0);
  }, [scrollProgress]);

  const canvasStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    touchAction: "none", // Prevent default touch behaviors
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
  autoRotate: PropTypes.bool,
  autoRotateSpeed: PropTypes.number,
  scrollProgress: PropTypes.number,
};

export default BlackHole;
