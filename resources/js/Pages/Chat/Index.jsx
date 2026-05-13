import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { MessageSquare, Package, ShoppingBag, MessageCircle } from 'lucide-react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

const STATUS_BADGE = {
    Pending:   { label: 'MENUNGGU BAYAR', style: 'bg-[#FEF08A] text-surface-900 border-surface-900' },
    Paid:      { label: 'LUNAS',          style: 'bg-[#A7F3D0] text-surface-900 border-surface-900' },
    Failed:    { label: 'GAGAL',          style: 'bg-[#FECDD3] text-surface-900 border-surface-900' },
    Shipped:   { label: 'DIKIRIM',        style: 'bg-[#BAE6FD] text-surface-900 border-surface-900' },
    Completed: { label: 'SELESAI',        style: 'bg-white text-surface-900 border-surface-900' },
};

function TransactionConvoItem({ convo, index }) {
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
                className="flex items-center gap-4 p-4 bg-white rounded-2xl border-4 border-surface-900 hover:shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 transition-all group"
            >
                {/* Listing thumbnail */}
                <div className="w-16 h-[85px] rounded-xl overflow-hidden bg-[#BAE6FD] border-2 border-surface-900 shrink-0">
                    {convo.listing.image_url ? (
                        <img src={convo.listing.image_url} alt={convo.listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-6 h-6 text-surface-900" /></div>
                    )}
                </div>

                {/* Partner avatar */}
                <img
                    src={convo.partner?.profile_picture_url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(convo.partner?.name || '?')}&background=FF1100&color=fff&size=40`}
                    alt={convo.partner?.name}
                    className="w-12 h-12 rounded-full object-cover border-4 border-surface-900 shrink-0 shadow-[2px_2px_0_0_#0f172a]"
                />

                {/* Text */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="font-black text-surface-900 text-lg truncate uppercase tracking-tight">{convo.partner?.name}</p>
                        <span className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-black border-2 ${status.style} uppercase tracking-widest`}>
                            {status.label}
                        </span>
                    </div>
                    <p className="text-sm font-bold text-surface-900 truncate bg-[#FEF08A] inline-block px-1 border-2 border-surface-900">{convo.listing.title}</p>
                    {convo.last_message && (
                        <p className="text-xs font-bold text-surface-700 truncate mt-2 bg-surface-100 p-2 rounded-xl border-2 border-surface-900">
                            <span className="font-black text-surface-900 uppercase">{convo.last_message.sender}:</span> {convo.last_message.content}
                        </p>
                    )}
                </div>

                {/* Time */}
                {convo.last_message && (
                    <p className="text-[10px] font-black text-surface-500 shrink-0 uppercase tracking-widest">{convo.last_message.created_at_human}</p>
                )}
            </Link>
        </motion.div>
    );
}

function DirectConvoItem({ convo, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
        >
            <Link
                href={route('chat.direct', convo.partner?.id)}
                className="flex items-center gap-4 p-4 bg-[#FECDD3] rounded-2xl border-4 border-surface-900 hover:shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 transition-all group"
            >
                {/* Direct chat icon placeholder */}
                <div className="w-16 h-[85px] rounded-xl overflow-hidden bg-white border-2 border-surface-900 shrink-0 flex items-center justify-center transform -rotate-3 group-hover:rotate-0 transition-transform">
                    <MessageCircle className="w-8 h-8 text-surface-900" />
                </div>

                {/* Partner avatar */}
                <img
                    src={convo.partner?.profile_picture_url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(convo.partner?.name || '?')}&background=FF1100&color=fff&size=40`}
                    alt={convo.partner?.name}
                    className="w-12 h-12 rounded-full object-cover border-4 border-surface-900 shrink-0 shadow-[2px_2px_0_0_#0f172a]"
                />

                {/* Text */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="font-black text-surface-900 text-lg truncate uppercase tracking-tight">{convo.partner?.name}</p>
                        <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-black border-2 bg-white text-surface-900 border-surface-900 uppercase tracking-widest shadow-[2px_2px_0_0_#0f172a]">
                            PESAN LANGSUNG
                        </span>
                    </div>
                    {convo.last_message && (
                        <p className="text-xs font-bold text-surface-900 truncate mt-2 bg-white p-2 rounded-xl border-2 border-surface-900">
                            <span className="font-black text-[#f43f5e] uppercase">{convo.last_message.sender}:</span> {convo.last_message.content}
                        </p>
                    )}
                </div>

                {/* Time */}
                {convo.last_message && (
                    <p className="text-[10px] font-black text-surface-900 shrink-0 uppercase tracking-widest bg-white px-1 border-2 border-surface-900">{convo.last_message.created_at_human}</p>
                )}
            </Link>
        </motion.div>
    );
}

export default function Index({ conversations }) {
    return (
        <>
            <Head title="Chat — OshiMerch" />
            <div className="min-h-dvh bg-[#FAFAFA] flex flex-col font-sans selection:bg-surface-900 selection:text-[#FEF08A]">
                <Navbar />

                <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 pt-[120px]">
                    <div className="flex items-center gap-4 mb-8 bg-[#A7F3D0] p-6 rounded-3xl border-4 border-surface-900 shadow-[8px_8px_0_0_#0f172a] transform -rotate-1">
                        <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.2]" />
                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] transform rotate-3 z-10 relative">
                            <MessageSquare className="w-8 h-8 text-surface-900" />
                        </div>
                        <div className="z-10 relative">
                            <h1 className="text-4xl font-black font-display text-surface-900 uppercase tracking-tighter" style={{ textShadow: '2px 2px 0px white' }}>CHAT AREA</h1>
                            <p className="text-sm font-black uppercase tracking-widest text-surface-900 bg-white inline-block px-2 border-2 border-surface-900 mt-1">Semua Percakapanmu</p>
                        </div>
                    </div>

                    {conversations.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-24 bg-white rounded-3xl border-4 border-surface-900 shadow-[8px_8px_0_0_#0f172a]"
                        >
                            <div className="w-24 h-24 rounded-3xl bg-[#BAE6FD] flex items-center justify-center mx-auto mb-6 border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] transform -rotate-6">
                                <Package className="w-12 h-12 text-surface-900" />
                            </div>
                            <p className="font-black font-display text-surface-900 text-3xl uppercase tracking-tighter mb-2">SEPI BANGET!</p>
                            <p className="text-surface-900 font-bold text-base mb-8 max-w-sm mx-auto bg-[#FEF08A] p-2 border-2 border-surface-900 rounded-xl">Chat akan muncul di sini otomatis saat kamu melakukan atau menerima pesanan.</p>
                            <Link
                                href={route('products.index')}
                                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-surface-900 text-white font-black text-sm uppercase tracking-widest shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all hover:bg-[#A7F3D0] hover:text-surface-900 border-4 border-transparent hover:border-surface-900"
                            >
                                JELAJAHI PRODUK
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            {conversations.map((convo, i) =>
                                convo.type === 'direct'
                                    ? <DirectConvoItem key={`direct-${convo.id}`} convo={convo} index={i} />
                                    : <TransactionConvoItem key={`txn-${convo.id}`} convo={convo} index={i} />
                            )}
                        </div>
                    )}
                </main>

                <Footer />
            </div>
        </>
    );
}
