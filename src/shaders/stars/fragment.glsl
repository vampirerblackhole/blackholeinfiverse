varying vec3 vColor;
varying float vTwinkle;

uniform float uTime;

void main()
{
    // Calculate distance from center of point (0.5, 0.5)
    vec2 uv = gl_PointCoord - 0.5;
    float distance = length(uv);
    
    // Create a sharper circular glow with steeper falloff
    float strength = 1.0 - distance * 2.5; // Increased from 2.0 for steeper falloff
    
    // Apply cubic falloff for more realistic star glow with sharper edges
    strength = pow(strength, 3.0); // Increased from 2.0 to 3.0 for sharper falloff
    
    // Ensure strength is never negative
    strength = max(0.0, strength);
    
    // Apply twinkling effect from vertex shader
    strength *= vTwinkle;
    
    // Enhance center brightness for star-like appearance - smaller bright core
    if (distance < 0.05) { // Reduced from 0.1 to 0.05
        strength = mix(strength, 1.0, 0.9); // Increased from 0.8 to 0.9 for sharper core
    }
    
    // Add subtle color variation based on twinkling to simulate atmospheric effect
    vec3 starColor = vColor;
    
    // Slightly shift color temperature based on twinkling
    // Brighter = more blue/white, Dimmer = more yellow/red
    // Reduced color temperature shifts for more subtle effect
    if (vTwinkle > 0.95) { // Increased threshold from 0.9 to 0.95
        // Shift toward blue/white when bright
        starColor += vec3(0.0, 0.03, 0.07) * (vTwinkle - 0.95) * 15.0; // Reduced color shift
    } else if (vTwinkle < 0.85) { // Increased threshold from 0.8 to 0.85
        // Shift toward yellow/red when dim
        starColor += vec3(0.07, 0.03, -0.02) * (0.85 - vTwinkle) * 3.0; // Reduced color shift
    }
    
    // Create final color with proper alpha
    vec3 finalColor = starColor * strength;
    
    // Output
    gl_FragColor = vec4(finalColor, strength);
}