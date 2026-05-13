import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Toast() {
    const { flash } = usePage().props;
    const [toasts, setToasts] = useState([]);
    // Track the last flash values so we only trigger once per unique flash
    const prevFlash = useRef({ success: null, error: null });

    useEffect(() => {
        const add = (type, message) => {
            const id = Date.now() + Math.random();
            setToasts((prev) => [...prev, { id, type, message }]);
            setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
        };

        if (flash?.success && flash.success !== prevFlash.current.success) {
            add('success', flash.success);
        }
        if (flash?.error && flash.error !== prevFlash.current.error) {
            add('error', flash.error);
        }

        prevFlash.current = { success: flash?.success ?? null, error: flash?.error ?? null };
    }, [flash?.success, flash?.error]);

    const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

    return (
        <div className="fixed bottom-6 right-6 z-[9998] flex flex-col gap-4 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: 24, scale: 0.9, rotate: -2 }}
                        animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, y: 12, scale: 0.9, rotate: 2 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className={`pointer-events-auto flex items-start gap-4 px-5 py-4 rounded-xl border-4 border-surface-900 shadow-[6px_6px_0_0_#0f172a] max-w-sm w-full ${
                            toast.type === 'success'
                                ? 'bg-[#A7F3D0]'
                                : 'bg-[#FECDD3]'
                        }`}
                    >
                        <div className="text-2xl shrink-0 mt-0.5 drop-shadow-[2px_2px_0_#0f172a]">
                            {toast.type === 'success' ? '✅' : '❌'}
                        </div>
                        <span
                            className="flex-1 text-sm font-black uppercase tracking-widest text-surface-900 leading-snug"
                        >
                            {toast.message}
                        </span>
                        <button
                            onClick={() => dismiss(toast.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a] hover:bg-[#FEF08A] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0_0_#0f172a] text-surface-900 font-black transition-all shrink-0 active:shadow-none active:translate-y-[2px] active:translate-x-[2px]"
                            aria-label="Tutup"
                        >
                            X
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
