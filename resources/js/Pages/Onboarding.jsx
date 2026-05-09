import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// SVG Icons
const SearchIcon = ({ className }) => (
    <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const CheckCircleIcon = ({ className }) => (
    <svg className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ArrowRightIcon = ({ className }) => (
    <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
);

const SparklesIcon = ({ className }) => (
    <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
    </svg>
);

const TEAM_COLORS = {
    PASSION: { bg: 'bg-[#FF1100]', text: 'text-[#FF1100]', label: 'PASSION', emoji: '🔥' },
    LOVE: { bg: 'bg-[#ff6393]', text: 'text-[#ff6393]', label: 'LOVE', emoji: '💖' },
    DREAM: { bg: 'bg-[#8b3dff]', text: 'text-[#8b3dff]', label: 'DREAM', emoji: '✨' },
    TRAINEE: { bg: 'bg-[#ffbc20]', text: 'text-[#ffbc20]', label: 'TRAINEE', emoji: '⭐' },
    JKT48_VIRTUAL: { bg: 'bg-[#00d4aa]', text: 'text-[#00d4aa]', label: 'VIRTUAL', emoji: '🌐' },
};

// jkt48.com images are hotlink-protected — proxy through wsrv.nl
const proxyPhoto = (url) => {
    if (!url) return null;
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=400&h=533&fit=cover&output=webp`;
};

// Skeleton loader component
function MemberCardSkeleton() {
    return (
        <div className="rounded-[2rem] bg-white border-2 border-surface-200 overflow-hidden">
            <div className="aspect-[3/4] skeleton" />
            <div className="p-5 space-y-3">
                <div className="h-6 w-3/4 skeleton rounded-lg" />
                <div className="h-4 w-1/2 skeleton rounded-lg" />
            </div>
        </div>
    );
}

// Member card component
function MemberCard({ member, isSelected, onSelect }) {
    const teamInfo = TEAM_COLORS[member.type] || TEAM_COLORS.TRAINEE;
    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);

    return (
        <motion.button
            layout
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => onSelect(member)}
            className={`group relative rounded-[2rem] overflow-hidden text-left w-full border-4 transition-all duration-300 ${
                isSelected
                    ? `border-primary-500 shadow-[0_20px_40px_rgba(244,63,94,0.3)]`
                    : 'border-transparent bg-white shadow-card hover:shadow-xl'
            }`}
        >
            {/* Selection indicator */}
            {isSelected && (
                <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-lg"
                >
                    <CheckCircleIcon className="w-6 h-6 text-white" />
                </motion.div>
            )}

            {/* Photo */}
            <div className="relative aspect-[3/4] overflow-hidden bg-surface-100">
                {!imgLoaded && !imgError && (
                    <div className="absolute inset-0 skeleton" />
                )}
                {imgError ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-surface-100">
                        <div className="text-center">
                            <div className="text-5xl mb-2">{teamInfo.emoji}</div>
                            <div className="text-sm font-bold text-surface-400">{member.nickname}</div>
                        </div>
                    </div>
                ) : (
                    <img
                        src={proxyPhoto(member.photo)}
                        alt={member.name}
                        className={`w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110 ${
                            imgLoaded ? 'opacity-100' : 'opacity-0'
                        } ${isSelected ? '' : 'grayscale group-hover:grayscale-0'}`}
                        onLoad={() => setImgLoaded(true)}
                        onError={() => setImgError(true)}
                        loading="lazy"
                    />
                )}

                {/* Team badge */}
                <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-xl ${teamInfo.bg} text-white text-xs font-black tracking-widest uppercase shadow-md`}>
                    {teamInfo.label}
                </div>

                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-surface-950/90 via-surface-950/20 to-transparent transition-opacity duration-300 ${isSelected ? 'opacity-90' : 'opacity-60 group-hover:opacity-80'}`} />
                
                {/* Info placed over the image */}
                <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <h3 className="font-display font-black text-white text-2xl tracking-tight leading-none mb-1">
                        {member.nickname || member.name}
                    </h3>
                    <p className="text-sm font-medium text-surface-300 truncate">
                        {member.name}
                    </p>
                </div>
            </div>
        </motion.button>
    );
}

export default function Onboarding({ apiUrl }) {
    const { auth } = usePage().props;
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTeam, setActiveTeam] = useState('ALL');
    const [step, setStep] = useState(1); 

    const { data, setData, post, processing, errors } = useForm({
        oshi_member_code: '',
        oshi_member_name: '',
        bio: '',
    });

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${apiUrl}/api/members`);
                if (!res.ok) throw new Error('Failed to fetch');
                const json = await res.json();
                if (json.status && json.data) {
                    setMembers(json.data);
                } else {
                    throw new Error('Invalid API response');
                }
            } catch (err) {
                setError('Gagal memuat data member. Silakan refresh halaman.');
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, [apiUrl]);

    const filteredMembers = useMemo(() => {
        return members.filter((member) => {
            const matchesTeam = activeTeam === 'ALL' || member.type === activeTeam;
            const matchesSearch =
                searchQuery === '' ||
                member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (member.nickname && member.nickname.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesTeam && matchesSearch;
        });
    }, [members, activeTeam, searchQuery]);

    const selectedMember = members.find((m) => m.code === data.oshi_member_code);

    const handleSelectMember = (member) => {
        setData({
            ...data,
            oshi_member_code: member.code,
            oshi_member_name: member.nickname || member.name,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('onboarding.store'));
    };

    const teams = ['ALL', 'PASSION', 'LOVE', 'DREAM', 'TRAINEE', 'JKT48_VIRTUAL'];

    return (
        <>
            <Head title="Pilih Oshi Kamu" />

            <div className="min-h-screen bg-surface-50 font-sans selection:bg-primary-500 selection:text-white">
                
                {/* Header Navbar */}
                <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-surface-200">
                    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src="/images/logo.png" alt="OshiMerch" className="w-10 h-10 object-contain" />
                            <span className="text-2xl font-black font-display text-surface-900 tracking-tight">
                                Oshi<span className="text-primary-500">Merch</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex flex-col items-end mr-2">
                                <span className="text-sm font-bold text-surface-900">{auth.user.name}</span>
                                <span className="text-xs font-medium text-surface-500">Wota Trainee</span>
                            </div>
                            <img
                                src={auth.user.profile_picture_url || `https://ui-avatars.com/api/?name=${auth.user.name}&background=f43f5e&color=fff`}
                                alt={auth.user.name}
                                className="w-10 h-10 rounded-full border-2 border-surface-200"
                            />
                        </div>
                    </div>
                </header>

                <main className="pt-28 pb-32">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div 
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="max-w-7xl mx-auto px-6"
                            >
                                {/* Step 1 Header */}
                                <div className="max-w-3xl mb-12">
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary-500 font-bold uppercase tracking-widest mb-2">Step 01</motion.p>
                                    <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-5xl sm:text-6xl md:text-7xl font-black font-display text-surface-950 uppercase tracking-tighter leading-[0.9] mb-6">
                                        CHOOSE <br/> YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-600">OSHI.</span>
                                    </motion.h1>
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl text-surface-500 font-medium">
                                        Tentukan tujuan utamamu di fandom ini. Oshi-mu akan menentukan identitas profil OshiMerch kamu.
                                    </motion.p>
                                </div>

                                {/* Filter & Search - Brutalist Style */}
                                <div className="flex flex-col lg:flex-row gap-6 mb-12 items-start lg:items-center">
                                    <div className="relative w-full lg:w-96 shrink-0">
                                        <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                                        <input
                                            type="text"
                                            placeholder="Cari member idaman..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border-2 border-surface-200 text-surface-900 font-bold placeholder-surface-400 focus:outline-none focus:border-primary-500 focus:shadow-[4px_4px_0_rgba(244,63,94,0.2)] transition-all"
                                        />
                                    </div>
                                    
                                    <div className="flex gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide w-full">
                                        {teams.map((team) => {
                                            const teamInfo = team === 'ALL' ? null : TEAM_COLORS[team];
                                            const isActive = activeTeam === team;
                                            return (
                                                <button
                                                    key={team}
                                                    onClick={() => setActiveTeam(team)}
                                                    className={`shrink-0 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 border-2 ${
                                                        isActive
                                                            ? team === 'ALL' ? 'gradient-primary border-transparent text-white shadow-lg' : `${teamInfo.bg} border-transparent text-white shadow-lg`
                                                            : 'bg-white border-surface-200 text-surface-500 hover:border-surface-400 hover:text-surface-900'
                                                    }`}
                                                >
                                                    {team === 'ALL' ? 'ALL MEMBERS' : teamInfo?.label || team}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Members Grid */}
                                {loading ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                        {Array.from({ length: 10 }).map((_, i) => <MemberCardSkeleton key={i} />)}
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-24 bg-white rounded-3xl border-2 border-surface-200">
                                        <div className="text-6xl mb-4">💔</div>
                                        <h3 className="text-2xl font-bold font-display text-surface-900 mb-2">Network Error</h3>
                                        <p className="text-surface-500 font-medium mb-6">{error}</p>
                                        <button onClick={() => window.location.reload()} className="px-8 py-3 rounded-xl bg-surface-900 text-white font-bold hover:bg-surface-800 transition-colors">
                                            Reload Page
                                        </button>
                                    </div>
                                ) : filteredMembers.length === 0 ? (
                                    <div className="text-center py-24 bg-white rounded-3xl border-2 border-surface-200">
                                        <div className="text-6xl mb-4">🔍</div>
                                        <h3 className="text-2xl font-bold font-display text-surface-900 mb-2">Member Tidak Ditemukan</h3>
                                        <p className="text-surface-500 font-medium">Coba gunakan nama panggilan lain.</p>
                                    </div>
                                ) : (
                                    <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                        <AnimatePresence>
                                            {filteredMembers.map((member) => (
                                                <MemberCard
                                                    key={member.code}
                                                    member={member}
                                                    isSelected={data.oshi_member_code === member.code}
                                                    onSelect={handleSelectMember}
                                                />
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.4 }}
                                className="max-w-3xl mx-auto px-6"
                            >
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-surface-500 hover:text-surface-900 transition-colors mb-8"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                    </svg>
                                    Ganti Oshi
                                </button>

                                <div className="mb-12">
                                    <p className="text-primary-500 font-bold uppercase tracking-widest mb-2">Step 02</p>
                                    <h1 className="text-5xl sm:text-6xl font-black font-display text-surface-950 uppercase tracking-tighter leading-none mb-4">
                                        DECLARE <br/> YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-600">LOYALTY.</span>
                                    </h1>
                                    <p className="text-lg text-surface-500 font-medium">
                                        Ceritakan sedikit tentang dirimu dan alasan memilih Oshi ini.
                                    </p>
                                </div>

                                {/* Wota ID Card Design */}
                                <div className="relative rounded-[2rem] bg-surface-950 p-1 overflow-hidden shadow-2xl mb-8">
                                    {/* Animated Border/Background */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-purple-500 to-amber-500 opacity-30" />
                                    
                                    <div className="relative bg-surface-900 rounded-[1.8rem] p-8 md:p-10 border border-surface-800">
                                        {selectedMember && (
                                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                                <div className="w-32 h-40 shrink-0 rounded-2xl overflow-hidden border-4 border-surface-800 relative">
                                                    <img
                                                        src={proxyPhoto(selectedMember.photo)}
                                                        alt={selectedMember.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-primary-500 mix-blend-color opacity-20"></div>
                                                </div>
                                                <div className="flex-1 text-center md:text-left">
                                                    <div className="inline-block px-3 py-1 bg-surface-800 rounded-lg text-xs font-black text-white uppercase tracking-widest mb-4">
                                                        OFFICIAL WOTA ID
                                                    </div>
                                                    <h3 className="text-4xl font-black font-display text-white mb-2 uppercase">{selectedMember.nickname}</h3>
                                                    <p className="text-surface-400 font-bold uppercase tracking-widest mb-6">Oshi Level: Dedicated</p>
                                                    {selectedMember.jikoshoukai && (
                                                        <div className="bg-surface-950/50 p-4 rounded-xl border border-surface-800/50">
                                                            <p className="text-surface-300 font-medium italic">"{selectedMember.jikoshoukai}"</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 md:p-10 rounded-[2rem] border-2 border-surface-200 shadow-xl">
                                    <div>
                                        <label className="block text-sm font-black uppercase tracking-widest text-surface-900 mb-4">
                                            Wota Bio <span className="text-surface-400 font-medium">(Optional)</span>
                                        </label>
                                        <textarea
                                            value={data.bio}
                                            onChange={(e) => setData('bio', e.target.value)}
                                            placeholder="Tulis sejarah fandom-mu disini..."
                                            rows={5}
                                            maxLength={500}
                                            className="w-full px-6 py-5 rounded-2xl bg-surface-50 border-2 border-surface-200 text-surface-900 font-medium placeholder-surface-400 focus:outline-none focus:border-primary-500 focus:bg-white focus:shadow-[4px_4px_0_rgba(244,63,94,0.2)] transition-all resize-none text-lg"
                                        />
                                        <div className="flex justify-end mt-3">
                                            <span className="text-sm font-bold text-surface-400 bg-surface-100 px-3 py-1 rounded-lg">
                                                {data.bio.length}/500
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full flex items-center justify-center gap-3 px-8 py-5 rounded-2xl gradient-primary text-white font-black text-xl tracking-wide uppercase shadow-[0_10px_30px_rgba(244,63,94,0.4)] hover:shadow-[0_15px_40px_rgba(244,63,94,0.6)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:transform-none disabled:shadow-none"
                                    >
                                        {processing ? 'SAVING DATA...' : (
                                            <>
                                                <SparklesIcon className="w-6 h-6" />
                                                COMPLETE ONBOARDING
                                            </>
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>

                {/* Floating Bottom Bar (Step 1) */}
                <AnimatePresence>
                    {step === 1 && data.oshi_member_code && (
                        <motion.div 
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="fixed bottom-6 inset-x-6 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 z-50 lg:w-[600px]"
                        >
                            <div className="bg-surface-950 p-4 rounded-3xl shadow-2xl flex items-center justify-between border border-surface-800">
                                <div className="flex items-center gap-4 pl-2 min-w-0">
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border-2 border-surface-800">
                                        <img src={proxyPhoto(selectedMember?.photo)} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-surface-400 text-xs font-bold uppercase tracking-widest mb-0.5">Oshi Terpilih</p>
                                        <p className="text-white font-black font-display text-xl truncate">{selectedMember?.nickname}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        setStep(2);
                                    }}
                                    className="shrink-0 flex items-center gap-2 px-6 py-4 rounded-2xl gradient-primary text-white font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform"
                                >
                                    NEXT <ArrowRightIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
