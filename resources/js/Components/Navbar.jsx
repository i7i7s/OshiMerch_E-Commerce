import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '@/Components/Toast';

const NAV_LINKS = [
    { label: 'Produk', href: '/produk' },
    { label: 'Tentang Kami', href: '/about' },
    { label: 'Member',   href: '/members' },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const SearchIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const CartIcon = ({ count = 0 }) => (
    <div className="relative">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        {count > 0 && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] rounded-md bg-[#FEF08A] border-2 border-surface-900 text-surface-900 text-[10px] font-black flex items-center justify-center shadow-[1px_1px_0_0_#0f172a]">
                {count}
            </motion.span>
        )}
    </div>
);

const WishlistIcon = ({ count = 0 }) => (
    <div className="relative">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
        {count > 0 && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] rounded-md bg-[#FBCFE8] border-2 border-surface-900 text-surface-900 text-[10px] font-black flex items-center justify-center shadow-[1px_1px_0_0_#0f172a]">
                {count}
            </motion.span>
        )}
    </div>
);

const BellIcon = ({ unreadCount = 0 }) => (
    <div className="relative">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {unreadCount > 0 && (
            <motion.span
                key={unreadCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 min-w-[20px] h-[20px] rounded-md bg-[#FECDD3] border-2 border-surface-900 text-surface-900 text-[10px] font-black flex items-center justify-center shadow-[2px_2px_0_0_#0f172a] transform rotate-12"
            >
                {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
        )}
    </div>
);

// ─── Notification type icons ───────────────────────────────────────────────────
const NotifIcon = ({ type }) => {
    const icons = {
        transaction_paid:      { emoji: '💰', bg: 'bg-[#A7F3D0]' },
        item_shipped:          { emoji: '📦', bg: 'bg-[#BAE6FD]' },
        transaction_completed: { emoji: '✅', bg: 'bg-[#FEF08A]' },
        new_message:           { emoji: '💬', bg: 'bg-[#FECDD3]' },
        new_listing:           { emoji: '🌟', bg: 'bg-white' },
        review_received:       { emoji: '⭐', bg: 'bg-[#FBCFE8]' },
    };
    const cfg = icons[type] || { emoji: '🔔', bg: 'bg-white' };
    return (
        <div className={`w-12 h-12 rounded-xl ${cfg.bg} border-4 border-surface-900 flex items-center justify-center text-2xl flex-shrink-0 shadow-[2px_2px_0_0_#0f172a] transform -rotate-2 group-hover:rotate-0 transition-transform`}>
            <span className="drop-shadow-[1px_1px_0_#0f172a]">{cfg.emoji}</span>
        </div>
    );
};

// ─── Notification Dropdown ────────────────────────────────────────────────────
function NotificationDropdown({ notifications, unreadCount, onMarkAllRead, onMarkRead, onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8, rotate: 2 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-4 w-[400px] z-50 rounded-2xl bg-[#FAFAFA] border-4 border-surface-900 shadow-[8px_8px_0_0_#0f172a] overflow-hidden"
        >
            <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.2]" />
            {/* Header */}
            <div className="relative px-5 py-4 border-b-4 border-surface-900 flex items-center justify-between bg-[#BAE6FD]">
                <div>
                    <h3 className="font-black font-display text-surface-900 text-2xl uppercase tracking-tighter" style={{ textShadow: '2px 2px 0px white' }}>NOTIFIKASI</h3>
                    {unreadCount > 0 && (
                        <p className="text-[10px] font-black uppercase tracking-widest text-surface-900 bg-white inline-block px-1 border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a] mt-1">{unreadCount} BELUM DIBACA</p>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={onMarkAllRead}
                        className="text-[10px] font-black text-surface-900 uppercase tracking-widest bg-[#FEF08A] px-2 py-1 border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a] hover:bg-white transition-colors hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0_0_#0f172a] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
                    >
                        BACA SEMUA
                    </button>
                )}
            </div>

            {/* List */}
            <div className="relative max-h-[420px] overflow-y-auto divide-y-4 divide-surface-900 bg-white">
                {notifications.length === 0 ? (
                    <div className="py-16 text-center px-6">
                        <div className="w-24 h-24 mx-auto bg-[#FECDD3] border-4 border-surface-900 rounded-3xl flex items-center justify-center text-5xl shadow-[4px_4px_0_0_#0f172a] mb-4 transform rotate-6">🔕</div>
                        <p className="font-black font-display text-surface-900 text-2xl uppercase tracking-tighter mb-2">KOSONG MELOMPONG!</p>
                        <p className="text-xs font-bold text-surface-900 bg-[#FEF08A] p-2 border-2 border-surface-900 rounded-xl shadow-[2px_2px_0_0_#0f172a]">Notifikasi transaksi dan pesanmu akan muncul di sini.</p>
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <motion.div
                            key={notif.id}
                            layout
                            className={`flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors group ${!notif.is_read ? 'bg-[#FEF08A]' : 'hover:bg-surface-50'}`}
                            onClick={() => {
                                if (!notif.is_read) onMarkRead(notif.id);
                                if (notif.url) router.visit(notif.url);
                                onClose();
                            }}
                        >
                            <NotifIcon type={notif.type} />
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-black uppercase tracking-tight leading-tight mb-1 ${notif.is_read ? 'text-surface-900' : 'text-surface-900'}`}>
                                    {notif.title}
                                </p>
                                <p className="text-xs font-bold text-surface-700 leading-relaxed line-clamp-2 bg-white px-2 py-1 border-2 border-surface-900 rounded-lg">
                                    {notif.body}
                                </p>
                                <p className="text-[10px] text-surface-900 mt-2 font-black uppercase tracking-widest bg-white inline-block px-1 border-2 border-surface-900">
                                    {notif.created_at}
                                </p>
                            </div>
                            {/* Unread dot */}
                            {!notif.is_read && (
                                <div className="w-4 h-4 rounded-full bg-[#f43f5e] border-2 border-surface-900 flex-shrink-0 mt-1 shadow-[2px_2px_0_0_#0f172a] animate-pulse" />
                            )}
                        </motion.div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="relative px-5 py-3 border-t-4 border-surface-900 bg-[#A7F3D0] text-center">
                <Link
                    href="/dashboard"
                    className="inline-block px-4 py-2 bg-white border-2 border-surface-900 rounded-xl shadow-[2px_2px_0_0_#0f172a] text-[10px] font-black uppercase tracking-widest text-surface-900 hover:bg-[#FEF08A] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[4px_4px_0_0_#0f172a] transition-all"
                    onClick={onClose}
                >
                    LIHAT SEMUA NOTIFIKASI
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

    // Fetch notifications — called on mount and by polling interval
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
            // Silent fail
        }
    }, [user]);

    useEffect(() => {
        if (!user) return;
        fetchNotifications(); // Fetch existing on mount

        // ─── Poll every 10 s as fallback (works even when Reverb is offline) ─
        const pollTimer = setInterval(fetchNotifications, 10_000);

        // ─── Real-time: listen for new notifications via Echo/Reverb ─────
        if (window.Echo) {
            const channel = window.Echo.private(`notifications.${user.id}`);
            channel.listen('NewNotification', (e) => {
                setNotifications(prev => [e, ...prev].slice(0, 20));
                setUnreadCount(prev => prev + 1);
            });

            return () => {
                clearInterval(pollTimer);
                window.Echo.leave(`notifications.${user.id}`);
            };
        }

        return () => clearInterval(pollTimer);
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

    // CSRF helper — reads from XSRF-TOKEN cookie (set by Laravel on every response)
    // This is the SPA-safe approach: no meta tag needed
    const getCsrf = () => {
        const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/)
        return match ? decodeURIComponent(match[1]) : (
            document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? ''
        );
    };

    const apiFetch = (url, method = 'POST') =>
        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': getCsrf(),   // Laravel accepts this from cookie
                'X-CSRF-TOKEN':  getCsrf(),   // Laravel also accepts this from meta tag
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
            },
            credentials: 'same-origin',
        });

    const handleMarkAllRead = async () => {
        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
        try {
            const res = await apiFetch('/api/notifications/read-all');
            if (!res.ok) {
                // Revert on failure by re-fetching real state
                fetchNotifications();
            }
        } catch {
            fetchNotifications(); // Revert
        }
    };

    const handleMarkRead = async (id) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
        try {
            const res = await apiFetch(`/api/notifications/${id}/read`);
            if (!res.ok) {
                fetchNotifications(); // Revert on failure
            }
        } catch {
            fetchNotifications();
        }
    };

    // ─── Scroll ───────────────────────────────────────────────────────────────
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-white border-b-4 border-surface-900 shadow-[0_4px_0_0_#0f172a]'
                    : 'bg-[#FAFAFA] border-b-4 border-surface-900'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 h-16 sm:h-[80px]">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 shrink-0 group">
                        <img src="/images/logo.png" alt="OshiMerch" className="w-12 h-12 sm:w-14 sm:h-14 object-contain group-hover:-translate-y-1 group-hover:-rotate-6 transition-transform drop-shadow-[2px_2px_0_rgba(15,23,42,1)]" />
                        <span className="text-2xl sm:text-3xl font-black font-display text-surface-900 uppercase tracking-tighter hidden sm:block group-hover:-translate-y-1 transition-transform" style={{ textShadow: '2px 2px 0px #FEF08A' }}>
                            Oshi<span className="text-[#3b82f6]">Merch</span>
                        </span>
                    </Link>

                    {/* Nav Links — Desktop */}
                    <div className="hidden lg:flex items-center gap-2 ml-4 flex-1">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest text-surface-900 border-4 border-transparent hover:border-surface-900 hover:bg-[#FEF08A] hover:shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 transition-all"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                {/* ─── Notification Bell ───────────────────────────── */}
                                <div className="relative hidden sm:block" ref={notifRef}>
                                    <button
                                        onClick={() => setShowNotif(!showNotif)}
                                        className={`p-3 rounded-2xl border-4 border-surface-900 transition-all shadow-[4px_4px_0_0_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none hover:bg-white text-surface-900 ${showNotif ? 'bg-[#BAE6FD] translate-y-1 translate-x-1 shadow-none' : 'bg-[#BAE6FD]'}`}
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
                                <Link href={route('chat.index')} className="p-3 rounded-2xl border-4 border-surface-900 bg-[#FEF08A] transition-all shadow-[4px_4px_0_0_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none hover:bg-white text-surface-900 flex items-center" aria-label="Chat">
                                    <svg className="w-6 h-6 stroke-surface-900" fill="none" viewBox="0 0 24 24" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                    </svg>
                                </Link>

                                {/* Favorites */}
                                <Link href={route('favorites')} className="p-3 rounded-2xl border-4 border-surface-900 bg-[#FBCFE8] transition-all shadow-[4px_4px_0_0_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none hover:bg-white text-surface-900" aria-label="Favorit">
                                    <WishlistIcon count={0} />
                                </Link>

                                {/* Cart */}
                                <Link href={route('cart')} className="p-3 rounded-2xl border-4 border-surface-900 bg-[#A7F3D0] transition-all shadow-[4px_4px_0_0_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none hover:bg-white text-surface-900" aria-label="Keranjang">
                                    <CartIcon count={0} />
                                </Link>

                                {/* Avatar + Dropdown */}
                                <div className="relative ml-2">
                                    <button onClick={() => setShowDropdown(!showDropdown)} className={`flex items-center p-0.5 rounded-2xl border-4 border-surface-900 bg-white transition-all shadow-[4px_4px_0_0_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none ${showDropdown ? 'translate-y-1 translate-x-1 shadow-none' : ''}`}>
                                        <img src={user.profile_picture_url || `https://ui-avatars.com/api/?name=${user.name}&background=FF1100&color=fff`} alt={user.name} className="w-10 h-10 rounded-xl object-cover border-2 border-surface-900" />
                                    </button>
                                    <AnimatePresence>
                                        {showDropdown && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                                                <motion.div initial={{ opacity: 0, scale: 0.95, y: -8, rotate: 2 }} animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, scale: 0.95, y: -8, rotate: -2 }} transition={{ duration: 0.15 }} className="absolute right-0 top-full mt-4 w-56 z-50 rounded-2xl bg-white border-4 border-surface-900 shadow-[8px_8px_0_0_#0f172a] overflow-hidden">
                                                    <div className="px-5 py-4 border-b-4 border-surface-900 bg-[#FEF08A]">
                                                        <p className="text-sm font-black text-surface-900 truncate uppercase tracking-widest">{user.name}</p>
                                                        <p className="text-[10px] font-bold text-surface-900 bg-white inline-block px-1 border-2 border-surface-900 mt-1 truncate max-w-full">{user.email}</p>
                                                    </div>
                                                    <div className="py-2 flex flex-col gap-1 px-2">
                                                        <Link href={route('dashboard')} className="block px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-surface-900 hover:bg-[#FEF08A] hover:border-surface-900 border-4 border-transparent transition-all" onClick={() => setShowDropdown(false)}>DASHBOARD</Link>
                                                        <Link href={route('profile.edit')} className="block px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-surface-900 hover:bg-[#BAE6FD] hover:border-surface-900 border-4 border-transparent transition-all" onClick={() => setShowDropdown(false)}>PROFIL</Link>
                                                        <Link href={route('favorites')} className="block px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-surface-900 hover:bg-[#FBCFE8] hover:border-surface-900 border-4 border-transparent transition-all" onClick={() => setShowDropdown(false)}>FAVORIT</Link>
                                                        <Link href={route('cart')} className="block px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-surface-900 hover:bg-[#A7F3D0] hover:border-surface-900 border-4 border-transparent transition-all" onClick={() => setShowDropdown(false)}>KERANJANG</Link>
                                                        <div className="border-t-4 border-surface-900 my-2 mx-2" />
                                                        <Link href={route('logout')} method="post" as="button" className="block w-full text-center px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-surface-900 hover:bg-[#f43f5e] hover:text-white transition-all border-4 border-transparent hover:border-surface-900 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_0_#0f172a] active:translate-y-0 active:translate-x-0 active:shadow-none mb-1">KELUAR</Link>
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <>
                                <a href={route('login')} className="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-surface-900 bg-white border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] hover:bg-[#FEF08A] transition-all hidden sm:block">MASUK</a>
                                <a href={route('register')} className="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-surface-900 bg-[#BAE6FD] border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] hover:bg-white transition-all">DAFTAR</a>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
        <Toast />
        </>
    );
}
