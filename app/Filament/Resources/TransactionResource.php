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
            ])
            ->actions([
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
