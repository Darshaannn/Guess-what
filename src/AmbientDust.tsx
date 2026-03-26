import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function AmbientDust() {
    const count = 500;
    const pointsRef = useRef<THREE.Points>(null);

    const particles = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 100;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 100;

            velocities[i * 3] = (Math.random() - 0.5) * 0.05;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
        }
        return { pos, velocities };
    }, []);

    useFrame(() => {
        if (!pointsRef.current) return;
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < count; i++) {
            positions[i * 3] += particles.velocities[i * 3];
            positions[i * 3 + 1] += particles.velocities[i * 3 + 1];
            positions[i * 3 + 2] += particles.velocities[i * 3 + 2];

            // Wrap around
            if (Math.abs(positions[i * 3]) > 50) positions[i * 3] *= -0.9;
            if (Math.abs(positions[i * 3 + 1]) > 50) positions[i * 3 + 1] *= -0.9;
            if (Math.abs(positions[i * 3 + 2]) > 50) positions[i * 3 + 2] *= -0.9;
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[particles.pos, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#ffffff"
                transparent
                opacity={0.3}
                sizeAttenuation={true}
                depthWrite={false}
            />
        </points>
    );
}
