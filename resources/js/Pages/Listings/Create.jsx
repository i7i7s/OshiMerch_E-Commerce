import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Search, Check, ChevronDown, Loader2, Sparkles, AlertCircle, Trash2 } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES = [
    { id: 'photocard', name: 'Photocard', icon: '📸' },
    { id: 'lightstick', name: 'Lightstick', icon: '🔦' },
    { id: 'apparel', name: 'Apparel', icon: '👕' },
    { id: 'poster', name: 'Poster', icon: '🖼️' },
    { id: 'album', name: 'Album & CD', icon: '💿' },
    { id: 'keychain', name: 'Keychain', icon: '🔑' },
    { id: 'towel', name: 'Towel', icon: '🧣' },
    { id: 'other', name: 'Other', icon: '📦' },
];

const CONDITIONS = [
    { id: 'New', label: 'Baru (New)', desc: 'Belum pernah dipakai, masih dalam packaging', badge: 'bg-green-100 text-green-700' },
    { id: 'Mint', label: 'Mint Condition', desc: 'Pernah dipakai namun tidak ada cacat', badge: 'bg-blue-100 text-blue-700' },
    { id: 'Used', label: 'Bekas (Used)', desc: 'Ada tanda pemakaian, dideskripsikan di detail', badge: 'bg-amber-100 text-amber-700' },
];

// ─── Debounce hook ───────────────────────────────────────────────────────────

function useDebounce(value, delay = 300) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

// ─── Image Dropzone ───────────────────────────────────────────────────────────

function ImageDropzone({ preview, onFile, error }) {
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) onFile(file);
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) onFile(file);
    };

    return (
        <div className="space-y-3 relative">
            <label className="block text-base font-extrabold text-surface-900 font-display">
                Foto Produk <span className="text-red-500">*</span>
            </label>
            <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => !preview && inputRef.current?.click()}
                className={`group relative rounded-[2rem] border-4 border-dashed transition-all duration-500 overflow-hidden ${
                    error
                        ? 'border-red-400 bg-red-50'
                        : dragging
                        ? 'border-primary-500 bg-primary-50 scale-[1.02] shadow-glow-primary'
                        : preview
                        ? 'border-transparent bg-surface-100 shadow-elevated'
                        : 'border-surface-200 bg-surface-50 hover:border-primary-400 hover:bg-primary-50/50 cursor-pointer'
                }`}
            >
                {preview ? (
                    <div className="relative aspect-[4/5] w-full flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
                        <img
                            src={preview}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-contain"
                        />
                        {/* Overlay actions */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 backdrop-blur-sm">
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                                className="px-6 py-3 rounded-xl bg-white text-surface-900 font-bold text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <Upload className="w-4 h-4" /> Ganti Foto
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onFile(null); }}
                                className="px-6 py-3 rounded-xl bg-red-600 text-white font-bold text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" /> Hapus
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 px-8 text-center aspect-[4/5]">
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 shadow-sm ${
                            dragging ? 'bg-primary-500 text-white scale-110 shadow-glow-primary' : 'bg-white text-surface-400 border-2 border-surface-200 group-hover:bg-primary-50 group-hover:text-primary-500 group-hover:border-primary-200 group-hover:scale-110'
                        }`}>
                            <Upload className="w-8 h-8" />
                        </div>
                        <h3 className="font-extrabold font-display text-lg text-surface-900 mb-2">
                            {dragging ? 'Lepaskan Untuk Mengunggah!' : 'Unggah Foto Keren Barangmu'}
                        </h3>
                        <p className="text-sm font-medium text-surface-500 mb-6 max-w-[200px] leading-relaxed">
                            Seret dan lepas file di sini, atau klik tombol di bawah untuk memilih file.
                        </p>
                        <span className="px-6 py-3 rounded-xl border-2 border-surface-300 text-surface-700 font-bold text-sm group-hover:bg-primary-500 group-hover:border-primary-500 group-hover:text-white transition-all duration-300 shadow-sm">
                            Pilih File Foto
                        </span>
                        <p className="text-xs font-semibold text-surface-400 mt-6 bg-surface-100 px-3 py-1.5 rounded-lg">
                            Format JPG, PNG, WebP (Maks. 4MB)
                        </p>
                    </div>
                )}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                className="sr-only"
                onChange={handleChange}
            />
            {error && (
                <p className="text-sm font-bold text-red-500 flex items-center gap-1.5 mt-2">
                    <AlertCircle className="w-4 h-4" /> {error}
                </p>
            )}
        </div>
    );
}

// ─── Member Combobox ──────────────────────────────────────────────────────────

function MemberCombobox({ apiUrl, value, onChange }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const debouncedQuery = useDebounce(query, 300);
    const ref = useRef(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${apiUrl}/api/members`);
                const json = await res.json();
                if (json.status && json.data) setMembers(json.data);
            } catch (_) {
                // silent fail
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [apiUrl]);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const filtered = debouncedQuery
        ? members.filter((m) =>
              (m.name || '').toLowerCase().includes(debouncedQuery.toLowerCase()) ||
              (m.nickname || '').toLowerCase().includes(debouncedQuery.toLowerCase()),
          )
        : members;

    const selected = value.code ? members.find((m) => m.code === value.code) : null;
    const displayName = selected ? (selected.nickname || selected.name) : 'Cari Member (Opsional)';

    const select = (member) => {
        const team = (member.type || '').toUpperCase().replace('JKT48_VIRTUAL', 'VIRTUAL');
        onChange({ code: member.code, name: member.name, team });
        setOpen(false);
        setQuery('');
    };

    const clear = (e) => {
        e.stopPropagation();
        onChange({ code: '', name: '', team: '' });
    };

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all min-h-[56px] text-left ${
                    open ? 'border-primary-500 ring-4 ring-primary-100 bg-white' : 'border-surface-200 bg-surface-50 hover:bg-white hover:border-primary-300'
                }`}
                aria-expanded={open}
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <span className={`font-bold ${selected ? 'text-surface-900 text-base' : 'text-surface-400 text-sm'}`}>
                        {displayName}
                    </span>
                    {selected && <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-surface-200 text-surface-600 ml-2">{selected.type}</span>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {selected && (
                        <button
                            type="button"
                            onClick={clear}
                            className="w-7 h-7 rounded-full bg-surface-200 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors text-surface-500"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                    <ChevronDown className={`w-5 h-5 text-surface-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                </div>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="absolute z-30 top-full left-0 right-0 mt-3 bg-white rounded-2xl border-2 border-surface-200 shadow-elevated overflow-hidden"
                    >
                        <div className="p-3 border-b-2 border-surface-100 bg-surface-50">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Ketik nama member untuk mencari..."
                                    className="w-full pl-11 pr-4 py-3 text-sm font-bold bg-white rounded-xl border-2 border-surface-200 focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all placeholder-surface-400"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="max-h-64 overflow-y-auto overscroll-contain p-2" role="listbox">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-10 gap-3">
                                    <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                                    <p className="text-sm font-bold text-surface-500">Memuat data member...</p>
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="text-center py-10">
                                    <p className="text-base font-bold text-surface-700">Member tidak ditemukan</p>
                                    <p className="text-sm text-surface-500 mt-1">Coba kata kunci lain.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {filtered.map((m) => {
                                        const isSelected = m.code === value.code;
                                        return (
                                            <button
                                                key={m.code}
                                                type="button"
                                                role="option"
                                                aria-selected={isSelected}
                                                onClick={() => select(m)}
                                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                                                    isSelected ? 'bg-primary-50 border-2 border-primary-200 shadow-sm' : 'border-2 border-transparent hover:bg-surface-100 hover:border-surface-200'
                                                }`}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className={`font-bold truncate text-sm ${isSelected ? 'text-primary-700' : 'text-surface-900'}`}>{m.nickname || m.name}</p>
                                                    <p className="text-xs font-semibold text-surface-400 mt-0.5">{m.type}</p>
                                                </div>
                                                {isSelected && <Check className="w-5 h-5 text-primary-600 shrink-0" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ label, required, error, helper, children, className = '' }) {
    return (
        <div className={`space-y-2 ${className}`}>
            <label className="flex items-center gap-2 text-base font-extrabold text-surface-900 font-display">
                {label}
                {required && <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600 text-[10px]">*</span>}
            </label>
            {children}
            {helper && !error && <p className="text-sm font-medium text-surface-500 mt-1">{helper}</p>}
            {error && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-bold text-red-500 flex items-center gap-1.5 mt-1">
                    <AlertCircle className="w-4 h-4" /> {error}
                </motion.p>
            )}
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Create({ apiUrl }) {
    const [preview, setPreview] = useState(null);
    const [member, setMember] = useState({ code: '', name: '', team: '' });

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        category: '',
        price: '',
        condition: '',
        image: null,
        featured_member_code: '',
        featured_member_name: '',
        featured_member_team: '',
    });

    const handleFile = (file) => {
        if (!file) {
            setPreview(null);
            setData('image', null);
            return;
        }
        setData('image', file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('listings.store'), {
            forceFormData: true,
            onSuccess: () => { reset(); setPreview(null); setMember({ code: '', name: '', team: '' }); },
        });
    };

    return (
        <AuthenticatedLayout showFooter>
            <Head title="Jual Merchandise — OshiMerch" />

            {/* Top decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-96 gradient-primary opacity-10 blur-3xl pointer-events-none -z-10" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, type: 'spring', damping: 20 }}
                >
                    {/* Header */}
                    <div className="mb-10 text-center sm:text-left">
                        <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 font-black uppercase tracking-widest rounded-full text-xs mb-4">
                            Mulai Berjualan
                        </span>
                        <h1 className="text-3xl sm:text-5xl font-black font-display text-surface-900 tracking-tight mb-3">
                            Jual Merchandise JKT48
                        </h1>
                        <p className="text-surface-500 font-medium text-base sm:text-lg max-w-2xl">
                            Isi detail produk dengan lengkap agar fans lain lebih mudah menemukannya.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="bg-white rounded-[2.5rem] border-2 border-surface-100 shadow-elevated overflow-hidden">
                            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-surface-100">
                                
                                {/* Left Side: Image Dropzone */}
                                <div className="p-6 sm:p-10 bg-surface-50/50">
                                    <div className="sticky top-24">
                                        <ImageDropzone
                                            preview={preview}
                                            onFile={handleFile}
                                            error={errors.image}
                                        />
                                    </div>
                                </div>

                                {/* Right Side: Form Fields */}
                                <div className="p-6 sm:p-10 space-y-10">
                                    
                                    {/* Title & Desc */}
                                    <div className="space-y-8">
                                        <Field label="Judul Listing" required error={errors.title}>
                                            <input
                                                type="text"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                placeholder="Contoh: Photocard Freya River Ver. Mint"
                                                className={`w-full px-5 py-4 rounded-2xl border-2 text-base font-bold text-surface-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all placeholder-surface-400 ${
                                                    errors.title ? 'border-red-400 bg-red-50' : 'border-surface-200 bg-surface-50'
                                                }`}
                                            />
                                        </Field>

                                        <Field label="Deskripsi Produk" required error={errors.description} helper="Jelaskan kondisi detail, kelengkapan, dll.">
                                            <textarea
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                placeholder="Ceritakan kondisi barang secara jujur..."
                                                rows={5}
                                                className={`w-full px-5 py-4 rounded-2xl border-2 text-base font-medium text-surface-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all resize-none placeholder-surface-400 ${
                                                    errors.description ? 'border-red-400 bg-red-50' : 'border-surface-200 bg-surface-50'
                                                }`}
                                            />
                                        </Field>
                                    </div>

                                    {/* Category Grid */}
                                    <Field label="Kategori" required error={errors.category}>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {CATEGORIES.map(c => (
                                                <button
                                                    key={c.id}
                                                    type="button"
                                                    onClick={() => setData('category', c.id)}
                                                    className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 group ${
                                                        data.category === c.id
                                                            ? 'border-primary-500 bg-primary-50 shadow-sm scale-[1.02]'
                                                            : 'border-surface-200 bg-white hover:border-primary-300 hover:bg-surface-50'
                                                    }`}
                                                >
                                                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{c.icon}</span>
                                                    <span className={`text-xs font-bold ${data.category === c.id ? 'text-primary-700' : 'text-surface-600'}`}>{c.name}</span>
                                                    {data.category === c.id && (
                                                        <div className="absolute top-2 right-2">
                                                            <Check className="w-4 h-4 text-primary-500" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </Field>

                                    {/* Price & Member */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <Field label="Harga (Rp)" required error={errors.price}>
                                            <div className="relative">
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-extrabold text-surface-400">Rp</span>
                                                <input
                                                    type="number"
                                                    value={data.price}
                                                    onChange={(e) => setData('price', e.target.value)}
                                                    placeholder="50.000"
                                                    min="1000"
                                                    className={`w-full pl-14 pr-5 py-4 rounded-2xl border-2 text-lg font-extrabold text-surface-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all placeholder-surface-300 ${
                                                        errors.price ? 'border-red-400 bg-red-50' : 'border-surface-200 bg-surface-50'
                                                    }`}
                                                />
                                            </div>
                                        </Field>

                                        <Field label="Tag Member JKT48" helper="Untuk membantu filter pencarian">
                                            <MemberCombobox
                                                apiUrl={apiUrl}
                                                value={member}
                                                onChange={(m) => {
                                                    setMember(m);
                                                    setData(prev => ({ ...prev, featured_member_code: m.code, featured_member_name: m.name, featured_member_team: m.team }));
                                                }}
                                            />
                                            {errors.featured_member_code && (
                                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-bold text-red-500 flex items-center gap-1.5 mt-2">
                                                    <AlertCircle className="w-4 h-4" /> {errors.featured_member_code}
                                                </motion.p>
                                            )}
                                        </Field>
                                    </div>

                                    {/* Condition */}
                                    <Field label="Kondisi Barang" required error={errors.condition}>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {CONDITIONS.map((c) => (
                                                <button
                                                    key={c.id}
                                                    type="button"
                                                    onClick={() => setData('condition', c.id)}
                                                    className={`flex flex-col items-start p-5 rounded-2xl border-2 text-left transition-all duration-300 ${
                                                        data.condition === c.id
                                                            ? 'border-primary-500 bg-primary-50 shadow-sm scale-[1.02]'
                                                            : 'border-surface-200 bg-white hover:border-primary-300 hover:bg-surface-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between w-full mb-3">
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                                            data.condition === c.id ? 'border-primary-500 bg-primary-500' : 'border-surface-300'
                                                        }`}>
                                                            {data.condition === c.id && <div className="w-2 h-2 rounded-full bg-white" />}
                                                        </div>
                                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${c.badge}`}>
                                                            {c.id}
                                                        </span>
                                                    </div>
                                                    <p className={`text-base font-extrabold mb-1 ${data.condition === c.id ? 'text-primary-700' : 'text-surface-900'}`}>
                                                        {c.label}
                                                    </p>
                                                    <p className="text-xs font-medium text-surface-500 leading-relaxed">
                                                        {c.desc}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    </Field>
                                </div>
                            </div>
                            
                            {/* Submit Section */}
                            <div className="p-6 sm:p-10 bg-surface-50 border-t-2 border-surface-100 flex flex-col sm:flex-row items-center gap-4 justify-between">
                                <p className="text-sm font-medium text-surface-500 text-center sm:text-left max-w-sm">
                                    Dengan menekan tombol publikasi, kamu setuju dengan aturan komunitas OshiMerch.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                    <button
                                        type="button"
                                        onClick={() => history.back()}
                                        className="px-8 py-4 rounded-2xl border-2 border-surface-300 text-surface-700 font-bold text-base hover:bg-white hover:border-surface-400 transition-colors w-full sm:w-auto"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="group relative px-10 py-4 rounded-2xl gradient-primary text-white font-extrabold text-base shadow-glow-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 w-full sm:w-auto overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                        <span className="relative z-10 flex items-center gap-2">
                                            {processing && <Loader2 className="w-5 h-5 animate-spin" />}
                                            {processing ? 'Mempublikasikan...' : 'Publikasikan Listing'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
