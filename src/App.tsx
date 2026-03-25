import { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Loader } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

import MilkyWay from './MilkyWay';
import OrionArm from './OrionArm';
import SolarSystem from './SolarSystem';
import EarthOrbit from './EarthOrbit';
import MumbaiNight from './MumbaiNight';
import SceneController from './SceneController';
import BusinessHome from './BusinessHome';

function ProgressiveContent() {
  const scroll = useScroll();
  const [activeRange, setActiveRange] = useState({ start: 0, end: 1 });

  useFrame(() => {
    setActiveRange({
      start: scroll.offset - 0.25,
      end: scroll.offset + 0.25
    });
  });

  return (
    <>
      {scroll.offset < 0.35 && <MilkyWay />}
      {scroll.offset > 0.05 && scroll.offset < 0.55 && <OrionArm />}
      {scroll.offset > 0.25 && scroll.offset < 0.75 && <SolarSystem />}
      {scroll.offset > 0.45 && scroll.offset < 0.95 && <EarthOrbit />}
      {scroll.offset > 0.65 && <MumbaiNight />}
    </>
  );
}

function ProgressIndicator({ totalSections }: { totalSections: number }) {
  const scroll = useScroll();
  const [active, setActive] = useState(0);

  useFrame(() => {
    const current = Math.round(scroll.offset * (totalSections - 1));
    if (current !== active) setActive(current);
  });

  const handleClick = (index: number) => {
    const targetOffset = index / (totalSections - 1);
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
          className={`w-3 h-3 rounded-full transition-all duration-500 border border-white/30 ${active === i ? 'bg-white scale-125 shadow-[0_0_10px_white]' : 'bg-white/20'}`}
          aria-label={`Go to section ${i + 1}`}
        />
      ))}
    </div>
  );
}

function FadeOverlay() {
  const fadeRef = useRef<HTMLDivElement>(null);
  const scroll = useScroll();

  useFrame(() => {
    if (!fadeRef.current) return;
    const sections = 6;
    const step = 1 / (sections - 1);
    const local = (scroll.offset % step) / step;
    const intensity = Math.pow(Math.sin(local * Math.PI), 10);
    fadeRef.current.style.opacity = intensity.toString();
  });

  return <div ref={fadeRef} className="fixed inset-0 bg-black pointer-events-none z-[40]" style={{ opacity: 0 }} />;
}

function App() {
  return (
    <div className="w-full h-screen bg-black relative">
      <Canvas
        camera={{ position: [0, 25, 60], fov: 60 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        dpr={[1, 1.5]} // Cap at 1.5x for performance
      >
        <color attach="background" args={['#000000']} />

        <ScrollControls pages={10} damping={0.4} distance={1.2}>
          <SceneController />
          <FadeOverlay />
          <Scroll html style={{ width: '100vw' }}>
            <ProgressIndicator totalSections={6} />

            <div className="absolute top-0 left-0 w-full h-screen flex justify-center items-start pt-12 pointer-events-none">
              <h1 className="text-white font-light text-center text-sm md:text-lg lg:text-xl tracking-[0.3em] uppercase opacity-90 drop-shadow-lg">The Milky Way</h1>
            </div>
            <div className="absolute top-[200vh] left-0 w-full h-screen flex justify-center items-end pb-24 pointer-events-none">
              <h1 className="text-white font-light text-center text-sm md:text-lg lg:text-xl tracking-[0.3em] uppercase opacity-90 drop-shadow-lg">Orion Arm</h1>
            </div>
            <div className="absolute top-[400vh] left-0 w-full h-screen flex justify-center items-start pt-24 pointer-events-none">
              <h1 className="text-white font-light text-center text-sm md:text-lg lg:text-xl tracking-[0.3em] uppercase opacity-90 drop-shadow-lg">Our Solar System</h1>
            </div>
            <div className="absolute top-[600vh] left-0 w-full h-screen flex justify-center items-end pb-32 pointer-events-none">
              <h1 className="text-white font-light text-center text-sm md:text-lg lg:text-xl tracking-[0.3em] uppercase opacity-90 drop-shadow-lg">Planet Earth</h1>
            </div>
            <div className="absolute top-[800vh] left-0 w-full h-screen flex justify-center items-start pt-32 pointer-events-none">
              <h1 className="text-white font-light text-center text-sm md:text-lg lg:text-xl tracking-[0.3em] uppercase opacity-90 drop-shadow-lg">Mumbai Night</h1>
            </div>
            <div className="absolute top-[900vh] left-0 w-full bg-black">
              <BusinessHome />
            </div>
          </Scroll>

          <Suspense fallback={null}>
            <ProgressiveContent />
          </Suspense>
        </ScrollControls>

        <EffectComposer>
          <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.0} />
        </EffectComposer>
      </Canvas>
      <Loader dataInterpolation={(p) => `Loading Universe... ${p.toFixed(0)}%`} />
    </div>
  );
}

export default App;
