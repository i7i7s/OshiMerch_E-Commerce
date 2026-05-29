import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { useState, useEffect, Component } from 'react';
import OfflineFallback from './Components/OfflineFallback';

// ── Google Analytics 4: re-fire page_view on every Inertia SPA navigation ──
// Without this, GA only tracks the very first page load because Inertia
// navigates without a full browser reload.
router.on('navigate', () => {
    if (typeof window.gtag === 'function' && window.GA_ID) {
        window.gtag('event', 'page_view', {
            page_location: window.location.href,
            page_title: document.title,
        });
    }
});

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Error Boundary - catches React render errors and shows a fallback UI
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('[OshiMerch] Render Error:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-dvh bg-[#FAFAFA] flex items-center justify-center p-8">
                    <div className="max-w-lg w-full bg-white border-4 border-surface-900 rounded-3xl p-8 shadow-[8px_8px_0_0_#0f172a] text-center">
                        <p className="text-5xl mb-4">&#9888;&#65039;</p>
                        <h1 className="text-2xl font-black uppercase tracking-widest text-surface-900 mb-3">TERJADI KESALAHAN</h1>
                        <p className="text-sm font-bold text-surface-600 mb-6">
                            {this.state.error?.message || 'Halaman gagal dimuat.'}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-surface-900 text-white font-black text-sm uppercase tracking-widest rounded-xl hover:bg-[#FEF08A] hover:text-surface-900 border-4 border-surface-900 transition-all shadow-[4px_4px_0_0_#0f172a]"
                        >
                            MUAT ULANG
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

function NetworkWrapper({ children }) {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <>
            {!isOnline && (
                <div className="fixed inset-0 z-[9999] bg-[#0a0a0a] overflow-auto flex flex-col justify-center items-center">
                    <OfflineFallback />
                </div>
            )}
            {children}
        </>
    );
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ErrorBoundary>
                <NetworkWrapper>
                    <App {...props} />
                </NetworkWrapper>
            </ErrorBoundary>
        );
    },
    progress: {
        color: '#FF1100',
    },
});