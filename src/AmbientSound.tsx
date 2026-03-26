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

        const freqs = [432, 216, 108, 54, 27];
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
        const ctx = audioCtxRef.current!;

        if (isPlaying) {
            gainNodeRef.current?.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1);
            setIsPlaying(false);
        } else {
            if (ctx.state === 'suspended') ctx.resume();
            gainNodeRef.current?.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 1);
            setIsPlaying(true);
        }
    };

    return (
        <button
            onClick={toggleSound}
            className="fixed top-6 right-20 z-[100] p-4 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all group scale-75 md:scale-100 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
        >
            {isPlaying ? (
                <Volume2 className="w-6 h-6 text-[#4fc3f7] drop-shadow-[0_0_8px_#4fc3f7]" />
            ) : (
                <VolumeX className="w-6 h-6 text-white/40" />
            )}
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-black/80 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 whitespace-nowrap uppercase tracking-[0.3em] font-['Rajdhani'] border border-white/5">
                {isPlaying ? 'AMBIENT DRONE ACTIVE' : 'ENGAGE DEEP SPACE AUDIO'}
            </div>
        </button>
    );
}

