import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import * as THREE from 'three';

export default function MilkyWay() {
    const pointsRef = useRef<THREE.Points>(null);
    const cloudsRef = useRef<THREE.Group>(null);

    const isMobile = window.innerWidth < 768;
    const particlesCount = isMobile ? 60000 : 200000;

    const [positions, colors] = useMemo(() => {
        const positions = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);
        const colorInside = new THREE.Color('#ffebb8'); // Warm golden core
        const colorBlue = new THREE.Color('#a8c7ff'); // Blue-white
        const colorOrange = new THREE.Color('#ff8a5c'); // Orange-red

        const branches = 2; // Two main spiral arms
        const radius = 60;
        const spin = 1.2;
        const randomness = 1.8;
        const randomnessPower = 3;

        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;

            const r = Math.random() * radius;
            // Exponential distribution so more stars are near the center
            const distance = Math.pow(Math.random(), 2.5) * radius;

            const spinAngle = distance * spin;
            const branchAngle = ((i % branches) / branches) * Math.PI * 2;

            const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
            const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r * 0.15; // Flatter Y
            const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;

            positions[i3] = Math.cos(branchAngle + spinAngle) * distance + randomX;
            positions[i3 + 1] = randomY;
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * distance + randomZ;

            // Color Mixing
            const mixedColor = colorInside.clone();

            if (distance < 5) {
                // Intensely golden/warm center
                mixedColor.lerp(new THREE.Color('#ffffff'), Math.random() * 0.4);
            } else {
                const mixRatio = distance / radius;
                if (Math.random() > 0.4) {
                    mixedColor.lerp(colorBlue, mixRatio + Math.random() * 0.2);
                } else {
                    mixedColor.lerp(colorOrange, mixRatio + Math.random() * 0.2);
                }
            }

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }

        return [positions, colors];
    }, []);

    useFrame((_, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * 0.02; // Slow elegant rotation
        }
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y += delta * 0.015;
        }
    });

    return (
        <group>
            {/* 200,000 Star Particles */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[positions, 3]}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        args={[colors, 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.06}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    vertexColors={true}
                    transparent
                    opacity={0.9}
                />
            </points>

            {/* Glowing Golden Core */}
            <pointLight position={[0, 0, 0]} color="#ffe28a" intensity={500} distance={100} decay={2} />
            <ambientLight intensity={0.1} />

            {/* Faint Purple/Pink Nebula Clouds */}
            <group ref={cloudsRef}>
                {[...Array(40)].map((_, i) => {
                    // Distribute clouds mostly near the center and arms
                    const distance = Math.random() * 40;
                    const angle = Math.random() * Math.PI * 2;
                    const height = (Math.random() - 0.5) * 5;
                    const x = Math.cos(angle) * distance;
                    const z = Math.sin(angle) * distance;

                    return (
                        <Billboard key={i} position={[x, height, z]}>
                            <mesh>
                                <planeGeometry args={[25, 25]} />
                                <meshBasicMaterial
                                    color={Math.random() > 0.5 ? '#8a2be2' : '#ff1493'} // Purple or Pink
                                    transparent
                                    opacity={0.015}
                                    depthWrite={false}
                                    blending={THREE.AdditiveBlending}
                                />
                            </mesh>
                        </Billboard>
                    );
                })}
            </group>
        </group>
    );
}
