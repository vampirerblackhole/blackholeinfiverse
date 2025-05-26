import React, { Suspense } from "react";
import { Game } from "./Game";
import { Canvas } from "@react-three/fiber";
import { Html, useProgress } from "@react-three/drei";

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress.toFixed(1)} % loaded</Html>;
}

function Oculus() {
  return (
    <Canvas
      camera={{
        position: [0, -2, 5],
        fov: 75, // Optional: Adjust the field of view
        near: 0.01, // Reduced near plane to prevent close clipping
        far: 1000,
      }}
      gl={{
        preserveDrawingBuffer: true,
        antialias: true,
        alpha: true,
      }}
      style={{
        height: "100%",
        width: "100%",
        display: "block",
      }}
      onCreated={({ gl, camera, scene }) => {
        // Ensure the renderer viewport doesn't clip content
        gl.setViewport(0, 0, gl.domElement.width, gl.domElement.height);

        // Disable frustum culling to prevent model parts from being clipped
        scene.traverse((child) => {
          if (child.isMesh) {
            child.frustumCulled = false;
          }
        });

        // Update camera aspect ratio and projection matrix
        camera.aspect = gl.domElement.width / gl.domElement.height;
        camera.updateProjectionMatrix();

        // Ensure scissor test is disabled (can cause clipping)
        gl.setScissorTest(false);
      }}
    >
      <directionalLight position={[0, 0, 5]} intensity={15} />
      <Suspense fallback={<Loader />}>
        <Game position={[0, 2, -1]} />
      </Suspense>
    </Canvas>
  );
}

export default Oculus;
