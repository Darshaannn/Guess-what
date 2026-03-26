import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import EarthParticles from './EarthParticles';

export default function EarthOrbit() {
    const moonOrbitRef = useRef<THREE.Group>(null);

    useFrame((_, delta) => {
        if (moonOrbitRef.current) {
            moonOrbitRef.current.rotation.y += delta * 0.01;
        }
    });

    return (
        <group position={[0, -25, -300]}>
            {/* 1. New Particle Earth */}
            <EarthParticles />

            {/* 2. Moon */}
            <group ref={moonOrbitRef}>
                <mesh position={[60, 10, -40]}>
                    <sphereGeometry args={[2.5, 32, 32]} />
                    <meshStandardMaterial color="#888888" roughness={0.9} />
                </mesh>
            </group>

            {/* Cinematic Lighting */}
            <directionalLight position={[-100, 10, 50]} intensity={1.0} color="#6688ff" />
            <ambientLight color="#050510" intensity={0.2} />
        </group>
    );
}

