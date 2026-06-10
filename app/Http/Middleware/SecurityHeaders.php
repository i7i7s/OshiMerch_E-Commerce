<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // ── Content-Security-Policy ────────────────────────────────────────────
        $nonce     = base64_encode(random_bytes(16));
        $appUrl    = rtrim(config('app.url'), '/');

        $csp = implode('; ', [
            // Default fallback — only self
            "default-src 'self'",

            // Scripts — self + Vite HMR (dev) + Midtrans snap + inline scripts
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
                . " https://app.midtrans.com https://api.midtrans.com"
                . " https://app.sandbox.midtrans.com",

            // Styles — self + inline (Tailwind/Inertia injects inline styles)
            "style-src 'self' 'unsafe-inline'",

            // Images — self + data URIs + wsrv.nl image proxy + any HTTPS
            "img-src 'self' data: https://wsrv.nl https:",

            // Fonts — self
            "font-src 'self' data:",

            // Connect (fetch/XHR/WebSocket) — self + APIs + Reverb WS
            "connect-src 'self'"
                . " {$appUrl}"
                . " wss://oshimerch.store"
                . " https://jkt-48-member-api-i7i7.vercel.app"
                . " https://wsrv.nl"
                . " https://api.midtrans.com"
                . " https://app.midtrans.com"
                . " https://api.sandbox.midtrans.com"
                . " https://app.sandbox.midtrans.com",

            // Frames — Midtrans payment popup
            "frame-src 'self'"
                . " https://app.midtrans.com"
                . " https://app.sandbox.midtrans.com",

            // Form action — only self
            "form-action 'self'",

            // Base URI — only self (prevent base-tag injection)
            "base-uri 'self'",

            // Upgrade insecure requests in production
            app()->isProduction() ? 'upgrade-insecure-requests' : '',
        ]);

        // Remove empty segments (e.g. upgrade-insecure-requests in local)
        $csp = implode('; ', array_filter(explode('; ', $csp)));

        $response->headers->set('Content-Security-Policy', $csp);

        // ── Referrer-Policy ────────────────────────────────────────────────────
        // Send full URL for same-origin, only origin for cross-origin HTTPS
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // ── Permissions-Policy ─────────────────────────────────────────────────
        // Disable access to sensitive browser APIs we don't use
        $response->headers->set(
            'Permissions-Policy',
            implode(', ', [
                'camera=()',
                'microphone=()',
                'geolocation=()',
                'payment=(self "https://app.midtrans.com" "https://app.sandbox.midtrans.com")',
                'usb=()',
                'magnetometer=()',
                'accelerometer=()',
                'gyroscope=()',
            ])
        );

        // ── X-Content-Type-Options ─────────────────────────────────────────────
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // ── X-Frame-Options ────────────────────────────────────────────────────
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        return $response;
    }
}
