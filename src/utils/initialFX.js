import { SplitText } from "gsap-trial/SplitText"; // Correct import for trial version
import gsap from "gsap";
import { smoother } from "../Navbar/Navbar";

// Register the SplitText plugin
gsap.registerPlugin(SplitText);

export function initialFX() {
  document.body.style.overflowY = "auto";
  smoother.paused(false);
  document.getElementsByTagName("main")[0].classList.add("main-active");

  gsap.to("body", {
    backgroundColor: "#0b080c",
    duration: 0.5,
    delay: 1,
  });

  // Ensure the elements exist in the DOM
  const landingElements = document.querySelectorAll(".landing-info h3, .landing-intro h2, .landing-intro h1");
  if (landingElements.length > 0) {
    var landingText = new SplitText(landingElements, {
      type: "chars,lines",
      linesClass: "split-line",
    });

    gsap.fromTo(
      landingText.chars,
      { opacity: 0, y: 80, filter: "blur(5px)" },
      {
        opacity: 1,
        duration: 1.2,
        filter: "blur(0px)",
        ease: "power3.inOut",
        y: 0,
        stagger: 0.025,
        delay: 0.3,
      }
    );
  }

  let TextProps = { type: "chars,lines", linesClass: "split-h2" };

  const landingText2Elements = document.querySelectorAll(".landing-h2-info");
  if (landingText2Elements.length > 0) {
    var landingText2 = new SplitText(landingText2Elements, TextProps);
    gsap.fromTo(
      landingText2.chars,
      { opacity: 0, y: 80, filter: "blur(5px)" },
      {
        opacity: 1,
        duration: 1.2,
        filter: "blur(0px)",
        ease: "power3.inOut",
        y: 0,
        stagger: 0.025,
        delay: 0.3,
      }
    );
  }

  gsap.fromTo(
    ".landing-info-h2",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      y: 0,
      delay: 0.8,
    }
  );

  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      delay: 0.1,
    }
  );

  const landingText3Elements = document.querySelectorAll(".landing-h2-info-1");
  const landingText4Elements = document.querySelectorAll(".landing-h2-1");
  const landingText5Elements = document.querySelectorAll(".landing-h2-2");

  if (landingText3Elements.length > 0 && landingText4Elements.length > 0 && landingText5Elements.length > 0) {
    var landingText3 = new SplitText(landingText3Elements, TextProps);
    var landingText4 = new SplitText(landingText4Elements, TextProps);
    var landingText5 = new SplitText(landingText5Elements, TextProps);

    LoopText(landingText2, landingText3);
    LoopText(landingText4, landingText5);
  }
}

function LoopText(Text1, Text2) {
  var tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
  const delay = 4;
  const delay2 = delay * 2 + 1;

  tl.fromTo(
    Text2.chars,
    { opacity: 0, y: 80 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power3.inOut",
      y: 0,
      stagger: 0.1,
      delay: delay,
    },
    0
  )
    .fromTo(
      Text1.chars,
      { y: 80 },
      {
        duration: 1.2,
        ease: "power3.inOut",
        y: 0,
        stagger: 0.1,
        delay: delay2,
      },
      1
    )
    .fromTo(
      Text1.chars,
      { y: 0 },
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay,
      },
      0
    )
    .to(
      Text2.chars,
      {
        y: -80,
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
        delay: delay2,
      },
      1
    );
}