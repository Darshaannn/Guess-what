import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BusinessHome() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Hero Reveal
            gsap.fromTo('.hero-text',
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0, duration: 1, stagger: 0.2,
                    scrollTrigger: {
                        trigger: '.hero-section',
                        start: 'top 60%',
                        end: 'bottom center',
                        toggleActions: 'play none none none'
                    }
                }
            );

            // 2. Services Reveal (Staggered cards)
            gsap.fromTo('.service-card',
                { opacity: 0, y: 100 },
                {
                    opacity: 1, y: 0, duration: 0.8, stagger: 0.2,
                    scrollTrigger: { trigger: '.services-section', start: 'top 80%' }
                }
            );

            // 3. Portfolio Reveal
            gsap.fromTo('.portfolio-card',
                { opacity: 0, scale: 0.9 },
                {
                    opacity: 1, scale: 1, duration: 0.8, stagger: 0.2,
                    scrollTrigger: { trigger: '.portfolio-section', start: 'top 75%' }
                }
            );

            // 4. About & Contact Reveal
            gsap.fromTo('.fade-up',
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0, duration: 0.8, stagger: 0.2,
                    scrollTrigger: { trigger: '.about-section', start: 'top 80%' }
                }
            );

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="bg-transparent text-white min-h-[300vh] w-full font-['Inter'] relative z-50">

            {/* Fallback space texture background over the canvas to deepen it */}
            <div className="absolute top-0 left-0 w-full h-[300vh] -z-10 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#07090f]/80 to-[#07090f]"></div>

            {/* HERO */}
            <section className="hero-section h-screen w-full flex flex-col justify-center items-center text-center px-4 relative">
                <h1 className="hero-text text-5xl md:text-7xl font-['Rajdhani'] font-bold mb-6 tracking-wide relative group cursor-default shadow-black drop-shadow-xl">
                    COSMIC CREATIVE
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left shadow-[0_0_15px_#3b82f6]"></span>
                </h1>
                <p className="hero-text text-lg md:text-xl text-gray-300 max-w-2xl font-light drop-shadow-xl shadow-black">
                    We design digital experiences from Mumbai, for the world.
                </p>
            </section>

            {/* SERVICES */}
            <section className="services-section min-h-screen w-full py-24 px-8 max-w-6xl mx-auto flex flex-col justify-center">
                <h2 className="text-3xl md:text-5xl font-['Rajdhani'] mb-16 text-center text-blue-400 drop-shadow-md">Our Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {['Web Design', 'Branding', 'Development', 'Digital Strategy'].map((s, i) => (
                        <div key={i} className="service-card p-8 bg-white/5 border border-white/10 rounded-xl hover:border-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300 group cursor-pointer backdrop-blur-md">
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-black/50">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <h3 className="text-xl font-['Rajdhani'] font-bold mb-3">{s}</h3>
                            <p className="text-sm text-gray-300 leading-relaxed font-light">
                                Crafting robust and scalable {s.toLowerCase()} solutions tailored to elevate your business footprint.
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* PORTFOLIO */}
            <section className="portfolio-section min-h-screen w-full py-24 px-8 bg-black/60 border-y border-white/5 flex flex-col justify-center">
                <div className="max-w-6xl mx-auto w-full">
                    <h2 className="text-3xl md:text-5xl font-['Rajdhani'] mb-16 text-center text-blue-400 drop-shadow-md">Featured Work</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((p, i) => (
                            <div key={i} className="portfolio-card group relative rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(59,130,246,0.2)] transition-all duration-500 border border-white/10">
                                <div className="aspect-video bg-gray-900 border-b border-white/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                                    <span className="text-gray-700 text-5xl opacity-40">✦</span>
                                </div>
                                <div className="absolute inset-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col justify-end">
                                    <div className="text-xs text-blue-400 uppercase tracking-widest font-bold mb-1">Category {i + 1}</div>
                                    <h3 className="text-2xl font-['Rajdhani'] font-medium">Project Horizon {p}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ABOUT & CONTACT */}
            <section className="about-section min-h-screen w-full pt-24 pb-8 px-8 max-w-4xl mx-auto relative flex flex-col justify-center">
                <div className="absolute bottom-0 left-0 w-full opacity-10 pointer-events-none flex justify-center z-[-1]">
                    <svg viewBox="0 0 1000 200" className="w-full h-auto fill-current text-white"><path d="M0,200 L0,150 L50,150 L50,120 L80,120 L80,160 L120,160 L120,80 L160,80 L160,110 L200,110 L200,60 L250,60 L250,90 L300,90 L300,140 L350,140 L350,70 L400,70 L400,130 L450,130 L450,40 L480,40 L480,20 L520,20 L520,50 L560,50 L560,100 L600,100 L600,70 L650,70 L650,120 L700,120 L700,90 L750,90 L750,160 L800,160 L800,110 L850,110 L850,140 L900,140 L900,100 L950,100 L950,150 L1000,150 L1000,200 Z"></path></svg>
                </div>

                <div className="text-center mb-20 fade-up">
                    <h2 className="text-3xl md:text-5xl font-['Rajdhani'] mb-6 text-blue-400 drop-shadow-md">About Us</h2>
                    <p className="text-lg text-gray-300 font-light leading-relaxed drop-shadow-lg shadow-black">
                        Born in the bustling heart of Mumbai, our creative agency draws inspiration from the energy, diversity, and rapid growth of the City of Dreams. We blend cosmic vision with grounded engineering to build digital artifacts that span across the globe.
                    </p>
                </div>

                <div className="bg-[#0b0f1a]/80 border border-white/10 rounded-2xl p-8 md:p-12 fade-up backdrop-blur-xl relative z-10 shadow-2xl">
                    <h2 className="text-3xl font-['Rajdhani'] mb-8 text-center">Start Your Journey</h2>
                    <form className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input type="text" placeholder="Name" className="bg-black/60 border border-white/10 px-4 py-4 rounded-lg focus:outline-none focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all font-light" />
                            <input type="email" placeholder="Email" className="bg-black/60 border border-white/10 px-4 py-4 rounded-lg focus:outline-none focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all font-light" />
                        </div>
                        <textarea placeholder="Message" rows={4} className="bg-black/60 border border-white/10 px-4 py-4 rounded-lg focus:outline-none focus:border-blue-500 focus:shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all font-light resize-none"></textarea>
                        <button type="button" className="bg-blue-600/90 hover:bg-blue-500 border border-blue-500/50 text-white font-['Rajdhani'] font-bold tracking-widest uppercase py-4 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.8)] transition-all duration-300">
                            Send Message
                        </button>
                    </form>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="w-full py-8 border-t border-white/10 text-center text-sm text-gray-500 font-light relative z-10 bg-black/80">
                <p className="mb-2">📍 Mumbai, India — Earth</p>
                <p>© 2026 Cosmic Creative Agency. All light years reserved.</p>
            </footer>

        </div>
    );
}
