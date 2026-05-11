import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

// ─── Icons ────────────────────────────────────────────────────────────────────
const ArrowRightIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);

const TrashIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const CartBagIcon = () => (
    <svg className="w-20 h-20 text-surface-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);

const EmptyCartGraphic = () => (
    <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-48 h-48 mx-auto"
    >
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-primary-500/20 rounded-[3rem] blur-2xl" />
        <div className="relative w-full h-full bg-white/80 backdrop-blur-xl border-4 border-surface-950 shadow-2xl rounded-[3rem] flex items-center justify-center transform -rotate-6">
            <CartBagIcon />
        </div>
        <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-4 -right-4 w-12 h-12 bg-amber-400 rounded-full border-4 border-surface-50 flex items-center justify-center text-xl shadow-lg"
        >
            ✨
        </motion.div>
    </motion.div>
);

// ─── Cart Item Row ─────────────────────────────────────────────────────────────
function CartItemRow({ item, index, onRemove, isRemoving }) {
    const listing = item.listing;
    if (!listing) return null;

    const isUnavailable = listing.status !== 'Available';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
            className={`group flex flex-col sm:flex-row items-center gap-6 p-4 sm:p-6 bg-white rounded-[2rem] border-2 transition-all shadow-sm ${
                isUnavailable
                    ? 'border-red-200 opacity-60'
                    : 'border-surface-100 hover:border-surface-950'
            }`}
        >
            {/* Image */}
            <Link
                href={route('products.show', listing.id)}
                className="w-full sm:w-28 h-36 rounded-2xl overflow-hidden bg-surface-100 shrink-0 block"
            >
                {listing.image_url ? (
                    <img
                        src={listing.image_url}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-surface-300">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                )}
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
                <Link href={route('products.show', listing.id)}>
                    <p className="text-lg font-bold text-surface-950 line-clamp-2 hover:text-primary-600 transition-colors">
                        {listing.title}
                    </p>
                </Link>
                <p className="text-sm font-semibold text-surface-500 mt-1">
                    By {listing.seller?.name || 'Seller'}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap justify-center sm:justify-start">
                    {listing.condition && (
                        <span className="px-2 py-0.5 text-xs font-bold rounded-lg bg-surface-100 text-surface-600">
                            {listing.condition}
                        </span>
                    )}
                    {isUnavailable && (
                        <span className="px-2 py-0.5 text-xs font-bold rounded-lg bg-red-100 text-red-600">
                            {listing.status === 'Reserved' ? 'In Progress' : 'Terjual'}
                        </span>
                    )}
                </div>
            </div>

            {/* Price + Actions */}
            <div className="shrink-0 text-center sm:text-right flex flex-col items-center sm:items-end gap-3">
                <p className="text-2xl font-black text-surface-950">
                    Rp{listing.price.toLocaleString('id-ID')}
                </p>
                {!isUnavailable && (
                    <Link
                        href={route('products.show', listing.id)}
                        className="px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl bg-surface-950 text-white hover:bg-primary-600 transition-colors"
                    >
                        BELI
                    </Link>
                )}
                <button
                    onClick={() => onRemove(item.id)}
                    disabled={isRemoving}
                    className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                    aria-label="Hapus dari keranjang"
                >
                    <TrashIcon /> Hapus
                </button>
            </div>
        </motion.div>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Cart({ cartItems = [], auth }) {
    const [removingId, setRemovingId] = useState(null);
    const [clearing, setClearing] = useState(false);

    // Hanya hitung item yang masih Available
    const availableItems = cartItems.filter(i => i.listing?.status === 'Available');
    const total = availableItems.reduce((sum, i) => sum + (i.listing?.price || 0), 0);

    const handleRemove = (cartItemId) => {
        setRemovingId(cartItemId);
        router.delete(route('cart.remove', cartItemId), {
            preserveScroll: true,
            onFinish: () => setRemovingId(null),
        });
    };

    const handleClear = () => {
        if (!confirm('Hapus semua item dari keranjang?')) return;
        setClearing(true);
        router.delete(route('cart.clear'), {
            preserveScroll: true,
            onFinish: () => setClearing(false),
        });
    };

    return (
        <>
            <Head title="Keranjang — OshiMerch" />
            <div className="min-h-dvh bg-surface-50 flex flex-col font-sans">
                <Navbar auth={auth} />

                <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-12 pt-[120px]">
                    {/* Header */}
                    <div className="mb-12">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl sm:text-[5rem] lg:text-[7rem] font-black font-display text-surface-950 uppercase leading-[0.85] tracking-tighter"
                        >
                            KERANJANG<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-purple-500 to-pink-500">
                                BELANJA.
                            </span>
                        </motion.h1>
                        {cartItems.length > 0 && (
                            <p className="mt-4 text-surface-500 font-medium text-lg">
                                {cartItems.length} item{cartItems.length > 1 ? '' : ''} — disimpan di akun kamu 🔐
                            </p>
                        )}
                    </div>

                    {cartItems.length === 0 ? (
                        /* ── Empty state ─── */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative overflow-hidden bg-surface-950 rounded-[3rem] p-10 sm:p-20 flex flex-col items-center text-center shadow-2xl"
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />

                            <EmptyCartGraphic />

                            <h2 className="mt-12 text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                                Kosong Melompong
                            </h2>
                            <p className="mt-6 text-lg text-surface-400 max-w-lg mx-auto font-medium">
                                Belum ada merchandise impian yang mendarat di sini. Yuk hunting photocard atau lightstick incaranmu!
                            </p>

                            <Link
                                href={route('products.index')}
                                className="group relative mt-10 inline-flex items-center gap-4 px-10 py-5 rounded-full bg-white text-surface-950 font-black text-lg overflow-hidden transition-all hover:scale-105 active:scale-95"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="relative z-10 group-hover:text-white transition-colors duration-300">Hunting Merch</span>
                                <span className="relative z-10 group-hover:text-white transition-colors duration-300 group-hover:translate-x-1 transition-transform">
                                    <ArrowRightIcon />
                                </span>
                            </Link>
                        </motion.div>
                    ) : (
                        /* ── Cart with items ─── */
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
                            {/* Items list */}
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {cartItems.map((item, i) => (
                                        <CartItemRow
                                            key={item.id}
                                            item={item}
                                            index={i}
                                            onRemove={handleRemove}
                                            isRemoving={removingId === item.id}
                                        />
                                    ))}
                                </AnimatePresence>

                                {cartItems.length > 1 && (
                                    <button
                                        onClick={handleClear}
                                        disabled={clearing}
                                        className="text-xs font-black uppercase tracking-wider text-surface-400 hover:text-red-500 transition-colors underline underline-offset-4 disabled:opacity-50"
                                    >
                                        {clearing ? 'Menghapus...' : 'Hapus Semua'}
                                    </button>
                                )}
                            </div>

                            {/* Summary sticky */}
                            <div className="sticky top-28 bg-surface-950 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/30 blur-[50px] rounded-full pointer-events-none" />

                                <h3 className="text-2xl font-black uppercase tracking-tight mb-8 relative">Ringkasan</h3>

                                <div className="space-y-4 text-base font-medium relative">
                                    <div className="flex justify-between text-surface-400">
                                        <span>Item tersedia</span>
                                        <span className="text-white font-bold">{availableItems.length}</span>
                                    </div>
                                    {cartItems.length !== availableItems.length && (
                                        <div className="flex justify-between text-red-400 text-sm">
                                            <span>Item tidak tersedia</span>
                                            <span>{cartItems.length - availableItems.length}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-surface-400">
                                        <span>Estimasi total</span>
                                        <span className="text-white">Rp{total.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-surface-400">
                                        <span>Biaya Layanan</span>
                                        <span className="text-white">Gratis</span>
                                    </div>
                                </div>

                                <div className="border-t-2 border-surface-800 my-8" />

                                <div className="flex justify-between items-end mb-6 relative">
                                    <span className="text-surface-400 font-bold">Total</span>
                                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">
                                        Rp{total.toLocaleString('id-ID')}
                                    </span>
                                </div>

                                <p className="text-xs text-surface-500 font-medium mb-5 text-center relative">
                                    Klik "BELI" pada tiap item untuk checkout langsung ke seller.
                                </p>

                                <Link
                                    href={route('products.index')}
                                    className="w-full block py-4 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-all text-center relative"
                                >
                                    + Tambah Item Lagi
                                </Link>
                            </div>
                        </div>
                    )}
                </main>

                <Footer />
            </div>
        </>
    );
}
