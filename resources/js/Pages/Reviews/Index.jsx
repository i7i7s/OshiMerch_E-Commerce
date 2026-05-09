import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

const StarRating = ({ rating, size = 'sm' }) => {
    const sz = size === 'lg' ? 'w-7 h-7' : 'w-4 h-4';
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} className={`${sz} ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-surface-200 fill-surface-200'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                </svg>
            ))}
        </div>
    );
};

export default function Index({ seller, reviews, avg_rating, total_reviews, breakdown }) {
    return (
        <>
            <Head title={`Ulasan ${seller.name} — OshiMerch`} />
            <div className="min-h-dvh bg-surface-50 flex flex-col">
                <Navbar />
                <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12 pt-[100px]">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-surface-950 rounded-[2.5rem] p-8 sm:p-12 text-white mb-8 relative overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full pointer-events-none" />
                        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <img
                                src={seller.profile_picture_url || `https://ui-avatars.com/api/?name=${seller.name}&background=8B3DFF&color=fff&size=80`}
                                alt={seller.name}
                                className="w-20 h-20 rounded-2xl border-4 border-white/20 object-cover"
                            />
                            <div className="flex-1 text-center sm:text-left">
                                <p className="text-sm font-semibold text-purple-300 mb-1">{seller.oshi_member_name ?? 'OshiMerch Seller'}</p>
                                <h1 className="text-3xl sm:text-4xl font-black">{seller.name}</h1>
                                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 mt-4">
                                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                                        {avg_rating.toFixed(1)}
                                    </div>
                                    <div>
                                        <StarRating rating={Math.round(avg_rating)} size="lg" />
                                        <p className="text-surface-400 text-sm mt-1">{total_reviews} ulasan</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Star breakdown */}
                        <div className="relative mt-8 space-y-2">
                            {[5, 4, 3, 2, 1].map(star => (
                                <div key={star} className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-surface-300 w-4">{star}</span>
                                    <svg className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${breakdown[star]?.percent ?? 0}%` }}
                                            transition={{ duration: 0.8, delay: (5 - star) * 0.1 }}
                                            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                                        />
                                    </div>
                                    <span className="text-xs text-surface-400 w-8 text-right">{breakdown[star]?.count ?? 0}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Reviews list */}
                    {reviews.data.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-center py-20">
                            <p className="text-5xl mb-4">⭐</p>
                            <p className="text-xl font-bold text-surface-800">Belum Ada Ulasan</p>
                            <p className="text-surface-500 mt-2">Penjual ini belum menerima ulasan dari pembeli.</p>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.data.map((review, i) => (
                                <motion.div key={review.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={review.reviewer?.profile_picture_url || `https://ui-avatars.com/api/?name=${review.reviewer?.name}&background=8B3DFF&color=fff`}
                                            alt={review.reviewer?.name}
                                            className="w-10 h-10 rounded-xl object-cover shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <p className="font-bold text-surface-900">{review.reviewer?.name}</p>
                                                <p className="text-xs text-surface-400">{review.created_at}</p>
                                            </div>
                                            <StarRating rating={review.rating} />
                                            {review.comment && (
                                                <p className="text-surface-600 text-sm mt-2 leading-relaxed">{review.comment}</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {reviews.links && reviews.last_page > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {reviews.links.map((link, i) => (
                                link.url ? (
                                    <Link key={i} href={link.url}
                                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${link.active ? 'bg-surface-950 text-white' : 'bg-white border border-surface-200 text-surface-700 hover:border-surface-950'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span key={i} className="px-4 py-2 rounded-xl text-sm text-surface-300 bg-white border border-surface-100"
                                        dangerouslySetInnerHTML={{ __html: link.label }} />
                                )
                            ))}
                        </div>
                    )}
                </main>
                <Footer />
            </div>
        </>
    );
}
