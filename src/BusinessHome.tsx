import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { motion, Variants } from 'framer-motion';
import { Globe, MapPin, ArrowRight, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
    const letters = Array.from(text);
    const container: Variants = {
        hidden: { opacity: 0 },
        visible: (i: number = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: delay * i },
        }),
    };

    const child: Variants = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            },
        },
        hidden: {
            opacity: 0,
            y: 10,
        },
    };

    return (
        <motion.h1
            style={{ display: "flex", overflow: "hidden" }}
            variants={container}
            initial="hidden"
            whileInView="visible"
            className="text-5xl md:text-8xl font-['Rajdhani'] font-bold tracking-tight text-[#4fc3f7] drop-shadow-[0_0_15px_rgba(79,195,247,0.5)]"
        >
            {letters.map((letter, index) => (
                <motion.span variants={child} key={index}>
                    {letter === " " ? "\u00A0" : letter}
                </motion.span>
            ))}
        </motion.h1>
    );
};

export default function BusinessHome() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Smooth reveal for sections
            gsap.fromTo('.reveal-up',
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0, duration: 1, stagger: 0.2,
                    scrollTrigger: {
                        trigger: '.reveal-up',
                        start: 'top 85%',
                    }
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="bg-[#07090f] text-white min-h-[400vh] w-full font-['Inter'] relative overflow-hidden">

            {/* Cosmic Background Context */}
            <div className="fixed inset-0 pointer-events-none opacity-5 -z-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

            {/* Landing Skyline Silhouette */}
            <div className="absolute top-0 left-0 w-full h-[30vh] overflow-hidden pointer-events-none">
                <svg viewBox="0 0 1000 200" className="w-full h-full fill-[#0a1224] opacity-80" preserveAspectRatio="none">
                    <path d="M0,200 L0,140 L40,140 L40,110 L70,110 L70,150 L110,150 L110,80 L150,80 L150,110 L190,110 L190,60 L240,60 L240,90 L290,90 L290,130 L340,130 L340,70 L390,70 L390,120 L440,120 L440,40 L470,40 L470,20 L510,20 L510,50 L550,50 L550,90 L590,90 L590,70 L640,70 L640,110 L690,110 L690,90 L740,90 L740,150 L790,150 L790,100 L840,100 L840,130 L890,130 L890,100 L940,100 L940,150 L1000,150 L1000,200 Z" />
                </svg>
            </div>

            {/* HERO LANDING */}
            <section className="h-screen flex flex-col justify-center items-center px-6 relative">
                <TypewriterText text="COSMIC CREATIVE" />
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="mt-8 text-lg md:text-2xl font-light text-blue-200/60 max-w-2xl text-center tracking-widest"
                >
                    MISSION COMPLETE: LANDED IN <span className="text-white font-medium">MUMBAI</span>
                </motion.p>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-12 opacity-30"
                >
                    <ArrowRight className="rotate-90 w-8 h-8" />
                </motion.div>
            </section>

            {/* SERVICES - GLASSMORPHISM */}
            <section className="min-h-screen py-24 px-8 max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-['Rajdhani'] mb-20 text-center text-[#4fc3f7]">Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {['Systems Design', 'Brand Identity', 'Fullstack Dev', 'Growth Strategy'].map((s, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.05, borderColor: 'rgba(79, 195, 247, 0.8)' }}
                            className="p-10 rounded-2xl bg-[#ffffff03] backdrop-blur-xl border border-white/10 hover:shadow-[0_0_40px_rgba(79,195,247,0.15)] transition-all duration-500 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                <Star className="w-12 h-12" />
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-8">
                                <ArrowRight className="-rotate-45 text-[#4fc3f7]" />
                            </div>
                            <h3 className="text-2xl font-['Rajdhani'] font-bold mb-4">{s}</h3>
                            <p className="text-gray-400 font-light leading-relaxed">
                                Engineered for the next frontier of digital presence.
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* PORTFOLIO - LOW GRAVITY BOBBING */}
            <section className="min-h-screen py-24 px-8 bg-black/20">
                <h2 className="text-4xl md:text-6xl font-['Rajdhani'] mb-24 text-center">Orbiting Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                    {[1, 2, 3].map((p, i) => (
                        <motion.div
                            key={i}
                            animate={{ y: [0, -15, 0] }}
                            transition={{
                                repeat: Infinity,
                                duration: 4 + i,
                                ease: "easeInOut"
                            }}
                            whileHover={{ y: 0, scale: 1.05, transition: { duration: 0.3 } }}
                            className="bg-[#0a1224] rounded-3xl p-1 border border-white/5 shadow-2xl relative group cursor-pointer"
                        >
                            <div className="aspect-[4/5] bg-gray-900 rounded-[1.4rem] overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#4fc3f7]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <span className="text-7xl font-bold opacity-10">0{p}</span>
                            </div>
                            <div className="p-8">
                                <p className="text-[#4fc3f7] uppercase tracking-[0.3em] text-xs font-bold mb-2">Project Phase {i + 1}</p>
                                <h3 className="text-3xl font-['Rajdhani']">Project Alpha-{p}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CONTACT & FOOTER */}
            <section className="min-h-screen flex flex-col justify-between py-24 px-8 max-w-4xl mx-auto">
                <div className="reveal-up text-center mb-16">
                    <h2 className="text-5xl md:text-7xl font-['Rajdhani'] mb-12">Contact Hub</h2>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-12 text-blue-200/60">
                        <div className="flex items-center gap-4">
                            <Globe className="w-8 h-8 text-[#4fc3f7]" />
                            <span className="text-xl font-light">Mumbai, India</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <MapPin className="w-8 h-8 text-[#4fc3f7]" />
                            <span className="text-xl font-light tracking-widest">18.9°N, 72.8°E</span>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0a1224]/80 backdrop-blur-2xl border border-white/10 p-12 rounded-[2.5rem] shadow-3xl reveal-up">
                    <form className="flex flex-col gap-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <input type="text" placeholder="IDENTITY" className="bg-transparent border-b border-white/10 focus:border-[#4fc3f7] py-4 outline-none transition-all font-['Rajdhani'] tracking-widest" />
                            <input type="email" placeholder="COMMS ENCRYPTION" className="bg-transparent border-b border-white/10 focus:border-[#4fc3f7] py-4 outline-none transition-all font-['Rajdhani'] tracking-widest" />
                        </div>
                        <textarea placeholder="MISSION BRIEFING" rows={4} className="bg-transparent border-b border-white/10 focus:border-[#4fc3f7] py-4 outline-none transition-all font-['Rajdhani'] tracking-widest resize-none"></textarea>
                        <motion.button
                            whileHover={{ backgroundColor: '#4fc3f7', color: '#07090f', boxShadow: '0 0 50px rgba(79, 195, 247, 0.4)' }}
                            className="border border-[#4fc3f7] text-[#4fc3f7] py-6 font-['Rajdhani'] font-bold tracking-[0.5em] text-xl transition-all"
                        >
                            INITIATE CONTACT
                        </motion.button>
                    </form>
                </div>

                <footer className="mt-32 text-center text-xs tracking-[0.4em] text-white/20 uppercase">
                    © 2026 Cosmic Creative // Ground Station Mumbai // 18.9186N 72.8333E
                </footer>
            </section>
        </div>
    );
}
