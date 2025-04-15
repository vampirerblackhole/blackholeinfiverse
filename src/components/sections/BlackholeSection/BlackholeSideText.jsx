import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../../styles/BH.css";
import TiltCard from "../../common/TiltCard";

gsap.registerPlugin(ScrollTrigger);

function BlackholeSideText() {
  const scrollRef = useRef(null); // For the scroll container
  const canvasRef = useRef(null); // For the canvas element
  // const starsCanvasRef = useRef(null); // For the stars canvas element - removed
  const [isLoaded, setIsLoaded] = useState(false);
  const paragraphRef1 = useRef(null);
  const paragraphRef2 = useRef(null);
  const headingRef = useRef(null);
  // const starsSceneRef = useRef({}); // removed

  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Remove the stars creation effect
  // useEffect(() => {
  //   if (!starsCanvasRef.current) return;
  //   ...
  // }, []);

  // Add additional useEffect to ensure the component is displayed if images take too long
  useEffect(() => {
    // Check if document is already loaded
    if (document.readyState === "complete") {
      setIsLoaded(true);
    } else {
      // Add fallback to ensure the component is displayed after a maximum time
      const fallbackTimer = setTimeout(() => {
        setIsLoaded(true);
      }, 3000); // After 3 seconds, force display even if not all images are loaded

      return () => clearTimeout(fallbackTimer);
    }
  }, []);

  // Function to handle the transition from blackhole to content
  useEffect(() => {
    // Handler function for the load event
    const handleLoad = () => {
      if (headingRef.current) {
        headingRef.current.style.opacity = "1";
      }
    };

    // Set initialLoading to false once the whole site is loaded
    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  // Check for paragraph visibility
  useEffect(() => {
    const handleScroll = () => {
      if (paragraphRef1.current) {
        const rect = paragraphRef1.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          paragraphRef1.current.classList.add("visible");
        } else {
          paragraphRef1.current.classList.remove("visible");
        }
      }

      if (paragraphRef2.current) {
        const rect = paragraphRef2.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          paragraphRef2.current.classList.add("visible");
        } else {
          paragraphRef2.current.classList.remove("visible");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger once to check initial visibility
    setTimeout(() => {
      handleScroll();
    }, 1000);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    gsap.to(".bh-head", {
      scrollTrigger: {
        trigger: "#bh", // Element that will trigger the animation when scrolled into view
        start: "top top", // When the top of the `.portal` reaches 80% of the viewport height
        end: "bottom 80%", // When the bottom of the `.portal` reaches 20% of the viewport height
        scrub: 1, // This will link the animation progress to the scroll
      },
      x: -1450,
      ease: "power4.out",
    });
    gsap.to(".bh-head2", {
      scrollTrigger: {
        trigger: "#bh", // Element that will trigger the animation when scrolled into view
        start: "top top", // When the top of the `.portal` reaches 80% of the viewport height
        end: "bottom 80%", // When the bottom of the `.portal` reaches 20% of the viewport height
        scrub: 1, // This will link the animation progress to the scroll
      },
      x: 1500,
      ease: "power4.out",
    });

    // Add fade-out for canvas when approaching robot section
    gsap.to(canvasRef.current, {
      scrollTrigger: {
        trigger: "#bh",
        start: "80% top",
        end: "bottom top",
        scrub: true,
      },
      opacity: 0,
      ease: "power2.out",
    });
  }, []);

  return (
    <>
      <div
        id="bh"
        ref={scrollRef}
        style={{
          position: "relative",
          height: "500vh",
          width: "100vw",
          overflowX: "hidden",
          overflowY: "hidden",
          transition: "opacity 1.5s ease-in-out",
          zIndex: 5, // Reduced from 10 to allow the global StarsScene to be visible
          background: "transparent", // Ensure background is transparent
          display: isLoaded ? "block" : "none", // Only display when loaded
        }}
      >
        {/* Stars Canvas - Removed */}

        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 5, // Higher than stars (z-index 0) to ensure BlackholeText is above stars
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            margin: 0,
            padding: 0,
            // Semi-transparent to let stars be subtly visible
            mixBlendMode: "normal", // Normal blend
          }}
        />
        <div
          id="hh"
          className="h-100 w-full relative font-bold text-white leading-tight"
          style={{
            position: "relative",
            top: "3%",
            zIndex: 25,
            fontSize: "5vw", // Make text size responsive using viewport width
            paddingTop: "5vh",
            height: "100vh",
          }}
        >
          <h1 className="gradient-text transition-opacity duration-500 ease-in-out text-6vw sm:text-[6vw] md:text-[6vw] lg:text-6xl xl:text-6xl bh-head cursor-attract-text">
            <span>Welcome to</span>
          </h1>
          <h1 className="gradient-text transition-opacity duration-500 ease-in-out text-6vw sm:text-[6vw] md:text-[6vw] lg:text-6xl xl:text-6xl bh-head2 cursor-attract-text">
            <span className="">Blackhole Infiverse</span>
          </h1>
        </div>

        <div id="p12" className="fade-in" ref={paragraphRef1}>
          <TiltCard
            title="Redefining transformation of Digital with AI Integration"
            description="The cyberspace is transforming, and so are we. At BlackHole Infiverse, we are at the forefront of the next digital revolution. Specialising in cutting-edge technologies such as AI, Machine Learning, XR, Blockchain, and Robotics, we are crafting the future of Web3 and beyond."
            style={{
              width: "100%",
              maxWidth: "100%",
              margin: "0 auto",
            }}
          />
        </div>

        <div id="p11" className="fade-in" ref={paragraphRef2}>
          <TiltCard
            title="Empowering Industries with Innovation"
            description="Our mission is to empower industries with innovative solutions that not only meet today's demands but also anticipate tomorrow's needs. Together, we're shaping a world where digital and physical realities converge seamlessly, driving progress and unlocking endless possibilities for the future."
            style={{
              width: "100%",
              maxWidth: "100%",
              margin: "0 auto",
            }}
          />
        </div>
      </div>
    </>
  );
}

export default BlackholeSideText;
