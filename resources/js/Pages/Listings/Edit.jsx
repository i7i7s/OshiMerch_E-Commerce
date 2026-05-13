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
    { id: 'New', label: 'Baru (New)', desc: 'Belum pernah dipakai, masih dalam packaging', badge: 'bg-[#A7F3D0] text-surface-900' },
    { id: 'Mint', label: 'Mint Condition', desc: 'Pernah dipakai namun tidak ada cacat', badge: 'bg-[#BAE6FD] text-surface-900' },
    { id: 'Used', label: 'Bekas (Used)', desc: 'Ada tanda pemakaian, dideskripsikan di detail', badge: 'bg-[#FEF08A] text-surface-900' },
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
            <label className="block text-xl font-black text-surface-900 font-display uppercase tracking-widest">
                Foto Produk <span className="text-red-500">*</span>
            </label>
            <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => !preview && inputRef.current?.click()}
                className={`group relative rounded-xl border-4 transition-all duration-300 overflow-hidden ${
                    error
                        ? 'border-red-500 bg-[#FECDD3] shadow-[4px_4px_0_0_#0f172a]'
                        : dragging
                        ? 'border-surface-900 bg-[#FEF08A] shadow-[8px_8px_0_0_#0f172a] -translate-y-1 -translate-x-1'
                        : preview
                        ? 'border-surface-900 bg-white shadow-[4px_4px_0_0_#0f172a]'
                        : 'border-surface-900 bg-white hover:bg-[#FEF08A] hover:shadow-[6px_6px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 shadow-[4px_4px_0_0_#0f172a] cursor-pointer'
                }`}
            >
                {preview ? (
                    <div className="relative aspect-[4/5] w-full flex items-center justify-center">
                        <img
                            src={preview}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-cover border-b-4 border-surface-900"
                        />
                        {/* Overlay actions */}
                        <div className="absolute inset-0 bg-surface-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 backdrop-blur-sm">
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                                className="px-6 py-3 rounded-xl bg-[#FEF08A] border-4 border-surface-900 text-surface-900 font-black text-sm shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all flex items-center gap-2 uppercase tracking-widest"
                            >
                                <Upload className="w-5 h-5" /> Ganti Foto
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onFile(null); }}
                                className="px-6 py-3 rounded-xl bg-[#FECDD3] border-4 border-surface-900 text-surface-900 font-black text-sm shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all flex items-center gap-2 uppercase tracking-widest"
                            >
                                <Trash2 className="w-5 h-5" /> Hapus
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 px-8 text-center aspect-[4/5] bg-[url('/img/grid.svg')] bg-[length:24px_24px] bg-center bg-repeat" style={{ backgroundSize: '40px 40px' }}>
                        <div className={`w-20 h-20 rounded-2xl border-4 border-surface-900 flex items-center justify-center mb-6 transition-all duration-300 shadow-[4px_4px_0_0_#0f172a] ${
                            dragging ? 'bg-surface-900 text-white rotate-12 scale-110' : 'bg-[#BAE6FD] text-surface-900 group-hover:-rotate-6 group-hover:scale-110'
                        }`}>
                            <Upload className="w-10 h-10" />
                        </div>
                        <h3 className="font-black font-display text-2xl text-surface-900 uppercase tracking-tight mb-2 bg-white px-3 py-1 border-4 border-surface-900 shadow-[2px_2px_0_0_#0f172a] transform -rotate-2">
                            {dragging ? 'LEPASKAN FOTONYA!' : 'GANTI FOTO BARU'}
                        </h3>
                        <p className="text-sm font-bold text-surface-900 bg-[#FEF08A] px-3 py-1 border-2 border-surface-900 mt-4 shadow-[2px_2px_0_0_#0f172a]">
                            Kosongkan jika ingin pakai foto lama
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
                <p className="text-sm font-black text-white bg-red-500 border-4 border-surface-900 p-2 shadow-[2px_2px_0_0_#0f172a] inline-flex items-center gap-1.5 mt-2 uppercase tracking-widest">
                    <AlertCircle className="w-5 h-5" /> {error}
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
    const displayName = selected ? (selected.nickname || selected.name) : 'CARI MEMBER (OPSIONAL)';

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
                className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border-4 transition-all min-h-[64px] text-left shadow-[4px_4px_0_0_#0f172a] ${
                    open ? 'border-surface-900 bg-[#FEF08A]' : 'border-surface-900 bg-white hover:bg-[#FEF08A] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a]'
                }`}
                aria-expanded={open}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-900 text-white flex items-center justify-center shrink-0 border-2 border-white shadow-[2px_2px_0_0_#0f172a]">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <span className={`font-black uppercase tracking-widest ${selected ? 'text-surface-900 text-base' : 'text-surface-500 text-sm'}`}>
                        {displayName}
                    </span>
                    {selected && <span className="hidden sm:inline-block px-2 py-1 border-2 border-surface-900 bg-white shadow-[2px_2px_0_0_#0f172a] text-[10px] font-black">{selected.type}</span>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {selected && (
                        <button
                            type="button"
                            onClick={clear}
                            className="w-10 h-10 rounded-xl border-4 border-surface-900 bg-[#FECDD3] hover:bg-white flex items-center justify-center transition-colors text-surface-900 shadow-[2px_2px_0_0_#0f172a] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                    <ChevronDown className={`w-6 h-6 text-surface-900 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                </div>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="absolute z-30 top-full left-0 right-0 mt-3 bg-white rounded-xl border-4 border-surface-900 shadow-[8px_8px_0_0_#0f172a] overflow-hidden"
                    >
                        <div className="p-3 border-b-4 border-surface-900 bg-[#BAE6FD]">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-surface-900" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="KETIK NAMA MEMBER..."
                                    className="w-full pl-12 pr-4 py-3 text-sm font-black uppercase tracking-widest bg-white rounded-xl border-4 border-surface-900 focus:outline-none focus:bg-[#FEF08A] transition-all placeholder-surface-400 shadow-[2px_2px_0_0_#0f172a]"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="max-h-64 overflow-y-auto overscroll-contain p-3 divide-y-2 divide-surface-900" role="listbox">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-10 gap-3">
                                    <Loader2 className="w-10 h-10 text-surface-900 animate-spin" />
                                    <p className="text-sm font-black uppercase tracking-widest text-surface-900">MEMUAT...</p>
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="text-center py-10">
                                    <p className="text-xl font-black uppercase tracking-tight text-surface-900">MEMBER TIDAK DITEMUKAN</p>
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    {filtered.map((m) => {
                                        const isSelected = m.code === value.code;
                                        return (
                                            <button
                                                key={m.code}
                                                type="button"
                                                role="option"
                                                aria-selected={isSelected}
                                                onClick={() => select(m)}
                                                className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-all hover:bg-[#FEF08A] ${
                                                    isSelected ? 'bg-[#A7F3D0]' : 'bg-white'
                                                }`}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className={`font-black uppercase tracking-widest text-sm text-surface-900`}>{m.nickname || m.name}</p>
                                                    <p className="text-[10px] font-bold text-surface-900 mt-1 inline-block bg-white px-2 py-0.5 border-2 border-surface-900">{m.type}</p>
                                                </div>
                                                {isSelected && <Check className="w-6 h-6 text-surface-900 shrink-0" />}
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
            <label className="flex items-center gap-2 text-xl font-black text-surface-900 font-display uppercase tracking-widest">
                {label}
                {required && <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#FECDD3] border-2 border-surface-900 text-surface-900 text-sm">*</span>}
            </label>
            {children}
            {helper && !error && <p className="text-[10px] font-bold uppercase tracking-widest text-surface-900 bg-[#FEF08A] inline-block px-2 py-1 border-2 border-surface-900 mt-2 shadow-[2px_2px_0_0_#0f172a]">{helper}</p>}
            {error && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-black uppercase tracking-widest text-white bg-red-500 border-4 border-surface-900 p-2 shadow-[2px_2px_0_0_#0f172a] flex items-center gap-1.5 mt-2 w-fit">
                    <AlertCircle className="w-5 h-5" /> {error}
                </motion.p>
            )}
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Edit({ listing, apiUrl }) {
    const [preview, setPreview] = useState(listing.image_url || null);
    const [member, setMember] = useState({
        code: listing.featured_member_code || '',
        name: listing.featured_member_name || '',
        team: listing.featured_member_team || '',
    });

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PATCH',
        title: listing.title || '',
        description: listing.description || '',
        category: listing.category || '',
        price: listing.price || '',
        condition: listing.condition || '',
        image: null,
        featured_member_code: listing.featured_member_code || '',
        featured_member_name: listing.featured_member_name || '',
        featured_member_team: listing.featured_member_team || '',
    });

    const handleFile = (file) => {
        if (!file) {
            setPreview(listing.image_url || null);
            setData('image', null);
            return;
        }
        setData('image', file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleMember = (m) => {
        setMember(m);
        setData((prev) => ({
            ...prev,
            featured_member_code: m.code,
            featured_member_name: m.name,
            featured_member_team: m.team,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('listings.update', listing.id), { forceFormData: true });
    };

    return (
        <AuthenticatedLayout showFooter>
            <Head title={`Edit Listing — ${listing.title}`} />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 sm:pt-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, type: 'spring', damping: 20 }}
                >
                    {/* Header */}
                    <div className="mb-12 text-center sm:text-left relative">
                        <span className="inline-block px-4 py-2 bg-[#A7F3D0] text-surface-900 border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] font-black uppercase tracking-widest text-sm mb-6 transform rotate-2">
                            UPDATE PRODUK
                        </span>
                        <h1 className="text-4xl sm:text-6xl font-black font-display text-surface-900 tracking-tighter mb-4" style={{ textShadow: '4px 4px 0px #FEF08A' }}>
                            EDIT LISTING JKT48
                        </h1>
                        <p className="text-surface-900 font-bold text-base sm:text-lg max-w-2xl bg-white inline-block px-4 py-2 border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a]">
                            Perbarui detail produk kamu agar informasinya selalu akurat.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="bg-[#FAFAFA] rounded-2xl border-4 border-surface-900 shadow-[8px_8px_0_0_#0f172a] overflow-hidden">
                            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] divide-y-4 lg:divide-y-0 lg:divide-x-4 divide-surface-900">
                                
                                {/* Left Side: Image Dropzone */}
                                <div className="p-6 sm:p-10 bg-[#BAE6FD]">
                                    <div className="sticky top-24">
                                        <ImageDropzone
                                            preview={preview}
                                            onFile={handleFile}
                                            error={errors.image}
                                        />
                                    </div>
                                </div>

                                {/* Right Side: Form Fields */}
                                <div className="p-6 sm:p-10 space-y-10 bg-white">
                                    
                                    {/* Title & Desc */}
                                    <div className="space-y-8">
                                        <Field label="Judul Listing" required error={errors.title}>
                                            <input
                                                type="text"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                placeholder="CONTOH: PHOTOCARD FREYA RIVER"
                                                className={`w-full px-5 py-4 rounded-xl border-4 text-base font-black uppercase tracking-widest text-surface-900 focus:outline-none focus:bg-[#FEF08A] shadow-[4px_4px_0_0_#0f172a] transition-all placeholder-surface-400 ${
                                                    errors.title ? 'border-red-500 bg-[#FECDD3]' : 'border-surface-900 bg-white'
                                                }`}
                                            />
                                        </Field>

                                        <Field label="Deskripsi Produk" required error={errors.description} helper="Jelaskan kondisi detail, kelengkapan, dll.">
                                            <textarea
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                placeholder="CERITAKAN KONDISI BARANG SECARA JUJUR..."
                                                rows={5}
                                                className={`w-full px-5 py-4 rounded-xl border-4 text-base font-bold text-surface-900 focus:outline-none focus:bg-[#FEF08A] shadow-[4px_4px_0_0_#0f172a] transition-all resize-none placeholder-surface-400 ${
                                                    errors.description ? 'border-red-500 bg-[#FECDD3]' : 'border-surface-900 bg-white'
                                                }`}
                                            />
                                        </Field>
                                    </div>

                                    {/* Category Grid */}
                                    <Field label="Kategori" required error={errors.category}>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                                            {CATEGORIES.map(c => (
                                                <button
                                                    key={c.id}
                                                    type="button"
                                                    onClick={() => setData('category', c.id)}
                                                    className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-4 transition-all duration-300 group shadow-[4px_4px_0_0_#0f172a] ${
                                                        data.category === c.id
                                                            ? 'border-surface-900 bg-[#A7F3D0] translate-y-1 translate-x-1 shadow-none'
                                                            : 'border-surface-900 bg-white hover:bg-[#FEF08A] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a]'
                                                    }`}
                                                >
                                                    <span className="text-4xl mb-3 drop-shadow-[2px_2px_0_#0f172a] group-hover:scale-110 transition-transform">{c.icon}</span>
                                                    <span className={`text-xs font-black uppercase tracking-widest text-surface-900`}>{c.name}</span>
                                                    {data.category === c.id && (
                                                        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border-4 border-surface-900 shadow-[2px_2px_0_0_#0f172a] flex items-center justify-center">
                                                            <Check className="w-5 h-5 text-surface-900 font-bold" />
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
                                                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-surface-900 text-lg bg-[#FEF08A] px-2 border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a]">Rp</span>
                                                <input
                                                    type="number"
                                                    value={data.price}
                                                    onChange={(e) => setData('price', e.target.value)}
                                                    placeholder="50000"
                                                    min="1000"
                                                    className={`w-full pl-20 pr-5 py-4 rounded-xl border-4 text-xl font-black text-surface-900 focus:outline-none focus:bg-[#FEF08A] shadow-[4px_4px_0_0_#0f172a] transition-all placeholder-surface-400 ${
                                                        errors.price ? 'border-red-500 bg-[#FECDD3]' : 'border-surface-900 bg-white'
                                                    }`}
                                                />
                                            </div>
                                        </Field>

                                        <Field label="Tag Member JKT48" helper="Opsional tapi penting!">
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
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
                                            {CONDITIONS.map((c) => (
                                                <button
                                                    key={c.id}
                                                    type="button"
                                                    onClick={() => setData('condition', c.id)}
                                                    className={`flex flex-col items-start p-5 rounded-xl border-4 text-left transition-all duration-300 shadow-[4px_4px_0_0_#0f172a] ${
                                                        data.condition === c.id
                                                            ? 'border-surface-900 bg-[#FEF08A] translate-y-1 translate-x-1 shadow-none'
                                                            : 'border-surface-900 bg-white hover:bg-surface-50 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a]'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between w-full mb-4">
                                                        <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all ${
                                                            data.condition === c.id ? 'border-surface-900 bg-surface-900' : 'border-surface-900 bg-white'
                                                        }`}>
                                                            {data.condition === c.id && <Check className="w-4 h-4 text-white font-bold" />}
                                                        </div>
                                                        <span className={`px-2 py-1 border-4 border-surface-900 shadow-[2px_2px_0_0_#0f172a] text-[10px] font-black uppercase ${c.badge} transform rotate-2`}>
                                                            {c.id}
                                                        </span>
                                                    </div>
                                                    <p className={`text-xl font-black uppercase tracking-tight mb-2 text-surface-900`}>
                                                        {c.label}
                                                    </p>
                                                    <p className="text-xs font-bold text-surface-700 bg-white px-2 py-1 border-2 border-surface-900 inline-block w-full">
                                                        {c.desc}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    </Field>
                                </div>
                            </div>
                            
                            {/* Submit Section */}
                            <div className="p-6 sm:p-10 bg-[#FEF08A] border-t-4 border-surface-900 flex flex-col sm:flex-row items-center gap-6 justify-between">
                                <p className="text-sm font-black uppercase tracking-widest text-surface-900 text-center sm:text-left max-w-sm bg-white px-4 py-2 border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] transform -rotate-1">
                                    PASTIKAN SEMUA DATA BENAR SEBELUM DISIMPAN!
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                    <button
                                        type="button"
                                        onClick={() => history.back()}
                                        className="px-8 py-4 rounded-xl border-4 border-surface-900 bg-white text-surface-900 font-black text-lg hover:bg-[#FECDD3] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_0_#0f172a] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all w-full sm:w-auto uppercase tracking-widest"
                                    >
                                        BATAL
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-10 py-4 rounded-xl border-4 border-surface-900 bg-[#A7F3D0] text-surface-900 font-black text-lg shadow-[6px_6px_0_0_#0f172a] hover:bg-white hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0_0_#0f172a] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 w-full sm:w-auto uppercase tracking-widest transform rotate-1 hover:rotate-0"
                                    >
                                        <span className="relative z-10 flex items-center gap-3">
                                            {processing && <Loader2 className="w-6 h-6 animate-spin" />}
                                            {processing ? 'GASPOL...' : '🚀 SIMPAN PERUBAHAN!'}
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
