import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import StarsCanvas from '../../../main/StarBackground';
import Navbar from '../../Navbar/Navbar';
import '../../styles/BH.css'

gsap.registerPlugin(ScrollTrigger);

function BHI() {
  const scrollRef = useRef(null);  // For the scroll container
  const canvasRef = useRef(null);  // For the canvas element

  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const images = useMemo(() => {
    const loadedImages = [];
    let imagesLoaded = 0;

    for (let i = 100; i >= 0; i--) {
      const img = new Image();
      const nextNumber = String(i).padStart(4, '0');
      img.src = `/assets/BHI/${nextNumber}.webp`; // Image source with padding for zero

      // Wait for the image to load before adding it to the array
      img.onload = () => {
        imagesLoaded++;
        loadedImages.push(img);

        // Trigger a re-render or other logic if needed after all images are loaded
        if (imagesLoaded === 99) { // All 99 images are loaded
          console.log("All images loaded.");
        }
      };

      img.onerror = () => {
        console.error(`Image ${img.src} failed to load.`);
      };
    }

    return loadedImages;
  }, []);

  const render = (index) => {
    if (images[index] && images[index].complete) {
      const context = canvasRef.current?.getContext('2d');
      const img = images[index];
      if (context && img) {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

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

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    gsap.to('.bh-head', {
      scrollTrigger: {
        trigger: '#bh', // Element that will trigger the animation when scrolled into view
        start: 'top top', // When the top of the `.portal` reaches 80% of the viewport height
        end: 'bottom 80%', // When the bottom of the `.portal` reaches 20% of the viewport height
        scrub: 1, // This will link the animation progress to the scroll
      },
      x: -1450,
      ease: 'power4.out',
    });
    gsap.to('.bh-head2', {
      scrollTrigger: {
        trigger: '#bh', // Element that will trigger the animation when scrolled into view
        start: 'top top', // When the top of the `.portal` reaches 80% of the viewport height
        end: 'bottom 80%', // When the bottom of the `.portal` reaches 20% of the viewport height
        scrub: 1, // This will link the animation progress to the scroll
      },
      x: 1500,
      ease: 'power4.out',
    });// Create a GSAP Timeline with ScrollTrigger
  // Create a GSAP Timeline with ScrollTrigger
let tl = gsap.timeline({
  scrollTrigger: {
    trigger: "#pc",
    start: "top 50%",  // When the animation starts
    end: "bottom top",
    scrub: true,
    markers: true, // Remove this in production
  }
});

// Add animations to the timeline
tl.to("#p12", { opacity: 1 })   // Fade in #p12
  .to("#p12", { opacity: 0 }, "+=1"); // Keep visible for a while, then fade out

// Separate timeline for #p11 with a different start position
let tl2 = gsap.timeline({
  scrollTrigger: {
    trigger: "#pc",
    start: "top 5%",  // Different start point for #p11
    end: "bottom top",
    scrub: true,
    markers: true, // Remove in production
  }
});

// Add animations for #p11
tl2.to("#p11", { opacity: 1 })  
   .to("#p11", { opacity: 0 }, "+=1"); 

    
    
   
  }, []);
 

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const scrollTrigger = ScrollTrigger.create({
      trigger: scrollRef.current,
      start: 'top top',
      end: 'bottom top',
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
          position: 'relative',
          height: '500vh',
          width: '100vw',
          overflowX: 'hidden',
          overflowY: "hidden",
        }}
      >
        {/* <div className="bg-[#0000] w-full relative" style={{ zIndex: 20 }}>
          <StarsCanvas />
        </div> */}

        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
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
            height:"100vh"
          }}
        >
          <h1 className="gradient-text transition-opacity duration-500 ease-in-out text-6vw sm:text-[6vw] md:text-[6vw] lg:text-6xl xl:text-6xl bh-head ">
            <span>
              Take A
              <span> Step Towards <br /></span>
              </span>
              </h1>
          <h1 className="gradient-text transition-opacity duration-500 ease-in-out text-6vw sm:text-[6vw] md:text-[6vw] lg:text-6xl xl:text-6xl bh-head2 ">

              <span className="">The New Generation</span>
          </h1>
          
        </div>
        <div  style={{
            position: "relative",
            zIndex: 25,
            fontSize: "5vw", // Make text size responsive using viewport width
            textAlign: 'center',
            
          }} id='pc'>
        <p className='lg:text-3xl sm:text-lg md:text-xl  ' id="p12" >
        The cyberspace is transforming, and so are we. At BlackHole InVerse, we are at the forefront of the next digital revolution. Specialising in cutting-edge technologies such as AI, Machine Learning, XR, Blockchain, and Robotics, we are crafting the future of Web3 and beyond.
          </p>
          <p className='lg:text-3xl sm:text-lg md:text-xl  ' id="p11" >
          Our mission is to empower industries with innovative solutions that not only meet today’s demands but also anticipate tomorrow’s needs. Together, we’re shaping a world where digital and physical realities converge seamlessly, driving progress and unlocking endless possibilities for the future.


          </p>
          </div>
          </div>
       


    </>
  );
}

export default BHI;
