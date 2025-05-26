import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

class AnimationManager {
  constructor() {
    this.isInitialized = false;
    this.initializationCallbacks = [];
    this.animationTimelines = new Map();
    this.scrollTriggers = [];
    this.retryAttempts = 0;
    this.maxRetries = 3;
  }

  // Add callback for when animations are initialized
  onInitialized(callback) {
    if (this.isInitialized) {
      callback();
    } else {
      this.initializationCallbacks.push(callback);
    }
    
    return () => {
      const index = this.initializationCallbacks.indexOf(callback);
      if (index > -1) this.initializationCallbacks.splice(index, 1);
    };
  }

  // Initialize all animations after assets are loaded
  async initializeAnimations() {
    if (this.isInitialized) {
      console.log('Animations already initialized');
      return;
    }

    console.log('Initializing animations...');

    try {
      // Wait for DOM to be ready
      await this.waitForDOM();
      
      // Ensure scroll position is at top
      window.scrollTo(0, 0);
      
      // Small delay to ensure everything is rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Refresh ScrollTrigger to recalculate positions
      ScrollTrigger.refresh();
      
      // Initialize specific animations
      this.initializeRobotAnimations();
      this.initializeTextAnimations();
      this.initializeFadeAnimations();
      
      // Mark as initialized
      this.isInitialized = true;
      
      // Call all initialization callbacks
      this.initializationCallbacks.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('Animation initialization callback error:', error);
        }
      });
      
      console.log('Animations initialized successfully');
      
    } catch (error) {
      console.error('Animation initialization failed:', error);
      
      // Retry logic
      if (this.retryAttempts < this.maxRetries) {
        this.retryAttempts++;
        console.log(`Retrying animation initialization (${this.retryAttempts}/${this.maxRetries})`);
        setTimeout(() => this.initializeAnimations(), 1000);
      } else {
        console.error('Max animation initialization retries reached');
      }
    }
  }

  // Wait for DOM elements to be available
  async waitForDOM() {
    const maxWait = 5000; // 5 seconds max wait
    const checkInterval = 100; // Check every 100ms
    let waited = 0;

    return new Promise((resolve) => {
      const checkDOM = () => {
        const robotSection = document.querySelector('.canvas-container');
        const loopElement = document.querySelector('#loop');
        
        if (robotSection && loopElement) {
          resolve();
        } else if (waited >= maxWait) {
          console.warn('DOM elements not found within timeout, proceeding anyway');
          resolve();
        } else {
          waited += checkInterval;
          setTimeout(checkDOM, checkInterval);
        }
      };
      
      checkDOM();
    });
  }

  // Initialize robot section animations
  initializeRobotAnimations() {
    try {
      // Animate the "UNLEASHING" text loop
      const loopElement = document.querySelector('#loop');
      if (loopElement) {
        gsap.to(loopElement, {
          y: -1000,
          scrollTrigger: {
            trigger: ".canvas-container",
            start: "90% 10%",
            end: "200% bottom",
            scrub: 1,
            refreshPriority: 1,
          },
        });
        console.log('Robot loop animation initialized');
      }

      // Initialize fade-in animations for robot content
      this.initializeRobotFadeAnimations();
      
    } catch (error) {
      console.error('Robot animation initialization failed:', error);
    }
  }

  // Initialize robot fade animations
  initializeRobotFadeAnimations() {
    // Fade in animations for robot sections
    gsap.utils.toArray(".fade-in").forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
            scrub: false,
            refreshPriority: 1,
          },
        }
      );
    });

    // Specifically target paragraphs
    gsap.utils.toArray(".para").forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
            scrub: false,
            refreshPriority: 1,
          },
        }
      );
    });

    // Section visibility animations
    gsap.to(".s-para2, .s-para3, .section2", {
      opacity: 1,
      scrollTrigger: {
        trigger: ".s-para2",
        start: "top 50%",
        end: "top 20%",
        scrub: 0,
        refreshPriority: 1,
        onEnter: () => {
          gsap.to(".s-para2, .s-para3, .section2", { opacity: 1 });
          gsap.to(".para", { opacity: 1 });
        },
        onLeave: () => {
          gsap.to(".s-para2, .s-para3, .section2", { opacity: 1 });
          gsap.to(".para", { opacity: 1 });
        },
      },
    });
  }

  // Initialize text animations
  initializeTextAnimations() {
    try {
      // Initialize any text-based animations here
      console.log('Text animations initialized');
    } catch (error) {
      console.error('Text animation initialization failed:', error);
    }
  }

  // Initialize general fade animations
  initializeFadeAnimations() {
    try {
      // General fade-in animations for any elements with fade-in class
      gsap.utils.toArray(".animate-fade-in").forEach((el, index) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: index * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
              refreshPriority: 1,
            },
          }
        );
      });
      
      console.log('Fade animations initialized');
    } catch (error) {
      console.error('Fade animation initialization failed:', error);
    }
  }

  // Force refresh all ScrollTrigger instances
  refreshScrollTrigger() {
    try {
      ScrollTrigger.refresh();
      console.log('ScrollTrigger refreshed');
    } catch (error) {
      console.error('ScrollTrigger refresh failed:', error);
    }
  }

  // Kill all animations and ScrollTriggers
  killAll() {
    try {
      ScrollTrigger.killAll();
      this.animationTimelines.forEach(timeline => timeline.kill());
      this.animationTimelines.clear();
      this.scrollTriggers = [];
      this.isInitialized = false;
      console.log('All animations killed');
    } catch (error) {
      console.error('Failed to kill animations:', error);
    }
  }

  // Reset and reinitialize
  async reset() {
    this.killAll();
    this.retryAttempts = 0;
    await this.initializeAnimations();
  }

  // Get initialization status
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      retryAttempts: this.retryAttempts,
      maxRetries: this.maxRetries,
    };
  }
}

// Create singleton instance
export const animationManager = new AnimationManager();
export default AnimationManager;
