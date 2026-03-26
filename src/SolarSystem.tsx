import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// --- SHADERS ---

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

  // Simple 3D noise/fbm for plasma
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - p.xzw * n_;
    vec4 j = p - 49.0 * floor(p * (1.0 / 49.0));
    vec4 x_ = floor(j * n_);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    float n = snoise(vPosition * 0.4 + time * 0.1);
    n += 0.5 * snoise(vPosition * 0.8 + time * 0.2);
    n += 0.25 * snoise(vPosition * 1.6 + time * 0.4);
    
    // Remap noise to [0, 1]
    float plasma = (n + 1.0) * 0.5;

    // Palette: Deep red to bright yellow
    vec3 deepRed = vec3(0.5, 0.0, 0.0);
    vec3 brightOrange = vec3(1.0, 0.4, 0.0);
    vec3 brightYellow = vec3(1.0, 0.9, 0.2);
    
    vec3 color = mix(deepRed, brightOrange, plasma);
    color = mix(color, brightYellow, pow(plasma, 3.0));

    // Fresnel glow at edges
    float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
    color += brightOrange * fresnel * 1.2;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const coronaVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const coronaFragmentShader = `
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
    gl_FragColor = vec4(1.0, 0.4, 0.0, 1.0) * intensity;
  }
`;

// --- COMPONENTS ---

export default function SolarSystem() {
    const systemGroup = useRef<THREE.Group>(null);
    const asteroidsRef = useRef<THREE.Points>(null);
    const uniforms = useMemo(() => ({ time: { value: 0 } }), []);

    useFrame((state, delta) => {
        uniforms.time.value = state.clock.elapsedTime;
        if (systemGroup.current) {
            systemGroup.current.rotation.y += delta * 0.03;
        }
        if (asteroidsRef.current) {
            asteroidsRef.current.rotation.y -= delta * 0.05;
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

    const asteroidCount = 3000;
    const [asteroidPos, asteroidCol] = useMemo(() => {
        const pos = new Float32Array(asteroidCount * 3);
        const col = new Float32Array(asteroidCount * 3);
        for (let i = 0; i < asteroidCount; i++) {
            const i3 = i * 3;
            const angle = Math.random() * Math.PI * 2;
            const r = 29.5 + (Math.random() - 0.5) * 4;
            pos[i3] = Math.cos(angle) * r;
            pos[i3 + 1] = (Math.random() - 0.5) * 1.5;
            pos[i3 + 2] = Math.sin(angle) * r;
            const c = 0.5 + Math.random() * 0.3;
            col[i3] = col[i3 + 1] = col[i3 + 2] = c;
        }
        return [pos, col];
    }, []);

    const flareRotations = useMemo(() => [
        [0, 0, 0], [Math.PI / 2, 0, 0], [0, Math.PI / 2, 0],
        [Math.PI / 4, Math.PI / 4, 0], [-Math.PI / 4, 0, Math.PI / 4]
    ], []);

    return (
        <group position={[0, -20, -250]} ref={systemGroup}>
            {/* 1. THE SUN SURFACE */}
            <mesh>
                <sphereGeometry args={[5, 64, 64]} />
                <shaderMaterial
                    vertexShader={sunVertexShader}
                    fragmentShader={sunFragmentShader}
                    uniforms={uniforms}
                />
            </mesh>

            {/* 2. INNER CORONA GLOW */}
            <mesh scale={[1.15, 1.15, 1.15]}>
                <sphereGeometry args={[5, 64, 64]} />
                <shaderMaterial
                    vertexShader={coronaVertexShader}
                    fragmentShader={coronaFragmentShader}
                    side={THREE.BackSide}
                    transparent
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* 3. OUTER SOLAR WIND GLOW */}
            <mesh scale={[2.5, 2.5, 2.5]}>
                <sphereGeometry args={[5, 64, 64]} />
                <shaderMaterial
                    vertexShader={coronaVertexShader}
                    fragmentShader={coronaFragmentShader}
                    side={THREE.BackSide}
                    transparent
                    opacity={0.3}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* 4. SOLAR FLARE SPIKES */}
            {flareRotations.map((rot: any, i) => (
                <SolarFlare key={i} rotation={rot} time={uniforms.time} />
            ))}

            {/* 5. ENHANCED SUN LIGHT SOURCE */}
            <pointLight color="#ff8800" intensity={3000} distance={500} decay={1.5} />

            {/* Planets & Belt */}
            {planets.map((planet, index) => (
                <PlanetOrbit key={index} planet={planet} />
            ))}
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

function SolarFlare({ rotation, time }: { rotation: number[], time: { value: number } }) {
    const flareShader = {
        uniforms: { time },
        vertexShader: `
            varying vec2 vUv;
            uniform float time;
            void main() {
                vUv = uv;
                vec3 pos = position;
                // Wave distortion if needed
                float wave = sin(pos.y * 2.0 + time * 3.0) * 0.1;
                pos.x += wave;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            void main() {
                float dist = 1.0 - abs(vUv.x - 0.5) * 2.0;
                float alpha = pow(dist, 3.0) * (1.0 - vUv.y);
                gl_FragColor = vec4(1.0, 0.5, 0.0, alpha * 0.8);
            }
        `
    };

    return (
        <group rotation={rotation as any}>
            <mesh position={[0, 8, 0]}>
                <planeGeometry args={[1, 10, 32, 32]} />
                <shaderMaterial
                    {...flareShader}
                    transparent
                    blending={THREE.AdditiveBlending}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                />
            </mesh>
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
            <group rotation={[0, Math.random() * Math.PI * 2, 0]}>
                <group position={[planet.distance, 0, 0]}>
                    <mesh>
                        <sphereGeometry args={[planet.radius, 32, 32]} />
                        <meshStandardMaterial color={planet.color} roughness={0.7} metalness={0.1} emissive={planet.color} emissiveIntensity={0.05} />
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
