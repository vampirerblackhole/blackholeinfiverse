import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useThree } from "@react-three/fiber";

/* eslint-disable react/no-unknown-property */
// The above eslint-disable is needed for React Three Fiber JSX props

gsap.registerPlugin(ScrollTrigger);

export function Game(props) {
  const oculusRef = useRef(); // Reference to the Oculus model
  const { camera } = useThree(); // Access the camera
  const { nodes, materials } = useGLTF("./model/Vr.glb", {
    dracoDecoder: { url: "/draco-gltf/" },
  });

  useEffect(() => {
    if (!oculusRef.current) return;

    // Disable frustum culling for all meshes in the VR model to prevent clipping
    // and initialize materials for fade-in/out effects
    oculusRef.current.traverse((child) => {
      if (child.isMesh) {
        child.frustumCulled = false;

        // Initialize materials for transparency support
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              mat.transparent = true;
              mat.opacity = 0; // Start hidden for left-to-center reveal
            });
          } else {
            child.material.transparent = true;
            child.material.opacity = 0; // Start hidden for left-to-center reveal
          }
        }
      }
    });

    const t1 = gsap.timeline();

    // Early scroll: slide in from left and fade in
    t1.to(oculusRef.current.position, {
      x: 0,
      duration: 1,
      scrollTrigger: {
        trigger: ".Game",
        start: "top top",
        end: "10% top",
        scrub: 1,
      },
    });

    t1.to(oculusRef.current, {
      opacity: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".Game",
        start: "top top",
        end: "10% top",
        scrub: 1,
        onUpdate: (self) => {
          if (oculusRef.current) {
            const easedProgress = gsap.parseEase("power2.out")(self.progress);
            oculusRef.current.traverse((child) => {
              if (child.isMesh && child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach((mat) => {
                    mat.opacity = easedProgress;
                    mat.transparent = true;
                  });
                } else {
                  child.material.opacity = easedProgress;
                  child.material.transparent = true;
                }
              }
            });
          }
        },
      },
    });

    // VR Model fade-out effect when transitioning to Stadium section
    t1.to(oculusRef.current, {
      opacity: 0,
      ease: "power2.out", // Smooth easing for natural fade-out
      scrollTrigger: {
        trigger: ".Game",
        start: "85% bottom", // Start fading very late - when 85% of Game section is scrolled
        end: "bottom+=200px bottom", // Extend fade-out well into the next section for very gradual effect
        scrub: 8, // Very slow animation - takes many scroll actions to complete
        onUpdate: (self) => {
          // Apply smooth opacity transition to all meshes in the VR model
          if (oculusRef.current) {
            // Use eased progress for smoother fade-out
            const easedProgress = gsap.parseEase("power2.out")(self.progress);

            oculusRef.current.traverse((child) => {
              if (child.isMesh && child.material) {
                // Handle both single materials and material arrays
                if (Array.isArray(child.material)) {
                  child.material.forEach((mat) => {
                    mat.opacity = 1 - easedProgress;
                    mat.transparent = true;
                  });
                } else {
                  child.material.opacity = 1 - easedProgress;
                  child.material.transparent = true;
                }
              }
            });
          }
        },
      },
    });

    // Scroll-triggered rotation for the Oculus model
    t1.to(oculusRef.current.rotation, {
      y: -Math.PI,
      x: Math.PI / 3,
      duration: 1,
      scrollTrigger: {
        trigger: ".Game",
        start: "10% top",
        end: "70% bottom",
        scrub: 1,
      },
    });

    // Scroll-triggered scaling
    t1.to(oculusRef.current.scale, {
      x: 2,
      y: 2,
      z: 2,
      duration: 1.5,
      scrollTrigger: {
        trigger: ".Game",
        start: "10% top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    // Scroll-triggered position animation
    t1.to(oculusRef.current.position, {
      y: 2.5,
      duration: 1.5,
      scrollTrigger: {
        trigger: ".Game",
        start: "10% top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    // Scroll-triggered camera movement
    gsap.to(camera.position, {
      z: -3,
      y: 5,
      scrollTrigger: {
        trigger: ".Game",
        start: "10% top",
        end: "bottom bottom",
        scrub: 1,
      },
      onUpdate: () => camera.updateProjectionMatrix(), // Ensure the camera updates correctly
    });

    return () => {
      ScrollTrigger.killAll();
    };
  }, [camera]);

  return (
    <group {...props} dispose={null} ref={oculusRef}>
      <group rotation={[-Math.PI / 3, Math.PI, 3.14]} scale={0.331}>
        <group position={[0, 0.305, -1.413]}>
          <group position={[0, 1.413, 0.305]}>
            <mesh
              geometry={nodes.Object_1001.geometry}
              material={materials.Quest_Stoff}
            />
            <mesh
              geometry={nodes.Object_1001_1.geometry}
              material={materials.Quest_Front}
            />
            <mesh
              geometry={nodes.Object_1001_2.geometry}
              material={materials.Quest_Stecker}
            />
            <mesh
              geometry={nodes.Object_1001_3.geometry}
              material={materials.Quest_Samt}
            />
            <mesh
              geometry={nodes.Object_1001_4.geometry}
              material={materials.Quest_Foam}
            />
            <mesh
              geometry={nodes.Object_1001_5.geometry}
              material={materials.Quest_Headstrap}
            />
            <mesh
              geometry={nodes.Object_1001_6.geometry}
              material={materials.Quest_Headstrap2}
            />
            <mesh
              geometry={nodes.Object_1001_7.geometry}
              material={materials.Quest_Plastik}
            />
            <mesh
              geometry={nodes.Object_1001_8.geometry}
              material={materials.Quest_Kamera_Linsen}
            />
            <mesh
              geometry={nodes.Object_1001_9.geometry}
              material={materials.Quest_Kamera}
            />
            <mesh
              geometry={nodes.Object_1001_10.geometry}
              material={materials.Quest_Samt_2}
            />
            <mesh
              geometry={nodes.Object_1001_11.geometry}
              material={materials.Quest_Screen}
            />
            <mesh
              geometry={nodes.Object_1001_12.geometry}
              material={materials.Quest_Gummi_Linse}
            />
            <mesh
              geometry={nodes.Object_1001_13.geometry}
              material={materials.Quest_Lautstrketaste}
            />
            <mesh
              geometry={nodes.Object_1001_14.geometry}
              material={materials.Quest_Linsen}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("./model/Vr.glb", {
  dracoDecoder: { url: "/draco-gltf/" },
});
