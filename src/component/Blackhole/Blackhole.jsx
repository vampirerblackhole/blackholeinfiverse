import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float time;
uniform float zoom;
uniform vec3 cameraPosition;
varying vec2 vUv;

const float PI = 3.14159265359;
const float G = 6.67430e-11;
const float c = 299792458.0;
const float M = 1.0; // Mass of black hole in solar masses
const float rs = 2.0 * G * M / (c * c); // Schwarzschild radius

// Lorentz factor
float gamma(float v) {
  return 1.0 / sqrt(1.0 - v * v / (c * c));
}

// Doppler shift
float dopplerShift(float v, float angle) {
  return sqrt((1.0 + v * cos(angle) / c) / (1.0 - v * cos(angle) / c));
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  float dist = length(uv);
  
  // Calculate gravitational lensing
  float r = dist * 10.0; // Scale factor
  float phi = atan(uv.y, uv.x);
  float theta = PI * 0.5 - asin(rs / r);
  
  // Calculate light deflection
  float deflection = 4.0 * G * M / (r * c * c);
  float newPhi = phi + deflection;
  
  // Calculate accretion disk
  float diskRadius = 3.0 * rs;
  float diskThickness = 0.1 * rs;
  float diskDist = abs(r - diskRadius);
  float disk = smoothstep(diskThickness, 0.0, diskDist);
  
  // Add relativistic effects
  float v = 0.5 * c; // Orbital velocity
  float gammaFactor = gamma(v);
  float dopplerFactor = dopplerShift(v, newPhi);
  
  // Calculate temperature and color
  float temperature = 10000.0 * pow(diskRadius / r, 0.75);
  vec3 color = vec3(1.0, 0.5, 0.0) * temperature / 10000.0;
  
  // Apply relativistic beaming
  color *= dopplerFactor;
  
  // Add time-based rotation
  float rotation = time * 0.1;
  newPhi += rotation;
  
  // Create spiral pattern
  float spiral = sin(newPhi * 10.0 + time * 2.0) * 0.1;
  float finalDist = r + spiral;
  
  // Final color calculation
  vec3 finalColor = mix(
    vec3(0.0),
    color * disk,
    smoothstep(0.0, 1.0, zoom)
  );
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export default function Blackhole() {
  const meshRef = useRef();
  const { camera } = useThree();
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          zoom: { value: 0 },
          cameraPosition: { value: new THREE.Vector3() },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
      }),
    []
  );

  useFrame((state, delta) => {
    if (meshRef.current) {
      material.uniforms.time.value += delta;
      material.uniforms.zoom.value = 1 - (camera.position.z - 5) / 15;
      material.uniforms.cameraPosition.value.copy(camera.position);

      // Rotate the blackhole
      meshRef.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} material={material}>
      <planeGeometry args={[10, 10]} />
    </mesh>
  );
}
