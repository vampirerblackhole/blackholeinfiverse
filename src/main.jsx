import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n"; // Initialize i18n before app
import App from "./App.jsx";
import { initFirebaseOptimizations } from "../firebase.js";

// Initialize Firebase optimizations
initFirebaseOptimizations();

// Create a function to handle initial rendering
const renderApp = () => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

// Check if the document is already loaded
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  // Document is already ready, render immediately
  renderApp();
} else {
  // Wait for the document to be ready
  document.addEventListener("DOMContentLoaded", renderApp);
}
