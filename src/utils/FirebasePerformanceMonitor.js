// Firebase Performance Monitoring Utility
// Tracks and optimizes performance specifically for Firebase hosting

class FirebasePerformanceMonitor {
  constructor() {
    this.metrics = {
      loadStart: performance.now(),
      firstContentfulPaint: null,
      largestContentfulPaint: null,
      assetLoadTimes: new Map(),
      animationInitTime: null,
      totalLoadTime: null,
      errors: [],
      retries: new Map()
    };

    this.isFirebaseHosted = this.detectFirebaseHosting();
    this.connectionInfo = this.getConnectionInfo();
    
    this.setupPerformanceObservers();
    this.startMonitoring();
  }

  // Detect if running on Firebase hosting
  detectFirebaseHosting() {
    const hostname = window.location.hostname;
    return hostname.includes('firebaseapp.com') || 
           hostname.includes('web.app') || 
           hostname.includes('firebase.com');
  }

  // Get connection information
  getConnectionInfo() {
    if (navigator.connection) {
      return {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      };
    }
    return null;
  }

  // Setup performance observers
  setupPerformanceObservers() {
    // Observe paint metrics
    if ('PerformanceObserver' in window) {
      try {
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.firstContentfulPaint = entry.startTime;
            }
          }
        });
        paintObserver.observe({ entryTypes: ['paint'] });

        // Observe LCP
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.largestContentfulPaint = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Observe resource loading
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name.includes('.glb') || entry.name.includes('.gltf') || 
                entry.name.includes('.wasm') || entry.name.includes('.js')) {
              this.metrics.assetLoadTimes.set(entry.name, {
                duration: entry.duration,
                transferSize: entry.transferSize,
                encodedBodySize: entry.encodedBodySize,
                decodedBodySize: entry.decodedBodySize
              });
            }
          }
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
      } catch (error) {
        console.warn('Performance observers not fully supported:', error);
      }
    }
  }

  // Start monitoring
  startMonitoring() {
    // Monitor page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.logEvent('page_visible');
      } else {
        this.logEvent('page_hidden');
      }
    });

    // Monitor connection changes
    if (navigator.connection) {
      navigator.connection.addEventListener('change', () => {
        this.connectionInfo = this.getConnectionInfo();
        this.logEvent('connection_change', this.connectionInfo);
      });
    }
  }

  // Log asset loading start
  logAssetLoadStart(url, type) {
    const startTime = performance.now();
    this.metrics.assetLoadTimes.set(url, { 
      startTime, 
      type,
      status: 'loading' 
    });
    
    if (this.isFirebaseHosted) {
      console.log(`[Firebase] Loading ${type}: ${url}`);
    }
  }

  // Log asset loading completion
  logAssetLoadComplete(url, success = true, error = null) {
    const endTime = performance.now();
    const assetInfo = this.metrics.assetLoadTimes.get(url);
    
    if (assetInfo) {
      assetInfo.endTime = endTime;
      assetInfo.duration = endTime - assetInfo.startTime;
      assetInfo.status = success ? 'completed' : 'failed';
      assetInfo.error = error;
      
      if (this.isFirebaseHosted) {
        console.log(`[Firebase] ${success ? 'Loaded' : 'Failed'} ${assetInfo.type}: ${url} (${assetInfo.duration.toFixed(2)}ms)`);
      }
    }
  }

  // Log retry attempt
  logRetryAttempt(url, attempt, maxRetries) {
    if (!this.metrics.retries.has(url)) {
      this.metrics.retries.set(url, []);
    }
    
    this.metrics.retries.get(url).push({
      attempt,
      timestamp: performance.now()
    });
    
    if (this.isFirebaseHosted) {
      console.log(`[Firebase] Retry ${attempt}/${maxRetries} for: ${url}`);
    }
  }

  // Log animation initialization
  logAnimationInit(duration) {
    this.metrics.animationInitTime = duration;
    
    if (this.isFirebaseHosted) {
      console.log(`[Firebase] Animations initialized in ${duration.toFixed(2)}ms`);
    }
  }

  // Log total load completion
  logLoadComplete() {
    this.metrics.totalLoadTime = performance.now() - this.metrics.loadStart;
    
    if (this.isFirebaseHosted) {
      console.log(`[Firebase] Total load time: ${this.metrics.totalLoadTime.toFixed(2)}ms`);
      this.generatePerformanceReport();
    }
  }

  // Log error
  logError(error, context) {
    this.metrics.errors.push({
      error: error.message || error,
      context,
      timestamp: performance.now()
    });
    
    if (this.isFirebaseHosted) {
      console.error(`[Firebase] Error in ${context}:`, error);
    }
  }

  // Log general event
  logEvent(event, data = null) {
    if (this.isFirebaseHosted) {
      console.log(`[Firebase] Event: ${event}`, data);
    }
  }

  // Generate performance report
  generatePerformanceReport() {
    const report = {
      hosting: 'Firebase',
      connection: this.connectionInfo,
      metrics: {
        totalLoadTime: this.metrics.totalLoadTime,
        firstContentfulPaint: this.metrics.firstContentfulPaint,
        largestContentfulPaint: this.metrics.largestContentfulPaint,
        animationInitTime: this.metrics.animationInitTime
      },
      assets: {
        total: this.metrics.assetLoadTimes.size,
        successful: Array.from(this.metrics.assetLoadTimes.values()).filter(a => a.status === 'completed').length,
        failed: Array.from(this.metrics.assetLoadTimes.values()).filter(a => a.status === 'failed').length,
        avgLoadTime: this.calculateAverageLoadTime()
      },
      retries: {
        totalRetries: Array.from(this.metrics.retries.values()).reduce((sum, retries) => sum + retries.length, 0),
        assetsWithRetries: this.metrics.retries.size
      },
      errors: this.metrics.errors.length
    };

    console.log('[Firebase] Performance Report:', report);
    return report;
  }

  // Calculate average load time for assets
  calculateAverageLoadTime() {
    const completedAssets = Array.from(this.metrics.assetLoadTimes.values())
      .filter(asset => asset.status === 'completed' && asset.duration);
    
    if (completedAssets.length === 0) return 0;
    
    const totalTime = completedAssets.reduce((sum, asset) => sum + asset.duration, 0);
    return totalTime / completedAssets.length;
  }

  // Get current metrics
  getMetrics() {
    return { ...this.metrics };
  }

  // Reset metrics
  reset() {
    this.metrics = {
      loadStart: performance.now(),
      firstContentfulPaint: null,
      largestContentfulPaint: null,
      assetLoadTimes: new Map(),
      animationInitTime: null,
      totalLoadTime: null,
      errors: [],
      retries: new Map()
    };
  }
}

// Create singleton instance
export const firebasePerformanceMonitor = new FirebasePerformanceMonitor();
export default FirebasePerformanceMonitor;
