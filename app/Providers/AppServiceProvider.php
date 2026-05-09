<?php

namespace App\Providers;

use App\Models\Listing;
use App\Models\Notification;
use App\Models\Transaction;
use App\Policies\ListingPolicy;
use App\Policies\NotificationPolicy;
use App\Policies\TransactionPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Gate::policy(Listing::class, ListingPolicy::class);
        Gate::policy(Transaction::class, TransactionPolicy::class);
        Gate::policy(Notification::class, NotificationPolicy::class);
    }
}
