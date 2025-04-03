import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, AdaptiveDpr, Environment } from "@react-three/drei";
import * as THREE from "three";

/* eslint-disable react/no-unknown-property */
function BlackHoleEffect() {
  const diskRef = useRef();
  const glowRef = useRef();
  const holeRef = useRef();
  const starsRef = useRef();
  const groupRef = useRef();

  const { camera } = useThree();

  // Rotate camera around the blackhole
  useEffect(() => {
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  // Create stars
  const starsData = useState(() => {
    const count = 15000; // Increased star count
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 50 + Math.random() * 150;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      sizes[i] = Math.random() * 0.2 + 0.1;
    }

    return { positions, sizes, count };
  })[0];

  // Animation
  useFrame((state, delta) => {
    if (diskRef.current) {
      diskRef.current.rotation.z += delta * 0.15;
    }

    if (glowRef.current) {
      glowRef.current.rotation.z -= delta * 0.05;
      // Pulse the glow
      glowRef.current.scale.x =
        1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      glowRef.current.scale.y =
        1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }

    if (starsRef.current) {
      // Much slower rotation - reduced by more than 500ms
      starsRef.current.rotation.y += delta * 0.005;
      starsRef.current.rotation.x += delta * 0.002;
    }
  });

  // Generate disk texture procedurally
  const accretionDiskTexture = useState(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");

    // Fill background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create gradient for disk
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const innerRadius = canvas.width * 0.15;
    const outerRadius = canvas.width * 0.5;

    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      innerRadius,
      centerX,
      centerY,
      outerRadius
    );

    gradient.addColorStop(0, "rgba(0, 30, 60, 0.6)");
    gradient.addColorStop(0.3, "rgba(30, 130, 220, 0.7)");
    gradient.addColorStop(0.6, "rgba(255, 140, 40, 0.8)");
    gradient.addColorStop(0.8, "rgba(255, 50, 0, 0.5)");
    gradient.addColorStop(1, "rgba(20, 0, 0, 0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Add swirls
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);

      for (let r = innerRadius; r < outerRadius; r += 2) {
        const swirl =
          angle +
          ((r - innerRadius) / (outerRadius - innerRadius)) * Math.PI * 1.5;
        const x = centerX + r * Math.cos(swirl);
        const y = centerY + r * Math.sin(swirl);
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  })[0];

  // Generate glow texture procedurally
  const glowTexture = useState(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    // Create radial gradient
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      canvas.width * 0.1,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width * 0.5
    );

    gradient.addColorStop(0, "rgba(0, 60, 120, 0.8)");
    gradient.addColorStop(0.5, "rgba(0, 30, 70, 0.4)");
    gradient.addColorStop(1, "rgba(0, 0, 30, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  })[0];

  return (
    <group ref={groupRef}>
      {/* Black hole (event horizon) */}
      <mesh ref={holeRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="black" />
      </mesh>

      {/* Accretion disk */}
      <mesh ref={diskRef} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2, 10, 64]} />
        <meshBasicMaterial
          map={accretionDiskTexture}
          transparent={true}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Blue glow */}
      <mesh ref={glowRef} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial
          map={glowTexture}
          transparent={true}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Stars */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starsData.count}
            array={starsData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={starsData.count}
            array={starsData.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.2}
          color="#ffffff"
          sizeAttenuation={true}
          transparent={true}
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Lensing effect (distortion ring) */}
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[2, 3, 64]} />
        <meshBasicMaterial
          color="#001030"
          transparent={true}
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
/* eslint-enable react/no-unknown-property */

export default function BlackholeScene() {
  const [mounted, setMounted] = useState(false);

  // Ensure the component mounts after load
  useEffect(() => {
    setMounted(true);
    // Log for debugging
    console.log("BlackholeScene mounted");
    return () => {
      setMounted(false);
      console.log("BlackholeScene unmounted");
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "black",
        zIndex: 5, // Lower z-index so it doesn't block content
        pointerEvents: "none", // Allow clicking through
      }}
    >
      {mounted && (
        <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: false }}>
          <BlackHoleEffect />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />
          <AdaptiveDpr pixelated />
          <Environment preset="night" />
        </Canvas>
      )}
    </div>
  );
}
