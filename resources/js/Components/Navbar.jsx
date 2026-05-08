import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
    { label: 'Products', href: '/products' },
    { label: 'About',    href: '/#about' },
    { label: 'Member',   href: '/members' },
];

const SearchIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const CartIcon = ({ count = 0 }) => (
    <div className="relative">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        {count > 0 && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full gradient-primary text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {count}
            </motion.span>
        )}
    </div>
);

const WishlistIcon = ({ count = 0 }) => (
    <div className="relative">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
        {count > 0 && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center">
                {count}
            </motion.span>
        )}
    </div>
);

const BellIcon = ({ hasNew = false }) => (
    <div className="relative">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {hasNew && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white" />}
    </div>
);

export default function Navbar() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [scrolled, setScrolled] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-white/85 backdrop-blur-xl border-b border-surface-200/60 shadow-sm'
                    : 'bg-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 h-16 sm:h-[72px]">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <img src="/images/logo.png" alt="OshiMerch" className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-contain" />
                        <span className="text-lg sm:text-xl font-bold font-display text-surface-900 tracking-tight hidden sm:block">
                            Oshi<span className="gradient-text">Merch</span>
                        </span>
                    </Link>

                    {/* Nav Links — Desktop */}
                    <div className="hidden lg:flex items-center gap-1 ml-2">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="px-3 py-1.5 rounded-lg text-sm font-medium text-surface-600 hover:text-primary-600 hover:bg-primary-50 transition-all"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className={`flex-1 max-w-md mx-2 sm:mx-4 transition-all duration-300 ${searchFocused ? 'max-w-xl' : ''}`}>
                        <div className={`relative flex items-center rounded-xl border transition-all duration-300 ${
                            searchFocused
                                ? 'bg-white border-primary-300 shadow-lg shadow-primary-500/10 ring-2 ring-primary-500/20'
                                : scrolled ? 'bg-surface-100 border-surface-200' : 'bg-white/60 backdrop-blur-sm border-white/30 hover:bg-white/80'
                        }`}>
                            <div className="pl-3 text-surface-400"><SearchIcon /></div>
                            <input
                                type="text"
                                placeholder="Cari photocard, lightstick..."
                                className="w-full pl-2 pr-4 py-2.5 bg-transparent text-sm text-surface-900 placeholder-surface-400 focus:outline-none"
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                aria-label="Search products"
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        {user ? (
                            <>
                                <button className="p-2 rounded-xl text-surface-500 hover:text-surface-700 hover:bg-surface-100 transition-all hidden sm:flex" aria-label="Notifications"><BellIcon hasNew={true} /></button>
                                <Link href={route('chat.index')} className="p-2 rounded-xl text-surface-500 hover:text-primary-500 hover:bg-primary-50 transition-all flex items-center" aria-label="Chat">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                    </svg>
                                </Link>
                                <button className="p-2 rounded-xl text-surface-500 hover:text-primary-500 hover:bg-primary-50 transition-all" aria-label="Wishlist"><WishlistIcon count={3} /></button>
                                <button className="p-2 rounded-xl text-surface-500 hover:text-primary-500 hover:bg-primary-50 transition-all" aria-label="Cart"><CartIcon count={2} /></button>
                                <div className="relative ml-1">
                                    <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center p-1 rounded-xl hover:bg-surface-100 transition-all">
                                        <img src={user.profile_picture_url || `https://ui-avatars.com/api/?name=${user.name}&background=ff2d6f&color=fff`} alt={user.name} className="w-8 h-8 rounded-lg border border-surface-200" />
                                    </button>
                                    <AnimatePresence>
                                        {showDropdown && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute right-0 top-full mt-2 w-56 z-50 rounded-xl bg-white border border-surface-200 shadow-elevated overflow-hidden">
                                                    <div className="px-4 py-3 border-b border-surface-100">
                                                        <p className="text-sm font-semibold text-surface-900 truncate">{user.name}</p>
                                                        <p className="text-xs text-surface-500 truncate">{user.email}</p>
                                                    </div>
                                                    <div className="py-1">
                                                        <Link href={route('dashboard')} className="block px-4 py-2 text-sm text-surface-700 hover:bg-surface-50">Dashboard</Link>
                                                        <Link href={route('profile.edit')} className="block px-4 py-2 text-sm text-surface-700 hover:bg-surface-50">Profil</Link>
                                                        <Link href={route('logout')} method="post" as="button" className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Keluar</Link>
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <>
                                <a href={route('login')} className="px-4 py-2 rounded-xl text-sm font-medium text-surface-600 hover:text-surface-900 transition-all hidden sm:block">Masuk</a>
                                <a href={route('register')} className="px-4 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold shadow-sm hover:shadow-glow-primary transition-all hover:scale-[1.02] active:scale-[0.98]">Daftar</a>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
