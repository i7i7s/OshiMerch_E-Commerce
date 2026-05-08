import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Award, Calendar, ArrowLeft } from 'lucide-react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import ListingCard from '@/Components/ListingCard';

function StarRating({ rating, size = 'sm' }) {
    const s = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
    return (
        <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map(i => (
                <Star key={i} className={`${s} ${i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-surface-200 fill-surface-200'}`} />
            ))}
        </div>
    );
}

function RatingBar({ star, count, total }) {
    const pct = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className="flex items-center gap-3">
            <span className="text-xs text-surface-600 w-4 text-right">{star}</span>
            <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
            <div className="flex-1 h-2 rounded-full bg-surface-100 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="h-full rounded-full bg-amber-400" />
            </div>
            <span className="text-xs text-surface-500 w-4">{count}</span>
        </div>
    );
}

function ReviewCard({ review, index }) {
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl border border-surface-200 p-5">
            <div className="flex items-start gap-3">
                <img
                    src={review.reviewer.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewer.name)}&background=FF1100&color=fff&size=40`}
                    alt={review.reviewer.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div>
                            <p className="font-semibold text-surface-900 text-sm">{review.reviewer.name}</p>
                            {review.reviewer.oshi_member_name && (
                                <p className="text-[10px] text-primary-500">Oshi: {review.reviewer.oshi_member_name}</p>
                            )}
                        </div>
                        <span className="text-[10px] text-surface-400 shrink-0">{review.created_at}</span>
                    </div>
                    <StarRating rating={review.rating} />
                    {review.comment && (
                        <p className="text-sm text-surface-600 mt-2 leading-relaxed">{review.comment}</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default function SellerProfile({ seller, listings, reviews, auth }) {
    const [activeTab, setActiveTab] = useState('produk');
    const currentUser = auth?.user;
    const isOwnProfile = currentUser?.id === seller.id;
    const avgRating = seller.avg_rating;
    const totalReviews = seller.total_reviews;

    const sellerAvatar = seller.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.name)}&background=FF1100&color=fff&size=160`;

    return (
        <>
            <Head title={`${seller.name} — OshiMerch`} />
            <div className="min-h-dvh bg-surface-50 flex flex-col">
                <Navbar />

                <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pt-[96px]">
                    {/* Back */}
                    <Link href={route('products.index')}
                        className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" />Kembali
                    </Link>

                    {/* ── Seller Header Card ──────────────────────────────── */}
                    <div className="bg-white rounded-3xl border border-surface-200 overflow-hidden mb-6 shadow-sm">

                        {/* Banner */}
                        <div className="h-28 sm:h-36 gradient-primary relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20"
                                style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                        </div>

                        {/* Content below banner */}
                        <div className="px-5 sm:px-6 pb-6">
                            {/* Avatar row — only avatar overlaps banner, action button floats right */}
                            <div className="flex items-start justify-between -mt-10 sm:-mt-12 mb-4">
                                {/* Avatar */}
                                <img
                                    src={sellerAvatar}
                                    alt={seller.name}
                                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white shadow-lg object-cover shrink-0"
                                />

                                {/* Action button — aligned to top, sits in normal flow above the pull-up */}
                                <div className="mt-14 sm:mt-16">
                                    {!isOwnProfile && currentUser ? (
                                        <Link
                                            href={route('chat.direct', seller.id)}
                                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-primary-400 text-primary-600 font-semibold text-sm hover:bg-primary-50 transition-all"
                                        >
                                            💬 Chat Penjual
                                        </Link>
                                    ) : isOwnProfile ? (
                                        <Link
                                            href={route('profile.edit')}
                                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-surface-300 text-surface-700 font-semibold text-sm hover:bg-surface-50 transition-all"
                                        >
                                            Edit Profil
                                        </Link>
                                    ) : null}
                                </div>
                            </div>

                            {/* Name + info — clearly below avatar, no negative margin */}
                            <div className="space-y-1.5 mb-5">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className="text-xl sm:text-2xl font-bold font-display text-surface-900">
                                        {seller.name}
                                    </h1>
                                    {seller.role === 'seller' && (
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-200">
                                            <Award className="w-3 h-3" />Penjual Terverifikasi
                                        </span>
                                    )}
                                </div>

                                {seller.oshi_member_name && (
                                    <p className="text-sm text-primary-500 font-medium">
                                        Oshi: {seller.oshi_member_name}
                                    </p>
                                )}

                                <p className="text-xs text-surface-400 flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />Member sejak {seller.member_since}
                                </p>

                                {seller.bio && (
                                    <p className="text-sm text-surface-600 leading-relaxed max-w-xl pt-1">
                                        {seller.bio}
                                    </p>
                                )}
                            </div>

                            {/* Stats row */}
                            <div className="flex flex-wrap gap-6 pt-5 border-t border-surface-100">
                                <div>
                                    <p className="text-xl font-bold font-display text-surface-900">{seller.active_listings}</p>
                                    <p className="text-xs text-surface-500 mt-0.5">Produk Aktif</p>
                                </div>
                                <div>
                                    <p className="text-xl font-bold font-display text-surface-900">{seller.total_sales}</p>
                                    <p className="text-xs text-surface-500 mt-0.5">Terjual</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-xl font-bold font-display text-surface-900">
                                            {avgRating ?? '–'}
                                        </p>
                                        {avgRating && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                                    </div>
                                    <p className="text-xs text-surface-500 mt-0.5">{totalReviews} Ulasan</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Tabs ── */}
                    <div className="flex gap-1 p-1 bg-surface-100 rounded-2xl mb-6 w-fit">
                        {[
                            { key: 'produk', label: `Produk (${seller.active_listings})` },
                            { key: 'ulasan', label: `Ulasan (${totalReviews})` },
                        ].map(tab => (
                            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                    activeTab === tab.key
                                        ? 'bg-white text-primary-600 shadow-sm'
                                        : 'text-surface-500 hover:text-surface-700'
                                }`}>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* ── Tab: Produk ── */}
                    {activeTab === 'produk' && (
                        <motion.div key="produk" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                            {listings.length === 0 ? (
                                <div className="bg-white rounded-2xl border border-dashed border-surface-300 p-16 text-center">
                                    <ShoppingBag className="w-10 h-10 text-surface-300 mx-auto mb-3" />
                                    <p className="font-bold text-surface-700 mb-1">Belum ada produk aktif</p>
                                    <p className="text-sm text-surface-500">Penjual ini belum memposting listing.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {listings.map((item, i) => (
                                        <motion.div key={item.id}
                                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.04 }}>
                                            <ListingCard listing={item} />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ── Tab: Ulasan ── */}
                    {activeTab === 'ulasan' && (
                        <motion.div key="ulasan" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                            {/* Rating summary */}
                            <div className="bg-white rounded-2xl border border-surface-200 p-6 h-fit">
                                <div className="text-center mb-5">
                                    <p className="text-5xl font-bold font-display text-surface-900 mb-1">
                                        {avgRating ?? '–'}
                                    </p>
                                    {avgRating && <StarRating rating={avgRating} size="md" />}
                                    <p className="text-xs text-surface-500 mt-2">{totalReviews} ulasan</p>
                                </div>
                                <div className="space-y-2">
                                    {[5,4,3,2,1].map(star => (
                                        <RatingBar key={star} star={star}
                                            count={seller.rating_distribution?.[star] || 0}
                                            total={totalReviews} />
                                    ))}
                                </div>
                            </div>

                            {/* Reviews list */}
                            <div className="space-y-4">
                                {reviews.length === 0 ? (
                                    <div className="bg-white rounded-2xl border border-dashed border-surface-300 p-12 text-center">
                                        <Star className="w-10 h-10 text-surface-300 mx-auto mb-3" />
                                        <p className="font-bold text-surface-700 mb-1">Belum ada ulasan</p>
                                        <p className="text-sm text-surface-500">
                                            Beli dan selesaikan transaksi untuk bisa memberi ulasan.
                                        </p>
                                    </div>
                                ) : (
                                    reviews.map((r, i) => <ReviewCard key={r.id} review={r} index={i} />)
                                )}
                            </div>
                        </motion.div>
                    )}
                </main>

                <Footer />
            </div>
        </>
    );
}
