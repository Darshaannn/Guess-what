import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// 1. Inner Atmosphere Haze
const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
    gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
  }
`;

// 2. Outer Fresnel Rim Glow
const fresnelVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fresnelFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - dot(normal, viewDir), 2.5);
    gl_FragColor = vec4(0.2, 0.4, 1.0, 1.0) * fresnel * 1.5;
  }
`;

export default function EarthOrbit() {
    const earthRef = useRef<THREE.Group>(null);
    const cloudsRef = useRef<THREE.Mesh>(null);
    const moonOrbitRef = useRef<THREE.Group>(null);
    const indiaHighlightRef = useRef<THREE.Mesh>(null);

    // NASA Earth Night Lights (Simulated high-res loading)
    const earthMap = useTexture('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_at_night_2048.google.png');
    const cloudMap = useTexture('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_2048.png');

    if (earthMap) earthMap.colorSpace = THREE.SRGBColorSpace;
    if (cloudMap) cloudMap.colorSpace = THREE.SRGBColorSpace;

    useFrame((_, delta) => {
        if (earthRef.current) {
            // Very slow rotation to simulate stability
            earthRef.current.rotation.y += delta * 0.02;
        }
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y += delta * 0.025; // Clouds move slightly faster
        }
        if (moonOrbitRef.current) {
            moonOrbitRef.current.rotation.y += delta * 0.01;
        }
        if (indiaHighlightRef.current) {
            // Gentle golden pulse
            const s = 1.0 + Math.sin(Date.now() * 0.002) * 0.1;
            indiaHighlightRef.current.scale.set(s, s, s);
            (indiaHighlightRef.current.material as THREE.MeshBasicMaterial).opacity = 0.4 + Math.sin(Date.now() * 0.002) * 0.3;
        }
    });

    return (
        <group position={[0, -25, -300]}>
            {/* Main Earth Group */}
            <group ref={earthRef} rotation={[0.4, 4.2, 0]}> {/* Pre-align to India roughly */}
                {/* Surface */}
                <mesh>
                    <sphereGeometry args={[12, 64, 64]} />
                    <meshStandardMaterial
                        map={earthMap}
                        emissiveMap={earthMap}
                        emissive={new THREE.Color('#333333')}
                        emissiveIntensity={1.5}
                        roughness={0.7}
                        metalness={0.2}
                    />
                </mesh>

                {/* Atmosphere Layer 1: Inner Haze */}
                <mesh>
                    <sphereGeometry args={[12.18, 64, 64]} />
                    <shaderMaterial
                        vertexShader={atmosphereVertexShader}
                        fragmentShader={atmosphereFragmentShader}
                        blending={THREE.AdditiveBlending}
                        transparent={true}
                        side={THREE.BackSide}
                    />
                </mesh>

                {/* Atmosphere Layer 2: Fresnel Rim */}
                <mesh scale={[1.15, 1.15, 1.15]}>
                    <sphereGeometry args={[12, 64, 64]} />
                    <shaderMaterial
                        vertexShader={fresnelVertexShader}
                        fragmentShader={fresnelFragmentShader}
                        blending={THREE.AdditiveBlending}
                        transparent={true}
                        side={THREE.BackSide}
                    />
                </mesh>

                {/* Clouds Layer */}
                <mesh ref={cloudsRef}>
                    <sphereGeometry args={[12.25, 64, 64]} />
                    <meshStandardMaterial
                        alphaMap={cloudMap}
                        transparent={true}
                        opacity={0.4}
                        depthWrite={false}
                    />
                </mesh>

                {/* India/Mumbai Pulse (GPS: 19.0760 N, 72.8777 E converted to sphere coords) */}
                <mesh ref={indiaHighlightRef as any} position={[8.1, 4.2, 8.5]}>
                    <sphereGeometry args={[0.6, 32, 32]} />
                    <meshBasicMaterial color="#ffaa00" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
                    <pointLight color="#ff8800" intensity={200} distance={15} decay={2} />
                </mesh>
            </group>

            {/* Moon */}
            <group ref={moonOrbitRef}>
                <mesh position={[60, 10, -40]}>
                    <sphereGeometry args={[2.5, 32, 32]} />
                    <meshStandardMaterial color="#888888" roughness={0.9} />
                </mesh>
            </group>

            {/* Cinematic Lighting */}
            <directionalLight position={[-100, 10, 50]} intensity={1.0} color="#6688ff" /> {/* Soft blue rim light */}
            <ambientLight color="#050510" intensity={0.2} />
        </group>
    );
}
