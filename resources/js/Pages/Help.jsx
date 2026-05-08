import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShoppingCart, Store, ShieldCheck, HelpCircle, Phone, 
    FileText, Lock, RefreshCcw, Users, Search, ChevronRight 
} from 'lucide-react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

const ICONS = {
    'cara-beli': ShoppingCart,
    'cara-jual': Store,
    'keamanan-transaksi': ShieldCheck,
    'faq': HelpCircle,
    'hubungi-kami': Phone,
    'syarat-ketentuan': FileText,
    'kebijakan-privasi': Lock,
    'kebijakan-pengembalian': RefreshCcw,
    'panduan-komunitas': Users,
};

const HELP_DATA = [
    {
        category: 'Bantuan',
        items: [
            { 
                id: 'cara-beli', 
                title: 'Cara Beli', 
                content: (
                    <div className="space-y-6">
                        <p className="text-surface-600 leading-relaxed text-lg">Membeli merchandise incaranmu di OshiMerch sangat mudah dan aman. Ikuti langkah-langkah berikut:</p>
                        <div className="space-y-4">
                            {[
                                'Cari merchandise incaranmu lewat fitur pencarian atau halaman member.',
                                'Pilih produk yang kamu inginkan, perhatikan detail kondisi dan harga.',
                                'Klik "Beli Sekarang" atau mulai percakapan (Chat) dengan penjual.',
                                'Selesaikan pembayaran menggunakan metode yang tersedia. Saldo akan ditahan oleh sistem kami (Rekber).',
                                'Setelah barang sampai dan sesuai deskripsi, klik "Selesaikan Transaksi". Dana baru akan diteruskan ke penjual!'
                            ].map((step, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-surface-50 border border-surface-100 items-start">
                                    <div className="w-8 h-8 rounded-full gradient-primary text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm">{i + 1}</div>
                                    <p className="text-surface-700 font-medium pt-1">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) 
            },
            { 
                id: 'cara-jual', 
                title: 'Cara Jual', 
                content: (
                    <div className="space-y-6">
                        <p className="text-surface-600 leading-relaxed text-lg">Ubah koleksi lamamu menjadi cuan! Menjadi seller di OshiMerch sangat cepat.</p>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="p-6 rounded-3xl bg-surface-50 border border-surface-100 hover:border-primary-200 transition-colors">
                                <Store className="w-8 h-8 text-primary-500 mb-4" />
                                <h3 className="font-bold text-surface-900 mb-2">1. Pasang Listing</h3>
                                <p className="text-sm text-surface-600">Klik tombol "Jual", unggah foto produk yang jelas, isi deskripsi jujur mengenai kondisi (Mint/Good/Damaged), lalu tetapkan harga.</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-surface-50 border border-surface-100 hover:border-primary-200 transition-colors">
                                <ShoppingCart className="w-8 h-8 text-secondary-500 mb-4" />
                                <h3 className="font-bold text-surface-900 mb-2">2. Terima Pesanan</h3>
                                <p className="text-sm text-surface-600">Saat ada pembeli, kemas barang dengan aman (gunakan bubble wrap/toploader untuk photocard). Input resi pengiriman ke sistem.</p>
                            </div>
                        </div>
                        <div className="p-4 bg-primary-50 border border-primary-100 rounded-2xl text-primary-800 text-sm font-medium">
                            💡 Tips: Pastikan kamu mencantumkan member terkait agar listingmu muncul di halaman profil member tersebut!
                        </div>
                    </div>
                ) 
            },
            { 
                id: 'keamanan-transaksi', 
                title: 'Keamanan Transaksi', 
                content: (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center rotate-3 shadow-sm">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-surface-900">100% Dilindungi Rekber</h3>
                                <p className="text-surface-500">Uangmu aman bersama kami.</p>
                            </div>
                        </div>
                        <p className="text-surface-600 leading-relaxed">
                            Semua transaksi di OshiMerch menggunakan sistem Rekening Bersama (Rekber) otomatis. Artinya:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-surface-700">
                            <li>Uang yang dibayar pembeli akan <b>ditahan oleh OshiMerch</b>.</li>
                            <li>Penjual hanya bisa menerima uang tersebut <b>setelah pembeli mengonfirmasi</b> bahwa barang telah diterima dalam kondisi sesuai.</li>
                            <li>Jika barang tidak dikirim dalam batas waktu, uang otomatis dikembalikan 100% ke pembeli.</li>
                        </ul>
                    </div>
                ) 
            },
            { 
                id: 'faq', 
                title: 'FAQ', 
                content: (
                    <div className="space-y-4">
                        {[
                            { q: "Apakah aplikasi ini resmi buatan JOT (JKT48 Operation Team)?", a: "Tidak. OshiMerch adalah marketplace independen yang dibuat dari fans, oleh fans, dan untuk fans." },
                            { q: "Apakah ada biaya admin?", a: "Saat ini transaksi di OshiMerch 100% gratis tanpa potongan biaya layanan." },
                            { q: "Bagaimana jika barang yang datang palsu/bootleg?", a: "Kamu bisa mengajukan komplain sebelum menekan tombol Selesai. Tim kami akan melakukan mediasi dan dana bisa dikembalikan jika terbukti palsu." }
                        ].map((faq, i) => (
                            <div key={i} className="p-5 rounded-2xl bg-surface-50 border border-surface-100">
                                <h4 className="font-bold text-surface-900 mb-2 flex gap-2">
                                    <span className="text-primary-500">Q:</span> {faq.q}
                                </h4>
                                <p className="text-surface-600 text-sm leading-relaxed flex gap-2">
                                    <span className="text-secondary-500 font-bold">A:</span> {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                ) 
            },
            { 
                id: 'hubungi-kami', 
                title: 'Hubungi Kami', 
                content: (
                    <div className="text-center py-8">
                        <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Phone className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-surface-900 mb-2">Butuh Bantuan Langsung?</h3>
                        <p className="text-surface-600 mb-8 max-w-md mx-auto">Tim support kami (yang juga Wota) siap membalas pesanmu 24/7. Hubungi kami melalui:</p>
                        
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="mailto:support@oshimerch.test" className="px-6 py-3 rounded-xl bg-surface-900 text-white font-semibold hover:bg-surface-800 transition-colors shadow-md">
                                Email Support
                            </a>
                            <a href="#" className="px-6 py-3 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#20b858] transition-colors shadow-md">
                                WhatsApp Admin
                            </a>
                        </div>
                    </div>
                ) 
            },
        ]
    },
    {
        category: 'Kebijakan',
        items: [
            { 
                id: 'syarat-ketentuan', 
                title: 'Syarat & Ketentuan', 
                content: (
                    <div className="prose prose-surface prose-p:text-surface-600 max-w-none">
                        <h3>1. Penerimaan Syarat</h3>
                        <p>Dengan mengakses dan menggunakan OshiMerch, Anda menyetujui untuk terikat dengan seluruh syarat dan ketentuan ini.</p>
                        <h3>2. Penggunaan Layanan</h3>
                        <p>Platform ini hanya boleh digunakan untuk jual-beli merchandise resmi/fanmade (jika dinyatakan jelas) yang berhubungan dengan JKT48 atau sister groupnya. Dilarang keras menjual barang ilegal, pornografi, atau tiket palsu.</p>
                        <h3>3. Akun Pengguna</h3>
                        <p>Anda bertanggung jawab penuh atas keamanan akun Anda. OshiMerch tidak bertanggung jawab atas kerugian akibat peretasan akun pribadi.</p>
                    </div>
                ) 
            },
            { 
                id: 'kebijakan-privasi', 
                title: 'Kebijakan Privasi', 
                content: (
                    <div className="prose prose-surface prose-p:text-surface-600 max-w-none">
                        <p>Kami sangat menghargai privasi Anda. Data pribadi yang kami kumpulkan meliputi:</p>
                        <ul>
                            <li><strong>Data Identitas:</strong> Nama, email, nomor HP.</li>
                            <li><strong>Data Transaksi:</strong> Riwayat pembelian dan alamat pengiriman.</li>
                        </ul>
                        <p>Data tersebut <strong>TIDAK AKAN</strong> dijual kepada pihak ketiga dan murni hanya digunakan untuk keperluan operasional platform (pengiriman barang & verifikasi keamanan).</p>
                    </div>
                ) 
            },
            { 
                id: 'kebijakan-pengembalian', 
                title: 'Kebijakan Pengembalian', 
                content: (
                    <div className="space-y-6">
                        <div className="bg-red-50 border border-red-100 p-5 rounded-2xl">
                            <h3 className="font-bold text-red-800 mb-2">Syarat Mutlak Retur (Wajib Unboxing)</h3>
                            <p className="text-red-600 text-sm">Pembeli <strong>WAJIB</strong> menyertakan video unboxing penuh (tanpa potong/edit) dari sejak paket masih tertutup resi hingga barang terlihat jelas kerusakannya.</p>
                        </div>
                        <ul className="list-decimal pl-5 space-y-2 text-surface-600">
                            <li>Pengajuan retur maksimal 2x24 jam sejak resi dinyatakan delivered.</li>
                            <li>Kerusakan akibat kelalaian kurir di luar tanggung jawab penjual (kecuali penjual tidak menggunakan bubble wrap standard).</li>
                            <li>Barang harus dikirim kembali ke penjual sebelum dana dikembalikan ke pembeli.</li>
                        </ul>
                    </div>
                ) 
            },
            { 
                id: 'panduan-komunitas', 
                title: 'Panduan Komunitas', 
                content: (
                    <div className="text-center py-6">
                        <Users className="w-16 h-16 text-primary-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-surface-900 mb-4">Mari Bangun Komunitas yang Sehat</h3>
                        <div className="grid sm:grid-cols-2 gap-4 text-left">
                            <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                                <h4 className="font-bold text-green-700 flex items-center gap-2 mb-2">✅ Do's</h4>
                                <ul className="text-sm text-green-600 space-y-1">
                                    <li>• Berkomunikasi dengan sopan.</li>
                                    <li>• Berikan deskripsi barang yang jujur.</li>
                                    <li>• Packing barang dengan super aman.</li>
                                </ul>
                            </div>
                            <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                                <h4 className="font-bold text-red-700 flex items-center gap-2 mb-2">❌ Don'ts</h4>
                                <ul className="text-sm text-red-600 space-y-1">
                                    <li>• Hit and Run (PHP).</li>
                                    <li>• Menjual barang bootleg tanpa label.</li>
                                    <li>• Rasisme, hate speech, atau doxxing.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) 
            },
        ]
    }
];

export default function HelpCenter() {
    const { url } = usePage();
    const searchParams = new URLSearchParams(url.split('?')[1]);
    const initialTab = searchParams.get('tab') || 'cara-beli';

    const [activeTab, setActiveTab] = useState(initialTab);
    const [searchQuery, setSearchQuery] = useState('');

    // Flat list of all items for search & active rendering
    const allItems = HELP_DATA.flatMap(cat => cat.items);
    
    // Find active item content
    const activeItem = allItems.find(item => item.id === activeTab) || allItems[0];

    // Filter menu based on search
    const filteredData = HELP_DATA.map(category => ({
        ...category,
        items: category.items.filter(item => 
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.items.length > 0);

    return (
        <div className="min-h-screen bg-surface-50 flex flex-col">
            <Head title="Pusat Bantuan & Kebijakan — OshiMerch" />
            <Navbar />

            {/* Hero Section */}
            <div className="bg-surface-900 pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-10 mix-blend-overlay" />
                <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] bg-primary-600/30 pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <h1 className="text-4xl sm:text-5xl font-black font-display text-white mb-6 tracking-tight">
                            Pusat <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Bantuan & Kebijakan</span>
                        </h1>
                        <p className="text-lg text-surface-400 max-w-2xl mx-auto mb-10">
                            Temukan jawaban untuk semua pertanyaanmu mengenai layanan OshiMerch. Kami di sini untuk membantumu.
                        </p>

                        <div className="max-w-xl mx-auto relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="w-5 h-5 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari topik bantuan... (cth: Retur, Jual)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-surface-800/50 border border-surface-700 text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-surface-800 transition-all shadow-xl backdrop-blur-sm"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content Section */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full -mt-12 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl border border-surface-200 overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
                    
                    {/* Sidebar / Vertical Tabs */}
                    <div className="w-full lg:w-80 bg-surface-50 border-r border-surface-200 flex-shrink-0 flex flex-col max-h-[80vh] lg:max-h-none overflow-y-auto custom-scrollbar">
                        <div className="p-6">
                            {filteredData.length === 0 ? (
                                <p className="text-surface-500 text-center py-4 text-sm">Tidak ada topik yang sesuai dengan pencarianmu.</p>
                            ) : (
                                <div className="space-y-8">
                                    {filteredData.map((category, catIdx) => (
                                        <div key={catIdx}>
                                            <h3 className="text-xs font-black text-surface-400 uppercase tracking-widest mb-3 px-3">
                                                {category.category}
                                            </h3>
                                            <div className="space-y-1">
                                                {category.items.map((item) => {
                                                    const Icon = ICONS[item.id] || HelpCircle;
                                                    const isActive = activeTab === item.id;
                                                    return (
                                                        <button
                                                            key={item.id}
                                                            onClick={() => {
                                                                setActiveTab(item.id);
                                                                // Mobile scroll to content
                                                                if (window.innerWidth < 1024) {
                                                                    window.scrollTo({ top: 400, behavior: 'smooth' });
                                                                }
                                                            }}
                                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                                                                isActive 
                                                                ? 'bg-primary-50 text-primary-700 font-bold' 
                                                                : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900 font-medium'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <Icon className={`w-5 h-5 ${isActive ? 'text-primary-500' : 'text-surface-400 group-hover:text-surface-600'}`} />
                                                                <span>{item.title}</span>
                                                            </div>
                                                            {isActive && (
                                                                <motion.div layoutId="activeTabIndicator">
                                                                    <ChevronRight className="w-4 h-4 text-primary-500" />
                                                                </motion.div>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Display */}
                    <div className="flex-1 p-6 sm:p-10 lg:p-12 bg-white relative overflow-hidden">
                        {/* Decorative Background Icon */}
                        <div className="absolute -bottom-10 -right-10 opacity-[0.03] pointer-events-none">
                            {(() => {
                                const ActiveIcon = ICONS[activeItem.id] || HelpCircle;
                                return <ActiveIcon className="w-96 h-96" />;
                            })()}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeItem.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="relative z-10 max-w-3xl"
                            >
                                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-surface-100 text-surface-600 font-semibold text-sm mb-6">
                                    {(() => {
                                        const ActiveIcon = ICONS[activeItem.id] || HelpCircle;
                                        return <ActiveIcon className="w-4 h-4 text-primary-500" />;
                                    })()}
                                    {activeItem.title}
                                </div>
                                
                                <h2 className="text-3xl sm:text-4xl font-bold font-display text-surface-900 mb-8 pb-6 border-b border-surface-100">
                                    {activeItem.title}
                                </h2>
                                
                                <div className="text-surface-800">
                                    {activeItem.content}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
