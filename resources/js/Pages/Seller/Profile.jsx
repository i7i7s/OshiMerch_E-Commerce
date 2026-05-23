import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingBag, Award, Calendar, ArrowLeft, MessageSquare } from 'lucide-react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import ListingCard from '@/Components/ListingCard';

function StarRating({ rating, size = 'sm' }) {
    const s = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
    return (
        <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(i => (
                <Star key={i} className={`${s} ${i <= Math.round(rating) ? 'text-surface-900 fill-amber-400 stroke-2' : 'text-surface-300 fill-white stroke-2'}`} />
            ))}
        </div>
    );
}

function RatingBar({ star, count, total }) {
    const pct = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-surface-900 w-4 text-right">{star}</span>
            <Star className="w-4 h-4 text-surface-900 fill-amber-400 stroke-2 shrink-0" />
            <div className="flex-1 h-3 rounded-full bg-surface-100 border-2 border-surface-900 overflow-hidden relative">
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="absolute inset-y-0 left-0 bg-primary-400 border-r-2 border-surface-900" />
            </div>
            <span className="text-sm font-bold text-surface-900 w-6">{count}</span>
        </div>
    );
}

function ReviewCard({ review, index, onPhotoClick }) {
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl border-2 border-surface-900 p-5 shadow-[4px_4px_0_0_#0f172a] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0_0_#0f172a] transition-all">
            <div className="flex items-start gap-4">
                <img
                    src={review.reviewer.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewer.name)}&background=FF1100&color=fff&size=40`}
                    alt={review.reviewer.name}
                    className="w-12 h-12 rounded-xl border-2 border-surface-900 object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div>
                            <p className="font-black text-surface-900 text-base uppercase tracking-tight">{review.reviewer.name}</p>
                            {review.reviewer.oshi_member_name && (
                                <span className="inline-flex mt-1 text-[10px] font-bold text-primary-900 bg-primary-100 px-2 py-0.5 rounded-full border border-surface-900">
                                    Oshi: {review.reviewer.oshi_member_name}
                                </span>
                            )}
                        </div>
                        <span className="text-xs font-bold text-surface-500 shrink-0 bg-surface-100 px-2 py-1 rounded-md border border-surface-200">{review.created_at}</span>
                    </div>
                    <StarRating rating={review.rating} />
                    {review.product && (
                        <div className="mt-3 mb-1 text-[10px] font-black uppercase tracking-widest text-surface-900">
                            <span className="bg-[#BAE6FD] px-2 py-1 border-2 border-surface-900 inline-block shadow-[2px_2px_0_0_#0f172a] transform -rotate-1">
                                📦 {review.product.title}
                            </span>
                        </div>
                    )}
                    {review.comment && (
                        <div className="mt-3 bg-surface-50 p-3 rounded-xl border-2 border-surface-200">
                            <p className="text-sm font-medium text-surface-800 leading-relaxed">{review.comment}</p>
                        </div>
                    )}
                    {review.photo_urls?.length > 0 && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                            {review.photo_urls.map((url, pi) => (
                                <button key={pi} type="button" onClick={() => onPhotoClick(url)}
                                    className="w-16 h-16 rounded-xl overflow-hidden border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a] hover:scale-105 transition-transform">
                                    <img src={url} alt={`foto ${pi + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default function SellerProfile({ seller, listings, reviews, auth }) {
    const [activeTab, setActiveTab] = useState('profil');
    const [activePhoto, setActivePhoto] = useState(null);
    const currentUser = auth?.user;
    const isOwnProfile = currentUser?.id === seller.id;
    const avgRating = seller.avg_rating;
    const totalReviews = seller.total_reviews;

    const sellerAvatar = seller.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.name)}&background=FF1100&color=fff&size=160`;

    return (
        <>
            <Head title={`${seller.name} — OshiMerch`} />
            
            {/* Lightbox */}
            <AnimatePresence>
                {activePhoto && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={() => setActivePhoto(null)}>
                        <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            src={activePhoto} alt="Foto ulasan"
                            className="max-h-[90vh] max-w-full rounded-2xl border-4 border-white shadow-2xl object-contain"
                            onClick={e => e.stopPropagation()} />
                        <button onClick={() => setActivePhoto(null)}
                            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full border-4 border-surface-900 font-black text-xl flex items-center justify-center shadow-[2px_2px_0_0_#0f172a] hover:bg-red-400 hover:text-white transition-colors z-50">
                            ×
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="min-h-dvh bg-[#FAFAFA] flex flex-col font-sans">
                <Navbar />

                <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pt-[96px]">
                    {/* Back */}
                    <Link href={route('products.index')}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-surface-900 bg-white font-bold text-sm text-surface-900 hover:bg-surface-900 hover:text-white shadow-[2px_2px_0_0_#0f172a] mb-8 transition-all hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0_0_#0f172a]">
                        <ArrowLeft className="w-4 h-4" /> Kembali
                    </Link>

                    {/* ── Seller Header Card (Anti-Mainstream) ──────────────────────────────── */}
                    <div className="relative mb-10 mt-12 sm:mt-16">
                        {/* Banner Background element */}
                        <div className="absolute -top-10 sm:-top-16 left-4 sm:left-8 right-4 sm:right-8 h-24 sm:h-32 bg-primary-400 rounded-t-3xl border-2 border-surface-900 border-b-0 bg-[radial-gradient(#fff_3px,transparent_3px)] [background-size:20px_20px] opacity-90"></div>

                        <div className="bg-white rounded-3xl border-2 border-surface-900 shadow-[6px_6px_0_0_#0f172a] overflow-visible relative flex flex-col sm:flex-row items-center sm:items-start p-6 sm:p-8 pt-16 sm:pt-8 gap-6 z-10">
                            
                            {/* Avatar */}
                            <div className="sm:-mt-16 shrink-0 relative">
                                <img
                                    src={sellerAvatar}
                                    alt={seller.name}
                                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] object-cover bg-white"
                                />
                                {seller.role === 'seller' && (
                                    <div className="absolute -bottom-4 -right-4 bg-amber-300 text-surface-900 text-[10px] sm:text-xs font-black uppercase tracking-wide px-3 sm:px-4 py-1.5 rounded-full border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a] flex items-center gap-1.5 z-20 rotate-[-4deg] hover:rotate-0 transition-transform">
                                        <Award className="w-4 h-4" /> Terverifikasi
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center sm:text-left pt-2">
                                <h1 className="text-3xl sm:text-4xl font-black font-display text-surface-900 uppercase tracking-tight">
                                    {seller.name}
                                </h1>
                                <div className="flex justify-center sm:justify-start gap-3 mt-3 flex-wrap">
                                    {seller.oshi_member_name && (
                                        <span className="inline-flex items-center gap-1 text-xs font-bold text-surface-900 bg-[#E2E8F0] px-3 py-1.5 rounded-full border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a]">
                                            💖 Oshi: {seller.oshi_member_name}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="shrink-0 mt-4 sm:mt-0 w-full sm:w-auto flex justify-center pt-2">
                                {!isOwnProfile && currentUser ? (
                                    <Link
                                        href={route('chat.direct', seller.id)}
                                        className="inline-flex justify-center items-center gap-2 px-6 py-3.5 rounded-xl border-2 border-surface-900 bg-primary-400 text-surface-900 font-black text-sm uppercase tracking-wide shadow-[4px_4px_0_0_#0f172a] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#0f172a] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all w-full sm:w-auto"
                                    >
                                        <MessageSquare className="w-5 h-5 fill-surface-900 stroke-surface-900" /> Chat Penjual
                                    </Link>
                                ) : isOwnProfile ? (
                                    <Link
                                        href={route('profile.edit')}
                                        className="inline-flex justify-center items-center gap-2 px-6 py-3.5 rounded-xl border-2 border-surface-900 bg-[#E2E8F0] text-surface-900 font-black text-sm uppercase tracking-wide shadow-[4px_4px_0_0_#0f172a] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#0f172a] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all w-full sm:w-auto"
                                    >
                                        Edit Profil
                                    </Link>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* ── Tabs (Anti-Mainstream) ── */}
                    <div className="flex flex-wrap gap-4 mb-8">
                        {[
                            { key: 'profil', label: 'Profil' },
                            { key: 'produk', label: `Produk (${seller.active_listings})` },
                            { key: 'ulasan', label: `Ulasan (${totalReviews})` },
                        ].map(tab => {
                            const isActive = activeTab === tab.key;
                            return (
                                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                                    className={`px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wide transition-all border-2 border-surface-900 ${
                                        isActive
                                            ? 'bg-primary-400 text-surface-900 shadow-[4px_4px_0_0_#0f172a] -translate-y-[2px] -translate-x-[2px]'
                                            : 'bg-white text-surface-900 shadow-[0px_0px_0_0_#0f172a] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[4px_4px_0_0_#0f172a]'
                                    }`}>
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* ── Tab: Profil ── */}
                    {activeTab === 'profil' && (
                        <motion.div key="profil" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                            {/* Bio & Intro */}
                            <div className="md:col-span-2 space-y-6 sm:space-y-8">
                                <div className="bg-white rounded-3xl border-2 border-surface-900 p-6 sm:p-8 shadow-[6px_6px_0_0_#0f172a] relative overflow-hidden">
                                    {/* Decorative dots inside bio card */}
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-100 rounded-full border-2 border-surface-900 opacity-50 z-0 pointer-events-none"></div>
                                    <h2 className="relative z-10 text-2xl font-black font-display text-surface-900 mb-6 flex items-center gap-3 uppercase">
                                        <span className="w-10 h-10 rounded-xl bg-[#E2E8F0] flex items-center justify-center border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a] text-xl">👋</span>
                                        Tentang Penjual
                                    </h2>
                                    {seller.bio ? (
                                        <p className="relative z-10 text-surface-800 leading-relaxed font-bold text-lg whitespace-pre-wrap">
                                            {seller.bio}
                                        </p>
                                    ) : (
                                        <p className="relative z-10 text-surface-400 font-bold italic border-l-4 border-surface-300 pl-4 py-2">Belum ada deskripsi profil.</p>
                                    )}
                                </div>
                                
                                {/* Secondary Info Block */}
                                <div className="bg-primary-300 rounded-3xl border-2 border-surface-900 p-6 shadow-[6px_6px_0_0_#0f172a] bg-[radial-gradient(#1E293B_2px,transparent_2px)] [background-size:16px_16px]">
                                   <div className="bg-white inline-block p-4 rounded-xl border-2 border-surface-900 shadow-[4px_4px_0_0_#0f172a] hover:rotate-1 transition-transform">
                                        <p className="text-surface-900 font-black uppercase tracking-wide flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-primary-500" /> Member Sejak {seller.member_since}
                                        </p>
                                   </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="space-y-5">
                                <div className="bg-[#FEF08A] rounded-2xl border-2 border-surface-900 p-5 shadow-[4px_4px_0_0_#0f172a] flex items-center gap-5 hover:-translate-y-1 transition-transform">
                                    <div className="w-14 h-14 rounded-xl bg-white border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a] flex items-center justify-center shrink-0">
                                        <ShoppingBag className="w-7 h-7 text-surface-900" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-surface-800 font-black uppercase tracking-widest mb-0.5">Produk Aktif</p>
                                        <p className="text-4xl font-black font-display text-surface-900">{seller.active_listings}</p>
                                    </div>
                                </div>

                                <div className="bg-[#BAE6FD] rounded-2xl border-2 border-surface-900 p-5 shadow-[4px_4px_0_0_#0f172a] flex items-center gap-5 hover:-translate-y-1 transition-transform">
                                    <div className="w-14 h-14 rounded-xl bg-white border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a] flex items-center justify-center shrink-0">
                                        <Award className="w-7 h-7 text-surface-900" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-surface-800 font-black uppercase tracking-widest mb-0.5">Terjual</p>
                                        <p className="text-4xl font-black font-display text-surface-900">{seller.total_sales}</p>
                                    </div>
                                </div>

                                <div className="bg-[#FBCFE8] rounded-2xl border-2 border-surface-900 p-5 shadow-[4px_4px_0_0_#0f172a] flex items-center gap-5 hover:-translate-y-1 transition-transform">
                                    <div className="w-14 h-14 rounded-xl bg-white border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a] flex items-center justify-center shrink-0">
                                        <Star className="w-7 h-7 text-surface-900 fill-amber-400 stroke-surface-900 stroke-2" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-surface-800 font-black uppercase tracking-widest mb-0.5">Rating</p>
                                        <p className="text-4xl font-black font-display text-surface-900">
                                            {avgRating ?? '–'} <span className="text-lg font-bold text-surface-700">/ 5.0</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── Tab: Produk ── */}
                    {activeTab === 'produk' && (
                        <motion.div key="produk" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                            {listings.length === 0 ? (
                                <div className="bg-white rounded-3xl border-2 border-surface-900 p-16 text-center shadow-[6px_6px_0_0_#0f172a]">
                                    <ShoppingBag className="w-16 h-16 text-surface-300 mx-auto mb-4" />
                                    <p className="text-2xl font-black uppercase tracking-tight text-surface-900 mb-2">Belum ada produk</p>
                                    <p className="font-bold text-surface-500">Penjual ini belum memposting listing.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                                    {listings.map((item, i) => (
                                        <motion.div key={item.id}
                                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="hover:rotate-1 transition-transform origin-bottom-left"
                                        >
                                            <div className="h-full rounded-2xl border-2 border-surface-900 shadow-[4px_4px_0_0_#0f172a] overflow-hidden bg-white hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all">
                                                <ListingCard listing={item} />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ── Tab: Ulasan ── */}
                    {activeTab === 'ulasan' && (
                        <motion.div key="ulasan" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
                            {/* Rating summary */}
                            <div className="bg-white rounded-3xl border-2 border-surface-900 p-8 shadow-[6px_6px_0_0_#0f172a] h-fit sticky top-28">
                                <div className="text-center mb-8 border-b-2 border-surface-200 pb-8">
                                    <p className="text-7xl font-black font-display text-surface-900 mb-4 tracking-tighter">
                                        {avgRating ?? '–'}
                                    </p>
                                    <div className="flex justify-center mb-3">
                                        {avgRating ? <StarRating rating={avgRating} size="lg" /> : <StarRating rating={0} size="lg" />}
                                    </div>
                                    <p className="text-sm font-bold uppercase tracking-widest text-surface-500 bg-surface-100 inline-block px-3 py-1 rounded-lg border border-surface-200">{totalReviews} Ulasan</p>
                                </div>
                                <div className="space-y-4">
                                    {[5,4,3,2,1].map(star => (
                                        <RatingBar key={star} star={star}
                                            count={seller.rating_distribution?.[star] || 0}
                                            total={totalReviews} />
                                    ))}
                                </div>
                            </div>

                            {/* Reviews list */}
                            <div className="space-y-6">
                                {reviews.length === 0 ? (
                                    <div className="bg-white rounded-3xl border-2 border-surface-900 p-16 text-center shadow-[6px_6px_0_0_#0f172a]">
                                        <Star className="w-16 h-16 text-surface-300 mx-auto mb-4" />
                                        <p className="text-2xl font-black uppercase tracking-tight text-surface-900 mb-2">Belum ada ulasan</p>
                                        <p className="font-bold text-surface-500">
                                            Beli dan selesaikan transaksi untuk bisa memberi ulasan.
                                        </p>
                                    </div>
                                ) : (
                                    reviews.map((r, i) => <ReviewCard key={r.id} review={r} index={i} onPhotoClick={setActivePhoto} />)
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

