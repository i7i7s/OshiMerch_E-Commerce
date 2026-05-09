import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import ListingCard from '@/Components/ListingCard';

// ── Raw SVG Icons ───────────────────────────────────────────────────────────────────────────────────────────────────────────
const IconArrowLeft    = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>;
const IconCart         = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>;
const IconMessage      = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>;
const IconPackage      = () => <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>;
const IconClock        = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
const IconMapPin       = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>;
const IconClose        = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>;
const IconStar         = ({ filled }) => <svg className={`w-4 h-4 ${filled ? 'text-amber-400 fill-amber-400' : 'text-surface-200 fill-surface-200'}`} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;

const IconHeart = ({ filled }) => (
    <svg className={`w-5 h-5 transition-all duration-200 ${filled ? 'text-rose-500 fill-rose-500 scale-110' : 'text-surface-500'}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
);

const PAYMENT_METHODS = [
    { id: 'BCA',       label: 'Transfer BCA',   icon: '🏦', number: '1234567890', name: 'OshiMerch Official' },
    { id: 'Dana',      label: 'DANA',            icon: '💙', number: '0812-3456-7890', name: 'OshiMerch' },
    { id: 'GoPay',     label: 'GoPay',           icon: '💚', number: '0812-3456-7890', name: 'OshiMerch' },
    { id: 'ShopeePay', label: 'ShopeePay',       icon: '🧡', number: '0812-3456-7890', name: 'OshiMerch' },
    { id: 'OVO',       label: 'OVO',             icon: '💜', number: '0812-3456-7890', name: 'OshiMerch' },
];

const TEAM_BADGE = {
    PASSION: 'bg-[#FF1100]/10 text-[#FF1100] border-[#FF1100]/30',
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

export default function Show({ listing, related, auth, is_favorited = false }) {
    const [imgError, setImgError]         = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [favorited, setFavorited]       = useState(is_favorited);
    const [favLoading, setFavLoading]     = useState(false);

    const toggleFavorite = () => {
        if (!auth?.user) { window.location.href = route('login'); return; }
        setFavLoading(true);
        const next = !favorited;
        setFavorited(next); // optimistic
        router.post(route('favorites.toggle'), { listing_id: listing.id }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => setFavLoading(false),
            onError:   () => { setFavorited(!next); setFavLoading(false); }, // revert
        });
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        listing_id:      listing.id,
        payment_method:  'BCA',
        recipient_name:  auth?.user?.name || '',
        recipient_phone: '',
        shipping_address: '',
    });

    const handleBuy = (e) => {
        e.preventDefault();
        post(route('transactions.store'), {
            onSuccess: () => { reset(); setShowCheckout(false); },
        });
    };

    const teamStyle = TEAM_BADGE[listing.featured_member_team] || null;
    const condInfo   = CONDITION_LABEL[listing.condition] || CONDITION_LABEL.Used;
    const isOwner    = auth?.user?.id === listing.seller?.id;
    const isAvailable = listing.status === 'Available';

    const sellerAvatar =
        listing.seller?.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.seller?.name || 'S')}&background=FF1100&color=fff&size=80`;

    return (
        <>
            <Head title={`${listing.title} — OshiMerch`} />
            <div className="min-h-dvh bg-surface-50 flex flex-col">
                <Navbar auth={auth} />

                <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pt-[96px] sm:pt-[96px]">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-surface-500 mb-6">
                        <Link href={route('products.index')} className="flex items-center gap-1.5 hover:text-surface-700 transition-colors">
                            <IconArrowLeft />
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
                                    <div className="absolute inset-0 flex items-center justify-center text-surface-300">
                                        <IconPackage />
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
                                    <IconClock />
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
                                <div className="flex flex-col gap-3">
                                    {auth?.user ? (
                                        isAvailable ? (
                                            <>
                                                {/* Primary: Beli Sekarang */}
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCheckout(true)}
                                                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-primary text-white font-semibold text-sm shadow-glow-primary hover:shadow-xl hover:scale-[1.01] transition-all active:scale-[0.99]"
                                                >
                                                    <IconCart />
                                                    Beli Sekarang
                                                </button>
                                                {/* Secondary row: Chat + Wishlist */}
                                                <div className="flex gap-3">
                                                    <Link
                                                        href={route('chat.index')}
                                                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-primary-400 text-primary-600 font-semibold text-sm hover:bg-primary-50 transition-all"
                                                    >
                                                        <IconMessage />
                                                        Chat Penjual
                                                    </Link>
                                                    <motion.button
                                                        type="button"
                                                        onClick={toggleFavorite}
                                                        disabled={favLoading}
                                                        whileTap={{ scale: 0.88 }}
                                                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                                                            favorited
                                                                ? 'border-rose-300 bg-rose-50 text-rose-600'
                                                                : 'border-surface-200 text-surface-600 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50'
                                                        } disabled:opacity-50`}
                                                        aria-label={favorited ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
                                                    >
                                                        <IconHeart filled={favorited} />
                                                        <span className="hidden sm:inline">{favorited ? 'Disimpan' : 'Simpan'}</span>
                                                    </motion.button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full py-3.5 rounded-xl bg-surface-100 text-surface-500 font-semibold text-sm text-center">
                                                {listing.status === 'Reserved' ? '🔒 Sedang Dalam Proses' : '✅ Terjual'}
                                            </div>
                                        )
                                    ) : (
                                        <a
                                            href={route('google.redirect')}
                                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-primary text-white font-semibold text-sm shadow-glow-primary hover:shadow-xl transition-all"
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
                                    <Link href={route('seller.profile', listing.seller?.id)} className="shrink-0">
                                        <img
                                            src={sellerAvatar}
                                            alt={listing.seller?.name}
                                            className="w-14 h-14 rounded-2xl object-cover hover:opacity-80 transition-opacity"
                                            onError={(e) => { e.target.src = sellerAvatar; }}
                                        />
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <Link href={route('seller.profile', listing.seller?.id)} className="font-bold text-surface-900 hover:text-primary-600 transition-colors">
                                            {listing.seller?.name}
                                        </Link>
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
                                        <Link href={route('seller.profile', listing.seller?.id)}
                                            className="inline-flex items-center gap-1 text-xs text-primary-500 font-semibold mt-2 hover:text-primary-700 transition-colors">
                                            Lihat Profil Penjual →
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Safe trade notice */}
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                                <IconMapPin />
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

            {/* ── Checkout Modal ── */}
            <AnimatePresence>
                {showCheckout && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowCheckout(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90dvh] flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
                                <div>
                                    <h2 className="font-bold text-surface-900 text-lg">Checkout</h2>
                                    <p className="text-xs text-surface-500 truncate max-w-[220px]">{listing.title}</p>
                                </div>
                                <button onClick={() => setShowCheckout(false)} className="p-2 rounded-xl hover:bg-surface-100 transition-colors text-surface-500">
                                    <IconClose />
                                </button>
                            </div>

                            <form onSubmit={handleBuy} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
                                {/* Price summary */}
                                <div className="rounded-2xl bg-primary-50 border border-primary-100 p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-surface-600">Total Pembayaran</span>
                                        <span className="text-lg font-bold text-primary-600">
                                            Rp{listing.price.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>

                                {/* Recipient */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-surface-700">Informasi Penerima</h3>
                                    <div>
                                        <label className="block text-xs font-medium text-surface-600 mb-1">Nama Penerima *</label>
                                        <input
                                            type="text"
                                            value={data.recipient_name}
                                            onChange={e => setData('recipient_name', e.target.value)}
                                            placeholder="Nama lengkap penerima"
                                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                                            required
                                        />
                                        {errors.recipient_name && <p className="text-xs text-red-500 mt-1">{errors.recipient_name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-surface-600 mb-1">No. HP (opsional)</label>
                                        <input
                                            type="text"
                                            value={data.recipient_phone}
                                            onChange={e => setData('recipient_phone', e.target.value)}
                                            placeholder="08xx-xxxx-xxxx"
                                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-surface-600 mb-1">Alamat Pengiriman Lengkap *</label>
                                        <textarea
                                            value={data.shipping_address}
                                            onChange={e => setData('shipping_address', e.target.value)}
                                            placeholder="Jl. Contoh No. 1, Kelurahan, Kecamatan, Kota, Kode Pos"
                                            rows={3}
                                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                                            required
                                        />
                                        {errors.shipping_address && <p className="text-xs text-red-500 mt-1">{errors.shipping_address}</p>}
                                    </div>
                                </div>

                                {/* Payment method */}
                                <div className="space-y-2">
                                    <h3 className="text-sm font-bold text-surface-700">Metode Pembayaran</h3>
                                    {PAYMENT_METHODS.map(m => (
                                        <label
                                            key={m.id}
                                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                                data.payment_method === m.id
                                                    ? 'border-primary-400 bg-primary-50'
                                                    : 'border-surface-200 hover:border-surface-300'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value={m.id}
                                                checked={data.payment_method === m.id}
                                                onChange={() => setData('payment_method', m.id)}
                                                className="sr-only"
                                            />
                                            <span className="text-xl">{m.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-surface-800">{m.label}</p>
                                                <p className="text-xs text-surface-500">{m.number} · {m.name}</p>
                                            </div>
                                            {data.payment_method === m.id && (
                                                <div className="w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center shrink-0">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                                </div>
                                            )}
                                        </label>
                                    ))}
                                </div>

                                <p className="text-xs text-surface-500 bg-amber-50 border border-amber-200 rounded-xl p-3 leading-relaxed">
                                    ⚠️ Setelah submit, listing akan direservasi untukmu. Lakukan transfer sesuai instruksi di halaman transaksi, lalu upload bukti bayar.
                                </p>
                            </form>

                            {/* Footer */}
                            <div className="px-6 pb-6 pt-3 border-t border-surface-100">
                                <button
                                    type="submit"
                                    form=""
                                    onClick={handleBuy}
                                    disabled={processing}
                                    className="w-full py-3.5 rounded-xl gradient-primary text-white font-bold text-sm shadow-glow-primary hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Memproses...' : `Konfirmasi Pembelian — Rp${listing.price.toLocaleString('id-ID')}`}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
