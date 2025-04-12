import { lazy, Suspense, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import About from "./About/About";
import "./App.css";
import Navbar from "./Navbar/Navbar";
import Contact from "./component/Contact";
import LoadingAnimation from "./component/LoaderBeforeSite";
import StarsScene from "./component/Stars/StarsScene";

const Website = lazy(() => import("./Main/Website"));

function App() {
  const [loadingWebsite, setLoadingWebsite] = useState(true);

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "black" }}>
      <Router>
        <StarsScene />
        <Navbar />
        <Suspense fallback={<LoadingAnimation />}>
          <Routes>
            <Route
              path="/"
              element={
                loadingWebsite ? (
                  <LoadingAnimation
                    onLoadingComplete={() => setLoadingWebsite(false)}
                  />
                ) : (
                  <Website />
                )
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
