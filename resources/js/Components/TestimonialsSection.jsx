import { motion } from 'framer-motion';
import { TESTIMONIALS } from '@/data/products';

const StarIcon = ({ filled }) => (
    <svg className={`w-4 h-4 ${filled ? 'text-amber-400 fill-amber-400' : 'text-surface-300'}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

export default function TestimonialsSection() {
    return (
        <section className="py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold font-display text-surface-900 tracking-tight mb-2">
                        Kata Mereka 💬
                    </h2>
                    <p className="text-surface-500 text-sm sm:text-base">Pengalaman fans yang sudah belanja di OshiMerch</p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {TESTIMONIALS.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -4 }}
                            className="p-6 rounded-2xl bg-white border border-surface-200/80 hover:border-primary-200 transition-all hover:shadow-card-hover"
                        >
                            <div className="flex items-center gap-0.5 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon key={i} filled={i < item.rating} />
                                ))}
                            </div>
                            <p className="text-surface-700 text-sm leading-relaxed mb-4">"{item.text}"</p>
                            <div className="flex items-center gap-3">
                                <img src={item.avatar} alt={item.name} className="w-9 h-9 rounded-full" />
                                <div>
                                    <p className="text-sm font-semibold text-surface-800">{item.name}</p>
                                    <p className="text-[11px] text-surface-400">Verified Buyer</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
