import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import MilkyWay from './MilkyWay';
import OrionArm from './OrionArm';
import SolarSystem from './SolarSystem';
import EarthOrbit from './EarthOrbit';
import MumbaiNight from './MumbaiNight';
import SceneController from './SceneController';
import BusinessHome from './BusinessHome';

function App() {
  return (
    <div className="w-full h-screen bg-black relative">
      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 25, 60], fov: 60 }} gl={{ antialias: false }}>
        <color attach="background" args={['#000000']} />

        <ScrollControls pages={8} damping={0.25} distance={1.2}>
          <SceneController />

          <MilkyWay />
          <OrionArm />
          <SolarSystem />
          <EarthOrbit />
          <MumbaiNight />

          {/* HTML Scroll Content matching pages */}
          <Scroll html style={{ width: '100vw' }}>
            {/* Page 1 (Section 1: Milky Way) */}
            <div className="absolute top-0 left-0 w-full h-screen flex justify-center items-start pt-12 pointer-events-none">
              <h1 className="text-white font-light text-center text-sm md:text-lg lg:text-xl tracking-[0.3em] uppercase opacity-90 drop-shadow-lg">
                The Milky Way — 100,000 Light Years Across
              </h1>
            </div>

            {/* Page 2 (Section 2: Orion Arm) */}
            <div className="absolute top-[100vh] left-0 w-full h-screen flex justify-center items-end pb-24 pointer-events-none">
              <h1 className="text-white font-light text-center text-sm md:text-lg lg:text-xl tracking-[0.3em] uppercase opacity-90 drop-shadow-lg shadow-black">
                Orion Arm — 26,000 Light Years From The Core
              </h1>
            </div>

            {/* Page 3 (Section 3: Solar System) */}
            <div className="absolute top-[200vh] left-0 w-full h-screen flex justify-center items-start pt-24 pointer-events-none">
              <h1 className="text-white font-light text-center text-sm md:text-lg lg:text-xl tracking-[0.3em] uppercase opacity-90 drop-shadow-lg shadow-black">
                Our Solar System — 8 Planets — 1 Star
              </h1>
            </div>

            {/* Page 4 (Section 4: Earth) */}
            <div className="absolute top-[300vh] left-0 w-full h-screen flex justify-center items-end pb-32 pointer-events-none">
              <h1 className="text-white font-light text-center text-sm md:text-lg lg:text-xl tracking-[0.3em] uppercase opacity-90 drop-shadow-lg shadow-black">
                Planet Earth — Home · Population 8 Billion
              </h1>
            </div>

            {/* Page 5 (Section 5: Mumbai) */}
            <div className="absolute top-[400vh] left-0 w-full h-screen flex justify-center items-start pt-32 pointer-events-none">
              <h1 className="text-white font-light text-center text-sm md:text-lg lg:text-xl tracking-[0.3em] uppercase opacity-90 drop-shadow-lg shadow-black">
                Mumbai — 18.9°N 72.8°E — City of Dreams
              </h1>
            </div>

            {/* Page 6-8 (Section 6: Business Homepage) */}
            <div className="absolute top-[500vh] left-0 w-full">
              <BusinessHome />
            </div>
          </Scroll>
        </ScrollControls>

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.1}
            mipmapBlur
            intensity={1.2}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

export default App;
