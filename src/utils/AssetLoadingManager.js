import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

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

    this.setupLoadingManager();
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
        } catch (error) {}
      });
    };

    this.loadingManager.onLoad = () => {
      this.completionCallbacks.forEach((callback) => {
        try {
          callback();
        } catch (error) {}
      });
    };

    this.loadingManager.onError = (url) => {
      this.errorCallbacks.forEach((callback) => {
        try {
          callback(url);
        } catch (error) {}
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

    const promise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`GLTF loading timeout: ${url}`));
      }, 15000); // 15 second timeout

      this.gltfLoader.load(
        url,
        (gltf) => {
          clearTimeout(timeout);
          if (useCache) {
            this.loadedAssets.set(url, gltf);
          }
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
      }, 10000); // 10 second timeout

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

  // Preload all critical assets
  async preloadCriticalAssets() {
    const criticalAssets = [
      { type: "gltf", url: "/model/blackhole.glb" },
      { type: "gltf", url: "/model/Robot.glb" },
      { type: "gltf", url: "/model/Game6.glb" },
      { type: "gltf", url: "/model/Vr.glb" },
    ];

    console.log("Starting critical asset preloading...");

    try {
      const loadPromises = criticalAssets.map(async (asset) => {
        try {
          if (asset.type === "gltf") {
            return await this.loadGLTF(asset.url);
          } else if (asset.type === "texture") {
            return await this.loadTexture(asset.url);
          }
        } catch (error) {
          console.warn(`Failed to preload ${asset.url}:`, error);
          // Don't fail the entire loading process for individual assets
          return null;
        }
      });

      const results = await Promise.allSettled(loadPromises);

      const successful = results.filter(
        (result) => result.status === "fulfilled"
      ).length;
      const failed = results.filter(
        (result) => result.status === "rejected"
      ).length;

      console.log(
        `Asset preloading completed: ${successful} successful, ${failed} failed`
      );

      // Return true even if some assets failed - the app should still work
      return true;
    } catch (error) {
      console.error("Critical asset preloading failed:", error);
      throw error;
    }
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
