import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import HeroBanner from '@/Components/HeroBanner';
import CategoryMarquee from '@/Components/CategoryMarquee';
import ListingCard from '@/Components/ListingCard';
import FeaturedMembers from '@/Components/FeaturedMembers';
import StatsSection from '@/Components/StatsSection';
import Footer from '@/Components/Footer';

// Initialize Lenis smooth scroll
function useSmoothScroll() {
    useEffect(() => {
        let lenis;
        const init = async () => {
            try {
                const { default: Lenis } = await import('lenis');
                lenis = new Lenis({
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    smooth: true,
                });
                function raf(time) {
                    lenis.raf(time);
                    requestAnimationFrame(raf);
                }
                requestAnimationFrame(raf);
            } catch (e) {
                // Lenis not available, fallback to native scroll
            }
        };
        init();
        return () => { if (lenis) lenis.destroy(); };
    }, []);
}

// CTA Banner
function CTABanner() {
    return (
        <section className="py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden bg-[#FEF08A] border-4 border-surface-900 shadow-[12px_12px_0_0_#0f172a] p-10 sm:p-14 text-center transform -rotate-1 hover:rotate-0 transition-transform"
                >
                    {/* Decorative */}
                    <div className="absolute -top-12 -right-12 w-48 h-48 border-4 border-surface-900 bg-white/50 rounded-none transform rotate-12" />
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 border-4 border-surface-900 bg-[#BAE6FD]/50 rounded-none transform -rotate-12" />

                    <div className="relative">
                        <h2 className="text-3xl sm:text-5xl font-black font-display text-surface-900 tracking-tight mb-4 uppercase" style={{ textShadow: '4px 4px 0px #fff' }}>
                            PUNYA MERCH YANG MAU DIJUAL?
                        </h2>
                        <p className="text-surface-900 font-bold text-lg max-w-xl mx-auto mb-8 bg-white px-4 py-2 border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a]">
                            DAFTAR SEKARANG DAN MULAI JUAL MERCHANDISE JKT48 KAMU KE RIBUAN FANS YANG AKTIF MENCARI.
                        </p>
                        <a
                            href={route('google.redirect')}
                            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-surface-900 border-4 border-surface-900 font-black text-xl hover:bg-[#A7F3D0] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#0f172a] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all shadow-[6px_6px_0_0_#0f172a] uppercase tracking-widest transform rotate-1"
                        >
                            MULAI JUALAN
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// Real listings section
function ListingsSection({ listings, title, subtitle }) {
    if (!listings || listings.length === 0) {
        return (
            <section className="py-12 sm:py-16">
                <div className="flex flex-col items-start mb-8">
                    <div className="bg-[#BAE6FD] px-4 py-2 border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] transform -rotate-1 mb-2">
                        <h2 className="text-2xl sm:text-3xl font-black font-display text-surface-900 tracking-tight uppercase">{title}</h2>
                    </div>
                    {subtitle && <p className="text-surface-900 bg-white px-3 py-1 border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] text-sm sm:text-base font-bold uppercase transform rotate-1">{subtitle}</p>}
                </div>
                <div className="border-4 border-surface-900 shadow-[8px_8px_0_0_#0f172a] bg-white py-16 text-center">
                    <p className="text-5xl mb-4 transform -rotate-12 inline-block">🛍️</p>
                    <p className="text-surface-900 font-black uppercase text-xl mb-4">BELUM ADA LISTING TERSEDIA.</p>
                    <Link href={route('listings.create')} className="inline-block px-6 py-3 bg-[#FEF08A] border-4 border-surface-900 text-surface-900 font-black uppercase tracking-widest hover:bg-[#A7F3D0] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] shadow-[4px_4px_0_0_#0f172a] transition-all">
                        JADILAH YANG PERTAMA BERJUALAN →
                    </Link>
                </div>
            </section>
        );
    }
    return (
        <section className="py-12 sm:py-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
                <div className="flex flex-col items-start">
                    <div className="bg-[#BAE6FD] px-4 py-2 border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] transform -rotate-1 mb-2">
                        <h2 className="text-2xl sm:text-3xl font-black font-display text-surface-900 tracking-tight uppercase">{title}</h2>
                    </div>
                    {subtitle && <p className="text-surface-900 bg-white px-3 py-1 border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] text-sm sm:text-base font-bold uppercase transform rotate-1">{subtitle}</p>}
                </div>
                <Link
                    href={route('products.index')}
                    className="shrink-0 px-6 py-3 bg-white border-4 border-surface-900 text-surface-900 font-black uppercase tracking-widest hover:bg-[#FEF08A] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] shadow-[4px_4px_0_0_#0f172a] transition-all flex items-center gap-2 transform -rotate-1"
                >
                    LIHAT SEMUA
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </Link>
            </div>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8"
            >
                {listings.map(listing => (
                    <ListingCard key={listing.id} listing={listing} />
                ))}
            </motion.div>
        </section>
    );
}

export default function Welcome({ canLogin, canRegister, appName, listings = [], stats = [], categoryCounts = {}, trendingMembers = [] }) {
    useSmoothScroll();

    return (
        <>
            <Head title="Marketplace JKT48 Merchandise — Beli & Jual Merch Oshi Favoritmu">
                <meta name="description" content="OshiMerch — Marketplace #1 untuk fans JKT48. Jual-beli photocard, lightstick, apparel, dan merchandise eksklusif. Aman, transparan, berbasis komunitas." />
            </Head>

            <div className="min-h-screen bg-surface-50">
                <Navbar />

                {/* 1. Hero Banner */}
                <HeroBanner canLogin={canLogin} activeProductsCount={stats[0]?.value || 0} />

                {/* 2. Trending Categories */}
                <CategoryMarquee categoryCounts={categoryCounts} />

                {/* 3. Listings from DB */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="trending">
                    <ListingsSection
                        listings={listings}
                        title="Listing Terbaru ✨"
                        subtitle="Merchandise JKT48 terbaru dari komunitas"
                    />
                </div>

                {/* 4. Stats — real counts from DB */}
                <div id="about">
                    <StatsSection stats={stats} />
                </div>

                {/* 5. Featured Members — real from DB + JKT48 API photos */}
                <FeaturedMembers trendingMembers={trendingMembers} />

                {/* 6. CTA Banner */}
                <CTABanner />

                {/* 7. Footer */}
                <Footer />
            </div>
        </>
    );
}
