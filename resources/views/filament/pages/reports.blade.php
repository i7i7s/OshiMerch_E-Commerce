<x-filament-panels::page>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">

        {{-- Listings per Category --}}
        <x-filament::section>
            <x-slot name="heading">Listing per Kategori</x-slot>
            <div class="space-y-3">
                @forelse ($listingsByCategory as $row)
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {{ $row['category'] }}
                        </span>
                        <span class="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-sm font-semibold text-primary-800">
                            {{ $row['total'] }}
                        </span>
                    </div>
                @empty
                    <p class="text-sm text-gray-500">Belum ada data.</p>
                @endforelse
            </div>
        </x-filament::section>

        {{-- Transactions per Month --}}
        <x-filament::section>
            <x-slot name="heading">Transaksi per Bulan ({{ now()->year }})</x-slot>
            <div class="space-y-3">
                @foreach ($transactionsByMonth as $row)
                    @if ($row['count'] > 0)
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {{ $row['month'] }}
                            </span>
                            <span class="inline-flex items-center rounded-full bg-info-100 px-2.5 py-0.5 text-sm font-semibold text-info-800">
                                {{ $row['count'] }}
                            </span>
                        </div>
                    @endif
                @endforeach
                @if (collect($transactionsByMonth)->sum('count') === 0)
                    <p class="text-sm text-gray-500">Belum ada transaksi tahun ini.</p>
                @endif
            </div>
        </x-filament::section>

        {{-- Revenue per Province --}}
        <x-filament::section class="md:col-span-2">
            <x-slot name="heading">Revenue per Provinsi</x-slot>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                    <thead>
                        <tr>
                            <th class="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-400">Provinsi</th>
                            <th class="px-4 py-2 text-right font-semibold text-gray-600 dark:text-gray-400">Orders</th>
                            <th class="px-4 py-2 text-right font-semibold text-gray-600 dark:text-gray-400">Total Revenue</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                        @forelse ($revenueByProvince as $row)
                            <tr>
                                <td class="px-4 py-2 text-gray-700 dark:text-gray-300">{{ $row['shipping_province'] }}</td>
                                <td class="px-4 py-2 text-right text-gray-700 dark:text-gray-300">{{ $row['total_orders'] }}</td>
                                <td class="px-4 py-2 text-right font-semibold text-gray-900 dark:text-white">
                                    Rp {{ number_format($row['total_revenue'], 0, ',', '.') }}
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="3" class="px-4 py-4 text-center text-gray-500">Belum ada data transaksi selesai.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </x-filament::section>

    </div>
</x-filament-panels::page>
