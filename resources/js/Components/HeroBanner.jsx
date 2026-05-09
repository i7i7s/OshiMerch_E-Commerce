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
            {[...Array(30)].map((_, i) => (
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
                            className="absolute rounded-3xl bg-white/80 backdrop-blur-md border border-white/50 shadow-2xl overflow-hidden pointer-events-auto cursor-pointer"
                            style={{
                                width: 200,
                                top: config.top,
                                left: config.left,
                                right: config.right,
                                rotate: config.rotate,
                                scale: config.scale,
                                // Parallax effect based on mouse movement
                                x: useTransform(smoothX, x => x * config.speed),
                                y: useTransform(smoothY, y => y * config.speed),
                            }}
                            whileHover={{ scale: config.scale * 1.1, rotate: 0, zIndex: 50 }}
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: 'spring', delay: index * 0.1 + 0.5, bounce: 0.4 }}
                        >
                            <div className="w-full aspect-[3/4] overflow-hidden bg-surface-100 p-2 pb-0">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-t-2xl select-none" loading="lazy" />
                            </div>
                            <div className="p-4 bg-white/90">
                                <p className="text-[13px] font-bold text-surface-900 line-clamp-1">{item.title}</p>
                                <p className="text-sm font-black text-primary-600 mt-1">{formatPrice(item.price)}</p>
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
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-950 text-white text-xs sm:text-sm font-bold uppercase tracking-widest mb-8 sm:mb-12 shadow-2xl shadow-surface-950/20"
                >
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                    {activeProductsCount.toLocaleString('id-ID')} Produk Eksklusif Tersedia
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    className="text-6xl sm:text-[6rem] lg:text-[8rem] font-black font-display uppercase leading-[0.85] tracking-tighter text-surface-950 mix-blend-darken"
                >
                    KOLEKSI MERCH<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-purple-500 to-primary-400">
                        JKT48 IMPIANMU
                    </span><br/>
                    ADA DI SINI.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-lg sm:text-2xl text-surface-600 max-w-2xl mt-8 sm:mt-12 mb-12 font-medium"
                >
                    Marketplace khusus fans JKT48. Temukan photocard rare, lightstick official, apparel limited, dan ribuan merchandise eksklusif.
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
                            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-surface-950 text-white font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-surface-950/30"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <GoogleIcon />
                            <span className="relative z-10">Mulai Belanja</span>
                        </a>
                    )}
                    <a
                        href="#trending"
                        className="inline-flex items-center justify-center px-10 py-5 rounded-full bg-white border-2 border-surface-200 text-surface-950 font-bold text-lg hover:border-surface-950 hover:bg-surface-50 transition-all"
                    >
                        Jelajahi Produk
                    </a>
                </motion.div>

                {/* Trust badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-16 text-sm font-bold uppercase tracking-widest text-surface-400"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🛡️</span> Transaksi Aman
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xl">✅</span> 100% Verified
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xl">👥</span> 15 Juta+ Fans
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
