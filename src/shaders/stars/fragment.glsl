varying vec3 vColor;
varying float vTwinkle;

void main()
{
    // Calculate distance from center of point
    vec2 uv = gl_PointCoord - 0.5;
    float distance = length(uv);
    
    // Create a circular glow that fades at edges
    float strength = 1.0 - distance * 2.0;
    
    // Apply falloff for star glow
    strength = pow(strength, 2.0);
    
    // Ensure strength is never negative
    strength = max(0.0, strength);
    
    // Apply twinkling effect
    strength *= vTwinkle;
    
    // Create final color with proper alpha
    vec3 finalColor = vColor * strength;
    
    // Output
    gl_FragColor = vec4(finalColor, strength);
}