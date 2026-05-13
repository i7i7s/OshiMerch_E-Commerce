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
        <div className="bg-[#FAFAFA] pt-10 sm:pt-20 border-t-4 border-surface-900 mt-16">
            {/* The Bold Footer Container */}
            <footer className="bg-surface-900 text-surface-100 relative overflow-hidden">
                
                {/* Decorative Dots Top Border */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-[radial-gradient(#475569_2px,transparent_2px)] [background-size:10px_10px]" />

                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-16 pb-10 relative z-10">
                    
                    {/* TOP SECTION: The Quote & Brand */}
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-12 border-b-4 border-surface-800 pb-16 mb-16">
                        <div className="lg:w-1/2">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="bg-primary-400 border-2 border-surface-900 p-2 rounded-2xl shadow-[4px_4px_0_0_#0f172a] -rotate-3 hover:rotate-0 transition-transform">
                                    <img src="/images/logo.png" alt="OshiMerch" className="w-12 h-12 object-contain" />
                                </div>
                                <span className="text-4xl font-black font-display text-white tracking-tighter uppercase">Oshi<span className="text-primary-400">Merch</span></span>
                            </div>
                            
                            {/* The User's Beautiful Quote in Block Style */}
                            <div className="relative bg-white text-surface-900 p-6 sm:p-8 rounded-3xl border-4 border-surface-900 shadow-[8px_8px_0_0_#475569] mt-6">
                                <svg className="absolute -top-6 -left-4 w-12 h-12 text-[#FEF08A] drop-shadow-[2px_2px_0_rgba(15,23,42,1)] transform -scale-x-100" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                </svg>
                                <p className="text-lg sm:text-xl font-bold font-sans leading-relaxed relative z-10 italic">
                                    "Dibuat dengan <span className="bg-primary-400 px-1 border border-surface-900 rounded font-black text-white transform -rotate-1 inline-block">passion</span>, dihadirkan dengan <span className="bg-[#BAE6FD] px-1 border border-surface-900 rounded font-black text-surface-900 transform rotate-1 inline-block">cinta</span>, diwujudkan untuk <span className="bg-[#FBCFE8] px-1 border border-surface-900 rounded font-black text-surface-900 inline-block">mimpimu</span>. Karena setiap pilihan yang kamu buat di sini adalah langkah menuju versi terbaik dirimu."
                                </p>
                            </div>
                        </div>

                        <div className="lg:w-1/3 w-full bg-[#FEF08A] text-surface-900 rounded-3xl p-8 border-4 border-surface-900 shadow-[8px_8px_0_0_#475569] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0_0_#475569] transition-all">
                            <h3 className="font-black text-2xl uppercase tracking-tight mb-4 flex items-center gap-3">
                                <span className="bg-white p-2 rounded-xl border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a]">
                                    <MailIcon />
                                </span> 
                                Hubungi Kami
                            </h3>
                            <p className="font-bold mb-6 text-sm leading-relaxed text-surface-700">
                                Punya pertanyaan atau butuh bantuan dengan pesananmu? Tim dukungan wota kami siap membantu 24/7.
                            </p>
                            <a href="mailto:support@oshimerch.id" className="inline-flex items-center justify-center w-full bg-surface-900 hover:bg-surface-800 text-white font-black uppercase tracking-wider py-4 px-6 rounded-xl border-2 border-transparent transition-all shadow-[4px_4px_0_0_rgba(255,255,255,0.2)] active:translate-y-1 active:translate-x-1 active:shadow-none">
                                support@oshimerch.id
                            </a>
                        </div>
                    </div>

                    {/* MIDDLE SECTION: Links */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                        {/* Kategori */}
                        <div className="col-span-1">
                            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-b-2 border-surface-700 pb-2 inline-block">Kategori</h4>
                            <ul className="space-y-4">
                                {CATEGORIES.slice(0, 5).map((cat) => (
                                    <li key={cat.id}>
                                        <a href="#" className="font-bold text-surface-300 hover:text-[#FEF08A] hover:translate-x-2 transition-transform inline-block">
                                            {cat.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Navigasi */}
                        <div className="col-span-1">
                            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-b-2 border-surface-700 pb-2 inline-block">Navigasi</h4>
                            <ul className="space-y-4">
                                <li>
                                    <Link href={route('products.index')} className="font-bold text-surface-300 hover:text-[#BAE6FD] hover:translate-x-2 transition-transform inline-block">Semua Produk</Link>
                                </li>
                                <li>
                                    <Link href={route('about')} className="font-bold text-surface-300 hover:text-[#BAE6FD] hover:translate-x-2 transition-transform inline-block">Tentang Kami</Link>
                                </li>
                                <li>
                                    <Link href={route('members')} className="font-bold text-surface-300 hover:text-[#BAE6FD] hover:translate-x-2 transition-transform inline-block">Daftar Member</Link>
                                </li>
                            </ul>
                        </div>

                        {/* Bantuan */}
                        <div className="col-span-1">
                            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-b-2 border-surface-700 pb-2 inline-block">Bantuan</h4>
                            <ul className="space-y-4">
                                {['Cara Beli', 'Cara Jual', 'FAQ'].map((item) => (
                                    <li key={item}>
                                        <Link href={route('help', { tab: slugify(item) })} className="font-bold text-surface-300 hover:text-[#FBCFE8] hover:translate-x-2 transition-transform inline-block">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div className="col-span-1">
                            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-b-2 border-surface-700 pb-2 inline-block">Legalitas</h4>
                            <ul className="space-y-4">
                                {['Privasi', 'Ketentuan', 'Refund'].map((item) => (
                                    <li key={item}>
                                        <Link href={route('help', { tab: slugify(item) })} className="font-bold text-surface-300 hover:text-primary-400 hover:translate-x-2 transition-transform inline-block">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* BOTTOM SECTION */}
                    <div className="pt-8 border-t-4 border-surface-800 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4 text-sm font-bold text-surface-400 uppercase tracking-widest">
                            <span>&copy; {new Date().getFullYear()} OshiMerch.</span>
                            <span className="hidden sm:inline-block w-2 h-2 rounded-sm bg-primary-500 transform rotate-45"></span>
                            <span>All rights reserved.</span>
                        </div>

                        <div className="flex items-center gap-4">
                            {['Instagram', 'Twitter', 'TikTok'].map((social) => (
                                <a key={social} href="#" className="w-12 h-12 rounded-2xl bg-white text-surface-900 border-2 border-surface-900 flex items-center justify-center font-black text-xs uppercase shadow-[4px_4px_0_0_#475569] hover:bg-[#FEF08A] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#475569] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all">
                                    {social.substring(0, 2)}
                                </a>
                            ))}
                        </div>
                    </div>

                </div>
            </footer>
        </div>
    );
}
