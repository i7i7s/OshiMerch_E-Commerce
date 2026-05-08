import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, ShoppingCart, MapPin, Package, Clock } from 'lucide-react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import ListingCard from '@/Components/ListingCard';

const TEAM_BADGE = {
    PASSION: 'bg-[#ff2d6f]/10 text-[#ff2d6f] border-[#ff2d6f]/30',
    LOVE: 'bg-[#ff6393]/10 text-[#ff6393] border-[#ff6393]/30',
    DREAM: 'bg-[#8b3dff]/10 text-[#8b3dff] border-[#8b3dff]/30',
    TRAINEE: 'bg-[#ffbc20]/10 text-[#ffbc20] border-[#ffbc20]/30',
    VIRTUAL: 'bg-[#00d4aa]/10 text-[#00d4aa] border-[#00d4aa]/30',
};

const CONDITION_LABEL = {
    New: { text: 'Baru (New)', style: 'bg-green-50 text-green-700 border-green-200' },
    Mint: { text: 'Mint Condition', style: 'bg-blue-50 text-blue-700 border-blue-200' },
    Used: { text: 'Bekas (Used)', style: 'bg-surface-100 text-surface-600 border-surface-200' },
};

const CATEGORY_LABEL = {
    photocard: 'Photocard',
    lightstick: 'Lightstick',
    apparel: 'Apparel',
    poster: 'Poster',
    album: 'Album & CD',
    keychain: 'Keychain',
    towel: 'Towel',
    penlight: 'Penlight',
};

export default function Show({ listing, related, auth }) {
    const [imgError, setImgError] = useState(false);

    const teamStyle = TEAM_BADGE[listing.featured_member_team] || null;
    const condInfo = CONDITION_LABEL[listing.condition] || CONDITION_LABEL.Used;
    const isOwner = auth?.user?.id === listing.seller?.id;

    const sellerAvatar =
        listing.seller?.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.seller?.name || 'S')}&background=ff2d6f&color=fff&size=80`;

    return (
        <>
            <Head title={`${listing.title} — OshiMerch`} />
            <div className="min-h-dvh bg-surface-50 flex flex-col">
                <Navbar auth={auth} />

                <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pt-[88px] sm:pt-[88px]">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-surface-500 mb-6">
                        <Link href={route('products.index')} className="flex items-center gap-1.5 hover:text-surface-700 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Semua Produk
                        </Link>
                        <span>/</span>
                        <span className="text-surface-700 font-medium truncate max-w-xs">{listing.title}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8">
                        {/* Left: Photo */}
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-surface-100 shadow-elevated"
                            >
                                {imgError || !listing.image_url ? (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Package className="w-16 h-16 text-surface-300" />
                                    </div>
                                ) : (
                                    <img
                                        src={listing.image_url}
                                        alt={listing.title}
                                        className="w-full h-full object-cover"
                                        onError={() => setImgError(true)}
                                    />
                                )}
                            </motion.div>
                        </div>

                        {/* Right: Details */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="space-y-6"
                        >
                            {/* Badges row */}
                            <div className="flex flex-wrap gap-2">
                                {listing.featured_member_team && teamStyle && (
                                    <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${teamStyle}`}>
                                        {listing.featured_member_team === 'VIRTUAL' ? 'JKT48V' : `Team ${listing.featured_member_team}`}
                                    </span>
                                )}
                                <span className={`px-3 py-1 rounded-xl text-xs font-semibold border ${condInfo.style}`}>
                                    {condInfo.text}
                                </span>
                                <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-surface-100 text-surface-600 border border-surface-200">
                                    {CATEGORY_LABEL[listing.category] || listing.category}
                                </span>
                            </div>

                            {/* Title + member */}
                            <div>
                                {listing.featured_member_name && (
                                    <p className="text-sm text-primary-500 font-semibold mb-1">
                                        {listing.featured_member_name}
                                    </p>
                                )}
                                <h1 className="text-2xl sm:text-3xl font-bold font-display text-surface-900 leading-snug">
                                    {listing.title}
                                </h1>
                            </div>

                            {/* Price */}
                            <div className="py-4 border-t border-b border-surface-200">
                                <p className="text-3xl font-bold text-surface-900">
                                    Rp{listing.price.toLocaleString('id-ID')}
                                </p>
                                <p className="text-xs text-surface-500 mt-1 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    Diposting {listing.created_at}
                                </p>
                            </div>

                            {/* Description */}
                            {listing.description && (
                                <div>
                                    <h2 className="text-sm font-bold text-surface-700 mb-2">Deskripsi Produk</h2>
                                    <p className="text-sm text-surface-600 leading-relaxed whitespace-pre-line">
                                        {listing.description}
                                    </p>
                                </div>
                            )}

                            {/* CTA Buttons */}
                            {!isOwner && (
                                <div className="flex flex-col sm:flex-row gap-3">
                                    {auth?.user ? (
                                        <>
                                            <button
                                                type="button"
                                                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-primary text-white font-semibold text-sm shadow-glow-primary hover:shadow-xl hover:scale-[1.01] transition-all active:scale-[0.99]"
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                                Beli Sekarang
                                                <span className="text-white/70 text-xs font-normal">(Fase 3)</span>
                                            </button>
                                            <button
                                                type="button"
                                                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-primary-400 text-primary-600 font-semibold text-sm hover:bg-primary-50 transition-all"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                                Chat Penjual
                                                <span className="text-primary-400 text-xs font-normal">(Fase 3)</span>
                                            </button>
                                        </>
                                    ) : (
                                        <a
                                            href={route('google.redirect')}
                                            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-primary text-white font-semibold text-sm shadow-glow-primary hover:shadow-xl transition-all"
                                        >
                                            Login untuk Membeli
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* Owner actions */}
                            {isOwner && (
                                <div className="flex gap-3">
                                    <Link
                                        href={route('listings.edit', listing.id)}
                                        className="flex-1 py-3 rounded-xl border border-surface-300 text-surface-700 font-semibold text-sm text-center hover:bg-surface-100 transition-colors"
                                    >
                                        Edit Listing
                                    </Link>
                                    <Link
                                        href={route('listings.destroy', listing.id)}
                                        method="delete"
                                        as="button"
                                        className="px-5 py-3 rounded-xl border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors"
                                        onClick={(e) => {
                                            if (!confirm('Hapus listing ini?')) e.preventDefault();
                                        }}
                                    >
                                        Hapus
                                    </Link>
                                </div>
                            )}

                            {/* Seller card */}
                            <div className="bg-white rounded-2xl border border-surface-200 p-5">
                                <h2 className="text-sm font-bold text-surface-700 mb-4">Tentang Penjual</h2>
                                <div className="flex items-start gap-4">
                                    <img
                                        src={sellerAvatar}
                                        alt={listing.seller?.name}
                                        className="w-14 h-14 rounded-2xl object-cover shrink-0"
                                        onError={(e) => {
                                            e.target.src = sellerAvatar;
                                        }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-surface-900">{listing.seller?.name}</p>
                                        {listing.seller?.oshi_member_name && (
                                            <p className="text-xs text-primary-500 font-medium mt-0.5">
                                                Oshi: {listing.seller.oshi_member_name}
                                            </p>
                                        )}
                                        {listing.seller?.bio && (
                                            <p className="text-xs text-surface-500 mt-2 line-clamp-2 leading-relaxed">
                                                {listing.seller.bio}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Safe trade notice */}
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold text-amber-800">Tips Transaksi Aman</p>
                                    <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                                        Selalu lakukan chat terlebih dahulu, konfirmasi detail produk, dan gunakan metode transfer yang terlacak. Jangan transfer sebelum deal disepakati.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Related listings */}
                    {related?.length > 0 && (
                        <section className="mt-16">
                            <h2 className="text-xl font-bold font-display text-surface-900 mb-6">
                                Produk Serupa
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                {related.map((item, i) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <ListingCard listing={item} />
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                <Footer />
            </div>
        </>
    );
}
