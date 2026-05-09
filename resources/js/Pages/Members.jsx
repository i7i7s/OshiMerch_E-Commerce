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

// ─── Member card (Editorial / Portrait)
const MemberCard = ({ member, index, onClick }) => {
    const team = getTeam(member);
    const gradient = TEAM_GRADIENTS[team] || TEAM_GRADIENTS.DEFAULT;
    const shadowColor = TEAM_COLORS_HEX[team] || TEAM_COLORS_HEX.DEFAULT;
    const name = member.name || member.nickname || 'Member';
    const nickname = member.nickname || name;
    const imgSrc = getPhoto(member) || avatarFallback(name);
    const teamLabel = team === 'JKT48_VIRTUAL' ? 'JKT48V' : team;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.5), ease: "easeOut" }}
            onClick={() => onClick(member)}
            className="group cursor-pointer relative rounded-[2rem] overflow-hidden bg-surface-100 aspect-[3/4] isolate"
        >
            {/* Image */}
            <img
                src={imgSrc}
                alt={name}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 filter grayscale-[20%] group-hover:grayscale-0"
                loading="lazy"
                onError={(e) => { e.target.src = avatarFallback(name); }}
            />
            
            {/* Overlay Gradient (Bottom) */}
            <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90 ${gradient}`} />
            
            {/* Deep Dark Overlay for Text readability */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Hover Glow Effect */}
            <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ boxShadow: `inset 0 0 50px ${shadowColor}80` }}
            />

            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                {/* Top: Team Badge */}
                <div className="flex justify-end">
                    <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white bg-black/40 backdrop-blur-md rounded-full border border-white/20">
                        {teamLabel}
                    </span>
                </div>

                {/* Bottom: Name & Info */}
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-3xl font-display font-black text-white leading-none mb-1 tracking-tight">
                        {nickname}
                    </h3>
                    <p className="text-sm font-medium text-white/70 truncate">
                        {name}
                    </p>
                    
                    {/* Hover indicator line */}
                    <div className="h-1 w-0 group-hover:w-12 bg-white mt-4 transition-all duration-500 ease-out rounded-full" />
                </div>
            </div>
        </motion.div>
    );
};

// ─── Skeleton card
const SkeletonCard = () => (
    <div className="rounded-[2rem] overflow-hidden bg-surface-100 aspect-[3/4] relative">
        <div className="absolute inset-0 bg-surface-200 animate-pulse" />
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="h-8 w-2/3 bg-surface-300 rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-1/2 bg-surface-300 rounded-md animate-pulse" />
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
        <div className="min-h-screen bg-surface-50 selection:bg-purple-500 selection:text-white flex flex-col font-sans">
            <Head title="Members JKT48 — OshiMerch" />
            <Navbar auth={auth} />

            {/* --- ANTI-MAINSTREAM EDITORIAL HERO --- */}
            <div className="relative pt-32 pb-16 px-6 sm:px-12 lg:px-24 overflow-hidden border-b border-surface-200 bg-white">
                {/* Dynamic Gradient Orbs */}
                <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-gradient-to-bl from-purple-400/20 to-pink-400/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
                <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
                
                <div className="max-w-screen-2xl mx-auto relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-surface-950 text-white font-bold text-xs uppercase tracking-widest mb-8"
                    >
                        <UsersSVG className="w-4 h-4 text-purple-400" />
                        Directory JKT48
                    </motion.div>

                    <div className="flex flex-col lg:flex-row gap-12 lg:items-end justify-between">
                        <motion.h1 
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-5xl sm:text-7xl md:text-[7rem] leading-[0.9] font-display font-black uppercase tracking-tighter text-surface-950"
                        >
                            MEET THE<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500">
                                ICONS.
                            </span>
                        </motion.h1>

                        {/* Search Bar (Editorial Style) */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="w-full lg:w-[400px]"
                        >
                            <div className={`relative flex items-center p-2 rounded-2xl transition-all duration-300 bg-surface-50 border-2 ${searchFocused ? 'border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.2)]' : 'border-surface-200'}`}>
                                <div className="p-3 bg-surface-950 text-white rounded-xl">
                                    <SearchSVG className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setSearchFocused(false)}
                                    placeholder="Cari member (cth: Zee, Freya)"
                                    className="w-full pl-4 pr-10 py-3 bg-transparent outline-none text-surface-950 font-bold placeholder-surface-400"
                                />
                                {query && (
                                    <button onClick={() => setQuery('')} className="absolute right-4 text-surface-400 hover:text-surface-950 transition-colors">
                                        <XSVG className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <main className="flex-1 w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 py-16 relative z-20">
                {/* --- FILTERS (Pills) --- */}
                <div className="flex flex-wrap items-center gap-3 mb-16">
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab.value;
                        return (
                            <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                className={`group relative px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 overflow-hidden ${
                                    isActive 
                                        ? 'text-white shadow-lg shadow-purple-500/25 scale-105' 
                                        : 'bg-white text-surface-500 border border-surface-200 hover:border-purple-300 hover:text-surface-950'
                                }`}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 z-0" />
                                )}
                                <div className="relative z-10 flex items-center gap-2">
                                    {tab.label}
                                    {!loading && (
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-surface-100 text-surface-400 group-hover:bg-purple-100 group-hover:text-purple-600'}`}>
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
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-surface-200">
                        <div className="w-24 h-24 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-6">
                            <XSVG className="w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-display font-black text-surface-950 mb-4">SYSTEM ERROR</h3>
                        <p className="text-surface-500 text-lg max-w-md mx-auto mb-8">{error}</p>
                        <button onClick={() => window.location.reload()} className="px-8 py-4 rounded-full bg-surface-950 text-white font-bold uppercase tracking-widest hover:bg-purple-600 transition-colors">
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
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-surface-200">
                        <div className="w-24 h-24 rounded-full bg-surface-100 text-surface-300 flex items-center justify-center mx-auto mb-6">
                            <SearchSVG className="w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-display font-black text-surface-950 mb-4">TARGET NOT FOUND</h3>
                        <p className="text-surface-500 text-lg max-w-md mx-auto mb-8">
                            {debouncedQuery ? `Tidak ada member dengan nama "${debouncedQuery}"` : `Tidak ada member di tim ${activeTab}`}
                        </p>
                        <button onClick={() => { setQuery(''); setActiveTab('Semua'); }} className="px-8 py-4 rounded-full bg-surface-950 text-white font-bold uppercase tracking-widest hover:bg-purple-600 transition-colors">
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
