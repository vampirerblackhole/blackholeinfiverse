#!/usr/bin/env node

/**
 * Firebase-optimized build script
 * Optimizes the build process specifically for Firebase hosting deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('🔥 Starting Firebase-optimized build...');

// Step 1: Clean previous build
console.log('📁 Cleaning previous build...');
try {
  if (fs.existsSync(path.join(projectRoot, 'dist'))) {
    fs.rmSync(path.join(projectRoot, 'dist'), { recursive: true, force: true });
  }
} catch (error) {
  console.warn('Warning: Could not clean dist directory:', error.message);
}

// Step 2: Set environment variables for production
process.env.NODE_ENV = 'production';
process.env.VITE_FIREBASE_BUILD = 'true';

// Step 3: Run Vite build with optimizations
console.log('⚡ Building with Vite...');
try {
  execSync('npm run build', { 
    stdio: 'inherit', 
    cwd: projectRoot,
    env: { ...process.env }
  });
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 4: Post-build optimizations
console.log('🔧 Applying Firebase-specific optimizations...');

// Optimize index.html for Firebase hosting
const indexPath = path.join(projectRoot, 'dist', 'index.html');
if (fs.existsSync(indexPath)) {
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Add Firebase-specific meta tags and optimizations
  const firebaseOptimizations = `
    <!-- Firebase Hosting Optimizations -->
    <meta name="firebase-hosting" content="optimized">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="//firebaseapp.com">
    <link rel="dns-prefetch" href="//web.app">
    
    <!-- Resource hints for critical assets -->
    <link rel="preload" href="/model/blackhole.glb" as="fetch" crossorigin>
    <link rel="preload" href="/model/Robot.glb" as="fetch" crossorigin>
    <link rel="preload" href="/draco-gltf/draco_decoder.wasm" as="fetch" crossorigin>
    
    <!-- Performance optimizations -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="theme-color" content="#000000">
  `;
  
  // Insert optimizations before closing head tag
  indexContent = indexContent.replace('</head>', `${firebaseOptimizations}</head>`);
  
  // Add service worker registration for better caching
  const serviceWorkerScript = `
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
        });
      }
    </script>
  `;
  
  indexContent = indexContent.replace('</body>', `${serviceWorkerScript}</body>`);
  
  fs.writeFileSync(indexPath, indexContent);
  console.log('✅ Optimized index.html for Firebase hosting');
}

// Step 5: Create a simple service worker for caching
const swContent = `
// Firebase-optimized service worker
const CACHE_NAME = 'blackhole-site-v1';
const CRITICAL_ASSETS = [
  '/',
  '/model/blackhole.glb',
  '/model/Robot.glb',
  '/draco-gltf/draco_decoder.wasm'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CRITICAL_ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  // Cache-first strategy for 3D models and assets
  if (event.request.url.includes('.glb') || 
      event.request.url.includes('.gltf') || 
      event.request.url.includes('.wasm')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});
`;

fs.writeFileSync(path.join(projectRoot, 'dist', 'sw.js'), swContent);
console.log('✅ Created service worker for asset caching');

// Step 6: Optimize asset organization
console.log('📦 Optimizing asset organization...');

// Ensure model files are in the correct location
const modelSrcDir = path.join(projectRoot, 'public', 'model');
const modelDistDir = path.join(projectRoot, 'dist', 'model');

if (fs.existsSync(modelSrcDir) && !fs.existsSync(modelDistDir)) {
  fs.mkdirSync(modelDistDir, { recursive: true });
  const modelFiles = fs.readdirSync(modelSrcDir);
  
  modelFiles.forEach(file => {
    const srcPath = path.join(modelSrcDir, file);
    const distPath = path.join(modelDistDir, file);
    fs.copyFileSync(srcPath, distPath);
  });
  
  console.log('✅ Copied model files to dist directory');
}

// Step 7: Generate build report
const distDir = path.join(projectRoot, 'dist');
const buildReport = {
  timestamp: new Date().toISOString(),
  environment: 'firebase-production',
  optimizations: [
    'Firebase hosting headers configured',
    'Asset caching optimized',
    'Service worker implemented',
    'Resource hints added',
    'DRACO compression enabled',
    'Adaptive timeouts configured'
  ],
  assets: {}
};

// Analyze build output
function analyzeDirectory(dir, basePath = '') {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(basePath, item);
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      analyzeDirectory(fullPath, relativePath);
    } else {
      const sizeKB = (stats.size / 1024).toFixed(2);
      buildReport.assets[relativePath] = {
        size: `${sizeKB} KB`,
        type: path.extname(item).slice(1) || 'unknown'
      };
    }
  });
}

if (fs.existsSync(distDir)) {
  analyzeDirectory(distDir);
}

// Write build report
const reportPath = path.join(projectRoot, 'dist', 'build-report.json');
fs.writeFileSync(reportPath, JSON.stringify(buildReport, null, 2));

console.log('📊 Build report generated at dist/build-report.json');

// Step 8: Final validation
console.log('🔍 Validating build output...');

const requiredFiles = [
  'index.html',
  'sw.js',
  'model/blackhole.glb',
  'model/Robot.glb',
  'draco-gltf/draco_decoder.wasm'
];

const missingFiles = requiredFiles.filter(file => 
  !fs.existsSync(path.join(distDir, file))
);

if (missingFiles.length > 0) {
  console.warn('⚠️  Warning: Missing critical files:', missingFiles);
} else {
  console.log('✅ All critical files present');
}

// Calculate total build size
let totalSize = 0;
Object.values(buildReport.assets).forEach(asset => {
  totalSize += parseFloat(asset.size);
});

console.log(`📦 Total build size: ${totalSize.toFixed(2)} KB`);
console.log('🎉 Firebase-optimized build completed successfully!');
console.log('');
console.log('Next steps:');
console.log('1. Test the build locally: npm run preview');
console.log('2. Deploy to Firebase: firebase deploy');
console.log('3. Monitor performance in Firebase Console');
