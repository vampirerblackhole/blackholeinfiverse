import { useGLTF } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* eslint-disable react/no-unknown-property */
// The above eslint-disable is needed for React Three Fiber JSX props

gsap.registerPlugin(ScrollTrigger);

// Preload the model using Draco Loader
useGLTF.preload("./model/Game6.glb", { dracoDecoder: { url: "/draco-gltf/" } });

export function Stadium(props) {
  const sheet = useRef();
  const navigate = useNavigate();

  // Load the 3D model using Draco loader
  const { nodes, materials } = useGLTF("./model/Game6.glb", {
    dracoDecoder: { url: "/draco-gltf/" },
  });

  const handleMeshClick = (url) => {
    window.open(url, "_blank");
  };

  const handleComingSoonClick = (game) => {
    // Create a state object with game data to pass to the ComingSoon route
    navigate("/coming-soon", { state: { game } });
  };

  // Define games data
  const games = {
    tableTennis: {
      title: "VR Table Tennis Star",
      image: "/images/games/table-tennis.jpg",
      description:
        "Experience the thrill of virtual table tennis with friends around the world!",
      isReleased: true,
      metaLink: "https://www.meta.com/experiences/9250693884966271/",
    },
    bowling: {
      title: "VR Bowling Star",
      image: "/images/games/bowling.jpg",
      description:
        "Perfect your bowling technique and aim for strikes in our realistic bowling alley simulation.",
      isReleased: true,
      metaLink:
        "https://www.meta.com/en-gb/experiences/bowling-star/30449002954683093/",
    },
    tennis: {
      title: "VR tennis Star",
      image: "/images/games/tennis.jpg",
      description:
        "Step onto the court and showcase your skills in our immersive Tennis experience.",
      isReleased: false,
    },
    badminton: {
      title: "VR Badminton Star",
      image: "/images/games/badminton.jpg",
      description:
        "Master your racket skills and compete in fast-paced badminton matches against players worldwide.",
      isReleased: false,
    },
  };

  useEffect(() => {
    if (!sheet.current) return;

    const t1 = gsap.timeline();

    // Fade in animation
    t1.to(".stadium", {
      opacity: 1,
      scrollTrigger: {
        trigger: ".stadium-container",
        start: "98% bottom",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    // Move stadium up
    t1.to(sheet.current.position, {
      y: 55.5,
      scrollTrigger: {
        trigger: ".stadium-container",
        start: "8% top",
        end: "20% 10%",
        scrub: 1,
      },
    });

    // Rotate stadium
    t1.to(sheet.current.rotation, {
      y: 4.7,
      duration: 1,
      scrollTrigger: {
        trigger: ".stadium-container",
        start: "25% 13%",
        end: "bottom bottom",
        scrub: 5,
      },
    });

    return () => {
      ScrollTrigger.killAll();
    };
  }, []);

  // Ensure all meshes inside the stadium group cast and receive shadows
  useEffect(() => {
    if (!sheet.current) return;
    sheet.current.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, []);

  // Brighten cards while preserving their textures using emissiveMap from base color
  useEffect(() => {
    const targetMaterialNames = [
      "Material.012",
      "Material.011",
      "Material.010",
      "Material.009",
      "Material.004",
    ];

    targetMaterialNames.forEach((name) => {
      const mat = materials[name];
      if (mat && mat.emissive) {
        // Use the color map as emissiveMap so details stay visible while brightening
        mat.emissive.set("#ffffff");
        if (!mat.emissiveMap && mat.map) mat.emissiveMap = mat.map;
        mat.emissiveIntensity = 0.5; // ~50% brighter but texture-preserving
        mat.needsUpdate = true;
      }
    });
  }, [materials]);

  return (
    <group {...props} dispose={null} scale={0.1} className="stadium">
      <group ref={sheet}>
        {/* Right side - tennis */}
        <mesh
          geometry={nodes.Cube002.geometry}
          material={materials["Material.012"]}
          position={[50.757, 0, 0.066]}
          rotation={[Math.PI, 0, Math.PI]}
          scale={[0.803, 14.625, 10.283]}
          castShadow
          receiveShadow
          onClick={() => handleComingSoonClick(games.tennis)}
          className="cursor-attract-button"
        />
        {/* Front side - Table Tennis (released) */}
        <mesh
          geometry={nodes.Cube003.geometry}
          material={materials["Material.011"]}
          position={[-0.109, 0, 50.82]}
          rotation={[0, 1.571, 0]}
          scale={[0.803, 14.625, 10.283]}
          castShadow
          receiveShadow
          onClick={() => handleMeshClick(games.tableTennis.metaLink)}
          className="cursor-attract-button"
        />
        {/* Back side - badminton */}
        <mesh
          geometry={nodes.Cube004.geometry}
          material={materials["Material.010"]}
          position={[0.249, 0, -50.724]}
          rotation={[0, -1.571, 0]}
          scale={[0.803, 14.625, 10.283]}
          castShadow
          receiveShadow
          onClick={() => handleComingSoonClick(games.badminton)}
          className="cursor-attract-button"
        />
        {/* Left side - bowling */}
        <group
          position={[-50.881, 0, 0.044]}
          scale={[0.803, 14.625, 10.283]}
          onClick={() => handleMeshClick(games.bowling.metaLink)}
          className="cursor-attract-button"
        >
          <mesh
            geometry={nodes.Cube002_1.geometry}
            material={materials["Material.009"]}
            castShadow
            receiveShadow
          />
          <mesh
            geometry={nodes.Cube002_2.geometry}
            material={materials["Material.004"]}
            castShadow
            receiveShadow
          />
        </group>

        {/* Localized lights to brighten each card without overexposing textures */}
        <pointLight
          position={[50.757, 4, 0.066]}
          intensity={7}
          distance={45}
          decay={2}
          castShadow
        />
        <pointLight
          position={[-0.109, 4, 50.82]}
          intensity={7}
          distance={45}
          decay={2}
          castShadow
        />
        <pointLight
          position={[0.249, 4, -50.724]}
          intensity={6.5}
          distance={45}
          decay={2}
          castShadow
        />
        <pointLight
          position={[-50.881, 4, 0.044]}
          intensity={7}
          distance={45}
          decay={2}
          castShadow
        />
      </group>

      {/* Stadium Base with Texture */}
      <mesh
        geometry={nodes.SmallShowRoom_Placeable_0.geometry}
        material={materials.Placeable}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={20}
        receiveShadow
      ></mesh>
    </group>
  );
}
