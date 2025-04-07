import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../styles/BH.css";
import * as THREE from "three";

// Import star shaders
import starsVertexShader from "../../shaders/stars/vertex.glsl";
import starsFragmentShader from "../../shaders/stars/fragment.glsl";

gsap.registerPlugin(ScrollTrigger);

function BHI() {
  const scrollRef = useRef(null); // For the scroll container
  const canvasRef = useRef(null); // For the canvas element
  const starsCanvasRef = useRef(null); // For the stars canvas element
  const [initialLoading, setInitialLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const paragraphRef1 = useRef(null);
  const paragraphRef2 = useRef(null);
  const headingRef = useRef(null);
  const starsSceneRef = useRef({});

  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Create stars in 3D scene
  useEffect(() => {
    if (!starsCanvasRef.current) return;

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Scene
    const scene = new THREE.Scene();
    starsSceneRef.current.scene = scene;

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
    starsSceneRef.current.camera = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: starsCanvasRef.current,
      antialias: true,
      alpha: true, // Enable alpha for transparent background
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent background
    starsSceneRef.current.renderer = renderer;

    /**
     * Stars
     */
    const stars = {};
    stars.count = 15000;

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

      // Sizes - make stars larger for more visibility
      sizesArray.setX(i, 2.5 + Math.random() * 25);

      // Colors - create bright stars
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

    // Material
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
    starsSceneRef.current.stars = stars.points;

    // Animation loop
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Rotate stars very slowly
      if (starsSceneRef.current.stars) {
        starsSceneRef.current.stars.rotation.y = elapsedTime * 0.03;
        starsSceneRef.current.stars.rotation.x =
          Math.sin(elapsedTime * 0.02) * 0.05;
      }

      // Render
      renderer.render(scene, camera);

      // Continue animation
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Update camera
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);

      if (stars.geometry) stars.geometry.dispose();
      if (stars.material) stars.material.dispose();
      renderer.dispose();
    };
  }, []);

  const images = useMemo(() => {
    const loadedImages = [];
    let imagesLoaded = 0;

    for (let i = 100; i >= 0; i--) {
      const img = new Image();
      const nextNumber = String(i).padStart(4, "0");
      img.src = `/assets/BHI/${nextNumber}.webp`; // Image source with padding for zero

      // Wait for the image to load before adding it to the array
      img.onload = () => {
        imagesLoaded++;
        loadedImages.push(img);

        // Trigger a re-render or other logic if needed after all images are loaded
        if (imagesLoaded === 99) {
          // All 99 images are loaded
          console.log("All images loaded.");
          // Set loaded state to true once all images are loaded
          setIsLoaded(true);
        }
      };

      img.onerror = () => {
        console.error(`Image ${img.src} failed to load.`);
      };
    }

    return loadedImages;
  }, []);

  // Add additional useEffect to ensure the component is displayed if images take too long
  useEffect(() => {
    // Check if document is already loaded
    if (document.readyState === "complete") {
      setIsLoaded(true);
    } else {
      // Add fallback to ensure the component is displayed after a maximum time
      const fallbackTimer = setTimeout(() => {
        setIsLoaded(true);
      }, 3000); // After 3 seconds, force display even if not all images are loaded

      return () => clearTimeout(fallbackTimer);
    }
  }, []);

  // Function to handle the transition from blackhole to content
  useEffect(() => {
    // Handler function for the load event
    const handleLoad = () => {
      setInitialLoading(false);
      if (headingRef.current) {
        headingRef.current.style.opacity = "1";
      }
    };

    // Set initialLoading to false once the whole site is loaded
    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  // Check for paragraph visibility
  useEffect(() => {
    const handleScroll = () => {
      if (paragraphRef1.current) {
        const rect = paragraphRef1.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          paragraphRef1.current.classList.add("visible");
        } else {
          paragraphRef1.current.classList.remove("visible");
        }
      }

      if (paragraphRef2.current) {
        const rect = paragraphRef2.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          paragraphRef2.current.classList.add("visible");
        } else {
          paragraphRef2.current.classList.remove("visible");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger once to check initial visibility
    setTimeout(() => {
      handleScroll();
    }, 1000);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const render = (index) => {
    if (images[index] && images[index].complete) {
      const context = canvasRef.current?.getContext("2d");
      const img = images[index];
      if (context && img) {
        // Clear with transparent background
        context.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        const canvasWidth = canvasRef.current.width;
        const canvasHeight = canvasRef.current.height;

        const isMobile = window.innerWidth <= 768;

        let newWidth, newHeight, x, y;

        if (isMobile) {
          newHeight = canvasHeight;
          const aspectRatio = img.width / img.height;
          newWidth = newHeight * aspectRatio;
          x = (canvasWidth - newWidth) / 2;
          y = 0;
        } else {
          newWidth = canvasWidth;
          const aspectRatio = img.width / img.height;
          newHeight = newWidth / aspectRatio;
          y = (canvasHeight - newHeight) / 2;
          x = 0;
        }

        // Much stronger zoom effect for the blackhole
        const zoomLevel = 1 + index * 0.03; // Tripled the zoom factor
        const zoomedWidth = newWidth * zoomLevel;
        const zoomedHeight = newHeight * zoomLevel;
        const zoomX = x - (zoomedWidth - newWidth) / 2;
        const zoomY = y - (zoomedHeight - newHeight) / 2;

        // Calculate the opacity based on scroll position
        // When index approaches max (99), opacity approaches 0
        const maxIndex = images.length - 1;
        const opacity =
          index < maxIndex * 0.8
            ? 0.5 // Further reduced base opacity to 0.5 to let stars show through more
            : 0.5 - ((index - maxIndex * 0.8) / (maxIndex * 0.2)) * 0.5;

        // Apply opacity to the canvas context
        context.globalAlpha = opacity;
        context.drawImage(img, zoomX, zoomY, zoomedWidth, zoomedHeight);
        context.globalAlpha = 1.0; // Reset opacity
      }
    } else {
      console.warn("Image not fully loaded yet, skipping render.");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    gsap.to(".bh-head", {
      scrollTrigger: {
        trigger: "#bh", // Element that will trigger the animation when scrolled into view
        start: "top top", // When the top of the `.portal` reaches 80% of the viewport height
        end: "bottom 80%", // When the bottom of the `.portal` reaches 20% of the viewport height
        scrub: 1, // This will link the animation progress to the scroll
      },
      x: -1450,
      ease: "power4.out",
    });
    gsap.to(".bh-head2", {
      scrollTrigger: {
        trigger: "#bh", // Element that will trigger the animation when scrolled into view
        start: "top top", // When the top of the `.portal` reaches 80% of the viewport height
        end: "bottom 80%", // When the bottom of the `.portal` reaches 20% of the viewport height
        scrub: 1, // This will link the animation progress to the scroll
      },
      x: 1500,
      ease: "power4.out",
    });

    // Add fade-out for canvas when approaching robot section
    gsap.to(canvasRef.current, {
      scrollTrigger: {
        trigger: "#bh",
        start: "80% top",
        end: "bottom top",
        scrub: true,
      },
      opacity: 0,
      ease: "power2.out",
    });
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const scrollTrigger = ScrollTrigger.create({
      trigger: scrollRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      pin: false,
      markers: false,
      onUpdate: (self) => {
        const progress = self.progress;
        const imageIndex = Math.round(progress * (images.length - 1));
        render(imageIndex);
      },
    });

    return () => scrollTrigger.kill();
  }, [images]);

  return (
    <>
      <div
        id="bh"
        ref={scrollRef}
        style={{
          position: "relative",
          height: "500vh",
          width: "100vw",
          overflowX: "hidden",
          overflowY: "hidden",
          transition: "opacity 1.5s ease-in-out",
          zIndex: 10, // Above blackhole (3) and stars (1)
          background: "transparent", // Ensure background is transparent
          display: isLoaded ? "block" : "none", // Only display when loaded
        }}
      >
        {/* Stars Canvas - Appears behind BHI content */}
        <canvas
          ref={starsCanvasRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 0, // Below the main BHI canvas (z-index 5)
            pointerEvents: "none",
          }}
        />

        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 5, // Higher than stars (z-index 0) to ensure BHI is above stars
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            margin: 0,
            padding: 0,
            // Semi-transparent to let stars be subtly visible
            mixBlendMode: "normal", // Normal blend
          }}
        />
        <div
          id="hh"
          className="h-100 w-full relative font-bold text-white leading-tight"
          style={{
            position: "relative",
            top: "3%",
            zIndex: 25,
            fontSize: "5vw", // Make text size responsive using viewport width
            paddingTop: "5vh",
            height: "100vh",
          }}
        >
          <h1 className="gradient-text transition-opacity duration-500 ease-in-out text-6vw sm:text-[6vw] md:text-[6vw] lg:text-6xl xl:text-6xl bh-head ">
            <span>
              Take A
              <span>
                {" "}
                Step Towards <br />
              </span>
            </span>
          </h1>
          <h1 className="gradient-text transition-opacity duration-500 ease-in-out text-6vw sm:text-[6vw] md:text-[6vw] lg:text-6xl xl:text-6xl bh-head2 ">
            <span className="">The New Generation</span>
          </h1>
        </div>

        <div id="p12" className="fade-in" ref={paragraphRef1}>
          <h2 className="text-heading">
            Redefining Digital with AI Integration
          </h2>
          <p>
            The cyberspace is transforming, and so are we. At BlackHole InVerse,
            we are at the forefront of the next digital revolution. Specialising
            in cutting-edge technologies such as AI, Machine Learning, XR,
            Blockchain, and Robotics, we are crafting the future of Web3 and
            beyond.
          </p>
        </div>

        <div id="p11" className="fade-in" ref={paragraphRef2}>
          <h2 className="text-heading">
            Empowering Industries with Innovation
          </h2>
          <p>
            Our mission is to empower industries with innovative solutions that
            not only meet today&apos;s demands but also anticipate
            tomorrow&apos;s needs. Together, we&apos;re shaping a world where
            digital and physical realities converge seamlessly, driving progress
            and unlocking endless possibilities for the future.
          </p>
        </div>
      </div>
    </>
  );
}

export default BHI;
