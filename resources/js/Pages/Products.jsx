import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, SlidersHorizontal, X, ShoppingBag, Plus,
    ChevronLeft, ChevronRight, Tag,
} from 'lucide-react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import ListingCard from '@/Components/ListingCard';

// ─── Constants ──────────────────────────────────────────────────────────────

const CATEGORIES = [
    { id: 'ALL', name: 'SEMUA' },
    { id: 'photocard', name: 'PHOTOCARD' },
    { id: 'lightstick', name: 'LIGHTSTICK' },
    { id: 'apparel', name: 'APPAREL' },
    { id: 'poster', name: 'POSTER' },
    { id: 'album', name: 'ALBUM & CD' },
    { id: 'keychain', name: 'KEYCHAIN' },
    { id: 'towel', name: 'TOWEL' },
    { id: 'other', name: 'OTHER' },
];

const TEAMS = [
    { value: 'ALL', label: 'SEMUA TIM' },
    { value: 'PASSION', label: 'PASSION', color: '#FF1100' },
    { value: 'LOVE', label: 'LOVE', color: '#ff6393' },
    { value: 'DREAM', label: 'DREAM', color: '#8b3dff' },
    { value: 'TRAINEE', label: 'TRAINEE', color: '#ffbc20' },
    { value: 'VIRTUAL', label: 'VIRTUAL', color: '#00d4aa' },
];

const CONDITIONS = [
    { value: 'ALL', label: 'SEMUA KONDISI' },
    { value: 'New', label: 'BARU (NEW)' },
    { value: 'Mint', label: 'MINT CONDITION' },
    { value: 'Used', label: 'BEKAS (USED)' },
];

const SORTS = [
    { value: 'latest', label: 'TERBARU' },
    { value: 'price_asc', label: 'HARGA: RENDAH KE TINGGI' },
    { value: 'price_desc', label: 'HARGA: TINGGI KE RENDAH' },
];

// ─── Debounce hook ───────────────────────────────────────────────────────────

function useDebounce(value, delay = 300) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

// ─── Skeleton loader (Brutalist) ─────────────────────────────────────────────────────────

function CardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border-4 border-surface-900 overflow-hidden shadow-[4px_4px_0_0_#0f172a]">
            <div className="aspect-[3/4] bg-surface-200 animate-pulse border-b-4 border-surface-900" />
            <div className="p-5 space-y-4 bg-surface-50">
                <div className="h-6 w-3/4 bg-surface-200 animate-pulse rounded border-2 border-surface-900" />
                <div className="h-5 w-1/2 bg-surface-200 animate-pulse rounded border-2 border-surface-900" />
                <div className="h-8 w-1/3 bg-surface-200 animate-pulse rounded mt-4 border-2 border-surface-900" />
            </div>
        </div>
    );
}

// ─── Filter Panel ─────────────────────────────────────────────────────────────

function FilterPanel({ filters, onChange, onClose, isMobile = false }) {
    const teamVal = filters.team || 'ALL';
    const condVal = filters.condition || 'ALL';

    const update = (key, value) =>
        onChange({ ...filters, [key]: value === 'ALL' ? undefined : value });

    const content = (
        <div className="space-y-8">
            {/* Team filter */}
            <div>
                <h3 className="text-sm font-black font-display text-surface-900 uppercase tracking-widest mb-4 bg-[#FEF08A] inline-block px-2 border-2 border-surface-900 rounded transform -rotate-2">Tim JKT48</h3>
                <div className="flex flex-wrap gap-3">
                    {TEAMS.map((t) => (
                        <button
                            key={t.value}
                            onClick={() => update('team', t.value)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-4 border-surface-900 shadow-[2px_2px_0_0_#0f172a] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[4px_4px_0_0_#0f172a] active:translate-y-1 active:translate-x-1 active:shadow-none ${
                                teamVal === t.value
                                    ? 'bg-surface-900 text-white shadow-none translate-y-1 translate-x-1'
                                    : 'bg-white text-surface-900'
                            }`}
                        >
                            {t.color && (
                                <span className="w-3 h-3 border-2 border-surface-900 shrink-0 shadow-[1px_1px_0_0_#0f172a]" style={{ backgroundColor: t.color }} />
                            )}
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Condition filter */}
            <div>
                <h3 className="text-sm font-black font-display text-surface-900 uppercase tracking-widest mb-4 bg-[#A7F3D0] inline-block px-2 border-2 border-surface-900 rounded transform rotate-1">Kondisi</h3>
                <div className="flex flex-col gap-3">
                    {CONDITIONS.map((c) => (
                        <button
                            key={c.value}
                            onClick={() => update('condition', c.value)}
                            className={`w-full flex items-center px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-4 border-surface-900 shadow-[2px_2px_0_0_#0f172a] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[4px_4px_0_0_#0f172a] active:translate-y-1 active:translate-x-1 active:shadow-none ${
                                condVal === c.value
                                    ? 'bg-[#BAE6FD] text-surface-900 shadow-none translate-y-1 translate-x-1'
                                    : 'bg-white text-surface-900'
                            }`}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price range */}
            <div>
                <h3 className="text-sm font-black font-display text-surface-900 uppercase tracking-widest mb-4 bg-[#FECDD3] inline-block px-2 border-2 border-surface-900 rounded transform -rotate-1">Harga</h3>
                <div className="flex items-center gap-3">
                    <input
                        type="number"
                        placeholder="MIN"
                        value={filters.price_min || ''}
                        onChange={(e) => onChange({ ...filters, price_min: e.target.value || undefined })}
                        className="w-full px-4 py-3 rounded-xl border-4 border-surface-900 bg-surface-50 text-sm font-bold text-surface-900 placeholder-surface-400 focus:outline-none focus:bg-[#FEF08A] transition-colors"
                    />
                    <span className="text-surface-900 font-black text-xl">-</span>
                    <input
                        type="number"
                        placeholder="MAX"
                        value={filters.price_max || ''}
                        onChange={(e) => onChange({ ...filters, price_max: e.target.value || undefined })}
                        className="w-full px-4 py-3 rounded-xl border-4 border-surface-900 bg-surface-50 text-sm font-bold text-surface-900 placeholder-surface-400 focus:outline-none focus:bg-[#FEF08A] transition-colors"
                    />
                </div>
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                className="fixed inset-x-0 bottom-0 z-50 bg-[#FAFAFA] rounded-t-3xl shadow-[0_-8px_0_0_#0f172a] max-h-[90dvh] overflow-y-auto border-4 border-surface-900 border-b-0"
            >
                <div className="sticky top-0 bg-[#FAFAFA] px-6 pt-6 pb-4 flex items-center justify-between border-b-4 border-surface-900 z-10">
                    <h2 className="font-black font-display text-3xl text-surface-900 uppercase tracking-tighter">FILTER</h2>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#FECDD3] border-4 border-surface-900 shadow-[2px_2px_0_0_#0f172a] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[4px_4px_0_0_#0f172a] transition-all"
                    >
                        <X className="w-6 h-6 text-surface-900" />
                    </button>
                </div>
                <div className="px-6 py-6">{content}</div>
                <div className="sticky bottom-0 bg-[#FAFAFA] px-6 py-6 border-t-4 border-surface-900">
                    <button
                        onClick={onClose}
                        className="w-full py-4 rounded-xl bg-surface-900 text-white font-black text-lg uppercase tracking-widest shadow-[4px_4px_0_0_#0f172a] hover:bg-[#FEF08A] hover:text-surface-900 active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
                    >
                        TERAPKAN FILTER
                    </button>
                </div>
            </motion.div>
        );
    }

    return <div className="bg-white rounded-3xl border-4 border-surface-900 shadow-[8px_8px_0_0_#0f172a] p-6 lg:p-8">{content}</div>;
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState({ hasFilters, auth }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center bg-[#FECDD3] rounded-3xl border-4 border-surface-900 shadow-[8px_8px_0_0_#0f172a] relative overflow-hidden group"
        >
            <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.2] pointer-events-none" />
            
            <div className="w-24 h-24 rounded-2xl bg-white border-4 border-surface-900 flex items-center justify-center mb-8 shadow-[4px_4px_0_0_#0f172a] transform -rotate-6 group-hover:rotate-0 transition-transform relative z-10">
                <ShoppingBag className="w-12 h-12 text-surface-900" />
            </div>
            
            <h3 className="text-4xl sm:text-5xl font-black font-display text-surface-900 mb-4 uppercase tracking-tighter relative z-10" style={{ textShadow: '2px 2px 0px white' }}>
                {hasFilters ? 'KOSONG MELOMPONG!' : 'BELUM ADA LISTING.'}
            </h3>
            
            <p className="text-surface-900 font-bold text-lg max-w-sm mb-10 bg-white px-4 py-2 border-2 border-surface-900 rounded-xl shadow-[2px_2px_0_0_#0f172a] relative z-10">
                {hasFilters
                    ? 'Coba gunakan kata kunci lain atau kurangi filter yang kamu pilih.'
                    : 'Jadilah yang pertama membuka pasar merchandise JKT48!'}
            </p>
            
            <div className="relative z-10">
                {auth?.user ? (
                    <Link
                        href={route('listings.create')}
                        className="inline-flex items-center gap-3 px-8 py-5 rounded-xl bg-surface-900 text-white border-4 border-transparent font-black text-lg uppercase tracking-widest shadow-[6px_6px_0_0_rgba(15,23,42,0.2)] hover:bg-[#FEF08A] hover:text-surface-900 hover:border-surface-900 hover:shadow-[8px_8px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 transition-all active:translate-y-1 active:translate-x-1 active:shadow-none"
                    >
                        <Plus className="w-6 h-6" />
                        JUAL SEKARANG
                    </Link>
                ) : (
                    <a
                        href={route('google.redirect')}
                        className="inline-flex items-center gap-3 px-8 py-5 rounded-xl bg-[#BAE6FD] text-surface-900 border-4 border-surface-900 font-black text-lg uppercase tracking-widest shadow-[6px_6px_0_0_#0f172a] hover:bg-[#FEF08A] hover:shadow-[8px_8px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 transition-all active:translate-y-1 active:translate-x-1 active:shadow-none"
                    >
                        LOGIN & JUAL
                    </a>
                )}
            </div>
        </motion.div>
    );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ meta, onPage }) {
    if (!meta || meta.last_page <= 1) return null;
    const { current_page, last_page } = meta;

    const pages = Array.from({ length: last_page }, (_, i) => i + 1).filter(
        (p) => p === 1 || p === last_page || Math.abs(p - current_page) <= 2,
    );

    const rendered = [];
    pages.forEach((p, i) => {
        if (i > 0 && p - pages[i - 1] > 1) rendered.push('...');
        rendered.push(p);
    });

    return (
        <div className="flex items-center justify-center gap-3 pt-12">
            <button
                onClick={() => onPage(current_page - 1)}
                disabled={current_page === 1}
                className="w-12 h-12 rounded-xl flex items-center justify-center border-4 border-surface-900 bg-white text-surface-900 shadow-[4px_4px_0_0_#0f172a] hover:bg-[#FEF08A] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] active:translate-y-1 active:translate-x-1 active:shadow-none disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 transition-all"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            {rendered.map((item, i) =>
                item === '...' ? (
                    <span key={`dots-${i}`} className="w-12 h-12 flex items-center justify-center text-surface-900 font-black text-xl bg-[#FAFAFA] border-4 border-surface-900 rounded-xl">
                        ···
                    </span>
                ) : (
                    <button
                        key={item}
                        onClick={() => onPage(item)}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg transition-all border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] active:translate-y-1 active:translate-x-1 active:shadow-none ${
                            item === current_page
                                ? 'bg-surface-900 text-white shadow-[2px_2px_0_0_#0f172a] translate-y-0.5 translate-x-0.5'
                                : 'bg-white text-surface-900 hover:bg-[#A7F3D0]'
                        }`}
                    >
                        {item}
                    </button>
                ),
            )}

            <button
                onClick={() => onPage(current_page + 1)}
                disabled={current_page === last_page}
                className="w-12 h-12 rounded-xl flex items-center justify-center border-4 border-surface-900 bg-white text-surface-900 shadow-[4px_4px_0_0_#0f172a] hover:bg-[#FEF08A] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] active:translate-y-1 active:translate-x-1 active:shadow-none disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 transition-all"
            >
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Products({ listings, filters: serverFilters, auth }) {
    const [localSearch, setLocalSearch] = useState(serverFilters?.search || '');
    const [filters, setFilters] = useState(serverFilters || {});
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const debouncedSearch = useDebounce(localSearch, 300);

    const activeFilterCount = [filters.team, filters.condition, filters.category, filters.price_min, filters.price_max]
        .filter(Boolean).length;

    const applyFilters = useCallback((newFilters) => {
        setIsNavigating(true);
        const params = {};
        Object.entries(newFilters).forEach(([k, v]) => {
            if (v !== undefined && v !== '' && v !== 'ALL') params[k] = v;
        });
        router.get(route('products.index'), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onFinish: () => setIsNavigating(false),
        });
    }, []);

    useEffect(() => {
        applyFilters({ ...filters, search: debouncedSearch || undefined });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        applyFilters({ ...newFilters, search: debouncedSearch || undefined });
    };

    const handlePage = (page) => {
        const params = {};
        Object.entries({ ...filters, search: debouncedSearch || undefined, page }).forEach(([k, v]) => {
            if (v !== undefined && v !== '' && v !== 'ALL') params[k] = v;
        });
        router.get(route('products.index'), params, {
            preserveState: true,
            preserveScroll: false,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const hasFilters = Boolean(
        debouncedSearch || filters.team || filters.condition || filters.category || filters.price_min || filters.price_max,
    );

    const items = listings?.data || [];
    const meta = listings
        ? {
              current_page: listings.current_page,
              last_page: listings.last_page,
              total: listings.total,
          }
        : null;

    return (
        <>
            <Head title="Produk — OshiMerch" />
            <div className="min-h-dvh bg-[#FAFAFA] flex flex-col font-sans selection:bg-surface-900 selection:text-[#FEF08A]">
                <Navbar auth={auth} />

                {/* Hero / Header Halaman */}
                <div className="bg-[#BAE6FD] border-b-4 border-surface-900 pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                    {/* Animated background element */}
                    <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.3]" />

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                                    <span className="inline-block py-2 px-4 bg-white border-4 border-surface-900 text-surface-900 text-xs font-black uppercase tracking-widest rounded-xl shadow-[4px_4px_0_0_#0f172a] transform -rotate-2">
                                        MARKETPLACE
                                    </span>
                                </motion.div>
                                <motion.h1 
                                    initial={{ opacity: 0, y: 20 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    transition={{ delay: 0.1 }}
                                    className="text-6xl md:text-[7rem] font-black font-display text-surface-900 uppercase tracking-tighter leading-[0.85] mb-4"
                                    style={{ textShadow: '4px 4px 0px white, 6px 6px 0px #0f172a' }}
                                >
                                    THE MERCH.<br/>
                                    THE LEGACY.
                                </motion.h1>
                                <motion.p 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    transition={{ delay: 0.2 }}
                                    className="text-surface-900 font-bold bg-white inline-block px-4 py-2 border-2 border-surface-900 rounded-xl shadow-[2px_2px_0_0_#0f172a] text-lg mt-4 transform rotate-1"
                                >
                                    {meta ? `Menampilkan ${meta.total.toLocaleString('id-ID')} item eksklusif dari fandom JKT48.` : 'Jelajahi koleksi merchandise incaranmu.'}
                                </motion.p>
                            </div>
                            
                            {auth?.user && (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                                    <Link
                                        href={route('listings.create')}
                                        className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-surface-900 text-white font-black text-lg uppercase tracking-widest border-4 border-transparent hover:bg-[#FEF08A] hover:text-surface-900 hover:border-surface-900 transition-all shadow-[8px_8px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0_0_#0f172a] active:translate-y-1 active:translate-x-1 active:shadow-none"
                                    >
                                        <Plus className="w-6 h-6" />
                                        JUAL ITEM
                                    </Link>
                                </motion.div>
                            )}
                        </div>

                        {/* Category chips - Brutalist Scroll */}
                        <div className="flex gap-4 mt-16 overflow-x-auto pb-6 pt-2 px-2 scrollbar-hide">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() =>
                                        handleFilterChange({ ...filters, category: cat.id === 'ALL' ? undefined : cat.id })
                                    }
                                    className={`shrink-0 px-8 py-4 rounded-xl text-sm font-black tracking-widest uppercase transition-all duration-300 border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] active:translate-y-1 active:translate-x-1 active:shadow-none ${
                                        (filters.category || 'ALL') === cat.id
                                            ? 'bg-surface-900 text-white shadow-[2px_2px_0_0_#0f172a] translate-y-1 translate-x-1'
                                            : 'bg-white text-surface-900'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                            {/* Spacer to prevent last item from clipping its shadow */}
                            <div className="shrink-0 w-2 md:w-6" />
                        </div>
                    </div>
                </div>

                <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex gap-8 lg:gap-12">
                        {/* Desktop filter sidebar */}
                        <aside className="hidden lg:block w-80 shrink-0">
                            <div className="sticky top-28">
                                <FilterPanel filters={filters} onChange={handleFilterChange} />
                            </div>
                        </aside>

                        {/* Main content */}
                        <div className="flex-1 min-w-0">
                            {/* Search + Sort bar */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                                {/* Search */}
                                <div className="relative flex-1">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-surface-900 font-black" />
                                    <input
                                        type="search"
                                        value={localSearch}
                                        onChange={(e) => setLocalSearch(e.target.value)}
                                        placeholder="CARI ITEM..."
                                        className="w-full pl-14 pr-5 py-5 rounded-2xl border-4 border-surface-900 bg-white text-surface-900 font-black uppercase tracking-widest placeholder-surface-400 focus:outline-none focus:bg-[#FEF08A] focus:shadow-[4px_4px_0_0_#0f172a] transition-all"
                                    />
                                    {localSearch && (
                                        <button
                                            onClick={() => setLocalSearch('')}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-xl bg-[#FECDD3] border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[3px_3px_0_0_#0f172a] transition-all"
                                        >
                                            <X className="w-5 h-5 text-surface-900" />
                                        </button>
                                    )}
                                </div>

                                {/* Sort */}
                                <div className="relative shrink-0">
                                    <select
                                        value={filters.sort || 'latest'}
                                        onChange={(e) => handleFilterChange({ ...filters, sort: e.target.value })}
                                        className="w-full sm:w-auto pl-6 pr-12 py-5 rounded-2xl border-4 border-surface-900 bg-white text-sm font-black uppercase tracking-widest text-surface-900 focus:outline-none focus:bg-[#BAE6FD] focus:shadow-[4px_4px_0_0_#0f172a] transition-all appearance-none cursor-pointer"
                                    >
                                        {SORTS.map((s) => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-surface-900">
                                        <svg className="w-5 h-5 font-black" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>

                                {/* Mobile filter toggle */}
                                <button
                                    onClick={() => setShowMobileFilter(true)}
                                    className="lg:hidden relative flex items-center justify-center gap-3 px-6 py-5 rounded-2xl bg-[#FEF08A] border-4 border-surface-900 text-surface-900 text-sm font-black uppercase tracking-widest shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all"
                                >
                                    <SlidersHorizontal className="w-5 h-5" />
                                    FILTER
                                    {activeFilterCount > 0 && (
                                        <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-surface-900 text-white text-xs font-black flex items-center justify-center border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a]">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Active filter tags */}
                            {hasFilters && (
                                <div className="flex flex-wrap items-center gap-4 mb-10 bg-white p-4 rounded-2xl border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a]">
                                    {debouncedSearch && (
                                        <span className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-[#FEF08A] border-2 border-surface-900 text-surface-900 text-sm font-black uppercase tracking-widest shadow-[2px_2px_0_0_#0f172a]">
                                            <Search className="w-4 h-4" />
                                            "{debouncedSearch}"
                                            <button onClick={() => setLocalSearch('')} className="hover:text-[#f43f5e]">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </span>
                                    )}
                                    {filters.team && filters.team !== 'ALL' && (
                                        <span className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-[#BAE6FD] border-2 border-surface-900 text-surface-900 text-sm font-black uppercase tracking-widest shadow-[2px_2px_0_0_#0f172a]">
                                            <Tag className="w-4 h-4" />
                                            {TEAMS.find((t) => t.value === filters.team)?.label}
                                            <button onClick={() => handleFilterChange({ ...filters, team: undefined })} className="hover:text-[#f43f5e]">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </span>
                                    )}
                                    {filters.condition && filters.condition !== 'ALL' && (
                                        <span className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-[#A7F3D0] border-2 border-surface-900 text-surface-900 text-sm font-black uppercase tracking-widest shadow-[2px_2px_0_0_#0f172a]">
                                            {CONDITIONS.find((c) => c.value === filters.condition)?.label}
                                            <button onClick={() => handleFilterChange({ ...filters, condition: undefined })} className="hover:text-[#f43f5e]">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </span>
                                    )}
                                    <button
                                        onClick={() => {
                                            setLocalSearch('');
                                            setFilters({});
                                            applyFilters({});
                                        }}
                                        className="text-sm font-black uppercase tracking-widest text-[#f43f5e] hover:text-[#e11d48] underline underline-offset-4 ml-auto px-4"
                                    >
                                        RESET SEMUA
                                    </button>
                                </div>
                            )}

                            {/* Product grid */}
                            {isNavigating ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <CardSkeleton key={i} />
                                    ))}
                                </div>
                            ) : items.length === 0 ? (
                                <EmptyState hasFilters={hasFilters} auth={auth} />
                            ) : (
                                <motion.div
                                    className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8"
                                    initial="hidden"
                                    animate="show"
                                    variants={{
                                        hidden: {},
                                        show: { transition: { staggerChildren: 0.05 } }
                                    }}
                                >
                                    <AnimatePresence mode="popLayout">
                                        {items.map((listing) => (
                                            <motion.div
                                                key={listing.id}
                                                layout
                                                variants={{
                                                    hidden: { opacity: 0, y: 30 },
                                                    show: { opacity: 1, y: 0 }
                                                }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                            >
                                                <ListingCard listing={listing} auth={auth} />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            )}

                            <Pagination meta={meta} onPage={handlePage} />
                        </div>
                    </div>
                </main>

                <Footer />
            </div>

            {/* Mobile filter bottom sheet */}
            <AnimatePresence>
                {showMobileFilter && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMobileFilter(false)}
                            className="fixed inset-0 bg-surface-900/60 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <FilterPanel
                            filters={filters}
                            onChange={handleFilterChange}
                            onClose={() => setShowMobileFilter(false)}
                            isMobile
                        />
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
