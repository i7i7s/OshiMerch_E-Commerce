import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

// ─── Icons ────────────────────────────────────────────────────────────────────
const ArrowRightIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);

const TrashIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const CartBagIcon = () => (
    <svg className="w-24 h-24 text-surface-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter">
        <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);

const EmptyCartGraphic = () => (
    <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-48 h-48 mx-auto"
    >
        <div className="relative w-full h-full bg-[#BAE6FD] border-4 border-surface-900 shadow-[8px_8px_0_0_#0f172a] rounded-2xl flex items-center justify-center transform -rotate-6 group-hover:rotate-0 transition-transform">
            <CartBagIcon />
        </div>
        <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-6 -right-6 w-16 h-16 bg-[#FEF08A] rounded-full border-4 border-surface-900 flex items-center justify-center text-3xl shadow-[4px_4px_0_0_#0f172a]"
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
            className={`group flex flex-col sm:flex-row items-center sm:items-stretch gap-0 bg-white rounded-2xl border-4 shadow-[6px_6px_0_0_#0f172a] transition-all hover:shadow-[8px_8px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 overflow-hidden ${
                isUnavailable
                    ? 'border-surface-400 opacity-60'
                    : 'border-surface-900'
            }`}
        >
            {/* Image */}
            <Link
                href={route('products.show', listing.id)}
                className="w-full sm:w-36 h-48 sm:h-auto bg-[#FAFAFA] border-b-4 sm:border-b-0 sm:border-r-4 border-surface-900 shrink-0 block relative overflow-hidden"
            >
                {listing.image_url ? (
                    <img
                        src={listing.image_url}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-surface-900">
                        <CartBagIcon />
                    </div>
                )}
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0 p-5 flex flex-col justify-between">
                <div>
                    <Link href={route('products.show', listing.id)}>
                        <p className="text-xl font-black font-display text-surface-900 uppercase tracking-tight line-clamp-2 hover:text-primary-600 transition-colors">
                            {listing.title}
                        </p>
                    </Link>
                    <p className="text-sm font-bold text-surface-600 mt-2 bg-surface-100 inline-block px-3 py-1 border-2 border-surface-900 rounded-lg">
                        By <span className="font-black text-surface-900">{listing.seller?.name || 'Seller'}</span>
                    </p>
                </div>
                <div className="flex items-center gap-3 mt-4 flex-wrap">
                    {listing.condition && (
                        <span className="px-3 py-1 border-2 border-surface-900 text-xs font-black uppercase tracking-widest rounded-lg bg-[#BAE6FD] text-surface-900 shadow-[2px_2px_0_0_#0f172a]">
                            {listing.condition}
                        </span>
                    )}
                    {isUnavailable && (
                        <span className="px-3 py-1 border-2 border-surface-900 text-xs font-black uppercase tracking-widest rounded-lg bg-[#FECDD3] text-surface-900 shadow-[2px_2px_0_0_#0f172a]">
                            {listing.status === 'Reserved' ? 'IN PROGRESS' : 'TERJUAL'}
                        </span>
                    )}
                </div>
            </div>

            {/* Price + Actions */}
            <div className="shrink-0 p-5 bg-[#FAFAFA] border-t-4 sm:border-t-0 sm:border-l-4 border-surface-900 flex flex-col items-center sm:items-end justify-between min-w-[160px]">
                <p className="text-2xl font-black text-surface-900 mb-4 bg-[#FEF08A] px-3 py-1 border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a] -rotate-2">
                    Rp{listing.price.toLocaleString('id-ID')}
                </p>
                
                <div className="flex flex-col w-full gap-3 mt-auto">
                    {!isUnavailable && (
                        <Link
                            href={route('checkout.show', listing.id)}
                            className="w-full py-3 text-center text-sm font-black uppercase tracking-widest rounded-xl bg-[#A7F3D0] border-4 border-surface-900 text-surface-900 shadow-[4px_4px_0_0_#0f172a] hover:shadow-[6px_6px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 transition-all active:translate-y-1 active:translate-x-1 active:shadow-none"
                        >
                            BELI
                        </Link>
                    )}
                    <button
                        onClick={() => onRemove(item.id)}
                        disabled={isRemoving}
                        className="w-full flex items-center justify-center gap-2 py-3 text-sm font-black uppercase tracking-widest rounded-xl bg-[#FECDD3] border-4 border-surface-900 text-surface-900 shadow-[4px_4px_0_0_#0f172a] hover:shadow-[6px_6px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 transition-all disabled:opacity-50 active:translate-y-1 active:translate-x-1 active:shadow-none"
                        aria-label="Hapus dari keranjang"
                    >
                        <TrashIcon /> HAPUS
                    </button>
                </div>
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
            <div className="min-h-dvh bg-[#FAFAFA] flex flex-col font-sans selection:bg-surface-900 selection:text-[#FEF08A]">
                <Navbar auth={auth} />

                <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-12 pt-[120px]">
                    {/* Brutalist Header */}
                    <div className="mb-12 border-b-4 border-surface-900 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-5xl sm:text-[4rem] lg:text-[6rem] font-black font-display text-surface-900 uppercase leading-[0.9] tracking-tighter"
                                style={{ textShadow: '4px 4px 0px #FEF08A, 6px 6px 0px #0f172a' }}
                            >
                                KERANJANG<br />
                                BELANJA.
                            </motion.h1>
                        </div>
                        {cartItems.length > 0 && (
                            <div className="bg-white border-4 border-surface-900 px-6 py-3 rounded-2xl shadow-[4px_4px_0_0_#0f172a] transform rotate-2">
                                <p className="text-surface-900 font-black text-lg uppercase tracking-widest">
                                    {cartItems.length} ITEM DISIMPAN 🔐
                                </p>
                            </div>
                        )}
                    </div>

                    {cartItems.length === 0 ? (
                        /* ── Brutalist Empty state ─── */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative overflow-hidden bg-[#FECDD3] border-4 border-surface-900 rounded-3xl p-10 sm:p-24 flex flex-col items-center text-center shadow-[12px_12px_0_0_#0f172a] group"
                        >
                            <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.2] pointer-events-none" />

                            <EmptyCartGraphic />

                            <h2 className="mt-16 text-4xl sm:text-6xl font-black font-display text-surface-900 uppercase tracking-tight relative z-10" style={{ textShadow: '2px 2px 0px white' }}>
                                Kosong Melompong!
                            </h2>
                            <p className="mt-6 text-xl text-surface-900 bg-white border-2 border-surface-900 px-6 py-2 rounded-xl shadow-[2px_2px_0_0_#0f172a] font-bold relative z-10 max-w-lg">
                                Belum ada merchandise impian yang mendarat di sini. Yuk hunting sekarang!
                            </p>

                            <Link
                                href={route('products.index')}
                                className="relative mt-12 inline-flex items-center gap-4 px-10 py-5 rounded-xl bg-surface-900 border-4 border-transparent text-white font-black text-xl uppercase tracking-widest shadow-[6px_6px_0_0_rgba(15,23,42,0.2)] hover:bg-[#FEF08A] hover:border-surface-900 hover:text-surface-900 hover:shadow-[8px_8px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 transition-all active:translate-y-1 active:translate-x-1 active:shadow-none z-10"
                            >
                                HUNTING MERCH <ArrowRightIcon />
                            </Link>
                        </motion.div>
                    ) : (
                        /* ── Cart with items ─── */
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-start">
                            {/* Items list */}
                            <div className="space-y-6">
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
                                    <div className="flex justify-end pt-4">
                                        <button
                                            onClick={handleClear}
                                            disabled={clearing}
                                            className="px-6 py-3 bg-white border-4 border-surface-900 rounded-xl text-sm font-black uppercase tracking-widest text-surface-900 shadow-[4px_4px_0_0_#0f172a] hover:bg-[#FECDD3] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all disabled:opacity-50 active:translate-y-1 active:translate-x-1 active:shadow-none"
                                        >
                                            {clearing ? 'MENGHAPUS...' : 'HAPUS SEMUA'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Brutalist Summary sticky */}
                            <div className="sticky top-32 bg-[#C7D2FE] border-4 border-surface-900 rounded-3xl p-8 shadow-[12px_12px_0_0_#0f172a] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[url('/img/grid.svg')] opacity-[0.3]" />

                                <h3 className="text-3xl font-black font-display uppercase tracking-tight mb-8 text-surface-900 border-b-4 border-surface-900 pb-4 relative z-10">RINGKASAN</h3>

                                <div className="space-y-6 text-lg font-bold text-surface-900 relative z-10">
                                    <div className="flex justify-between items-center bg-white px-4 py-3 border-2 border-surface-900 rounded-xl shadow-[2px_2px_0_0_#0f172a]">
                                        <span className="uppercase text-sm font-black">Item Tersedia</span>
                                        <span className="text-xl font-black bg-[#BAE6FD] px-3 py-1 rounded-lg border-2 border-surface-900">{availableItems.length}</span>
                                    </div>
                                    {cartItems.length !== availableItems.length && (
                                        <div className="flex justify-between items-center bg-white px-4 py-3 border-2 border-surface-900 rounded-xl shadow-[2px_2px_0_0_#0f172a]">
                                            <span className="uppercase text-sm font-black text-[#f43f5e]">Tidak Tersedia</span>
                                            <span className="text-xl font-black bg-[#FECDD3] text-[#f43f5e] px-3 py-1 rounded-lg border-2 border-surface-900">{cartItems.length - availableItems.length}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center bg-white px-4 py-3 border-2 border-surface-900 rounded-xl shadow-[2px_2px_0_0_#0f172a]">
                                        <span className="uppercase text-sm font-black">Estimasi Total</span>
                                        <span className="font-black">Rp{total.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white px-4 py-3 border-2 border-surface-900 rounded-xl shadow-[2px_2px_0_0_#0f172a]">
                                        <span className="uppercase text-sm font-black">Biaya Layanan</span>
                                        <span className="font-black bg-[#A7F3D0] px-3 py-1 rounded-lg border-2 border-surface-900">GRATIS</span>
                                    </div>
                                </div>

                                <div className="border-t-4 border-surface-900 my-8" />

                                <div className="flex flex-col bg-[#FEF08A] border-4 border-surface-900 p-6 rounded-2xl shadow-[4px_4px_0_0_#0f172a] mb-8 relative z-10 transform -rotate-1">
                                    <span className="text-surface-900 font-black uppercase tracking-widest text-sm mb-2">TOTAL KESELURUHAN</span>
                                    <span className="text-4xl font-black text-surface-900 tracking-tight">
                                        Rp{total.toLocaleString('id-ID')}
                                    </span>
                                </div>

                                <p className="text-sm text-surface-900 font-bold mb-8 text-center bg-white border-2 border-surface-900 p-4 rounded-xl shadow-[2px_2px_0_0_#0f172a] relative z-10">
                                    Klik tombol <span className="font-black bg-[#A7F3D0] px-2 py-0.5 border border-surface-900 rounded">BELI</span> pada tiap item untuk checkout langsung. Setiap item diproses terpisah per seller.
                                </p>

                                <Link
                                    href={route('products.index')}
                                    className="w-full flex items-center justify-center py-4 rounded-xl bg-surface-900 border-2 border-surface-900 text-white font-black text-sm uppercase tracking-widest shadow-[4px_4px_0_0_#0f172a] hover:bg-white hover:text-surface-900 transition-all hover:-translate-y-1 hover:-translate-x-1 active:translate-y-1 active:translate-x-1 active:shadow-none relative z-10"
                                >
                                    + TAMBAH ITEM LAGI
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
