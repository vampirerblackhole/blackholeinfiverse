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
  backgroundColor = "#130e16",
  holeSize = 2.5,
  discOuterSize = 6,
  autoRotate = false,
  autoRotateSpeed = 1.0,
  scrollProgress = 0,
  isMobile = false,
  interactive = true,
  pulseEffect = true,
  emitLight = true,
}) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef({});
  const frameId = useRef(null);
  const targetCameraPos = useRef(new THREE.Vector3());
  const currentCameraPos = useRef(new THREE.Vector3());
  const targetRotation = useRef(0);
  const currentRotation = useRef(0);
  const mousePosition = useRef(new THREE.Vector2(0, 0));
  const pulseIntensity = useRef(0);
  const pulseDirection = useRef(1);

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
    renderer.setClearColor(0x000000); // Black color with 0 alpha (transparent)

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
    // Interstellar-style accretion disc gradient
    disc.gradient.style.addColorStop(0.0, "#ffffff"); // intense white core
    disc.gradient.style.addColorStop(0.1, "#e7e3db"); // soft cream-white
    disc.gradient.style.addColorStop(0.25, "#d6c8b4"); // dusty beige
    disc.gradient.style.addColorStop(0.4, "#b79878"); // warm tan-orange
    disc.gradient.style.addColorStop(0.55, "#8a7360"); // muted clay tone
    disc.gradient.style.addColorStop(0.7, "#5a5c6c"); // desaturated steel blue
    disc.gradient.style.addColorStop(0.85, "#393f52"); // deep cool gray
    disc.gradient.style.addColorStop(1.0, "#1a1a1a");
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
        uPulseIntensity: { value: 0 },
        uMousePosition: { value: new THREE.Vector2(0.5, 0.5) },
      },
    });
    disc.mesh = new THREE.Mesh(disc.geometry, disc.material);
    scene.add(disc.mesh);
    sceneRef.current.disc = disc.mesh;

    /**
     * Light Emission
     */
    if (emitLight) {
      const holeLight = new THREE.PointLight(new THREE.Color("#ff4136"), 2, 20);
      holeLight.position.set(0, 0, 0);
      scene.add(holeLight);
      sceneRef.current.holeLight = holeLight;

      const ambientLight = new THREE.AmbientLight(
        new THREE.Color("#130e16"),
        0.2
      );
      scene.add(ambientLight);
      sceneRef.current.ambientLight = ambientLight;
    }

    /**
     * Distortion
     */
    const distortion = {};
    distortion.scene = new THREE.Scene();

    distortion.hole = {};
    distortion.hole.geometry = new THREE.PlaneGeometry(5, 5);
    distortion.hole.material = new THREE.ShaderMaterial({
      transparent: false,
      vertexShader: distortionHoleVertexShader,
      fragmentShader: distortionHoleFragmentShader,
      uniforms: {
        uPulseIntensity: { value: 0 },
      },
    });
    distortion.hole.mesh = new THREE.Mesh(
      distortion.hole.geometry,
      distortion.hole.material
    );
    distortion.scene.add(distortion.hole.mesh);

    distortion.disc = {};
    distortion.disc.geometry = new THREE.PlaneGeometry(15, 15);
    distortion.disc.material = new THREE.ShaderMaterial({
      transparent: false,
      side: THREE.DoubleSide,
      vertexShader: distortionDiscVertexShader,
      fragmentShader: distortionDiscFragmentShader,
      uniforms: {
        uPulseIntensity: { value: 0 },
        uMousePosition: { value: new THREE.Vector2(0.5, 0.5) },
      },
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
        uPulseIntensity: { value: 0 },
      },
    });
    composition.plane.mesh = new THREE.Mesh(
      composition.plane.geometry,
      composition.plane.material
    );
    composition.scene.add(composition.plane.mesh);

    /**
     * Event Listeners
     */
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
      renderer.setClearColor("#000000"); // Black color with 0 alpha (transparent)

      renderer.render(scene, camera);

      renderer.setRenderTarget(
        sceneRef.current.composition?.distortionRenderTarget || null
      );
      renderer.setClearColor("#000000");
      renderer.render(distortion.scene, camera);

      renderer.setRenderTarget(null);
      renderer.render(composition.scene, composition.camera);

      frameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      cancelAnimationFrame(frameId.current);

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
      sceneRef.current.composition?.defaultRenderTarget?.dispose();
      sceneRef.current.composition?.distortionRenderTarget?.dispose();

      disc.gradient.texture.dispose();
    };
  }, [
    backgroundColor,
    holeSize,
    discOuterSize,
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

      targetRotation.current = -smoothProgress * Math.PI * 2;
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
  autoRotate: PropTypes.bool,
  autoRotateSpeed: PropTypes.number,
  scrollProgress: PropTypes.number,
  isMobile: PropTypes.bool,
};

export default BlackHole;
