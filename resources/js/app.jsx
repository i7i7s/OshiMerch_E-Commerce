import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react';
import ErrorPage from './Pages/Error';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

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
                    <ErrorPage status="offline" standalone={true} />
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
            <NetworkWrapper>
                <App {...props} />
            </NetworkWrapper>
        );
    },
    progress: {
        color: '#FF1100',
    },
});
