<?php

use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Auth\TwitterAuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\MidtransController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SellerProfileController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\FavoriteController;
use App\Http\Middleware\EnsureOnboardingCompleted;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ─── Midtrans Webhook (CSRF exempt — external request from Midtrans) ─────────
Route::post('/midtrans/webhook', [MidtransController::class, 'webhook'])
    ->name('midtrans.webhook');
// Alias — both /midtrans/callback and /midtrans/webhook are accepted
Route::post('/midtrans/callback', [MidtransController::class, 'webhook'])
    ->name('midtrans.callback');

// ─── Midtrans finish redirect (after Snap payment) ──────────────────────────
Route::get('/transactions/{uuid}/midtrans-finish', [MidtransController::class, 'finishRedirect'])
    ->middleware('auth')
    ->name('transactions.midtrans-finish');

/*
|--------------------------------------------------------------------------
| Web Routes — OshiMerch
|--------------------------------------------------------------------------
*/

// Public: Landing Page
Route::get('/', function () {
    $listings = \App\Models\Listing::available()
        ->with('user:id,name,profile_picture_url,oshi_member_name')
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
            'created_at' => $l->created_at->diffForHumans(),
            'seller'    => $l->user ? [
                'id'     => $l->user->id,
                'name'   => $l->user->name,
                'avatar' => $l->user->profile_picture_url,
            ] : null,
        ]);

    // Real stats from DB
    $stats = [
        ['label' => 'Produk Aktif',      'value' => \App\Models\Listing::where('status', 'Available')->count(),                           'suffix' => ''],
        ['label' => 'Member Terdaftar',  'value' => \App\Models\User::count(),                                                             'suffix' => ''],
        ['label' => 'Transaksi Sukses',  'value' => \App\Models\Transaction::where('delivery_status', 'Delivered')->count(),               'suffix' => ''],
        ['label' => 'Kategori Produk',   'value' => \App\Models\Listing::where('status', 'Available')->distinct()->count('category'),      'suffix' => ''],
    ];

    // Category counts from available listings
    $categoryCounts = \App\Models\Listing::where('status', 'Available')
        ->selectRaw('category, count(*) as total')
        ->groupBy('category')
        ->pluck('total', 'category');

    // Trending members — top 6 by listing count (with at least 1 available listing)
    $trendingMembers = \App\Models\Listing::where('status', 'Available')
        ->whereNotNull('featured_member_code')
        ->where('featured_member_code', '!=', '')
        ->whereNotNull('featured_member_name')
        ->where('featured_member_name', '!=', '')
        ->selectRaw('MAX(featured_member_name) as name, MAX(featured_member_team) as team, featured_member_code as code, count(*) as listing_count')
        ->groupBy('featured_member_code')
        ->orderByDesc('listing_count')
        ->take(6)
        ->get()
        ->toArray();

    return Inertia::render('Welcome', [
        'canLogin'        => Route::has('login'),
        'canRegister'     => Route::has('register'),
        'appName'         => config('app.name'),
        'auth'            => ['user' => Auth::user()],
        'listings'        => $listings,
        'stats'           => $stats,
        'categoryCounts'  => $categoryCounts,
        'trendingMembers' => $trendingMembers,
    ]);
})->name('home');

Route::get('/help', function () {
    return Inertia::render('Help');
})->name('help');

// Public: Members page
Route::get('/members', function () {
    return Inertia::render('Members', [
        'auth' => ['user' => Auth::user()],
    ]);
})->name('members');

// Public: Member detail page
Route::get('/members/{code}', [MemberController::class, 'show'])->name('members.show');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

// Public: Products page (listing index — full marketplace)
Route::get('/produk', [ListingController::class, 'index'])->name('products.index');

// Public: Single product detail
Route::get('/produk/{listing}', [ListingController::class, 'show'])->name('products.show');

// Public: Seller profile
Route::get('/seller/{user}', [SellerProfileController::class, 'show'])->name('seller.profile');

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
Route::middleware(['auth', 'not.banned'])->group(function () {
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
                'uuid'             => $t->uuid,
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
        // uploadProof route removed — payment now handled by Midtrans webhook
        Route::post('/transactions/{transaction}/refresh-snap-token', [TransactionController::class, 'refreshSnapToken'])->name('transactions.refreshSnapToken');
        Route::patch('/transactions/{transaction}/confirm-payment', [TransactionController::class, 'confirmPayment'])->name('transactions.confirmPayment');
        Route::patch('/transactions/{transaction}/pack', [TransactionController::class, 'pack'])->name('transactions.pack');
        Route::patch('/transactions/{transaction}/ship', [TransactionController::class, 'ship'])->name('transactions.ship');
        Route::patch('/transactions/{transaction}/out-for-delivery', [TransactionController::class, 'outForDelivery'])->name('transactions.outForDelivery');
        Route::patch('/transactions/{transaction}/complete', [TransactionController::class, 'complete'])->name('transactions.complete');

        // Messages (per transaction)
        Route::post('/transactions/{transaction}/messages', [MessageController::class, 'store'])->name('messages.store');

        // Reviews
        Route::post('/transactions/{transaction}/reviews', [ReviewController::class, 'store'])->name('reviews.store');
        Route::get('/reviews/{user}', [ReviewController::class, 'index'])->name('reviews.index');

        // Chat overview
        Route::get('/chat', [ChatController::class, 'index'])->name('chat.index');

        // Cart — DB-backed (per user, persists across devices)
        Route::get('/cart',               [CartController::class, 'index'])->name('cart');
        Route::post('/cart/add',          [CartController::class, 'add'])->name('cart.add');
        Route::delete('/cart/clear',      [CartController::class, 'clear'])->name('cart.clear');
        Route::delete('/cart/{cartItem}', [CartController::class, 'remove'])->name('cart.remove');

        // Checkout page
        Route::get('/checkout/{listing}', [CheckoutController::class, 'show'])->name('checkout.show');

        // Favorites — DB-backed
        Route::get('/favorites', [FavoriteController::class, 'index'])->name('favorites');
        Route::prefix('api/favorites')->name('favorites.')->group(function () {
            Route::post('/toggle',       [FavoriteController::class, 'toggle'])->name('toggle');
            Route::get('/status/{listing}', [FavoriteController::class, 'status'])->name('status');
        });

        // Direct chat with a specific user (seller)
        Route::get('/chat/with/{user}', [ConversationController::class, 'show'])->name('chat.direct');
        Route::post('/chat/conversations/{conversation}/messages', [ConversationController::class, 'sendMessage'])->name('chat.sendDirect');
        Route::get('/chat/conversations/{conversation}/messages', [ConversationController::class, 'getMessages'])->name('chat.getMessages');

        // ─── Notifications API (Phase 4.7 — polling, Reverb-ready) ────────────────
        Route::prefix('api/notifications')->name('notifications.')->group(function () {
            Route::get('/',           [NotificationController::class, 'index'])->name('index');
            Route::post('/read-all',  [NotificationController::class, 'markAllRead'])->name('read-all');
            Route::post('/{notification}/read', [NotificationController::class, 'markRead'])->name('read');
            Route::delete('/{notification}',    [NotificationController::class, 'destroy'])->name('destroy');
        });
    });
});

require __DIR__.'/auth.php';
