import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const NavLink = ({ href, children, mobile, onClick }) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`
        relative group nav-item-hover
        ${mobile ? 
          'text-xl text-white w-full text-center py-2 hover:bg-purple-500/10' : 
          'text-gray-300 tracking-wide'
        }
        hover:text-white transition-all duration-300
        transform hover:scale-105 hover:text-glow
      `}
    >
      <span className="relative z-10 font-medium">
        {children}
      </span>
      {!mobile && (
        <>
          <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></span>
          <span className="absolute inset-0 w-full h-full bg-purple-500/10 rounded-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></span>
        </>
      )}
    </a>
  );
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleMobileNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="w-full h-[65px] bg-transparent fixed top-0  transition-all duration-500" style={{zIndex:49}}>
        <div className="w-full h-full flex flex-row items-center justify-between m-auto px-4 md:px-10">  <a
          href="/"
          className="group relative overflow-hidden"
        >
          <span className="font-bold text-xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-300 to-gray-300 hover:to-purple-400 transition-all duration-500 hover:text-glow transform hover:scale-15">
            Blackhole Infiverse
          </span>
          <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
        </a>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          {isMobileMenuOpen ? (
            <button
              className="text-white hover:text-purple-400 transition-colors duration-300 transform hover:scale-110"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} className="transform transition-transform duration-300 rotate-90 hover:rotate-180" />
            </button>
          ) : (
            <button
              className="text-white hover:text-purple-400 transition-colors duration-300 transform hover:scale-110"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} className="transform transition-transform duration-300 hover:rotate-180" />
            </button>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-2xl" style={{marginRight:"100px",gap:"70px"}}>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`
            fixed md:hidden top-[65px] right-0 w-full h-[calc(100vh-65px)]
            bg-black/95 backdrop-blur-sm
            transform transition-all duration-500 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}
          `}
        >
          <div className="flex flex-col items-center py-4 space-y-4" >
            <NavLink href="/about" mobile={true} onClick={handleMobileNavClick} >About</NavLink>
            <NavLink href="/contact" mobile={true} onClick={handleMobileNavClick}>Contact</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;