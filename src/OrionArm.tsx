import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Html, useScroll } from '@react-three/drei';
import * as THREE from 'three';

export default function OrionArm() {
    const starsRef = useRef<THREE.Points>(null);
    const fastStarsRef = useRef<THREE.Points>(null);
    const scroll = useScroll();
    const [data, setData] = useState<{ pos: Float32Array; col: Float32Array } | null>(null);

    const isMobile = window.innerWidth < 768;
    const clusterCount = isMobile ? 50000 : 80000;

    useEffect(() => {
        const worker = new Worker('/galaxyWorker.js');
        worker.onmessage = (e) => {
            setData({ pos: e.data.positions, col: e.data.colors });
            worker.terminate();
        };
        // Orion arm has different color mixing/spread but we can reuse the engine
        worker.postMessage({
            particlesCount: clusterCount,
            branches: 2,
            radius: 80,
            spin: 0.5
        });
        return () => {
            worker.terminate();
            if (starsRef.current) starsRef.current.geometry.dispose();
            if (fastStarsRef.current) fastStarsRef.current.geometry.dispose();
        };
    }, [clusterCount]);

    // Streak stars (Warp speed lines) - static generation is fine for small counts
    const streakCount = isMobile ? 200 : 500;
    const streakVertices = useMemo(() => {
        const v = new Float32Array(streakCount * 3);
        for (let i = 0; i < streakCount; i++) {
            v[i * 3] = (Math.random() - 0.5) * 50;
            v[i * 3 + 1] = (Math.random() - 0.5) * 50;
            v[i * 3 + 2] = (Math.random() - 0.5) * 200;
        }
        return v;
    }, [streakCount]);

    useFrame(() => {
        const offset = scroll.offset;
        if (starsRef.current) {
            starsRef.current.position.z = (offset * 150) % 100;
        }

        if (fastStarsRef.current) {
            // Logic from P1 to P2 transition (approx offset 0 to 0.2 now with 10 pages)
            const p = Math.min(offset / 0.2, 1.0);
            const warp = Math.sin(p * Math.PI) * 20;
            fastStarsRef.current.position.z = (offset * 800) % 200;
            fastStarsRef.current.scale.z = 1 + warp;
        }
    });

    if (!data) return null;

    return (
        <group position={[0, -5, -120]}>
            <points ref={starsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
                    <bufferAttribute attach="attributes-color" args={[data.col, 3]} />
                </bufferGeometry>
                <pointsMaterial size={0.06} vertexColors transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} />
            </points>

            <points ref={fastStarsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[streakVertices, 3]} />
                </bufferGeometry>
                <pointsMaterial size={0.15} color="#ffffff" transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
            </points>

            <group>
                {[...Array(isMobile ? 10 : 20)].map((_, i) => {
                    const type = Math.random();
                    const color = type > 0.6 ? '#ff1493' : (type > 0.3 ? '#ff0000' : '#00bfff');
                    return (
                        <Billboard key={i} position={[(Math.random() - 0.5) * 60, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 80]}>
                            <mesh>
                                <planeGeometry args={[25, 25]} />
                                <meshBasicMaterial color={color} transparent opacity={0.04} depthWrite={false} blending={THREE.AdditiveBlending} />
                            </mesh>
                        </Billboard>
                    );
                })}
            </group>

            <group position={[3, 1, 15]}>
                <pointLight color="#ffffff" intensity={200} distance={15} decay={2} />
                <mesh><sphereGeometry args={[0.2, 16, 16]} /><meshBasicMaterial color="#ffffff" /></mesh>
                <Html center position={[0, 1.5, 0]} className="pointer-events-none">
                    <div className="flex flex-col items-center animate-bounce">
                        <div className="text-white text-[10px] md:text-xs tracking-widest font-bold whitespace-nowrap mb-1 drop-shadow-[0_0_8px_rgba(255,255,255,1)]">YOU ARE HERE</div>
                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white drop-shadow-[0_0_5px_rgba(255,255,255,1)]"></div>
                    </div>
                </Html>
            </group>
        </group>
    );
}
