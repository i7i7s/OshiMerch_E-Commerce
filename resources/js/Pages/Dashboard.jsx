import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Plus, Package, Edit3, Trash2, ShoppingBag, MessageSquare, ShoppingCart, Store } from 'lucide-react';

const TEAM_COLORS = {
    PASSION:       { bg: 'bg-team-passion',  label: 'PASSION' },
    LOVE:          { bg: 'bg-team-love',     label: 'LOVE'    },
    DREAM:         { bg: 'bg-team-dream',    label: 'DREAM'   },
    TRAINEE:       { bg: 'bg-team-trainee',  label: 'TRAINEE' },
    JKT48_VIRTUAL: { bg: 'bg-team-virtual',  label: 'VIRTUAL' },
    VIRTUAL:       { bg: 'bg-team-virtual',  label: 'JKT48V'  },
};

const STATUS_STYLE = {
    Available: 'bg-green-100 text-green-700',
    Reserved:  'bg-amber-100 text-amber-700',
    Sold:      'bg-surface-100 text-surface-500',
};

const TRANSACTION_STATUS = {
    Pending:   { label: 'Menunggu Bayar', style: 'bg-amber-100 text-amber-700' },
    Paid:      { label: 'Lunas',          style: 'bg-green-100 text-green-700' },
    Failed:    { label: 'Gagal',          style: 'bg-red-100 text-red-700'    },
    Shipped:   { label: 'Dikirim',        style: 'bg-blue-100 text-blue-700'  },
    Completed: { label: 'Selesai',        style: 'bg-surface-100 text-surface-500' },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function MyListingRow({ listing, onDelete }) {
    const teamInfo = TEAM_COLORS[listing.featured_member_team];
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-white border border-surface-200 hover:border-primary-200 hover:shadow-sm transition-all"
        >
            <Link href={route('products.show', listing.id)} className="shrink-0">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-100">
                    {listing.image_url ? (
                        <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-6 h-6 text-surface-300" /></div>
                    )}
                </div>
            </Link>
            <div className="flex-1 min-w-0">
                <Link href={route('products.show', listing.id)} className="font-semibold text-surface-800 text-sm leading-snug line-clamp-1 hover:text-primary-600 transition-colors">
                    {listing.title}
                </Link>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {teamInfo && <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-white ${teamInfo.bg}`}>{teamInfo.label}</span>}
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold ${STATUS_STYLE[listing.status] || STATUS_STYLE.Available}`}>{listing.status}</span>
                    <span className="text-xs text-surface-400">{listing.created_at}</span>
                </div>
            </div>
            <div className="text-right shrink-0 hidden sm:block">
                <p className="font-bold text-surface-900 text-sm">Rp{listing.price.toLocaleString('id-ID')}</p>
                <p className="text-xs text-surface-400">{listing.condition}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <Link href={route('listings.edit', listing.id)} className="w-9 h-9 rounded-xl flex items-center justify-center border border-surface-200 text-surface-600 hover:bg-surface-100 hover:text-primary-600 transition-all" aria-label="Edit">
                    <Edit3 className="w-4 h-4" />
                </Link>
                <button type="button" onClick={() => onDelete(listing.id)} className="w-9 h-9 rounded-xl flex items-center justify-center border border-surface-200 text-surface-600 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all" aria-label="Hapus">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
}

function TransactionRow({ trx, index }) {
    const status = trx.delivery_status === 'Completed' ? TRANSACTION_STATUS.Completed
                 : trx.delivery_status === 'Shipped'   ? TRANSACTION_STATUS.Shipped
                 : TRANSACTION_STATUS[trx.payment_status] || TRANSACTION_STATUS.Pending;
    const partnerAvatar = trx.partner_avatar
        || `https://ui-avatars.com/api/?name=${encodeURIComponent(trx.partner_name || '?')}&background=ff2d6f&color=fff&size=40`;
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <Link href={route('transactions.show', trx.id)} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-surface-200 hover:border-primary-200 hover:shadow-sm transition-all">
                <div className="w-12 h-[64px] rounded-lg overflow-hidden bg-surface-100 shrink-0">
                    {trx.listing.image_url ? (
                        <img src={trx.listing.image_url} alt={trx.listing.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-5 h-5 text-surface-300" /></div>
                    )}
                </div>
                <img src={partnerAvatar} alt={trx.partner_name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-surface-800 truncate">{trx.listing.title}</p>
                    <p className="text-xs text-surface-500">{trx.partner_name} · {trx.created_at}</p>
                </div>
                <div className="text-right shrink-0">
                    <p className="font-bold text-surface-900 text-sm">Rp{trx.item_price.toLocaleString('id-ID')}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${status.style}`}>{status.label}</span>
                </div>
            </Link>
        </motion.div>
    );
}

function EmptyState({ icon: Icon, title, desc, action, actionLabel }) {
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="py-16 rounded-2xl bg-white border border-dashed border-surface-300 text-center">
            <div className="w-16 h-16 rounded-3xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-surface-300" />
            </div>
            <h3 className="text-base font-bold text-surface-700 mb-1.5">{title}</h3>
            <p className="text-sm text-surface-500 mb-5">{desc}</p>
            {action && (
                <Link href={action} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold text-sm shadow-glow-primary hover:shadow-xl hover:scale-[1.02] transition-all">
                    {actionLabel}
                </Link>
            )}
        </motion.div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const TABS = [
    { key: 'listings',  label: 'Listing Saya',  icon: Store        },
    { key: 'purchases', label: 'Pembelian',      icon: ShoppingCart },
    { key: 'sales',     label: 'Penjualan',      icon: Package      },
];

export default function Dashboard({ listings = [], purchases = [], sales = [] }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const [activeTab, setActiveTab] = useState('listings');

    const handleDelete = (id) => {
        if (!confirm('Yakin ingin menghapus listing ini?')) return;
        router.delete(route('listings.destroy', id), { preserveScroll: true });
    };

    const activeCount = listings.filter((l) => l.status === 'Available').length;

    return (
        <AuthenticatedLayout showFooter>
            <Head title="Dashboard" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Flash */}
                {flash?.success && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                        {flash.success}
                    </motion.div>
                )}

                {/* Welcome Card */}
                <div className="relative overflow-hidden rounded-2xl gradient-primary p-8 sm:p-10 mb-8">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full" />
                    <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <img
                            src={user.profile_picture_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ff2d6f&color=fff&size=80`}
                            alt={user.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-white/30 shadow-lg"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-white/70 text-sm font-medium mb-1">Selamat datang kembali,</p>
                            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">{user.name}</h1>
                            {user.oshi_member_name && (
                                <p className="text-white/80 text-sm mt-1">Oshi: <span className="font-semibold text-white">{user.oshi_member_name}</span></p>
                            )}
                        </div>
                        <Link href={route('listings.create')} className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-primary-600 font-bold text-sm hover:bg-surface-50 transition-all shadow-elevated hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                            <Plus className="w-4 h-4" />
                            Jual Sekarang
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Listing',  value: listings.length,  icon: Store,         color: 'text-primary-500', bg: 'bg-primary-50' },
                        { label: 'Listing Aktif',  value: activeCount,       icon: ShoppingBag,   color: 'text-green-500',   bg: 'bg-green-50'   },
                        { label: 'Pembelian',       value: purchases.length,  icon: ShoppingCart,  color: 'text-secondary-500', bg: 'bg-secondary-50' },
                        { label: 'Penjualan',       value: sales.length,      icon: Package,       color: 'text-amber-500',   bg: 'bg-amber-50'   },
                    ].map((stat, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="p-5 rounded-2xl bg-white border border-surface-200">
                            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <p className="text-2xl font-bold font-display text-surface-900">{stat.value}</p>
                            <p className="text-sm text-surface-500 mt-0.5">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-surface-100 rounded-2xl mb-6 w-fit">
                    {TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                activeTab === tab.key
                                    ? 'bg-white text-primary-600 shadow-sm'
                                    : 'text-surface-500 hover:text-surface-700'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {tab.key === 'listings'  && listings.length  > 0 && <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-[10px] font-bold flex items-center justify-center">{listings.length}</span>}
                            {tab.key === 'purchases' && purchases.length > 0 && <span className="w-5 h-5 rounded-full bg-secondary-100 text-secondary-700 text-[10px] font-bold flex items-center justify-center">{purchases.length}</span>}
                            {tab.key === 'sales'     && sales.length     > 0 && <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold flex items-center justify-center">{sales.length}</span>}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'listings' && (
                        <motion.div key="listings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold font-display text-surface-900">Listing Saya</h2>
                                {listings.length > 0 && (
                                    <Link href={route('listings.create')} className="inline-flex items-center gap-1.5 text-sm text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                                        <Plus className="w-4 h-4" />Tambah Baru
                                    </Link>
                                )}
                            </div>
                            {listings.length === 0 ? (
                                <EmptyState
                                    icon={Package}
                                    title="Belum ada listing"
                                    desc="Mulai jual merchandise JKT48 kamu sekarang!"
                                    action={route('listings.create')}
                                    actionLabel={<><Plus className="w-4 h-4" />Buat Listing Pertama</>}
                                />
                            ) : (
                                <div className="space-y-3">
                                    {listings.map(listing => <MyListingRow key={listing.id} listing={listing} onDelete={handleDelete} />)}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'purchases' && (
                        <motion.div key="purchases" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                            <h2 className="text-lg font-bold font-display text-surface-900 mb-4">Riwayat Pembelian</h2>
                            {purchases.length === 0 ? (
                                <EmptyState
                                    icon={ShoppingCart}
                                    title="Belum ada pembelian"
                                    desc="Temukan merchandise JKT48 favoritmu di marketplace."
                                    action={route('products.index')}
                                    actionLabel="Jelajahi Produk"
                                />
                            ) : (
                                <div className="space-y-3">
                                    {purchases.map((trx, i) => <TransactionRow key={trx.id} trx={trx} index={i} />)}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'sales' && (
                        <motion.div key="sales" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                            <h2 className="text-lg font-bold font-display text-surface-900 mb-4">Riwayat Penjualan</h2>
                            {sales.length === 0 ? (
                                <EmptyState
                                    icon={Store}
                                    title="Belum ada penjualan"
                                    desc="Listing yang sudah terjual akan muncul di sini."
                                    action={route('listings.create')}
                                    actionLabel={<><Plus className="w-4 h-4" />Buat Listing</>}
                                />
                            ) : (
                                <div className="space-y-3">
                                    {sales.map((trx, i) => <TransactionRow key={trx.id} trx={trx} index={i} />)}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AuthenticatedLayout>
    );
}
