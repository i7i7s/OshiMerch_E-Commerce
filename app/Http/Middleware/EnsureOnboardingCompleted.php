<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureOnboardingCompleted
{
    /**
     * Handle an incoming request.
     * Redirect users who haven't completed onboarding.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && !$request->user()->hasCompletedOnboarding()) {
            // Allow access to onboarding, logout, and profile routes
            $allowedRoutes = ['onboarding', 'onboarding.store', 'logout', 'profile.edit'];

            if (!in_array($request->route()->getName(), $allowedRoutes)) {
                return redirect()->route('onboarding');
            }
        }

        return $next($request);
    }
}
