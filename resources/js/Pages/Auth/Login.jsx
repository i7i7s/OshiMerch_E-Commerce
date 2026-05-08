import { Head, Link, useForm } from '@inertiajs/react';

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);

const XIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.626 5.905-5.626zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
);

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Masuk" />

            <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center px-4">
                {/* Decorative Background */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-20 -left-20 w-72 h-72 bg-secondary-200/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
                </div>

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 mb-8 relative z-10">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow-primary">
                        <span className="text-white font-bold text-lg">O</span>
                    </div>
                    <span className="text-2xl font-bold font-display text-surface-900">
                        Oshi<span className="gradient-text">Merch</span>
                    </span>
                </Link>

                {/* Login Card */}
                <div className="relative z-10 w-full max-w-md">
                    <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold font-display text-surface-900 tracking-tight mb-2">
                                Selamat Datang! 👋
                            </h1>
                            <p className="text-surface-500 text-sm">
                                Masuk ke akunmu untuk mulai jual-beli merchandise JKT48.
                            </p>
                        </div>

                        {status && (
                            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
                                {status}
                            </div>
                        )}

                        {/* Social Login Buttons */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <a
                                href={route('google.redirect')}
                                className="inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-white border-2 border-surface-200 text-surface-700 font-semibold text-sm hover:bg-surface-50 hover:border-surface-300 hover:shadow-md transition-all duration-200 min-h-[44px]"
                            >
                                <GoogleIcon />
                                Google
                            </a>
                            <a
                                href={route('twitter.redirect')}
                                className="inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-black text-white font-semibold text-sm hover:bg-surface-800 hover:shadow-md transition-all duration-200 min-h-[44px]"
                            >
                                <XIcon />
                                X / Twitter
                            </a>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex-1 h-px bg-surface-200" />
                            <span className="text-xs text-surface-400 font-medium">atau masuk dengan email</span>
                            <div className="flex-1 h-px bg-surface-200" />
                        </div>

                        {/* Email Login Form */}
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-surface-700 mb-1.5">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-surface-50 border border-surface-200 text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                                    placeholder="email@example.com"
                                    autoComplete="email"
                                    required
                                />
                                {errors.email && (
                                    <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-surface-700 mb-1.5">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-surface-50 border border-surface-200 text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                />
                                {errors.password && (
                                    <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-surface-600">Ingat saya</span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                        Lupa password?
                                    </Link>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full px-6 py-3.5 rounded-xl gradient-primary text-white font-semibold text-sm shadow-glow-primary hover:shadow-lg hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
                            >
                                {processing ? 'Memproses...' : 'Masuk'}
                            </button>
                        </form>
                    </div>

                    {/* Register link */}
                    <p className="text-center text-sm text-surface-500 mt-6">
                        Belum punya akun?{' '}
                        <Link href={route('register')} className="text-primary-600 hover:text-primary-700 font-semibold">
                            Daftar sekarang
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
