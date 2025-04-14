/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useRef, useLayoutEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Gamepad2, Brain, Notebook as Robot, Bitcoin } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

function About() {
  const mainRef = useRef(null);
  const sectionsRef = useRef(null);
  const heroRef = useRef(null);
  const cardRef = useRef(null);

  // State to track mouse position for 3D effect
  const [transform, setTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    active: false,
  });

  // Handle mouse movement for 3D card effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate mouse position relative to card center
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Convert to rotation values (-10 to 10 degrees)
    const rotateY = -(mouseX / (width / 2)) * 10;
    const rotateX = (mouseY / (height / 2)) * 10;

    setTransform({
      rotateX,
      rotateY,
      active: true,
    });
  };

  // Reset transform when mouse leaves
  const handleMouseLeave = () => {
    setTransform({
      rotateX: 0,
      rotateY: 0,
      active: false,
    });
  };

  // Enter transform when mouse enters
  const handleMouseEnter = () => {
    setTransform((prev) => ({
      ...prev,
      active: true,
    }));
  };

  // Calculate the transform style for the card
  const cardStyle = {
    transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${
      transform.rotateY
    }deg) scale(${transform.active ? 1.03 : 1})`,
    transition: transform.active
      ? "transform 0.1s ease"
      : "transform 0.5s ease",
    boxShadow: transform.active
      ? `${transform.rotateY * 0.5}px ${
          transform.rotateX * -0.5
        }px 50px rgba(111, 66, 193, 0.8)`
      : "0 10px 30px rgba(0, 0, 0, 0.3)",
    border: transform.active
      ? "3px solid rgba(155, 89, 182, 0.48)"
      : "1px solid rgba(255, 255, 255, 0.1)",
    transformStyle: "preserve-3d",
    cursor: "pointer",
  };

  // Styles for inner elements
  const titleStyle = {
    transform: transform.active
      ? `translateZ(50px) translateX(${
          transform.rotateY * -1.5
        }px) translateY(${transform.rotateX * -1.5}px)`
      : "none",
    transition: transform.active
      ? "transform 0.1s ease"
      : "transform 0.5s ease",
    transformStyle: "preserve-3d",
  };

  const paragraphStyle = {
    transform: transform.active
      ? `translateZ(30px) translateX(${transform.rotateY * -1}px) translateY(${
          transform.rotateX * -1
        }px)`
      : "none",
    transition: transform.active
      ? "transform 0.1s ease"
      : "transform 0.5s ease",
    transformStyle: "preserve-3d",
  };

  const lineStyle = {
    transform: transform.active
      ? `translateZ(20px) translateX(${transform.rotateY * 0.5}px) translateY(${
          transform.rotateX * 0.5
        }px)`
      : "none",
    transition: transform.active
      ? "transform 0.1s ease"
      : "transform 0.5s ease",
    transformStyle: "preserve-3d",
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section animation
      gsap.from(heroRef.current, {
        opacity: 0,
        y: 100,
        duration: 1.5,
        ease: "power3.out",
      });

      // Sections animations
      const sections = sectionsRef.current.children;
      Array.from(sections).forEach((section, index) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            scrub: 1,
          },
          opacity: 0,
          y: 100,
          scale: 0.9,
          duration: 1,
          ease: "power2.out",
        });
      });

      // Floating animation for icons
      gsap.to(".floating-icon", {
        y: "20px",
        duration: 2,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={mainRef}
      className="min-h-screen text-white overflow-hidden relative z-10"
    >
      {/* Hero Section */}
      <div
        ref={heroRef}
        className="relative h-screen flex items-center justify-center text-center px-4"
      >
        <div className="absolute inset-0 bg-[url('/about/bh-mainH.jpg')] bg-cover bg-center opacity-80"></div>
        <div className="relative z-10 max-w-4xl mx-auto pt-16">
          <div
            ref={cardRef}
            className="backdrop-blur-md bg-black/20 p-10 rounded-3xl shadow-2xl"
            style={cardStyle}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <h1
              className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
              style={titleStyle}
            >
              Shaping Tomorrow's Reality
            </h1>
            <p
              className="text-xl md:text-2xl text-gray-300 mb-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
              style={paragraphStyle}
            >
              A pioneering startup at the intersection of VR, AI, Robotics, and
              Blockchain
            </p>

            <div
              className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-600 mx-auto rounded-full"
              style={lineStyle}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div
        ref={sectionsRef}
        className="container mx-auto px-4 py-20 space-y-32"
      >
        {/* VR Games Section */}
        <section className="relative">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <Gamepad2 className="w-16 h-16 text-blue-400 floating-icon mb-6" />
              <h2 className="text-4xl font-bold mb-6">VR Gaming Revolution</h2>
              <p className="text-gray-300 text-lg mb-6">
                Get ready for our groundbreaking VR game launches. Four
                immersive worlds await, pushing the boundaries of virtual
                reality gaming.
              </p>
              <ul className="space-y-4 text-gray-300">
                <li>✦ 4 Revolutionary Games in Final Development</li>
                <li>✦ Next-Gen VR Technology Integration</li>
                <li>✦ Immersive Multiplayer Experiences</li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <img
                src="/about/vrwoman-img.jpg"
                alt="VR Gaming"
                className="w-full sm:max-w-[500px] h-auto mx-auto object-cover rounded-xl border-2 border-pink-400/30 shadow-xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </section>

        {/* AI Section */}
        <section className="relative">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="md:w-1/2">
              <Brain className="w-16 h-16 text-purple-400 floating-icon mb-6" />
              <h2 className="text-4xl font-bold mb-6">AI Innovation Hub</h2>
              <p className="text-gray-300 text-lg mb-6">
                Pioneering the future of artificial intelligence through
                advanced model development and training.
              </p>
              <ul className="space-y-4 text-gray-300">
                <li>✦ Custom AI Model Development</li>
                <li>✦ Advanced Training Pipelines</li>
                <li>✦ Specialized Model Fine-tuning</li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <img
                src="/about/ai-img.png"
                alt="AI Development"
                className="w-full sm:max-w-[500px] h-auto mx-auto object-cover rounded-xl border-2 border-purple-400/30 shadow-xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </section>

        {/* Robotics Section */}
        <section className="relative">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <Robot className="w-16 h-16 text-green-400 floating-icon mb-6" />
              <h2 className="text-4xl font-bold mb-6">Next-Gen Robotics</h2>
              <p className="text-gray-300 text-lg mb-6">
                Developing the next generation of intelligent robots that will
                reshape industries and daily life.
              </p>
              <ul className="space-y-4 text-gray-300">
                <li>✦ Advanced Robotics R&D</li>
                <li>✦ AI-Powered Automation</li>
                <li>✦ Human-Robot Interaction</li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <img
                src="/about/robot-img.jpg"
                alt="Robotics"
                className="w-full sm:max-w-[500px] h-auto mx-auto object-cover rounded-xl border-2 border-blue-400/30 shadow-xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </section>

        {/* Blockchain Section */}
        <section className="relative">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="md:w-1/2">
              <Bitcoin className="w-16 h-16 text-yellow-400 floating-icon mb-6" />
              <h2 className="text-4xl font-bold mb-6">Blockchain Innovation</h2>
              <p className="text-gray-300 text-lg mb-6">
                Creating a revolutionary blockchain ecosystem with our own
                cryptocurrency and secure wallet solutions.
              </p>
              <ul className="space-y-4 text-gray-300">
                <li>✦ Custom Cryptocurrency Development</li>
                <li>✦ Secure Wallet Infrastructure</li>
                <li>✦ Smart Contract Integration</li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <img
                src="/about/blockchain-img.jpg"
                alt="Blockchain"
                className="w-full sm:max-w-[500px] h-auto mx-auto object-cover rounded-xl border-2 border-yellow-400/30 shadow-xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-20">
          <h2 className="text-4xl font-bold mb-8">Join Our Journey</h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Be part of the future as we revolutionize technology across multiple
            frontiers.
          </p>
        </section>
      </div>
    </div>
  );
}

export default About;
