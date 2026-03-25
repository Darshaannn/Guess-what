import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const sunVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const sunFragmentShader = `
  uniform float time;
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;

  // Simple noise function
  float noise(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
  }

  void main() {
    float n = noise(vPosition * 5.0 + time * 0.2);
    // Orange, yellow, red plasma
    vec3 color = mix(vec3(1.0, 0.3, 0.0), vec3(1.0, 0.8, 0.1), n);
    
    // Corona glow (Fresnel-like)
    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    vec3 glow = vec3(1.0, 0.4, 0.0) * intensity * 1.5;
    
    gl_FragColor = vec4(color + glow, 1.0);
  }
`;

export default function SolarSystem() {
    const systemGroup = useRef<THREE.Group>(null);
    const asteroidsRef = useRef<THREE.Points>(null);
    const uniforms = useMemo(() => ({ time: { value: 0 } }), []);

    useFrame((_, delta) => {
        uniforms.time.value += delta;
        if (systemGroup.current) {
            systemGroup.current.rotation.y += delta * 0.03;
        }
        if (asteroidsRef.current) {
            asteroidsRef.current.rotation.y -= delta * 0.05; // asteriods orbit slowly
        }
    });

    const planets = [
        { name: 'Mercury', radius: 0.4, distance: 9, speed: 0.8, color: '#888888' },
        { name: 'Venus', radius: 0.9, distance: 13, speed: 0.6, color: '#e3bb76' },
        { name: 'Earth', radius: 1, distance: 18, speed: 0.5, color: '#2b82c9' },
        { name: 'Mars', radius: 0.6, distance: 23, speed: 0.4, color: '#c1440e' },
        { name: 'Jupiter', radius: 2.8, distance: 36, speed: 0.2, color: '#d39c7e' },
        { name: 'Saturn', radius: 2.4, distance: 48, speed: 0.15, color: '#ead6b8', hasRings: true },
        { name: 'Uranus', radius: 1.6, distance: 60, speed: 0.1, color: '#d1e7e7' },
        { name: 'Neptune', radius: 1.5, distance: 72, speed: 0.08, color: '#5b5ddf' },
    ];

    // Asteroid belt (between Mars at 23 and Jupiter at 36 -> ~29.5 radius)
    const asteroidCount = 3000;
    const [asteroidPos, asteroidCol] = useMemo(() => {
        const pos = new Float32Array(asteroidCount * 3);
        const col = new Float32Array(asteroidCount * 3);
        for (let i = 0; i < asteroidCount; i++) {
            const i3 = i * 3;
            const angle = Math.random() * Math.PI * 2;
            const r = 29.5 + (Math.random() - 0.5) * 4; // asteroid belt spread
            pos[i3] = Math.cos(angle) * r;
            pos[i3 + 1] = (Math.random() - 0.5) * 1.5;
            pos[i3 + 2] = Math.sin(angle) * r;

            // random grayish rocks
            const c = 0.5 + Math.random() * 0.3;
            col[i3] = col[i3 + 1] = col[i3 + 2] = c;
        }
        return [pos, col];
    }, []);

    return (
        <group position={[0, -20, -250]} ref={systemGroup}>
            {/* The Sun */}
            <mesh>
                <sphereGeometry args={[5, 64, 64]} />
                <shaderMaterial
                    vertexShader={sunVertexShader}
                    fragmentShader={sunFragmentShader}
                    uniforms={uniforms}
                />
            </mesh>

            {/* Sun Light Source */}
            <pointLight color="#ffebb8" intensity={500} distance={300} decay={2} />

            {/* Planets */}
            {planets.map((planet, index) => (
                <PlanetOrbit key={index} planet={planet} />
            ))}

            {/* Asteroid Belt */}
            <points ref={asteroidsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[asteroidPos, 3]} />
                    <bufferAttribute attach="attributes-color" args={[asteroidCol, 3]} />
                </bufferGeometry>
                <pointsMaterial size={0.12} vertexColors transparent opacity={0.8} />
            </points>
        </group>
    );
}

function PlanetOrbit({ planet }: { planet: any }) {
    const orbitRef = useRef<THREE.Group>(null);

    useFrame((_, delta) => {
        if (orbitRef.current) {
            orbitRef.current.rotation.y += delta * planet.speed;
        }
    });

    return (
        <group ref={orbitRef}>
            {/* Add a random starting angle for each planet so they aren't lined up */}
            <group rotation={[0, Math.random() * Math.PI * 2, 0]}>
                <group position={[planet.distance, 0, 0]}>
                    <mesh>
                        <sphereGeometry args={[planet.radius, 32, 32]} />
                        <meshStandardMaterial color={planet.color} roughness={0.7} metalness={0.1} />
                    </mesh>
                    {planet.hasRings && (
                        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
                            <ringGeometry args={[planet.radius * 1.4, planet.radius * 2.2, 64]} />
                            <meshStandardMaterial color="#c5ab6e" transparent opacity={0.6} side={THREE.DoubleSide} />
                        </mesh>
                    )}
                </group>
            </group>
        </group>
    );
}
