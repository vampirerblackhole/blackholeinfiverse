attribute float size;
attribute vec3 color;

uniform float uSize;

varying vec3 vColor;

void main()
{
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation based on distance
    float dist = length(mvPosition.xyz);
    float sizeMod = smoothstep(900.0, 300.0, dist);
    
    // Apply size multiplier with distance attenuation
    gl_PointSize = size * uSize * sizeMod;
    
    vColor = color;
}