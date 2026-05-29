import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// ── Raw SVG Icons (no Lucide dependency) ─────────────────────────────────────
const IconArrowLeft = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const IconPackage = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const IconCheck = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
const IconTruck = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17H7A5 5 0 0117 7h2a3 3 0 013 3v4a1 1 0 01-1 1h-1m-9 0H7m2 0a2 2 0 104 0m-4 0a2 2 0 004 0m5 0a2 2 0 104 0m-4 0a2 2 0 004 0" /></svg>;
const IconUpload = () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const IconStar = ({ filled }) => <svg className={`w-8 h-8 transition-all ${filled ? 'text-[#FEF08A] fill-[#FEF08A] drop-shadow-[2px_2px_0_#0f172a] -translate-y-1' : 'text-surface-900 stroke-surface-900 drop-shadow-[1px_1px_0_#0f172a]'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
const IconShieldCheck = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const IconBox = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>;
const IconMapPin = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
import Navbar from '@/Components/Navbar';

// ── Status helpers ────────────────────────────────────────────────────────────

const STEPS = [
    { key: 'order', label: 'DIBUAT', Icon: IconPackage },
    { key: 'paid', label: 'DIBAYAR', Icon: IconCheck },
    { key: 'confirmed', label: 'KONFIRMASI', Icon: IconShieldCheck },
    { key: 'packed', label: 'PACKING', Icon: IconBox },
    { key: 'shipped', label: 'MENUNGGU KURIR', Icon: IconTruck },
    { key: 'out_for_delivery', label: 'DIANTAR KURIR', Icon: IconMapPin },
    { key: 'delivered', label: 'DITERIMA', Icon: IconCheck },
];

function getActiveStep(payment_status, delivery_status) {
    if (delivery_status === 'Delivered') return 6;
    if (delivery_status === 'OutForDelivery') return 5;
    if (delivery_status === 'Shipped') return 4;
    if (delivery_status === 'Packed') return 3;
    if (payment_status === 'Confirmed') return 2;
    if (payment_status === 'Paid') return 1;
    return 0;
}


// ── Sub-components ────────────────────────────────────────────────────────────

function StatusTracker({ payment_status, delivery_status }) {
    const active = getActiveStep(payment_status, delivery_status);

    return (
        <div className="overflow-x-auto scrollbar-hide pb-4">
            <div className="flex items-start gap-0 mt-8 mb-2 min-w-[700px] px-2">
                {STEPS.map(({ key, label, Icon }, i) => {
                    const done = i < active;
                    const current = i === active;
                    return (
                        <div key={key} className="flex-1 flex flex-col items-center relative group">
                            {i < STEPS.length - 1 && (
                                <div className={`absolute top-6 left-1/2 w-full h-2 border-y-4 border-surface-900 transition-colors duration-500 z-0 ${done ? 'bg-[#A7F3D0]' : 'bg-surface-200'}`} />
                            )}
                            <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center border-4 transition-all duration-500 shadow-[4px_4px_0_0_#0f172a] transform ${done ? 'bg-[#A7F3D0] border-surface-900 text-surface-900 -rotate-3' :
                                current ? 'bg-[#FEF08A] border-surface-900 text-surface-900 scale-110 rotate-3' :
                                    'bg-white border-surface-900 text-surface-400'
                                }`}>
                                <Icon />
                            </div>
                            <div className="mt-3 text-center relative z-10">
                                <span className={`inline-block text-[10px] font-black leading-tight uppercase tracking-wider ${done || current ? 'text-surface-900 bg-[#FEF08A] px-2 py-0.5 border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a]' : 'text-surface-400'
                                    }`}>{label}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}


// ── Payment Countdown ─────────────────────────────────────────────────────────

function PaymentCountdown({ deadline }) {
    const calc = () => {
        const diff = new Date(deadline) - new Date();
        if (diff <= 0) return { str: 'HABIS', urgent: true };
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        return {
            str: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
            urgent: diff < 2 * 3600000,
        };
    };
    const [display, setDisplay] = useState(calc);
    useEffect(() => {
        const timer = setInterval(() => setDisplay(calc()), 1000);
        return () => clearInterval(timer);
    }, [deadline]);
    return (
        <div className={`flex items-center gap-4 p-4 rounded-2xl border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] ${display.urgent ? 'bg-red-400 animate-pulse' : 'bg-[#FEF08A]'}`}>
            <span className="text-3xl">⏰</span>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-surface-900">Batas Waktu Bayar</p>
                <p className={`text-2xl font-black font-mono tracking-widest ${display.urgent ? 'text-white' : 'text-surface-900'}`}>{display.str}</p>
            </div>
        </div>
    );
}

// ── Review Form ───────────────────────────────────────────────────────────────

function ReviewForm({ transactionId, sellerName }) {
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({ rating: 5, comment: '', photos: [] });
    const [hoveredStar, setHoveredStar] = useState(0);
    const [photoPreviews, setPhotoPreviews] = useState([]);
    const fileInputRef = useRef(null);

    const handlePhotoSelect = (e) => {
        const incoming = Array.from(e.target.files);
        const combined = [...data.photos, ...incoming].slice(0, 3);
        setData('photos', combined);
        setPhotoPreviews(combined.map(f => URL.createObjectURL(f)));
        e.target.value = '';
    };

    const removePhoto = (idx) => {
        const newPhotos = data.photos.filter((_, i) => i !== idx);
        setData('photos', newPhotos);
        setPhotoPreviews(newPhotos.map(f => URL.createObjectURL(f)));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('reviews.store', transactionId), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setPhotoPreviews([]);
                // GA4: track review submission
                if (typeof window.gtag === 'function') {
                    window.gtag('event', 'review_submitted', {
                        transaction_id: String(transactionId),
                        rating: data.rating,
                        event_category: 'engagement',
                    });
                }
            },
            preserveScroll: true,
        });
    };

    if (recentlySuccessful) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-[#A7F3D0] border-4 border-surface-900 rounded-3xl p-6 text-center shadow-[6px_6px_0_0_#0f172a] transform -rotate-1">
                <p className="text-4xl mb-2 drop-shadow-[2px_2px_0_#0f172a]">⭐</p>
                <p className="font-black text-surface-900 text-xl uppercase tracking-widest">ULASAN TERKIRIM!</p>
                <p className="font-bold text-surface-900 mt-2 bg-white inline-block px-3 py-1 border-2 border-surface-900 rounded-xl">Terima kasih atas feedbacknya.</p>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#FEF08A] rounded-3xl border-4 border-surface-900 p-6 space-y-5 shadow-[8px_8px_0_0_#0f172a] transform rotate-1">
            <h3 className="font-black font-display text-surface-900 text-2xl uppercase tracking-tighter" style={{ textShadow: '2px 2px 0px white' }}>BERI ULASAN UNTUK {sellerName}</h3>
            <div className="flex items-center gap-2 bg-white border-4 border-surface-900 rounded-2xl p-4 shadow-[4px_4px_0_0_#0f172a]">
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                        <button key={i} type="button"
                            onMouseEnter={() => setHoveredStar(i)}
                            onMouseLeave={() => setHoveredStar(0)}
                            onClick={() => setData('rating', i)}
                            className="focus:outline-none transition-transform hover:scale-110">
                            <IconStar filled={i <= (hoveredStar || data.rating)} />
                        </button>
                    ))}
                </div>
                <span className="text-xl font-black text-surface-900 ml-4 bg-[#BAE6FD] px-3 py-1 border-4 border-surface-900 rounded-xl shadow-[2px_2px_0_0_#0f172a]">{data.rating}/5</span>
            </div>
            <div className="relative">
                <textarea value={data.comment} onChange={e => setData('comment', e.target.value)}
                    placeholder="Ceritakan pengalamanmu bertransaksi dengan penjual ini..."
                    rows={4} className="w-full px-5 py-4 rounded-2xl border-4 border-surface-900 text-sm font-bold uppercase focus:outline-none focus:bg-[#BAE6FD] resize-none shadow-[4px_4px_0_0_#0f172a] transition-all" />
                {errors.rating && <p className="text-xs font-black text-[#f43f5e] mt-2 bg-white inline-block px-2 border-2 border-surface-900">{errors.rating}</p>}
            </div>

            {/* Photo picker */}
            <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-surface-900 bg-white inline-block px-2 border-2 border-surface-900">📸 FOTO ULASAN (opsional, maks 3)</p>
                {photoPreviews.length > 0 && (
                    <div className="flex gap-3 flex-wrap">
                        {photoPreviews.map((src, i) => (
                            <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border-4 border-surface-900 shadow-[2px_2px_0_0_#0f172a]">
                                <img src={src} alt={`foto ${i + 1}`} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removePhoto(i)}
                                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-black flex items-center justify-center border-2 border-white shadow leading-none">
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                {photoPreviews.length < 3 && (
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border-4 border-surface-900 bg-white shadow-[2px_2px_0_0_#0f172a] font-black text-sm uppercase tracking-wide hover:bg-[#BAE6FD] transition-colors active:translate-y-0.5 active:shadow-none">
                        <span>📷</span> Tambah Foto
                    </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/jpg,image/jpeg,image/png,image/webp"
                    multiple className="hidden" onChange={handlePhotoSelect} />
                {errors.photos && <p className="text-xs font-black text-[#f43f5e] bg-white inline-block px-2 border-2 border-surface-900">{errors.photos}</p>}
            </div>

            <button onClick={submit} disabled={processing}
                className="w-full py-4 rounded-xl bg-surface-900 text-white font-black text-sm uppercase tracking-widest shadow-[4px_4px_0_0_#0f172a] hover:bg-white hover:text-surface-900 hover:border-surface-900 border-4 border-transparent transition-all active:translate-y-1 active:translate-x-1 active:shadow-none disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0">
                {processing ? 'MENGIRIM...' : 'KIRIM ULASAN ⭐'}
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

    // Sync when Inertia re-renders with fresh data
    useEffect(() => {
        setTxn(initialTransaction);
    }, [initialTransaction]);

    const isBuyer = user?.id === txn.buyer?.id;
    const isSeller = user?.id === txn.seller?.id;

    // ─── GA4: fire purchase event once per transaction (buyer only) ──────
    useEffect(() => {
        if (!isBuyer) return;
        const key = `ga_purchase_fired_${txn.id}`;
        if (sessionStorage.getItem(key)) return;
        if (typeof window.gtag !== 'function') return;
        sessionStorage.setItem(key, '1');
        window.gtag('event', 'purchase', {
            transaction_id: String(txn.id),
            value: txn.item_price,
            currency: 'IDR',
            items: [{
                item_id: String(txn.listing?.id ?? txn.id),
                item_name: txn.listing?.title ?? 'Merchandise',
                item_category: txn.listing?.category ?? 'other',
                price: txn.item_price,
                quantity: 1,
            }],
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (!window.Echo) return;

        const channel = window.Echo.private(`transaction.${txn.id}`);

        channel.listen('TransactionStatusUpdated', (e) => {
            setTxn(prev => ({ ...prev, ...e }));
        });

        return () => {
            window.Echo.leave(`transaction.${txn.id}`);
        };
    }, [txn.id]);

    // ─── Poll transaction status every 3s (fallback when Reverb offline or waiting for webhook) ─
    useEffect(() => {
        if (txn.payment_status === 'Confirmed' || !isBuyer) return;

        const timer = setInterval(() => {
            router.reload({ preserveScroll: true });
        }, 3000);

        return () => clearInterval(timer);
    }, [txn.payment_status, isBuyer]);

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
    const packForm = useForm({});

    // Confirm payment (seller)
    const confirmForm = useForm({});

    // Complete
    const completeForm = useForm({});
    const [completeResult, setCompleteResult] = useState(null); // 'confirm' | null

    const handleComplete = () => {
        setCompleteResult('confirm');
    };

    const handleConfirmComplete = () => {
        completeForm.patch(route('transactions.complete', txn.uuid), {
            onSuccess: () => {
                setCompleteResult(null);
            },
            onError: () => {
                setCompleteResult(null);
            }
        });
    };

    // Midtrans Snap.js loader (Sandbox)
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '');
        document.head.appendChild(script);
        return () => {
            if (document.head.contains(script)) document.head.removeChild(script);
        };
    }, []);

    // Auto-fetch snap token if buyer is on pending transaction but token is missing
    useEffect(() => {
        if (!isBuyer || txn.payment_status !== 'Pending' || txn.midtrans_snap_token) return;

        const fetchToken = async () => {
            try {
                const res = await fetch(route('transactions.refreshSnapToken', txn.uuid), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
                    },
                });
                const data = await res.json();
                if (data.snap_token) {
                    setTxn(prev => ({ ...prev, midtrans_snap_token: data.snap_token }));
                }
            } catch (err) {
                console.error('Failed to fetch snap token:', err);
            }
        };

        fetchToken();
    }, [txn.id, txn.payment_status, txn.midtrans_snap_token, isBuyer]);

    const [paymentResult, setPaymentResult] = useState(null); // null | 'success' | 'pending' | 'error'
    const [isRefreshingToken, setIsRefreshingToken] = useState(false);

    const handleMidtransPay = () => {
        if (!txn.midtrans_snap_token || !window.snap) return;
        window.snap.pay(txn.midtrans_snap_token, {
            onSuccess: () => {
                setPaymentResult('success');
                // Show success for 1.5s, then clear popup & reload
                setTimeout(() => {
                    setPaymentResult(null);
                    setTimeout(() => router.reload(), 300);
                }, 1500);
            },
            onPending: () => {
                setPaymentResult('pending');
                // User can close manually or wait for webhook to process
                setTimeout(() => {
                    setPaymentResult(null);
                }, 3000);
            },
            onError: () => { setPaymentResult('error'); },
            onClose: () => { /* User closed popup */ },
        });
    };
    const handleChangeMethod = async () => {
        if (isRefreshingToken) return;
        setIsRefreshingToken(true);
        try {
            const res = await fetch(route('transactions.refreshSnapToken', txn.uuid), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
                },
            });
            const data = await res.json();
            if (data.snap_token) {
                setTxn(prev => ({ ...prev, midtrans_snap_token: data.snap_token }));
                if (window.snap) {
                    window.snap.pay(data.snap_token, {
                        onSuccess: () => {
                            setPaymentResult('success');
                            setTimeout(() => { setPaymentResult(null); setTimeout(() => router.reload(), 300); }, 1500);
                        },
                        onPending: () => { setPaymentResult('pending'); setTimeout(() => { setPaymentResult(null); }, 3000); },
                        onError: () => { setPaymentResult('error'); },
                        onClose: () => { },
                    });
                }
            }
        } catch (err) {
            console.error('Failed to refresh snap token:', err);
        } finally {
            setIsRefreshingToken(false);
        }
    };
    return (
        <>
            <Head title={`Transaksi #${txn.id} — OshiMerch`} />
            <div className="min-h-dvh bg-[#FAFAFA] flex flex-col font-sans selection:bg-surface-900 selection:text-[#FEF08A]">
                <Navbar />

                <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pt-[120px]">
                    {/* Back */}
                    <nav className="flex items-center gap-3 text-sm text-surface-900 font-black uppercase tracking-widest mb-8 bg-white border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] rounded-xl px-4 py-3 w-fit">
                        <Link href={route('dashboard')} className="flex items-center gap-2 hover:text-primary-600 transition-colors">
                            <IconArrowLeft />
                            DASHBOARD
                        </Link>
                        <span className="text-surface-300">/</span>
                        <span className="text-surface-900 bg-[#BAE6FD] px-2 border-2 border-surface-900">TRANSAKSI #{txn.id}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                        {/* ── Left column: order info ── */}
                        <div className="lg:col-span-7 xl:col-span-8 space-y-8">

                            {/* Status tracker */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-3xl border-4 border-surface-900 p-6 sm:p-8 shadow-[8px_8px_0_0_#0f172a]"
                            >
                                <h2 className="text-2xl font-black font-display text-surface-900 uppercase tracking-tighter mb-2" style={{ textShadow: '2px 2px 0px #FEF08A' }}>STATUS PESANAN</h2>
                                <StatusTracker
                                    payment_status={txn.payment_status}
                                    delivery_status={txn.delivery_status}
                                />
                            </motion.div>

                            {/* Listing info */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 }}
                                className="bg-[#BAE6FD] rounded-3xl border-4 border-surface-900 p-6 sm:p-8 shadow-[8px_8px_0_0_#0f172a] flex flex-col sm:flex-row gap-6 items-start"
                            >
                                <div className="w-full sm:w-32 aspect-square sm:aspect-auto sm:h-32 rounded-2xl overflow-hidden bg-white border-4 border-surface-900 shrink-0 shadow-[4px_4px_0_0_#0f172a]">
                                    {txn.listing.image_url ? (
                                        <img src={txn.listing.image_url} alt={txn.listing.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-surface-900"><IconPackage /></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 bg-white border-4 border-surface-900 p-4 rounded-2xl shadow-[4px_4px_0_0_#0f172a]">
                                    <p className="text-xs font-black uppercase tracking-widest text-surface-900 bg-[#FEF08A] inline-block px-2 border-2 border-surface-900 mb-2 transform -rotate-2">{txn.listing.featured_member_name}</p>
                                    <h3 className="text-2xl font-black font-display text-surface-900 leading-none uppercase tracking-tighter mb-3">{txn.listing.title}</h3>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="px-3 py-1 rounded-lg border-2 border-surface-900 bg-[#A7F3D0] text-surface-900 text-[10px] font-black uppercase tracking-widest">{txn.listing.condition}</span>
                                        {txn.listing.featured_member_team && (
                                            <span className="px-3 py-1 rounded-lg border-2 border-surface-900 bg-[#FECDD3] text-surface-900 text-[10px] font-black uppercase tracking-widest">{txn.listing.featured_member_team}</span>
                                        )}
                                    </div>
                                    <p className="text-3xl font-black text-surface-900 tracking-tighter" style={{ textShadow: '1px 1px 0px #BAE6FD' }}>Rp {txn.item_price.toLocaleString('id-ID')}</p>
                                </div>
                            </motion.div>

                            {/* Shipping info */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-3xl border-4 border-surface-900 p-6 sm:p-8 shadow-[8px_8px_0_0_#0f172a]"
                            >
                                <h2 className="text-2xl font-black font-display text-surface-900 uppercase tracking-tighter mb-6 pb-4 border-b-4 border-surface-900" style={{ textShadow: '2px 2px 0px #A7F3D0' }}>INFO PENGIRIMAN</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                    <div className="bg-surface-50 p-4 rounded-2xl border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a]">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-surface-500 mb-1">Penerima</p>
                                        <p className="font-black text-lg text-surface-900 uppercase tracking-tight">{txn.recipient_name}</p>
                                        {txn.recipient_phone && <p className="text-surface-900 font-bold mt-1 bg-white inline-block px-2 border-2 border-surface-900 rounded-md">{txn.recipient_phone}</p>}
                                    </div>
                                    <div className="bg-surface-50 p-4 rounded-2xl border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a]">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-surface-500 mb-1">Metode Bayar</p>
                                        <p className="font-black text-lg text-surface-900 uppercase tracking-tight">💳 {txn.payment_method ?? 'Midtrans'}</p>
                                    </div>
                                    <div className="md:col-span-2 bg-[#FEF08A] p-4 rounded-2xl border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a] transform -rotate-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-surface-900 mb-1">Alamat Lengkap</p>
                                        <p className="text-surface-900 font-bold leading-relaxed">{txn.shipping_address}</p>
                                    </div>
                                    {txn.shipping_province && (
                                        <div className="bg-white p-3 rounded-xl border-2 border-surface-900">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-surface-500">Provinsi</p>
                                            <p className="font-bold text-surface-900 uppercase">{txn.shipping_province}</p>
                                        </div>
                                    )}
                                    {txn.shipping_city && (
                                        <div className="bg-white p-3 rounded-xl border-2 border-surface-900">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-surface-500">Kota / Kabupaten</p>
                                            <p className="font-bold text-surface-900 uppercase">{txn.shipping_city}</p>
                                        </div>
                                    )}
                                    {txn.shipping_district && (
                                        <div className="bg-white p-3 rounded-xl border-2 border-surface-900">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-surface-500">Kecamatan</p>
                                            <p className="font-bold text-surface-900 uppercase">{txn.shipping_district}</p>
                                        </div>
                                    )}
                                    {txn.shipping_fee > 0 && (
                                        <div className="bg-white p-3 rounded-xl border-2 border-surface-900">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-surface-500">Ongkos Kirim</p>
                                            <p className="font-black text-surface-900">Rp {txn.shipping_fee.toLocaleString('id-ID')}</p>
                                        </div>
                                    )}
                                    {txn.shipping_resi && (
                                        <div className="md:col-span-2 bg-[#A7F3D0] p-5 rounded-2xl border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] transform rotate-1 mt-2">
                                            <p className="text-xs font-black uppercase tracking-widest text-surface-900 mb-1">NOMOR RESI KURIR</p>
                                            <p className="font-black font-mono text-2xl text-surface-900 tracking-widest bg-white p-2 border-4 border-surface-900 text-center">{txn.shipping_resi}</p>
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
                                    className="bg-white rounded-3xl border-4 border-[#3b82f6] p-6 sm:p-8 shadow-[8px_8px_0_0_#1e3a8a] relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-[#eff6ff] opacity-50 z-0"></div>
                                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                                        <div className="bg-white p-3 rounded-2xl border-4 border-[#3b82f6] shadow-[4px_4px_0_0_#1e3a8a] transform -rotate-3 group-hover:rotate-0 transition-transform">
                                            <img src="/images/oshigo_logo.png" alt="OshiGo" className="h-12 object-contain" />
                                        </div>
                                        <div className="flex-1 min-w-0 bg-white p-4 rounded-2xl border-4 border-[#3b82f6] shadow-[4px_4px_0_0_#1e3a8a]">
                                            <p className="text-xs text-[#3b82f6] font-black uppercase tracking-widest mb-1">TRACKING OSHIGO</p>
                                            <p className="font-mono font-black text-2xl md:text-3xl text-[#1e3a8a] tracking-widest break-all">{txn.oshigo_tracking_number}</p>
                                        </div>
                                    </div>
                                    <div className="relative z-10 grid grid-cols-4 gap-2 sm:gap-4 text-[10px] text-center bg-white p-4 rounded-2xl border-4 border-[#3b82f6] shadow-[4px_4px_0_0_#1e3a8a]">
                                        {['Packing', 'Menunggu Kurir', 'Diantar Kurir', 'Diterima'].map((label, i) => {
                                            const statuses = ['Packed', 'Shipped', 'OutForDelivery', 'Delivered'];
                                            const idx = statuses.indexOf(txn.delivery_status);
                                            const done = i < idx;
                                            const current = i === idx;
                                            return (
                                                <div key={label} className="flex flex-col items-center gap-2 col-span-1 relative">
                                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black border-4 transition-all ${done ? 'bg-[#3b82f6] border-[#1e3a8a] text-white shadow-[2px_2px_0_0_#1e3a8a] rotate-3' :
                                                        current ? 'bg-[#FEF08A] border-[#1e3a8a] text-[#1e3a8a] shadow-[2px_2px_0_0_#1e3a8a] scale-110 -rotate-3 animate-pulse' :
                                                            'bg-white border-[#bfdbfe] text-[#93c5fd]'
                                                        }`}>{done ? '✓' : i + 1}</div>
                                                    <span className={`leading-tight font-black uppercase tracking-widest bg-white px-1 ${done || current ? 'text-[#1e3a8a] border-2 border-[#1e3a8a]' : 'text-[#93c5fd] border-2 border-transparent'}`}>{label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {/* Payment instruction (buyer, pending) — Midtrans */}
                            {isBuyer && txn.payment_status === 'Pending' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className="bg-[#FEF08A] rounded-3xl border-4 border-surface-900 p-6 sm:p-8 space-y-6 shadow-[8px_8px_0_0_#0f172a] relative"
                                >
                                    <div className="absolute top-4 right-4 text-4xl transform rotate-12 drop-shadow-[2px_2px_0_#0f172a]">💳</div>
                                    <h2 className="text-2xl font-black font-display text-surface-900 uppercase tracking-tighter" style={{ textShadow: '2px 2px 0px white' }}>SELESAIKAN PEMBAYARAN</h2>

                                    {/* Payment deadline countdown */}
                                    {txn.payment_deadline && (
                                        <PaymentCountdown deadline={txn.payment_deadline} />
                                    )}

                                    {/* Payment summary */}
                                    <div className="bg-white border-4 border-surface-900 rounded-2xl p-5 shadow-[4px_4px_0_0_#0f172a]">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex justify-between items-center text-sm font-bold text-surface-700 pb-2 border-b-2 border-surface-200">
                                                <span className="uppercase tracking-widest">Harga Barang</span>
                                                <span className="font-black text-surface-900">Rp {txn.item_price.toLocaleString('id-ID')}</span>
                                            </div>
                                            {txn.shipping_fee > 0 && (
                                                <div className="flex justify-between items-center text-sm font-bold text-surface-700 pb-2 border-b-2 border-surface-200">
                                                    <span className="uppercase tracking-widest">Ongkir OshiGo ({txn.shipping_province})</span>
                                                    <span className="font-black text-surface-900">Rp {txn.shipping_fee.toLocaleString('id-ID')}</span>
                                                </div>
                                            )}
                                            <div className="flex flex-col sm:flex-row justify-between items-center bg-[#FECDD3] p-4 rounded-xl border-4 border-surface-900 shadow-[2px_2px_0_0_#0f172a] mt-2 gap-2 transform rotate-1">
                                                <span className="font-black uppercase tracking-widest text-surface-900">Total Bayar</span>
                                                <span className="font-black font-display text-3xl text-surface-900 tracking-tighter bg-white px-3 py-1 border-4 border-surface-900 shadow-[2px_2px_0_0_#0f172a] -rotate-2">Rp {txn.total_price.toLocaleString('id-ID')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Available payment methods info */}
                                    <div className="flex items-start gap-4 bg-[#A7F3D0] border-4 border-surface-900 rounded-2xl p-4 shadow-[4px_4px_0_0_#0f172a] transform -rotate-1">
                                        <span className="text-3xl shrink-0">🔒</span>
                                        <div>
                                            <p className="font-black text-surface-900 uppercase tracking-wide text-sm mb-1">Dibayar via Midtrans (Aman & Terverifikasi)</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {['GoPay', 'OVO', 'DANA', 'QRIS', 'BCA', 'Mandiri', 'BNI', 'BRI'].map(m => (
                                                    <span key={m} className="px-2 py-1 bg-white border-2 border-surface-900 rounded text-[10px] font-black uppercase shadow-[1px_1px_0_0_#0f172a]">{m}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Midtrans Pay button */}
                                    {txn.midtrans_snap_token ? (
                                        <button
                                            onClick={handleMidtransPay}
                                            className="w-full py-5 rounded-xl bg-surface-900 text-white border-4 border-transparent font-black text-lg sm:text-xl uppercase tracking-widest shadow-[6px_6px_0_0_#0f172a] hover:bg-[#A7F3D0] hover:text-surface-900 hover:border-surface-900 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#0f172a] transition-all active:translate-y-1 active:translate-x-1 active:shadow-none flex items-center justify-center gap-3"
                                        >
                                            🔒 BAYAR SEKARANG VIA MIDTRANS
                                        </button>
                                    ) : (
                                        <div className="w-full py-4 rounded-xl bg-surface-200 border-4 border-surface-400 text-surface-500 font-black text-center uppercase tracking-widest">
                                            ⏳ Memuat sistem pembayaran...
                                        </div>
                                    )}

                                    {/* Change payment method */}
                                    {txn.midtrans_snap_token && (
                                        <button
                                            onClick={handleChangeMethod}
                                            disabled={isRefreshingToken}
                                            className="w-full py-3 rounded-xl bg-white text-surface-900 border-4 border-surface-900 font-black text-sm uppercase tracking-widest shadow-[4px_4px_0_0_#0f172a] hover:bg-[#BAE6FD] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all active:translate-y-1 active:translate-x-1 active:shadow-none disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isRefreshingToken ? '⏳ MEMUAT...' : '🔄 GANTI METODE PEMBAYARAN'}
                                        </button>
                                    )}
                                </motion.div>
                            )}

                            {/* Seller: buyer uploaded proof → waiting for ADMIN to confirm */}
                            {isSeller && txn.payment_status === 'Paid' && (
                                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                    className="bg-[#FEF08A] rounded-3xl border-4 border-surface-900 p-6 sm:p-8 space-y-6 shadow-[8px_8px_0_0_#0f172a]">
                                    <div className="flex items-center gap-4 bg-white p-4 border-4 border-surface-900 rounded-2xl shadow-[4px_4px_0_0_#0f172a] transform -rotate-1">
                                        <div className="w-12 h-12 bg-[#BAE6FD] border-4 border-surface-900 rounded-xl flex items-center justify-center text-surface-900 shadow-[2px_2px_0_0_#0f172a]">
                                            <IconShieldCheck />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-surface-500 mb-1">STATUS PEMBAYARAN</p>
                                            <h2 className="text-xl font-black font-display text-surface-900 uppercase tracking-tighter leading-none">MENUNGGU KONFIRMASI ADMIN</h2>
                                        </div>
                                    </div>
                                    {txn.proof_url && (
                                        <div className="space-y-2">
                                            <p className="text-xs font-black uppercase tracking-widest text-surface-900 bg-white inline-block px-2 border-2 border-surface-900">BUKTI TRANSFER PEMBELI</p>
                                            <a href={txn.proof_url} target="_blank" rel="noopener noreferrer" className="block transform rotate-1 hover:rotate-0 transition-transform">
                                                <img src={txn.proof_url} alt="Bukti bayar" className="max-h-64 object-contain border-4 border-surface-900 rounded-2xl shadow-[6px_6px_0_0_#0f172a] w-full bg-white" />
                                            </a>
                                        </div>
                                    )}
                                    <p className="text-sm font-bold text-surface-900 bg-white p-4 border-2 border-surface-900 rounded-xl shadow-[2px_2px_0_0_#0f172a] leading-relaxed">
                                        ⏳ Pembeli sudah mengirim bukti transfer. Admin OshiMerch sedang memverifikasi pembayaran. Kamu akan diberitahu segera setelah konfirmasi selesai.
                                    </p>
                                </motion.div>
                            )}

                            {/* Seller: payment confirmed → Pack & generate tracking */}
                            {isSeller && txn.payment_status === 'Confirmed' && txn.delivery_status === 'Pending' && (
                                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                    className="bg-[#FEF08A] rounded-3xl border-4 border-surface-900 p-6 sm:p-8 space-y-6 shadow-[8px_8px_0_0_#0f172a]">
                                    <div className="bg-white border-4 border-surface-900 p-4 rounded-2xl shadow-[4px_4px_0_0_#0f172a] text-center transform rotate-1">
                                        <h2 className="text-xl sm:text-2xl font-black font-display text-surface-900 uppercase tracking-tighter mb-2">✅ PEMBAYARAN DIKONFIRMASI</h2>
                                        <p className="text-xs font-black text-surface-900 uppercase tracking-widest bg-[#BAE6FD] inline-block px-2 border-2 border-surface-900 mt-1">SIAPKAN PESANAN</p>
                                    </div>
                                    {/* Ship deadline */}
                                    {txn.ship_deadline && (() => {
                                        const deadline = new Date(txn.ship_deadline);
                                        const now = new Date();
                                        const hoursLeft = (deadline - now) / 3600000;
                                        const isWarning = hoursLeft < 24;
                                        return (
                                            <div className={`flex items-center gap-3 p-4 rounded-2xl border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] ${isWarning ? 'bg-red-400' : 'bg-[#A7F3D0]'}`}>
                                                <span className="text-2xl">📦</span>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-surface-900">Tenggat Kirim</p>
                                                    <p className={`font-black text-lg ${isWarning ? 'text-white' : 'text-surface-900'}`}>
                                                        {deadline.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </p>
                                                    {isWarning && <p className="text-white font-bold text-xs mt-0.5">⚠️ Segera kirim sebelum tenggat habis!</p>}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                    <p className="text-sm font-bold text-surface-900 bg-white p-4 border-2 border-surface-900 rounded-xl shadow-[2px_2px_0_0_#0f172a] text-center transform -rotate-1">
                                        Klik tombol di bawah setelah barang selesai di-packing. Nomor tracking OshiGo akan di-generate otomatis.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => packForm.patch(route('transactions.pack', txn.uuid))}
                                        disabled={packForm.processing}
                                        className="w-full py-5 rounded-xl bg-surface-900 text-white border-4 border-transparent font-black text-lg sm:text-xl uppercase tracking-widest shadow-[6px_6px_0_0_#0f172a] hover:bg-[#A7F3D0] hover:text-surface-900 hover:border-surface-900 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#0f172a] transition-all active:translate-y-1 active:translate-x-1 active:shadow-none flex items-center justify-center gap-3">
                                        <IconBox /> {packForm.processing ? 'MEMPROSES...' : 'SELESAI PACKING'}
                                    </button>
                                </motion.div>
                            )}

                            {/* Seller: packed → waiting for OshiGo to pick up */}
                            {isSeller && txn.delivery_status === 'Packed' && (
                                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                    className="bg-[#BAE6FD] rounded-3xl border-4 border-surface-900 p-6 sm:p-8 space-y-6 shadow-[8px_8px_0_0_#0f172a]">
                                    <div className="flex flex-col sm:flex-row items-center gap-6 bg-white p-5 rounded-2xl border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] transform -rotate-1">
                                        <div className="bg-[#eff6ff] p-3 rounded-xl border-4 border-[#3b82f6] shadow-[2px_2px_0_0_#1e3a8a] transform rotate-2">
                                            <img src="/images/oshigo_logo.png" alt="OshiGo" className="h-8 object-contain" />
                                        </div>
                                        <div className="text-center sm:text-left">
                                            <p className="text-[10px] text-surface-900 font-black uppercase tracking-widest bg-[#FEF08A] inline-block px-2 border-2 border-surface-900 mb-1">NOMOR TRACKING</p>
                                            <p className="font-mono font-black text-2xl md:text-3xl text-surface-900 tracking-tighter">{txn.oshigo_tracking_number}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white border-4 border-surface-900 rounded-2xl p-4 shadow-[4px_4px_0_0_#0f172a]">
                                        <p className="font-black text-surface-900 uppercase tracking-wide text-sm mb-1">📦 Barang telah di-packing!</p>
                                        <p className="text-sm font-bold text-surface-700">Tunggu kurir OshiGo datang mengambil paket. Admin OshiMerch akan memperbarui status pengiriman saat paket diambil.</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Buyer: shipped → info OshiGo is on the way */}
                            {isBuyer && txn.delivery_status === 'Shipped' && (
                                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                    className="bg-[#FECDD3] rounded-3xl border-4 border-surface-900 p-6 sm:p-8 space-y-4 shadow-[8px_8px_0_0_#0f172a]">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-5 rounded-2xl border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] transform rotate-1">
                                        <div className="text-center sm:text-left">
                                            <p className="text-[10px] text-surface-900 font-black uppercase tracking-widest bg-[#A7F3D0] inline-block px-2 border-2 border-surface-900 mb-1">TRACKING</p>
                                            <p className="font-mono font-black text-xl text-surface-900">{txn.oshigo_tracking_number}</p>
                                        </div>
                                        <div className="bg-[#eff6ff] p-2 rounded-xl border-4 border-[#3b82f6] shadow-[2px_2px_0_0_#1e3a8a] transform -rotate-3">
                                            <img src="/images/oshigo_logo.png" alt="OshiGo" className="h-6 object-contain" />
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-surface-900 bg-white p-4 border-2 border-surface-900 rounded-xl shadow-[2px_2px_0_0_#0f172a] text-center">
                                        � Paketmu sedang menunggu dijemput kurir OshiGo. Pantau statusnya di sini.
                                    </p>
                                </motion.div>
                            )}

                            {/* Buyer: out for delivery — confirm received */}
                            {isBuyer && txn.delivery_status === 'OutForDelivery' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-[#BAE6FD] rounded-3xl border-4 border-surface-900 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[8px_8px_0_0_#0f172a]"
                                >
                                    <div className="bg-white p-5 rounded-2xl border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] w-full md:w-auto transform -rotate-1">
                                        <p className="font-black font-display text-surface-900 text-xl uppercase tracking-tighter">� DIANTAR KURIR!</p>
                                        {txn.oshigo_tracking_number && (
                                            <p className="text-xs text-surface-900 font-black mt-2 font-mono bg-[#FEF08A] inline-block px-2 border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a]">TRACKING: {txn.oshigo_tracking_number}</p>
                                        )}
                                        <p className="text-sm font-bold text-surface-900 mt-3">Sudah terima barang? Konfirmasi di sini.</p>
                                    </div>
                                    <button
                                        onClick={handleComplete}
                                        disabled={completeForm.processing}
                                        className="w-full md:w-auto shrink-0 px-8 py-5 rounded-xl bg-surface-900 text-white border-4 border-transparent font-black text-lg uppercase tracking-widest shadow-[6px_6px_0_0_#0f172a] hover:bg-[#A7F3D0] hover:text-surface-900 hover:border-surface-900 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#0f172a] transition-all active:translate-y-1 active:translate-x-1 active:shadow-none"
                                    >
                                        DITERIMA ✓
                                    </button>
                                </motion.div>
                            )}

                            {/* Delivered */}
                            {txn.delivery_status === 'Delivered' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-[#A7F3D0] rounded-3xl border-4 border-surface-900 p-8 text-center shadow-[8px_8px_0_0_#0f172a] relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.2]" />
                                    <div className="relative z-10">
                                        <div className="w-24 h-24 bg-white border-4 border-surface-900 rounded-3xl mx-auto flex items-center justify-center text-5xl shadow-[4px_4px_0_0_#0f172a] mb-6 transform rotate-6 group-hover:rotate-0 transition-transform">
                                            🎉
                                        </div>
                                        <p className="font-black font-display text-4xl sm:text-5xl text-surface-900 uppercase tracking-tighter mb-4" style={{ textShadow: '2px 2px 0px white' }}>TRANSAKSI SELESAI!</p>
                                        <p className="font-black text-surface-900 text-sm uppercase tracking-widest bg-white inline-block px-4 py-2 border-4 border-surface-900 rounded-xl shadow-[4px_4px_0_0_#0f172a] transform -rotate-2">Terima kasih sudah berbelanja di OshiMerch.</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Review Form — buyer only, transaction delivered, not yet reviewed */}
                            {isBuyer && txn.delivery_status === 'Delivered' && !txn.has_review && (
                                <ReviewForm transactionId={txn.uuid} sellerId={txn.seller.id} sellerName={txn.seller.name} />
                            )}
                        </div>

                        {/* ── Right column: link to private chat ── */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 }}
                            className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28 z-10 h-fit space-y-6"
                        >
                            {/* Chat card */}
                            <div className="bg-[#BAE6FD] rounded-3xl border-4 border-surface-900 p-6 shadow-[8px_8px_0_0_#0f172a]">
                                <div className="flex items-center gap-4 mb-5">
                                    <img
                                        src={(isBuyer ? txn.seller : txn.buyer).profile_picture_url ||
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent((isBuyer ? txn.seller : txn.buyer).name)}&background=FF1100&color=fff&size=48`}
                                        alt={(isBuyer ? txn.seller : txn.buyer).name}
                                        className="w-14 h-14 rounded-full border-4 border-surface-900 object-cover shadow-[2px_2px_0_0_#0f172a]"
                                    />
                                    <div className="bg-white px-3 py-2 border-4 border-surface-900 rounded-xl shadow-[2px_2px_0_0_#0f172a] transform rotate-1 min-w-0">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-surface-500">{isBuyer ? 'PENJUAL' : 'PEMBELI'}</p>
                                        <p className="font-black text-surface-900 uppercase tracking-tight truncate">{(isBuyer ? txn.seller : txn.buyer).name}</p>
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-surface-900 bg-white border-2 border-surface-900 rounded-xl p-3 shadow-[2px_2px_0_0_#0f172a] mb-5 leading-relaxed">
                                    Ada pertanyaan soal transaksi ini? Hubungi langsung {isBuyer ? 'penjual' : 'pembeli'} via chat pribadi.
                                </p>
                                <Link
                                    href={route('chat.direct', { user: isBuyer ? txn.seller.id : txn.buyer.id, listing_id: txn.listing.id })}
                                    className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-surface-900 text-white font-black uppercase tracking-widest border-4 border-transparent shadow-[4px_4px_0_0_#0f172a] hover:bg-white hover:text-surface-900 hover:border-surface-900 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all"
                                >
                                    💬 BUKA CHAT PRIBADI
                                </Link>
                            </div>

                            {/* Transaction ID badge */}
                            <div className="bg-white rounded-2xl border-4 border-surface-900 p-4 shadow-[4px_4px_0_0_#0f172a] text-center transform rotate-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-surface-500 mb-1">ID TRANSAKSI</p>
                                <p className="font-black font-mono text-2xl text-surface-900 bg-[#FEF08A] inline-block px-3 border-4 border-surface-900 shadow-[2px_2px_0_0_#0f172a]">#{txn.id}</p>
                            </div>
                        </motion.div>
                    </div>
                </main>
            </div>

            {/* Payment result overlay */}
            {paymentResult && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/70 backdrop-blur-sm px-4">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`max-w-sm w-full border-4 border-surface-900 rounded-3xl p-8 shadow-[12px_12px_0_0_#0f172a] text-center space-y-4 ${paymentResult === 'success' ? 'bg-[#A7F3D0]' :
                            paymentResult === 'pending' ? 'bg-[#FEF08A]' : 'bg-[#FECDD3]'
                            }`}
                    >
                        <div className="text-6xl drop-shadow-[3px_3px_0_#0f172a]">
                            {paymentResult === 'success' ? '✅' : paymentResult === 'pending' ? '⏳' : '❌'}
                        </div>
                        <h2 className="font-black font-display text-2xl uppercase tracking-tighter text-surface-900" style={{ textShadow: '2px 2px 0 white' }}>
                            {paymentResult === 'success' ? 'PEMBAYARAN BERHASIL!' :
                                paymentResult === 'pending' ? 'MENUNGGU PEMBAYARAN' : 'PEMBAYARAN GAGAL'}
                        </h2>
                        <p className="font-bold text-surface-900 text-sm bg-white border-2 border-surface-900 rounded-xl px-4 py-2">
                            {paymentResult === 'success' ? 'Terima kasih! Halaman akan diperbarui otomatis...' :
                                paymentResult === 'pending' ? 'Selesaikan pembayaranmu. Halaman akan diperbarui...' :
                                    'Terjadi kesalahan. Silakan coba lagi.'}
                        </p>
                        {paymentResult === 'error' && (
                            <button
                                type="button"
                                onClick={() => setPaymentResult(null)}
                                className="w-full py-3 rounded-xl bg-surface-900 text-white font-black uppercase tracking-widest border-4 border-transparent shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all"
                            >
                                TUTUP
                            </button>
                        )}
                    </motion.div>
                </div>
            )}

            {/* Complete confirmation modal */}
            {completeResult === 'confirm' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/70 backdrop-blur-sm px-4">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="max-w-sm w-full border-4 border-surface-900 rounded-3xl p-8 shadow-[12px_12px_0_0_#0f172a] text-center space-y-4 bg-[#BAE6FD]"
                    >
                        <div className="text-6xl drop-shadow-[3px_3px_0_#0f172a]">📦</div>
                        <h2 className="font-black font-display text-2xl uppercase tracking-tighter text-surface-900" style={{ textShadow: '2px 2px 0 white' }}>
                            KONFIRMASI PENERIMAAN
                        </h2>
                        <p className="font-bold text-surface-900 text-sm bg-white border-2 border-surface-900 rounded-xl px-4 py-2">
                            Kamu sudah menerima barang dengan kondisi baik?
                        </p>
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setCompleteResult(null)}
                                disabled={completeForm.processing}
                                className="flex-1 py-3 rounded-xl bg-white text-surface-900 border-4 border-surface-900 font-black uppercase tracking-widest shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all disabled:opacity-50"
                            >
                                BATAL
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmComplete}
                                disabled={completeForm.processing}
                                className="flex-1 py-3 rounded-xl bg-surface-900 text-white border-4 border-transparent font-black uppercase tracking-widest shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all disabled:opacity-50"
                            >
                                {completeForm.processing ? 'PROSES...' : 'YA, TERIMA'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
}
