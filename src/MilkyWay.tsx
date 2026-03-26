import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function MilkyWay() {
    const groupRef = useRef<THREE.Group>(null);
    const pointsRef = useRef<THREE.Points>(null);
    const coreSpriteRef = useRef<THREE.Sprite>(null);
    const [data, setData] = useState<{ pos: Float32Array; col: Float32Array } | null>(null);

    const isMobile = window.innerWidth < 768;
    const particlesCount = isMobile ? 90000 : 150000;

    useEffect(() => {
        const worker = new Worker('/galaxyWorker.js');
        worker.onmessage = (e) => {
            setData({ pos: e.data.positions, col: e.data.colors });
            worker.terminate();
        };
        worker.postMessage({
            particlesCount,
            branches: 4,
            radius: 70,
            spin: 1.0
        });
        return () => {
            worker.terminate();
            if (pointsRef.current) {
                pointsRef.current.geometry.dispose();
            }
        };
    }, [particlesCount]);

    useFrame((_, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * 0.01;
        }
        if (coreSpriteRef.current) {
            coreSpriteRef.current.scale.setScalar(20 + Math.sin(Date.now() * 0.001) * 2);
        }
    });

    if (!data) return null;

    useEffect(() => {
        console.log("MilkyWay Mounted. Particle count:", particlesCount);
    }, []);

    return (
        <group ref={groupRef}>
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
                    <bufferAttribute attach="attributes-color" args={[data.col, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    size={isMobile ? 0.12 : 0.08}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    vertexColors={true}
                    transparent
                    opacity={0.8}
                />
            </points>

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
