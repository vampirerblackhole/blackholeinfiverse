import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PortalExp from './PortalExp';

function Main3() {
  // Fade out effect for the '.Game' container after animation finishes
  const [scrollPosition, setScrollPosition] = useState(0);

  // Handle scroll event to track scroll position
  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setScrollPosition(scrollTop);
  };

  useEffect(() => {
    // Attach scroll event listener
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Cleanup listener
  }, []);

  return (
    <div className="container">
   

      <div
        className="ai-container"
        style={{opacity:1}}
      >
      <div
          className="ai"
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '100vw',
            zIndex: 10, // Keep the 3D model on top but ensure sections aren't hidden behind it
          }}
        >
            <PortalExp/>
        </div>

     

        <div className="section section4" style={{ zIndex: 20 }}>
          <h1>Hello from Section 4</h1>
          <p>This is some background content for section 4.</p>
        </div>

      </div>
    </div>
  );
}

export default Main3;
