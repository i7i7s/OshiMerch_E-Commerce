import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import ListingCard from '@/Components/ListingCard';

// ── Raw SVG Icons ───────────────────────────────────────────────────────────────────────────────────────────────────────────
const IconArrowLeft    = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>;
const IconCart         = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>;
const IconMessage      = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>;
const IconPackage      = () => <svg className="w-16 h-16 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>;
const IconClock        = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
const IconMapPin       = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>;
const IconClose        = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>;

const IconHeart = ({ filled }) => (
    <svg className={`w-6 h-6 transition-all duration-300 ${filled ? 'text-rose-500 fill-rose-500 scale-110' : 'text-surface-900 group-hover:scale-110'}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
    PASSION: 'bg-[#FF1100] text-white border-[#FF1100]',
    LOVE: 'bg-[#ff6393] text-white border-[#ff6393]',
    DREAM: 'bg-[#8b3dff] text-white border-[#8b3dff]',
    TRAINEE: 'bg-[#ffbc20] text-surface-900 border-[#ffbc20]',
    VIRTUAL: 'bg-[#00d4aa] text-surface-900 border-[#00d4aa]',
};

const CONDITION_LABEL = {
    New: { text: 'NEW', style: 'bg-green-500 text-white border-green-500' },
    Mint: { text: 'MINT', style: 'bg-blue-500 text-white border-blue-500' },
    Used: { text: 'USED', style: 'bg-surface-800 text-white border-surface-800' },
};

const CATEGORY_LABEL = {
    photocard: 'PHOTOCARD',
    lightstick: 'LIGHTSTICK',
    apparel: 'APPAREL',
    poster: 'POSTER',
    album: 'ALBUM & CD',
    keychain: 'KEYCHAIN',
    towel: 'TOWEL',
    other: 'OTHER',
};

export default function Show({ listing, related, auth, is_favorited = false }) {
    const [imgError, setImgError]         = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [favorited, setFavorited]       = useState(is_favorited);
    const [favLoading, setFavLoading]     = useState(false);
    const [cartAdded, setCartAdded]       = useState(false);
    const [cartLoading, setCartLoading]   = useState(false);

    const addToCart = useCallback(() => {
        if (!auth?.user) {
            window.location.href = route('google.redirect');
            return;
        }
        if (cartLoading || cartAdded) return;
        setCartLoading(true);
        router.post(route('cart.add'), { listing_id: listing.id }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setCartAdded(true);
                setCartLoading(false);
                setTimeout(() => setCartAdded(false), 3000);
            },
            onError: () => setCartLoading(false),
        });
    }, [listing, auth, cartLoading, cartAdded]);

    const toggleFavorite = () => {
        if (!auth?.user) { window.location.href = route('login'); return; }
        setFavLoading(true);
        const next = !favorited;
        setFavorited(next); // optimistic
        router.post(route('favorites.toggle'), { listing_id: listing.id }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => setFavLoading(false),
            onError:   () => { setFavorited(!next); setFavLoading(false); }, 
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
            <div className="min-h-dvh bg-surface-50 flex flex-col font-sans selection:bg-primary-500 selection:text-white">
                <Navbar auth={auth} />

                <main className="flex-1 w-full pt-28 pb-20">
                    
                    {/* E-Commerce Standard Layout with Brutalist Style */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        
                        {/* Breadcrumbs / Back button */}
                        <div className="flex items-center gap-4 mb-8">
                            <Link 
                                href={route('products.index')} 
                                className="w-10 h-10 rounded-xl bg-white border-2 border-surface-900 flex items-center justify-center text-surface-900 shadow-[2px_2px_0_#0f172a] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_#0f172a] transition-all"
                            >
                                <IconArrowLeft />
                            </Link>
                            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-surface-500">
                                <Link href="/" className="hover:text-surface-900 transition-colors">HOME</Link>
                                <span>/</span>
                                <Link href={route('products.index')} className="hover:text-surface-900 transition-colors">PRODUCTS</Link>
                                <span>/</span>
                                <span className="text-surface-900 truncate max-w-[200px] sm:max-w-[300px]">{listing.title}</span>
                            </div>
                        </div>

                        {/* Grid Layout: [Image (4)] [Info (5)] [Action Box (3)] */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                            
                            {/* LEFT: Product Image */}
                            <div className="col-span-1 lg:col-span-4">
                                <div className="relative w-full flex items-center justify-center rounded-[2rem] bg-surface-100 border-4 border-surface-900 overflow-hidden shadow-[8px_8px_0_#0f172a] group">
                                    {/* Abstract background pattern for the image container */}
                                    <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(#0f172a_2px,transparent_2px)] [background-size:24px_24px]"></div>
                                    
                                    {imgError || !listing.image_url ? (
                                        <div className="w-full aspect-[3/4] flex items-center justify-center relative z-10">
                                            <IconPackage />
                                        </div>
                                    ) : (
                                        <motion.img
                                            initial={{ scale: 1.05 }}
                                            animate={{ scale: 1 }}
                                            transition={{ duration: 0.5 }}
                                            src={listing.image_url}
                                            alt={listing.title}
                                            className="w-full max-h-[75vh] object-contain relative z-10 transition-transform duration-500 group-hover:scale-105 drop-shadow-2xl"
                                            onError={() => setImgError(true)}
                                        />
                                    )}
                                    
                                    {/* Overlay Tags */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border-2 shadow-[2px_2px_0_rgba(0,0,0,0.2)] ${condInfo.style}`}>
                                            {condInfo.text}
                                        </span>
                                        {listing.featured_member_team && teamStyle && (
                                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border-2 shadow-[2px_2px_0_rgba(0,0,0,0.2)] ${teamStyle}`}>
                                                {listing.featured_member_team === 'VIRTUAL' ? 'JKT48V' : listing.featured_member_team}
                                            </span>
                                        )}
                                    </div>

                                    {/* Favorite Button Overlay */}
                                    {auth?.user && !isOwner && (
                                        <div className="absolute top-4 right-4 z-10">
                                            <motion.button
                                                type="button"
                                                onClick={toggleFavorite}
                                                disabled={favLoading}
                                                whileTap={{ scale: 0.8 }}
                                                className="w-12 h-12 rounded-xl bg-white border-2 border-surface-900 flex items-center justify-center shadow-[4px_4px_0_#0f172a] transition-transform hover:-translate-y-1"
                                            >
                                                <IconHeart filled={favorited} />
                                            </motion.button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* MIDDLE: Product Information */}
                            <div className="col-span-1 lg:col-span-5 flex flex-col gap-6">
                                <div className="pb-6 border-b-4 border-surface-200">
                                    <span className="inline-block px-3 py-1 rounded-lg bg-surface-900 text-white text-xs font-black uppercase tracking-widest mb-4">
                                        {CATEGORY_LABEL[listing.category] || listing.category}
                                    </span>
                                    <h1 className="text-3xl md:text-5xl font-black font-display text-surface-950 uppercase tracking-tighter leading-[1] mb-2">
                                        {listing.title}
                                    </h1>
                                    {listing.featured_member_name && (
                                        <p className="text-primary-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2 mt-3">
                                            <span className="w-2 h-2 rounded-full bg-primary-500 inline-block"></span>
                                            {listing.featured_member_name}
                                        </p>
                                    )}
                                </div>

                                {/* Price Mobile - only visible on small screens */}
                                <div className="lg:hidden text-4xl font-black font-display text-surface-950 tracking-tight pb-4 border-b-4 border-surface-200">
                                    Rp{listing.price.toLocaleString('id-ID')}
                                </div>

                                {/* Description */}
                                {listing.description && (
                                    <div className="pb-6 border-b-4 border-surface-200">
                                        <h2 className="text-xs font-black text-surface-500 uppercase tracking-widest mb-3">DESKRIPSI PRODUK</h2>
                                        <p className="text-surface-700 leading-relaxed whitespace-pre-line font-medium text-base">
                                            {listing.description}
                                        </p>
                                    </div>
                                )}

                                {/* Seller Info */}
                                <div className="bg-white rounded-2xl border-4 border-surface-900 p-5 flex items-center gap-4 shadow-[4px_4px_0_#0f172a]">
                                    <Link href={route('seller.profile', listing.seller?.id)} className="shrink-0">
                                        <img
                                            src={sellerAvatar}
                                            alt={listing.seller?.name}
                                            className="w-14 h-14 rounded-xl object-cover border-2 border-surface-900 hover:scale-105 transition-transform"
                                            onError={(e) => { e.target.src = sellerAvatar; }}
                                        />
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black text-surface-500 uppercase tracking-widest mb-0.5">SELLER INFO</p>
                                        <Link href={route('seller.profile', listing.seller?.id)} className="font-black text-lg text-surface-950 uppercase hover:text-primary-600 transition-colors truncate block">
                                            {listing.seller?.name}
                                        </Link>
                                    </div>
                                    <Link href={route('seller.profile', listing.seller?.id)}
                                        className="hidden sm:block shrink-0 px-4 py-2 rounded-lg border-2 border-surface-900 text-surface-900 font-bold text-xs uppercase tracking-widest hover:bg-surface-900 hover:text-white transition-colors">
                                        CEK TOKO
                                    </Link>
                                </div>
                            </div>

                            {/* RIGHT: Action Card (Sticky) */}
                            <div className="col-span-1 lg:col-span-3 relative">
                                <div className="sticky top-28 bg-white rounded-[2rem] border-4 border-surface-900 p-6 shadow-[12px_12px_0_#0f172a] flex flex-col gap-6">
                                    <h2 className="text-xs font-black text-surface-500 uppercase tracking-widest pb-3 border-b-2 border-surface-200 text-center">
                                        TRANSAKSI
                                    </h2>

                                    <div className="text-center">
                                        <p className="text-sm font-bold uppercase tracking-widest text-surface-500 mb-1">HARGA ITEM</p>
                                        <p className="text-3xl lg:text-4xl font-black font-display text-surface-950 tracking-tight">
                                            Rp{listing.price.toLocaleString('id-ID')}
                                        </p>
                                    </div>

                                    {!isOwner ? (
                                        <div className="flex flex-col gap-3">
                                            {auth?.user ? (
                                                isAvailable ? (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowCheckout(true)}
                                                            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-surface-950 text-white font-black text-sm uppercase tracking-widest shadow-[4px_4px_0_rgba(244,63,94,0.5)] hover:-translate-y-1 hover:shadow-[6px_6px_0_rgba(244,63,94,0.5)] transition-all bg-gradient-to-r from-primary-600 to-purple-600"
                                                        >
                                                            <IconCart /> BELI LANGSUNG
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={addToCart}
                                                            disabled={cartLoading || cartAdded}
                                                            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl border-4 font-black text-sm uppercase tracking-widest transition-all shadow-[4px_4px_0_#0f172a] hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${
                                                                cartAdded
                                                                    ? 'border-green-500 bg-green-50 text-green-700 shadow-[4px_4px_0_#22c55e]'
                                                                    : 'border-surface-900 bg-white text-surface-950 hover:bg-surface-100'
                                                            }`}
                                                        >
                                                            <IconCart />
                                                            {cartLoading ? 'MENAMBAHKAN...' : cartAdded ? '✓ ADA DI KERANJANG' : 'KERANJANG'}
                                                        </button>
                                                        <Link
                                                            href={route('chat.index')}
                                                            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-white border-4 border-surface-900 text-surface-950 font-black text-sm uppercase tracking-widest hover:bg-surface-100 hover:-translate-y-1 transition-all shadow-[4px_4px_0_#0f172a]"
                                                        >
                                                            <IconMessage /> CHAT PENJUAL
                                                        </Link>
                                                    </>
                                                ) : (
                                                    <div className="w-full py-4 rounded-xl bg-surface-200 border-4 border-surface-300 text-surface-500 font-black text-sm uppercase tracking-widest text-center">
                                                        {listing.status === 'Reserved' ? '🔒 IN PROGRESS' : '✅ TERJUAL'}
                                                    </div>
                                                )
                                            ) : (
                                                <a
                                                    href={route('google.redirect')}
                                                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl gradient-primary text-white font-black text-sm uppercase tracking-widest hover:-translate-y-1 transition-all shadow-glow-primary"
                                                >
                                                    LOGIN UTK BELI
                                                </a>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            <Link
                                                href={route('listings.edit', listing.id)}
                                                className="w-full py-4 rounded-xl bg-surface-950 text-white font-black text-sm uppercase tracking-widest text-center hover:bg-surface-800 transition-all shadow-xl"
                                            >
                                                EDIT LISTING
                                            </Link>
                                            <Link
                                                href={route('listings.destroy', listing.id)}
                                                method="delete"
                                                as="button"
                                                className="w-full py-4 rounded-xl border-4 border-red-500 text-red-600 font-black text-sm uppercase tracking-widest text-center hover:bg-red-50 transition-all shadow-[4px_4px_0_#ef4444]"
                                                onClick={(e) => {
                                                    if (!confirm('Hapus listing ini secara permanen?')) e.preventDefault();
                                                }}
                                            >
                                                HAPUS LISTING
                                            </Link>
                                        </div>
                                    )}

                                    {/* Security badge */}
                                    <div className="mt-2 flex items-center gap-3 p-3 rounded-xl bg-surface-100 border-2 border-surface-200">
                                        <IconMapPin />
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-surface-600 leading-tight">
                                            Transaksi dilindungi OshiMerch Escrow.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related listings */}
                    {related?.length > 0 && (
                        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mt-16 border-t-4 border-surface-900">
                            <h2 className="text-3xl md:text-4xl font-black font-display text-surface-950 uppercase tracking-tighter mb-10">
                                MUNGKIN KAMU <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-600">SUKA.</span>
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {related.map((item, i) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ delay: i * 0.1 }}
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

            {/* ── Checkout Modal (Brutalist Theme) ── */}
            <AnimatePresence>
                {showCheckout && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-surface-950/80 backdrop-blur-md"
                            onClick={() => setShowCheckout(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-lg mx-auto bg-white rounded-[2rem] border-4 border-surface-900 shadow-[12px_12px_0_#0f172a] overflow-hidden max-h-[90dvh] flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-8 py-6 border-b-4 border-surface-900 bg-surface-50">
                                <div>
                                    <h2 className="font-black font-display text-2xl text-surface-950 uppercase tracking-tighter">CHECKOUT</h2>
                                    <p className="text-xs font-bold text-surface-500 uppercase tracking-widest mt-1 truncate max-w-[250px]">{listing.title}</p>
                                </div>
                                <button onClick={() => setShowCheckout(false)} className="w-10 h-10 rounded-xl bg-surface-200 flex items-center justify-center hover:bg-surface-300 transition-colors text-surface-900">
                                    <IconClose />
                                </button>
                            </div>

                            <form onSubmit={handleBuy} className="overflow-y-auto flex-1 p-8 space-y-8 bg-white">
                                {/* Price summary */}
                                <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-purple-600 border-4 border-surface-900 p-6 text-white shadow-[4px_4px_0_#0f172a]">
                                    <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-1">TOTAL PEMBAYARAN</p>
                                    <p className="text-4xl font-black font-display tracking-tight">
                                        Rp{listing.price.toLocaleString('id-ID')}
                                    </p>
                                </div>

                                {/* Recipient */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-surface-900 uppercase tracking-widest border-b-2 border-surface-200 pb-2">INFO PENERIMA</h3>
                                    <div>
                                        <label className="block text-xs font-bold text-surface-600 mb-2 uppercase tracking-wide">Nama Lengkap *</label>
                                        <input
                                            type="text"
                                            value={data.recipient_name}
                                            onChange={e => setData('recipient_name', e.target.value)}
                                            placeholder="Nama lengkap penerima"
                                            className="w-full px-5 py-4 rounded-xl border-2 border-surface-200 font-bold focus:outline-none focus:border-primary-500 focus:shadow-[4px_4px_0_rgba(244,63,94,0.2)] transition-all"
                                            required
                                        />
                                        {errors.recipient_name && <p className="text-xs font-bold text-red-500 mt-2">{errors.recipient_name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-surface-600 mb-2 uppercase tracking-wide">No. WhatsApp (Opsional)</label>
                                        <input
                                            type="text"
                                            value={data.recipient_phone}
                                            onChange={e => setData('recipient_phone', e.target.value)}
                                            placeholder="08xx-xxxx-xxxx"
                                            className="w-full px-5 py-4 rounded-xl border-2 border-surface-200 font-bold focus:outline-none focus:border-primary-500 focus:shadow-[4px_4px_0_rgba(244,63,94,0.2)] transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-surface-600 mb-2 uppercase tracking-wide">Alamat Pengiriman *</label>
                                        <textarea
                                            value={data.shipping_address}
                                            onChange={e => setData('shipping_address', e.target.value)}
                                            placeholder="Jl. Contoh No. 1, Kelurahan, Kecamatan..."
                                            rows={3}
                                            className="w-full px-5 py-4 rounded-xl border-2 border-surface-200 font-bold focus:outline-none focus:border-primary-500 focus:shadow-[4px_4px_0_rgba(244,63,94,0.2)] transition-all resize-none"
                                            required
                                        />
                                        {errors.shipping_address && <p className="text-xs font-bold text-red-500 mt-2">{errors.shipping_address}</p>}
                                    </div>
                                </div>

                                {/* Payment method */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black text-surface-900 uppercase tracking-widest border-b-2 border-surface-200 pb-2">METODE PEMBAYARAN</h3>
                                    <div className="space-y-3">
                                        {PAYMENT_METHODS.map(m => (
                                            <label
                                                key={m.id}
                                                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                                    data.payment_method === m.id
                                                        ? 'border-surface-900 bg-surface-50 shadow-[4px_4px_0_#0f172a]'
                                                        : 'border-surface-200 hover:border-surface-400'
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
                                                <span className="text-2xl bg-white w-10 h-10 rounded-lg flex items-center justify-center border-2 border-surface-100">{m.icon}</span>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-black text-surface-900 uppercase tracking-wide">{m.label}</p>
                                                    <p className="text-xs font-bold text-surface-500">{m.number}</p>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${data.payment_method === m.id ? 'border-primary-500 bg-primary-500' : 'border-surface-300'}`}>
                                                    {data.payment_method === m.id && <div className="w-2 h-2 rounded-full bg-white" />}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-amber-300 border-4 border-surface-900 text-surface-950 font-bold text-sm leading-relaxed">
                                    ⚠️ Setelah confirm, listing akan di-*reserve*. Lakukan transfer sesuai instruksi di halaman transaksi.
                                </div>
                            </form>

                            {/* Footer */}
                            <div className="px-8 py-6 border-t-4 border-surface-900 bg-surface-50">
                                <button
                                    type="submit"
                                    form=""
                                    onClick={handleBuy}
                                    disabled={processing}
                                    className="w-full py-5 rounded-2xl bg-surface-950 text-white font-black text-lg uppercase tracking-widest shadow-[4px_4px_0_#f43f5e] hover:-translate-y-1 hover:shadow-[6px_6px_0_#f43f5e] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {processing ? 'MEMPROSES...' : `CONFIRM CHECKOUT`}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
