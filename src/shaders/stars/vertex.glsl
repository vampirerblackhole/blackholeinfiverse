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
    float moveFactor = 0.05; // Reduced from 0.1 to make movement more subtle
    float timeOffset = uTime * randomSpeed;
    
    // Different motion for each axis to create interesting patterns
    pos.x += sin(timeOffset * 0.2 + randomOffset) * moveFactor;
    pos.y += cos(timeOffset * 0.3 + randomOffset * 1.1) * moveFactor;
    pos.z += sin(timeOffset * 0.1 + randomOffset * 0.8) * moveFactor;
    
    // Add additional motion based on scroll
    if (uScrollProgress > 0.0) {
        float scrollEffect = uScrollProgress * 2.0;
        // Simulate slight movement when scrolling
        pos.z += scrollEffect * sin(randomOffset * 0.1) * 3.0; // Reduced from 5.0
    }
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation based on distance - more aggressive falloff
    float dist = length(mvPosition.xyz);
    float sizeMod = smoothstep(900.0, 200.0, dist) * 0.8; // Adjusted range and multiplied by 0.8
    
    // Twinkling effect using sin waves - more subtle
    float twinkleSpeed = 0.5 + randomSpeed * 0.5; // Slower twinkling
    float twinkling = 0.8 + 0.2 * sin(uTime * twinkleSpeed + randomOffset); // Reduced range from 0.3 to 0.2
    
    // Add slight pulsing at different frequencies for realism
    twinkling *= 1.0 + 0.05 * sin(uTime * 0.5 + randomOffset * 2.0); // Reduced from 0.1 to 0.05
    
    // Apply size multiplier with distance attenuation and twinkling
    gl_PointSize = size * uSize * sizeMod * twinkling;
    
    vColor = color;
    vTwinkle = twinkling;
}