import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import RealisticStars from './RealisticStars';
import MilkyWayBand from './MilkyWayBand';
import AmbientDust from './AmbientDust';
import SectionLabels from './SectionLabels';
import SceneController from './SceneController';
import SolarSystem from './SolarSystem';
import EarthOrbit from './EarthOrbit';
import MumbaiNight from './MumbaiNight';
import BusinessHome from './BusinessHome';
import AmbientSound from './AmbientSound';

function App() {
  const [currentSection, setCurrentSection] = useState("Deep Space");

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000005' }}>
      <SectionLabels currentSection={currentSection} />
      <AmbientSound />

      <Canvas
        shadows
        camera={{ position: [0, 25, 60], fov: 60 }}
        gl={{ antialias: false, stencil: false, depth: true }}
      >
        <color attach="background" args={['#000005']} />

        <ScrollControls pages={10} damping={0.3}>
          <SceneController onSectionChange={setCurrentSection} />

          <RealisticStars />
          <MilkyWayBand />
          <AmbientDust />

          <SolarSystem />
          <EarthOrbit />
          <MumbaiNight />

          {/* Post Processing */}
          <EffectComposer>
            <Bloom
              intensity={1.2}
              luminanceThreshold={0.3}
              luminanceSmoothing={0.9}
              radius={0.4}
            />
          </EffectComposer>
        </ScrollControls>
      </Canvas>

      <BusinessHome />
    </div>
  );
}

export default App;

