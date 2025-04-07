import { useEffect, useRef } from "react";
import * as THREE from "three";
import PropTypes from "prop-types";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

// Import assets
import accretionDiskTexture from "./assets/accretion_disk.png";

// Define shader code exactly like reference implementation
const vertexShaderText = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShaderText = `
#define PI 3.141592653589793238462643383279
#define DEG_TO_RAD (PI/180.0)
#define STEP 0.03
#define NSTEPS 800

uniform float time;
uniform vec2 resolution;
uniform sampler2D diskTexture;

// Black hole parameters
const float blackHoleRadius = 1.0;
const float DISK_IN = 2.0;
const float DISK_WIDTH = 4.0;

// Rotation matrix for transforming coordinates
mat3 rotateX(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat3(
    1.0, 0.0, 0.0,
    0.0, c, -s,
    0.0, s, c
  );
}

mat3 rotateY(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat3(
    c, 0.0, s,
    0.0, 1.0, 0.0,
    -s, 0.0, c
  );
}

mat3 rotateZ(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat3(
    c, -s, 0.0,
    s, c, 0.0,
    0.0, 0.0, 1.0
  );
}

void main() {
  // Normalize coordinates
  vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
  uv.x *= resolution.x / resolution.y; // Aspect ratio correction
  
  // Following the Observer.js approach from reference code:
  // Position the camera at a distance with an incline for horizontal view
  float r = 15.0; // Distance from center
  float incline = -90.0 * DEG_TO_RAD; // 90 degree incline for horizontal view
  
  // Set camera position with proper incline
  vec3 cameraPos = vec3(0.0, 0.0, r);
  cameraPos = rotateX(incline) * cameraPos;
  
  // Initial ray direction before applying incline
  vec3 rayDir = normalize(vec3(uv.x, uv.y, -1.0));
  
  // Apply the same incline to ray direction
  rayDir = rotateX(incline) * rayDir;
  
  // Start with black color (space background)
  vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
  
  // Set up ray origin and direction for tracing
  vec3 point = cameraPos;
  vec3 velocity = rayDir;
  
  // Calculate angular momentum for gravitational lensing
  vec3 c = cross(point, velocity);
  float h2 = dot(c, c);
  
  vec3 oldpoint = point;
  
  // Ray-tracing loop with gravitational lensing
  for (int i = 0; i < NSTEPS; i++) {
    oldpoint = point;
    point += velocity * STEP;
    
    // Gravitational force calculation
    vec3 accel = -1.5 * h2 * point / pow(dot(point, point), 2.5);
    velocity += accel * STEP;
    
    // Break if we hit the black hole
    float distance = length(point);
    if (distance < blackHoleRadius && length(oldpoint) > blackHoleRadius) {
      // Black hole silhouette
      color = vec4(0.0, 0.0, 0.0, 1.0);
      break;
    }
    
    // Check for accretion disk intersection (XY plane)
    if (oldpoint.y * point.y < 0.0) {
      // Calculate intersection point
      float lambda = -oldpoint.y / velocity.y;
      vec3 intersection = oldpoint + lambda * velocity;
      float r = length(vec2(intersection.x, intersection.z)); // Distance from center in XZ plane
      
      // Check if we're in the disk range
      if (r > DISK_IN && r < DISK_IN + DISK_WIDTH) {
        // Calculate disk coordinates
        float phi = atan(intersection.z, intersection.x); // Angle in XZ plane
        
        // Add time-based rotation
        phi = mod(phi - time * 0.5, PI * 2.0);
        
        // Map to texture coordinates
        vec2 texCoord = vec2(phi / (2.0 * PI), (r - DISK_IN) / DISK_WIDTH);
        vec4 diskColor = texture2D(diskTexture, texCoord);
        
        // Apply brighter alpha
        float diskAlpha = clamp(dot(diskColor, diskColor) / 3.0, 0.0, 1.0);
        
        // Layer the disk on top of the background
        color += vec4(diskColor.rgb * 1.5, 1.0) * diskAlpha; // Brighter color
      }
    }
  }
  
  gl_FragColor = color;
}
`;

const ReferenceBlackhole = ({
  width = "100%",
  height = "100%",
  autoRotate = true,
  autoRotateSpeed = 0.1,
}) => {
  const canvasRef = useRef(null);
  const frameIdRef = useRef(null);
  const rendererRef = useRef(null);
  const composerRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Basic renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setClearColor(0x000000, 1);
    renderer.setSize(
      canvasRef.current.clientWidth,
      canvasRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Create scene and camera for shader-based rendering
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    // Set up post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);

    // Add bloom effect for glow - matches the reference implementation
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(
        canvasRef.current.clientWidth,
        canvasRef.current.clientHeight
      ),
      1.2, // strength
      2.0, // radius
      0.2 // threshold
    );

    const shaderPass = new ShaderPass(CopyShader);
    shaderPass.renderToScreen = true;

    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    composer.addPass(shaderPass);
    composerRef.current = composer;

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    const diskTexture = textureLoader.load(accretionDiskTexture, (texture) => {
      // Apply proper texture settings once loaded
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
    });

    // Create uniforms for shader exactly like reference
    const uniforms = {
      time: { value: 0 },
      resolution: {
        value: new THREE.Vector2(
          canvasRef.current.clientWidth,
          canvasRef.current.clientHeight
        ),
      },
      diskTexture: { value: diskTexture },
    };

    // Create shader material
    const material = new THREE.ShaderMaterial({
      vertexShader: vertexShaderText,
      fragmentShader: fragmentShaderText,
      uniforms: uniforms,
      transparent: true,
    });

    // Create a full-screen quad to render the shader
    const geometry = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    // Handle window resize
    const handleResize = () => {
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;

      renderer.setSize(width, height);
      composer.setSize(width, height);
      uniforms.resolution.value.set(width, height);

      // Update bloom pass resolution
      bloomPass.resolution.set(width, height);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Animation loop
    const animate = () => {
      if (autoRotate) {
        // Update time uniform for animation - exactly like reference code
        uniforms.time.value += 0.01 * autoRotateSpeed;
      }

      // Render using composer for post-processing effects
      composer.render();
      frameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Clean up
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }

      window.removeEventListener("resize", handleResize);

      diskTexture.dispose();
      material.dispose();
      geometry.dispose();
      renderer.dispose();
    };
  }, [autoRotate, autoRotateSpeed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        display: "block",
      }}
    />
  );
};

ReferenceBlackhole.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  autoRotate: PropTypes.bool,
  autoRotateSpeed: PropTypes.number,
};

export default ReferenceBlackhole;
