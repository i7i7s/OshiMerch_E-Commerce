import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { MessageSquare, Package, ShoppingBag } from 'lucide-react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

const STATUS_BADGE = {
    Pending:   { label: 'Menunggu Bayar', style: 'bg-amber-50 text-amber-700 border-amber-200' },
    Paid:      { label: 'Lunas',          style: 'bg-green-50 text-green-700 border-green-200' },
    Failed:    { label: 'Gagal',          style: 'bg-red-50 text-red-700 border-red-200' },
    Shipped:   { label: 'Dikirim',        style: 'bg-blue-50 text-blue-700 border-blue-200' },
    Completed: { label: 'Selesai',        style: 'bg-surface-100 text-surface-600 border-surface-200' },
};

function ConversationItem({ convo, index }) {
    const status = convo.delivery_status === 'Completed' ? STATUS_BADGE.Completed
                 : convo.delivery_status === 'Shipped'   ? STATUS_BADGE.Shipped
                 : STATUS_BADGE[convo.payment_status]    || STATUS_BADGE.Pending;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
        >
            <Link
                href={route('transactions.show', convo.id)}
                className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-surface-200 hover:border-primary-200 hover:shadow-card-hover transition-all group"
            >
                {/* Listing thumbnail */}
                <div className="w-14 h-[75px] rounded-xl overflow-hidden bg-surface-100 shrink-0">
                    {convo.listing.image_url ? (
                        <img src={convo.listing.image_url} alt={convo.listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-6 h-6 text-surface-300" /></div>
                    )}
                </div>

                {/* Partner avatar */}
                <img
                    src={convo.partner?.profile_picture_url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(convo.partner?.name || '?')}&background=ff2d6f&color=fff&size=40`}
                    alt={convo.partner?.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-surface-100 shrink-0"
                />

                {/* Text */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-surface-900 text-sm truncate">{convo.partner?.name}</p>
                        <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold border ${status.style}`}>
                            {status.label}
                        </span>
                    </div>
                    <p className="text-xs text-surface-500 truncate">{convo.listing.title}</p>
                    {convo.last_message && (
                        <p className="text-xs text-surface-400 truncate mt-1">
                            <span className="font-medium">{convo.last_message.sender}:</span> {convo.last_message.content}
                        </p>
                    )}
                </div>

                {/* Time */}
                {convo.last_message && (
                    <p className="text-[10px] text-surface-400 shrink-0">{convo.last_message.created_at_human}</p>
                )}
            </Link>
        </motion.div>
    );
}

export default function Index({ conversations }) {
    return (
        <>
            <Head title="Chat — OshiMerch" />
            <div className="min-h-dvh bg-surface-50 flex flex-col">
                <Navbar />

                <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 pt-[88px]">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center shadow-glow-primary">
                            <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold font-display text-surface-900">Chat</h1>
                            <p className="text-xs text-surface-500">Semua percakapan transaksimu</p>
                        </div>
                    </div>

                    {conversations.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-24"
                        >
                            <div className="w-20 h-20 rounded-3xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
                                <Package className="w-10 h-10 text-surface-300" />
                            </div>
                            <p className="font-bold text-surface-700 text-lg mb-1">Belum ada percakapan</p>
                            <p className="text-surface-500 text-sm mb-6">Chat dimulai otomatis saat kamu melakukan atau menerima transaksi.</p>
                            <Link
                                href={route('products.index')}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold text-sm shadow-glow-primary hover:shadow-xl transition-all"
                            >
                                Jelajahi Produk
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="space-y-3">
                            {conversations.map((convo, i) => (
                                <ConversationItem key={convo.id} convo={convo} index={i} />
                            ))}
                        </div>
                    )}
                </main>

                <Footer />
            </div>
        </>
    );
}
