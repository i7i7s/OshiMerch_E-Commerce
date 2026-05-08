import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Search, Check, ChevronDown, Loader2 } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES = [
    { id: 'photocard', name: 'Photocard' },
    { id: 'lightstick', name: 'Lightstick' },
    { id: 'apparel', name: 'Apparel' },
    { id: 'poster', name: 'Poster' },
    { id: 'album', name: 'Album & CD' },
    { id: 'keychain', name: 'Keychain' },
    { id: 'towel', name: 'Towel' },
    { id: 'penlight', name: 'Penlight' },
];

const CONDITIONS = [
    { id: 'New', label: 'Baru (New)', desc: 'Belum pernah dipakai, masih dalam packaging' },
    { id: 'Mint', label: 'Mint Condition', desc: 'Pernah dipakai namun tidak ada cacat' },
    { id: 'Used', label: 'Bekas (Used)', desc: 'Ada tanda pemakaian, dideskripsikan di detail' },
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
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-surface-700">
                Foto Produk <span className="text-red-500">*</span>
            </label>
            <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => !preview && inputRef.current?.click()}
                className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden ${
                    error
                        ? 'border-red-400 bg-red-50'
                        : dragging
                        ? 'border-primary-400 bg-primary-50'
                        : preview
                        ? 'border-surface-200 cursor-default'
                        : 'border-surface-300 hover:border-primary-400 hover:bg-primary-50/50 cursor-pointer'
                }`}
            >
                {preview ? (
                    <div className="relative aspect-[3/4] max-h-96">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-contain bg-surface-50"
                        />
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onFile(null); }}
                            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                            aria-label="Hapus foto"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                            className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-white/90 text-surface-700 text-xs font-semibold shadow hover:bg-white transition-colors"
                        >
                            Ganti Foto
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                            dragging ? 'bg-primary-100' : 'bg-surface-100'
                        }`}>
                            <Upload className={`w-6 h-6 ${dragging ? 'text-primary-500' : 'text-surface-400'}`} />
                        </div>
                        <p className="font-semibold text-surface-700 text-sm mb-1">
                            {dragging ? 'Lepas file di sini' : 'Seret & lepas foto di sini'}
                        </p>
                        <p className="text-xs text-surface-500 mb-4">atau klik untuk pilih dari galeri</p>
                        <span className="px-4 py-2 rounded-xl border border-surface-300 text-surface-600 text-xs font-medium hover:border-primary-400 hover:text-primary-600 transition-colors">
                            Pilih Foto
                        </span>
                        <p className="text-[11px] text-surface-400 mt-3">JPEG, PNG, WebP — maks. 4 MB</p>
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
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
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

    // Fetch members once on mount
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

    // Close on outside click
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
    const displayName = selected ? (selected.nickname || selected.name) : 'Pilih member (opsional)';

    const select = (member) => {
        onChange({
            code: member.code,
            name: member.name,
            team: (member.type || '').toUpperCase(),
        });
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
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-surface-200 bg-white text-sm text-surface-700 hover:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all min-h-[44px]"
                aria-expanded={open}
                aria-haspopup="listbox"
            >
                <span className={selected ? 'text-surface-800 font-medium' : 'text-surface-400'}>
                    {displayName}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                    {selected && (
                        <button
                            type="button"
                            onClick={clear}
                            className="w-5 h-5 rounded-full bg-surface-200 hover:bg-surface-300 flex items-center justify-center transition-colors"
                            aria-label="Hapus pilihan member"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                    <ChevronDown className={`w-4 h-4 text-surface-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                </div>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-30 top-full left-0 right-0 mt-1.5 bg-white rounded-2xl border border-surface-200 shadow-elevated overflow-hidden"
                    >
                        {/* Search */}
                        <div className="p-2 border-b border-surface-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Cari nama member..."
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-surface-50 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-400"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* List */}
                        <div className="max-h-56 overflow-y-auto overscroll-contain" role="listbox">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-5 h-5 text-surface-400 animate-spin" />
                                </div>
                            ) : filtered.length === 0 ? (
                                <p className="text-sm text-surface-500 text-center py-6">Tidak ditemukan</p>
                            ) : (
                                filtered.map((m) => {
                                    const isSelected = m.code === value.code;
                                    return (
                                        <button
                                            key={m.code}
                                            type="button"
                                            role="option"
                                            aria-selected={isSelected}
                                            onClick={() => select(m)}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-primary-50 min-h-[44px] ${
                                                isSelected ? 'bg-primary-50 text-primary-700' : 'text-surface-700'
                                            }`}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{m.nickname || m.name}</p>
                                                <p className="text-[11px] text-surface-400">{m.type}</p>
                                            </div>
                                            {isSelected && <Check className="w-4 h-4 text-primary-500 shrink-0" />}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ label, required, error, helper, children }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-surface-700">
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            {children}
            {helper && !error && <p className="text-xs text-surface-400">{helper}</p>}
            {error && <p className="text-xs text-red-500">{error}</p>}
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
        post(route('listings.store'), {
            forceFormData: true,
            onSuccess: () => { reset(); setPreview(null); setMember({ code: '', name: '', team: '' }); },
        });
    };

    return (
        <AuthenticatedLayout showFooter>
            <Head title="Jual Merchandise — OshiMerch" />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold font-display text-surface-900 tracking-tight">
                            Jual Merchandise
                        </h1>
                        <p className="text-surface-500 text-sm mt-1">
                            Isi detail produk yang ingin kamu jual kepada fans JKT48.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8">
                            {/* Left: Image */}
                            <ImageDropzone
                                preview={preview}
                                onFile={handleFile}
                                error={errors.image}
                            />

                            {/* Right: Fields */}
                            <div className="space-y-5">
                                <Field label="Judul Listing" required error={errors.title}>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Contoh: Photocard Freya River Ver. Mint"
                                        className={`w-full px-4 py-3 rounded-xl border text-sm text-surface-800 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all min-h-[44px] ${
                                            errors.title ? 'border-red-400 bg-red-50' : 'border-surface-200'
                                        }`}
                                    />
                                </Field>

                                <Field label="Deskripsi" error={errors.description} helper="Jelaskan kondisi detail, kelengkapan, dll.">
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Ceritakan kondisi barang, apakah ada kerusakan, kelengkapan, dll."
                                        rows={4}
                                        className={`w-full px-4 py-3 rounded-xl border text-sm text-surface-800 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all resize-none ${
                                            errors.description ? 'border-red-400 bg-red-50' : 'border-surface-200'
                                        }`}
                                    />
                                </Field>

                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Kategori" required error={errors.category}>
                                        <select
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                            className={`w-full px-4 py-3 rounded-xl border text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all min-h-[44px] cursor-pointer ${
                                                errors.category ? 'border-red-400 bg-red-50' : 'border-surface-200'
                                            }`}
                                        >
                                            <option value="">Pilih kategori</option>
                                            {CATEGORIES.map((c) => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </Field>

                                    <Field label="Harga (Rp)" required error={errors.price}>
                                        <input
                                            type="number"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            placeholder="50000"
                                            min="1000"
                                            className={`w-full px-4 py-3 rounded-xl border text-sm text-surface-800 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all min-h-[44px] ${
                                                errors.price ? 'border-red-400 bg-red-50' : 'border-surface-200'
                                            }`}
                                        />
                                    </Field>
                                </div>

                                {/* Condition */}
                                <Field label="Kondisi Barang" required error={errors.condition}>
                                    <div className="space-y-2">
                                        {CONDITIONS.map((c) => (
                                            <button
                                                key={c.id}
                                                type="button"
                                                onClick={() => setData('condition', c.id)}
                                                className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                                                    data.condition === c.id
                                                        ? 'border-primary-500 bg-primary-50'
                                                        : 'border-surface-200 hover:border-primary-200'
                                                }`}
                                            >
                                                <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center transition-all ${
                                                    data.condition === c.id ? 'border-primary-500 bg-primary-500' : 'border-surface-300'
                                                }`}>
                                                    {data.condition === c.id && (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-semibold ${data.condition === c.id ? 'text-primary-700' : 'text-surface-700'}`}>
                                                        {c.label}
                                                    </p>
                                                    <p className="text-xs text-surface-500 mt-0.5">{c.desc}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </Field>

                                {/* Member tag */}
                                <Field label="Tag Member JKT48" helper="Opsional — membantu pembeli filter berdasarkan member favorit">
                                    <MemberCombobox
                                        apiUrl={apiUrl}
                                        value={member}
                                        onChange={handleMember}
                                    />
                                    {errors.featured_member_code && (
                                        <p className="text-xs text-red-500 mt-1">{errors.featured_member_code}</p>
                                    )}
                                </Field>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="mt-8 pt-6 border-t border-surface-200 flex flex-col sm:flex-row items-center gap-3 justify-end">
                            <button
                                type="button"
                                onClick={() => history.back()}
                                className="px-6 py-3 rounded-xl border border-surface-300 text-surface-700 font-semibold text-sm hover:bg-surface-100 transition-colors w-full sm:w-auto"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-3 rounded-xl gradient-primary text-white font-semibold text-sm shadow-glow-primary hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 flex items-center gap-2 w-full sm:w-auto justify-center"
                            >
                                {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                                {processing ? 'Mempublikasikan...' : 'Publikasikan Listing'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
