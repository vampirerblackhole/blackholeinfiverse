import { useRef, useLayoutEffect, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BlurCard from "../components/common/BlurCard";
import { firebasePerformanceMonitor } from "../utils/FirebasePerformanceMonitor";
import "./WhyUs.css";

gsap.registerPlugin(ScrollTrigger);

function WhyUs() {
  const servicesRef = useRef(null);
  const [isTablet, setIsTablet] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isFirebaseHosted, setIsFirebaseHosted] = useState(false);

  // Check if device is tablet/small laptop and Firebase hosting
  useEffect(() => {
    const checkTablet = () => {
      setIsTablet(window.innerWidth <= 1024 && window.innerWidth > 768);
    };

    // Detect Firebase hosting
    const hostname = window.location.hostname;
    setIsFirebaseHosted(
      hostname.includes("firebaseapp.com") ||
        hostname.includes("web.app") ||
        hostname.includes("firebase.com")
    );

    checkTablet();
    window.addEventListener("resize", checkTablet);
    return () => window.removeEventListener("resize", checkTablet);
  }, []);

  // Enhanced hover handlers with performance monitoring
  const handleCardHover = (cardIndex, isEntering) => {
    if (isEntering) {
      setHoveredCard(cardIndex);
      if (isFirebaseHosted) {
        firebasePerformanceMonitor.logEvent("whyus_card_hover", { cardIndex });
      }
    } else {
      setHoveredCard(null);
    }
  };

  useLayoutEffect(() => {
    const animationStart = performance.now();

    const ctx = gsap.context(() => {
      gsap.utils.toArray(servicesRef.current.children).forEach((el, i) => {
        // Add gsap-ready class to enable GSAP-controlled styling
        el.classList.add("gsap-ready");

        // Enhanced animation with Firebase-aware timing
        const delay = isFirebaseHosted ? i * 0.3 : i * 0.2; // Slightly longer delays for Firebase

        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            refreshPriority: 1, // High priority for smooth scrolling
            onEnter: () => {
              if (isFirebaseHosted) {
                firebasePerformanceMonitor.logEvent("whyus_card_animated", {
                  cardIndex: i,
                });
              }
            },
          },
          opacity: 0,
          y: 30,
          duration: 1.2, // Slightly longer duration for smoother animation
          delay,
          ease: "power2.out", // Smoother easing
        });

        // Add subtle hover enhancement animation
        const hoverTl = gsap.timeline({ paused: true });
        hoverTl
          .to(
            el.querySelector("h2"),
            {
              y: -2,
              duration: 0.3,
              ease: "power2.out",
            },
            0
          )
          .to(
            el.querySelectorAll("h3"),
            {
              y: -1,
              duration: 0.3,
              ease: "power2.out",
              stagger: 0.1,
            },
            0
          )
          .to(
            el.querySelectorAll("p"),
            {
              color: "rgba(255, 255, 255, 0.9)",
              duration: 0.3,
              ease: "power2.out",
            },
            0
          );

        // Store timeline reference for hover control
        el._hoverTimeline = hoverTl;
      });
    });

    const animationDuration = performance.now() - animationStart;
    if (isFirebaseHosted) {
      firebasePerformanceMonitor.logEvent("whyus_animations_initialized", {
        duration: animationDuration,
      });
    }

    return () => ctx.revert();
  }, [isFirebaseHosted]);

  return (
    <div className="text-white pt-[90px] md:pt-[70px]">
      {/* Cards Container */}
      <div
        ref={servicesRef}
        className="max-w-6xl mx-auto px-4 md:px-6 pb-10 md:pb-20 flex flex-col lg:grid lg:grid-cols-2 gap-6 md:gap-8"
      >
        <BlurCard
          className={`mt-8 md:mt-12 lg:mt-16 snap-center min-w-[90vw] md:min-w-[70vw] lg:min-w-0 whyus-card ${
            isTablet ? "!min-h-[200px]" : ""
          } ${hoveredCard === 0 ? "hovered" : ""}`}
          colSpan="lg:col-span-2"
          onMouseEnter={() => handleCardHover(0, true)}
          onMouseLeave={() => handleCardHover(0, false)}
        >
          <h1
            className="text-4xl md:text-5xl lg:text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-orange-300 to-gray-300 mb-3 md:mb-4"
            style={{ paddingBottom: isTablet ? "10px" : "15px" }}
          >
            Why Us?
          </h1>
          <p
            className={`mt-2 text-base ${
              isTablet ? "text-base" : "md:text-lg"
            } text-gray-400 max-w-full md:max-w-2xl`}
          >
            At Blackhole InfiVerse, we partner with leading research
            institutions to fuse quantum, cybersecurity, and blockchain
            expertise into secure, scalable solutions for tomorrow&apos;s
            digital ecosystems.
          </p>
        </BlurCard>

        <BlurCard
          className={`snap-center min-w-[90vw] md:min-w-[70vw] lg:min-w-0 whyus-card ${
            isTablet ? "!min-h-[220px]" : ""
          } ${hoveredCard === 1 ? "hovered" : ""}`}
          onMouseEnter={() => handleCardHover(1, true)}
          onMouseLeave={() => handleCardHover(1, false)}
        >
          <h2
            className={`text-xl ${
              isTablet ? "text-2xl" : "md:text-3xl"
            } font-semibold mb-2 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600`}
          >
            Quantum Computing: Reimagining Reality Through Computation
          </h2>
          <p
            className={`text-sm ${
              isTablet ? "text-sm" : "md:text-base"
            } text-gray-300 leading-relaxed mb-3 md:mb-6`}
          >
            At BlackHole InfiVerse, we&apos;re in the process of collaborating
            with leading quantum physicists from a Leading Indian Institute in
            Quantum Research to explore the vast, untapped potential of quantum
            computing. Still in its early research and ideation stage, this
            initiative is focused on rewriting the limits of what&apos;s
            computationally possible.
          </p>
          <h3
            className={`text-lg ${
              isTablet ? "text-xl" : "md:text-2xl"
            } font-semibold mb-2 md:mb-4`}
          >
            Building the Foundations of Quantum Intelligence
          </h3>
          <p
            className={`text-sm ${
              isTablet ? "text-sm" : "md:text-base"
            } text-gray-300 leading-relaxed mb-3 md:mb-6`}
          >
            Unlike classical systems, our research is grounded in the quantum
            realm — working with qubits, entanglement, and superposition to
            enable computing capabilities that scale beyond Moore&apos;s Law.
            We&apos;re exploring quantum algorithms that could revolutionize
            encryption, material simulation, machine learning, and more.
          </p>
          <h3
            className={`text-lg ${
              isTablet ? "text-xl" : "md:text-2xl"
            } font-semibold mb-2 md:mb-4`}
          >
            Quantum x AI x Blockchain: A New Technological Trinity
          </h3>
          <p
            className={`text-sm ${
              isTablet ? "text-sm" : "md:text-base"
            } text-gray-300 leading-relaxed`}
          >
            Our vision isn&apos;t just to build a quantum computer — it&apos;s
            to integrate quantum processing with AI and blockchain to create a
            unified system that drives the next wave of intelligence and trust.
            As Web3 evolves into the metaverse and beyond, quantum computing
            will power the backbone of secure, autonomous, hyper-intelligent
            ecosystems.
          </p>
        </BlurCard>

        <BlurCard
          className={`snap-center min-w-[90vw] md:min-w-[70vw] lg:min-w-0 whyus-card ${
            isTablet ? "!min-h-[220px]" : ""
          } ${hoveredCard === 2 ? "hovered" : ""}`}
          onMouseEnter={() => handleCardHover(2, true)}
          onMouseLeave={() => handleCardHover(2, false)}
        >
          <h2
            className={`text-xl ${
              isTablet ? "text-2xl" : "md:text-3xl"
            } font-semibold mb-2 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-green-500`}
          >
            Securing the Future of the Digital World
          </h2>
          <p
            className={`text-sm ${
              isTablet ? "text-sm" : "md:text-base"
            } text-gray-300 leading-relaxed mb-3 md:mb-6`}
          >
            At BlackHole InfiVerse, we&apos;re building a new cybersecurity
            paradigm that fuses artificial intelligence, blockchain technology,
            and next-gen encryption. Our mission is to create a truly secure
            cyberspace where data, identity, and assets are protected by
            autonomous, intelligent defense systems.
          </p>
          <h3
            className={`text-lg ${
              isTablet ? "text-xl" : "md:text-2xl"
            } font-semibold mb-2 md:mb-4`}
          >
            AI-Driven Defense for a Decentralized Web
          </h3>
          <p
            className={`text-sm ${
              isTablet ? "text-sm" : "md:text-base"
            } text-gray-300 leading-relaxed mb-3 md:mb-6`}
          >
            Traditional firewalls and rule-based systems are no longer enough.
            Our cybersecurity framework uses AI to detect, respond to, and
            neutralize threats in real time. Integrated with blockchain-based
            identity and trust protocols, our solutions are designed for the
            decentralized, user-owned Web3 world — enabling a future where
            privacy and security aren&apos;t features, but defaults.
          </p>
          <h3
            className={`text-lg ${
              isTablet ? "text-xl" : "md:text-2xl"
            } font-semibold mb-2 md:mb-4`}
          >
            Cybersecurity for Every Layer of Reality
          </h3>
          <p
            className={`text-sm ${
              isTablet ? "text-sm" : "md:text-base"
            } text-gray-300 leading-relaxed`}
          >
            From securing smart contracts and virtual assets to protecting
            physical infrastructure in the real world, our cybersecurity systems
            adapt to both digital and physical threats. Whether it&apos;s
            securing VR metaverses, robotic networks, or quantum transmissions,
            BlackHole InfiVerse is creating a multi-layered shield for the
            connected future.
          </p>
        </BlurCard>
      </div>
    </div>
  );
}

export default WhyUs;
