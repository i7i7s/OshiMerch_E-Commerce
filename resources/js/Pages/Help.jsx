import { Head } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

// Pure SVG Plus/Minus for Accordion
const PlusSVG = ({ isOpen }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-8 h-8 transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`}>
        <path d="M12 5v14M5 12h14" />
    </svg>
);

// Raw SVG Star
const StarSVG = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

const HELP_SECTIONS = [
    {
        id: 'panduan',
        number: '01',
        title: 'PANDUAN TRANSAKSI',
        items: [
            {
                title: 'Cara Beli (Untuk Pembeli)',
                content: (
                    <div className="space-y-6 pt-4">
                        <p className="text-xl text-surface-600 leading-relaxed font-medium">Membeli merchandise incaranmu di OshiMerch sangat mudah dan aman. Ikuti langkah-langkah berikut:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                'Cari merchandise lewat fitur pencarian atau halaman member idolamu.',
                                'Pilih produk, perhatikan detail kondisi barang dan harga.',
                                'Klik "Beli" atau hubungi penjual melalui sistem pesan.',
                                'Selesaikan pembayaran. Saldo ditahan oleh Rekber OshiMerch.',
                                'Barang diterima, klik "Selesai" agar dana diteruskan ke penjual.'
                            ].map((step, i) => (
                                <div key={i} className="p-6 bg-surface-50 border border-surface-200 rounded-2xl flex flex-col justify-between">
                                    <span className="text-4xl font-display font-black text-surface-200 mb-4">0{i + 1}</span>
                                    <p className="text-surface-800 font-bold">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            },
            {
                title: 'Cara Jual (Untuk Seller)',
                content: (
                    <div className="space-y-6 pt-4">
                        <p className="text-xl text-surface-600 leading-relaxed font-medium">Ubah koleksi lamamu menjadi cuan! Menjadi seller di OshiMerch sangat cepat.</p>
                        <div className="p-8 bg-primary-600 text-white rounded-3xl relative overflow-hidden">
                            <div className="relative z-10 flex flex-col md:flex-row gap-8">
                                <div className="flex-1">
                                    <h4 className="text-2xl font-black uppercase mb-2">1. Pasang Listing</h4>
                                    <p className="text-primary-100">Unggah foto jelas, deskripsi jujur, dan harga bersaing.</p>
                                </div>
                                <div className="hidden md:block w-px bg-primary-500"></div>
                                <div className="flex-1">
                                    <h4 className="text-2xl font-black uppercase mb-2">2. Kirim Pesanan</h4>
                                    <p className="text-primary-100">Kemas barang dengan aman (bubble wrap/toploader), dan input resi valid.</p>
                                </div>
                            </div>
                            <StarSVG className="absolute -bottom-10 -right-10 w-48 h-48 text-primary-500 opacity-50 rotate-12" />
                        </div>
                    </div>
                )
            }
        ]
    },
    {
        id: 'keamanan',
        number: '02',
        title: 'KEAMANAN & FAQ',
        items: [
            {
                title: 'Sistem Rekening Bersama (Rekber)',
                content: (
                    <div className="space-y-6 pt-4">
                        <div className="p-8 border-2 border-surface-900 rounded-3xl bg-surface-900 text-white">
                            <h3 className="text-3xl font-black uppercase mb-4 text-primary-400">100% Dilindungi Sistem</h3>
                            <p className="text-lg text-surface-300 leading-relaxed mb-6">
                                Semua transaksi menggunakan Rekber. Uang ditahan oleh sistem kami dan baru akan diteruskan ke penjual setelah pembeli mengonfirmasi bahwa barang telah diterima dengan baik.
                            </p>
                            <div className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Uang Anda Aman
                            </div>
                        </div>
                    </div>
                )
            },
            {
                title: 'Pertanyaan Umum (FAQ)',
                content: (
                    <div className="space-y-4 pt-4">
                        {[
                            { q: "Apakah platform ini resmi dari JOT?", a: "Tidak. OshiMerch murni inisiatif dari fans untuk fans." },
                            { q: "Apakah ada biaya admin?", a: "Saat ini transaksi 100% gratis tanpa potongan apapun." },
                            { q: "Barang palsu/bootleg?", a: "Jika terbukti palsu/bootleg tanpa keterangan, dana dikembalikan 100% dan penjual di-banned." }
                        ].map((faq, i) => (
                            <div key={i} className="p-6 border-b border-surface-200 last:border-0">
                                <h4 className="text-xl font-bold text-surface-900 mb-2">Q: {faq.q}</h4>
                                <p className="text-surface-600 text-lg">A: {faq.a}</p>
                            </div>
                        ))}
                    </div>
                )
            }
        ]
    },
    {
        id: 'legal',
        number: '03',
        title: 'LEGALITAS & KEBIJAKAN',
        items: [
            {
                title: 'Syarat & Ketentuan',
                content: (
                    <div className="pt-4 text-lg text-surface-700 leading-relaxed space-y-4">
                        <p>Dengan menggunakan OshiMerch, Anda menyetujui aturan main kami. Dilarang keras melakukan penipuan, menjual barang ilegal, tiket palsu, atau konten yang melanggar hukum.</p>
                        <p>Akun yang terbukti melakukan pelanggaran akan dinonaktifkan secara permanen tanpa peringatan.</p>
                    </div>
                )
            },
            {
                title: 'Kebijakan Pengembalian (Refund)',
                content: (
                    <div className="pt-4 space-y-6">
                        <div className="p-6 bg-red-50 text-red-900 rounded-2xl border border-red-200">
                            <h4 className="text-xl font-black uppercase mb-2">Syarat Mutlak: Video Unboxing</h4>
                            <p>Tanpa video unboxing penuh dari awal membuka paket hingga barang terlihat jelas kerusakannya, komplain <strong>TIDAK AKAN DITERIMA</strong>.</p>
                        </div>
                        <ul className="list-disc pl-6 space-y-2 text-lg text-surface-700">
                            <li>Pengajuan komplain maksimal 2x24 jam setelah status Delivered.</li>
                            <li>Barang harus dikirim balik ke penjual terlebih dahulu.</li>
                            <li>Kerusakan akibat kelalaian kurir bukan tanggung jawab penjual (kecuali penjual tidak menggunakan packing standar).</li>
                        </ul>
                    </div>
                )
            }
        ]
    }
];

const AccordionItem = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b-2 border-surface-900">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-8 sm:py-12 flex items-center justify-between text-left group"
            >
                <h3 className={`text-3xl sm:text-5xl font-display font-black uppercase tracking-tight transition-colors duration-300 ${isOpen ? 'text-primary-600' : 'text-surface-950 group-hover:text-primary-500'}`}>
                    {title}
                </h3>
                <div className={`p-2 rounded-full transition-colors duration-300 ${isOpen ? 'bg-primary-50 text-primary-600' : 'bg-transparent text-surface-400 group-hover:text-primary-500 group-hover:bg-primary-50'}`}>
                    <PlusSVG isOpen={isOpen} />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="pb-12 pt-2 pr-4 sm:pr-24">
                            {content}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function HelpCenter() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <div className="min-h-screen bg-white text-surface-950 selection:bg-primary-500 selection:text-white font-sans" ref={containerRef}>
            <Head title="Pusat Bantuan — OshiMerch" />
            <Navbar />

            {/* --- HERO EDITORIAL --- */}
            <div className="pt-40 pb-20 px-6 sm:px-12 lg:px-24">
                <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12 border-b-4 border-surface-950 pb-12">
                    <div>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex items-center gap-4 mb-8"
                        >
                            <StarSVG className="w-8 h-8 text-primary-600" />
                            <span className="text-xl font-bold uppercase tracking-widest text-primary-600">OshiMerch Support</span>
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-6xl sm:text-8xl md:text-[8rem] leading-[0.85] font-display font-black uppercase tracking-tighter"
                        >
                            WE'VE GOT<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">YOUR BACK.</span>
                        </motion.h1>
                    </div>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="max-w-sm text-xl text-surface-600 font-medium"
                    >
                        Semua jawaban yang kamu butuhkan untuk transaksi aman, nyaman, dan anti-ribet di ekosistem fandom JKT48.
                    </motion.div>
                </div>
            </div>

            {/* --- MAIN CONTENT (STICKY SIDEBAR LAYOUT) --- */}
            <div className="px-6 sm:px-12 lg:px-24 pb-32">
                <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-32">
                    
                    {/* Sticky Sidebar */}
                    <div className="lg:w-1/3 relative">
                        <div className="sticky top-32">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-surface-400 mb-8 border-b border-surface-200 pb-4">
                                Table of Contents
                            </h2>
                            <ul className="space-y-6">
                                {HELP_SECTIONS.map((section) => (
                                    <li key={section.id}>
                                        <a href={`#${section.id}`} className="group flex items-baseline gap-6">
                                            <span className="text-lg font-mono font-bold text-surface-300 group-hover:text-primary-500 transition-colors">{section.number}</span>
                                            <span className="text-2xl font-display font-black uppercase text-surface-500 group-hover:text-surface-950 transition-colors">{section.title}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-16 p-8 bg-surface-50 border border-surface-200 rounded-3xl">
                                <h3 className="text-lg font-bold mb-2">Masih Bingung?</h3>
                                <p className="text-surface-600 mb-6">Tim dukungan Wota kami siap membantu kendalamu 24/7.</p>
                                <a href="mailto:support@oshimerch.id" className="inline-block w-full py-4 bg-surface-950 text-white text-center font-bold uppercase tracking-widest rounded-xl hover:bg-primary-600 transition-colors">
                                    Hubungi Admin
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Accordion Content */}
                    <div className="lg:w-2/3">
                        {HELP_SECTIONS.map((section) => (
                            <div key={section.id} id={section.id} className="scroll-mt-32 mb-24 last:mb-0">
                                <div className="flex items-center gap-6 mb-12">
                                    <span className="text-3xl font-mono font-bold text-primary-500">{section.number}</span>
                                    <h2 className="text-4xl sm:text-6xl font-display font-black uppercase tracking-tighter">
                                        {section.title}
                                    </h2>
                                </div>

                                <div className="border-t-2 border-surface-900">
                                    {section.items.map((item, idx) => (
                                        <AccordionItem key={idx} title={item.title} content={item.content} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
}
