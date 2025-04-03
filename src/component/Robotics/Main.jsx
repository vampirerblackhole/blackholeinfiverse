import React, { useEffect, useState } from "react";
import Experience from "./Experience"; // This renders the robot model
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";
import "../../styles/Robot.css";
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
  return (
    <div className="container">
      <div className="section">
        <h1>Hello from 1</h1>
      </div>
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
            <h1>Hello from 10</h1>
          </div>
          <div className="section s-para1"></div>

          <div className="section s-para2">
            <div className="para1 fade-in">
              <h1 className="para-h">Redening Robotics with AI Integration</h1>
              <p className="para">
                At BlackHole InVerse, we’re developing the next generation of
                humanoid robotics that are intelligent, adaptable, and designed
                to seamlessly integrate into the Web3 ecosystem. Our humanoid
                robots are equipped with advanced AI systems that enable them to
                perform a wide range of tasks, from customer service to complex
                industrial operations.{" "}
              </p>
            </div>
          </div>
          <div className="section  s-para3">
            <div className="para2 fade-in">
              <h1 className="para-h">
                Empowering Industries with Smart Gadgets
              </h1>
              <p className="para">
                We’re not just building robots; we’re creating an ecosystem of
                smart gadgets that work together to enhance both human
                productivity and interaction. Our robotics solutions are
                designed for multiple applications, including healthcare,
                education, manufacturing, and entertainment. From assistive
                devices for people with disabilities to robotic arms in
                factories, our products are helping industries embrace
                automation and AI in a way that is both practical and
                revolutionary
              </p>
            </div>
          </div>

          <div className="section section2">
            <div className="para3 fade-in">
              <h1 className="para-h">Humanoid Robotics for a New Era </h1>
              <p className="para">
                Humanoid robots are poised to revolutionise industries that
                require human-like interaction and dexterity. At BlackHole
                InVerse, we’re leading the way with humanoid robots that can
                engage with people, understand complex scenarios, and execute
                intricate tasks. Whether it’s a robot serving as a virtual
                assistant, a healthcare companion, or a precision machine
                operator, our humanoid robots are equipped with advanced AI
                capabilities to perform their roles eectively and naturally. The
                future of robotics is intelligent, autonomous, and deeply
                integrated into the Web3 world
              </p>
            </div>
          </div>

          <div className="section12">
            <h1>Hello from 1</h1>
          </div>

          <div className="section section7">
            <h1>Hello from 7</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
