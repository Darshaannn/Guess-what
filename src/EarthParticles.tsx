import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
  attribute float size;
  attribute vec3 color;
  varying vec3 vColor;
  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (150.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
    gl_FragColor = vec4(vColor, alpha * 0.8);
  }
`;

export default function EarthParticles() {
    const groupRef = useRef<THREE.Group>(null);
    const scroll = useScroll();
    const [particleData, setParticleData] = useState<{ pos: Float32Array; col: Float32Array; siz: Float32Array } | null>(null);

    const atmosphereRef = useRef<THREE.Points>(null);

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        // Using a reliable topological/mask map for land detection
        img.src = 'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg';

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const w = 256; // Low res sampling for performance
            const h = 128;
            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(img, 0, 0, w, h);
            const data = ctx.getImageData(0, 0, w, h).data;

            const totalParticles = 80000;
            const pos = new Float32Array(totalParticles * 3);
            const col = new Float32Array(totalParticles * 3);
            const siz = new Float32Array(totalParticles);

            const landColorLow = new THREE.Color('#4a7c59');
            const landColorHigh = new THREE.Color('#8b6914');
            const oceanColorLow = new THREE.Color('#1a3a5c');
            const oceanColorHigh = new THREE.Color('#2255aa');
            const indiaColor = new THREE.Color('#ffcc33');

            for (let i = 0; i < totalParticles; i++) {
                const i3 = i * 3;

                // Random spherical coordinates
                const u = Math.random();
                const v = Math.random();
                const theta = u * Math.PI * 2;
                const phi = Math.acos(2 * v - 1);

                // Map to image coordinates
                const x = Math.floor(u * w);
                const y = Math.floor(v * h);
                const pixelIndex = (y * w + x) * 4;

                // earth_specular has sea as light (high value) and land as dark (low value)
                // Actually in common threejs textures, specular is often land=0, sea=1
                const isSea = data[pixelIndex] > 128;

                // Geographic refinement: India region (approx lat 8-37N, lon 68-97E)
                // lon: 0-360 mapped to 0-Math.PI*2 -> approx 1.18 to 1.7 rad
                // lat: -90 to 90 mapped to 0-Math.PI -> approx 0.9 to 1.4 rad
                const isIndia = (u > 0.18 && u < 0.28) && (v > 0.35 && v < 0.45);

                const radius = 12;
                let finalRadius = radius;

                // Density control: if sea, random discard or scatter
                if (isSea && Math.random() > 0.3) {
                    // reduce ocean density
                }

                pos[i3] = finalRadius * Math.sin(phi) * Math.cos(theta);
                pos[i3 + 1] = finalRadius * Math.cos(phi);
                pos[i3 + 2] = finalRadius * Math.sin(phi) * Math.sin(theta);

                let selectedColor;
                if (isIndia) {
                    selectedColor = indiaColor.clone().lerp(landColorHigh, Math.random() * 0.5);
                    siz[i] = 1.2;
                } else if (!isSea) {
                    selectedColor = landColorLow.clone().lerp(landColorHigh, Math.random());
                    siz[i] = 0.8 + Math.random() * 0.4;
                } else {
                    selectedColor = oceanColorLow.clone().lerp(oceanColorHigh, Math.random());
                    siz[i] = 0.4 + Math.random() * 0.3;
                    // Lower ocean density by moving some particles inside
                    if (Math.random() > 0.4) {
                        pos[i3] *= 0.98; pos[i3 + 1] *= 0.98; pos[i3 + 2] *= 0.98;
                    }
                }

                col[i3] = selectedColor.r;
                col[i3 + 1] = selectedColor.g;
                col[i3 + 2] = selectedColor.b;
            }

            setParticleData({ pos, col, siz });
        };
    }, []);

    // Atmosphere particles
    const atmosData = useMemo(() => {
        const count = 20000;
        const pos = new Float32Array(count * 3);
        const siz = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            const r = 12.5 + Math.random() * 0.8;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.cos(phi);
            pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
            siz[i] = 0.3 + Math.random() * 0.5;
        }
        return { pos, siz };
    }, []);

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.05;
        }

        // Zoom logic linked to scroll
        const offset = scroll.offset; // 0 to 1
        // Section S4 is Earth (approx 0.4 to 0.6)
        if (offset > 0.35 && offset < 0.65) {
            // zoom handled by SceneController usually, but we can add local effects
        }
    });

    if (!particleData) return null;

    return (
        <group ref={groupRef}>
            {/* 1. Main Earth Geometry */}
            <points>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[particleData.pos, 3]} />
                    <bufferAttribute attach="attributes-color" args={[particleData.col, 3]} />
                    <bufferAttribute attach="attributes-size" args={[particleData.siz, 1]} />
                </bufferGeometry>
                <shaderMaterial
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    transparent
                    vertexColors
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* 2. Atmosphere Shell */}
            <points ref={atmosphereRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[atmosData.pos, 3]} />
                    <bufferAttribute attach="attributes-size" args={[atmosData.siz, 1]} />
                </bufferGeometry>
                <shaderMaterial
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    transparent
                    uniforms={{ color: { value: new THREE.Color('#88ccff') } }}
                // we need to pass color to shader or just use a fixed one in fragment
                />
                {/* Simplified Atmosphere Shader */}
                <pointsMaterial size={0.1} color="#88ccff" transparent opacity={0.2} depthWrite={false} blending={THREE.AdditiveBlending} />
            </points>

            {/* 3. Ambient Glow Layer */}
            <mesh scale={[1.2, 1.2, 1.2]}>
                <sphereGeometry args={[12, 32, 32]} />
                <meshBasicMaterial color="#4488ff" transparent opacity={0.1} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
            </mesh>
        </group>
    );
}
