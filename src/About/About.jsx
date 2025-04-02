/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Gamepad2, Brain, Notebook as Robot, Bitcoin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

function About() {
  const mainRef = useRef(null);
  const sectionsRef = useRef(null);
  const heroRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section animation
      gsap.from(heroRef.current, {
        opacity: 0,
        y: 100,
        duration: 1.5,
        ease: "power3.out"
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

    <div ref={mainRef} className="min-h-screen  text-white overflow-hidden">
      {/* Hero Section */}
      <div ref={heroRef} className="relative h-screen flex items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-80"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Shaping Tomorrow's Reality
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            A pioneering startup at the intersection of VR, AI, Robotics, and Blockchain
          </p>
          <div className="animate-bounce">
            <svg className="w-6 h-6 mx-auto text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div ref={sectionsRef} className="container mx-auto px-4 py-20 space-y-32">
        {/* VR Games Section */}
        <section className="relative">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <Gamepad2 className="w-16 h-16 text-blue-400 floating-icon mb-6" />
              <h2 className="text-4xl font-bold mb-6">VR Gaming Revolution</h2>
              <p className="text-gray-300 text-lg mb-6">
                Get ready for our groundbreaking VR game launches. Four immersive worlds await, pushing the boundaries of virtual reality gaming.
              </p>
              <ul className="space-y-4 text-gray-300">
                <li>✦ 4 Revolutionary Games in Final Development</li>
                <li>✦ Next-Gen VR Technology Integration</li>
                <li>✦ Immersive Multiplayer Experiences</li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="VR Gaming"
                className="rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
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
                Pioneering the future of artificial intelligence through advanced model development and training.
              </p>
              <ul className="space-y-4 text-gray-300">
                <li>✦ Custom AI Model Development</li>
                <li>✦ Advanced Training Pipelines</li>
                <li>✦ Specialized Model Fine-tuning</li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="AI Development"
                className="rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
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
                Developing the next generation of intelligent robots that will reshape industries and daily life.
              </p>
              <ul className="space-y-4 text-gray-300">
                <li>✦ Advanced Robotics R&D</li>
                <li>✦ AI-Powered Automation</li>
                <li>✦ Human-Robot Interaction</li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Robotics"
                className="rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
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
                Creating a revolutionary blockchain ecosystem with our own cryptocurrency and secure wallet solutions.
              </p>
              <ul className="space-y-4 text-gray-300">
                <li>✦ Custom Cryptocurrency Development</li>
                <li>✦ Secure Wallet Infrastructure</li>
                <li>✦ Smart Contract Integration</li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Blockchain"
                className="rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-20" > 
          <h2 className="text-4xl font-bold mb-8">Join Our Journey</h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Be part of the future as we revolutionize technology across multiple frontiers.
          </p>
          
        </section>
      </div>
    </div>
  );
}

export default About;