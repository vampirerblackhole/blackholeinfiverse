import { useEffect, useState } from "react";
import Experience from "./Experience"; // This renders the robot model
import "@/styles/Robot.css";
import RoboticsCard from "./RoboticsCard";
import TiltCard from "../../common/TiltCard";
import { animationManager } from "../../../utils/AnimationManager";
import { useTranslation } from "../../../hooks/useTranslation";

function Main() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const { t } = useTranslation();

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

    // Ensure animations are initialized when this component mounts
    animationManager.onInitialized(() => {
      console.log("Robot section: animations ready");
    });

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
            style={{ color: "white", position: "absolute", top: 30, zIndex: 5 }}
            id="loop"
          >
            {[...Array(5)].map((_, index) => (
              <h1 key={index} className="loop-h1">
                <span> {t('robotics.sectionTitle').split(' ')[0]}</span> {t('robotics.sectionTitle').split(' ')[1]}{" "}
                <b>
                  <i>{t('robotics.sectionTitle').split(' ')[2]}</i>
                </b>{" "}
                {t('robotics.sectionTitle').split(' ')[3]}{" "}
                <b>
                  <i>{t('robotics.sectionTitle').split(' ')[4]}</i>
                </b>
              </h1>
            ))}
          </div>
          <Experience scrollPosition={scrollPosition} />
        </div>
        <div className="cover">
          <div
            className="section s-para1"
            style={{ position: "relative", zIndex: 500 }}
          >
            <div className="para2">
              <RoboticsCard />
            </div>
          </div>

          <div
            className="section s-para2"
            style={{ position: "relative", zIndex: 500 }}
          >
            <div className="para2">
              <TiltCard
                title={t('robotics.aiIntegrationTitle')}
                description={t('robotics.aiIntegrationDescription')}
              />
            </div>
          </div>

          <div
            className="section s-para3"
            style={{ position: "relative", zIndex: 500 }}
          >
            <div className="para2-left">
              <TiltCard
                title={t('robotics.smartGadgetsTitle')}
                description={t('robotics.smartGadgetsDescription')}
              />
            </div>
          </div>

          <div
            className="section section2"
            style={{ position: "relative", zIndex: 500 }}
          >
            <div className="para3">
              <TiltCard
                title={t('robotics.humanoidTitle')}
                description={t('robotics.humanoidDescription')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
