import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// ── Raw SVG Icons (no Lucide dependency) ─────────────────────────────────────
const IconArrowLeft  = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>;
const IconPackage    = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>;
const IconCheck      = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>;
const IconTruck      = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17H7A5 5 0 0117 7h2a3 3 0 013 3v4a1 1 0 01-1 1h-1m-9 0H7m2 0a2 2 0 104 0m-4 0a2 2 0 004 0m5 0a2 2 0 104 0m-4 0a2 2 0 004 0"/></svg>;
const IconUpload     = () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>;
const IconSend       = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>;
const IconStar       = ({ filled }) => <svg className={`w-8 h-8 transition-colors ${filled ? 'text-amber-400 fill-amber-400' : 'text-surface-200'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>;
const IconShieldCheck = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>;
const IconBox        = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>;
const IconMapPin     = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>;
import Navbar from '@/Components/Navbar';

// ── Status helpers ────────────────────────────────────────────────────────────

const STEPS = [
    { key: 'order',            label: 'Dibuat',       Icon: IconPackage },
    { key: 'paid',             label: 'Dibayar',      Icon: IconCheck },
    { key: 'confirmed',        label: 'Konfirmasi',   Icon: IconShieldCheck },
    { key: 'packed',           label: 'Packing',      Icon: IconBox },
    { key: 'shipped',          label: 'Dikirim',      Icon: IconTruck },
    { key: 'out_for_delivery', label: 'Di Jalan',     Icon: IconMapPin },
    { key: 'delivered',        label: 'Diterima',     Icon: IconCheck },
];

function getActiveStep(payment_status, delivery_status) {
    if (delivery_status === 'Delivered')       return 6;
    if (delivery_status === 'OutForDelivery')  return 5;
    if (delivery_status === 'Shipped')         return 4;
    if (delivery_status === 'Packed')          return 3;
    if (payment_status  === 'Confirmed')       return 2;
    if (payment_status  === 'Paid')            return 1;
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
            {STEPS.map(({ key, label, Icon }, i) => {
                const done    = i < active;
                const current = i === active;
                return (
                    <div key={key} className="flex-1 flex flex-col items-center relative">
                        {i < STEPS.length - 1 && (
                            <div className={`absolute top-5 left-1/2 w-full h-0.5 transition-colors duration-500 ${done ? 'bg-gradient-to-r from-primary-500 to-purple-500' : 'bg-surface-200'}`} />
                        )}
                        <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                            done    ? 'bg-gradient-to-br from-primary-500 to-purple-600 border-purple-600 text-white shadow-lg shadow-purple-300' :
                            current ? 'bg-white border-primary-500 text-primary-500 shadow-glow-primary animate-pulse' :
                                      'bg-white border-surface-200 text-surface-400'
                        }`}>
                            <Icon />
                        </div>
                        <p className={`text-[10px] font-semibold text-center mt-1.5 max-w-[60px] leading-tight ${
                            done || current ? 'text-primary-600' : 'text-surface-400'
                        }`}>{label}</p>
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
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(message.sender?.name || '?')}&background=FF1100&color=fff&size=40`}
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

// ── Review Form ───────────────────────────────────────────────────────────────

function ReviewForm({ transactionId, sellerName }) {
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({ rating: 5, comment: '' });
    const [hoveredStar, setHoveredStar] = useState(0);

    const submit = (e) => {
        e.preventDefault();
        post(route('reviews.store', transactionId), { onSuccess: () => reset(), preserveScroll: true });
    };

    if (recentlySuccessful) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
                <p className="text-2xl mb-1">⭐</p>
                <p className="font-bold text-green-800">Ulasan terkirim! Terima kasih.</p>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-surface-200 p-5 space-y-4">
            <h3 className="font-bold text-surface-900">Beri Ulasan untuk {sellerName}</h3>
            <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                    <button key={i} type="button"
                        onMouseEnter={() => setHoveredStar(i)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => setData('rating', i)}>
                        <IconStar filled={i <= (hoveredStar || data.rating)} />
                    </button>
                ))}
                <span className="text-sm text-surface-500 ml-2">{data.rating}/5</span>
            </div>
            <textarea value={data.comment} onChange={e => setData('comment', e.target.value)}
                placeholder="Ceritakan pengalamanmu bertransaksi dengan penjual ini..."
                rows={3} className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none" />
            {errors.rating && <p className="text-xs text-red-500">{errors.rating}</p>}
            <button onClick={submit} disabled={processing}
                className="px-5 py-2.5 rounded-xl gradient-primary text-white font-bold text-sm shadow-glow-primary transition-all disabled:opacity-60">
                {processing ? 'Mengirim...' : 'Kirim Ulasan ⭐'}
            </button>
        </motion.div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Show({ transaction: initialTransaction }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    // ─── Local state for real-time updates ────────────────────────────────
    const [txn, setTxn] = useState(initialTransaction);
    const [messages, setMessages] = useState(initialTransaction.messages);

    // Sync when Inertia re-renders with fresh data
    useEffect(() => {
        setTxn(initialTransaction);
        setMessages(initialTransaction.messages);
    }, [initialTransaction]);

    const isBuyer  = user?.id === txn.buyer.id;
    const isSeller = user?.id === txn.seller.id;

    // ─── Echo: listen for real-time status + message updates ─────────────
    useEffect(() => {
        if (!window.Echo) return;

        const channel = window.Echo.private(`transaction.${txn.id}`);

        channel.listen('TransactionStatusUpdated', (e) => {
            setTxn(prev => ({ ...prev, ...e }));
        });

        channel.listen('TransactionMessageSent', (e) => {
            setMessages(prev => {
                if (prev.some(m => m.id === e.id)) return prev;
                return [...prev, e];
            });
        });

        return () => {
            window.Echo.leave(`transaction.${txn.id}`);
        };
    }, [txn.id]);

    // Chat form
    const [chatContent, setChatContent] = useState('');
    const [chatSending, setChatSending] = useState(false);
    const chatEndRef = useRef(null);
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        const content = chatContent.trim();
        if (!content || chatSending) return;

        // Optimistic UI — add temp message immediately
        const tempId = `temp-${Date.now()}`;
        const optimistic = {
            id: tempId,
            content,
            sender_id: user.id,
            sender: { id: user.id, name: user.name, profile_picture_url: user.profile_picture_url },
            created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, optimistic]);
        setChatContent('');

        try {
            setChatSending(true);
            const res = await fetch(route('messages.store', txn.id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
                },
                body: JSON.stringify({ content }),
            });

            if (!res.ok) throw new Error('Request failed');

            const saved = await res.json();
            // Replace temp with real message (dedup with Echo)
            setMessages((prev) => {
                const withoutTemp = prev.filter((m) => m.id !== tempId);
                if (withoutTemp.some((m) => m.id === saved.id)) return withoutTemp;
                return [...withoutTemp, saved];
            });
        } catch {
            // Rollback optimistic message on error
            setMessages((prev) => prev.filter((m) => m.id !== tempId));
            setChatContent(content);
        } finally {
            setChatSending(false);
        }
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
        proofForm.post(route('transactions.uploadProof', txn.id), {
            forceFormData: true,
            onSuccess: () => { setProofPreview(null); proofForm.reset(); },
        });
    };

    // OshiGo action forms (seller)
    const packForm          = useForm({});
    const shipForm          = useForm({});
    const outForDeliveryForm = useForm({});

    // Confirm payment (seller)
    const confirmForm = useForm({});

    // Complete
    const completeForm = useForm({});
    const handleComplete = () => {
        if (!confirm('Konfirmasi barang sudah diterima?')) return;
        completeForm.patch(route('transactions.complete', txn.id));
    };

    const bank = BANK_INFO[txn.payment_method] || BANK_INFO.BCA;

    return (
        <>
            <Head title={`Transaksi #${txn.id} — OshiMerch`} />
            <div className="min-h-dvh bg-surface-50 flex flex-col">
                <Navbar />

                <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pt-[96px]">
                    {/* Back */}
                    <nav className="flex items-center gap-2 text-sm text-surface-500 mb-6">
                        <Link href={route('dashboard')} className="flex items-center gap-1.5 hover:text-surface-700 transition-colors">
                            <IconArrowLeft />
                            Dashboard
                        </Link>
                        <span>/</span>
                        <span className="text-surface-700 font-medium">Transaksi #{txn.id}</span>
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
                                    payment_status={txn.payment_status}
                                    delivery_status={txn.delivery_status}
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
                                    {txn.listing.image_url ? (
                                        <img src={txn.listing.image_url} alt={txn.listing.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-surface-300"><IconPackage /></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-primary-500 font-semibold">{txn.listing.featured_member_name}</p>
                                    <h3 className="font-bold text-surface-900 leading-snug mt-0.5 line-clamp-2">{txn.listing.title}</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="px-2 py-0.5 rounded-md bg-surface-100 text-surface-600 text-[11px] font-semibold">{txn.listing.condition}</span>
                                        {txn.listing.featured_member_team && (
                                            <span className="px-2 py-0.5 rounded-md bg-primary-50 text-primary-600 text-[11px] font-semibold">{txn.listing.featured_member_team}</span>
                                        )}
                                    </div>
                                    <p className="text-lg font-bold text-surface-900 mt-3">Rp{txn.item_price.toLocaleString('id-ID')}</p>
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
                                        <p className="font-semibold text-surface-800">{txn.recipient_name}</p>
                                        {txn.recipient_phone && <p className="text-surface-500 text-xs">{txn.recipient_phone}</p>}
                                    </div>
                                    <div>
                                        <p className="text-xs text-surface-500 mb-0.5">Metode Bayar</p>
                                        <p className="font-semibold text-surface-800">{bank.icon} {transaction.payment_method}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-surface-500 mb-0.5">Alamat</p>
                                        <p className="text-surface-700 leading-relaxed">{txn.shipping_address}</p>
                                    </div>
                                    {txn.shipping_province && (
                                        <div>
                                            <p className="text-xs text-surface-500 mb-0.5">Provinsi</p>
                                            <p className="font-semibold text-surface-800">{txn.shipping_province}</p>
                                        </div>
                                    )}
                                    {txn.shipping_fee > 0 && (
                                        <div>
                                            <p className="text-xs text-surface-500 mb-0.5">Ongkos Kirim</p>
                                            <p className="font-semibold text-surface-800">Rp{txn.shipping_fee.toLocaleString('id-ID')}</p>
                                        </div>
                                    )}
                                    {txn.shipping_resi && (
                                        <div className="col-span-2">
                                            <p className="text-xs text-surface-500 mb-0.5">Nomor Resi</p>
                                            <p className="font-bold text-primary-600">{txn.shipping_resi}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* OshiGo tracking card — visible to both parties once packed */}
                            {txn.oshigo_tracking_number && (
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.12 }}
                                    className="bg-white rounded-2xl border-2 border-blue-200 p-5 shadow-card"
                                >
                                    <div className="flex items-center gap-4">
                                        <img src="/images/oshigo_logo.png" alt="OshiGo" className="h-10 object-contain shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-blue-500 font-bold uppercase tracking-widest mb-0.5">Nomor Tracking OshiGo</p>
                                            <p className="font-mono font-black text-xl text-blue-900 tracking-widest">{txn.oshigo_tracking_number}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-5 gap-1 text-[10px] text-center">
                                        {['Packing','Dikirim','Di Jalan','Diterima'].map((label, i) => {
                                            const statuses = ['Packed','Shipped','OutForDelivery','Delivered'];
                                            const idx = statuses.indexOf(txn.delivery_status);
                                            const done    = i < idx;
                                            const current = i === idx;
                                            return (
                                                <div key={label} className="flex flex-col items-center gap-1 col-span-1">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                                                        done    ? 'bg-blue-500 border-blue-500 text-white' :
                                                        current ? 'bg-white border-blue-500 text-blue-600 ring-2 ring-blue-200' :
                                                                  'bg-white border-surface-200 text-surface-300'
                                                    }`}>{done ? '✓' : i + 1}</div>
                                                    <span className={`leading-tight font-semibold ${done || current ? 'text-blue-600' : 'text-surface-400'}`}>{label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {/* Payment instruction (buyer, pending) */}
                            {isBuyer && txn.payment_status === 'Pending' && (
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
                                        <span className="font-bold text-primary-600 text-lg">Rp{txn.total_price.toLocaleString('id-ID')}</span>
                                    </div>
                                    {txn.shipping_fee > 0 && (
                                        <div className="flex flex-col gap-1 bg-white border border-amber-200 rounded-xl px-4 py-3 text-sm">
                                            <div className="flex justify-between text-surface-500">
                                                <span>Harga Barang</span>
                                                <span>Rp{txn.item_price.toLocaleString('id-ID')}</span>
                                            </div>
                                            <div className="flex justify-between text-surface-500">
                                                <span>Ongkos Kirim ({txn.shipping_province})</span>
                                                <span>Rp{txn.shipping_fee.toLocaleString('id-ID')}</span>
                                            </div>
                                        </div>
                                    )}
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
                                                    <span className="text-amber-500"><IconUpload /></span>
                                                    <span className="text-sm font-medium text-amber-700">Klik untuk upload bukti transfer</span>
                                                    <span className="text-xs text-amber-600">JPG, PNG, max 4MB</span>
                                                </>
                                            )}
                                            <input type="file" accept="image/*" onChange={handleProofChange} className="sr-only" />
                                        </label>
                                        {proofPreview && (
                                            <button type="submit" disabled={proofForm.processing}
                                                className="w-full py-3 rounded-xl gradient-primary text-white font-bold text-sm shadow-glow-primary hover:shadow-xl transition-all disabled:opacity-60">
                                                {proofForm.processing ? 'Mengupload...' : 'Upload Bukti Pembayaran'}
                                            </button>
                                        )}
                                    </form>
                                </motion.div>
                            )}

                            {/* Seller: buyer uploaded proof → seller must CONFIRM first (Opsi B) */}
                            {isSeller && txn.payment_status === 'Paid' && (
                                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                    className="bg-amber-50 rounded-2xl border-2 border-amber-300 p-5 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-amber-600"><IconShieldCheck /></span>
                                        <h2 className="text-sm font-bold text-amber-800">Verifikasi Bukti Pembayaran</h2>
                                    </div>
                                    <p className="text-xs text-amber-700">Pembeli telah mengupload bukti transfer. Periksa foto di bawah, lalu konfirmasi jika pembayaran valid.</p>
                                    {txn.proof_url && (
                                        <a href={txn.proof_url} target="_blank" rel="noopener noreferrer">
                                            <img src={txn.proof_url} alt="Bukti bayar" className="max-h-52 rounded-xl object-contain border-2 border-amber-200 w-full" />
                                        </a>
                                    )}
                                    <div className="flex gap-3">
                                        <button onClick={() => confirmForm.patch(route('transactions.confirmPayment', txn.id))}
                                            disabled={confirmForm.processing}
                                            className="flex-1 py-3 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-colors disabled:opacity-60">
                                            {confirmForm.processing ? 'Mengkonfirmasi...' : '✅ Konfirmasi Pembayaran Valid'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Seller: payment confirmed → Pack & generate tracking */}
                            {isSeller && txn.payment_status === 'Confirmed' && txn.delivery_status === 'Pending' && (
                                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                    className="bg-green-50 rounded-2xl border border-green-200 p-5 space-y-3">
                                    <h2 className="text-sm font-bold text-green-800">✅ Pembayaran Dikonfirmasi — Siapkan Pesanan</h2>
                                    <p className="text-xs text-green-700">Klik tombol di bawah untuk generate nomor tracking OshiGo dan mulai packing barang.</p>
                                    <button
                                        onClick={() => packForm.patch(route('transactions.pack', txn.id))}
                                        disabled={packForm.processing}
                                        className="w-full py-3 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                                        {packForm.processing ? 'Memproses...' : '📦 Pack & Generate Tracking OshiGo'}
                                    </button>
                                </motion.div>
                            )}

                            {/* Seller: packed → mark shipped */}
                            {isSeller && txn.delivery_status === 'Packed' && (
                                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                    className="bg-blue-50 rounded-2xl border border-blue-200 p-5 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <img src="/images/oshigo_logo.png" alt="OshiGo" className="h-7 object-contain" />
                                        <div>
                                            <p className="text-xs text-blue-500 font-semibold">Nomor Tracking</p>
                                            <p className="font-mono font-bold text-blue-900 text-base">{txn.oshigo_tracking_number}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-blue-700">Barang sudah dipacking? Klik di bawah setelah diserahkan ke kurir OshiGo.</p>
                                    <button
                                        onClick={() => shipForm.patch(route('transactions.ship', txn.id))}
                                        disabled={shipForm.processing}
                                        className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60">
                                        {shipForm.processing ? 'Memproses...' : '🚚 Tandai Sudah Dikirim'}
                                    </button>
                                </motion.div>
                            )}

                            {/* Seller: shipped → mark out for delivery */}
                            {isSeller && txn.delivery_status === 'Shipped' && (
                                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                    className="bg-purple-50 rounded-2xl border border-purple-200 p-5 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <img src="/images/oshigo_logo.png" alt="OshiGo" className="h-7 object-contain" />
                                        <div>
                                            <p className="text-xs text-purple-500 font-semibold">Tracking</p>
                                            <p className="font-mono font-bold text-purple-900 text-sm">{txn.oshigo_tracking_number}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => outForDeliveryForm.patch(route('transactions.outForDelivery', txn.id))}
                                        disabled={outForDeliveryForm.processing}
                                        className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 transition-colors disabled:opacity-60">
                                        {outForDeliveryForm.processing ? 'Memproses...' : '📍 Tandai Dalam Perjalanan'}
                                    </button>
                                </motion.div>
                            )}

                            {/* Buyer: out for delivery — confirm received */}
                            {isBuyer && txn.delivery_status === 'OutForDelivery' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-blue-50 rounded-2xl border border-blue-200 p-5 flex items-center justify-between gap-4"
                                >
                                    <div>
                                        <p className="font-bold text-blue-800 text-sm">🚚 Barang Sedang Dalam Perjalanan</p>
                                        {txn.oshigo_tracking_number && (
                                            <p className="text-xs text-blue-600 mt-0.5 font-mono">Tracking: <span className="font-bold">{txn.oshigo_tracking_number}</span></p>
                                        )}
                                        <p className="text-xs text-blue-500 mt-1">Sudah terima barang? Konfirmasi di sini.</p>
                                    </div>
                                    <button
                                        onClick={handleComplete}
                                        disabled={completeForm.processing}
                                        className="shrink-0 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
                                    >
                                        Diterima ✓
                                    </button>
                                </motion.div>
                            )}

                            {/* Delivered */}
                            {txn.delivery_status === 'Delivered' && (
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

                            {/* Review Form — buyer only, transaction delivered, not yet reviewed */}
                            {isBuyer && txn.delivery_status === 'Delivered' && !txn.has_review && (
                                <ReviewForm transactionId={txn.id} sellerId={txn.seller.id} sellerName={txn.seller.name} />
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
                                    {[txn.buyer, txn.seller].map((u, i) => (
                                        <img
                                            key={i}
                                            src={u.profile_picture_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=FF1100&color=fff&size=40`}
                                            alt={u.name}
                                            className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                        />
                                    ))}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-surface-900">
                                        {isBuyer ? txn.seller.name : txn.buyer.name}
                                    </p>
                                    <p className="text-[10px] text-surface-500">
                                        {isBuyer ? 'Penjual' : 'Pembeli'}
                                    </p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center">
                                        <p className="text-3xl mb-2">💬</p>
                                        <p className="text-sm text-surface-500 font-medium">Belum ada pesan.</p>
                                        <p className="text-xs text-surface-400 mt-1">Mulai chat untuk negosiasi atau tanyakan detail barang.</p>
                                    </div>
                                ) : (
                                    messages.map(msg => (
                                        <ChatBubble key={msg.id} message={msg} currentUserId={user?.id} />
                                    ))
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Chat input */}
                            <form onSubmit={sendMessage} className="flex items-end gap-2 px-3 py-3 border-t border-surface-100">
                                <textarea
                                    value={chatContent}
                                    onChange={e => setChatContent(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e); } }}
                                    placeholder="Ketik pesan..."
                                    rows={1}
                                    className="flex-1 resize-none rounded-xl border border-surface-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 max-h-28"
                                />
                                <button type="submit"
                                    disabled={chatSending || !chatContent.trim()}
                                    className="p-2.5 rounded-xl gradient-primary text-white shadow-glow-primary hover:shadow-xl transition-all disabled:opacity-40">
                                    <IconSend />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </main>
            </div>
        </>
    );
}
