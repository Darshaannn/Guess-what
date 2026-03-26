import { motion, AnimatePresence } from 'framer-motion';

interface SectionLabelsProps {
    currentSection: string;
}

export default function SectionLabels({ currentSection }: SectionLabelsProps) {
    return (
        <div style={{
            position: 'fixed',
            top: '40px',
            left: '40px',
            zIndex: 1000,
            pointerEvents: 'none'
        }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSection}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <h2 style={{
                        color: 'white',
                        fontFamily: "'Rajdhani', sans-serif",
                        fontWeight: 300,
                        fontSize: 'max(24px, 2vw)',
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        margin: 0,
                        textShadow: '0 0 20px rgba(79, 195, 247, 0.3)'
                    }}>
                        {currentSection}
                    </h2>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '40px' }}
                        style={{
                            height: '2px',
                            background: '#4fc3f7',
                            marginTop: '12px',
                            boxShadow: '0 0 10px #4fc3f7'
                        }}
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

