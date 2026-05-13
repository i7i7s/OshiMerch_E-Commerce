import { motion } from 'framer-motion';
import { CATEGORIES } from '@/data/products';

function CategoryPill({ category }) {
    return (
        <motion.a
            href={`#${category.id}`}
            whileHover={{ scale: 1.05, y: -4, rotate: (Math.random() - 0.5) * 4 }}
            whileTap={{ scale: 0.97 }}
            className="shrink-0 flex items-center gap-3 px-5 py-3 bg-[#BAE6FD] border-4 border-surface-900 hover:bg-[#FEF08A] hover:shadow-[6px_6px_0_0_#0f172a] shadow-[4px_4px_0_0_#0f172a] transition-all duration-200 group cursor-pointer"
        >
            <span className="text-3xl group-hover:scale-110 transition-transform drop-shadow-[2px_2px_0_#0f172a]">{category.icon}</span>
            <div>
                <p className="text-sm font-black uppercase tracking-widest text-surface-900">{category.name}</p>
                <p className="text-[10px] font-bold text-surface-900 bg-white px-1 border-2 border-surface-900 inline-block mt-0.5 shadow-[2px_2px_0_0_#0f172a]">
                    {category.count > 0 ? `${category.count} PRODUK` : 'SEGERA HADIR'}
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
        <section className="py-12 sm:py-16 overflow-hidden bg-[url('/img/grid.svg')] bg-[length:24px_24px]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-start"
                >
                    <div className="bg-[#FEF08A] px-4 py-2 border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] transform -rotate-1 mb-2">
                        <h2 className="text-2xl sm:text-3xl font-black font-display text-surface-900 tracking-tight uppercase">
                            JELAJAHI KATEGORI 🔥
                        </h2>
                    </div>
                    <p className="text-surface-900 bg-white px-3 py-1 border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] mt-1 text-sm sm:text-base font-bold uppercase transform rotate-1">
                        TEMUKAN MERCHANDISE BERDASARKAN KATEGORI FAVORITMU
                    </p>
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
