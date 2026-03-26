import { motion } from 'framer-motion';
import { ArrowRight, Star, Monitor, Zap, Code, Target } from 'lucide-react';

export default function BusinessHome() {
    return (
        <div className="w-full text-white font-['Rajdhani']">
            {/* HERO SECTION */}
            <section className="h-screen flex flex-col justify-center items-start px-12 md:px-24 relative overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <h1 className="text-6xl md:text-9xl font-extralight tracking-[0.15em] leading-tight mb-4">
                        WE CREATE <br />
                        <span className="font-bold text-[#4fc3f7] drop-shadow-[0_0_20px_rgba(79,195,247,0.5)]">FROM MUMBAI</span>
                    </h1>

                    <div className="w-64 h-px bg-gradient-to-r from-transparent via-[#4fc3f7] to-transparent relative mt-8 mb-8 overflow-hidden">
                        <motion.div
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="absolute inset-0 bg-white opacity-50 shadow-[0_0_10px_#fff]"
                        />
                    </div>

                    <p className="text-xl md:text-3xl font-light text-blue-200/60 max-w-2xl tracking-[0.2em] uppercase">
                        Digital experiences that travel at the speed of light
                    </p>
                </motion.div>
            </section>

            {/* SERVICES SECTION */}
            <section className="min-h-screen py-32 px-12 md:px-24">
                <h2 className="text-4xl md:text-6xl font-bold mb-24 tracking-[0.3em] uppercase opacity-20">Systems & Services</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { name: 'Web Design', icon: <Monitor />, desc: 'Next-gen interfaces that define the future.' },
                        { name: 'Branding', icon: <Zap />, desc: 'Atomic identities for celestial growth.' },
                        { name: 'Development', icon: <Code />, desc: 'Performant architectures built for scale.' },
                        { name: 'Strategy', icon: <Target />, desc: 'Data-driven roadmaps to the next frontier.' }
                    ].map((s, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10, borderColor: 'rgba(79, 195, 247, 0.8)' }}
                            className="p-10 rounded-2xl bg-[#ffffff03] backdrop-blur-2xl border border-white/10 hover:shadow-[0_0_40px_rgba(79,195,247,0.15)] transition-all duration-500 group relative overflow-hidden"
                        >
                            <div className="text-[#4fc3f7] mb-8 scale-150 origin-left opacity-60 group-hover:opacity-100 transition-opacity">
                                {s.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4 tracking-widest uppercase">{s.name}</h3>
                            <p className="text-gray-400 font-light leading-relaxed text-sm tracking-wide">
                                {s.desc}
                            </p>
                            <div className="absolute -bottom-1 -right-1 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Star className="w-24 h-24" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-32 flex justify-center">
                    <motion.button
                        whileHover={{
                            scale: 1.05,
                            backgroundColor: '#4fc3f7',
                            color: '#07090f',
                            boxShadow: '0 0 50px rgba(79, 195, 247, 0.6)'
                        }}
                        className="px-12 py-6 rounded-full border border-[#4fc3f7] text-[#4fc3f7] font-bold tracking-[0.4em] text-xl transition-all flex items-center gap-4 bg-transparent backdrop-blur-md"
                    >
                        START A PROJECT <ArrowRight />
                    </motion.button>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-24 px-12 md:px-24 border-t border-white/5 bg-black/40 backdrop-blur-xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-12 text-xs tracking-[0.4em] text-white/20 uppercase">
                    <div>© 2026 Cosmic Creative // Ground Station Mumbai</div>
                    <div className="flex gap-12">
                        <span>18.9186° N, 72.8333° E</span>
                        <span className="text-[#4fc3f7] opacity-60 cursor-pointer hover:opacity-100 transition-opacity">Launch Protocol</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

