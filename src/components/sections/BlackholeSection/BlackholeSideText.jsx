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
    // Create a single timeline for better performance
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#bh",
        start: "top top",
        end: "bottom 80%",
        scrub: 1,
        anticipatePin: 1, // Improve performance by pre-calculating positions
      },
    });

    // Add animations to the timeline
    tl.to(
      ".bh-head",
      {
        x: -1450,
        ease: "power4.out",
        force3D: true,
        clearProps: "transform",
      },
      0
    )
      .to(
        ".bh-head2",
        {
          x: 1500,
          ease: "power4.out",
          force3D: true,
          clearProps: "transform",
        },
        0
      )
      .to(
        canvasRef.current,
        {
          opacity: 0,
          ease: "power2.out",
          force3D: true,
        },
        0
      );

    return () => {
      // Cleanup
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
    };
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
          transition: "opacity 1s ease-in-out",
          zIndex: 5,
          background: "transparent",
          display: isLoaded ? "block" : "none",
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      >
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 5,
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            margin: 0,
            padding: 0,
            mixBlendMode: "normal",
            transform: "translateZ(0)",
            willChange: "transform, opacity",
          }}
        />
        <div
          id="hh"
          className="absolute top-0 left-0 w-full h-screen flex items-center justify-center"
          style={{
            zIndex: 25,
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        >
          <div className="text-left absolute top-[40%] left-[40%] -translate-x-1/2 -translate-y-1/2">
            <h1
              className="gradient-text transition-opacity duration-300 ease-out text-[120px] leading-none cursor-attract-text font-bold bh-head"
              style={{
                transform: "translateZ(0)",
                willChange: "transform",
                backfaceVisibility: "hidden",
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
                marginBottom: "0",
              }}
            >
              Welcome to
            </h1>
            <h1
              className="gradient-text transition-opacity duration-300 ease-out text-[120px] leading-none cursor-attract-text font-bold bh-head2"
              style={{
                transform: "translateZ(0)",
                willChange: "transform",
                backfaceVisibility: "hidden",
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
                marginTop: "0",
                marginBottom: "0",
              }}
            >
              Blackhole
            </h1>
            <h1
              className="gradient-text transition-opacity duration-300 ease-out text-[120px] leading-none cursor-attract-text font-bold bh-head"
              style={{
                transform: "translateZ(0)",
                willChange: "transform",
                backfaceVisibility: "hidden",
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
                marginTop: "0",
              }}
            >
              Infiverse!
            </h1>
          </div>
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
