import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CustomCursor() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);

    const springConfig = { damping: 25, stiffness: 400 };
    const cursorX = useSpring(0, springConfig);
    const cursorY = useSpring(0, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            cursorX.set(e.clientX - 6);
            cursorY.set(e.clientY - 6);

            const target = e.target as HTMLElement;
            setIsPointer(window.getComputedStyle(target).cursor === 'pointer' || target.tagName === 'BUTTON' || target.tagName === 'A');
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [cursorX, cursorY]);

    return (
        <>
            <div className="hidden md:block pointer-events-none fixed inset-0 z-[9999]">
                {/* Main Glow Dot */}
                <motion.div
                    style={{ x: cursorX, y: cursorY }}
                    className={`w-3 h-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] mix-blend-difference transition-transform duration-300 ${isPointer ? 'scale-150' : 'scale-100'}`}
                />

                {/* Faint Trail Effect - Simulated with a delayed ghost */}
                <motion.div
                    animate={{ x: mousePos.x - 4, y: mousePos.y - 4 }}
                    transition={{ type: 'spring', damping: 40, stiffness: 200 }}
                    className="absolute w-2 h-2 rounded-full bg-[#4fc3f7] opacity-20 blur-[2px]"
                />
            </div>

            <style>{`
        * { cursor: none !important; }
        @media (max-width: 768px) {
          * { cursor: auto !important; }
        }
      `}</style>
        </>
    );
}
