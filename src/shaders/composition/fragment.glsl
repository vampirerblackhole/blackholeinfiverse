uniform float uTime;
uniform sampler2D uDefaultTexture;
uniform sampler2D uDistortionTexture;
uniform vec2 uConvergencePosition;
uniform float uDistortionStrength;

varying vec2 vUv;

#include ../partials/inverseLerp.glsl
#include ../partials/remap.glsl
#include ../partials/random2d.glsl

void main() {
    float distortionValue = texture(uDistortionTexture, vUv).r;
    
    // Apply global distortion strength control
    float distortionStrength = distortionValue * uDistortionStrength;
    
    vec2 toConvergence = uConvergencePosition - vUv;
    vec2 distoredUv = vUv + toConvergence * distortionStrength * 1.2; // Increased distortion effect
    
    // Enhanced vignette
    float distanceToCenter = length(vUv - 0.5);
    float vignetteStrength = remap(distanceToCenter, 0.3, 0.7, 0.0, 1.0);
    vignetteStrength = smoothstep(0.0, 1.0, vignetteStrength);
    
    // Improved RGB Shift - scaled by distortion strength
    float rgbShiftAmount = 0.03 * vignetteStrength * uDistortionStrength;
    float r = texture(uDefaultTexture, distoredUv + vec2(sin(0.0), cos(0.0)) * rgbShiftAmount).r;
    float g = texture(uDefaultTexture, distoredUv + vec2(sin(2.1), cos(2.1)) * rgbShiftAmount).g;
    float b = texture(uDefaultTexture, distoredUv + vec2(sin(-2.1), cos(-2.1)) * rgbShiftAmount).b;
    vec4 color = vec4(r, g, b, 1.0);

    // Enhanced noise effect
    float noise = random2d(vUv + uTime * 0.1);
    noise = noise - 0.5;
    float grayscale = r * 0.299 + g * 0.587 + b * 0.114;
    noise *= grayscale;
    color += noise * 0.02 * uDistortionStrength;

    gl_FragColor = color;
}