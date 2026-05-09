import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

// ─── Custom Icons ────────────────────────────────────────────────────────────
const ArrowRightIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
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
            <svg className="w-20 h-20 text-surface-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
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

export default function Cart() {
    // Cart will be implemented with a proper cart system in future phases.
    // For now, shows a polished placeholder state.
    const cartItems = []; // Future: pull from localStorage/DB

    return (
        <>
            <Head title="Keranjang — OshiMerch" />
            <div className="min-h-dvh bg-surface-50 flex flex-col font-sans">
                <Navbar />

                <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-12 pt-[120px]">
                    {/* Header: Brutalist Typography */}
                    <div className="mb-16">
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
                    </div>

                    {cartItems.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative overflow-hidden bg-surface-950 rounded-[3rem] p-10 sm:p-20 flex flex-col items-center text-center shadow-2xl"
                        >
                            {/* Background ambient light */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />
                            
                            <EmptyCartGraphic />

                            <h2 className="mt-12 text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                                Kosong Melompong
                            </h2>
                            <p className="mt-6 text-lg text-surface-400 max-w-lg mx-auto font-medium">
                                Belum ada merchandise impian yang mendarat di sini. Yuk hunting photocard atau lightstick incaranmu sekarang!
                            </p>

                            <Link
                                href={route('products.index')}
                                className="group relative mt-10 inline-flex items-center gap-4 px-10 py-5 rounded-full bg-white text-surface-950 font-black text-lg overflow-hidden transition-all hover:scale-105 active:scale-95"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="relative z-10 group-hover:text-white transition-colors duration-300">Hunting Merch</span>
                                <span className="relative z-10 group-hover:text-white transition-colors duration-300 transform group-hover:translate-x-1"><ArrowRightIcon /></span>
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
                            {/* Items list */}
                            <div className="space-y-6">
                                {cartItems.map((item, i) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group flex flex-col sm:flex-row items-center gap-6 p-4 sm:p-6 bg-white rounded-[2rem] border-2 border-surface-100 hover:border-surface-950 transition-all shadow-sm"
                                    >
                                        <div className="w-full sm:w-32 h-40 rounded-2xl overflow-hidden bg-surface-100 shrink-0">
                                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-1 min-w-0 text-center sm:text-left">
                                            <p className="text-xl font-bold text-surface-950 line-clamp-2">{item.title}</p>
                                            <p className="text-sm font-semibold text-surface-500 mt-2">By {item.seller_name}</p>
                                        </div>
                                        <div className="shrink-0 text-center sm:text-right">
                                            <p className="text-2xl font-black text-purple-600">
                                                Rp{item.price.toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Summary Brutalist Box */}
                            <div className="bg-surface-950 rounded-[2rem] p-8 h-fit text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/30 blur-[50px] rounded-full" />
                                
                                <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Ringkasan</h3>
                                
                                <div className="space-y-4 text-lg font-medium">
                                    <div className="flex justify-between text-surface-400">
                                        <span>Subtotal ({cartItems.length})</span>
                                        <span className="text-white">Rp0</span>
                                    </div>
                                    <div className="flex justify-between text-surface-400">
                                        <span>Biaya Layanan</span>
                                        <span className="text-white">Gratis</span>
                                    </div>
                                </div>
                                
                                <div className="border-t-2 border-surface-800 my-8" />
                                
                                <div className="flex justify-between items-end mb-8">
                                    <span className="text-surface-400 font-bold">Total</span>
                                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">
                                        Rp0
                                    </span>
                                </div>
                                
                                <button className="w-full py-5 rounded-xl bg-white text-surface-950 font-black text-xl hover:bg-primary-50 hover:text-primary-600 transition-all active:scale-[0.98]">
                                    CHECKOUT
                                </button>
                            </div>
                        </div>
                    )}
                </main>

                <Footer />
            </div>
        </>
    );
}
