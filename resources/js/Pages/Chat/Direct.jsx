import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Package } from 'lucide-react';
import Navbar from '@/Components/Navbar';

const CONDITION_LABEL = {
    New:  { text: 'NEW',  style: 'bg-[#A7F3D0] text-surface-900 border-surface-900' },
    Mint: { text: 'MINT', style: 'bg-[#BAE6FD] text-surface-900 border-surface-900' },
    Used: { text: 'USED', style: 'bg-white text-surface-900 border-surface-900' },
};

function ListingContextCard({ listing }) {
    const cond = CONDITION_LABEL[listing.condition] ?? { text: listing.condition, style: 'bg-surface-400 text-white' };
    return (
        <div className="px-4 pt-6 pb-2 relative z-10">
            <Link
                href={route('products.show', listing.id)}
                className="flex items-center gap-4 bg-[#FEF08A] border-4 border-surface-900 rounded-2xl p-4 shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all group"
            >
                {listing.image_url ? (
                    <img
                        src={listing.image_url}
                        alt={listing.title}
                        className="w-20 h-20 rounded-xl object-cover shrink-0 border-4 border-surface-900 shadow-[2px_2px_0_0_#0f172a]"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-xl bg-white flex items-center justify-center shrink-0 border-4 border-surface-900 shadow-[2px_2px_0_0_#0f172a]">
                        <Package className="w-8 h-8 text-surface-900" />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-surface-900 bg-white inline-block px-1 border-2 border-surface-900 uppercase tracking-widest font-black mb-1 transform -rotate-1">INFO PRODUK</p>
                    <p className="font-black text-surface-900 text-lg leading-tight truncate uppercase tracking-tight">
                        {listing.title}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                        <p className="bg-white px-2 py-0.5 border-2 border-surface-900 font-black text-sm uppercase shadow-[2px_2px_0_0_#0f172a]">
                            Rp {listing.price.toLocaleString('id-ID')}
                        </p>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border-2 ${cond.style}`}>
                            {cond.text}
                        </span>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white border-4 border-surface-900 flex items-center justify-center shadow-[2px_2px_0_0_#0f172a] group-hover:bg-[#A7F3D0] transition-colors shrink-0">
                    <svg className="w-5 h-5 text-surface-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </Link>
        </div>
    );
}

function ChatBubble({ message, currentUserId }) {
    const isMine = message.sender_id === currentUserId;
    return (
        <div className={`flex gap-3 ${isMine ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
            <img
                src={message.sender?.profile_picture_url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(message.sender?.name || '?')}&background=FF1100&color=fff&size=40`}
                alt={message.sender?.name}
                className="w-10 h-10 rounded-full object-cover shrink-0 border-4 border-surface-900 shadow-[2px_2px_0_0_#0f172a] mt-1"
            />
            <div className={`max-w-[75%] flex flex-col gap-1 ${isMine ? 'items-end' : 'items-start'}`}>
                <div className={`px-5 py-3 rounded-2xl text-sm font-bold border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] ${
                    isMine
                        ? 'bg-[#A7F3D0] text-surface-900 rounded-tr-none'
                        : 'bg-white text-surface-900 rounded-tl-none'
                }`}>
                    {message.content}
                </div>
                <p className={`text-[10px] font-black uppercase tracking-widest bg-white px-1 border-2 border-surface-900 mt-1 ${isMine ? 'mr-1' : 'ml-1'}`}>{message.created_at_human}</p>
            </div>
        </div>
    );
}

export default function Direct({ conversation, listing = null }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const { data, setData } = useForm({ content: '' });
    const chatEndRef = useRef(null);
    const other = conversation.other;

    // ─── Local state for real-time message updates ───────────────────────────
    const [messages, setMessages] = useState(conversation.messages);
    const lastMessageIdRef = useRef(0);

    // Track the highest real message ID seen
    useEffect(() => {
        const maxId = messages.filter(m => typeof m.id === 'number').reduce((max, m) => Math.max(max, m.id), 0);
        if (maxId > lastMessageIdRef.current) lastMessageIdRef.current = maxId;
    }, [messages]);

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

    // ─── Polling fallback: fetch new messages every 3s (works without Reverb) ─
    useEffect(() => {
        const poll = async () => {
            try {
                const after = lastMessageIdRef.current;
                const res = await fetch(
                    route('chat.getMessages', conversation.id) + `?after=${after}`,
                    { headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, credentials: 'same-origin' }
                );
                if (!res.ok) return;
                const { messages: newMsgs } = await res.json();
                if (newMsgs?.length > 0) {
                    setMessages(prev => {
                        const existingIds = new Set(prev.map(m => m.id));
                        const fresh = newMsgs.filter(m => !existingIds.has(m.id));
                        return fresh.length > 0 ? [...prev, ...fresh] : prev;
                    });
                }
            } catch {
                // Silently fail
            }
        };

        const timer = setInterval(poll, 3000);
        return () => clearInterval(timer);
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
            created_at_human: 'BARU SAJA',
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
                    setMessages(prev => {
                        // If Echo already added the real message, just remove the optimistic one
                        if (prev.some(m => m.id === json.message.id)) {
                            return prev.filter(m => m.id !== optimistic.id);
                        }
                        return prev.map(m => m.id === optimistic.id ? json.message : m);
                    });
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
            <div className="min-h-dvh bg-[#FAFAFA] flex flex-col font-sans selection:bg-surface-900 selection:text-[#FEF08A]">
                <Navbar />

                <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full pt-[96px] relative">
                    <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.2] pointer-events-none" />

                    {/* Chat header */}
                    <div className="sticky top-[96px] z-20 bg-[#BAE6FD] border-4 border-surface-900 mx-4 mt-4 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-[8px_8px_0_0_#0f172a] transform -rotate-1">
                        <Link href={route('chat.index')} className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] transition-all">
                            <ArrowLeft className="w-6 h-6 text-surface-900 font-black" />
                        </Link>
                        <img src={otherAvatar} alt={other.name}
                            className="w-14 h-14 rounded-full object-cover border-4 border-surface-900 shadow-[2px_2px_0_0_#0f172a]" />
                        <div className="flex-1 min-w-0">
                            <p className="font-black text-surface-900 text-xl leading-none uppercase tracking-tighter truncate">{other.name}</p>
                            {other.oshi_member_name && (
                                <p className="text-[10px] font-black uppercase tracking-widest text-surface-900 bg-white inline-block px-1 border-2 border-surface-900 mt-1 shadow-[2px_2px_0_0_#0f172a]">OSHI: {other.oshi_member_name}</p>
                            )}
                        </div>
                        <Link href={route('seller.profile', other.id)}
                            className="hidden sm:flex text-xs text-surface-900 bg-white px-4 py-2 rounded-xl font-black uppercase tracking-widest hover:bg-[#FEF08A] transition-colors shrink-0 border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1">
                            PROFIL
                        </Link>
                    </div>

                    {/* Listing context card */}
                    {listing && <ListingContextCard listing={listing} />}

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 z-10"
                        style={{ maxHeight: `calc(100dvh - 96px - 100px - 90px${listing ? ' - 120px' : ''})` }}>
                        {messages.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center h-full py-24 text-center">
                                <div className="w-24 h-24 rounded-3xl bg-[#FECDD3] flex items-center justify-center mx-auto mb-6 border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] transform rotate-3">
                                    <span className="text-4xl">💬</span>
                                </div>
                                <p className="font-black font-display text-surface-900 text-3xl mb-2 uppercase tracking-tighter">SAY HI!</p>
                                <p className="text-sm font-bold text-surface-900 max-w-xs bg-[#FEF08A] p-3 rounded-xl border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a]">
                                    Kamu sedang chat dengan <span className="font-black uppercase">{other.name}</span>.<br/>
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
                    <div className="sticky bottom-0 bg-[#FAFAFA] border-t-4 border-surface-900 p-4 z-20">
                        <form onSubmit={sendMessage} className="flex items-end gap-3 max-w-3xl mx-auto">
                            <textarea
                                value={data.content}
                                onChange={e => setData('content', e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e); } }}
                                placeholder="Ketik pesan..."
                                rows={1}
                                className="flex-1 resize-none rounded-2xl border-4 border-surface-900 px-5 py-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:bg-[#FEF08A] max-h-32 bg-white shadow-[4px_4px_0_0_#0f172a] transition-all"
                            />
                            <button
                                type="submit"
                                disabled={sending || !data.content.trim()}
                                className="w-14 h-14 flex items-center justify-center rounded-2xl bg-surface-900 text-white shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#0f172a] hover:bg-[#A7F3D0] hover:text-surface-900 transition-all disabled:opacity-50 disabled:shadow-[4px_4px_0_0_#0f172a] disabled:translate-x-0 disabled:translate-y-0 disabled:hover:bg-surface-900 disabled:hover:text-white shrink-0 border-4 border-transparent hover:border-surface-900"
                            >
                                <Send className="w-6 h-6" />
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
}
