import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const formatPrice = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

// Hero floating cards — real assets from public/images/heroassets/
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

// Meteor streak effect
function MeteorStreaks() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute h-[2px] rounded-full"
                    style={{
                        width: `${80 + Math.random() * 120}px`,
                        background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? 'rgba(255,17,0,0.9)' : 'rgba(139,61,255,0.8)'}, transparent)`,
                        top: `${Math.random() * 90}%`,
                        left: `${Math.random() * 100}%`,
                        rotate: `${-25 + Math.random() * 10}deg`,
                        boxShadow: `0 0 8px ${i % 2 === 0 ? 'rgba(255,17,0,0.6)' : 'rgba(139,61,255,0.6)'}`
                    }}
                    animate={{
                        x: [0, -500],
                        y: [0, 250],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: 1.5 + Math.random() * 1.5,
                        repeat: Infinity,
                        delay: Math.random() * 4,
                        ease: 'linear',
                    }}
                />
            ))}
        </div>
    );
}

// Carousel slots (Front, Left, Back, Right)
const SLOT_CONFIGS = [
    { rotate: 0,   x: 0,    y: 20,  scale: 1,    zIndex: 40 }, // Front
    { rotate: -12, x: -95,  y: -10, scale: 0.85, zIndex: 30 }, // Left
    { rotate: 0,   x: 0,    y: -40, scale: 0.7,  zIndex: 20 }, // Back
    { rotate: 12,  x: 95,   y: -10, scale: 0.85, zIndex: 30 }, // Right
];

function StackedCards() {
    const [cards, setCards] = useState(HERO_ITEMS);

    useEffect(() => {
        // Auto-shuffle carousel every 3 seconds
        const timer = setInterval(() => {
            setCards(prev => {
                const next = [...prev];
                const first = next.shift();
                next.push(first);
                return next;
            });
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative flex items-center justify-center w-full h-full">
            {/* Soft glow behind the stack */}
            <motion.div
                className="absolute w-72 h-72 rounded-full opacity-40 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,17,0,0.25) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
            />

            {cards.map((item, index) => {
                const config = SLOT_CONFIGS[index];
                return (
                    <motion.div
                        key={item.id}
                        layout
                        className="absolute rounded-2xl bg-white/95 backdrop-blur-sm border border-white shadow-elevated overflow-hidden"
                        style={{
                            width: 220, // Increased base width
                            transformOrigin: 'center center',
                        }}
                        initial={false}
                        animate={{
                            rotate: config.rotate,
                            x: config.x,
                            y: config.y,
                            scale: config.scale,
                            zIndex: config.zIndex,
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 150,
                            damping: 18,
                            mass: 0.8
                        }}
                        whileHover={index === 0 ? { y: config.y - 10, transition: { duration: 0.2 } } : {}}
                    >
                        <div className="w-full aspect-[3/4] overflow-hidden bg-surface-100">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover select-none pointer-events-none" loading="lazy" />
                        </div>
                        <div className="p-3 bg-white">
                            <p className="text-[12px] font-semibold text-surface-800 line-clamp-1">{item.title}</p>
                            <p className="text-sm font-bold text-primary-600 mt-0.5">{formatPrice(item.price)}</p>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

export default function HeroBanner({ canLogin, activeProductsCount = 0 }) {
    const containerRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 30 });
    const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 30 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
            const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
            mouseX.set(x * 20);
            mouseY.set(y * 20);
        };
        const el = containerRef.current;
        if (el) el.addEventListener('mousemove', handleMouseMove);
        return () => { if (el) el.removeEventListener('mousemove', handleMouseMove); };
    }, []);

    return (
        <section ref={containerRef} className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
            {/* Animated gradient blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-30"
                    style={{ background: 'radial-gradient(circle, rgba(255,17,0,0.4) 0%, transparent 70%)', x: smoothMouseX, y: smoothMouseY }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute top-1/3 -left-24 w-[400px] h-[400px] rounded-full opacity-20"
                    style={{ background: 'radial-gradient(circle, rgba(139,61,255,0.4) 0%, transparent 70%)' }}
                    animate={{ scale: [1, 1.15, 1], x: [0, 30, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute bottom-20 right-1/4 w-[300px] h-[300px] rounded-full opacity-15"
                    style={{ background: 'radial-gradient(circle, rgba(255,188,32,0.4) 0%, transparent 70%)' }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                />
            </div>

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
            }} />

            <MeteorStreaks />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left — Text Content */}
                    <div className="relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-sm font-medium mb-6"
                        >
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            {activeProductsCount.toLocaleString('id-ID')} Produk Tersedia
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-surface-900 leading-[1.1] tracking-tight mb-6"
                        >
                            Koleksi Merch
                            <br />
                            <span className="gradient-text">JKT48</span> Impianmu
                            <br />
                            <span className="text-surface-400 text-3xl sm:text-4xl lg:text-5xl">Ada di Sini ✨</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg text-surface-500 max-w-lg mb-8 leading-relaxed"
                        >
                            Marketplace khusus fans JKT48 — temukan photocard rare, lightstick official, apparel limited, dan ribuan merchandise eksklusif lainnya.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-wrap gap-3 mb-10"
                        >
                            {canLogin && (
                                <a
                                    href={route('google.redirect')}
                                    className="group inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl gradient-primary text-white font-bold text-base shadow-glow-primary hover:shadow-xl hover:scale-[1.02] transition-all duration-300 active:scale-[0.98]"
                                >
                                    <GoogleIcon />
                                    Mulai Belanja
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </a>
                            )}
                            <a
                                href="#trending"
                                className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-white border border-surface-200 text-surface-700 font-semibold text-base hover:bg-surface-50 hover:border-surface-300 transition-all shadow-sm hover:shadow-md"
                            >
                                Jelajahi Produk
                            </a>
                        </motion.div>

                        {/* Trust badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="flex flex-wrap items-center gap-6 text-sm text-surface-400"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                                </div>
                                <span>Transaksi Aman</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <span>100% Verified</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                                </div>
                                <span>15 Juta+ Fans</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right — Stacked Product Cards */}
                    <div className="relative h-[500px] sm:h-[560px] hidden lg:flex items-center justify-center">
                        <StackedCards />

                        {/* Outer glow rings */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-primary-200/30 pointer-events-none"
                            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-secondary-200/20 pointer-events-none"
                            animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
                            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
