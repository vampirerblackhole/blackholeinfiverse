// "use client";

// import React, { useState, useRef, Suspense } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { Points, PointMaterial } from "@react-three/drei";
// import * as random from "maath/random/dist/maath-random.esm";

// const StarBackground = (props) => {
//   const ref = useRef();
//   const [sphere] = useState(() =>
//     random.inSphere(new Float32Array(5000), { radius: 1.9 })
//   );

//   useFrame((state, delta) => {
//     ref.current.rotation.x -= delta / 10;
//     ref.current.rotation.y -= delta / 25;
//     ref.current.rotation.z -= delta / 25;

//   });
//   return (
//     <group rotation={[0, 0, Math.PI / 4]}>
//       <Points
//         ref={ref}
//         positions={sphere}
//         stride={4}
//         frustumCulled
//         {...props}
//       >
//         <PointMaterial
//           transparent
//           color="#fffff+f" // Corrected the color syntax from "$fff" to "#fff"
//           size={0.0039}
//           sizeAttenuation={true}
//           depthWrite={false} // Fixed property name from "dethWrite" to "depthWrite"
//         />
//       </Points>
//     </group>
//   );
// };

// const StarsCanvas = () => (
//     <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2}}>

//     <Canvas camera={{ position: [0, 0, 1] }}>
//       <Suspense fallback={null}>
//         <StarBackground />
//       </Suspense>
//     </Canvas>
//   </div>
// );

// export default StarsCanvas;
