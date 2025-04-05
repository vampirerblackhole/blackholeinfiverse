uniform sampler2D uGradientTexture;
uniform sampler2D uNoisesTexture;
uniform float uTime;

varying vec2 vUv;

#include "../partials/inverseLerp.glsl"
#include "../partials/remap.glsl"

void main()
{
    // Adjusted noise sampling to create more pronounced swirls
    float noise1 = texture(uNoisesTexture, vUv - uTime * 0.12).r;
    float noise2 = texture(uNoisesTexture, vUv - uTime * 0.09).g;
    float noise3 = texture(uNoisesTexture, vUv - uTime * 0.07).b;
    float noise4 = texture(uNoisesTexture, vUv - uTime * 0.05).a;
    vec4 noiseVector = vec4(noise1, noise2, noise3, noise4);
    float noiseLength = length(noiseVector);
    
    // Fine-tuned falloff values to match the reference image
    float outerFalloff = remap(vUv.y, 0.3, 0.0, 1.0, 0.0);
    float innerFalloff = remap(vUv.y, 1.0, 0.9, 0.0, 1.0);
    float falloff = min(outerFalloff, innerFalloff);
    falloff = smoothstep(0.0, 1.0, falloff);
    
    vec2 uv = vUv;
    // Increased noise influence for more pronounced swirls
    uv.y += noiseLength * 0.6;
    uv.y *= falloff;
    
    vec4 color = texture(uGradientTexture, uv);
    gl_FragColor = color;
} 