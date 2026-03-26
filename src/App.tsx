import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
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
  const [lighting, setLighting] = useState({ bloom: 1.2, sun: 1.0, earth: 1.0 });

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000005' }}>
      <SectionLabels currentSection={currentSection} />
      <AmbientSound />

      <Canvas
        shadows
        camera={{ position: [0, 25, 60], fov: 60 }}
        gl={{ antialias: false, stencil: false, depth: true }}
      >
        {/* Background transition to true Landing black #000008 */}
        <color attach="background" args={[lighting.sun < 0.1 ? '#07090f' : '#000005']} />

        <ScrollControls pages={10} damping={0.3}>
          <SceneController
            onSectionChange={setCurrentSection}
            onLightingChange={setLighting}
          />

          <RealisticStars />
          <MilkyWayBand />
          <AmbientDust />

          <SolarSystem visibility={lighting.sun} />
          <EarthOrbit visibility={lighting.earth} />
          <MumbaiNight />

          {/* Business Content Overlay */}
          <Scroll html>
            <div style={{ width: '100vw' }}>
              {/* Spacer to push content to the bottom of the scroll (The Landing section) */}
              <div style={{ height: '900vh' }} />
              <BusinessHome />
            </div>
          </Scroll>

          {/* Post Processing */}
          <EffectComposer>
            <Bloom
              intensity={lighting.bloom}
              luminanceThreshold={0.3}
              luminanceSmoothing={0.9}
              radius={0.4}
            />
          </EffectComposer>
        </ScrollControls>
      </Canvas>
    </div>
  );
}


export default App;
