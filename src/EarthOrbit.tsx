import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const atmosphereVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
    gl_FragColor = vec4(0.2, 0.5, 1.0, 1.0) * intensity * 1.5;
  }
`;

const cloudVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const cloudFragmentShader = `
  uniform float time;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    float n = random(vUv * 15.0 + time * 0.02);
    // Simple noisy pattern to represent clouds over night
    float alpha = smoothstep(0.7, 1.0, n) * 0.4;
    gl_FragColor = vec4(0.9, 0.9, 1.0, alpha);
  }
`;

export default function EarthOrbit() {
    const earthRef = useRef<THREE.Group>(null);
    const cloudsRef = useRef<THREE.Mesh>(null);
    const moonOrbitRef = useRef<THREE.Group>(null);
    const indiaHighlightRef = useRef<THREE.Mesh>(null);

    // Automatically fallback to a procedural coloring if the texture isn't ready
    const earthMap = useTexture('/assets/earth_night.png');
    if (earthMap) earthMap.colorSpace = THREE.SRGBColorSpace;

    const cloudUniforms = useMemo(() => ({ time: { value: 0 } }), []);

    useFrame((_, delta) => {
        cloudUniforms.time.value += delta;
        if (earthRef.current) {
            earthRef.current.rotation.y += delta * 0.05; // Earth auto-rotates slowly
        }
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y += delta * 0.07; // Clouds rotate faster
        }
        if (moonOrbitRef.current) {
            moonOrbitRef.current.rotation.y += delta * 0.02; // Moon orbits
        }
        if (indiaHighlightRef.current) {
            (indiaHighlightRef.current.material as THREE.Material).opacity = 0.5 + Math.sin(Date.now() * 0.003) * 0.5;
        }
    });

    return (
        <group position={[0, -25, -300]}>
            {/* Earth Group */}
            <group ref={earthRef}>
                <mesh>
                    <sphereGeometry args={[12, 64, 64]} />
                    <meshStandardMaterial map={earthMap} color={earthMap ? '#ffffff' : '#03122c'} roughness={0.7} metalness={0.1} />
                </mesh>

                {/* Inner Atmosphere (Haze) */}
                <mesh>
                    <sphereGeometry args={[12.2, 64, 64]} />
                    <shaderMaterial
                        vertexShader={atmosphereVertexShader}
                        fragmentShader={atmosphereFragmentShader}
                        blending={THREE.AdditiveBlending}
                        transparent={true}
                        depthWrite={false}
                        side={THREE.BackSide}
                    />
                </mesh>

                {/* Outer Rim Glow */}
                <mesh scale={[1.1, 1.1, 1.1]}>
                    <sphereGeometry args={[12, 64, 64]} />
                    <shaderMaterial
                        vertexShader={atmosphereVertexShader}
                        fragmentShader={atmosphereFragmentShader}
                        blending={THREE.AdditiveBlending}
                        transparent={true}
                        depthWrite={false}
                        side={THREE.BackSide}
                    />
                </mesh>

                {/* Clouds */}
                <mesh ref={cloudsRef} scale={[1.025, 1.025, 1.025]}>
                    <sphereGeometry args={[12, 64, 64]} />
                    <shaderMaterial
                        vertexShader={cloudVertexShader}
                        fragmentShader={cloudFragmentShader}
                        uniforms={cloudUniforms}
                        transparent={true}
                        depthWrite={false}
                    />
                </mesh>

                {/* India Golden Pulse */}
                <mesh ref={indiaHighlightRef as any} position={[8, 4, 8]}>
                    <sphereGeometry args={[0.5, 16, 16]} />
                    <meshBasicMaterial color="#ffcc00" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthTest={false} />
                    <pointLight color="#ffcc00" intensity={50} distance={15} />
                </mesh>
            </group>

            {/* Moon Orbit */}
            <group ref={moonOrbitRef}>
                <mesh position={[40, 5, 0]}>
                    <sphereGeometry args={[3, 32, 32]} />
                    <meshStandardMaterial color="#aaaaaa" roughness={0.9} />
                </mesh>
            </group>

            {/* External Lightning */}
            <directionalLight position={[100, 20, 50]} intensity={1.5} color="#ffffff" />
            <ambientLight color="#111122" intensity={0.4} />
        </group>
    );
}
