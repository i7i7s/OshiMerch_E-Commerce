<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OnboardingController extends Controller
{
    /**
     * Show the onboarding page where users select their Oshi.
     */
    public function show(Request $request): Response|RedirectResponse
    {
        // If already onboarded, redirect to dashboard
        if ($request->user()->hasCompletedOnboarding()) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Onboarding', [
            'apiUrl' => config('services.jkt48.api_url', 'https://jkt-48-member-api-i7i7.vercel.app'),
        ]);
    }

    /**
     * Store the user's oshi selection and bio.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'oshi_member_code' => 'required|string|max:100',
            'oshi_member_name' => 'required|string|max:255',
            'bio' => 'nullable|string|max:500',
        ]);

        $request->user()->update([
            'oshi_member_code' => $validated['oshi_member_code'],
            'oshi_member_name' => $validated['oshi_member_name'],
            'bio' => $validated['bio'] ?? null,
            'onboarding_completed' => true,
        ]);

        return redirect()->route('dashboard')->with('success', 'Welcome to OshiMerch! 🎉');
    }
}
