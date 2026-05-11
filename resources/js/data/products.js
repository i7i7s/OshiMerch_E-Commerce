export const CATEGORIES = [
    { id: 'photocard', name: 'Photocard' },
    { id: 'lightstick', name: 'Lightstick' },
    { id: 'apparel', name: 'Apparel' },
    { id: 'poster', name: 'Poster' },
    { id: 'album', name: 'Album & CD' },
    { id: 'keychain', name: 'Keychain' },
    { id: 'towel', name: 'Towel' },
    { id: 'other', name: 'other' },
];

export const TESTIMONIALS = [
    { rating: 5, text: "Barang sampai dengan aman, packing tebal banget! PC Muthe nya mulus no damage.", name: "Reza", avatar: "https://ui-avatars.com/api/?name=Reza&background=random" },
    { rating: 5, text: "Admin fast response, harga bersahabat buat pelajar. Recommended seller!", name: "Andi", avatar: "https://ui-avatars.com/api/?name=Andi&background=random" },
    { rating: 4, text: "Lightstick official berfungsi normal. Agak lama di pengiriman tapi overall oke.", name: "Budi", avatar: "https://ui-avatars.com/api/?name=Budi&background=random" },
];

export const RARITY_COLORS = {
    Common: { bg: 'bg-surface-100', text: 'text-surface-700' },
    Rare: { bg: 'bg-blue-100', text: 'text-blue-700' },
    Epic: { bg: 'bg-purple-100', text: 'text-purple-700' },
    Legendary: { bg: 'bg-amber-100', text: 'text-amber-700' },
};

export const TEAM_COLORS = {
    'J': { bg: '#FF1100' },
    'KIII': { bg: '#ffeb3b' },
    'T': { bg: '#e91e63' },
    'PASSION': { bg: '#FF1100' },
    'LOVE': { bg: '#ff6393' },
    'DREAM': { bg: '#8b3dff' },
    'TRAINEE': { bg: '#ffbc20' },
    'VIRTUAL': { bg: '#00d4aa' },
};

export const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};

export const getDiscount = (price, originalPrice) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
};
