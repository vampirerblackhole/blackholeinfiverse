import React, { Suspense } from 'react'
import { Game } from './Game'
import { Canvas } from '@react-three/fiber'
import { Html, useProgress } from '@react-three/drei';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      {progress.toFixed(1)} % loaded
    </Html>
  );
}
function Oculus() {
  return (
    <Canvas
    camera={{
      position: [0, -2, 5],
      fov: 75, // Optional: Adjust the field of view
      near: 0.1,
      far: 1000,
    }}
    
  >
    <directionalLight position={[0, 0, 5]} intensity={15} />
    <Suspense fallback={<Loader />}>
    <Game position={[0,2,-1]}/>
    </Suspense>
  </Canvas>

)
}

export default Oculus
