import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  attribute float size;
  attribute vec3 color;
  attribute float twinkleSpeed;
  attribute float twinklePhase;

  varying vec3 vColor;
  varying float vTwinkle;
  varying float vSize;

  uniform float time;

  void main() {
    vColor = color;
    vSize = size;
    
    // Twinkle calculation
    vTwinkle = 0.7 + 0.3 * sin(time * twinkleSpeed + twinklePhase);
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    
    // Size attenuation based on distance
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vTwinkle;
  varying float vSize;

  void main() {
    // Distance from center of point
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    
    // Hard circle mask
    if (dist > 0.5) discard;

    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
    
    // Diffraction spikes for giant stars (size category > 2.0 roughly)
    float spike = 0.0;
    if (vSize > 2.0) {
        float beam1 = smoothstep(0.02, 0.0, abs(center.x)) * smoothstep(0.5, 0.0, abs(center.y));
        float beam2 = smoothstep(0.02, 0.0, abs(center.y)) * smoothstep(0.5, 0.0, abs(center.x));
        spike = max(beam1, beam2) * 0.6;
    }

    vec3 finalColor = vColor * vTwinkle;
    gl_FragColor = vec4(finalColor + (spike * vColor), alpha * vTwinkle);
  }
`;

export default function RealisticStars() {
    const starCount = 80000;
    const geometryRef = useRef<THREE.BufferGeometry>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const [positions, colors, sizes, speeds, phases] = useMemo(() => {
        const pos = new Float32Array(starCount * 3);
        const col = new Float32Array(starCount * 3);
        const siz = new Float32Array(starCount);
        const spe = new Float32Array(starCount);
        const pha = new Float32Array(starCount);

        const colorOptions = [
            new THREE.Color(1.0, 1.0, 1.0), // White (60%)
            new THREE.Color(1.0, 0.93, 0.8), // Warm (#ffeecc) (20%)
            new THREE.Color(0.8, 0.88, 1.0), // Blue-white (#cce0ff) (15%)
            new THREE.Color(1.0, 0.67, 0.53), // Red-orange (#ffaa88) (5%)
        ];

        const sizeOptions = [0.3, 0.7, 1.2, 1.8, 2.5]; // Categories

        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;

            // Random position in a large sphere
            const radius = 200 + Math.random() * 800;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
            pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            pos[i3 + 2] = radius * Math.cos(phi);

            // Color Distribution
            const cRand = Math.random();
            let selectedColor;
            if (cRand < 0.6) selectedColor = colorOptions[0];
            else if (cRand < 0.8) selectedColor = colorOptions[1];
            else if (cRand < 0.95) selectedColor = colorOptions[2];
            else selectedColor = colorOptions[3];

            col[i3] = selectedColor.r;
            col[i3 + 1] = selectedColor.g;
            col[i3 + 2] = selectedColor.b;

            // Size Distribution (natural: most tiny, few giant)
            const sRand = Math.random();
            let selectedSize;
            if (sRand < 0.6) selectedSize = sizeOptions[0]; // Tiny
            else if (sRand < 0.85) selectedSize = sizeOptions[1]; // Small
            else if (sRand < 0.95) selectedSize = sizeOptions[2]; // Medium
            else if (sRand < 0.99) selectedSize = sizeOptions[3]; // Large
            else selectedSize = sizeOptions[4]; // Giant

            siz[i] = selectedSize;

            // Twinkle Data
            spe[i] = 1.0 + Math.random() * 3.0;
            pha[i] = Math.random() * Math.PI * 2;
        }

        return [pos, col, siz, spe, pha];
    }, []);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.time.value = state.clock.elapsedTime;
        }
    });

    return (
        <points>
            <bufferGeometry ref={geometryRef}>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[colors, 3]}
                />
                <bufferAttribute
                    attach="attributes-size"
                    args={[sizes, 1]}
                />
                <bufferAttribute
                    attach="attributes-twinkleSpeed"
                    args={[speeds, 1]}
                />
                <bufferAttribute
                    attach="attributes-twinklePhase"
                    args={[phases, 1]}
                />
            </bufferGeometry>
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={{
                    time: { value: 0 }
                }}
                transparent
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}
