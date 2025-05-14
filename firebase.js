// Firebase configuration helper
// This file helps with Firebase-specific optimizations

// Function to detect if the app is running on Firebase hosting
export const isRunningOnFirebase = () => {
  if (typeof window === "undefined") return false;

  // Check if we're running on a Firebase hosting URL
  const hostname = window.location.hostname;
  return (
    hostname.includes("firebaseapp.com") ||
    hostname.includes("web.app") ||
    hostname === "blackhole-5b069.web.app" ||
    hostname === "blackhole-5b069.firebaseapp.com"
  );
};

// Function to preload critical assets with higher priority
export const preloadCriticalAssets = async () => {
  const criticalAssets = [
    "/model/Vr.glb",
    "/model/blackhole.glb",
    "/model/Robot.glb",
    "/model/Game6.glb",
    "/draco-gltf/draco_decoder.js",
    "/draco-gltf/draco_decoder.wasm",
    "/draco-gltf/draco_wasm_wrapper.js",
  ];

  try {
    // Use Promise.allSettled to handle all preloads without failing if one fails
    const results = await Promise.allSettled(
      criticalAssets.map((path) =>
        fetch(path, {
          priority: "high",
          cache: "force-cache",
          mode: "no-cors", // Allow cross-origin requests without CORS
        })
      )
    );

    // Log results for debugging
    const failedLoads = results.filter(
      (result) => result.status === "rejected"
    );
    if (failedLoads.length > 0) {
      console.warn("Some critical assets failed to preload:", failedLoads);
    }

    return true;
  } catch (error) {
    console.error("Error preloading critical assets:", error);
    return false;
  }
};

// Function to optimize scroll performance
export const optimizeScrollPerformance = () => {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  // Add passive event listeners for better scroll performance
  document.addEventListener("touchstart", function () {}, { passive: true });
  document.addEventListener("touchmove", function () {}, { passive: true });

  // Optimize rendering for scroll events
  let scrollTimeout;
  const scrollHandler = () => {
    document.body.classList.add("is-scrolling");
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      document.body.classList.remove("is-scrolling");
    }, 200);
  };

  window.addEventListener("scroll", scrollHandler, { passive: true });

  // Add CSS to optimize rendering during scroll
  const style = document.createElement("style");
  style.textContent = `
    .is-scrolling canvas {
      will-change: transform;
    }
  `;
  document.head.appendChild(style);
};

// Function to fix Firebase-specific issues
export const applyFirebaseFixes = () => {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (!isRunningOnFirebase()) return;

  // Force scroll to top on page load
  window.scrollTo(0, 0);

  // Add meta tags to prevent caching issues
  const meta = document.createElement("meta");
  meta.setAttribute("http-equiv", "Cache-Control");
  meta.setAttribute("content", "no-cache, no-store, must-revalidate");
  document.head.appendChild(meta);

  // Add viewport meta tag to ensure proper scaling
  const viewportMeta = document.createElement("meta");
  viewportMeta.setAttribute("name", "viewport");
  viewportMeta.setAttribute(
    "content",
    "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
  );
  document.head.appendChild(viewportMeta);

  // Add a special handler for Firebase to ensure proper initialization
  window.addEventListener("load", () => {
    // Force scroll to top again after load
    window.scrollTo(0, 0);
  });
};

// Initialize all Firebase optimizations
export const initFirebaseOptimizations = () => {
  try {
    // Run optimizations in a safe way
    preloadCriticalAssets().catch((err) =>
      console.warn("Asset preloading error:", err)
    );

    // Delay scroll performance optimizations to ensure DOM is ready
    setTimeout(() => {
      try {
        optimizeScrollPerformance();
      } catch (error) {
        console.warn("Error optimizing scroll performance:", error);
      }
    }, 100);

    // Apply Firebase-specific fixes
    try {
      applyFirebaseFixes();
    } catch (error) {
      console.warn("Error applying Firebase fixes:", error);
    }
  } catch (error) {
    console.warn("Error initializing Firebase optimizations:", error);
    // Continue anyway - don't break the app if optimizations fail
  }
};
