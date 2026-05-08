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
                    className="relative overflow-hidden rounded-3xl gradient-primary p-10 sm:p-14 text-center"
                >
                    {/* Decorative */}
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full" />
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />

                    <div className="relative">
                        <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight mb-3">
                            Punya Merch yang Mau Dijual? 🎁
                        </h2>
                        <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
                            Daftar sekarang dan mulai jual merchandise JKT48 kamu ke ribuan fans yang aktif mencari.
                        </p>
                        <a
                            href={route('google.redirect')}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary-600 font-bold text-lg hover:bg-surface-50 transition-all shadow-elevated hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Mulai Jualan
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold font-display text-surface-900 tracking-tight">{title}</h2>
                        {subtitle && <p className="text-surface-500 mt-1 text-sm sm:text-base">{subtitle}</p>}
                    </div>
                </div>
                <div className="rounded-3xl border border-dashed border-surface-300 bg-surface-50 py-16 text-center">
                    <p className="text-4xl mb-3">🛍️</p>
                    <p className="text-surface-500 font-medium">Belum ada listing tersedia.</p>
                    <Link href={route('listings.create')} className="mt-4 inline-block text-sm font-semibold text-primary-600 hover:text-primary-700">
                        Jadilah yang pertama berjualan →
                    </Link>
                </div>
            </section>
        );
    }
    return (
        <section className="py-12 sm:py-16">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold font-display text-surface-900 tracking-tight">{title}</h2>
                    {subtitle && <p className="text-surface-500 mt-1 text-sm sm:text-base">{subtitle}</p>}
                </div>
                <Link
                    href={route('products.index')}
                    className="shrink-0 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1 group"
                >
                    Lihat Semua
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </Link>
            </div>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
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
                <HeroBanner canLogin={canLogin} />

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
