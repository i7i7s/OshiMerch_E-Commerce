import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ShoppingBag, Package, Heart, Sparkles, ChevronRight, Edit3, Trash2, AlertCircle } from 'lucide-react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { formatPrice } from '@/data/products';
import { Meteors } from '@/Components/ui/Meteors';

// ── Slot-machine Counter (sama persis seperti di landing page) ─────────────────
function Counter({ value, duration = 1400 }) {
    const [display, setDisplay] = useState(0);
    const [done, setDone] = useState(false);
    const ref = useRef(null);
    const frameRef = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView || value === 0) { setDisplay(0); setDone(true); return; }

        setDisplay(0);
        setDone(false);

        const startTime = performance.now();
        const scrambleMs = duration * 0.65;
        const settleMs   = duration * 0.35;
        const scrambleMax = Math.max(value, 50);

        const tick = (now) => {
            const elapsed = now - startTime;
            if (elapsed < scrambleMs) {
                setDisplay(Math.floor(Math.random() * scrambleMax));
                frameRef.current = requestAnimationFrame(tick);
            } else if (elapsed < scrambleMs + settleMs) {
                const t = (elapsed - scrambleMs) / settleMs;
                const ease = 1 - Math.pow(1 - t, 3);
                setDisplay(Math.round(ease * value));
                frameRef.current = requestAnimationFrame(tick);
            } else {
                setDisplay(value);
                setDone(true);
            }
        };

        frameRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameRef.current);
    }, [inView, value, duration]);

    return (
        <motion.span
            ref={ref}
            key={done ? 'done' : 'counting'}
            animate={done ? { scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ display: 'inline-block' }}
            className="tabular-nums"
        >
            {display.toLocaleString('id-ID')}
        </motion.span>
    );
}

// ── Brutalist Stat Card ──────────────────────────────────────────────────────────
function CompactStatCard({ title, value, icon: Icon, colorClass, delay = 0 }) {
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}
            className={`rounded-xl border-4 border-surface-900 p-5 flex items-center justify-between shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all cursor-default ${colorClass}`}>
            <div>
                <p className="text-sm font-black uppercase tracking-widest text-surface-900 mb-1">{title}</p>
                <div className="text-3xl font-black font-display text-surface-900 tracking-tight">
                    <Counter value={value} />
                </div>
            </div>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-white border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a] transform rotate-3`}>
                <Icon className="w-8 h-8 text-surface-900" />
            </div>
        </motion.div>
    );
}

// ── Floating Photo Card (Brutalist) ──────────────────────────────────────────
function FloatingProductCard({ item, type }) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -10, rotate: (Math.random() - 0.5) * 4 }}
            className="relative aspect-[3/4] bg-white rounded-2xl border-4 border-surface-900 shadow-[8px_8px_0_0_#0f172a] group overflow-hidden cursor-pointer">
            
            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            
            {/* Status Badge */}
            <div className={`absolute top-3 left-3 px-3 py-1 border-4 border-surface-900 rounded-xl text-xs font-black uppercase shadow-[2px_2px_0_0_#0f172a] transform -rotate-2 ${item.status === 'Available' ? 'bg-[#A7F3D0] text-surface-900' : 'bg-white text-surface-900'}`}>
                {item.status}
            </div>

            {/* Hover Actions Overlay */}
            <div className="absolute inset-0 bg-surface-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <div className="flex items-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    {type === 'listings' ? (
                        <>
                            <Link href={route('listings.edit', item.id)} className="w-14 h-14 rounded-2xl bg-[#FEF08A] border-4 border-surface-900 flex items-center justify-center text-surface-900 shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all transform hover:rotate-6">
                                <Edit3 className="w-6 h-6" />
                            </Link>
                            <button className="w-14 h-14 rounded-2xl bg-[#FECDD3] border-4 border-surface-900 flex items-center justify-center text-surface-900 shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all transform hover:-rotate-6">
                                <Trash2 className="w-6 h-6" />
                            </button>
                        </>
                    ) : (
                        <Link href={route('products.show', item.id)} className="w-16 h-16 rounded-2xl bg-[#BAE6FD] border-4 border-surface-900 flex items-center justify-center text-surface-900 shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all transform hover:rotate-3">
                            <ChevronRight className="w-8 h-8" />
                        </Link>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function Dashboard({ auth, listings = [], purchases = [], sales = [] }) {
    const user = auth.user;
    const [activeTab, setActiveTab] = useState('listings');


    const stats = {
        active_listings: listings.filter(l => l.status === 'Available').length,
        total_purchases: purchases.length,
        total_sales: sales.length,
        wishlist_count: 0,
    };

    const tabs = [
        { id: 'listings', label: 'Listing Saya', count: stats.active_listings, icon: Package },
        { id: 'purchases', label: 'Pembelian', count: stats.total_purchases, icon: ShoppingBag },
        { id: 'sales', label: 'Penjualan', count: stats.total_sales, icon: Sparkles },
        { id: 'wishlists', label: 'Wishlist', count: stats.wishlist_count, icon: Heart },
    ];

    const getActiveData = () => {
        switch (activeTab) {
            case 'listings': return listings;
            case 'purchases': return purchases;
            case 'sales': return sales;
            case 'wishlists': return [];
            default: return [];
        }
    };

    const activeData = getActiveData();

    return (
        <>
            <Head title="Dashboard — OshiMerch" />
            <div className="min-h-dvh bg-[#FAFAFA] flex flex-col selection:bg-surface-900 selection:text-[#FEF08A]">
                <Navbar />

                <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pt-24 sm:pt-32">
                    
                    {/* Brutalist Welcome Banner */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                        className="bg-[#FEF08A] rounded-2xl border-4 border-surface-900 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 mb-12 shadow-[8px_8px_0_0_#0f172a] relative overflow-hidden">
                        
                        {/* Decorative pattern & Meteors */}
                        <div className="absolute right-0 top-0 w-1/2 h-full bg-[url('/img/grid.svg')] opacity-[0.1] pointer-events-none" />
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <Meteors number={15} />
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 w-full text-center sm:text-left">
                            <div className="relative">
                                <img 
                                    src={user.profile_picture_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=FF1100&color=fff`} 
                                    alt={user.name} 
                                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] transform -rotate-3"
                                />
                                <div className="absolute -bottom-3 -right-3 bg-white border-4 border-surface-900 rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-[2px_2px_0_0_#0f172a]">
                                    👋
                                </div>
                            </div>
                            <div>
                                <h1 className="text-4xl sm:text-5xl font-black font-display uppercase tracking-tighter text-surface-900 mb-2" style={{ textShadow: '2px 2px 0px white' }}>
                                    HALO, {user.name}!
                                </h1>
                                <p className="text-lg font-bold text-surface-800 bg-white inline-block px-4 py-1 border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a]">
                                    {user.oshi_member_name ? (
                                        <>Oshi: <span className="text-primary-600 uppercase font-black">{user.oshi_member_name}</span></>
                                    ) : (
                                        <>Yuk lengkapi profil dan pilih oshi kamu!</>
                                    )}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Brutalist Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <CompactStatCard delay={0.1} title="Listing Aktif" value={stats.active_listings} icon={Package} colorClass="bg-[#BAE6FD]" />
                        <CompactStatCard delay={0.2} title="Total Penjualan" value={stats.total_sales} icon={Sparkles} colorClass="bg-[#C7D2FE]" />
                        <CompactStatCard delay={0.3} title="Total Pembelian" value={stats.total_purchases} icon={ShoppingBag} colorClass="bg-[#A7F3D0]" />
                        <CompactStatCard delay={0.4} title="Wishlist" value={stats.wishlist_count} icon={Heart} colorClass="bg-[#FECDD3]" />
                    </div>

                    {/* Content Section */}
                    <div className="mb-16">
                        
                        {/* Block Tabs */}
                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            {tabs.map(tab => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-3 px-6 py-3 rounded-xl border-2 border-surface-900 font-black uppercase tracking-widest transition-all ${
                                            isActive 
                                            ? 'bg-surface-900 text-white shadow-[4px_4px_0_0_#0f172a] -translate-y-1 -translate-x-1' 
                                            : 'bg-white text-surface-600 hover:bg-[#FEF08A] hover:text-surface-900 hover:shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1'
                                        }`}>
                                        <span className="text-sm">{tab.label}</span>
                                        <span className={`px-2 py-0.5 rounded-md border-2 text-[10px] ${
                                            isActive ? 'bg-white text-surface-900 border-white' : 'bg-surface-100 border-surface-900 text-surface-900'
                                        }`}>
                                            {tab.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* List Area */}
                        <div className="min-h-[300px]">
                            <AnimatePresence mode="wait">
                                {activeData.length === 0 ? (
                                    <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                        className="w-full bg-[#FAFAFA] border-4 border-surface-900 p-12 sm:p-24 rounded-3xl flex flex-col items-center justify-center text-center shadow-[8px_8px_0_0_#0f172a]">
                                        <div className="w-24 h-24 rounded-2xl bg-[#FECDD3] border-4 border-surface-900 flex items-center justify-center mb-6 shadow-[4px_4px_0_0_#0f172a] transform -rotate-3">
                                            <AlertCircle className="w-12 h-12 text-surface-900" />
                                        </div>
                                        <h3 className="text-3xl font-black uppercase font-display tracking-tight text-surface-900 mb-2">Belum Ada Data</h3>
                                        <p className="text-lg font-bold text-surface-600">
                                            Data untuk bagian ini masih kosong.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                        {activeData.map((item, idx) => (
                                            <FloatingProductCard key={item.id} item={item} type={activeTab} />
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                </main>
                <Footer />
            </div>
        </>
    );
}
