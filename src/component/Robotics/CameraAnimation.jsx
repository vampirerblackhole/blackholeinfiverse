import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const cameraTarget = new THREE.Vector3(0, 0.5, 0); // Initial camera target

export default function CameraAnimation() {
  const camera = useThree((state) => state.camera);
  const t1 = useRef(gsap.timeline());

  useFrame(() => {
    camera.lookAt(cameraTarget); // Keep updating the camera's lookAt target
  });

  useEffect(() => {
    const timeline = t1.current;
    timeline.fromTo(
      camera.position,
      { x: 0, y: -1, z: 5 },
      {
        x: -2,
        y: -1,
        z: 4,
        scrollTrigger: {
          trigger: '.s-para1',
          start: 'top bottom',
          end: 'bottom bottom',
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
          trigger: '.s-para1',
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1,
        },
      },
      '<'
    );
    timeline.fromTo(
      camera.position,
      { x: -2, y: -1, z: 4 },
      {
        x: 2,
        y: -1,
        z: 4,
        immediateRender: false,

        scrollTrigger: {
          trigger: '.s-para3',
          start: 'top bottom',
          end: 'bottom bottom',
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
          trigger: '.s-para3',
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1,
        },
      },
      '<'
    );

    // Section 2 animations
    timeline.fromTo(
      camera.position,
      { x: 2, y: -1, z: 4 },
      {
        x: -2,
        y: -1,
        z: 4,
        immediateRender: false,
        scrollTrigger: {
          trigger: '.section2',
          start: 'top bottom',
          end: 'bottom bottom',
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
          trigger: '.section2',
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1,
        },
      },
      '<'
    );
    timeline.fromTo(
      camera.position,
      { x: -2, y: -1, z: 4 },
      {
        x: 0,
        y: -1,
        z: 5,
        immediateRender: false,
        scrollTrigger: {
          trigger: '.section7',
          start: 'top bottom',
          end: 'bottom bottom',
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
          trigger: '.section7',
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1,
        },
      },
      '<'
    );


    // Fade out canvas
    // timeline.to('.canvas-container', {
    //   opacity: 0,
    //   scrollTrigger: {
    //     trigger: '.section7',
    //     start: 'top bottom',
    //     end: 'bottom bottom',
    //     scrub: 1,
    //   },
    // });

    gsap.to('#loop',{
      y:-1000,
        scrollTrigger:{
          trigger:'.canvas-container',
          start:'90% 10%',
          end:'200% bottom',
          scrub:1,
        }
    })
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
            toggleActions: "play none play none",
            scrub:1
          },
        }
      );
    });
    gsap.to("s-para2", {
      opacity: 1,
      scrollTrigger: {
        trigger: "s-para2",
        start: "top 50%",   // Start fading when the top of the element reaches 40% from the top of the viewport
        end: "top 20%",     // End fading when the top of the element reaches 20% from the top of the viewport
        scrub: 0,    
        onEnter: () => gsap.to("s-para2", { opacity: 1 }),  // Make opacity 1 when the element reaches 40% from the top
        onLeave: () => gsap.to("s-para2", { opacity: 0 }),  // Make opacity 0 when the element reaches 20% from the top
      },
    });

    return () => {
      ScrollTrigger.clearMatchMedia(); // Cleanup ScrollTrigger
      timeline.kill(); // Cleanup timeline
    };
  }, [camera]);

  return null;
}
