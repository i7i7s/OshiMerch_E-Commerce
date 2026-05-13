import { Head, Link, usePage, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

const formatPrice = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const ArrowRightIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);

const HeartIcon = ({ filled }) => (
    <svg className={`w-8 h-8 transition-all ${filled ? 'text-surface-900 fill-surface-900 scale-110' : 'text-surface-900'}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
);

const EmptyState = () => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
        className="relative overflow-hidden bg-[#FECDD3] border-4 border-surface-900 rounded-3xl p-10 sm:p-20 flex flex-col items-center text-center shadow-[12px_12px_0_0_#0f172a] transform -rotate-1 group">
        <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.2] pointer-events-none" />
        
        <motion.div animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-32 h-32 mx-auto mb-10">
            <div className="relative w-full h-full bg-white border-4 border-surface-900 shadow-[8px_8px_0_0_#0f172a] rounded-2xl flex items-center justify-center transform rotate-6 group-hover:rotate-0 transition-transform">
                <HeartIcon filled />
            </div>
        </motion.div>
        
        <h2 className="text-4xl sm:text-6xl font-black font-display text-surface-900 uppercase tracking-tight relative z-10" style={{ textShadow: '2px 2px 0px white' }}>Masih Sepi!</h2>
        <p className="mt-6 text-xl text-surface-900 bg-white border-2 border-surface-900 px-6 py-2 rounded-xl shadow-[2px_2px_0_0_#0f172a] font-bold relative z-10 max-w-lg">
            Simpan merchandise incaranmu dengan menekan ikon ❤️ di halaman produk!
        </p>
        
        <Link href={route('products.index')}
            className="relative mt-12 inline-flex items-center gap-4 px-10 py-5 rounded-xl bg-surface-900 border-4 border-transparent text-white font-black text-xl uppercase tracking-widest shadow-[6px_6px_0_0_rgba(15,23,42,0.2)] hover:bg-[#FEF08A] hover:border-surface-900 hover:text-surface-900 hover:shadow-[8px_8px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 transition-all active:translate-y-1 active:translate-x-1 active:shadow-none z-10">
            EKSPLOR SEKARANG <ArrowRightIcon />
        </Link>
    </motion.div>
);

export default function Favorites({ favorites = [] }) {
    const { auth } = usePage().props;

    const handleToggle = (listingId) => {
        router.post(route('favorites.toggle'), { listing_id: listingId }, {
            preserveScroll: true,
            preserveState: false, // let server re-send updated favorites list
        });
    };

    return (
        <>
            <Head title="Favorit — OshiMerch" />
            <div className="min-h-dvh bg-[#FAFAFA] flex flex-col font-sans selection:bg-surface-900 selection:text-[#FEF08A]">
                <Navbar />
                <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-12 pt-[120px]">
                    <div className="mb-12 border-b-4 border-surface-900 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="text-5xl sm:text-[4rem] lg:text-[6rem] font-black font-display text-surface-900 uppercase leading-[0.9] tracking-tighter"
                            style={{ textShadow: '4px 4px 0px #FEF08A, 6px 6px 0px #0f172a' }}>
                            FAVORIT<br />
                            SAYA.
                        </motion.h1>
                        {favorites.length > 0 && (
                            <div className="bg-white border-4 border-surface-900 px-6 py-3 rounded-2xl shadow-[4px_4px_0_0_#0f172a] transform rotate-2">
                                <p className="text-surface-900 font-black text-lg uppercase tracking-widest">{favorites.length} ITEM TERSIMPAN 🔐</p>
                            </div>
                        )}
                    </div>

                    {favorites.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {favorites.map((fav, i) => (
                                <motion.div key={fav.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                    className="group relative bg-white rounded-2xl border-4 border-surface-900 p-4 flex flex-col shadow-[4px_4px_0_0_#0f172a] hover:shadow-[8px_8px_0_0_#0f172a] hover:-translate-y-2 hover:-translate-x-1 transition-all">
                                    
                                    {/* Remove button */}
                                    <button onClick={() => handleToggle(fav.listing_id)}
                                        className="absolute top-2 right-2 z-10 w-12 h-12 rounded-xl border-4 border-surface-900 bg-[#FECDD3] shadow-[2px_2px_0_0_#0f172a] flex items-center justify-center transition-all hover:bg-white hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_0_#0f172a]">
                                        <HeartIcon filled />
                                    </button>

                                    <Link href={route('products.show', fav.listing_id)} className="flex-grow flex flex-col">
                                        <div className="aspect-[3/4] rounded-xl overflow-hidden bg-surface-100 mb-4 border-4 border-surface-900 shadow-[2px_2px_0_0_#0f172a]">
                                            {fav.listing?.image_url ? (
                                                <img src={fav.listing.image_url} alt={fav.listing.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                                            )}
                                        </div>
                                        
                                        {fav.listing?.status === 'Sold' && (
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-[#FECDD3] border-4 border-surface-900 text-surface-900 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl shadow-[2px_2px_0_0_#0f172a] transform -rotate-3">TERJUAL</span>
                                            </div>
                                        )}
                                        
                                        <div className="flex-1 flex flex-col justify-end">
                                            <p className="text-xl font-black font-display text-surface-900 uppercase tracking-tight line-clamp-2 leading-none mb-2 group-hover:text-primary-600 transition-colors">
                                                {fav.listing?.title}
                                            </p>
                                            <p className="text-xl font-black text-surface-900 bg-[#FEF08A] inline-block px-3 py-1 border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a] -rotate-1 mb-2">
                                                {formatPrice(fav.listing?.price ?? 0)}
                                            </p>
                                            <p className="text-xs font-bold text-surface-500 uppercase tracking-widest mt-auto">Disimpan {fav.created_at}</p>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </main>
                <Footer />
            </div>
        </>
    );
}
