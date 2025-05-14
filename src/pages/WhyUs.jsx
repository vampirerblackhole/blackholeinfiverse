import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BlurCard from "../components/common/BlurCard";

gsap.registerPlugin(ScrollTrigger);

function WhyUs() {
  const servicesRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(servicesRef.current.children).forEach((el, i) =>
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 90%" },
          opacity: 0,
          y: 30,
          duration: 1,
          delay: i * 0.2,
        })
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="text-white pt-[90px] md:pt-[70px]">
      {/* Cards Container */}
      <div
        ref={servicesRef}
        className="max-w-6xl mx-auto px-4 md:px-6 pb-10 md:pb-20 flex flex-col lg:grid lg:grid-cols-2 gap-8"
      >
        <BlurCard
          className="mt-8 md:mt-16 snap-center min-w-[90vw] md:min-w-[70vw] lg:min-w-0"
          colSpan="lg:col-span-2"
        >
          <h1
            className="text-4xl md:text-6xl lg:text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-orange-300 to-gray-300 mb-4"
            style={{ paddingBottom: "15px" }}
          >
            Why Us?
          </h1>
          <p className="mt-2 text-base md:text-lg text-gray-400 max-w-full md:max-w-2xl">
            At Blackhole InfiVerse, we partner with leading research
            institutions to fuse quantum, cybersecurity, and blockchain
            expertise into secure, scalable solutions for tomorrow&apos;s
            digital ecosystems.
          </p>
        </BlurCard>

        <BlurCard className="snap-center min-w-[90vw] md:min-w-[70vw] lg:min-w-0">
          <h2 className="text-xl md:text-3xl font-semibold mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
            Quantum Computing: Reimagining Reality Through Computation
          </h2>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-4 md:mb-6">
            At BlackHole InfiVerse, we&apos;re in the process of collaborating
            with leading quantum physicists from a Leading Indian Institute in
            Quantum Research to explore the vast, untapped potential of quantum
            computing. Still in its early research and ideation stage, this
            initiative is focused on rewriting the limits of what&apos;s
            computationally possible.
          </p>
          <h3 className="text-lg md:text-2xl font-semibold mb-3 md:mb-4">
            Building the Foundations of Quantum Intelligence
          </h3>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-4 md:mb-6">
            Unlike classical systems, our research is grounded in the quantum
            realm — working with qubits, entanglement, and superposition to
            enable computing capabilities that scale beyond Moore&apos;s Law.
            We&apos;re exploring quantum algorithms that could revolutionize
            encryption, material simulation, machine learning, and more.
          </p>
          <h3 className="text-lg md:text-2xl font-semibold mb-3 md:mb-4">
            Quantum x AI x Blockchain: A New Technological Trinity
          </h3>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
            Our vision isn&apos;t just to build a quantum computer — it&apos;s
            to integrate quantum processing with AI and blockchain to create a
            unified system that drives the next wave of intelligence and trust.
            As Web3 evolves into the metaverse and beyond, quantum computing
            will power the backbone of secure, autonomous, hyper-intelligent
            ecosystems.
          </p>
        </BlurCard>

        <BlurCard className="snap-center min-w-[90vw] md:min-w-[70vw] lg:min-w-0">
          <h2 className="text-xl md:text-3xl font-semibold mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-green-500">
            Securing the Future of the Digital World
          </h2>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-4 md:mb-6">
            At BlackHole InfiVerse, we&apos;re building a new cybersecurity
            paradigm that fuses artificial intelligence, blockchain technology,
            and next-gen encryption. Our mission is to create a truly secure
            cyberspace where data, identity, and assets are protected by
            autonomous, intelligent defense systems.
          </p>
          <h3 className="text-lg md:text-2xl font-semibold mb-3 md:mb-4">
            AI-Driven Defense for a Decentralized Web
          </h3>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-4 md:mb-6">
            Traditional firewalls and rule-based systems are no longer enough.
            Our cybersecurity framework uses AI to detect, respond to, and
            neutralize threats in real time. Integrated with blockchain-based
            identity and trust protocols, our solutions are designed for the
            decentralized, user-owned Web3 world — enabling a future where
            privacy and security aren&apos;t features, but defaults.
          </p>
          <h3 className="text-lg md:text-2xl font-semibold mb-3 md:mb-4">
            Cybersecurity for Every Layer of Reality
          </h3>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
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
