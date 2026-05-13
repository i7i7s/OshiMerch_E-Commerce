import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function Counter({ value, suffix = '', duration = 1600 }) {
    const [display, setDisplay] = useState(0);
    const [done, setDone]       = useState(false);
    const ref      = useRef(null);
    const frameRef = useRef(null);
    const inView   = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;

        setDisplay(0);
        setDone(false);

        const startTime  = performance.now();
        const scrambleMs = duration * 0.65; // 65 % scramble
        const settleMs   = duration * 0.35; // 35 % ease-in to real value
        // Scramble range is always at least 100 so even value=1 shows wild numbers
        const scrambleMax = Math.max(value, 100);

        const tick = (now) => {
            const elapsed = now - startTime;

            if (elapsed < scrambleMs) {
                // Slot-machine: random number in [0, scrambleMax)
                setDisplay(Math.floor(Math.random() * scrambleMax));
                frameRef.current = requestAnimationFrame(tick);
            } else if (elapsed < scrambleMs + settleMs) {
                // Cubic ease-out deceleration toward real value
                const t    = (elapsed - scrambleMs) / settleMs;
                const ease = 1 - Math.pow(1 - t, 3);
                setDisplay(Math.round(ease * value));
                frameRef.current = requestAnimationFrame(tick);
            } else {
                setDisplay(value);
                setDone(true);
            }
        };

        frameRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameRef.current);
    }, [inView, value, duration]);

    return (
        <motion.span
            ref={ref}
            key={done ? 'done' : 'counting'}
            animate={done ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ display: 'inline-block' }}
        >
            {display.toLocaleString('id-ID')}{suffix}
        </motion.span>
    );
}

export default function StatsSection({ stats }) {
    return (
        <section className="py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden border-4 border-surface-900 bg-[#A7F3D0] shadow-[12px_12px_0_0_#0f172a] p-10 sm:p-14 transform rotate-1 hover:rotate-0 transition-transform">
                    {/* Decorative elements */}
                    <div className="absolute -top-12 -right-12 w-48 h-48 border-4 border-surface-900 bg-white/30 rounded-none transform rotate-12" />
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 border-4 border-surface-900 bg-[#BAE6FD]/50 rounded-none transform -rotate-6" />

                    <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center bg-white border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] p-6 transform hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[8px_8px_0_0_#0f172a] transition-all"
                            >
                                <div className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-surface-900 mb-2">
                                    <Counter value={stat.value} suffix={stat.suffix} />
                                </div>
                                <p className="text-surface-900 text-xs sm:text-sm font-black uppercase tracking-widest bg-[#FEF08A] px-2 border-2 border-surface-900 inline-block shadow-[2px_2px_0_0_#0f172a]">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
