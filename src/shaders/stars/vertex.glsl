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
    
    // Basic movement based on time
    float moveFactor = 0.05;
    float timeOffset = uTime;
    
    // Simple movement pattern
    pos.x += sin(timeOffset + randomOffset) * moveFactor;
    pos.y += cos(timeOffset + randomOffset * 1.1) * moveFactor;
    pos.z += sin(timeOffset * 0.5 + randomOffset) * moveFactor;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation based on distance
    float dist = length(mvPosition.xyz);
    float sizeMod = smoothstep(900.0, 200.0, dist) * 0.7;
    
    // Simple twinkling effect
    float twinkling = 0.8 + 0.2 * sin(uTime + randomOffset);
    
    // Apply size multiplier with distance attenuation and twinkling
    gl_PointSize = size * uSize * sizeMod * twinkling;
    
    vColor = color;
    vTwinkle = twinkling;
}