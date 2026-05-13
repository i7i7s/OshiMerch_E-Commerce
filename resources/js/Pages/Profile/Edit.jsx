import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, Plus, Pencil, Trash2, Shield, Check, X, Upload, AlertCircle } from 'lucide-react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

// ── Address Modal (Brutalist) ──────────────────────────────────────────────────────────────
function AddressModal({ address, onSave, onClose }) {
    const [form, setForm] = useState(address || {
        label: '', recipient: '', phone: '', full_address: '', city: '', province: '', postal_code: '', is_primary: false,
    });
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-surface-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 sm:p-6"
                onClick={onClose}>
                <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="w-full max-w-lg bg-white rounded-2xl border-4 border-surface-900 shadow-[8px_8px_0_0_#0f172a] overflow-hidden"
                    onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between px-6 py-4 border-b-4 border-surface-900 bg-[#BAE6FD]">
                        <h2 className="font-black text-xl font-display uppercase tracking-widest text-surface-900">{address ? 'Edit Alamat' : 'Tambah Alamat Baru'}</h2>
                        <button onClick={onClose} className="p-1.5 rounded-lg border-2 border-surface-900 bg-white shadow-[2px_2px_0_0_#0f172a] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[3px_3px_0_0_#0f172a] hover:bg-[#FECDD3] transition-all">
                            <X className="w-5 h-5 text-surface-900" />
                        </button>
                    </div>
                    <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                        {[
                            { key: 'label', label: 'Label Alamat', placeholder: 'Contoh: Rumah, Kantor, Kosan' },
                            { key: 'recipient', label: 'Nama Penerima', placeholder: 'Nama lengkap penerima' },
                            { key: 'phone', label: 'No. Telepon', placeholder: '08xx-xxxx-xxxx' },
                            { key: 'full_address', label: 'Alamat Lengkap', placeholder: 'Jl. Contoh No. 1, RT/RW, Kelurahan, Kecamatan', textarea: true },
                            { key: 'city', label: 'Kota/Kabupaten', placeholder: 'Jakarta Selatan' },
                            { key: 'province', label: 'Provinsi', placeholder: 'DKI Jakarta' },
                            { key: 'postal_code', label: 'Kode Pos', placeholder: '12345' },
                        ].map(({ key, label, placeholder, textarea }) => (
                            <div key={key}>
                                <label className="block text-sm font-black uppercase text-surface-900 mb-2">{label}</label>
                                {textarea ? (
                                    <textarea value={form[key]} onChange={e => set(key, e.target.value)}
                                        placeholder={placeholder} rows={3}
                                        className="w-full px-4 py-3 bg-surface-50 border-4 border-surface-900 text-sm text-surface-900 font-bold focus:outline-none focus:bg-[#FEF08A] focus:shadow-[4px_4px_0_0_#0f172a] transition-all resize-none placeholder-surface-400 rounded-xl" />
                                ) : (
                                    <input type="text" value={form[key]} onChange={e => set(key, e.target.value)}
                                        placeholder={placeholder}
                                        className="w-full px-4 py-3 bg-surface-50 border-4 border-surface-900 text-sm text-surface-900 font-bold focus:outline-none focus:bg-[#FEF08A] focus:shadow-[4px_4px_0_0_#0f172a] transition-all placeholder-surface-400 rounded-xl" />
                                )}
                            </div>
                        ))}
                        <label className="flex items-center gap-4 cursor-pointer pt-2 group">
                            <div onClick={() => set('is_primary', !form.is_primary)}
                                className={`w-8 h-8 rounded-lg border-4 flex items-center justify-center transition-all shadow-[2px_2px_0_0_#0f172a] ${form.is_primary ? 'bg-[#A7F3D0] border-surface-900' : 'bg-white border-surface-900'}`}>
                                {form.is_primary && <Check className="w-5 h-5 text-surface-900 font-black" />}
                            </div>
                            <span className="text-sm font-black uppercase tracking-wide text-surface-900 select-none">Jadikan alamat utama pengiriman</span>
                        </label>
                    </div>
                    <div className="px-6 pb-6 pt-4 border-t-4 border-surface-900 bg-surface-50">
                        <button onClick={() => onSave(form)}
                            className="w-full py-4 rounded-xl bg-surface-900 text-white font-black text-lg uppercase tracking-widest border-2 border-transparent hover:border-surface-900 hover:bg-[#FEF08A] hover:text-surface-900 transition-all shadow-[4px_4px_0_0_rgba(15,23,42,0.2)] hover:shadow-[4px_4px_0_0_#0f172a] active:translate-y-1 active:translate-x-1 active:shadow-none">
                            {address ? 'Simpan Perubahan' : 'Simpan Alamat Baru'}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// ── Main Profile Page ──────────────────────────────────────────────────────────
const TABS = [
    { id: 'Profil', icon: User, color: 'bg-[#BAE6FD]' },
    { id: 'Alamat', icon: MapPin, color: 'bg-[#A7F3D0]' },
    { id: 'Keamanan', icon: Shield, color: 'bg-[#FECDD3]' }
];

export default function ProfileEdit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [activeTab, setActiveTab] = useState('Profil');
    const [addresses, setAddresses] = useState(user.addresses || []);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null); // index or null
    
    // Photo Upload State
    const [photoPreview, setPhotoPreview] = useState(user.profile_picture_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=FF1100&color=fff&size=200`);
    const fileInputRef = useRef(null);

    // Profile form
    const profileForm = useForm({
        _method: 'PATCH',
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        phone: user.phone || '',
        profile_picture: null,
    });

    // Password form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Cek ukuran 2MB
        if (file.size > 2 * 1024 * 1024) {
            alert('Ukuran foto maksimal 2MB!');
            e.target.value = '';
            return;
        }

        profileForm.setData('profile_picture', file);
        const reader = new FileReader();
        reader.onloadend = () => setPhotoPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        profileForm.post(route('profile.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    // Address helpers
    const handleSaveAddress = (form) => {
        const updated = [...addresses];
        if (editingAddress !== null) {
            updated[editingAddress] = form;
        } else {
            updated.push(form);
        }
        if (form.is_primary) {
            updated.forEach((a, i) => { if (i !== (editingAddress !== null ? editingAddress : updated.length - 1)) a.is_primary = false; });
        }
        setAddresses(updated);
        
        router.patch(route('profile.update'), { addresses: updated }, {
            preserveScroll: true,
            onSuccess: () => { setShowAddressModal(false); setEditingAddress(null); },
        });
    };

    const handleDeleteAddress = (i) => {
        if (!confirm('Hapus alamat ini?')) return;
        const updated = addresses.filter((_, idx) => idx !== i);
        setAddresses(updated);
        router.patch(route('profile.update'), { addresses: updated }, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Profil — OshiMerch" />
            <div className="min-h-dvh bg-[#FAFAFA] flex flex-col selection:bg-surface-900 selection:text-[#FEF08A]">
                <Navbar />

                <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 pt-[120px]">
                    {/* Brutalist Header card */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                        className="relative overflow-hidden rounded-2xl bg-primary-400 border-4 border-surface-900 p-8 sm:p-12 mb-10 shadow-[8px_8px_0_0_#0f172a]">
                        <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.2]" />
                        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left z-10">
                            <div className="relative shrink-0 group">
                                <img
                                    src={photoPreview}
                                    alt={user.name}
                                    className="relative w-32 h-32 rounded-2xl border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] object-cover transition-transform transform -rotate-3 group-hover:rotate-0"
                                />
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute -bottom-4 -right-4 flex flex-col items-center justify-center bg-[#FEF08A] border-4 border-surface-900 w-12 h-12 shadow-[2px_2px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_0_#0f172a] transition-all rounded-xl"
                                >
                                    <Upload className="w-5 h-5 text-surface-900" />
                                </button>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg,image/png,image/webp,image/jpg" onChange={handlePhotoChange} />
                            </div>
                            <div className="pt-2">
                                <span className="inline-block px-4 py-1 bg-white border-2 border-surface-900 text-surface-900 text-xs font-black tracking-widest uppercase mb-4 shadow-[2px_2px_0_0_#0f172a] rounded-xl">
                                    PROFIL AKUN
                                </span>
                                <h1 className="text-4xl sm:text-5xl font-black font-display text-surface-900 tracking-tighter mb-3 uppercase" style={{ textShadow: '2px 2px 0px white' }}>{user.name}</h1>
                                {user.oshi_member_name && (
                                    <p className="text-surface-900 text-lg font-bold">Oshi: <span className="font-black text-surface-900 bg-white border-2 border-surface-900 px-3 py-1 rounded-lg ml-2 shadow-[2px_2px_0_0_#0f172a] uppercase">{user.oshi_member_name}</span></p>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Brutalist Tabs */}
                    <div className="flex flex-wrap items-center gap-4 mb-10 border-b-4 border-surface-900 pb-6">
                        {TABS.map(tab => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2.5 px-6 py-3 rounded-xl border-4 border-surface-900 font-black uppercase tracking-widest transition-all ${
                                        isActive 
                                        ? `${tab.color} text-surface-900 shadow-[4px_4px_0_0_#0f172a] -translate-y-1 -translate-x-1` 
                                        : 'bg-white text-surface-600 hover:bg-[#FEF08A] hover:text-surface-900 hover:shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1'
                                    }`}>
                                    <tab.icon className="w-5 h-5" />
                                    {tab.id}
                                </button>
                            );
                        })}
                    </div>

                    <AnimatePresence mode="wait">
                        {/* ── Tab: Profil ── */}
                        {activeTab === 'Profil' && (
                            <motion.div key="profil" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                className="bg-white rounded-3xl border-4 border-surface-900 p-8 sm:p-12 shadow-[8px_8px_0_0_#0f172a]">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-16 h-16 rounded-2xl bg-[#BAE6FD] border-4 border-surface-900 flex items-center justify-center shadow-[4px_4px_0_0_#0f172a] transform -rotate-3">
                                        <User className="w-8 h-8 text-surface-900" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black font-display text-surface-900 uppercase">Informasi Dasar</h2>
                                        <p className="text-sm font-bold text-surface-600 mt-1">Perbarui nama, foto profil, email, dan biodata kamu.</p>
                                    </div>
                                </div>
                                
                                <form onSubmit={handleProfileSubmit} className="space-y-6" encType="multipart/form-data">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            { key: 'name', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama kamu' },
                                            { key: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com' },
                                            { key: 'phone', label: 'No. Handphone', type: 'text', placeholder: '08xx-xxxx-xxxx' },
                                        ].map(({ key, label, type, placeholder }) => (
                                            <div key={key}>
                                                <label className="block text-sm font-black uppercase text-surface-900 mb-2">{label}</label>
                                                <input type={type} value={profileForm.data[key]}
                                                    onChange={e => profileForm.setData(key, e.target.value)}
                                                    placeholder={placeholder}
                                                    className="w-full px-5 py-4 rounded-xl border-4 border-surface-900 bg-surface-50 text-sm font-bold text-surface-900 focus:outline-none focus:bg-[#BAE6FD] focus:shadow-[4px_4px_0_0_#0f172a] transition-all placeholder-surface-400" />
                                                {profileForm.errors[key] && <p className="text-sm font-black text-[#f43f5e] mt-2">{profileForm.errors[key]}</p>}
                                            </div>
                                        ))}
                                        {profileForm.errors.profile_picture && (
                                            <div className="md:col-span-2 p-4 bg-[#FECDD3] rounded-xl border-4 border-surface-900 flex items-center gap-3 text-sm font-black text-surface-900 shadow-[4px_4px_0_0_#0f172a]">
                                                <AlertCircle className="w-6 h-6 text-[#f43f5e]" /> {profileForm.errors.profile_picture}
                                            </div>
                                        )}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-black uppercase text-surface-900 mb-2">Biodata / Tentang Saya</label>
                                            <textarea value={profileForm.data.bio} onChange={e => profileForm.setData('bio', e.target.value)}
                                                placeholder="Ceritakan sedikit tentang dirimu sebagai fans JKT48..."
                                                rows={4}
                                                className="w-full px-5 py-4 rounded-xl border-4 border-surface-900 bg-surface-50 text-sm font-bold text-surface-900 focus:outline-none focus:bg-[#BAE6FD] focus:shadow-[4px_4px_0_0_#0f172a] transition-all resize-none placeholder-surface-400" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-8">
                                        <button type="submit" disabled={profileForm.processing}
                                            className="px-8 py-4 rounded-xl bg-surface-900 text-white font-black uppercase tracking-widest text-base shadow-[4px_4px_0_0_rgba(15,23,42,0.2)] hover:bg-[#BAE6FD] hover:text-surface-900 hover:shadow-[4px_4px_0_0_#0f172a] transition-all active:translate-y-1 active:translate-x-1 active:shadow-none border-2 border-transparent hover:border-surface-900 disabled:opacity-60">
                                            {profileForm.processing ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
                                        </button>
                                        <AnimatePresence>
                                            {profileForm.recentlySuccessful && (
                                                <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                                    className="px-6 py-4 bg-[#A7F3D0] text-surface-900 rounded-xl text-sm font-black uppercase tracking-widest flex items-center gap-3 border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a]">
                                                    <Check className="w-5 h-5 font-black" /> TERSIMPAN!
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* ── Tab: Alamat ── */}
                        {activeTab === 'Alamat' && (
                            <motion.div key="alamat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                                <div className="bg-white rounded-3xl border-4 border-surface-900 p-8 sm:p-12 shadow-[8px_8px_0_0_#0f172a]">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-[#A7F3D0] border-4 border-surface-900 flex items-center justify-center shadow-[4px_4px_0_0_#0f172a] transform -rotate-3">
                                                <MapPin className="w-8 h-8 text-surface-900" />
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-black font-display text-surface-900 uppercase">Buku Alamat</h2>
                                                <p className="text-sm font-bold text-surface-600 mt-1">Kelola alamat pengiriman untuk transaksi.</p>
                                            </div>
                                        </div>
                                        <button onClick={() => { setEditingAddress(null); setShowAddressModal(true); }}
                                            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#FEF08A] border-4 border-surface-900 text-surface-900 font-black text-sm uppercase tracking-widest shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all active:translate-y-1 active:translate-x-1 active:shadow-none">
                                            <Plus className="w-5 h-5" /> TAMBAH ALAMAT
                                        </button>
                                    </div>

                                    {addresses.length === 0 ? (
                                        <div className="rounded-3xl border-4 border-surface-900 bg-[#FAFAFA] p-12 sm:p-20 text-center shadow-[8px_8px_0_0_#0f172a] transform rotate-1">
                                            <div className="w-24 h-24 rounded-2xl bg-white border-4 border-surface-900 flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0_0_#0f172a] -rotate-6">
                                                <MapPin className="w-12 h-12 text-surface-900" />
                                            </div>
                                            <p className="text-3xl font-black font-display uppercase tracking-tight text-surface-900 mb-4">BELUM ADA ALAMAT</p>
                                            <p className="text-base font-bold text-surface-600 mb-8 max-w-md mx-auto">Tambahkan alamat rumah atau kosan agar proses checkout lebih cepat.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {addresses.map((addr, i) => (
                                                <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                                                    className={`relative bg-white rounded-3xl border-4 border-surface-900 p-6 sm:p-8 flex flex-col hover:-translate-y-1 hover:-translate-x-1 transition-all ${addr.is_primary ? 'shadow-[8px_8px_0_0_#0f172a] bg-surface-50' : 'shadow-[4px_4px_0_0_#0f172a]'}`}>
                                                    
                                                    {addr.is_primary && (
                                                        <div className="absolute -top-4 -right-4 px-4 py-2 bg-[#A7F3D0] border-4 border-surface-900 text-surface-900 text-xs font-black uppercase tracking-widest rounded-xl shadow-[4px_4px_0_0_#0f172a] transform rotate-6">
                                                            UTAMA
                                                        </div>
                                                    )}
                                                    
                                                    <div className="flex flex-col h-full">
                                                        <div className="flex items-center gap-4 mb-6">
                                                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center border-4 border-surface-900 shadow-[2px_2px_0_0_#0f172a] ${addr.is_primary ? 'bg-[#A7F3D0]' : 'bg-white'}`}>
                                                                <MapPin className="w-6 h-6 text-surface-900" />
                                                            </div>
                                                            <div>
                                                                <span className="font-black text-surface-900 text-xl uppercase tracking-tight">{addr.label || 'Alamat'}</span>
                                                                <p className="text-sm font-bold text-surface-600 mt-1">{addr.recipient} {addr.phone && <span className="font-black text-surface-900 ml-1">• {addr.phone}</span>}</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <p className="text-sm font-bold text-surface-700 leading-relaxed mb-8 flex-grow bg-white p-4 border-2 border-surface-900 rounded-xl">
                                                            {addr.full_address}{addr.city ? `, ${addr.city}` : ''}{addr.province ? `, ${addr.province}` : ''}{addr.postal_code ? ` ${addr.postal_code}` : ''}
                                                        </p>
                                                        
                                                        <div className="flex items-center gap-4 mt-auto">
                                                            <button onClick={() => { setEditingAddress(i); setShowAddressModal(true); }}
                                                                className="flex-1 py-3 rounded-xl bg-white border-4 border-surface-900 font-black uppercase tracking-widest text-sm text-surface-900 shadow-[2px_2px_0_0_#0f172a] hover:bg-[#FEF08A] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[4px_4px_0_0_#0f172a] transition-all">
                                                                EDIT ALAMAT
                                                            </button>
                                                            <button onClick={() => handleDeleteAddress(i)}
                                                                className="w-14 h-14 rounded-xl bg-[#FECDD3] border-4 border-surface-900 flex items-center justify-center text-surface-900 shadow-[2px_2px_0_0_#0f172a] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[4px_4px_0_0_#0f172a] transition-all">
                                                                <Trash2 className="w-6 h-6" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* ── Tab: Keamanan ── */}
                        {activeTab === 'Keamanan' && (
                            <motion.div key="keamanan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                className="bg-white rounded-3xl border-4 border-surface-900 p-8 sm:p-12 shadow-[8px_8px_0_0_#0f172a]">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-16 h-16 rounded-2xl bg-[#FECDD3] border-4 border-surface-900 flex items-center justify-center shadow-[4px_4px_0_0_#0f172a] transform -rotate-3">
                                        <Shield className="w-8 h-8 text-surface-900" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black font-display text-surface-900 uppercase">Keamanan & Password</h2>
                                        <p className="text-sm font-bold text-surface-600 mt-1">Jaga akun kamu tetap aman dengan password yang kuat.</p>
                                    </div>
                                </div>

                                <form onSubmit={e => { e.preventDefault(); passwordForm.put(route('password.update')); }} className="space-y-6 max-w-xl">
                                    {[
                                        { key: 'current_password', label: 'Password Saat Ini' },
                                        { key: 'password', label: 'Password Baru' },
                                        { key: 'password_confirmation', label: 'Konfirmasi Password Baru' },
                                    ].map(({ key, label }) => (
                                        <div key={key}>
                                            <label className="block text-sm font-black uppercase text-surface-900 mb-2">{label}</label>
                                            <input type="password" value={passwordForm.data[key]}
                                                onChange={e => passwordForm.setData(key, e.target.value)}
                                                className="w-full px-5 py-4 rounded-xl border-4 border-surface-900 bg-surface-50 text-sm font-bold text-surface-900 focus:outline-none focus:bg-[#FECDD3] focus:shadow-[4px_4px_0_0_#0f172a] transition-all" />
                                            {passwordForm.errors[key] && <p className="text-sm font-black text-[#f43f5e] mt-2">{passwordForm.errors[key]}</p>}
                                        </div>
                                    ))}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-8">
                                        <button type="submit" disabled={passwordForm.processing}
                                            className="px-8 py-4 rounded-xl bg-surface-900 text-white font-black uppercase tracking-widest text-base shadow-[4px_4px_0_0_rgba(15,23,42,0.2)] hover:bg-[#FECDD3] hover:text-surface-900 hover:shadow-[4px_4px_0_0_#0f172a] transition-all active:translate-y-1 active:translate-x-1 active:shadow-none border-2 border-transparent hover:border-surface-900 disabled:opacity-60">
                                            {passwordForm.processing ? 'MENYIMPAN...' : 'PERBARUI PASSWORD'}
                                        </button>
                                        <AnimatePresence>
                                            {passwordForm.recentlySuccessful && (
                                                <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                                    className="px-6 py-4 bg-[#A7F3D0] text-surface-900 rounded-xl text-sm font-black uppercase tracking-widest flex items-center gap-3 border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a]">
                                                    <Check className="w-5 h-5 font-black" /> BERHASIL!
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </form>

                                {/* Danger zone */}
                                <div className="mt-16 pt-12 border-t-4 border-surface-900">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8 rounded-3xl bg-[#FECDD3] border-4 border-surface-900 shadow-[8px_8px_0_0_#0f172a] transform -rotate-1">
                                        <div>
                                            <h3 className="text-3xl font-black font-display uppercase text-surface-900 mb-2">ZONA BERBAHAYA</h3>
                                            <p className="text-base font-bold text-surface-800">Menghapus akun akan menghapus semua data kamu secara permanen.</p>
                                        </div>
                                        <button
                                            onClick={() => confirm('Yakin ingin menghapus akun? Tindakan ini tidak bisa dibatalkan.') && router.delete(route('profile.destroy'))}
                                            className="shrink-0 px-8 py-4 rounded-xl bg-[#f43f5e] border-4 border-surface-900 text-white font-black uppercase tracking-widest text-base shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] hover:bg-[#e11d48] transition-all active:translate-y-1 active:translate-x-1 active:shadow-none">
                                            HAPUS AKUN PERMANEN
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
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
