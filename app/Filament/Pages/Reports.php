<?php

namespace App\Filament\Pages;

use App\Models\Listing;
use App\Models\Transaction;
use Filament\Pages\Page;

class Reports extends Page
{
    protected static ?string $navigationLabel = 'Laporan';
    protected static ?string $title = 'Laporan & Statistik';
    protected static ?int $navigationSort = 11;

    public static function getNavigationIcon(): string|\BackedEnum|\Illuminate\Contracts\Support\Htmlable|null
    {
        return 'heroicon-o-chart-bar';
    }

    protected string $view = 'filament.pages.reports';

    public array $listingsByCategory = [];
    public array $revenueByProvince = [];
    public array $transactionsByMonth = [];

    public function mount(): void
    {
        // Listings per category (excluding Hidden)
        $this->listingsByCategory = Listing::where('status', '!=', 'Hidden')
            ->selectRaw('category, COUNT(*) as total')
            ->groupBy('category')
            ->orderByDesc('total')
            ->get()
            ->toArray();

        // Revenue per province from delivered transactions
        $this->revenueByProvince = Transaction::where('delivery_status', 'Delivered')
            ->whereNotNull('shipping_province')
            ->selectRaw('shipping_province, SUM(item_price + shipping_fee) as total_revenue, COUNT(*) as total_orders')
            ->groupBy('shipping_province')
            ->orderByDesc('total_revenue')
            ->get()
            ->toArray();

        // Transactions per month (current year)
        $months = [];
        for ($m = 1; $m <= 12; $m++) {
            $count = Transaction::whereYear('created_at', now()->year)
                ->whereMonth('created_at', $m)
                ->count();
            $months[] = [
                'month' => date('F', mktime(0, 0, 0, $m, 1)),
                'count' => $count,
            ];
        }
        $this->transactionsByMonth = $months;
    }
}
