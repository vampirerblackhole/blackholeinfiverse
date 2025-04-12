import { lazy, Suspense, useState, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import About from "./About/About";
import "./App.css";
import Navbar from "./Navbar/Navbar";
import Contact from "./component/Contact";
import LoadingAnimation from "./component/LoaderBeforeSite";
import StarsScene from "./component/Stars/StarsScene";

const Website = lazy(() => import("./Main/Website"));

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create a promise that resolves when the window load event fires
    const windowLoaded = new Promise((resolve) => {
      if (document.readyState === "complete") {
        resolve();
      } else {
        window.addEventListener("load", resolve);
      }
    });

    // Create a promise that resolves after preloading critical 3D models
    const preloadAssets = async () => {
      const modelPaths = [
        "/model/blackhole.glb",
        "/model/Robot.glb",
        "/model/Game6.glb",
      ];

      try {
        // Preload 3D models and track loading status
        const results = await Promise.allSettled(
          modelPaths.map((path) =>
            fetch(path).then((res) => {
              if (!res.ok) throw new Error(`Failed to load ${path}`);
              return res;
            })
          )
        );

        // Check if any critical assets failed to load
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

    // Wait for both window load and assets to be ready
    Promise.all([windowLoaded, preloadAssets()])
      .then(() => {
        // Add a small delay to ensure smooth transition
        setTimeout(() => setLoading(false), 1000);
      })
      .catch((error) => {
        console.error("Loading error:", error);
        // Fallback: show site anyway after timeout
        setTimeout(() => setLoading(false), 5000);
      });

    return () => {
      window.removeEventListener("load", () => {});
    };
  }, []);

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "black" }}>
      <Router>
        {loading ? (
          <LoadingAnimation onLoadingComplete={() => setLoading(false)} />
        ) : (
          <>
            <StarsScene />
            <Navbar />
            <Suspense fallback={<LoadingAnimation />}>
              <Routes>
                <Route path="/" element={<Website />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Suspense>
          </>
        )}
      </Router>
    </div>
  );
}

export default App;
