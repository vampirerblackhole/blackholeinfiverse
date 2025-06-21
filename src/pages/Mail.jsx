import { Mail as MailIcon } from "lucide-react";
import { useRef, useEffect } from "react";
import { useTranslation } from "../hooks/useTranslation";

const Mail = () => {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const emailAddress = "bh@blackholeinfiverse.com";
  const { t } = useTranslation();

  // Card tilt effect
  useEffect(() => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;

    // Values for the tilt effect
    const maxTilt = 25;
    const maxGlare = 0.3;
    const perspective = 1500;
    let ticking = false;
    let animationFrame = null;

    const updateTransform = (x, y) => {
      if (!card || !glare) return;

      const cardRect = card.getBoundingClientRect();
      const cardWidth = cardRect.width;
      const cardHeight = cardRect.height;

      // Calculate percentage of cursor position within card (0-1)
      const percentageX = (x - cardRect.left) / cardWidth;
      const percentageY = (y - cardRect.top) / cardHeight;

      // Convert to values between -1 and 1, where 0 is center
      const tiltX = (percentageY * 2 - 1) * maxTilt; // Y position affects X rotation (vertical tilt)
      const tiltY = (percentageX * 2 - 1) * -maxTilt; // X position affects Y rotation (horizontal tilt)

      // Set the glare position based on cursor
      const glareX = percentageX * 100;
      const glareY = percentageY * 100;
      const glareOpacity = Math.max(percentageX, percentageY) * maxGlare;

      // Apply transform with perspective and both axis rotation
      card.style.transform = `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.03, 1.03, 1.03)`;

      // Update glare effect
      glare.style.transform = `translateX(${glareX}%) translateY(${glareY}%) scale(2)`;
      glare.style.opacity = `${glareOpacity}`;
    };

    const handleMouseMove = (e) => {
      if (!ticking) {
        ticking = true;
        animationFrame = requestAnimationFrame(() => {
          updateTransform(e.clientX, e.clientY);
          ticking = false;
        });
      }
    };

    const handleMouseLeave = () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      // Return to original position with a smooth transition
      card.style.transition = "transform 400ms ease-out";
      card.style.transform =
        "perspective(1500px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";

      // Hide glare
      glare.style.opacity = "0";

      // Remove transition after animation completes
      setTimeout(() => {
        if (card) card.style.transition = "";
      }, 400);
    };

    const handleMouseEnter = () => {
      // Remove transition property for smoother movement during hover
      card.style.transition = "";
    };

    // Add event listeners
    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
    card.addEventListener("mouseenter", handleMouseEnter);

    // Clean up event listeners
    return () => {
      if (card) {
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
        card.removeEventListener("mouseenter", handleMouseEnter);
      }
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  const handleEmailClick = () => {
    // Open a new window to Gmail compose with pre-filled email
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}`,
      "_blank"
    );
  };

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center">
      <div
        className="flex justify-center items-center px-5 sm:px-10 w-full"
        style={{ background: "transparent" }}
      >
        <div
          ref={cardRef}
          className="mail-card w-full sm:w-96 p-8 rounded-lg text-center will-change-transform cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            zIndex: 10,
            position: "relative",
            background: "rgba(10,10,20,0.3)",
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow:
              "0 25px 45px rgba(0,0,0,0.25), inset 0 0 1px rgba(255,255,255,0.3)",
            transformStyle: "preserve-3d",
            overflow: "hidden",
          }}
          onClick={handleEmailClick}
        >
          {/* Glare effect */}
          <div
            ref={glareRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "40%",
              height: "200%",
              transform: "translateX(0%) translateY(0%) scale(2)",
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%)",
              opacity: 0,
              pointerEvents: "none",
              transition: "opacity 400ms ease",
            }}
          />

          <h4
            className="text-4xl font-bold text-gray-200 mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-300 to-yellow-300"
            style={{ transform: "translateZ(60px)" }}
          >
            {t('contact.pageTitle')}
          </h4>

          <div
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-orange-500/30 to-yellow-500/30 flex items-center justify-center"
            style={{ transform: "translateZ(50px)" }}
          >
            <MailIcon
              size={36}
              className="text-orange-300"
              style={{ transform: "translateZ(10px)" }}
            />
          </div>

          <p
            className="text-gray-300 mb-6 text-lg"
            style={{ transform: "translateZ(40px)" }}
          >
            {t('contact.description')}
          </p>

          <p
            className="mail-email-address"
            style={{ transform: "translateZ(40px)" }}
          >
            {t('contact.emailAddress')}
          </p>
        </div>
      </div>

      {/* Privacy Note */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center">
        <div className="max-w-[22rem] relative">
          <p className="text-orange-200/70 text-sm text-center">
            {t('contact.responseMessage')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Mail;
