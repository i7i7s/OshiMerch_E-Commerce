<?php

use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Auth\TwitterAuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;
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
    $listings = \App\Models\Listing::available()
        ->with('user:id,name,oshi_member_name')
        ->latest()
        ->take(8)
        ->get()
        ->map(fn ($l) => [
            'id'        => $l->id,
            'title'     => $l->title,
            'price'     => $l->price,
            'condition' => $l->condition,
            'category'  => $l->category,
            'image_url' => $l->image_url,
            'featured_member_name' => $l->featured_member_name,
            'featured_member_team' => $l->featured_member_team,
            'seller_name' => $l->user?->name,
        ]);

    return Inertia::render('Welcome', [
        'canLogin'    => Route::has('login'),
        'canRegister' => Route::has('register'),
        'appName'     => config('app.name'),
        'auth'        => ['user' => Auth::user()],
        'listings'    => $listings,
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

// X (Twitter) OAuth Routes
Route::prefix('auth/twitter')->group(function () {
    Route::get('/redirect', [TwitterAuthController::class, 'redirect'])->name('twitter.redirect');
    Route::get('/callback', [TwitterAuthController::class, 'callback'])->name('twitter.callback');
});

// Authenticated Routes
Route::middleware('auth')->group(function () {
    // Onboarding (before middleware check)
    Route::get('/onboarding', [OnboardingController::class, 'show'])->name('onboarding');
    Route::post('/onboarding', [OnboardingController::class, 'store'])->name('onboarding.store');

    // Routes requiring completed onboarding
    Route::middleware(EnsureOnboardingCompleted::class)->group(function () {
        Route::get('/dashboard', function () {
            $user = Auth::user();

            $listings = $user->listings()
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

            $mapTransaction = fn ($t) => [
                'id'               => $t->id,
                'item_price'       => $t->item_price,
                'payment_method'   => $t->payment_method,
                'payment_status'   => $t->payment_status,
                'delivery_status'  => $t->delivery_status,
                'created_at'       => $t->created_at->diffForHumans(),
                'listing' => [
                    'id'        => $t->listing->id,
                    'title'     => $t->listing->title,
                    'image_url' => $t->listing->image_url,
                ],
                'partner_name' => $t->buyer_id === $user->id ? $t->seller->name : $t->buyer->name,
                'partner_avatar' => $t->buyer_id === $user->id
                    ? ($t->seller->profile_picture_url)
                    : ($t->buyer->profile_picture_url),
            ];

            $purchases = $user->purchasedTransactions()
                ->with(['listing', 'seller:id,name,profile_picture_url'])
                ->latest()
                ->get()
                ->map($mapTransaction);

            $sales = $user->soldTransactions()
                ->with(['listing', 'buyer:id,name,profile_picture_url'])
                ->latest()
                ->get()
                ->map($mapTransaction);

            return Inertia::render('Dashboard', [
                'listings'  => $listings,
                'purchases' => $purchases,
                'sales'     => $sales,
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

        // Transactions
        Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');
        Route::get('/transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
        Route::post('/transactions/{transaction}/proof', [TransactionController::class, 'uploadProof'])->name('transactions.uploadProof');
        Route::patch('/transactions/{transaction}/ship', [TransactionController::class, 'ship'])->name('transactions.ship');
        Route::patch('/transactions/{transaction}/complete', [TransactionController::class, 'complete'])->name('transactions.complete');

        // Messages (per transaction)
        Route::post('/transactions/{transaction}/messages', [MessageController::class, 'store'])->name('messages.store');

        // Chat overview
        Route::get('/chat', [ChatController::class, 'index'])->name('chat.index');
    });
});

require __DIR__.'/auth.php';
