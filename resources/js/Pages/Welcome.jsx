import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import HeroBanner from '@/Components/HeroBanner';
import CategoryMarquee from '@/Components/CategoryMarquee';
import ProductGrid from '@/Components/ProductGrid';
import FeaturedMembers from '@/Components/FeaturedMembers';
import StatsSection from '@/Components/StatsSection';
import TestimonialsSection from '@/Components/TestimonialsSection';
import Footer from '@/Components/Footer';
import { PRODUCTS, STATS } from '@/data/products';

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

// Activity Feed — Social proof
function ActivityFeed() {
    const activities = [
        { user: 'Rizky A.', action: 'baru saja membeli', item: 'Photocard Freya River Ver.', time: '2 menit lalu' },
        { user: 'Sari W.', action: 'menambahkan ke wishlist', item: 'Lightstick JKT48 Ver. 3', time: '5 menit lalu' },
        { user: 'Budi H.', action: 'baru saja membeli', item: 'Kaos Anniversary 11th', time: '8 menit lalu' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="fixed bottom-6 left-6 z-40 hidden lg:block"
        >
            <motion.div
                key={0}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/95 backdrop-blur-lg rounded-xl border border-surface-200 shadow-elevated p-3 max-w-xs"
            >
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {activities[0].user[0]}
                    </div>
                    <div>
                        <p className="text-xs text-surface-600">
                            <span className="font-semibold text-surface-800">{activities[0].user}</span> {activities[0].action}
                        </p>
                        <p className="text-[11px] text-primary-600 font-medium">{activities[0].item}</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function Welcome({ canLogin, canRegister, appName }) {
    useSmoothScroll();

    // Prepare product sections
    const trendingProducts = PRODUCTS.filter(p => p.isTrending);
    const newArrivals = PRODUCTS.filter(p => p.isNew);
    const bestSellers = [...PRODUCTS].sort((a, b) => b.soldCount - a.soldCount).slice(0, 8);

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
                <CategoryMarquee />

                {/* 3. Best Selling Products */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="trending">
                    <ProductGrid
                        products={bestSellers}
                        title="Best Seller 🏆"
                        subtitle="Produk paling laris minggu ini"
                        viewAllHref="#"
                        columns={4}
                    />
                </div>

                {/* 4. Stats */}
                <div id="about">
                    <StatsSection stats={STATS} />
                </div>

                {/* 5. New Arrivals */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ProductGrid
                        products={newArrivals}
                        title="Baru Ditambahkan ✨"
                        subtitle="Listing terbaru dari penjual terverifikasi"
                        viewAllHref="#"
                        columns={4}
                    />
                </div>

                {/* 6. Featured Members */}
                <FeaturedMembers />

                {/* 7. Trending Products */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ProductGrid
                        products={trendingProducts}
                        title="Sedang Trending 🔥"
                        subtitle="Yang paling banyak dicari fans"
                        viewAllHref="#"
                        columns={4}
                    />
                </div>

                {/* 8. Testimonials */}
                <TestimonialsSection />

                {/* 9. CTA Banner */}
                <CTABanner />

                {/* 10. Footer */}
                <Footer />

                {/* Activity Feed */}
                <ActivityFeed />
            </div>
        </>
    );
}
