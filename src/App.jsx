import { lazy, Suspense, useState, useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import PropTypes from "prop-types";
import About from "./pages/About";
import "./App.css";
import "./styles/rtl.css";
import Navbar from "./components/Navbar/Navbar";
import Mail from "./pages/Mail";
import WhyUs from "./pages/WhyUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import LoaderBeforeSite from "./components/LoaderBeforeSite";
import StarsScene from "./components/Stars/StarsScene";
import ComingSoonPage from "./components/sections/StadiumSection/comingSoonGames/ComingSoonPage";
import CustomCursor from "./components/common/CustomCursor";
import { assetLoadingManager } from "./utils/AssetLoadingManager";
import { animationManager } from "./utils/AnimationManager";
import { firebasePerformanceMonitor } from "./utils/FirebasePerformanceMonitor";

// Add a loading fallback
const PageLoadingFallback = () => (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40">
    <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Route observer to handle contact page special case
const RouteObserver = ({ onRouteChange }) => {
  const location = useLocation();

  useEffect(() => {
    if (onRouteChange) {
      onRouteChange(location.pathname);
    }
  }, [location, onRouteChange]);

  return null;
};

RouteObserver.propTypes = {
  onRouteChange: PropTypes.func,
};

// Lazy load Website component with a custom loading delay
const Website = lazy(() =>
  Promise.all([
    import("./components/Main/Website"),
    new Promise((resolve) => setTimeout(resolve, 100)), // Reduced loading time
  ]).then(([moduleExport]) => moduleExport)
);

function App() {
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [pageReady, setPageReady] = useState(false);
  const [cursorReady, setCursorReady] = useState(false);

  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Track route changes and determine if we need complex animations
  const [currentRoute, setCurrentRoute] = useState("/");
  const [isHomePage, setIsHomePage] = useState(true);

  const handleRouteChange = (pathname) => {
    console.debug("Route changed to:", pathname);
    const wasHomePage = isHomePage;
    const newIsHomePage = pathname === "/" || pathname === "";

    setCurrentRoute(pathname);
    setIsHomePage(newIsHomePage);

    // If this is not the initial load and we're changing routes
    if (initialLoadComplete && pathname !== currentRoute) {
      // For subsequent navigation, show content immediately for non-homepage
      if (!newIsHomePage) {
        setPageReady(true);
        setLoading(false);
      } else if (!wasHomePage && newIsHomePage) {
        // Going back to homepage from another page
        setPageReady(false);
        setLoading(true);
        // Trigger a quick reload for homepage
        setTimeout(() => {
          setLoading(false);
          setPageReady(true);
        }, 500);
      }
    }
  };

  useEffect(() => {
    let progressInterval;
    let progressCleanup;
    let completionCleanup;
    let errorCleanup;

    const initializeApp = async () => {
      try {
        // Skip asset loading for non-homepage routes on initial load
        if (!isHomePage) {
          setLoadProgress(100);
          return;
        }

        // Set up asset loading progress tracking
        progressCleanup = assetLoadingManager.onProgress((progress) => {
          setLoadProgress(Math.min(progress, 95)); // Keep some room for final steps
        });

        // Set up asset loading completion tracking
        completionCleanup = assetLoadingManager.onComplete(() => {
          // Complete the progress bar
          setLoadProgress(100);
        });

        // Set up error handling
        errorCleanup = assetLoadingManager.onError(() => {
          // Continue anyway - don't block the app for individual asset failures
        });

        // Wait for window to be loaded
        const windowLoaded = new Promise((resolve) => {
          if (document.readyState === "complete") {
            resolve();
          } else {
            window.addEventListener("load", resolve);
          }
        });

        // Start progress simulation while waiting for window load
        progressInterval = setInterval(() => {
          setLoadProgress((prev) => {
            if (prev < 30) return prev + 2; // Slow initial progress
            clearInterval(progressInterval);
            return prev;
          });
        }, 50);

        // Wait for window to be ready
        await windowLoaded;
        clearInterval(progressInterval);

        // Start asset preloading

        await assetLoadingManager.preloadCriticalAssets();

        // If assets didn't trigger completion (e.g., all cached), force completion
        if (!assetLoadingManager.isComplete()) {
          setTimeout(() => {
            setLoadProgress(100);
          }, 1000);
        }

        // Firebase-aware safety timeout
        const isFirebaseHosted =
          window.location.hostname.includes("firebaseapp.com") ||
          window.location.hostname.includes("web.app") ||
          window.location.hostname.includes("firebase.com");

        const maxLoadingTime = isFirebaseHosted ? 25000 : 15000; // Extra time for Firebase CDN

        setTimeout(() => {
          if (loadProgress < 100) {
            console.log("Force completing loading due to timeout");
            setLoadProgress(100);
          }
        }, maxLoadingTime);
      } catch {
        // Force completion on error to prevent infinite loading
        setLoadProgress(100);
      }
    };

    initializeApp();

    return () => {
      clearInterval(progressInterval);
      progressCleanup?.();
      completionCleanup?.();
      errorCleanup?.();
    };
  }, []);

  // Handle completion of loader
  const handleLoadingComplete = async () => {
    setLoading(false);
    setInitialLoadComplete(true);

    try {
      // Only initialize complex animations for homepage
      if (isHomePage) {
        const animationStart = performance.now();
        await animationManager.initializeAnimations();
        const animationDuration = performance.now() - animationStart;

        firebasePerformanceMonitor.logAnimationInit(animationDuration);

        // Minimal delay for homepage
        setTimeout(() => {
          setPageReady(true);
          firebasePerformanceMonitor.logLoadComplete();
        }, 50);
      } else {
        // For other pages, show content immediately
        setPageReady(true);
        firebasePerformanceMonitor.logLoadComplete();
      }
    } catch (error) {
      // Always show the page even if something fails
      firebasePerformanceMonitor.logError(error, "handleLoadingComplete");
      setPageReady(true);
    }
  };

  // Add cursor ready effect
  useEffect(() => {
    // Slight delay to ensure DOM is loaded
    const cursorTimer = setTimeout(() => {
      setCursorReady(true);
    }, 1000);

    return () => clearTimeout(cursorTimer);
  }, []);

  return (
    <div className="relative min-h-screen bg-black">
      <Router>
        <RouteObserver onRouteChange={handleRouteChange} />

        {/* Custom Cursor - only render when page is ready */}
        {cursorReady && <CustomCursor />}

        {/* Loader shown only for initial load or when explicitly loading */}
        {loading && (
          <LoaderBeforeSite
            onLoadingComplete={handleLoadingComplete}
            progress={loadProgress}
          />
        )}

        {/* App content - use opacity for smoother transition */}
        <div
          className="transition-opacity duration-300 absolute inset-0"
          style={{
            opacity: pageReady ? 1 : 0,
            visibility: loading ? "hidden" : "visible",
            pointerEvents: pageReady ? "auto" : "none",
          }}
        >
          {/* Stars backdrop */}
          <StarsScene />

          {/* Navigation */}
          <Navbar />

          {/* Page content */}
          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
              <Route path="/" element={<Website />} />
              <Route path="/about" element={<About />} />
              <Route path="/whyus" element={<WhyUs />} />
              <Route path="/contact" element={<Mail />} />
              <Route path="/coming-soon" element={<ComingSoonPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </div>
  );
}

export default App;
