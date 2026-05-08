import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Users, Calendar, Droplets, Ruler } from 'lucide-react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

// ─── Debounce hook
function useDebounce(value, delay) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

// ─── Field helpers — API returns `type` and `photo`, not `team`/`image`
const getTeam = (m) => (m.type || m.team || '').toUpperCase();
const avatarFallback = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'M')}&background=ff2d6f&color=fff&bold=true&size=256`;

// jkt48.com images are hotlink-protected — proxy through wsrv.nl so the
// request originates server-side (no referrer) and always succeeds.
const proxyPhoto = (url) => {
    if (!url) return null;
    if (url.includes('ui-avatars.com')) return url;
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=256&h=256&fit=cover&output=webp`;
};
const getPhoto = (m) => proxyPhoto(m.photo || m.image || null);

// ─── Team tabs
const TABS = [
    { label: 'All Member', value: 'Semua',   apiValue: null },
    { label: 'PASSION',    value: 'PASSION',  apiValue: 'PASSION' },
    { label: 'LOVE',       value: 'LOVE',     apiValue: 'LOVE' },
    { label: 'DREAM',      value: 'DREAM',    apiValue: 'DREAM' },
    { label: 'TRAINEE',    value: 'TRAINEE',  apiValue: 'TRAINEE' },
    { label: 'JKT48V',     value: 'JKT48V',   apiValue: 'JKT48_VIRTUAL' },
];

const teamStyle = {
    PASSION: { badge: 'bg-team-passion/10 text-team-passion border-team-passion/30', dot: 'bg-team-passion' },
    LOVE:    { badge: 'bg-team-love/10 text-team-love border-team-love/30',          dot: 'bg-team-love' },
    DREAM:   { badge: 'bg-team-dream/10 text-team-dream border-team-dream/30',       dot: 'bg-team-dream' },
    TRAINEE: { badge: 'bg-team-trainee/10 text-team-trainee border-team-trainee/30', dot: 'bg-team-trainee' },
    JKT48_VIRTUAL: { badge: 'bg-team-virtual/10 text-team-virtual border-team-virtual/30', dot: 'bg-team-virtual' },
};

const tabActiveClass = {
    Semua:   'bg-surface-900 text-white',
    PASSION: 'bg-team-passion text-white',
    LOVE:    'bg-team-love text-white',
    DREAM:   'bg-team-dream text-white',
    TRAINEE: 'bg-team-trainee text-white',
    JKT48V:  'bg-team-virtual text-white',
};

const zodiacEmoji = {
    Capricorn: '♑', Aquarius: '♒', Pisces: '♓', Aries: '♈',
    Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌',
    Virgo: '♍', Libra: '♎', Scorpio: '♏', Sagittarius: '♐',
};

// ─── Inline social media icons
const IgIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
);
const TwitterXIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
);
const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z"/>
    </svg>
);



// ─── Member card
const MemberCard = ({ member, index, onClick }) => {
    const team = getTeam(member);
    const style = teamStyle[team] || teamStyle.PASSION;
    const name = member.name || member.nickname || 'Member';
    const imgSrc = getPhoto(member) || avatarFallback(name);
    const teamLabel = team === 'JKT48_VIRTUAL' ? 'JKT48V' : team;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: Math.min(index * 0.025, 0.5) }}
            onClick={() => onClick(member)}
            className="group cursor-pointer bg-white rounded-2xl border border-surface-200 overflow-hidden hover:border-primary-200 hover:shadow-card-hover transition-shadow duration-300 hover:-translate-y-1"
        >
            <div className="relative overflow-hidden aspect-square bg-surface-100">
                <img
                    src={imgSrc}
                    alt={name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    width={256}
                    height={256}
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.target.src = avatarFallback(name); }}
                />
                <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-sm ${style.badge}`}>
                    {teamLabel}
                </span>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">Lihat Detail</span>
                </div>
            </div>
            <div className="p-3.5">
                <h3 className="text-sm font-bold text-surface-900 truncate mb-0.5">{name}</h3>
                {member.nickname && member.nickname !== name && (
                    <p className="text-xs text-surface-400 truncate mb-1">"{member.nickname}"</p>
                )}
                <div className="flex items-center gap-1.5 mt-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot}`} />
                    <span className="text-xs text-surface-500">{teamLabel}</span>
                </div>
            </div>
        </motion.div>
    );
};

// ─── Skeleton card
const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
        <div className="aspect-square skeleton" />
        <div className="p-3.5 space-y-2">
            <div className="h-4 skeleton rounded-full w-3/4" />
            <div className="h-3 skeleton rounded-full w-1/2" />
            <div className="h-3 skeleton rounded-full w-1/3 mt-2" />
        </div>
    </div>
);

export default function Members({ auth }) {
    const [allMembers, setAllMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState('Semua');
    const [searchFocused, setSearchFocused] = useState(false);

    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        fetch('https://jkt-48-member-api-i7i7.vercel.app/api/members')
            .then((r) => {
                if (!r.ok) throw new Error('Gagal memuat data member');
                return r.json();
            })
            .then((data) => {
                const arr = Array.isArray(data) ? data : data.members || data.data || [];
                setAllMembers(arr);
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        const tab = TABS.find((t) => t.value === activeTab);
        let result = allMembers;
        if (tab?.apiValue) {
            result = result.filter((m) => getTeam(m) === tab.apiValue);
        }
        if (debouncedQuery.trim()) {
            const q = debouncedQuery.toLowerCase();
            result = result.filter(
                (m) =>
                    (m.name || '').toLowerCase().includes(q) ||
                    (m.nickname || '').toLowerCase().includes(q)
            );
        }
        return result;
    }, [allMembers, activeTab, debouncedQuery]);

    const teamCount = useMemo(() => {
        const counts = { Semua: allMembers.length };
        TABS.slice(1).forEach((t) => {
            counts[t.value] = allMembers.filter((m) => getTeam(m) === t.apiValue).length;
        });
        return counts;
    }, [allMembers]);

    return (
        <>
            <Head title="Members JKT48 — OshiMerch" />
            <div className="min-h-dvh bg-surface-50 flex flex-col">
                <Navbar auth={auth} />

                {/* Page Header */}
                <div className="relative bg-white border-b border-surface-200 overflow-hidden pt-16 sm:pt-[72px]">
                    <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary-100/40 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-8 left-1/4 w-48 h-48 bg-secondary-100/30 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center shadow-sm">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-primary-600 bg-primary-50 border border-primary-200 px-3 py-1 rounded-full">
                                JKT48 Member API
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold font-display text-surface-900 mb-3">
                            Members <span className="gradient-text">JKT48</span>
                        </h1>
                        <p className="text-surface-500 max-w-lg leading-relaxed">
                            Temukan member favoritmu dari {allMembers.length > 0 ? `${allMembers.length}+` : '63+'} member aktif JKT48.
                        </p>
                    </div>
                </div>

                <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                    {/* Search + Filter Bar */}
                    <div className="sticky top-16 z-30 bg-surface-50/95 backdrop-blur-lg py-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 border-b border-surface-200 mb-8">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <div className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 bg-white flex-1 max-w-md ${searchFocused ? 'border-primary-400 ring-2 ring-primary-100' : 'border-surface-200 hover:border-surface-300'}`}>
                                <Search className="w-4 h-4 text-surface-400 flex-shrink-0" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setSearchFocused(false)}
                                    placeholder="Cari nama member..."
                                    className="w-full text-sm bg-transparent outline-none text-surface-900 placeholder-surface-400"
                                    aria-label="Cari member"
                                />
                                {query && (
                                    <button onClick={() => setQuery('')} className="flex-shrink-0 text-surface-400 hover:text-surface-600 transition-colors" aria-label="Hapus pencarian">
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            {!loading && (
                                <p className="text-sm text-surface-500 flex-shrink-0">
                                    <span className="font-semibold text-surface-800">{filtered.length}</span> member ditemukan
                                </p>
                            )}
                        </div>

                        {/* Team tabs */}
                        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.value}
                                    onClick={() => setActiveTab(tab.value)}
                                    className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                        activeTab === tab.value
                                            ? (tabActiveClass[tab.value] || 'bg-surface-900 text-white')
                                            : 'bg-white border border-surface-200 text-surface-600 hover:border-surface-300 hover:text-surface-800'
                                    }`}
                                    aria-pressed={activeTab === tab.value}
                                >
                                    {tab.label}
                                    {!loading && (
                                        <span className={`text-xs tabular-nums ${activeTab === tab.value ? 'text-white/70' : 'text-surface-400'}`}>
                                            {teamCount[tab.value] ?? allMembers.length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
                                <X className="w-8 h-8 text-red-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-surface-800 mb-2">Gagal Memuat Data</h3>
                            <p className="text-surface-500 mb-6">{error}</p>
                            <button onClick={() => window.location.reload()} className="px-6 py-2.5 rounded-xl gradient-primary text-white font-semibold text-sm">
                                Coba Lagi
                            </button>
                        </div>
                    )}

                    {/* Loading skeleton */}
                    {loading && !error && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {Array.from({ length: 18 }).map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && !error && filtered.length === 0 && (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 rounded-2xl bg-surface-100 border border-surface-200 flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-surface-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-surface-800 mb-2">Tidak Ada Member</h3>
                            <p className="text-surface-500 mb-6">
                                {debouncedQuery ? `Tidak ada member dengan nama "${debouncedQuery}"` : `Tidak ada member di tim ${activeTab}`}
                            </p>
                            <button onClick={() => { setQuery(''); setActiveTab('Semua'); }} className="px-6 py-2.5 rounded-xl bg-surface-100 text-surface-700 font-semibold text-sm hover:bg-surface-200 transition-colors">
                                Reset Filter
                            </button>
                        </div>
                    )}

                    {/* Members grid */}
                    {!loading && !error && filtered.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {filtered.map((member, i) => (
                                <MemberCard
                                    key={member.code || member.id || i}
                                    member={member}
                                    index={i}
                                    onClick={(member) => router.visit(route('members.show', member.code))}
                                />
                            ))}
                        </div>
                    )}
                </main>

                <Footer />
            </div>

        </>
    );
}
