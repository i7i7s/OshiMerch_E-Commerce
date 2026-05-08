import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, Plus, Pencil, Trash2, Star, Phone, Shield, ChevronRight, Check, X } from 'lucide-react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

// ── Address Modal ──────────────────────────────────────────────────────────────
function AddressModal({ address, onSave, onClose }) {
    const [form, setForm] = useState(address || {
        label: '', recipient: '', phone: '', full_address: '', city: '', province: '', postal_code: '', is_primary: false,
    });
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
                onClick={onClose}>
                <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25 }}
                    className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
                    onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
                        <h2 className="font-bold text-surface-900">{address ? 'Edit Alamat' : 'Tambah Alamat Baru'}</h2>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-surface-100 text-surface-500"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        {[
                            { key: 'label', label: 'Label Alamat', placeholder: 'Rumah, Kantor, dll.' },
                            { key: 'recipient', label: 'Nama Penerima', placeholder: 'Nama lengkap' },
                            { key: 'phone', label: 'No. Telepon', placeholder: '08xx-xxxx-xxxx' },
                            { key: 'full_address', label: 'Alamat Lengkap', placeholder: 'Jl. Contoh No. 1, RT/RW, Kelurahan, Kecamatan', textarea: true },
                            { key: 'city', label: 'Kota/Kabupaten', placeholder: 'Jakarta Selatan' },
                            { key: 'province', label: 'Provinsi', placeholder: 'DKI Jakarta' },
                            { key: 'postal_code', label: 'Kode Pos', placeholder: '12345' },
                        ].map(({ key, label, placeholder, textarea }) => (
                            <div key={key}>
                                <label className="block text-xs font-semibold text-surface-600 mb-1.5">{label}</label>
                                {textarea ? (
                                    <textarea value={form[key]} onChange={e => set(key, e.target.value)}
                                        placeholder={placeholder} rows={3}
                                        className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none" />
                                ) : (
                                    <input type="text" value={form[key]} onChange={e => set(key, e.target.value)}
                                        placeholder={placeholder}
                                        className="w-full px-4 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
                                )}
                            </div>
                        ))}
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div onClick={() => set('is_primary', !form.is_primary)}
                                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${form.is_primary ? 'bg-primary-500 border-primary-500' : 'border-surface-300'}`}>
                                {form.is_primary && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-sm text-surface-700">Jadikan alamat utama</span>
                        </label>
                    </div>
                    <div className="px-6 pb-6 pt-3 border-t border-surface-100">
                        <button onClick={() => onSave(form)}
                            className="w-full py-3 rounded-xl gradient-primary text-white font-bold text-sm shadow-glow-primary hover:shadow-xl transition-all">
                            Simpan Alamat
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// ── Main Profile Page ──────────────────────────────────────────────────────────
const TABS = ['Profil', 'Alamat', 'Keamanan'];

export default function ProfileEdit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [activeTab, setActiveTab] = useState('Profil');
    const [addresses, setAddresses] = useState(user.addresses || []);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null); // index or null

    // Profile form
    const profileForm = useForm({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        phone: user.phone || '',
    });

    // Password form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Address helpers
    const handleSaveAddress = (form) => {
        const updated = [...addresses];
        if (editingAddress !== null) {
            updated[editingAddress] = form;
        } else {
            updated.push(form);
        }
        // if new address is primary, unset others
        if (form.is_primary) {
            updated.forEach((a, i) => { if (i !== (editingAddress !== null ? editingAddress : updated.length - 1)) a.is_primary = false; });
        }
        setAddresses(updated);
        // Persist via PATCH
        profileForm.patch(route('profile.update'), {
            data: { addresses: updated },
            preserveScroll: true,
            onSuccess: () => { setShowAddressModal(false); setEditingAddress(null); },
        });
    };

    const handleDeleteAddress = (i) => {
        const updated = addresses.filter((_, idx) => idx !== i);
        setAddresses(updated);
        profileForm.patch(route('profile.update'), { data: { addresses: updated }, preserveScroll: true });
    };

    return (
        <>
            <Head title="Profil — OshiMerch" />
            <div className="min-h-dvh bg-surface-50 flex flex-col">
                <Navbar />

                <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 pt-[96px]">
                    {/* Header card */}
                    <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 mb-8">
                        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
                        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full" />
                        <div className="relative flex items-center gap-5">
                            <img
                                src={user.profile_picture_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=FF1100&color=fff&size=80`}
                                alt={user.name}
                                className="w-20 h-20 rounded-2xl border-2 border-white/30 shadow-lg object-cover"
                            />
                            <div>
                                <p className="text-white/70 text-sm mb-0.5">Profil Saya</p>
                                <h1 className="text-2xl font-bold font-display text-white">{user.name}</h1>
                                {user.oshi_member_name && (
                                    <p className="text-white/80 text-sm mt-1">Oshi: <span className="font-semibold text-white">{user.oshi_member_name}</span></p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 p-1 bg-surface-100 rounded-2xl mb-6 w-fit">
                        {TABS.map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white text-primary-600 shadow-sm' : 'text-surface-500 hover:text-surface-700'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* ── Tab: Profil ── */}
                    {activeTab === 'Profil' && (
                        <motion.div key="profil" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl border border-surface-200 p-6">
                            <h2 className="text-base font-bold text-surface-900 mb-6 flex items-center gap-2"><User className="w-4 h-4 text-primary-500" />Informasi Profil</h2>
                            <form onSubmit={e => { e.preventDefault(); profileForm.patch(route('profile.update')); }}
                                className="space-y-5">
                                {[
                                    { key: 'name', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama kamu' },
                                    { key: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com' },
                                    { key: 'phone', label: 'No. HP', type: 'text', placeholder: '08xx-xxxx-xxxx' },
                                ].map(({ key, label, type, placeholder }) => (
                                    <div key={key}>
                                        <label className="block text-xs font-semibold text-surface-600 mb-1.5">{label}</label>
                                        <input type={type} value={profileForm.data[key]}
                                            onChange={e => profileForm.setData(key, e.target.value)}
                                            placeholder={placeholder}
                                            className="w-full px-4 py-3 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent" />
                                        {profileForm.errors[key] && <p className="text-xs text-red-500 mt-1">{profileForm.errors[key]}</p>}
                                    </div>
                                ))}
                                <div>
                                    <label className="block text-xs font-semibold text-surface-600 mb-1.5">Bio</label>
                                    <textarea value={profileForm.data.bio} onChange={e => profileForm.setData('bio', e.target.value)}
                                        placeholder="Ceritakan sedikit tentang dirimu sebagai fans JKT48..."
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none" />
                                </div>
                                <div className="flex items-center gap-4 pt-2">
                                    <button type="submit" disabled={profileForm.processing}
                                        className="px-6 py-3 rounded-xl gradient-primary text-white font-bold text-sm shadow-glow-primary hover:shadow-xl transition-all disabled:opacity-60">
                                        {profileForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                    {profileForm.recentlySuccessful && (
                                        <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                            className="text-sm text-green-600 font-medium flex items-center gap-1">
                                            <Check className="w-4 h-4" /> Tersimpan!
                                        </motion.span>
                                    )}
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {/* ── Tab: Alamat ── */}
                    {activeTab === 'Alamat' && (
                        <motion.div key="alamat" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-base font-bold text-surface-900 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary-500" />Daftar Alamat
                                </h2>
                                <button onClick={() => { setEditingAddress(null); setShowAddressModal(true); }}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl gradient-primary text-white font-semibold text-sm shadow-glow-primary hover:scale-[1.02] transition-all">
                                    <Plus className="w-4 h-4" />Tambah Alamat
                                </button>
                            </div>

                            {addresses.length === 0 ? (
                                <div className="bg-white rounded-2xl border border-dashed border-surface-300 p-12 text-center">
                                    <div className="w-16 h-16 rounded-3xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
                                        <MapPin className="w-8 h-8 text-surface-300" />
                                    </div>
                                    <p className="font-bold text-surface-700 mb-1">Belum ada alamat tersimpan</p>
                                    <p className="text-sm text-surface-500 mb-5">Tambahkan alamat pengiriman untuk mempercepat checkout.</p>
                                    <button onClick={() => setShowAddressModal(true)}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-white font-semibold text-sm shadow-glow-primary transition-all">
                                        <Plus className="w-4 h-4" />Tambah Alamat Pertama
                                    </button>
                                </div>
                            ) : (
                                addresses.map((addr, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                        className={`bg-white rounded-2xl border p-5 ${addr.is_primary ? 'border-primary-300 ring-1 ring-primary-200' : 'border-surface-200'}`}>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-bold text-surface-900 text-sm">{addr.label || 'Alamat'}</span>
                                                    {addr.is_primary && (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-50 text-primary-600 border border-primary-200">Utama</span>
                                                    )}
                                                </div>
                                                <p className="text-sm font-semibold text-surface-800">{addr.recipient}</p>
                                                {addr.phone && <p className="text-xs text-surface-500 mt-0.5">{addr.phone}</p>}
                                                <p className="text-xs text-surface-600 mt-1 leading-relaxed">
                                                    {addr.full_address}{addr.city ? `, ${addr.city}` : ''}{addr.province ? `, ${addr.province}` : ''}{addr.postal_code ? ` ${addr.postal_code}` : ''}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button onClick={() => { setEditingAddress(i); setShowAddressModal(true); }}
                                                    className="w-9 h-9 rounded-xl border border-surface-200 flex items-center justify-center text-surface-500 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 transition-all">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDeleteAddress(i)}
                                                    className="w-9 h-9 rounded-xl border border-surface-200 flex items-center justify-center text-surface-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                    )}

                    {/* ── Tab: Keamanan ── */}
                    {activeTab === 'Keamanan' && (
                        <motion.div key="keamanan" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl border border-surface-200 p-6">
                            <h2 className="text-base font-bold text-surface-900 mb-6 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-primary-500" />Keamanan Akun
                            </h2>
                            <form onSubmit={e => { e.preventDefault(); passwordForm.put(route('password.update')); }}
                                className="space-y-5">
                                {[
                                    { key: 'current_password', label: 'Password Saat Ini' },
                                    { key: 'password', label: 'Password Baru' },
                                    { key: 'password_confirmation', label: 'Konfirmasi Password Baru' },
                                ].map(({ key, label }) => (
                                    <div key={key}>
                                        <label className="block text-xs font-semibold text-surface-600 mb-1.5">{label}</label>
                                        <input type="password" value={passwordForm.data[key]}
                                            onChange={e => passwordForm.setData(key, e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
                                        {passwordForm.errors[key] && <p className="text-xs text-red-500 mt-1">{passwordForm.errors[key]}</p>}
                                    </div>
                                ))}
                                <div className="flex items-center gap-4 pt-2">
                                    <button type="submit" disabled={passwordForm.processing}
                                        className="px-6 py-3 rounded-xl gradient-primary text-white font-bold text-sm shadow-glow-primary hover:shadow-xl transition-all disabled:opacity-60">
                                        {passwordForm.processing ? 'Menyimpan...' : 'Ubah Password'}
                                    </button>
                                    {passwordForm.recentlySuccessful && (
                                        <span className="text-sm text-green-600 font-medium flex items-center gap-1"><Check className="w-4 h-4" />Tersimpan!</span>
                                    )}
                                </div>
                            </form>

                            {/* Danger zone */}
                            <div className="mt-8 pt-6 border-t border-surface-200">
                                <h3 className="text-sm font-bold text-red-600 mb-3">Zona Berbahaya</h3>
                                <p className="text-xs text-surface-500 mb-4">Menghapus akun akan menghapus semua data kamu secara permanen.</p>
                                <button
                                    onClick={() => confirm('Yakin ingin menghapus akun? Tindakan ini tidak bisa dibatalkan.') && router.delete(route('profile.destroy'))}
                                    className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors">
                                    Hapus Akun
                                </button>
                            </div>
                        </motion.div>
                    )}
                </main>

                {showAddressModal && (
                    <AddressModal
                        address={editingAddress !== null ? addresses[editingAddress] : null}
                        onSave={handleSaveAddress}
                        onClose={() => { setShowAddressModal(false); setEditingAddress(null); }}
                    />
                )}

                <Footer />
            </div>
        </>
    );
}
