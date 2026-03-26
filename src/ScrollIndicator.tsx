import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useScroll } from '@react-three/drei';
import { useState, useEffect } from 'react';

export default function ScrollIndicator() {
    const scroll = useScroll();
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const checkScroll = () => {
            if (scroll.offset > 0.01) {
                setVisible(false);
            }
        };
        // Use a listener or a frame-check
        const interval = setInterval(checkScroll, 100);
        return () => clearInterval(interval);
    }, [scroll]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white z-[90] pointer-events-none"
                >
                    <span className="text-[10px] uppercase tracking-[0.6em] opacity-40 font-['Rajdhani'] ml-2">
                        SCROLL TO TRAVEL
                    </span>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >
                        <ChevronDown className="w-6 h-6 text-[#4fc3f7] opacity-60" />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
