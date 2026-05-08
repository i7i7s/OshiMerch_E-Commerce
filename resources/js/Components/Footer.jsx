import { CATEGORIES } from '@/data/products';
import { Link } from '@inertiajs/react';

const slugify = (text) => text.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');

// Pure SVG Arrow
const ArrowSVG = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

export default function Footer() {
    return (
        <footer className="bg-surface-950 text-white relative overflow-hidden pt-24 sm:pt-32">
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-24 mb-24">
                    
                    {/* Left: Huge Call to Action */}
                    <div className="lg:w-1/2">
                        <div className="inline-block px-4 py-1.5 border border-surface-800 rounded-full text-xs font-bold uppercase tracking-widest text-surface-400 mb-8">
                            * Join The Revolution
                        </div>
                        <h2 className="text-5xl sm:text-7xl font-display font-black uppercase leading-[0.9] tracking-tighter mb-8">
                            Dukung<br/><span className="text-primary-500">Oshimu</span><br/>Sekarang.
                        </h2>
                        <p className="text-surface-400 text-lg max-w-md mb-10 leading-relaxed">
                            Marketplace pertama yang diciptakan khusus untuk Wota. Koleksi merchandise impianmu hanya berjarak satu klik.
                        </p>
                        
                        <div className="flex gap-4">
                            {['IG', 'TW', 'TK'].map((social) => (
                                <a key={social} href="#" className="w-14 h-14 rounded-full border-2 border-surface-800 flex items-center justify-center text-surface-300 hover:border-primary-500 hover:text-primary-500 hover:bg-primary-500/10 transition-all font-display font-bold text-lg group">
                                    {social}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Right: Editorial Link Grid */}
                    <div className="lg:w-1/2 w-full grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
                        
                        {/* Kategori */}
                        <div className="col-span-1">
                            <h3 className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-6">Kategori</h3>
                            <ul className="space-y-4">
                                {CATEGORIES.slice(0, 5).map((cat) => (
                                    <li key={cat.id}>
                                        <a href="#" className="text-lg font-medium text-surface-300 hover:text-white group flex items-center gap-2 transition-colors">
                                            {/* Remove icon, replace with pure CSS hover effect */}
                                            <span className="w-0 h-0.5 bg-primary-500 group-hover:w-4 transition-all duration-300"></span>
                                            {cat.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Bantuan */}
                        <div className="col-span-1">
                            <h3 className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-6">Navigasi</h3>
                            <ul className="space-y-4">
                                <li>
                                    <Link href={route('about')} className="text-lg font-medium text-surface-300 hover:text-white group flex items-center gap-2 transition-colors">
                                        <span className="w-0 h-0.5 bg-primary-500 group-hover:w-4 transition-all duration-300"></span>
                                        Tentang Kami
                                    </Link>
                                </li>
                                {['Cara Beli', 'Cara Jual', 'FAQ'].map((item) => (
                                    <li key={item}>
                                        <Link href={route('help', { tab: slugify(item) })} className="text-lg font-medium text-surface-300 hover:text-white group flex items-center gap-2 transition-colors">
                                            <span className="w-0 h-0.5 bg-primary-500 group-hover:w-4 transition-all duration-300"></span>
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div className="col-span-2 sm:col-span-1 mt-8 sm:mt-0">
                            <h3 className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-6">Legalitas</h3>
                            <ul className="space-y-4">
                                {['Privasi', 'Ketentuan', 'Refund'].map((item) => (
                                    <li key={item}>
                                        <Link href={route('help', { tab: slugify(item) })} className="text-lg font-medium text-surface-300 hover:text-white group flex items-center gap-2 transition-colors">
                                            <span className="w-0 h-0.5 bg-primary-500 group-hover:w-4 transition-all duration-300"></span>
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>

            {/* Giant Background Text Footer */}
            <div className="w-full flex justify-center overflow-hidden border-t border-surface-900 pt-8 relative z-0">
                <h1 className="text-[14vw] font-display font-black text-surface-900 leading-[0.75] tracking-tighter select-none mix-blend-screen opacity-50">
                    OSHIMERCH
                </h1>
                
                <div className="absolute bottom-4 left-0 right-0 flex justify-between items-center px-4 sm:px-8 lg:px-12 z-10 text-xs sm:text-sm font-medium text-surface-500 mix-blend-difference">
                    <p>&copy; {new Date().getFullYear()} OSHIMERCH INDONESIA.</p>
                    <p>BUILT WITH PASSION.</p>
                </div>
            </div>
            
        </footer>
    );
}
