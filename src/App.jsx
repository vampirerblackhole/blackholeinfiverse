import { useState, Suspense, lazy } from "react";
import "./App.css";
import About from "./About/About"; // Eagerly load About
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar/Navbar"; // Import the Navbar component
import LoadingAnimation from "./component/LoadingAnimation";
import Contact from "./component/Contact/Contact";
import BlackholeContainer from "./component/Blackhole/BlackholeContainer";

const Website = lazy(() => import("./Main/Website")); // Lazy load Website

function App() {
  const [loadingWebsite, setLoadingWebsite] = useState(true);

  return (
    <div className="relative min-h-screen bg-black">
      <Router>
        {/* BlackholeContainer with stars as background for all pages */}
        <BlackholeContainer />
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              loadingWebsite ? (
                <LoadingAnimation
                  onLoadingComplete={() => setLoadingWebsite(false)}
                />
              ) : (
                <Suspense fallback={<div className="min-h-screen bg-black" />}>
                  <Website />
                </Suspense>
              )
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
