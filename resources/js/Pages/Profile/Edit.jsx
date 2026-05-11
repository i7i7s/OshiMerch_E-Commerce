import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, Plus, Pencil, Trash2, Shield, Check, X, Upload, AlertCircle } from 'lucide-react';
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
                className="fixed inset-0 z-50 glass-dark flex items-end sm:items-center justify-center p-4 sm:p-6"
                onClick={onClose}>
                <motion.div initial={{ y: 100, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 100, opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-surface-200"
                    onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between px-8 py-5 border-b-2 border-surface-100 bg-surface-50">
                        <h2 className="font-extrabold text-lg font-display text-surface-900">{address ? 'Edit Alamat' : 'Tambah Alamat Baru'}</h2>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-surface-200 text-surface-500 hover:text-surface-900 transition-colors"><X className="w-6 h-6" /></button>
                    </div>
                    <div className="p-8 space-y-5 max-h-[65vh] overflow-y-auto overscroll-contain">
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
                                <label className="block text-sm font-bold text-surface-800 mb-2">{label}</label>
                                {textarea ? (
                                    <textarea value={form[key]} onChange={e => set(key, e.target.value)}
                                        placeholder={placeholder} rows={3}
                                        className="w-full px-5 py-3 rounded-2xl border-2 border-surface-200 text-sm text-surface-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all resize-none placeholder-surface-400 font-medium" />
                                ) : (
                                    <input type="text" value={form[key]} onChange={e => set(key, e.target.value)}
                                        placeholder={placeholder}
                                        className="w-full px-5 py-3 rounded-2xl border-2 border-surface-200 text-sm text-surface-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all placeholder-surface-400 font-medium" />
                                )}
                            </div>
                        ))}
                        <label className="flex items-center gap-4 cursor-pointer pt-2 group">
                            <div onClick={() => set('is_primary', !form.is_primary)}
                                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${form.is_primary ? 'bg-primary-500 border-primary-500' : 'border-surface-300 group-hover:border-primary-400'}`}>
                                {form.is_primary && <Check className="w-4 h-4 text-white" />}
                            </div>
                            <span className="text-sm font-bold text-surface-700 select-none group-hover:text-surface-900 transition-colors">Jadikan alamat utama pengiriman</span>
                        </label>
                    </div>
                    <div className="px-8 pb-8 pt-4 border-t-2 border-surface-100 bg-surface-50">
                        <button onClick={() => onSave(form)}
                            className="w-full py-4 rounded-2xl gradient-primary text-white font-extrabold text-base shadow-glow-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
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
    { id: 'Profil', icon: User },
    { id: 'Alamat', icon: MapPin },
    { id: 'Keamanan', icon: Shield }
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
            _method: 'patch',
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
        
        // We use patch without file for addresses
        const addressForm = useForm({ addresses: updated });
        addressForm.patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => { setShowAddressModal(false); setEditingAddress(null); },
        });
    };

    const handleDeleteAddress = (i) => {
        if (!confirm('Hapus alamat ini?')) return;
        const updated = addresses.filter((_, idx) => idx !== i);
        setAddresses(updated);
        const addressForm = useForm({ addresses: updated });
        addressForm.patch(route('profile.update'), { preserveScroll: true });
    };

    return (
        <>
            <Head title="Profil — OshiMerch" />
            <div className="min-h-dvh bg-surface-50 flex flex-col">
                <Navbar />

                <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 pt-[104px]">
                    {/* Header card */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[2rem] gradient-primary p-8 sm:p-10 mb-10 shadow-elevated">
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary-400/20 rounded-full blur-xl" />
                        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                            <div className="relative shrink-0 group">
                                <div className="absolute inset-0 bg-white/20 rounded-3xl blur-md" />
                                <img
                                    src={photoPreview}
                                    alt={user.name}
                                    className="relative w-28 h-28 rounded-3xl border-4 border-white/40 shadow-xl object-cover transition-all"
                                />
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl backdrop-blur-sm"
                                >
                                    <Upload className="w-6 h-6 mb-1" />
                                    <span className="text-[10px] font-bold">Ubah Foto</span>
                                </button>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg,image/png,image/webp,image/jpg" onChange={handlePhotoChange} />
                            </div>
                            <div className="pt-2">
                                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white/90 text-xs font-bold tracking-wider uppercase mb-3 border border-white/20">
                                    Profil Akun
                                </span>
                                <h1 className="text-3xl font-black font-display text-white tracking-tight mb-2">{user.name}</h1>
                                {user.oshi_member_name && (
                                    <p className="text-white/80 text-base font-medium">Oshi: <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">{user.oshi_member_name}</span></p>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Modern Tabs */}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 p-1.5 bg-surface-200/50 rounded-2xl mb-8 w-fit mx-auto sm:mx-0 border border-surface-200">
                        {TABS.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-extrabold transition-all duration-300 ${activeTab === tab.id ? 'bg-white text-primary-600 shadow-sm border border-surface-200 scale-100' : 'text-surface-500 hover:text-surface-800 hover:bg-surface-200 scale-95 hover:scale-100'}`}>
                                <tab.icon className="w-5 h-5" />
                                {tab.id}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {/* ── Tab: Profil ── */}
                        {activeTab === 'Profil' && (
                            <motion.div key="profil" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                className="bg-white rounded-[2rem] border-2 border-surface-100 p-8 sm:p-10 shadow-sm">
                                <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-surface-100">
                                    <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center">
                                        <User className="w-6 h-6 text-primary-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-extrabold font-display text-surface-900">Informasi Dasar</h2>
                                        <p className="text-sm font-medium text-surface-500">Perbarui nama, foto profil, email, dan biodata kamu.</p>
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
                                                <label className="block text-sm font-bold text-surface-800 mb-2">{label}</label>
                                                <input type={type} value={profileForm.data[key]}
                                                    onChange={e => profileForm.setData(key, e.target.value)}
                                                    placeholder={placeholder}
                                                    className="w-full px-5 py-3.5 rounded-2xl border-2 border-surface-200 text-sm font-medium text-surface-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all placeholder-surface-400" />
                                                {profileForm.errors[key] && <p className="text-xs font-bold text-red-500 mt-2">{profileForm.errors[key]}</p>}
                                            </div>
                                        ))}
                                        {profileForm.errors.profile_picture && (
                                            <div className="md:col-span-2 p-3 bg-red-50 rounded-xl border border-red-200 flex items-center gap-2 text-sm font-bold text-red-600">
                                                <AlertCircle className="w-4 h-4" /> {profileForm.errors.profile_picture}
                                            </div>
                                        )}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-surface-800 mb-2">Biodata / Tentang Saya</label>
                                            <textarea value={profileForm.data.bio} onChange={e => profileForm.setData('bio', e.target.value)}
                                                placeholder="Ceritakan sedikit tentang dirimu sebagai fans JKT48..."
                                                rows={4}
                                                className="w-full px-5 py-3.5 rounded-2xl border-2 border-surface-200 text-sm font-medium text-surface-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all resize-none placeholder-surface-400" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 pt-4">
                                        <button type="submit" disabled={profileForm.processing}
                                            className="px-8 py-3.5 rounded-2xl gradient-primary text-white font-extrabold text-base shadow-glow-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-60 disabled:hover:translate-y-0">
                                            {profileForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                        </button>
                                        <AnimatePresence>
                                            {profileForm.recentlySuccessful && (
                                                <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                                    className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-sm font-bold flex items-center gap-2 border border-green-200">
                                                    <Check className="w-4 h-4" /> Tersimpan!
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* ── Tab: Alamat ── */}
                        {activeTab === 'Alamat' && (
                            // (Address code remains same as before)
                            <motion.div key="alamat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                                <div className="bg-white rounded-[2rem] border-2 border-surface-100 p-8 sm:p-10 shadow-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b-2 border-surface-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-secondary-50 flex items-center justify-center">
                                                <MapPin className="w-6 h-6 text-secondary-500" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-extrabold font-display text-surface-900">Buku Alamat</h2>
                                                <p className="text-sm font-medium text-surface-500">Kelola alamat pengiriman untuk transaksi.</p>
                                            </div>
                                        </div>
                                        <button onClick={() => { setEditingAddress(null); setShowAddressModal(true); }}
                                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-surface-900 text-white font-bold text-sm shadow-elevated hover:bg-surface-800 hover:-translate-y-1 transition-all duration-300">
                                            <Plus className="w-5 h-5" />Tambah Alamat
                                        </button>
                                    </div>

                                    {addresses.length === 0 ? (
                                        <div className="rounded-3xl border-2 border-dashed border-surface-200 bg-surface-50 p-12 text-center group">
                                            <div className="w-20 h-20 rounded-[2rem] bg-white border-2 border-surface-200 flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                                <MapPin className="w-10 h-10 text-surface-300" />
                                            </div>
                                            <p className="text-xl font-extrabold font-display text-surface-900 mb-2">Belum Ada Alamat</p>
                                            <p className="text-sm font-medium text-surface-500 mb-8 max-w-sm mx-auto">Tambahkan alamat rumah atau kosan agar proses checkout lebih cepat.</p>
                                            <button onClick={() => setShowAddressModal(true)}
                                                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-secondary-600 text-white font-bold text-sm shadow-glow-secondary hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                                <Plus className="w-5 h-5" />Tambah Alamat Pertama
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {addresses.map((addr, i) => (
                                                <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                                                    className={`relative bg-white rounded-[2rem] border-2 p-6 transition-all duration-300 hover:shadow-md group ${addr.is_primary ? 'border-primary-500 ring-4 ring-primary-50' : 'border-surface-200 hover:border-surface-300'}`}>
                                                    
                                                    {addr.is_primary && (
                                                        <div className="absolute -top-3 right-6 px-3 py-1 bg-primary-500 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm">
                                                            Utama
                                                        </div>
                                                    )}
                                                    
                                                    <div className="flex flex-col h-full">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${addr.is_primary ? 'bg-primary-50 text-primary-600' : 'bg-surface-100 text-surface-500'}`}>
                                                                <MapPin className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <span className="font-extrabold text-surface-900 text-base">{addr.label || 'Alamat'}</span>
                                                                <p className="text-sm font-bold text-surface-600">{addr.recipient} {addr.phone && <span className="font-medium text-surface-400 ml-1">• {addr.phone}</span>}</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <p className="text-sm font-medium text-surface-600 leading-relaxed mb-6 flex-grow">
                                                            {addr.full_address}{addr.city ? `, ${addr.city}` : ''}{addr.province ? `, ${addr.province}` : ''}{addr.postal_code ? ` ${addr.postal_code}` : ''}
                                                        </p>
                                                        
                                                        <div className="flex items-center gap-3 mt-auto border-t-2 border-surface-50 pt-4">
                                                            <button onClick={() => { setEditingAddress(i); setShowAddressModal(true); }}
                                                                className="flex-1 py-2.5 rounded-xl border-2 border-surface-200 font-bold text-sm text-surface-700 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 transition-all">
                                                                Edit
                                                            </button>
                                                            <button onClick={() => handleDeleteAddress(i)}
                                                                className="w-11 h-11 rounded-xl border-2 border-surface-200 flex items-center justify-center text-surface-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
                                                                <Trash2 className="w-5 h-5" />
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
                            // (Keamanan code remains same as before)
                            <motion.div key="keamanan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                className="bg-white rounded-[2rem] border-2 border-surface-100 p-8 sm:p-10 shadow-sm">
                                <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-surface-100">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-extrabold font-display text-surface-900">Keamanan & Password</h2>
                                        <p className="text-sm font-medium text-surface-500">Jaga akun kamu tetap aman dengan password yang kuat.</p>
                                    </div>
                                </div>

                                <form onSubmit={e => { e.preventDefault(); passwordForm.put(route('password.update')); }} className="space-y-6 max-w-xl">
                                    {[
                                        { key: 'current_password', label: 'Password Saat Ini' },
                                        { key: 'password', label: 'Password Baru' },
                                        { key: 'password_confirmation', label: 'Konfirmasi Password Baru' },
                                    ].map(({ key, label }) => (
                                        <div key={key}>
                                            <label className="block text-sm font-bold text-surface-800 mb-2">{label}</label>
                                            <input type="password" value={passwordForm.data[key]}
                                                onChange={e => passwordForm.setData(key, e.target.value)}
                                                className="w-full px-5 py-3.5 rounded-2xl border-2 border-surface-200 text-sm font-medium text-surface-900 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all" />
                                            {passwordForm.errors[key] && <p className="text-xs font-bold text-red-500 mt-2">{passwordForm.errors[key]}</p>}
                                        </div>
                                    ))}
                                    <div className="flex items-center gap-4 pt-4">
                                        <button type="submit" disabled={passwordForm.processing}
                                            className="px-8 py-3.5 rounded-2xl bg-surface-900 text-white font-extrabold text-base shadow-elevated hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-60 disabled:hover:translate-y-0">
                                            {passwordForm.processing ? 'Menyimpan...' : 'Perbarui Password'}
                                        </button>
                                        <AnimatePresence>
                                            {passwordForm.recentlySuccessful && (
                                                <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                                    className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-sm font-bold flex items-center gap-2 border border-green-200">
                                                    <Check className="w-4 h-4" /> Berhasil!
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </form>

                                {/* Danger zone */}
                                <div className="mt-12 pt-8 border-t-2 border-red-100">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-3xl bg-red-50 border-2 border-red-100">
                                        <div>
                                            <h3 className="text-lg font-extrabold text-red-700 mb-1">Zona Berbahaya</h3>
                                            <p className="text-sm font-medium text-red-600/80">Menghapus akun akan menghapus semua data kamu secara permanen.</p>
                                        </div>
                                        <button
                                            onClick={() => confirm('Yakin ingin menghapus akun? Tindakan ini tidak bisa dibatalkan.') && router.delete(route('profile.destroy'))}
                                            className="shrink-0 px-6 py-3.5 rounded-2xl bg-red-600 text-white font-extrabold text-sm shadow-md hover:bg-red-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                            Hapus Akun Permanen
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
