import { motion } from 'framer-motion';
import { CATEGORIES } from '@/data/products';

function CategoryPill({ category }) {
    return (
        <motion.a
            href={`#${category.id}`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-surface-200/80 hover:border-primary-200 hover:shadow-card-hover transition-all duration-200 group cursor-pointer"
        >
            <span className="text-2xl group-hover:scale-110 transition-transform">{category.icon}</span>
            <div>
                <p className="text-sm font-semibold text-surface-800 group-hover:text-primary-600 transition-colors">{category.name}</p>
                <p className="text-[11px] text-surface-400">{category.count} produk</p>
            </div>
        </motion.a>
    );
}

export default function CategoryMarquee() {
    // Double the categories for seamless looping
    const doubled = [...CATEGORIES, ...CATEGORIES];

    return (
        <section className="py-12 sm:py-16 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-end justify-between"
                >
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold font-display text-surface-900 tracking-tight">
                            Jelajahi Kategori 🔥
                        </h2>
                        <p className="text-surface-500 mt-1 text-sm sm:text-base">Temukan merchandise berdasarkan kategori favoritmu</p>
                    </div>
                </motion.div>
            </div>

            {/* Marquee row */}
            <div className="relative">
                {/* Gradient fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-surface-50 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-surface-50 to-transparent z-10 pointer-events-none" />

                <motion.div
                    className="flex gap-4 w-max"
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                >
                    {doubled.map((cat, i) => (
                        <CategoryPill key={`${cat.id}-${i}`} category={cat} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
