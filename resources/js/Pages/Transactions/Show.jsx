import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Package, Send, Truck, Upload, X } from 'lucide-react';
import Navbar from '@/Components/Navbar';

// ── Status helpers ────────────────────────────────────────────────────────────

const STEPS = [
    { key: 'order',    label: 'Pesanan Dibuat',   icon: Package },
    { key: 'paid',     label: 'Pembayaran',        icon: CheckCircle },
    { key: 'shipped',  label: 'Dikirim',           icon: Truck },
    { key: 'done',     label: 'Selesai',           icon: CheckCircle },
];

function getActiveStep(payment_status, delivery_status) {
    if (delivery_status === 'Completed') return 3;
    if (delivery_status === 'Shipped')   return 2;
    if (payment_status  === 'Paid')      return 1;
    return 0;
}

const BANK_INFO = {
    BCA:       { icon: '🏦', number: '1234567890',    name: 'OshiMerch Official', note: 'Transfer ke BCA' },
    Dana:      { icon: '💙', number: '0812-3456-7890', name: 'OshiMerch',         note: 'Transfer ke DANA' },
    GoPay:     { icon: '💚', number: '0812-3456-7890', name: 'OshiMerch',         note: 'Transfer ke GoPay' },
    ShopeePay: { icon: '🧡', number: '0812-3456-7890', name: 'OshiMerch',         note: 'Transfer ke ShopeePay' },
    OVO:       { icon: '💜', number: '0812-3456-7890', name: 'OshiMerch',         note: 'Transfer ke OVO' },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusTracker({ payment_status, delivery_status }) {
    const active = getActiveStep(payment_status, delivery_status);

    return (
        <div className="flex items-start gap-0">
            {STEPS.map((step, i) => {
                const Icon = step.icon;
                const done = i < active;
                const current = i === active;
                return (
                    <div key={step.key} className="flex-1 flex flex-col items-center relative">
                        {/* Connector line */}
                        {i < STEPS.length - 1 && (
                            <div className={`absolute top-5 left-1/2 w-full h-0.5 transition-colors duration-500 ${done ? 'bg-primary-500' : 'bg-surface-200'}`} />
                        )}
                        <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                            done    ? 'bg-primary-500 border-primary-500 text-white' :
                            current ? 'bg-white border-primary-500 text-primary-500 shadow-glow-primary' :
                                      'bg-white border-surface-200 text-surface-400'
                        }`}>
                            <Icon className="w-4 h-4" />
                        </div>
                        <p className={`text-[10px] font-semibold text-center mt-1.5 max-w-[60px] leading-tight transition-colors ${
                            done || current ? 'text-primary-600' : 'text-surface-400'
                        }`}>
                            {step.label}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

function ChatBubble({ message, currentUserId }) {
    const isMine = message.sender_id === currentUserId;
    return (
        <div className={`flex gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
            <img
                src={message.sender?.profile_picture_url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(message.sender?.name || '?')}&background=ff2d6f&color=fff&size=40`}
                alt={message.sender?.name}
                className="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
            />
            <div className={`max-w-[75%] ${isMine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMine
                        ? 'gradient-primary text-white rounded-tr-sm'
                        : 'bg-white border border-surface-200 text-surface-800 rounded-tl-sm'
                }`}>
                    {message.content}
                </div>
                <p className="text-[10px] text-surface-400">{message.created_at_human}</p>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Show({ transaction }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const isBuyer  = user?.id === transaction.buyer.id;
    const isSeller = user?.id === transaction.seller.id;

    // Chat form
    const chatForm = useForm({ content: '' });
    const chatEndRef = useRef(null);
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transaction.messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!chatForm.data.content.trim()) return;
        chatForm.post(route('messages.store', transaction.id), {
            onSuccess: () => chatForm.reset('content'),
            preserveScroll: true,
        });
    };

    // Upload proof form
    const proofForm = useForm({ proof: null });
    const [proofPreview, setProofPreview] = useState(null);
    const handleProofChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        proofForm.setData('proof', file);
        setProofPreview(URL.createObjectURL(file));
    };
    const submitProof = (e) => {
        e.preventDefault();
        proofForm.post(route('transactions.uploadProof', transaction.id), {
            forceFormData: true,
            onSuccess: () => { setProofPreview(null); proofForm.reset(); },
        });
    };

    // Ship form
    const shipForm = useForm({ shipping_resi: '' });
    const submitShip = (e) => {
        e.preventDefault();
        shipForm.patch(route('transactions.ship', transaction.id), {
            onSuccess: () => shipForm.reset(),
        });
    };

    // Complete
    const completeForm = useForm({});
    const handleComplete = () => {
        if (!confirm('Konfirmasi barang sudah diterima?')) return;
        completeForm.patch(route('transactions.complete', transaction.id));
    };

    const bank = BANK_INFO[transaction.payment_method] || BANK_INFO.BCA;

    return (
        <>
            <Head title={`Transaksi #${transaction.id} — OshiMerch`} />
            <div className="min-h-dvh bg-surface-50 flex flex-col">
                <Navbar />

                <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pt-[88px]">
                    {/* Back */}
                    <nav className="flex items-center gap-2 text-sm text-surface-500 mb-6">
                        <Link href={route('dashboard')} className="flex items-center gap-1.5 hover:text-surface-700 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Dashboard
                        </Link>
                        <span>/</span>
                        <span className="text-surface-700 font-medium">Transaksi #{transaction.id}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
                        {/* ── Left column: order info ── */}
                        <div className="space-y-5">
                            {/* Status tracker */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl border border-surface-200 p-6 shadow-card"
                            >
                                <h2 className="text-sm font-bold text-surface-700 mb-5">Status Pesanan</h2>
                                <StatusTracker
                                    payment_status={transaction.payment_status}
                                    delivery_status={transaction.delivery_status}
                                />
                            </motion.div>

                            {/* Listing info */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 }}
                                className="bg-white rounded-2xl border border-surface-200 p-5 shadow-card flex gap-4"
                            >
                                <div className="w-20 h-[107px] rounded-xl overflow-hidden bg-surface-100 shrink-0">
                                    {transaction.listing.image_url ? (
                                        <img src={transaction.listing.image_url} alt={transaction.listing.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center"><Package className="w-8 h-8 text-surface-300" /></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-primary-500 font-semibold">{transaction.listing.featured_member_name}</p>
                                    <h3 className="font-bold text-surface-900 leading-snug mt-0.5 line-clamp-2">{transaction.listing.title}</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="px-2 py-0.5 rounded-md bg-surface-100 text-surface-600 text-[11px] font-semibold">{transaction.listing.condition}</span>
                                        {transaction.listing.featured_member_team && (
                                            <span className="px-2 py-0.5 rounded-md bg-primary-50 text-primary-600 text-[11px] font-semibold">{transaction.listing.featured_member_team}</span>
                                        )}
                                    </div>
                                    <p className="text-lg font-bold text-surface-900 mt-3">Rp{transaction.item_price.toLocaleString('id-ID')}</p>
                                </div>
                            </motion.div>

                            {/* Shipping info */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-2xl border border-surface-200 p-5 shadow-card space-y-3"
                            >
                                <h2 className="text-sm font-bold text-surface-700">Info Pengiriman</h2>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-xs text-surface-500 mb-0.5">Penerima</p>
                                        <p className="font-semibold text-surface-800">{transaction.recipient_name}</p>
                                        {transaction.recipient_phone && <p className="text-surface-500 text-xs">{transaction.recipient_phone}</p>}
                                    </div>
                                    <div>
                                        <p className="text-xs text-surface-500 mb-0.5">Metode Bayar</p>
                                        <p className="font-semibold text-surface-800">{bank.icon} {transaction.payment_method}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-surface-500 mb-0.5">Alamat</p>
                                        <p className="text-surface-700 leading-relaxed">{transaction.shipping_address}</p>
                                    </div>
                                    {transaction.shipping_resi && (
                                        <div className="col-span-2">
                                            <p className="text-xs text-surface-500 mb-0.5">Nomor Resi</p>
                                            <p className="font-bold text-primary-600">{transaction.shipping_resi}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Payment instruction (buyer, pending) */}
                            {isBuyer && transaction.payment_status === 'Pending' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className="bg-amber-50 rounded-2xl border border-amber-200 p-5 space-y-4"
                                >
                                    <h2 className="text-sm font-bold text-amber-800">Instruksi Pembayaran</h2>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-amber-200">
                                        <span className="text-3xl">{bank.icon}</span>
                                        <div>
                                            <p className="text-xs text-surface-500">{bank.note}</p>
                                            <p className="font-bold text-surface-900 text-lg tracking-wider">{bank.number}</p>
                                            <p className="text-xs text-surface-500">a.n. {bank.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between bg-white border border-amber-200 rounded-xl px-4 py-3">
                                        <span className="text-sm text-surface-600">Jumlah Transfer</span>
                                        <span className="font-bold text-primary-600 text-lg">Rp{transaction.item_price.toLocaleString('id-ID')}</span>
                                    </div>
                                    <p className="text-xs text-amber-700 leading-relaxed">
                                        Transfer tepat sesuai nominal di atas, lalu upload bukti transfer di bawah ini.
                                    </p>

                                    {/* Upload proof */}
                                    <form onSubmit={submitProof} className="space-y-3">
                                        <label className="flex flex-col items-center gap-2 w-full p-4 border-2 border-dashed border-amber-300 rounded-xl cursor-pointer hover:bg-amber-100/50 transition-colors">
                                            {proofPreview ? (
                                                <img src={proofPreview} alt="Preview" className="max-h-40 rounded-lg object-contain" />
                                            ) : (
                                                <>
                                                    <Upload className="w-8 h-8 text-amber-500" />
                                                    <span className="text-sm font-medium text-amber-700">Klik untuk upload bukti transfer</span>
                                                    <span className="text-xs text-amber-600">JPG, PNG, max 4MB</span>
                                                </>
                                            )}
                                            <input type="file" accept="image/*" onChange={handleProofChange} className="sr-only" />
                                        </label>
                                        {proofPreview && (
                                            <button
                                                type="submit"
                                                disabled={proofForm.processing}
                                                className="w-full py-3 rounded-xl gradient-primary text-white font-bold text-sm shadow-glow-primary hover:shadow-xl transition-all disabled:opacity-60"
                                            >
                                                {proofForm.processing ? 'Mengupload...' : 'Upload Bukti Pembayaran'}
                                            </button>
                                        )}
                                    </form>
                                </motion.div>
                            )}

                            {/* Seller: paid but not shipped */}
                            {isSeller && transaction.payment_status === 'Paid' && transaction.delivery_status === 'Pending' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-green-50 rounded-2xl border border-green-200 p-5 space-y-3"
                                >
                                    <h2 className="text-sm font-bold text-green-800">Pembayaran Diterima — Input Resi</h2>
                                    {transaction.proof_url && (
                                        <a href={transaction.proof_url} target="_blank" rel="noopener noreferrer" className="block">
                                            <img src={transaction.proof_url} alt="Bukti bayar" className="max-h-40 rounded-xl object-contain border border-green-200" />
                                        </a>
                                    )}
                                    <form onSubmit={submitShip} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={shipForm.data.shipping_resi}
                                            onChange={e => shipForm.setData('shipping_resi', e.target.value)}
                                            placeholder="Nomor resi pengiriman"
                                            className="flex-1 px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                                            required
                                        />
                                        <button
                                            type="submit"
                                            disabled={shipForm.processing}
                                            className="px-5 py-2.5 rounded-xl gradient-primary text-white font-semibold text-sm shadow-glow-primary disabled:opacity-60"
                                        >
                                            Input Resi
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {/* Buyer: shipped — confirm received */}
                            {isBuyer && transaction.delivery_status === 'Shipped' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-blue-50 rounded-2xl border border-blue-200 p-5 flex items-center justify-between gap-4"
                                >
                                    <div>
                                        <p className="font-bold text-blue-800 text-sm">Barang Sedang Dikirim</p>
                                        {transaction.shipping_resi && (
                                            <p className="text-xs text-blue-600 mt-0.5">Resi: <span className="font-bold">{transaction.shipping_resi}</span></p>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleComplete}
                                        disabled={completeForm.processing}
                                        className="shrink-0 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
                                    >
                                        Barang Diterima ✓
                                    </button>
                                </motion.div>
                            )}

                            {/* Completed */}
                            {transaction.delivery_status === 'Completed' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-gradient-to-r from-primary-500 to-dream-500 rounded-2xl p-5 text-white text-center"
                                >
                                    <p className="text-2xl mb-1">🎉</p>
                                    <p className="font-bold text-lg">Transaksi Selesai!</p>
                                    <p className="text-white/80 text-sm mt-1">Terima kasih sudah bertransaksi di OshiMerch.</p>
                                </motion.div>
                            )}
                        </div>

                        {/* ── Right column: chat ── */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-white rounded-2xl border border-surface-200 shadow-card flex flex-col h-[580px] lg:h-[calc(100vh-180px)] lg:sticky lg:top-24"
                        >
                            {/* Chat header */}
                            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-surface-100">
                                <div className="flex -space-x-2">
                                    {[transaction.buyer, transaction.seller].map((u, i) => (
                                        <img
                                            key={i}
                                            src={u.profile_picture_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=ff2d6f&color=fff&size=40`}
                                            alt={u.name}
                                            className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                        />
                                    ))}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-surface-900">
                                        {isBuyer ? transaction.seller.name : transaction.buyer.name}
                                    </p>
                                    <p className="text-[10px] text-surface-500">
                                        {isBuyer ? 'Penjual' : 'Pembeli'}
                                    </p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                                {transaction.messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center">
                                        <p className="text-3xl mb-2">💬</p>
                                        <p className="text-sm text-surface-500 font-medium">Belum ada pesan.</p>
                                        <p className="text-xs text-surface-400 mt-1">Mulai chat untuk negosiasi atau tanyakan detail barang.</p>
                                    </div>
                                ) : (
                                    transaction.messages.map(msg => (
                                        <ChatBubble key={msg.id} message={msg} currentUserId={user?.id} />
                                    ))
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Chat input */}
                            <form onSubmit={sendMessage} className="flex items-end gap-2 px-3 py-3 border-t border-surface-100">
                                <textarea
                                    value={chatForm.data.content}
                                    onChange={e => chatForm.setData('content', e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e); } }}
                                    placeholder="Ketik pesan..."
                                    rows={1}
                                    className="flex-1 resize-none rounded-xl border border-surface-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 max-h-28"
                                />
                                <button
                                    type="submit"
                                    disabled={chatForm.processing || !chatForm.data.content.trim()}
                                    className="p-2.5 rounded-xl gradient-primary text-white shadow-glow-primary hover:shadow-xl transition-all disabled:opacity-40"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </main>
            </div>
        </>
    );
}
