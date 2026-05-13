import { Head, Link, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import ListingCard from '@/Components/ListingCard';

// ── Raw SVG Icons ───────────────────────────────────────────────────────────────────────────────────────────────────────────
const IconArrowLeft    = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>;
const IconCart         = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>;
const IconMessage      = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>;
const IconPackage      = () => <svg className="w-20 h-20 text-surface-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>;
const IconMapPin       = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>;
const IconHeart = ({ filled }) => (
    <svg className={`w-6 h-6 transition-all duration-300 ${filled ? 'text-[#f43f5e] fill-[#f43f5e] scale-110' : 'text-surface-900 group-hover:scale-110'}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
);

const TEAM_BADGE = {
    PASSION: 'bg-[#FF1100] text-white border-surface-900',
    LOVE: 'bg-[#ff6393] text-white border-surface-900',
    DREAM: 'bg-[#8b3dff] text-white border-surface-900',
    TRAINEE: 'bg-[#ffbc20] text-surface-900 border-surface-900',
    VIRTUAL: 'bg-[#00d4aa] text-surface-900 border-surface-900',
};

const CONDITION_LABEL = {
    New: { text: 'NEW', style: 'bg-[#A7F3D0] text-surface-900 border-surface-900' },
    Mint: { text: 'MINT', style: 'bg-[#BAE6FD] text-surface-900 border-surface-900' },
    Used: { text: 'USED', style: 'bg-white text-surface-900 border-surface-900' },
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
            <div className="min-h-dvh bg-[#FAFAFA] flex flex-col font-sans selection:bg-surface-900 selection:text-[#FEF08A]">
                <Navbar auth={auth} />

                <main className="flex-1 w-full pt-32 pb-20">
                    
                    {/* E-Commerce Standard Layout with Brutalist Style */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        
                        {/* Breadcrumbs / Back button */}
                        <div className="flex items-center gap-6 mb-10">
                            <Link 
                                href={route('products.index')} 
                                className="w-12 h-12 rounded-xl bg-white border-4 border-surface-900 flex items-center justify-center text-surface-900 shadow-[4px_4px_0_#0f172a] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_#0f172a] hover:bg-[#FEF08A] transition-all"
                            >
                                <IconArrowLeft />
                            </Link>
                            <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-surface-900 bg-white border-4 border-surface-900 px-6 py-3 rounded-xl shadow-[4px_4px_0_0_#0f172a]">
                                <Link href="/" className="hover:text-primary-600 transition-colors">HOME</Link>
                                <span>/</span>
                                <Link href={route('products.index')} className="hover:text-primary-600 transition-colors">PRODUCTS</Link>
                                <span>/</span>
                                <span className="text-surface-900 truncate max-w-[150px] sm:max-w-[300px]">{listing.title}</span>
                            </div>
                        </div>

                        {/* Grid Layout: [Image (4)] [Info (5)] [Action Box (3)] */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            
                            {/* LEFT: Product Image */}
                            <div className="col-span-1 lg:col-span-5">
                                <div className="relative w-full flex items-center justify-center rounded-3xl bg-[#BAE6FD] border-4 border-surface-900 overflow-hidden shadow-[12px_12px_0_#0f172a] group aspect-[4/5]">
                                    {/* Abstract background pattern for the image container */}
                                    <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.2]"></div>
                                    
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
                                            className="w-[90%] h-[90%] object-cover rounded-2xl border-4 border-surface-900 shadow-[8px_8px_0_0_#0f172a] relative z-10 transition-transform duration-500 group-hover:scale-105"
                                            onError={() => setImgError(true)}
                                        />
                                    )}
                                    
                                    {/* Overlay Tags */}
                                    <div className="absolute top-6 left-6 flex flex-col gap-3 z-10">
                                        <span className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase border-4 shadow-[4px_4px_0_0_#0f172a] transform -rotate-2 ${condInfo.style}`}>
                                            {condInfo.text}
                                        </span>
                                        {listing.featured_member_team && teamStyle && (
                                            <span className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase border-4 shadow-[4px_4px_0_0_#0f172a] transform rotate-2 ${teamStyle}`}>
                                                {listing.featured_member_team === 'VIRTUAL' ? 'JKT48V' : listing.featured_member_team}
                                            </span>
                                        )}
                                    </div>

                                    {/* Favorite Button Overlay */}
                                    {auth?.user && !isOwner && (
                                        <div className="absolute top-6 right-6 z-10">
                                            <motion.button
                                                type="button"
                                                onClick={toggleFavorite}
                                                disabled={favLoading}
                                                whileTap={{ scale: 0.9 }}
                                                className="w-14 h-14 rounded-xl bg-white border-4 border-surface-900 flex items-center justify-center shadow-[4px_4px_0_#0f172a] hover:shadow-[6px_6px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 transition-all"
                                            >
                                                <IconHeart filled={favorited} />
                                            </motion.button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* MIDDLE: Product Information */}
                            <div className="col-span-1 lg:col-span-4 flex flex-col gap-8">
                                <div>
                                    <span className="inline-block px-4 py-2 bg-surface-900 text-white text-xs font-black uppercase tracking-widest mb-6 border-2 border-surface-900 shadow-[4px_4px_0_0_#0f172a] transform -rotate-1">
                                        {CATEGORY_LABEL[listing.category] || listing.category}
                                    </span>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-display text-surface-900 uppercase tracking-tighter leading-none mb-4" style={{ textShadow: '2px 2px 0px #FEF08A' }}>
                                        {listing.title}
                                    </h1>
                                    {listing.featured_member_name && (
                                        <p className="text-surface-900 font-black uppercase tracking-widest text-sm flex items-center gap-3 mt-4 bg-white inline-block px-3 py-1 border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a] transform rotate-1">
                                            <span className="w-3 h-3 rounded-full bg-[#f43f5e] inline-block border-2 border-surface-900"></span>
                                            {listing.featured_member_name}
                                        </p>
                                    )}
                                </div>

                                {/* Price Mobile - only visible on small screens */}
                                <div className="lg:hidden text-5xl font-black font-display text-surface-900 tracking-tight pb-6 border-b-4 border-surface-900">
                                    Rp{listing.price.toLocaleString('id-ID')}
                                </div>

                                {/* Description */}
                                {listing.description && (
                                    <div className="bg-white rounded-2xl border-4 border-surface-900 p-6 shadow-[8px_8px_0_0_#0f172a]">
                                        <h2 className="text-sm font-black text-surface-900 uppercase tracking-widest mb-4 bg-[#FEF08A] inline-block px-2 border-2 border-surface-900">DESKRIPSI PRODUK</h2>
                                        <p className="text-surface-900 leading-relaxed whitespace-pre-line font-bold text-base">
                                            {listing.description}
                                        </p>
                                    </div>
                                )}

                                {/* Seller Info */}
                                <div className="bg-[#A7F3D0] rounded-2xl border-4 border-surface-900 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-[8px_8px_0_#0f172a] transform -rotate-1">
                                    <Link href={route('seller.profile', listing.seller?.id)} className="shrink-0">
                                        <img
                                            src={sellerAvatar}
                                            alt={listing.seller?.name}
                                            className="w-20 h-20 rounded-xl object-cover border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] hover:scale-105 transition-transform"
                                            onError={(e) => { e.target.src = sellerAvatar; }}
                                        />
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-black text-surface-900 uppercase tracking-widest mb-1 bg-white inline-block px-1 border-2 border-surface-900">SELLER INFO</p>
                                        <Link href={route('seller.profile', listing.seller?.id)} className="font-black text-2xl font-display text-surface-900 uppercase hover:text-white transition-colors block leading-none mt-1">
                                            {listing.seller?.name}
                                        </Link>
                                    </div>
                                    <Link href={route('seller.profile', listing.seller?.id)}
                                        className="w-full sm:w-auto shrink-0 px-6 py-4 rounded-xl bg-surface-900 text-white font-black text-sm uppercase tracking-widest border-4 border-transparent hover:bg-white hover:text-surface-900 hover:border-surface-900 shadow-[4px_4px_0_0_rgba(15,23,42,0.2)] hover:shadow-[6px_6px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 transition-all text-center">
                                        CEK TOKO
                                    </Link>
                                </div>
                            </div>

                            {/* RIGHT: Action Card (Sticky) */}
                            <div className="col-span-1 lg:col-span-3 relative">
                                <div className="sticky top-32 bg-[#FECDD3] rounded-3xl border-4 border-surface-900 p-8 shadow-[12px_12px_0_#0f172a] flex flex-col gap-8 transform rotate-1">
                                    <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.2] pointer-events-none" />
                                    
                                    <h2 className="text-sm font-black text-surface-900 uppercase tracking-widest pb-4 border-b-4 border-surface-900 text-center relative z-10">
                                        TRANSAKSI
                                    </h2>

                                    <div className="text-center relative z-10">
                                        <p className="text-sm font-black uppercase tracking-widest text-surface-900 mb-2">HARGA ITEM</p>
                                        <p className="text-4xl lg:text-5xl font-black font-display text-surface-900 tracking-tight bg-white inline-block px-4 py-2 border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] -rotate-2">
                                            Rp{listing.price.toLocaleString('id-ID')}
                                        </p>
                                    </div>

                                    {!isOwner ? (
                                        <div className="flex flex-col gap-4 relative z-10">
                                            {auth?.user ? (
                                                isAvailable ? (
                                                    <>
                                                        <Link
                                                            href={route('checkout.show', listing.id)}
                                                            className="w-full flex items-center justify-center gap-3 py-5 rounded-xl bg-surface-900 text-white border-4 border-transparent font-black text-sm uppercase tracking-widest shadow-[6px_6px_0_rgba(15,23,42,0.2)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_#0f172a] hover:bg-[#FEF08A] hover:text-surface-900 hover:border-surface-900 transition-all active:translate-y-1 active:translate-x-1 active:shadow-none"
                                                        >
                                                            <IconCart /> BELI LANGSUNG
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={addToCart}
                                                            disabled={cartLoading || cartAdded}
                                                            className={`w-full flex items-center justify-center gap-3 py-5 rounded-xl border-4 font-black text-sm uppercase tracking-widest transition-all shadow-[6px_6px_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#0f172a] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none active:translate-y-1 active:translate-x-1 active:shadow-none ${
                                                                cartAdded
                                                                    ? 'border-surface-900 bg-[#A7F3D0] text-surface-900'
                                                                    : 'border-surface-900 bg-white text-surface-900 hover:bg-[#BAE6FD]'
                                                            }`}
                                                        >
                                                            <IconCart />
                                                            {cartLoading ? 'MENAMBAHKAN...' : cartAdded ? '✓ ADA DI KERANJANG' : 'KERANJANG'}
                                                        </button>
                                                        <Link
                                                            href={`${route('chat.direct', listing.seller?.id)}?listing_id=${listing.id}`}
                                                            className="w-full flex items-center justify-center gap-3 py-5 rounded-xl bg-white border-4 border-surface-900 text-surface-900 font-black text-sm uppercase tracking-widest hover:bg-surface-200 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#0f172a] transition-all shadow-[6px_6px_0_#0f172a] active:translate-y-1 active:translate-x-1 active:shadow-none"
                                                        >
                                                            <IconMessage /> CHAT PENJUAL
                                                        </Link>
                                                    </>
                                                ) : (
                                                    <div className="w-full py-5 rounded-xl bg-surface-200 border-4 border-surface-900 text-surface-900 font-black text-sm uppercase tracking-widest text-center shadow-[4px_4px_0_0_#0f172a]">
                                                        {listing.status === 'Reserved' ? '🔒 IN PROGRESS' : '✅ TERJUAL'}
                                                    </div>
                                                )
                                            ) : (
                                                <a
                                                    href={route('google.redirect')}
                                                    className="w-full flex items-center justify-center gap-3 py-5 rounded-xl bg-surface-900 text-white font-black text-sm uppercase tracking-widest hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#0f172a] transition-all shadow-[6px_6px_0_0_#0f172a] active:translate-y-1 active:translate-x-1 active:shadow-none border-4 border-transparent hover:bg-white hover:text-surface-900 hover:border-surface-900"
                                                >
                                                    LOGIN UTK BELI
                                                </a>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-4 relative z-10">
                                            <Link
                                                href={route('listings.edit', listing.id)}
                                                className="w-full py-5 rounded-xl bg-surface-900 text-white border-4 border-surface-900 font-black text-sm uppercase tracking-widest text-center hover:bg-[#FEF08A] hover:text-surface-900 transition-all shadow-[6px_6px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#0f172a] active:translate-y-1 active:translate-x-1 active:shadow-none"
                                            >
                                                EDIT LISTING
                                            </Link>
                                            <Link
                                                href={route('listings.destroy', listing.id)}
                                                method="delete"
                                                as="button"
                                                className="w-full py-5 rounded-xl border-4 border-surface-900 bg-white text-[#f43f5e] font-black text-sm uppercase tracking-widest text-center hover:bg-[#f43f5e] hover:text-white transition-all shadow-[6px_6px_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#0f172a] active:translate-y-1 active:translate-x-1 active:shadow-none"
                                                onClick={(e) => {
                                                    if (!confirm('Hapus listing ini secara permanen?')) e.preventDefault();
                                                }}
                                            >
                                                HAPUS LISTING
                                            </Link>
                                        </div>
                                    )}

                                    {/* Security badge */}
                                    <div className="mt-4 flex items-center justify-center gap-3 p-4 rounded-xl bg-white border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] relative z-10">
                                        <IconMapPin />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-surface-900 leading-tight">
                                            Transaksi dilindungi OshiMerch.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related listings */}
                    {related?.length > 0 && (
                        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mt-20 border-t-4 border-surface-900">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-display text-surface-900 uppercase tracking-tighter mb-12" style={{ textShadow: '4px 4px 0px #FEF08A' }}>
                                MUNGKIN KAMU SUKA.
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
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

        </>
    );
}
