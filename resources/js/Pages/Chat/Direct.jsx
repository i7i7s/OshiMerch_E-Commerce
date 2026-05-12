import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';
import Navbar from '@/Components/Navbar';

function ChatBubble({ message, currentUserId }) {
    const isMine = message.sender_id === currentUserId;
    return (
        <div className={`flex gap-2.5 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
            <img
                src={message.sender?.profile_picture_url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(message.sender?.name || '?')}&background=FF1100&color=fff&size=40`}
                alt={message.sender?.name}
                className="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
            />
            <div className={`max-w-[72%] flex flex-col gap-1 ${isMine ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMine
                        ? 'gradient-primary text-white rounded-tr-sm'
                        : 'bg-white border border-surface-200 text-surface-800 rounded-tl-sm'
                }`}>
                    {message.content}
                </div>
                <p className="text-[10px] text-surface-400 px-1">{message.created_at_human}</p>
            </div>
        </div>
    );
}

export default function Direct({ conversation }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const { data, setData } = useForm({ content: '' });
    const chatEndRef = useRef(null);
    const other = conversation.other;

    // ─── Local state for real-time message updates ───────────────────────────
    const [messages, setMessages] = useState(conversation.messages);

    // Sync when Inertia re-renders with fresh data (e.g., sender's own message)
    useEffect(() => {
        setMessages(conversation.messages);
    }, [conversation.messages]);

    // ─── Echo: Listen for real-time messages ─────────────────────────────────
    useEffect(() => {
        if (!window.Echo) return;

        const channel = window.Echo.private(`conversation.${conversation.id}`);

        channel.listen('DirectMessageSent', (e) => {
            setMessages(prev => {
                // Prevent duplicates (Inertia reload might already have it)
                if (prev.some(m => m.id === e.id)) return prev;
                return [...prev, e];
            });
        });

        return () => {
            window.Echo.leave(`conversation.${conversation.id}`);
        };
    }, [conversation.id]);

    // Auto-scroll when messages change
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const [sending, setSending] = useState(false);

    const sendMessage = async (e) => {
        e.preventDefault();
        const content = data.content.trim();
        if (!content || sending) return;

        // Optimistic: show sender's own message immediately
        const optimistic = {
            id: `temp-${Date.now()}`,
            content,
            sender_id: user.id,
            sender: { id: user.id, name: user.name, profile_picture_url: user.profile_picture_url },
            created_at_human: 'Baru saja',
        };
        setMessages(prev => [...prev, optimistic]);
        setData('content', '');
        setSending(true);

        try {
            const res = await fetch(route('chat.sendDirect', conversation.id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || ''),
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ content }),
            });

            if (res.ok) {
                // Replace optimistic message with real one from server response
                const json = await res.json().catch(() => null);
                if (json?.message) {
                    setMessages(prev => prev.map(m => m.id === optimistic.id ? json.message : m));
                }
            } else {
                // Rollback on error
                setMessages(prev => prev.filter(m => m.id !== optimistic.id));
                setData('content', content);
            }
        } catch {
            setMessages(prev => prev.filter(m => m.id !== optimistic.id));
            setData('content', content);
        } finally {
            setSending(false);
        }
    };

    const otherAvatar = other.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(other.name)}&background=FF1100&color=fff&size=80`;

    return (
        <>
            <Head title={`Chat dengan ${other.name} — OshiMerch`} />
            <div className="min-h-dvh bg-surface-50 flex flex-col">
                <Navbar />

                <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full pt-[72px]">
                    {/* Chat header */}
                    <div className="sticky top-[72px] z-10 bg-white border-b border-surface-200 px-4 py-3 flex items-center gap-3 shadow-sm">
                        <Link href={route('chat.index')} className="p-2 rounded-xl hover:bg-surface-100 text-surface-500 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <img src={otherAvatar} alt={other.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-surface-100" />
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-surface-900 text-sm leading-tight">{other.name}</p>
                            {other.oshi_member_name && (
                                <p className="text-[11px] text-primary-500">Oshi: {other.oshi_member_name}</p>
                            )}
                        </div>
                        <Link href={route('seller.profile', other.id)}
                            className="text-xs text-primary-500 font-semibold hover:text-primary-700 transition-colors shrink-0">
                            Lihat Profil
                        </Link>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0"
                        style={{ maxHeight: 'calc(100dvh - 72px - 64px - 72px)' }}>
                        {messages.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center h-full py-24 text-center">
                                <div className="w-20 h-20 rounded-3xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
                                    <span className="text-4xl">💬</span>
                                </div>
                                <p className="font-bold text-surface-700 mb-1">Mulai percakapan</p>
                                <p className="text-sm text-surface-500 max-w-xs">
                                    Kamu sedang chat dengan <span className="font-semibold text-surface-700">{other.name}</span>.
                                    Tanyakan tentang produk atau negosiasi harga!
                                </p>
                            </motion.div>
                        ) : (
                            messages.map(msg => (
                                <ChatBubble key={msg.id} message={msg} currentUserId={user?.id} />
                            ))
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <div className="sticky bottom-0 bg-white border-t border-surface-200 px-3 py-3">
                        <form onSubmit={sendMessage} className="flex items-end gap-2">
                            <textarea
                                value={data.content}
                                onChange={e => setData('content', e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e); } }}
                                placeholder={`Kirim pesan ke ${other.name}...`}
                                rows={1}
                                className="flex-1 resize-none rounded-2xl border border-surface-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 max-h-28 bg-surface-50"
                            />
                            <button
                                type="submit"
                                disabled={sending || !data.content.trim()}
                                className="p-3 rounded-2xl gradient-primary text-white shadow-glow-primary hover:shadow-xl transition-all disabled:opacity-40 shrink-0"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
}
