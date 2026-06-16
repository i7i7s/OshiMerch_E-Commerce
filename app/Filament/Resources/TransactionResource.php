<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TransactionResource\Pages;
use App\Models\Transaction;
use Filament\Actions\Action;
use Filament\Actions\ViewAction;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

class TransactionResource extends Resource
{
    protected static ?string $model = Transaction::class;
    protected static ?string $navigationLabel = 'Transaksi';
    protected static ?string $pluralModelLabel = 'Transaksi';
    protected static ?int $navigationSort = 2;

    public static function getNavigationIcon(): string|\BackedEnum|\Illuminate\Contracts\Support\Htmlable|null
    {
        return 'heroicon-o-shopping-bag';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Forms\Components\Select::make('delivery_status')
                ->label('Status Pengiriman')
                ->options([
                    'Pending'        => 'Pending',
                    'Packed'         => 'Packed',
                    'Shipped'        => 'Shipped',
                    'OutForDelivery' => 'Out for Delivery',
                    'Delivered'      => 'Delivered',
                ])
                ->required(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('#')
                    ->sortable(),
                Tables\Columns\TextColumn::make('buyer.name')
                    ->label('Pembeli')
                    ->searchable(),
                Tables\Columns\TextColumn::make('seller.name')
                    ->label('Penjual')
                    ->searchable(),
                Tables\Columns\TextColumn::make('listing.title')
                    ->label('Barang')
                    ->limit(30),
                Tables\Columns\TextColumn::make('total_price')
                    ->label('Total')
                    ->getStateUsing(fn (Transaction $r) => 'Rp ' . number_format($r->item_price + $r->shipping_fee, 0, ',', '.')),
                Tables\Columns\BadgeColumn::make('payment_status')
                    ->label('Pembayaran')
                    ->colors([
                        'warning' => 'Pending',
                        'info'    => 'Paid',
                        'success' => 'Confirmed',
                        'danger'  => 'Rejected',
                    ]),
                Tables\Columns\BadgeColumn::make('delivery_status')
                    ->label('Pengiriman')
                    ->colors([
                        'gray'    => 'Pending',
                        'warning' => fn ($state) => in_array($state, ['Packed', 'Shipped', 'OutForDelivery']),
                        'success' => 'Delivered',
                    ]),
                Tables\Columns\TextColumn::make('oshigo_tracking_number')
                    ->label('OshiGo No.')
                    ->searchable()
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('midtrans_order_id')
                    ->label('Midtrans Order ID')
                    ->searchable()
                    ->copyable()
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('payment_method')
                    ->label('Metode Bayar')
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Tanggal')
                    ->dateTime('d M Y')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('payment_status')
                    ->label('Status Pembayaran')
                    ->options([
                        'Pending'   => 'Pending',
                        'Paid'      => 'Paid',
                        'Confirmed' => 'Confirmed',
                        'Rejected'  => 'Rejected',
                    ]),
                Tables\Filters\SelectFilter::make('delivery_status')
                    ->label('Status Pengiriman')
                    ->options([
                        'Pending'        => 'Pending',
                        'Packed'         => 'Packed',
                        'Shipped'        => 'Shipped',
                        'OutForDelivery' => 'Out for Delivery',
                        'Delivered'      => 'Delivered',
                    ]),
                Tables\Filters\Filter::make('created_at')
                    ->form([
                        Forms\Components\DatePicker::make('from')->label('Dari'),
                        Forms\Components\DatePicker::make('until')->label('Sampai'),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['from'], fn ($q, $v) => $q->whereDate('created_at', '>=', $v))
                            ->when($data['until'], fn ($q, $v) => $q->whereDate('created_at', '<=', $v));
                    }),
                Tables\Filters\Filter::make('oshigo_aktif')
                    ->label('OshiGo Aktif')
                    ->query(fn ($query) => $query->whereIn('delivery_status', ['Packed', 'Shipped', 'OutForDelivery'])),
            ])
            ->actions([
                Action::make('confirm_payment')
                    ->label('✅ Konfirmasi Bayar')
                    ->icon('heroicon-o-check-badge')
                    ->color('success')
                    ->requiresConfirmation()
                    ->modalHeading('Konfirmasi Pembayaran')
                    ->modalDescription('Bukti transfer dari pembeli sudah dicek dan valid?')
                    ->visible(fn (Transaction $r) => $r->payment_status === 'Paid')
                    ->action(function (Transaction $record): void {
                        $record->update(['payment_status' => 'Confirmed']);

                        \App\Models\Notification::create([
                            'user_id' => $record->buyer_id,
                            'type'    => 'payment_confirmed',
                            'title'   => '✅ Pembayaran Dikonfirmasi!',
                            'body'    => 'Admin OshiMerch telah mengkonfirmasi pembayaranmu. Barang akan segera diproses penjual.',
                            'url'     => "/transactions/{$record->uuid}",
                            'data'    => ['transaction_id' => $record->id],
                        ]);

                        // Notify seller too
                        \App\Models\Notification::create([
                            'user_id' => $record->seller_id,
                            'type'    => 'payment_confirmed',
                            'title'   => '✅ Pembayaran Terverifikasi!',
                            'body'    => 'Admin telah mengkonfirmasi pembayaran dari pembeli. Silakan proses pesanan.',
                            'url'     => "/transactions/{$record->uuid}",
                            'data'    => ['transaction_id' => $record->id],
                        ]);

                        try { broadcast(new \App\Events\TransactionStatusUpdated($record->fresh())); } catch (\Exception $e) { \Illuminate\Support\Facades\Log::warning('[Broadcast] Failed: ' . $e->getMessage()); }
                    }),
                Action::make('view_proof')
                    ->label('Lihat Bukti')
                    ->icon('heroicon-o-photo')
                    ->color('info')
                    ->visible(fn (Transaction $r) => (bool) $r->proof_of_transfer_path)
                    ->modalHeading('Bukti Transfer')
                    ->modalContent(fn (Transaction $r) => view('filament.modals.proof-image', [
                        'url' => asset('storage/' . $r->proof_of_transfer_path),
                    ]))
                    ->modalSubmitAction(false),
                Action::make('mark_shipped')
                    ->label('🚚 Tandai Dikirim (OshiGo)')
                    ->icon('heroicon-o-truck')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->modalHeading('Konfirmasi: Paket Dikirim')
                    ->modalDescription('OshiGo sudah mengambil paket dari seller dan sedang dalam perjalanan ke buyer?')
                    ->visible(fn (Transaction $r) => $r->delivery_status === 'Packed')
                    ->action(function (Transaction $record): void {
                        $record->update(['delivery_status' => 'Shipped']);
                        try { broadcast(new \App\Events\TransactionStatusUpdated($record->fresh())); } catch (\Exception $e) { \Illuminate\Support\Facades\Log::warning('[Broadcast] Failed: ' . $e->getMessage()); }
                        \App\Models\Notification::create([
                            'user_id' => $record->buyer_id,
                            'type'    => 'item_shipped',
                            'title'   => '🚚 Paketmu Sudah Dikirim OshiGo!',
                            'body'    => "Paket ({$record->oshigo_tracking_number}) sudah diambil OshiGo dan sedang dalam perjalanan.",
                            'url'     => "/transactions/{$record->uuid}",
                            'data'    => ['transaction_id' => $record->id],
                        ]);
                    }),
                Action::make('mark_out_for_delivery')
                    ->label('📍 Tandai Dalam Perjalanan')
                    ->icon('heroicon-o-map-pin')
                    ->color('info')
                    ->requiresConfirmation()
                    ->modalHeading('Konfirmasi: Dalam Perjalanan')
                    ->modalDescription('OshiGo sedang mengantar paket ke alamat pembeli?')
                    ->visible(fn (Transaction $r) => $r->delivery_status === 'Shipped')
                    ->action(function (Transaction $record): void {
                        $record->update(['delivery_status' => 'OutForDelivery']);
                        try { broadcast(new \App\Events\TransactionStatusUpdated($record->fresh())); } catch (\Exception $e) { \Illuminate\Support\Facades\Log::warning('[Broadcast] Failed: ' . $e->getMessage()); }
                        \App\Models\Notification::create([
                            'user_id' => $record->buyer_id,
                            'type'    => 'out_for_delivery',
                            'title'   => '📍 Paketmu Sedang Dalam Perjalanan!',
                            'body'    => "Paket OshiGo ({$record->oshigo_tracking_number}) sedang menuju alamatmu.",
                            'url'     => "/transactions/{$record->uuid}",
                            'data'    => ['transaction_id' => $record->id],
                        ]);
                    }),
                Action::make('override_delivery')
                    ->label('Override Status')
                    ->icon('heroicon-o-pencil-square')
                    ->color('warning')
                    ->form([
                        Forms\Components\Select::make('delivery_status')
                            ->label('Status Pengiriman')
                            ->options([
                                'Pending'        => 'Pending',
                                'Packed'         => 'Packed',
                                'Shipped'        => 'Shipped',
                                'OutForDelivery' => 'Out for Delivery',
                                'Delivered'      => 'Delivered',
                            ])
                            ->required(),
                    ])
                    ->action(function (Transaction $record, array $data): void {
                        $record->update(['delivery_status' => $data['delivery_status']]);
                        if ($data['delivery_status'] === 'Delivered') {
                            $record->listing->update(['status' => 'Sold']);
                        }
                    }),
                Action::make('edit_tracking')
                    ->label('Edit Resi')
                    ->icon('heroicon-o-truck')
                    ->color('info')
                    ->form([
                        Forms\Components\TextInput::make('oshigo_tracking_number')
                            ->label('Nomor Resi OshiGo')
                            ->placeholder('OGO-20260513-0001')
                            ->maxLength(50),
                    ])
                    ->fillForm(fn (Transaction $record): array => [
                        'oshigo_tracking_number' => $record->oshigo_tracking_number,
                    ])
                    ->action(function (Transaction $record, array $data): void {
                        $record->update(['oshigo_tracking_number' => $data['oshigo_tracking_number']]);
                    }),
                ViewAction::make(),
            ])
            ->bulkActions([]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListTransactions::route('/'),
            'view'  => Pages\ViewTransaction::route('/{record}'),
        ];
    }
}

