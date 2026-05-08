import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { WifiOff, AlertTriangle, Lock, SearchX, ServerCrash } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ErrorPage({ status, standalone = false }) {
    const isOffline = status === 'offline';
    
    const errors = {
        offline: {
            title: 'Tidak Ada Sinyal',
            description: 'Koneksi internet terputus. Silakan periksa jaringan Anda dan coba lagi.',
            icon: <WifiOff className="h-24 w-24 text-rose-500 mb-6" />,
            action: 'Coba Lagi',
            link: '/',
        },
        400: {
            title: 'Permintaan Tidak Valid (400)',
            description: 'Sistem tidak dapat memproses permintaan Anda karena format yang salah atau data tidak lengkap.',
            icon: <AlertTriangle className="h-24 w-24 text-rose-500 mb-6" />,
            action: 'Kembali ke Beranda',
            link: '/',
        },
        401: {
            title: 'Belum Login (401)',
            description: 'Sesi Anda telah berakhir atau Anda belum login. Silakan masuk kembali.',
            icon: <Lock className="h-24 w-24 text-rose-500 mb-6" />,
            action: 'Login Sekarang',
            link: '/login',
        },
        403: {
            title: 'Akses Ditolak (403)',
            description: 'Anda tidak memiliki izin untuk mengakses halaman ini.',
            icon: <Lock className="h-24 w-24 text-rose-500 mb-6" />,
            action: 'Kembali ke Beranda',
            link: '/',
        },
        404: {
            title: 'Halaman Tidak Ditemukan (404)',
            description: 'Waduh, sepertinya merchandise atau halaman yang kamu cari tidak ada di sini.',
            icon: <SearchX className="h-24 w-24 text-rose-500 mb-6" />,
            action: 'Kembali ke Beranda',
            link: '/',
        },
        500: {
            title: 'Server Error (500)',
            description: 'Maaf, terjadi kesalahan pada sistem kami. Tim kami sedang memperbaikinya.',
            icon: <ServerCrash className="h-24 w-24 text-rose-500 mb-6" />,
            action: 'Coba Muat Ulang',
            link: '',
        },
        503: {
            title: 'Layanan Tidak Tersedia (503)',
            description: 'Sistem sedang dalam pemeliharaan. Silakan kembali lagi nanti.',
            icon: <ServerCrash className="h-24 w-24 text-rose-500 mb-6" />,
            action: 'Coba Muat Ulang',
            link: '',
        },
    };

    const error = errors[status] || {
        title: 'Terjadi Kesalahan',
        description: 'Telah terjadi kesalahan yang tidak diketahui.',
        icon: <AlertTriangle className="h-24 w-24 text-rose-500 mb-6" />,
        action: 'Kembali ke Beranda',
        link: '/',
    };

    const isRefreshAction = status === 500 || status === 503 || isOffline;

    const content = (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            {!standalone && <Head title={error.title} />}
            
            <div className="animate-bounce">
                {error.icon}
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-4">
                {error.title}
            </h1>
            
            <p className="mt-4 text-base leading-7 text-gray-400 max-w-md mx-auto mb-8">
                {error.description}
            </p>

            {isRefreshAction ? (
                <button
                    onClick={() => window.location.reload()}
                    className="rounded-full bg-rose-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 transition-all active:scale-95"
                >
                    {error.action}
                </button>
            ) : standalone ? (
                <a
                    href={error.link}
                    className="rounded-full bg-rose-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 transition-all active:scale-95"
                >
                    {error.action}
                </a>
            ) : (
                <Link
                    href={error.link}
                    className="rounded-full bg-rose-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 transition-all active:scale-95"
                >
                    {error.action}
                </Link>
            )}
        </div>
    );

    if (standalone) {
        return content;
    }

    return (
        <div className="min-h-dvh bg-[#0a0a0a] flex flex-col justify-center items-center">
            {content}
        </div>
    );
}
