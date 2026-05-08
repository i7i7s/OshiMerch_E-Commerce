import { CATEGORIES } from '@/data/products';
import { Link } from '@inertiajs/react';

const slugify = (text) => text.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');

// Custom Icons for Footer
const MapPinIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const MailIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

export default function Footer() {
    return (
        <div className="bg-surface-50 pt-10 sm:pt-20">
            {/* The Floating Footer Container */}
            <footer className="bg-surface-900 text-surface-300 rounded-t-[3rem] sm:rounded-t-[4rem] relative overflow-hidden shadow-2xl mt-8">
                
                {/* Background ambient glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-32 bg-primary-500/20 blur-[100px] pointer-events-none rounded-full" />

                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-20 pb-10 relative z-10">
                    
                    {/* TOP SECTION: The Quote & Brand */}
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-12 border-b border-surface-800 pb-16 mb-16">
                        <div className="lg:w-1/2">
                            <div className="flex items-center gap-3 mb-8">
                                <img src="/images/logo.png" alt="OshiMerch" className="w-12 h-12 rounded-2xl shadow-lg shadow-primary-500/20" />
                                <span className="text-3xl font-bold font-display text-white tracking-tight">Oshi<span className="text-primary-500">Merch</span></span>
                            </div>
                            
                            {/* The User's Beautiful Quote */}
                            <div className="relative">
                                <svg className="absolute -top-4 -left-6 w-12 h-12 text-surface-800 transform -scale-x-100" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                </svg>
                                <p className="text-xl sm:text-2xl font-display font-medium leading-relaxed text-surface-200 relative z-10 italic">
                                    "Dibuat dengan <span className="text-primary-400 font-bold">passion</span>, dihadirkan dengan <span className="text-primary-400 font-bold">cinta</span>, diwujudkan untuk <span className="text-primary-400 font-bold">mimpimu</span>. Karena setiap pilihan yang kamu buat di sini adalah langkah menuju versi terbaik dirimu."
                                </p>
                            </div>
                        </div>

                        <div className="lg:w-1/3 w-full bg-surface-800/50 backdrop-blur-md rounded-3xl p-8 border border-surface-700/50 hover:border-primary-500/30 transition-colors">
                            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                                <MailIcon /> Hubungi Kami
                            </h3>
                            <p className="text-surface-400 mb-6 text-sm leading-relaxed">
                                Punya pertanyaan atau butuh bantuan dengan pesananmu? Tim dukungan wota kami siap membantu 24/7.
                            </p>
                            <a href="mailto:support@oshimerch.id" className="inline-flex items-center justify-center w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-primary-500/20 active:scale-95">
                                support@oshimerch.id
                            </a>
                        </div>
                    </div>

                    {/* MIDDLE SECTION: Links */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                        {/* Kategori */}
                        <div className="col-span-1">
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Kategori</h4>
                            <ul className="space-y-3.5">
                                {CATEGORIES.slice(0, 5).map((cat) => (
                                    <li key={cat.id}>
                                        <a href="#" className="text-sm font-medium text-surface-400 hover:text-primary-400 hover:translate-x-1 transition-all inline-block">
                                            {cat.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Navigasi */}
                        <div className="col-span-1">
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Navigasi</h4>
                            <ul className="space-y-3.5">
                                <li>
                                    <Link href={route('products.index')} className="text-sm font-medium text-surface-400 hover:text-primary-400 hover:translate-x-1 transition-all inline-block">Semua Produk</Link>
                                </li>
                                <li>
                                    <Link href={route('about')} className="text-sm font-medium text-surface-400 hover:text-primary-400 hover:translate-x-1 transition-all inline-block">Tentang Kami</Link>
                                </li>
                                <li>
                                    <Link href={route('members')} className="text-sm font-medium text-surface-400 hover:text-primary-400 hover:translate-x-1 transition-all inline-block">Daftar Member</Link>
                                </li>
                            </ul>
                        </div>

                        {/* Bantuan */}
                        <div className="col-span-1">
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Bantuan</h4>
                            <ul className="space-y-3.5">
                                {['Cara Beli', 'Cara Jual', 'FAQ'].map((item) => (
                                    <li key={item}>
                                        <Link href={route('help', { tab: slugify(item) })} className="text-sm font-medium text-surface-400 hover:text-primary-400 hover:translate-x-1 transition-all inline-block">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div className="col-span-1">
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Legalitas</h4>
                            <ul className="space-y-3.5">
                                {['Privasi', 'Ketentuan', 'Refund'].map((item) => (
                                    <li key={item}>
                                        <Link href={route('help', { tab: slugify(item) })} className="text-sm font-medium text-surface-400 hover:text-primary-400 hover:translate-x-1 transition-all inline-block">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* BOTTOM SECTION */}
                    <div className="pt-8 border-t border-surface-800 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4 text-xs font-medium text-surface-500">
                            <span>&copy; {new Date().getFullYear()} OshiMerch.</span>
                            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-surface-700"></span>
                            <span>All rights reserved.</span>
                        </div>

                        <div className="flex items-center gap-3">
                            {['Instagram', 'Twitter', 'TikTok'].map((social) => (
                                <a key={social} href="#" className="w-10 h-10 rounded-xl bg-surface-800 hover:bg-primary-600 flex items-center justify-center text-surface-400 hover:text-white transition-all text-xs font-bold shadow-sm hover:shadow-primary-500/20 hover:-translate-y-1">
                                    {social.substring(0, 2).toUpperCase()}
                                </a>
                            ))}
                        </div>
                    </div>

                </div>
            </footer>
        </div>
    );
}
