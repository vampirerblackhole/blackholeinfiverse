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
        // Add markers: true for debugging if needed
      },
    });

    // Adjust animation values for better mobile experience
    const isMobile = window.innerWidth <= 768;
    const xOffsetTitle1 = isMobile ? -600 : -1450;
    const xOffsetTitle2 = isMobile ? 600 : 1500;

    // Add animations to the timeline
    tl.to(
      ".bh-head",
      {
        x: xOffsetTitle1,
        ease: "power4.out",
        force3D: true,
      },
      0
    )
      .to(
        ".bh-head2",
        {
          x: xOffsetTitle2,
          ease: "power4.out",
          force3D: true,
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
          overflowY: "auto",
          transition: "opacity 1s ease-in-out",
          zIndex: 5,
          background: "transparent",
          display: isLoaded ? "block" : "none",
          transform: "translateZ(0)",
          willChange: "transform",
          touchAction: "pan-y",
          WebkitOverflowScrolling: "touch",
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
            pointerEvents: "none", // Add pointer-events: none to prevent canvas from blocking interactions
          }}
        />
        <div
          id="hh"
          className="fixed top-0 left-0 w-full h-screen flex items-center justify-center"
          style={{
            zIndex: 25,
            pointerEvents: "none", // Add pointer-events: none to prevent blocking interactions
          }}
        >
          <div className="text-center max-w-full px-4">
            <h1
              className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-300 to-gray-300 bh-head font-bold text-[120px] mb-4 mobile-welcome-text"
              style={{
                transform: "translateZ(0)",
                willChange: "transform",
              }}
            >
              Infinitely curious.
            </h1>
            <h1
              className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-300 to-gray-300 bh-head2 font-bold text-[120px] mobile-infiverse-text"
              style={{
                transform: "translateZ(0)",
                willChange: "transform",
              }}
            >
              Relentlessly advanced.
            </h1>
          </div>

          {/* Add custom CSS that you can modify later */}
          <style>
            {`
              /* Tablet styles (between 769px and 1024px) */
              @media (min-width: 769px) and (max-width: 1024px) {
                .mobile-welcome-text {
                  font-size: 4rem !important;
                  margin-top: 0 !important;
                }

                .mobile-infiverse-text {
                  font-size: 4rem !important;
                  margin-top: 0 !important;
                  text-align: center !important;
                }

                /* Keep cards positioned at the side for tablets */
                #p12 {
                  position: absolute !important;
                  top: 120vh !important;
                  left: 5% !important;
                  width: 45% !important;
                  z-index: 30 !important;
                  padding: 0 !important;
                }

                #p11 {
                  position: absolute !important;
                  top: 300vh !important;
                  right: 5% !important;
                  left: auto !important;
                  width: 45% !important;
                  z-index: 30 !important;
                  padding: 0 !important;
                }

                /* Card styling for tablets */
                #p12 .card, #p11 .card {
                  padding: 1.5rem 1.25rem !important;
                  min-height: 220px !important;
                }

                /* Title styling for tablets */
                #p12 .title, #p11 .title {
                  font-size: 1.4rem !important;
                  line-height: 1.2 !important;
                  margin-bottom: 0.75rem !important;
                  word-wrap: break-word !important;
                  overflow-wrap: break-word !important;
                  hyphens: auto !important;
                }

                /* Description styling for tablets */
                #p12 .description, #p11 .description {
                  font-size: 0.85rem !important;
                  line-height: 1.4 !important;
                  word-wrap: break-word !important;
                  overflow-wrap: break-word !important;
                  width: 100% !important;
                  max-width: 100% !important;
                }
              }

              /* Custom mobile styles that you can modify */
              @media (max-width: 768px) {
                .mobile-welcome-text {
                  font-size: 3rem !important;
                  margin-top: -1rem !important;
                  /* Add your custom mobile styles here */
                }

                .mobile-infiverse-text {
                  margin-left: 1rem;
                  font-size: 2.8rem !important;
                  margin-top: -1rem !important;
                  text-align: center !important;
                  /* Add your custom mobile styles here */
                }

                /* Fix for the card positioning on mobile scroll */
                #p12, #p11 {
                  position: relative !important;
                  z-index: 30 !important;
                  width: 90% !important;
                  margin: 0 auto !important;
                  left: 0 !important;
                  right: 0 !important;
                  top: auto !important;
                  padding: 1rem !important;
                  height: auto !important;
                }

                #p12 {
                  margin-top: 120vh !important;
                }

                #p11 {
                  margin-top: 40vh !important;
                }

                #p12 > div, #p11 > div {
                  width: 100% !important;
                  height: auto !important;
                }

                #p12 .card, #p11 .card {
                  height: auto !important;
                  min-height: auto !important;
                  aspect-ratio: auto !important;
                  display: flex !important;
                  flex-direction: column !important;
                }

                #p12 .description, #p11 .description {
                  width: 100% !important;
                  max-width: 100% !important;
                }
              }

              @media (max-width: 480px) {
                #p12, #p11 {
                  width: 95% !important;
                }

                #p12 {
                  margin-top: 100vh !important;
                }

                #p11 {
                  margin-top: 30vh !important;
                }
              }
            `}
          </style>
        </div>

        <div id="p12" className="fade-in" ref={paragraphRef1}>
          <TiltCard
            title="AI Integration"
            description="The cyberspace is transforming, and so are we. At BlackHole InfiVerse, we are at the forefront of the next digital revolution. Specialising in cutting-edge technologies such as AI, Machine Learning, XR, Blockchain, Cybersecurity, Biotech, Quantum Computing and Robotics, we are crafting the future of Web3 and beyond."
            style={{
              width: "100%",
              maxWidth: "100%",
              margin: "0 auto",
              height: "auto",
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
              height: "auto",
            }}
          />
        </div>
      </div>
    </>
  );
}

export default BlackholeSideText;
