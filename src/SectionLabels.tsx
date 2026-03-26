import { motion, AnimatePresence } from 'framer-motion';

interface SectionLabelsProps {
    currentSection: string;
}

export default function SectionLabels({ currentSection }: SectionLabelsProps) {
    return (
        <div style={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            zIndex: 1000,
            pointerEvents: 'none'
        }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSection}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2 style={{
                        color: 'white',
                        fontFamily: "'Rajdhani', sans-serif",
                        fontWeight: 300,
                        fontSize: '32px',
                        letterSpacing: '8px',
                        textTransform: 'uppercase',
                        margin: 0,
                        textShadow: '0 0 15px rgba(255,255,255,0.5)'
                    }}>
                        {currentSection}
                    </h2>
                    <div style={{
                        width: '40px',
                        height: '1px',
                        background: 'white',
                        marginTop: '8px',
                        opacity: 0.5
                    }} />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
