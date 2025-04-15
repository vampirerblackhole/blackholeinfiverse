import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import PropTypes from "prop-types";

// Create a dummy smoother object for compatibility
export const smoother = {
  paused: (state) => {
    console.log("Smoother paused state:", state);
    // This is a placeholder for the actual smoother functionality
    return state;
  },
};

// Featured content configuration - EDIT THESE VALUES TO UPDATE THE FEATURED SECTION
const FEATURED_CONFIG = {
  imagePath: "/vr-table-tennis.jpg", // Put your image in the public folder
  imageAlt: "VR Table Tennis",
  title: "VR Table Tennis",
  description: "Immersive Gaming Experience",
  link: "https://www.meta.com/experiences/9250693884966271/", // Add the URL you want to link to here
};

const NavLink = ({ href, children, mobile = false, onClick = () => {} }) => {
  if (mobile) {
    return (
      <a
        href={href}
        onClick={onClick}
        className="cursor-attract-button block w-full py-4 px-4 text-xl font-medium text-white hover:bg-purple-600 transition-colors"
      >
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      className="cursor-attract relative group nav-item-hover text-gray-300 tracking-wide hover:text-white transition-all duration-300"
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></span>
      <span className="absolute inset-0 w-full h-full bg-purple-500/10 rounded-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></span>
    </a>
  );
};

NavLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  mobile: PropTypes.bool,
  onClick: PropTypes.func,
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll events to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleMobileNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav
        className={`w-full fixed top-0 transition-all duration-500 ${
          scrolled ? "h-[70px] shadow-lg" : "h-[90px]"
        }`}
        style={{
          zIndex: 1000,
          background: scrolled ? "rgba(10,10,20,0.8)" : "rgba(0,0,0,0.4)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <div className="w-full h-full flex flex-row items-center justify-between m-auto px-6 md:px-10">
          <a
            href="/"
            className="cursor-attract-text group relative overflow-hidden"
          >
            <span
              className={`font-bold text-xl md:text-2xl lg:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-300 to-gray-300 hover:to-purple-400 transition-all duration-500 hover:text-glow transform hover:scale-105 ${
                scrolled ? "py-2" : "py-3"
              }`}
            >
              Blackhole Infiverse
            </span>
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
          </a>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="p-2 rounded-full bg-purple-900/30 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Simple Version */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#000",
            zIndex: 1001,
            paddingTop: "90px",
            paddingBottom: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: "24px" }}>
            <div
              style={{
                marginBottom: "40px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                Menu
              </h2>
              <button
                onClick={handleMobileNavClick}
                style={{
                  background: "rgba(139, 92, 246, 0.3)",
                  padding: "8px",
                  borderRadius: "50%",
                }}
              >
                <X size={24} color="white" />
              </button>
            </div>

            <div>
              <NavLink href="/" mobile={true} onClick={handleMobileNavClick}>
                Home
              </NavLink>
              <NavLink
                href="/about"
                mobile={true}
                onClick={handleMobileNavClick}
              >
                About
              </NavLink>
              <NavLink
                href="/contact"
                mobile={true}
                onClick={handleMobileNavClick}
              >
                Contact
              </NavLink>
            </div>

            <div
              style={{
                marginTop: "40px",
                paddingTop: "20px",
                borderTop: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: "16px",
                }}
              >
                Featured
              </h3>
              <div
                style={{
                  position: "relative",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <a
                  href={FEATURED_CONFIG.link}
                  onClick={handleMobileNavClick}
                  style={{
                    display: "block",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <img
                    src={FEATURED_CONFIG.imagePath}
                    alt={FEATURED_CONFIG.imageAlt}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.style.height = "180px";
                      e.target.style.background = "#111";
                      e.target.style.display = "flex";
                      e.target.style.alignItems = "center";
                      e.target.style.justifyContent = "center";
                      e.target.src = "";
                      e.target.alt = FEATURED_CONFIG.imageAlt;
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "16px",
                      background:
                        "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      {FEATURED_CONFIG.title}
                    </h4>
                    <p style={{ color: "#d8b4fe" }}>
                      {FEATURED_CONFIG.description}
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
