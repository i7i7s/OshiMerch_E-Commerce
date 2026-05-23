import React, { useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

gsap.registerPlugin(ScrollTrigger);

const StarSVG = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.4-6.3-4.8-6.3 4.8 2.3-7.4-6-4.6h7.6z" />
    </svg>
);

const VISI_MISI = [
    {
        title: "VISI KAMI",
        text: "Menjadi safe haven dan ekosistem terpadu terbesar bagi Wota di seluruh nusantara.",
        color: "bg-[#FEF08A]"
    },
    {
        title: "MISI SATU",
        text: "Menghilangkan risiko penipuan dengan sistem pembayaran Rekber yang 100% aman.",
        color: "bg-[#A7F3D0]"
    },
    {
        title: "MISI DUA",
        text: "Mempermudah transaksi trade photopack dan merch eksklusif dengan kategori yang rapi.",
        color: "bg-[#BAE6FD]"
    },
    {
        title: "MISI TIGA",
        text: "Mendukung kelangsungan fandom dengan menyediakan wadah silaturahmi antar kolektor.",
        color: "bg-[#FECDD3]"
    }
];

const WHY_OSHIMERCH = [
    "Dulu sering kena tipu WTB/WTS di Twitter/X? Di sini pakai Rekber aman bosku.",
    "Nggak perlu repot nyari hashtag yang ketimbun, semuanya udah terkategori rapi.",
    "Sistem rating dan ulasan bikin kamu tau mana seller terpercaya dan mana yang red flag.",
    "Komunitas yang solid, karena dibangun dari Wota, oleh Wota, untuk Wota."
];

const FUN_FACTS = [
    {
        title: "WOTAGRAPHER",
        text: "Bukan sekadar fotografer. Mereka rela bawa lensa 'bazooka' dan nunggu berjam-jam demi jepretan senyum terbaik oshi. Hero tanpa tanda jasa di timeline kita.",
        color: "bg-[#BAE6FD]",
        rotate: "-rotate-3"
    },
    {
        title: "EKONOMI PHOTOPACK",
        text: "Satu lembar foto bisa berharga kayak saham! Tergantung kelangkaan event dan pamor member, harganya bisa nembus jutaan Rupiah. Wall Street menangis melihat ini.",
        color: "bg-[#FEF08A]",
        rotate: "rotate-2"
    },
    {
        title: "KASTA KATA GANTI",
        text: "Oshimen = Member yang didukung. Kami-Oshi = Strata tertinggi tak tergantikan, ibarat ratu di hati. Oshi-hen = Pindah agama (alias pindah oshi).",
        color: "bg-[#FECDD3]",
        rotate: "-rotate-2"
    },
    {
        title: "JIKOSHOUKAI (JIKOU)",
        text: "Salam perkenalan super unik tiap member. Fans sejati refleks nyaut kalau di teater. 'Seperti air yang mengalir... akan selalu menghiasi harimu!'",
        color: "bg-[#A7F3D0]",
        rotate: "rotate-3"
    }
];

const TEAM = [
    {
        name: 'Muhammad Daffa Alwafi',
        role: 'FOUNDER & LEAD ENGINEER',
        color: 'bg-[#FEF08A]',
        image: '/images/team/daffa.png'
    },
    {
        name: 'Aidil Addzikra',
        role: 'BACKEND ARCHITECT',
        color: 'bg-[#BAE6FD]',
        image: '/images/team/aidil.png'
    },
    {
        name: 'Al Ilham Daffa Nurridho',
        role: 'FRONTEND SPECIALIST',
        color: 'bg-[#A7F3D0]',
        image: '/images/team/dappol.png'
    },
    {
        name: 'Erizal Rahmad Pramudhita',
        role: 'PRODUCT STRATEGIST',
        color: 'bg-[#FECDD3]',
        image: '/images/team/rizal.png'
    }
];

const ROADMAP = [
    {
        phase: "NEXT PHASE",
        title: "SISTEM LELANG (AUCTION)",
        desc: "Punya photopack rare atau merch ex-member? Jual dengan sistem lelang biar dapet harga terbaik dari kolektor.",
        color: "bg-[#FEF08A]"
    },
    {
        phase: "FUTURE PHASE",
        title: "PHOTOPACK TRADE CENTER",
        desc: "Sistem pertukaran photopack layaknya trading card game (Pokemon). Swipe kanan kalau match, langsung trade!",
        color: "bg-[#BAE6FD]"
    },
    {
        phase: "ENDGAME",
        title: "OSHI AI ASSISTANT",
        desc: "Bot AI pintar yang bertugas menyeleksi harga wajar pasar, jadi kamu nggak bakal kena scam harga dari calo.",
        color: "bg-[#FECDD3]"
    }
];

export default function About({ auth }) {
    const mainRef = useRef(null);
    const heroRef = useRef(null);
    const heroTextRef = useRef(null);
    const pinContainerRef = useRef(null);
    const scrollTrackRef = useRef(null);
    const whyLeftRef = useRef(null);
    const whyRightRef = useRef(null);
    const teamRef = useRef(null);
    const roadmapRef = useRef(null);

    useEffect(() => {
        // Initialize Lenis
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
        });

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0, 0);

        let ctx = gsap.context(() => {
            // 1. Hero Scale Down
            gsap.to(heroTextRef.current, {
                scale: 0.5,
                opacity: 0,
                y: -100,
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1,
                    pin: true,
                }
            });

            // 2. Horizontal Scroll Visi Misi
            const track = scrollTrackRef.current;
            gsap.to(track, {
                x: () => -(track.scrollWidth - window.innerWidth),
                ease: "none",
                scrollTrigger: {
                    trigger: pinContainerRef.current,
                    pin: true,
                    scrub: 1,
                    end: () => "+=" + (track.scrollWidth - window.innerWidth)
                }
            });

            // 3. Why OshiMerch Reveal
            const reasons = gsap.utils.toArray('.why-item');
            reasons.forEach((reason, i) => {
                gsap.fromTo(reason, 
                    { opacity: 0, x: 100, rotation: 5 },
                    { 
                        opacity: 1, x: 0, rotation: 0,
                        duration: 1,
                        ease: "back.out(1.7)",
                        scrollTrigger: {
                            trigger: reason,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });

            // 4. Team Scatter Polaroid
            const teamCards = gsap.utils.toArray('.team-card');
            teamCards.forEach((card, i) => {
                // Determine a random starting angle
                const randomAngle = (Math.random() - 0.5) * 60;
                gsap.fromTo(card, 
                    { opacity: 0, y: 300, rotation: randomAngle, scale: 0.5 },
                    {
                        opacity: 1, y: 0, rotation: (i % 2 === 0 ? -2 : 3), scale: 1,
                        duration: 1.2,
                        ease: "power4.out",
                        scrollTrigger: {
                            trigger: teamRef.current,
                            start: "top 60%",
                        }
                    }
                );
            });

            // 5. Roadmap Slide Up
            const roadmapCards = gsap.utils.toArray('.roadmap-card');
            roadmapCards.forEach((card, i) => {
                gsap.fromTo(card,
                    { opacity: 0, y: 100 },
                    {
                        opacity: 1, y: 0,
                        duration: 0.8,
                        ease: "back.out(1.5)",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                        }
                    }
                );
            });

        }, mainRef);

        return () => {
            ctx.revert();
            lenis.destroy();
            gsap.ticker.remove(lenis.raf);
        };
    }, []);

    return (
        <>
            <Head title="Tentang Kami — OshiMerch" />

            <div ref={mainRef} className="min-h-screen bg-[#FAFAFA] selection:bg-surface-900 selection:text-[#FEF08A] overflow-hidden flex flex-col font-sans">
                <Navbar auth={auth} />

                {/* --- 1. HERO (PINNED GSAP) --- */}
                <section ref={heroRef} className="relative w-full h-screen flex flex-col items-center justify-center bg-[#FAFAFA] z-10 border-b-4 border-surface-900">
                    <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.3] pointer-events-none" />
                    
                    <div ref={heroTextRef} className="text-center relative z-10 px-4">
                        <div className="inline-flex items-center gap-2 px-6 py-3 border-4 border-surface-900 bg-white shadow-[4px_4px_0_0_#0f172a] transform -rotate-2 mb-8">
                            <StarSVG className="w-5 h-5 text-surface-900" />
                            <span className="text-sm font-black uppercase tracking-widest text-surface-900">THE FANDOM DOSSIER</span>
                            <StarSVG className="w-5 h-5 text-surface-900" />
                        </div>

                        <div className="bg-[#BAE6FD] px-6 sm:px-12 py-6 border-4 border-surface-900 shadow-[12px_12px_0_0_#0f172a] transform rotate-1 mb-8 max-w-[90vw]">
                            <h1 className="text-6xl sm:text-8xl md:text-9xl font-display font-black tracking-tighter text-surface-900 uppercase leading-[0.85]" style={{ textShadow: '4px 4px 0px white' }}>
                                WE ARE<br/>
                                OSHIMERCH
                            </h1>
                        </div>
                    </div>
                    
                    <div className="absolute bottom-10 animate-bounce bg-white border-2 border-surface-900 p-3 rounded-full shadow-[2px_2px_0_0_#0f172a]">
                        <svg className="w-6 h-6 text-surface-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    </div>
                </section>

                {/* --- 2. HORIZONTAL SCROLL (VISI MISI) --- */}
                <div className="w-full overflow-hidden">
                    <section ref={pinContainerRef} className="h-screen w-full relative z-20 bg-[#FAFAFA]">
                        <div ref={scrollTrackRef} className="flex flex-nowrap h-full" style={{ width: `${VISI_MISI.length * 100}vw` }}>
                            {VISI_MISI.map((item, i) => (
                                <div key={i} className="horizontal-panel w-screen h-full flex-shrink-0 flex items-center justify-center p-4 sm:p-12 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.2]" />
                                    <div className="absolute inset-y-0 left-0 border-r-4 border-surface-900 border-dashed opacity-20" />
                                    
                                    <div className="relative z-10 w-full max-w-4xl">
                                        <div className={`inline-block ${item.color} px-6 py-2 border-4 border-surface-900 shadow-[6px_6px_0_0_#0f172a] transform -rotate-2 mb-8`}>
                                            <h2 className="text-3xl sm:text-5xl font-display font-black text-surface-900 uppercase tracking-widest">
                                                {item.title}
                                            </h2>
                                        </div>
                                        <div className="bg-white p-8 sm:p-16 border-4 border-surface-900 shadow-[12px_12px_0_0_#0f172a] transform rotate-1">
                                            <p className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase text-surface-900 leading-[1.1] tracking-tight">
                                                "{item.text}"
                                            </p>
                                        </div>
                                        <div className="absolute -bottom-20 -right-10 text-[200px] font-black text-surface-900 opacity-[0.03] select-none pointer-events-none">
                                            0{i+1}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* --- 3. WHY OSHIMERCH --- */}
                <section className="min-h-screen bg-[#FEF08A] relative z-30 border-y-4 border-surface-900 flex flex-col md:flex-row">
                    <div ref={whyLeftRef} className="w-full md:w-1/2 p-10 sm:p-20 border-b-4 md:border-b-0 md:border-r-4 border-surface-900 flex flex-col justify-center">
                        <div className="sticky top-1/3">
                            <h2 className="text-5xl sm:text-7xl lg:text-8xl font-display font-black text-surface-900 uppercase leading-[0.85] mb-6" style={{ textShadow: '4px 4px 0px white' }}>
                                KENAPA<br/>OSHIMERCH?
                            </h2>
                            <p className="text-xl font-bold uppercase text-surface-900 bg-white inline-block px-4 py-2 border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] transform rotate-1">
                                SOLUSI DARI FANS, UNTUK FANS.
                            </p>
                        </div>
                    </div>
                    
                    <div ref={whyRightRef} className="w-full md:w-1/2 p-6 sm:p-12 lg:p-20 bg-white bg-[url('/img/grid.svg')] flex flex-col justify-center gap-8">
                        {WHY_OSHIMERCH.map((reason, i) => (
                            <div key={i} className="why-item bg-[#A7F3D0] p-6 sm:p-8 border-4 border-surface-900 shadow-[8px_8px_0_0_#0f172a] transform hover:scale-[1.02] transition-transform">
                                <p className="text-xl sm:text-3xl font-black uppercase text-surface-900 leading-tight">
                                    {reason}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- 4. FUN FACTS --- */}
                <section className="py-32 bg-white relative z-20 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.3]" />
                    <div className="max-w-7xl mx-auto px-4 relative z-10 text-center mb-20">
                        <div className="inline-block bg-surface-900 text-white px-8 py-4 border-4 border-transparent shadow-[8px_8px_0_0_#FECDD3] transform -rotate-1">
                            <h2 className="text-4xl sm:text-6xl font-display font-black uppercase tracking-tighter">
                                WOTA CULTURE 101
                            </h2>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                        {FUN_FACTS.map((fact, i) => (
                            <div key={i} className={`bg-white p-8 border-4 border-surface-900 shadow-[8px_8px_0_0_#0f172a] transform ${fact.rotate} hover:rotate-0 hover:-translate-y-2 transition-all group`}>
                                <div className={`inline-block ${fact.color} px-4 py-1 border-2 border-surface-900 mb-6 shadow-[2px_2px_0_0_#0f172a]`}>
                                    <h3 className="font-black text-xl uppercase tracking-widest text-surface-900">{fact.title}</h3>
                                </div>
                                <p className="text-lg sm:text-xl font-bold uppercase leading-relaxed text-surface-800">
                                    "{fact.text}"
                                </p>
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <StarSVG className="w-8 h-8 text-surface-900" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- 5. THE TEAM (SCATTERED POLAROIDS) --- */}
                <section ref={teamRef} className="py-32 bg-[#FAFAFA] border-t-4 border-surface-900 relative z-30 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.2]" />
                    
                    <div className="max-w-7xl mx-auto px-4 relative z-10 text-center mb-20">
                        <h2 className="text-5xl sm:text-7xl font-display font-black text-surface-900 uppercase leading-none" style={{ textShadow: '4px 4px 0px white' }}>
                            THE CREATORS
                        </h2>
                        <p className="mt-4 text-xl font-bold text-surface-900 bg-[#BAE6FD] inline-block px-4 py-2 border-2 border-surface-900 shadow-[4px_4px_0_0_#0f172a] transform rotate-1">
                            NO HIERARCHY. JUST PURE DEDICATION.
                        </p>
                    </div>

                    <div className="max-w-6xl mx-auto px-4 relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {TEAM.map((member, i) => (
                            <div key={member.name} className="team-card bg-white p-4 border-4 border-surface-900 shadow-[12px_12px_0_0_#0f172a] hover:shadow-[16px_16px_0_0_#0f172a] hover:-translate-y-4 hover:z-50 transition-all flex flex-col items-center">
                                {/* Polaroid Image */}
                                <div className="w-full aspect-[3/4] border-4 border-surface-900 overflow-hidden bg-surface-200 mb-6">
                                    <img 
                                        src={member.image} 
                                        alt={member.name}
                                        className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-500"
                                        onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0f172a&color=fff&size=512` }}
                                    />
                                </div>
                                {/* Name & Role */}
                                <div className="w-full text-center">
                                    <h3 className="text-2xl font-display font-black text-surface-900 uppercase leading-none mb-3">
                                        {member.name}
                                    </h3>
                                    <div className={`inline-block ${member.color} w-full py-2 border-2 border-surface-900`}>
                                        <p className="text-xs font-black uppercase tracking-widest text-surface-900">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- 6. ROADMAP --- */}
                <section ref={roadmapRef} className="py-20 sm:py-32 bg-surface-900 text-white relative z-20 overflow-hidden border-t-8 border-white">
                    <div className="max-w-7xl mx-auto px-4 relative z-10 text-center mb-16 sm:mb-24">
                        <div className="inline-block bg-[#A7F3D0] px-8 py-4 border-4 border-white shadow-[8px_8px_0_0_#FEF08A] transform rotate-1">
                            <h2 className="text-4xl sm:text-6xl font-display font-black uppercase text-surface-900 tracking-tighter">
                                WHAT'S NEXT?
                            </h2>
                        </div>
                        <p className="mt-8 text-xl font-bold uppercase text-white opacity-80 max-w-2xl mx-auto">
                            OshiMerch belum selesai. Kami sedang menyiapkan inovasi gila untuk merevolusi ekosistem fandom Indonesia.
                        </p>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row gap-8">
                        {ROADMAP.map((feature, i) => (
                            <div key={i} className="roadmap-card flex-1 bg-white text-surface-900 border-4 border-white p-8 shadow-[8px_8px_0_0_rgba(255,255,255,0.2)] transform hover:-translate-y-2 transition-transform">
                                <div className={`inline-block ${feature.color} px-4 py-2 border-2 border-surface-900 font-black uppercase tracking-widest text-sm mb-6 transform -rotate-2`}>
                                    {feature.phase}
                                </div>
                                <h3 className="text-3xl font-display font-black uppercase leading-none mb-4">
                                    {feature.title}
                                </h3>
                                <p className="text-lg font-bold">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}
