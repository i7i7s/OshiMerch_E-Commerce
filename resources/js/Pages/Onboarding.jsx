import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// SVG Icons
const SearchIcon = ({ className }) => (
    <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const CheckCircleIcon = ({ className }) => (
    <svg className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ArrowRightIcon = ({ className }) => (
    <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
);

const SparklesIcon = ({ className }) => (
    <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
    </svg>
);

const StarSVG = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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
        <div className="bg-white border-4 border-surface-900 shadow-[6px_6px_0_0_#0f172a] overflow-hidden">
            <div className="aspect-[3/4] bg-surface-200 animate-pulse border-b-4 border-surface-900" />
            <div className="p-4 bg-[#BAE6FD] space-y-3">
                <div className="h-6 w-3/4 bg-surface-400 animate-pulse" />
                <div className="h-4 w-1/2 bg-surface-400 animate-pulse" />
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
        <button
            type="button"
            onClick={() => onSelect(member)}
            className={`group relative text-left w-full border-4 border-surface-900 transition-all duration-200 overflow-hidden ${isSelected
                ? `bg-[#FEF08A] shadow-[8px_8px_0_0_#0f172a] translate-x-[-2px] translate-y-[-2px]`
                : 'bg-white shadow-[4px_4px_0_0_#0f172a] hover:shadow-[6px_6px_0_0_#0f172a] hover:translate-y-[-2px] hover:translate-x-[-2px]'
                }`}
        >
            {/* Selection indicator */}
            {isSelected && (
                <div
                    className="absolute top-2 right-2 z-20 bg-[#F472B6] border-4 border-surface-900 px-3 py-1 text-surface-900 font-black uppercase text-xs tracking-widest shadow-[2px_2px_0_0_#0f172a] transform rotate-3"
                >
                    OSHI TERPILIH
                </div>
            )}

            {/* Team badge */}
            <div className={`absolute top-2 left-2 px-2 py-1 border-2 border-surface-900 ${teamInfo.bg} text-white text-[10px] font-black tracking-widest uppercase shadow-[2px_2px_0_0_#0f172a] z-10 transform -rotate-2`}>
                {teamInfo.label}
            </div>

            {/* Photo */}
            <div className="relative aspect-[3/4] overflow-hidden bg-surface-100 border-b-4 border-surface-900">
                {!imgLoaded && !imgError && (
                    <div className="absolute inset-0 bg-surface-200 animate-pulse" />
                )}
                {imgError ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#FECDD3]">
                        <div className="text-center">
                            <div className="text-5xl mb-2">{teamInfo.emoji}</div>
                            <div className="text-sm font-black text-surface-900 uppercase tracking-widest">{member.nickname}</div>
                        </div>
                    </div>
                ) : (
                    <img
                        src={proxyPhoto(member.photo)}
                        alt={member.name}
                        className={`w-full h-full object-cover object-top transition-transform duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'
                            } ${isSelected ? 'scale-105 grayscale-0' : 'grayscale group-hover:grayscale-0'}`}
                        onLoad={() => setImgLoaded(true)}
                        onError={() => setImgError(true)}
                        loading="lazy"
                    />
                )}
            </div>

            {/* Info */}
            <div className={`p-4 ${isSelected ? 'bg-[#FEF08A]' : 'bg-white group-hover:bg-[#BAE6FD]'} transition-colors`}>
                <h3 className="font-display font-black text-surface-900 text-xl tracking-tight leading-none mb-1 uppercase">
                    {member.nickname || member.name}
                </h3>
                <p className="text-xs font-bold text-surface-600 truncate uppercase tracking-wider">
                    {member.name}
                </p>
            </div>
        </button>
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
            <Head title="Pilih Oshi Kamu — OshiMerch" />

            <div className="min-h-screen bg-[#A7F3D0] text-surface-900 font-sans selection:bg-surface-900 selection:text-[#FEF08A] relative overflow-hidden">

                {/* Decorative Grid Pattern */}
                <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.4] pointer-events-none fixed" />

                {/* Decorative Stars */}
                <StarSVG className="fixed top-24 left-10 w-24 h-24 text-surface-900 opacity-10 transform -rotate-12 pointer-events-none" />
                <StarSVG className="fixed bottom-20 right-10 w-32 h-32 text-surface-900 opacity-10 transform rotate-45 pointer-events-none" />

                {/* Header Navbar */}
                <header className="fixed top-0 inset-x-0 z-50 bg-[#FEF08A] border-b-4 border-surface-900 shadow-[0_6px_0_0_#0f172a]">
                    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                        <div className="flex items-center gap-4 bg-white border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] px-4 py-2 transform -rotate-1">
                            <img src="/images/logo.png" alt="OshiMerch" className="w-8 h-8 object-contain" />
                            <span className="text-xl font-black font-display text-surface-900 tracking-tight uppercase">
                                Oshi<span className="text-[#F472B6]">Merch</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex flex-col items-end mr-2">
                                <span className="text-sm font-black text-surface-900 uppercase">{auth.user.name}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-surface-900 bg-white border-2 border-surface-900 px-2 py-0.5 shadow-[2px_2px_0_0_#0f172a] transform rotate-2">Wota Trainee</span>
                            </div>
                            <img
                                src={auth.user.profile_picture_url || `https://ui-avatars.com/api/?name=${auth.user.name}&background=f43f5e&color=fff`}
                                alt={auth.user.name}
                                className="w-12 h-12 border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] object-cover bg-white"
                            />
                        </div>
                    </div>
                </header>

                <main className="pt-32 pb-32 relative z-10">
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
                                    <div className="inline-block bg-[#F472B6] border-4 border-surface-900 px-3 py-1 mb-4 shadow-[4px_4px_0_0_#0f172a] transform -rotate-2">
                                        <p className="text-surface-900 font-black uppercase tracking-widest text-sm">STEP 01</p>
                                    </div>
                                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-black font-display text-surface-900 uppercase tracking-tighter leading-[0.9] mb-6 drop-shadow-[4px_4px_0_rgba(15,23,42,1)] text-white">
                                        CHOOSE <br /> YOUR <span className="text-[#FEF08A]">OSHI.</span>
                                    </h1>
                                    <div className="bg-white border-4 border-surface-900 p-4 shadow-[6px_6px_0_0_#0f172a] inline-block max-w-2xl transform rotate-1">
                                        <p className="text-lg text-surface-900 font-bold uppercase">
                                            Tentukan tujuan utamamu di fandom ini. Oshi-mu akan menentukan identitas profil OshiMerch kamu.
                                        </p>
                                    </div>
                                </div>

                                {/* Filter & Search - Brutalist Style */}
                                <div className="flex flex-col lg:flex-row gap-6 mb-12 items-start lg:items-center">
                                    <div className="relative w-full lg:w-96 shrink-0">
                                        <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-surface-900" />
                                        <input
                                            type="text"
                                            placeholder="CARI MEMBER IDAMAN..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-14 pr-6 py-4 bg-white border-4 border-surface-900 text-surface-900 font-black uppercase placeholder-surface-400 focus:outline-none focus:ring-0 focus:bg-[#FEF08A] shadow-[6px_6px_0_0_#0f172a] transition-all text-lg"
                                        />
                                    </div>

                                    <div className="flex gap-4 overflow-x-auto pb-4 lg:pb-0 w-full snap-x">
                                        {teams.map((team) => {
                                            const teamInfo = team === 'ALL' ? null : TEAM_COLORS[team];
                                            const isActive = activeTeam === team;
                                            return (
                                                <button
                                                    key={team}
                                                    onClick={() => setActiveTeam(team)}
                                                    className={`shrink-0 px-6 py-4 font-black uppercase tracking-widest transition-all duration-200 border-4 border-surface-900 snap-center ${isActive
                                                        ? 'bg-surface-900 text-white shadow-[4px_4px_0_0_#FEF08A] translate-y-[2px] translate-x-[2px]'
                                                        : 'bg-white text-surface-900 shadow-[4px_4px_0_0_#0f172a] hover:shadow-[6px_6px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:bg-[#BAE6FD]'
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
                                    <div className="text-center py-24 bg-white border-4 border-surface-900 shadow-[12px_12px_0_0_#0f172a]">
                                        <div className="text-6xl mb-4">💔</div>
                                        <h3 className="text-3xl font-black font-display text-surface-900 mb-4 uppercase">Network Error</h3>
                                        <p className="text-surface-900 font-bold mb-8 uppercase text-lg">{error}</p>
                                        <button onClick={() => window.location.reload()} className="px-8 py-4 border-4 border-surface-900 bg-[#FEF08A] text-surface-900 font-black uppercase tracking-widest shadow-[6px_6px_0_0_#0f172a] hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#0f172a] transition-all text-xl">
                                            RELOAD PAGE
                                        </button>
                                    </div>
                                ) : filteredMembers.length === 0 ? (
                                    <div className="text-center py-24 bg-white border-4 border-surface-900 shadow-[12px_12px_0_0_#0f172a]">
                                        <div className="text-6xl mb-4">🔍</div>
                                        <h3 className="text-3xl font-black font-display text-surface-900 mb-4 uppercase">Member Tidak Ditemukan</h3>
                                        <p className="text-surface-900 font-bold uppercase text-lg">Coba gunakan nama panggilan lain.</p>
                                    </div>
                                ) : (
                                    <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-8">
                                        <AnimatePresence>
                                            {filteredMembers.map((member) => (
                                                <motion.div
                                                    key={member.code}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    layout
                                                >
                                                    <MemberCard
                                                        member={member}
                                                        isSelected={data.oshi_member_code === member.code}
                                                        onSelect={handleSelectMember}
                                                    />
                                                </motion.div>
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
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border-4 border-surface-900 font-black uppercase tracking-widest text-surface-900 hover:bg-[#FECDD3] shadow-[4px_4px_0_0_#0f172a] hover:shadow-[6px_6px_0_0_#0f172a] hover:-translate-y-1 transition-all mb-8"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                    </svg>
                                    GANTI OSHI
                                </button>

                                <div className="mb-12">
                                    <div className="inline-block bg-[#BAE6FD] border-4 border-surface-900 px-3 py-1 mb-4 shadow-[4px_4px_0_0_#0f172a] transform rotate-2">
                                        <p className="text-surface-900 font-black uppercase tracking-widest text-sm">STEP 02</p>
                                    </div>
                                    <h1 className="text-5xl sm:text-6xl font-black font-display text-surface-900 uppercase tracking-tighter leading-[0.9] mb-4 drop-shadow-[4px_4px_0_rgba(15,23,42,1)] text-white">
                                        DECLARE <br /> YOUR <span className="text-[#F472B6]">LOYALTY.</span>
                                    </h1>
                                    <div className="bg-white border-4 border-surface-900 p-4 shadow-[6px_6px_0_0_#0f172a] inline-block transform -rotate-1">
                                        <p className="text-lg text-surface-900 font-bold uppercase">
                                            Ceritakan sedikit tentang dirimu dan alasan memilih Oshi ini.
                                        </p>
                                    </div>
                                </div>

                                {/* Wota ID Card Design (Brutalist) */}
                                <div className="bg-[#FEF08A] border-4 border-surface-900 p-6 md:p-10 shadow-[12px_12px_0_0_#0f172a] mb-12 transform rotate-1 relative">
                                    {/* Decorative Pin */}
                                    <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#A7F3D0] border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] rounded-full flex items-center justify-center transform rotate-12 z-20">
                                        <StarSVG className="w-8 h-8 text-surface-900" />
                                    </div>

                                    {selectedMember && (
                                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                            <div className="w-32 h-40 shrink-0 border-4 border-surface-900 bg-white shadow-[6px_6px_0_0_#0f172a] transform -rotate-3 p-2">
                                                <img
                                                    src={proxyPhoto(selectedMember.photo)}
                                                    alt={selectedMember.name}
                                                    className="w-full h-full object-cover border-2 border-surface-900"
                                                />
                                            </div>
                                            <div className="flex-1 text-center md:text-left bg-white border-4 border-surface-900 p-6 shadow-[6px_6px_0_0_#0f172a]">
                                                <div className="inline-block px-3 py-1 bg-surface-900 border-2 border-surface-900 text-sm font-black text-[#FEF08A] uppercase tracking-widest mb-4 shadow-[2px_2px_0_0_#FEF08A] transform -rotate-1">
                                                    OFFICIAL WOTA ID
                                                </div>
                                                <h3 className="text-3xl font-black font-display text-surface-900 mb-2 uppercase tracking-tight">{selectedMember.nickname}</h3>
                                                <p className="text-surface-600 font-black uppercase tracking-widest mb-4">OSHI LEVEL: DEDICATED</p>
                                                {selectedMember.jikoshoukai && (
                                                    <div className="bg-[#BAE6FD] p-3 border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a]">
                                                        <p className="text-surface-900 font-bold uppercase italic">"{selectedMember.jikoshoukai}"</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 md:p-10 border-4 border-surface-900 shadow-[12px_12px_0_0_#0f172a] transform -rotate-1 relative z-10">
                                    <div>
                                        <label className="block text-xl font-black uppercase tracking-widest text-surface-900 mb-4 flex items-center gap-2">
                                            <span className="w-4 h-4 bg-[#F472B6] border-2 border-surface-900 inline-block"></span>
                                            WOTA BIO <span className="text-surface-500 font-bold ml-2">(OPTIONAL)</span>
                                        </label>
                                        <textarea
                                            value={data.bio}
                                            onChange={(e) => setData('bio', e.target.value)}
                                            placeholder="TULIS SEJARAH FANDOM-MU DISINI..."
                                            rows={5}
                                            maxLength={500}
                                            className="w-full px-6 py-5 bg-surface-50 border-4 border-surface-900 text-surface-900 font-bold uppercase placeholder-surface-400 focus:outline-none focus:ring-0 focus:bg-[#FEF08A] shadow-[6px_6px_0_0_#0f172a] transition-all resize-none text-lg"
                                        />
                                        <div className="flex justify-end mt-4">
                                            <span className="text-sm font-black uppercase text-surface-900 bg-[#BAE6FD] px-3 py-1 border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a]">
                                                {data.bio.length}/500
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full flex items-center justify-center gap-3 px-8 py-6 bg-surface-900 text-[#FEF08A] font-black text-2xl tracking-widest uppercase border-4 border-surface-900 shadow-[8px_8px_0_0_#FEF08A] hover:shadow-[12px_12px_0_0_#FEF08A] hover:-translate-y-1 hover:-translate-x-1 transition-all disabled:opacity-50 disabled:transform-none disabled:shadow-[8px_8px_0_0_#FEF08A] mt-8"
                                    >
                                        {processing ? 'SAVING DATA...' : (
                                            <>
                                                <SparklesIcon className="w-8 h-8 text-[#FEF08A]" />
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
                            initial={{ y: 150, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 150, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="fixed bottom-6 inset-x-6 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 z-50 lg:w-[600px]"
                        >
                            <div className="bg-white p-4 border-4 border-surface-900 shadow-[12px_12px_0_0_#0f172a] flex items-center justify-between">
                                <div className="flex items-center gap-4 pl-2 min-w-0">
                                    <div className="w-16 h-16 bg-[#FEF08A] border-4 border-surface-900 shrink-0 p-1 shadow-[4px_4px_0_0_#0f172a] transform -rotate-3">
                                        <img src={proxyPhoto(selectedMember?.photo)} alt="" className="w-full h-full object-cover border-2 border-surface-900" />
                                    </div>
                                    <div className="min-w-0 pl-2">
                                        <p className="text-surface-900 bg-[#FECDD3] inline-block px-2 border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a] text-[10px] font-black uppercase tracking-widest mb-1">OSHI TERPILIH</p>
                                        <p className="text-surface-900 font-black font-display text-2xl uppercase tracking-tight truncate">{selectedMember?.nickname}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        setStep(2);
                                    }}
                                    className="shrink-0 flex items-center gap-2 px-6 py-4 bg-surface-900 text-[#A7F3D0] border-4 border-surface-900 shadow-[4px_4px_0_0_#A7F3D0] font-black uppercase tracking-widest hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0_0_#A7F3D0] transition-all text-xl"
                                >
                                    NEXT <ArrowRightIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
