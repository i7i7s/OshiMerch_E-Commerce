import { Head, Link } from '@inertiajs/react';
import { WifiOff, AlertTriangle, Lock, SearchX, ServerCrash } from 'lucide-react';

export default function ErrorPage({ status, standalone = false }) {
    const isOffline = status === 'offline';
    
    const errors = {
        offline: {
            title: 'NO SIGNAL',
            description: 'Koneksi internet terputus. Silakan periksa jaringan Anda dan coba lagi.',
            icon: <WifiOff className="h-20 w-20 text-surface-900" strokeWidth={3} />,
            action: 'COBA LAGI',
            link: '/',
            color: 'bg-[#FECDD3]'
        },
        400: {
            title: 'BAD REQUEST (400)',
            description: 'Sistem tidak dapat memproses permintaan Anda karena format yang salah atau data tidak lengkap.',
            icon: <AlertTriangle className="h-20 w-20 text-surface-900" strokeWidth={3} />,
            action: 'KEMBALI KE BERANDA',
            link: '/',
            color: 'bg-[#FEF08A]'
        },
        401: {
            title: 'UNAUTHORIZED (401)',
            description: 'Sesi Anda telah berakhir atau Anda belum login. Silakan masuk kembali.',
            icon: <Lock className="h-20 w-20 text-surface-900" strokeWidth={3} />,
            action: 'LOGIN SEKARANG',
            link: '/login',
            color: 'bg-[#A7F3D0]'
        },
        403: {
            title: 'FORBIDDEN (403)',
            description: 'Anda tidak memiliki izin untuk mengakses halaman ini.',
            icon: <Lock className="h-20 w-20 text-surface-900" strokeWidth={3} />,
            action: 'KEMBALI KE BERANDA',
            link: '/',
            color: 'bg-[#FECDD3]'
        },
        404: {
            title: 'NOT FOUND (404)',
            description: 'Waduh, sepertinya merchandise atau halaman yang kamu cari tidak ada di sini.',
            icon: <SearchX className="h-20 w-20 text-surface-900" strokeWidth={3} />,
            action: 'KEMBALI KE BERANDA',
            link: '/',
            color: 'bg-[#BAE6FD]'
        },
        500: {
            title: 'SERVER ERROR (500)',
            description: 'Maaf, terjadi kesalahan pada sistem kami. Tim kami sedang memperbaikinya.',
            icon: <ServerCrash className="h-20 w-20 text-surface-900" strokeWidth={3} />,
            action: 'COBA MUAT ULANG',
            link: '',
            color: 'bg-[#FECDD3]'
        },
        503: {
            title: 'MAINTENANCE (503)',
            description: 'Sistem sedang dalam pemeliharaan. Silakan kembali lagi nanti.',
            icon: <ServerCrash className="h-20 w-20 text-surface-900" strokeWidth={3} />,
            action: 'COBA MUAT ULANG',
            link: '',
            color: 'bg-[#FEF08A]'
        },
    };

    const error = errors[status] || {
        title: `ERROR (${status || 'UNKNOWN'})`,
        description: 'Telah terjadi kesalahan yang tidak diketahui.',
        icon: <AlertTriangle className="h-20 w-20 text-surface-900" strokeWidth={3} />,
        action: 'KEMBALI KE BERANDA',
        link: '/',
        color: 'bg-[#FEF08A]'
    };

    const isRefreshAction = status === 500 || status === 503 || isOffline;

    const actionButton = (
        <div className="mt-8">
            {isRefreshAction ? (
                <button
                    onClick={() => window.location.reload()}
                    className="inline-block bg-surface-900 text-white font-black uppercase tracking-widest px-8 py-4 border-4 border-surface-900 hover:bg-white hover:text-surface-900 shadow-[6px_6px_0_0_#0f172a] hover:shadow-[8px_8px_0_0_#0f172a] transition-all hover:-translate-y-1 hover:-translate-x-1 transform rotate-1 active:translate-y-1 active:translate-x-1 active:shadow-none"
                >
                    {error.action}
                </button>
            ) : standalone ? (
                <a
                    href={error.link}
                    className="inline-block bg-surface-900 text-white font-black uppercase tracking-widest px-8 py-4 border-4 border-surface-900 hover:bg-white hover:text-surface-900 shadow-[6px_6px_0_0_#0f172a] hover:shadow-[8px_8px_0_0_#0f172a] transition-all hover:-translate-y-1 hover:-translate-x-1 transform rotate-1 active:translate-y-1 active:translate-x-1 active:shadow-none"
                >
                    {error.action}
                </a>
            ) : (
                <Link
                    href={error.link}
                    className="inline-block bg-surface-900 text-white font-black uppercase tracking-widest px-8 py-4 border-4 border-surface-900 hover:bg-white hover:text-surface-900 shadow-[6px_6px_0_0_#0f172a] hover:shadow-[8px_8px_0_0_#0f172a] transition-all hover:-translate-y-1 hover:-translate-x-1 transform rotate-1 active:translate-y-1 active:translate-x-1 active:shadow-none"
                >
                    {error.action}
                </Link>
            )}
        </div>
    );

    const content = (
        <div className="flex flex-col items-center justify-center min-h-[100dvh] text-center px-4 relative overflow-hidden bg-[#FAFAFA]">
            {!standalone && <Head title={error.title} />}
            
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.2] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center max-w-3xl">
                {/* Icon Box */}
                <div className={`${error.color} p-6 border-4 border-surface-900 shadow-[8px_8px_0_0_#0f172a] transform -rotate-3 mb-10`}>
                    {error.icon}
                </div>

                {/* Title */}
                <h1 className="text-6xl sm:text-8xl font-black font-display uppercase tracking-tighter text-surface-900 leading-none mb-6" style={{ textShadow: `4px 4px 0px ${error.color.replace('bg-[', '').replace(']', '')}` }}>
                    {error.title.split(' ')[0]}
                    <br />
                    {error.title.split(' ').slice(1).join(' ')}
                </h1>
                
                {/* Description Box */}
                <div className="bg-white p-6 border-4 border-surface-900 shadow-[6px_6px_0_0_#0f172a] transform rotate-1">
                    <p className="text-lg sm:text-xl font-bold uppercase tracking-widest text-surface-900 leading-relaxed max-w-xl">
                        {error.description}
                    </p>
                </div>

                {actionButton}
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 text-surface-900 font-black text-4xl opacity-10 transform -rotate-12 pointer-events-none">ERROR</div>
            <div className="absolute bottom-20 right-10 text-surface-900 font-black text-6xl opacity-10 transform rotate-12 pointer-events-none">{status || '???'}</div>
        </div>
    );

    return content;
}
