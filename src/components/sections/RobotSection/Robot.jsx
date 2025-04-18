import { useEffect, useRef, useMemo } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame, useGraph } from "@react-three/fiber";
import { SkeletonUtils } from "three-stdlib";
import PropTypes from "prop-types";

/* eslint-disable react/no-unknown-property */
// The above eslint-disable is needed for React Three Fiber JSX props

// Preload model with Draco compression
useGLTF.preload("./model/Robot.glb", { dracoDecoder: { url: "/draco-gltf/" } });

export function Robot({ scrollPosition, ...props }) {
  const group = useRef(null);

  // -------- FADE CONFIGURATION --------
  // Adjust these values to control the robot's fade out effect
  const FADE_START = 0.79; // When to start fading (0.6 = 60% of scroll)
  const FADE_END = 1; // When fade should complete (0.8 = 80% of scroll)
  const MIN_OPACITY = 0; // Minimum opacity (0 = fully transparent)
  // ----------------------------------

  // Load the GLTF model with Draco
  const { scene, animations } = useGLTF("./model/Robot.glb", {
    dracoDecoder: { url: "/draco-gltf/" },
  });

  // Clone model to avoid mutations
  const clone = useMemo(
    () => (scene ? SkeletonUtils.clone(scene) : null),
    [scene]
  );

  // Extract nodes and materials
  const { nodes, materials } = useGraph(clone);

  // Get animation actions
  const { actions } = useAnimations(animations, group);

  // Store animation duration in useRef for optimization
  const animationDuration = useRef(0);

  useEffect(() => {
    const action = actions["ArmatureAction.001"];
    if (action) {
      action.play();
      action.paused = true;
      animationDuration.current = action.getClip()?.duration || 0;
    }
  }, [actions]);

  useEffect(() => {
    if (materials.Face) {
      materials.Face.transparent = true;
      materials.Face.depthWrite = true;
      materials.Face.needsUpdate = true;
    }
  }, [materials]);

  useFrame(() => {
    const action = actions["ArmatureAction.001"];
    if (action) {
      action.time = animationDuration.current * scrollPosition;
    }
  });

  // Get model position based on device size - different positions for different screen sizes
  const getPosition = () => {
    if (window.innerWidth <= 480) return [0, -20, 7]; // Extra small - mobile phones
    if (window.innerWidth <= 768) return [0, -20, 4]; // Tablet - moved back and down
    return props.position || [0, -16, 0]; // Desktop - original position
  };

  // Calculate opacity based on scroll position
  const calculateOpacity = () => {
    if (scrollPosition <= FADE_START) return 1; // Before fade starts
    if (scrollPosition >= FADE_END) return MIN_OPACITY; // After fade completes

    // During fade - calculate opacity
    const fadeProgress =
      (scrollPosition - FADE_START) / (FADE_END - FADE_START);
    return 1 - fadeProgress * (1 - MIN_OPACITY);
  };

  const opacity = calculateOpacity();

  return (
    <group ref={group} {...props} position={getPosition()} dispose={null}>
      <group name="Scene">
        <group
          name="Armature"
          rotation={[0, 12.571, 0]}
          scale={window.innerWidth <= 768 ? 14.027 : 10.027}
        >
          <primitive object={nodes.RL_BoneRoot} />
          <skinnedMesh
            name="default"
            geometry={nodes["default"].geometry}
            material={materials.Face}
            skeleton={nodes["default"].skeleton}
            morphTargetDictionary={nodes["default"].morphTargetDictionary}
            morphTargetInfluences={nodes["default"].morphTargetInfluences}
            material-opacity={opacity}
            material-transparent={true}
          />
        </group>
      </group>
    </group>
  );
}

// Add PropTypes validation
Robot.propTypes = {
  scrollPosition: PropTypes.number,
  position: PropTypes.array,
};
