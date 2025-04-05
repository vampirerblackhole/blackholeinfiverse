uniform sampler2D uDefaultTexture;
uniform sampler2D uDistortionTexture;
uniform vec2 uConvergencePosition;

varying vec2 vUv;

void main()
{
    float distortionStrength = texture(uDistortionTexture, vUv).r;
    vec2 toConvergence = uConvergencePosition - vUv;
    vec2 distortedUv = vUv + toConvergence * distortionStrength;
    
    vec4 color = texture(uDefaultTexture, distortedUv);
    gl_FragColor = color;
} 