import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ShoppingCart, ShoppingBag, ArrowRight } from 'lucide-react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function Cart() {
    // Cart will be implemented with a proper cart system in future phases.
    // For now, shows a polished placeholder state.
    const cartItems = []; // Future: pull from localStorage/DB

    return (
        <>
            <Head title="Keranjang — OshiMerch" />
            <div className="min-h-dvh bg-surface-50 flex flex-col">
                <Navbar />

                <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 pt-[96px]">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center shadow-glow-primary">
                            <ShoppingCart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold font-display text-surface-900">Keranjang Belanja</h1>
                            <p className="text-xs text-surface-500">
                                {cartItems.length === 0 ? 'Keranjangmu masih kosong' : `${cartItems.length} item`}
                            </p>
                        </div>
                    </div>

                    {cartItems.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center py-24 text-center"
                        >
                            {/* Illustration */}
                            <div className="relative mb-6">
                                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center mx-auto shadow-inner">
                                    <ShoppingBag className="w-14 h-14 text-primary-300" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                                    <span className="text-sm">✨</span>
                                </div>
                            </div>

                            <h2 className="text-xl font-bold font-display text-surface-900 mb-2">
                                Keranjang masih kosong
                            </h2>
                            <p className="text-surface-500 text-sm max-w-sm leading-relaxed mb-8">
                                Temukan merchandise JKT48 favoritmu dan tambahkan ke keranjang untuk checkout lebih mudah!
                            </p>

                            <Link
                                href={route('products.index')}
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl gradient-primary text-white font-semibold text-sm shadow-glow-primary hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all"
                            >
                                Jelajahi Produk
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                            {/* Items list */}
                            <div className="space-y-4">
                                {cartItems.map((item, i) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-surface-200 hover:border-primary-200 transition-all"
                                    >
                                        <div className="w-16 h-20 rounded-xl overflow-hidden bg-surface-100 shrink-0">
                                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-surface-900 text-sm line-clamp-2">{item.title}</p>
                                            <p className="text-xs text-surface-500 mt-1">{item.seller_name}</p>
                                        </div>
                                        <p className="font-bold text-surface-900 shrink-0">
                                            Rp{item.price.toLocaleString('id-ID')}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Summary */}
                            <div className="bg-white rounded-2xl border border-surface-200 p-6 h-fit">
                                <h3 className="font-bold text-surface-900 mb-4">Ringkasan Pesanan</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-surface-600">
                                        <span>Subtotal ({cartItems.length} item)</span>
                                        <span className="font-semibold">Rp0</span>
                                    </div>
                                </div>
                                <div className="border-t border-surface-200 my-4" />
                                <button className="w-full py-3.5 rounded-xl gradient-primary text-white font-bold text-sm shadow-glow-primary hover:shadow-xl transition-all">
                                    Checkout
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
