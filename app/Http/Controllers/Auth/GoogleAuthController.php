<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * Redirect the user to the Google OAuth page.
     */
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle the Google OAuth callback.
     */
    public function callback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            \Log::error('Google OAuth Error: ' . $e->getMessage());
            return redirect()->route('login')->with('error', 'Gagal login dengan Google. Silakan coba lagi.');
        }

        // Find or create the user
        $user = User::updateOrCreate(
            ['google_id' => $googleUser->getId()],
            [
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'profile_picture_url' => $googleUser->getAvatar(),
                'email_verified_at' => now(),
            ]
        );

        Auth::login($user, remember: true);

        // Redirect based on onboarding status
        if (!$user->hasCompletedOnboarding()) {
            return redirect()->route('onboarding');
        }

        return redirect()->intended(route('dashboard'));
    }
}
