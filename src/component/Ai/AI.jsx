
import React, { useRef } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useGSAP } from '@gsap/react'
import { useThree } from '@react-three/fiber'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { DoubleSide, FrontSide } from 'three'
gsap.registerPlugin(ScrollTrigger)

export function AI(props) {
  const camera = useThree((state) => state.camera);

  const { nodes, materials } = useGLTF('./model/Portal.glb')
  const ai = useRef()
  const texture = useTexture('../../../public/assets/tgame.jpg');
  const door = useTexture('../../../public/assets/ringbg.webp');


useGSAP(() => {
    const t1 = gsap.timeline();
  
    // Scroll-triggered scaling for the Oculus model (Zoom-in effect)
    
  
    // Scroll-triggered position animation for the Oculus model
    
  
  
    // Scroll-triggered camera zoom-in effect (move camera closer to model on the Z-axis)
    // t1.to(camera.position, {

    //   z: 3,  // Move camera closer on the Z-axis (zoom-in effect)
    //   duration: 2.5,
    //   scrollTrigger: {
    //     trigger: '.ai-container',
    //     start: '10% 10%',
    //     end: '30% 30%',

    //     scrub: 1,
    //   }
    // });
    // t1.to(camera.rotation, {
    //     x:0,
    //     y: -Math.PI/2,  // Move camera closer on the Z-axis (zoom-in effect)
        
    //     duration: 2.5,
    //     scrollTrigger: {
    //       trigger: '.ai-container',
    //       start: '30% 30%',
    //       end: '40% 40%',
  
    //       scrub: 1,
    //     }
    //   });

    
    
    // // Fade-out effect for the `.ai-container` as it scrolls
    
  
    // // Fade-in effect for the `.ai-container` when it enters the viewport
    // t1.to(".ai-container", {
    //   opacity: 1,  // Fade in the `.ai-container`
    //   duration: 1.5,
    //   scrollTrigger: {
    //     trigger: '.ai-container',
    //     start: 'top top',  // Start fading when the top of `.ai-container` hits the top of the viewport
    //     end: '5% 5%',  // End fading when 5% of `.ai-container` is scrolled
    //     scrub: 2,  // Smooth scrubbing of the fade-in animation
    //   }
    // });
  
  });
  return (
    <group {...props} rotation={[0,1,0]} dispose={null} scale={0.1} ref={ai}>
      <mesh geometry={nodes.Plane003.geometry} material={materials['Material.002']} position={[4.931, 0.204, 3.583]} scale={[0.788, 1.898, 6]} />
      <mesh geometry={nodes.Cube007.geometry} material={materials['Material.003']} position={[3.836, 2.359, -2.025]} rotation={[0, 0, -Math.PI]} scale={[-1.127, -2.288, -0.081]} >
        </mesh>
      <mesh geometry={nodes.Cube077.geometry} material={materials['Material.007']} position={[6.077, 2.332, -2.025]} rotation={[0, 0, -Math.PI]} scale={[-1.127, -2.288, -0.081]} >
        </mesh>
      <mesh geometry={nodes.Text001.geometry} material={materials['Material.008']} position={[3.916, 1.891, -1.951]} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Text002.geometry} material={materials['Material.008']} position={[5.427, 1.89, -1.762]} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Cube002_Black_0.geometry} material={materials['Black.001']} position={[7.091, 3.142, 4.233]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.056, 0.059, 0.056]} >
      </mesh>
      <mesh geometry={nodes.Cube002_Light_0.geometry} material={materials['Light.001']} position={[7.091, 3.142, 4.233]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.056, 0.059, 0.056]} />
      <mesh geometry={nodes.Cube002_White_0.geometry} material={materials['White.001']} position={[7.091, 3.142, 4.233]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.056, 0.059, 0.056]} >
      </mesh>
    </group>
  )
}

useGLTF.preload('./model/Portal.glb')
