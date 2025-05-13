import React, { Suspense, useEffect, useState } from "react";
import { Game } from "./Game";
import { Canvas } from "@react-three/fiber";
import { Html, useProgress } from "@react-three/drei";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="bg-black bg-opacity-50 p-2 rounded text-white">
        {progress.toFixed(1)}% loaded
      </div>
    </Html>
  );
}

function Oculus() {
  const [isReady, setIsReady] = useState(false);

  // Ensure the component is fully mounted before rendering 3D content
  useEffect(() => {
    // Short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Preload the VR model
  useEffect(() => {
    // Preload the model
    const preloadModel = async () => {
      try {
        const response = await fetch("./model/Vr.glb", {
          priority: "high",
          cache: "force-cache",
        });
        if (!response.ok) {
          console.warn("Failed to preload VR model");
        }
      } catch (error) {
        console.error("Error preloading VR model:", error);
      }
    };

    preloadModel();
  }, []);

  return (
    <Canvas
      camera={{
        position: [0, -2, 5],
        fov: 75,
        near: 0.1,
        far: 1000,
      }}
      // Improve performance with these settings
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      dpr={[1, 2]} // Limit pixel ratio for better performance
    >
      <directionalLight position={[0, 0, 5]} intensity={15} />
      <Suspense fallback={<Loader />}>
        {isReady && <Game position={[0, 2, -1]} />}
      </Suspense>
    </Canvas>
  );
}

export default Oculus;
