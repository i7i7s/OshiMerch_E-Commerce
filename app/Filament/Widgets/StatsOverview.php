<?php

namespace App\Filament\Widgets;

use App\Models\Listing;
use App\Models\Transaction;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;
    protected static bool $isLazy = true;

    protected function getStats(): array
    {
        $totalRevenue = Transaction::where('delivery_status', 'Delivered')
            ->sum(DB::raw('item_price + shipping_fee'));

        $activeOrders = Transaction::whereIn('payment_status', ['Paid', 'Confirmed'])
            ->whereNotIn('delivery_status', ['Delivered'])
            ->count();

        return [
            Stat::make('Total Users', User::count())
                ->description('Registered accounts')
                ->icon('heroicon-o-users')
                ->color('info'),

            Stat::make('Total Listings', Listing::where('status', '!=', 'Hidden')->count())
                ->description('Active marketplace listings')
                ->icon('heroicon-o-tag')
                ->color('success'),

            Stat::make('Active Orders', $activeOrders)
                ->description('Orders in progress')
                ->icon('heroicon-o-shopping-bag')
                ->color('warning'),

            Stat::make('Total Revenue', 'Rp ' . number_format($totalRevenue, 0, ',', '.'))
                ->description('From completed transactions')
                ->icon('heroicon-o-banknotes')
                ->color('success'),
        ];
    }
}
