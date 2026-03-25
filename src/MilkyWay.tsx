import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function MilkyWay() {
    const pointsRef = useRef<THREE.Points>(null);
    const coreSpriteRef = useRef<THREE.Sprite>(null);

    const isMobile = window.innerWidth < 768;
    const particlesCount = isMobile ? 60000 : 150000;

    const [positions, colors] = useMemo(() => {
        const positions = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);

        const colorInside = new THREE.Color('#ffebb8');
        const colorBlue = new THREE.Color('#a8c7ff');
        const colorOrange = new THREE.Color('#ff8a5c');

        const branches = 4; // More defined arms
        const radius = 70;
        const spin = 1.0;

        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;

            // Exponential distribution for core density
            const distance = Math.pow(Math.random(), 3.0) * radius;

            const spinAngle = distance * spin;
            const branchAngle = ((i % branches) / branches) * Math.PI * 2;

            // Tighter spirals
            const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3;
            const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 1.5;
            const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 3;

            positions[i3] = Math.cos(branchAngle + spinAngle) * distance + randomX;
            positions[i3 + 1] = randomY;
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * distance + randomZ;

            // Improved Color Mixing
            const mixedColor = colorInside.clone();
            const mixRatio = distance / radius;

            if (Math.random() > 0.6) {
                mixedColor.lerp(colorBlue, mixRatio);
            } else {
                mixedColor.lerp(colorOrange, mixRatio);
            }

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }

        return [positions, colors];
    }, [particlesCount]);

    useFrame((_, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * 0.01;
        }
        if (coreSpriteRef.current) {
            coreSpriteRef.current.scale.setScalar(20 + Math.sin(Date.now() * 0.001) * 2);
        }
    });

    return (
        <group>
            {/* 150,000 Dense Particles */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                    <bufferAttribute attach="attributes-color" args={[colors, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    size={0.08}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    vertexColors={true}
                    transparent
                    opacity={0.8}
                />
            </points>

            {/* Glowing Additive Core */}
            <sprite ref={coreSpriteRef as any} position={[0, 0, 0]}>
                <spriteMaterial
                    blending={THREE.AdditiveBlending}
                    color="#ffcc88"
                    transparent
                    opacity={0.6}
                />
            </sprite>

            <pointLight color="#ffaa00" intensity={1000} distance={50} decay={2} />
        </group>
    );
}
