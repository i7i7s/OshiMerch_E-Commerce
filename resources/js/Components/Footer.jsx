import { CATEGORIES } from '@/data/products';
import { Link } from '@inertiajs/react';

const slugify = (text) => text.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');

export default function Footer() {
    return (
        <footer className="bg-surface-900 text-surface-300 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <img src="/images/logo.png" alt="OshiMerch" className="w-9 h-9 rounded-xl" />
                            <span className="text-xl font-bold font-display text-white">OshiMerch</span>
                        </div>
                        <p className="text-sm leading-relaxed text-surface-400 mb-4">
                            Marketplace #1 untuk fans JKT48. Jual-beli merchandise aman, transparan, dan berbasis komunitas.
                        </p>
                        <div className="flex gap-3">
                            {['Instagram', 'Twitter', 'TikTok'].map((social) => (
                                <a key={social} href="#" className="w-9 h-9 rounded-lg bg-surface-800 hover:bg-primary-600 flex items-center justify-center text-surface-400 hover:text-white transition-all text-xs font-bold">
                                    {social[0]}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Kategori */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Kategori</h3>
                        <ul className="space-y-2.5">
                            {CATEGORIES.slice(0, 6).map((cat) => (
                                <li key={cat.id}>
                                    <a href="#" className="text-sm text-surface-400 hover:text-primary-400 transition-colors">{cat.icon} {cat.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Bantuan */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Bantuan</h3>
                        <ul className="space-y-2.5">
                            {['Cara Beli', 'Cara Jual', 'Keamanan Transaksi', 'FAQ', 'Hubungi Kami'].map((item) => (
                                <li key={item}>
                                    <Link href={route('help', { tab: slugify(item) })} className="text-sm text-surface-400 hover:text-primary-400 transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kebijakan */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Kebijakan</h3>
                        <ul className="space-y-2.5">
                            {['Syarat & Ketentuan', 'Kebijakan Privasi', 'Kebijakan Pengembalian', 'Panduan Komunitas'].map((item) => (
                                <li key={item}>
                                    <Link href={route('help', { tab: slugify(item) })} className="text-sm text-surface-400 hover:text-primary-400 transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-surface-500">
                        &copy; {new Date().getFullYear()} OshiMerch. Made with ❤️ for JKT48 Fans.
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="text-[11px] text-surface-500 px-2 py-1 rounded bg-surface-800">🔒 SSL Secured</span>
                        <span className="text-[11px] text-surface-500 px-2 py-1 rounded bg-surface-800">🛡️ Verified Sellers</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
