import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import { PROVINCES, getShippingFee } from '@/data/shipping';
import { getCities } from '@/data/wilayah';

// ── Icons ──────────────────────────────────────────────────────────────────────
const IconChevron = () => (
    <svg className="w-5 h-5 shrink-0 text-surface-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);
const IconCheck = () => (
    <svg className="w-5 h-5 font-black text-surface-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);
const IconLoader = () => (
    <svg className="w-5 h-5 animate-spin text-surface-900" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
);
const IconArrowLeft = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);


// ── Section Wrapper (Brutalist) ────────────────────────────────────────────────────────────
function Section({ step, title, children }) {
    return (
        <div className="bg-white rounded-3xl border-4 border-surface-900 p-6 sm:p-10 shadow-[8px_8px_0_0_#0f172a]">
            <div className="flex items-center gap-4 mb-8 border-b-4 border-surface-900 pb-4">
                <div className="w-12 h-12 rounded-xl bg-[#FEF08A] border-4 border-surface-900 text-surface-900 flex items-center justify-center text-xl font-black shrink-0 shadow-[2px_2px_0_0_#0f172a] transform -rotate-3">
                    {step}
                </div>
                <h2 className="font-black font-display text-surface-900 text-2xl uppercase tracking-widest">{title}</h2>
            </div>
            {children}
        </div>
    );
}

// ── Label + Input wrapper ──────────────────────────────────────────────────────
function Field({ label, required, error, children }) {
    return (
        <div className="mb-6">
            <label className="block text-sm font-black uppercase tracking-widest text-surface-900 mb-2">
                {label} {required && <span className="text-[#f43f5e] text-lg leading-none">*</span>}
            </label>
            {children}
            {error && <p className="mt-2 text-sm font-black text-[#f43f5e] bg-[#FECDD3] inline-block px-2 py-1 rounded border-2 border-surface-900">{error}</p>}
        </div>
    );
}

const inputCls = "w-full border-4 border-surface-900 rounded-xl px-5 py-4 text-sm font-bold text-surface-900 focus:outline-none focus:bg-[#BAE6FD] focus:shadow-[4px_4px_0_0_#0f172a] transition-all bg-surface-50 placeholder:text-surface-400";
const selectCls = `${inputCls} appearance-none cursor-pointer`;

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Checkout({ listing }) {
    const { auth, errors: pageErrors } = usePage().props;
    const user = auth?.user;
    const savedAddresses = user?.addresses || [];

    // ── Form state ───────────────────────────────────────────────────────────
    const [form, setForm] = useState(() => {
        // Pre-fill from primary address if available
        const primary = savedAddresses.find(a => a.is_primary) || savedAddresses[0] || null;
        return {
            listing_id:        listing.id,
            recipient_name:    primary?.recipient || user?.name || '',
            recipient_phone:   primary?.phone || user?.phone || '',
            shipping_province: primary?.province || '',
            shipping_city:     primary?.city || '',
            shipping_district: '',
            shipping_address:  primary?.full_address || '',
        };
    });
    const [errors, setErrors] = useState(pageErrors || {});
    const [submitting, setSubmitting] = useState(false);
    const [selectedSavedAddr, setSelectedSavedAddr] = useState(() => {
        const primaryIdx = savedAddresses.findIndex(a => a.is_primary);
        return primaryIdx >= 0 ? primaryIdx : (savedAddresses.length > 0 ? 0 : null);
    });

    // ── Computed ──────────────────────────────────────────────────────────────
    const shippingFee = useMemo(() => getShippingFee(form.shipping_province), [form.shipping_province]);
    const total       = listing.price + shippingFee;
    const cities      = getCities(form.shipping_province);

    const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

    // Apply a saved address to form
    const applyAddress = (idx) => {
        const addr = savedAddresses[idx];
        if (!addr) return;
        setSelectedSavedAddr(idx);
        setForm(f => ({
            ...f,
            recipient_name:    addr.recipient || f.recipient_name,
            recipient_phone:   addr.phone || f.recipient_phone,
            shipping_province: addr.province || '',
            shipping_city:     addr.city || '',
            shipping_district: addr.district || '',
            shipping_address:  addr.full_address || '',
        }));
    };

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});

        router.post(route('transactions.store'), form, {
            onError: (errs) => { setErrors(errs); setSubmitting(false); },
            onFinish: () => setSubmitting(false),
        });
    };

    const canSubmit = form.recipient_name && form.shipping_province && form.shipping_address && !submitting;

    return (
        <>
            <Head title={`Checkout — ${listing.title} | OshiMerch`} />
            <div className="min-h-dvh bg-[#FAFAFA] flex flex-col font-sans selection:bg-surface-900 selection:text-[#FEF08A]">
                <Navbar />

                <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 pt-[120px]">
                    {/* Back link */}
                    <Link
                        href={route('products.show', listing.id)}
                        className="inline-flex items-center gap-3 px-6 py-3 bg-white border-4 border-surface-900 text-sm font-black uppercase tracking-widest text-surface-900 hover:bg-[#FEF08A] transition-all shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] rounded-xl mb-10"
                    >
                        <IconArrowLeft /> KEMBALI
                    </Link>

                    <h1 className="text-5xl sm:text-6xl font-black uppercase font-display tracking-tighter text-surface-900 mb-12" style={{ textShadow: '4px 4px 0px #FEF08A, 6px 6px 0px #0f172a' }}>
                        CHECKOUT
                    </h1>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">

                            {/* ── Left: Form ────────────────────────────────── */}
                            <div className="space-y-8">

                                {/* Step 1: Recipient */}
                                <Section step="1" title="Info Penerima">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                                        <Field label="Nama Lengkap" required error={errors.recipient_name}>
                                            <input
                                                type="text"
                                                className={inputCls}
                                                placeholder="Nama penerima paket"
                                                value={form.recipient_name}
                                                onChange={e => set('recipient_name', e.target.value)}
                                                maxLength={150}
                                            />
                                        </Field>
                                        <Field label="No. WhatsApp" error={errors.recipient_phone}>
                                            <input
                                                type="tel"
                                                className={inputCls}
                                                placeholder="Contoh: 08123456789"
                                                value={form.recipient_phone}
                                                onChange={e => set('recipient_phone', e.target.value)}
                                                maxLength={20}
                                            />
                                        </Field>
                                    </div>
                                </Section>

                                {/* Step 2: Address */}
                                <Section step="2" title="Alamat Pengiriman">
                                    <div className="space-y-2">

                                        {/* ── Saved addresses ── */}
                                        {savedAddresses.length === 0 ? (
                                            <div className="mb-6 p-5 bg-[#FEF08A] border-4 border-surface-900 rounded-2xl shadow-[4px_4px_0_0_#0f172a] flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                                <span className="text-2xl shrink-0">📋</span>
                                                <div className="flex-1">
                                                    <p className="font-black text-surface-900 uppercase tracking-wide text-sm">Belum ada alamat tersimpan</p>
                                                    <p className="text-xs font-bold text-surface-700 mt-1">Tambahkan alamat di profil kamu agar checkout lebih cepat di lain waktu.</p>
                                                </div>
                                                <Link
                                                    href={route('profile.edit') + '?tab=Alamat'}
                                                    className="shrink-0 px-4 py-2 bg-surface-900 text-white font-black text-xs uppercase tracking-widest border-2 border-surface-900 rounded-xl hover:bg-[#f43f5e] transition-all shadow-[2px_2px_0_0_#0f172a]"
                                                >
                                                    ATUR ALAMAT →
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="mb-6">
                                                <p className="text-sm font-black uppercase tracking-widest text-surface-900 mb-3">Pilih Alamat Tersimpan</p>
                                                <div className="space-y-2">
                                                    {savedAddresses.map((addr, idx) => (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            onClick={() => applyAddress(idx)}
                                                            className={`w-full text-left px-5 py-4 rounded-2xl border-4 transition-all ${
                                                                selectedSavedAddr === idx
                                                                    ? 'border-surface-900 bg-[#BAE6FD] shadow-[4px_4px_0_0_#0f172a] -translate-y-0.5 -translate-x-0.5'
                                                                    : 'border-surface-900 bg-white hover:bg-[#FEF08A] hover:shadow-[4px_4px_0_0_#0f172a]'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-5 h-5 rounded-full border-4 border-surface-900 shrink-0 flex items-center justify-center shadow-[1px_1px_0_0_#0f172a] ${selectedSavedAddr === idx ? 'bg-surface-900' : 'bg-white'}`}>
                                                                    {selectedSavedAddr === idx && <div className="w-2 h-2 rounded-full bg-white" />}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-black text-surface-900 text-sm uppercase tracking-wide">
                                                                        {addr.label || 'Alamat'}
                                                                        {addr.is_primary && <span className="ml-2 text-[10px] bg-[#A7F3D0] border border-surface-900 px-1.5 py-0.5 rounded font-black">UTAMA</span>}
                                                                    </p>
                                                                    <p className="text-xs font-bold text-surface-700 mt-0.5 truncate">{addr.recipient} · {addr.city}, {addr.province}</p>
                                                                    <p className="text-xs text-surface-500 font-bold mt-0.5 truncate">{addr.full_address}</p>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedSavedAddr(null);
                                                            setForm(f => ({ ...f, recipient_name: user?.name || '', recipient_phone: user?.phone || '', shipping_province: '', shipping_city: '', shipping_district: '', shipping_address: '' }));
                                                        }}
                                                        className={`w-full text-left px-5 py-3 rounded-2xl border-4 border-dashed transition-all ${
                                                            selectedSavedAddr === null
                                                                ? 'border-surface-900 bg-[#FEF08A] shadow-[4px_4px_0_0_#0f172a]'
                                                                : 'border-surface-400 bg-white hover:border-surface-900 hover:bg-surface-50'
                                                        }`}
                                                    >
                                                        <p className="font-black text-surface-900 text-sm uppercase tracking-wide">+ Isi Alamat Baru</p>
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Province */}
                                        <Field label="Provinsi" required error={errors.shipping_province}>
                                            <div className="relative">
                                                <select
                                                    className={selectCls}
                                                    value={form.shipping_province}
                                                    onChange={e => setForm(f => ({ ...f, shipping_province: e.target.value, shipping_city: '' }))}
                                                >
                                                    <option value="">-- Pilih Provinsi --</option>
                                                    {PROVINCES.map(p => (
                                                        <option key={p} value={p}>{p}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none bg-surface-50">
                                                    <IconChevron />
                                                </div>
                                            </div>
                                        </Field>

                                        {/* City - cascading select from province */}
                                        <Field label="Kabupaten / Kota" error={errors.shipping_city}>
                                            <div className="relative">
                                                <select
                                                    className={selectCls}
                                                    value={form.shipping_city}
                                                    onChange={e => set('shipping_city', e.target.value)}
                                                    disabled={!form.shipping_province}
                                                >
                                                    <option value="">{form.shipping_province ? '-- Pilih Kota/Kabupaten --' : '-- Pilih provinsi dulu --'}</option>
                                                    {cities.map(c => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none bg-surface-50">
                                                    <IconChevron />
                                                </div>
                                            </div>
                                        </Field>

                                        {/* District - text input */}
                                        <Field label="Kecamatan" error={errors.shipping_district}>
                                            <input
                                                type="text"
                                                className={inputCls}
                                                placeholder="Contoh: Gubeng"
                                                value={form.shipping_district}
                                                onChange={e => set('shipping_district', e.target.value)}
                                                maxLength={100}
                                            />
                                        </Field>

                                        {/* Detail address */}
                                        <Field label="Alamat Lengkap" required error={errors.shipping_address}>
                                            <textarea
                                                className={`${inputCls} resize-none`}
                                                rows={4}
                                                placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kode pos"
                                                value={form.shipping_address}
                                                onChange={e => set('shipping_address', e.target.value)}
                                                maxLength={500}
                                            />
                                            <p className="mt-2 text-xs font-bold text-surface-500 text-right uppercase">
                                                {form.shipping_address.length}/500 KARAKTER
                                            </p>
                                        </Field>
                                    </div>
                                </Section>

                                {/* Step 3: Midtrans Payment Info */}
                                <Section step="3" title="Pembayaran">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 bg-[#A7F3D0] border-4 border-surface-900 rounded-2xl p-5 shadow-[4px_4px_0_0_#0f172a] transform -rotate-1">
                                            <span className="text-4xl">🔒</span>
                                            <div>
                                                <p className="font-black text-surface-900 text-lg uppercase tracking-tight">Pembayaran via Midtrans</p>
                                                <p className="text-sm font-bold text-surface-700 mt-1">Setelah checkout, kamu akan diarahkan ke halaman pembayaran Midtrans. Tersedia: GoPay, OVO, DANA, Transfer Bank, Kartu Kredit, dan lebih banyak lagi.</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {['GoPay', 'OVO', 'DANA', 'ShopeePay', 'BCA', 'Mandiri', 'BNI', 'Kartu Kredit'].map(m => (
                                                <span key={m} className="px-3 py-1.5 bg-white border-2 border-surface-900 rounded-lg text-xs font-black uppercase shadow-[2px_2px_0_0_#0f172a]">{m}</span>
                                            ))}
                                        </div>
                                    </div>
                                </Section>
                            </div>

                            {/* ── Right: Order Summary (Brutalist) ──────────────────────── */}
                            <div className="sticky top-32 space-y-6">
                                {/* Product card */}
                                <div className="bg-white rounded-3xl border-4 border-surface-900 p-6 shadow-[8px_8px_0_0_#0f172a]">
                                    <p className="text-sm font-black uppercase tracking-widest text-surface-900 mb-4 border-b-4 border-surface-900 pb-2">PRODUK</p>
                                    <div className="flex items-center gap-4">
                                        {listing.image_url ? (
                                            <img
                                                src={listing.image_url}
                                                alt={listing.title}
                                                className="w-20 h-20 rounded-xl object-cover border-4 border-surface-900 shrink-0 shadow-[2px_2px_0_0_#0f172a]"
                                            />
                                        ) : (
                                            <div className="w-20 h-20 rounded-xl bg-[#FAFAFA] border-4 border-surface-900 shrink-0 shadow-[2px_2px_0_0_#0f172a]" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-surface-900 text-base uppercase leading-tight line-clamp-2 mb-2">
                                                {listing.title}
                                            </p>
                                            <p className="text-xs font-bold text-surface-900 bg-[#FEF08A] inline-block px-2 py-1 rounded border-2 border-surface-900">
                                                By {listing.seller.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Price summary */}
                                <div className="bg-[#A7F3D0] rounded-3xl p-8 border-4 border-surface-900 shadow-[8px_8px_0_0_#0f172a] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[url('/img/grid.svg')] opacity-[0.2]" />

                                    <h3 className="font-black uppercase font-display text-xl tracking-widest mb-6 border-b-4 border-surface-900 pb-4 relative z-10 text-surface-900">RINGKASAN ORDER</h3>

                                    <div className="space-y-4 text-base font-bold text-surface-900 relative z-10">
                                        <div className="flex justify-between items-center bg-white px-4 py-3 border-2 border-surface-900 rounded-xl shadow-[2px_2px_0_0_#0f172a]">
                                            <span className="uppercase text-sm font-black">Harga Barang</span>
                                            <span className="font-black">
                                                Rp{listing.price.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center bg-white px-4 py-3 border-2 border-surface-900 rounded-xl shadow-[2px_2px_0_0_#0f172a]">
                                            <span className="uppercase text-sm font-black">Ongkos Kirim OshiGo</span>
                                            <span className={`font-black ${shippingFee > 0 ? 'bg-[#FECDD3] px-2 py-0.5 rounded border border-surface-900' : 'text-surface-500'}`}>
                                                {form.shipping_province
                                                    ? `Rp${shippingFee.toLocaleString('id-ID')}`
                                                    : '—'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t-4 border-surface-900 my-6 relative z-10" />

                                    <div className="flex flex-col bg-[#FEF08A] border-4 border-surface-900 p-6 rounded-2xl shadow-[4px_4px_0_0_#0f172a] mb-6 relative z-10 transform -rotate-1">
                                        <span className="text-surface-900 font-black uppercase tracking-widest text-sm mb-2">TOTAL BAYAR</span>
                                        <span className="text-4xl font-black text-surface-900 tracking-tight">
                                            Rp{(form.shipping_province ? total : listing.price).toLocaleString('id-ID')}
                                        </span>
                                    </div>

                                    {form.shipping_province && (
                                        <motion.p
                                            initial={{ opacity: 0, y: 4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-xs font-bold text-surface-900 bg-white border-2 border-surface-900 p-3 rounded-xl shadow-[2px_2px_0_0_#0f172a] relative z-10"
                                        >
                                            Ongkir ke <span className="font-black uppercase">{form.shipping_province}</span>:{' '}
                                            <span className="bg-[#BAE6FD] px-1 border border-surface-900 rounded">Rp{shippingFee.toLocaleString('id-ID')}</span>
                                        </motion.p>
                                    )}
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={!canSubmit}
                                    className="w-full py-5 rounded-2xl bg-surface-900 border-4 border-surface-900 text-white font-black text-lg uppercase tracking-widest shadow-[4px_4px_0_0_rgba(15,23,42,0.2)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#0f172a] hover:bg-[#FEF08A] hover:text-surface-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:bg-surface-900 disabled:hover:text-white disabled:hover:shadow-none flex items-center justify-center gap-3 active:translate-y-1 active:translate-x-1 active:shadow-none"
                                >
                                    {submitting ? (
                                        <><IconLoader /> MEMPROSES...</>
                                    ) : (
                                        'KONFIRMASI CHECKOUT'
                                    )}
                                </button>

                                <div className="bg-white border-4 border-surface-900 p-4 rounded-xl shadow-[4px_4px_0_0_#0f172a] transform rotate-1">
                                    <p className="text-xs text-surface-900 font-bold text-center leading-relaxed">
                                        Dengan checkout, listing akan di-<span className="font-black bg-[#FECDD3] px-1 border border-surface-900 rounded">RESERVE</span> dan
                                        kamu akan diarahkan ke halaman <span className="font-black bg-[#BAE6FD] px-1 border border-surface-900 rounded">pembayaran Midtrans</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
}
