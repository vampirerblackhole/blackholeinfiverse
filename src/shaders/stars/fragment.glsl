varying vec3 vColor;

void main()
{
    // Calculate distance from center of point (0.5, 0.5)
    vec2 uv = gl_PointCoord - 0.5;
    float distance = length(uv);
    
    // Create a soft circular glow that fades at edges
    float strength = 1.0 - distance * 2.0; // Linear falloff
    
    // Apply quadratic falloff for more realistic star glow
    strength = pow(strength, 2.0);
    
    // Ensure strength is never negative
    strength = max(0.0, strength);
    
    // Create final color with proper alpha
    vec3 finalColor = vColor * strength;
    
    // Output
    gl_FragColor = vec4(finalColor, strength);
}