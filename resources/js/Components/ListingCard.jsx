import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronRight } from 'lucide-react';

const TEAM_BADGE = {
    PASSION: 'bg-[#FF1100] text-white',
    LOVE: 'bg-[#ff6393] text-white',
    DREAM: 'bg-[#8b3dff] text-white',
    TRAINEE: 'bg-[#ffbc20] text-surface-900',
    VIRTUAL: 'bg-[#00d4aa] text-surface-900',
};

const CONDITION_BADGE = {
    New: 'bg-[#A7F3D0] text-surface-900',
    Mint: 'bg-[#BAE6FD] text-surface-900',
    Used: 'bg-[#FEF08A] text-surface-900',
};

const HeartIcon = ({ filled }) => (
    <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={3}
        aria-hidden="true"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
    </svg>
);

export default function ListingCard({ listing, auth, isFavorited = false }) {
    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [wishlisted, setWishlisted] = useState(isFavorited);
    const [favLoading, setFavLoading] = useState(false);

    const teamStyle = TEAM_BADGE[listing.featured_member_team] || null;
    const condStyle = CONDITION_BADGE[listing.condition] || CONDITION_BADGE.Used;

    const fallbackAvatar = listing.seller?.name
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.seller.name)}&background=FF1100&color=fff&size=40`
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -8, rotate: (Math.random() - 0.5) * 3 }}
            className="relative aspect-[3/4] bg-white rounded-2xl border-4 border-surface-900 shadow-[6px_6px_0_0_#0f172a] group overflow-hidden cursor-pointer flex flex-col"
        >
            {/* Image (Takes up full space) */}
            <div className="absolute inset-0 bg-surface-100">
                {!imgLoaded && !imgError && (
                    <div className="absolute inset-0 skeleton" />
                )}

                {imgError || !listing.image_url ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#FEF08A]">
                        <ShoppingBag className="w-12 h-12 text-surface-900" />
                    </div>
                ) : (
                    <img
                        src={listing.image_url}
                        alt={listing.title}
                        loading="lazy"
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                            imgLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => setImgLoaded(true)}
                        onError={() => setImgError(true)}
                    />
                )}
            </div>

            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                {teamStyle && listing.featured_member_team && (
                    <span className={`px-2 py-1 border-2 border-surface-900 rounded-lg text-[10px] font-black tracking-widest shadow-[2px_2px_0_0_#0f172a] uppercase transform -rotate-2 ${teamStyle}`}>
                        {listing.featured_member_team === 'VIRTUAL' ? 'JKT48V' : listing.featured_member_team}
                    </span>
                )}
                <span className={`px-2 py-1 border-2 border-surface-900 rounded-lg text-[10px] font-black tracking-widest shadow-[2px_2px_0_0_#0f172a] uppercase transform -rotate-2 w-fit ${condStyle}`}>
                    {listing.condition}
                </span>
            </div>

            {/* Wishlist Button */}
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!auth?.user) {
                        window.location.href = route('google.redirect');
                        return;
                    }
                    if (favLoading) return;
                    const next = !wishlisted;
                    setWishlisted(next);
                    setFavLoading(true);
                    router.post(route('favorites.toggle'), { listing_id: listing.id }, {
                        preserveState: true,
                        preserveScroll: true,
                        onSuccess: () => setFavLoading(false),
                        onError: () => { setWishlisted(!next); setFavLoading(false); },
                    });
                }}
                disabled={favLoading}
                className={`absolute top-3 right-3 z-20 w-10 h-10 rounded-xl border-4 border-surface-900 flex items-center justify-center shadow-[2px_2px_0_0_#0f172a] transition-all hover:scale-110 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_0_#0f172a] transform rotate-3 disabled:opacity-70 ${
                    wishlisted
                        ? 'bg-[#FF1100] text-white'
                        : 'bg-white text-surface-900 hover:bg-[#FECDD3]'
                }`}
                aria-label={wishlisted ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
            >
                <HeartIcon filled={wishlisted} />
            </button>

            {/* Hover Actions Overlay */}
            <Link href={route('products.show', listing.id)} className="absolute inset-0 z-10 flex flex-col justify-end bg-surface-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                {/* Center Action Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#BAE6FD] border-4 border-surface-900 flex items-center justify-center text-surface-900 shadow-[4px_4px_0_0_#0f172a] transform group-hover:scale-110 transition-transform duration-300">
                        <ChevronRight className="w-8 h-8" />
                    </div>
                </div>
                
                {/* Minimalist Info Bar at bottom */}
                <div className="p-4 bg-white border-t-4 border-surface-900 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2">
                        <img
                            src={listing.seller?.avatar || fallbackAvatar}
                            alt={listing.seller?.name || 'Seller'}
                            className="w-6 h-6 rounded-md border-2 border-surface-900 object-cover shrink-0"
                            onError={(e) => {
                                if (fallbackAvatar) e.target.src = fallbackAvatar;
                            }}
                        />
                        <span className="text-[10px] font-black uppercase tracking-widest text-surface-900 truncate">
                            {listing.seller?.name || 'Seller'}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
