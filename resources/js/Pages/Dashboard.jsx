import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ShoppingBag, Package, Heart, Sparkles, ChevronRight, Edit3, Trash2, AlertCircle } from 'lucide-react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { formatPrice } from '@/data/products';

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

// ── Compact Stat Card ──────────────────────────────────────────────────────────
function CompactStatCard({ title, value, icon: Icon, colorClass, delay = 0 }) {
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}
            className="bg-white rounded-2xl border-2 border-surface-100 p-5 flex items-center justify-between hover:border-surface-200 transition-colors">
            <div>
                <p className="text-sm font-bold text-surface-500 mb-1">{title}</p>
                <div className="text-2xl font-black font-display text-surface-900 tracking-tight">
                    <Counter value={value} />
                </div>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
                <Icon className="w-6 h-6" />
            </div>
        </motion.div>
    );
}

// ── Compact List Item ────────────────────────────────────────────────────────
function CompactListItem({ item, type }) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-4 p-4 bg-white rounded-xl border border-surface-100 hover:border-surface-300 hover:shadow-sm transition-all group">
            
            <div className="w-16 h-16 rounded-lg bg-surface-100 overflow-hidden shrink-0 border border-surface-100">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-surface-900 truncate mb-1">{item.title}</h4>
                <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="text-primary-600">{formatPrice(item.price)}</span>
                    <span className="text-surface-300">•</span>
                    <span className={`px-2 py-0.5 rounded-md ${item.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-surface-100 text-surface-600'}`}>
                        {item.status}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {type === 'listings' ? (
                    <>
                        <Link href={route('listings.edit', item.id)} className="w-8 h-8 rounded-lg bg-surface-50 flex items-center justify-center text-surface-500 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                            <Edit3 className="w-4 h-4" />
                        </Link>
                        <button className="w-8 h-8 rounded-lg bg-surface-50 flex items-center justify-center text-surface-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <Link href={route('products.show', item.id)} className="w-8 h-8 rounded-lg bg-surface-50 flex items-center justify-center text-surface-500 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                )}
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
            <div className="min-h-dvh bg-surface-50 flex flex-col">
                <Navbar />

                <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 pt-[104px]">
                    
                    {/* Compact Welcome Banner */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                        className="bg-white rounded-3xl border-2 border-surface-100 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-8 shadow-sm relative overflow-hidden">
                        
                        {/* Decorative subtle background */}
                        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary-50/50 to-transparent pointer-events-none" />

                        <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
                            <img 
                                src={user.profile_picture_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=FF1100&color=fff`} 
                                alt={user.name} 
                                className="w-16 h-16 rounded-2xl object-cover border-2 border-surface-200"
                            />
                            <div>
                                <h1 className="text-2xl font-black font-display text-surface-900 tracking-tight mb-1">
                                    Halo, {user.name}!
                                </h1>
                                <p className="text-sm font-bold text-surface-500 flex items-center gap-1.5">
                                    {user.oshi_member_name ? (
                                        <>Oshi: <span className="text-primary-600">{user.oshi_member_name}</span></>
                                    ) : (
                                        <>Yuk lengkapi profil dan pilih oshi kamu!</>
                                    )}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Compact Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <CompactStatCard delay={0.1} title="Listing Aktif" value={stats.active_listings} icon={Package} colorClass="bg-blue-50 text-blue-600" />
                        <CompactStatCard delay={0.2} title="Total Penjualan" value={stats.total_sales} icon={Sparkles} colorClass="bg-primary-50 text-primary-600" />
                        <CompactStatCard delay={0.3} title="Total Pembelian" value={stats.total_purchases} icon={ShoppingBag} colorClass="bg-green-50 text-green-600" />
                        <CompactStatCard delay={0.4} title="Wishlist" value={stats.wishlist_count} icon={Heart} colorClass="bg-red-50 text-red-600" />
                    </div>

                    {/* Content Section */}
                    <div className="bg-white rounded-3xl border-2 border-surface-100 p-6 shadow-sm">
                        
                        {/* Minimalist Tabs */}
                        <div className="flex items-center gap-6 border-b-2 border-surface-100 mb-6 overflow-x-auto hide-scrollbar">
                            {tabs.map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 pb-4 border-b-2 transition-colors whitespace-nowrap ${
                                        activeTab === tab.id 
                                        ? 'border-primary-500 text-primary-600' 
                                        : 'border-transparent text-surface-400 hover:text-surface-700'
                                    }`}>
                                    <span className="font-bold text-sm">{tab.label}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-black ${
                                        activeTab === tab.id ? 'bg-primary-50 text-primary-600' : 'bg-surface-100 text-surface-500'
                                    }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* List Area */}
                        <div className="min-h-[300px]">
                            <AnimatePresence mode="wait">
                                {activeData.length === 0 ? (
                                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="h-full flex flex-col items-center justify-center py-16 text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-surface-50 flex items-center justify-center mb-4">
                                            <AlertCircle className="w-8 h-8 text-surface-300" />
                                        </div>
                                        <h3 className="text-base font-bold text-surface-900 mb-1">Belum Ada Data</h3>
                                        <p className="text-sm font-medium text-surface-500">
                                            Data untuk bagian ini masih kosong.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {activeData.map((item, idx) => (
                                            <CompactListItem key={item.id} item={item} type={activeTab} />
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
