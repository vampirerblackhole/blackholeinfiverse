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
import Navbar from "./components/Navbar/Navbar";
import Mail from "./pages/Mail";
import LoaderBeforeSite from "./components/LoaderBeforeSite";
import StarsScene from "./components/Stars/StarsScene";
import ComingSoonPage from "./components/sections/StadiumSection/comingSoonGames/ComingSoonPage";
import CustomCursor from "./components/common/CustomCursor";

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

  // Track route changes
  const handleRouteChange = (pathname) => {
    // Only used for logging or future expansion
    console.debug("Route changed to:", pathname);
  };

  useEffect(() => {
    let progressInterval;

    const simulateProgress = () => {
      // Faster progress simulation
      progressInterval = setInterval(() => {
        setLoadProgress((prev) => {
          if (prev < 70) return prev + 3; // Speed up the progress
          clearInterval(progressInterval);
          return prev;
        });
      }, 10); // Faster interval
    };

    const windowLoaded = new Promise((resolve) => {
      if (document.readyState === "complete") {
        resolve();
      } else {
        window.addEventListener("load", resolve);
      }
    });

    const preloadAssets = async () => {
      const modelPaths = [
        "/model/blackhole.glb",
        "/model/Robot.glb",
        "/model/Game6.glb",
      ];

      try {
        // Concurrent loading with a short timeout
        const results = await Promise.allSettled(
          modelPaths.map((path) =>
            Promise.race([
              fetch(path, { priority: "high" }),
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Asset load timeout")), 3000)
              ),
            ]).then((res) => {
              if (!res.ok) throw new Error(`Failed to load ${path}`);
              return res;
            })
          )
        );

        const failedLoads = results.filter(
          (result) => result.status === "rejected"
        );
        if (failedLoads.length > 0) {
          console.warn("Some assets failed to load:", failedLoads);
        }

        return true;
      } catch (error) {
        console.error("Asset preloading error:", error);
        return false;
      }
    };

    // Start simulating progress while assets load
    simulateProgress();

    Promise.all([windowLoaded, preloadAssets()])
      .then(() => {
        // When assets are loaded, quickly progress to 100%
        clearInterval(progressInterval);

        // Quick acceleration to 100%
        progressInterval = setInterval(() => {
          setLoadProgress((prev) => {
            if (prev < 100) return prev + 5; // Much faster
            clearInterval(progressInterval);
            return 100;
          });
        }, 10); // Faster interval
      })
      .catch((error) => {
        console.error("Loading error:", error);
        // Force complete if there's an error
        setLoadProgress(100);
      });

    return () => {
      clearInterval(progressInterval);
      window.removeEventListener("load", () => {});
    };
  }, []);

  // Handle completion of loader
  const handleLoadingComplete = () => {
    setLoading(false);
    // Set page ready with slight delay to ensure smooth transition
    setTimeout(() => {
      setPageReady(true);
    }, 100);
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

        {/* Loader shown for all routes */}
        {loading && (
          <LoaderBeforeSite
            onLoadingComplete={handleLoadingComplete}
            progress={loadProgress}
          />
        )}

        {/* App content - use opacity for smoother transition */}
        <div
          className="transition-opacity duration-500 absolute inset-0"
          style={{
            opacity: pageReady ? 1 : 0,
            visibility: loading ? "hidden" : "visible",
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
              <Route path="/contact" element={<Mail />} />
              <Route path="/coming-soon" element={<ComingSoonPage />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </div>
  );
}

export default App;
