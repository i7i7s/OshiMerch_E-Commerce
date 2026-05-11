import { WifiOff } from 'lucide-react';

export default function OfflineFallback() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 w-full h-full text-white">
            <div className="animate-bounce">
                <WifiOff className="h-24 w-24 text-rose-500 mb-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl mb-4">
                Tidak Ada Sinyal
            </h1>
            <p className="mt-4 text-base leading-7 text-gray-400 max-w-md mx-auto mb-8">
                Koneksi internet terputus. Silakan periksa jaringan Anda dan coba lagi.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="rounded-full bg-rose-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 transition-all active:scale-95"
            >
                Coba Lagi
            </button>
        </div>
    );
}
