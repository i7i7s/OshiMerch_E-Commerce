import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

const formatPrice = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const ArrowRightIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);

const HeartIcon = ({ filled }) => (
    <svg className={`w-5 h-5 transition-all ${filled ? 'text-rose-500 fill-rose-500 scale-110' : 'text-surface-400'}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
);

const EmptyState = () => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
        className="relative overflow-hidden bg-surface-950 rounded-[3rem] p-10 sm:p-20 flex flex-col items-center text-center shadow-2xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-rose-500/20 blur-[100px] rounded-full pointer-events-none" />
        <motion.div animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-40 h-40 mx-auto mb-10">
            <div className="absolute inset-0 bg-rose-500/30 rounded-[3rem] blur-2xl" />
            <div className="relative w-full h-full bg-white/80 backdrop-blur-xl border-4 border-surface-950 shadow-2xl rounded-[3rem] flex items-center justify-center transform rotate-6">
                <HeartIcon filled />
            </div>
        </motion.div>
        <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">Masih Sepi</h2>
        <p className="mt-6 text-lg text-surface-400 max-w-lg mx-auto font-medium">
            Simpan merchandise incaranmu dengan menekan ikon ❤️ di halaman produk!
        </p>
        <Link href={route('products.index')}
            className="group relative mt-10 inline-flex items-center gap-4 px-10 py-5 rounded-full bg-white text-surface-950 font-black text-lg overflow-hidden transition-all hover:scale-105 active:scale-95">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">Eksplor Sekarang</span>
            <span className="relative z-10 group-hover:text-white transition-colors duration-300 transform group-hover:translate-x-1"><ArrowRightIcon /></span>
        </Link>
    </motion.div>
);

export default function Favorites({ favorites = [] }) {
    const { auth } = usePage().props;

    const handleToggle = async (listingId) => {
        try {
            await fetch('/api/favorites/toggle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ listing_id: listingId }),
            });
            // Reload to reflect change — Inertia router.reload() would be better
            window.location.reload();
        } catch {}
    };

    return (
        <>
            <Head title="Favorit — OshiMerch" />
            <div className="min-h-dvh bg-surface-50 flex flex-col font-sans">
                <Navbar />
                <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-12 pt-[120px]">
                    <div className="mb-12 flex items-end justify-between flex-wrap gap-4">
                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="text-6xl sm:text-[5rem] lg:text-[7rem] font-black font-display text-surface-950 uppercase leading-[0.85] tracking-tighter">
                            FAVORIT<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">SAYA.</span>
                        </motion.h1>
                        {favorites.length > 0 && (
                            <p className="text-surface-500 font-semibold text-lg pb-4">{favorites.length} item tersimpan</p>
                        )}
                    </div>

                    {favorites.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                            {favorites.map((fav, i) => (
                                <motion.div key={fav.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                    className="group relative">
                                    {/* Remove button */}
                                    <button onClick={() => handleToggle(fav.listing_id)}
                                        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                                        <HeartIcon filled />
                                    </button>

                                    <Link href={route('products.show', fav.listing_id)} className="block">
                                        <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-surface-100 mb-4 border-2 border-transparent group-hover:border-rose-400 transition-all duration-300 shadow-sm group-hover:shadow-xl">
                                            {fav.listing?.image_url ? (
                                                <img src={fav.listing.image_url} alt={fav.listing.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                                            )}
                                        </div>
                                        {fav.listing?.status === 'Sold' && (
                                            <div className="absolute inset-0 bg-white/60 rounded-[2rem] flex items-center justify-center">
                                                <span className="bg-surface-950 text-white text-xs font-black px-3 py-1.5 rounded-full">TERJUAL</span>
                                            </div>
                                        )}
                                        <p className="text-base font-bold text-surface-950 line-clamp-2 leading-snug group-hover:text-rose-500 transition-colors">
                                            {fav.listing?.title}
                                        </p>
                                        <p className="text-base font-black text-surface-500 mt-1">
                                            {formatPrice(fav.listing?.price ?? 0)}
                                        </p>
                                        <p className="text-xs text-surface-400 mt-1">Disimpan {fav.created_at}</p>
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
