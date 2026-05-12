import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, X } from 'lucide-react';

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
        <div className="fixed bottom-6 right-6 z-[9998] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: 24, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.94 }}
                        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                        className={`pointer-events-auto flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl border max-w-sm w-full ${
                            toast.type === 'success'
                                ? 'bg-white border-emerald-200'
                                : 'bg-white border-red-200'
                        }`}
                    >
                        {toast.type === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                            <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        )}
                        <span
                            className={`flex-1 text-sm font-semibold leading-snug ${
                                toast.type === 'success' ? 'text-emerald-900' : 'text-red-900'
                            }`}
                        >
                            {toast.message}
                        </span>
                        <button
                            onClick={() => dismiss(toast.id)}
                            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-surface-100 text-surface-400 hover:text-surface-700 transition-colors shrink-0"
                            aria-label="Tutup"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
