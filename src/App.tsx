import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import RealisticStars from './RealisticStars';

function App() {
  console.log("Bare MVP App Rendering...");
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black' }}>
      <h1 style={{ color: 'white', position: 'absolute', zIndex: 100, pointerEvents: 'none', opacity: 0.5 }}>COSMIC ENGINE</h1>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <color attach="background" args={['#010105']} />
        <ambientLight intensity={0.5} />
        <RealisticStars />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;
