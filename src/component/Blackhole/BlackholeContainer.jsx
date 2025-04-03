import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Blackhole from "./Blackhole";
import Stars from "../Stars/Stars";

export default function BlackholeContainer() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        background: "black",
        pointerEvents: "none",
      }}
    >
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
        <color attach="background" args={["black"]} />
        <ambientLight intensity={0.1} />
        <Stars />
        <Blackhole />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
        />
      </Canvas>
    </div>
  );
}
