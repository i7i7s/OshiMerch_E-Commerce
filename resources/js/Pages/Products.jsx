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
    { id: 'penlight', name: 'PENLIGHT' },
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

// ─── Skeleton loader ─────────────────────────────────────────────────────────

function CardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border-4 border-surface-100 overflow-hidden shadow-sm">
            <div className="aspect-[3/4] skeleton" />
            <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 skeleton rounded" />
                <div className="h-4 w-1/2 skeleton rounded" />
                <div className="h-6 w-1/3 skeleton rounded mt-4" />
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
                <h3 className="text-sm font-black font-display text-surface-900 uppercase tracking-widest mb-4">Tim JKT48</h3>
                <div className="flex flex-wrap gap-2">
                    {TEAMS.map((t) => (
                        <button
                            key={t.value}
                            onClick={() => update('team', t.value)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-2 ${
                                teamVal === t.value
                                    ? 'bg-surface-900 border-surface-900 text-white shadow-md'
                                    : 'bg-white border-surface-200 text-surface-600 hover:border-surface-400'
                            }`}
                        >
                            {t.color && (
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                            )}
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Condition filter */}
            <div>
                <h3 className="text-sm font-black font-display text-surface-900 uppercase tracking-widest mb-4">Kondisi</h3>
                <div className="flex flex-col gap-2">
                    {CONDITIONS.map((c) => (
                        <button
                            key={c.value}
                            onClick={() => update('condition', c.value)}
                            className={`w-full flex items-center px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-2 ${
                                condVal === c.value
                                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                                    : 'bg-white border-surface-200 text-surface-600 hover:border-surface-400'
                            }`}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price range */}
            <div>
                <h3 className="text-sm font-black font-display text-surface-900 uppercase tracking-widest mb-4">Harga</h3>
                <div className="flex items-center gap-3">
                    <input
                        type="number"
                        placeholder="MIN"
                        value={filters.price_min || ''}
                        onChange={(e) => onChange({ ...filters, price_min: e.target.value || undefined })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-surface-200 text-sm font-bold text-surface-900 placeholder-surface-400 focus:outline-none focus:border-primary-500 transition-colors"
                    />
                    <span className="text-surface-400 font-bold">-</span>
                    <input
                        type="number"
                        placeholder="MAX"
                        value={filters.price_max || ''}
                        onChange={(e) => onChange({ ...filters, price_max: e.target.value || undefined })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-surface-200 text-sm font-bold text-surface-900 placeholder-surface-400 focus:outline-none focus:border-primary-500 transition-colors"
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
                className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-[2rem] shadow-2xl max-h-[90dvh] overflow-y-auto border-t-4 border-surface-900"
            >
                <div className="sticky top-0 bg-white px-6 pt-6 pb-4 flex items-center justify-between border-b border-surface-100 z-10">
                    <h2 className="font-black font-display text-2xl text-surface-900 uppercase">Filter</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-100 hover:bg-surface-200 transition-colors"
                    >
                        <X className="w-5 h-5 text-surface-900" />
                    </button>
                </div>
                <div className="px-6 py-6">{content}</div>
                <div className="sticky bottom-0 bg-white px-6 py-6 border-t border-surface-100">
                    <button
                        onClick={onClose}
                        className="w-full py-4 rounded-xl gradient-primary text-white font-black text-sm uppercase tracking-widest"
                    >
                        Terapkan Filter
                    </button>
                </div>
            </motion.div>
        );
    }

    return <div className="bg-white rounded-[2rem] border-4 border-surface-100 shadow-sm p-6 lg:p-8">{content}</div>;
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState({ hasFilters, auth }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[2rem] border-4 border-surface-100 shadow-sm"
        >
            <div className="w-24 h-24 rounded-[2rem] bg-surface-100 flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-surface-400" />
            </div>
            <h3 className="text-3xl font-black font-display text-surface-900 mb-3 uppercase tracking-tight">
                {hasFilters ? 'KOSONG.' : 'BELUM ADA LISTING.'}
            </h3>
            <p className="text-surface-500 font-medium text-lg max-w-sm mb-8">
                {hasFilters
                    ? 'Coba gunakan kata kunci lain atau kurangi filter.'
                    : 'Jadilah yang pertama membuka pasar merchandise JKT48!'}
            </p>
            {auth?.user ? (
                <Link
                    href={route('listings.create')}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl gradient-primary text-white font-black text-sm uppercase tracking-widest shadow-glow-primary hover:shadow-xl hover:scale-105 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Jual Sekarang
                </Link>
            ) : (
                <a
                    href={route('google.redirect')}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-surface-900 text-white font-black text-sm uppercase tracking-widest hover:bg-surface-800 hover:scale-105 transition-all"
                >
                    Login & Jual
                </a>
            )}
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
        <div className="flex items-center justify-center gap-2 pt-12">
            <button
                onClick={() => onPage(current_page - 1)}
                disabled={current_page === 1}
                className="w-12 h-12 rounded-xl flex items-center justify-center border-2 border-surface-200 text-surface-900 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {rendered.map((item, i) =>
                item === '...' ? (
                    <span key={`dots-${i}`} className="w-12 h-12 flex items-center justify-center text-surface-400 font-bold">
                        ···
                    </span>
                ) : (
                    <button
                        key={item}
                        onClick={() => onPage(item)}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-black transition-all ${
                            item === current_page
                                ? 'gradient-primary text-white shadow-lg'
                                : 'bg-white border-2 border-surface-200 text-surface-900 hover:border-surface-400'
                        }`}
                    >
                        {item}
                    </button>
                ),
            )}

            <button
                onClick={() => onPage(current_page + 1)}
                disabled={current_page === last_page}
                className="w-12 h-12 rounded-xl flex items-center justify-center border-2 border-surface-200 text-surface-900 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight className="w-5 h-5" />
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
            <div className="min-h-dvh bg-surface-50 flex flex-col font-sans selection:bg-primary-500 selection:text-white">
                <Navbar auth={auth} />

                {/* Hero / Header Halaman */}
                <div className="bg-surface-950 text-white pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                    {/* Animated background element */}
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[50%] -right-[10%] w-[800px] h-[800px] bg-gradient-to-br from-primary-600/20 to-purple-600/20 rounded-full blur-[80px] pointer-events-none"
                    />

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                                    <span className="inline-block py-1 px-3 bg-white/10 text-primary-400 text-xs font-black uppercase tracking-[0.2em] rounded-full border border-white/10">
                                        Marketplace
                                    </span>
                                </motion.div>
                                <motion.h1 
                                    initial={{ opacity: 0, y: 20 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    transition={{ delay: 0.1 }}
                                    className="text-6xl md:text-8xl font-black font-display uppercase tracking-tighter leading-[0.85] mb-2"
                                >
                                    THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-600">MERCH.</span><br/>
                                    THE LEGACY.
                                </motion.h1>
                                <motion.p 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    transition={{ delay: 0.2 }}
                                    className="text-surface-400 font-medium max-w-xl text-lg mt-6"
                                >
                                    {meta ? `Menampilkan ${meta.total.toLocaleString('id-ID')} item eksklusif dari fandom JKT48.` : 'Jelajahi koleksi merchandise incaranmu.'}
                                </motion.p>
                            </div>
                            
                            {auth?.user && (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                                    <Link
                                        href={route('listings.create')}
                                        className="inline-flex items-center gap-3 px-8 py-5 rounded-full bg-white text-surface-950 font-black text-sm uppercase tracking-widest hover:scale-105 hover:bg-primary-50 hover:text-primary-600 transition-all shadow-xl"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Jual Item
                                    </Link>
                                </motion.div>
                            )}
                        </div>

                        {/* Category chips - Brutalist Scroll */}
                        <div className="flex gap-3 mt-16 overflow-x-auto pb-4 scrollbar-hide">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() =>
                                        handleFilterChange({ ...filters, category: cat.id === 'ALL' ? undefined : cat.id })
                                    }
                                    className={`shrink-0 px-6 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-300 border-2 ${
                                        (filters.category || 'ALL') === cat.id
                                            ? 'bg-primary-500 border-primary-500 text-white shadow-[0_4px_15px_rgba(244,63,94,0.4)]'
                                            : 'bg-transparent border-surface-700 text-surface-300 hover:border-white hover:text-white'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex gap-8 lg:gap-12">
                        {/* Desktop filter sidebar */}
                        <aside className="hidden lg:block w-72 shrink-0">
                            <FilterPanel filters={filters} onChange={handleFilterChange} />
                        </aside>

                        {/* Main content */}
                        <div className="flex-1 min-w-0">
                            {/* Search + Sort bar */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                                {/* Search */}
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                                    <input
                                        type="search"
                                        value={localSearch}
                                        onChange={(e) => setLocalSearch(e.target.value)}
                                        placeholder="Cari item..."
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-surface-200 bg-white text-surface-900 font-bold placeholder-surface-400 focus:outline-none focus:border-primary-500 transition-colors"
                                    />
                                    {localSearch && (
                                        <button
                                            onClick={() => setLocalSearch('')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-surface-200 hover:bg-surface-300 transition-colors"
                                        >
                                            <X className="w-4 h-4 text-surface-700" />
                                        </button>
                                    )}
                                </div>

                                {/* Sort */}
                                <div className="relative shrink-0">
                                    <select
                                        value={filters.sort || 'latest'}
                                        onChange={(e) => handleFilterChange({ ...filters, sort: e.target.value })}
                                        className="w-full sm:w-auto pl-5 pr-10 py-4 rounded-2xl border-2 border-surface-200 bg-white text-xs font-black uppercase tracking-wider text-surface-900 focus:outline-none focus:border-primary-500 transition-colors appearance-none cursor-pointer"
                                    >
                                        {SORTS.map((s) => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-surface-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>

                                {/* Mobile filter toggle */}
                                <button
                                    onClick={() => setShowMobileFilter(true)}
                                    className="lg:hidden relative flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-surface-900 text-white text-xs font-black uppercase tracking-wider hover:bg-surface-800 transition-colors"
                                >
                                    <SlidersHorizontal className="w-4 h-4" />
                                    Filter
                                    {activeFilterCount > 0 && (
                                        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full gradient-primary text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Active filter tags */}
                            {hasFilters && (
                                <div className="flex flex-wrap items-center gap-3 mb-8">
                                    {debouncedSearch && (
                                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-900 text-white text-xs font-bold uppercase tracking-wider">
                                            <Search className="w-3.5 h-3.5" />
                                            "{debouncedSearch}"
                                            <button onClick={() => setLocalSearch('')} className="hover:text-primary-400">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </span>
                                    )}
                                    {filters.team && filters.team !== 'ALL' && (
                                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-900 text-white text-xs font-bold uppercase tracking-wider">
                                            <Tag className="w-3.5 h-3.5" />
                                            {TEAMS.find((t) => t.value === filters.team)?.label}
                                            <button onClick={() => handleFilterChange({ ...filters, team: undefined })} className="hover:text-primary-400">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </span>
                                    )}
                                    {filters.condition && filters.condition !== 'ALL' && (
                                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-900 text-white text-xs font-bold uppercase tracking-wider">
                                            {CONDITIONS.find((c) => c.value === filters.condition)?.label}
                                            <button onClick={() => handleFilterChange({ ...filters, condition: undefined })} className="hover:text-primary-400">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </span>
                                    )}
                                    <button
                                        onClick={() => {
                                            setLocalSearch('');
                                            setFilters({});
                                            applyFilters({});
                                        }}
                                        className="text-xs font-black uppercase tracking-wider text-primary-600 hover:text-primary-800 underline underline-offset-4 transition-colors"
                                    >
                                        CLEAR ALL
                                    </button>
                                </div>
                            )}

                            {/* Product grid */}
                            {isNavigating ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <CardSkeleton key={i} />
                                    ))}
                                </div>
                            ) : items.length === 0 ? (
                                <EmptyState hasFilters={hasFilters} auth={auth} />
                            ) : (
                                <motion.div
                                    className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
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
                                                <ListingCard listing={listing} />
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
                            className="fixed inset-0 bg-surface-950/60 backdrop-blur-sm z-40 lg:hidden"
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
