import { useGLTF } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Register ScrollTrigger plugin globally
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
      isReleased: false,
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

    // Ensure ScrollTrigger is properly refreshed
    ScrollTrigger.refresh();

    // Create a single timeline for better control
    const t1 = gsap.timeline();

    // Delay the animations slightly to ensure DOM is ready
    setTimeout(() => {
      // Fade in animation
      t1.to(".stadium", {
        opacity: 1,
        scrollTrigger: {
          trigger: ".stadium-container",
          start: "98% bottom",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true, // Recalculate on window resize
          fastScrollEnd: true, // Better performance
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
          invalidateOnRefresh: true,
          fastScrollEnd: true,
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
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        },
      });
    }, 500); // Short delay to ensure DOM is ready

    return () => {
      // Clean up all ScrollTrigger instances
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

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
          onClick={() => handleComingSoonClick(games.badminton)}
          className="cursor-attract-button"
        />
        {/* Left side - bowling */}
        <group
          position={[-50.881, 0, 0.044]}
          scale={[0.803, 14.625, 10.283]}
          onClick={() => handleComingSoonClick(games.bowling)}
          className="cursor-attract-button"
        >
          <mesh
            geometry={nodes.Cube002_1.geometry}
            material={materials["Material.009"]}
          />
          <mesh
            geometry={nodes.Cube002_2.geometry}
            material={materials["Material.004"]}
          />
        </group>
      </group>

      {/* Stadium Base with Texture */}
      <mesh
        geometry={nodes.SmallShowRoom_Placeable_0.geometry}
        material={materials.Placeable}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={20}
      ></mesh>
    </group>
  );
}
