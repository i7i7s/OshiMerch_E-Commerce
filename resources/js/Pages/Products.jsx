import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, SlidersHorizontal, X, ShoppingBag, Plus,
    ChevronLeft, ChevronRight, Tag, Package,
} from 'lucide-react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import ListingCard from '@/Components/ListingCard';

// ─── Constants ──────────────────────────────────────────────────────────────

const CATEGORIES = [
    { id: 'ALL', name: 'Semua' },
    { id: 'photocard', name: 'Photocard' },
    { id: 'lightstick', name: 'Lightstick' },
    { id: 'apparel', name: 'Apparel' },
    { id: 'poster', name: 'Poster' },
    { id: 'album', name: 'Album & CD' },
    { id: 'keychain', name: 'Keychain' },
    { id: 'towel', name: 'Towel' },
    { id: 'penlight', name: 'Penlight' },
];

const TEAMS = [
    { value: 'ALL', label: 'Semua Tim' },
    { value: 'PASSION', label: 'Team PASSION', color: '#ff2d6f' },
    { value: 'LOVE', label: 'Team LOVE', color: '#ff6393' },
    { value: 'DREAM', label: 'Team DREAM', color: '#8b3dff' },
    { value: 'TRAINEE', label: 'TRAINEE', color: '#ffbc20' },
    { value: 'VIRTUAL', label: 'JKT48V', color: '#00d4aa' },
];

const CONDITIONS = [
    { value: 'ALL', label: 'Semua Kondisi' },
    { value: 'New', label: 'Baru (New)' },
    { value: 'Mint', label: 'Mint Condition' },
    { value: 'Used', label: 'Bekas (Used)' },
];

const SORTS = [
    { value: 'latest', label: 'Terbaru' },
    { value: 'price_asc', label: 'Harga Terendah' },
    { value: 'price_desc', label: 'Harga Tertinggi' },
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
        <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
            <div className="aspect-[3/4] skeleton" />
            <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 skeleton rounded" />
                <div className="h-3 w-1/2 skeleton rounded" />
                <div className="h-5 w-1/3 skeleton rounded mt-3" />
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
        <div className="space-y-6">
            {/* Team filter */}
            <div>
                <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-3">Tim / Kelompok</h3>
                <div className="space-y-1.5">
                    {TEAMS.map((t) => (
                        <button
                            key={t.value}
                            onClick={() => update('team', t.value)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left min-h-[44px] ${
                                teamVal === t.value
                                    ? 'bg-primary-50 text-primary-700 font-semibold'
                                    : 'text-surface-600 hover:bg-surface-100'
                            }`}
                        >
                            {t.color && (
                                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                            )}
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Condition filter */}
            <div>
                <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-3">Kondisi Barang</h3>
                <div className="space-y-1.5">
                    {CONDITIONS.map((c) => (
                        <button
                            key={c.value}
                            onClick={() => update('condition', c.value)}
                            className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left min-h-[44px] ${
                                condVal === c.value
                                    ? 'bg-primary-50 text-primary-700 font-semibold'
                                    : 'text-surface-600 hover:bg-surface-100'
                            }`}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price range */}
            <div>
                <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-3">Rentang Harga</h3>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={filters.price_min || ''}
                        onChange={(e) => onChange({ ...filters, price_min: e.target.value || undefined })}
                        className="w-full px-3 py-2.5 rounded-xl border border-surface-200 text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent min-h-[44px]"
                    />
                    <span className="text-surface-400 shrink-0">–</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={filters.price_max || ''}
                        onChange={(e) => onChange({ ...filters, price_max: e.target.value || undefined })}
                        className="w-full px-3 py-2.5 rounded-xl border border-surface-200 text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent min-h-[44px]"
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
                className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[85dvh] overflow-y-auto"
            >
                <div className="sticky top-0 bg-white px-5 pt-4 pb-3 flex items-center justify-between border-b border-surface-100">
                    <h2 className="font-bold text-surface-900">Filter</h2>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-100 transition-colors"
                        aria-label="Tutup filter"
                    >
                        <X className="w-5 h-5 text-surface-600" />
                    </button>
                </div>
                <div className="px-5 py-4">{content}</div>
                <div className="sticky bottom-0 bg-white px-5 pt-3 pb-6 border-t border-surface-100">
                    <button
                        onClick={onClose}
                        className="w-full py-3.5 rounded-xl gradient-primary text-white font-semibold text-sm"
                    >
                        Tampilkan Hasil
                    </button>
                </div>
            </motion.div>
        );
    }

    return <div className="bg-white rounded-2xl border border-surface-200 p-5">{content}</div>;
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState({ hasFilters, auth }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
        >
            <div className="w-20 h-20 rounded-3xl bg-surface-100 flex items-center justify-center mb-5">
                <ShoppingBag className="w-9 h-9 text-surface-400" />
            </div>
            <h3 className="text-xl font-bold text-surface-800 mb-2">
                {hasFilters ? 'Tidak ada listing ditemukan' : 'Belum ada listing'}
            </h3>
            <p className="text-surface-500 text-sm max-w-xs mb-6">
                {hasFilters
                    ? 'Coba ubah filter atau kata kunci pencarian kamu.'
                    : 'Jadilah yang pertama menjual merchandise JKT48!'}
            </p>
            {auth?.user ? (
                <Link
                    href={route('listings.create')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold text-sm shadow-glow-primary hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Jual Sekarang
                </Link>
            ) : (
                <a
                    href={route('google.redirect')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold text-sm shadow-glow-primary hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                    Login & Mulai Jual
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
        <div className="flex items-center justify-center gap-1.5 pt-10">
            <button
                onClick={() => onPage(current_page - 1)}
                disabled={current_page === 1}
                className="w-10 h-10 rounded-xl flex items-center justify-center border border-surface-200 text-surface-600 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Halaman sebelumnya"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {rendered.map((item, i) =>
                item === '...' ? (
                    <span key={`dots-${i}`} className="w-10 h-10 flex items-center justify-center text-surface-400 text-sm">
                        ···
                    </span>
                ) : (
                    <button
                        key={item}
                        onClick={() => onPage(item)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                            item === current_page
                                ? 'gradient-primary text-white shadow-glow-primary'
                                : 'border border-surface-200 text-surface-600 hover:bg-surface-100'
                        }`}
                    >
                        {item}
                    </button>
                ),
            )}

            <button
                onClick={() => onPage(current_page + 1)}
                disabled={current_page === last_page}
                className="w-10 h-10 rounded-xl flex items-center justify-center border border-surface-200 text-surface-600 hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Halaman berikutnya"
            >
                <ChevronRight className="w-4 h-4" />
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

    // Trigger router visit when debounced search changes
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
            <div className="min-h-dvh bg-surface-50 flex flex-col">
                <Navbar auth={auth} />

                {/* Page header */}
                <div className="bg-white border-b border-surface-200 pt-16 sm:pt-[72px]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                            <div className="flex-1">
                                <h1 className="text-2xl sm:text-3xl font-bold font-display text-surface-900 tracking-tight">
                                    Marketplace Merch JKT48
                                </h1>
                                <p className="text-surface-500 text-sm mt-1">
                                    {meta ? `${meta.total.toLocaleString('id-ID')} listing tersedia` : 'Jelajahi merchandise fandom kamu'}
                                </p>
                            </div>
                            {auth?.user && (
                                <Link
                                    href={route('listings.create')}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-white font-semibold text-sm shadow-glow-primary hover:shadow-xl hover:scale-[1.02] transition-all shrink-0"
                                >
                                    <Plus className="w-4 h-4" />
                                    Jual Sekarang
                                </Link>
                            )}
                        </div>

                        {/* Category chips */}
                        <div className="flex gap-2 mt-5 overflow-x-auto pb-1 scrollbar-none">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() =>
                                        handleFilterChange({ ...filters, category: cat.id === 'ALL' ? undefined : cat.id })
                                    }
                                    className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all min-h-[36px] ${
                                        (filters.category || 'ALL') === cat.id
                                            ? 'gradient-primary text-white shadow-sm'
                                            : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex gap-6">
                        {/* Desktop filter sidebar */}
                        <aside className="hidden lg:block w-60 shrink-0 space-y-4">
                            <FilterPanel filters={filters} onChange={handleFilterChange} />
                        </aside>

                        {/* Main content */}
                        <div className="flex-1 min-w-0">
                            {/* Search + Sort bar */}
                            <div className="flex items-center gap-3 mb-6">
                                {/* Search */}
                                <div className="relative flex-1">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
                                    <input
                                        type="search"
                                        value={localSearch}
                                        onChange={(e) => setLocalSearch(e.target.value)}
                                        placeholder="Cari nama member, produk..."
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 bg-white text-sm text-surface-800 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent min-h-[44px]"
                                    />
                                    {localSearch && (
                                        <button
                                            onClick={() => setLocalSearch('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-surface-200 hover:bg-surface-300 transition-colors"
                                            aria-label="Hapus pencarian"
                                        >
                                            <X className="w-3 h-3 text-surface-600" />
                                        </button>
                                    )}
                                </div>

                                {/* Sort */}
                                <select
                                    value={filters.sort || 'latest'}
                                    onChange={(e) => handleFilterChange({ ...filters, sort: e.target.value })}
                                    className="shrink-0 px-3 py-2.5 rounded-xl border border-surface-200 bg-white text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-400 min-h-[44px] cursor-pointer"
                                    aria-label="Urutkan"
                                >
                                    {SORTS.map((s) => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>

                                {/* Mobile filter toggle */}
                                <button
                                    onClick={() => setShowMobileFilter(true)}
                                    className="lg:hidden relative shrink-0 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-surface-200 bg-white text-sm text-surface-700 font-medium hover:bg-surface-50 transition-colors min-h-[44px]"
                                    aria-label="Buka filter"
                                >
                                    <SlidersHorizontal className="w-4 h-4" />
                                    Filter
                                    {activeFilterCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full gradient-primary text-white text-[10px] font-bold flex items-center justify-center">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Active filter tags */}
                            {hasFilters && (
                                <div className="flex flex-wrap gap-2 mb-5">
                                    {debouncedSearch && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-xs font-medium border border-primary-200">
                                            <Search className="w-3 h-3" />
                                            {debouncedSearch}
                                            <button onClick={() => setLocalSearch('')} className="hover:text-primary-900">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    )}
                                    {filters.team && filters.team !== 'ALL' && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-xs font-medium border border-primary-200">
                                            <Tag className="w-3 h-3" />
                                            {TEAMS.find((t) => t.value === filters.team)?.label}
                                            <button
                                                onClick={() => handleFilterChange({ ...filters, team: undefined })}
                                                className="hover:text-primary-900"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    )}
                                    {filters.condition && filters.condition !== 'ALL' && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-xs font-medium border border-primary-200">
                                            {CONDITIONS.find((c) => c.value === filters.condition)?.label}
                                            <button
                                                onClick={() => handleFilterChange({ ...filters, condition: undefined })}
                                                className="hover:text-primary-900"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    )}
                                    <button
                                        onClick={() => {
                                            setLocalSearch('');
                                            setFilters({});
                                            applyFilters({});
                                        }}
                                        className="text-xs text-surface-500 hover:text-surface-700 underline underline-offset-2 transition-colors"
                                    >
                                        Reset semua
                                    </button>
                                </div>
                            )}

                            {/* Product grid */}
                            {isNavigating ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <CardSkeleton key={i} />
                                    ))}
                                </div>
                            ) : items.length === 0 ? (
                                <EmptyState hasFilters={hasFilters} auth={auth} />
                            ) : (
                                <motion.div
                                    className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                                    initial={false}
                                >
                                    <AnimatePresence mode="popLayout">
                                        {items.map((listing, i) => (
                                            <motion.div
                                                key={listing.id}
                                                layout
                                                initial={{ opacity: 0, y: 24 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.3, delay: i * 0.04 }}
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
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
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
