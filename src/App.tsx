import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

import MilkyWay from './MilkyWay';
import OrionArm from './OrionArm';
import SolarSystem from './SolarSystem';
import EarthOrbit from './EarthOrbit';
import MumbaiNight from './MumbaiNight';
import SceneController from './SceneController';
import BusinessHome from './BusinessHome';

/**
 * Vertical Progress Dots component
 */
function ProgressIndicator({ totalSections }: { totalSections: number }) {
  const scroll = useScroll();
  const [active, setActive] = useState(0);

  useFrame(() => {
    // 0 to 1 scroll range
    const current = Math.floor(scroll.offset * (totalSections - 0.5));
    if (current !== active) setActive(current);
  });

  const handleClick = (index: number) => {
    const sectionHeight = 1 / (totalSections - 1);
    const targetOffset = index * sectionHeight;
    // We map 0-1 offset to actual scroll height
    const el = scroll.el;
    el.scrollTo({
      top: targetOffset * (el.scrollHeight - el.clientHeight),
      behavior: 'smooth'
    });
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
      {Array.from({ length: totalSections }).map((_, i) => (
        <button
          key={i}
          onClick={() => handleClick(i)}
          className={`w-3 h-3 rounded-full transition-all duration-500 border border-white/30 ${active === i ? 'bg-white scale-125 shadow-[0_0_10px_white]' : 'bg-white/20'
            }`}
          aria-label={`Go to section ${i + 1}`}
        />
      ))}
    </div>
  );
}

/**
 * Global Fade Overlay for Cross-Dissolve
 */
function FadeOverlay() {
  const fadeRef = useRef<HTMLDivElement>(null);
  const scroll = useScroll();

  useFrame(() => {
    if (!fadeRef.current) return;
    const offset = scroll.offset;

    // Fade peaks halfway between section starts (approx every 0.166 distance)
    // 6 Sections = 1/6 increments. 
    // We want fade opacity to peak at transition points
    const sections = 6;
    const step = 1 / (sections - 1);
    const local = (offset % step) / step; // 0 to 1 between two sections

    // Intensity curve: 0 at start, 1 at middle, 0 at end
    const intensity = Math.pow(Math.sin(local * Math.PI), 8); // High power = faster dip
    fadeRef.current.style.opacity = intensity.toString();
  });

  return (
    <div
      ref={fadeRef}
      className="fixed inset-0 bg-black pointer-events-none z-[40]"
      style={{ opacity: 0 }}
    />
  );
}

function App() {
  return (
    <div className="w-full h-screen bg-black relative">
      <Canvas camera={{ position: [0, 25, 60], fov: 60 }} gl={{ antialias: false }}>
        <color attach="background" args={['#000000']} />

        {/* 6 Sections + Space for Business Home internal scroll = 12 pages for 1-viewport pinning clarity */}
        <ScrollControls pages={10} damping={0.4} distance={1.2}>
          <SceneController />
          <FadeOverlay />
          <Scroll html style={{ width: '100vw' }}>
            <ProgressIndicator totalSections={6} />

            {/* Page 1 (Section 1: Milky Way) */}
            <div className="absolute top-0 left-0 w-full h-screen flex justify-center items-start pt-12 pointer-events-none">
              <h1 className="text-white font-light text-center text-sm md:text-lg lg:text-xl tracking-[0.3em] uppercase opacity-90 drop-shadow-lg">
                The Milky Way
              </h1>
            </div>

            {/* Page 2 (Section 2: Orion Arm) - Using calc to ensure pinning */}
            <div className="absolute top-[200vh] left-0 w-full h-screen flex justify-center items-end pb-24 pointer-events-none">
              <h1 className="text-white font-light text-center text-sm md:text-lg lg:text-xl tracking-[0.3em] uppercase opacity-90 drop-shadow-lg">
                Orion Arm
              </h1>
            </div>

            {/* Page 3 (Section 3: Solar System) */}
            <div className="absolute top-[400vh] left-0 w-full h-screen flex justify-center items-start pt-24 pointer-events-none">
              <h1 className="text-white font-light text-center text-sm md:text-lg lg:text-xl tracking-[0.3em] uppercase opacity-90 drop-shadow-lg">
                Our Solar System
              </h1>
            </div>

            {/* Page 4 (Section 4: Earth) */}
            <div className="absolute top-[600vh] left-0 w-full h-screen flex justify-center items-end pb-32 pointer-events-none">
              <h1 className="text-white font-light text-center text-sm md:text-lg lg:text-xl tracking-[0.3em] uppercase opacity-90 drop-shadow-lg">
                Planet Earth
              </h1>
            </div>

            {/* Page 5 (Section 5: Mumbai) */}
            <div className="absolute top-[800vh] left-0 w-full h-screen flex justify-center items-start pt-32 pointer-events-none">
              <h1 className="text-white font-light text-center text-sm md:text-lg lg:text-xl tracking-[0.3em] uppercase opacity-90 drop-shadow-lg">
                Mumbai Night
              </h1>
            </div>

            {/* Page 6 (Section 6: Business Homepage) */}
            <div className="absolute top-[900vh] left-0 w-full bg-black">
              <BusinessHome />
            </div>
          </Scroll>

          <MilkyWay />
          <OrionArm />
          <SolarSystem />
          <EarthOrbit />
          <MumbaiNight />
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
