attribute float size;
attribute vec3 color;
attribute float randomOffset;
attribute float randomSpeed;

uniform float uSize;
uniform float uTime;
uniform float uScrollProgress;

varying vec3 vColor;
varying float vTwinkle;

void main()
{
    // Copy position to avoid modifying the original
    vec3 pos = position;
    
    // Add subtle movement based on time
    float moveFactor = 0.02;
    float timeOffset = uTime * randomSpeed;
    
    // Different motion for each axis to create interesting patterns
    pos.x += sin(timeOffset * 0.2 + randomOffset) * moveFactor;
    pos.y += cos(timeOffset * 0.3 + randomOffset * 1.1) * moveFactor;
    pos.z += sin(timeOffset * 0.1 + randomOffset * 0.8) * moveFactor;
    
    // Add additional motion based on scroll
    if (uScrollProgress > 0.0) {
        float scrollEffect = uScrollProgress * 1.0;
        pos.z += scrollEffect * sin(randomOffset * 0.1) * 1.0;
    }
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation based on distance
    float dist = length(mvPosition.xyz);
    float sizeMod = smoothstep(900.0, 200.0, dist) * 0.7;
    
    // Simple twinkling effect
    float twinkling = 0.85 + 0.15 * sin(uTime * randomSpeed + randomOffset);
    
    // Apply size multiplier with distance attenuation and twinkling
    gl_PointSize = size * uSize * sizeMod * twinkling;
    
    vColor = color;
    vTwinkle = twinkling;
}