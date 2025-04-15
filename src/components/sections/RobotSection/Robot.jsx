import { useEffect, useRef, useMemo } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame, useGraph } from "@react-three/fiber";
import { SkeletonUtils } from "three-stdlib";
import PropTypes from "prop-types";

// Preload model with Draco compression
useGLTF.preload("./model/Robot.glb", { dracoDecoder: { url: "/draco-gltf/" } });

export function Robot({ scrollPosition, ...props }) {
  const group = useRef(null);

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

  useFrame(() => {
    const action = actions["ArmatureAction.001"];
    if (action) {
      action.time = animationDuration.current * scrollPosition;
    }
  });

  // Get model position based on device size (position farther rather than scaling)
  const getPosition = () => {
    if (window.innerWidth <= 480) return [0, -24, -2]; // Extra small - moved closer
    if (window.innerWidth <= 768) return [0, -20, -1]; // Tablet - moved closer
    return props.position || [0, -16, 0]; // Desktop - original position
  };

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
          />
        </group>
      </group>
    </group>
  );
}

// Add PropTypes validation to fix linter errors
Robot.propTypes = {
  scrollPosition: PropTypes.number,
  position: PropTypes.array,
};
