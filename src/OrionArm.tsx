import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Html, useScroll } from '@react-three/drei';
import * as THREE from 'three';

export default function OrionArm() {
    const starsRef = useRef<THREE.Points>(null);
    const fastStarsRef = useRef<THREE.Points>(null);
    const scroll = useScroll();

    const isMobile = window.innerWidth < 768;
    const clusterCount = isMobile ? 30000 : 80000;

    const [positions, colors] = useMemo(() => {
        const pos = new Float32Array(clusterCount * 3);
        const col = new Float32Array(clusterCount * 3);
        for (let i = 0; i < clusterCount; i++) {
            const i3 = i * 3;
            pos[i3] = (Math.random() - 0.5) * 80;
            pos[i3 + 1] = (Math.random() - 0.5) * 40;
            pos[i3 + 2] = (Math.random() - 0.5) * 150;
            const isBlue = Math.random() > 0.5;
            col[i3] = isBlue ? 0.3 + Math.random() * 0.5 : 0.8 + Math.random() * 0.2;
            col[i3 + 1] = isBlue ? 0.6 + Math.random() * 0.4 : 0.5 + Math.random() * 0.3;
            col[i3 + 2] = isBlue ? 1 : 0.4 + Math.random() * 0.3;
        }
        return [pos, col];
    }, [clusterCount]);

    // Streak stars (Warp speed lines)
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

        // Warp speed logic: stretch stars into lines when scrolling fast between P1 and P2
        // We can simulate this by scaling the star group or modifying shader.
        // Simplifying: Increase Z velocity significantly during transition.

        if (starsRef.current) {
            starsRef.current.position.z = (offset * 150) % 100;
        }

        if (fastStarsRef.current) {
            // Transition range p(0 to 0.125)
            const p = Math.min(offset / 0.125, 1.0);
            const warp = Math.sin(p * Math.PI) * 20; // Warp stretch factor

            fastStarsRef.current.position.z = (offset * 800) % 200;
            fastStarsRef.current.scale.z = 1 + warp; // Visual stretch
        }
    });

    return (
        <group position={[0, -5, -120]}>
            {/* Dense Background */}
            <points ref={starsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                    <bufferAttribute attach="attributes-color" args={[colors, 3]} />
                </bufferGeometry>
                <pointsMaterial size={0.06} vertexColors transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} />
            </points>

            {/* Warp Streak Particles */}
            <points ref={fastStarsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[streakVertices, 3]} />
                </bufferGeometry>
                <pointsMaterial size={0.15} color="#ffffff" transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
            </points>

            {/* Nebulas */}
            <group>
                {[...Array(20)].map((_, i) => {
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

            {/* YOU ARE HERE */}
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
