import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

export default function ScrollProgress() {
    const scroll = useScroll();
    const progressRef = useRef<HTMLDivElement>(null);

    useFrame(() => {
        if (progressRef.current) {
            // scaleY based on scroll offset
            progressRef.current.style.transform = `scaleY(${scroll.offset})`;
        }
    });

    return (
        <div style={{
            position: 'fixed',
            right: '20px',
            top: '20%',
            height: '60%',
            width: '2px',
            background: 'rgba(255,255,255,0.1)',
            zIndex: 100,
            borderRadius: '1px',
            overflow: 'hidden'
        }}>
            <div
                ref={progressRef}
                style={{
                    width: '100%',
                    height: '100%',
                    background: '#4fc3f7',
                    boxShadow: '0 0 10px #4fc3f7',
                    transformOrigin: 'top',
                    transform: 'scaleY(0)',
                    transition: 'transform 0.1s linear'
                }}
            />
        </div>
    );
}
