import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

// ─── Pure SVGs
const SearchSVG = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const XSVG = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const UsersSVG = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);

// ─── Field helpers
const getTeam = (m) => (m.type || m.team || '').toUpperCase();
const avatarFallback = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'M')}&background=8B5CF6&color=fff&bold=true&size=512`;

const proxyPhoto = (url) => {
    if (!url) return null;
    if (url.includes('ui-avatars.com')) return url;
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=600&h=800&fit=cover&output=webp`;
};
const getPhoto = (m) => proxyPhoto(m.photo || m.image || null);

// ─── Team configuration
const TABS = [
    { label: 'Semua Member', value: 'Semua',   apiValue: null },
    { label: 'Team PASSION',    value: 'PASSION',  apiValue: 'PASSION' },
    { label: 'Team LOVE',       value: 'LOVE',     apiValue: 'LOVE' },
    { label: 'Team DREAM',      value: 'DREAM',    apiValue: 'DREAM' },
    { label: 'TRAINEE',    value: 'TRAINEE',  apiValue: 'TRAINEE' },
    { label: 'JKT48V',     value: 'JKT48V',   apiValue: 'JKT48_VIRTUAL' },
];

const TEAM_PRIORITY = {
    'PASSION': 1,
    'LOVE': 2,
    'DREAM': 3,
    'TRAINEE': 4,
    'JKT48_VIRTUAL': 5,
};

const TEAM_GRADIENTS = {
    PASSION: 'from-rose-500 to-pink-600',
    LOVE: 'from-pink-400 to-rose-400',
    DREAM: 'from-amber-300 to-rose-400',
    TRAINEE: 'from-emerald-400 to-teal-500',
    JKT48_VIRTUAL: 'from-indigo-500 to-purple-600',
    DEFAULT: 'from-surface-700 to-surface-900'
};

const TEAM_COLORS_HEX = {
    PASSION: '#e11d48',
    LOVE: '#f472b6',
    DREAM: '#fbbf24',
    TRAINEE: '#34d399',
    JKT48_VIRTUAL: '#6366f1',
    DEFAULT: '#3f3f46'
};

// ─── Member card (Neo-Brutalist)
const MemberCard = ({ member, index, onClick }) => {
    const team = getTeam(member);
    const shadowColor = TEAM_COLORS_HEX[team] || TEAM_COLORS_HEX.DEFAULT;
    const name = member.name || member.nickname || 'Member';
    const nickname = member.nickname || name;
    const imgSrc = getPhoto(member) || avatarFallback(name);
    const teamLabel = team === 'JKT48_VIRTUAL' ? 'JKT48V' : team;

    // Mapping solid background colors for teams to match the neo-brutalist theme
    const bgColors = {
        PASSION: 'bg-[#E11D48]', // Rose
        LOVE: 'bg-[#F472B6]', // Pink
        DREAM: 'bg-[#FACC15]', // Amber/Yellow
        TRAINEE: 'bg-[#10B981]', // Emerald/Mint
        JKT48_VIRTUAL: 'bg-[#6366F1]', // Indigo
        DEFAULT: 'bg-surface-200'
    };
    const teamBg = bgColors[team] || bgColors.DEFAULT;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.5), ease: "easeOut" }}
            onClick={() => onClick(member)}
            className={`group cursor-pointer relative rounded-2xl border-4 border-surface-900 overflow-hidden shadow-[6px_6px_0_0_#0f172a] hover:translate-y-[-4px] hover:translate-x-[-4px] hover:shadow-[10px_10px_0_0_#0f172a] transition-all bg-white flex flex-col`}
        >
            {/* Image Section */}
            <div className="relative aspect-[3/4] overflow-hidden border-b-4 border-surface-900 bg-surface-100">
                <img
                    src={imgSrc}
                    alt={name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => { e.target.src = avatarFallback(name); }}
                />
            </div>

            {/* Info Section - Solid Block */}
            <div className={`p-4 flex-1 flex flex-col justify-between z-10 ${teamBg}`}>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-2xl font-display font-black text-surface-900 leading-none tracking-tight uppercase">
                            {nickname}
                        </h3>
                        <p className="text-xs font-bold text-surface-700 truncate mt-1">
                            {name}
                        </p>
                    </div>
                </div>
                
                {/* Team Badge */}
                <div className="mt-4 inline-flex self-start px-3 py-1 text-[10px] font-black uppercase tracking-widest text-surface-900 bg-white border-2 border-surface-900 rounded-lg shadow-[2px_2px_0_0_#0f172a]">
                    {teamLabel}
                </div>
            </div>
        </motion.div>
    );
};

// ─── Skeleton card
const SkeletonCard = () => (
    <div className="rounded-2xl overflow-hidden bg-white border-4 border-surface-200 aspect-[3/4] relative flex flex-col shadow-[6px_6px_0_0_#e2e8f0]">
        <div className="absolute inset-0 bg-surface-100 animate-pulse" />
        <div className="flex-1 mt-auto bg-surface-50 border-t-4 border-surface-200 p-4 relative z-10 flex flex-col justify-end">
            <div className="h-6 w-2/3 bg-surface-300 rounded-lg animate-pulse mb-2" />
            <div className="h-3 w-1/2 bg-surface-300 rounded-md animate-pulse mb-4" />
            <div className="h-6 w-1/3 bg-surface-300 rounded-lg animate-pulse" />
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
        let result = [...allMembers];

        // Sort by team priority first, then by name
        result.sort((a, b) => {
            const pA = TEAM_PRIORITY[getTeam(a)] || 99;
            const pB = TEAM_PRIORITY[getTeam(b)] || 99;
            if (pA !== pB) return pA - pB;
            return (a.name || '').localeCompare(b.name || '');
        });

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

    // Background colors for active tabs
    const activeTabColors = {
        'Semua': 'bg-white',
        'PASSION': 'bg-[#FECDD3]',
        'LOVE': 'bg-[#FBCFE8]',
        'DREAM': 'bg-[#FEF08A]',
        'TRAINEE': 'bg-[#A7F3D0]',
        'JKT48V': 'bg-[#C7D2FE]'
    };

    return (
        <div className="min-h-screen bg-surface-50 selection:bg-surface-900 selection:text-[#FEF08A] flex flex-col font-sans">
            <Head title="Members JKT48 — OshiMerch" />
            <Navbar auth={auth} />

            {/* --- ANTI-MAINSTREAM BRUTALIST HERO --- */}
            <div className="relative pt-32 pb-16 px-6 sm:px-12 lg:px-24 bg-primary-400 border-b-4 border-surface-900">
                {/* Decorative Grid Pattern */}
                <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.2]" />
                
                <div className="max-w-screen-2xl mx-auto relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-3 px-4 py-2 bg-white border-2 border-surface-900 text-surface-900 font-black text-xs uppercase tracking-widest mb-8 shadow-[2px_2px_0_0_#0f172a] rounded-xl"
                    >
                        <UsersSVG className="w-4 h-4 text-surface-900" />
                        Directory JKT48
                    </motion.div>

                    <div className="flex flex-col lg:flex-row gap-8 lg:items-end justify-between">
                        <motion.h1 
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-6xl sm:text-7xl md:text-[8rem] leading-[0.9] font-display font-black uppercase tracking-tighter text-white"
                            style={{ WebkitTextStroke: '3px #0f172a', textShadow: '6px 6px 0 #0f172a' }}
                        >
                            MEET THE<br/>
                            ICONS.
                        </motion.h1>

                        {/* Search Bar (Block Style) */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="w-full lg:w-[450px]"
                        >
                            <div className={`relative flex items-center p-2 rounded-2xl bg-white border-4 border-surface-900 transition-all duration-300 ${searchFocused ? 'shadow-[8px_8px_0_0_#0f172a] -translate-y-1 -translate-x-1' : 'shadow-[4px_4px_0_0_#0f172a]'}`}>
                                <div className="p-3 bg-[#FEF08A] border-2 border-surface-900 text-surface-900 rounded-xl shadow-[2px_2px_0_0_#0f172a]">
                                    <SearchSVG className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setSearchFocused(false)}
                                    placeholder="Cari member (cth: Kathrina, Freya)"
                                    className="w-full pl-4 pr-10 py-3 bg-transparent outline-none text-surface-900 font-bold placeholder-surface-400"
                                />
                                {query && (
                                    <button onClick={() => setQuery('')} className="absolute right-4 p-1 rounded-lg bg-surface-200 border-2 border-surface-900 hover:bg-[#FBCFE8] hover:shadow-[2px_2px_0_0_#0f172a] transition-all">
                                        <XSVG className="w-4 h-4 text-surface-900" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <main className="flex-1 w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 py-16 relative z-20">
                {/* --- FILTERS (Block Tabs) --- */}
                <div className="flex flex-wrap items-center gap-3 mb-16">
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab.value;
                        const activeBg = activeTabColors[tab.value] || 'bg-white';
                        
                        return (
                            <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                className={`group relative px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest border-2 border-surface-900 transition-all duration-300 ${
                                    isActive 
                                        ? `${activeBg} text-surface-900 shadow-[4px_4px_0_0_#0f172a] translate-y-[-2px] translate-x-[-2px]` 
                                        : 'bg-surface-50 text-surface-600 hover:bg-white hover:text-surface-900 hover:shadow-[4px_4px_0_0_#0f172a] hover:translate-y-[-2px] hover:translate-x-[-2px]'
                                }`}
                            >
                                <div className="relative z-10 flex items-center gap-2">
                                    {tab.label}
                                    {!loading && (
                                        <span className={`px-2 py-0.5 border-2 border-surface-900 rounded-lg text-[10px] font-black ${isActive ? 'bg-surface-900 text-white' : 'bg-surface-200 text-surface-600'}`}>
                                            {teamCount[tab.value] ?? allMembers.length}
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* --- CONTENT --- */}
                
                {/* Error */}
                {error && (
                    <div className="text-center py-32 bg-[#FECDD3] border-4 border-surface-900 rounded-3xl shadow-[8px_8px_0_0_#0f172a]">
                        <div className="w-24 h-24 rounded-2xl bg-white border-4 border-surface-900 text-surface-900 flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0_0_#0f172a]">
                            <XSVG className="w-10 h-10" />
                        </div>
                        <h3 className="text-4xl font-display font-black text-surface-900 mb-4 uppercase">SYSTEM ERROR</h3>
                        <p className="text-surface-800 font-bold text-lg max-w-md mx-auto mb-8">{error}</p>
                        <button onClick={() => window.location.reload()} className="px-8 py-4 rounded-xl bg-surface-900 text-white font-black uppercase tracking-widest hover:bg-surface-800 transition-colors shadow-[4px_4px_0_0_#f43f5e] active:translate-y-1 active:translate-x-1 active:shadow-none">
                            REBOOT SYSTEM
                        </button>
                    </div>
                )}

                {/* Loading Skeleton */}
                {loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
                        {Array.from({ length: 15 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filtered.length === 0 && (
                    <div className="text-center py-32 bg-white border-4 border-surface-900 rounded-3xl shadow-[8px_8px_0_0_#0f172a]">
                        <div className="w-24 h-24 rounded-2xl bg-surface-100 border-4 border-surface-900 text-surface-900 flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0_0_#0f172a]">
                            <SearchSVG className="w-10 h-10" />
                        </div>
                        <h3 className="text-4xl font-display font-black text-surface-900 mb-4 uppercase">TARGET NOT FOUND</h3>
                        <p className="text-surface-600 font-bold text-lg max-w-md mx-auto mb-8">
                            {debouncedQuery ? `Tidak ada member dengan nama "${debouncedQuery}"` : `Tidak ada member di tim ${activeTab}`}
                        </p>
                        <button onClick={() => { setQuery(''); setActiveTab('Semua'); }} className="px-8 py-4 rounded-xl bg-surface-900 text-white font-black uppercase tracking-widest hover:bg-[#BAE6FD] hover:text-surface-900 transition-colors shadow-[4px_4px_0_0_#0f172a] active:translate-y-1 active:translate-x-1 active:shadow-none border-2 border-transparent hover:border-surface-900">
                            RESET FILTERS
                        </button>
                    </div>
                )}

                {/* Grid */}
                {!loading && !error && filtered.length > 0 && (
                    <motion.div 
                        layout
                        className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8"
                    >
                        <AnimatePresence>
                            {filtered.map((member, i) => (
                                <MemberCard
                                    key={member.code || member.id || i}
                                    member={member}
                                    index={i}
                                    onClick={(member) => router.visit(route('members.show', member.code))}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </main>

            <Footer />
        </div>
    );
}
