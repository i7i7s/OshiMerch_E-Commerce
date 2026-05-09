import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
    { label: 'Products', href: '/products' },
    { label: 'Tentang Kami', href: '/about' },
    { label: 'Member',   href: '/members' },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const SearchIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const CartIcon = ({ count = 0 }) => (
    <div className="relative group w-11 h-11 rounded-2xl flex items-center justify-center bg-surface-100/50 border border-surface-200/50 hover:bg-surface-950 hover:border-surface-950 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all duration-300">
        <svg className="w-[22px] h-[22px] text-surface-600 group-hover:text-white group-hover:-translate-y-0.5 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {count > 0 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-white text-[11px] font-black flex items-center justify-center shadow-lg shadow-purple-500/40 border-2 border-white z-10">
                {count}
            </motion.div>
        )}
    </div>
);

const WishlistIcon = ({ count = 0 }) => (
    <div className="relative group w-11 h-11 rounded-2xl flex items-center justify-center bg-surface-100/50 border border-surface-200/50 hover:bg-surface-950 hover:border-surface-950 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all duration-300">
        <svg className="w-[22px] h-[22px] text-surface-600 group-hover:text-rose-400 group-hover:fill-rose-400/20 group-hover:scale-110 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
        {count > 0 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full bg-gradient-to-tr from-rose-500 to-red-500 text-white text-[11px] font-black flex items-center justify-center shadow-lg shadow-rose-500/40 border-2 border-white z-10">
                {count}
            </motion.div>
        )}
    </div>
);

const BellIcon = ({ unreadCount = 0 }) => (
    <div className="relative group w-11 h-11 rounded-2xl flex items-center justify-center bg-surface-100/50 border border-surface-200/50 hover:bg-surface-950 hover:border-surface-950 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all duration-300">
        <svg className="w-[22px] h-[22px] text-surface-600 group-hover:text-amber-400 group-hover:rotate-12 transition-all duration-300 origin-top" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        {unreadCount > 0 && (
            <motion.div
                key={unreadCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white text-[11px] font-black flex items-center justify-center shadow-lg shadow-amber-500/40 border-2 border-white z-10"
            >
                {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
        )}
    </div>
);

const ChatIcon = ({ count = 0 }) => (
    <div className="relative group w-11 h-11 rounded-2xl flex items-center justify-center bg-surface-100/50 border border-surface-200/50 hover:bg-surface-950 hover:border-surface-950 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all duration-300">
        <svg className="w-[22px] h-[22px] text-surface-600 group-hover:text-blue-400 group-hover:scale-105 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
    </div>
);

// ─── Notification type icons ───────────────────────────────────────────────────
const NotifIcon = ({ type }) => {
    const icons = {
        transaction_paid:      { emoji: '💰', bg: 'bg-green-100' },
        item_shipped:          { emoji: '📦', bg: 'bg-blue-100' },
        transaction_completed: { emoji: '✅', bg: 'bg-emerald-100' },
        new_message:           { emoji: '💬', bg: 'bg-purple-100' },
        new_listing:           { emoji: '🌟', bg: 'bg-amber-100' },
    };
    const cfg = icons[type] || { emoji: '🔔', bg: 'bg-surface-100' };
    return (
        <div className={`w-10 h-10 rounded-2xl ${cfg.bg} flex items-center justify-center text-xl flex-shrink-0`}>
            {cfg.emoji}
        </div>
    );
};

// ─── Notification Dropdown ────────────────────────────────────────────────────
function NotificationDropdown({ notifications, unreadCount, onMarkAllRead, onMarkRead, onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-3 w-[380px] z-50 rounded-2xl bg-white border border-surface-200 shadow-2xl overflow-hidden"
        >
            {/* Header */}
            <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-surface-900 text-base">Notifikasi</h3>
                    {unreadCount > 0 && (
                        <p className="text-xs text-surface-500 mt-0.5">{unreadCount} belum dibaca</p>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={onMarkAllRead}
                        className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors"
                    >
                        Tandai Semua Dibaca
                    </button>
                )}
            </div>

            {/* List */}
            <div className="max-h-[420px] overflow-y-auto divide-y divide-surface-50">
                {notifications.length === 0 ? (
                    <div className="py-16 text-center px-6">
                        <div className="text-5xl mb-3">🔕</div>
                        <p className="font-bold text-surface-800 mb-1">Belum ada notifikasi</p>
                        <p className="text-sm text-surface-500">Notifikasi transaksi dan pesanmu akan muncul di sini.</p>
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <motion.div
                            key={notif.id}
                            layout
                            className={`flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors hover:bg-surface-50 ${!notif.is_read ? 'bg-purple-50/50' : ''}`}
                            onClick={() => {
                                if (!notif.is_read) onMarkRead(notif.id);
                                if (notif.url) window.location.href = notif.url;
                                onClose();
                            }}
                        >
                            <NotifIcon type={notif.type} />
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-bold leading-tight ${notif.is_read ? 'text-surface-700' : 'text-surface-900'}`}>
                                    {notif.title}
                                </p>
                                <p className="text-xs text-surface-500 mt-1 leading-relaxed line-clamp-2">
                                    {notif.body}
                                </p>
                                <p className="text-[11px] text-surface-400 mt-2 font-medium">
                                    {notif.created_at}
                                </p>
                            </div>
                            {/* Unread dot */}
                            {!notif.is_read && (
                                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary-500 to-purple-600 flex-shrink-0 mt-1.5" />
                            )}
                        </motion.div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-surface-100 bg-surface-50/50">
                <Link
                    href="/dashboard"
                    className="text-xs font-semibold text-surface-500 hover:text-surface-800 transition-colors"
                    onClick={onClose}
                >
                    Lihat semua di Dashboard →
                </Link>
            </div>
        </motion.div>
    );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [scrolled, setScrolled] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotif, setShowNotif] = useState(false);

    // ─── Notification state ───────────────────────────────────────────────────
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const notifRef = useRef(null);

    // Fetch notifications (polling every 30s, Reverb-ready)
    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        try {
            const res = await fetch('/api/notifications', {
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
                credentials: 'same-origin',
            });
            if (!res.ok) return;
            const data = await res.json();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unread_count || 0);
        } catch {
            // Silent fail — polling will retry
        }
    }, [user]);

    useEffect(() => {
        if (!user) return;
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30_000); // Poll every 30s
        return () => clearInterval(interval);
    }, [user, fetchNotifications]);

    // Close notif dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotif(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleMarkAllRead = async () => {
        try {
            await fetch('/api/notifications/read-all', {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content, 'X-Requested-With': 'XMLHttpRequest' },
                credentials: 'same-origin',
            });
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch {}
    };

    const handleMarkRead = async (id) => {
        try {
            await fetch(`/api/notifications/${id}/read`, {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content, 'X-Requested-With': 'XMLHttpRequest' },
                credentials: 'same-origin',
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch {}
    };

    // ─── Scroll ───────────────────────────────────────────────────────────────
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
                            <div className="flex items-center gap-2 sm:gap-3">
                                {/* ─── Notification Bell ───────────────────────────── */}
                                <div className="relative hidden sm:block" ref={notifRef}>
                                    <button
                                        onClick={() => setShowNotif(!showNotif)}
                                        className="focus:outline-none"
                                        aria-label="Notifikasi"
                                    >
                                        <BellIcon unreadCount={unreadCount} />
                                    </button>
                                    <AnimatePresence>
                                        {showNotif && (
                                            <NotificationDropdown
                                                notifications={notifications}
                                                unreadCount={unreadCount}
                                                onMarkAllRead={handleMarkAllRead}
                                                onMarkRead={handleMarkRead}
                                                onClose={() => setShowNotif(false)}
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Chat */}
                                <Link href={route('chat.index')} aria-label="Chat">
                                    <ChatIcon />
                                </Link>

                                {/* Favorites */}
                                <Link href={route('favorites')} aria-label="Favorit">
                                    <WishlistIcon count={0} />
                                </Link>

                                {/* Cart */}
                                <Link href={route('cart')} aria-label="Keranjang">
                                    <CartIcon count={0} />
                                </Link>

                                {/* Avatar + Dropdown */}
                                <div className="relative ml-2">
                                    <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center p-1 rounded-xl hover:bg-surface-100 transition-all">
                                        <img src={user.profile_picture_url || `https://ui-avatars.com/api/?name=${user.name}&background=FF1100&color=fff`} alt={user.name} className="w-8 h-8 rounded-lg border border-surface-200" />
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
                                                        <Link href={route('dashboard')} className="block px-4 py-2 text-sm text-surface-700 hover:bg-surface-50" onClick={() => setShowDropdown(false)}>Dashboard</Link>
                                                        <Link href={route('profile.edit')} className="block px-4 py-2 text-sm text-surface-700 hover:bg-surface-50" onClick={() => setShowDropdown(false)}>Profil</Link>
                                                        <Link href={route('favorites')} className="block px-4 py-2 text-sm text-surface-700 hover:bg-surface-50" onClick={() => setShowDropdown(false)}>Favorit</Link>
                                                        <Link href={route('cart')} className="block px-4 py-2 text-sm text-surface-700 hover:bg-surface-50" onClick={() => setShowDropdown(false)}>Keranjang</Link>
                                                        <div className="border-t border-surface-100 my-1" />
                                                        <Link href={route('logout')} method="post" as="button" className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Keluar</Link>
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
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
