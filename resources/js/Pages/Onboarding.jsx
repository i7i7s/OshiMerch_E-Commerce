import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';

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
    PASSION: { bg: 'bg-team-passion', ring: 'ring-team-passion', text: 'text-team-passion', label: 'PASSION', emoji: '🔥' },
    LOVE: { bg: 'bg-team-love', ring: 'ring-team-love', text: 'text-team-love', label: 'LOVE', emoji: '💖' },
    DREAM: { bg: 'bg-team-dream', ring: 'ring-team-dream', text: 'text-team-dream', label: 'DREAM', emoji: '✨' },
    TRAINEE: { bg: 'bg-team-trainee', ring: 'ring-team-trainee', text: 'text-team-trainee', label: 'TRAINEE', emoji: '⭐' },
    JKT48_VIRTUAL: { bg: 'bg-team-virtual', ring: 'ring-team-virtual', text: 'text-team-virtual', label: 'VIRTUAL', emoji: '🌐' },
};

// Skeleton loader component
function MemberCardSkeleton() {
    return (
        <div className="rounded-2xl bg-white border border-surface-200 overflow-hidden">
            <div className="aspect-[3/4] skeleton" />
            <div className="p-4 space-y-2">
                <div className="h-5 w-3/4 skeleton rounded-lg" />
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
        <button
            type="button"
            onClick={() => onSelect(member)}
            className={`group relative rounded-2xl bg-white border-2 overflow-hidden text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                isSelected
                    ? `border-primary-500 shadow-glow-primary scale-[1.02]`
                    : 'border-surface-200 hover:border-primary-200'
            }`}
            aria-label={`Pilih ${member.nickname || member.name} sebagai Oshi`}
            aria-pressed={isSelected}
        >
            {/* Selection indicator */}
            {isSelected && (
                <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full gradient-primary flex items-center justify-center shadow-lg animate-scale-in">
                    <CheckCircleIcon className="w-5 h-5 text-white" />
                </div>
            )}

            {/* Photo */}
            <div className="relative aspect-[3/4] overflow-hidden bg-surface-100">
                {!imgLoaded && !imgError && (
                    <div className="absolute inset-0 skeleton" />
                )}
                {imgError ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-surface-100">
                        <div className="text-center">
                            <div className="text-4xl mb-1">{teamInfo.emoji}</div>
                            <div className="text-xs text-surface-400">{member.nickname}</div>
                        </div>
                    </div>
                ) : (
                    <img
                        src={member.photo}
                        alt={member.name}
                        className={`w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-105 ${
                            imgLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => setImgLoaded(true)}
                        onError={() => setImgError(true)}
                        loading="lazy"
                    />
                )}

                {/* Team badge */}
                <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg ${teamInfo.bg} text-white text-xs font-bold tracking-wider shadow-md`}>
                    {teamInfo.label}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="font-bold text-surface-900 text-base leading-tight group-hover:text-primary-600 transition-colors">
                    {member.nickname || member.name}
                </h3>
                <p className="text-sm text-surface-500 mt-0.5 truncate">
                    {member.name}
                </p>
                {member.jikoshoukai && (
                    <p className="text-xs text-surface-400 mt-2 line-clamp-2 italic leading-relaxed">
                        "{member.jikoshoukai}"
                    </p>
                )}
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
    const [step, setStep] = useState(1); // 1 = select oshi, 2 = write bio

    const { data, setData, post, processing, errors } = useForm({
        oshi_member_code: '',
        oshi_member_name: '',
        bio: '',
    });

    // Fetch members from JKT48 API
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
                console.error('API Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [apiUrl]);

    // Filter members
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

    // Get selected member info
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

            <div className="min-h-screen bg-surface-50">
                {/* Decorative Background */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 -left-20 w-72 h-72 bg-secondary-200/15 rounded-full blur-3xl" />
                </div>

                {/* Header */}
                <header className="relative z-10 border-b border-surface-200 bg-white/80 backdrop-blur-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">O</span>
                                </div>
                                <span className="text-lg font-bold font-display text-surface-900">
                                    Oshi<span className="gradient-text">Merch</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <img
                                    src={auth.user.profile_picture_url || `https://ui-avatars.com/api/?name=${auth.user.name}&background=ff2d6f&color=fff`}
                                    alt={auth.user.name}
                                    className="w-8 h-8 rounded-full border-2 border-primary-200"
                                />
                                <span className="text-sm font-medium text-surface-700 hidden sm:block">{auth.user.name}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Progress Steps */}
                <div className="relative z-10 bg-white border-b border-surface-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-center gap-3">
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                step === 1 ? 'bg-primary-50 text-primary-700 border border-primary-200' : 'bg-surface-100 text-surface-500'
                            }`}>
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    step === 1 ? 'gradient-primary text-white' : data.oshi_member_code ? 'bg-green-500 text-white' : 'bg-surface-300 text-white'
                                }`}>
                                    {data.oshi_member_code && step !== 1 ? '✓' : '1'}
                                </span>
                                Pilih Oshi
                            </div>
                            <div className="w-8 h-px bg-surface-300" />
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                step === 2 ? 'bg-primary-50 text-primary-700 border border-primary-200' : 'bg-surface-100 text-surface-500'
                            }`}>
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    step === 2 ? 'gradient-primary text-white' : 'bg-surface-300 text-white'
                                }`}>2</span>
                                Profil Bio
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {step === 1 ? (
                        <>
                            {/* Step 1: Select Oshi */}
                            <div className="text-center mb-8">
                                <h1 className="text-3xl sm:text-4xl font-bold font-display text-surface-900 tracking-tight mb-3">
                                    Siapa <span className="gradient-text">Oshi</span> Kamu? 💕
                                </h1>
                                <p className="text-surface-500 text-lg max-w-xl mx-auto">
                                    Pilih member JKT48 favoritmu untuk membangun identitas fandom di OshiMerch.
                                </p>
                            </div>

                            {/* Search & Filter */}
                            <div className="sticky top-0 z-20 bg-surface-50/95 backdrop-blur-lg pb-4 pt-2 -mt-2">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* Search */}
                                    <div className="relative flex-1">
                                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                                        <input
                                            type="text"
                                            placeholder="Cari member..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-surface-200 text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                                            id="member-search"
                                            aria-label="Cari member JKT48"
                                        />
                                    </div>

                                    {/* Team Filter */}
                                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                        {teams.map((team) => {
                                            const teamInfo = team === 'ALL' ? null : TEAM_COLORS[team];
                                            return (
                                                <button
                                                    key={team}
                                                    type="button"
                                                    onClick={() => setActiveTeam(team)}
                                                    className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                                        activeTeam === team
                                                            ? team === 'ALL'
                                                                ? 'gradient-primary text-white shadow-md'
                                                                : `${teamInfo.bg} text-white shadow-md`
                                                            : 'bg-white border border-surface-200 text-surface-600 hover:bg-surface-50 hover:border-surface-300'
                                                    }`}
                                                    aria-pressed={activeTeam === team}
                                                >
                                                    {team === 'ALL' ? 'Semua' : teamInfo?.label || team}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Member Grid */}
                            {loading ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <MemberCardSkeleton key={i} />
                                    ))}
                                </div>
                            ) : error ? (
                                <div className="text-center py-20">
                                    <div className="text-5xl mb-4">😢</div>
                                    <h3 className="text-lg font-semibold text-surface-900 mb-2">Oops!</h3>
                                    <p className="text-surface-500 mb-4">{error}</p>
                                    <button
                                        type="button"
                                        onClick={() => window.location.reload()}
                                        className="px-6 py-2.5 rounded-xl gradient-primary text-white font-medium text-sm hover:shadow-md transition-all"
                                    >
                                        Coba Lagi
                                    </button>
                                </div>
                            ) : filteredMembers.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="text-5xl mb-4">🔍</div>
                                    <h3 className="text-lg font-semibold text-surface-900 mb-2">Tidak ditemukan</h3>
                                    <p className="text-surface-500">
                                        Tidak ada member yang cocok dengan pencarian "{searchQuery}".
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {filteredMembers.map((member) => (
                                        <MemberCard
                                            key={member.code}
                                            member={member}
                                            isSelected={data.oshi_member_code === member.code}
                                            onSelect={handleSelectMember}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Fixed Bottom Bar */}
                            {data.oshi_member_code && (
                                <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-lg border-t border-surface-200 p-4 animate-slide-up">
                                    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            {selectedMember && (
                                                <>
                                                    <img
                                                        src={selectedMember.photo}
                                                        alt={selectedMember.name}
                                                        className="w-12 h-12 rounded-xl object-cover object-top border-2 border-primary-200 shrink-0"
                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-surface-900 truncate">
                                                            {selectedMember.nickname || selectedMember.name}
                                                        </p>
                                                        <p className="text-xs text-surface-500 truncate">
                                                            Tim {TEAM_COLORS[selectedMember.type]?.label || selectedMember.type}
                                                        </p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold text-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]"
                                        >
                                            Lanjut
                                            <ArrowRightIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Step 2: Bio */}
                            <div className="max-w-2xl mx-auto">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 transition-colors mb-6"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                    </svg>
                                    Kembali pilih Oshi
                                </button>

                                <div className="text-center mb-10">
                                    <h1 className="text-3xl sm:text-4xl font-bold font-display text-surface-900 tracking-tight mb-3">
                                        Lengkapi <span className="gradient-text">Profilmu</span> ✍️
                                    </h1>
                                    <p className="text-surface-500 text-lg">
                                        Ceritakan sedikit tentang dirimu sebagai fans JKT48.
                                    </p>
                                </div>

                                {/* Selected Oshi Card */}
                                {selectedMember && (
                                    <div className="mb-8 p-6 rounded-2xl bg-white border border-surface-200 shadow-card">
                                        <div className="flex items-start gap-4">
                                            <img
                                                src={selectedMember.photo}
                                                alt={selectedMember.name}
                                                className="w-20 h-20 rounded-2xl object-cover object-top border-2 border-primary-200 shrink-0"
                                                onError={(e) => {
                                                    e.target.src = `https://ui-avatars.com/api/?name=${selectedMember.nickname}&background=ff2d6f&color=fff&size=80`;
                                                }}
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-xl font-bold text-surface-900">{selectedMember.nickname}</h3>
                                                    <span className={`px-2 py-0.5 rounded-md ${TEAM_COLORS[selectedMember.type]?.bg || 'bg-surface-500'} text-white text-xs font-bold`}>
                                                        {TEAM_COLORS[selectedMember.type]?.label || selectedMember.type}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-surface-500">{selectedMember.name}</p>
                                                {selectedMember.jikoshoukai && (
                                                    <p className="text-sm text-surface-400 italic mt-2">
                                                        "{selectedMember.jikoshoukai}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Bio Form */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="bio" className="block text-sm font-semibold text-surface-700 mb-2">
                                            Bio singkat <span className="text-surface-400 font-normal">(opsional)</span>
                                        </label>
                                        <textarea
                                            id="bio"
                                            value={data.bio}
                                            onChange={(e) => setData('bio', e.target.value)}
                                            placeholder="Ceritakan tentang kamu, sejak kapan suka JKT48, kenapa oshi kamu ini..."
                                            rows={4}
                                            maxLength={500}
                                            className="w-full px-4 py-3 rounded-xl bg-white border border-surface-200 text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm resize-none leading-relaxed"
                                        />
                                        <div className="flex items-center justify-between mt-2">
                                            {errors.bio && (
                                                <p className="text-sm text-red-500">{errors.bio}</p>
                                            )}
                                            <p className="text-xs text-surface-400 ml-auto">
                                                {data.bio.length}/500
                                            </p>
                                        </div>
                                    </div>

                                    {errors.oshi_member_code && (
                                        <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{errors.oshi_member_code}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={processing || !data.oshi_member_code}
                                        className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl gradient-primary text-white font-bold text-lg shadow-glow-primary hover:shadow-xl hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 active:scale-[0.99]"
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <SparklesIcon className="w-5 h-5" />
                                                Mulai Petualangan!
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </main>

                {/* Spacer for fixed bottom bar */}
                {step === 1 && data.oshi_member_code && <div className="h-24" />}
            </div>
        </>
    );
}
