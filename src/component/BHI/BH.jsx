import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../styles/BH.css";

gsap.registerPlugin(ScrollTrigger);

function BHI() {
  const scrollRef = useRef(null); // For the scroll container
  const canvasRef = useRef(null); // For the canvas element
  const [showBlackhole, setShowBlackhole] = useState(true);
  const paragraphRef1 = useRef(null);
  const paragraphRef2 = useRef(null);

  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const images = useMemo(() => {
    const loadedImages = [];
    let imagesLoaded = 0;

    for (let i = 100; i >= 0; i--) {
      const img = new Image();
      const nextNumber = String(i).padStart(4, "0");
      img.src = `/assets/BHI/${nextNumber}.webp`; // Image source with padding for zero

      // Wait for the image to load before adding it to the array
      img.onload = () => {
        imagesLoaded++;
        loadedImages.push(img);

        // Trigger a re-render or other logic if needed after all images are loaded
        if (imagesLoaded === 99) {
          // All 99 images are loaded
          console.log("All images loaded.");
        }
      };

      img.onerror = () => {
        console.error(`Image ${img.src} failed to load.`);
      };
    }

    return loadedImages;
  }, []);

  // Function to handle the transition from blackhole to content
  useEffect(() => {
    // Show blackhole for 8 seconds before transitioning to main content
    const timer = setTimeout(() => {
      setShowBlackhole(false);
    }, 8000);

    return () => clearTimeout(timer);
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

  const render = (index) => {
    if (images[index] && images[index].complete) {
      const context = canvasRef.current?.getContext("2d");
      const img = images[index];
      if (context && img) {
        context.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        const canvasWidth = canvasRef.current.width;
        const canvasHeight = canvasRef.current.height;

        const isMobile = window.innerWidth <= 768;

        let newWidth, newHeight, x, y;

        if (isMobile) {
          newHeight = canvasHeight;
          const aspectRatio = img.width / img.height;
          newWidth = newHeight * aspectRatio;
          x = (canvasWidth - newWidth) / 2;
          y = 0;
        } else {
          newWidth = canvasWidth;
          const aspectRatio = img.width / img.height;
          newHeight = newWidth / aspectRatio;
          y = (canvasHeight - newHeight) / 2;
          x = 0;
        }

        context.drawImage(img, x, y, newWidth, newHeight);
      }
    } else {
      console.warn("Image not fully loaded yet, skipping render.");
    }
  };

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
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const scrollTrigger = ScrollTrigger.create({
      trigger: scrollRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      pin: false,
      markers: false,
      onUpdate: (self) => {
        const progress = self.progress;
        const imageIndex = Math.round(progress * (images.length - 1));
        render(imageIndex);
      },
    });

    return () => scrollTrigger.kill();
  }, [images]);

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
          zIndex: 20, // Higher than blackhole
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
            zIndex: 1,
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            margin: 0,
            padding: 0,
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
            opacity: showBlackhole ? 0 : 1, // Show after blackhole fades
            transition: "opacity 1.5s ease-in-out",
          }}
        >
          <h1 className="gradient-text transition-opacity duration-500 ease-in-out text-6vw sm:text-[6vw] md:text-[6vw] lg:text-6xl xl:text-6xl bh-head ">
            <span>
              Take A
              <span>
                {" "}
                Step Towards <br />
              </span>
            </span>
          </h1>
          <h1 className="gradient-text transition-opacity duration-500 ease-in-out text-6vw sm:text-[6vw] md:text-[6vw] lg:text-6xl xl:text-6xl bh-head2 ">
            <span className="">The New Generation</span>
          </h1>
        </div>

        <div id="p12" className="fade-in" ref={paragraphRef1}>
          <h2 className="text-heading">
            Redefining Digital with AI Integration
          </h2>
          <p>
            The cyberspace is transforming, and so are we. At BlackHole InVerse,
            we are at the forefront of the next digital revolution. Specialising
            in cutting-edge technologies such as AI, Machine Learning, XR,
            Blockchain, and Robotics, we are crafting the future of Web3 and
            beyond.
          </p>
        </div>

        <div id="p11" className="fade-in" ref={paragraphRef2}>
          <h2 className="text-heading">
            Empowering Industries with Innovation
          </h2>
          <p>
            Our mission is to empower industries with innovative solutions that
            not only meet today&apos;s demands but also anticipate
            tomorrow&apos;s needs. Together, we&apos;re shaping a world where
            digital and physical realities converge seamlessly, driving progress
            and unlocking endless possibilities for the future.
          </p>
        </div>
      </div>
    </>
  );
}

export default BHI;
