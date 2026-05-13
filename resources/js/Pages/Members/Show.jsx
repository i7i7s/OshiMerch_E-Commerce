import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import ListingCard from '@/Components/ListingCard';
import { TEAM_COLORS } from '@/data/products';
import { ArrowLeft, Calendar, Ruler, Droplets, Sparkles, Heart, MessageCircle, Share2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Utility to proxy images
const proxyPhoto = (url) => {
    if (!url) return null;
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=800&h=1200&fit=cover&output=webp`;
};

const avatarFallback = (name, teamColor) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'M')}&background=${(teamColor?.bg || '#FF1100').replace('#', '')}&color=fff&bold=true&size=512`;

export default function MemberShow({ memberCode, listings, apiUrl }) {
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const containerRef = useRef(null);
    const imageRef = useRef(null);
    const textRef = useRef(null);
    const statsRef = useRef(null);

    // Framer Motion for Parallax Hero
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    useEffect(() => {
        // Fetch specific member detail
        // Wait, the API returns a list of members. We need to fetch all and find the one with matching code.
        const fetchMember = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${apiUrl}/api/members`);
                if (!res.ok) throw new Error('Failed to fetch');
                const json = await res.json();
                const members = json.data || json.members || [];
                const found = members.find(m => m.code === memberCode);
                if (found) {
                    setMember(found);
                } else {
                    setError('Member tidak ditemukan');
                }
            } catch (err) {
                setError('Gagal mengambil data member');
            } finally {
                setLoading(false);
            }
        };

        fetchMember();
    }, [memberCode, apiUrl]);

    // GSAP Animations after member loads
    useEffect(() => {
        if (!loading && member && textRef.current) {
            // Text reveal animation
            gsap.fromTo(
                textRef.current.children,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power4.out", delay: 0.2 }
            );

            // Stats reveal on scroll
            if (statsRef.current) {
                gsap.fromTo(
                    statsRef.current.children,
                    { y: 30, opacity: 0 },
                    {
                        y: 0, 
                        opacity: 1, 
                        duration: 0.8, 
                        stagger: 0.1, 
                        ease: "back.out(1.7)",
                        scrollTrigger: {
                            trigger: statsRef.current,
                            start: "top 80%",
                        }
                    }
                );
            }
        }
    }, [loading, member]);

    if (loading) {
        return (
            <div className="min-h-screen bg-surface-50 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin mb-4" />
                    <p className="text-surface-500 font-medium">Memuat profil oshi...</p>
                </div>
            </div>
        );
    }

    if (error || !member) {
        return (
            <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center text-center px-4">
                <div className="text-6xl mb-4">😢</div>
                <h1 className="text-2xl font-bold text-surface-900 mb-2">Oops!</h1>
                <p className="text-surface-500 mb-6">{error || 'Data member tidak tersedia.'}</p>
                <Link href="/" className="px-6 py-3 rounded-full bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors">
                    Kembali ke Beranda
                </Link>
            </div>
        );
    }

    const teamColor = TEAM_COLORS[member.type] || TEAM_COLORS.TRAINEE;
    const photoUrl = proxyPhoto(member.photo) || avatarFallback(member.nickname || member.name, teamColor);

    return (
        <div ref={containerRef} className="min-h-screen bg-surface-50 overflow-hidden selection:bg-primary-500 selection:text-white">
            <Head title={`${member.nickname || member.name} | OshiMerch`} />
            <Navbar />

            <main>
                {/* Hero Section - Neo-Brutalist */}
                <section className={`relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden border-b-4 border-surface-900 bg-surface-50`}>
                    <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-20" />
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                        <Link href={route('members')} className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-surface-900 text-surface-900 font-black text-sm uppercase tracking-widest shadow-[2px_2px_0_0_#0f172a] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all mb-8 rounded-xl">
                            <ArrowLeft className="w-5 h-5" />
                            Kembali ke Direktori
                        </Link>

                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                            {/* Photo Container */}
                            <div className="w-full lg:w-5/12 max-w-md relative">
                                <motion.div 
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
                                    className="relative bg-white border-4 border-surface-900 p-2 shadow-[12px_12px_0_0_#0f172a] transform -rotate-2 hover:rotate-0 transition-transform"
                                    style={{ backgroundColor: teamColor.bg }}
                                >
                                    <div className="border-4 border-surface-900 aspect-[3/4] overflow-hidden bg-white">
                                        <img
                                            ref={imageRef}
                                            src={photoUrl}
                                            alt={member.name}
                                            className="w-full h-full object-cover object-top"
                                        />
                                    </div>
                                    
                                    <div className="absolute -bottom-6 -right-6">
                                        <div className="px-6 py-3 bg-white border-4 border-surface-900 text-surface-900 font-black text-lg uppercase tracking-widest shadow-[4px_4px_0_0_#0f172a] transform rotate-6">
                                            TEAM {member.type}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Info Container */}
                            <div className="w-full lg:w-7/12" ref={textRef}>
                                <div className="mb-4">
                                    <motion.h1 
                                        className="text-6xl sm:text-8xl font-black font-display uppercase tracking-tighter text-surface-900 leading-[0.9]"
                                        style={{ textShadow: '4px 4px 0px #FEF08A' }}
                                    >
                                        {member.nickname || member.name}
                                    </motion.h1>
                                    <p className="text-2xl sm:text-3xl text-surface-700 font-bold mt-4 uppercase tracking-wide bg-[#FBCFE8] inline-block px-4 py-1 border-2 border-surface-900 shadow-[4px_4px_0_0_#0f172a]">
                                        {member.name}
                                    </p>
                                </div>

                                {/* Jikoshoukai Box */}
                                <div className="mt-12 mb-12">
                                    <div className="bg-[#FEF08A] border-4 border-surface-900 p-6 sm:p-8 rounded-2xl shadow-[8px_8px_0_0_#0f172a] relative">
                                        <div className="absolute -top-6 -left-4 bg-white border-4 border-surface-900 rounded-full w-12 h-12 flex items-center justify-center text-3xl shadow-[4px_4px_0_0_#0f172a]">
                                            ✨
                                        </div>
                                        <p className="text-xl sm:text-2xl font-black uppercase leading-relaxed text-surface-900">
                                            "{member.jikoshoukai}"
                                        </p>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="p-4 bg-[#BAE6FD] border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all flex flex-col items-center text-center">
                                        <Calendar className="w-8 h-8 mb-2 text-surface-900" />
                                        <p className="text-[10px] text-surface-900 font-black uppercase tracking-widest mb-1">Lahir</p>
                                        <p className="font-bold text-surface-900 text-sm leading-tight">{new Date(member.birth_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                    </div>
                                    <div className="p-4 bg-[#FECDD3] border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all flex flex-col items-center text-center">
                                        <Droplets className="w-8 h-8 mb-2 text-surface-900" />
                                        <p className="text-[10px] text-surface-900 font-black uppercase tracking-widest mb-1">Gol Darah</p>
                                        <p className="font-black text-surface-900 text-xl leading-tight">{member.blood_type || '?'}</p>
                                    </div>
                                    <div className="p-4 bg-[#A7F3D0] border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all flex flex-col items-center text-center">
                                        <Ruler className="w-8 h-8 mb-2 text-surface-900" />
                                        <p className="text-[10px] text-surface-900 font-black uppercase tracking-widest mb-1">Tinggi</p>
                                        <p className="font-black text-surface-900 text-xl leading-tight">{member.height}<span className="text-sm">cm</span></p>
                                    </div>
                                    <div className="p-4 bg-[#DDD6FE] border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all flex flex-col items-center text-center">
                                        <Sparkles className="w-8 h-8 mb-2 text-surface-900" />
                                        <p className="text-[10px] text-surface-900 font-black uppercase tracking-widest mb-1">Zodiak</p>
                                        <p className="font-black text-surface-900 text-sm leading-tight uppercase">{member.zodiac}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Merchandise Section */}
                <section className="py-20 bg-white border-b-4 border-surface-900 relative z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <h2 className="text-4xl sm:text-5xl font-black font-display text-surface-900 tracking-tighter uppercase flex items-center gap-4">
                                    Merchandise <div className="p-2 bg-[#FBCFE8] border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a]"><Heart className="w-8 h-8 text-surface-900 fill-surface-900" /></div>
                                </h2>
                                <p className="text-surface-700 font-bold mt-4 text-lg">Koleksi barang-barang yang berkaitan dengan {member.nickname}.</p>
                            </div>
                        </div>

                        {listings.length === 0 ? (
                            <div className="border-4 border-surface-900 bg-[#FAFAFA] py-24 text-center px-4 shadow-[8px_8px_0_0_#0f172a]">
                                <div className="w-20 h-20 bg-[#FEF08A] border-4 border-surface-900 flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0_0_#0f172a] transform -rotate-3">
                                    <span className="text-4xl">🛍️</span>
                                </div>
                                <h3 className="text-3xl font-black uppercase text-surface-900 mb-2">Belum ada merchandise</h3>
                                <p className="text-surface-600 font-bold max-w-md mx-auto">
                                    Jadilah yang pertama untuk menjual photocard atau merchandise {member.nickname} di OshiMerch!
                                </p>
                                <Link href={route('listings.create')} className="mt-8 inline-flex px-8 py-4 bg-primary-400 border-4 border-surface-900 text-surface-900 font-black uppercase tracking-widest hover:bg-[#BAE6FD] transition-colors shadow-[4px_4px_0_0_#0f172a] active:translate-y-1 active:translate-x-1 active:shadow-none">
                                    Mulai Berjualan
                                </Link>
                            </div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
                            >
                                {listings.map(listing => (
                                    <ListingCard key={listing.id} listing={listing} />
                                ))}
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* Social Media Updates (Mockup + Real Link) */}
                {(member.social_media?.instagram || member.social_media?.x || member.social_media?.tiktok) && (
                    <section className="py-20 bg-[#FAFAFA] relative z-20">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                                <div>
                                    <h2 className="text-4xl sm:text-5xl font-black font-display text-surface-900 tracking-tighter uppercase flex items-center gap-4">
                                        Update Terbaru <div className="p-2 bg-[#A7F3D0] border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a]">📱</div>
                                    </h2>
                                    <p className="text-surface-700 font-bold mt-4 text-lg">Gambaran aktivitas keseharian dari {member.nickname}.</p>
                                </div>
                                
                                {/* Tombol ke Profil Asli */}
                                {member.social_media?.x && (
                                    <a 
                                        href={`https://x.com/${member.social_media.x}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex px-6 py-3 bg-surface-900 text-white font-black uppercase tracking-widest border-2 border-transparent hover:border-surface-900 hover:bg-[#FEF08A] hover:text-surface-900 transition-all shadow-[4px_4px_0_0_rgba(15,23,42,0.2)] hover:shadow-[4px_4px_0_0_#0f172a] active:translate-y-1 active:translate-x-1 active:shadow-none"
                                    >
                                        Buka X Asli ↗
                                    </a>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                {[
                                    { platform: 'Instagram', handle: member.social_media.instagram, content: `Halo semuanya! Terima kasih untuk show hari ini, seru banget bisa ketemu kalian semua~ Jangan lupa istirahat ya! 💖✨ #${member.nickname} #JKT48`, time: '2 jam yang lalu', likes: '12.4K', comments: '842', bg: 'bg-[#FBCFE8]' },
                                    { platform: 'X', handle: member.social_media.x, content: `Lagi di jalan pulang nih. Tadi makan sate ayam enak banget 😋 Kalian udah makan malam belum?`, time: '5 jam yang lalu', likes: '8.2K', comments: '1.1K', bg: 'bg-[#BAE6FD]' },
                                    { platform: 'TikTok', handle: member.social_media.tiktok, content: `Dance cover terbaru udah up! Jangan lupa check ya guys 💃🔥`, time: '1 hari yang lalu', likes: '45.1K', comments: '2.3K', bg: 'bg-[#A7F3D0]' },
                                    { platform: 'Instagram', handle: member.social_media.instagram, content: `OOTD hari ini! Gimana menurut kalian cocokan warna cerah apa gelap? 🤔✨`, time: '2 hari yang lalu', likes: '15.6K', comments: '1.2K', bg: 'bg-[#FECDD3]' }
                                ].filter(s => s.handle).slice(0, 3).map((post, i) => (
                                    <motion.a
                                        key={i}
                                        href={post.platform === 'X' ? `https://x.com/${post.handle}` : post.platform === 'TikTok' ? `https://tiktok.com/@${post.handle}` : `https://instagram.com/${post.handle}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`block ${post.bg} border-4 border-surface-900 p-6 shadow-[6px_6px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0_0_#0f172a] transition-all group`}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-white border-2 border-surface-900 p-1 shadow-[2px_2px_0_0_#0f172a]">
                                                    <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-surface-900 uppercase tracking-tight">{member.name}</p>
                                                    <p className="text-xs font-bold text-surface-700 bg-white/50 inline-block px-1 mt-0.5">@{post.handle} • {post.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-surface-900 font-bold text-sm leading-relaxed mb-4 line-clamp-3 bg-white/50 p-2 border-2 border-surface-900">
                                            {post.content}
                                        </p>
                                        <div className="flex items-center gap-4 text-surface-900 font-black text-xs pt-4 border-t-2 border-surface-900">
                                            <div className="flex items-center gap-1.5 bg-white px-2 py-1 border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a]">
                                                <Heart className="w-4 h-4 fill-surface-900" /> {post.likes}
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-white px-2 py-1 border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a]">
                                                <MessageCircle className="w-4 h-4 fill-surface-900" /> {post.comments}
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-surface-900 text-white px-2 py-1 border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a] ml-auto">
                                                <Share2 className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}
