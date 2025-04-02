import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// Preload the model using Draco Loader
useGLTF.preload('./model/Game6.glb', { dracoDecoder: { url: '/draco-gltf/' } });

export function Stadium(props) {
  const sheet = useRef();

  // Load the 3D model using Draco loader
  const { nodes, materials } = useGLTF('./model/Game6.glb', { 
    dracoDecoder: { url: '/draco-gltf/' } 
  });

  // Load and optimize texture
  

  useEffect(() => {
    if (!sheet.current) return;

    const t1 = gsap.timeline();

    // Fade in animation
    t1.to(".stadium", {
      opacity: 1,
      scrollTrigger: {
        trigger: '.stadium-container',
        start: '98% bottom',
        end: 'bottom bottom',
        scrub: 1,
      },
    });

    // Move stadium up
    t1.to(sheet.current.position, {
      y: 55.5,
      scrollTrigger: {
        trigger: '.stadium-container',
        start: '8% top',
        end: '20% 10%',
        scrub: 1,
      },
    });

    // Rotate stadium
    t1.to(sheet.current.rotation, {
      y: 4.7,
      duration: 1,
      scrollTrigger: {
        trigger: '.stadium-container',
        start: '25% 13%',
        end: 'bottom bottom',
        scrub: 5,
      },
    });

    return () => {
      ScrollTrigger.killAll();
    };
  }, []);

  return (
    <group {...props} dispose={null} scale={0.1} className="stadium">
      <group ref={sheet}>
        <mesh geometry={nodes.Cube002.geometry} material={materials['Material.012']} position={[50.757, 0, 0.066]} rotation={[Math.PI, 0, Math.PI]} scale={[0.803, 14.625, 10.283]} />
        <mesh geometry={nodes.Cube003.geometry} material={materials['Material.011']} position={[-0.109, 0, 50.82]} rotation={[0, 1.571, 0]} scale={[0.803, 14.625, 10.283]} />
        <mesh geometry={nodes.Cube004.geometry} material={materials['Material.010']} position={[0.249, 0, -50.724]} rotation={[0, -1.571, 0]} scale={[0.803, 14.625, 10.283]} />
        <group position={[-50.881, 0, 0.044]} scale={[0.803, 14.625, 10.283]}>
          <mesh geometry={nodes.Cube002_1.geometry} material={materials['Material.009']} />
          <mesh geometry={nodes.Cube002_2.geometry} material={materials['Material.004']} />
        </group>
      </group>

      {/* Stadium Base with Texture */}
      <mesh geometry={nodes.SmallShowRoom_Placeable_0.geometry} material={materials.Placeable} rotation={[-Math.PI / 2, 0, 0]} scale={20}>
      </mesh>
    </group>
  );
}
