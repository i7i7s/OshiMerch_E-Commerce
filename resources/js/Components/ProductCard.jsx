import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatPrice, getDiscount, RARITY_COLORS } from '@/data/products';

const HeartIcon = ({ filled }) => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);

const CartPlusIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
);

const StarIcon = () => (
    <svg className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

export default function ProductCard({ product, index = 0 }) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [showCartAnim, setShowCartAnim] = useState(false);
    const discount = getDiscount(product.price, product.originalPrice);
    const rarityStyle = RARITY_COLORS[product.rarity] || RARITY_COLORS['Common'];

    const handleAddToCart = (e) => {
        e.stopPropagation();
        setShowCartAnim(true);
        setTimeout(() => setShowCartAnim(false), 600);
    };

    const handleWishlist = (e) => {
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="group relative bg-white rounded-2xl border border-surface-200/80 overflow-hidden cursor-pointer"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)' }}
        >
            {/* Hover glow border */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
                 style={{ boxShadow: '0 0 0 2px rgba(255,45,111,0.3), 0 8px 30px rgba(255,45,111,0.12)' }} />

            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-surface-100">
                {!imgLoaded && <div className="absolute inset-0 skeleton" />}
                <motion.img
                    src={product.image}
                    alt={product.title}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImgLoaded(true)}
                    loading="lazy"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.4 }}
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Top badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {product.isNew && (
                        <span className="px-2 py-0.5 rounded-md bg-green-500 text-white text-[10px] font-bold tracking-wider uppercase">New</span>
                    )}
                    {discount > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-red-500 text-white text-[10px] font-bold">-{discount}%</span>
                    )}
                    {product.isTrending && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold flex items-center gap-1">
                            🔥 Trending
                        </span>
                    )}
                </div>

                {/* Rarity badge */}
                <div className="absolute top-3 right-3 z-10">
                    <span className={`px-2 py-0.5 rounded-md ${rarityStyle.bg} ${rarityStyle.text} text-[10px] font-bold tracking-wider`}>
                        {product.rarity}
                    </span>
                </div>

                {/* Wishlist button */}
                <motion.button
                    onClick={handleWishlist}
                    whileTap={{ scale: 0.8 }}
                    className={`absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
                        isWishlisted
                            ? 'bg-primary-500 text-white shadow-glow-primary'
                            : 'bg-white/80 text-surface-500 hover:bg-white hover:text-primary-500'
                    }`}
                    aria-label="Toggle wishlist"
                >
                    <HeartIcon filled={isWishlisted} />
                </motion.button>

                {/* Quick add to cart */}
                <motion.button
                    onClick={handleAddToCart}
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute bottom-3 left-3 z-10 px-3 py-2 rounded-lg bg-white/90 backdrop-blur-sm text-surface-800 text-xs font-semibold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1.5 hover:bg-primary-500 hover:text-white"
                >
                    <CartPlusIcon />
                    {showCartAnim ? 'Added!' : 'Keranjang'}
                </motion.button>

                {/* Stock warning */}
                {product.stock <= 3 && product.stock > 0 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-2.5 py-1 rounded-full bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold opacity-0 group-hover:opacity-0 transition-opacity">
                        Sisa {product.stock}!
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4">
                {/* Team & Condition */}
                <div className="flex items-center gap-1.5 mb-2">
                    {product.team && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold text-primary-600 bg-primary-50 border border-primary-100">
                            {product.team}
                        </span>
                    )}
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        product.condition === 'Mint' ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' :
                        product.condition === 'New' ? 'text-blue-600 bg-blue-50 border border-blue-100' :
                        'text-surface-500 bg-surface-100 border border-surface-200'
                    }`}>
                        {product.condition}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-surface-900 leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors mb-2">
                    {product.title}
                </h3>

                {/* Rating & Sold */}
                <div className="flex items-center gap-2 mb-2.5">
                    <div className="flex items-center gap-0.5">
                        <StarIcon />
                        <span className="text-xs font-medium text-surface-600">{product.seller.rating}</span>
                    </div>
                    <span className="text-surface-300">•</span>
                    <span className="text-xs text-surface-400">{product.soldCount} terjual</span>
                    {product.stock <= 3 && (
                        <>
                            <span className="text-surface-300">•</span>
                            <span className="text-xs text-red-500 font-medium">Sisa {product.stock}</span>
                        </>
                    )}
                </div>

                {/* Price */}
                <div className="flex items-end gap-2">
                    <span className="text-lg font-bold text-surface-900">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                        <span className="text-xs text-surface-400 line-through mb-0.5">{formatPrice(product.originalPrice)}</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
