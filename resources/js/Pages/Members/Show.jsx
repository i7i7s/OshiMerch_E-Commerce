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
                {/* Hero Section - Anti Mainstream Glassmorphism + Parallax */}
                <section className="relative min-h-[90vh] flex items-center pt-20 pb-12 overflow-hidden">
                    {/* Dynamic Background */}
                    <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
                        <div 
                            className="absolute inset-0 opacity-20"
                            style={{ backgroundColor: teamColor.bg }}
                        />
                        <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-30 mix-blend-multiply animate-pulse-slow" style={{ backgroundColor: teamColor.bg }} />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] opacity-40 mix-blend-screen" style={{ backgroundColor: teamColor.bg }} />
                        
                        {/* Grid Pattern */}
                        <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.03]" />
                    </motion.div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                        <Link href={route('members')} className="inline-flex items-center gap-2 text-surface-500 hover:text-surface-900 mb-8 transition-colors group">
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium text-sm">Kembali ke Member</span>
                        </Link>

                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                            {/* Photo Container */}
                            <div className="w-full lg:w-5/12 max-w-md relative perspective-1000">
                                <motion.div 
                                    initial={{ opacity: 0, rotateY: 20, scale: 0.9 }}
                                    animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary-900/20 aspect-[3/4] group"
                                    style={{
                                        boxShadow: `0 30px 60px -15px ${teamColor.bg}40`
                                    }}
                                >
                                    <img
                                        ref={imageRef}
                                        src={photoUrl}
                                        alt={member.name}
                                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-surface-900/80 via-transparent to-transparent opacity-60" />
                                    
                                    <div className="absolute bottom-0 inset-x-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <div 
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 text-white font-bold tracking-widest text-sm"
                                        >
                                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: teamColor.bg }} />
                                            TEAM {member.type}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Info Container */}
                            <div className="w-full lg:w-7/12" ref={textRef}>
                                <div className="mb-4">
                                    <motion.h1 
                                        className="text-5xl sm:text-7xl font-black font-display tracking-tight text-surface-900"
                                        style={{ WebkitTextStroke: '1px rgba(0,0,0,0.1)' }}
                                    >
                                        {member.nickname || member.name}
                                    </motion.h1>
                                    <p className="text-xl sm:text-2xl text-surface-500 font-medium mt-2">
                                        {member.name}
                                    </p>
                                </div>

                                {/* Jikoshoukai Box */}
                                <div className="relative mt-8 mb-12">
                                    <div className="absolute -left-4 -top-4 text-6xl text-surface-200 opacity-50 font-serif">"</div>
                                    <p className="text-xl sm:text-3xl font-medium leading-relaxed text-surface-800 italic relative z-10 pl-6 border-l-4 border-surface-200" style={{ borderLeftColor: teamColor.bg }}>
                                        {member.jikoshoukai}
                                    </p>
                                </div>

                                {/* Stats Grid */}
                                <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="p-5 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-sm hover:shadow-md transition-shadow">
                                        <Calendar className="w-6 h-6 mb-3 text-surface-400" />
                                        <p className="text-xs text-surface-500 font-medium uppercase tracking-wider mb-1">Lahir</p>
                                        <p className="font-bold text-surface-900">{new Date(member.birth_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                    </div>
                                    <div className="p-5 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-sm hover:shadow-md transition-shadow">
                                        <Droplets className="w-6 h-6 mb-3 text-surface-400" />
                                        <p className="text-xs text-surface-500 font-medium uppercase tracking-wider mb-1">Gol. Darah</p>
                                        <p className="font-bold text-surface-900">{member.blood_type || '?'}</p>
                                    </div>
                                    <div className="p-5 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-sm hover:shadow-md transition-shadow">
                                        <Ruler className="w-6 h-6 mb-3 text-surface-400" />
                                        <p className="text-xs text-surface-500 font-medium uppercase tracking-wider mb-1">Tinggi</p>
                                        <p className="font-bold text-surface-900">{member.height} cm</p>
                                    </div>
                                    <div className="p-5 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-sm hover:shadow-md transition-shadow">
                                        <Sparkles className="w-6 h-6 mb-3 text-surface-400" />
                                        <p className="text-xs text-surface-500 font-medium uppercase tracking-wider mb-1">Zodiak</p>
                                        <p className="font-bold text-surface-900">{member.zodiac}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Merchandise Section */}
                <section className="py-20 bg-white relative rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.03)] z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <h2 className="text-3xl sm:text-4xl font-bold font-display text-surface-900 tracking-tight flex items-center gap-3">
                                    Merchandise <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-pulse" />
                                </h2>
                                <p className="text-surface-500 mt-2 text-lg">Koleksi barang-barang yang berkaitan dengan {member.nickname}.</p>
                            </div>
                        </div>

                        {listings.length === 0 ? (
                            <div className="rounded-3xl border-2 border-dashed border-surface-200 bg-surface-50 py-24 text-center px-4">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <span className="text-4xl">🛍️</span>
                                </div>
                                <h3 className="text-xl font-bold text-surface-900 mb-2">Belum ada merchandise</h3>
                                <p className="text-surface-500 font-medium max-w-md mx-auto">
                                    Jadilah yang pertama untuk menjual photocard atau merchandise {member.nickname} di OshiMerch!
                                </p>
                                <Link href={route('listings.create')} className="mt-8 inline-flex px-8 py-4 rounded-full gradient-primary text-white font-bold hover:shadow-lg transition-all active:scale-95">
                                    Mulai Berjualan
                                </Link>
                            </div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
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
                    <section className="py-20 bg-surface-50 relative z-20">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                                <div>
                                    <h2 className="text-3xl sm:text-4xl font-bold font-display text-surface-900 tracking-tight">
                                        Update Terbaru 📱
                                    </h2>
                                    <p className="text-surface-500 mt-2 text-lg">Gambaran aktivitas keseharian dari {member.nickname}.</p>
                                </div>
                                
                                {/* Tombol ke Profil Asli */}
                                {member.social_media?.x && (
                                    <a 
                                        href={`https://x.com/${member.social_media.x}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex px-6 py-3 rounded-2xl bg-surface-900 text-white font-bold hover:bg-surface-800 transition-colors shadow-sm"
                                    >
                                        Buka X (Twitter) Asli ↗
                                    </a>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    { platform: 'Instagram', handle: member.social_media.instagram, content: `Halo semuanya! Terima kasih untuk show hari ini, seru banget bisa ketemu kalian semua~ Jangan lupa istirahat ya! 💖✨ #${member.nickname} #JKT48`, time: '2 jam yang lalu', likes: '12.4K', comments: '842', color: 'from-[#f09433] via-[#dc2743] to-[#bc1888]' },
                                    { platform: 'X', handle: member.social_media.x, content: `Lagi di jalan pulang nih. Tadi makan sate ayam enak banget 😋 Kalian udah makan malam belum?`, time: '5 jam yang lalu', likes: '8.2K', comments: '1.1K', color: 'from-surface-800 to-surface-900' },
                                    { platform: 'TikTok', handle: member.social_media.tiktok, content: `Dance cover terbaru udah up! Jangan lupa check ya guys 💃🔥`, time: '1 hari yang lalu', likes: '45.1K', comments: '2.3K', color: 'from-[#00f2fe] to-[#4facfe]' },
                                    { platform: 'Instagram', handle: member.social_media.instagram, content: `OOTD hari ini! Gimana menurut kalian cocokan warna cerah apa gelap? 🤔✨`, time: '2 hari yang lalu', likes: '15.6K', comments: '1.2K', color: 'from-[#f09433] via-[#dc2743] to-[#bc1888]' }
                                ].filter(s => s.handle).slice(0, 3).map((post, i) => (
                                    <motion.a
                                        key={i}
                                        href={post.platform === 'X' ? `https://x.com/${post.handle}` : post.platform === 'TikTok' ? `https://tiktok.com/@${post.handle}` : `https://instagram.com/${post.handle}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.15 }}
                                        whileHover={{ y: -5 }}
                                        className="block bg-white rounded-3xl p-6 shadow-sm border border-surface-200 hover:shadow-xl hover:border-primary-200 transition-all group"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr ${post.color}`}>
                                                    <img src={photoUrl} alt="" className="w-full h-full rounded-full object-cover border-2 border-white" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-surface-900">{member.name}</p>
                                                    <p className="text-xs text-surface-500">@{post.handle} • {post.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-surface-700 text-sm leading-relaxed mb-4 line-clamp-3">
                                            {post.content}
                                        </p>
                                        <div className="flex items-center gap-4 text-surface-400 text-xs font-medium pt-4 border-t border-surface-100">
                                            <div className="flex items-center gap-1.5 group-hover:text-rose-500 transition-colors">
                                                <Heart className="w-4 h-4" /> {post.likes}
                                            </div>
                                            <div className="flex items-center gap-1.5 group-hover:text-blue-500 transition-colors">
                                                <MessageCircle className="w-4 h-4" /> {post.comments}
                                            </div>
                                            <div className="flex items-center gap-1.5 group-hover:text-green-500 transition-colors ml-auto">
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
