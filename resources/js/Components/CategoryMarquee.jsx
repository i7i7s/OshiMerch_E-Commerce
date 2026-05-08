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
                <p className="text-[11px] text-surface-400">
                    {category.count > 0 ? `${category.count} produk` : 'Segera hadir'}
                </p>
            </div>
        </motion.a>
    );
}

export default function CategoryMarquee({ categoryCounts = {} }) {
    // Merge static category list with real DB counts
    const categories = CATEGORIES.map(cat => ({
        ...cat,
        count: categoryCounts[cat.id] ?? 0,
    }));

    // Double for seamless looping
    const doubled = [...categories, ...categories];

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
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Gradient fade edges (adjusted for padding) */}
                <div className="absolute left-4 sm:left-6 lg:left-8 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-surface-50 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-4 sm:right-6 lg:right-8 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-surface-50 to-transparent z-10 pointer-events-none" />

                <div className="overflow-hidden py-2 -my-2">
                    <motion.div
                        className="flex gap-4 w-max px-2"
                        animate={{ x: ['0%', '-50%'] }}
                        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    >
                        {doubled.map((cat, i) => (
                            <CategoryPill key={`${cat.id}-${i}`} category={cat} />
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
