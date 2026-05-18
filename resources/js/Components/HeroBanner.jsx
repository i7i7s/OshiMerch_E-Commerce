import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';

const formatPrice = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

// Hero floating cards
const HERO_ITEMS = [
    { id: 1, title: 'PC Erine — River',    price: 85000,  image: '/images/heroassets/pc_erine.jpg',           category: 'Photocard' },
    { id: 2, title: 'PC Oline — Bday',     price: 75000,  image: '/images/heroassets/pc_oline.jpg',           category: 'Photocard' },
    { id: 3, title: 'Lightstick JKT48',    price: 350000, image: '/images/heroassets/lightstick 1.png',       category: 'Lightstick' },
    { id: 4, title: 'Fritzy Bday T-Shirt', price: 185000, image: '/images/heroassets/fritzty_bdaytshirt.png', category: 'Apparel' },
];

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);

// ─── Meteor streak effect (ENHANCED) ───
function MeteorStreaks() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute h-[3px] rounded-full mix-blend-screen"
                    style={{
                        width: `${100 + Math.random() * 150}px`,
                        background: `linear-gradient(90deg, transparent, ${i % 3 === 0 ? 'rgba(255,17,0,1)' : i % 3 === 1 ? 'rgba(139,61,255,1)' : 'rgba(251,191,36,1)'}, transparent)`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 120}%`,
                        rotate: `${-35 + Math.random() * 15}deg`,
                        boxShadow: `0 0 15px ${i % 3 === 0 ? 'rgba(255,17,0,0.8)' : i % 3 === 1 ? 'rgba(139,61,255,0.8)' : 'rgba(251,191,36,0.8)'}`
                    }}
                    animate={{
                        x: [200, -800],
                        y: [-100, 500],
                        opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                        duration: 1.5 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: 'linear',
                    }}
                />
            ))}
        </div>
    );
}

// ─── Floating Cards Configuration ───
const FLOATING_CONFIGS = [
    { top: '15%', left: '8%',   rotate: -12, scale: 0.9,  speed: 0.04 },
    { top: '55%', left: '5%',   rotate: 8,   scale: 1.05, speed: -0.06 },
    { top: '20%', right: '5%',  rotate: 15,  scale: 1,    speed: 0.05 },
    { top: '65%', right: '10%', rotate: -10, scale: 0.85, speed: -0.03 },
];

export default function HeroBanner({ canLogin, activeProductsCount = 0 }) {
    const containerRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    // Smooth mouse coordinates for parallax
    const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });
    const textY = useTransform(scrollYProgress, [0, 1], [0, 150]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            // Calculate mouse position relative to center of container
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            mouseX.set(x);
            mouseY.set(y);
        };
        const el = containerRef.current;
        if (el) el.addEventListener('mousemove', handleMouseMove);
        return () => { if (el) el.removeEventListener('mousemove', handleMouseMove); };
    }, [mouseX, mouseY]);

    return (
        <section ref={containerRef} className="relative min-h-[95vh] flex flex-col items-center justify-center overflow-hidden pt-20 bg-white">
            
            {/* Massive Ambient Background Glows */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <motion.div
                    className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full opacity-30 mix-blend-multiply"
                    style={{ background: 'radial-gradient(circle, rgba(255,17,0,0.4) 0%, transparent 70%)', x: useTransform(smoothX, x => x * 0.05), y: useTransform(smoothY, y => y * 0.05) }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] rounded-full opacity-20 mix-blend-multiply"
                    style={{ background: 'radial-gradient(circle, rgba(139,61,255,0.4) 0%, transparent 70%)', x: useTransform(smoothX, x => x * -0.05), y: useTransform(smoothY, y => y * -0.05) }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />
            </div>

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)',
                backgroundSize: '80px 80px',
            }} />

            {/* ENHANCED METEORS */}
            <MeteorStreaks />

            {/* FLOATING PARALLAX CARDS (Hidden on very small screens) */}
            <div className="absolute inset-0 pointer-events-none z-10 hidden md:block">
                {HERO_ITEMS.map((item, index) => {
                    const config = FLOATING_CONFIGS[index];
                    return (
                        <motion.div
                            key={item.id}
                            className="absolute rounded-2xl bg-white border-4 border-surface-900 shadow-[8px_8px_0_0_#0f172a] overflow-hidden pointer-events-auto cursor-pointer"
                            style={{
                                width: 220,
                                top: config.top,
                                left: config.left,
                                right: config.right,
                                rotate: config.rotate,
                                scale: config.scale,
                                // Parallax effect based on mouse movement
                                x: useTransform(smoothX, x => x * config.speed),
                                y: useTransform(smoothY, y => y * config.speed),
                            }}
                            whileHover={{ scale: config.scale * 1.15, rotate: (Math.random() - 0.5) * 10, zIndex: 50 }}
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: 'spring', delay: index * 0.1 + 0.5, bounce: 0.4 }}
                        >
                            <div className="w-full aspect-[3/4] bg-surface-100 relative group">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover select-none group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                                
                                {/* Hover overlay action */}
                                <div className="absolute inset-0 bg-surface-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <div className="w-16 h-16 rounded-2xl bg-[#FEF08A] border-4 border-surface-900 flex items-center justify-center text-surface-900 shadow-[4px_4px_0_0_#0f172a] transform -rotate-3 hover:scale-110 transition-transform">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* MAIN CONTENT (CENTERED, BRUTALIST) */}
            <motion.div 
                style={{ y: textY }}
                className="relative z-20 max-w-7xl mx-auto px-4 flex flex-col items-center text-center mt-12"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#A7F3D0] border-4 border-surface-900 text-surface-900 text-sm font-black uppercase tracking-widest mb-8 sm:mb-12 shadow-[4px_4px_0_0_#0f172a] transform -rotate-2"
                >
                    <span className="w-3 h-3 border-2 border-surface-900 rounded-none bg-white animate-pulse" />
                    {activeProductsCount.toLocaleString('id-ID')} PRODUK TERSEDIA
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    className="text-6xl sm:text-[6rem] lg:text-[8rem] font-black font-display uppercase leading-[0.85] tracking-tighter text-surface-900"
                    style={{ textShadow: '6px 6px 0px #FEF08A' }}
                >
                    KOLEKSI MERCH<br/>
                    <span className="bg-[#BAE6FD] px-2 border-4 border-surface-900 inline-block transform rotate-1 mt-2">
                        JKT48 IMPIANMU
                    </span><br/>
                    <span className="mt-2 inline-block">ADA DI SINI.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-lg sm:text-2xl text-surface-900 max-w-2xl mt-12 mb-12 font-black uppercase bg-white px-4 py-2 border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a]"
                >
                    MARKETPLACE KHUSUS FANS JKT48. TEMUKAN PHOTOCARD RARE, LIGHTSTICK OFFICIAL, APPAREL LIMITED, DAN LAINNYA.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
                >
                    {canLogin && (
                        <a
                            href={route('google.redirect')}
                            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#FEF08A] border-4 border-surface-900 text-surface-900 font-black text-xl shadow-[6px_6px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#0f172a] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all uppercase tracking-widest transform -rotate-1"
                        >
                            MULAI BELANJA
                        </a>
                    )}
                    <a
                        href="#trending"
                        className="inline-flex items-center justify-center px-10 py-5 bg-white border-4 border-surface-900 text-surface-900 font-black text-xl shadow-[6px_6px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#0f172a] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all uppercase tracking-widest transform rotate-1"
                    >
                        JELAJAHI PRODUK
                    </a>
                </motion.div>

                {/* Trust badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-16 text-xs sm:text-sm font-black uppercase tracking-widest text-surface-900"
                >
                    <div className="flex items-center gap-2 bg-white px-3 py-1 border-4 border-surface-900 shadow-[2px_2px_0_0_#0f172a]">
                        <span className="text-xl">🛡️</span> TRANSAKSI AMAN
                    </div>
                    <div className="flex items-center gap-2 bg-[#A7F3D0] px-3 py-1 border-4 border-surface-900 shadow-[2px_2px_0_0_#0f172a]">
                        <span className="text-xl">✅</span> 100% VERIFIED
                    </div>
                    <div className="flex items-center gap-2 bg-[#BAE6FD] px-3 py-1 border-4 border-surface-900 shadow-[2px_2px_0_0_#0f172a]">
                        <span className="text-xl">👥</span> 15 JUTA+ FANS
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
