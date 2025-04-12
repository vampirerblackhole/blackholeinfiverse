import { lazy, Suspense, useState, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import About from "./About/About";
import "./App.css";
import Navbar from "./Navbar/Navbar";
import Contact from "./component/Contact";
import LoaderBeforeSite from "./component/LoaderBeforeSite";
import StarsScene from "./component/Stars/StarsScene";

// Lazy load Website component with a custom loading delay
const Website = lazy(() =>
  Promise.all([
    import("./Main/Website"),
    new Promise((resolve) => setTimeout(resolve, 500)), // Minimum loading time
  ]).then(([moduleExport]) => moduleExport)
);

function App() {
  const [loading, setLoading] = useState(true);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
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
        const results = await Promise.allSettled(
          modelPaths.map((path) =>
            fetch(path, { priority: "high" }).then((res) => {
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

    Promise.all([windowLoaded, preloadAssets()])
      .then(() => {
        setAssetsLoaded(true);
      })
      .catch((error) => {
        console.error("Loading error:", error);
        setAssetsLoaded(true);
      });

    return () => {
      window.removeEventListener("load", () => {});
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black">
      <Router>
        {loading ? (
          <LoaderBeforeSite
            onLoadingComplete={() => assetsLoaded && setLoading(false)}
            progress={assetsLoaded ? 100 : 0}
          />
        ) : (
          <>
            <StarsScene />
            <Navbar />
            <Suspense>
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
