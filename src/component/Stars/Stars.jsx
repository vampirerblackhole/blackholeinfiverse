import { useMemo } from "react";
import PropTypes from "prop-types";
import { Color, BufferGeometry, Float32BufferAttribute } from "three";
import { Canvas } from "@react-three/fiber";

// Import star shaders
import starsVertexShader from "../../shaders/stars/vertex.glsl";
import starsFragmentShader from "../../shaders/stars/fragment.glsl";

function StarsPoints({ count = 15000, radius = 400, size = 30 }) {
  const geometry = useMemo(() => {
    const geometry = new BufferGeometry();

    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1.0);

      positions[i3] = Math.cos(theta) * Math.sin(phi) * radius;
      positions[i3 + 1] = Math.sin(theta) * Math.sin(phi) * radius;
      positions[i3 + 2] = Math.cos(phi) * radius;

      sizes[i] = 0.5 + Math.random() * size;

      const hue = Math.round(Math.random() * 360);
      const lightness = Math.round(80 + Math.random() * 20);
      const color = new Color(`hsl(${hue}, 100%, ${lightness}%)`);

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("size", new Float32BufferAttribute(sizes, 1));
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));

    return geometry;
  }, [count, radius, size]);

  return (
    <points>
      <bufferGeometry attach="geometry" {...geometry} />
      <shaderMaterial
        attach="material"
        vertexShader={starsVertexShader}
        fragmentShader={starsFragmentShader}
        transparent={true}
        depthWrite={false}
      />
    </points>
  );
}

StarsPoints.propTypes = {
  count: PropTypes.number,
  radius: PropTypes.number,
  size: PropTypes.number,
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
          far: 500,
        }}
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
};

export default Stars;
