import { useEffect, useState } from "react";
import Experience from "./Experience"; // This renders the robot model
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import "@/styles/Robot.css";
// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function Main() {
  const [scrollPosition, setScrollPosition] = useState(0);

  // Handle scroll event to track scroll position
  const handleScroll = () => {
    const scrollY = window.scrollY * 2; // You can adjust this multiplier if needed
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;

    // Normalize the scroll position (between 0 and 1)
    const normalizedScroll = Math.min(scrollY / maxScroll, 1);
    setScrollPosition(normalizedScroll);
  };

  useEffect(() => {
    // Attach scroll event listener
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup listener
  }, []);

  // Initialize fade-in animations by adding a class when elements enter viewport
  useEffect(() => {
    const fadeElements = document.querySelectorAll(".fade-in");
    const paraElements = document.querySelectorAll(".para");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");

            // If this is a container with paragraphs, make them visible too
            if (entry.target.querySelector(".para")) {
              const paragraphs = entry.target.querySelectorAll(".para");
              paragraphs.forEach((para) => para.classList.add("visible"));
            }
          }
        });
      },
      {
        threshold: 0.1, // Trigger when at least 10% of the element is visible
        rootMargin: "0px 0px -50px 0px", // Adjust the timing of when elements become "visible"
      }
    );

    fadeElements.forEach((element) => {
      observer.observe(element);
    });

    // Also observe the paragraph elements directly
    paraElements.forEach((element) => {
      if (!element.closest(".fade-in")) {
        // Only observe if not already in a fade-in container
        observer.observe(element);
      }
    });

    return () => {
      fadeElements.forEach((element) => {
        observer.unobserve(element);
      });
      paraElements.forEach((element) => {
        if (!element.closest(".fade-in")) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  return (
    <div className="container">
      {/* Main content container */}
      <div className="bh-container">
        <div className="canvas-container">
          {/* <NameCanva /> */}
          <div
            style={{ color: "white", position: "absolute", top: 30 }}
            id="loop"
          >
            <h1 className="loop-h1">
              <span> UNLEASHING</span> THE{" "}
              <b>
                <i>FUTURE</i>
              </b>{" "}
              WITH{" "}
              <b>
                <i>ROBOTICS! </i>
              </b>
            </h1>
            <h1 className="loop-h1">
              <span>UNLEASHING</span> THE{" "}
              <b>
                <i>FUTURE</i>
              </b>{" "}
              WITH{" "}
              <b>
                <i>ROBOTICS! </i>
              </b>
            </h1>
            <h1 className="loop-h1">
              <span>UNLEASHING</span> THE{" "}
              <b>
                <i>FUTURE</i>
              </b>{" "}
              WITH{" "}
              <b>
                <i>ROBOTICS! </i>
              </b>
            </h1>
            <h1 className="loop-h1">
              <span> UNLEASHING</span> THE{" "}
              <b>
                <i>FUTURE</i>
              </b>{" "}
              WITH{" "}
              <b>
                <i>ROBOTICS! </i>
              </b>
            </h1>
            <h1 className="loop-h1">
              <span> UNLEASHING</span> THE{" "}
              <b>
                <i>FUTURE</i>
              </b>{" "}
              WITH{" "}
              <b>
                <i>ROBOTICS! </i>
              </b>
            </h1>
          </div>
          <Experience scrollPosition={scrollPosition} />
        </div>
        <div className="cover">
          <div className="section section0">
            <h1> from 10</h1>
          </div>
          <div
            className="section s-para1"
            style={{ position: "relative", zIndex: 1000 }}
          >
            <div className="para1">
              <h1 className="para-h">Welcome to BlackHole InVerse Robotics</h1>
              <p className="para">
                Our cutting-edge robotics division is pushing the boundaries of
                what&apos;s possible with advanced AI and mechanical
                engineering. We&apos;re creating intelligent machines that help
                solve real-world problems while advancing the field of robotics.
              </p>
            </div>
          </div>

          <div
            className="section s-para2"
            style={{ position: "relative", zIndex: 1000 }}
          >
            <div className="para2">
              <h1 className="para-h">
                Redefining Robotics with AI Integration
              </h1>
              <p className="para">
                At BlackHole InVerse, we&apos;re developing the next generation
                of humanoid robotics that are intelligent, adaptable, and
                designed to seamlessly integrate into the Web3 ecosystem. Our
                humanoid robots are equipped with advanced AI systems that
                enable them to perform a wide range of tasks, from customer
                service to complex industrial operations.
              </p>
            </div>
          </div>
          <div
            className="section s-para3"
            style={{ position: "relative", zIndex: 1000 }}
          >
            <div className="para2-left">
              <h1 className="para-h">
                Empowering Industries with Smart Gadgets
              </h1>
              <p className="para">
                We&apos;re not just building robots; we&apos;re creating an
                ecosystem of smart gadgets that work together to enhance both
                human productivity and interaction. Our robotics solutions are
                designed for multiple applications, including healthcare,
                education, manufacturing, and entertainment. From assistive
                devices for people with disabilities to robotic arms in
                factories, our products are helping industries embrace
                automation and AI in a way that is both practical and
                revolutionary
              </p>
            </div>
          </div>

          <div
            className="section section2"
            style={{ position: "relative", zIndex: 1000 }}
          >
            <div className="para3">
              <h1 className="para-h">Humanoid Robotics for a New Era </h1>
              <p className="para">
                Humanoid robots are poised to revolutionise industries that
                require human-like interaction and dexterity. At BlackHole
                InVerse, we&apos;re leading the way with humanoid robots that
                can engage with people, understand complex scenarios, and
                execute intricate tasks. Whether it&apos;s a robot serving as a
                virtual assistant, a healthcare companion, or a precision
                machine operator, our humanoid robots are equipped with advanced
                AI capabilities to perform their roles effectively and
                naturally. The future of robotics is intelligent, autonomous,
                and deeply integrated into the Web3 world
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
