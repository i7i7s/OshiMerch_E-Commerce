import { Head, Link, useForm } from '@inertiajs/react';

const GoogleIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);

const XIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.626 5.905-5.626zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
);

const StarSVG = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Daftar — OshiMerch" />

            <div className="min-h-screen bg-[#FEF08A] text-surface-900 selection:bg-surface-900 selection:text-[#BAE6FD] font-sans flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
                {/* Decorative Grid Pattern */}
                <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.4] pointer-events-none" />
                
                {/* Decorative Stars */}
                <StarSVG className="absolute top-20 right-10 w-20 h-20 text-surface-900 opacity-20 transform rotate-12 pointer-events-none" />
                <StarSVG className="absolute bottom-10 left-10 w-16 h-16 text-surface-900 opacity-10 transform -rotate-45 pointer-events-none" />

                {/* Logo Banner */}
                <Link href="/" className="mb-8 relative z-10 bg-white border-4 border-surface-900 shadow-[6px_6px_0_0_#0f172a] p-4 flex items-center gap-4 transform rotate-1 hover:rotate-0 hover:translate-y-[-2px] transition-all">
                    <img src="/images/logo.png" alt="OshiMerch" className="w-12 h-12 object-contain" />
                    <span className="text-3xl font-black font-display text-surface-900 uppercase tracking-tighter">
                        Oshi<span className="text-[#34D399]">Merch</span>
                    </span>
                </Link>

                {/* Register Card */}
                <div className="relative z-10 w-full max-w-md">
                    <div className="bg-white border-4 border-surface-900 shadow-[12px_12px_0_0_#0f172a] p-8 transform -rotate-1 relative">
                        {/* Decorative Pin */}
                        <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#BAE6FD] border-4 border-surface-900 shadow-[4px_4px_0_0_#0f172a] rounded-full flex items-center justify-center transform -rotate-12 z-20">
                            <StarSVG className="w-6 h-6 text-surface-900" />
                        </div>

                        <div className="mb-8 bg-[#FECDD3] border-4 border-surface-900 p-4 transform rotate-1 shadow-[4px_4px_0_0_#0f172a]">
                            <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-surface-900 mb-2">
                                BIKIN AKUN BARU
                            </h1>
                            <p className="text-surface-900 font-bold">
                                Gabung komunitas Wota terbesar se-Indonesia sekarang juga.
                            </p>
                        </div>

                        {/* Social Register Buttons */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <a
                                href={route('google.redirect')}
                                className="flex items-center justify-center gap-3 px-4 py-3 bg-white border-4 border-surface-900 text-surface-900 font-black uppercase text-sm shadow-[4px_4px_0_0_#0f172a] hover:shadow-[6px_6px_0_0_#0f172a] hover:-translate-y-1 transition-all"
                            >
                                <GoogleIcon />
                                Google
                            </a>
                            <a
                                href={route('twitter.redirect')}
                                className="flex items-center justify-center gap-3 px-4 py-3 bg-surface-900 text-white border-4 border-surface-900 font-black uppercase text-sm shadow-[4px_4px_0_0_#BAE6FD] hover:shadow-[6px_6px_0_0_#BAE6FD] hover:-translate-y-1 transition-all"
                            >
                                <XIcon />
                                X
                            </a>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-1 h-1 bg-surface-900" />
                            <span className="text-sm font-black uppercase bg-[#A7F3D0] px-3 py-1 border-2 border-surface-900 shadow-[2px_2px_0_0_#0f172a] transform -rotate-2">ATAU PAKAI EMAIL</span>
                            <div className="flex-1 h-1 bg-surface-900" />
                        </div>

                        {/* Registration Form */}
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-lg font-black uppercase text-surface-900 mb-2 flex items-center gap-2">
                                    <span className="w-3 h-3 bg-[#BAE6FD] border-2 border-surface-900 inline-block"></span>
                                    Nama Lengkap
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-4 py-3 bg-surface-50 border-4 border-surface-900 text-surface-900 font-bold placeholder-surface-400 focus:outline-none focus:ring-0 focus:bg-[#BAE6FD] transition-colors shadow-[4px_4px_0_0_#0f172a]"
                                    placeholder="NAMA KAMU"
                                    autoComplete="name"
                                    required
                                />
                                {errors.name && <p className="mt-2 text-sm font-bold text-white bg-red-500 border-2 border-surface-900 p-2 inline-block shadow-[2px_2px_0_0_#0f172a]">{errors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-lg font-black uppercase text-surface-900 mb-2 flex items-center gap-2">
                                    <span className="w-3 h-3 bg-[#FEF08A] border-2 border-surface-900 inline-block"></span>
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-4 py-3 bg-surface-50 border-4 border-surface-900 text-surface-900 font-bold placeholder-surface-400 focus:outline-none focus:ring-0 focus:bg-[#FEF08A] transition-colors shadow-[4px_4px_0_0_#0f172a]"
                                    placeholder="WOTA@EXAMPLE.COM"
                                    autoComplete="email"
                                    required
                                />
                                {errors.email && <p className="mt-2 text-sm font-bold text-white bg-red-500 border-2 border-surface-900 p-2 inline-block shadow-[2px_2px_0_0_#0f172a]">{errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-lg font-black uppercase text-surface-900 mb-2 flex items-center gap-2">
                                    <span className="w-3 h-3 bg-[#F472B6] border-2 border-surface-900 inline-block"></span>
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full px-4 py-3 bg-surface-50 border-4 border-surface-900 text-surface-900 font-bold placeholder-surface-400 focus:outline-none focus:ring-0 focus:bg-[#FBCFE8] transition-colors shadow-[4px_4px_0_0_#0f172a]"
                                    placeholder="MIN. 8 KARAKTER"
                                    autoComplete="new-password"
                                    required
                                />
                                {errors.password && <p className="mt-2 text-sm font-bold text-white bg-red-500 border-2 border-surface-900 p-2 inline-block shadow-[2px_2px_0_0_#0f172a]">{errors.password}</p>}
                            </div>

                            <div>
                                <label htmlFor="password_confirmation" className="block text-lg font-black uppercase text-surface-900 mb-2 flex items-center gap-2">
                                    <span className="w-3 h-3 bg-[#A7F3D0] border-2 border-surface-900 inline-block"></span>
                                    Konfirmasi Password
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full px-4 py-3 bg-surface-50 border-4 border-surface-900 text-surface-900 font-bold placeholder-surface-400 focus:outline-none focus:ring-0 focus:bg-[#D1FAE5] transition-colors shadow-[4px_4px_0_0_#0f172a]"
                                    placeholder="ULANGI PASSWORD"
                                    autoComplete="new-password"
                                    required
                                />
                                {errors.password_confirmation && <p className="mt-2 text-sm font-bold text-white bg-red-500 border-2 border-surface-900 p-2 inline-block shadow-[2px_2px_0_0_#0f172a]">{errors.password_confirmation}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full px-6 py-4 bg-[#BAE6FD] border-4 border-surface-900 text-surface-900 font-black text-xl uppercase tracking-widest shadow-[8px_8px_0_0_#0f172a] hover:shadow-[4px_4px_0_0_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:bg-[#7DD3FC] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                            >
                                {processing ? 'MEMPROSES...' : 'DAFTAR SEKARANG'}
                            </button>
                        </form>
                    </div>

                    {/* Login link */}
                    <div className="mt-8 text-center">
                        <Link href={route('login')} className="inline-block bg-white border-4 border-surface-900 px-6 py-3 font-black uppercase text-surface-900 shadow-[6px_6px_0_0_#0f172a] transform -rotate-2 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#0f172a] hover:bg-[#FEF08A] transition-all">
                            SUDAH PUNYA AKUN? MASUK SINI
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
