import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function MumbaiNight() {
    const cityLightsRef = useRef<THREE.Points>(null);

    const isMobile = window.innerWidth < 768;
    const particlesCount = isMobile ? 8000 : 15000;

    const [positions, colors] = useMemo(() => {
        const pos = new Float32Array(particlesCount * 3);
        const col = new Float32Array(particlesCount * 3);

        // Marine Drive arc
        const marineDriveCount = 2000;
        // Sea Link
        const seaLinkCount = 800;
        // City grid
        const cityCount = particlesCount - marineDriveCount - seaLinkCount;

        let index = 0;

        // 1. Marine Drive Arc (C-shape)
        for (let i = 0; i < marineDriveCount; i++) {
            const t = i / marineDriveCount;
            const angle = t * Math.PI;
            const radius = 25;

            const thickness = (Math.random() - 0.5) * 2;

            pos[index] = Math.cos(angle) * radius + thickness;
            pos[index + 1] = (Math.random() - 0.5) * 0.5; // ground level
            pos[index + 2] = Math.sin(angle) * (radius * 0.8) + thickness; // flattened C

            // Warm golden yellow
            col[index] = 1.0;
            col[index + 1] = 0.8;
            col[index + 2] = 0.4;
            index += 3;
        }

        // 2. Bandra Worli Sea Link 
        for (let i = 0; i < seaLinkCount; i++) {
            const t = i / seaLinkCount;

            pos[index] = -30 + t * 25;
            pos[index + 1] = Math.max(0, Math.sin(t * Math.PI * 2)) * 2; // suspension arches
            pos[index + 2] = 15 + t * 10;

            // Bright white
            col[index] = 0.9;
            col[index + 1] = 0.95;
            col[index + 2] = 1.0;
            index += 3;
        }

        // 3. Dense City Spread
        for (let i = 0; i < cityCount; i++) {
            const x = (Math.random() - 0.2) * 70;
            const z = (Math.random() - 0.8) * 60;

            // Exclude ocean side (roughly x < -10 and z > 15)
            if (x < -5 && z > 10) continue;

            pos[index] = x;
            // Building heights (dense downtown near 0,0)
            const distToCenter = Math.sqrt(x * x + z * z);
            const heightMultiplier = Math.max(0, (30 - distToCenter) / 30);
            pos[index + 1] = Math.pow(Math.random(), 3) * 6 * heightMultiplier;
            pos[index + 2] = z;

            // Warm city glow (mostly sodium yellow, some white)
            const type = Math.random();
            if (type > 0.8) {
                col[index] = 0.9; col[index + 1] = 0.9; col[index + 2] = 1.0; // white
            } else {
                col[index] = 1.0; col[index + 1] = 0.6 + Math.random() * 0.2; col[index + 2] = 0.2 + Math.random() * 0.2;
            }
            index += 3;
        }

        return [pos, col];
    }, []);

    useFrame(() => {
        // Nothing highly animated, city is static, twinkling handles by bloom
    });

    return (
        <group position={[0, -40, -400]}>
            {/* 15000 Mumbai Point Lights */}
            <points ref={cityLightsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                    <bufferAttribute attach="attributes-color" args={[colors, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    size={0.15}
                    vertexColors
                    transparent
                    opacity={0.9}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* Ambient city glow (Warmer) */}
            <spotLight position={[0, 50, 0]} color="#ffcc88" intensity={150} angle={Math.PI / 3} penumbra={1} decay={2} distance={200} />

            {/* Earth Surface (Curved Horizon) */}
            <mesh position={[0, -500, 0]}>
                <sphereGeometry args={[500, 128, 128, 0, Math.PI * 2, 0, 0.4]} />
                <meshStandardMaterial
                    color="#010208"
                    roughness={0.8}
                    metalness={0.2}
                    emissive="#000000"
                />
            </mesh>

        </group>
    );
}
