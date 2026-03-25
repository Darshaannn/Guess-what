import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Html, useScroll } from '@react-three/drei';
import * as THREE from 'three';

export default function OrionArm() {
    const starsRef = useRef<THREE.Points>(null);
    const fastStarsRef = useRef<THREE.Points>(null);

    const scroll = useScroll();
    const isMobile = window.innerWidth < 768;
    const clusterCount = isMobile ? 30000 : 100000;

    const [positions, colors] = useMemo(() => {
        const pos = new Float32Array(clusterCount * 3);
        const col = new Float32Array(clusterCount * 3);

        for (let i = 0; i < clusterCount; i++) {
            const i3 = i * 3;
            pos[i3] = (Math.random() - 0.5) * 60;
            pos[i3 + 1] = (Math.random() - 0.5) * 30;
            pos[i3 + 2] = (Math.random() - 0.5) * 120; // Spread deeply

            const isBlue = Math.random() > 0.5;
            col[i3] = isBlue ? 0.3 + Math.random() * 0.5 : 0.8 + Math.random() * 0.2;
            col[i3 + 1] = isBlue ? 0.6 + Math.random() * 0.4 : 0.5 + Math.random() * 0.3;
            col[i3 + 2] = isBlue ? 1 : 0.4 + Math.random() * 0.3;
        }
        return [pos, col];
    }, []);

    const fastCount = 2000;
    const [fastPos, fastCol] = useMemo(() => {
        const pos = new Float32Array(fastCount * 3);
        const col = new Float32Array(fastCount * 3);
        for (let i = 0; i < fastCount; i++) {
            const i3 = i * 3;
            pos[i3] = (Math.random() - 0.5) * 40;
            pos[i3 + 1] = (Math.random() - 0.5) * 20;
            pos[i3 + 2] = (Math.random() - 0.5) * 200; // very spread out

            // mostly white/blue
            col[i3] = 0.8; col[i3 + 1] = 0.9; col[i3 + 2] = 1;
        }
        return [pos, col];
    }, []);

    useFrame(() => {
        const offset = scroll.offset;

        if (starsRef.current) {
            // Slower background parallax
            starsRef.current.position.z = (offset * 150) % 60;
        }
        if (fastStarsRef.current) {
            // Fast foreground parallax (warp streak feeling)
            fastStarsRef.current.position.z = (offset * 600) % 100;
        }
    });

    return (
        <group position={[0, -5, -120]}>
            {/* Background dense stars */}
            <points ref={starsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                    <bufferAttribute attach="attributes-color" args={[colors, 3]} />
                </bufferGeometry>
                <pointsMaterial size={0.06} vertexColors transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} />
            </points>

            {/* Foreground fast parallax stars */}
            <points ref={fastStarsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[fastPos, 3]} />
                    <bufferAttribute attach="attributes-color" args={[fastCol, 3]} />
                </bufferGeometry>
                <pointsMaterial size={0.12} vertexColors transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
            </points>

            {/* Red/Pink/Blue Nebula Clouds */}
            <group>
                {[...Array(25)].map((_, i) => {
                    const type = Math.random();
                    // Red/pink hydrogen or blue oxygen
                    const color = type > 0.6 ? '#ff1493' : (type > 0.3 ? '#ff0000' : '#00bfff');
                    return (
                        <Billboard key={i} position={[(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 60]}>
                            <mesh>
                                <planeGeometry args={[20 + Math.random() * 15, 20 + Math.random() * 15]} />
                                <meshBasicMaterial
                                    color={color}
                                    transparent opacity={0.05} depthWrite={false} blending={THREE.AdditiveBlending}
                                />
                            </mesh>
                        </Billboard>
                    );
                })}
            </group>

            {/* YOU ARE HERE Marker */}
            <group position={[3, 1, 15]}>
                <pointLight color="#ffffff" intensity={200} distance={15} decay={2} />
                <mesh>
                    <sphereGeometry args={[0.2, 16, 16]} />
                    <meshBasicMaterial color="#ffffff" />
                </mesh>

                <Html center position={[0, 1.5, 0]} className="pointer-events-none">
                    <div className="flex flex-col items-center animate-bounce">
                        <div className="text-white text-[10px] md:text-xs tracking-widest font-bold whitespace-nowrap mb-1 drop-shadow-[0_0_8px_rgba(255,255,255,1)]">
                            YOU ARE HERE
                        </div>
                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white drop-shadow-[0_0_5px_rgba(255,255,255,1)]"></div>
                    </div>
                </Html>
            </group>
        </group>
    );
}
