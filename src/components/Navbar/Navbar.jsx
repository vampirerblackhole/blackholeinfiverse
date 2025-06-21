import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import PropTypes from "prop-types";
import { useTranslation } from "../../hooks/useTranslation";
import LanguageSelector from "../LanguageSelector";

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
        className="cursor-attract-button block w-full py-4 px-4 text-xl font-medium text-white hover:bg-orange-600 transition-colors"
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
      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></span>
      <span className="absolute inset-0 w-full h-full bg-orange-500/10 rounded-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></span>
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
  const { t, isRTL } = useTranslation();

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
              className={`font-bold text-xl md:text-2xl lg:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-300 to-gray-300 hover:to-orange-400 transition-all duration-500 hover:text-glow transform hover:scale-105 ${
                scrolled ? "py-2" : "py-3"
              }`}
            >
              {t('navigation.brandName')}
            </span>
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
          </a>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="p-2 rounded-full bg-orange-600/40 text-white hover:bg-orange-500/60 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            <NavLink href="/about">{t('navigation.about')}</NavLink>
            <NavLink href="/whyus">{t('navigation.whyUs')}</NavLink>
            <NavLink href="/contact">{t('navigation.letsTalk')}</NavLink>
            <LanguageSelector variant="compact" className="ml-4" position="bottom-right" />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black z-[999] overflow-y-auto"
          style={{
            paddingTop: scrolled ? "70px" : "90px",
          }}
        >
          <div className="px-6 py-6">
            <div className="space-y-1 mb-8">
              <NavLink href="/" mobile={true} onClick={handleMobileNavClick}>
                {t('navigation.home')}
              </NavLink>
              <NavLink
                href="/about"
                mobile={true}
                onClick={handleMobileNavClick}
              >
                {t('navigation.about')}
              </NavLink>
              <NavLink
                href="/whyus"
                mobile={true}
                onClick={handleMobileNavClick}
              >
                {t('navigation.whyUs')}
              </NavLink>
              <NavLink
                href="/contact"
                mobile={true}
                onClick={handleMobileNavClick}
              >
                {t('navigation.letsTalk')}
              </NavLink>
            </div>

            {/* Mobile Language Selector */}
            <div className="mb-8">
              <LanguageSelector variant="mobile" />
            </div>

            <div
              className="mt-8 pt-6"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <h3 className="text-xl font-bold text-white mb-4">Featured</h3>
              <div className="relative rounded-lg overflow-hidden">
                <a
                  href={FEATURED_CONFIG.link}
                  onClick={handleMobileNavClick}
                  className="block"
                >
                  <img
                    src={FEATURED_CONFIG.imagePath}
                    alt={FEATURED_CONFIG.imageAlt}
                    className="w-full h-48 object-cover"
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
                    className="absolute bottom-0 left-0 right-0 p-4"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))",
                    }}
                  >
                    <h4 className="text-xl font-bold text-white">
                      {FEATURED_CONFIG.title}
                    </h4>
                    <p className="text-orange-200">
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
