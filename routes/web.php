<?php

use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\ProfileController;
use App\Http\Middleware\EnsureOnboardingCompleted;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes — OshiMerch
|--------------------------------------------------------------------------
*/

// Public: Landing Page
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'appName' => config('app.name'),
        'auth' => ['user' => Auth::user()],
    ]);
})->name('home');

// Public: Members page
Route::get('/members', function () {
    return Inertia::render('Members', [
        'auth' => ['user' => Auth::user()],
    ]);
})->name('members');

// Public: Products page (listing index — full marketplace)
Route::get('/products', [ListingController::class, 'index'])->name('products.index');

// Public: Single product detail
Route::get('/products/{listing}', [ListingController::class, 'show'])->name('products.show');

// Google OAuth Routes
Route::prefix('auth/google')->group(function () {
    Route::get('/redirect', [GoogleAuthController::class, 'redirect'])->name('google.redirect');
    Route::get('/callback', [GoogleAuthController::class, 'callback'])->name('google.callback');
});

// Authenticated Routes
Route::middleware('auth')->group(function () {
    // Onboarding (before middleware check)
    Route::get('/onboarding', [OnboardingController::class, 'show'])->name('onboarding');
    Route::post('/onboarding', [OnboardingController::class, 'store'])->name('onboarding.store');

    // Routes requiring completed onboarding
    Route::middleware(EnsureOnboardingCompleted::class)->group(function () {
        Route::get('/dashboard', function () {
            $listings = Auth::user()->listings()
                ->latest()
                ->get()
                ->map(fn ($l) => [
                    'id'        => $l->id,
                    'title'     => $l->title,
                    'price'     => $l->price,
                    'condition' => $l->condition,
                    'status'    => $l->status,
                    'image_url' => $l->image_url,
                    'created_at' => $l->created_at->diffForHumans(),
                    'featured_member_name' => $l->featured_member_name,
                    'featured_member_team' => $l->featured_member_team,
                ]);

            return Inertia::render('Dashboard', [
                'listings' => $listings,
            ]);
        })->name('dashboard');

        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        // Listing CRUD (authenticated + onboarded sellers)
        Route::get('/listings/create', [ListingController::class, 'create'])->name('listings.create');
        Route::post('/listings', [ListingController::class, 'store'])->name('listings.store');
        Route::get('/listings/{listing}/edit', [ListingController::class, 'edit'])->name('listings.edit');
        Route::patch('/listings/{listing}', [ListingController::class, 'update'])->name('listings.update');
        Route::delete('/listings/{listing}', [ListingController::class, 'destroy'])->name('listings.destroy');
    });
});

require __DIR__.'/auth.php';
