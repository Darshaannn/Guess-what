import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

function App() {
  console.log("Bare MVP App Rendering...");
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'navy' }}>
      <h1 style={{ color: 'white', position: 'absolute', zIndex: 100 }}>MVP RENDERING TEST</h1>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <color attach="background" args={['#000022']} />
        <ambientLight intensity={0.5} />
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="orange" />
        </mesh>
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;
