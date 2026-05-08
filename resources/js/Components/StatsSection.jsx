import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function Counter({ value, suffix = '', duration = 2 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const end = value;
        const incrementTime = (duration * 1000) / end;
        const maxInterval = 16; // ~60fps cap
        const step = Math.max(1, Math.floor(end / (duration * 60)));

        const timer = setInterval(() => {
            start += step;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, Math.max(incrementTime, maxInterval));

        return () => clearInterval(timer);
    }, [inView, value, duration]);

    return (
        <span ref={ref}>
            {count.toLocaleString('id-ID')}{suffix}
        </span>
    );
}

export default function StatsSection({ stats }) {
    return (
        <section className="py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl gradient-primary p-10 sm:p-14">
                    {/* Decorative elements */}
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full" />
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full" />

                    <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white mb-1">
                                    <Counter value={stat.value} suffix={stat.suffix} />
                                </div>
                                <p className="text-white/70 text-sm font-medium">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
