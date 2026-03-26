import { useMemo } from 'react';
import * as THREE from 'three';

export default function MilkyWayBand() {
    const count = 15000;

    const [positions] = useMemo(() => {
        const pos = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            // Elongated band logic
            const angle = (Math.random() - 0.5) * 4.0; // Span
            const dist = (Math.random() - 0.5) * 50.0; // Width of band
            const depth = -800 + (Math.random() - 0.5) * 200; // Far background

            // Rotate band diagonally
            const x = angle * 200 + dist;
            const y = angle * 100 + (Math.random() - 0.5) * 40.0;

            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = depth;
        }
        return [pos];
    }, []);

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={1.5}
                color="#88ccff"
                transparent
                opacity={0.05}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                sizeAttenuation={true}
            />
        </points>
    );
}
