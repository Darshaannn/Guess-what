import { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AmbientSound() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const oscillatorsRef = useRef<OscillatorNode[]>([]);
    const gainNodeRef = useRef<GainNode | null>(null);

    const initAudio = () => {
        const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
        gainNode.connect(ctx.destination);

        // Deep Space Drone: Low frequency layers
        const freqs = [432, 216, 108, 54, 27]; // Harmonically related deep frequencies
        freqs.forEach(f => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, ctx.currentTime);

            const panner = ctx.createStereoPanner();
            panner.pan.setValueAtTime(Math.random() * 2 - 1, ctx.currentTime);

            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(150, ctx.currentTime);

            osc.connect(filter).connect(panner).connect(gainNode);
            osc.start();
            oscillatorsRef.current.push(osc);
        });

        audioCtxRef.current = ctx;
        gainNodeRef.current = gainNode;
    };

    const toggleSound = () => {
        if (!audioCtxRef.current) initAudio();

        if (isPlaying) {
            gainNodeRef.current?.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current!.currentTime + 1);
        } else {
            if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();
            gainNodeRef.current?.gain.exponentialRampToValueAtTime(0.05, audioCtxRef.current!.currentTime + 1);
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <button
            onClick={toggleSound}
            className="fixed top-6 right-20 z-[100] p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all group scale-75 md:scale-100"
            aria-label="Toggle Ambient Space Drone"
        >
            {isPlaying ? (
                <Volume2 className="w-5 h-5 text-[#4fc3f7] animate-pulse" />
            ) : (
                <VolumeX className="w-5 h-5 text-gray-500" />
            )}
            <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1 rounded bg-black/60 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-[0.2em]">
                {isPlaying ? 'System Audio Active' : 'Engage Ambient Drone'}
            </span>
        </button>
    );
}
