import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

const TEAM_BADGE = {
    PASSION: 'bg-[#ff2d6f] text-white',
    LOVE: 'bg-[#ff6393] text-white',
    DREAM: 'bg-[#8b3dff] text-white',
    TRAINEE: 'bg-[#ffbc20] text-white',
    VIRTUAL: 'bg-[#00d4aa] text-white',
};

const CONDITION_BADGE = {
    New: 'bg-green-100 text-green-700',
    Mint: 'bg-blue-100 text-blue-700',
    Used: 'bg-surface-100 text-surface-600',
};

const HeartIcon = ({ filled }) => (
    <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
    </svg>
);

export default function ListingCard({ listing }) {
    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);

    const teamStyle = TEAM_BADGE[listing.featured_member_team] || null;
    const condStyle = CONDITION_BADGE[listing.condition] || CONDITION_BADGE.Used;

    const fallbackAvatar = listing.seller?.name
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.seller.name)}&background=ff2d6f&color=fff&size=40`
        : null;

    return (
        <Link href={route('products.show', listing.id)} className="group block focus:outline-none">
            <motion.div
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                className="relative bg-white rounded-2xl border border-surface-200/80 overflow-hidden cursor-pointer focus-within:ring-2 focus-within:ring-primary-400 focus-within:ring-offset-2"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)' }}
            >
                {/* Hover glow border */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent group-hover:ring-primary-200 transition-all duration-300 pointer-events-none z-10" />

                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-surface-100">
                    {!imgLoaded && !imgError && (
                        <div className="absolute inset-0 skeleton" />
                    )}

                    {imgError || !listing.image_url ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-surface-100">
                            <ShoppingBag className="w-12 h-12 text-surface-300" />
                        </div>
                    ) : (
                        <img
                            src={listing.image_url}
                            alt={listing.title}
                            loading="lazy"
                            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                                imgLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            onLoad={() => setImgLoaded(true)}
                            onError={() => setImgError(true)}
                        />
                    )}

                    {/* Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
                        {teamStyle && listing.featured_member_team && (
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-wider shadow-sm ${teamStyle}`}>
                                {listing.featured_member_team === 'VIRTUAL' ? 'JKT48V' : listing.featured_member_team}
                            </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold ${condStyle}`}>
                            {listing.condition}
                        </span>
                    </div>

                    {/* Wishlist button */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            setWishlisted((w) => !w);
                        }}
                        className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
                            wishlisted
                                ? 'bg-primary-500 text-white'
                                : 'bg-white/90 text-surface-500 hover:bg-white hover:text-primary-500'
                        }`}
                        aria-label={wishlisted ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
                    >
                        <HeartIcon filled={wishlisted} />
                    </button>

                    {/* Gradient overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>

                {/* Info */}
                <div className="p-3.5">
                    {/* Member tag */}
                    {listing.featured_member_name && (
                        <p className="text-[11px] text-primary-500 font-semibold mb-1 truncate">
                            {listing.featured_member_name}
                        </p>
                    )}

                    {/* Title */}
                    <h3 className="font-semibold text-surface-800 text-sm leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors mb-2.5">
                        {listing.title}
                    </h3>

                    {/* Price */}
                    <p className="font-bold text-surface-900 text-base">
                        Rp{listing.price.toLocaleString('id-ID')}
                    </p>

                    {/* Seller + time */}
                    <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-surface-100">
                        <img
                            src={listing.seller?.avatar || fallbackAvatar}
                            alt={listing.seller?.name || 'Seller'}
                            className="w-5 h-5 rounded-full object-cover shrink-0"
                            onError={(e) => {
                                if (fallbackAvatar) e.target.src = fallbackAvatar;
                            }}
                        />
                        <span className="text-[11px] text-surface-500 truncate flex-1">
                            {listing.seller?.name || 'Seller'}
                        </span>
                        <span className="text-[11px] text-surface-400 shrink-0">{listing.created_at}</span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
