import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { firebasePerformanceMonitor } from "./FirebasePerformanceMonitor.js";

class AssetLoadingManager {
  constructor() {
    this.loadingManager = new THREE.LoadingManager();
    this.gltfLoader = new GLTFLoader(this.loadingManager);
    this.dracoLoader = new DRACOLoader();
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);

    // Configure Draco loader
    this.dracoLoader.setDecoderPath("/draco-gltf/");
    this.gltfLoader.setDRACOLoader(this.dracoLoader);

    // Asset cache
    this.loadedAssets = new Map();
    this.loadingPromises = new Map();

    // Progress tracking
    this.totalAssets = 0;
    this.loadedCount = 0;
    this.progressCallbacks = [];
    this.completionCallbacks = [];
    this.errorCallbacks = [];

    // Firebase-specific optimizations
    this.connectionType = this.detectConnectionType();
    this.isFirebaseHosted = this.detectFirebaseHosting();
    this.adaptiveTimeouts = this.calculateAdaptiveTimeouts();

    this.setupLoadingManager();
  }

  // Detect connection type for adaptive loading
  detectConnectionType() {
    if (navigator.connection) {
      const connection = navigator.connection;
      return {
        effectiveType: connection.effectiveType || "4g",
        downlink: connection.downlink || 10,
        rtt: connection.rtt || 100,
        saveData: connection.saveData || false,
      };
    }
    return { effectiveType: "4g", downlink: 10, rtt: 100, saveData: false };
  }

  // Detect if running on Firebase hosting
  detectFirebaseHosting() {
    const hostname = window.location.hostname;
    return (
      hostname.includes("firebaseapp.com") ||
      hostname.includes("web.app") ||
      hostname.includes("firebase.com")
    );
  }

  // Calculate adaptive timeouts based on connection and hosting
  calculateAdaptiveTimeouts() {
    const baseTimeout = this.isFirebaseHosted ? 20000 : 15000; // Extra time for Firebase
    const connectionMultiplier = {
      "slow-2g": 3,
      "2g": 2.5,
      "3g": 1.5,
      "4g": 1,
    };

    const multiplier =
      connectionMultiplier[this.connectionType.effectiveType] || 1;

    return {
      gltf: Math.min(baseTimeout * multiplier, 30000), // Max 30 seconds
      texture: Math.min(baseTimeout * 0.7 * multiplier, 20000), // Max 20 seconds
      retry: Math.min(2000 * multiplier, 5000), // Max 5 seconds between retries
    };
  }

  setupLoadingManager() {
    this.loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
      this.totalAssets = itemsTotal;
    };

    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      this.loadedCount = itemsLoaded;
      const progress = (itemsLoaded / itemsTotal) * 100;

      this.progressCallbacks.forEach((callback) => {
        try {
          callback(progress, itemsLoaded, itemsTotal, url);
        } catch {
          // Silently handle callback errors
        }
      });
    };

    this.loadingManager.onLoad = () => {
      this.completionCallbacks.forEach((callback) => {
        try {
          callback();
        } catch {
          // Silently handle callback errors
        }
      });
    };

    this.loadingManager.onError = (url) => {
      this.errorCallbacks.forEach((callback) => {
        try {
          callback(url);
        } catch {
          // Silently handle callback errors
        }
      });
    };
  }

  // Add progress callback
  onProgress(callback) {
    this.progressCallbacks.push(callback);
    return () => {
      const index = this.progressCallbacks.indexOf(callback);
      if (index > -1) this.progressCallbacks.splice(index, 1);
    };
  }

  // Add completion callback
  onComplete(callback) {
    this.completionCallbacks.push(callback);
    return () => {
      const index = this.completionCallbacks.indexOf(callback);
      if (index > -1) this.completionCallbacks.splice(index, 1);
    };
  }

  // Add error callback
  onError(callback) {
    this.errorCallbacks.push(callback);
    return () => {
      const index = this.errorCallbacks.indexOf(callback);
      if (index > -1) this.errorCallbacks.splice(index, 1);
    };
  }

  // Load a GLTF model
  async loadGLTF(url, useCache = true) {
    if (useCache && this.loadedAssets.has(url)) {
      return this.loadedAssets.get(url);
    }

    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url);
    }

    // Log loading start
    firebasePerformanceMonitor.logAssetLoadStart(url, "GLTF");

    const promise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        firebasePerformanceMonitor.logAssetLoadComplete(url, false, "Timeout");
        reject(new Error(`GLTF loading timeout: ${url}`));
      }, this.adaptiveTimeouts.gltf);

      this.gltfLoader.load(
        url,
        (gltf) => {
          clearTimeout(timeout);
          if (useCache) {
            this.loadedAssets.set(url, gltf);
          }
          firebasePerformanceMonitor.logAssetLoadComplete(url, true);
          console.log(`Successfully loaded GLTF: ${url}`);
          resolve(gltf);
        },
        (progress) => {
          // Individual asset progress
          console.log(
            `Loading ${url}: ${(
              (progress.loaded / progress.total) *
              100
            ).toFixed(1)}%`
          );
        },
        (error) => {
          clearTimeout(timeout);
          firebasePerformanceMonitor.logAssetLoadComplete(url, false, error);
          console.error(`Failed to load GLTF: ${url}`, error);
          reject(error);
        }
      );
    });

    this.loadingPromises.set(url, promise);
    return promise;
  }

  // Load a texture
  async loadTexture(url, useCache = true) {
    if (useCache && this.loadedAssets.has(url)) {
      return this.loadedAssets.get(url);
    }

    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url);
    }

    const promise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Texture loading timeout: ${url}`));
      }, this.adaptiveTimeouts.texture);

      this.textureLoader.load(
        url,
        (texture) => {
          clearTimeout(timeout);
          if (useCache) {
            this.loadedAssets.set(url, texture);
          }
          console.log(`Successfully loaded texture: ${url}`);
          resolve(texture);
        },
        (progress) => {
          console.log(
            `Loading texture ${url}: ${(
              (progress.loaded / progress.total) *
              100
            ).toFixed(1)}%`
          );
        },
        (error) => {
          clearTimeout(timeout);
          console.error(`Failed to load texture: ${url}`, error);
          reject(error);
        }
      );
    });

    this.loadingPromises.set(url, promise);
    return promise;
  }

  // Preload all critical assets with Firebase optimizations
  async preloadCriticalAssets() {
    const criticalAssets = [
      { type: "gltf", url: "/model/blackhole.glb", priority: 1 },
      { type: "gltf", url: "/model/Robot.glb", priority: 1 },
      { type: "gltf", url: "/model/Game6.glb", priority: 2 },
      { type: "gltf", url: "/model/Vr.glb", priority: 2 },
    ];

    console.log(
      "Starting critical asset preloading with Firebase optimizations..."
    );

    try {
      // Firebase optimization: Load high-priority assets first
      const highPriorityAssets = criticalAssets.filter(
        (asset) => asset.priority === 1
      );
      const lowPriorityAssets = criticalAssets.filter(
        (asset) => asset.priority === 2
      );

      // Load high-priority assets first
      const highPriorityPromises = highPriorityAssets.map(async (asset) => {
        try {
          if (asset.type === "gltf") {
            return await this.loadGLTFWithRetry(asset.url, 3);
          } else if (asset.type === "texture") {
            return await this.loadTextureWithRetry(asset.url, 3);
          }
        } catch (error) {
          console.warn(`Failed to preload high-priority ${asset.url}:`, error);
          return null;
        }
      });

      // Wait for high-priority assets
      const highPriorityResults = await Promise.allSettled(
        highPriorityPromises
      );

      // Load low-priority assets in parallel with a slight delay
      setTimeout(() => {
        const lowPriorityPromises = lowPriorityAssets.map(async (asset) => {
          try {
            if (asset.type === "gltf") {
              return await this.loadGLTFWithRetry(asset.url, 2);
            } else if (asset.type === "texture") {
              return await this.loadTextureWithRetry(asset.url, 2);
            }
          } catch (error) {
            console.warn(`Failed to preload low-priority ${asset.url}:`, error);
            return null;
          }
        });

        Promise.allSettled(lowPriorityPromises);
      }, 500); // 500ms delay for low-priority assets

      const successful = highPriorityResults.filter(
        (result) => result.status === "fulfilled" && result.value !== null
      ).length;
      const failed = highPriorityResults.filter(
        (result) => result.status === "rejected" || result.value === null
      ).length;

      console.log(
        `High-priority asset preloading completed: ${successful} successful, ${failed} failed`
      );

      // Return true if at least one high-priority asset loaded successfully
      return successful > 0;
    } catch (error) {
      console.error("Critical asset preloading failed:", error);
      // Don't throw error - allow app to continue
      return false;
    }
  }

  // Load GLTF with retry logic for Firebase CDN delays
  async loadGLTFWithRetry(url, maxRetries = 3) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Loading GLTF ${url} (attempt ${attempt}/${maxRetries})`);
        if (attempt > 1) {
          firebasePerformanceMonitor.logRetryAttempt(url, attempt, maxRetries);
        }
        return await this.loadGLTF(url, true);
      } catch (error) {
        lastError = error;
        console.warn(`GLTF load attempt ${attempt} failed for ${url}:`, error);

        if (attempt < maxRetries) {
          // Adaptive exponential backoff for Firebase CDN
          const baseDelay = this.adaptiveTimeouts.retry;
          const delay = Math.min(
            baseDelay * Math.pow(1.5, attempt - 1),
            baseDelay * 2
          );
          console.log(`Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  // Load texture with retry logic for Firebase CDN delays
  async loadTextureWithRetry(url, maxRetries = 3) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(
          `Loading texture ${url} (attempt ${attempt}/${maxRetries})`
        );
        return await this.loadTexture(url, true);
      } catch (error) {
        lastError = error;
        console.warn(
          `Texture load attempt ${attempt} failed for ${url}:`,
          error
        );

        if (attempt < maxRetries) {
          // Adaptive exponential backoff for Firebase CDN
          const baseDelay = this.adaptiveTimeouts.retry;
          const delay = Math.min(
            baseDelay * Math.pow(1.5, attempt - 1),
            baseDelay * 2
          );
          console.log(`Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  // Get loading progress
  getProgress() {
    if (this.totalAssets === 0) return 0;
    return (this.loadedCount / this.totalAssets) * 100;
  }

  // Check if all assets are loaded
  isComplete() {
    return this.totalAssets > 0 && this.loadedCount >= this.totalAssets;
  }

  // Clear cache
  clearCache() {
    this.loadedAssets.clear();
    this.loadingPromises.clear();
  }

  // Dispose of resources
  dispose() {
    this.clearCache();
    this.progressCallbacks = [];
    this.completionCallbacks = [];
    this.errorCallbacks = [];
    this.dracoLoader.dispose();
  }
}

// Create singleton instance
export const assetLoadingManager = new AssetLoadingManager();
export default AssetLoadingManager;
