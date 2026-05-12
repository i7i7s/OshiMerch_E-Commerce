<?php

namespace App\Filament\Widgets;

use App\Models\Transaction;
use Filament\Widgets\ChartWidget;

class OrdersChart extends ChartWidget
{
    protected ?string $heading = 'Transaksi per Bulan';
    protected static ?int $sort = 2;

    protected function getData(): array
    {
        $months = [];
        $counts = [];

        for ($m = 1; $m <= 12; $m++) {
            $months[] = date('M', mktime(0, 0, 0, $m, 1));
            $counts[] = Transaction::whereYear('created_at', now()->year)
                ->whereMonth('created_at', $m)
                ->count();
        }

        return [
            'datasets' => [
                [
                    'label' => 'Transaksi ' . now()->year,
                    'data' => $counts,
                    'backgroundColor' => 'rgba(244, 63, 94, 0.15)',
                    'borderColor' => 'rgb(244, 63, 94)',
                    'borderWidth' => 2,
                    'fill' => true,
                ],
            ],
            'labels' => $months,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
