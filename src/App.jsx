import { lazy, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import About from "./About/About"; // Eagerly load About
import "./App.css";
import Navbar from "./Navbar/Navbar"; // Import the Navbar component
import Contact from "./component/Contact/Contact";
import LoadingAnimation from "./component/LoadingAnimation";

const Website = lazy(() => import("./Main/Website")); // Lazy load Website

function App() {
  const [loadingWebsite, setLoadingWebsite] = useState(true);

  return (
    <div
      className="relative min-h-screen"
      style={{ backgroundColor: "black" }} // Pure black for maximum star contrast
    >
      {/* Removed StarsScene component */}

      <Router>
        {/* Blackhole only on homepage - now inside Router for proper navigation */}

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
                <Website />
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
