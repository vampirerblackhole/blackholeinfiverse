import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { animationManager } from "../../../utils/AnimationManager";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Initial camera target - centered position
const cameraTarget = new THREE.Vector3(0, 0.5, 0);

export default function CameraAnimation() {
  const camera = useThree((state) => state.camera);
  const t1 = useRef(gsap.timeline());
  const isMobile = window.innerWidth <= 768;

  useFrame(() => {
    camera.lookAt(cameraTarget); // Keep updating the camera's lookAt target
  });

  useEffect(() => {
    const timeline = t1.current;

    // Wait for animation manager to be ready before initializing camera animations
    const initializeCameraAnimations = () => {
      // Get the initial camera position from Experience.jsx
      const initialX = camera.position.x;
      const initialY = camera.position.y;
      const initialZ = camera.position.z;

      // Adjust distances based on initial Z position
      const zRatio = initialZ / 5; // Calculate ratio compared to original Z=5

      // Clear any existing animations to avoid conflicts
      timeline.clear();

      if (!isMobile) {
        // DESKTOP ANIMATIONS
        timeline.fromTo(
          camera.position,
          { x: initialX, y: initialY, z: initialZ },
          {
            x: -2 * zRatio,
            y: initialY,
            z: 4 * zRatio,
            scrollTrigger: {
              trigger: ".s-para1",
              start: "top bottom",
              end: "bottom bottom",
              scrub: 1,
            },
          }
        );

        timeline.fromTo(
          cameraTarget,
          { x: 0, y: 0.5, z: 0 },
          {
            x: 2.56,
            y: 1,
            z: 0,
            scrollTrigger: {
              trigger: ".s-para1",
              start: "top bottom",
              end: "bottom bottom",
              scrub: 1,
            },
          },
          "<"
        );

        timeline.fromTo(
          camera.position,
          { x: -2 * zRatio, y: initialY, z: 4 * zRatio },
          {
            x: 2 * zRatio,
            y: initialY,
            z: 4 * zRatio,
            immediateRender: false,
            scrollTrigger: {
              trigger: ".s-para3",
              start: "top bottom",
              end: "bottom bottom",
              scrub: 1,
            },
          }
        );

        timeline.fromTo(
          cameraTarget,
          { x: 2.56, y: 1, z: 0 },
          {
            x: -2.56,
            y: 1,
            z: 0,
            immediateRender: false,
            scrollTrigger: {
              trigger: ".s-para3",
              start: "top bottom",
              end: "bottom bottom",
              scrub: 1,
            },
          },
          "<"
        );

        // Section 2 animations
        timeline.fromTo(
          camera.position,
          { x: 2 * zRatio, y: initialY, z: 4 * zRatio },
          {
            x: -2 * zRatio,
            y: initialY,
            z: 4 * zRatio,
            immediateRender: false,
            scrollTrigger: {
              trigger: ".section2",
              start: "top bottom",
              end: "bottom bottom",
              scrub: 1,
            },
          }
        );

        timeline.fromTo(
          cameraTarget,
          { x: -2.56, y: 1, z: 0 },
          {
            x: 2.56,
            y: 1,
            z: 0,
            immediateRender: false,
            scrollTrigger: {
              trigger: ".section2",
              start: "top bottom",
              end: "bottom bottom",
              scrub: 1,
            },
          },
          "<"
        );

        timeline.fromTo(
          camera.position,
          { x: -2 * zRatio, y: initialY, z: 4 * zRatio },
          {
            x: initialX,
            y: initialY,
            z: initialZ,
            immediateRender: false,
            scrollTrigger: {
              trigger: ".section7",
              start: "top bottom",
              end: "bottom bottom",
              scrub: 1,
            },
          }
        );

        timeline.fromTo(
          cameraTarget,
          { x: 2.56, y: 1, z: 0 },
          {
            x: 0,
            y: 0.5,
            z: 0,
            immediateRender: false,
            scrollTrigger: {
              trigger: ".section7",
              start: "top bottom",
              end: "bottom bottom",
              scrub: 1,
            },
          },
          "<"
        );
      } else {
        // MOBILE ANIMATIONS
        // These won't affect desktop behavior at all
        timeline.fromTo(
          camera.position,
          { x: 0, y: initialY, z: initialZ },
          {
            x: 0,
            y: initialY + 2,
            z: initialZ,
            scrollTrigger: {
              trigger: ".s-para1",
              start: "top bottom",
              end: "bottom bottom",
              scrub: 1,
            },
          }
        );

        timeline.fromTo(
          cameraTarget,
          { x: 0, y: 0.5, z: 0 },
          {
            x: 0,
            y: 1.5,
            z: 0,
            scrollTrigger: {
              trigger: ".s-para1",
              start: "top bottom",
              end: "bottom bottom",
              scrub: 1,
            },
          },
          "<"
        );

        timeline.fromTo(
          camera.position,
          { x: 0, y: initialY + 2, z: initialZ },
          {
            x: 0,
            y: initialY + 4,
            z: initialZ,
            immediateRender: false,
            scrollTrigger: {
              trigger: ".s-para3",
              start: "top bottom",
              end: "bottom bottom",
              scrub: 1,
            },
          }
        );

        timeline.fromTo(
          cameraTarget,
          { x: 0, y: 1.5, z: 0 },
          {
            x: 0,
            y: 2.5,
            z: 0,
            immediateRender: false,
            scrollTrigger: {
              trigger: ".s-para3",
              start: "top bottom",
              end: "bottom bottom",
              scrub: 1,
            },
          },
          "<"
        );

        // Section 2 animations for mobile
        timeline.fromTo(
          camera.position,
          { x: 0, y: initialY + 4, z: initialZ },
          {
            x: 0,
            y: initialY + 6,
            z: initialZ,
            immediateRender: false,
            scrollTrigger: {
              trigger: ".section2",
              start: "top bottom",
              end: "bottom bottom",
              scrub: 1,
            },
          }
        );

        timeline.fromTo(
          cameraTarget,
          { x: 0, y: 2.5, z: 0 },
          {
            x: 0,
            y: 3.5,
            z: 0,
            immediateRender: false,
            scrollTrigger: {
              trigger: ".section2",
              start: "top bottom",
              end: "bottom bottom",
              scrub: 1,
            },
          },
          "<"
        );

        // Return to initial position for mobile
        timeline.fromTo(
          camera.position,
          {
            x: 0,
            y: initialY + 6,
            z: initialZ,
          },
          {
            x: initialX,
            y: initialY,
            z: initialZ,
            immediateRender: false,
            scrollTrigger: {
              trigger: ".section7",
              start: "top bottom",
              end: "bottom bottom",
              scrub: 1,
            },
          }
        );

        timeline.fromTo(
          cameraTarget,
          { x: 0, y: 3.5, z: 0 },
          {
            x: 0,
            y: 0.5,
            z: 0,
            immediateRender: false,
            scrollTrigger: {
              trigger: ".section7",
              start: "top bottom",
              end: "bottom bottom",
              scrub: 1,
            },
          },
          "<"
        );
      }

      gsap.to("#loop", {
        y: -1000,
        scrollTrigger: {
          trigger: ".canvas-container",
          start: "90% 10%",
          end: "200% bottom",
          scrub: 1,
        },
      });

      gsap.utils.toArray(".fade-in").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
              scrub: false,
            },
          }
        );
      });

      // Specifically target paragraphs to ensure they're visible
      gsap.utils.toArray(".para").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
              scrub: false,
            },
          }
        );
      });

      gsap.to(".s-para2, .s-para3, .section2", {
        opacity: 1,
        scrollTrigger: {
          trigger: ".s-para2",
          start: "top 50%",
          end: "top 20%",
          scrub: 0,
          onEnter: () => {
            gsap.to(".s-para2, .s-para3, .section2", { opacity: 1 });
            gsap.to(".para", { opacity: 1 });
          },
          onLeave: () => {
            gsap.to(".s-para2, .s-para3, .section2", { opacity: 1 });
            gsap.to(".para", { opacity: 1 });
          },
        },
      });
    }; // End of initializeCameraAnimations function

    // Initialize camera animations when animation manager is ready
    animationManager.onInitialized(initializeCameraAnimations);

    // If already initialized, run immediately
    if (animationManager.getStatus().isInitialized) {
      initializeCameraAnimations();
    }

    return () => {
      ScrollTrigger.clearMatchMedia(); // Cleanup ScrollTrigger
      timeline.kill(); // Cleanup timeline
    };
  }, [camera, isMobile]);

  return null;
}
