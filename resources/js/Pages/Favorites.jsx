import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

export default function Favorites() {
    // Favorites will use localStorage/DB in a future phase.
    const favoriteItems = [];

    return (
        <>
            <Head title="Favorit — OshiMerch" />
            <div className="min-h-dvh bg-surface-50 flex flex-col">
                <Navbar />

                <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 pt-[96px]">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
                            <Heart className="w-5 h-5 text-white fill-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold font-display text-surface-900">Favorit Saya</h1>
                            <p className="text-xs text-surface-500">
                                {favoriteItems.length === 0 ? 'Belum ada barang favorit' : `${favoriteItems.length} item tersimpan`}
                            </p>
                        </div>
                    </div>

                    {favoriteItems.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center py-24 text-center"
                        >
                            {/* Illustration */}
                            <div className="relative mb-6">
                                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center mx-auto shadow-inner">
                                    <Heart className="w-14 h-14 text-pink-300" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-pink-400" />
                                </div>
                            </div>

                            <h2 className="text-xl font-bold font-display text-surface-900 mb-2">
                                Belum ada favorit
                            </h2>
                            <p className="text-surface-500 text-sm max-w-sm leading-relaxed mb-8">
                                Simpan merchandise JKT48 favoritmu dengan menekan ikon ❤️ di halaman produk.
                                Item yang kamu simpan akan muncul di sini.
                            </p>

                            <Link
                                href={route('products.index')}
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl gradient-primary text-white font-semibold text-sm shadow-glow-primary hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all"
                            >
                                Temukan Produk
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {favoriteItems.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Link href={route('products.show', item.id)} className="block group">
                                        <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-surface-100 mb-3">
                                            <img
                                                src={item.image_url}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <p className="text-sm font-semibold text-surface-800 line-clamp-2 leading-snug">{item.title}</p>
                                        <p className="text-sm font-bold text-primary-600 mt-1">
                                            Rp{item.price.toLocaleString('id-ID')}
                                        </p>
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
