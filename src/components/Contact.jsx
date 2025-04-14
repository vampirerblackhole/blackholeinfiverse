import { Lock } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

const Contact = () => {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    message: "",
    number: "",
  });

  // Card tilt effect
  useEffect(() => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;

    // Values for the tilt effect
    const maxTilt = 25; // Increased from 15 to 25 for more movement
    const maxGlare = 0.3; // Reduced from 0.6 to 0.3 (50% less intense)
    const perspective = 1500; // Perspective value for 3D effect
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message, number } = contactData;

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: "796a812d-8e22-41bc-b79d-17e780629030", // Replace with your Web3Forms API key
          name,
          email,
          message,
          number,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Message sent successfully!", { autoClose: 3000 });
        setContactData({ name: "", email: "", message: "", number: "" }); // Reset form
      } else {
        toast.error("Failed to send message. Please try again.", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.", {
        autoClose: 3000,
        error,
      });
    }
  };

  const inputStyle =
    "transition duration-300 hover:scale-105 hover:opacity-90 w-full p-3 bg-gray-900/80 text-white rounded-lg border border-purple-500/30 focus:outline-none focus:border-purple-400/60 focus:ring-1 focus:ring-purple-400/40";

  return (
    <div className="relative z-10">
      <div
        className="flex justify-center items-center px-5 sm:px-10"
        style={{ background: "transparent" }}
      >
        <div
          ref={cardRef}
          className="contact-card-form w-full sm:w-96 mt-[10rem] p-6 rounded-lg text-center will-change-transform"
          style={{
            zIndex: 1000,
            position: "relative",
            background: "rgba(10,10,20,0.25)",
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow:
              "0 25px 45px rgba(0,0,0,0.25), inset 0 0 1px rgba(255,255,255,0.3)",
            transformStyle: "preserve-3d",
            overflow: "hidden",
          }}
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
            className="text-4xl font-bold text-gray-200 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300"
            style={{ transform: "translateZ(60px)" }}
          >
            Contact Us
          </h4>

          <form
            onSubmit={handleOnSubmit}
            style={{ transform: "translateZ(30px)" }}
          >
            <input
              required
              className={`${inputStyle} mt-10`}
              type="text"
              name="name"
              placeholder="Your Name"
              value={contactData.name}
              onChange={handleChange}
              style={{ transform: "translateZ(40px)" }}
            />

            <input
              required
              className={`${inputStyle} mt-4`}
              type="email"
              name="email"
              placeholder="Your Email"
              value={contactData.email}
              onChange={handleChange}
              style={{ transform: "translateZ(40px)" }}
            />

            <input
              required
              className={`${inputStyle} mt-4`}
              type="tel"
              name="number"
              placeholder="Your Contact Number"
              value={contactData.number}
              onChange={handleChange}
              style={{ transform: "translateZ(40px)" }}
            />

            <textarea
              className={`${inputStyle} min-h-[8rem] max-h-[16rem] mt-4`}
              name="message"
              placeholder="Your Message"
              rows="4"
              value={contactData.message}
              onChange={handleChange}
              style={{ transform: "translateZ(40px)" }}
            />

            <button
              type="submit"
              className="duration-300 hover:scale-105 w-full p-3 mt-4 text-gray-200 rounded-full transition-all bg-gradient-to-r from-purple-600/80 to-blue-500/80 hover:from-purple-500/90 hover:to-blue-400/90 border border-white/10"
              style={{ transform: "translateZ(50px)" }}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      {/* Privacy Policy */}
      <div className="mt-2 flex justify-center">
        <div className="max-w-[22rem] relative">
          <p className="text-purple-200/70 pl-6 relative text-sm">
            <Lock
              color="#d8b4fe"
              size={16}
              className="absolute left-0 top-1/2 transform -translate-y-1/2"
            />
            We value your privacy and will not share your information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
