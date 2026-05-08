import { motion } from 'framer-motion';
import ProductCard from '@/Components/ProductCard';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06 },
    },
};

export default function ProductGrid({ products, title, subtitle, viewAllHref, columns = 4 }) {
    const gridCols = {
        3: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
        5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
        6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
    };

    return (
        <section className="py-12 sm:py-16">
            {(title || subtitle) && (
                <div className="flex items-end justify-between mb-8">
                    <div>
                        {title && (
                            <h2 className="text-2xl sm:text-3xl font-bold font-display text-surface-900 tracking-tight">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="text-surface-500 mt-1 text-sm sm:text-base">{subtitle}</p>
                        )}
                    </div>
                    {viewAllHref && (
                        <a
                            href={viewAllHref}
                            className="shrink-0 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1 group"
                        >
                            Lihat Semua
                            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </a>
                    )}
                </div>
            )}

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className={`grid ${gridCols[columns] || gridCols[4]} gap-4 sm:gap-5`}
            >
                {products.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                ))}
            </motion.div>
        </section>
    );
}
