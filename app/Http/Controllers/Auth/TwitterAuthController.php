<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class TwitterAuthController extends Controller
{
    /**
     * Redirect the user to the X (Twitter) OAuth page.
     */
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('twitter-oauth-2')->redirect();
    }

    /**
     * Handle the X (Twitter) OAuth callback.
     */
    public function callback(): RedirectResponse
    {
        try {
            $twitterUser = Socialite::driver('twitter-oauth-2')->user();
        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Gagal login dengan X. Silakan coba lagi.');
        }

        $user = User::updateOrCreate(
            ['twitter_id' => $twitterUser->getId()],
            [
                'name'                  => $twitterUser->getName(),
                'email'                 => $twitterUser->getEmail() ?? $twitterUser->getId() . '@x.placeholder',
                'profile_picture_url'   => $twitterUser->getAvatar(),
                'email_verified_at'     => now(),
            ]
        );

        Auth::login($user, remember: true);

        if (!$user->hasCompletedOnboarding()) {
            return redirect()->route('onboarding');
        }

        return redirect()->intended(route('dashboard'));
    }
}
