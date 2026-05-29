import { Head } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

// Pure SVG Plus/Minus for Accordion
const PlusSVG = ({ isOpen }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={`w-8 h-8 transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`}>
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
        color: 'bg-[#FEF08A]',
        items: [
            {
                title: 'Cara Beli (Untuk Pembeli)',
                content: (
                    <div className="space-y-6 pt-4">
                        <p className="text-xl text-surface-900 leading-relaxed font-bold bg-[#A7F3D0] p-4 border-2 border-surface-900 inline-block transform -rotate-1 mb-4 shadow-[4px_4px_0_0_#0f172a]">Membeli merchandise incaranmu di OshiMerch sangat mudah dan aman. Ikuti langkah-langkah berikut:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                'Cari merchandise lewat fitur pencarian atau halaman member idolamu.',
                                'Pilih produk, perhatikan detail kondisi barang dan harga.',
                                'Klik "Beli" atau hubungi penjual melalui sistem pesan.',
                                'Selesaikan pembayaran. Saldo ditahan oleh Rekber OshiMerch.',
                                'Barang diterima, klik "Selesai" agar dana diteruskan ke penjual.'
                            ].map((step, i) => (
                                <div key={i} className="p-6 bg-white border-4 border-surface-900 shadow-[8px_8px_0_0_#0f172a] hover:-translate-y-2 transition-transform flex flex-col justify-between">
                                    <span className="text-5xl font-display font-black text-surface-900 mb-4 drop-shadow-[2px_2px_0_rgba(0,0,0,0.2)]">0{i + 1}</span>
                                    <p className="text-surface-900 font-bold text-lg">{step}</p>
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
                        <p className="text-xl text-surface-900 font-bold bg-[#FECDD3] p-4 border-2 border-surface-900 inline-block transform rotate-1 mb-4 shadow-[4px_4px_0_0_#0f172a]">Ubah koleksi lamamu menjadi cuan! Menjadi seller di OshiMerch sangat cepat.</p>
                        <div className="p-8 bg-[#BAE6FD] border-4 border-surface-900 shadow-[12px_12px_0_0_#0f172a] relative overflow-hidden">
                            <div className="relative z-10 flex flex-col md:flex-row gap-8">
                                <div className="flex-1 bg-white p-6 border-4 border-surface-900 shadow-[6px_6px_0_0_#0f172a] transform -rotate-1">
                                    <h4 className="text-3xl font-display font-black uppercase mb-4">1. Pasang Listing</h4>
                                    <p className="text-surface-900 font-bold text-lg">Unggah foto jelas, deskripsi jujur, dan harga bersaing.</p>
                                </div>
                                <div className="hidden md:flex items-center justify-center">
                                    <svg className="w-12 h-12 text-surface-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </div>
                                <div className="flex-1 bg-[#FEF08A] p-6 border-4 border-surface-900 shadow-[6px_6px_0_0_#0f172a] transform rotate-1">
                                    <h4 className="text-3xl font-display font-black uppercase mb-4">2. Kirim Pesanan</h4>
                                    <p className="text-surface-900 font-bold text-lg">Kemas barang dengan aman (bubble wrap/toploader), dan input resi valid.</p>
                                </div>
                            </div>
                            <StarSVG className="absolute -bottom-10 -right-10 w-48 h-48 text-surface-900 opacity-10 rotate-12" />
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
        color: 'bg-[#BAE6FD]',
        items: [
            {
                title: 'Sistem Rekening Bersama (Rekber)',
                content: (
                    <div className="space-y-6 pt-4">
                        <div className="p-8 border-4 border-surface-900 shadow-[12px_12px_0_0_#0f172a] bg-surface-900 text-white transform -rotate-1">
                            <h3 className="text-4xl font-display font-black uppercase mb-6 text-[#A7F3D0]">100% Dilindungi Sistem</h3>
                            <p className="text-xl font-bold text-white leading-relaxed mb-8">
                                Semua transaksi menggunakan Rekber. Uang ditahan oleh sistem kami dan baru akan diteruskan ke penjual setelah pembeli mengonfirmasi bahwa barang telah diterima dengan baik.
                            </p>
                            <div className="inline-flex items-center gap-4 px-6 py-3 bg-[#FEF08A] border-4 border-surface-900 text-surface-900 font-black tracking-widest uppercase transform rotate-2">
                                <span className="w-4 h-4 rounded-full bg-surface-900 animate-pulse border-2 border-white"></span>
                                Uang Anda Aman
                            </div>
                        </div>
                    </div>
                )
            },
            {
                title: 'Pertanyaan Umum (FAQ)',
                content: (
                    <div className="space-y-6 pt-4">
                        {[
                            { q: "Apakah platform ini resmi dari JOT?", a: "Tidak. OshiMerch murni inisiatif dari fans untuk fans." },
                            { q: "Apakah ada biaya admin?", a: "Saat ini transaksi 100% gratis tanpa potongan apapun." },
                            { q: "Barang palsu/bootleg?", a: "Jika terbukti palsu/bootleg tanpa keterangan, dana dikembalikan 100% dan penjual di-banned." }
                        ].map((faq, i) => (
                            <div key={i} className="p-6 bg-white border-4 border-surface-900 shadow-[6px_6px_0_0_#0f172a] hover:bg-[#FEF08A] transition-colors">
                                <h4 className="text-2xl font-display font-black text-surface-900 mb-3 uppercase">Q: {faq.q}</h4>
                                <p className="text-surface-900 font-bold text-lg">A: {faq.a}</p>
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
        color: 'bg-[#FECDD3]',
        items: [
            {
                title: 'Syarat & Ketentuan',
                content: (
                    <div className="pt-4 text-xl font-bold text-surface-900 leading-relaxed space-y-6">
                        <div className="bg-[#BAE6FD] p-6 border-4 border-surface-900 shadow-[8px_8px_0_0_#0f172a] transform rotate-1">
                            Dengan menggunakan OshiMerch, Anda menyetujui aturan main kami. Dilarang keras melakukan penipuan, menjual barang ilegal, tiket palsu, atau konten yang melanggar hukum.
                        </div>
                        <div className="bg-surface-900 text-white p-6 border-4 border-surface-900 shadow-[8px_8px_0_0_#FEF08A] transform -rotate-1">
                            Akun yang terbukti melakukan pelanggaran akan dinonaktifkan secara permanen tanpa peringatan.
                        </div>
                    </div>
                )
            },
            {
                title: 'Kebijakan Pengembalian (Refund)',
                content: (
                    <div className="pt-4 space-y-6">
                        <div className="p-8 bg-[#FECDD3] border-4 border-surface-900 shadow-[8px_8px_0_0_#0f172a]">
                            <h4 className="text-3xl font-display font-black uppercase mb-4 underline decoration-4 underline-offset-4">Syarat Mutlak: Video Unboxing</h4>
                            <p className="text-xl font-bold text-surface-900">Tanpa video unboxing penuh dari awal membuka paket hingga barang terlihat jelas kerusakannya, komplain <span className="bg-white px-2 border-2 border-surface-900 uppercase">TIDAK AKAN DITERIMA</span>.</p>
                        </div>
                        <ul className="list-none space-y-4 text-lg text-surface-900 font-bold">
                            {[
                                "Pengajuan komplain maksimal 2x24 jam setelah status Delivered.",
                                "Barang harus dikirim balik ke penjual terlebih dahulu.",
                                "Kerusakan akibat kelalaian kurir bukan tanggung jawab penjual (kecuali penjual tidak menggunakan packing standar)."
                            ].map((li, i) => (
                                <li key={i} className="flex gap-4 items-start">
                                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#A7F3D0] border-2 border-surface-900 font-black mt-1">{i + 1}</span>
                                    <span className="bg-white p-3 border-2 border-surface-900 shadow-[4px_4px_0_0_#0f172a] w-full">{li}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            },
            {
                title: 'Kebijakan Privasi (Privacy Policy)',
                content: (
                    <div className="pt-4 space-y-6 text-surface-900">
                        <div className="p-6 bg-[#A7F3D0] border-4 border-surface-900 shadow-[8px_8px_0_0_#0f172a] transform rotate-1">
                            <p className="text-xl font-bold leading-relaxed">Kebijakan Privasi ini menjelaskan bagaimana OshiMerch mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan layanan kami.</p>
                        </div>

                        {[
                            {
                                label: '1. Data yang Kami Kumpulkan',
                                color: 'bg-white',
                                points: [
                                    'Data Akun: nama, alamat email, foto profil — diperoleh saat registrasi manual atau melalui Google OAuth.',
                                    'Data Transaksi: alamat pengiriman, riwayat pembelian dan penjualan.',
                                    'Data Aktivitas: listing yang dilihat, produk difavoritkan, pesan antar pengguna.',
                                    'Data Teknis: alamat IP, jenis perangkat, dan log akses untuk keamanan sistem.',
                                ]
                            },
                            {
                                label: '2. Tujuan Penggunaan Data',
                                color: 'bg-[#FEF08A]',
                                points: [
                                    'Menjalankan layanan marketplace (pembuatan akun, transaksi, pengiriman).',
                                    'Mengirim notifikasi terkait aktivitas akun dan transaksi.',
                                    'Meningkatkan keamanan platform dan mencegah penipuan.',
                                    'Menganalisis penggunaan layanan untuk peningkatan fitur (analytics internal & Google Analytics).',
                                ]
                            },
                            {
                                label: '3. Berbagi Data dengan Pihak Ketiga',
                                color: 'bg-[#FECDD3]',
                                points: [
                                    'Midtrans — payment gateway untuk memproses pembayaran secara aman.',
                                    'Google — untuk autentikasi OAuth (Login dengan Google) dan layanan analytics.',
                                    'Kami tidak menjual data pribadi Anda kepada pihak manapun.',
                                ]
                            },
                            {
                                label: '4. Hak Pengguna',
                                color: 'bg-[#BAE6FD]',
                                points: [
                                    'Anda berhak mengakses, memperbaiki, atau menghapus data pribadi Anda kapan saja.',
                                    'Anda dapat meminta penghapusan akun beserta seluruh data melalui halaman Profil atau menghubungi admin.',
                                    'Anda dapat mencabut akses Google OAuth melalui pengaturan akun Google Anda.',
                                ]
                            },
                        ].map(({ label, color, points }, i) => (
                            <div key={i} className={`p-6 border-4 border-surface-900 shadow-[6px_6px_0_0_#0f172a] ${color}`}>
                                <h4 className="text-2xl font-display font-black uppercase mb-4 underline decoration-2 underline-offset-4">{label}</h4>
                                <ul className="space-y-3">
                                    {points.map((p, j) => (
                                        <li key={j} className="flex gap-3 items-start text-lg font-bold">
                                            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-surface-900 text-white font-black text-xs mt-1">✓</span>
                                            <span>{p}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        <div className="p-6 bg-surface-900 text-white border-4 border-surface-900 shadow-[8px_8px_0_0_#FEF08A] transform -rotate-1">
                            <p className="text-lg font-bold">Dengan menggunakan OshiMerch, Anda menyetujui Kebijakan Privasi ini. Kebijakan dapat diperbarui sewaktu-waktu dan perubahan akan diinformasikan melalui notifikasi platform. Pertanyaan: <span className="underline">support@oshimerch.id</span></p>
                        </div>
                    </div>
                )
            }
        ]
    }
];

const AccordionItem = ({ title, content, color }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b-4 border-surface-900 bg-white">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full py-6 sm:py-8 px-6 flex items-center justify-between text-left group transition-colors duration-300 ${isOpen ? color : 'hover:bg-surface-100'}`}
            >
                <h3 className="text-2xl sm:text-4xl font-display font-black uppercase tracking-tight text-surface-900">
                    {title}
                </h3>
                <div className={`p-2 border-4 border-surface-900 bg-white shadow-[4px_4px_0_0_#0f172a] transition-all duration-300 group-hover:shadow-[6px_6px_0_0_#0f172a] group-hover:-translate-y-1`}>
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
                        className="overflow-hidden bg-white"
                    >
                        <div className="pb-12 pt-6 px-6 border-t-4 border-surface-900 border-dashed">
                            {content}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function HelpCenter({ auth }) {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-surface-900 selection:bg-surface-900 selection:text-[#FEF08A] font-sans" ref={containerRef}>
            <Head title="Pusat Bantuan — OshiMerch" />
            <Navbar auth={auth} />

            {/* --- HERO EDITORIAL (NEO-BRUTALIST) --- */}
            <div className="relative pt-40 pb-20 px-6 sm:px-12 lg:px-24 border-b-4 border-surface-900 bg-[#A7F3D0] overflow-hidden">
                <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.4] pointer-events-none" />
                <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12 relative z-10">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-4 px-6 py-2 bg-white border-4 border-surface-900 shadow-[6px_6px_0_0_#0f172a] transform -rotate-2 mb-8"
                        >
                            <StarSVG className="w-6 h-6 text-surface-900" />
                            <span className="text-xl font-black uppercase tracking-widest text-surface-900">OSHI SUPPORT</span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="bg-white p-6 sm:p-10 border-4 border-surface-900 shadow-[16px_16px_0_0_#0f172a] transform rotate-1 inline-block"
                        >
                            <h1 className="text-5xl sm:text-7xl md:text-8xl leading-[0.9] font-display font-black uppercase tracking-tighter" style={{ textShadow: '4px 4px 0px #A7F3D0' }}>
                                WE'VE GOT<br />
                                YOUR BACK.
                            </h1>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="max-w-sm bg-white p-6 border-4 border-surface-900 shadow-[8px_8px_0_0_#0f172a] transform -rotate-2"
                    >
                        <p className="text-xl text-surface-900 font-bold">
                            Semua jawaban yang kamu butuhkan untuk transaksi aman, nyaman, dan anti-ribet di ekosistem fandom.
                        </p>
                    </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-20 right-20 w-32 h-32 bg-[#FECDD3] border-4 border-surface-900 rounded-full blur-2xl opacity-50 pointer-events-none"></div>
                <StarSVG className="absolute bottom-10 right-1/4 w-24 h-24 text-surface-900 opacity-20 rotate-45 pointer-events-none" />
            </div>

            {/* --- MAIN CONTENT (STICKY SIDEBAR LAYOUT) --- */}
            <div className="px-6 sm:px-12 lg:px-24 py-20 lg:py-32 bg-[#FAFAFA] relative">
                <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-32">

                    {/* Sticky Sidebar */}
                    <div className="lg:w-1/3 relative z-20">
                        <div className="sticky top-32">
                            <div className="bg-white border-4 border-surface-900 shadow-[12px_12px_0_0_#0f172a] p-8 mb-12">
                                <h2 className="text-2xl font-display font-black uppercase tracking-widest text-surface-900 mb-8 pb-4 border-b-4 border-surface-900 border-dashed">
                                    DIRECTORY
                                </h2>
                                <ul className="space-y-6">
                                    {HELP_SECTIONS.map((section) => (
                                        <li key={section.id}>
                                            <a href={`#${section.id}`} className="group flex items-center gap-4 p-2 hover:bg-surface-100 border-2 border-transparent hover:border-surface-900 transition-colors">
                                                <span className={`inline-block px-3 py-1 border-2 border-surface-900 font-black text-surface-900 ${section.color}`}>{section.number}</span>
                                                <span className="text-xl font-display font-black uppercase text-surface-900 group-hover:translate-x-2 transition-transform">{section.title}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-8 bg-[#FEF08A] border-4 border-surface-900 shadow-[12px_12px_0_0_#0f172a] transform -rotate-1">
                                <h3 className="text-3xl font-display font-black mb-4 uppercase leading-none">Masih<br />Bingung?</h3>
                                <p className="text-surface-900 font-bold mb-6 text-lg">Tim dukungan Wota kami siap membantu kendalamu 24/7.</p>
                                <a href="mailto:support@oshimerch.id" className="inline-block w-full py-4 bg-surface-900 text-white text-center font-black uppercase tracking-widest border-4 border-surface-900 hover:bg-white hover:text-surface-900 transition-colors shadow-[4px_4px_0_0_#fff]">
                                    HUBUNGI ADMIN
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Accordion Content */}
                    <div className="lg:w-2/3">
                        {HELP_SECTIONS.map((section) => (
                            <div key={section.id} id={section.id} className="scroll-mt-32 mb-32 last:mb-0">
                                <div className="flex items-center gap-6 mb-12">
                                    <span className={`text-4xl font-display font-black border-4 border-surface-900 px-4 py-2 shadow-[6px_6px_0_0_#0f172a] transform -rotate-3 ${section.color}`}>{section.number}</span>
                                    <h2 className="text-5xl sm:text-6xl font-display font-black uppercase tracking-tighter bg-white px-4 py-2 border-4 border-surface-900 shadow-[6px_6px_0_0_#0f172a] transform rotate-1">
                                        {section.title}
                                    </h2>
                                </div>

                                <div className="border-4 border-surface-900 shadow-[16px_16px_0_0_#0f172a] bg-white">
                                    {section.items.map((item, idx) => (
                                        <AccordionItem key={idx} title={item.title} content={item.content} color={section.color} />
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
