import { useMemo, useRef } from "react";
import PropTypes from "prop-types";
import { Color, BufferGeometry, Float32BufferAttribute } from "three";
import { Canvas, useFrame } from "@react-three/fiber";

// Import star shaders
import starsVertexShader from "../../shaders/stars/vertex.glsl";
import starsFragmentShader from "../../shaders/stars/fragment.glsl";

/* eslint-disable react/no-unknown-property */
function StarsPoints({
  count = 15000,
  radius = 400,
  size = 30,
  scrollProgress = 0,
}) {
  // Ref for shader material to update uniforms
  const materialRef = useRef();
  // Reference time for animation
  const timeRef = useRef(0);
  // Random offsets for twinkling
  const randomOffsets = useRef(new Float32Array(count));
  // Random speeds for movement
  const randomSpeeds = useRef(new Float32Array(count));

  // Create geometry with positions, sizes, colors, and random values
  const geometry = useMemo(() => {
    const geometry = new BufferGeometry();

    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const randOffsets = new Float32Array(count);
    const randSpeeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1.0);

      positions[i3] = Math.cos(theta) * Math.sin(phi) * radius;
      positions[i3 + 1] = Math.sin(theta) * Math.sin(phi) * radius;
      positions[i3 + 2] = Math.cos(phi) * radius;

      sizes[i] = 0.5 + Math.random() * size;

      // Create stars with slight color variations
      const hue =
        Math.random() > 0.8
          ? Math.round(40 + Math.random() * 20) // Some warmer stars (yellows)
          : Math.round(180 + Math.random() * 40); // Most are cooler (blues/whites)

      const saturation = Math.round(Math.random() > 0.8 ? 80 : 20); // Some colorful, most white
      const lightness = Math.round(85 + Math.random() * 15); // Always bright
      const color = new Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`);

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // Add random offset for twinkling (0-1000)
      randOffsets[i] = Math.random() * 1000;

      // Random movement speed (0.1-0.5)
      randSpeeds[i] = 0.1 + Math.random() * 0.4;
    }

    randomOffsets.current = randOffsets;
    randomSpeeds.current = randSpeeds;

    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("size", new Float32BufferAttribute(sizes, 1));
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
    geometry.setAttribute(
      "randomOffset",
      new Float32BufferAttribute(randOffsets, 1)
    );
    geometry.setAttribute(
      "randomSpeed",
      new Float32BufferAttribute(randSpeeds, 1)
    );

    return geometry;
  }, [count, radius, size]);

  // Animation frame update
  useFrame(({ clock }) => {
    if (materialRef.current) {
      timeRef.current = clock.getElapsedTime();

      // Update uniforms
      materialRef.current.uniforms.uTime.value = timeRef.current;
      materialRef.current.uniforms.uScrollProgress.value = scrollProgress;
    }
  });

  return (
    <points>
      <bufferGeometry attach="geometry" {...geometry} />
      <shaderMaterial
        ref={materialRef}
        attach="material"
        vertexShader={starsVertexShader}
        fragmentShader={starsFragmentShader}
        transparent={true}
        depthWrite={false}
        blending={2} // AdditiveBlending for glow effect
        uniforms={{
          uSize: { value: 0.8 },
          uTime: { value: 0 },
          uScrollProgress: { value: scrollProgress },
        }}
      />
    </points>
  );
}
/* eslint-enable react/no-unknown-property */

StarsPoints.propTypes = {
  count: PropTypes.number,
  radius: PropTypes.number,
  size: PropTypes.number,
  scrollProgress: PropTypes.number,
};

export function Stars(props) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 15],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        dpr={[1, 2]} // Responsive pixel ratio
      >
        <StarsPoints {...props} />
      </Canvas>
    </div>
  );
}

Stars.propTypes = {
  count: PropTypes.number,
  radius: PropTypes.number,
  size: PropTypes.number,
  scrollProgress: PropTypes.number,
};

export default Stars;
